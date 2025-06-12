
import CustomerChatService from './customerChatService';

interface Customer {
  id: number;
  email: string;
  password: string;
  registrationDate: string;
}

interface LoginAttempt {
  id: string;
  email: string;
  timestamp: string;
  success: boolean;
  ipAddress?: string;
}

interface CustomerUser extends Customer {
  createdAt: string;
  isVerified: boolean;
  isBlocked: boolean;
  isOnline: boolean;
  lastSeen: string;
}

class CustomerAuthService {
  private static CUSTOMERS_KEY = 'customers';
  private static CURRENT_CUSTOMER_KEY = 'current_customer';
  private static LOGIN_ATTEMPTS_KEY = 'login_attempts';

  static getCustomers(): Customer[] {
    try {
      const stored = localStorage.getItem(this.CUSTOMERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerAuthService: Error loading customers:', error);
      return [];
    }
  }

  static getCustomersWithStatus(): CustomerUser[] {
    try {
      const customers = this.getCustomers();
      return customers.map(customer => ({
        ...customer,
        createdAt: customer.registrationDate,
        isVerified: true,
        isBlocked: false,
        isOnline: false,
        lastSeen: customer.registrationDate
      }));
    } catch (error) {
      console.error('CustomerAuthService: Error loading customers with status:', error);
      return [];
    }
  }

  static saveCustomers(customers: Customer[]): void {
    try {
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('CustomerAuthService: Error saving customers:', error);
    }
  }

  static getLoginAttempts(): LoginAttempt[] {
    try {
      const stored = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerAuthService: Error loading login attempts:', error);
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

  static addLoginAttempt(email: string, success: boolean): void {
    try {
      const attempts = this.getLoginAttempts();
      const newAttempt: LoginAttempt = {
        id: Date.now().toString(),
        email,
        timestamp: new Date().toISOString(),
        success,
        ipAddress: 'Unknown'
      };
      attempts.push(newAttempt);
      this.saveLoginAttempts(attempts);
    } catch (error) {
      console.error('CustomerAuthService: Error adding login attempt:', error);
    }
  }

  static clearLoginAttempts(): void {
    try {
      localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
      console.log('CustomerAuthService: Login attempts cleared');
    } catch (error) {
      console.error('CustomerAuthService: Error clearing login attempts:', error);
    }
  }

  static isDefaultCustomer(customerId: number): boolean {
    // يمكن تخصيص هذه الوظيفة حسب الحاجة
    return customerId === 1;
  }

  static checkAndLogoutDeletedCustomer(): void {
    try {
      const currentCustomer = this.getCurrentCustomer();
      if (currentCustomer) {
        const customers = this.getCustomers();
        const exists = customers.some(c => c.id === currentCustomer.id);
        if (!exists) {
          this.logout();
          console.log('CustomerAuthService: Customer was deleted, logged out automatically');
        }
      }
    } catch (error) {
      console.error('CustomerAuthService: Error checking deleted customer:', error);
    }
  }

  static registerCustomer(email: string, password: string): boolean {
    try {
      const customers = this.getCustomers();
      
      // التحقق من عدم وجود العميل مسبقاً
      if (customers.some(customer => customer.email === email)) {
        this.addLoginAttempt(email, false);
        return false;
      }
      
      const newCustomer: Customer = {
        id: Date.now(),
        email,
        password,
        registrationDate: new Date().toLocaleString('ar-SA')
      };
      
      customers.push(newCustomer);
      this.saveCustomers(customers);
      
      // تسجيل دخول تلقائي بعد التسجيل
      this.setCurrentCustomer(newCustomer);
      this.addLoginAttempt(email, true);
      
      console.log('CustomerAuthService: Customer registered successfully');
      return true;
    } catch (error) {
      console.error('CustomerAuthService: Error registering customer:', error);
      return false;
    }
  }

  static authenticateCustomer(email: string, password: string): boolean {
    try {
      const customers = this.getCustomers();
      const customer = customers.find(c => c.email === email && c.password === password);
      
      if (customer) {
        this.setCurrentCustomer(customer);
        this.addLoginAttempt(email, true);
        console.log('CustomerAuthService: Customer authenticated successfully');
        return true;
      }
      
      this.addLoginAttempt(email, false);
      console.log('CustomerAuthService: Authentication failed');
      return false;
    } catch (error) {
      console.error('CustomerAuthService: Error authenticating customer:', error);
      this.addLoginAttempt(email, false);
      return false;
    }
  }

  static setCurrentCustomer(customer: Customer): void {
    try {
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
    } catch (error) {
      console.error('CustomerAuthService: Error setting current customer:', error);
    }
  }

  static getCurrentCustomer(): Customer | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_CUSTOMER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('CustomerAuthService: Error getting current customer:', error);
      return null;
    }
  }

  static isCustomerAuthenticated(): boolean {
    return this.getCurrentCustomer() !== null;
  }

  static logout(): void {
    try {
      const currentCustomer = this.getCurrentCustomer();
      if (currentCustomer) {
        // حذف جلسة الشات عند تسجيل الخروج
        CustomerChatService.deleteCustomerSession(currentCustomer.id.toString());
      }
      
      localStorage.removeItem(this.CURRENT_CUSTOMER_KEY);
      console.log('CustomerAuthService: Customer logged out successfully');
    } catch (error) {
      console.error('CustomerAuthService: Error during logout:', error);
    }
  }
}

export default CustomerAuthService;
export type { Customer, LoginAttempt, CustomerUser };
