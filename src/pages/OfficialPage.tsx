
import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Users, Star, Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import TranslationService from '../utils/translationService';
import GlobalCart from '../components/GlobalCart';

const OfficialPage = () => {
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

  const pageTexts = siteSettings.pageTexts.official;

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              {currentLang === 'ar' ? pageTexts.pageTitle : TranslationService.translate('official.page.title')}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {currentLang === 'ar' ? pageTexts.pageSubtitle : TranslationService.translate('official.page.subtitle')}
            </p>
          </div>

          {/* About Us Section */}
          <div className="admin-card rounded-xl p-8 mb-12">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-6">
              {currentLang === 'ar' ? pageTexts.aboutTitle : TranslationService.translate('official.about.title')}
            </h2>
            <div className="text-gray-300 text-lg leading-relaxed max-w-4xl mx-auto">
              {pageTexts.aboutContent.map((paragraph, index) => (
                <p key={index} className="mb-6">
                  {paragraph}
                </p>
              ))}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {pageTexts.whyChooseItems.map((item, index) => (
                  <div key={index} className="text-center p-4">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="admin-card rounded-xl p-8">
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="w-12 h-12 text-blue-400" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              {currentLang === 'ar' ? pageTexts.contactTitle : TranslationService.translate('official.contact.title')}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.telegram')}
                </h3>
                <p className="text-blue-400">{siteSettings.contactInfo.telegram}</p>
              </div>
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-6 text-center">
                <MessageCircle className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.discord')}
                </h3>
                <p className="text-purple-400">{siteSettings.contactInfo.discord}</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.whatsapp')}
                </h3>
                <p className="text-green-400">{siteSettings.contactInfo.whatsapp}</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
                <Mail className="w-8 h-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.email')}
                </h3>
                <p className="text-red-400">{siteSettings.contactInfo.email}</p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6 text-center">
                <Phone className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.phone')}
                </h3>
                <p className="text-blue-400">{siteSettings.contactInfo.phone}</p>
              </div>
              <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-6 text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.address')}
                </h3>
                <p className="text-gray-400">{siteSettings.contactInfo.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialPage;
