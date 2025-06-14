
import type { CustomerUser, LoginAttempt } from '../types/customer';

class CustomerAuthService {
  private static CUSTOMERS_KEY = 'customers';
  private static LOGIN_ATTEMPTS_KEY = 'customer_login_attempts';
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
    
    // لا نريد إنشاء عملاء افتراضيين - سيتم إنشاؤهم عبر Supabase Auth
    return [];
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

  static addCustomer(customer: Omit<CustomerUser, 'id'>): CustomerUser {
    console.log('CustomerAuthService: Adding new customer:', customer);
    const customers = this.getCustomers();
    const newCustomer: CustomerUser = {
      ...customer,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      isVerified: true,
      isBlocked: false,
      isOnline: false,
      lastSeen: new Date().toLocaleString('ar-SA')
    };
    customers.push(newCustomer);
    this.saveCustomers(customers);
    console.log('CustomerAuthService: New customer added:', newCustomer);
    return newCustomer;
  }

  static authenticate(email: string, password: string): { success: boolean; customer?: CustomerUser; error?: string } {
    console.log('CustomerAuthService: Attempting authentication for:', email);
    const attempt: LoginAttempt = {
      id: Date.now(),
      email,
      password,
      timestamp: new Date().toLocaleString('ar-SA'),
      success: false,
      ipAddress: 'localhost'
    };

    // سجل محاولة تسجيل الدخول
    this.logLoginAttempt(attempt);

    const customers = this.getCustomers();
    const customer = customers.find(c => c.email === email && c.password === password);

    if (customer) {
      if (customer.isBlocked) {
        console.log('CustomerAuthService: Customer is blocked:', email);
        return { success: false, error: 'تم حظر هذا الحساب' };
      }

      attempt.success = true;
      this.logLoginAttempt(attempt);
      
      // تحديث حالة الاتصال
      localStorage.setItem(`online_${customer.id}`, 'true');
      localStorage.setItem(`lastSeen_${customer.id}`, new Date().toLocaleString('ar-SA'));
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
      
      console.log('CustomerAuthService: Authentication successful for:', email);
      return { success: true, customer };
    }

    console.log('CustomerAuthService: Authentication failed for:', email);
    return { success: false, error: 'بيانات الدخول غير صحيحة' };
  }

  static getCurrentCustomer(): CustomerUser | null {
    try {
      const stored = localStorage.getItem(this.CURRENT_CUSTOMER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('CustomerAuthService: Error loading current customer:', error);
    }
    return null;
  }

  static logout(): void {
    const currentCustomer = this.getCurrentCustomer();
    if (currentCustomer) {
      localStorage.removeItem(`online_${currentCustomer.id}`);
      localStorage.setItem(`lastSeen_${currentCustomer.id}`, new Date().toLocaleString('ar-SA'));
    }
    localStorage.removeItem(this.CURRENT_CUSTOMER_KEY);
    console.log('CustomerAuthService: Customer logged out');
  }

  static isAuthenticated(): boolean {
    return this.getCurrentCustomer() !== null;
  }

  static logLoginAttempt(attempt: LoginAttempt): void {
    try {
      const attempts = this.getLoginAttempts();
      attempts.unshift(attempt);
      // الاحتفاظ بآخر 100 محاولة فقط
      if (attempts.length > 100) {
        attempts.splice(100);
      }
      localStorage.setItem(this.LOGIN_ATTEMPTS_KEY, JSON.stringify(attempts));
    } catch (error) {
      console.error('CustomerAuthService: Error logging attempt:', error);
    }
  }

  static getLoginAttempts(): LoginAttempt[] {
    try {
      const stored = localStorage.getItem(this.LOGIN_ATTEMPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('CustomerAuthService: Error loading login attempts:', error);
    }
    return [];
  }

  static clearLoginAttempts(): void {
    localStorage.removeItem(this.LOGIN_ATTEMPTS_KEY);
    console.log('CustomerAuthService: Login attempts cleared');
  }

  static isDefaultCustomer(customerId: number): boolean {
    // لا يوجد عملاء افتراضيون الآن
    return false;
  }

  // دالة لإضافة عميل من Supabase Auth
  static addSupabaseCustomer(user: any): CustomerUser {
    const customers = this.getCustomers();
    const existingCustomer = customers.find(c => c.email === user.email);
    
    if (existingCustomer) {
      return existingCustomer;
    }

    const newCustomer: CustomerUser = {
      id: Date.now(),
      email: user.email,
      password: '', // لا نحتاج كلمة مرور للمستخدمين من Supabase
      username: user.user_metadata?.username || user.email.split('@')[0],
      registrationDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      isVerified: user.email_confirmed_at !== null,
      isBlocked: false,
      isOnline: true,
      lastSeen: new Date().toLocaleString('ar-SA')
    };

    customers.push(newCustomer);
    this.saveCustomers(customers);
    
    // تحديث حالة الاتصال
    localStorage.setItem(`online_${newCustomer.id}`, 'true');
    localStorage.setItem(`lastSeen_${newCustomer.id}`, new Date().toLocaleString('ar-SA'));
    
    console.log('CustomerAuthService: Supabase customer added:', newCustomer);
    return newCustomer;
  }
}

export default CustomerAuthService;
export type { CustomerUser, LoginAttempt };
