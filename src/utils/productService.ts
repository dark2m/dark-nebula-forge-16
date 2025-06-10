
import { Product } from '../types/admin';

class ProductService {
  private static PRODUCTS_KEY = 'admin_products';

  static getProducts(): Product[] {
    try {
      console.log('ProductService: Getting products from localStorage...');
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      
      if (!stored) {
        console.log('ProductService: No products found, creating defaults...');
        const defaultProducts = ProductService.getDefaultProducts();
        ProductService.saveProducts(defaultProducts);
        return defaultProducts;
      }
      
      const parsed = JSON.parse(stored);
      console.log('ProductService: Parsed products:', parsed);
      
      if (!Array.isArray(parsed)) {
        console.warn('ProductService: Products data is not an array, resetting to defaults');
        const defaultProducts = ProductService.getDefaultProducts();
        ProductService.saveProducts(defaultProducts);
        return defaultProducts;
      }
      
      // التأكد من أن كل عنصر هو منتج صحيح
      const validProducts = parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        item.hasOwnProperty('id') && 
        item.hasOwnProperty('name') && 
        item.hasOwnProperty('category') &&
        item.hasOwnProperty('price')
      );
      
      console.log('ProductService: Valid products:', validProducts);
      
      if (validProducts.length !== parsed.length) {
        console.warn('ProductService: Some invalid products removed, saving cleaned data');
        ProductService.saveProducts(validProducts);
      }
      
      return validProducts;
    } catch (error) {
      console.error('ProductService: Error loading products:', error);
      const defaultProducts = ProductService.getDefaultProducts();
      ProductService.saveProducts(defaultProducts);
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
      },
      { 
        id: 3, 
        name: 'موقع ويب شخصي', 
        price: 150, 
        category: 'web',
        images: [],
        videos: [],
        description: 'تصميم موقع ويب شخصي احترافي',
        features: ['تصميم عصري', 'متجاوب مع جميع الأجهزة', 'سرعة عالية', 'SEO محسن'],
        textSize: 'medium',
        titleSize: 'large'
      },
      { 
        id: 4, 
        name: 'بوت ديسكورد متعدد الوظائف', 
        price: 75, 
        category: 'discord',
        images: [],
        videos: [],
        description: 'بوت ديسكورد مخصص مع مميزات متقدمة',
        features: ['إدارة السيرفر', 'نظام البوتات', 'ألعاب تفاعلية', 'دعم متعدد اللغات'],
        textSize: 'medium',
        titleSize: 'large'
      }
    ];
  }

  static saveProducts(products: Product[]): void {
    try {
      console.log('ProductService: Saving products:', products);
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(products));
      console.log('ProductService: Products saved successfully');
      
      // إشعار جميع النوافذ بالتحديث
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products } 
      }));
    } catch (error) {
      console.error('ProductService: Error saving products:', error);
      throw new Error('تم تجاوز حد التخزين المسموح');
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    console.log('ProductService: Adding new product:', product);
    const products = ProductService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now()
    };
    products.push(newProduct);
    ProductService.saveProducts(products);
    console.log('ProductService: New product added:', newProduct);
    return newProduct;
  }

  static updateProduct(id: number, updates: Partial<Product>): void {
    console.log('ProductService: Updating product:', id, updates);
    const products = ProductService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...updates };
      ProductService.saveProducts(products);
      console.log('ProductService: Product updated successfully');
    } else {
      console.warn('ProductService: Product not found for update:', id);
    }
  }

  static deleteProduct(id: number): void {
    console.log('ProductService: Deleting product:', id);
    const products = ProductService.getProducts().filter(p => p.id !== id);
    ProductService.saveProducts(products);
    console.log('ProductService: Product deleted successfully');
  }
}

export default ProductService;
