
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SiteData {
  id?: string;
  page_name: string;
  content: any;
  layout_settings?: any;
  created_at?: string;
  updated_at?: string;
}

export const useSiteData = (pageName: string = 'default') => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load data from Supabase
  const loadData = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data: siteData, error } = await supabase
        .from('site_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) throw error;

      setData(siteData || {
        page_name: pageName,
        content: {},
        layout_settings: {}
      });
    } catch (error) {
      console.error('Error loading site data:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل البيانات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Save data to Supabase
  const saveData = async (newData: Partial<SiteData>) => {
    if (!user) return;

    setSaving(true);
    try {
      const dataToSave = {
        user_id: user.id,
        page_name: pageName,
        content: newData.content || {},
        layout_settings: newData.layout_settings || {}
      };

      const { data: savedData, error } = await supabase
        .from('site_data')
        .upsert(dataToSave, {
          onConflict: 'user_id,page_name'
        })
        .select()
        .single();

      if (error) throw error;

      setData(savedData);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ البيانات بنجاح"
      });
    } catch (error) {
      console.error('Error saving site data:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // Auto-save with debouncing
  const autoSave = async (newData: Partial<SiteData>) => {
    if (!user) return;

    // Update local state immediately
    setData(prev => prev ? { ...prev, ...newData } : null);
    
    // Debounced save to database
    setTimeout(() => {
      saveData(newData);
    }, 1000);
  };

  useEffect(() => {
    loadData();
  }, [user, pageName]);

  return {
    data,
    loading,
    saving,
    saveData,
    autoSave,
    loadData
  };
};
