
import { useState, useEffect } from 'react';
import CartService from '../utils/cartService';
import type { Product, CartItem } from '../types/admin';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<{[key: string]: CartItem[]}>({});

  useEffect(() => {
    const loadCarts = () => {
      const categories = ['pubg', 'web', 'discord'];
      const newCartItems: {[key: string]: CartItem[]} = {};
      
      categories.forEach(category => {
        const cartData = CartService.getCart(category);
        newCartItems[category] = Array.isArray(cartData) ? cartData : [];
      });
      
      setCartItems(newCartItems);
    };
    
    loadCarts();
    const interval = setInterval(loadCarts, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const addToCart = (product: Product) => {
    console.log('Adding product to cart:', product);
    CartService.addToCart(product);
    // Refresh cart items
    const updatedCart = CartService.getCart(product.category);
    setCartItems(prev => ({
      ...prev,
      [product.category]: Array.isArray(updatedCart) ? updatedCart : []
    }));
  };

  const removeFromCart = (id: number, category: string) => {
    CartService.removeFromCart(id, category);
    const updatedCart = CartService.getCart(category);
    setCartItems(prev => ({
      ...prev,
      [category]: Array.isArray(updatedCart) ? updatedCart : []
    }));
  };

  const getCartCount = (category?: string) => {
    if (category) {
      return cartItems[category]?.length || 0;
    }
    return Object.values(cartItems).reduce((total, items) => total + items.length, 0);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    getCartCount
  };
};
