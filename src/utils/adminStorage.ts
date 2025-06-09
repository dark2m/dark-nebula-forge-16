
// نظام تخزين بيانات الإدارة
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
  videos: string[];
  description: string;
  features: string[];
  backgroundColor?: string;
  backgroundImage?: string;
  textSize: 'small' | 'medium' | 'large';
  titleSize: 'small' | 'medium' | 'large' | 'xl';
}

export interface AdminUser {
  id: number;
  username: string;
  password: string;
  role: 'مدير عام' | 'مبرمج' | 'مشرف';
}

export interface SiteSettings {
  title: string;
  titleSize: 'small' | 'medium' | 'large' | 'xl';
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  globalTextSize: 'small' | 'medium' | 'large';
  backgroundSettings: {
    type: 'color' | 'image';
    value: string;
  };
  navigation: Array<{
    id: string;
    name: string;
    path: string;
    icon: string;
    visible: boolean;
  }>;
  contactInfo: {
    telegram: string;
    discord: string;
    whatsapp: string;
    email: string;
    phone: string;
    address: string;
  };
}

class AdminStorage {
  private static PRODUCTS_KEY = 'admin_products';
  private static USERS_KEY = 'admin_users';
  private static SETTINGS_KEY = 'site_settings';
  private static CURRENT_USER_KEY = 'current_admin_user';

  // Authentication
  static authenticateAdmin(username: string, password: string): boolean {
    const users = this.getAdminUsers();
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('adminToken', JSON.stringify({ userId: user.id, timestamp: Date.now() }));
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  static getCurrentUser(): AdminUser | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  static isAdminAuthenticated(): boolean {
    const token = localStorage.getItem('adminToken');
    return !!token;
  }

  static hasPermission(requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;
    
    const roleHierarchy = { 'مدير عام': 3, 'مبرمج': 2, 'مشرف': 1 };
    return roleHierarchy[currentUser.role] >= roleHierarchy[requiredRole];
  }

  // Products management
  static getProducts(): Product[] {
    const stored = localStorage.getItem(this.PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultProducts: Product[] = [
      { 
        id: 1, 
        name: 'هكر ESP المتقدم', 
        price: 25, 
        category: 'pubg',
        images: [],
        videos: [],
        description: 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة',
        features: ['ESP للاعبين', 'ESP للأسلحة', 'ESP للسيارات', 'آمن 100%'],
        textSize: 'medium',
        titleSize: 'large'
      }
    ];
    
    this.saveProducts(defaultProducts);
    return defaultProducts;
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('خطأ في حفظ المنتجات:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
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

  // Admin users management
  static getAdminUsers(): AdminUser[] {
    const stored = localStorage.getItem(this.USERS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const defaultUsers: AdminUser[] = [
      { id: 1, username: 'admin', password: 'dark123', role: 'مدير عام' },
      { id: 2, username: 'dev', password: 'dev456', role: 'مبرمج' },
      { id: 3, username: 'mod', password: 'mod789', role: 'مشرف' },
    ];
    
    this.saveAdminUsers(defaultUsers);
    return defaultUsers;
  }

  static saveAdminUsers(users: AdminUser[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static updateAdminUser(id: number, updates: Partial<AdminUser>): void {
    const users = this.getAdminUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.saveAdminUsers(users);
    }
  }

  static addAdminUser(user: Omit<AdminUser, 'id'>): AdminUser {
    const users = this.getAdminUsers();
    const newUser: AdminUser = {
      ...user,
      id: Date.now()
    };
    users.push(newUser);
    this.saveAdminUsers(users);
    return newUser;
  }

  static deleteAdminUser(id: number): void {
    const users = this.getAdminUsers().filter(u => u.id !== id);
    this.saveAdminUsers(users);
  }

  // Site settings management
  static getSiteSettings(): SiteSettings {
    const stored = localStorage.getItem(this.SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
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
        value: '#000000'
      },
      navigation: [
        { id: 'pubg', name: 'هكر ببجي موبايل', path: '/pubg-hacks', icon: 'Shield', visible: true },
        { id: 'web', name: 'برمجة مواقع', path: '/web-development', icon: 'Code', visible: true },
        { id: 'discord', name: 'برمجة بوتات ديسكورد', path: '/discord-bots', icon: 'Bot', visible: true },
        { id: 'about', name: 'من نحن', path: '/about', icon: 'Users', visible: true },
        { id: 'contact', name: 'تواصل معنا', path: '/contact', icon: 'MessageCircle', visible: true }
      ],
      contactInfo: {
        telegram: '@DarkTeam_Support',
        discord: 'Discord Server',
        whatsapp: '+966 XX XXX XXXX',
        email: 'support@dark.com',
        phone: '+966 XX XXX XXXX',
        address: 'المملكة العربية السعودية'
      }
    };
    
    this.saveSiteSettings(defaultSettings);
    return defaultSettings;
  }

  static saveSiteSettings(settings: SiteSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }
}

export default AdminStorage;
