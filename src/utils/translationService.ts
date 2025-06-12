
class TranslationService {
  private static translations = {
    // Navigation
    'nav.pubg': 'هاكات ببجي',
    'nav.web': 'تطوير المواقع', 
    'nav.discord': 'بوتات ديسكورد',
    'nav.official': 'الصفحة الرسمية',
    'nav.admin': 'إدارة',

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

    // Why Choose DARK - Back to Arabic
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
  };

  static translate(key: string): string {
    return this.translations[key] || key;
  }

  static initialize() {
    // تعيين اتجاه الصفحة للعربية
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }
}

// تهيئة الخدمة عند تحميل الصفحة
if (typeof window !== 'undefined') {
  TranslationService.initialize();
}

export default TranslationService;
