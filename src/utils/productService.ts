
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
      
      // التأكد من أن كل عنصر هو منتج صحيح وليس مستخدم
      const validProducts = parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        item.hasOwnProperty('id') && 
        item.hasOwnProperty('name') && 
        item.hasOwnProperty('category') &&
        item.hasOwnProperty('price') &&
        !item.hasOwnProperty('username') && // التأكد من أنه ليس مستخدم
        !item.hasOwnProperty('password') && // التأكد من أنه ليس مستخدم
        !item.hasOwnProperty('role') // التأكد من أنه ليس مستخدم
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
      
      // تنظيف البيانات وتحسين الحفظ
      const optimizedProducts = products.filter(product => 
        product && 
        typeof product === 'object' && 
        product.hasOwnProperty('name') && 
        product.hasOwnProperty('category') &&
        product.hasOwnProperty('price')
      ).map(product => ({
        ...product,
        // ضغط الصور والفيديوهات الكبيرة
        images: product.images ? product.images.slice(0, 20) : [], // حد أقصى 20 صورة
        videos: product.videos ? product.videos.slice(0, 10) : []  // حد أقصى 10 فيديوهات
      }));
      
      // محاولة الحفظ مع معالجة خطأ امتلاء التخزين
      try {
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(optimizedProducts));
        console.log('ProductService: Products saved successfully');
      } catch (storageError) {
        // إذا امتلأت المساحة، نحاول تقليل البيانات
        console.warn('ProductService: Storage full, trying to optimize...');
        
        const compactProducts = optimizedProducts.map(product => ({
          ...product,
          images: product.images.slice(0, 5), // تقليل إلى 5 صور
          videos: product.videos.slice(0, 3)  // تقليل إلى 3 فيديوهات
        }));
        
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(compactProducts));
        console.log('ProductService: Products saved with optimization');
      }
      
      // إشعار جميع النوافذ بالتحديث
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: optimizedProducts } 
      }));
    } catch (error) {
      console.error('ProductService: Error saving products:', error);
      throw new Error('حدث خطأ في حفظ البيانات');
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    console.log('ProductService: Adding new product:', product);
    const products = ProductService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now(),
      images: [], // البدء بصور فارغة
      videos: []  // البدء بفيديوهات فارغة
    };
    
    const updatedProducts = [...products, newProduct];
    ProductService.saveProducts(updatedProducts);
    console.log('ProductService: New product added:', newProduct);
    return newProduct;
  }

  static updateProduct(id: number, updates: Partial<Product>): void {
    console.log('ProductService: Updating product:', id, updates);
    const products = ProductService.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index !== -1) {
      // التأكد من أن المعرف الصحيح للمنتج
      const updatedProduct = { 
        ...products[index], 
        ...updates,
        id: products[index].id // الحفاظ على المعرف الأصلي
      };
      
      products[index] = updatedProduct;
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

  // إضافة دالة لتنظيف البيانات المختلطة
  static cleanupStorage(): void {
    try {
      console.log('ProductService: Cleaning up storage...');
      
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const cleanProducts = parsed.filter(item => 
            item && 
            typeof item === 'object' && 
            item.hasOwnProperty('name') && 
            item.hasOwnProperty('category') &&
            item.hasOwnProperty('price') &&
            !item.hasOwnProperty('username')
          );
          
          if (cleanProducts.length !== parsed.length) {
            this.saveProducts(cleanProducts);
            console.log('ProductService: Storage cleaned successfully');
          }
        }
      }
    } catch (error) {
      console.error('ProductService: Error cleaning storage:', error);
    }
  }

  // إضافة دالة لمراقبة استخدام التخزين
  static getStorageInfo(): { used: number, available: number, percentage: number } {
    try {
      const testKey = 'storage_test';
      const stored = localStorage.getItem(this.PRODUCTS_KEY);
      const usedBytes = stored ? new Blob([stored]).size : 0;
      
      // تقدير المساحة المتاحة (5MB تقريباً)
      const maxStorage = 5 * 1024 * 1024; // 5MB
      const percentage = (usedBytes / maxStorage) * 100;
      
      return {
        used: usedBytes,
        available: maxStorage - usedBytes,
        percentage: Math.round(percentage)
      };
    } catch (error) {
      return { used: 0, available: 0, percentage: 0 };
    }
  }
}

export default ProductService;
