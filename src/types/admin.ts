
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  features: string[];
  inStock: boolean;
  featured?: boolean;
  discount?: number;
  originalPrice?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  gallery?: string[];
  videoUrl?: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  lastLogin?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category: string;
}

export interface PageTexts {
  home?: {
    heroTitle?: string;
    heroSubtitle?: string;
    featuresTitle?: string;
    features?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  official?: {
    pageTitle?: string;
    pageSubtitle?: string;
    aboutTitle?: string;
    aboutContent?: string[];
    whyChooseTitle?: string;
    whyChooseItems?: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    contactTitle?: string;
  };
  pubgHacks?: {
    pageTitle?: string;
    pageSubtitle?: string;
    safetyTitle?: string;
    safetyDescription?: string;
  };
  webDevelopment?: {
    pageTitle?: string;
    pageSubtitle?: string;
    servicesTitle?: string;
  };
  discordBots?: {
    pageTitle?: string;
    pageSubtitle?: string;
    featuresTitle?: string;
  };
  navigation?: {
    homeTitle?: string;
    pubgTitle?: string;
    webTitle?: string;
    discordTitle?: string;
    officialTitle?: string;
    adminTitle?: string;
  };
  cart?: {
    cartTitle?: string;
    emptyCartMessage?: string;
    purchaseButton?: string;
    purchaseNote?: string;
    addToCartButton?: string;
    removeButton?: string;
  };
  downloads?: {
    title?: string;
    subtitle?: string;
    categories?: {
      all?: string;
      games?: string;
      tools?: string;
      design?: string;
      programming?: string;
      music?: string;
      video?: string;
      books?: string;
      security?: string;
    };
    buttons?: {
      download?: string;
      filter?: string;
      login?: string;
    };
    labels?: {
      size?: string;
      downloads?: string;
      rating?: string;
      version?: string;
      lastUpdate?: string;
      features?: string;
      status?: string;
      password?: string;
    };
    stats?: {
      totalDownloads?: string;
      availableFiles?: string;
      averageRating?: string;
    };
    placeholders?: {
      search?: string;
      noResults?: string;
      password?: string;
    };
    messages?: {
      loginRequired?: string;
      wrongPassword?: string;
    };
  };
}

export interface SiteSettings {
  title: string;
  titleSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  description: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  globalTextSize: 'small' | 'medium' | 'large';
  downloadsPassword?: string; // كلمة مرور التنزيلات
  backgroundSettings: {
    type: 'color' | 'gradient' | 'image';
    value: string;
    starCount: number;
    starSize: 'small' | 'medium' | 'large';
    starOpacity: number;
    meteorCount: number;
    meteorSize: 'small' | 'medium' | 'large';
    meteorOpacity: number;
    meteorDirection: 'up' | 'down' | 'left' | 'right';
    meteorColors: string[];
    animationSpeed: 'slow' | 'normal' | 'fast';
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
  homePage: {
    heroTitle: string;
    heroSubtitle: string;
    featuresTitle: string;
    features: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
  };
  typography: {
    fontFamily: 'system' | 'inter' | 'roboto' | 'cairo' | 'tajawal';
    headingWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    bodyWeight: 'normal' | 'medium' | 'semibold';
    lineHeight: 'tight' | 'normal' | 'relaxed';
  };
  design: {
    borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full';
    shadows: 'none' | 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'relaxed';
    animations: boolean;
  };
  pageTexts: PageTexts;
}
