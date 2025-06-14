
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
  const { addToCart } = useCart();

  useEffect(() => {
    // تحميل المنتجات والإعدادات
    const loadData = () => {
      console.log('PubgHacks: Loading products and settings...');
      const allProducts = ProductService.getProducts();
      const pubgProducts = allProducts.filter(p => p.category === 'pubg');
      console.log('PubgHacks: PUBG products found:', pubgProducts.length);
      setProducts(pubgProducts);
      setSettings(SettingsService.getSiteSettings());
    };

    loadData();

    // الاستماع لتحديثات المنتجات
    const handleProductsUpdate = (event: CustomEvent) => {
      console.log('PubgHacks: Products updated, refreshing...');
      const allProducts = event.detail.products;
      const pubgProducts = allProducts.filter((p: Product) => p.category === 'pubg');
      setProducts(pubgProducts);
    };

    window.addEventListener('productsUpdated', handleProductsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate as EventListener);
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
              {TranslationService.translate('pubg.page.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {TranslationService.translate('pubg.page.subtitle')}
            </p>
          </div>

          {/* Safety Section */}
          <div className="mb-12 p-6 sm:p-8 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-xl">
            <h2 className="text-xl sm:text-2xl font-bold text-green-400 mb-4">
              {TranslationService.translate('services.pubg.safety_title')}
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">
              {TranslationService.translate('services.pubg.safety_description')}
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {products.map((product) => (
              <div key={product.id} className="group">
                <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-500/50 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
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
