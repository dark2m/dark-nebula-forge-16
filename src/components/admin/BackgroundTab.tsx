
import React from 'react';
import { Star, Zap, RotateCcw, Palette, Eye, X } from 'lucide-react';
import { SiteSettings } from '../../utils/adminStorage';

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
  const updateBackgroundSettings = (updates: Partial<SiteSettings['backgroundSettings']>) => {
    setSiteSettings({
      ...siteSettings,
      backgroundSettings: {
        ...siteSettings.backgroundSettings,
        ...updates
      }
    });
  };

  const resetToDefault = () => {
    setSiteSettings({
      ...siteSettings,
      backgroundSettings: {
        type: 'color',
        value: '#000000',
        starCount: 100,
        meteorCount: 15,
        animationSpeed: 'normal',
        starOpacity: 0.8,
        meteorOpacity: 0.6,
        starSize: 'medium',
        meteorSize: 'medium'
      }
    });
  };

  const removeStars = () => {
    updateBackgroundSettings({ starCount: 0 });
  };

  const removeMeteors = () => {
    updateBackgroundSettings({ meteorCount: 0 });
  };

  const backgroundSettings = {
    starCount: 100,
    meteorCount: 15,
    animationSpeed: 'normal',
    starOpacity: 0.8,
    meteorOpacity: 0.6,
    starSize: 'medium',
    meteorSize: 'medium',
    ...siteSettings.backgroundSettings
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">تخصيص الخلفية</h2>
        <div className="flex gap-3">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>
          <button
            onClick={saveSiteSettings}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>
      
      <div className="admin-card rounded-xl p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Basic Background Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Palette className="w-5 h-5 mr-2" />
              إعدادات الخلفية الأساسية
            </h3>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">نوع الخلفية</label>
              <select
                value={siteSettings.backgroundSettings.type}
                onChange={(e) => updateBackgroundSettings({ type: e.target.value as 'color' | 'image' })}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="color">لون</option>
                <option value="image">صورة</option>
              </select>
            </div>

            {siteSettings.backgroundSettings.type === 'color' ? (
              <div>
                <label className="block text-gray-400 text-sm mb-2">لون الخلفية</label>
                <input
                  type="color"
                  value={siteSettings.backgroundSettings.value}
                  onChange={(e) => updateBackgroundSettings({ value: e.target.value })}
                  className="w-full h-12 rounded border border-white/20"
                />
              </div>
            ) : (
              <div>
                <label className="block text-gray-400 text-sm mb-2">صورة الخلفية</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        updateBackgroundSettings({ value: event.target?.result as string });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                />
              </div>
            )}
          </div>

          {/* Stars Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Star className="w-5 h-5 mr-2" />
                إعدادات النجوم
              </h3>
              <button
                onClick={removeStars}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>إزالة النجوم</span>
              </button>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                عدد النجوم: {backgroundSettings.starCount}
              </label>
              <input
                type="range"
                min="0"
                max="300"
                value={backgroundSettings.starCount}
                onChange={(e) => updateBackgroundSettings({ starCount: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                شفافية النجوم: {(backgroundSettings.starOpacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundSettings.starOpacity}
                onChange={(e) => updateBackgroundSettings({ starOpacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">حجم النجوم</label>
              <select
                value={backgroundSettings.starSize}
                onChange={(e) => updateBackgroundSettings({ starSize: e.target.value as 'small' | 'medium' | 'large' })}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="small">صغير</option>
                <option value="medium">متوسط</option>
                <option value="large">كبير</option>
              </select>
            </div>
          </div>

          {/* Meteors Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                إعدادات الشهب
              </h3>
              <button
                onClick={removeMeteors}
                className="flex items-center space-x-2 rtl:space-x-reverse px-3 py-1 bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                <span>إزالة الشهب</span>
              </button>
            </div>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                عدد الشهب: {backgroundSettings.meteorCount}
              </label>
              <input
                type="range"
                min="0"
                max="50"
                value={backgroundSettings.meteorCount}
                onChange={(e) => updateBackgroundSettings({ meteorCount: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                شفافية الشهب: {(backgroundSettings.meteorOpacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={backgroundSettings.meteorOpacity}
                onChange={(e) => updateBackgroundSettings({ meteorOpacity: Number(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">حجم الشهب</label>
              <select
                value={backgroundSettings.meteorSize}
                onChange={(e) => updateBackgroundSettings({ meteorSize: e.target.value as 'small' | 'medium' | 'large' })}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="small">صغير</option>
                <option value="medium">متوسط</option>
                <option value="large">كبير</option>
              </select>
            </div>
          </div>

          {/* Animation Settings */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              إعدادات الحركة
            </h3>
            
            <div>
              <label className="block text-gray-400 text-sm mb-2">سرعة الحركة</label>
              <select
                value={backgroundSettings.animationSpeed}
                onChange={(e) => updateBackgroundSettings({ animationSpeed: e.target.value as 'slow' | 'normal' | 'fast' })}
                className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              >
                <option value="slow">بطيئة</option>
                <option value="normal">عادية</option>
                <option value="fast">سريعة</option>
              </select>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                <strong>ملاحظة:</strong> التغييرات ستظهر بعد حفظ الإعدادات وإعادة تحميل الصفحة
              </p>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-8 p-6 bg-black/50 rounded-lg border border-white/20">
          <h3 className="text-lg font-bold text-white mb-4">معاينة سريعة</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-sm text-gray-300">
            <div>
              <div className="text-blue-400 font-bold">النجوم</div>
              <div>{backgroundSettings.starCount} نجمة</div>
              <div>{(backgroundSettings.starOpacity * 100).toFixed(0)}% شفافية</div>
            </div>
            <div>
              <div className="text-yellow-400 font-bold">الشهب</div>
              <div>{backgroundSettings.meteorCount} شهاب</div>
              <div>{(backgroundSettings.meteorOpacity * 100).toFixed(0)}% شفافية</div>
            </div>
            <div>
              <div className="text-green-400 font-bold">الحركة</div>
              <div>السرعة: {backgroundSettings.animationSpeed}</div>
              <div>النوع: {siteSettings.backgroundSettings.type}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackgroundTab;
