
import React, { useState, useEffect } from 'react';
import { Code, Smartphone, Globe, Zap, ShoppingCart, ExternalLink } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage, { Product } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const WebDevelopment = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: string}>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadedProducts = AdminStorage.getProducts().filter(p => p.category === 'web');
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

  const services = [
    {
      id: 1,
      name: 'تطوير مواقع ووردبريس',
      price: '150$',
      description: 'مواقع ووردبريس احترافية مع تصميم مخصص',
      features: ['تصميم مخصص', 'SEO محسن', 'سرعة عالية', 'لوحة تحكم سهلة'],
      icon: Globe
    },
    {
      id: 2,
      name: 'تطبيقات الويب',
      price: '300$',
      description: 'تطبيقات ويب تفاعلية مع React و Node.js',
      features: ['React.js', 'قاعدة بيانات', 'API مخصص', 'لوحة إدارة'],
      icon: Code
    },
    {
      id: 3,
      name: 'مواقع متجاوبة',
      price: '200$',
      description: 'مواقع تعمل بشكل مثالي على جميع الأجهزة',
      features: ['تصميم متجاوب', 'تحسين الأداء', 'UX/UI متقدم', 'دعم جميع المتصفحات'],
      icon: Smartphone
    }
  ];

  // دمج المنتجات من الإدارة مع الخدمات الافتراضية
  const allServices = products.length > 0 ? products : services;

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
            برمجة مواقع الويب
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            نطور لك مواقع احترافية عصرية بأحدث التقنيات وأفضل الممارسات
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {allServices.map((service) => {
              const Icon = service.icon || Code;
              return (
                <div key={service.id} className="product-card rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{service.name}</h3>
                    <p className="text-gray-300 mb-4">{service.description}</p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">
                      {service.price || `${service.price}$`}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {(service.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => addToCart(service)}
                    className="w-full glow-button"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    أضف للسلة
                  </Button>
                </div>
              );
            })}
          </div>

          {/* Technologies Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              التقنيات التي نستخدمها
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['React.js', 'Node.js', 'MongoDB', 'WordPress', 'PHP', 'MySQL', 'JavaScript', 'CSS3'].map((tech) => (
                <div key={tech} className="bg-white/10 rounded-lg p-4 text-center">
                  <span className="text-white font-semibold">{tech}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-blue-400 text-center mb-8">
              عملية التطوير
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
                <h4 className="text-white font-semibold mb-2">التخطيط</h4>
                <p className="text-gray-300 text-sm">دراسة المتطلبات والتخطيط للمشروع</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
                <h4 className="text-white font-semibold mb-2">التصميم</h4>
                <p className="text-gray-300 text-sm">تصميم واجهات المستخدم</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
                <h4 className="text-white font-semibold mb-2">التطوير</h4>
                <p className="text-gray-300 text-sm">برمجة الموقع وتطويره</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">4</div>
                <h4 className="text-white font-semibold mb-2">التسليم</h4>
                <p className="text-gray-300 text-sm">اختبار وتسليم المشروع</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
