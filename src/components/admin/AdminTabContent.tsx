
import React from 'react';
import ProductsTab from './ProductsTab';
import SiteControlTab from './SiteControlTab';
import TextsTab from './TextsTab';
import NavigationTab from './NavigationTab';
import ContactTab from './ContactTab';
import DesignTab from './DesignTab';
import LivePreviewTab from './LivePreviewTab';
import BackupTab from './BackupTab';
import type { Product, SiteSettings } from '../../types/admin';

interface AdminTabContentProps {
  activeTab: string;
  products: Product[];
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
  addProduct: () => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const AdminTabContent: React.FC<AdminTabContentProps> = ({
  activeTab,
  products,
  siteSettings,
  setSiteSettings,
  saveSiteSettings,
  addProduct,
  updateProduct,
  deleteProduct,
  canAccess
}) => {
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">نظرة عامة</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="admin-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-blue-400 mb-2">إجمالي المنتجات</h3>
                <p className="text-3xl font-bold text-white">{products.length}</p>
              </div>
              
              <div className="admin-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-green-400 mb-2">منتجات ببجي</h3>
                <p className="text-3xl font-bold text-white">
                  {products.filter(p => p.category === 'pubg').length}
                </p>
              </div>
              
              <div className="admin-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-purple-400 mb-2">خدمات الويب</h3>
                <p className="text-3xl font-bold text-white">
                  {products.filter(p => p.category === 'web').length}
                </p>
              </div>
              
              <div className="admin-card rounded-xl p-6">
                <h3 className="text-lg font-bold text-cyan-400 mb-2">بوتات ديسكورد</h3>
                <p className="text-3xl font-bold text-white">
                  {products.filter(p => p.category === 'discord').length}
                </p>
              </div>
            </div>
            
            <div className="admin-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">إحصائيات الموقع</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-blue-400 font-semibold mb-2">عنوان الموقع</h4>
                  <p className="text-white">{siteSettings.title}</p>
                </div>
                <div>
                  <h4 className="text-green-400 font-semibold mb-2">عدد عناصر التنقل</h4>
                  <p className="text-white">{siteSettings.navigation?.length || 0}</p>
                </div>
                <div>
                  <h4 className="text-purple-400 font-semibold mb-2">عدد المميزات</h4>
                  <p className="text-white">{siteSettings.pageTexts?.home?.features?.length || 0}</p>
                </div>
                <div>
                  <h4 className="text-cyan-400 font-semibold mb-2">اللون الأساسي</h4>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: siteSettings.colors?.primary }}
                    />
                    <span className="text-white">{siteSettings.colors?.primary}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'products':
        return (
          <ProductsTab
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            canAccess={canAccess}
          />
        );

      case 'site-control':
        return (
          <SiteControlTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );

      case 'texts':
        return (
          <TextsTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );

      case 'navigation':
        return (
          <NavigationTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );

      case 'contact':
        return (
          <ContactTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );

      case 'design':
        return <DesignTab />;

      case 'preview':
        return <LivePreviewTab siteSettings={siteSettings} />;

      case 'backup':
        return (
          <BackupTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
          />
        );

      default:
        return <div className="text-white">تبويب غير موجود</div>;
    }
  };

  return <div>{renderTabContent()}</div>;
};

export default AdminTabContent;
