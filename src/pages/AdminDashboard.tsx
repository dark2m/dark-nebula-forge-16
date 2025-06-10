
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '../components/StarryBackground';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabContent from '../components/admin/AdminTabContent';
import AuthService from '../utils/auth';
import AdminStorage from '../utils/adminStorage';
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
    setProducts,
    toast
  );

  const handleLogout = () => {
    AuthService.logout();
    navigate('/admin/login');
  };

  const saveSiteSettings = () => {
    AdminStorage.saveSiteSettings(siteSettings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <AdminHeader currentUser={currentUser} onLogout={handleLogout} />

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
    </div>
  );
};

export default AdminDashboard;
