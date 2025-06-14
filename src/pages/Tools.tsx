
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import SettingsService from '../utils/settingsService';
import type { SiteSettings, Tool } from '../types/admin';

const Tools = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({} as SiteSettings);
  const [loading, setLoading] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

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

  // إخفاء شريط المهام عند عرض أداة مخصصة
  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (selectedTool && selectedTool.customHtml) {
      if (navbar) {
        navbar.style.display = 'none';
      }
    } else {
      if (navbar) {
        navbar.style.display = 'block';
      }
    }

    // تنظيف عند إلغاء التحميل
    return () => {
      if (navbar) {
        navbar.style.display = 'block';
      }
    };
  }, [selectedTool]);

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
    // إذا كانت الأداة تحتوي على كود مخصص، عرضه
    if (tool.customHtml && tool.customHtml.trim()) {
      setSelectedTool(tool);
      return;
    }

    // إذا كان هناك رابط، انتقل إليه
    if (tool.url) {
      if (tool.url.startsWith('/')) {
        // رابط داخلي - استخدام router navigation
        window.location.href = tool.url;
      } else {
        // رابط خارجي
        window.open(tool.url, '_blank');
      }
    }
  };

  const closeCustomTool = () => {
    setSelectedTool(null);
  };

  // إذا تم اختيار أداة مخصصة، عرض كودها
  if (selectedTool && selectedTool.customHtml) {
    return (
      <div className="min-h-screen relative">
        <StarryBackground />
        
        <div className="relative z-10">
          {/* زر العودة الجميل مع الأنيميشن */}
          <div className="fixed top-6 right-6 z-50">
            <button
              onClick={closeCustomTool}
              className="group relative overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-1 rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-3 group-hover:bg-black/60 transition-all duration-300">
                <ArrowLeft className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform duration-300" />
                <span className="text-white font-medium group-hover:text-gray-100 transition-colors duration-300">
                  العودة للأدوات
                </span>
              </div>
              {/* تأثير الوميض */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
          </div>

          {/* عرض الكود المخصص */}
          <div className="w-full h-screen">
            <iframe
              srcDoc={selectedTool.customHtml}
              className="w-full h-full border-none"
              title={selectedTool.title}
              sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin"
            />
          </div>
        </div>
      </div>
    );
  }

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
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 hover:bg-white/20 hover:border-white/40 transition-all duration-300 cursor-pointer transform hover:scale-105"
                  onClick={() => handleToolClick(tool)}
                >
                  <div className="text-center mb-4">
                    <div className="text-4xl mb-3">{tool.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{tool.title}</h3>
                    <p className="text-gray-300 mb-4">{tool.description}</p>
                    {tool.customHtml && tool.customHtml.trim() && (
                      <div className="mb-3">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-blue-400 text-sm">
                          <span>🔧</span>
                          أداة مخصصة
                        </span>
                      </div>
                    )}
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
