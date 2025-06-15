
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
      {/* Enhanced Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-50 md:top-20 md:bottom-auto md:right-6">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-white/30 backdrop-blur-md hover:bg-white/40 shadow-2xl hover:shadow-3xl transition-all duration-300 border border-white/30 rounded-full p-4 group"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6 text-black group-hover:scale-110 transition-transform duration-300" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full min-w-6 h-6 text-sm flex items-center justify-center font-bold shadow-lg animate-pulse">
              {totalItems}
            </Badge>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* White Glass Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-sm max-h-[75vh] overflow-hidden bg-white/20 backdrop-blur-xl border border-white/40 shadow-2xl rounded-2xl">
          <DialogHeader className="pb-3">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-black flex items-center gap-3">
                <div className="p-2 bg-white/30 rounded-full">
                  <ShoppingCart className="w-5 h-5 text-black" />
                </div>
                {cartTexts?.cartTitle || 'السلة'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-black/70 hover:text-black hover:bg-white/20 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {totalItems > 0 && (
              <Badge className="bg-white/40 text-black border-white/60 px-3 py-1 text-sm w-fit rounded-full shadow-md">
                {totalItems} منتج
              </Badge>
            )}
          </DialogHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="p-4 bg-white/20 rounded-full mb-4">
                <ShoppingCart className="w-8 h-8 text-black/60" />
              </div>
              <p className="text-black/70 text-base font-medium">
                {cartTexts?.emptyCartMessage || 'السلة فارغة'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="pubg" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-white/30 border border-white/50 p-1 rounded-xl shadow-inner">
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="relative data-[state=active]:bg-white/60 data-[state=active]:text-black text-black/70 text-sm py-2 rounded-lg font-medium transition-all duration-200"
                    >
                      <span className="mr-2">{categoryIcons[key as keyof typeof categoryIcons]}</span>
                      {name}
                      {cartItems[key]?.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full min-w-4 h-4 text-xs flex items-center justify-center shadow-md">
                          {cartItems[key].length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryNames).map(([category, name]) => (
                  <TabsContent key={category} value={category} className="space-y-3 mt-3">
                    {cartItems[category]?.length === 0 ? (
                      <div className="text-center py-6 bg-white/20 rounded-xl border border-white/30">
                        <p className="text-black/60 text-sm">لا توجد منتجات</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-36 overflow-y-auto pr-1">
                          {cartItems[category]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-xl border border-white/40 shadow-sm hover:bg-white/40 transition-all duration-200">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-black text-sm truncate mb-1">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge className="bg-green-500/80 text-white border-0 text-xs px-2 py-1 rounded-full">
                                    ${item.price}
                                  </Badge>
                                  <Badge className="bg-blue-500/80 text-white border-0 text-xs px-2 py-1 rounded-full">
                                    {item.quantity}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id, category)}
                                className="ml-3 bg-red-500/80 hover:bg-red-600 text-white border-0 p-2 rounded-full shadow-md"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-white/40 my-4" />
                        
                        {/* Payment Methods */}
                        <div className="space-y-3">
                          <h4 className="text-center text-base font-bold text-black">
                            طرق الدفع
                          </h4>
                          
                          <div className="grid gap-2">
                            <Button
                              onClick={handleDiscordPurchase}
                              className="w-full bg-purple-500/80 hover:bg-purple-600 text-white border-0 py-3 text-sm rounded-xl shadow-md transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              ديسكورد
                            </Button>
                            
                            <Button
                              onClick={handleWhatsAppPurchase}
                              className="w-full bg-green-500/80 hover:bg-green-600 text-white border-0 py-3 text-sm rounded-xl shadow-md transition-all duration-200"
                            >
                              <MessageCircle className="w-4 h-4 mr-2" />
                              واتساب
                            </Button>

                            <Button
                              onClick={handleCustomerSupport}
                              className="w-full bg-blue-500/80 hover:bg-blue-600 text-white border-0 py-3 text-sm rounded-xl shadow-md transition-all duration-200"
                            >
                              <Headphones className="w-4 h-4 mr-2" />
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
