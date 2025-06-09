
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Palette, 
  Package, 
  Users, 
  BarChart3, 
  LogOut,
  Edit,
  Plus,
  Trash2,
  Save,
  Key,
  Upload,
  Image
} from 'lucide-react';
import StarryBackground from '../components/StarryBackground';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [siteColors, setSiteColors] = useState({
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4'
  });
  const [siteTitle, setSiteTitle] = useState('DARK');
  const [products, setProducts] = useState([
    { 
      id: 1, 
      name: 'هكر ESP المتقدم', 
      price: 25, 
      category: 'pubg',
      image: '',
      description: 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة'
    },
    { 
      id: 2, 
      name: 'Aimbot Pro', 
      price: 35, 
      category: 'pubg',
      image: '',
      description: 'تصويب تلقائي دقيق مع إعدادات متقدمة'
    },
    { 
      id: 3, 
      name: 'بوت الموسيقى المتقدم', 
      price: 30, 
      category: 'discord',
      image: '',
      description: 'بوت ديسكورد متطور للموسيقى'
    },
  ]);
  const [adminUsers, setAdminUsers] = useState([
    { id: 1, username: 'admin', password: 'dark123', role: 'مدير عام' },
    { id: 2, username: 'moderator', password: 'mod456', role: 'مشرف' },
  ]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSaveColors = () => {
    console.log('Colors saved:', siteColors);
    alert('تم حفظ الألوان بنجاح!');
  };

  const addProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: 'منتج جديد',
      price: 0,
      category: 'pubg',
      image: '',
      description: 'وصف المنتج'
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleImageUpload = (productId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const updated = products.map(p => 
          p.id === productId ? { ...p, image: e.target?.result as string } : p
        );
        setProducts(updated);
      };
      reader.readAsDataURL(file);
    }
  };

  const addAdminUser = () => {
    const newUser = {
      id: Date.now(),
      username: 'مستخدم جديد',
      password: 'password123',
      role: 'مشرف'
    };
    setAdminUsers([...adminUsers, newUser]);
  };

  const deleteAdminUser = (id: number) => {
    setAdminUsers(adminUsers.filter(u => u.id !== id));
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
                    <div className="space-y-6">
                      {products.map((product) => (
                        <div key={product.id} className="grid grid-cols-1 lg:grid-cols-6 gap-4 p-4 bg-white/5 rounded-lg">
                          <div className="lg:col-span-1">
                            <label className="block text-gray-400 text-sm mb-1">صورة المنتج</label>
                            <div className="space-y-2">
                              {product.image && (
                                <img src={product.image} alt="Product" className="image-preview" />
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
                          
                          <div className="lg:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">اسم المنتج</label>
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => {
                                const updated = products.map(p => 
                                  p.id === product.id ? { ...p, name: e.target.value } : p
                                );
                                setProducts(updated);
                              }}
                              className="w-full bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400 py-2"
                            />
                          </div>
                          
                          <div className="lg:col-span-2">
                            <label className="block text-gray-400 text-sm mb-1">الوصف</label>
                            <input
                              type="text"
                              value={product.description}
                              onChange={(e) => {
                                const updated = products.map(p => 
                                  p.id === product.id ? { ...p, description: e.target.value } : p
                                );
                                setProducts(updated);
                              }}
                              className="w-full bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400 py-2"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">السعر ($)</label>
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => {
                                const updated = products.map(p => 
                                  p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                                );
                                setProducts(updated);
                              }}
                              className="w-full bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400 py-2"
                            />
                          </div>
                          
                          <div className="flex items-end justify-center">
                            <button
                              onClick={() => deleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2"
                            >
                              <Trash2 className="w-5 h-5" />
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
                    <div className="space-y-4">
                      {adminUsers.map((user) => (
                        <div key={user.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-lg">
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">اسم المستخدم</label>
                            <input
                              type="text"
                              value={user.username}
                              onChange={(e) => {
                                const updated = adminUsers.map(u => 
                                  u.id === user.id ? { ...u, username: e.target.value } : u
                                );
                                setAdminUsers(updated);
                              }}
                              className="w-full bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">كلمة المرور</label>
                            <input
                              type="password"
                              value={user.password}
                              onChange={(e) => {
                                const updated = adminUsers.map(u => 
                                  u.id === user.id ? { ...u, password: e.target.value } : u
                                );
                                setAdminUsers(updated);
                              }}
                              className="w-full bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400 py-2"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-sm mb-1">الدور</label>
                            <select
                              value={user.role}
                              onChange={(e) => {
                                const updated = adminUsers.map(u => 
                                  u.id === user.id ? { ...u, role: e.target.value } : u
                                );
                                setAdminUsers(updated);
                              }}
                              className="w-full bg-white/10 text-white border border-white/20 rounded py-2 px-3 focus:outline-none focus:border-blue-400"
                            >
                              <option value="مدير عام">مدير عام</option>
                              <option value="مشرف">مشرف</option>
                              <option value="محرر">محرر</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <button
                              onClick={() => deleteAdminUser(user.id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-2"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
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
                          value={siteTitle}
                          onChange={(e) => setSiteTitle(e.target.value)}
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
                            value={siteColors.primary}
                            onChange={(e) => setSiteColors({ ...siteColors, primary: e.target.value })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            اللون الثانوي
                          </label>
                          <input
                            type="color"
                            value={siteColors.secondary}
                            onChange={(e) => setSiteColors({ ...siteColors, secondary: e.target.value })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-300 text-sm font-medium mb-2">
                            لون التمييز
                          </label>
                          <input
                            type="color"
                            value={siteColors.accent}
                            onChange={(e) => setSiteColors({ ...siteColors, accent: e.target.value })}
                            className="w-full h-12 rounded-lg border border-white/20"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleSaveColors}
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
