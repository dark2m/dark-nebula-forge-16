
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Bot, ArrowLeft, User, LogIn } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import GlobalCart from '../components/GlobalCart';
import TranslationService from '../utils/translationService';
import { getTextContent } from '../utils/textUtils';
import { useAuth } from '@/contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
    console.log('Home: Loaded settings:', loadedSettings);

    // الاستماع لتحديثات الإعدادات
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('Home: Settings updated via event:', event.detail.settings);
      setSiteSettings(event.detail.settings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  const services = [
    {
      title: getTextContent(siteSettings.pageTexts.navigation.pubgTitle),
      description: 'أحدث الهاكات والأدوات لببجي موبايل',
      icon: Shield,
      path: '/pubg-hacks',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      title: getTextContent(siteSettings.pageTexts.navigation.webTitle),
      description: 'تطوير مواقع احترافية ومتقدمة',
      icon: Code,
      path: '/web-development',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: getTextContent(siteSettings.pageTexts.navigation.discordTitle),
      description: 'بوتات ديسكورد مخصصة ومتطورة',
      icon: Bot,
      path: '/discord-bots',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  const homeTexts = siteSettings.pageTexts.home;
  const visibleFeatures = homeTexts.features.filter(feature => feature.visible);

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      {/* Auth Section */}
      <div className="absolute top-6 left-6 z-20">
        {user ? (
          <Link 
            to="/dashboard"
            className="flex items-center space-x-2 space-x-reverse bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 text-white hover:bg-white/20 transition-all duration-300"
          >
            <User className="w-5 h-5" />
            <span>لوحة التحكم</span>
          </Link>
        ) : (
          <Link 
            to="/auth"
            className="flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
          >
            <LogIn className="w-5 h-5" />
            <span>تسجيل الدخول</span>
          </Link>
        )}
      </div>
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {getTextContent(homeTexts.heroTitle)}
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {getTextContent(homeTexts.heroSubtitle)}
          </p>
          
          {/* Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  to={service.path}
                  className="product-card rounded-xl p-8 text-center group"
                >
                  <div className={`inline-flex p-4 rounded-full bg-gradient-to-r ${service.gradient} mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 mb-6">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-center text-blue-400 group-hover:text-white transition-colors">
                    <span className="mr-2">
                      استكشف الآن
                    </span>
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features Section */}
      {visibleFeatures.length > 0 && (
        <div className="relative z-10 py-20 bg-black/30">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-white mb-12">
              {getTextContent(homeTexts.featuresTitle)}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {visibleFeatures.map((feature) => (
                <div key={feature.id} className="p-6">
                  <div className="text-blue-400 text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Supabase Integration Info */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">
              🚀 مزايا التكامل مع Supabase
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-right">
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-white font-semibold">المصادقة الآمنة</h3>
                    <p className="text-gray-300 text-sm">تسجيل دخول وإنشاء حسابات آمنة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-white font-semibold">تخزين البيانات</h3>
                    <p className="text-gray-300 text-sm">حفظ المحتوى والإعدادات تلقائياً</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-white font-semibold">رفع الملفات</h3>
                    <p className="text-gray-300 text-sm">تخزين الصور والفيديوهات بأمان</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 space-x-reverse">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <h3 className="text-white font-semibold">الثبات والاستقرار</h3>
                    <p className="text-gray-300 text-sm">لا فقدان للبيانات بعد التحديث</p>
                  </div>
                </div>
              </div>
            </div>
            {!user && (
              <div className="mt-8">
                <Link 
                  to="/auth"
                  className="inline-flex items-center space-x-2 space-x-reverse bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  <span>جرب الآن - إنشاء حساب مجاني</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
