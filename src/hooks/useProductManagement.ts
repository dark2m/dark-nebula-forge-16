
import AdminStorage from '../utils/adminStorage';
import type { Product } from '../types/admin';

export const useProductManagement = (
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean,
  setProducts: (products: Product[]) => void,
  toast: any
) => {
  const addProduct = () => {
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
      const newProduct = AdminStorage.addProduct({
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
      
      // تحديث قائمة المنتجات
      const updatedProducts = AdminStorage.getProducts();
      setProducts(updatedProducts);
      
      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة منتج جديد بنجاح"
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
    }
  };

  const updateProduct = (id: number, updates: Partial<Product>) => {
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
      AdminStorage.updateProduct(id, updates);
      
      // تحديث قائمة المنتجات
      const updatedProducts = AdminStorage.getProducts();
      setProducts(updatedProducts);
      
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "تم تجاوز حد التخزين المسموح. يرجى تقليل حجم الصور أو الفيديوهات.",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = (id: number) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "غير مسموح",
        description: "ليس لديك صلاحية لحذف المنتجات",
        variant: "destructive"
      });
      return;
    }
    
    AdminStorage.deleteProduct(id);
    setProducts(AdminStorage.getProducts());
    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح"
    });
  };

  return {
    addProduct,
    updateProduct,
    deleteProduct
  };
};
