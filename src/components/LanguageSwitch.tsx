
import React, { useState, useEffect } from 'react';
import { Languages, Globe2 } from 'lucide-react';
import TranslationService from '../utils/translationService';

const LanguageSwitch: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(
    TranslationService.getCurrentLanguage()
  );
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const toggleLanguage = () => {
    setIsAnimating(true);
    TranslationService.toggleLanguage();
    
    // إيقاف الانيميشن بعد ثانية
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`
        relative group overflow-hidden
        bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500
        hover:from-purple-500 hover:via-blue-500 hover:to-cyan-400
        text-white font-bold py-3 px-6 rounded-2xl
        transform transition-all duration-300 ease-out
        hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/30
        active:scale-95
        ${isAnimating ? 'animate-pulse scale-110' : ''}
      `}
      title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
    >
      {/* Background Animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Sparkle Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1 left-2 w-1 h-1 bg-white rounded-full opacity-60 animate-ping"></div>
        <div className="absolute top-3 right-3 w-1 h-1 bg-white rounded-full opacity-40 animate-ping" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-2 left-1/2 w-0.5 h-0.5 bg-white rounded-full opacity-80 animate-ping" style={{ animationDelay: '1s' }}></div>
      </div>
      
      {/* Content */}
      <div className="relative flex items-center gap-3 z-10">
        <div className={`transition-transform duration-300 ${isAnimating ? 'rotate-180' : ''}`}>
          {currentLang === 'ar' ? (
            <Globe2 className="w-5 h-5" />
          ) : (
            <Languages className="w-5 h-5" />
          )}
        </div>
        
        <span className="text-sm font-bold tracking-wide">
          {TranslationService.translate('nav.language')}
        </span>
        
        {/* Animated indicator */}
        <div className={`
          w-2 h-2 rounded-full 
          ${currentLang === 'ar' ? 'bg-green-300' : 'bg-orange-300'}
          animate-pulse
        `}></div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>
    </button>
  );
};

export default LanguageSwitch;
