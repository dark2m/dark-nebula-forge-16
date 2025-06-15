
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useSupabaseDownloadCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل الفئات من قاعدة البيانات
  const loadCategories = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('download_categories')
        .select('name')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;

      const categoryNames = (data || []).map(cat => cat.name);
      setCategories(categoryNames);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل الفئات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة فئة جديدة
  const addCategory = async (categoryName: string) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('download_categories')
        .insert([{ name: categoryName, is_active: true }]);

      if (error) throw error;

      await loadCategories();
      
      toast({
        title: "تم إضافة الفئة",
        description: `تم إضافة فئة "${categoryName}" بنجاح`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة الفئة",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث فئة
  const updateCategory = async (oldName: string, newName: string) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('download_categories')
        .update({ name: newName })
        .eq('name', oldName);

      if (error) throw error;

      await loadCategories();
      
      toast({
        title: "تم تحديث الفئة",
        description: `تم تحديث الفئة من "${oldName}" إلى "${newName}"`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث الفئة",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف فئة
  const deleteCategory = async (categoryName: string) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('download_categories')
        .update({ is_active: false })
        .eq('name', categoryName);

      if (error) throw error;

      await loadCategories();
      
      toast({
        title: "تم حذف الفئة",
        description: `تم حذف فئة "${categoryName}" بنجاح`,
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الفئة",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    isLoading,
    isSaving,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: loadCategories
  };
};
