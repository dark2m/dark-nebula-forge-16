
import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ProductImageViewer from '../components/ProductImageViewer';
import ProductVideoViewer from '../components/ProductVideoViewer';
import SettingsService from '../utils/settingsService';
import ProductService from '../utils/productService';
import TranslationService from '../utils/translationService';
import { useCart } from '../hooks/useCart';
import type { Product, SiteSettings } from '../types/admin';
import GlobalCart from '../components/GlobalCart';

const WebDevelopment = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentLang, setCurrentLang] = useState(TranslationService.getCurrentLanguage());
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(ProductService.getProducts().filter(p => p.category === 'web'));
    setSettings(SettingsService.getSiteSettings());
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

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
      <GlobalCart />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
              {TranslationService.translate('web.page.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {TranslationService.translate('web.page.subtitle')}
            </p>
          </div>

          {/* Services Section */}
          <div className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              {TranslationService.translate('services.web.services_title')}
            </h2>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div 
                  className="relative overflow-hidden rounded-xl border border-white/20 hover:border-green-500/50 transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundColor: product.backgroundColor || '#1a1a2e',
                    backgroundImage: product.backgroundImage ? `url(${product.backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  
                  <div className="relative p-4 sm:p-6">
                    <h3 className={`font-bold text-white mb-3 ${
                      product.titleSize === 'small' ? 'text-base sm:text-lg' :
                      product.titleSize === 'large' ? 'text-xl sm:text-2xl' : 'text-lg sm:text-xl'
                    }`}>
                      {product.name}
                    </h3>
                    
                    <p className={`text-gray-300 mb-4 ${getTextSize(product.textSize || 'medium')}`}>
                      {product.description}
                    </p>

                    {/* Features */}
                    {product.features && product.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-green-400 font-semibold mb-2">
                          {TranslationService.translate('common.features')}:
                        </h4>
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
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm"
                      >
                        <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{TranslationService.translate('common.add_to_cart')}</span>
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

                    <div className="flex items-center justify-center">
                      <span className="text-xl sm:text-2xl font-bold text-green-400">
                        ${product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg sm:text-xl">
                {TranslationService.translate('common.no_services')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
