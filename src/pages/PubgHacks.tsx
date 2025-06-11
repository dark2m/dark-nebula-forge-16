
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

const PubgHacks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [currentLang, setCurrentLang] = useState(TranslationService.getCurrentLanguage());
  const { addToCart } = useCart();

  useEffect(() => {
    setProducts(ProductService.getProducts().filter(p => p.category === 'pubg'));
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
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {currentLang === 'ar' ? settings.pageTexts.pubgHacks.pageTitle : TranslationService.translate('pubg.page.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {currentLang === 'ar' ? settings.pageTexts.pubgHacks.pageSubtitle : TranslationService.translate('pubg.page.subtitle')}
            </p>
          </div>

          {/* Safety Section */}
          <div className="mb-12 p-8 bg-green-500/10 border border-green-500/30 rounded-xl">
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              {currentLang === 'ar' ? settings.pageTexts.pubgHacks.safetyTitle : TranslationService.translate('services.pubg.safety_title')}
            </h2>
            <p className="text-gray-300">
              {currentLang === 'ar' ? settings.pageTexts.pubgHacks.safetyDescription : TranslationService.translate('services.pubg.safety_description')}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div 
                  className="relative overflow-hidden rounded-xl border border-white/20 hover:border-blue-500/50 transition-all duration-300 transform hover:scale-105"
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
                        <h4 className="text-blue-400 font-semibold mb-2">
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
                        className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-sm"
                      >
                        <ShoppingCart className="w-4 h-4" />
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
                      <span className="text-2xl font-bold text-green-400">
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
              <p className="text-gray-400 text-xl">
                {TranslationService.translate('common.no_products')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PubgHacks;
