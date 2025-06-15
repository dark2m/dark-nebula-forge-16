// Main AdminStorage class that combines all services
import AuthService from './auth';
import CartService from './cartService';
import ProductService from './productService';
import UserService from './userService';
import SettingsService from './settingsService';

// Re-export types for backward compatibility
export type { Product, AdminUser, SiteSettings, PageTexts, CartItem } from '../types/admin';

class AdminStorage {
  // Authentication methods
  static authenticateAdmin = AuthService.authenticateAdmin;
  static getCurrentUser = AuthService.getCurrentUser;
  static isAdminAuthenticated = AuthService.isAdminAuthenticated;
  static hasPermission = AuthService.hasPermission;

  // Cart methods - محدثة لدعم الفئات المنفصلة
  static getCart(category?: string) {
    return CartService.getCart(category);
  }
  
  static addToCart = CartService.addToCart;
  
  static removeFromCart(id: number, category: string) {
    return CartService.removeFromCart(id, category);
  }
  
  static clearCart = CartService.clearCart;
  
  static getCartCount(category?: string) {
    return CartService.getCartCount(category);
  }

  // Product methods
  static getProducts = ProductService.getProducts;
  static saveProducts = ProductService.saveProducts;
  static addProduct = ProductService.addProduct;
  static updateProduct = ProductService.updateProduct;
  static deleteProduct = ProductService.deleteProduct;

  // User methods
  static getAdminUsers = UserService.getAdminUsers;
  static saveAdminUsers = UserService.saveAdminUsers;
  static updateAdminUser = UserService.updateAdminUser;
  static addAdminUser = UserService.addAdminUser;
  static deleteAdminUser = UserService.deleteAdminUser;

  // Settings methods - مع ضمان إرجاع إعدادات افتراضية
  static getSiteSettings() {
    const settings = SettingsService.getSiteSettings();
    // التأكد من وجود جميع الخصائص المطلوبة
    if (!settings || !settings.pageTexts || !settings.backgroundSettings) {
      return this.getDefaultSiteSettings();
    }
    return settings;
  }
  
  static saveSiteSettings = SettingsService.saveSiteSettings;

  // إضافة method للحصول على الإعدادات الافتراضية
  static getDefaultSiteSettings(): SiteSettings {
    return {
      title: 'DARK',
      titleSize: 'xl' as const,
      description: 'موقع DARK للخدمات التقنية',
      colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
      globalTextSize: 'medium' as const,
      backgroundSettings: { 
        type: 'color' as const, 
        value: '#000000',
        starCount: 80,
        starSize: 'medium' as const,
        starOpacity: 0.8,
        meteorCount: 10,
        meteorSize: 'medium' as const,
        meteorOpacity: 0.7,
        meteorDirection: 'down' as const,
        meteorColors: ['#4ecdc4', '#45b7d1', '#ffeaa7', '#fd79a8', '#a8e6cf', '#81ecec'],
        animationSpeed: 'normal' as const
      },
      navigation: [],
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
        features: []
      },
      typography: {
        fontFamily: 'system' as const,
        headingWeight: 'bold' as const,
        bodyWeight: 'normal' as const,
        lineHeight: 'normal' as const
      },
      design: {
        borderRadius: 'medium' as const,
        shadows: 'medium' as const,
        spacing: 'normal' as const,
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
        },
        downloads: {
          title: "مركز التنزيلات",
          subtitle: "احصل على أفضل الأدوات والبرامج المتخصصة مجاناً",
          categories: {
            all: "الكل",
            games: "ألعاب",
            tools: "أدوات", 
            design: "تصميم",
            programming: "برمجة",
            music: "موسيقى",
            video: "فيديو",
            books: "كتب",
            security: "أمان"
          },
          buttons: {
            download: "تنزيل",
            filter: "تصفية"
          },
          labels: {
            size: "الحجم",
            downloads: "التنزيلات",
            rating: "التقييم",
            version: "الإصدار",
            lastUpdate: "آخر تحديث",
            features: "المميزات",
            status: "الحالة"
          },
          stats: {
            totalDownloads: "إجمالي التنزيلات",
            availableFiles: "ملفات متاحة",
            averageRating: "متوسط التقييم"
          },
          placeholders: {
            search: "البحث في التنزيلات...",
            noResults: "لا توجد نتائج"
          }
        }
      }
    };

    // حفظ الإعدادات الافتراضية إذا لم تكن موجودة
    SettingsService.saveSiteSettings(defaultSettings);
    return defaultSettings;
  }
}

export default AdminStorage;
