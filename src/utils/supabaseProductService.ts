
import { supabase } from '@/integrations/supabase/client';
import { Product } from '../types/admin';

class SupabaseProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      console.log('SupabaseProductService: Getting products from Supabase...');
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      // تحويل البيانات من Supabase إلى تنسيق Product
      const products: Product[] = (data || []).map(item => ({
        id: item.id,
        name: item.name,
        price: Number(item.price),
        category: item.category,
        description: item.description || '',
        features: Array.isArray(item.features) ? item.features : [],
        images: Array.isArray(item.images) ? item.images : [],
        videos: Array.isArray(item.videos) ? item.videos : [],
        textSize: item.text_size as 'small' | 'medium' | 'large' || 'medium',
        titleSize: item.title_size as 'small' | 'medium' | 'large' | 'xl' || 'large'
      }));

      console.log('SupabaseProductService: Loaded products:', products.length);
      return products;
    } catch (error) {
      console.error('SupabaseProductService: Error loading products:', error);
      return [];
    }
  }

  static async saveProduct(product: Product): Promise<boolean> {
    try {
      console.log('SupabaseProductService: Saving product to Supabase:', product);

      const productData = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        features: product.features,
        images: product.images,
        videos: product.videos,
        text_size: product.textSize,
        title_size: product.titleSize
      };

      const { error } = await supabase
        .from('products')
        .upsert(productData);

      if (error) {
        console.error('Error saving product:', error);
        return false;
      }

      console.log('SupabaseProductService: Product saved successfully');
      return true;
    } catch (error) {
      console.error('SupabaseProductService: Error saving product:', error);
      return false;
    }
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      console.log('SupabaseProductService: Adding new product:', product);

      const productData = {
        name: product.name,
        price: product.price,
        category: product.category,
        description: product.description,
        features: product.features,
        images: product.images,
        videos: product.videos,
        text_size: product.textSize,
        title_size: product.titleSize
      };

      const { data, error } = await supabase
        .from('products')
        .insert(productData)
        .select()
        .single();

      if (error) {
        console.error('Error adding product:', error);
        return null;
      }

      // تحويل البيانات المُرجعة إلى تنسيق Product
      const newProduct: Product = {
        id: data.id,
        name: data.name,
        price: Number(data.price),
        category: data.category,
        description: data.description || '',
        features: Array.isArray(data.features) ? data.features : [],
        images: Array.isArray(data.images) ? data.images : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        textSize: data.text_size as 'small' | 'medium' | 'large' || 'medium',
        titleSize: data.title_size as 'small' | 'medium' | 'large' | 'xl' || 'large'
      };

      console.log('SupabaseProductService: New product added:', newProduct);
      return newProduct;
    } catch (error) {
      console.error('SupabaseProductService: Error adding product:', error);
      return null;
    }
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<boolean> {
    try {
      console.log('SupabaseProductService: Updating product:', id, updates);

      const updateData: any = {};
      
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.price !== undefined) updateData.price = updates.price;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.features !== undefined) updateData.features = updates.features;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.videos !== undefined) updateData.videos = updates.videos;
      if (updates.textSize !== undefined) updateData.text_size = updates.textSize;
      if (updates.titleSize !== undefined) updateData.title_size = updates.titleSize;

      const { error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Error updating product:', error);
        return false;
      }

      console.log('SupabaseProductService: Product updated successfully');
      return true;
    } catch (error) {
      console.error('SupabaseProductService: Error updating product:', error);
      return false;
    }
  }

  static async deleteProduct(id: number): Promise<boolean> {
    try {
      console.log('SupabaseProductService: Deleting product:', id);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }

      console.log('SupabaseProductService: Product deleted successfully');
      return true;
    } catch (error) {
      console.error('SupabaseProductService: Error deleting product:', error);
      return false;
    }
  }
}

export default SupabaseProductService;
