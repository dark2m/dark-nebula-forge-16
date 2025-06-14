
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminStorage from '../utils/adminStorage';

const GlobalCart = () => {
  const [cartItems, setCartItems] = useState<{[key: string]: Array<{id: number, name: string, price: string, category: string}>}>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadCarts = () => {
      const categories = ['pubg', 'web', 'discord'];
      const newCartItems: {[key: string]: any[]} = {};
      
      categories.forEach(category => {
        const cartData = AdminStorage.getCart(category);
        newCartItems[category] = Array.isArray(cartData) ? cartData : [];
      });
      
      setCartItems(newCartItems);
    };
    
    loadCarts();
    const interval = setInterval(loadCarts, 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setSiteSettings(AdminStorage.getSiteSettings());
  }, []);

  const removeFromCart = (id: number, category: string) => {
    AdminStorage.removeFromCart(id, category);
    const updatedCart = AdminStorage.getCart(category);
    setCartItems(prev => ({
      ...prev,
      [category]: Array.isArray(updatedCart) ? updatedCart : []
    }));
  };

  const handleDiscordPurchase = () => {
    window.open('https://discord.gg/CaQW7RWuG8', '_blank');
  };

  const handleWhatsAppPurchase = () => {
    const whatsappNumber = "971566252595";
    const cartText = Object.entries(cartItems)
      .filter(([_, items]) => items.length > 0)
      .map(([category, items]) => {
        const categoryName = category === 'pubg' ? 'هكر ببجي' : 
                           category === 'web' ? 'برمجة مواقع' : 'بوتات ديسكورد';
        return `${categoryName}: ${items.map(item => item.name).join(', ')}`;
      }).join('\n');
    
    const whatsappMessage = encodeURIComponent(`مرحباً، أريد شراء:\n${cartText}`);
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;
    window.open(whatsappLink, '_blank');
  };

  const cartTexts = siteSettings.pageTexts.cart;
  const totalItems = Object.values(cartItems).reduce((total, items) => total + items.length, 0);

  const categoryNames = {
    pubg: 'هكر ببجي',
    web: 'برمجة مواقع', 
    discord: 'بوتات ديسكورد'
  };

  return (
    <>
      {/* Cart Button - Positioned at bottom right for mobile and tablets */}
      <div className="fixed bottom-6 right-6 z-50 md:top-20 md:bottom-auto">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="glow-button relative"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{cartTexts.cartTitle}</DialogTitle>
          </DialogHeader>
          
          {totalItems === 0 ? (
            <p className="text-gray-500 text-center py-8">{cartTexts.emptyCartMessage}</p>
          ) : (
            <Tabs defaultValue="pubg" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                {Object.entries(categoryNames).map(([key, name]) => (
                  <TabsTrigger key={key} value={key} className="relative">
                    {name}
                    {cartItems[key]?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                        {cartItems[key].length}
                      </span>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(categoryNames).map(([category, name]) => (
                <TabsContent key={category} value={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-center">{name}</h3>
                  {cartItems[category]?.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">لا توجد منتجات في هذا القسم</p>
                  ) : (
                    <>
                      {cartItems[category]?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                          <div>
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-blue-400">{item.price}</p>
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeFromCart(item.id, category)}
                          >
                            {cartTexts.removeButton}
                          </Button>
                        </div>
                      ))}
                      
                      {/* Payment Methods */}
                      <div className="space-y-3 pt-4 border-t border-gray-700">
                        <h4 className="text-center font-semibold text-green-400">طرق الدفع</h4>
                        
                        <Button
                          onClick={handleDiscordPurchase}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          شراء عبر الديسكورد
                        </Button>
                        
                        <Button
                          onClick={handleWhatsAppPurchase}
                          className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4" />
                          شراء عبر الواتساب
                        </Button>
                      </div>
                    </>
                  )}
                </TabsContent>
              ))}
              
              {totalItems > 0 && (
                <div className="pt-4 border-t border-gray-700">
                  <p className="text-xs text-gray-400 text-center">
                    اختر طريقة الدفع المناسبة لك لإتمام الشراء
                  </p>
                </div>
              )}
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalCart;
