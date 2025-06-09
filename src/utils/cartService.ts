
import { Product, CartItem } from '../types/admin';

class CartService {
  private static CART_KEY = 'global_cart';

  static getCart(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_KEY);
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
      const cart = this.getCart();
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: `${product.price}$`,
        category: product.category
      };
      cart.push(cartItem);
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  static removeFromCart(id: number): void {
    try {
      const cart = this.getCart().filter(item => item.id !== id);
      localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  }

  static clearCart(): void {
    try {
      localStorage.removeItem(this.CART_KEY);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }
}

export default CartService;
