
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ProductUpdate {
  id: number;
  title: string;
  message: string;
  isActive: boolean;
  createdAt: string;
}

export const useSupabaseProductUpdates = () => {
  const [updates, setUpdates] = useState<ProductUpdate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل التحديثات من قاعدة البيانات
  const loadUpdates = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('product_updates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedUpdates: ProductUpdate[] = (data || []).map(update => ({
        id: Number(update.id),
        title: update.title,
        message: update.message,
        isActive: update.is_active ?? true,
        createdAt: update.created_at || new Date().toISOString()
      }));

      setUpdates(formattedUpdates);
    } catch (error) {
      console.error('Error loading updates:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل التحديثات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة تحديث جديد
  const addUpdate = async (updateData: Omit<ProductUpdate, 'id' | 'createdAt'>) => {
    try {
      setIsSaving(true);
      
      const newUpdateData = {
        title: updateData.title,
        message: updateData.message,
        is_active: updateData.isActive
      };

      const { data, error } = await supabase
        .from('product_updates')
        .insert([newUpdateData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إضافة التحديث",
        description: "تم إضافة تحديث جديد بنجاح",
        variant: "default"
      });

      await loadUpdates();
      return data;
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة التحديث",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث تحديث
  const updateUpdate = async (id: number, updates: Partial<ProductUpdate>) => {
    try {
      setIsSaving(true);

      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.message !== undefined) dbUpdates.message = updates.message;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

      const { error } = await supabase
        .from('product_updates')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setUpdates(prevUpdates => 
        prevUpdates.map(update => 
          update.id === id ? { ...update, ...updates } : update
        )
      );

      console.log(`Update ${id} updated successfully`);
      
    } catch (error) {
      console.error('Error updating update:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التحديث",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف تحديث
  const deleteUpdate = async (id: number) => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('product_updates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUpdates(prevUpdates => prevUpdates.filter(u => u.id !== id));

      toast({
        title: "تم حذف التحديث",
        description: "تم حذف التحديث بنجاح",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error deleting update:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف التحديث",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadUpdates();
  }, []);

  return {
    updates,
    isLoading,
    isSaving,
    addUpdate,
    updateUpdate,
    deleteUpdate,
    refreshUpdates: loadUpdates
  };
};
