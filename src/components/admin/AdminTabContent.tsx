
import React from 'react';
import ProductsTab from './ProductsTab';
import SiteControlTabWithSupabase from './SiteControlTabWithSupabase';
import TextsTabWithSupabase from './TextsTabWithSupabase';
import NavigationTabWithSupabase from './NavigationTabWithSupabase';
import ContactTab from './ContactTab';
import DesignTabWithSupabase from './DesignTabWithSupabase';
import LivePreviewTab from './LivePreviewTab';
import BackupTab from './BackupTab';
import OverviewTab from './OverviewTab';
import UsersTab from './UsersTab';
import PasswordsTab from './PasswordsTab';
import ToolsTab from './ToolsTab';
import CustomerSupportTabWithSupabase from './CustomerSupportTabWithSupabase';
import DownloadsTab from './DownloadsTab';
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
          <OverviewTab products={products} />
        );

      case 'products':
        return (
          <ProductsTab
            canAccess={canAccess}
          />
        );

      case 'downloads':
        return (
          <DownloadsTab
            canAccess={canAccess}
          />
        );

      case 'users':
        return <UsersTab />;

      case 'passwords':
        return <PasswordsTab />;

      case 'tools':
        return <ToolsTab />;

      case 'customer-support':
        return <CustomerSupportTabWithSupabase />;

      case 'site-control':
        return <SiteControlTabWithSupabase />;

      case 'texts':
        return <TextsTabWithSupabase />;

      case 'navigation':
        return <NavigationTabWithSupabase />;

      case 'contact':
        return (
          <ContactTab
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        );

      case 'design':
        return <DesignTabWithSupabase />;

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
