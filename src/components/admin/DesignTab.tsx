
import React, { useState, useEffect } from 'react';
import { Palette, Save, RotateCcw, Sparkles } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

const DesignTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    setSettings(AdminStorage.getSiteSettings());
  }, []);

  const updateDesign = (updates: Partial<SiteSettings['design']>) => {
    setSettings({
      ...settings,
      design: {
        ...settings.design,
        ...updates
      }
    });
  };

  const updateColors = (updates: Partial<SiteSettings['colors']>) => {
    setSettings({
      ...settings,
      colors: {
        ...settings.colors,
        ...updates
      }
    });
  };

  const saveSettings = () => {
    AdminStorage.saveSiteSettings(settings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات التصميم بنجاح"
    });
  };

  const resetToDefault = () => {
    const defaultDesign = {
      borderRadius: 'medium' as const,
      shadows: 'medium' as const,
      spacing: 'normal' as const,
      animations: true
    };
    const defaultColors = {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#06b6d4'
    };
    updateDesign(defaultDesign);
    updateColors(defaultColors);
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين إعدادات التصميم للوضع الافتراضي"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">تخصيص التصميم</h2>
        <div className="flex gap-3">
          <button
            onClick={resetToDefault}
            className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>
          <button
            onClick={saveSettings}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التغييرات</span>
          </button>
        </div>
      </div>

      {/* Color Scheme */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          نظام الألوان
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">اللون الأساسي</label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="color"
                value={settings.colors.primary}
                onChange={(e) => updateColors({ primary: e.target.value })}
                className="w-12 h-12 rounded border border-white/20"
              />
              <input
                type="text"
                value={settings.colors.primary}
                onChange={(e) => updateColors({ primary: e.target.value })}
                className="flex-1 bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">اللون الثانوي</label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="color"
                value={settings.colors.secondary}
                onChange={(e) => updateColors({ secondary: e.target.value })}
                className="w-12 h-12 rounded border border-white/20"
              />
              <input
                type="text"
                value={settings.colors.secondary}
                onChange={(e) => updateColors({ secondary: e.target.value })}
                className="flex-1 bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">لون التمييز</label>
            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <input
                type="color"
                value={settings.colors.accent}
                onChange={(e) => updateColors({ accent: e.target.value })}
                className="w-12 h-12 rounded border border-white/20"
              />
              <input
                type="text"
                value={settings.colors.accent}
                onChange={(e) => updateColors({ accent: e.target.value })}
                className="flex-1 bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Design Elements */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          عناصر التصميم
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">انحناء الحواف</label>
            <select
              value={settings.design.borderRadius}
              onChange={(e) => updateDesign({ borderRadius: e.target.value as 'none' | 'small' | 'medium' | 'large' })}
              className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="none" className="bg-gray-800 text-white">بدون انحناء</option>
              <option value="small" className="bg-gray-800 text-white">انحناء صغير</option>
              <option value="medium" className="bg-gray-800 text-white">انحناء متوسط</option>
              <option value="large" className="bg-gray-800 text-white">انحناء كبير</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">الظلال</label>
            <select
              value={settings.design.shadows}
              onChange={(e) => updateDesign({ shadows: e.target.value as 'none' | 'small' | 'medium' | 'large' })}
              className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="none" className="bg-gray-800 text-white">بدون ظلال</option>
              <option value="small" className="bg-gray-800 text-white">ظلال صغيرة</option>
              <option value="medium" className="bg-gray-800 text-white">ظلال متوسطة</option>
              <option value="large" className="bg-gray-800 text-white">ظلال كبيرة</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">التباعد</label>
            <select
              value={settings.design.spacing}
              onChange={(e) => updateDesign({ spacing: e.target.value as 'compact' | 'normal' | 'relaxed' })}
              className="w-full bg-gray-800 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="compact" className="bg-gray-800 text-white">ضيق</option>
              <option value="normal" className="bg-gray-800 text-white">عادي</option>
              <option value="relaxed" className="bg-gray-800 text-white">واسع</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">الحركات والتأثيرات</label>
            <label className="flex items-center space-x-2 rtl:space-x-reverse">
              <input
                type="checkbox"
                checked={settings.design.animations}
                onChange={(e) => updateDesign({ animations: e.target.checked })}
                className="rounded bg-white/10 border-white/20"
              />
              <span className="text-white">تفعيل الحركات والتأثيرات</span>
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">معاينة التصميم</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            className="p-4 bg-gradient-to-r border"
            style={{
              background: `linear-gradient(45deg, ${settings.colors.primary}, ${settings.colors.secondary})`,
              borderRadius: settings.design.borderRadius === 'none' ? '0' : 
                          settings.design.borderRadius === 'small' ? '4px' :
                          settings.design.borderRadius === 'medium' ? '8px' : '16px',
              boxShadow: settings.design.shadows === 'none' ? 'none' :
                        settings.design.shadows === 'small' ? '0 1px 3px rgba(0,0,0,0.12)' :
                        settings.design.shadows === 'medium' ? '0 4px 6px rgba(0,0,0,0.12)' : '0 10px 15px rgba(0,0,0,0.12)'
            }}
          >
            <h4 className="text-white font-bold mb-2">عنصر تصميم</h4>
            <p className="text-white/80 text-sm">هذا مثال على التصميم الحالي</p>
          </div>

          <div 
            className="p-4 border"
            style={{
              backgroundColor: settings.colors.accent + '20',
              borderColor: settings.colors.accent + '40',
              borderRadius: settings.design.borderRadius === 'none' ? '0' : 
                          settings.design.borderRadius === 'small' ? '4px' :
                          settings.design.borderRadius === 'medium' ? '8px' : '16px'
            }}
          >
            <h4 className="text-white font-bold mb-2">لون التمييز</h4>
            <p className="text-gray-300 text-sm">عنصر بلون التمييز</p>
          </div>

          <div className="p-4 bg-white/10 rounded border border-white/20">
            <h4 className="text-white font-bold mb-2">الإعدادات الحالية</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>الانحناء: {settings.design.borderRadius}</div>
              <div>الظلال: {settings.design.shadows}</div>
              <div>التباعد: {settings.design.spacing}</div>
              <div>الحركات: {settings.design.animations ? 'مفعلة' : 'معطلة'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignTab;
