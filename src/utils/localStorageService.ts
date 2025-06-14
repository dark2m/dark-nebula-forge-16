
// Local storage service for managing site data without Supabase
import { SiteSettings, Product, AdminUser, Tool } from '@/types/admin';

const STORAGE_KEYS = {
  SITE_SETTINGS: 'site_settings',
  PRODUCTS: 'products',
  ADMIN_USERS: 'admin_users',
  TOOLS: 'tools',
  CART: 'cart'
};

// Default site settings
const defaultSiteSettings: SiteSettings = {
  title: 'موقع احترافي',
  titleSize: 'xl',
  description: 'موقع متطور للخدمات الرقمية',
  colors: {
    primary: '#3b82f6',
    secondary: '#64748b',
    accent: '#f59e0b'
  },
  globalTextSize: 'medium',
  backgroundSettings: {
    type: 'color',
    value: '#0f172a',
    starCount: 100,
    meteorCount: 5,
    animationSpeed: 'normal',
    starOpacity: 0.8,
    meteorOpacity: 0.9,
    starSize: 'medium',
    meteorSize: 'medium',
    meteorDirection: 'down',
    meteorColors: ['#3b82f6', '#f59e0b', '#ef4444']
  },
  navigation: [
    { id: 'home', name: 'الرئيسية', path: '/', icon: 'Home', visible: true },
    { id: 'pubg', name: 'هاكات PUBG', path: '/pubg-hacks', icon: 'Gamepad2', visible: true },
    { id: 'web', name: 'تطوير المواقع', path: '/web-development', icon: 'Code', visible: true },
    { id: 'discord', name: 'بوتات Discord', path: '/discord-bots', icon: 'Bot', visible: true },
    { id: 'tools', name: 'الأدوات', path: '/tool', icon: 'Wrench', visible: true },
    { id: 'support', name: 'الدعم الفني', path: '/sport', icon: 'HeadphonesIcon', visible: true },
    { id: 'official', name: 'الصفحة الرسمية', path: '/official', icon: 'Shield', visible: true }
  ],
  contactInfo: {
    whatsapp: '+1234567890',
    email: 'info@example.com',
    phone: '+1234567890',
    address: 'العنوان هنا'
  },
  homePage: {
    heroTitle: 'مرحباً بك في موقعنا الاحترافي',
    heroSubtitle: 'نقدم أفضل الخدمات الرقمية',
    featuresTitle: 'خدماتنا المميزة',
    features: [
      {
        id: 'feature1',
        icon: 'Shield',
        title: 'أمان عالي',
        description: 'نضمن أعلى مستويات الأمان',
        visible: true
      },
      {
        id: 'feature2',
        icon: 'Zap',
        title: 'سرعة فائقة',
        description: 'خدمات سريعة وموثوقة',
        visible: true
      },
      {
        id: 'feature3',
        icon: 'Heart',
        title: 'دعم 24/7',
        description: 'نحن هنا لمساعدتك دائماً',
        visible: true
      }
    ]
  },
  typography: {
    fontFamily: 'Inter',
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
      heroTitle: 'مرحباً بك في موقعنا الاحترافي',
      heroSubtitle: 'نقدم أفضل الخدمات الرقمية',
      featuresTitle: 'خدماتنا المميزة',
      features: [
        {
          id: 'feature1',
          icon: 'Shield',
          title: 'أمان عالي',
          description: 'نضمن أعلى مستويات الأمان',
          visible: true
        }
      ]
    },
    official: {
      pageTitle: 'الصفحة الرسمية',
      pageSubtitle: 'معلومات عن موقعنا',
      aboutTitle: 'من نحن',
      aboutContent: ['نحن فريق محترف', 'نقدم خدمات عالية الجودة'],
      whyChooseTitle: 'لماذا تختارنا',
      whyChooseItems: [
        {
          icon: 'Star',
          title: 'جودة عالية',
          description: 'نقدم أفضل الخدمات'
        }
      ],
      contactTitle: 'تواصل معنا'
    },
    pubgHacks: {
      pageTitle: 'هاكات PUBG',
      pageSubtitle: 'أدوات تطوير اللعبة',
      safetyTitle: 'الأمان',
      safetyDescription: 'جميع أدواتنا آمنة'
    },
    webDevelopment: {
      pageTitle: 'تطوير المواقع',
      pageSubtitle: 'خدمات تطوير احترافية',
      servicesTitle: 'خدماتنا'
    },
    discordBots: {
      pageTitle: 'بوتات Discord',
      pageSubtitle: 'بوتات ذكية ومطورة',
      featuresTitle: 'المميزات'
    },
    navigation: {
      homeTitle: 'الرئيسية',
      pubgTitle: 'هاكات PUBG',
      webTitle: 'تطوير المواقع',
      discordTitle: 'بوتات Discord',
      officialTitle: 'الصفحة الرسمية',
      adminTitle: 'لوحة التحكم'
    },
    cart: {
      cartTitle: 'سلة التسوق',
      emptyCartMessage: 'السلة فارغة',
      purchaseButton: 'شراء',
      purchaseNote: 'ملاحظة الشراء',
      addToCartButton: 'إضافة للسلة',
      removeButton: 'حذف'
    },
    tools: {
      pageTitle: 'الأدوات',
      pageSubtitle: 'مجموعة من الأدوات المفيدة'
    },
    customerSupport: {
      pageTitle: 'الدعم الفني',
      pageDescription: 'نحن هنا لمساعدتك',
      workingHoursTitle: 'ساعات العمل',
      workingHours: {
        weekdays: 'الأحد - الخميس: 9ص - 6م',
        friday: 'الجمعة: 2م - 6م'
      },
      supportNote: 'يمكنك التواصل معنا في أي وقت'
    }
  },
  tools: [
    {
      id: 1,
      title: 'مولد كلمات المرور',
      description: 'أنشئ كلمات مرور قوية وآمنة',
      buttonText: 'استخدم الأداة',
      url: '/password-generator',
      icon: 'Key',
      visible: true,
      category: 'أمان'
    }
  ]
};

