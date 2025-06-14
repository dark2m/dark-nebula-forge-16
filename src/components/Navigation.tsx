import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SettingsService } from '../utils/settingsService';
import { useCart } from '../hooks/useCart';
import type { SiteSettings } from '../types/admin';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const location = useLocation();
  const { getCartCount } = useCart();

  useEffect(() => {
    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });
    return unsubscribe;
  }, []);

  const cartCount = getCartCount();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold text-white">
            {siteSettings.title}
          </Link>

          <div className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
            {siteSettings.navigation.filter(item => item.visible).map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`text-gray-300 hover:text-white transition-colors ${
                  location.pathname === item.path ? 'text-white' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            {cartCount > 0 && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-300 hover:text-white" />
                <Badge className="absolute -top-2 -right-2 bg-red-500">
                  {cartCount}
                </Badge>
              </Link>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-2">
              {siteSettings.navigation.filter(item => item.visible).map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className="text-gray-300 hover:text-white transition-colors py-2"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
