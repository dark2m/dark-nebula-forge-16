
import { Product } from '../types/admin';

class ProductService {
  private static PRODUCTS_KEY = 'admin_products';

  static getProducts(): Product[] {
    try {
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      if (!stored) {
        const defaultProducts = this.getDefaultProducts();
        this.saveProducts(defaultProducts);
        return defaultProducts;
      }
      
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        console.warn('Products data is not an array, resetting to defaults');
        const defaultProducts = this.getDefaultProducts();
        this.saveProducts(defaultProducts);
        return defaultProducts;
      }
      
      return parsed;
    } catch (error) {
      console.error('Error loading products:', error);
      const defaultProducts = this.getDefaultProducts();
      this.saveProducts(defaultProducts);
      return defaultProducts;
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
      }
    ];
  }

  static saveProducts(products: Product[]): void {
    try {
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('خطأ في حفظ المنتجات:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  static updateProduct(id: number, updates: Partial<Product>): void {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      this.saveProducts(products);
    }
  }

  static deleteProduct(id: number): void {
    const products = this.getProducts().filter(p => p.id !== id);
    this.saveProducts(products);
  }
}

export default ProductService;
