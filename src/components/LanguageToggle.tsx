
import React, { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import TranslationService from '../utils/translationService';

interface LanguageToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ 
  className = '', 
  size = 'md' 
}) => {
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(
    TranslationService.getCurrentLanguage()
  );

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
    TranslationService.toggleLanguage();
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`
        flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white 
        rounded-lg transition-all duration-200 font-medium
        ${sizeClasses[size]} ${className}
      `}
      title={currentLang === 'ar' ? 'تحويل للإنجليزية' : 'Switch to Arabic'}
    >
      <Globe className={iconSizes[size]} />
      <span className="font-bold">
        {currentLang === 'ar' ? 'EN' : 'عر'}
      </span>
    </button>
  );
};

export default LanguageToggle;
