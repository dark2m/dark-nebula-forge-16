
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductService from '../utils/productService';
import SettingsService from '../utils/settingsService';
import AuthService from '../utils/auth';
import { useToast } from '@/hooks/use-toast';
import type { Product, AdminUser, SiteSettings } from '../types/admin';

export const useAdminData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);

  // Load data on component mount
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    setCurrentUser(user);
    
    // تنظيف وتحميل المنتجات
    ProductService.cleanupStorage();
    setProducts(ProductService.getProducts());
    
    // تحميل الإعدادات
    console.log('useAdminData: Loading settings...');
    const loadedSettings = SettingsService.getSiteSettings();
    console.log('useAdminData: Loaded settings:', loadedSettings);
    setSiteSettings(loadedSettings);

    // الاستماع لتحديثات الإعدادات
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('useAdminData: Settings updated via event:', event.detail.settings);
      setSiteSettings(event.detail.settings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, [navigate]);

  // تحديث setSiteSettings لحفظ التغييرات تلقائياً
  const updateSiteSettings = (newSettings: SiteSettings) => {
    console.log('useAdminData: Updating settings:', newSettings);
    setSiteSettings(newSettings);
    
    // حفظ فوري عند التحديث
    try {
      SettingsService.saveSiteSettings(newSettings);
      console.log('useAdminData: Settings saved successfully');
    } catch (error) {
      console.error('useAdminData: Error saving settings:', error);
    }
  };

  const canAccess = (requiredRole: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean => {
    return AuthService.hasPermission(requiredRole);
  };

  return {
    currentUser,
    products,
    setProducts,
    siteSettings,
    setSiteSettings: updateSiteSettings,
    canAccess,
    toast
  };
};
