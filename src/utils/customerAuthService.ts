
interface CustomerUser {
  id: number;
  email: string;
  password: string;
  createdAt: string;
  isVerified: boolean;
}

class CustomerAuthService {
  private static CUSTOMERS_KEY = 'customer_users';
  private static CURRENT_CUSTOMER_KEY = 'current_customer';

  static getCustomers(): CustomerUser[] {
    try {
      const stored = localStorage.getItem(this.CUSTOMERS_KEY);
      if (stored) {
        const customers = JSON.parse(stored);
        console.log('CustomerAuthService: Loaded customers:', customers);
        return customers;
      }
    } catch (error) {
      console.error('CustomerAuthService: Error loading customers:', error);
    }
    
    // إضافة العملاء الافتراضيين المؤقتين للتطوير
    const defaultCustomers: CustomerUser[] = [
      { 
        id: 1, 
        email: 'dark@gmail.com', 
        password: 'dark', 
        createdAt: new Date().toISOString(),
        isVerified: true
      },
      { 
        id: 2, 
        email: 'dark@gamil.com', 
        password: 'dark', 
        createdAt: new Date().toISOString(),
        isVerified: true
      }
    ];
    
    this.saveCustomers(defaultCustomers);
    return defaultCustomers;
  }

  static saveCustomers(customers: CustomerUser[]): void {
    try {
      console.log('CustomerAuthService: Saving customers:', customers);
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
      console.log('CustomerAuthService: Customers saved successfully');
    } catch (error) {
      console.error('CustomerAuthService: Error saving customers:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static authenticateCustomer(email: string, password: string): boolean {
    console.log('CustomerAuthService: Attempting login for:', email);
    
    // التحقق من حالة الحظر
    const customers = this.getCustomers();
    const customer = customers.find(c => c.email === email);
    
    if (customer && localStorage.getItem(`blocked_${customer.id}`) === 'true') {
      console.log('CustomerAuthService: Customer is blocked');
      return false;
    }
    
    console.log('CustomerAuthService: Available customers:', customers);
    
    const authenticatedCustomer = customers.find(c => c.email === email && c.password === password);
    console.log('CustomerAuthService: Found customer:', authenticatedCustomer);
    
    if (authenticatedCustomer) {
      localStorage.setItem('customerToken', JSON.stringify({ userId: authenticatedCustomer.id, timestamp: Date.now() }));
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(authenticatedCustomer));
      
      // تحديث حالة الاتصال
      localStorage.setItem(`online_${authenticatedCustomer.id}`, 'true');
      localStorage.setItem(`lastSeen_${authenticatedCustomer.id}`, new Date().toLocaleString('ar-SA'));
      
      console.log('CustomerAuthService: Login successful');
      return true;
    }
    
    console.log('CustomerAuthService: Login failed - invalid credentials');
    return false;
  }

  static registerCustomer(email: string, password: string): boolean {
    console.log('CustomerAuthService: Attempting registration for:', email);
    
    const customers = this.getCustomers();
    
    // التحقق من وجود الإيميل مسبقاً
    const existingCustomer = customers.find(c => c.email === email);
    if (existingCustomer) {
      console.log('CustomerAuthService: Email already exists');
      return false;
    }
    
    const newCustomer: CustomerUser = {
      id: Date.now(),
      email,
      password,
      createdAt: new Date().toISOString(),
      isVerified: true // يمكن تغييرها لاحقاً لإضافة تأكيد الإيميل
    };
    
    customers.push(newCustomer);
    this.saveCustomers(customers);
    
    // تسجيل دخول تلقائي بعد التسجيل
    localStorage.setItem('customerToken', JSON.stringify({ userId: newCustomer.id, timestamp: Date.now() }));
    localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(newCustomer));
    
    // تحديث حالة الاتصال
    localStorage.setItem(`online_${newCustomer.id}`, 'true');
    localStorage.setItem(`lastSeen_${newCustomer.id}`, new Date().toLocaleString('ar-SA'));
    
    console.log('CustomerAuthService: Registration successful');
    return true;
  }

  static getCurrentCustomer(): CustomerUser | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_CUSTOMER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('CustomerAuthService: Error getting current customer:', error);
      return null;
    }
  }

  static isCustomerAuthenticated(): boolean {
    const token = localStorage.getItem('customerToken');
    const currentCustomer = this.getCurrentCustomer();
    
    // التحقق من حالة الحظر
    if (currentCustomer && localStorage.getItem(`blocked_${currentCustomer.id}`) === 'true') {
      this.logout();
      return false;
    }
    
    const isAuth = !!token && !!currentCustomer;
    console.log('CustomerAuthService: Is authenticated:', isAuth);
    return isAuth;
  }

  static logout(): void {
    const currentCustomer = this.getCurrentCustomer();
    if (currentCustomer) {
      localStorage.setItem(`online_${currentCustomer.id}`, 'false');
      localStorage.setItem(`lastSeen_${currentCustomer.id}`, new Date().toLocaleString('ar-SA'));
    }
    
    localStorage.removeItem('customerToken');
    localStorage.removeItem(this.CURRENT_CUSTOMER_KEY);
    console.log('CustomerAuthService: Logged out successfully');
  }

  // إضافة دالة جديدة للتحقق من العميل المتصل حالياً وتسجيل خروجه إذا تم حذفه
  static checkAndLogoutDeletedCustomer(deletedCustomerId: number): void {
    const currentCustomer = this.getCurrentCustomer();
    if (currentCustomer && currentCustomer.id === deletedCustomerId) {
      console.log('CustomerAuthService: Current customer was deleted, logging out...');
      this.logout();
      // إعادة تحميل الصفحة للعودة إلى شاشة تسجيل الدخول
      window.location.reload();
    }
  }
}

export default CustomerAuthService;
