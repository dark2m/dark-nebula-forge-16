
import { supabase } from '@/integrations/supabase/client';
import { AdminUser } from '../types/admin';

class SupabaseUserService {
  // تحميل جميع المستخدمين
  static async getAdminUsers(): Promise<AdminUser[]> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(user => ({
        id: user.id,
        username: user.username,
        password: user.password,
        role: user.role as 'مدير عام' | 'مبرمج' | 'مشرف',
        name: user.username,
        email: `${user.username}@example.com`,
        isActive: true,
        lastLogin: user.updated_at,
        createdAt: user.created_at,
        permissions: ['overview', 'products', 'users', 'passwords', 'tools', 'customerSupport', 'siteControl', 'texts', 'navigation', 'contact', 'design', 'preview', 'backup']
      }));
    } catch (error) {
      console.error('SupabaseUserService: Error loading users:', error);
      return [];
    }
  }

  // حفظ/تحديث مستخدم
  static async saveAdminUser(user: AdminUser): Promise<void> {
    try {
      const userData = {
        username: user.username,
        password: user.password,
        role: user.role
      };

      if (user.id === 0) {
        // إدراج مستخدم جديد
        const { error } = await supabase
          .from('admin_users')
          .insert([userData]);
        if (error) throw error;
      } else {
        // تحديث مستخدم موجود
        const { error } = await supabase
          .from('admin_users')
          .update(userData)
          .eq('id', user.id);
        if (error) throw error;
      }
    } catch (error) {
      console.error('SupabaseUserService: Error saving user:', error);
      throw error;
    }
  }

  // تحديث مستخدم
  static async updateAdminUser(id: number, updates: Partial<AdminUser>): Promise<void> {
    try {
      const updateData: any = {};
      if (updates.username) updateData.username = updates.username;
      if (updates.password) updateData.password = updates.password;
      if (updates.role) updateData.role = updates.role;

      const { error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('SupabaseUserService: Error updating user:', error);
      throw error;
    }
  }

  // إضافة مستخدم جديد
  static async addAdminUser(user: Omit<AdminUser, 'id'>): Promise<AdminUser> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: user.username,
          password: user.password,
          role: user.role
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        username: data.username,
        password: data.password,
        role: data.role as 'مدير عام' | 'مبرمج' | 'مشرف',
        name: data.username,
        email: `${data.username}@example.com`,
        isActive: true,
        lastLogin: data.created_at,
        createdAt: data.created_at,
        permissions: ['overview', 'products', 'users', 'passwords', 'tools', 'customerSupport', 'siteControl', 'texts', 'navigation', 'contact', 'design', 'preview', 'backup']
      };
    } catch (error) {
      console.error('SupabaseUserService: Error adding user:', error);
      throw error;
    }
  }

  // حذف مستخدم
  static async deleteAdminUser(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('SupabaseUserService: Error deleting user:', error);
      throw error;
    }
  }

  // التحقق من تسجيل الدخول
  static async authenticateAdmin(username: string, password: string): Promise<AdminUser | null> {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        return null;
      }

      // تحديث آخر تسجيل دخول
      await supabase
        .from('admin_users')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', data.id);

      return {
        id: data.id,
        username: data.username,
        password: data.password,
        role: data.role as 'مدير عام' | 'مبرمج' | 'مشرف',
        name: data.username,
        email: `${data.username}@example.com`,
        isActive: true,
        lastLogin: new Date().toISOString(),
        createdAt: data.created_at,
        permissions: ['overview', 'products', 'users', 'passwords', 'tools', 'customerSupport', 'siteControl', 'texts', 'navigation', 'contact', 'design', 'preview', 'backup']
      };
    } catch (error) {
      console.error('SupabaseUserService: Error authenticating user:', error);
      return null;
    }
  }
}

export default SupabaseUserService;
