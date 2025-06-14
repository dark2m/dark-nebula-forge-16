
import React, { useState, useEffect } from 'react';
import { Wrench, ExternalLink } from 'lucide-react';
import { SettingsService } from '../utils/settingsService';
import type { SiteSettings } from '../types/admin';

const Tools = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());

  useEffect(() => {
    setSiteSettings(SettingsService.getSiteSettings());

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      setSiteSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  const pageTexts = siteSettings.pageTexts?.tools || {
    pageTitle: 'الأدوات',
    pageSubtitle: 'مجموعة من الأدوات المفيدة'
  };

  const tools = siteSettings.tools || [];
  const visibleTools = tools.filter(tool => tool.visible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center mb-6">
            <Wrench className="w-16 h-16 text-blue-400 mr-4" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {pageTexts.pageTitle}
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            {pageTexts.pageSubtitle}
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleTools.map((tool) => (
            <div
              key={tool.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4">
                  <Wrench className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{tool.title}</h3>
                  <span className="text-sm text-blue-400">{tool.category}</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6">{tool.description}</p>
              
              <div className="flex justify-between items-center">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors group-hover:bg-blue-400"
                >
                  {tool.buttonText}
                  <ExternalLink className="w-4 h-4 mr-2" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {visibleTools.length === 0 && (
          <div className="text-center py-16">
            <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">لا توجد أدوات متاحة حالياً</h3>
            <p className="text-gray-400">سيتم إضافة المزيد من الأدوات قريباً</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tools;
