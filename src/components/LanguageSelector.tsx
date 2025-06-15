
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
        className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{currentLanguageData?.flag}</span>
        <span className="text-sm font-medium">{currentLanguageData?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 right-0 rtl:right-auto rtl:left-0 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg overflow-hidden z-50 min-w-[160px]">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full flex items-center space-x-3 rtl:space-x-reverse px-4 py-3 text-left rtl:text-right transition-colors duration-200 ${
                currentLanguage === language.code
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span className="text-sm font-medium">{language.name}</span>
              {currentLanguage === language.code && (
                <div className="mr-auto rtl:mr-0 rtl:ml-auto w-2 h-2 bg-blue-400 rounded-full"></div>
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
