
import { Product } from '@/types/admin';
import { LocalStorageService } from './localStorageService';

export class ProductService {
  static getProducts(): Product[] {
    return LocalStorageService.getProducts();
  }

  static getProduct(id: number): Product | undefined {
    const products = this.getProducts();
    return products.find(product => product.id === id);
  }

  static addProduct(product: Omit<Product, 'id'>): Product {
    return LocalStorageService.addProduct(product);
  }

  static updateProduct(id: number, updates: Partial<Product>): void {
    LocalStorageService.updateProduct(id, updates);
  }

  static deleteProduct(id: number): void {
    LocalStorageService.deleteProduct(id);
  }

  static getProductsByCategory(category: string): Product[] {
    const products = this.getProducts();
    return products.filter(product => product.category === category);
  }

  static searchProducts(query: string): Product[] {
    const products = this.getProducts();
    const searchTerm = query.toLowerCase();
    return products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );
  }
}
