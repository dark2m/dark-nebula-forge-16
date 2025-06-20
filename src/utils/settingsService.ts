
import { SiteSettings } from '../types/admin';

class SettingsService {
  private static SETTINGS_KEY = 'site_settings';

  static getSiteSettings(): SiteSettings {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        console.log('SettingsService: Loaded settings from storage:', settings);
        
        // التأكد من وجود navigation array
        if (!settings.navigation) {
          settings.navigation = this.getDefaultSettings().navigation;
        }
        
        return settings;
      } catch (error) {
        console.error('Error parsing settings:', error);
        return this.getDefaultSettings();
      }
    }
    
    console.log('SettingsService: No settings found, using defaults');
    return this.getDefaultSettings();
  }

  static saveSiteSettings(settings: SiteSettings): void {
    try {
      console.log('SettingsService: Saving settings with persistence check:', settings);
      
      // التأكد من أن navigation موجود ومُهيكل بشكل صحيح
      const settingsToSave = {
        ...settings,
        navigation: settings.navigation || []
      };
      
      // حفظ مع تأكيد إضافي
      const jsonString = JSON.stringify(settingsToSave, null, 2);
      localStorage.setItem(this.SETTINGS_KEY, jsonString);
      
      // التحقق من الحفظ
      const verification = localStorage.getItem(this.SETTINGS_KEY);
      if (!verification) {
        throw new Error('Failed to save to localStorage');
      }
      
      // إطلاق حدث التحديث
      const event = new CustomEvent('settingsUpdated', {
        detail: { settings: settingsToSave }
      });
      window.dispatchEvent(event);
      
      console.log('SettingsService: Settings saved successfully and verified');
      console.log('SettingsService: Navigation items count:', settingsToSave.navigation?.length || 0);
      
    } catch (error) {
      console.error('SettingsService: Error saving settings:', error);
      throw error;
    }
  }

  static validateSettings(settings: SiteSettings): boolean {
    try {
      // التحقق من الحقول الأساسية
      if (!settings.title || !settings.navigation) {
        return false;
      }
      
      // التحقق من سلامة navigation array
      if (!Array.isArray(settings.navigation)) {
        return false;
      }
      
      // التحقق من كل عنصر في navigation
      for (const item of settings.navigation) {
        if (!item.name || !item.path || !item.icon) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Settings validation error:', error);
      return false;
    }
  }

  static repairSettings(settings: SiteSettings): SiteSettings {
    const defaults = this.getDefaultSettings();
    
    return {
      ...defaults,
      ...settings,
      navigation: Array.isArray(settings.navigation) ? settings.navigation : defaults.navigation,
      colors: settings.colors || defaults.colors,
      backgroundSettings: settings.backgroundSettings || defaults.backgroundSettings
    };
  }

  private static getDefaultSettings(): SiteSettings {
    const defaultSettings: SiteSettings = {
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
        starCount: 80,
        meteorCount: 10,
        animationSpeed: 'normal',
        starOpacity: 0.8,
        meteorOpacity: 0.7,
        starSize: 'medium',
        meteorSize: 'medium',
        meteorDirection: 'down',
        meteorColors: ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec']
      },
      navigation: [
        { id: 'official', name: 'الصفحة الرئيسية', path: '/official', icon: 'Users', visible: true },
        { id: 'pubg', name: 'هكر ببجي موبايل', path: '/pubg-hacks', icon: 'Shield', visible: true },
        { id: 'web', name: 'برمجة مواقع', path: '/web-development', icon: 'Code', visible: true },
        { id: 'discord', name: 'برمجة بوتات ديسكورد', path: '/discord-bots', icon: 'Bot', visible: true },
        { id: 'tools', name: 'الأدوات', path: '/tool', icon: 'Wrench', visible: true },
        { id: 'downloads', name: 'التنزيلات', path: '/download', icon: 'Download', visible: true },
        { id: 'customer-support', name: 'خدمة العملاء', path: '/sport', icon: 'MessageCircle', visible: true }
      ],
      contactInfo: {
        telegram: '@dark_support',
        discord: 'dark#1234',
        whatsapp: '+966 XX XXX XXXX',
        email: 'support@dark.com',
        phone: '+966 XX XXX XXXX',
        address: 'المملكة العربية السعودية'
      },
      homePage: {
        heroTitle: 'DARK',
        heroSubtitle: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة',
        featuresTitle: 'لماذا تختار DARK؟',
        features: [
          { id: 'speed', icon: '⚡', title: 'سرعة التسليم', description: 'نلتزم بتسليم جميع الطلبات في الوقت المحدد', visible: true },
          { id: 'security', icon: '🛡️', title: 'الأمان والحماية', description: 'جميع منتجاتنا آمنة ومحمية ضد الاكتشاف', visible: true },
          { id: 'quality', icon: '💎', title: 'جودة عالية', description: 'نقدم أفضل جودة في السوق بأسعار منافسة', visible: true }
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
      tools: [
        {
          id: 1,
          name: 'مولد كلمات المرور',
          title: 'مولد كلمات المرور',
          description: 'أنشئ كلمات مرور قوية وآمنة',
          buttonText: 'إنشاء كلمة مرور',
          url: '',
          icon: '🔐',
          visible: true,
          isActive: true,
          category: 'security'
        },
        {
          id: 2,
          name: 'محول الألوان',
          title: 'محول الألوان',
          description: 'تحويل بين صيغ الألوان المختلفة',
          buttonText: 'استخدام المحول',
          url: '',
          icon: '🎨',
          visible: true,
          isActive: true,
          category: 'design'
        },
        {
          id: 3,
          name: 'ضاغط الصور',
          title: 'ضاغط الصور',
          description: 'قلل حجم الصور مع الحفاظ على الجودة',
          buttonText: 'ضغط الصور',
          url: '',
          icon: '📷',
          visible: true,
          isActive: true,
          category: 'general'
        },
        {
          id: 4,
          name: 'مولد الجيميل',
          title: 'مولد الجيميل',
          description: 'إنشاء جميع الاختلافات الممكنة لعناوين Gmail باستخدام النقاط',
          buttonText: 'استخدام المولد',
          url: '/gmail-generator',
          icon: '📧',
          visible: true,
          isActive: true,
          category: 'general'
        }
      ],
      downloadsPassword: 'dark123',
      pageTexts: {
        home: {
          heroTitle: 'DARK',
          heroSubtitle: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة',
          featuresTitle: 'لماذا تختار DARK؟',
          features: [
            { id: 'speed', icon: '⚡', title: 'سرعة التسليم', description: 'نلتزم بتسليم جميع الطلبات في الوقت المحدد', visible: true },
            { id: 'security', icon: '🛡️', title: 'الأمان والحماية', description: 'جميع منتجاتنا آمنة ومحمية ضد الاكتشاف', visible: true },
            { id: 'quality', icon: '💎', title: 'جودة عالية', description: 'نقدم أفضل جودة في السوق بأسعار منافسة', visible: true }
          ]
        },
        official: {
          pageTitle: 'الصفحة الرئيسية',
          pageSubtitle: 'تعرف على فريق DARK واحصل على جميع طرق التواصل معنا',
          aboutTitle: 'من نحن',
          aboutContent: [
            'فريق DARK هو مجموعة من المطورين والمبرمجين المتخصصين في مجال التقنية والألعاب. نحن نسعى لتقديم أفضل الخدمات والمنتجات التقنية مع ضمان الجودة والأمان.',
            'تأسس فريقنا على أسس قوية من الخبرة والمعرفة العميقة في مجال البرمجة وتطوير الحلول التقنية. نحن نفخر بتقديم خدمات متميزة تلبي احتياجات عملائنا وتفوق توقعاتهم.'
          ],
          whyChooseTitle: 'لماذا تختارنا',
          whyChooseItems: [
            { icon: '🛡️', title: 'الأمان', description: 'منتجات آمنة ومحمية بأحدث التقنيات' },
            { icon: '⭐', title: 'الجودة', description: 'أعلى معايير الجودة في جميع منتجاتنا' },
            { icon: '💬', title: 'الدعم', description: 'دعم فني متاح 24/7 لجميع عملائنا' }
          ],
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
        tools: {
          title: 'أدوات الموقع',
          subtitle: 'مجموعة من الأدوات المفيدة والمتقدمة'
        },
        downloads: {
          loginPage: {
            title: 'المشتركين فقط',
            subtitle: 'تواصل مع خدمة العملاء للحصول على رمز الدخول',
            passwordLabel: 'رمز الدخول',
            passwordPlaceholder: 'أدخل رمز الدخول',
            loginButton: 'دخول',
            contactSupport: 'تواصل مع خدمة العملاء',
            errorMessage: 'رمز دخول خاطئ'
          },
          mainPage: {
            title: 'مركز التنزيلات',
            subtitle: 'احصل على أفضل الأدوات والبرامج المتخصصة',
            categories: {
              all: 'الكل',
              games: 'ألعاب',
              tools: 'أدوات',
              design: 'تصميم',
              programming: 'برمجة',
              music: 'موسيقى',
              video: 'فيديو',
              books: 'كتب',
              security: 'أمان'
            },
            buttons: {
              download: 'تنزيل',
              filter: 'تصفية'
            },
            labels: {
              size: 'الحجم',
              downloads: 'التنزيلات',
              rating: 'التقييم',
              version: 'الإصدار'
            },
            stats: {
              totalDownloads: 'إجمالي التنزيلات',
              availableFiles: 'ملفات متاحة',
              averageRating: 'متوسط التقييم'
            },
            placeholders: {
              search: 'البحث في التنزيلات...',
              noResults: 'لا توجد نتائج'
            }
          }
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

    return defaultSettings;
  }
}

export default SettingsService;
