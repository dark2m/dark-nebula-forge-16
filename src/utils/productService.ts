
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
      
      // تصفية أقل صرامة - فقط التأكد من الخصائص الأساسية
      const validProducts = parsed.filter(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id !== 'undefined' && 
        typeof item.name === 'string' && 
        typeof item.category === 'string' &&
        typeof item.price === 'number'
      );
      
      console.log('ProductService: Valid products found:', validProducts.length);
      
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
      console.log('ProductService: Saving products:', products.length, 'items');
      
      // التأكد من أن كل منتج له خصائص صحيحة
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
        titleSize: product.titleSize || 'large',
        backgroundColor: product.backgroundColor || '',
        backgroundImage: product.backgroundImage || ''
      }));
      
      localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(validProducts));
      console.log('ProductService: Products saved successfully');
      
      // إشعار جميع النوافذ بالتحديث
      window.dispatchEvent(new CustomEvent('productsUpdated', { 
        detail: { products: validProducts } 
      }));
    } catch (error) {
      console.error('ProductService: Error saving products:', error);
      
      // في حالة فشل الحفظ، نحاول تقليل البيانات
      try {
        const simpleProducts = products.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          category: product.category,
          description: product.description || '',
          features: [],
          images: [],
          videos: [],
          textSize: 'medium',
          titleSize: 'large'
        }));
        
        localStorage.setItem(this.PRODUCTS_KEY, JSON.stringify(simpleProducts));
        console.log('ProductService: Products saved with reduced data');
      } catch (fallbackError) {
        console.error('ProductService: Fallback save also failed:', fallbackError);
        throw new Error('فشل في حفظ البيانات - مساحة التخزين ممتلئة');
      }
    }
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    console.log('ProductService: Adding new product:', product);
    const products = ProductService.getProducts();
    const newProduct: Product = {
      ...product,
      id: Date.now() + Math.random(), // معرف فريد
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
      // دمج التحديثات مع المنتج الموجود
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

  // دالة للحصول على معلومات استخدام التخزين
  static getStorageInfo(): { used: number, available: number, percentage: number } {
    try {
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
