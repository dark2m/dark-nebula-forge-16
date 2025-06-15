
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  features: string[];
  isActive: boolean;
  discount?: number;
  originalPrice?: number;
  videos?: string[];
  gallery?: string[];
}

export interface NavigationItem {
  id: string;
  name: string;
  path: string;
  icon: string;
  visible: boolean;
}

export interface ContactInfo {
  telegram: string;
  discord: string;
  whatsapp: string;
  email: string;
  phone: string;
  address: string;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  visible: boolean;
}

export interface HomePage {
  heroTitle: string;
  heroSubtitle: string;
  featuresTitle: string;
  features: Feature[];
}

export interface BackgroundSettings {
  type: 'color' | 'gradient' | 'stars' | 'meteors' | 'animated';
  value: string;
  starCount: number;
  meteorCount: number;
  animationSpeed: 'slow' | 'normal' | 'fast';
  starOpacity: number;
  meteorOpacity: number;
  starSize: 'small' | 'medium' | 'large';
  meteorSize: 'small' | 'medium' | 'large';
  meteorDirection: 'up' | 'down' | 'left' | 'right';
  meteorColors: string[];
}

export interface Colors {
  primary: string;
  secondary: string;
  accent: string;
}

export interface Typography {
  fontFamily: 'system' | 'inter' | 'roboto' | 'cairo';
  headingWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  bodyWeight: 'normal' | 'medium' | 'semibold';
  lineHeight: 'tight' | 'normal' | 'relaxed';
}

export interface Design {
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  shadows: 'none' | 'small' | 'medium' | 'large';
  spacing: 'compact' | 'normal' | 'relaxed';
  animations: boolean;
}

export interface Tool {
  id: number;
  name: string;
  title: string;
  description: string;
  buttonText: string;
  url: string;
  icon: string;
  visible: boolean;
  isActive: boolean;
  category: 'general' | 'security' | 'design' | 'development';
}

export interface DownloadsLoginPageTexts {
  title: string;
  subtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  contactSupport: string;
  errorMessage: string;
}

export interface DownloadsMainPageTexts {
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
}

export interface DownloadsPageTexts {
  loginPage: DownloadsLoginPageTexts;
  mainPage: DownloadsMainPageTexts;
}

export interface PageTexts {
  home: {
    heroTitle: string;
    heroSubtitle: string;
    featuresTitle: string;
    features: Feature[];
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
  tools: {
    title: string;
    subtitle: string;
  };
  downloads: DownloadsPageTexts;
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
  titleSize: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  description: string;
  colors: Colors;
  globalTextSize: 'small' | 'medium' | 'large';
  backgroundSettings: BackgroundSettings;
  navigation: NavigationItem[];
  contactInfo: ContactInfo;
  homePage: HomePage;
  typography: Typography;
  design: Design;
  tools: Tool[];
  downloadsPassword: string;
  pageTexts: PageTexts;
}
