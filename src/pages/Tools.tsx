
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
import type { SiteSettings } from '../types/admin';
import GlobalCart from '../components/GlobalCart';

const Tools = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const loadedSettings = await SettingsService.getSiteSettings();
        setSettings(loadedSettings);
      } catch (error) {
        console.error('Tools: Error loading settings:', error);
      }
    };

    loadSettings();
  }, []);

  if (!settings) return null;

  const tools = settings.tools || [];

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <GlobalCart />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-6">
              {settings.pageTexts?.tools?.pageTitle || 'الأدوات'}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              {settings.pageTexts?.tools?.pageSubtitle || 'مجموعة من الأدوات المفيدة'}
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tools.filter(tool => tool.visible).map((tool) => (
              <div key={tool.id} className="group">
                <div className="relative overflow-hidden rounded-xl bg-white/10 backdrop-blur-md border border-white/20 hover:border-blue-500/50 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <div className="relative p-4 sm:p-6">
                    <div className="flex items-center mb-4">
                      <div className="text-2xl mr-3">{tool.icon}</div>
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        {tool.title}
                      </h3>
                    </div>
                    
                    <p className="text-gray-300 mb-4 text-sm sm:text-base">
                      {tool.description}
                    </p>

                    {tool.customHtml ? (
                      <div 
                        className="custom-tool-content"
                        dangerouslySetInnerHTML={{ __html: tool.customHtml }}
                      />
                    ) : (
                      <div className="flex justify-center">
                        {tool.url.startsWith('/') ? (
                          <Link
                            to={tool.url}
                            className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm"
                          >
                            <span>{tool.buttonText}</span>
                          </Link>
                        ) : (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="glow-button flex items-center space-x-2 rtl:space-x-reverse text-xs sm:text-sm"
                          >
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{tool.buttonText}</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {tools.filter(tool => tool.visible).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg sm:text-xl">
                لا توجد أدوات متاحة حالياً
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
