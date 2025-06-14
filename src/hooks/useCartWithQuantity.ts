
import { useState, useEffect } from 'react';
import { Product } from '../types/admin';

interface CartItem extends Product {
  quantity: number;
}

export const useCartWithQuantity = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const loadCart = () => {
      try {
        const savedCart = localStorage.getItem('shopping_cart');
        if (savedCart) {
          const parsed = JSON.parse(savedCart);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
            console.log('Cart loaded successfully:', parsed.length, 'items');
          } else {
            console.warn('Invalid cart data format, clearing cart');
            localStorage.removeItem('shopping_cart');
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('shopping_cart');
        setCartItems([]);
      }
    };

    loadCart();
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('shopping_cart', JSON.stringify(cartItems));
      console.log('Cart saved to localStorage');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product: Product) => {
    if (!product || !product.id || !product.name) {
      console.error('Invalid product data:', product);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        console.log('Product already in cart, increasing quantity');
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      console.log('Adding new product to cart:', product.name);
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    if (!id) {
      console.error('Invalid product ID for removal:', id);
      return;
    }

    setCartItems(prevItems => {
      const filtered = prevItems.filter(item => item.id !== id);
      console.log('Product removed from cart, remaining items:', filtered.length);
      return filtered;
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (!id || quantity < 0) {
      console.error('Invalid parameters for quantity update:', { id, quantity });
      return;
    }

    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
    console.log('Product quantity updated:', { id, quantity });
  };

  const getTotalPrice = () => {
    try {
      return cartItems.reduce((total, item) => {
        const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price;
        return total + (price * item.quantity);
      }, 0).toFixed(2);
    } catch (error) {
      console.error('Error calculating total price:', error);
      return '0.00';
    }
  };

  const clearCart = () => {
    setCartItems([]);
    console.log('Cart cleared');
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getTotalPrice,
    clearCart,
    getCartCount
  };
};
