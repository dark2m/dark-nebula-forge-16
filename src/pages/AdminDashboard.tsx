
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabContent from '../components/admin/AdminTabContent';
import AuthService from '../utils/auth';
import SettingsService from '../utils/settingsService';
import { useAdminData } from '../hooks/useAdminData';
import { useProductManagement } from '../hooks/useProductManagement';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    currentUser,
    products,
    setProducts,
    siteSettings,
    setSiteSettings,
    canAccess,
    toast
  } = useAdminData();

  const { addProduct, updateProduct, deleteProduct } = useProductManagement(
    canAccess,
    toast
  );

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const saveSiteSettings = () => {
    try {
      console.log('AdminDashboard: Force saving settings:', siteSettings);
      SettingsService.saveSiteSettings(siteSettings);
      
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: siteSettings }
      }));
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الموقع بنجاح وتطبيقها على الموقع"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <StarryBackground />
      
      {/* Simplified Background Effects */}
      <div className="absolute inset-0 z-[1]">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Clean Glass Overlay */}
      <div className="absolute inset-0 z-[2] bg-black/30"></div>
      
      <div className="relative z-10">
        {/* Simple Header */}
        <div className="bg-black/50 backdrop-blur-sm border-b border-white/10">
          <AdminHeader currentUser={currentUser} onLogout={handleLogout} />
        </div>

        {/* Welcome Section */}
        <div className="container mx-auto px-6 py-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                مرحباً بك في لوحة التحكم
              </h2>
              <p className="text-gray-300">إدارة سهلة وبسيطة للموقع</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-8">
          <div className="grid lg:grid-cols-4 gap-6">
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4">
                <AdminSidebar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  currentUser={currentUser}
                  canAccess={canAccess}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <AdminTabContent
                  activeTab={activeTab}
                  products={products}
                  siteSettings={siteSettings}
                  setSiteSettings={setSiteSettings}
                  saveSiteSettings={saveSiteSettings}
                  addProduct={addProduct}
                  updateProduct={updateProduct}
                  deleteProduct={deleteProduct}
                  canAccess={canAccess}
                />
              </div>
            </div>
          </div>

          {/* Simple Footer */}
          <div className="mt-8 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 px-6 py-4 inline-block">
              <span className="text-white/80">لوحة تحكم إدارية - تصميم بسيط</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simplified CSS */}
      <style>{`
        .admin-glass {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .simple-shadow {
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(59, 130, 246, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(59, 130, 246, 0.7);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
