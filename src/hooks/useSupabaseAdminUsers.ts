
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AdminUser } from '../types/admin';

export const useSupabaseAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل المستخدمين من قاعدة البيانات
  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedUsers: AdminUser[] = (data || []).map(user => ({
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

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error loading admin users:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل المستخدمين",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة مستخدم جديد
  const addUser = async (userData: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'>) => {
    try {
      setIsSaving(true);
      
      const { data, error } = await supabase
        .from('admin_users')
        .insert([{
          username: userData.username,
          password: userData.password,
          role: userData.role
        }])
        .select()
        .single();

      if (error) throw error;

      await loadUsers();
      
      toast({
        title: "تم إضافة المستخدم",
        description: `تم إضافة المستخدم "${userData.username}" بنجاح`,
        variant: "default"
      });

      return data;
    } catch (error: any) {
      console.error('Error adding user:', error);
      
      let errorMessage = "حدث خطأ أثناء إضافة المستخدم";
      if (error.message?.includes('duplicate key')) {
        errorMessage = "اسم المستخدم موجود بالفعل";
      }
      
      toast({
        title: "خطأ في الإضافة",
        description: errorMessage,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث مستخدم
  const updateUser = async (id: number, updates: Partial<AdminUser>) => {
    try {
      setIsSaving(true);
      
      const updateData: any = {};
      if (updates.username) updateData.username = updates.username;
      if (updates.password) updateData.password = updates.password;
      if (updates.role) updateData.role = updates.role;

      const { error } = await supabase
        .from('admin_users')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      await loadUsers();
      
      toast({
        title: "تم تحديث المستخدم",
        description: "تم حفظ التغييرات بنجاح",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      
      let errorMessage = "حدث خطأ أثناء تحديث المستخدم";
      if (error.message?.includes('duplicate key')) {
        errorMessage = "اسم المستخدم موجود بالفعل";
      }
      
      toast({
        title: "خطأ في التحديث",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف مستخدم
  const deleteUser = async (id: number) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadUsers();
      
      toast({
        title: "تم حذف المستخدم",
        description: "تم حذف المستخدم بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المستخدم",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // التحقق من تسجيل الدخول
  const authenticateUser = async (username: string, password: string): Promise<AdminUser | null> => {
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
      console.error('Error authenticating user:', error);
      return null;
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return {
    users,
    isLoading,
    isSaving,
    addUser,
    updateUser,
    deleteUser,
    authenticateUser,
    refreshUsers: loadUsers
  };
};
