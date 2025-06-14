
import { LocalStorageService } from './localStorageService';
import { CartItem } from '@/types/admin';

export class CartService {
  static getCartItems(): CartItem[] {
    return LocalStorageService.getCart();
  }

  static addToCart(item: Omit<CartItem, 'id'>): void {
    const cartItem: CartItem = {
      ...item,
      id: Date.now()
    };
    LocalStorageService.addToCart(cartItem);
  }

  static removeFromCart(id: number): void {
    LocalStorageService.removeFromCart(id);
  }

  static clearCart(): void {
    LocalStorageService.clearCart();
  }

  static getCartCount(): number {
    return this.getCartItems().length;
  }

  static getCartTotal(): number {
    const items = this.getCartItems();
    return items.reduce((total, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
      return total + (isNaN(price) ? 0 : price);
    }, 0);
  }
}
