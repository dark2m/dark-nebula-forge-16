
class TranslationService {
  private static currentLanguage = 'ar';
  
  private static translations = {
    ar: {
      // Navigation
      'nav.pubg': 'هاكات ببجي',
      'nav.web': 'تطوير المواقع', 
      'nav.discord': 'بوتات ديسكورد',
      'nav.official': 'الصفحة الرسمية',
      'nav.admin': 'إدارة',
      'nav.tools': 'الأدوات',
      'nav.support': 'دعم العملاء',
      'nav.downloads': 'التحميلات',

      // Language Selector
      'language.arabic': 'العربية',
      'language.english': 'English',
      'language.turkish': 'Türkçe',
      'language.vietnamese': 'Tiếng Việt',

      // Common
      'common.features': 'المميزات',
      'common.add_to_cart': 'إضافة للسلة',
      'common.no_products': 'لا توجد منتجات متاحة حالياً',
      'common.no_services': 'لا توجد خدمات متاحة حالياً',
      'common.explore_now': 'استكشف الآن',

      // PUBG Page
      'pubg.page.title': 'هاكات ببجي موبايل',
      'pubg.page.subtitle': 'أقوى وأأمن هاكات ببجي موبايل مع ضمان عدم الحظر',
      'services.pubg.safety_title': 'الأمان والحماية',
      'services.pubg.safety_description': 'جميع هاكاتنا مطورة بأحدث التقنيات لضمان الأمان وعدم الكشف. نحن نضمن لك تجربة آمنة 100%.',
      'services.pubg.title': 'هاكات ببجي',
      'services.pubg.description': 'أحدث الهاكات والأدوات لببجي موبايل',

      // Web Development Page
      'web.page.title': 'تطوير المواقع',
      'web.page.subtitle': 'نصمم ونطور مواقع احترافية تناسب احتياجاتك',
      'services.web.services_title': 'خدماتنا',
      'services.web.title': 'تطوير المواقع',
      'services.web.description': 'تطوير مواقع احترافية ومتقدمة',

      // Discord Bots Page
      'discord.page.title': 'برمجة بوتات ديسكورد',
      'discord.page.subtitle': 'بوتات ديسكورد احترافية ومخصصة لخادمك',
      'discord.features.title': 'مميزات البوتات',
      'services.discord.title': 'بوتات ديسكورد',
      'services.discord.description': 'بوتات ديسكورد مخصصة ومتطورة',

      // Why Choose DARK
      'why.choose.delivery.title': 'سرعة التسليم',
      'why.choose.delivery.desc': 'احصل على منتجاتك فوراً مع نظام التسليم الآلي',
      'why.choose.safety.title': 'الأمان والحماية',
      'why.choose.safety.desc': 'جميع منتجاتنا آمنة ومحمية بأحدث التقنيات',
      'why.choose.quality.title': 'جودة مميزة',
      'why.choose.quality.desc': 'أعلى معايير الجودة في جميع منتجاتنا وخدماتنا',

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

      // Home Page
      'page.home.title': 'فريق DARK للحلول التقنية',
      'page.home.subtitle': 'نقدم أفضل الحلول التقنية في مجال البرمجة والألعاب',

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
      'nav.tools': 'Tools',
      'nav.support': 'Customer Support',
      'nav.downloads': 'Downloads',

      // Language Selector
      'language.arabic': 'العربية',
      'language.english': 'English',
      'language.turkish': 'Türkçe',
      'language.vietnamese': 'Tiếng Việt',

      // Common
      'common.features': 'Features',
      'common.add_to_cart': 'Add to Cart',
      'common.no_products': 'No products available currently',
      'common.no_services': 'No services available currently',
      'common.explore_now': 'Explore Now',

      // PUBG Page
      'pubg.page.title': 'PUBG Mobile Hacks',
      'pubg.page.subtitle': 'The strongest and safest PUBG Mobile hacks with anti-ban guarantee',
      'services.pubg.safety_title': 'Safety & Protection',
      'services.pubg.safety_description': 'All our hacks are developed with the latest technologies to ensure safety and undetection. We guarantee you a 100% safe experience.',
      'services.pubg.title': 'PUBG Hacks',
      'services.pubg.description': 'Latest hacks and tools for PUBG Mobile',

      // Web Development Page
      'web.page.title': 'Web Development',
      'web.page.subtitle': 'We design and develop professional websites that suit your needs',
      'services.web.services_title': 'Our Services',
      'services.web.title': 'Web Development',
      'services.web.description': 'Professional and advanced website development',

      // Discord Bots Page
      'discord.page.title': 'Discord Bot Programming',
      'discord.page.subtitle': 'Professional and custom Discord bots for your server',
      'discord.features.title': 'Bot Features',
      'services.discord.title': 'Discord Bots',
      'services.discord.description': 'Custom and advanced Discord bots',

      // Why Choose DARK
      'why.choose.delivery.title': 'Fast Delivery',
      'why.choose.delivery.desc': 'Get your products instantly with automatic delivery system',
      'why.choose.safety.title': 'Safety & Protection',
      'why.choose.safety.desc': 'All our products are safe and protected with latest technologies',
      'why.choose.quality.title': 'Premium Quality',
      'why.choose.quality.desc': 'Highest quality standards in all our products and services',

      // Official Page
      'official.page.title': 'Official Page',
      'official.page.subtitle': 'Get to know DARK team and our excellent services',
      'official.about.title': 'About Us',
      'official.about.content.p1': 'DARK team is a group of developers and programmers specialized in technology and gaming. We strive to provide the best technical services and products with quality and safety guarantee.',
      'official.about.content.p2': 'Our team was founded on strong foundations of experience and deep knowledge in programming and developing technical solutions. We pride ourselves on providing excellent services that meet our clients\' needs and exceed their expectations.',
      'official.why.security.title': 'Security',
      'official.why.security.desc': 'Safe products protected with latest technologies',
      'official.why.quality.title': 'Quality',
      'official.why.quality.desc': 'Highest quality standards in all our products',
      'official.why.support.title': 'Support',
      'official.why.support.desc': '24/7 technical support available for all our clients',
      'official.contact.title': 'Contact Us',

      // Home Page
      'page.home.title': 'DARK Team Technical Solutions',
      'page.home.subtitle': 'We provide the best technical solutions in programming and gaming',

      // Contact
      'contact.telegram': 'Telegram',
      'contact.discord': 'Discord',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'Email',
      'contact.phone': 'Phone',
      'contact.address': 'Address',

      // Admin
      'admin.login': 'Admin Login',
      'admin.login_description': 'Enter login credentials to access control panel',
      'admin.username': 'Username',
      'admin.password': 'Password',
      'admin.enter_username': 'Enter username',
      'admin.enter_password': 'Enter password',
      'admin.login_button': 'Login',
      'admin.logging_in': 'Logging in...',
      'admin.back_to_site': 'Back to Site'
    },

    tr: {
      // Navigation
      'nav.pubg': 'PUBG Hileleri',
      'nav.web': 'Web Geliştirme', 
      'nav.discord': 'Discord Botları',
      'nav.official': 'Resmi Sayfa',
      'nav.admin': 'Yönetim',
      'nav.tools': 'Araçlar',
      'nav.support': 'Müşteri Desteği',
      'nav.downloads': 'İndirmeler',

      // Language Selector
      'language.arabic': 'العربية',
      'language.english': 'English',
      'language.turkish': 'Türkçe',
      'language.vietnamese': 'Tiếng Việt',

      // Common
      'common.features': 'Özellikler',
      'common.add_to_cart': 'Sepete Ekle',
      'common.no_products': 'Şu anda mevcut ürün yok',
      'common.no_services': 'Şu anda mevcut hizmet yok',
      'common.explore_now': 'Şimdi Keşfet',

      // PUBG Page
      'pubg.page.title': 'PUBG Mobile Hileleri',
      'pubg.page.subtitle': 'Ban garantisi ile en güçlü ve güvenli PUBG Mobile hileleri',
      'services.pubg.safety_title': 'Güvenlik ve Koruma',
      'services.pubg.safety_description': 'Tüm hilelerimiz güvenlik ve tespit edilmemek için en son teknolojilerle geliştirilmiştir. Size %100 güvenli deneyim garantisi veriyoruz.',
      'services.pubg.title': 'PUBG Hileleri',
      'services.pubg.description': 'PUBG Mobile için en son hileler ve araçlar',

      // Web Development Page
      'web.page.title': 'Web Geliştirme',
      'web.page.subtitle': 'İhtiyaçlarınıza uygun profesyonel web siteleri tasarlıyor ve geliştiriyoruz',
      'services.web.services_title': 'Hizmetlerimiz',
      'services.web.title': 'Web Geliştirme',
      'services.web.description': 'Profesyonel ve gelişmiş web sitesi geliştirme',

      // Discord Bots Page
      'discord.page.title': 'Discord Bot Programlama',
      'discord.page.subtitle': 'Sunucunuz için profesyonel ve özelleştirilmiş Discord botları',
      'discord.features.title': 'Bot Özellikleri',
      'services.discord.title': 'Discord Botları',
      'services.discord.description': 'Özelleştirilmiş ve gelişmiş Discord botları',

      // Why Choose DARK
      'why.choose.delivery.title': 'Hızlı Teslimat',
      'why.choose.delivery.desc': 'Otomatik teslimat sistemi ile ürünlerinizi anında alın',
      'why.choose.safety.title': 'Güvenlik ve Koruma',
      'why.choose.safety.desc': 'Tüm ürünlerimiz en son teknolojilerle güvenli ve korunmuştur',
      'why.choose.quality.title': 'Premium Kalite',
      'why.choose.quality.desc': 'Tüm ürün ve hizmetlerimizde en yüksek kalite standartları',

      // Official Page
      'official.page.title': 'Resmi Sayfa',
      'official.page.subtitle': 'DARK ekibini ve mükemmel hizmetlerimizi tanıyın',
      'official.about.title': 'Hakkımızda',
      'official.about.content.p1': 'DARK ekibi, teknoloji ve oyun alanında uzmanlaşmış geliştiriciler ve programcılardan oluşan bir gruptur. Kalite ve güvenlik garantisi ile en iyi teknik hizmet ve ürünleri sağlamaya çalışıyoruz.',
      'official.about.content.p2': 'Ekibimiz, programlama ve teknik çözümler geliştirme konusunda deneyim ve derin bilgi temelinde kurulmuştur. Müşterilerimizin ihtiyaçlarını karşılayan ve beklentilerini aşan mükemmel hizmetler sağlamaktan gurur duyuyoruz.',
      'official.why.security.title': 'Güvenlik',
      'official.why.security.desc': 'En son teknolojilerle korunan güvenli ürünler',
      'official.why.quality.title': 'Kalite',
      'official.why.quality.desc': 'Tüm ürünlerimizde en yüksek kalite standartları',
      'official.why.support.title': 'Destek',
      'official.why.support.desc': 'Tüm müşterilerimiz için 7/24 teknik destek mevcuttur',
      'official.contact.title': 'Bize Ulaşın',

      // Home Page
      'page.home.title': 'DARK Ekibi Teknik Çözümler',
      'page.home.subtitle': 'Programlama ve oyun alanında en iyi teknik çözümleri sağlıyoruz',

      // Contact
      'contact.telegram': 'Telegram',
      'contact.discord': 'Discord',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'E-posta',
      'contact.phone': 'Telefon',
      'contact.address': 'Adres',

      // Admin
      'admin.login': 'Yönetici Girişi',
      'admin.login_description': 'Kontrol paneline erişmek için giriş bilgilerini girin',
      'admin.username': 'Kullanıcı Adı',
      'admin.password': 'Şifre',
      'admin.enter_username': 'Kullanıcı adını girin',
      'admin.enter_password': 'Şifreyi girin',
      'admin.login_button': 'Giriş Yap',
      'admin.logging_in': 'Giriş yapılıyor...',
      'admin.back_to_site': 'Siteye Dön'
    },

    vi: {
      // Navigation
      'nav.pubg': 'Hack PUBG',
      'nav.web': 'Phát triển Web', 
      'nav.discord': 'Bot Discord',
      'nav.official': 'Trang Chính thức',
      'nav.admin': 'Quản trị',
      'nav.tools': 'Công cụ',
      'nav.support': 'Hỗ trợ Khách hàng',
      'nav.downloads': 'Tải xuống',

      // Language Selector
      'language.arabic': 'العربية',
      'language.english': 'English',
      'language.turkish': 'Türkçe',
      'language.vietnamese': 'Tiếng Việt',

      // Common
      'common.features': 'Tính năng',
      'common.add_to_cart': 'Thêm vào giỏ',
      'common.no_products': 'Hiện tại không có sản phẩm nào',
      'common.no_services': 'Hiện tại không có dịch vụ nào',
      'common.explore_now': 'Khám phá ngay',

      // PUBG Page
      'pubg.page.title': 'Hack PUBG Mobile',
      'pubg.page.subtitle': 'Hack PUBG Mobile mạnh nhất và an toàn nhất với bảo đảm không bị ban',
      'services.pubg.safety_title': 'An toàn & Bảo vệ',
      'services.pubg.safety_description': 'Tất cả hack của chúng tôi được phát triển với công nghệ mới nhất để đảm bảo an toàn và không bị phát hiện. Chúng tôi đảm bảo cho bạn trải nghiệm an toàn 100%.',
      'services.pubg.title': 'Hack PUBG',
      'services.pubg.description': 'Hack và công cụ mới nhất cho PUBG Mobile',

      // Web Development Page
      'web.page.title': 'Phát triển Web',
      'web.page.subtitle': 'Chúng tôi thiết kế và phát triển các trang web chuyên nghiệp phù hợp với nhu cầu của bạn',
      'services.web.services_title': 'Dịch vụ của chúng tôi',
      'services.web.title': 'Phát triển Web',
      'services.web.description': 'Phát triển trang web chuyên nghiệp và tiên tiến',

      // Discord Bots Page
      'discord.page.title': 'Lập trình Bot Discord',
      'discord.page.subtitle': 'Bot Discord chuyên nghiệp và tùy chỉnh cho máy chủ của bạn',
      'discord.features.title': 'Tính năng Bot',
      'services.discord.title': 'Bot Discord',
      'services.discord.description': 'Bot Discord tùy chỉnh và tiên tiến',

      // Why Choose DARK
      'why.choose.delivery.title': 'Giao hàng nhanh',
      'why.choose.delivery.desc': 'Nhận sản phẩm ngay lập tức với hệ thống giao hàng tự động',
      'why.choose.safety.title': 'An toàn & Bảo vệ',
      'why.choose.safety.desc': 'Tất cả sản phẩm của chúng tôi đều an toàn và được bảo vệ bằng công nghệ mới nhất',
      'why.choose.quality.title': 'Chất lượng cao cấp',
      'why.choose.quality.desc': 'Tiêu chuẩn chất lượng cao nhất trong tất cả sản phẩm và dịch vụ của chúng tôi',

      // Official Page
      'official.page.title': 'Trang Chính thức',
      'official.page.subtitle': 'Tìm hiểu về đội ngũ DARK và các dịch vụ xuất sắc của chúng tôi',
      'official.about.title': 'Về chúng tôi',
      'official.about.content.p1': 'Đội ngũ DARK là một nhóm các nhà phát triển và lập trình viên chuyên về công nghệ và game. Chúng tôi cố gắng cung cấp các dịch vụ và sản phẩm kỹ thuật tốt nhất với đảm bảo chất lượng và an toàn.',
      'official.about.content.p2': 'Đội ngũ của chúng tôi được thành lập trên nền tảng vững chắc của kinh nghiệm và kiến thức sâu rộng trong lập trình và phát triển giải pháp kỹ thuật. Chúng tôi tự hào cung cấp các dịch vụ xuất sắc đáp ứng nhu cầu của khách hàng và vượt quá mong đợi của họ.',
      'official.why.security.title': 'Bảo mật',
      'official.why.security.desc': 'Sản phẩm an toàn được bảo vệ bằng công nghệ mới nhất',
      'official.why.quality.title': 'Chất lượng',
      'official.why.quality.desc': 'Tiêu chuẩn chất lượng cao nhất trong tất cả sản phẩm của chúng tôi',
      'official.why.support.title': 'Hỗ trợ',
      'official.why.support.desc': 'Hỗ trợ kỹ thuật 24/7 có sẵn cho tất cả khách hàng của chúng tôi',
      'official.contact.title': 'Liên hệ với chúng tôi',

      // Home Page
      'page.home.title': 'Đội ngũ DARK Giải pháp Kỹ thuật',
      'page.home.subtitle': 'Chúng tôi cung cấp các giải pháp kỹ thuật tốt nhất trong lập trình và game',

      // Contact
      'contact.telegram': 'Telegram',
      'contact.discord': 'Discord',
      'contact.whatsapp': 'WhatsApp',
      'contact.email': 'Email',
      'contact.phone': 'Điện thoại',
      'contact.address': 'Địa chỉ',

      // Admin
      'admin.login': 'Đăng nhập Quản trị',
      'admin.login_description': 'Nhập thông tin đăng nhập để truy cập bảng điều khiển',
      'admin.username': 'Tên người dùng',
      'admin.password': 'Mật khẩu',
      'admin.enter_username': 'Nhập tên người dùng',
      'admin.enter_password': 'Nhập mật khẩu',
      'admin.login_button': 'Đăng nhập',
      'admin.logging_in': 'Đang đăng nhập...',
      'admin.back_to_site': 'Quay lại trang web'
    }
  };

  static getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  static setLanguage(language: string) {
    this.currentLanguage = language;
    
    // تحديث اتجاه الصفحة
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }

    // حفظ اللغة في localStorage
    localStorage.setItem('selectedLanguage', language);

    // إرسال event للمكونات الأخرى
    window.dispatchEvent(new CustomEvent('languageChanged', {
      detail: { language }
    }));
  }

  static translate(key: string): string {
    const currentTranslations = this.translations[this.currentLanguage];
    return currentTranslations?.[key] || key;
  }

  static initialize() {
    // استرجاع اللغة المحفوظة
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'ar';
    this.setLanguage(savedLanguage);
  }

  static getSupportedLanguages() {
    return [
      { code: 'ar', name: this.translate('language.arabic'), flag: '🇸🇦' },
      { code: 'en', name: this.translate('language.english'), flag: '🇺🇸' },
      { code: 'tr', name: this.translate('language.turkish'), flag: '🇹🇷' },
      { code: 'vi', name: this.translate('language.vietnamese'), flag: '🇻🇳' }
    ];
  }
}

// تهيئة الخدمة عند تحميل الصفحة
if (typeof window !== 'undefined') {
  TranslationService.initialize();
}

export default TranslationService;
