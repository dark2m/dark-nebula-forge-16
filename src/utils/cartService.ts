
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
          const stored = localStorage.getItem(CartService.getCartKey(cat));
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
              allItems.push(...parsed);
            }
          }
        });
        
        return allItems;
      }

      const stored = localStorage.getItem(CartService.getCartKey(category));
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
      console.log('CartService addToCart called with:', product);
      const cart = CartService.getCart(product.category);
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        category: product.category
      };
      cart.push(cartItem);
      localStorage.setItem(CartService.getCartKey(product.category), JSON.stringify(cart));
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  static removeFromCart(id: number, category: string): void {
    try {
      const cart = CartService.getCart(category).filter(item => item.id !== id);
      localStorage.setItem(CartService.getCartKey(category), JSON.stringify(cart));
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
          localStorage.removeItem(CartService.getCartKey(cat));
        });
      } else {
        localStorage.removeItem(CartService.getCartKey(category));
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  static getCartCount(category?: string): number {
    return CartService.getCart(category).length;
  }
}

export default CartService;
