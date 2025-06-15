import { useState, useCallback, useEffect } from 'react';
import ProductService from '../utils/productService';
import type { Product } from '../types/admin';

export const useProductManagement = (
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean,
  toast: any
) => {
  const [products, setProducts] = useState<Product[]>([]);

  // تحميل المنتجات عند بداية الـ hook
  useEffect(() => {
    const loadedProducts = ProductService.getProducts();
    console.log('useProductManagement: Initial products loaded:', loadedProducts.length);
    setProducts(loadedProducts);
    
    // الاستماع لتحديثات المنتجات
    const handleProductsUpdate = (event: CustomEvent) => {
      console.log('useProductManagement: Products updated via event:', event.detail.products);
      setProducts(event.detail.products);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
    };
  }, []);

  const refreshProducts = useCallback(() => {
    const updatedProducts = ProductService.getProducts();
    console.log('useProductManagement: Refreshing products:', updatedProducts.length);
    setProducts(updatedProducts);
  }, []);

  const addProduct = useCallback(() => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لإضافة المنتجات",
        variant: "destructive"
      });
      return null;
    }
    
    try {
      const newProduct = ProductService.addProduct({
        name: 'منتج جديد',
        price: 0,
        category: 'pubg',
        image: '', // Add missing image property
        images: [],
        videos: [],
        description: 'وصف المنتج',
        features: [],
        textSize: 'medium',
        titleSize: 'large',
        inStock: true,
        isActive: true,
        createdAt: new Date().toISOString() // Add missing createdAt property
      });
      
      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة منتج جديد بنجاح",
        variant: "default"
      });
      
      return newProduct;
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

  const updateProduct = useCallback((id: number, updates: Partial<Product>) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لتعديل المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    try {
      console.log('useProductManagement: Updating product:', id, updates);
      ProductService.updateProduct(id, updates);
      
      toast({
        title: "تم حفظ التعديل",
        description: "تم حفظ تعديلات المنتج بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast]);

  const deleteProduct = useCallback((id: number) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    try {
      ProductService.deleteProduct(id);
      
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح",
        variant: "default"
      });
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
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  };
};
