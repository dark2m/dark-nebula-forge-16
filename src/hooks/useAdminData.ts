
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminStorage from '../utils/adminStorage';
import AuthService from '../utils/auth';
import { useToast } from '@/hooks/use-toast';
import type { Product, AdminUser, SiteSettings } from '../types/admin';

export const useAdminData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'DARK',
    titleSize: 'xl',
    description: '',
    colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' },
    globalTextSize: 'medium',
    backgroundSettings: { type: 'color', value: '#000000' },
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
      fontFamily: 'system',
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
      }
    }
  });

  // Load data on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setCurrentUser(user);
    
    setProducts(AdminStorage.getProducts());
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
  }, [navigate]);

  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean => {
    return AuthService.hasPermission(requiredRole);
  };

  return {
    currentUser,
    products,
    setProducts,
    siteSettings,
    setSiteSettings,
    canAccess,
    toast
  };
};
