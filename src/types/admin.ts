// Admin system type definitions
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
  rating?: number;
}

export interface AdminUser {
  id: number;
  username: string;
  password: string;
  role: 'مدير عام' | 'مبرمج' | 'مشرف';
  permissions?: {
    overview: boolean;
    products: boolean;
    users: boolean;
    passwords: boolean;
    tools: boolean;
    customerSupport: boolean;
    siteControl: boolean;
    texts: boolean;
    navigation: boolean;
    contact: boolean;
    design: boolean;
    preview: boolean;
    backup: boolean;
  };
}

export interface Tool {
  id: number;
  title: string;
  description: string;
  buttonText: string;
  url: string;
  icon: string;
  visible: boolean;
  category: string;
  customHtml?: string;
}

export interface PageTexts {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuresTitle: string;
    features: Array<{
      id: string;
      icon: string;
      title: string;
      description: string;
      visible: boolean;
    }>;
  };
  official: {
    pageTitle: string;
    pageSubtitle: string;
    aboutTitle: string;
    aboutContent: string[];
    whyChooseTitle: string;
    whyChooseItems: Array<{
      icon: string;
      title: string;
      description: string;
    }>;
    contactTitle: string;
  };
  pubgHacks: {
    pageTitle: string;
    pageSubtitle: string;
    safetyTitle: string;
    safetyDescription: string;
  };
  webDevelopment: {
    pageTitle: string;
    pageSubtitle: string;
    servicesTitle: string;
  };
  discordBots: {
    pageTitle: string;
    pageSubtitle: string;
    featuresTitle: string;
  };
  navigation: {
    homeTitle: string;
    pubgTitle: string;
    webTitle: string;
    discordTitle: string;
    officialTitle: string;
    adminTitle: string;
  };
  cart: {
    cartTitle: string;
    emptyCartMessage: string;
    purchaseButton: string;
    purchaseNote: string;
    addToCartButton: string;
    removeButton: string;
  };
  tools?: {
    pageTitle: string;
    pageSubtitle: string;
  };
  customerSupport?: {
    pageTitle: string;
    pageDescription: string;
    workingHoursTitle: string;
    workingHours?: {
      weekdays: string;
      friday: string;
    };
    supportNote: string;
  };
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
    starCount?: number;
    meteorCount?: number;
    animationSpeed?: 'slow' | 'normal' | 'fast';
    starOpacity?: number;
    meteorOpacity?: number;
    starSize?: 'small' | 'medium' | 'large';
    meteorSize?: 'small' | 'medium' | 'large';
    meteorDirection?: 'down' | 'up' | 'mixed';
    meteorColors?: string[];
  };
  navigation: Array<{
    id: string;
    name: string;
    path: string;
    icon: string;
    visible: boolean;
  }>;
  contactInfo: {
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
      id: string;
      icon: string;
      title: string;
      description: string;
      visible: boolean;
    }>;
  };
  typography: {
    fontFamily: string;
    headingWeight: 'normal' | 'bold' | 'black';
    bodyWeight: 'normal' | 'medium' | 'semibold';
    lineHeight: 'tight' | 'normal' | 'relaxed';
  };
  design: {
    borderRadius: 'none' | 'small' | 'medium' | 'large';
    shadows: 'none' | 'small' | 'medium' | 'large';
    spacing: 'tight' | 'normal' | 'loose';
    animations: boolean;
  };
  pageTexts: {
    home: {
      heroTitle: string;
      heroSubtitle: string;
      featuresTitle: string;
      features: Array<{
        id: string;
        icon: string;
        title: string;
        description: string;
        visible: boolean;
      }>;
    },
    navigation: {
      homeTitle: string;
      pubgTitle: string;
      webTitle: string;
      discordTitle: string;
      officialTitle: string;
      adminTitle: string;
    },
    cart: {
      cartTitle: string;
      emptyCartMessage: string;
      purchaseButton: string;
      purchaseNote: string;
      addToCartButton: string;
      removeButton: string;
    },
    downloads: {
      title: string;
      subtitle: string;
      categories: {
        all: string;
        games: string;
        tools: string;
        design: string;
        programming: string;
        music: string;
        video: string;
        books: string;
        security: string;
      };
      buttons: {
        download: string;
        filter: string;
      };
      labels: {
        size: string;
        downloads: string;
        rating: string;
        version: string;
        lastUpdate: string;
        features: string;
        status: string;
      };
      stats: {
        totalDownloads: string;
        availableFiles: string;
        averageRating: string;
      };
      placeholders: {
        search: string;
        noResults: string;
      };
    },
  };
  tools?: Tool[];
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  category: string;
}
