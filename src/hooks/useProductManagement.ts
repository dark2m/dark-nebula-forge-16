
import { useState, useCallback, useEffect } from 'react';
import SupabaseProductService from '../utils/supabaseProductService';
import type { Product } from '../types/admin';

export const useProductManagement = (
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean,
  toast: any
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // تحميل المنتجات من Supabase
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const loadedProducts = await SupabaseProductService.getProducts();
      console.log('useProductManagement: Loaded products from Supabase:', loadedProducts.length);
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل المنتجات",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // تحميل المنتجات عند بداية الـ hook
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = useCallback(async () => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لإضافة المنتجات",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const newProduct = await SupabaseProductService.addProduct({
        name: 'منتج جديد',
        price: 0,
        category: 'pubg',
        images: [],
        videos: [],
        description: 'وصف المنتج',
        features: [],
        textSize: 'medium',
        titleSize: 'large'
      });

      if (newProduct) {
        setProducts(prev => [newProduct, ...prev]);
        toast({
          title: "تم إضافة المنتج",
          description: "تم إضافة منتج جديد بنجاح في Supabase",
          variant: "default"
        });
        return newProduct;
      }
      
      throw new Error('Failed to add product');
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
      return null;
    }
  }, [canAccess, toast]);

  const updateProduct = useCallback(async (id: number, updates: Partial<Product>) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('useProductManagement: Updating product in Supabase:', id, updates);
      const success = await SupabaseProductService.updateProduct(id, updates);
      
      if (success) {
        // تحديث المنتج في الحالة المحلية
        setProducts(prev => prev.map(p => 
          p.id === id ? { ...p, ...updates } : p
        ));
        
        toast({
          title: "تم حفظ التعديل",
          description: "تم حفظ تعديلات المنتج بنجاح في Supabase",
          variant: "default"
        });
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast]);

  const deleteProduct = useCallback(async (id: number) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const success = await SupabaseProductService.deleteProduct(id);
      
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast({
          title: "تم حذف المنتج",
          description: "تم حذف المنتج بنجاح من Supabase",
          variant: "default"
        });
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast]);

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts
  };
};
