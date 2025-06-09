
import { Product, CartItem } from '../types/admin';

class CartService {
  private static CART_KEY = 'global_cart';

  static getCart(): CartItem[] {
    const stored = localStorage.getItem(this.CART_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  static addToCart(product: Product): void {
    const cart = this.getCart();
    const cartItem: CartItem = {
      id: product.id,
      name: product.name,
      price: `${product.price}$`,
      category: product.category
    };
    cart.push(cartItem);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  static removeFromCart(id: number): void {
    const cart = this.getCart().filter(item => item.id !== id);
    localStorage.setItem(this.CART_KEY, JSON.stringify(cart));
  }

  static clearCart(): void {
    localStorage.removeItem(this.CART_KEY);
  }
}

export default CartService;
