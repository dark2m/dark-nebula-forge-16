
import { SiteSettings } from '../types/admin';

class SettingsService {
  private static SETTINGS_KEY = 'site_settings';

  static getSiteSettings(): SiteSettings {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (stored) {
      try {
        const settings = JSON.parse(stored);
        console.log('SettingsService: Loaded settings from storage:', settings);
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
      console.log('SettingsService: Saving settings:', settings);
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
      
      // إطلاق حدث لتحديث جميع المكونات
      const event = new CustomEvent('settingsUpdated', {
        detail: { settings }
      });
      window.dispatchEvent(event);
      
      console.log('SettingsService: Settings saved and event dispatched');
    } catch (error) {
      console.error('SettingsService: Error saving settings:', error);
      throw error;
    }
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
      ],
      contactInfo: {
        telegram: '@DarkTeam_Support',
        discord: 'Discord Server',
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

    // حفظ الإعدادات الافتراضية
    this.saveSiteSettings(defaultSettings);
    return defaultSettings;
  }
}

export default SettingsService;
