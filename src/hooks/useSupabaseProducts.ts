
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/types/admin';

export const useSupabaseProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل المنتجات من قاعدة البيانات
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedProducts: Product[] = (data || []).map(product => ({
        id: Number(product.id),
        name: product.name,
        price: String(product.price),
        category: product.category,
        description: product.description || '',
        features: Array.isArray(product.features) ? 
          (product.features as string[]) : [],
        image: product.image || '',
        images: Array.isArray(product.images) ? 
          (product.images as string[]) : [],
        videos: Array.isArray(product.videos) ? 
          (product.videos as string[]) : [],
        textSize: product.text_size || 'medium',
        titleSize: product.title_size || 'large',
        inStock: product.in_stock ?? true,
        isActive: product.is_active ?? true,
        rating: product.rating || 5,
        createdAt: product.created_at || new Date().toISOString()
      }));

      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل المنتجات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة منتج جديد
  const addProduct = async (category: string = 'pubg') => {
    try {
      setIsSaving(true);
      
      const categoryLabels: { [key: string]: string } = {
        pubg: 'هكر ببجي موبايل',
        web: 'موقع ويب',
        discord: 'بوت ديسكورد',
        other: 'خدمة'
      };

      // الحصول على أعلى ID موجود وإضافة 1
      const { data: existingProducts } = await supabase
        .from('products')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = existingProducts && existingProducts.length > 0 
        ? existingProducts[0].id + 1 
        : 1;

      const newProductData = {
        id: nextId,
        name: `${categoryLabels[category] || 'منتج'} جديد`,
        price: 0,
        category: category,
        description: 'وصف المنتج',
        features: [],
        image: '',
        images: [],
        videos: [],
        text_size: 'medium',
        title_size: 'large',
        in_stock: true,
        is_active: true,
        rating: 5
      };

      const { data, error } = await supabase
        .from('products')
        .insert([newProductData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إضافة المنتج",
        description: "تم إضافة منتج جديد بنجاح",
        variant: "default"
      });

      // إعادة تحميل المنتجات
      await loadProducts();
      
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة المنتج",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث منتج
  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      setIsSaving(true);

      // تحويل البيانات لتتناسب مع قاعدة البيانات
      const dbUpdates: any = {};
      
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.price !== undefined) dbUpdates.price = Number(updates.price);
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.features !== undefined) dbUpdates.features = updates.features;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.videos !== undefined) dbUpdates.videos = updates.videos;
      if (updates.textSize !== undefined) dbUpdates.text_size = updates.textSize;
      if (updates.titleSize !== undefined) dbUpdates.title_size = updates.titleSize;
      if (updates.inStock !== undefined) dbUpdates.in_stock = updates.inStock;
      if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;

      const { error } = await supabase
        .from('products')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      // تحديث المنتج في الحالة المحلية
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      );

      console.log(`Product ${id} updated successfully`);
      
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المنتج",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف منتج
  const deleteProduct = async (id: number) => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // إزالة المنتج من الحالة المحلية
      setProducts(prevProducts => prevProducts.filter(p => p.id !== id));

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
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    isLoading,
    isSaving,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts
  };
};
