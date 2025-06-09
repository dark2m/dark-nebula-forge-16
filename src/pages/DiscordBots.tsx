
import React, { useState, useEffect } from 'react';
import { Bot, Music, Shield, Users, ShoppingCart, ExternalLink } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage, { Product } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DiscordBots = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: string}>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadedProducts = AdminStorage.getProducts().filter(p => p.category === 'discord');
    setProducts(loadedProducts);
  }, []);

  const addToCart = (product: Product) => {
    setCart([...cart, { id: product.id, name: product.name, price: `${product.price}$` }]);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const handlePurchase = () => {
    window.open('https://discord.gg/CaQW7RWuG8', '_blank');
  };

  const bots = [
    {
      id: 1,
      name: 'بوت الموسيقى المتقدم',
      price: '30$',
      description: 'بوت موسيقى بجودة عالية مع مميزات متقدمة',
      features: ['تشغيل من يوتيوب وسبوتيفاي', 'قوائم تشغيل', 'تحكم بالصوت', 'واجهة تفاعلية'],
      icon: Music
    },
    {
      id: 2,
      name: 'بوت الحماية والإدارة',
      price: '40$',
      description: 'بوت شامل لحماية وإدارة السيرفر',
      features: ['حماية من السبام', 'نظام تحذيرات', 'إدارة الأدوار', 'لوقات تلقائية'],
      icon: Shield
    },
    {
      id: 3,
      name: 'بوت متعدد الوظائف',
      price: '60$',
      description: 'بوت شامل يجمع جميع المميزات في مكان واحد',
      features: ['موسيقى + حماية', 'ألعاب تفاعلية', 'نظام اقتصادي', 'إحصائيات متقدمة'],
      icon: Bot,
      popular: true
    }
  ];

  // دمج المنتجات من الإدارة مع البوتات الافتراضية
  const allBots = products.length > 0 ? products : bots;

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
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
            <DialogTitle className="text-xl font-bold">السلة</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">السلة فارغة</p>
            ) : (
              <>
                {cart.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-blue-400">{item.price}</p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                    >
                      حذف
                    </Button>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-700">
                  <Button
                    onClick={handlePurchase}
                    className="w-full glow-button flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    شراء عبر الديسكورد
                  </Button>
                  <p className="text-xs text-gray-400 text-center mt-2">
                    سيتم توجيهك إلى الديسكورد لإتمام الشراء
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            برمجة بوتات ديسكورد
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            بوتات ديسكورد مخصصة ومتطورة لتحسين تجربة سيرفرك
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {allBots.map((bot) => {
              const Icon = bot.icon || Bot;
              return (
                <div
                  key={bot.id}
                  className={`product-card rounded-xl p-6 relative ${
                    bot.popular ? 'ring-2 ring-purple-400' : ''
                  }`}
                >
                  {bot.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        الأكثر طلباً
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-purple-500/20 mb-4">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{bot.name}</h3>
                    <p className="text-gray-300 mb-4">{bot.description}</p>
                    <div className="text-3xl font-bold text-purple-400 mb-6">
                      {bot.price || `${bot.price}$`}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {(bot.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => addToCart(bot)}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    أضف للسلة
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Custom Bot Section */}
          <div className="mt-16 bg-purple-500/10 border border-purple-500/30 rounded-xl p-8 text-center">
            <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-400 mb-4">
              تريد بوت مخصص؟
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              يمكننا برمجة بوت مخصص حسب احتياجاتك الخاصة مع جميع المميزات التي تريدها
            </p>
            <button className="glow-button">
              اطلب بوت مخصص
            </button>
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              مقارنة المميزات
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full bg-white/5 rounded-xl overflow-hidden">
                <thead className="bg-white/10">
                  <tr>
                    <th className="p-4 text-right text-white font-semibold">الميزة</th>
                    <th className="p-4 text-center text-white font-semibold">بوت الموسيقى</th>
                    <th className="p-4 text-center text-white font-semibold">بوت الحماية</th>
                    <th className="p-4 text-center text-white font-semibold">متعدد الوظائف</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-white/10">
                    <td className="p-4">تشغيل الموسيقى</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">نظام الحماية</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="p-4">الألعاب التفاعلية</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                  <tr>
                    <td className="p-4">دعم فني</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                    <td className="p-4 text-center">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordBots;
