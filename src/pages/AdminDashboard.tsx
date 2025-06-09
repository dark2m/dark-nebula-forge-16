
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
  Upload,
  Image,
  CheckCircle
} from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ProductFeaturesManager from '../components/ProductFeaturesManager';
import AdminStorage, { Product, AdminUser, SiteSettings } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Load data from storage
  const [products, setProducts] = useState<Product[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'DARK',
    colors: { primary: '#3b82f6', secondary: '#8b5cf6', accent: '#06b6d4' }
  });

  // Load data on component mount
  useEffect(() => {
    setProducts(AdminStorage.getProducts());
    setAdminUsers(AdminStorage.getAdminUsers());
    setSiteSettings(AdminStorage.getSiteSettings());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Products management
  const addProduct = () => {
    const newProduct = AdminStorage.addProduct({
      name: 'منتج جديد',
      price: 0,
      category: 'pubg',
      image: '',
      description: 'وصف المنتج',
      features: []
    });
    setProducts(AdminStorage.getProducts());
    toast({
      title: "تم إضافة المنتج",
      description: "تم إضافة منتج جديد بنجاح"
    });
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
    AdminStorage.updateProduct(id, updates);
    setProducts(AdminStorage.getProducts());
  };

  const deleteProduct = (id: number) => {
    AdminStorage.deleteProduct(id);
    setProducts(AdminStorage.getProducts());
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح"
    });
  };

  const handleImageUpload = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        updateProduct(productId, { image: imageData });
        toast({
          title: "تم تحديث الصورة",
          description: "تم تحديث صورة المنتج بنجاح"
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Admin users management
  const addAdminUser = () => {
    const newUser = AdminStorage.addAdminUser({
      username: 'مستخدم جديد',
      password: 'password123',
      role: 'مشرف'
    });
    setAdminUsers(AdminStorage.getAdminUsers());
    toast({
      title: "تم إضافة المستخدم",
      description: "تم إضافة مستخدم إداري جديد بنجاح"
    });
  };

  const updateAdminUser = (id: number, updates: Partial<AdminUser>) => {
    AdminStorage.updateAdminUser(id, updates);
    setAdminUsers(AdminStorage.getAdminUsers());
    toast({
      title: "تم تحديث المستخدم",
      description: "تم تحديث بيانات المستخدم بنجاح"
    });
  };

  const deleteAdminUser = (id: number) => {
    AdminStorage.deleteAdminUser(id);
    setAdminUsers(AdminStorage.getAdminUsers());
    toast({
      title: "تم حذف المستخدم",
      description: "تم حذف المستخدم بنجاح"
    });
  };

  // Site settings management
  const saveSiteSettings = () => {
    AdminStorage.saveSiteSettings(siteSettings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
    { id: 'products', name: 'إدارة المنتجات', icon: Package },
    { id: 'passwords', name: 'إدارة كلمات المرور', icon: Key },
    { id: 'design', name: 'تخصيص التصميم', icon: Palette },
    { id: 'users', name: 'إدارة المستخدمين', icon: Users },
    { id: 'settings', name: 'الإعدادات', icon: Settings },
  ];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-lg border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">لوحة تحكم الإدارة</h1>
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
                  {tabs.map((tab) => {
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
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {activeTab === 'overview' && (
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

              {activeTab === 'products' && (
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
                            {/* Product Image */}
                            <div className="lg:col-span-1">
                              <label className="block text-gray-400 text-sm mb-2">صورة المنتج</label>
                              <div className="space-y-2">
                                {product.image && (
                                  <img 
                                    src={product.image} 
                                    alt="Product" 
                                    className="w-full h-20 object-cover rounded border border-white/20"
                                  />
                                )}
                                <div className="relative">
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(product.id, e)}
                                    className="hidden"
                                    id={`image-${product.id}`}
                                  />
                                  <label
                                    htmlFor={`image-${product.id}`}
                                    className="flex items-center justify-center w-full p-2 border border-white/20 rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
                                  >
                                    <Upload className="w-4 h-4 text-gray-400" />
                                  </label>
                                </div>
                              </div>
                            </div>
                            
                            {/* Product Name */}
                            <div className="lg:col-span-2">
                              <label className="block text-gray-400 text-sm mb-2">اسم المنتج</label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(product.id, { name: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            
                            {/* Product Description */}
                            <div className="lg:col-span-2">
                              <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                              <input
                                type="text"
                                value={product.description}
                                onChange={(e) => updateProduct(product.id, { description: e.target.value })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            
                            {/* Product Price */}
                            <div>
                              <label className="block text-gray-400 text-sm mb-2">السعر ($)</label>
                              <input
                                type="number"
                                value={product.price}
                                onChange={(e) => updateProduct(product.id, { price: Number(e.target.value) })}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                          </div>

                          {/* Product Features */}
                          <ProductFeaturesManager
                            features={product.features || []}
                            onFeaturesChange={(features) => updateProduct(product.id, { features })}
                          />

                          {/* Delete Button */}
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

              {activeTab === 'passwords' && (
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
                      {adminUsers.map((user) => (
                        <div key={user.id} className="border border-white/10 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">اسم المستخدم</label>
                              <input
                                type="text"
                                value={user.username}
                                onChange={(e) => {
                                  const updated = [...adminUsers];
                                  const index = updated.findIndex(u => u.id === user.id);
                                  if (index !== -1) {
                                    updated[index] = { ...updated[index], username: e.target.value };
                                    setAdminUsers(updated);
                                  }
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">كلمة المرور</label>
                              <input
                                type="password"
                                value={user.password}
                                onChange={(e) => {
                                  const updated = [...adminUsers];
                                  const index = updated.findIndex(u => u.id === user.id);
                                  if (index !== -1) {
                                    updated[index] = { ...updated[index], password: e.target.value };
                                    setAdminUsers(updated);
                                  }
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                              />
                            </div>
                            <div>
                              <label className="block text-gray-400 text-sm mb-1">الدور</label>
                              <select
                                value={user.role}
                                onChange={(e) => {
                                  const updated = [...adminUsers];
                                  const index = updated.findIndex(u => u.id === user.id);
                                  if (index !== -1) {
                                    updated[index] = { ...updated[index], role: e.target.value };
                                    setAdminUsers(updated);
                                  }
                                }}
                                className="w-full bg-white/10 text-white border border-white/20 rounded py-2 px-3 focus:outline-none focus:border-blue-400"
                              >
                                <option value="مدير عام">مدير عام</option>
                                <option value="مشرف">مشرف</option>
                                <option value="محرر">محرر</option>
                              </select>
                            </div>
                            <div className="flex items-end gap-2">
                              <Button
                                onClick={() => updateAdminUser(user.id, adminUsers.find(u => u.id === user.id)!)}
                                className="bg-green-500 hover:bg-green-600 flex items-center gap-1"
                              >
                                <Save className="w-4 h-4" />
                                <span>حفظ</span>
                              </Button>
                              <button
                                onClick={() => deleteAdminUser(user.id)}
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

              {activeTab === 'design' && (
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-white">تخصيص التصميم</h2>
                  
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

              {activeTab === 'users' && (
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

              {activeTab === 'settings' && (
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
