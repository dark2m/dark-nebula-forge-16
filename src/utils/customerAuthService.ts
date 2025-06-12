
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
    
    // إضافة العميل الافتراضي dark@gmail.com
    const defaultCustomers: CustomerUser[] = [
      { 
        id: 1, 
        email: 'dark@gmail.com', 
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
    
    const customers = this.getCustomers();
    console.log('CustomerAuthService: Available customers:', customers);
    
    const customer = customers.find(c => c.email === email && c.password === password);
    console.log('CustomerAuthService: Found customer:', customer);
    
    if (customer) {
      localStorage.setItem('customerToken', JSON.stringify({ userId: customer.id, timestamp: Date.now() }));
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
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
    const isAuth = !!token && !!currentCustomer;
    console.log('CustomerAuthService: Is authenticated:', isAuth);
    return isAuth;
  }

  static logout(): void {
    localStorage.removeItem('customerToken');
    localStorage.removeItem(this.CURRENT_CUSTOMER_KEY);
    console.log('CustomerAuthService: Logged out successfully');
  }
}

export default CustomerAuthService;
