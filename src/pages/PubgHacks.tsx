
import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import ProductService from '../utils/productService';
import SettingsService from '../utils/settingsService';
import { Product } from '../types/admin';
import { Button } from '@/components/ui/button';
import GlobalCart from '../components/GlobalCart';
import ProductImageViewer from '../components/ProductImageViewer';
import { useToast } from '@/hooks/use-toast';
import CartService from '../utils/cartService';

const PubgHacks = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [siteSettings, setSiteSettings] = useState(SettingsService.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    console.log('PubgHacks: Loading products...');
    loadProducts();
    loadSettings();

    // Listen for product updates
    const handleProductsUpdate = () => {
      console.log('PubgHacks: Products updated, reloading...');
      loadProducts();
    };

    // Listen for settings updates
    const handleSettingsUpdate = () => {
      console.log('PubgHacks: Settings updated, reloading...');
      loadSettings();
    };

    window.addEventListener('productsUpdated', handleProductsUpdate);
    window.addEventListener('settingsUpdated', handleSettingsUpdate);

    return () => {
      window.removeEventListener('productsUpdated', handleProductsUpdate);
      window.removeEventListener('settingsUpdated', handleSettingsUpdate);
    };
  }, []);

  const loadProducts = () => {
    try {
      const allProducts = ProductService.getProducts();
      console.log('PubgHacks: All products loaded:', allProducts);
      
      const pubgProducts = allProducts.filter(p => p.category === 'pubg');
      console.log('PubgHacks: PUBG products filtered:', pubgProducts);
      
      setProducts(pubgProducts);
    } catch (error) {
      console.error('PubgHacks: Error loading products:', error);
      setProducts([]);
    }
  };

  const loadSettings = () => {
    try {
      const settings = SettingsService.getSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error('PubgHacks: Error loading settings:', error);
    }
  };

  const addToCart = (product: Product) => {
    try {
      console.log('PubgHacks: Adding product to cart:', product);
      CartService.addToCart(product);
      toast({
        title: "تم إضافة المنتج",
        description: `تم إضافة ${product.name} إلى السلة`,
        variant: "default"
      });
      console.log('PubgHacks: Product added successfully');
    } catch (error) {
      console.error('PubgHacks: Error adding to cart:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إضافة المنتج للسلة",
        variant: "destructive"
      });
    }
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

          {/* Debug info */}
          <div className="text-center mb-8">
            <p className="text-gray-400">عدد المنتجات المتاحة: {products.length}</p>
          </div>

          {/* Products */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400 text-lg">لا توجد منتجات متاحة حالياً</p>
                <p className="text-gray-500 text-sm mt-2">يرجى إضافة منتجات من لوحة الإدارة</p>
              </div>
            ) : (
              products.map((product) => (
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
                    {(product.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
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
              ))
            )}
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
