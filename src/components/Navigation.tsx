
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Code, Bot, User, Users, Home, Menu, X, Wrench, MessageCircle } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import AdminStorage from '../utils/adminStorage';
import { getTextContent } from '../utils/textUtils';

const Navigation = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  useEffect(() => {
    // تحميل الإعدادات عند التحميل
    setSiteSettings(AdminStorage.getSiteSettings());

    // الاستماع لتحديثات الإعدادات
    const handleSettingsUpdate = (event: CustomEvent) => {
      console.log('Navigation: Settings updated via event:', event.detail.settings);
      setSiteSettings(event.detail.settings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  // إنشاء قائمة التنقل من إعدادات الموقع
  const getNavigationItems = () => {
    if (!siteSettings.navigation || siteSettings.navigation.length === 0) {
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
      'Support': MessageCircle
    };

    return siteSettings.navigation
      .filter(item => item.visible !== false)
      .map(item => ({
        name: item.name,
        path: item.path,
        icon: iconMap[item.icon] || Home
      }));
  };

  const navItems = getNavigationItems();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
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

          {/* Mobile Menu Button & Admin Login */}
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
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
              <span>الإدارة</span>
            </Link>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (isMobile || window.innerWidth <= 1024) && (
          <div className="md:hidden mt-4 bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <div className="space-y-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
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
