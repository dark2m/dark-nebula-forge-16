
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabContent from '../components/admin/AdminTabContent';
import AnimatedParticles from '../components/admin/AnimatedParticles';
import FloatingElements from '../components/admin/FloatingElements';
import EnhancedCard from '../components/admin/EnhancedCard';
import TypingAnimation from '../components/admin/TypingAnimation';
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
    <div className="min-h-screen relative overflow-hidden">
      <StarryBackground />
      <AnimatedParticles />
      <FloatingElements />
      
      {/* Enhanced Background Effects with 3D depth */}
      <div className="absolute inset-0 z-[1]">
        {/* Mega Gradient Orbs with pulsing animation */}
        <div className="absolute top-10 left-10 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/40 via-purple-500/30 to-cyan-500/40 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-10 right-10 w-[700px] h-[700px] bg-gradient-to-tr from-purple-600/35 via-pink-500/25 to-orange-500/35 rounded-full blur-3xl animate-pulse delay-1000 opacity-60"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500 opacity-50"></div>
        
        {/* Rotating Geometric Shapes */}
        <div className="absolute top-32 right-32 w-40 h-40 border-2 border-blue-400/30 rotate-45 animate-spin opacity-60" style={{ animationDuration: '30s' }}></div>
        <div className="absolute bottom-32 left-32 w-32 h-32 border-2 border-purple-400/30 rotate-12 animate-spin opacity-50" style={{ animationDuration: '25s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 border border-cyan-400/25 animate-pulse"></div>
        
        {/* Floating Light Orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-white/60 to-blue-300/60 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      {/* Glass Overlay with animated gradient */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-br from-black/25 via-transparent to-black/35"></div>
      
      <div className="relative z-10">
        {/* Enhanced Header with typing animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 backdrop-blur-2xl"></div>
          <div className="relative border-b border-white/20 shadow-2xl">
            <AdminHeader currentUser={currentUser} onLogout={handleLogout} />
          </div>
        </div>

        {/* Welcome Banner with typing effect */}
        <div className="container mx-auto px-6 py-4">
          <EnhancedCard glowColor="purple" className="mb-6">
            <div className="p-6 text-center">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">
                <TypingAnimation text="مرحباً بك في لوحة التحكم المتطورة" speed={80} />
              </h2>
              <p className="text-gray-300 opacity-80">إدارة احترافية بتقنيات متقدمة</p>
            </div>
          </EnhancedCard>
        </div>

        {/* Main Content Area with enhanced cards */}
        <div className="container mx-auto px-6 pb-8">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1">
              <EnhancedCard glowColor="blue">
                <AdminSidebar 
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  currentUser={currentUser}
                  canAccess={canAccess}
                />
              </EnhancedCard>
            </div>

            {/* Enhanced Main Content */}
            <div className="lg:col-span-3">
              <EnhancedCard glowColor="purple">
                <div className="p-6 min-h-[600px]">
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
              </EnhancedCard>
            </div>
          </div>

          {/* Enhanced Footer with animated elements */}
          <div className="mt-12 text-center">
            <EnhancedCard glowColor="green" className="inline-block">
              <div className="px-8 py-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 font-medium">DARK Admin Dashboard - Ultimate Edition</span>
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse delay-1000"></div>
                </div>
              </div>
            </EnhancedCard>
          </div>
        </div>
      </div>

      {/* Enhanced CSS Styles */}
      <style>{`
        /* Advanced Glassmorphism */
        .enhanced-glass {
          background: rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(25px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.125);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.37),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        /* 3D Shadow Effects */
        .shadow-3xl {
          box-shadow: 
            0 35px 60px -12px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(255, 255, 255, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        /* Animated Gradient Text */
        .gradient-text {
          background: linear-gradient(45deg, #00bfff, #8a2be2, #ff69b4, #00ff7f);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        /* Enhanced Scrollbars */
        ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 15px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899);
          border-radius: 15px;
          border: 2px solid rgba(0, 0, 0, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed, #db2777);
          transform: scale(1.1);
        }
        
        /* Floating Animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(1deg); }
          66% { transform: translateY(5px) rotate(-1deg); }
        }
        
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
