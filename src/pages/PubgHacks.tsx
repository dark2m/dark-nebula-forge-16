
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage, { Product } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import GlobalCart from '../components/GlobalCart';

const PubgHacks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadedProducts = AdminStorage.getProducts().filter(p => p.category === 'pubg');
    setProducts(loadedProducts);
    setSiteSettings(AdminStorage.getSiteSettings());
  }, []);

  const addToCart = (product: Product) => {
    AdminStorage.addToCart(product);
  };

  const pageTexts = siteSettings.pageTexts.pubgHacks;
  const cartTexts = siteSettings.pageTexts.cart;

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            {pageTexts.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            {pageTexts.pageSubtitle}
          </p>

          {/* Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="product-card rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-full bg-red-500/20 mb-4">
                    <Shield className="w-6 h-6 text-red-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="text-3xl font-bold text-red-400 mb-6">${product.price}</div>
                </div>

                <div className="space-y-3 mb-6">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  onClick={() => addToCart(product)}
                  className="w-full glow-button"
                >
                  {cartTexts.addToCartButton}
                </Button>
              </div>
            ))}
          </div>

          {/* Safety Notice */}
          <div className="mt-16 bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-4">
              {pageTexts.safetyTitle}
            </h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {pageTexts.safetyDescription}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PubgHacks;
