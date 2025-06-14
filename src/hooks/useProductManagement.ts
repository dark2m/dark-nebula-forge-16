
import { useState, useCallback } from 'react';
import ProductService from '../utils/productService';
import type { Product } from '../types/admin';

export const useProductManagement = (
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean,
  toast: any
) => {
  const [products, setProducts] = useState<Product[]>(() => ProductService.getProducts());

  // تحديث المنتجات مع مراقبة التغييرات
  const refreshProducts = useCallback(() => {
    const updatedProducts = ProductService.getProducts();
    setProducts(updatedProducts);
    console.log('Products refreshed:', updatedProducts.length);
  }, []);

  const addProduct = useCallback(() => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لإضافة المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Adding new product...');
    
    try {
      const newProduct = ProductService.addProduct({
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
      
      console.log('New product added:', newProduct);
      refreshProducts();
      
      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة منتج جديد بنجاح"
      });
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast, refreshProducts]);

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
      console.log('Updating product:', id, updates);
      ProductService.updateProduct(id, updates);
      refreshProducts();
      
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast, refreshProducts]);

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
      refreshProducts();
      
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح"
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive"
      });
    }
  }, [canAccess, toast, refreshProducts]);

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  };
};
