
import { useState, useEffect } from 'react';
import { Product } from '../types/admin';
import ProductService from '../utils/productService';

export const useProductManagement = (
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean,
  toast: any
) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // تحميل المنتجات عند بدء التطبيق
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const loadedProducts = await ProductService.getProducts();
      setProducts(loadedProducts);
      console.log('useProductManagement: Products loaded:', loadedProducts.length);
    } catch (error) {
      console.error('useProductManagement: Error loading products:', error);
      toast({
        title: "خطأ في تحميل المنتجات",
        description: "حدث خطأ أثناء تحميل المنتجات من الخادم",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // الاستماع لتحديثات المنتجات
  useEffect(() => {
    const handleProductsUpdate = (event: CustomEvent) => {
      if (event.detail?.products) {
        setProducts(event.detail.products);
        console.log('useProductManagement: Products updated via event');
      }
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
    };
  }, []);

  const addProduct = async (): Promise<Product | null> => {
    if (!canAccess('مشرف')) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية لإضافة منتجات",
        variant: "destructive"
      });
      return null;
    }

    try {
      const newProduct = await ProductService.addProduct({
        name: 'منتج جديد',
        price: 0,
        category: 'pubg',
        description: '',
        features: [],
        images: [],
        videos: [],
        textSize: 'medium',
        titleSize: 'large'
      });

      if (newProduct) {
        toast({
          title: "تم إضافة المنتج",
          description: "تم إضافة منتج جديد بنجاح"
        });
        
        // تحديث القائمة المحلية
        await loadProducts();
      }
      
      return newProduct;
    } catch (error) {
      console.error('useProductManagement: Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
      return null;
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>): Promise<void> => {
    if (!canAccess('مشرف')) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية لتعديل المنتجات",
        variant: "destructive"
      });
      return;
    }

    try {
      await ProductService.updateProduct(id, updates);
      
      // تحديث القائمة المحلية
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      );
      
      console.log('useProductManagement: Product updated:', id);
    } catch (error) {
      console.error('useProductManagement: Error updating product:', error);
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث المنتج",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (id: number): Promise<void> => {
    if (!canAccess('مدير عام')) {
      toast({
        title: "غير مصرح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }

    try {
      await ProductService.deleteProduct(id);
      
      // تحديث القائمة المحلية
      setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      
      toast({
        title: "تم حذف المنتج",
        description: "تم حذف المنتج بنجاح"
      });
      
      console.log('useProductManagement: Product deleted:', id);
    } catch (error) {
      console.error('useProductManagement: Error deleting product:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف المنتج",
        variant: "destructive"
      });
    }
  };

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    loadProducts
  };
};
