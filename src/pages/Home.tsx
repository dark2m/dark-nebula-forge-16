
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Code, Bot, ArrowLeft, ArrowRight } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import GlobalCart from '../components/GlobalCart';
import TranslationService from '../utils/translationService';

const Home = () => {
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  const [currentLang, setCurrentLang] = useState(TranslationService.getCurrentLanguage());

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const services = [
    {
      title: currentLang === 'ar' ? siteSettings.pageTexts.navigation.pubgTitle : TranslationService.translate('services.pubg.title'),
      description: currentLang === 'ar' ? 'أحدث الهاكات والأدوات لببجي موبايل' : TranslationService.translate('services.pubg.description'),
      icon: Shield,
      path: '/pubg-hacks',
      gradient: 'from-red-500 to-pink-600'
    },
    {
      title: currentLang === 'ar' ? siteSettings.pageTexts.navigation.webTitle : TranslationService.translate('services.web.title'),
      description: currentLang === 'ar' ? 'تطوير مواقع احترافية ومتقدمة' : TranslationService.translate('services.web.description'),
      icon: Code,
      path: '/web-development',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      title: currentLang === 'ar' ? siteSettings.pageTexts.navigation.discordTitle : TranslationService.translate('services.discord.title'),
      description: currentLang === 'ar' ? 'بوتات ديسكورد مخصصة ومتطورة' : TranslationService.translate('services.discord.description'),
      icon: Bot,
      path: '/discord-bots',
      gradient: 'from-purple-500 to-indigo-600'
    }
  ];

  const homeTexts = siteSettings.pageTexts.home;
  const visibleFeatures = homeTexts.features.filter(feature => feature.visible);

  const ArrowIcon = currentLang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
            {currentLang === 'ar' ? homeTexts.heroTitle : TranslationService.translate('page.home.title')}
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            {currentLang === 'ar' ? homeTexts.heroSubtitle : TranslationService.translate('page.home.subtitle')}
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
                    <span className={currentLang === 'ar' ? 'mr-2' : 'ml-2'}>
                      {TranslationService.translate('common.explore_now')}
                    </span>
                    <ArrowIcon className="w-4 h-4" />
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
              {homeTexts.featuresTitle}
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
    </div>
  );
};

export default Home;
