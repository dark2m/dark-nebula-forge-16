
interface TranslationTexts {
  [key: string]: {
    ar: string;
    en: string;
  };
}

class TranslationService {
  private static LANGUAGE_KEY = 'site_language';
  
  // النصوص المترجمة للموقع
  private static translations: TranslationTexts = {
    // Navigation
    'nav.home': { ar: 'الرئيسية', en: 'Home' },
    'nav.pubg': { ar: 'هكر ببجي موبايل', en: 'PUBG Mobile Hacks' },
    'nav.web': { ar: 'برمجة مواقع', en: 'Web Development' },
    'nav.discord': { ar: 'برمجة بوتات ديسكورد', en: 'Discord Bots' },
    'nav.official': { ar: 'الصفحة الرئيسية', en: 'Official Page' },
    'nav.admin': { ar: 'الإدارة', en: 'Admin' },
    
    // Common
    'common.cart': { ar: 'السلة', en: 'Cart' },
    'common.buy': { ar: 'شراء', en: 'Buy' },
    'common.add_to_cart': { ar: 'أضف للسلة', en: 'Add to Cart' },
    'common.price': { ar: 'السعر', en: 'Price' },
    'common.features': { ar: 'المميزات', en: 'Features' },
    'common.contact': { ar: 'تواصل معنا', en: 'Contact Us' },
    
    // Admin Panel
    'admin.dashboard': { ar: 'لوحة التحكم', en: 'Dashboard' },
    'admin.products': { ar: 'إدارة المنتجات', en: 'Product Management' },
    'admin.settings': { ar: 'الإعدادات', en: 'Settings' },
    'admin.users': { ar: 'المستخدمين', en: 'Users' },
    'admin.save': { ar: 'حفظ', en: 'Save' },
    'admin.cancel': { ar: 'إلغاء', en: 'Cancel' },
    'admin.delete': { ar: 'حذف', en: 'Delete' },
    'admin.edit': { ar: 'تعديل', en: 'Edit' },
    'admin.add': { ar: 'إضافة', en: 'Add' },
    
    // Page Titles
    'page.home.title': { ar: 'مرحباً بك في DARK', en: 'Welcome to DARK' },
    'page.home.subtitle': { ar: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة', en: 'We provide you with the best services in technology and programming' },
    'page.about.title': { ar: 'من نحن', en: 'About Us' },
    'page.contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
  };

  static getCurrentLanguage(): 'ar' | 'en' {
    return (localStorage.getItem(this.LANGUAGE_KEY) as 'ar' | 'en') || 'ar';
  }

  static setLanguage(language: 'ar' | 'en'): void {
    localStorage.setItem(this.LANGUAGE_KEY, language);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // إشعار جميع المكونات بالتغيير
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
  }

  static toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    this.setLanguage(currentLang === 'ar' ? 'en' : 'ar');
  }

  static translate(key: string, fallback?: string): string {
    const currentLang = this.getCurrentLanguage();
    const translation = this.translations[key];
    
    if (translation && translation[currentLang]) {
      return translation[currentLang];
    }
    
    return fallback || key;
  }

  static addTranslation(key: string, ar: string, en: string): void {
    this.translations[key] = { ar, en };
  }

  static getTranslations(): TranslationTexts {
    return this.translations;
  }

  static updateTranslations(newTranslations: TranslationTexts): void {
    this.translations = { ...this.translations, ...newTranslations };
  }
}

export default TranslationService;
