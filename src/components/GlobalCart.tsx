import React, { useState, useEffect } from 'react';
import { ShoppingCart, ExternalLink, MessageCircle, X, Trash2, Headphones } from 'lucide-react';
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

  const categoryColors = {
    pubg: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/50 text-red-300',
    web: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/50 text-green-300',
    discord: 'bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-purple-500/50 text-purple-300'
  };

  return (
    <>
      {/* Cart Button - Positioned at bottom right for mobile and tablets */}
      <div className="fixed bottom-6 right-6 z-50 md:top-20 md:bottom-auto">
        <Button
          onClick={() => setIsCartOpen(true)}
          className="glow-button relative shadow-2xl hover:shadow-3xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 border-2 border-blue-400/30"
          size="lg"
        >
          <ShoppingCart className="w-6 h-6" />
          {totalItems > 0 && (
            <Badge className="absolute -top-3 -right-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full min-w-7 h-7 text-sm flex items-center justify-center font-bold animate-pulse shadow-lg">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>

      {/* Cart Dialog */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-gray-900/98 via-gray-800/95 to-gray-900/98 backdrop-blur-2xl border-2 border-gray-600/40 shadow-2xl">
          <DialogHeader className="pb-8 border-b border-gray-700/50">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-400/30">
                  <ShoppingCart className="w-8 h-8 text-blue-400" />
                </div>
                {cartTexts?.cartTitle || 'سلة التسوق'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-full p-3 transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
            {totalItems > 0 && (
              <div className="flex items-center gap-3 mt-4">
                <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-400/50 px-4 py-2 text-sm font-medium">
                  📦 {totalItems} منتج في السلة
                </Badge>
                <Badge variant="secondary" className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border-green-400/50 px-4 py-2 text-sm font-medium">
                  ✨ جاهز للشراء
                </Badge>
              </div>
            )}
          </DialogHeader>
          
          {totalItems === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-28 h-28 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-full flex items-center justify-center mb-6 border-2 border-gray-600/30">
                <ShoppingCart className="w-14 h-14 text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {cartTexts?.emptyCartMessage || 'السلة فارغة'}
              </h3>
              <p className="text-gray-400 text-lg">
                🛍️ قم بإضافة منتجات إلى السلة للمتابعة
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              <Tabs defaultValue="pubg" className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-gray-800/60 border-2 border-gray-600/40 p-2 rounded-xl backdrop-blur-sm">
                  {Object.entries(categoryNames).map(([key, name]) => (
                    <TabsTrigger 
                      key={key} 
                      value={key} 
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-gray-600/50 data-[state=active]:to-gray-700/50 data-[state=active]:text-white text-gray-300 font-semibold transition-all duration-300 py-3 rounded-lg"
                    >
                      {name}
                      {cartItems[key]?.length > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-full min-w-6 h-6 text-xs flex items-center justify-center font-bold shadow-lg">
                          {cartItems[key].length}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {Object.entries(categoryNames).map(([category, name]) => (
                  <TabsContent key={category} value={category} className="space-y-6 mt-8">
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-gray-800/40 to-gray-700/40 rounded-xl border border-gray-600/30">
                      <div className={`w-4 h-4 rounded-full ${categoryColors[category as keyof typeof categoryColors].split(' ')[0]} shadow-lg`}></div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">{name}</h3>
                      <Badge variant="outline" className="text-gray-300 border-gray-500/50 bg-gray-700/30 px-3 py-1">
                        {cartItems[category]?.length || 0} منتج
                      </Badge>
                    </div>

                    {cartItems[category]?.length === 0 ? (
                      <div className="text-center py-12 bg-gradient-to-br from-gray-800/30 to-gray-700/30 rounded-xl border-2 border-dashed border-gray-600/40">
                        <div className="text-6xl mb-4">📭</div>
                        <p className="text-gray-400 font-semibold text-lg">لا توجد منتجات في هذا القسم</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-72 overflow-y-auto pr-3 custom-scrollbar">
                          {cartItems[category]?.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-800/60 to-gray-700/60 rounded-xl border border-gray-600/40 hover:from-gray-700/70 hover:to-gray-600/70 transition-all duration-300 group shadow-lg">
                              <div className="flex-1">
                                <h4 className="font-bold text-white mb-2 group-hover:text-blue-300 transition-colors text-lg">
                                  ✨ {item.name}
                                </h4>
                                <div className="flex items-center gap-3">
                                  <Badge className={`${categoryColors[category as keyof typeof categoryColors]} font-bold px-3 py-1 shadow-md`}>
                                    💰 ${item.price}
                                  </Badge>
                                  <Badge variant="outline" className="text-gray-300 border-gray-500/50 bg-gray-700/30 px-3 py-1">
                                    📦 الكمية: {item.quantity}
                                  </Badge>
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeFromCart(item.id, category)}
                                className="ml-4 bg-gradient-to-r from-red-500/30 to-pink-500/30 hover:from-red-500/50 hover:to-pink-500/50 text-red-300 border-2 border-red-500/50 hover:border-red-400 transition-all duration-300 shadow-lg"
                              >
                                <Trash2 className="w-5 h-5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                        
                        <Separator className="bg-gradient-to-r from-transparent via-gray-600/50 to-transparent my-6" />
                        
                        {/* Payment Methods */}
                        <div className="space-y-6 pt-4">
                          <div className="text-center">
                            <h4 className="text-2xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent flex items-center justify-center gap-3 mb-2">
                              💳 طرق الدفع والتواصل
                            </h4>
                            <p className="text-gray-400 text-sm">اختر الطريقة الأنسب لك</p>
                          </div>
                          
                          <div className="grid gap-4">
                            <Button
                              onClick={handleDiscordPurchase}
                              className="w-full bg-gradient-to-r from-purple-600/30 to-indigo-600/30 hover:from-purple-600/50 hover:to-indigo-600/50 text-purple-300 border-2 border-purple-500/50 hover:border-purple-400 flex items-center justify-center gap-4 py-4 font-bold transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                            >
                              <ExternalLink className="w-6 h-6" />
                              🎮 شراء عبر الديسكورد
                              <Badge className="bg-purple-500/40 text-purple-200 text-xs border border-purple-400/50">سريع</Badge>
                            </Button>
                            
                            <Button
                              onClick={handleWhatsAppPurchase}
                              className="w-full bg-gradient-to-r from-green-600/30 to-emerald-600/30 hover:from-green-600/50 hover:to-emerald-600/50 text-green-300 border-2 border-green-500/50 hover:border-green-400 flex items-center justify-center gap-4 py-4 font-bold transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20"
                            >
                              <MessageCircle className="w-6 h-6" />
                              📱 شراء عبر الواتساب
                              <Badge className="bg-green-500/40 text-green-200 text-xs border border-green-400/50">موثوق</Badge>
                            </Button>

                            <Button
                              onClick={handleCustomerSupport}
                              className="w-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 hover:from-blue-600/50 hover:to-cyan-600/50 text-blue-300 border-2 border-blue-500/50 hover:border-blue-400 flex items-center justify-center gap-4 py-4 font-bold transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
                            >
                              <Headphones className="w-6 h-6" />
                              🎧 تواصل مع خدمة العملاء
                              <Badge className="bg-blue-500/40 text-blue-200 text-xs border border-blue-400/50">دعم مباشر</Badge>
                            </Button>
                          </div>
                        </div>
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
              
              {totalItems > 0 && (
                <div className="pt-6 border-t-2 border-gray-700/50">
                  <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border-2 border-blue-500/30 rounded-xl p-6 text-center backdrop-blur-sm">
                    <div className="text-4xl mb-3">🛡️</div>
                    <p className="text-blue-300 font-bold text-lg mb-2">
                      ضمان الجودة والأمان
                    </p>
                    <p className="text-gray-400 text-sm">
                      جميع منتجاتنا مضمونة ومحمية بأعلى معايير الأمان
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3B82F6, #8B5CF6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #2563EB, #7C3AED);
        }
      `}</style>
    </>
  );
};

export default GlobalCart;
