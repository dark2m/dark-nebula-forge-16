
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Bot, ArrowLeft, User, Sparkles, Zap, Crown } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import GlobalCart from '../components/GlobalCart';
import TranslationService from '../utils/translationService';
import { getTextContent } from '../utils/textUtils';
import { useAuth } from '@/contexts/AuthContext';
import ParticleSystem from '../components/ParticleSystem';
import FloatingOrbs from '../components/FloatingOrbs';
import AnimatedText from '../components/AnimatedText';
import GlowingButton from '../components/GlowingButton';
import InteractiveCard from '../components/InteractiveCard';

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
    <div className="min-h-screen relative overflow-hidden">
      <StarryBackground />
      <ParticleSystem />
      <FloatingOrbs />
      <GlobalCart />
      
      {/* Decorative floating elements */}
      <div className="fixed inset-0 pointer-events-none z-[4]">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            {i % 3 === 0 && <Crown className="w-6 h-6 text-yellow-400/30 animate-spin" style={{ animationDuration: '20s' }} />}
            {i % 3 === 1 && <Sparkles className="w-4 h-4 text-blue-400/40 animate-pulse" />}
            {i % 3 === 2 && <Zap className="w-5 h-5 text-purple-400/30 animate-bounce" style={{ animationDuration: '3s' }} />}
          </div>
        ))}
      </div>
      
      {/* Auth Section - Show only dashboard link for logged in users */}
      {user && (
        <div className="absolute top-6 left-6 z-20">
          <GlowingButton to="/dashboard" gradient="from-green-500 to-emerald-600">
            <User className="w-5 h-5 inline ml-2" />
            لوحة التحكم
          </GlowingButton>
        </div>
      )}
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          
          {/* Animated title with enhanced effects */}
          <div className="relative mb-6">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-cyan-600/20 rounded-3xl blur-2xl animate-pulse"></div>
            <h1 className="relative text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              <AnimatedText text={getTextContent(homeTexts.heroTitle)} speed={150} />
            </h1>
          </div>
          
          <div className="relative mb-12">
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              <AnimatedText text={getTextContent(homeTexts.heroSubtitle)} speed={50} />
            </p>
          </div>
          
          {/* Enhanced Services Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {services.map((service, index) => (
              <InteractiveCard
                key={index}
                title={service.title}
                description={service.description}
                icon={service.icon}
                gradient={service.gradient}
              >
                <GlowingButton to={service.path} gradient={service.gradient}>
                  <span className="mr-2">استكشف الآن</span>
                  <ArrowLeft className="w-4 h-4 inline" />
                </GlowingButton>
              </InteractiveCard>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      {visibleFeatures.length > 0 && (
        <div className="relative z-10 py-20 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-6 text-center">
            <div className="relative mb-12">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl animate-pulse"></div>
              <h2 className="relative text-4xl font-bold text-white">
                <AnimatedText text={getTextContent(homeTexts.featuresTitle)} speed={100} />
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {visibleFeatures.map((feature, index) => (
                <div 
                  key={feature.id} 
                  className="group relative p-6 transform transition-all duration-500 hover:scale-105"
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {/* Background glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
                  
                  {/* Content */}
                  <div className="relative bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-6 group-hover:border-white/20 transition-all duration-300">
                    <div className="text-blue-400 text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Supabase Integration Info */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-6 text-center">
          <div className="relative group">
            {/* Enhanced background effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-600/10 to-cyan-500/10 rounded-3xl blur-2xl animate-pulse"></div>
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl blur-xl opacity-50"></div>
            
            <div className="relative bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-xl p-8 max-w-4xl mx-auto group-hover:border-white/30 transition-all duration-500">
              <div className="relative mb-6">
                <h2 className="text-3xl font-bold text-white">
                  <AnimatedText text="🚀 مزايا التكامل مع Supabase" speed={80} />
                </h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 text-right">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse group/item">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h3 className="text-white font-semibold group-hover/item:text-green-400 transition-colors">المصادقة الآمنة</h3>
                      <p className="text-gray-300 text-sm">تسجيل دخول وإنشاء حسابات آمنة</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse group/item">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h3 className="text-white font-semibold group-hover/item:text-blue-400 transition-colors">تخزين البيانات</h3>
                      <p className="text-gray-300 text-sm">حفظ المحتوى والإعدادات تلقائياً</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse group/item">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h3 className="text-white font-semibold group-hover/item:text-purple-400 transition-colors">رفع الملفات</h3>
                      <p className="text-gray-300 text-sm">تخزين الصور والفيديوهات بأمان</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 space-x-reverse group/item">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 group-hover/item:scale-150 transition-transform duration-300"></div>
                    <div>
                      <h3 className="text-white font-semibold group-hover/item:text-yellow-400 transition-colors">الثبات والاستقرار</h3>
                      <p className="text-gray-300 text-sm">لا فقدان للبيانات بعد التحديث</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
