
import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface SiteData {
  content?: any;
  layout_settings?: any;
}

export const useSiteData = (pageName: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load data from Supabase
  const loadData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      console.log('Loading data for page:', pageName, 'user:', user.id);
      
      const { data: siteData, error } = await supabase
        .from('site_data')
        .select('*')
        .eq('user_id', user.id)
        .eq('page_name', pageName)
        .maybeSingle();

      if (error) {
        console.error('Error loading site data:', error);
        throw error;
      }

      console.log('Loaded site data:', siteData);
      setData(siteData || { content: {}, layout_settings: {} });
    } catch (error) {
      console.error('Error loading data:', error);
      setData({ content: {}, layout_settings: {} });
    } finally {
      setLoading(false);
    }
  }, [user, pageName]);

  // Save data to Supabase
  const saveData = useCallback(async (newData: SiteData) => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive"
      });
      return;
    }

    setSaving(true);
    try {
      console.log('Saving data to Supabase:', newData);

      const { error } = await supabase
        .from('site_data')
        .upsert({
          user_id: user.id,
          page_name: pageName,
          content: newData.content || {},
          layout_settings: newData.layout_settings || {}
        });

      if (error) {
        console.error('Error saving data:', error);
        throw error;
      }

      setData(newData);
      console.log('Data saved successfully to Supabase');
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ البيانات بنجاح في Supabase"
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }, [user, pageName, toast]);

  // Auto-save with debouncing
  const autoSave = useCallback(async (newData: SiteData) => {
    if (!user) return;
    
    // Update local state immediately
    setData(prev => ({
      ...prev,
      ...newData
    }));

    // Save to Supabase
    await saveData(newData);
  }, [user, saveData]);

  // Load data when user changes
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data,
    loading,
    saving,
    saveData,
    autoSave,
    loadData
  };
};
