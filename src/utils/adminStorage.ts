
// نظام تخزين بيانات الإدارة
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  features: string[];
}

export interface AdminUser {
  id: number;
  username: string;
  password: string;
  role: string;
}

export interface SiteSettings {
  title: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

class AdminStorage {
  private static PRODUCTS_KEY = 'admin_products';
  private static USERS_KEY = 'admin_users';
  private static SETTINGS_KEY = 'site_settings';

  // Products management
  static getProducts(): Product[] {
    const stored = localStorage.getItem(this.PRODUCTS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default products if none exist
    const defaultProducts: Product[] = [
      { 
        id: 1, 
        name: 'هكر ESP المتقدم', 
        price: 25, 
        category: 'pubg',
        image: '',
        description: 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة',
        features: ['ESP للاعبين', 'ESP للأسلحة', 'ESP للسيارات', 'آمن 100%']
      },
      { 
        id: 2, 
        name: 'Aimbot Pro', 
        price: 35, 
        category: 'pubg',
        image: '',
        description: 'تصويب تلقائي دقيق مع إعدادات متقدمة',
        features: ['تصويب تلقائي', 'تصويب ناعم', 'تخصيص المفاتيح', 'مكافحة الارتداد']
      },
      { 
        id: 3, 
        name: 'الحزمة الكاملة', 
        price: 50, 
        category: 'pubg',
        image: '',
        description: 'جميع الهاكات في حزمة واحدة بسعر مخفض',
        features: ['ESP متقدم', 'Aimbot Pro', 'Speed Hack', 'دعم مدى الحياة']
      }
    ];
    
    this.saveProducts(defaultProducts);
    return defaultProducts;
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
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
      { id: 2, username: 'moderator', password: 'mod456', role: 'مشرف' },
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
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4'
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
