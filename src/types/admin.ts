export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'مدير عام' | 'مبرمج' | 'مشرف';
  name: string;
  email: string;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  isActive: boolean;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  siteKeywords: string;
  siteUrl: string;
  siteEmail: string;
  sitePhone: string;
  siteAddress: string;
  siteLogo: string;
  siteFavicon: string;
  siteTheme: string;
  siteLanguage: string;
  siteDirection: string;
  siteStatus: string;
  siteStatusMessage: string;
  siteAnalytics: string;
  siteSocial: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
    github: string;
    discord: string;
    telegram: string;
  };
  siteFooter: {
    text: string;
    links: {
      text: string;
      url: string;
    }[];
  };
  siteHeader: {
    links: {
      text: string;
      url: string;
    }[];
  };
  siteMeta: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    ogImage: string;
    ogUrl: string;
    ogType: string;
    ogSiteName: string;
    twitterCard: string;
    twitterSite: string;
    twitterCreator: string;
  };
  siteScripts: {
    head: string;
    body: string;
  };
  siteStyles: {
    head: string;
    body: string;
  };
  siteSettings: {
    maintenance: boolean;
    maintenanceMessage: string;
    registration: boolean;
    registrationMessage: string;
    login: boolean;
    loginMessage: string;
    contact: boolean;
    contactMessage: string;
    search: boolean;
    searchMessage: string;
    comments: boolean;
    commentsMessage: string;
    ratings: boolean;
    ratingsMessage: string;
    sharing: boolean;
    sharingMessage: string;
    downloads: boolean;
    downloadsMessage: string;
    downloadsPassword: string;
  };
  contactInfo: {
    email: string;
    phone: string;
    address: string;
    hours: string;
    map: string;
    discord: string;
    telegram: string;
  };
  pageTexts: {
    home: HomePageTexts;
    about: AboutPageTexts;
    contact: ContactPageTexts;
    downloads: DownloadsPageTexts;
    login: LoginPageTexts;
    register: RegisterPageTexts;
    profile: ProfilePageTexts;
    admin: AdminPageTexts;
    error: ErrorPageTexts;
  };
}

export interface HomePageTexts {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
  features: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      description: string;
      icon: string;
    }[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
    buttonUrl: string;
  };
  testimonials: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      text: string;
      avatar: string;
    }[];
  };
}

export interface AboutPageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  content: {
    title: string;
    text: string;
  };
  team: {
    title: string;
    subtitle: string;
    items: {
      name: string;
      role: string;
      bio: string;
      avatar: string;
    }[];
  };
}

export interface ContactPageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    subjectLabel: string;
    messageLabel: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
  };
  info: {
    title: string;
    subtitle: string;
    items: {
      title: string;
      text: string;
      icon: string;
    }[];
  };
}

export interface DownloadsPageTexts {
  loginPage: {
    title: string;
    subtitle: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    loginButton: string;
    contactSupport: string;
    errorMessage: string;
  };
  mainPage: {
    title: string;
    subtitle: string;
    categories: {
      all: string;
      [key: string]: string; // Allow dynamic category names
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
  };
}

export interface LoginPageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    usernameLabel: string;
    passwordLabel: string;
    buttonText: string;
    forgotPassword: string;
    registerLink: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface RegisterPageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  form: {
    title: string;
    subtitle: string;
    nameLabel: string;
    usernameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    buttonText: string;
    loginLink: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface ProfilePageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  info: {
    title: string;
    subtitle: string;
    nameLabel: string;
    usernameLabel: string;
    emailLabel: string;
    roleLabel: string;
    createdAtLabel: string;
    lastLoginLabel: string;
  };
  edit: {
    title: string;
    subtitle: string;
    nameLabel: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    buttonText: string;
    successMessage: string;
    errorMessage: string;
  };
}

export interface AdminPageTexts {
  hero: {
    title: string;
    subtitle: string;
  };
  sidebar: {
    dashboard: string;
    users: string;
    settings: string;
    pages: string;
    media: string;
    logout: string;
  };
  dashboard: {
    title: string;
    subtitle: string;
    stats: {
      users: string;
      pages: string;
      media: string;
      downloads: string;
    };
  };
  users: {
    title: string;
    subtitle: string;
    table: {
      name: string;
      username: string;
      email: string;
      role: string;
      createdAt: string;
      lastLogin: string;
      actions: string;
    };
    add: {
      title: string;
      subtitle: string;
      nameLabel: string;
      usernameLabel: string;
      emailLabel: string;
      passwordLabel: string;
      roleLabel: string;
      buttonText: string;
      successMessage: string;
      errorMessage: string;
    };
    edit: {
      title: string;
      subtitle: string;
      nameLabel: string;
      usernameLabel: string;
      emailLabel: string;
      passwordLabel: string;
      roleLabel: string;
      buttonText: string;
      successMessage: string;
      errorMessage: string;
    };
    delete: {
      title: string;
      subtitle: string;
      buttonText: string;
      successMessage: string;
      errorMessage: string;
    };
  };
}

export interface ErrorPageTexts {
  notFound: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  serverError: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  forbidden: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  unauthorized: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
}
