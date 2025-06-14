
import { Product } from '../types/admin';
import SupabaseProductService from './supabaseProductService';
import PersistenceService from './persistenceService';

class ProductService {
  static async getProducts(): Promise<Product[]> {
    try {
      console.log('ProductService: Getting products from Supabase...');
      return await SupabaseProductService.getProducts();
    } catch (error) {
      console.error('ProductService: Error loading products:', error);
      return [];
    }
  }

  static async saveProducts(products: Product[]): Promise<void> {
    try {
      console.log('ProductService: Saving products to Supabase:', products.length);
      
      // حفظ كل منتج في Supabase
      for (const product of products) {
        await SupabaseProductService.saveProduct(product);
      }
      
      console.log('ProductService: All products saved successfully');
      
      // تسجيل التغيير كمعلق
      PersistenceService.setPendingChanges('products', true);
      
      // إطلاق حدث التحديث
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products } 
      }));
      
    } catch (error) {
      console.error('ProductService: Error saving products:', error);
      throw error;
    }
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<Product | null> {
    try {
      console.log('ProductService: Adding new product:', product);
      const newProduct = await SupabaseProductService.addProduct(product);
      
      if (newProduct) {
        console.log('ProductService: New product added with ID:', newProduct.id);
        
        // إطلاق حدث التحديث
        const allProducts = await this.getProducts();
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { products: allProducts } 
        }));
      }
      
      return newProduct;
    } catch (error) {
      console.error('ProductService: Error adding product:', error);
      return null;
    }
  }

  static async updateProduct(id: number, updates: Partial<Product>): Promise<void> {
    try {
      console.log('ProductService: Updating product:', id, updates);
      const products = await this.getProducts();
      const productIndex = products.findIndex(p => p.id === id);
      
      if (productIndex !== -1) {
        const updatedProduct = { ...products[productIndex], ...updates };
        const success = await SupabaseProductService.saveProduct(updatedProduct);
        
        if (success) {
          console.log('ProductService: Product updated successfully');
          
          // إطلاق حدث التحديث
          const allProducts = await this.getProducts();
          window.dispatchEvent(new CustomEvent('productsUpdated', { 
            detail: { products: allProducts } 
          }));
        }
      } else {
        console.warn('ProductService: Product not found for update:', id);
      }
    } catch (error) {
      console.error('ProductService: Error updating product:', error);
    }
  }

  static async deleteProduct(id: number): Promise<void> {
    try {
      console.log('ProductService: Deleting product:', id);
      const success = await SupabaseProductService.deleteProduct(id);
      
      if (success) {
        console.log('ProductService: Product deleted successfully');
        
        // إطلاق حدث التحديث
        const allProducts = await this.getProducts();
        window.dispatchEvent(new CustomEvent('productsUpdated', { 
          detail: { products: allProducts } 
        }));
      }
    } catch (error) {
      console.error('ProductService: Error deleting product:', error);
    }
  }
}

export default ProductService;
