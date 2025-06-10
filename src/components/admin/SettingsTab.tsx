
import React, { useState, useEffect } from 'react';
import { Save, Settings, Palette, Type, Globe } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } from '@/hooks/use-toast';

const SettingsTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSettings, setOriginalSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    const loadedSettings = AdminStorage.getSiteSettings();
    setSettings(loadedSettings);
    setOriginalSettings(loadedSettings);
  }, []);

  useEffect(() => {
    // تحقق من وجود تغييرات
    const changed = JSON.stringify(settings) !== JSON.stringify(originalSettings);
    setHasChanges(changed);
  }, [settings, originalSettings]);

  const saveSettings = () => {
    AdminStorage.saveSiteSettings(settings);
    setOriginalSettings(settings);
    setHasChanges(false);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  const resetSettings = () => {
    setSettings(originalSettings);
    setHasChanges(false);
    toast({
      title: "تم إلغاء التغييرات",
      description: "تم إرجاع الإعدادات إلى آخر حفظ"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">الإعدادات العامة</h2>
        {hasChanges && (
          <div className="flex gap-2">
            <button
              onClick={resetSettings}
              className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-500/20 transition-colors"
            >
              إلغاء التغييرات
            </button>
            <button
              onClick={saveSettings}
              className="glow-button flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              حفظ الإعدادات
            </button>
          </div>
        )}
      </div>
      
      {/* Site Information */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          معلومات الموقع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان الموقع</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => setSettings({...settings, title: e.target.value})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">حجم العنوان</label>
            <select
              value={settings.titleSize}
              onChange={(e) => setSettings({...settings, titleSize: e.target.value as 'small' | 'medium' | 'large' | 'xl'})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
              <option value="xl">كبير جداً</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-sm mb-2">وصف الموقع</label>
            <textarea
              value={settings.description}
              onChange={(e) => setSettings({...settings, description: e.target.value})}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Colors */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          ألوان الموقع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">اللون الأساسي</label>
            <input
              type="color"
              value={settings.colors.primary}
              onChange={(e) => setSettings({
                ...settings,
                colors: { ...settings.colors, primary: e.target.value }
              })}
              className="w-full h-12 rounded border border-white/20"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">اللون الثانوي</label>
            <input
              type="color"
              value={settings.colors.secondary}
              onChange={(e) => setSettings({
                ...settings,
                colors: { ...settings.colors, secondary: e.target.value }
              })}
              className="w-full h-12 rounded border border-white/20"
            />
          </div>
          <div>
            <label className="block text-gray-400 text-sm mb-2">لون التمييز</label>
            <input
              type="color"
              value={settings.colors.accent}
              onChange={(e) => setSettings({
                ...settings,
                colors: { ...settings.colors, accent: e.target.value }
              })}
              className="w-full h-12 rounded border border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          إعدادات النصوص
        </h3>
        <div>
          <label className="block text-gray-400 text-sm mb-2">حجم النص العام</label>
          <select
            value={settings.globalTextSize}
            onChange={(e) => setSettings({...settings, globalTextSize: e.target.value as 'small' | 'medium' | 'large'})}
            className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
          >
            <option value="small">صغير</option>
            <option value="medium">متوسط</option>
            <option value="large">كبير</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-center bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="text-center">
            <p className="text-blue-400 mb-3">يوجد تغييرات غير محفوظة</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={resetSettings}
                className="px-4 py-2 border border-gray-500 text-gray-300 rounded hover:bg-gray-500/20 transition-colors"
              >
                إلغاء التغييرات
              </button>
              <button
                onClick={saveSettings}
                className="glow-button flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                حفظ الإعدادات
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsTab;
