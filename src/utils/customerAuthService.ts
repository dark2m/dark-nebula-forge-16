
import { CustomerUser, LoginAttempt } from '../types/customer';

// Re-export types for easier importing
export type { CustomerUser, LoginAttempt };

class CustomerAuthService {
  private static STORAGE_KEY = 'customer_users';
  private static LOGIN_ATTEMPTS_KEY = 'customer_login_attempts';
  private static CURRENT_CUSTOMER_KEY = 'current_customer';

  static getCustomers(): CustomerUser[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerAuthService: Error getting customers:', error);
      return [];
    }
  }

  static saveCustomers(customers: CustomerUser[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('CustomerAuthService: Error saving customers:', error);
    }
  }

  static getCustomerById(id: number): CustomerUser | undefined {
    const customers = this.getCustomers();
    return customers.find(customer => customer.id === id);
  }

  static registerCustomer(email: string, password: string): boolean {
    const customers = this.getCustomers();
    
    if (customers.find(c => c.email === email)) {
      console.log('CustomerAuthService: Registration failed - email already exists');
      return false;
    }
    
    const newCustomer: CustomerUser = {
      id: Date.now(),
      email,
      password,
      registrationDate: new Date().toLocaleDateString('ar-SA'),
      createdAt: new Date().toLocaleDateString('ar-SA'),
      isVerified: false
    };
    
    customers.push(newCustomer);
    this.saveCustomers(customers);
    console.log('CustomerAuthService: Registration successful');
    return true;
  }

  static updateCustomer(id: number, updates: Partial<CustomerUser>): void {
    const customers = this.getCustomers();
    const index = customers.findIndex(customer => customer.id === id);
    
    if (index !== -1) {
      customers[index] = { ...customers[index], ...updates };
      this.saveCustomers(customers);
      console.log('CustomerAuthService: Customer updated successfully');
    } else {
      console.log('CustomerAuthService: Customer not found for update');
    }
  }

  static getLoginAttempts(): LoginAttempt[] {
    try {
      const stored = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerAuthService: Error getting login attempts:', error);
      return [];
    }
  }

  static saveLoginAttempts(attempts: LoginAttempt[]): void {
    try {
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('CustomerAuthService: Error saving login attempts:', error);
    }
  }

  static addLoginAttempt(email: string, password: string, success: boolean): void {
    const attempts = this.getLoginAttempts();
    const newAttempt: LoginAttempt = {
      id: Date.now(),
      email,
      password,
      timestamp: new Date().toLocaleString('ar-SA'),
      success,
      ipAddress: '127.0.0.1' // Placeholder IP address
    };
    attempts.push(newAttempt);
    this.saveLoginAttempts(attempts);
    console.log('CustomerAuthService: Login attempt recorded');
  }

  static clearLoginAttempts(): void {
    try {
      localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
      console.log('CustomerAuthService: Login attempts cleared');
    } catch (error) {
      console.error('CustomerAuthService: Error clearing login attempts:', error);
    }
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
    const currentUser = this.getCurrentCustomer();
    const isAuth = !!token && !!currentUser;
    console.log('CustomerAuthService: Is authenticated:', isAuth);
    return isAuth;
  }

  static logout(): void {
    const customer = this.getCurrentCustomer();
    if (customer) {
      localStorage.removeItem(`online_${customer.id}`);
    }
    localStorage.removeItem('customerToken');
    localStorage.removeItem(this.CURRENT_CUSTOMER_KEY);
    console.log('CustomerAuthService: Logged out successfully');
  }

  static isDefaultCustomer(customerId: number): boolean {
    const customer = this.getCustomers().find(c => c.id === customerId);
    return customer ? customer.email === 'dark@gmail.com' : false;
  }

  static initializeDefaultCustomer(): void {
    const customers = this.getCustomers();
    const defaultExists = customers.some(c => c.email === 'dark@gmail.com');
    
    if (!defaultExists) {
      const defaultCustomer: Omit<CustomerUser, 'id'> = {
        email: 'dark@gmail.com',
        password: 'dark',
        registrationDate: new Date().toLocaleDateString('ar-SA'),
        createdAt: new Date().toLocaleDateString('ar-SA'),
        isVerified: true
      };
      
      this.registerCustomer(defaultCustomer.email, defaultCustomer.password);
      console.log('CustomerAuthService: Default customer created');
    }
  }

  static authenticateCustomer(email: string, password: string): boolean {
    console.log('CustomerAuthService: Attempting login for:', email);
    
    // تأكد من وجود العميل الافتراضي
    this.initializeDefaultCustomer();
    
    const customers = this.getCustomers();
    console.log('CustomerAuthService: Available customers:', customers.map(c => c.email));
    
    const customer = customers.find(c => c.email === email && c.password === password);
    console.log('CustomerAuthService: Found customer:', customer ? 'Yes' : 'No');
    
    // تسجيل محاولة الدخول
    this.addLoginAttempt(email, password, !!customer);
    
    if (customer) {
      localStorage.setItem('customerToken', JSON.stringify({ 
        customerId: customer.id, 
        timestamp: Date.now() 
      }));
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
      localStorage.setItem(`online_${customer.id}`, 'true');
      localStorage.setItem(`lastSeen_${customer.id}`, new Date().toLocaleString('ar-SA'));
      console.log('CustomerAuthService: Login successful');
      return true;
    }
    
    console.log('CustomerAuthService: Login failed - invalid credentials');
    return false;
  }
}

// تأكد من تشغيل التهيئة عند تحميل الملف
CustomerAuthService.initializeDefaultCustomer();

export default CustomerAuthService;
