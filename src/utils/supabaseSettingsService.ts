
import { supabase } from '@/integrations/supabase/client';
import { SiteSettings } from '../types/admin';

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
        return this.getDefaultSettings();
      }

      const settings = data.settings_data as unknown as SiteSettings;
      console.log('SupabaseSettingsService: Loaded settings from Supabase');
      
      // التأكد من وجود navigation array
      if (!settings.navigation) {
        settings.navigation = this.getDefaultSettings().navigation;
      }
      
      return settings;
    } catch (error) {
      console.error('SupabaseSettingsService: Error loading settings:', error);
      return this.getDefaultSettings();
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
          settings_data: settingsToSave as any
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
        const defaultSettings = this.getDefaultSettings();
        await this.saveSiteSettings(defaultSettings);
      }
    } catch (error) {
      console.error('SupabaseSettingsService: Error initializing settings:', error);
    }
  }

  private static getDefaultSettings(): SiteSettings {
    return {
      title: 'DARK',
      titleSize: 'xl',
      description: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4'
      },
      globalTextSize: 'medium',
      backgroundSettings: {
        type: 'color',
        value: '#000000',
        starCount: 150,
        meteorCount: 5,
        animationSpeed: 'normal',
        starOpacity: 0.8,
        meteorOpacity: 0.9,
        starSize: 'medium',
        meteorSize: 'medium',
        meteorDirection: 'down',
        meteorColors: ['#ffffff', '#3b82f6', '#8b5cf6']
      },
      navigation: [
        { id: 'official', name: 'الصفحة الرئيسية', path: '/official', icon: 'Users', visible: true },
        { id: 'pubg', name: 'هكر ببجي موبايل', path: '/pubg-hacks', icon: 'Shield', visible: true },
        { id: 'web', name: 'برمجة مواقع', path: '/web-development', icon: 'Code', visible: true },
        { id: 'discord', name: 'برمجة بوتات ديسكورد', path: '/discord-bots', icon: 'Bot', visible: true },
        { id: 'tools', name: 'الأدوات', path: '/tools', icon: 'Wrench', visible: true },
        { id: 'customer-support', name: 'خدمة العملاء', path: '/customer-support', icon: 'MessageCircle', visible: true }
      ],
      contactInfo: {
        whatsapp: '+1234567890',
        email: 'info@dark.com',
        phone: '+1234567890',
        address: 'الرياض، المملكة العربية السعودية'
      },
      homePage: {
        heroTitle: 'مرحباً بك في DARK',
        heroSubtitle: 'نوفر لك أفضل الخدمات في مجال التقنية',
        featuresTitle: 'خدماتنا',
        features: [
          {
            id: 'security',
            icon: 'Shield',
            title: 'أمان عالي',
            description: 'جميع خدماتنا آمنة ومحمية',
            visible: true
          },
          {
            id: 'quality',
            icon: 'Star',
            title: 'جودة عالية',
            description: 'نضمن لك أفضل جودة في الخدمة',
            visible: true
          },
          {
            id: 'support',
            icon: 'Users',
            title: 'دعم فني',
            description: 'فريق دعم فني متاح على مدار الساعة',
            visible: true
          }
        ]
      },
      typography: {
        fontFamily: 'Cairo',
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
          featuresTitle: 'خدماتنا',
          features: [
            {
              id: 'security',
              icon: 'Shield',
              title: 'أمان عالي',
              description: 'جميع خدماتنا آمنة ومحمية بأحدث تقنيات الحماية',
              visible: true
            },
            {
              id: 'quality',
              icon: 'Star',
              title: 'جودة عالية',
              description: 'نضمن لك أفضل جودة في الخدمة مع أسعار منافسة',
              visible: true
            },
            {
              id: 'support',
              icon: 'Users',
              title: 'دعم فني',
              description: 'فريق دعم فني متخصص متاح على مدار الساعة لخدمتك',
              visible: true
            }
          ]
        },
        official: {
          pageTitle: 'الصفحة الرسمية - DARK',
          pageSubtitle: 'اكتشف عالم البرمجة والتقنية مع فريق DARK المتخصص',
          aboutTitle: 'من نحن',
          aboutContent: [
            'فريق DARK هو مجموعة من المطورين والمبرمجين المتخصصين في تطوير الحلول التقنية المبتكرة.',
            'نقدم خدمات متنوعة تشمل تطوير المواقع، برمجة التطبيقات، وحلول الأمان الرقمي.',
            'هدفنا هو تقديم أفضل الخدمات التقنية بجودة عالية وأسعار منافسة.'
          ],
          whyChooseTitle: 'لماذا تختار DARK؟',
          whyChooseItems: [
            {
              icon: 'Shield',
              title: 'أمان وموثوقية',
              description: 'نستخدم أحدث تقنيات الحماية لضمان أمان بياناتك'
            },
            {
              icon: 'Clock',
              title: 'سرعة في التنفيذ',
              description: 'نلتزم بالمواعيد المحددة ونسلم المشاريع في الوقت المناسب'
            },
            {
              icon: 'Users',
              title: 'دعم فني متميز',
              description: 'فريق دعم فني متاح 24/7 لمساعدتك في أي وقت'
            }
          ],
          contactTitle: 'تواصل معنا'
        },
        pubgHacks: {
          pageTitle: 'هكر ببجي موبايل',
          pageSubtitle: 'احصل على أفضل هكرز ببجي موبايل آمنة ومحدثة',
          safetyTitle: 'ضمان الأمان',
          safetyDescription: 'جميع هكرزنا آمنة ولا تسبب حظر للحساب. نحن نضمن الأمان الكامل لحسابك.'
        },
        webDevelopment: {
          pageTitle: 'برمجة المواقع',
          pageSubtitle: 'نصمم ونطور مواقع احترافية تلبي احتياجاتك',
          servicesTitle: 'خدمات البرمجة'
        },
        discordBots: {
          pageTitle: 'برمجة بوتات ديسكورد',
          pageSubtitle: 'بوتات ديسكورد احترافية مخصصة لخادمك',
          featuresTitle: 'مميزات البوتات'
        },
        navigation: {
          homeTitle: 'الرئيسية',
          pubgTitle: 'هكر ببجي',
          webTitle: 'برمجة مواقع',
          discordTitle: 'بوتات ديسكورد',
          officialTitle: 'الصفحة الرسمية',
          adminTitle: 'لوحة التحكم'
        },
        cart: {
          cartTitle: 'سلة المشتريات',
          emptyCartMessage: 'سلة المشتريات فارغة',
          purchaseButton: 'إتمام الشراء',
          purchaseNote: 'ملاحظة: سيتم تحويلك إلى واتساب لإتمام عملية الشراء',
          addToCartButton: 'إضافة للسلة',
          removeButton: 'إزالة'
        },
        tools: {
          pageTitle: 'الأدوات',
          pageSubtitle: 'مجموعة من الأدوات المفيدة'
        },
        customerSupport: {
          pageTitle: 'خدمة العملاء',
          pageDescription: 'نحن هنا لمساعدتك. تواصل معنا في أي وقت',
          workingHoursTitle: 'ساعات العمل',
          workingHours: {
            weekdays: 'السبت - الخميس: 9:00 ص - 6:00 م',
            friday: 'الجمعة: مغلق'
          },
          supportNote: 'فريق الدعم متاح للرد على استفساراتك'
        }
      },
      tools: []
    };
  }
}

export default SupabaseSettingsService;
