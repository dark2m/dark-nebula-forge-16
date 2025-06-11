
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Code, Bot, User, Users } from 'lucide-react';
import AdminStorage from '../utils/adminStorage';

const Navigation = () => {
  const location = useLocation();
  const [siteSettings, setSiteSettings] = useState(AdminStorage.getSiteSettings());
  
  useEffect(() => {
    setSiteSettings(AdminStorage.getSiteSettings());
  }, []);

  const navTexts = siteSettings.pageTexts.navigation;
  
  const navItems = [
    { name: navTexts.pubgTitle, path: '/pubg-hacks', icon: Shield },
    { name: navTexts.webTitle, path: '/web-development', icon: Code },
    { name: navTexts.discordTitle, path: '/discord-bots', icon: Bot },
    { name: navTexts.officialTitle, path: '/official', icon: Users },
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

          {/* Admin Login */}
          <Link
            to="/admin/login"
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <User className="w-4 h-4" />
            <span>{navTexts.adminTitle}</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
