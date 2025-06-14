
import React from 'react';
import { Upload, Palette, Settings } from 'lucide-react';
import { SiteSettings } from '../../types/admin';

interface BackgroundTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const BackgroundTab: React.FC<BackgroundTabProps> = ({ 
  siteSettings, 
  setSiteSettings, 
  saveSiteSettings 
}) => {
  const handleBackgroundChange = (key: string, value: any) => {
    setSiteSettings({
      ...siteSettings,
      backgroundSettings: {
        ...siteSettings.backgroundSettings,
        [key]: value
      }
    });
  };

  const handleSave = () => {
    console.log('BackgroundTab: Saving background settings:', siteSettings.backgroundSettings);
    saveSiteSettings();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">إعدادات الخلفية</h2>
      
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          نوع الخلفية
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">نوع الخلفية</label>
            <select
              value={siteSettings.backgroundSettings?.type || 'color'}
              onChange={(e) => handleBackgroundChange('type', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="color">لون خالص</option>
              <option value="image">صورة</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              {siteSettings.backgroundSettings?.type === 'image' ? 'رابط الصورة' : 'لون الخلفية'}
            </label>
            {siteSettings.backgroundSettings?.type === 'image' ? (
              <input
                type="url"
                value={siteSettings.backgroundSettings?.value || ''}
                onChange={(e) => handleBackgroundChange('value', e.target.value)}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                placeholder="https://example.com/image.jpg"
              />
            ) : (
              <input
                type="color"
                value={siteSettings.backgroundSettings?.value || '#000000'}
                onChange={(e) => handleBackgroundChange('value', e.target.value)}
                className="w-full h-12 rounded border border-white/20"
              />
            )}
          </div>
        </div>
      </div>

      {/* Stars Settings */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          إعدادات النجوم
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">عدد النجوم</label>
            <input
              type="number"
              min="0"
              max="300"
              value={siteSettings.backgroundSettings?.starCount || 150}
              onChange={(e) => handleBackgroundChange('starCount', parseInt(e.target.value))}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">حجم النجوم</label>
            <select
              value={siteSettings.backgroundSettings?.starSize || 'medium'}
              onChange={(e) => handleBackgroundChange('starSize', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">شفافية النجوم</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={siteSettings.backgroundSettings?.starOpacity || 0.8}
              onChange={(e) => handleBackgroundChange('starOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-gray-400 text-sm">{siteSettings.backgroundSettings?.starOpacity || 0.8}</span>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">سرعة الحركة</label>
            <select
              value={siteSettings.backgroundSettings?.animationSpeed || 'normal'}
              onChange={(e) => handleBackgroundChange('animationSpeed', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="slow">بطيء</option>
              <option value="normal">عادي</option>
              <option value="fast">سريع</option>
            </select>
          </div>
        </div>
      </div>

      {/* Meteors Settings */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">إعدادات الشهب</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">عدد الشهب</label>
            <input
              type="number"
              min="0"
              max="20"
              value={siteSettings.backgroundSettings?.meteorCount || 5}
              onChange={(e) => handleBackgroundChange('meteorCount', parseInt(e.target.value))}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">حجم الشهب</label>
            <select
              value={siteSettings.backgroundSettings?.meteorSize || 'medium'}
              onChange={(e) => handleBackgroundChange('meteorSize', e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">شفافية الشهب</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={siteSettings.backgroundSettings?.meteorOpacity || 0.9}
              onChange={(e) => handleBackgroundChange('meteorOpacity', parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-gray-400 text-sm">{siteSettings.backgroundSettings?.meteorOpacity || 0.9}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full glow-button flex items-center justify-center gap-2"
      >
        <Settings className="w-4 h-4" />
        حفظ إعدادات الخلفية
      </button>
    </div>
  );
};

export default BackgroundTab;
