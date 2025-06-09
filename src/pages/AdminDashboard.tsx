
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminSidebar from '../components/admin/AdminSidebar';
import ProductsTab from '../components/admin/ProductsTab';
import ContactTab from '../components/admin/ContactTab';
import NavigationTab from '../components/admin/NavigationTab';
import BackgroundTab from '../components/admin/BackgroundTab';
import AccessDenied from '../components/admin/AccessDenied';
import OverviewTab from '../components/admin/OverviewTab';
import PasswordsTab from '../components/admin/PasswordsTab';
import SettingsTab from '../components/admin/SettingsTab';
import UsersTab from '../components/admin/UsersTab';
import TypographyTab from '../components/admin/TypographyTab';
import DesignTab from '../components/admin/DesignTab';
import TextsTab from '../components/admin/TextsTab';
import AdminStorage from '../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';
import type { Product, AdminUser, SiteSettings } from '../types/admin';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  // Load data from storage
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
    const user = AdminStorage.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setCurrentUser(user);
    
    setProducts(AdminStorage.getProducts());
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('current_admin_user');
    navigate('/admin/login');
  };

  // Products management - المدير العام له تحكم كامل
  const addProduct = () => {
    if (currentUser?.role !== 'مدير عام' && !AdminStorage.hasPermission('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لإضافة المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    AdminStorage.addProduct({
      name: 'منتج جديد',
      price: 0,
      category: 'pubg',
      images: [],
      videos: [],
      description: 'وصف المنتج',
      features: [],
      textSize: 'medium',
      titleSize: 'large'
    });
    setProducts(AdminStorage.getProducts());
    toast({
      title: "تم إضافة المنتج",
      description: "تم إضافة منتج جديد بنجاح"
    });
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    if (currentUser?.role !== 'مدير عام' && !AdminStorage.hasPermission('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    try {
      AdminStorage.updateProduct(id, updates);
      setProducts(AdminStorage.getProducts());
      toast({
        title: "تم تحديث المنتج",
        description: "تم حفظ التغييرات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "تم تجاوز حد التخزين المسموح. يرجى تقليل حجم الصور أو الفيديوهات.",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = (id: number) => {
    if (currentUser?.role !== 'مدير عام' && !AdminStorage.hasPermission('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    AdminStorage.deleteProduct(id);
    setProducts(AdminStorage.getProducts());
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح"
    });
  };

  // Site settings management - المدير العام له تحكم كامل
  const saveSiteSettings = () => {
    AdminStorage.saveSiteSettings(siteSettings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean => {
    // المدير العام له تحكم كامل في كل شيء
    if (currentUser?.role === 'مدير عام') return true;
    return AdminStorage.hasPermission(requiredRole);
  };

  const renderTabContent = () => {
    // المدير العام يمكنه الوصول لكل شيء
    if (currentUser?.role === 'مدير عام') {
      switch (activeTab) {
        case 'overview':
          return <OverviewTab products={products} />;
        case 'products':
          return (
            <ProductsTab 
              products={products}
              addProduct={addProduct}
              updateProduct={updateProduct}
              deleteProduct={deleteProduct}
            />
          );
        case 'background':
          return (
            <BackgroundTab 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              saveSiteSettings={saveSiteSettings}
            />
          );
        case 'contact':
          return (
            <ContactTab 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              saveSiteSettings={saveSiteSettings}
            />
          );
        case 'navigation':
          return (
            <NavigationTab 
              siteSettings={siteSettings}
              setSiteSettings={setSiteSettings}
              saveSiteSettings={saveSiteSettings}
            />
          );
        case 'passwords':
          return <PasswordsTab />;
        case 'design':
          return <DesignTab />;
        case 'typography':
          return <TypographyTab />;
        case 'users':
          return <UsersTab />;
        case 'settings':
          return <SettingsTab />;
        case 'texts':
          return <TextsTab />;
        default:
          return <OverviewTab products={products} />;
      }
    }

    // للأدوار الأخرى، استخدم نظام الصلاحيات العادي
    switch (activeTab) {
      case 'overview':
        return canAccess('مشرف') ? <OverviewTab products={products} /> : <AccessDenied />;
      
      case 'products':
        return canAccess('مبرمج') ? (
          <ProductsTab 
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
          />
        ) : <AccessDenied />;
      
      case 'background':
        return canAccess('مبرمج') ? (
          <BackgroundTab 
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        ) : <AccessDenied />;
      
      case 'contact':
        return canAccess('مدير عام') ? (
          <ContactTab 
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        ) : <AccessDenied />;
      
      case 'navigation':
        return canAccess('مدير عام') ? (
          <NavigationTab 
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        ) : <AccessDenied />;

      case 'passwords':
        return canAccess('مدير عام') ? <PasswordsTab /> : <AccessDenied />;

      case 'design':
        return canAccess('مدير عام') ? <DesignTab /> : <AccessDenied />;

      case 'typography':
        return canAccess('مدير عام') ? <TypographyTab /> : <AccessDenied />;

      case 'users':
        return canAccess('مدير عام') ? <UsersTab /> : <AccessDenied />;

      case 'settings':
        return canAccess('مدير عام') ? <SettingsTab /> : <AccessDenied />;

      case 'texts':
        return canAccess('مدير عام') ? <TextsTab /> : <AccessDenied />;
      
      default:
        return <AccessDenied />;
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">لوحة تحكم الإدارة</h1>
                {currentUser && (
                  <p className="text-gray-400 text-sm">
                    مرحباً {currentUser.username} - {currentUser.role}
                    {currentUser.role === 'مدير عام' && (
                      <span className="text-green-400 mr-2">• تحكم كامل</span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 rtl:space-x-reverse text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <AdminSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={currentUser}
              canAccess={canAccess}
            />

            {/* Main Content */}
            <div className="lg:col-span-3">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
