
import CustomerChatService from './customerChatService';

interface Customer {
  id: number;
  email: string;
  password: string;
  registrationDate: string;
}

class CustomerAuthService {
  private static CUSTOMERS_KEY = 'customers';
  private static CURRENT_CUSTOMER_KEY = 'current_customer';

  static getCustomers(): Customer[] {
    try {
      const stored = localStorage.getItem(this.CUSTOMERS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('CustomerAuthService: Error loading customers:', error);
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

  static registerCustomer(email: string, password: string): boolean {
    try {
      const customers = this.getCustomers();
      
      // التحقق من عدم وجود العميل مسبقاً
      if (customers.some(customer => customer.email === email)) {
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
        console.log('CustomerAuthService: Customer authenticated successfully');
        return true;
      }
      
      console.log('CustomerAuthService: Authentication failed');
      return false;
    } catch (error) {
      console.error('CustomerAuthService: Error authenticating customer:', error);
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
export type { Customer };
