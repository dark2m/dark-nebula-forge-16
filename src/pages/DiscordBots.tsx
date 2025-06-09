
import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage, { Product } from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import GlobalCart from '../components/GlobalCart';
import ProductImageViewer from '../components/ProductImageViewer';

const DiscordBots = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    try {
      const allProducts = AdminStorage.getProducts();
      const discordProducts = Array.isArray(allProducts) ? allProducts.filter(p => p.category === 'discord') : [];
      setProducts(discordProducts);
      setSiteSettings(AdminStorage.getSiteSettings());
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  }, []);

  const addToCart = (product: Product) => {
    AdminStorage.addToCart(product);
  };

  const pageTexts = siteSettings.pageTexts.discordBots;
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

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} className="product-card rounded-xl p-6">
                <div className="text-center mb-6">
                  <div className="inline-flex p-3 rounded-full bg-purple-500/20 mb-4">
                    <Bot className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-gray-300 mb-4">{product.description}</p>
                  <div className="text-3xl font-bold text-purple-400 mb-6">${product.price}</div>
                </div>

                <div className="space-y-3 mb-6">
                  {(product.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2 justify-center">
                    <Button 
                      onClick={() => addToCart(product)}
                      className="flex-1 glow-button"
                    >
                      {cartTexts.addToCartButton}
                    </Button>
                    <ProductImageViewer 
                      images={product.images || []} 
                      productName={product.name}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscordBots;
