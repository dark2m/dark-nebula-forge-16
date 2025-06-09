
import React, { useState, useEffect } from 'react';
import { Save, Settings, Palette, Type, Globe } from 'lucide-react';
import AdminStorage, { SiteSettings } from '../../utils/adminStorage';
import { useToast } = from '@/hooks/use-toast';

const SettingsTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(AdminStorage.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    setSettings(AdminStorage.getSiteSettings());
  }, []);

  const saveSettings = () => {
    AdminStorage.saveSiteSettings(settings);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ إعدادات الموقع بنجاح"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">الإعدادات العامة</h2>
      
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
      <div className="flex justify-end">
        <button
          onClick={saveSettings}
          className="glow-button flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          حفظ الإعدادات
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;
