
import { useState, useEffect } from 'react';
import { Product, SiteSettings } from '../types/admin';
import { useToast } from '@/hooks/use-toast';
import AuthService from '../utils/auth';
import SettingsService from '../utils/settingsService';
import ProductService from '../utils/productService';

interface AdminUser {
  id: number;
  username: string;
  role: string;
}

export const useAdminData = () => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // تحميل البيانات عند بدء التطبيق
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // تحميل المستخدم الحالي
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);
      
      // تحميل المنتجات من Supabase
      const loadedProducts = await ProductService.getProducts();
      setProducts(loadedProducts);
      
      // تحميل الإعدادات من Supabase
      const loadedSettings = await SettingsService.getSiteSettings();
      setSiteSettings(loadedSettings);
      
      console.log('useAdminData: All data loaded successfully');
    } catch (error) {
      console.error('useAdminData: Error loading data:', error);
      toast({
        title: "خطأ في تحميل البيانات",
        description: "حدث خطأ أثناء تحميل البيانات من الخادم",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // الاستماع لتحديثات المنتجات
  useEffect(() => {
    const handleProductsUpdate = async (event: CustomEvent) => {
      console.log('useAdminData: Products updated event received');
      const updatedProducts = await ProductService.getProducts();
      setProducts(updatedProducts);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
    };
  }, []);

  // الاستماع لتحديثات الإعدادات
  useEffect(() => {
    const handleSettingsUpdate = async (event: CustomEvent) => {
      console.log('useAdminData: Settings updated event received');
      const updatedSettings = await SettingsService.getSiteSettings();
      setSiteSettings(updatedSettings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  const canAccess = (role: 'مدير عام' | 'مبرمج' | 'مشرف'): boolean => {
    if (!currentUser) return false;
    
    const roleHierarchy = {
      'مدير عام': 3,
      'مبرمج': 2,
      'مشرف': 1
    };
    
    const userLevel = roleHierarchy[currentUser.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[role];
    
    return userLevel >= requiredLevel;
  };

  return {
    currentUser,
    products,
    setProducts,
    siteSettings,
    setSiteSettings,
    isLoading,
    canAccess,
    toast,
    loadAdminData
  };
};
