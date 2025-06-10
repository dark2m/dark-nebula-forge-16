
import React from 'react';
import ProductsTab from './ProductsTab';
import ContactTab from './ContactTab';
import NavigationTab from './NavigationTab';
import BackgroundTab from './BackgroundTab';
import AccessDenied from './AccessDenied';
import OverviewTab from './OverviewTab';
import PasswordsTab from './PasswordsTab';
import SettingsTab from './SettingsTab';
import UsersTab from './UsersTab';
import TypographyTab from './TypographyTab';
import DesignTab from './DesignTab';
import TextsTab from './TextsTab';
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
  canAccess: (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
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
  switch (activeTab) {
    case 'overview':
      return canAccess('مشرف') ? <OverviewTab products={products} /> : <AccessDenied />;
    
    case 'products':
      return canAccess('مبرمج') ? (
        <ProductsTab 
          products={products}
          addProduct={addProduct}
          updateProduct={updateProduct}
          deleteProduct={deleteProduct}
        />
      ) : <AccessDenied />;
    
    case 'background':
      return canAccess('مبرمج') ? (
        <BackgroundTab 
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          saveSiteSettings={saveSiteSettings}
        />
      ) : <AccessDenied />;
    
    case 'contact':
      return canAccess('مدير عام') ? (
        <ContactTab 
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          saveSiteSettings={saveSiteSettings}
        />
      ) : <AccessDenied />;
    
    case 'navigation':
      return canAccess('مدير عام') ? (
        <NavigationTab 
          siteSettings={siteSettings}
          setSiteSettings={setSiteSettings}
          saveSiteSettings={saveSiteSettings}
        />
      ) : <AccessDenied />;

    case 'passwords':
      return canAccess('مدير عام') ? <PasswordsTab /> : <AccessDenied />;

    case 'design':
      return canAccess('مدير عام') ? <DesignTab /> : <AccessDenied />;

    case 'typography':
      return canAccess('مدير عام') ? <TypographyTab /> : <AccessDenied />;

    case 'users':
      return canAccess('مدير عام') ? <UsersTab /> : <AccessDenied />;

    case 'settings':
      return canAccess('مدير عام') ? <SettingsTab /> : <AccessDenied />;

    case 'texts':
      return canAccess('مدير عام') ? <TextsTab /> : <AccessDenied />;
    
    default:
      return canAccess('مشرف') ? <OverviewTab products={products} /> : <AccessDenied />;
  }
};

export default AdminTabContent;
