
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Code, Laptop, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '../components/ProductCard';
import { SettingsService } from '../utils/settingsService';
import { ProductService } from '../utils/productService';
import { useCart } from '../hooks/useCart';
import type { SiteSettings, Product } from '../types/admin';

const WebDevelopment = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const [products, setProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();

  useEffect(() => {
    setSiteSettings(SettingsService.getSiteSettings());
    setProducts(ProductService.getProductsByCategory('web'));

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const pageTexts = siteSettings.pageTexts?.webDevelopment || {
    pageTitle: 'تطوير المواقع',
    pageSubtitle: 'خدمات تطوير احترافية',
    servicesTitle: 'خدماتنا'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Code className="w-16 h-16 text-blue-400 mr-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {pageTexts.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {pageTexts.pageSubtitle}
          </p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Laptop className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">مواقع سطح المكتب</h3>
            <p className="text-gray-300">تطوير مواقع متجاوبة لجميع الأجهزة</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Smartphone className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">تطبيقات الموبايل</h3>
            <p className="text-gray-300">تطبيقات ويب متقدمة للهواتف الذكية</p>
          </div>
          <div className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
            <Globe className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">مواقع إلكترونية</h3>
            <p className="text-gray-300">حلول ويب شاملة ومخصصة</p>
          </div>
        </div>

        {/* Products */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">خدمات تطوير المواقع</h2>
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
              <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">لا توجد خدمات متاحة حالياً</h3>
              <p className="text-gray-400">سيتم إضافة المزيد من الخدمات قريباً</p>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-12">
          <h2 className="text-3xl font-bold text-white mb-4">لديك فكرة مشروع؟</h2>
          <p className="text-xl text-blue-100 mb-8">
            نحن هنا لمساعدتك في تحويل فكرتك إلى واقع رقمي
          </p>
          <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            ابدأ مشروعك الآن
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WebDevelopment;
