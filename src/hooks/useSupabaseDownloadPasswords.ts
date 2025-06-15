
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DownloadPassword } from '@/types/downloads';

export const useSupabaseDownloadPasswords = () => {
  const [passwords, setPasswords] = useState<DownloadPassword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل كلمات المرور من قاعدة البيانات
  const loadPasswords = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('download_passwords')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedPasswords: DownloadPassword[] = (data || []).map(password => ({
        id: Number(password.id),
        name: password.name,
        password: password.password,
        allowedCategories: Array.isArray(password.allowed_categories) ? 
          (password.allowed_categories as string[]) : [],
        isActive: password.is_active ?? true,
        description: password.description || '',
        usageCount: password.usage_count || 0,
        lastUsed: password.last_used || '',
        createdAt: password.created_at || new Date().toISOString()
      }));

      setPasswords(formattedPasswords);
    } catch (error) {
      console.error('Error loading download passwords:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل كلمات المرور",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة كلمة مرور جديدة
  const addPassword = async (passwordData: Omit<DownloadPassword, 'id' | 'createdAt' | 'usageCount' | 'lastUsed'>) => {
    try {
      setIsSaving(true);
      
      const { data: existingPasswords } = await supabase
        .from('download_passwords')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = existingPasswords && existingPasswords.length > 0 
        ? existingPasswords[0].id + 1 
        : 5;

      const newPasswordData = {
        id: nextId,
        name: passwordData.name,
        password: passwordData.password,
        allowed_categories: passwordData.allowedCategories,
        is_active: passwordData.isActive,
        description: passwordData.description,
        usage_count: 0
      };

      const { data, error } = await supabase
        .from('download_passwords')
        .insert([newPasswordData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إضافة كلمة المرور",
        description: "تم إضافة كلمة مرور جديدة بنجاح",
        variant: "default"
      });

      await loadPasswords();
      return data;
    } catch (error) {
      console.error('Error adding password:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة كلمة المرور",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث كلمة مرور
  const updatePassword = async (id: number, updates: Partial<DownloadPassword>) => {
    try {
      setIsSaving(true);

      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.password !== undefined) dbUpdates.password = updates.password;
      if (updates.allowedCategories !== undefined) dbUpdates.allowed_categories = updates.allowedCategories;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.usageCount !== undefined) dbUpdates.usage_count = updates.usageCount;
      if (updates.lastUsed !== undefined) dbUpdates.last_used = updates.lastUsed;

      const { error } = await supabase
        .from('download_passwords')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setPasswords(prevPasswords => 
        prevPasswords.map(password => 
          password.id === id ? { ...password, ...updates } : password
        )
      );

      console.log(`Password ${id} updated successfully`);
      
    } catch (error) {
      console.error('Error updating password:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف كلمة مرور
  const deletePassword = async (id: number) => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('download_passwords')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPasswords(prevPasswords => prevPasswords.filter(p => p.id !== id));

      toast({
        title: "تم حذف كلمة المرور",
        description: "تم حذف كلمة المرور بنجاح",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error deleting password:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف كلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // التحقق من صحة كلمة المرور
  const validatePassword = async (inputPassword: string) => {
    try {
      const { data, error } = await supabase
        .from('download_passwords')
        .select('*')
        .eq('password', inputPassword)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return null;
      }

      // تحديث عداد الاستخدام وآخر استخدام
      await updatePassword(data.id, {
        usageCount: (data.usage_count || 0) + 1,
        lastUsed: new Date().toISOString()
      });

      return {
        id: data.id,
        name: data.name,
        allowedCategories: Array.isArray(data.allowed_categories) ? 
          (data.allowed_categories as string[]) : [],
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error validating password:', error);
      return null;
    }
  };

  useEffect(() => {
    loadPasswords();
  }, []);

  return {
    passwords,
    isLoading,
    isSaving,
    addPassword,
    updatePassword,
    deletePassword,
    validatePassword,
    refreshPasswords: loadPasswords
  };
};
