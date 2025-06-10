
import React, { useEffect, useState } from 'react';
import { ShoppingCart, MessageCircle, Phone } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ProductImageViewer from '../components/ProductImageViewer';
import ProductVideoViewer from '../components/ProductVideoViewer';
import SettingsService from '../utils/settingsService';
import ProductService from '../utils/productService';
import { useCart } from '../hooks/useCart';
import type { Product, SiteSettings } from '../types/admin';

const DiscordBots = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(ProductService.getProducts().filter(p => p.category === 'discord'));
    setSettings(SettingsService.getSiteSettings());
  }, []);

  const whatsappNumber = "971566252595";
  const whatsappMessage = encodeURIComponent("مرحباً، أريد الاستفسار عن خدمات برمجة بوتات ديسكورد");
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  if (!settings) return null;

  const getTextSize = (size: string) => {
    switch (size) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {settings.pageTexts.discordBots.pageTitle}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {settings.pageTexts.discordBots.pageSubtitle}
            </p>
          </div>

          {/* Features Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {settings.pageTexts.discordBots.featuresTitle}
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div 
                  className="relative overflow-hidden rounded-xl border border-white/20 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: product.backgroundColor || '#1a1a2e',
                    backgroundImage: product.backgroundImage ? `url(${product.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  
                  <div className="relative p-6">
                    <h3 className={`font-bold text-white mb-3 ${
                      product.titleSize === 'small' ? 'text-lg' :
                      product.titleSize === 'large' ? 'text-2xl' : 'text-xl'
                    }`}>
                      {product.name}
                    </h3>
                    
                    <p className={`text-gray-300 mb-4 ${getTextSize(product.textSize || 'medium')}`}>
                      {product.description}
                    </p>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-purple-400 font-semibold mb-2">المميزات:</h4>
                        <ul className="space-y-1">
                          {product.features.map((feature, index) => (
                            <li key={index} className={`text-gray-300 ${getTextSize(product.textSize || 'medium')}`}>
                              • {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Media and Cart Buttons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <button
                        onClick={() => addToCart(product)}
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{settings.pageTexts.cart.addToCartButton}</span>
                      </button>
                      
                      <ProductImageViewer 
                        images={product.images || []} 
                        productName={product.name} 
                      />
                      
                      <ProductVideoViewer 
                        videos={product.videos || []} 
                        productName={product.name} 
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-400">
                        ${product.price}
                      </span>
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-xl">لا توجد بوتات متاحة حالياً</p>
            </div>
          )}

          {/* Contact Section */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
              <Phone className="w-6 h-6 text-purple-400" />
              <div>
                <p className="text-white font-semibold">للاستفسار والطلب</p>
                <p className="text-gray-300">+971 56 625 2595</p>
                <p className="text-sm text-gray-400">الإمارات العربية المتحدة</p>
              </div>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-button flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                تواصل واتساب
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordBots;
