
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
  Save
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
    { id: 1, name: 'هكر ESP المتقدم', price: 25, category: 'pubg' },
    { id: 2, name: 'Aimbot Pro', price: 35, category: 'pubg' },
    { id: 3, name: 'بوت الموسيقى المتقدم', price: 30, category: 'discord' },
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
      category: 'pubg'
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const tabs = [
    { id: 'overview', name: 'نظرة عامة', icon: BarChart3 },
    { id: 'products', name: 'إدارة المنتجات', icon: Package },
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
                    <div className="space-y-4">
                      {products.map((product) => (
                        <div key={product.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={product.name}
                              onChange={(e) => {
                                const updated = products.map(p => 
                                  p.id === product.id ? { ...p, name: e.target.value } : p
                                );
                                setProducts(updated);
                              }}
                              className="bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400"
                            />
                          </div>
                          <div className="mx-4">
                            <input
                              type="number"
                              value={product.price}
                              onChange={(e) => {
                                const updated = products.map(p => 
                                  p.id === product.id ? { ...p, price: Number(e.target.value) } : p
                                );
                                setProducts(updated);
                              }}
                              className="w-20 bg-transparent text-white border-b border-white/20 focus:outline-none focus:border-blue-400"
                            />
                            <span className="text-gray-400 mr-2">$</span>
                          </div>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
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
                    <p className="text-gray-300">قسم إدارة المستخدمين قيد التطوير...</p>
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
