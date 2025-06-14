
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
            try {
              const parsed = JSON.parse(stored);
              if (Array.isArray(parsed)) {
                allItems.push(...parsed);
              }
            } catch (parseError) {
              console.error(`Error parsing cart data for ${cat}:`, parseError);
              // Clear corrupted data
              localStorage.removeItem(CartService.getCartKey(cat));
            }
          }
        });
        
        return allItems;
      }

      const stored = localStorage.getItem(CartService.getCartKey(category));
      if (!stored) {
        return [];
      }
      
      try {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      } catch (parseError) {
        console.error(`Error parsing cart data for ${category}:`, parseError);
        // Clear corrupted data
        localStorage.removeItem(CartService.getCartKey(category));
        return [];
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      return [];
    }
  }

  static addToCart(product: Product): void {
    try {
      console.log('CartService addToCart called with:', product);
      
      if (!product || !product.id || !product.name || !product.category) {
        console.error('Invalid product data:', product);
        return;
      }

      const cart = CartService.getCart(product.category);
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: `${product.price}$`,
        category: product.category
      };
      
      // Check if item already exists
      const existingItemIndex = cart.findIndex(item => item.id === product.id);
      if (existingItemIndex === -1) {
        cart.push(cartItem);
        localStorage.setItem(CartService.getCartKey(product.category), JSON.stringify(cart));
        console.log('Product added to cart successfully');
      } else {
        console.log('Product already exists in cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  }

  static removeFromCart(id: number, category: string): void {
    try {
      if (!id || !category) {
        console.error('Invalid parameters for removeFromCart:', { id, category });
        return;
      }

      const cart = CartService.getCart(category).filter(item => item.id !== id);
      localStorage.setItem(CartService.getCartKey(category), JSON.stringify(cart));
      console.log('Product removed from cart successfully');
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
        console.log('All carts cleared successfully');
      } else {
        localStorage.removeItem(CartService.getCartKey(category));
        console.log(`Cart for ${category} cleared successfully`);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }

  static getCartCount(category?: string): number {
    try {
      return CartService.getCart(category).length;
    } catch (error) {
      console.error('Error getting cart count:', error);
      return 0;
    }
  }
}

export default CartService;
