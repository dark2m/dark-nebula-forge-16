
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, MessageCircle, X, Trash2, Headphones, Package, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AdminStorage from '../utils/adminStorage';
import type { CartItem } from '../types/admin';

const GlobalCart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<{[key: string]: CartItem[]}>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadCarts = () => {
      const categories = ['pubg', 'web', 'discord'];
      const newCartItems: {[key: string]: CartItem[]} = {};
      
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

  const handleCustomerSupport = () => {
    setIsCartOpen(false);
    navigate('/sport');
  };

  const cartTexts = siteSettings.pageTexts.cart;
  const totalItems = Object.values(cartItems).reduce((total, items) => total + items.length, 0);

  const categoryNames = {
    pubg: 'ببجي',
    web: 'مواقع', 
    discord: 'ديسكورد'
  };

  const categoryIcons = {
    pubg: '🎮',
    web: '💻',
    discord: '🤖'
  };

  return (
    <>
      {/* Compact Cart Button */}
      <div className="fixed bottom-4 right-4 z-50 md:top-16 md:bottom-auto md:right-4">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-black/20 backdrop-blur-sm hover:bg-black/30 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4" />
          {totalItems > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-4 h-4 text-xs flex items-center justify-center font-bold">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Compact Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md max-h-[70vh] overflow-hidden bg-black/20 backdrop-blur-xl border border-white/20 shadow-2xl">
          <DialogHeader className="pb-2">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                {cartTexts?.cartTitle || 'السلة'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {totalItems > 0 && (
              <Badge className="bg-white/10 text-white border-white/20 px-2 py-1 text-xs w-fit">
                {totalItems} منتج
              </Badge>
            )}
          </DialogHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingCart className="w-12 h-12 text-gray-500 mb-3" />
              <p className="text-white text-sm">
                {cartTexts?.emptyCartMessage || 'السلة فارغة'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <Tabs defaultValue="pubg" className="space-y-3">
                <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-white/20 p-1 rounded-lg">
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="relative data-[state=active]:bg-white/20 data-[state=active]:text-white text-gray-300 text-xs py-1 rounded"
                    >
                      <span className="mr-1">{categoryIcons[key as keyof typeof categoryIcons]}</span>
                      {name}
                      {cartItems[key]?.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-3 h-3 text-xs flex items-center justify-center">
                          {cartItems[key].length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryNames).map(([category, name]) => (
                  <TabsContent key={category} value={category} className="space-y-2 mt-2">
                    {cartItems[category]?.length === 0 ? (
                      <div className="text-center py-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-gray-400 text-xs">لا توجد منتجات</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {cartItems[category]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded border border-white/10">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-white text-sm truncate">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                                    ${item.price}
                                  </Badge>
                                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
                                    {item.quantity}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id, category)}
                                className="ml-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-white/20 my-3" />
                        
                        {/* Payment Methods */}
                        <div className="space-y-2">
                          <h4 className="text-center text-sm font-bold text-white">
                            طرق الدفع
                          </h4>
                          
                          <div className="grid gap-1">
                            <Button
                              onClick={handleDiscordPurchase}
                              className="w-full bg-purple-500/20 hover:bg-purple-500/40 text-purple-300 border border-purple-500/40 py-1 text-xs"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              ديسكورد
                            </Button>
                            
                            <Button
                              onClick={handleWhatsAppPurchase}
                              className="w-full bg-green-500/20 hover:bg-green-500/40 text-green-300 border border-green-500/40 py-1 text-xs"
                            >
                              <MessageCircle className="w-3 h-3 mr-1" />
                              واتساب
                            </Button>

                            <Button
                              onClick={handleCustomerSupport}
                              className="w-full bg-blue-500/20 hover:bg-blue-500/40 text-blue-300 border border-blue-500/40 py-1 text-xs"
                            >
                              <Headphones className="w-3 h-3 mr-1" />
                              خدمة العملاء
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalCart;
