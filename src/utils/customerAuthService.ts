
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
        console.log('CustomerAuthService: Loaded customers:', customers.length);
        return customers;
      }
    } catch (error) {
      console.error('CustomerAuthService: Error loading customers:', error);
    }
    
    return [];
  }

  static saveCustomers(customers: CustomerUser[]): void {
    try {
      console.log('CustomerAuthService: Saving customers:', customers.length);
      localStorage.setItem(this.CUSTOMERS_KEY, JSON.stringify(customers));
    } catch (error) {
      console.error('CustomerAuthService: Error saving customers:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static addCustomer(customer: Omit<CustomerUser, 'id'>): CustomerUser {
    console.log('CustomerAuthService: Adding new customer:', customer.email);
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

    this.logLoginAttempt(attempt);

    const customers = this.getCustomers();
    const customer = customers.find(c => c.email === email && c.password === password);

    if (customer) {
      if (customer.isBlocked) {
        return { success: false, error: 'تم حظر هذا الحساب' };
      }

      attempt.success = true;
      this.logLoginAttempt(attempt);
      
      localStorage.setItem(`online_${customer.id}`, 'true');
      localStorage.setItem(`lastSeen_${customer.id}`, new Date().toLocaleString('ar-SA'));
      localStorage.setItem(this.CURRENT_CUSTOMER_KEY, JSON.stringify(customer));
      
      return { success: true, customer };
    }

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
  }

  static isAuthenticated(): boolean {
    return this.getCurrentCustomer() !== null;
  }

  static logLoginAttempt(attempt: LoginAttempt): void {
    try {
      const attempts = this.getLoginAttempts();
      attempts.unshift(attempt);
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
  }

  static isDefaultCustomer(customerId: number): boolean {
    return false;
  }

  // دالة محسنة لإضافة عميل من Supabase Auth مع معالجة أفضل للأخطاء
  static addSupabaseCustomer(user: any): CustomerUser {
    // التحقق الشامل من بيانات المستخدم
    if (!user) {
      console.error('CustomerAuthService: User object is null/undefined');
      throw new Error('بيانات المستخدم غير موجودة');
    }

    if (!user.email) {
      console.error('CustomerAuthService: User email is missing:', user);
      throw new Error('البريد الإلكتروني مطلوب');
    }

    if (!user.id) {
      console.error('CustomerAuthService: User ID is missing:', user);
      throw new Error('معرف المستخدم مطلوب');
    }

    const customers = this.getCustomers();
    const existingCustomer = customers.find(c => c.email === user.email);
    
    if (existingCustomer) {
      console.log('CustomerAuthService: Customer already exists:', existingCustomer.email);
      // تحديث حالة الاتصال للعميل الموجود
      localStorage.setItem(`online_${existingCustomer.id}`, 'true');
      localStorage.setItem(`lastSeen_${existingCustomer.id}`, new Date().toLocaleString('ar-SA'));
      return existingCustomer;
    }

    // إنشاء username فريد بناءً على النظام الجديد في قاعدة البيانات
    const baseUsername = user.user_metadata?.username || user.email.split('@')[0];
    const uniqueUsername = `${baseUsername}_${user.id.substring(0, 8)}`;

    // إنشاء عميل جديد
    const newCustomer: CustomerUser = {
      id: Date.now(),
      email: user.email,
      password: '', // لا نحتاج كلمة مرور للمستخدمين من Supabase
      username: uniqueUsername,
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
    
    console.log('CustomerAuthService: New Supabase customer created:', newCustomer.email, 'Username:', uniqueUsername);
    return newCustomer;
  }

  // دالة جديدة للتعامل مع حالات الخطأ في التسجيل
  static handleRegistrationError(error: any): string {
    console.error('CustomerAuthService: Registration error:', error);
    
    if (error?.message?.includes('duplicate key')) {
      return 'اسم المستخدم موجود بالفعل، سيتم إنشاء اسم فريد تلقائياً';
    }
    
    if (error?.message?.includes('invalid email')) {
      return 'البريد الإلكتروني غير صحيح';
    }
    
    if (error?.message?.includes('weak password')) {
      return 'كلمة المرور ضعيفة، يجب أن تكون 6 أحرف على الأقل';
    }
    
    return 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى';
  }
}

export default CustomerAuthService;
export type { CustomerUser, LoginAttempt };
