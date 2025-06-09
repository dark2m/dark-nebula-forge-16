
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Code, Bot, User, Users, MessageCircle } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'هكر ببجي موبايل', path: '/pubg-hacks', icon: Shield },
    { name: 'برمجة مواقع', path: '/web-development', icon: Code },
    { name: 'برمجة بوتات ديسكورد', path: '/discord-bots', icon: Bot },
    { name: 'من نحن', path: '/about', icon: Users },
    { name: 'تواصل معنا', path: '/contact', icon: MessageCircle },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-white">
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
            <span>الإدارة</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
