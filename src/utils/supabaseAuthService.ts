
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: number;
  username: string;
  role: string;
  created_at?: string;
}

interface CustomerUser {
  id: number;
  email: string;
  username?: string;
  is_verified: boolean;
  is_blocked: boolean;
  is_online: boolean;
  last_seen?: string;
  created_at?: string;
}

interface LoginAttempt {
  id: number;
  email: string;
  timestamp: string;
  success: boolean;
  ip_address?: string;
}

class SupabaseAuthService {
  static async authenticateAdmin(username: string, password: string): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    try {
      console.log('SupabaseAuthService: Authenticating admin:', username);

      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
      }

      const user: AdminUser = {
        id: Number(data.id),
        username: data.username,
        role: data.role
      };

      console.log('SupabaseAuthService: Admin authenticated successfully');
      return { success: true, user };
    } catch (error) {
      console.error('SupabaseAuthService: Error authenticating admin:', error);
      return { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' };
    }
  }

  static async getCustomers(): Promise<CustomerUser[]> {
    try {
      const { data, error } = await supabase
        .from('customer_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('SupabaseAuthService: Error fetching customers:', error);
        return [];
      }

      return data.map(customer => ({
        id: Number(customer.id),
        email: customer.email,
        username: customer.username || '',
        is_verified: customer.is_verified || false,
        is_blocked: customer.is_blocked || false,
        is_online: customer.is_online || false,
        last_seen: customer.last_seen || '',
        created_at: customer.created_at
      }));
    } catch (error) {
      console.error('SupabaseAuthService: Error loading customers:', error);
      return [];
    }
  }

  static async addCustomer(customer: Omit<CustomerUser, 'id' | 'created_at'>): Promise<CustomerUser | null> {
    try {
      const newId = Date.now();
      
      const { data, error } = await supabase
        .from('customer_users')
        .insert({
          id: newId,
          email: customer.email,
          password: '', // سيتم تعيينها من خلال Supabase Auth
          username: customer.username,
          is_verified: customer.is_verified,
          is_blocked: customer.is_blocked,
          is_online: customer.is_online,
          last_seen: customer.last_seen
        })
        .select()
        .single();

      if (error || !data) {
        console.error('SupabaseAuthService: Error adding customer:', error);
        return null;
      }

      return {
        id: Number(data.id),
        email: data.email,
        username: data.username || '',
        is_verified: data.is_verified || false,
        is_blocked: data.is_blocked || false,
        is_online: data.is_online || false,
        last_seen: data.last_seen || '',
        created_at: data.created_at
      };
    } catch (error) {
      console.error('SupabaseAuthService: Error adding customer:', error);
      return null;
    }
  }

  static async logLoginAttempt(attempt: Omit<LoginAttempt, 'id'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('login_attempts')
        .insert({
          id: Date.now(),
          email: attempt.email,
          password: '', // لا نحفظ كلمة المرور الفعلية
          timestamp: attempt.timestamp,
          success: attempt.success,
          ip_address: attempt.ip_address || 'localhost'
        });

      if (error) {
        console.error('SupabaseAuthService: Error logging attempt:', error);
      }
    } catch (error) {
      console.error('SupabaseAuthService: Error logging attempt:', error);
    }
  }

  static async getLoginAttempts(): Promise<LoginAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('login_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error('SupabaseAuthService: Error fetching login attempts:', error);
        return [];
      }

      return data.map(attempt => ({
        id: Number(attempt.id),
        email: attempt.email,
        timestamp: attempt.timestamp,
        success: attempt.success || false,
        ip_address: attempt.ip_address || 'localhost'
      }));
    } catch (error) {
      console.error('SupabaseAuthService: Error loading login attempts:', error);
      return [];
    }
  }
}

export default SupabaseAuthService;
