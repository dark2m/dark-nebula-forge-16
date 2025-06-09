
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Star, Shield, Eye, Target, ExternalLink, Image as ImageIcon, Video, Play } from 'lucide-react';
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

  const getTextSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getTitleSizeClass = (size: string) => {
    switch (size) {
      case 'small': return 'text-lg';
      case 'medium': return 'text-xl';
      case 'large': return 'text-2xl';
      case 'xl': return 'text-3xl';
      default: return 'text-2xl';
    }
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

              const cardStyle: React.CSSProperties = {};
              if (product.backgroundImage) {
                cardStyle.backgroundImage = `linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url(${product.backgroundImage})`;
                cardStyle.backgroundSize = 'cover';
                cardStyle.backgroundPosition = 'center';
              } else if (product.backgroundColor) {
                cardStyle.backgroundColor = product.backgroundColor;
              }

              return (
                <div
                  key={product.id}
                  className={`product-card rounded-xl p-6 relative ${
                    isPopular ? 'ring-2 ring-blue-400' : ''
                  }`}
                  style={cardStyle}
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
                    <h3 className={`${getTitleSizeClass(product.titleSize || 'large')} font-bold text-white mb-2`}>
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className={`text-gray-300 mb-4 ${getTextSizeClass(product.textSize || 'medium')}`}>
                      {product.description}
                    </p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">${product.price}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {product.features && product.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className={getTextSizeClass(product.textSize || 'medium')}>{feature}</span>
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
                    
                    {(product.images?.length > 0 || product.videos?.length > 0) && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full bg-transparent border-blue-400 text-blue-400 hover:bg-blue-400/10">
                            {product.videos?.length > 0 ? (
                              <>
                                <Video className="w-4 h-4 mr-2" />
                                عرض الفيديوهات والصور
                              </>
                            ) : (
                              <>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                عرض صور المنتج
                              </>
                            )}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{product.name} - معرض الوسائط</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Videos */}
                            {product.videos && product.videos.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <Video className="w-5 h-5 mr-2" />
                                  الفيديوهات
                                </h3>
                                <div className="space-y-4">
                                  {product.videos.map((video, videoIndex) => (
                                    <div key={videoIndex} className="relative">
                                      <video 
                                        src={video} 
                                        className="w-full rounded-lg border border-gray-700"
                                        controls
                                        poster=""
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Images */}
                            {product.images && product.images.length > 0 && (
                              <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center">
                                  <ImageIcon className="w-5 h-5 mr-2" />
                                  الصور
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {product.images.map((image, imageIndex) => (
                                    <img 
                                      key={imageIndex}
                                      src={image} 
                                      alt={`${product.name} ${imageIndex + 1}`}
                                      className="w-full rounded-lg border border-gray-700"
                                    />
                                  ))}
                                </div>
                              </div>
                            )}

                            {product.images?.length === 0 && product.videos?.length === 0 && (
                              <p className="text-gray-400 text-center py-8">
                                لا توجد وسائط متاحة لهذا المنتج
                              </p>
                            )}
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
