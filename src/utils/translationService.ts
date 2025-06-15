
class TranslationService {
  private static translations: Record<string, string> = {
    // Common translations
    'common.features': 'المميزات',
    'common.add_to_cart': 'أضف إلى السلة',
    'common.no_products': 'لا توجد منتجات متاحة',
    
    // Discord page translations
    'discord.page.subtitle': 'اكتشف مجموعتنا المميزة من بوتات الديسكورد المتقدمة',
    'discord.features.title': 'المميزات الرئيسية',
    
    // Home page translations
    'home.hero.title': 'DARK',
    'home.hero.subtitle': 'منصة متقدمة لجميع احتياجاتك التقنية',
    
    // Navigation translations
    'nav.home': 'الرئيسية',
    'nav.official': 'الصفحة الرسمية',
    'nav.pubg': 'ببجي موبايل',
    'nav.web': 'برمجة المواقع',
    'nav.discord': 'بوتات الديسكورد',
    'nav.admin': 'الإدارة',
  };

  static translate(key: string): string {
    return this.translations[key] || key;
  }

  static addTranslation(key: string, value: string): void {
    this.translations[key] = value;
  }

  static addTranslations(translations: Record<string, string>): void {
    this.translations = { ...this.translations, ...translations };
  }

  static getAllTranslations(): Record<string, string> {
    return { ...this.translations };
  }
}

export default TranslationService;
