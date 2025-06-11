
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Code, Bot, User, Users } from 'lucide-react';
import AdminStorage from '../utils/adminStorage';
import LanguageSwitch from './LanguageSwitch';
import TranslationService from '../utils/translationService';

const Navigation = () => {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  const [currentLang, setCurrentLang] = useState(TranslationService.getCurrentLanguage());
  
  useEffect(() => {
    setSiteSettings(AdminStorage.getSiteSettings());
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

  const navTexts = siteSettings.pageTexts.navigation;
  
  const navItems = [
    { 
      name: currentLang === 'ar' ? navTexts.pubgTitle : TranslationService.translate('services.pubg.title'), 
      path: '/pubg-hacks', 
      icon: Shield 
    },
    { 
      name: currentLang === 'ar' ? navTexts.webTitle : TranslationService.translate('services.web.title'), 
      path: '/web-development', 
      icon: Code 
    },
    { 
      name: currentLang === 'ar' ? navTexts.discordTitle : TranslationService.translate('services.discord.title'), 
      path: '/discord-bots', 
      icon: Bot 
    },
    { 
      name: currentLang === 'ar' ? navTexts.officialTitle : TranslationService.translate('nav.official'), 
      path: '/official', 
      icon: Users 
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              DARK
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 rtl:space-x-reverse ${
                    location.pathname === item.path ? 'text-blue-400' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Language Switch & Admin Login */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitch />
            
            <Link
              to="/admin/login"
              className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
            >
              <User className="w-4 h-4" />
              <span>{currentLang === 'ar' ? navTexts.adminTitle : TranslationService.translate('nav.admin')}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
