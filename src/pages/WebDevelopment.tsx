
import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import { Button } from '@/components/ui/button';
import GlobalCart from '../components/GlobalCart';
import ProductImageViewer from '../components/ProductImageViewer';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '../types/admin';

const WebDevelopment = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    try {
      const allProducts = AdminStorage.getProducts();
      console.log('All products loaded:', allProducts);
      
      const webProducts = Array.isArray(allProducts) ? allProducts.filter(p => p.category === 'web') : [];
      console.log('Web products filtered:', webProducts);
      
      setProducts(webProducts);
      setSiteSettings(AdminStorage.getSiteSettings());
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  }, []);

  const addToCart = (product: Product) => {
    try {
      console.log('Adding product to cart:', product);
      AdminStorage.addToCart(product);
      
      toast({
        title: "تم إضافة المنتج",
        description: `تم إضافة ${product.name} إلى السلة`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المنتج للسلة",
        variant: "destructive"
      });
    }
  };

  const pageTexts = siteSettings.pageTexts.webDevelopment;
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

          {products.length === 0 ? (
            <div className="text-center text-gray-400 mt-12">
              <p className="text-xl">لا توجد منتجات برمجة مواقع حالياً</p>
              <p className="text-sm mt-2">سيتم إضافة منتجات جديدة قريباً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="product-card rounded-xl p-6"
                  style={{
                    backgroundColor: product.backgroundColor || 'rgba(255, 255, 255, 0.1)',
                    backgroundImage: product.backgroundImage ? `url(${product.backgroundImage})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="text-center mb-6">
                    <div className="inline-flex p-3 rounded-full bg-blue-500/20 mb-4">
                      <Code className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 
                      className={`text-2xl font-bold text-white mb-2 ${
                        product.titleSize === 'small' ? 'text-lg' :
                        product.titleSize === 'medium' ? 'text-xl' :
                        product.titleSize === 'large' ? 'text-2xl' :
                        'text-3xl'
                      }`}
                    >
                      {product.name}
                    </h3>
                    <p 
                      className={`text-gray-300 mb-4 ${
                        product.textSize === 'small' ? 'text-sm' :
                        product.textSize === 'medium' ? 'text-base' :
                        'text-lg'
                      }`}
                    >
                      {product.description}
                    </p>
                    <div className="text-3xl font-bold text-blue-400 mb-6">${product.price}</div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {(product.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                        <span className={
                          product.textSize === 'small' ? 'text-sm' :
                          product.textSize === 'medium' ? 'text-base' :
                          'text-lg'
                        }>
                          {feature}
                        </span>
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
                      {product.images && product.images.length > 0 && (
                        <ProductImageViewer 
                          images={product.images} 
                          productName={product.name}
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
