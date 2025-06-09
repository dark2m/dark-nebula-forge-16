
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
import AdminStorage, { Product, AdminUser, SiteSettings } from '../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

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
    setSiteSettings({
      ...loadedSettings,
      backgroundSettings: loadedSettings.backgroundSettings || { type: 'color', value: '#000000' },
      navigation: loadedSettings.navigation || [],
      contactInfo: loadedSettings.contactInfo || {
        telegram: '',
        discord: '',
        whatsapp: '',
        email: '',
        phone: '',
        address: ''
      }
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('current_admin_user');
    navigate('/admin/login');
  };

  // Products management
  const addProduct = () => {
    if (!AdminStorage.hasPermission('مبرمج')) {
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
    if (!AdminStorage.hasPermission('مبرمج')) {
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
    if (!AdminStorage.hasPermission('مبرمج')) {
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

  // Site settings management
  const saveSiteSettings = () => {
    // Allow general manager access to all settings
    if (!AdminStorage.hasPermission('مدير عام') && currentUser?.role !== 'مدير عام') {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه تعديل إعدادات الموقع",
        variant: "destructive"
      });
      return;
    }
    
    AdminStorage.saveSiteSettings(siteSettings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean => {
    // General manager has access to everything
    if (currentUser?.role === 'مدير عام') return true;
    return AdminStorage.hasPermission(requiredRole);
  };

  const renderTabContent = () => {
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
        return canAccess('مدير عام') ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">إدارة كلمات المرور</h2>
            <div className="admin-card rounded-xl p-6">
              <p className="text-gray-300">قسم إدارة كلمات المرور سيتم إضافته قريباً</p>
            </div>
          </div>
        ) : <AccessDenied />;

      case 'design':
        return canAccess('مدير عام') ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">تخصيص التصميم</h2>
            <div className="admin-card rounded-xl p-6">
              <p className="text-gray-300">قسم تخصيص التصميم سيتم إضافته قريباً</p>
            </div>
          </div>
        ) : <AccessDenied />;

      case 'typography':
        return canAccess('مدير عام') ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">التحكم في النصوص</h2>
            <div className="admin-card rounded-xl p-6">
              <p className="text-gray-300">قسم التحكم في النصوص سيتم إضافته قريباً</p>
            </div>
          </div>
        ) : <AccessDenied />;

      case 'users':
        return canAccess('مدير عام') ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
            <div className="admin-card rounded-xl p-6">
              <p className="text-gray-300">قسم إدارة المستخدمين سيتم إضافته قريباً</p>
            </div>
          </div>
        ) : <AccessDenied />;

      case 'settings':
        return canAccess('مدير عام') ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">الإعدادات العامة</h2>
            <div className="admin-card rounded-xl p-6">
              <p className="text-gray-300">قسم الإعدادات العامة سيتم إضافته قريباً</p>
            </div>
          </div>
        ) : <AccessDenied />;
      
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
