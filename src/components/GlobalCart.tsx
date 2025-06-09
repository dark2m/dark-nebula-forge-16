
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminStorage from '../utils/adminStorage';

const GlobalCart = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: string, category: string}>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadCart = () => {
      const cartData = AdminStorage.getCart();
      console.log('Loading cart data:', cartData);
      setCart(Array.isArray(cartData) ? cartData : []);
    };
    
    loadCart();
    const interval = setInterval(loadCart, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSiteSettings(AdminStorage.getSiteSettings());
  }, []);

  const removeFromCart = (id: number) => {
    AdminStorage.removeFromCart(id);
    const updatedCart = AdminStorage.getCart();
    setCart(Array.isArray(updatedCart) ? updatedCart : []);
  };

  const handlePurchase = () => {
    window.open('https://discord.gg/CaQW7RWuG8', '_blank');
  };

  const cartTexts = siteSettings.pageTexts.cart;

  return (
    <>
      {/* Cart Button */}
      <div className="fixed top-20 right-6 z-50">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="glow-button relative"
        >
          <ShoppingCart className="w-5 h-5" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{cartTexts.cartTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{cartTexts.emptyCartMessage}</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-blue-400">{item.price}</p>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      {cartTexts.removeButton}
                    </Button>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={handlePurchase}
                    className="w-full glow-button flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {cartTexts.purchaseButton}
                  </Button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    {cartTexts.purchaseNote}
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalCart;
