
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Gamepad2, Shield, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProductCard from '../components/ProductCard';
import { SettingsService } from '../utils/settingsService';
import { ProductService } from '../utils/productService';
import { useCart } from '../hooks/useCart';
import type { SiteSettings, Product } from '../types/admin';

const PubgHacks = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setSiteSettings(SettingsService.getSiteSettings());
    setProducts(ProductService.getProductsByCategory('pubg'));

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const pageTexts = siteSettings.pageTexts?.pubgHacks || {
    pageTitle: 'هاكات PUBG',
    pageSubtitle: 'أدوات تطوير اللعبة',
    safetyTitle: 'الأمان',
    safetyDescription: 'جميع أدواتنا آمنة'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Gamepad2 className="w-16 h-16 text-blue-400 mr-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {pageTexts.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {pageTexts.pageSubtitle}
          </p>
          <div className="flex justify-center">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/50 px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              آمن ومحدث
            </Badge>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-16">
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 text-green-400 mr-3" />
            <h3 className="text-xl font-bold text-white">{pageTexts.safetyTitle}</h3>
          </div>
          <p className="text-green-300 text-lg">{pageTexts.safetyDescription}</p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">رؤية متقدمة</h3>
            <p className="text-gray-300">اكتشف الأعداء من مسافات بعيدة</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">أداء سريع</h3>
            <p className="text-gray-300">استجابة فورية بدون تأخير</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">حماية كاملة</h3>
            <p className="text-gray-300">تحديثات منتظمة ضد الحظر</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">هاكات PUBG المتاحة</h2>
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
              <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد هاكات متاحة حالياً</h3>
              <p className="text-gray-400">سيتم إضافة المزيد من الهاكات قريباً</p>
            </div>
          )}
        </div>

        {/* Warning */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-yellow-400 mb-2">تنبيه مهم</h3>
          <p className="text-yellow-300">
            استخدم الهاكات بحذر واتبع تعليمات الاستخدام لتجنب أي مشاكل
          </p>
        </div>
      </div>
    </div>
  );
};

export default PubgHacks;
