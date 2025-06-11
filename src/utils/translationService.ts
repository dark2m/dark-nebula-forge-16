
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
    'nav.language': { ar: 'عَرَبِيّ', en: 'English' },
    
    // Common
    'common.cart': { ar: 'السلة', en: 'Cart' },
    'common.buy': { ar: 'شراء', en: 'Buy' },
    'common.add_to_cart': { ar: 'أضف للسلة', en: 'Add to Cart' },
    'common.price': { ar: 'السعر', en: 'Price' },
    'common.features': { ar: 'المميزات', en: 'Features' },
    'common.contact': { ar: 'تواصل معنا', en: 'Contact Us' },
    'common.explore_now': { ar: 'استكشف الآن', en: 'Explore Now' },
    'common.no_products': { ar: 'لا توجد منتجات متاحة حالياً', en: 'No products available at the moment' },
    'common.no_services': { ar: 'لا توجد خدمات متاحة حالياً', en: 'No services available at the moment' },
    'common.safety': { ar: 'الأمان', en: 'Safety' },
    'common.services': { ar: 'الخدمات', en: 'Services' },
    
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
    'admin.login': { ar: 'تسجيل دخول الإدارة', en: 'Admin Login' },
    'admin.login_description': { ar: 'قم بإدخال بيانات الدخول للوصول للوحة التحكم', en: 'Enter your credentials to access the admin dashboard' },
    'admin.username': { ar: 'اسم المستخدم', en: 'Username' },
    'admin.password': { ar: 'كلمة المرور', en: 'Password' },
    'admin.login_button': { ar: 'تسجيل الدخول', en: 'Login' },
    'admin.logging_in': { ar: 'جاري تسجيل الدخول...', en: 'Logging in...' },
    'admin.back_to_site': { ar: 'العودة للموقع', en: 'Back to Site' },
    'admin.enter_username': { ar: 'أدخل اسم المستخدم', en: 'Enter username' },
    'admin.enter_password': { ar: 'أدخل كلمة المرور', en: 'Enter password' },
    
    // Page Titles
    'page.home.title': { ar: 'مرحباً بك في DARK', en: 'Welcome to DARK' },
    'page.home.subtitle': { ar: 'نوفر لك أفضل الخدمات في مجال التقنية والبرمجة', en: 'We provide you with the best services in technology and programming' },
    'page.about.title': { ar: 'من نحن', en: 'About Us' },
    'page.contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
    
    // Services
    'services.pubg.title': { ar: 'هكر ببجي موبايل', en: 'PUBG Mobile Hacks' },
    'services.pubg.description': { ar: 'أحدث الهاكات والأدوات لببجي موبايل', en: 'Latest hacks and tools for PUBG Mobile' },
    'services.pubg.safety_title': { ar: 'الأمان والحماية', en: 'Safety and Protection' },
    'services.pubg.safety_description': { ar: 'جميع هاكاتنا آمنة ومحمية من الحظر', en: 'All our hacks are safe and protected from bans' },
    'services.web.title': { ar: 'برمجة مواقع', en: 'Web Development' },
    'services.web.description': { ar: 'تطوير مواقع احترافية ومتقدمة', en: 'Professional and advanced website development' },
    'services.web.services_title': { ar: 'خدماتنا', en: 'Our Services' },
    'services.discord.title': { ar: 'برمجة بوتات ديسكورد', en: 'Discord Bots' },
    'services.discord.description': { ar: 'بوتات ديسكورد مخصصة ومتطورة', en: 'Custom and advanced Discord bots' },
    
    // Discord Bots Page
    'discord.page.title': { ar: 'برمجة بوتات ديسكورد', en: 'Discord Bot Development' },
    'discord.page.subtitle': { ar: 'بوتات ديسكورد مخصصة ومتطورة لخدمة سيرفرك', en: 'Custom and advanced Discord bots to serve your server' },
    'discord.features.title': { ar: 'مميزات البوتات', en: 'Bot Features' },
    
    // PUBG Hacks Page
    'pubg.page.title': { ar: 'هكر ببجي موبايل', en: 'PUBG Mobile Hacks' },
    'pubg.page.subtitle': { ar: 'أحدث الهاكات والأدوات لببجي موبايل', en: 'Latest hacks and tools for PUBG Mobile' },
    
    // Web Development Page
    'web.page.title': { ar: 'برمجة مواقع', en: 'Web Development' },
    'web.page.subtitle': { ar: 'تطوير مواقع احترافية ومتقدمة', en: 'Professional and advanced website development' },
    
    // Official Page
    'official.page.title': { ar: 'الصفحة الرسمية', en: 'Official Page' },
    'official.page.subtitle': { ar: 'معلومات رسمية عن خدماتنا وفريق العمل', en: 'Official information about our services and team' },
    'official.about.title': { ar: 'من نحن', en: 'About Us' },
    'official.contact.title': { ar: 'تواصل معنا', en: 'Contact Us' },
    
    // Contact Info
    'contact.telegram': { ar: 'تليجرام', en: 'Telegram' },
    'contact.discord': { ar: 'ديسكورد', en: 'Discord' },
    'contact.whatsapp': { ar: 'واتساب', en: 'WhatsApp' },
    'contact.email': { ar: 'البريد الإلكتروني', en: 'Email' },
    'contact.phone': { ar: 'الهاتف', en: 'Phone' },
    'contact.address': { ar: 'العنوان', en: 'Address' },
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
