import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '../types/admin';

class SupabaseSettingsService {
  private static SETTINGS_ID = 'main-site-settings';

  static async getSiteSettings(): Promise<SiteSettings> {
    try {
      console.log('SupabaseSettingsService: Getting settings from Supabase...');
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings_data')
        .eq('id', this.SETTINGS_ID)
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        return this.getDefaultSettings();
      }

      if (!data) {
        console.log('No settings found, creating defaults...');
        const defaultSettings = this.getDefaultSettings();
        await this.saveSiteSettings(defaultSettings);
        return defaultSettings;
      }

      console.log('SupabaseSettingsService: Loaded settings from Supabase');
      return data.settings_data as unknown as SiteSettings;
    } catch (error) {
      console.error('SupabaseSettingsService: Error loading settings:', error);
      return this.getDefaultSettings();
    }
  }

  static async saveSiteSettings(settings: SiteSettings): Promise<boolean> {
    try {
      console.log('SupabaseSettingsService: Saving settings to Supabase:', settings);

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: this.SETTINGS_ID,
          settings_data: settings as any
        });

      if (error) {
        console.error('Error saving settings:', error);
        return false;
      }

      console.log('SupabaseSettingsService: Settings saved successfully');
      return true;
    } catch (error) {
      console.error('SupabaseSettingsService: Error saving settings:', error);
      return false;
    }
  }

  private static getDefaultSettings(): SiteSettings {
    return {
      title: 'DARK',
      titleSize: 'xl',
      description: 'موقع DARK للخدمات التقنية',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4'
      },
      globalTextSize: 'medium',
      backgroundSettings: {
        type: 'color',
        value: '#000000',
        starCount: 80,
        starSize: 'medium',
        starOpacity: 0.8,
        meteorCount: 10,
        meteorSize: 'medium',
        meteorOpacity: 0.7,
        meteorDirection: 'down',
        meteorColors: ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec'],
        animationSpeed: 'normal'
      },
      navigation: [
        { id: 'home', name: 'الرئيسية', path: '/', icon: 'Home', visible: true },
        { id: 'pubg', name: 'هكر ببجي موبايل', path: '/pubg-hacks', icon: 'Target', visible: true },
        { id: 'web', name: 'برمجة مواقع', path: '/web-development', icon: 'Globe', visible: true },
        { id: 'discord', name: 'برمجة بوتات ديسكورد', path: '/discord-bots', icon: 'Bot', visible: true },
        { id: 'official', name: 'الصفحة الرئيسية', path: '/official', icon: 'Info', visible: true }
      ],
      contactInfo: {
        telegram: '',
        discord: '',
        whatsapp: '',
        email: '',
        phone: '',
        address: ''
      },
      homePage: {
        heroTitle: 'مرحباً بك في DARK',
        heroSubtitle: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة',
        featuresTitle: 'لماذا تختار DARK؟',
        features: [
          {
            id: 'quality',
            icon: 'Shield',
            title: 'جودة عالية',
            description: 'نضمن لك أعلى مستويات الجودة في جميع خدماتنا',
            visible: true
          },
          {
            id: 'support',
            icon: 'HeadphonesIcon',
            title: 'دعم فني 24/7',
            description: 'فريق الدعم الفني متاح لمساعدتك في أي وقت',
            visible: true
          },
          {
            id: 'price',
            icon: 'DollarSign',
            title: 'أسعار منافسة',
            description: 'أفضل الأسعار في السوق مع جودة مضمونة',
            visible: true
          }
        ]
      },
      typography: {
        fontFamily: 'system',
        headingWeight: 'bold',
        bodyWeight: 'normal',
        lineHeight: 'normal'
      },
      design: {
        borderRadius: 'medium',
        shadows: 'medium',
        spacing: 'normal',
        animations: true
      },
      pageTexts: {
        home: {
          heroTitle: 'مرحباً بك في DARK',
          heroSubtitle: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة',
          featuresTitle: 'لماذا تختار DARK؟',
          features: []
        },
        official: {
          pageTitle: 'الصفحة الرئيسية',
          pageSubtitle: 'تعرف على فريق DARK واحصل على جميع طرق التواصل معنا',
          aboutTitle: 'من نحن',
          aboutContent: [],
          whyChooseTitle: 'لماذا تختارنا',
          whyChooseItems: [],
          contactTitle: 'تواصل معنا'
        },
        pubgHacks: {
          pageTitle: 'هكر ببجي موبايل',
          pageSubtitle: 'أحدث الهاكات والأدوات المتقدمة لببجي موبايل مع ضمان الأمان والجودة',
          safetyTitle: 'ضمان الأمان 100%',
          safetyDescription: 'جميع هاكاتنا مطورة بأحدث التقنيات لتجنب الكشف والحظر. نضمن لك تجربة آمنة ومميزة.'
        },
        webDevelopment: {
          pageTitle: 'برمجة مواقع',
          pageSubtitle: 'خدمات تطوير مواقع احترافية ومتقدمة',
          servicesTitle: 'خدماتنا'
        },
        discordBots: {
          pageTitle: 'برمجة بوتات ديسكورد',
          pageSubtitle: 'بوتات ديسكورد مخصصة ومتطورة',
          featuresTitle: 'مميزات بوتاتنا'
        },
        navigation: {
          homeTitle: 'الرئيسية',
          pubgTitle: 'هكر ببجي موبايل',
          webTitle: 'برمجة مواقع',
          discordTitle: 'برمجة بوتات ديسكورد',
          officialTitle: 'الصفحة الرئيسية',
          adminTitle: 'الإدارة'
        },
        cart: {
          cartTitle: 'السلة',
          emptyCartMessage: 'السلة فارغة',
          purchaseButton: 'شراء عبر الديسكورد',
          purchaseNote: 'سيتم توجيهك إلى الديسكورد لإتمام الشراء',
          addToCartButton: 'أضف للسلة',
          removeButton: 'حذف'
        }
      }
    };
  }
}

export default SupabaseSettingsService;
