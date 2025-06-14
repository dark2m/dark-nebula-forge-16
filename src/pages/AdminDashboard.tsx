
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
      
      // إطلاق حدث لتحديث جميع المكونات
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
    <div className="min-h-screen relative overflow-hidden">
      <StarryBackground />
      
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 z-[1]">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/25 via-pink-500/20 to-orange-500/25 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-500/15 via-blue-500/15 to-indigo-500/15 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Moving Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
        
        {/* Geometric Shapes */}
        <div className="absolute top-40 right-40 w-32 h-32 border border-blue-400/20 rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-40 left-40 w-24 h-24 border border-purple-400/20 rotate-12 animate-spin" style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Glass Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-black/20 via-transparent to-black/30"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 backdrop-blur-xl"></div>
          <div className="relative border-b border-white/10 shadow-2xl">
            <AdminHeader currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <div className="relative group">
                {/* Sidebar Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
                
                {/* Sidebar Container */}
                <div className="relative bg-black/30 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                  {/* Sidebar Inner Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                  
                  {/* Sidebar Content */}
                  <div className="relative z-10">
                    <AdminSidebar 
                      activeTab={activeTab}
                      setActiveTab={setActiveTab}
                      currentUser={currentUser}
                      canAccess={canAccess}
                    />
                  </div>
                  
                  {/* Sidebar Decorative Elements */}
                  <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Main Content */}
            <div className="lg:col-span-3">
              <div className="relative group">
                {/* Content Glow Effect */}
                <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Content Container */}
                <div className="relative bg-black/25 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
                  {/* Content Inner Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5 pointer-events-none"></div>
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500"></div>
                  
                  {/* Content Body */}
                  <div className="relative z-10 p-6">
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
                  
                  {/* Content Decorative Elements */}
                  <div className="absolute top-6 right-6 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"></div>
                  <div className="absolute bottom-6 left-6 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-xl"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Decoration */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 rtl:space-x-reverse px-6 py-3 bg-black/20 backdrop-blur-sm border border-white/10 rounded-full">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-gray-300/60 text-sm">DARK Admin Dashboard - Premium Edition</span>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style>{`
        .admin-card {
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.3s ease;
        }
        
        .admin-card:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        /* Enhanced Scrollbars */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
