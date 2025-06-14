import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { CartService } from '../utils/cartService';
import { SettingsService } from '../utils/settingsService';

const GlobalCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(CartService.getCartItems());
  const [siteSettings, setSiteSettings] = useState(SettingsService.getSiteSettings());

  useEffect(() => {
    const handleCartUpdate = () => {
      setCartItems(CartService.getCartItems());
    };

    const handleSettingsUpdate = () => {
      setSiteSettings(SettingsService.getSiteSettings());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    const unsubscribe = SettingsService.subscribe(handleSettingsUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
      unsubscribe();
    };
  }, []);

  const removeFromCart = (productId: number) => {
    CartService.removeFromCart(productId);
    setCartItems(CartService.getCartItems());
  };

  const updateQuantity = (productId: number, change: number) => {
    CartService.updateQuantity(productId, change);
    setCartItems(CartService.getCartItems());
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          السلة
          {cartItems.length > 0 && (
            <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs">
              {cartItems.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-gray-900 text-white">
        <SheetHeader>
          <SheetTitle>
            <ShoppingCart className="w-5 h-5 mr-2 inline-block" />
            سلة التسوق
          </SheetTitle>
        </SheetHeader>
        {cartItems.length === 0 ? (
          <p className="text-gray-400 mt-4">السلة فارغة.</p>
        ) : (
          <div className="mt-4 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <img
                    src={item.product.images && item.product.images.length > 0 ? item.product.images[0] : 'placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="mr-4">
                    <h4 className="font-semibold">{item.product.name}</h4>
                    <p className="text-sm text-gray-400">{item.product.price} ر.س</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, -1)}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span>{item.quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => updateQuantity(item.product.id, 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.product.id)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="mt-6 border-t border-gray-700 pt-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>المجموع الكلي:</span>
                <span>{getTotalPrice()} ر.س</span>
              </div>
              <Button className="w-full mt-4 bg-green-600 hover:bg-green-700">
                إتمام الشراء
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default GlobalCart;
