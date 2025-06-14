
import { Product } from '../types/admin';

class ProductService {
  private static PRODUCTS_KEY = 'admin_products';
  private static BACKUP_KEY = 'products_backup';

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
      
      return parsed;
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
      }
    ];
  }

  static saveProducts(products: Product[]): void {
    try {
      console.log('ProductService: Force saving products:', products);
      
      // التأكد من صحة البيانات
      const validProducts = products.map(product => ({
        id: product.id,
        name: product.name || 'منتج بدون اسم',
        price: typeof product.price === 'number' ? product.price : 0,
        category: product.category || 'other',
        description: product.description || '',
        features: Array.isArray(product.features) ? product.features : [],
        images: Array.isArray(product.images) ? product.images : [],
        videos: Array.isArray(product.videos) ? product.videos : [],
        textSize: product.textSize || 'medium',
        titleSize: product.titleSize || 'large'
      }));
      
      // حفظ فوري ومباشر
      const jsonData = JSON.stringify(validProducts);
      localStorage.setItem(this.PRODUCTS_KEY, jsonData);
      
      // التحقق من الحفظ
      const verification = localStorage.getItem(this.PRODUCTS_KEY);
      if (!verification) {
        throw new Error('Failed to save to localStorage');
      }
      
      console.log('ProductService: Products saved successfully', validProducts.length, 'items');
      
      // إطلاق حدث التحديث
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: validProducts } 
      }));
      
      // حفظ نسخة احتياطية
      localStorage.setItem(this.BACKUP_KEY, jsonData);
      
    } catch (error) {
      console.error('ProductService: Critical error saving products:', error);
      throw error;
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    console.log('ProductService: Adding new product:', product);
    const products = ProductService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      images: product.images || [],
      videos: product.videos || [],
      features: product.features || [],
      textSize: product.textSize || 'medium',
      titleSize: product.titleSize || 'large'
    };
    
    const updatedProducts = [...products, newProduct];
    ProductService.saveProducts(updatedProducts);
    console.log('ProductService: New product added with ID:', newProduct.id);
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
