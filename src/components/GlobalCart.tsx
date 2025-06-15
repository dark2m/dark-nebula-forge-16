
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
    navigate('/customer-support');
  };

  const cartTexts = siteSettings.pageTexts.cart;
  const totalItems = Object.values(cartItems).reduce((total, items) => total + items.length, 0);

  const categoryNames = {
    pubg: 'هكر ببجي',
    web: 'برمجة مواقع', 
    discord: 'بوتات ديسكورد'
  };

  const categoryIcons = {
    pubg: '🎮',
    web: '💻',
    discord: '🤖'
  };

  const categoryColors = {
    pubg: 'from-red-500/30 to-orange-500/30 border-red-400/40 text-red-200',
    web: 'from-green-500/30 to-emerald-500/30 border-green-400/40 text-green-200',
    discord: 'from-purple-500/30 to-blue-500/30 border-purple-400/40 text-purple-200'
  };

  return (
    <>
      {/* Compact Cart Button */}
      <div className="fixed bottom-4 right-4 z-50 md:top-16 md:bottom-auto md:right-4">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-400/30 backdrop-blur-sm"
          size="lg"
        >
          <ShoppingCart className="w-5 h-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full min-w-5 h-5 text-xs flex items-center justify-center font-bold animate-pulse">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Compact Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl border border-gray-600/30 shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-700/30">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-400/30">
                  <ShoppingCart className="w-5 h-5 text-blue-400" />
                </div>
                {cartTexts?.cartTitle || 'سلة التسوق'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg p-2"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/50 px-3 py-1 text-xs">
                  <Package className="w-3 h-3 mr-1" />
                  {totalItems} منتج
                </Badge>
                <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/50 px-3 py-1 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  جاهز للشراء
                </Badge>
              </div>
            )}
          </DialogHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-700/30 to-gray-800/30 rounded-full flex items-center justify-center mb-4 border border-gray-600/30">
                <ShoppingCart className="w-10 h-10 text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                {cartTexts?.emptyCartMessage || 'السلة فارغة'}
              </h3>
              <p className="text-gray-400 text-sm">قم بإضافة منتجات إلى السلة للمتابعة</p>
            </div>
          ) : (
            <div className="space-y-4">
              <Tabs defaultValue="pubg" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/40 border border-gray-600/30 p-1 rounded-lg">
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600/40 data-[state=active]:to-gray-700/40 data-[state=active]:text-white text-gray-300 font-medium text-xs py-2 rounded-md transition-all duration-200"
                    >
                      <span className="mr-1">{categoryIcons[key as keyof typeof categoryIcons]}</span>
                      {name}
                      {cartItems[key]?.length > 0 && (
                        <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full min-w-4 h-4 text-xs flex items-center justify-center font-bold">
                          {cartItems[key].length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryNames).map(([category, name]) => (
                  <TabsContent key={category} value={category} className="space-y-4 mt-4">
                    <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-800/30 to-gray-700/30 rounded-lg border border-gray-600/20">
                      <span className="text-xl">{categoryIcons[category as keyof typeof categoryIcons]}</span>
                      <h3 className="text-lg font-bold text-white">{name}</h3>
                      <Badge variant="outline" className="text-gray-300 border-gray-500/40 bg-gray-700/20 px-2 py-1 text-xs">
                        {cartItems[category]?.length || 0} منتج
                      </Badge>
                    </div>

                    {cartItems[category]?.length === 0 ? (
                      <div className="text-center py-8 bg-gradient-to-br from-gray-800/20 to-gray-700/20 rounded-lg border border-dashed border-gray-600/30">
                        <div className="text-3xl mb-3">📭</div>
                        <p className="text-gray-400 text-sm">لا توجد منتجات في هذا القسم</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                          {cartItems[category]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-lg border border-gray-600/30 hover:from-gray-700/50 hover:to-gray-600/50 transition-all duration-200 group">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-white mb-1 group-hover:text-blue-300 transition-colors text-sm truncate">
                                  ✨ {item.name}
                                </h4>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <Badge className={`bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]} font-medium px-2 py-1 text-xs`}>
                                    💰 ${item.price}
                                  </Badge>
                                  <Badge variant="outline" className="text-gray-300 border-gray-500/40 bg-gray-700/20 px-2 py-1 text-xs">
                                    📦 {item.quantity}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id, category)}
                                className="ml-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/40 hover:to-pink-500/40 text-red-300 border border-red-500/40 hover:border-red-400 transition-all duration-200 p-2"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-gradient-to-r from-transparent via-gray-600/40 to-transparent my-4" />
                        
                        {/* Compact Payment Methods */}
                        <div className="space-y-3">
                          <h4 className="text-center text-lg font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center justify-center gap-2">
                            💳 طرق الدفع
                          </h4>
                          
                          <div className="grid gap-2">
                            <Button
                              onClick={handleDiscordPurchase}
                              className="w-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/40 hover:to-indigo-600/40 text-purple-300 border border-purple-500/40 hover:border-purple-400 flex items-center justify-center gap-3 py-2 text-sm font-medium transition-all duration-200"
                            >
                              <ExternalLink className="w-4 h-4" />
                              🎮 شراء عبر الديسكورد
                              <Badge className="bg-purple-500/30 text-purple-200 text-xs border border-purple-400/40">سريع</Badge>
                            </Button>
                            
                            <Button
                              onClick={handleWhatsAppPurchase}
                              className="w-full bg-gradient-to-r from-green-600/20 to-emerald-600/20 hover:from-green-600/40 hover:to-emerald-600/40 text-green-300 border border-green-500/40 hover:border-green-400 flex items-center justify-center gap-3 py-2 text-sm font-medium transition-all duration-200"
                            >
                              <MessageCircle className="w-4 h-4" />
                              📱 شراء عبر الواتساب
                              <Badge className="bg-green-500/30 text-green-200 text-xs border border-green-400/40">موثوق</Badge>
                            </Button>

                            <Button
                              onClick={handleCustomerSupport}
                              className="w-full bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/40 hover:to-cyan-600/40 text-blue-300 border border-blue-500/40 hover:border-blue-400 flex items-center justify-center gap-3 py-2 text-sm font-medium transition-all duration-200"
                            >
                              <Headphones className="w-4 h-4" />
                              🎧 خدمة العملاء
                              <Badge className="bg-blue-500/30 text-blue-200 text-xs border border-blue-400/40">دعم</Badge>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              {totalItems > 0 && (
                <div className="pt-4 border-t border-gray-700/30">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                    <div className="text-2xl mb-2">🛡️</div>
                    <p className="text-blue-300 font-medium text-sm mb-1">ضمان الجودة والأمان</p>
                    <p className="text-gray-400 text-xs">جميع منتجاتنا مضمونة ومحمية</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3B82F6, #8B5CF6);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563EB, #7C3AED);
        }
      `}</style>
    </>
  );
};

export default GlobalCart;
