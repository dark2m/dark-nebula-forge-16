
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Shield, Eye, Target, ExternalLink, Image as ImageIcon } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage, { Product } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const PubgHacks = () => {
  const [cart, setCart] = useState<Array<{id: number, name: string, price: string}>>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Load products from admin storage
  useEffect(() => {
    const loadedProducts = AdminStorage.getProducts();
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

  const getProductIcon = (index: number) => {
    const icons = [Eye, Target, Shield];
    return icons[index % icons.length];
  };

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
            هكر ببجي موبايل
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            أحدث وأقوى الهاكات لببجي موبايل - آمنة وغير قابلة للاكتشاف
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {products.filter(product => product.category === 'pubg').map((product, index) => {
              const Icon = getProductIcon(index);
              const isPopular = index === 2; // Make third product popular

              return (
                <div
                  key={product.id}
                  className={`product-card rounded-xl p-6 relative ${
                    isPopular ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={{
                    backgroundImage: product.image ? `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${product.image})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                        الأكثر مبيعاً
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
                      <Icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">{product.description}</p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">${product.price}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {product.features && product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => addToCart(product)}
                      className="w-full glow-button flex items-center justify-center space-x-2 rtl:space-x-reverse"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>أضف للسلة</span>
                    </button>
                    
                    {product.image && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10">
                            <ImageIcon className="w-4 h-4 mr-2" />
                            عرض صور المنتج
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>{product.name} - معرض الصور</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full rounded-lg border border-gray-700"
                            />
                            <p className="text-gray-400 text-sm text-center">
                              صور توضيحية للمنتج وواجهة الاستخدام
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Discord Section */}
          <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="flex items-center justify-center mb-4">
              <ExternalLink className="w-12 h-12 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">للشراء والاستفسار</h3>
            <p className="text-gray-300 mb-4">
              انضم إلى خادم الديسكورد الخاص بنا لإتمام عملية الشراء والحصول على الدعم الفني
            </p>
            <Button 
              onClick={handlePurchase}
              className="glow-button"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              انضم للديسكورد
            </Button>
          </div>

          {/* Security Notice */}
          <div className="mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-green-400 mb-2">ضمان الأمان 100%</h3>
            <p className="text-gray-300">
              جميع هاكاتنا محدثة باستمرار ومحمية ضد أنظمة الكشف. نضمن لك اللعب بأمان تام.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PubgHacks;
