class TranslationService {
  private static currentLanguage: 'ar' | 'en' = 'ar';

  private static translations = {
    ar: {
      // Navigation
      'nav.pubg': 'هاكات ببجي',
      'nav.web': 'تطوير المواقع', 
      'nav.discord': 'بوتات ديسكورد',
      'nav.official': 'الصفحة الرسمية',
      'nav.admin': 'إدارة',
      'nav.language': 'EN',

      // Common
      'common.features': 'المميزات',
      'common.add_to_cart': 'إضافة للسلة',
      'common.no_products': 'لا توجد منتجات متاحة حالياً',
      'common.no_services': 'لا توجد خدمات متاحة حالياً',

      // PUBG Page
      'pubg.page.title': 'هاكات ببجي موبايل',
      'pubg.page.subtitle': 'أقوى وأأمن هاكات ببجي موبايل مع ضمان عدم الحظر',
      'services.pubg.safety_title': 'الأمان والحماية',
      'services.pubg.safety_description': 'جميع هاكاتنا مطورة بأحدث التقنيات لضمان الأمان وعدم الكشف. نحن نضمن لك تجربة آمنة 100%.',

      // Web Development Page
      'web.page.title': 'تطوير المواقع',
      'web.page.subtitle': 'نصمم ونطور مواقع احترافية تناسب احتياجاتك',
      'services.web.services_title': 'خدماتنا',

      // Discord Bots Page
      'discord.page.title': 'برمجة بوتات ديسكورد',
      'discord.page.subtitle': 'بوتات ديسكورد احترافية ومخصصة لخادمك',
      'discord.features.title': 'مميزات البوتات',

      // Official Page
      'official.page.title': 'الصفحة الرسمية',
      'official.page.subtitle': 'تعرف على فريق DARK وخدماتنا المتميزة',
      'official.about.title': 'من نحن',
      'official.about.content.p1': 'فريق DARK هو مجموعة من المطورين والمبرمجين المتخصصين في مجال التقنية والألعاب. نحن نسعى لتقديم أفضل الخدمات والمنتجات التقنية مع ضمان الجودة والأمان.',
      'official.about.content.p2': 'تأسس فريقنا على أسس قوية من الخبرة والمعرفة العميقة في مجال البرمجة وتطوير الحلول التقنية. نحن نفخر بتقديم خدمات متميزة تلبي احتياجات عملائنا وتفوق توقعاتهم.',
      'official.why.security.title': 'الأمان',
      'official.why.security.desc': 'منتجات آمنة ومحمية بأحدث التقنيات',
      'official.why.quality.title': 'الجودة',
      'official.why.quality.desc': 'أعلى معايير الجودة في جميع منتجاتنا',
      'official.why.support.title': 'الدعم',
      'official.why.support.desc': 'دعم فني متاح 24/7 لجميع عملائنا',
      'official.contact.title': 'تواصل معنا',

      // New Why Choose DARK section
      'why.choose.dark.title': 'لماذا تختار DARK؟',
      'why.choose.delivery.title': 'سرعة التسليم',
      'why.choose.delivery.desc': 'نلتزم بتسليم جميع الطلبات في الوقت المحدد',
      'why.choose.safety.title': 'الأمان والحماية',
      'why.choose.safety.desc': 'جميع منتجاتنا آمنة ومحمية ضد الاكتشاف',
      'why.choose.quality.title': 'جودة عالية',
      'why.choose.quality.desc': 'نقدم أفضل جودة في السوق بأسعار منافسة',

      // Contact
      'contact.telegram': 'تيليجرام',
      'contact.discord': 'ديسكورد',
      'contact.whatsapp': 'واتساب',
      'contact.email': 'البريد الإلكتروني',
      'contact.phone': 'الهاتف',
      'contact.address': 'العنوان',

      // Admin
      'admin.login': 'تسجيل دخول الإدارة',
      'admin.login_description': 'أدخل بيانات الدخول للوصول لوحة التحكم',
      'admin.username': 'اسم المستخدم',
      'admin.password': 'كلمة المرور',
      'admin.enter_username': 'أدخل اسم المستخدم',
      'admin.enter_password': 'أدخل كلمة المرور',
      'admin.login_button': 'تسجيل الدخول',
      'admin.logging_in': 'جاري تسجيل الدخول...',
      'admin.back_to_site': 'العودة للموقع'
    },
    en: {
      // Navigation
      'nav.pubg': 'PUBG Hacks',
      'nav.web': 'Web Development',
      'nav.discord': 'Discord Bots',
      'nav.official': 'Official Page',
      'nav.admin': 'Admin',
      'nav.language': 'عر',

      // Common
      'common.features': 'Features',
      'common.add_to_cart': 'Add to Cart',
      'common.no_products': 'No products available at the moment',
      'common.no_services': 'No services available at the moment',

      // PUBG Page
      'pubg.page.title': 'PUBG Mobile Hacks',
      'pubg.page.subtitle': 'The most powerful and secure PUBG Mobile hacks with ban protection guarantee',
      'services.pubg.safety_title': 'Safety & Protection',
      'services.pubg.safety_description': 'All our hacks are developed with the latest technologies to ensure safety and undetectability. We guarantee you a 100% safe experience.',

      // Web Development Page
      'web.page.title': 'Web Development',
      'web.page.subtitle': 'We design and develop professional websites that suit your needs',
      'services.web.services_title': 'Our Services',

      // Discord Bots Page
      'discord.page.title': 'Discord Bot Development',
      'discord.page.subtitle': 'Professional and custom Discord bots for your server',
      'discord.features.title': 'Bot Features',

      // Official Page
      'official.page.title': 'Official Page',
      'official.page.subtitle': 'Learn about DARK team and our distinguished services',
      'official.about.title': 'About Us',
      'official.about.content.p1': 'DARK team is a group of developers and programmers specialized in technology and gaming. We strive to provide the best technical services and products with quality and security guarantee.',
      'official.about.content.p2': 'Our team was founded on strong foundations of experience and deep knowledge in programming and developing technical solutions. We pride ourselves on providing excellent services that meet our customers\' needs and exceed their expectations.',
      'official.why.security.title': 'Security',
      'official.why.security.desc': 'Safe products protected by the latest technologies',
      'official.why.quality.title': 'Quality',
      'official.why.quality.desc': 'Highest quality standards in all our products',
      'official.why.support.title': 'Support',
      'official.why.support.desc': '24/7 technical support available for all our customers',
      'official.contact.title': 'Contact Us',

      // New Why Choose DARK section
      'why.choose.dark.title': 'Why Choose DARK?',
      'why.choose.delivery.title': 'Fast Delivery',
      'why.choose.delivery.desc': 'We commit to delivering all orders on time',
      'why.choose.safety.title': 'Safety & Protection',
      'why.choose.safety.desc': 'All our products are safe and protected against detection',
      'why.choose.quality.title': 'High Quality',
      'why.choose.quality.desc': 'We provide the best quality in the market at competitive prices',

      // Contact
      'contact.telegram': 'Telegram',
      'contact.discord': 'Discord',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'Email',
      'contact.phone': 'Phone',
      'contact.address': 'Address',

      // Admin
      'admin.login': 'Admin Login',
      'admin.login_description': 'Enter your credentials to access the dashboard',
      'admin.username': 'Username',
      'admin.password': 'Password',
      'admin.enter_username': 'Enter username',
      'admin.enter_password': 'Enter password',
      'admin.login_button': 'Login',
      'admin.logging_in': 'Logging in...',
      'admin.back_to_site': 'Back to Site'
    }
  };

  static getCurrentLanguage(): 'ar' | 'en' {
    return this.currentLanguage;
  }

  static setLanguage(language: 'ar' | 'en') {
    this.currentLanguage = language;
    localStorage.setItem('language', language);
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // إرسال حدث تغيير اللغة
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language } 
    }));
  }

  static toggleLanguage() {
    const newLanguage = this.currentLanguage === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLanguage);
  }

  static translate(key: string): string {
    const translation = this.translations[this.currentLanguage][key];
    return translation || key;
  }

  static initialize() {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en';
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      this.setLanguage(savedLanguage);
    } else {
      this.setLanguage('ar'); // اللغة الافتراضية
    }
  }
}

// تهيئة الخدمة عند تحميل الصفحة
if (typeof window !== 'undefined') {
  TranslationService.initialize();
}

export default TranslationService;
