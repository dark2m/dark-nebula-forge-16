
import React, { useState, useEffect } from 'react';
import { Eye, Monitor, Smartphone, Tablet, Refresh } from 'lucide-react';
import { SiteSettings } from '../../types/admin';

interface LivePreviewTabProps {
  siteSettings: SiteSettings;
}

const LivePreviewTab: React.FC<LivePreviewTabProps> = ({ siteSettings }) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshPreview = () => {
    setRefreshKey(prev => prev + 1);
  };

  const getPreviewStyles = () => {
    switch (previewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '800px' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">معاينة مباشرة</h2>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={refreshPreview}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Refresh className="w-4 h-4" />
            <span>تحديث</span>
          </button>
          
          <div className="flex border border-white/20 rounded-lg overflow-hidden">
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-2 ${previewMode === 'desktop' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('tablet')}
              className={`p-2 ${previewMode === 'tablet' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-2 ${previewMode === 'mobile' ? 'bg-blue-500 text-white' : 'bg-white/10 text-gray-300'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="admin-card rounded-xl p-6">
        <div className="flex justify-center">
          <div
            className="border border-white/20 rounded-lg overflow-hidden bg-white"
            style={getPreviewStyles()}
          >
            <iframe
              key={refreshKey}
              src={window.location.origin}
              className="w-full h-full border-0"
              title="Live Preview"
            />
          </div>
        </div>
      </div>

      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">إعدادات المعاينة الحالية</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">عنوان الموقع</h4>
            <p className="text-white">{siteSettings.title}</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2">اللون الأساسي</h4>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <div 
                className="w-6 h-6 rounded"
                style={{ backgroundColor: siteSettings.colors.primary }}
              />
              <span className="text-white">{siteSettings.colors.primary}</span>
            </div>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">عدد النجوم</h4>
            <p className="text-white">{siteSettings.backgroundSettings.starCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreviewTab;
