
import { Product, CartItem } from '../types/admin';

class CartService {
  private static getCartKey(category: string): string {
    return `cart_${category}`;
  }

  static getCart(category?: string): CartItem[] {
    try {
      if (!category) {
        // إرجاع جميع العناصر من جميع الفئات
        const allCategories = ['pubg', 'web', 'discord'];
        const allItems: CartItem[] = [];
        
        allCategories.forEach(cat => {
          const stored = localStorage.getItem(this.getCartKey(cat));
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              allItems.push(...parsed);
            }
          }
        });
        
        return allItems;
      }

      const stored = localStorage.getItem(this.getCartKey(category));
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  static addToCart(product: Product): void {
    try {
      const cart = this.getCart(product.category);
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: `${product.price}$`,
        category: product.category
      };
      cart.push(cartItem);
      localStorage.setItem(this.getCartKey(product.category), JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  static removeFromCart(id: number, category: string): void {
    try {
      const cart = this.getCart(category).filter(item => item.id !== id);
      localStorage.setItem(this.getCartKey(category), JSON.stringify(cart));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  static clearCart(category?: string): void {
    try {
      if (!category) {
        // مسح جميع السلال
        const allCategories = ['pubg', 'web', 'discord'];
        allCategories.forEach(cat => {
          localStorage.removeItem(this.getCartKey(cat));
        });
      } else {
        localStorage.removeItem(this.getCartKey(category));
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  static getCartCount(category?: string): number {
    return this.getCart(category).length;
  }
}

export default CartService;
