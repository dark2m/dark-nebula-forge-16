
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Bot, Star, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../components/ProductCard';
import { SettingsService } from '../utils/settingsService';
import { ProductService } from '../utils/productService';
import { useCart } from '../hooks/useCart';
import type { SiteSettings, Product } from '../types/admin';

const DiscordBots = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setSiteSettings(SettingsService.getSiteSettings());
    setProducts(ProductService.getProductsByCategory('discord'));

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const pageTexts = siteSettings.pageTexts?.discordBots || {
    pageTitle: 'بوتات Discord',
    pageSubtitle: 'بوتات ذكية ومطورة',
    featuresTitle: 'المميزات'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Bot className="w-16 h-16 text-blue-400 mr-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {pageTexts.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {pageTexts.pageSubtitle}
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">أداء سريع</h3>
            <p className="text-gray-300">بوتات بأداء عالي وسرعة استجابة فائقة</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">أمان موثوق</h3>
            <p className="text-gray-300">حماية كاملة لخادمك وبياناتك</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">مميزات متقدمة</h3>
            <p className="text-gray-300">إمكانيات واسعة وتخصيص مرن</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">بوتات Discord المتاحة</h2>
          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد بوتات متاحة حالياً</h3>
              <p className="text-gray-400">سيتم إضافة المزيد من البوتات قريباً</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">تريد بوت مخصص؟</h2>
          <p className="text-xl text-blue-100 mb-8">
            يمكننا تطوير بوت Discord مخصص حسب احتياجاتك
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            اطلب بوت مخصص
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiscordBots;
