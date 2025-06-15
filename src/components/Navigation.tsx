import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Code, Bot, User, Users, Home, Menu, X, Wrench, MessageCircle } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import AdminStorage from '../utils/adminStorage';
import SettingsService from '../utils/settingsService';
import TranslationService from '../utils/translationService';
import LanguageSelector from './LanguageSelector';
import { getTextContent } from '../utils/textUtils';

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [siteSettings, setSiteSettings] = useState(SettingsService.getSiteSettings());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navigationKey, setNavigationKey] = useState(0);
  
  useEffect(() => {
    // تحميل الإعدادات عند التحميل
    const loadSettings = () => {
      const settings = SettingsService.getSiteSettings();
      console.log('Navigation: Loading fresh settings:', settings);
      setSiteSettings(settings);
    };

    loadSettings();

    // الاستماع لتحديثات الإعدادات
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('Navigation: Settings updated via event:', event.detail.settings);
      setSiteSettings(event.detail.settings);
      setNavigationKey(prev => prev + 1);
    };

    // الاستماع لتحديثات التنقل المحددة
    const handleNavigationUpdate = (event: CustomEvent) => {
      console.log('Navigation: Navigation updated via event:', event.detail.navigation);
      const currentSettings = SettingsService.getSiteSettings();
      setSiteSettings(currentSettings);
      setNavigationKey(prev => prev + 1);
    };

    // الاستماع لتغيير اللغة
    const handleLanguageChange = () => {
      setNavigationKey(prev => prev + 1);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    window.addEventListener('navigationUpdated', handleNavigationUpdate as EventListener);
    window.addEventListener('languageChanged', handleLanguageChange);
    
    // تحديث دوري للتأكد من عدم فقدان التغييرات
    const intervalUpdate = setInterval(() => {
      const freshSettings = SettingsService.getSiteSettings();
      if (JSON.stringify(freshSettings.navigation) !== JSON.stringify(siteSettings.navigation)) {
        console.log('Navigation: Detected navigation changes via interval update');
        setSiteSettings(freshSettings);
        setNavigationKey(prev => prev + 1);
      }
    }, 2000);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
      window.removeEventListener('navigationUpdated', handleNavigationUpdate as EventListener);
      window.removeEventListener('languageChanged', handleLanguageChange);
      clearInterval(intervalUpdate);
    };
  }, [siteSettings.navigation]);

  // إنشاء قائمة التنقل من إعدادات الموقع
  const getNavigationItems = () => {
    if (!siteSettings.navigation || siteSettings.navigation.length === 0) {
      console.log('Navigation: No navigation items found in settings');
      return [];
    }

    const iconMap: { [key: string]: React.ComponentType } = {
      'Users': Users,
      'Shield': Shield,
      'Code': Code,
      'Bot': Bot,
      'User': User,
      'Home': Home,
      'Menu': Home,
      'Wrench': Wrench,
      'Tools': Wrench,
      'Support': MessageCircle,
      'MessageCircle': MessageCircle,
      'MessageSquare': MessageCircle,
      'Phone': MessageCircle,
      'Mail': MessageCircle,
      'Send': MessageCircle,
      'Gamepad2': Shield,
      'Target': Shield,
      'Globe': Code,
      'Server': Code,
      'Database': Code
    };

    const items = siteSettings.navigation
      .filter(item => item.visible !== false)
      .map(item => ({
        name: TranslationService.translate(`nav.${item.name.toLowerCase().replace(/\s+/g, '_')}`),
        path: item.path,
        icon: iconMap[item.icon] || Home,
        id: item.id
      }));

    console.log('Navigation: Generated navigation items:', items);
    return items;
  };

  const navItems = getNavigationItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" key={navigationKey}>
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              {siteSettings.title || 'DARK'}
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.id || item.path}-${index}-${navigationKey}`}
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

          {/* Right side controls */}
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* Language Selector - positioned better */}
            <LanguageSelector />

            {/* Mobile Hamburger Menu */}
            {(isMobile || window.innerWidth <= 1024) && (
              <button
                onClick={toggleMenu}
                className="md:hidden p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}

            {/* Admin Login */}
            <Link
              to="/admin/login"
              className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{TranslationService.translate('nav.admin')}</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (isMobile || window.innerWidth <= 1024) && (
          <div className="md:hidden mt-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="space-y-3">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={`mobile-${item.id || item.path}-${index}-${navigationKey}`}
                    to={item.path}
                    onClick={closeMenu}
                    className={`flex items-center space-x-3 rtl:space-x-reverse p-3 rounded-lg transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
