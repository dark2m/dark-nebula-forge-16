
import React, { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import TranslationService from '../utils/translationService';

const LanguageSelector = () => {
  const [currentLanguage, setCurrentLanguage] = useState(TranslationService.getCurrentLanguage());
  const [isOpen, setIsOpen] = useState(false);
  const languages = TranslationService.getSupportedLanguages();

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent) => {
      setCurrentLanguage(event.detail.language);
    };

    window.addEventListener('languageChanged', handleLanguageChange as EventListener);
    
    return () => {
      window.removeEventListener('languageChanged', handleLanguageChange as EventListener);
    };
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    TranslationService.setLanguage(languageCode);
    setCurrentLanguage(languageCode);
    setIsOpen(false);
    
    // إعادة تحميل الصفحة لتطبيق الترجمة على جميع المكونات
    window.location.reload();
  };

  const currentLanguageData = languages.find(lang => lang.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg border border-white/20 backdrop-blur-sm"
      >
        <Globe className="w-5 h-5" />
        <span className="text-lg">{currentLanguageData?.flag}</span>
        <span className="text-sm font-medium hidden sm:block">{currentLanguageData?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 bg-gray-900/95 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden z-50 min-w-[200px] shadow-2xl">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-left rtl:text-right transition-all duration-200 ${
                currentLanguage === language.code
                  ? 'bg-blue-500/30 text-blue-300 border-l-4 border-blue-400'
                  : 'text-white hover:bg-white/10 hover:text-blue-300'
              }`}
            >
              <span className="text-xl">{language.flag}</span>
              <span className="text-sm font-medium flex-1">{language.name}</span>
              {currentLanguage === language.code && (
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Background overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
