
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
}

export interface AdminUser {
  id: number;
  username: string;
  password: string;
  role: 'مدير عام' | 'مبرمج' | 'مشرف';
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
  pageTexts: PageTexts;
}

export interface CartItem {
  id: number;
  name: string;
  price: string;
  category: string;
}
