
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
          className="relative bg-white/90 backdrop-blur-xl hover:bg-white shadow-2xl hover:shadow-3xl transition-all duration-300 border border-gray-200 rounded-full p-4 group"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform duration-300" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full min-w-6 h-6 text-sm flex items-center justify-center font-bold shadow-lg animate-pulse">
              {totalItems}
            </Badge>
          )}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </div>

      {/* Cart Dialog with Site Background */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden bg-transparent border-0 shadow-none rounded-2xl">
          {/* Starry Background Container */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden">
            {/* Background gradient like the site */}
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900" />
            
            {/* Animated stars */}
            <div className="absolute inset-0">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    animationDelay: `${Math.random() * 3}s`,
                    animationDuration: `${Math.random() * 2 + 1}s`
                  }}
                />
              ))}
            </div>
            
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl" />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <DialogHeader className="pb-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  {cartTexts?.cartTitle || 'السلة'}
                </DialogTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCartOpen(false)}
                  className="text-white/70 hover:text-white hover:bg-white/10 p-2 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              {totalItems > 0 && (
                <Badge className="bg-blue-500/20 text-white border-blue-400/30 px-3 py-1 text-sm w-fit rounded-full backdrop-blur-sm">
                  {totalItems} منتج
                </Badge>
              )}
            </DialogHeader>
            
            {totalItems === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="p-4 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                  <ShoppingCart className="w-8 h-8 text-white/70" />
                </div>
                <p className="text-white/80 text-base font-medium">
                  {cartTexts?.emptyCartMessage || 'السلة فارغة'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Tabs defaultValue="pubg" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm border border-white/20 p-1 rounded-xl">
                    {Object.entries(categoryNames).map(([key, name]) => (
                      <TabsTrigger 
                        key={key} 
                        value={key} 
                        className="relative data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:shadow-sm text-white/70 text-sm py-2 rounded-lg font-medium transition-all duration-200"
                      >
                        <span className="mr-2">{categoryIcons[key as keyof typeof categoryIcons]}</span>
                        {name}
                        {cartItems[key]?.length > 0 && (
                          <Badge className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full min-w-4 h-4 text-xs flex items-center justify-center">
                            {cartItems[key].length}
                          </Badge>
                        )}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {Object.entries(categoryNames).map(([category, name]) => (
                    <TabsContent key={category} value={category} className="space-y-3 mt-4">
                      {cartItems[category]?.length === 0 ? (
                        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                          <p className="text-white/70 text-sm">لا توجد منتجات في {name}</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                            {cartItems[category]?.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-200 backdrop-blur-sm">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-white text-sm truncate mb-2">
                                    {item.name}
                                  </h4>
                                  <div className="flex items-center gap-2">
                                    <Badge className="bg-white/10 text-white/90 border-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                      ${item.price}
                                    </Badge>
                                    <Badge className="bg-white/10 text-white/90 border-white/20 text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                      الكمية: {item.quantity}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeFromCart(item.id, category)}
                                  className="ml-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 border-0 p-2 rounded-full backdrop-blur-sm"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <Separator className="bg-white/20 my-4" />
                          
                          {/* Payment Methods */}
                          <div className="space-y-4">
                            <h4 className="text-center text-base font-bold text-white/90 mb-3">
                              طرق الدفع والتواصل
                            </h4>
                            
                            <div className="grid gap-3">
                              <Button
                                onClick={handleDiscordPurchase}
                                className="w-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 py-3 text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                              >
                                <ExternalLink className="w-4 h-4" />
                                الشراء عبر ديسكورد
                              </Button>
                              
                              <Button
                                onClick={handleWhatsAppPurchase}
                                className="w-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 py-3 text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                              >
                                <MessageCircle className="w-4 h-4" />
                                الشراء عبر واتساب
                              </Button>

                              <Button
                                onClick={handleCustomerSupport}
                                className="w-full bg-white/10 hover:bg-white/20 text-white/90 border border-white/20 py-3 text-sm rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm"
                              >
                                <Headphones className="w-4 h-4" />
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalCart;
