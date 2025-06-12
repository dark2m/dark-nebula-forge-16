
import React, { useState, useEffect } from 'react';
import { MessageCircle, Mail, Phone, MapPin, Users, Star, Shield } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import AdminStorage from '../utils/adminStorage';
import TranslationService from '../utils/translationService';
import GlobalCart from '../components/GlobalCart';

const OfficialPage = () => {
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSiteSettings(loadedSettings);
  }, []);

  // Helper function to generate contact links
  const getContactLink = (type: string, value: string) => {
    switch (type) {
      case 'telegram':
        return value.startsWith('@') ? `https://t.me/${value.substring(1)}` : `https://t.me/${value}`;
      case 'discord':
        return value.startsWith('http') ? value : `https://discord.gg/${value}`;
      case 'whatsapp':
        const cleanNumber = value.replace(/\D/g, '');
        return `https://wa.me/${cleanNumber}`;
      case 'email':
        return `mailto:${value}`;
      case 'phone':
        return `tel:${value}`;
      default:
        return '#';
    }
  };

  const handleContactClick = (type: string, value: string) => {
    const link = getContactLink(type, value);
    if (type === 'address') {
      // For address, open Google Maps
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`, '_blank');
    } else {
      window.open(link, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-white via-blue-200 to-blue-400 bg-clip-text text-transparent">
              {TranslationService.translate('official.page.title')}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              {TranslationService.translate('official.page.subtitle')}
            </p>
          </div>

          {/* About Us Section */}
          <div className="admin-card rounded-xl p-6 sm:p-8 mb-12">
            <div className="flex items-center justify-center mb-6">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
              {TranslationService.translate('official.about.title')}
            </h2>
            <div className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-4xl mx-auto">
              <p className="mb-6">
                {TranslationService.translate('official.about.content.p1')}
              </p>
              <p className="mb-6">
                {TranslationService.translate('official.about.content.p2')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-4">
                  <div className="text-3xl sm:text-4xl mb-3">🛡️</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {TranslationService.translate('official.why.security.title')}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {TranslationService.translate('official.why.security.desc')}
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl sm:text-4xl mb-3">⭐</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {TranslationService.translate('official.why.quality.title')}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {TranslationService.translate('official.why.quality.desc')}
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="text-3xl sm:text-4xl mb-3">💬</div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {TranslationService.translate('official.why.support.title')}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base">
                    {TranslationService.translate('official.why.support.desc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="admin-card rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-center mb-6">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              {TranslationService.translate('official.contact.title')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              
              {/* Telegram */}
              <button
                onClick={() => handleContactClick('telegram', siteSettings.contactInfo.telegram)}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.telegram')}
                </h3>
                <p className="text-blue-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.telegram}</p>
              </button>

              {/* Discord */}
              <button
                onClick={() => handleContactClick('discord', siteSettings.contactInfo.discord)}
                className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-purple-500/20 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.discord')}
                </h3>
                <p className="text-purple-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.discord}</p>
              </button>

              {/* WhatsApp */}
              <button
                onClick={() => handleContactClick('whatsapp', siteSettings.contactInfo.whatsapp)}
                className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-green-500/20 transition-colors cursor-pointer"
              >
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-green-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.whatsapp')}
                </h3>
                <p className="text-green-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.whatsapp}</p>
              </button>

              {/* Email */}
              <button
                onClick={() => handleContactClick('email', siteSettings.contactInfo.email)}
                className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-red-500/20 transition-colors cursor-pointer"
              >
                <Mail className="w-6 h-6 sm:w-8 sm:h-8 text-red-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.email')}
                </h3>
                <p className="text-red-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.email}</p>
              </button>

              {/* Phone */}
              <button
                onClick={() => handleContactClick('phone', siteSettings.contactInfo.phone)}
                className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-blue-500/20 transition-colors cursor-pointer"
              >
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.phone')}
                </h3>
                <p className="text-blue-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.phone}</p>
              </button>

              {/* Address */}
              <button
                onClick={() => handleContactClick('address', siteSettings.contactInfo.address)}
                className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4 sm:p-6 text-center hover:bg-gray-500/20 transition-colors cursor-pointer"
              >
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                  {TranslationService.translate('contact.address')}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base break-all">{siteSettings.contactInfo.address}</p>
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfficialPage;
