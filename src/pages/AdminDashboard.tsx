
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabContent from '../components/admin/AdminTabContent';
import CommitChangesButton from '../components/admin/CommitChangesButton';
import AuthService from '../utils/auth';
import SettingsService from '../utils/settingsService';
import { useAdminData } from '../hooks/useAdminData';
import { useProductManagement } from '../hooks/useProductManagement';

interface AdminUser {
  id: number;
  username: string;
  role: string;
  password?: string; // Make password optional
}

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
    toast,
    isLoading
  } = useAdminData();

  const { addProduct, updateProduct, deleteProduct } = useProductManagement(
    canAccess,
    toast
  );

  // تهيئة الإعدادات عند بدء التطبيق
  useEffect(() => {
    const initializeData = async () => {
      try {
        await SettingsService.initializeSettings();
      } catch (error) {
        console.error('AdminDashboard: Error initializing data:', error);
      }
    };

    initializeData();
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const saveSiteSettings = async () => {
    try {
      console.log('AdminDashboard: Saving settings to Supabase:', siteSettings);
      await SettingsService.saveSiteSettings(siteSettings);
      
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات الموقع بنجاح في Supabase"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات في Supabase",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <StarryBackground />
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">جاري تحميل البيانات من Supabase...</p>
        </div>
      </div>
    );
  }

  // Create a compatible AdminUser for components that expect the password field
  const compatibleUser: AdminUser | null = currentUser ? {
    id: currentUser.id,
    username: currentUser.username,
    role: currentUser.role,
    password: '' // Provide empty string as default
  } : null;

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <AdminHeader currentUser={compatibleUser} onLogout={handleLogout} />

        <div className="container mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <AdminSidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              currentUser={compatibleUser}
              canAccess={canAccess}
            />

            {/* Main Content */}
            <div className="lg:col-span-3">
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
      </div>

      {/* زر تثبيت التغييرات */}
      <CommitChangesButton />
    </div>
  );
};

export default AdminDashboard;
