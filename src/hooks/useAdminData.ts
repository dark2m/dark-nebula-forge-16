
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseProductService from '../utils/supabaseProductService';
import SupabaseSettingsService from '../utils/supabaseSettingsService';
import AuthService from '../utils/auth';
import { useToast } from '@/hooks/use-toast';
import type { Product, AdminUser, SiteSettings } from '../types/admin';

export const useAdminData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const user = AuthService.getCurrentUser();
      if (!user) {
        navigate('/admin/login');
        return;
      }
      setCurrentUser(user);
      
      try {
        // تحميل المنتجات من Supabase
        console.log('useAdminData: Loading products from Supabase...');
        const loadedProducts = await SupabaseProductService.getProducts();
        setProducts(loadedProducts);
        console.log('useAdminData: Loaded products:', loadedProducts.length);
        
        // تحميل الإعدادات من Supabase
        console.log('useAdminData: Loading settings from Supabase...');
        const loadedSettings = await SupabaseSettingsService.getSiteSettings();
        setSiteSettings(loadedSettings);
        console.log('useAdminData: Loaded settings:', loadedSettings);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "خطأ في التحميل",
          description: "حدث خطأ أثناء تحميل البيانات من Supabase",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [navigate, toast]);

  // تحديث setSiteSettings لحفظ التغييرات في Supabase
  const updateSiteSettings = async (newSettings: SiteSettings) => {
    console.log('useAdminData: Updating settings in Supabase:', newSettings);
    setSiteSettings(newSettings);
    
    try {
      const success = await SupabaseSettingsService.saveSiteSettings(newSettings);
      if (success) {
        console.log('useAdminData: Settings saved successfully to Supabase');
        toast({
          title: "تم حفظ الإعدادات",
          description: "تم حفظ الإعدادات بنجاح في Supabase"
        });
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('useAdminData: Error saving settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
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
    toast,
    loading
  };
};