// Default products
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'منتج تجريبي',
    price: 99,
    category: 'برمجة',
    description: 'منتج تجريبي للاختبار',
    features: ['ميزة 1', 'ميزة 2'],
    images: [],
    videos: [],
    textSize: 'medium',
    titleSize: 'large'
  }
];

// Default admin users
const defaultAdminUsers: AdminUser[] = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    role: 'مدير عام'
  }
];

export class LocalStorageService {
  // Site Settings
  static getSiteSettings(): SiteSettings {
    const stored = localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS);
    return stored ? JSON.parse(stored) : defaultSiteSettings;
  }

  static saveSiteSettings(settings: SiteSettings): void {
    localStorage.setItem(STORAGE_KEYS.SITE_SETTINGS, JSON.stringify(settings));
  }

  // Products
  static getProducts(): Product[] {
    const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    return stored ? JSON.parse(stored) : defaultProducts;
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct = { ...product, id: Date.now() };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id: number, updates: Partial<Product>): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);
    }
  }

  static deleteProduct(id: number): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }

  // Admin Users
  static getAdminUsers(): AdminUser[] {
    const stored = localStorage.getItem(STORAGE_KEYS.ADMIN_USERS);
    return stored ? JSON.parse(stored) : defaultAdminUsers;
  }

  static saveAdminUsers(users: AdminUser[]): void {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USERS, JSON.stringify(users));
  }

  static validateAdmin(username: string, password: string): AdminUser | null {
    const users = this.getAdminUsers();
    return users.find(user => user.username === username && user.password === password) || null;
  }

  // Tools
  static getTools(): Tool[] {
    const stored = localStorage.getItem(STORAGE_KEYS.TOOLS);
    return stored ? JSON.parse(stored) : defaultSiteSettings.tools || [];
  }

  static saveTools(tools: Tool[]): void {
    localStorage.setItem(STORAGE_KEYS.TOOLS, JSON.stringify(tools));
  }

  // Cart
  static getCart(): any[] {
    const stored = localStorage.getItem(STORAGE_KEYS.CART);
    return stored ? JSON.parse(stored) : [];
  }

  static saveCart(cart: any[]): void {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }

  static addToCart(item: any): void {
    const cart = this.getCart();
    cart.push({ ...item, id: Date.now() });
    this.saveCart(cart);
  }

  static removeFromCart(id: number): void {
    const cart = this.getCart().filter(item => item.id !== id);
    this.saveCart(cart);
  }

  static clearCart(): void {
    this.saveCart([]);
  }

  // Initialize with default data if empty
  static initialize(): void {
    if (!localStorage.getItem(STORAGE_KEYS.SITE_SETTINGS)) {
      this.saveSiteSettings(defaultSiteSettings);
    }
    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(defaultProducts);
    }
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_USERS)) {
      this.saveAdminUsers(defaultAdminUsers);
    }
  }
}

// Initialize on load
LocalStorageService.initialize();
