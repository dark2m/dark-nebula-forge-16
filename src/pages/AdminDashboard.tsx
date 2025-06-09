import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Palette, 
  Package, 
  Users, 
  BarChart3, 
  LogOut,
  Plus,
  Trash2,
  Save,
  Key,
  Type,
  Image as ImageIcon,
  CheckCircle,
  Navigation as NavigationIcon,
  MessageCircle,
  Shield,
  AlertTriangle
} from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ProductFeaturesManager from '../components/ProductFeaturesManager';
import MediaManager from '../components/MediaManager';
import AdminStorage, { Product, AdminUser, SiteSettings } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  
  // Load data from storage
  const [products, setProducts] = useState<Product[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [tempAdminUsers, setTempAdminUsers] = useState<AdminUser[]>([]);
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
    const users = AdminStorage.getAdminUsers();
    setAdminUsers(users);
    setTempAdminUsers([...users]);
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
    
    const newProduct = AdminStorage.addProduct({
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

  // Admin users management (only for مدير عام)
  const addAdminUser = () => {
    if (!AdminStorage.hasPermission('مدير عام')) {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه إدارة المستخدمين",
        variant: "destructive"
      });
      return;
    }
    
    const newUser: AdminUser = {
      id: Date.now(),
      username: 'مستخدم جديد',
      password: 'password123',
      role: 'مشرف'
    };
    const updatedUsers = [...tempAdminUsers, newUser];
    setTempAdminUsers(updatedUsers);
  };

  const updateTempAdminUser = (id: number, updates: Partial<AdminUser>) => {
    if (!AdminStorage.hasPermission('مدير عام')) {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه تعديل المستخدمين",
        variant: "destructive"
      });
      return;
    }
    const updatedUsers = tempAdminUsers.map(user => 
      user.id === id ? { ...user, ...updates } : user
    );
    setTempAdminUsers(updatedUsers);
  };

  const saveTempAdminUser = (id: number) => {
    if (!AdminStorage.hasPermission('مدير عام')) {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه حفظ المستخدمين",
        variant: "destructive"
      });
      return;
    }
    const userToSave = tempAdminUsers.find(u => u.id === id);
    if (userToSave) {
      if (adminUsers.find(u => u.id === id)) {
        AdminStorage.updateAdminUser(id, userToSave);
      } else {
        AdminStorage.addAdminUser({
          username: userToSave.username,
          password: userToSave.password,
          role: userToSave.role
        });
      }
      setAdminUsers(AdminStorage.getAdminUsers());
      toast({
        title: "تم حفظ المستخدم",
        description: "تم حفظ بيانات المستخدم بنجاح"
      });
    }
  };

  const deleteTempAdminUser = (id: number) => {
    if (!AdminStorage.hasPermission('مدير عام')) {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه حذف المستخدمين",
        variant: "destructive"
      });
      return;
    }
    const updatedUsers = tempAdminUsers.filter(u => u.id !== id);
    setTempAdminUsers(updatedUsers);
    if (adminUsers.find(u => u.id === id)) {
      AdminStorage.deleteAdminUser(id);
      setAdminUsers(AdminStorage.getAdminUsers());
    }
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح"
    });
  };

  // Site settings management
  const saveSiteSettings = () => {
    if (!AdminStorage.hasPermission('مدير عام')) {
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

  const handleBackgroundImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!AdminStorage.hasPermission('مدير عام')) {
      toast({
        title: "غير مسموح",
        description: "فقط المدير العام يمكنه تعديل الخلفية",
        variant: "destructive"
      });
      return;
    }
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setSiteSettings({
          ...siteSettings,
          backgroundSettings: {
            type: 'image',
            value: imageData
          }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف') => {
    return AdminStorage.hasPermission(requiredRole);
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3, requiredRole: 'مشرف' as const },
    { id: 'products', name: 'إدارة المنتجات', icon: Package, requiredRole: 'مبرمج' as const },
    { id: 'passwords', name: 'إدارة كلمات المرور', icon: Key, requiredRole: 'مدير عام' as const },
    { id: 'design', name: 'تخصيص التصميم', icon: Palette, requiredRole: 'مدير عام' as const },
    { id: 'typography', name: 'التحكم في النصوص', icon: Type, requiredRole: 'مدير عام' as const },
    { id: 'navigation', name: 'إدارة التنقل', icon: NavigationIcon, requiredRole: 'مدير عام' as const },
    { id: 'contact', name: 'إعدادات التواصل', icon: MessageCircle, requiredRole: 'مدير عام' as const },
    { id: 'users', name: 'إدارة المستخدمين', icon: Users, requiredRole: 'مشرف' as const },
    { id: 'settings', name: 'الإعدادات', icon: Settings, requiredRole: 'مدير عام' as const },
  ];

  const visibleTabs = tabs.filter(tab => canAccess(tab.requiredRole));

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
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="admin-card rounded-xl p-6">
                <nav className="space-y-2">
                  {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? 'bg-blue-500 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{tab.name}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* Role Info */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h3 className="text-blue-400 font-semibold mb-2">دورك الحالي:</h3>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Shield className="w-4 h-4 text-blue-400" />
                    <span className="text-white">{currentUser?.role}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Overview Tab */}
              {activeTab === 'overview' && canAccess('مشرف') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">نظرة عامة</h2>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="admin-card rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400">إجمالي المبيعات</p>
                          <p className="text-2xl font-bold text-white">1,234$</p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-green-400" />
                      </div>
                    </div>
                    
                    <div className="admin-card rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400">عدد المنتجات</p>
                          <p className="text-2xl font-bold text-white">{products.length}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-400" />
                      </div>
                    </div>
                    
                    <div className="admin-card rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400">العملاء النشطين</p>
                          <p className="text-2xl font-bold text-white">156</p>
                        </div>
                        <Users className="w-8 h-8 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Products Tab */}
              {activeTab === 'products' && canAccess('مبرمج') && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">إدارة المنتجات</h2>
                    <button
                      onClick={addProduct}
                      className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة منتج</span>
                    </button>
                  </div>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-8">
                      {products.map((product) => (
                        <div key={product.id} className="border border-white/10 rounded-lg p-6 space-y-6">
                          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                            <div className="lg:col-span-2">
                              <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            
                            <div className="lg:col-span-2">
                              <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                              <textarea
                                value={product.description}
                                onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400 h-20 resize-none"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">السعر ($)</label>
                              <input
                                type="number"
                                value={product.price}
                                onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>

                            <div>
                              <label className="block text-gray-400 text-sm mb-2">حجم النص</label>
                              <select
                                value={product.textSize}
                                onChange={(e) => updateProduct(product.id, { textSize: e.target.value as 'small' | 'medium' | 'large' })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              >
                                <option value="small">صغير</option>
                                <option value="medium">متوسط</option>
                                <option value="large">كبير</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">لون الخلفية</label>
                              <input
                                type="color"
                                value={product.backgroundColor || '#000000'}
                                onChange={(e) => updateProduct(product.id, { backgroundColor: e.target.value })}
                                className="w-full h-10 rounded border border-white/20"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">صورة الخلفية</label>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                      updateProduct(product.id, { backgroundImage: event.target?.result as string });
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                          </div>

                          <MediaManager
                            images={product.images || []}
                            videos={product.videos || []}
                            onImagesChange={(images) => updateProduct(product.id, { images })}
                            onVideosChange={(videos) => updateProduct(product.id, { videos })}
                          />

                          <ProductFeaturesManager
                            features={product.features || []}
                            onFeaturesChange={(features) => updateProduct(product.id, { features })}
                          />

                          <div className="flex justify-end">
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>حذف المنتج</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Passwords Tab */}
              {activeTab === 'passwords' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-white">إدارة كلمات المرور</h2>
                    <button
                      onClick={addAdminUser}
                      className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
                    >
                      <Plus className="w-4 h-4" />
                      <span>إضافة مستخدم</span>
                    </button>
                  </div>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-6">
                      {tempAdminUsers.map((user) => (
                        <div key={user.id} className="border border-white/10 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">اسم المستخدم</label>
                              <input
                                type="text"
                                value={user.username}
                                onChange={(e) => updateTempAdminUser(user.id, { username: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">كلمة المرور</label>
                              <input
                                type="text"
                                value={user.password}
                                onChange={(e) => updateTempAdminUser(user.id, { password: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">الدور</label>
                              <select
                                value={user.role}
                                onChange={(e) => updateTempAdminUser(user.id, { role: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded py-2 px-3 focus:outline-none focus:border-blue-400"
                              >
                                <option value="مدير عام">مدير عام</option>
                                <option value="مبرمج">مبرمج</option>
                                <option value="مشرف">مشرف</option>
                              </select>
                            </div>
                            <div className="flex items-end gap-2">
                              <Button
                                onClick={() => saveTempAdminUser(user.id)}
                                className="bg-green-500 hover:bg-green-600 flex items-center gap-1"
                              >
                                <Save className="w-4 h-4" />
                                <span>حفظ</span>
                              </Button>
                              <button
                                onClick={() => deleteTempAdminUser(user.id)}
                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">تخصيص التصميم</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            اللون الأساسي
                          </label>
                          <input
                            type="color"
                            value={siteSettings.colors.primary}
                            onChange={(e) => setSiteSettings({ 
                              ...siteSettings, 
                              colors: { ...siteSettings.colors, primary: e.target.value }
                            })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            اللون الثانوي
                          </label>
                          <input
                            type="color"
                            value={siteSettings.colors.secondary}
                            onChange={(e) => setSiteSettings({ 
                              ...siteSettings, 
                              colors: { ...siteSettings.colors, secondary: e.target.value }
                            })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            لون التمييز
                          </label>
                          <input
                            type="color"
                            value={siteSettings.colors.accent}
                            onChange={(e) => setSiteSettings({ 
                              ...siteSettings, 
                              colors: { ...siteSettings.colors, accent: e.target.value }
                            })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            نوع الخلفية
                          </label>
                          <select
                            value={siteSettings.backgroundSettings?.type || 'color'}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              backgroundSettings: {
                                ...siteSettings.backgroundSettings,
                                type: e.target.value as 'color' | 'image'
                              }
                            })}
                            className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                          >
                            <option value="color">لون</option>
                            <option value="image">صورة</option>
                          </select>
                        </div>

                        {(siteSettings.backgroundSettings?.type || 'color') === 'color' ? (
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                              لون الخلفية
                            </label>
                            <input
                              type="color"
                              value={siteSettings.backgroundSettings?.value || '#000000'}
                              onChange={(e) => setSiteSettings({
                                ...siteSettings,
                                backgroundSettings: {
                                  ...siteSettings.backgroundSettings,
                                  type: 'color',
                                  value: e.target.value
                                }
                              })}
                              className="w-full h-12 rounded-lg border border-white/20"
                            />
                          </div>
                        ) : (
                          <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">
                              صورة الخلفية
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleBackgroundImageUpload}
                              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                        )}
                      </div>

                      <button
                        onClick={saveSiteSettings}
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ التغييرات</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">التحكم في النصوص</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          عنوان الموقع
                        </label>
                        <input
                          type="text"
                          value={siteSettings.title}
                          onChange={(e) => setSiteSettings({ ...siteSettings, title: e.target.value })}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            حجم عنوان الموقع
                          </label>
                          <select
                            value={siteSettings.titleSize}
                            onChange={(e) => setSiteSettings({ 
                              ...siteSettings, 
                              titleSize: e.target.value as 'small' | 'medium' | 'large' | 'xl'
                            })}
                            className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                          >
                            <option value="small">صغير</option>
                            <option value="medium">متوسط</option>
                            <option value="large">كبير</option>
                            <option value="xl">كبير جداً</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            حجم النص العام
                          </label>
                          <select
                            value={siteSettings.globalTextSize}
                            onChange={(e) => setSiteSettings({ 
                              ...siteSettings, 
                              globalTextSize: e.target.value as 'small' | 'medium' | 'large'
                            })}
                            className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                          >
                            <option value="small">صغير</option>
                            <option value="medium">متوسط</option>
                            <option value="large">كبير</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={saveSiteSettings}
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ التغييرات</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Users Tab */}
              {activeTab === 'users' && canAccess('مشرف') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">إدارة المستخدمين</h3>
                      <p className="text-gray-300 mb-4">
                        هذا القسم مخصص لإدارة حسابات العملاء والمستخدمين المسجلين في الموقع
                      </p>
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-right">
                        <h4 className="text-blue-400 font-semibold mb-2">معنى إدارة المستخدمين:</h4>
                        <ul className="text-gray-300 space-y-1 text-sm">
                          <li>• عرض قائمة بجميع المستخدمين المسجلين</li>
                          <li>• إدارة حالات الحسابات (نشط، محظور، معلق)</li>
                          <li>• عرض تفاصيل المستخدمين وسجل النشاط</li>
                          <li>• إدارة الصلاحيات والأدوار</li>
                          <li>• إرسال إشعارات للمستخدمين</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">الإعدادات</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white">تفعيل وضع الصيانة</span>
                        <input type="checkbox" className="toggle" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white">السماح بالتسجيل الجديد</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-white">إرسال إشعارات الطلبات</span>
                        <input type="checkbox" className="toggle" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Settings Tab */}
              {activeTab === 'contact' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">إعدادات التواصل</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">تيليجرام</label>
                          <input
                            type="text"
                            value={siteSettings.contactInfo?.telegram || ''}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contactInfo: { ...siteSettings.contactInfo, telegram: e.target.value }
                            })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                            placeholder="@username"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">ديسكورد</label>
                          <input
                            type="text"
                            value={siteSettings.contactInfo?.discord || ''}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contactInfo: { ...siteSettings.contactInfo, discord: e.target.value }
                            })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                            placeholder="Discord Server"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">واتساب</label>
                          <input
                            type="text"
                            value={siteSettings.contactInfo?.whatsapp || ''}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contactInfo: { ...siteSettings.contactInfo, whatsapp: e.target.value }
                            })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                            placeholder="+966 XX XXX XXXX"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">البريد الإلكتروني</label>
                          <input
                            type="email"
                            value={siteSettings.contactInfo?.email || ''}
                            onChange={(e) => setSiteSettings({
                              ...siteSettings,
                              contactInfo: { ...siteSettings.contactInfo, email: e.target.value }
                            })}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                            placeholder="support@dark.com"
                          />
                        </div>
                      </div>

                      <button
                        onClick={saveSiteSettings}
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ إعدادات التواصل</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Management Tab */}
              {activeTab === 'navigation' && canAccess('مدير عام') && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">إدارة شريط التنقل</h2>
                  
                  <div className="admin-card rounded-xl p-6">
                    <div className="space-y-4">
                      {siteSettings.navigation?.map((item, index) => (
                        <div key={item.id} className="border border-white/10 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">الاسم</label>
                              <input
                                type="text"
                                value={item.name}
                                onChange={(e) => {
                                  const newNavigation = [...siteSettings.navigation];
                                  newNavigation[index] = { ...item, name: e.target.value };
                                  setSiteSettings({ ...siteSettings, navigation: newNavigation });
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">المسار</label>
                              <input
                                type="text"
                                value={item.path}
                                onChange={(e) => {
                                  const newNavigation = [...siteSettings.navigation];
                                  newNavigation[index] = { ...item, path: e.target.value };
                                  setSiteSettings({ ...siteSettings, navigation: newNavigation });
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>

                            <div>
                              <label className="block text-gray-400 text-sm mb-1">الأيقونة</label>
                              <input
                                type="text"
                                value={item.icon}
                                onChange={(e) => {
                                  const newNavigation = [...siteSettings.navigation];
                                  newNavigation[index] = { ...item, icon: e.target.value };
                                  setSiteSettings({ ...siteSettings, navigation: newNavigation });
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>

                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={item.visible}
                                onChange={(e) => {
                                  const newNavigation = [...siteSettings.navigation];
                                  newNavigation[index] = { ...item, visible: e.target.checked };
                                  setSiteSettings({ ...siteSettings, navigation: newNavigation });
                                }}
                                className="ml-2"
                              />
                              <label className="text-gray-300">مرئي</label>
                            </div>

                            <div className="flex justify-end">
                              <button
                                onClick={() => {
                                  const newNavigation = siteSettings.navigation.filter((_, i) => i !== index);
                                  setSiteSettings({ ...siteSettings, navigation: newNavigation });
                                }}
                                className="text-red-400 hover:text-red-300 transition-colors p-2"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={saveSiteSettings}
                      className="w-full glow-button mt-6"
                    >
                      حفظ إعدادات التنقل
                    </button>
                  </div>
                </div>
              )}

              {/* Access Denied Message */}
              {!canAccess(tabs.find(t => t.id === activeTab)?.requiredRole || 'مشرف') && (
                <div className="admin-card rounded-xl p-8 text-center">
                  <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">غير مسموح</h3>
                  <p className="text-gray-300">
                    ليس لديك الصلاحية للوصول إلى هذا القسم
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
