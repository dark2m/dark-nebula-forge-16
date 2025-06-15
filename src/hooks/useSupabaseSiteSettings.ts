
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '@/types/admin';
import AdminStorage from '@/utils/adminStorage';

export const useSupabaseSiteSettings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getDefaultSiteSettings());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // تحميل الإعدادات من قاعدة البيانات
  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings_data')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      if (data && data.settings_data) {
        // تحويل Json إلى SiteSettings بطريقة آمنة
        const settingsData = data.settings_data as unknown as SiteSettings;
        setSettings(settingsData);
      } else {
        // إذا لم توجد إعدادات، حفظ الافتراضية
        const defaultSettings = AdminStorage.getDefaultSiteSettings();
        await saveSettings(defaultSettings);
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Error loading site settings:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل إعدادات الموقع",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // حفظ الإعدادات في قاعدة البيانات
  const saveSettings = async (newSettings: SiteSettings) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .insert({
          settings_data: newSettings as any // تحويل إلى Json
        });

      if (error) throw error;

      setSettings(newSettings);
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ إعدادات الموقع بنجاح"
      });
    } catch (error) {
      console.error('Error saving site settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ إعدادات الموقع",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  // حفظ تلقائي مع تأخير
  const autoSave = async (newSettings: SiteSettings) => {
    setSettings(newSettings);
    
    // تأخير الحفظ لتجنب الكثرة
    setTimeout(() => {
      saveSettings(newSettings);
    }, 1000);
  };

  // تحديث النصوص مع الحفظ التلقائي
  const updatePageTexts = (page: string, field: string, value: any) => {
    console.log('Updating page texts:', page, field, value);
    const updatedSettings = {
      ...settings,
      pageTexts: {
        ...settings.pageTexts,
        [page]: {
          ...settings.pageTexts[page as keyof typeof settings.pageTexts],
          [field]: value
        }
      }
    };
    
    // حفظ فوري للنصوص
    autoSave(updatedSettings);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return {
    settings,
    loading,
    saving,
    saveSettings,
    autoSave,
    loadSettings,
    updateSettings: setSettings,
    updatePageTexts
  };
};
