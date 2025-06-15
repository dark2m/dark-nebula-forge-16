
import React, { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, MessageCircle, X, Trash2 } from 'lucide-react';
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

  const cartTexts = siteSettings.pageTexts.cart;
  const totalItems = Object.values(cartItems).reduce((total, items) => total + items.length, 0);

  const categoryNames = {
    pubg: 'هكر ببجي',
    web: 'برمجة مواقع', 
    discord: 'بوتات ديسكورد'
  };

  const categoryColors = {
    pubg: 'bg-red-500/20 border-red-500/50 text-red-400',
    web: 'bg-green-500/20 border-green-500/50 text-green-400',
    discord: 'bg-purple-500/20 border-purple-500/50 text-purple-400'
  };

  return (
    <>
      {/* Cart Button - Positioned at bottom right for mobile and tablets */}
      <div className="fixed bottom-6 right-6 z-50 md:top-20 md:bottom-auto">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="glow-button relative shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-500 text-white rounded-full min-w-6 h-6 text-xs flex items-center justify-center font-bold animate-pulse">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-gray-700/50">
          <DialogHeader className="pb-6">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-blue-400" />
                {cartTexts?.cartTitle || 'السلة'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/50">
                  {totalItems} منتج في السلة
                </Badge>
              </div>
            )}
          </DialogHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <ShoppingCart className="w-10 h-10 text-gray-500" />
              </div>
              <p className="text-gray-400 text-lg font-medium mb-2">
                {cartTexts?.emptyCartMessage || 'السلة فارغة'}
              </p>
              <p className="text-gray-500 text-sm">
                قم بإضافة منتجات إلى السلة للمتابعة
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <Tabs defaultValue="pubg" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/50 border border-gray-700/50 p-1 rounded-lg">
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="relative data-[state=active]:bg-gray-700 data-[state=active]:text-white text-gray-400 font-medium transition-all duration-200"
                    >
                      {name}
                      {cartItems[key]?.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-blue-500 hover:bg-blue-500 text-white rounded-full min-w-5 h-5 text-xs flex items-center justify-center font-bold">
                          {cartItems[key].length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryNames).map(([category, name]) => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`w-3 h-3 rounded-full ${categoryColors[category as keyof typeof categoryColors].split(' ')[0]}`}></div>
                      <h3 className="text-xl font-bold text-white">{name}</h3>
                      <Badge variant="outline" className="text-gray-400 border-gray-600">
                        {cartItems[category]?.length || 0} منتج
                      </Badge>
                    </div>

                    {cartItems[category]?.length === 0 ? (
                      <div className="text-center py-8 bg-gray-800/30 rounded-lg border border-gray-700/30">
                        <p className="text-gray-500 font-medium">لا توجد منتجات في هذا القسم</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                          {cartItems[category]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30 hover:bg-gray-800/70 transition-all duration-200 group">
                              <div className="flex-1">
                                <h4 className="font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <Badge className={`${categoryColors[category as keyof typeof categoryColors]} font-medium`}>
                                    ${item.price}
                                  </Badge>
                                  <span className="text-xs text-gray-500">الكمية: {item.quantity}</span>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id, category)}
                                className="ml-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 hover:border-red-500 transition-all duration-200"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-gray-700/50" />
                        
                        {/* Payment Methods */}
                        <div className="space-y-4 pt-4">
                          <h4 className="text-center font-bold text-green-400 text-lg flex items-center justify-center gap-2">
                            💳 طرق الدفع المتاحة
                          </h4>
                          
                          <div className="grid gap-3">
                            <Button
                              onClick={handleDiscordPurchase}
                              className="w-full bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/50 hover:border-purple-500 flex items-center justify-center gap-3 py-3 font-medium transition-all duration-200 hover:shadow-lg"
                            >
                              <ExternalLink className="w-5 h-5" />
                              شراء عبر الديسكورد
                              <Badge className="bg-purple-500/30 text-purple-300 text-xs">سريع</Badge>
                            </Button>
                            
                            <Button
                              onClick={handleWhatsAppPurchase}
                              className="w-full bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/50 hover:border-green-500 flex items-center justify-center gap-3 py-3 font-medium transition-all duration-200 hover:shadow-lg"
                            >
                              <MessageCircle className="w-5 h-5" />
                              شراء عبر الواتساب
                              <Badge className="bg-green-500/30 text-green-300 text-xs">موثوق</Badge>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              {totalItems > 0 && (
                <div className="pt-4 border-t border-gray-700/50">
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-center">
                    <p className="text-sm text-blue-400 font-medium">
                      🛡️ اختر طريقة الدفع المناسبة لك لإتمام الشراء بأمان
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalCart;
