
import React, { useState, useEffect } from 'react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
import type { SiteSettings, Tool } from '../types/admin';

const Tools = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const settings = SettingsService.getSiteSettings();
      setSiteSettings(settings);
      setLoading(false);
    };

    loadSettings();

    // الاستماع لتحديثات الإعدادات
    const handleSettingsUpdate = (event: CustomEvent) => {
      setSiteSettings(event.detail.settings);
    };

    window.addEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('settingsUpdated', handleSettingsUpdate as EventListener);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <StarryBackground />
        <div className="text-white">جاري التحميل...</div>
      </div>
    );
  }

  const tools = siteSettings.tools?.filter(tool => tool.visible) || [];
  const pageTexts = siteSettings.pageTexts?.tools || {
    pageTitle: 'أدوات الموقع',
    pageSubtitle: 'مجموعة من الأدوات المفيدة للموقع'
  };

  const handleToolClick = (tool: Tool) => {
    if (tool.url) {
      window.open(tool.url, '_blank');
    }
  };

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              {pageTexts.pageTitle}
            </h1>
            <p className="text-xl text-gray-300">
              {pageTexts.pageSubtitle}
            </p>
          </div>

          {tools.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold text-white mb-2">لا توجد أدوات متاحة حالياً</h3>
              <p className="text-gray-400">يتم العمل على إضافة أدوات جديدة قريباً</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tools.map((tool) => (
                <div 
                  key={tool.id}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl p-6 hover:bg-white/30 transition-all duration-300 cursor-pointer"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{tool.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                    <p className="text-gray-300 mb-4">{tool.description}</p>
                  </div>
                  <button 
                    className="glow-button w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToolClick(tool);
                    }}
                  >
                    {tool.buttonText}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tools;
