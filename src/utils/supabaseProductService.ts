
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
        console.error('SupabaseProductService: Error fetching products:', error);
        return this.getDefaultProducts();
      }

      if (!data || data.length === 0) {
        console.log('SupabaseProductService: No products found, using defaults');
        return this.getDefaultProducts();
      }

      // تحويل البيانات من Supabase إلى تنسيق Product
      const products: Product[] = data.map(item => ({
        id: Number(item.id),
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
      return this.getDefaultProducts();
    }
  }

  static async saveProduct(product: Product): Promise<boolean> {
    try {
      console.log('SupabaseProductService: Saving product:', product.id);

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
        console.error('SupabaseProductService: Error saving product:', error);
        return false;
      }

      console.log('SupabaseProductService: Product saved successfully');
      return true;
    } catch (error) {
      console.error('SupabaseProductService: Error saving product:', error);
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
        console.error('SupabaseProductService: Error deleting product:', error);
        return false;
      }

      console.log('SupabaseProductService: Product deleted successfully');
      return true;
    } catch (error) {
      console.error('SupabaseProductService: Error deleting product:', error);
      return false;
    }
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      const newId = Date.now();
      const newProduct: Product = {
        ...product,
        id: newId,
        images: product.images || [],
        videos: product.videos || [],
        features: product.features || [],
        textSize: product.textSize || 'medium',
        titleSize: product.titleSize || 'large'
      };

      const success = await this.saveProduct(newProduct);
      if (success) {
        console.log('SupabaseProductService: New product added with ID:', newId);
        return newProduct;
      }
      return null;
    } catch (error) {
      console.error('SupabaseProductService: Error adding product:', error);
      return null;
    }
  }

  private static getDefaultProducts(): Product[] {
    return [
      { 
        id: 1, 
        name: 'هكر ESP المتقدم', 
        price: 25, 
        category: 'pubg',
        images: [],
        videos: [],
        description: 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة',
        features: ['ESP للاعبين', 'ESP للأسلحة', 'ESP للسيارات', 'آمن 100%'],
        textSize: 'medium',
        titleSize: 'large'
      },
      { 
        id: 2, 
        name: 'هكر الرؤية الليلية', 
        price: 30, 
        category: 'pubg',
        images: [],
        videos: [],
        description: 'رؤية واضحة في الظلام والأماكن المظلمة',
        features: ['رؤية ليلية متقدمة', 'كشف الأعداء المختبئين', 'تحسين الرؤية', 'آمن ومحدث'],
        textSize: 'medium',
        titleSize: 'large'
      }
    ];
  }
}

export default SupabaseProductService;
