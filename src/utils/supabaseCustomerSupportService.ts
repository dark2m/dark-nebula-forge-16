
import { supabase } from '@/integrations/supabase/client';

export interface CustomerSupportUser {
  id: string;
  email: string;
  username?: string;
  password_hash?: string;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  is_blocked: boolean;
  last_login?: string;
  verification_code?: string;
  verification_expires_at?: string;
}

export interface CustomerSupportMessage {
  id: string;
  customer_id: string;
  message: string;
  attachments: any[];
  files: any[];
  is_from_customer: boolean;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface CustomerSupportSession {
  id: string;
  customer_id: string;
  status: 'active' | 'closed' | 'waiting';
  last_activity: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

export interface CustomerLoginAttempt {
  id: string;
  email: string;
  ip_address?: string;
  success: boolean;
  attempted_at: string;
  user_agent?: string;
}

class SupabaseCustomerSupportService {
  // إدارة العملاء
  async getCustomers(): Promise<CustomerSupportUser[]> {
    try {
      const { data, error } = await supabase
        .from('customer_support_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching customers:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getCustomers:', error);
      return [];
    }
  }

  async createCustomer(customer: {
    email: string;
    username?: string;
    password_hash?: string;
    is_verified?: boolean;
  }): Promise<CustomerSupportUser | null> {
    try {
      const { data, error } = await supabase
        .from('customer_support_users')
        .insert({
          email: customer.email,
          username: customer.username || customer.email.split('@')[0],
          password_hash: customer.password_hash,
          is_verified: customer.is_verified || false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating customer:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createCustomer:', error);
      return null;
    }
  }

  async updateCustomer(id: string, updates: Partial<CustomerSupportUser>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_users')
        .update(updates)
        .eq('id', id);

      if (error) {
        console.error('Error updating customer:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateCustomer:', error);
      return false;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_users')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteCustomer:', error);
      return false;
    }
  }

  // إدارة الرسائل
  async getMessages(customerId?: string): Promise<CustomerSupportMessage[]> {
    try {
      let query = supabase
        .from('customer_support_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (customerId) {
        query = query.eq('customer_id', customerId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching messages:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getMessages:', error);
      return [];
    }
  }

  async sendMessage(message: {
    customer_id: string;
    message: string;
    attachments?: any[];
    files?: any[];
    is_from_customer?: boolean;
  }): Promise<CustomerSupportMessage | null> {
    try {
      const { data, error } = await supabase
        .from('customer_support_messages')
        .insert({
          customer_id: message.customer_id,
          message: message.message,
          attachments: message.attachments || [],
          files: message.files || [],
          is_from_customer: message.is_from_customer || false,
          is_read: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return null;
      }

      // تحديث آخر نشاط للجلسة
      await this.updateSessionActivity(message.customer_id);

      return data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return null;
    }
  }

  async markMessagesAsRead(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_messages')
        .update({ is_read: true })
        .eq('customer_id', customerId)
        .eq('is_read', false);

      if (error) {
        console.error('Error marking messages as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in markMessagesAsRead:', error);
      return false;
    }
  }

  // إدارة الجلسات
  async getSessions(): Promise<CustomerSupportSession[]> {
    try {
      const { data, error } = await supabase
        .from('customer_support_sessions')
        .select('*')
        .order('last_activity', { ascending: false });

      if (error) {
        console.error('Error fetching sessions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getSessions:', error);
      return [];
    }
  }

  async createOrUpdateSession(customerId: string): Promise<CustomerSupportSession | null> {
    try {
      // التحقق من وجود جلسة
      const { data: existingSession } = await supabase
        .from('customer_support_sessions')
        .select('*')
        .eq('customer_id', customerId)
        .single();

      if (existingSession) {
        // تحديث الجلسة الموجودة
        const { data, error } = await supabase
          .from('customer_support_sessions')
          .update({
            last_activity: new Date().toISOString(),
            status: 'active',
          })
          .eq('id', existingSession.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating session:', error);
          return null;
        }

        return data;
      } else {
        // إنشاء جلسة جديدة
        const { data, error } = await supabase
          .from('customer_support_sessions')
          .insert({
            customer_id: customerId,
            status: 'active',
            last_activity: new Date().toISOString(),
            unread_count: 0,
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating session:', error);
          return null;
        }

        return data;
      }
    } catch (error) {
      console.error('Error in createOrUpdateSession:', error);
      return null;
    }
  }

  async updateSessionActivity(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_sessions')
        .update({
          last_activity: new Date().toISOString(),
        })
        .eq('customer_id', customerId);

      if (error) {
        console.error('Error updating session activity:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateSessionActivity:', error);
      return false;
    }
  }

  async closeSession(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_sessions')
        .update({
          status: 'closed',
          last_activity: new Date().toISOString(),
        })
        .eq('customer_id', customerId);

      if (error) {
        console.error('Error closing session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in closeSession:', error);
      return false;
    }
  }

  async deleteSession(customerId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_support_sessions')
        .delete()
        .eq('customer_id', customerId);

      if (error) {
        console.error('Error deleting session:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteSession:', error);
      return false;
    }
  }

  // إدارة محاولات تسجيل الدخول
  async logLoginAttempt(attempt: {
    email: string;
    ip_address?: string;
    success: boolean;
    user_agent?: string;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('customer_login_attempts')
        .insert({
          email: attempt.email,
          ip_address: attempt.ip_address || 'unknown',
          success: attempt.success,
          user_agent: attempt.user_agent || 'unknown',
        });

      if (error) {
        console.error('Error logging login attempt:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in logLoginAttempt:', error);
      return false;
    }
  }

  async getLoginAttempts(limit: number = 100): Promise<CustomerLoginAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('customer_login_attempts')
        .select('*')
        .order('attempted_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching login attempts:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getLoginAttempts:', error);
      return [];
    }
  }

  // دالة للمصادقة
  async authenticateCustomer(email: string, password: string): Promise<{
    success: boolean;
    customer?: CustomerSupportUser;
    error?: string;
  }> {
    try {
      // تسجيل محاولة الدخول
      await this.logLoginAttempt({
        email,
        success: false,
      });

      // البحث عن العميل
      const { data: customer, error } = await supabase
        .from('customer_support_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !customer) {
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
      }

      if (customer.is_blocked) {
        return { success: false, error: 'تم حظر هذا الحساب' };
      }

      // في هذا المثال، سنقوم بمقارنة بسيطة
      // في التطبيق الحقيقي، يجب استخدام hashing للكلمات السرية
      if (customer.password_hash !== password) {
        return { success: false, error: 'بيانات الدخول غير صحيحة' };
      }

      // تحديث آخر دخول
      await this.updateCustomer(customer.id, {
        last_login: new Date().toISOString(),
      });

      // تسجيل محاولة دخول ناجحة
      await this.logLoginAttempt({
        email,
        success: true,
      });

      return { success: true, customer };
    } catch (error) {
      console.error('Error in authenticateCustomer:', error);
      return { success: false, error: 'خطأ في الخادم' };
    }
  }
}

export default new SupabaseCustomerSupportService();
