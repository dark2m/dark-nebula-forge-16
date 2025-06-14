
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '../types/admin';
import SettingsService from './settingsService';

class SupabaseSettingsService {
  private static SETTINGS_ID = 'main_settings';

  static async getSiteSettings(): Promise<SiteSettings> {
    try {
      console.log('SupabaseSettingsService: Getting settings from Supabase...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings_data')
        .limit(1)
        .single();

      if (error || !data) {
        console.log('SupabaseSettingsService: No settings found, using defaults');
        return SettingsService.getSiteSettings();
      }

      const settings = data.settings_data as SiteSettings;
      console.log('SupabaseSettingsService: Loaded settings from Supabase');
      
      // التأكد من وجود navigation array
      if (!settings.navigation) {
        settings.navigation = SettingsService.getSiteSettings().navigation;
      }
      
      return settings;
    } catch (error) {
      console.error('SupabaseSettingsService: Error loading settings:', error);
      return SettingsService.getSiteSettings();
    }
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<boolean> {
    try {
      console.log('SupabaseSettingsService: Saving settings to Supabase...');
      
      // التأكد من أن navigation موجود ومُهيكل بشكل صحيح
      const settingsToSave = {
        ...settings,
        navigation: settings.navigation || []
      };

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: this.SETTINGS_ID,
          settings_data: settingsToSave
        });

      if (error) {
        console.error('SupabaseSettingsService: Error saving settings:', error);
        return false;
      }

      console.log('SupabaseSettingsService: Settings saved successfully');
      
      // إطلاق حدث التحديث
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: settingsToSave }
      }));
      
      return true;
    } catch (error) {
      console.error('SupabaseSettingsService: Error saving settings:', error);
      return false;
    }
  }

  static async initializeDefaultSettings(): Promise<void> {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1);

      if (!data || data.length === 0) {
        console.log('SupabaseSettingsService: Initializing default settings...');
        const defaultSettings = SettingsService.getSiteSettings();
        await this.saveSiteSettings(defaultSettings);
      }
    } catch (error) {
      console.error('SupabaseSettingsService: Error initializing settings:', error);
    }
  }
}

export default SupabaseSettingsService;
