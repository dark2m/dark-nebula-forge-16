import React, { useState, useEffect } from 'react';
import { Type, Save, RotateCcw } from 'lucide-react';
import { SettingsService } from '../../utils/settingsService';
import { SiteSettings } from '../../types/admin';
import { useToast } from '@/hooks/use-toast';

const TypographyTab = () => {
  const [settings, setSettings] = useState<SiteSettings>(SettingsService.getSiteSettings());
  const { toast } = useToast();

  useEffect(() => {
    const loadedSettings = SettingsService.getSiteSettings();
    console.log('TypographyTab: Loading settings:', loadedSettings);
    setSettings(loadedSettings);

    const unsubscribe = SettingsService.subscribe((newSettings) => {
      console.log('TypographyTab: Settings updated via event:', newSettings);
      setSettings(newSettings);
    });
    
    return unsubscribe;
  }, []);

  const updateTypography = (updates: Partial<SiteSettings['typography']>) => {
    setSettings({
      ...settings,
      typography: {
        ...settings.typography,
        ...updates
      }
    });
  };

  const updateGlobalTextSize = (size: 'small' | 'medium' | 'large') => {
    setSettings({
      ...settings,
      globalTextSize: size
    });
  };

  const updateTitleSize = (size: 'small' | 'medium' | 'large' | 'xl') => {
    setSettings({
      ...settings,
      titleSize: size
    });
  };

  const updateHomePage = (updates: Partial<SiteSettings['homePage']>) => {
    setSettings({
      ...settings,
      homePage: {
        ...settings.homePage,
        ...updates
      }
    });
  };

  const saveSettings = async () => {
    try {
      console.log('TypographyTab: Saving settings:', settings);
      await SettingsService.updateSiteSettings(settings);
      toast({
        title: "تم حفظ الإعدادات",
        description: "تم حفظ إعدادات النصوص بنجاح"
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
  };

  const resetToDefault = () => {
    const defaultTypography = {
      fontFamily: 'system',
      headingWeight: 'bold' as const,
      bodyWeight: 'normal' as const,
      lineHeight: 'normal' as const
    };
    updateTypography(defaultTypography);
    updateGlobalTextSize('medium');
    updateTitleSize('xl');
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين إعدادات النصوص للوضع الافتراضي"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">التحكم في النصوص</h2>
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

      {/* Global Typography Settings */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Type className="w-5 h-5" />
          الإعدادات العامة للنصوص
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">نوع الخط</label>
            <select
              value={settings.typography.fontFamily}
              onChange={(e) => updateTypography({ fontFamily: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="system">خط النظام</option>
              <option value="arabic">خط عربي</option>
              <option value="modern">خط حديث</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">سُمك العناوين</label>
            <select
              value={settings.typography.headingWeight}
              onChange={(e) => updateTypography({ headingWeight: e.target.value as 'normal' | 'bold' | 'black' })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="normal">عادي</option>
              <option value="bold">سميك</option>
              <option value="black">سميك جداً</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">سُمك النص العادي</label>
            <select
              value={settings.typography.bodyWeight}
              onChange={(e) => updateTypography({ bodyWeight: e.target.value as 'normal' | 'medium' | 'semibold' })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="normal">عادي</option>
              <option value="medium">متوسط</option>
              <option value="semibold">نصف سميك</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">تباعد الأسطر</label>
            <select
              value={settings.typography.lineHeight}
              onChange={(e) => updateTypography({ lineHeight: e.target.value as 'tight' | 'normal' | 'relaxed' })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="tight">ضيق</option>
              <option value="normal">عادي</option>
              <option value="relaxed">واسع</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">حجم النص العام</label>
            <select
              value={settings.globalTextSize}
              onChange={(e) => updateGlobalTextSize(e.target.value as 'small' | 'medium' | 'large')}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">حجم العنوان الرئيسي</label>
            <select
              value={settings.titleSize}
              onChange={(e) => updateTitleSize(e.target.value as 'small' | 'medium' | 'large' | 'xl')}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            >
              <option value="small">صغير</option>
              <option value="medium">متوسط</option>
              <option value="large">كبير</option>
              <option value="xl">كبير جداً</option>
            </select>
          </div>
        </div>
      </div>

      {/* Homepage Content */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">محتوى الصفحة الرئيسية</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">العنوان الرئيسي</label>
            <input
              type="text"
              value={settings.homePage.heroTitle}
              onChange={(e) => updateHomePage({ heroTitle: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">العنوان الفرعي</label>
            <textarea
              value={settings.homePage.heroSubtitle}
              onChange={(e) => updateHomePage({ heroSubtitle: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 h-24 resize-none focus:outline-none focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">عنوان قسم المميزات</label>
            <input
              type="text"
              value={settings.homePage.featuresTitle}
              onChange={(e) => updateHomePage({ featuresTitle: e.target.value })}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Features Management */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">إدارة المميزات</h3>
        <div className="space-y-4">
          {settings.homePage.features.map((feature, index) => (
            <div key={feature.id} className="border border-white/10 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الأيقونة</label>
                  <input
                    type="text"
                    value={feature.icon}
                    onChange={(e) => {
                      const newFeatures = [...settings.homePage.features];
                      newFeatures[index] = { ...feature, icon: e.target.value };
                      updateHomePage({ features: newFeatures });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">العنوان</label>
                  <input
                    type="text"
                    value={feature.title}
                    onChange={(e) => {
                      const newFeatures = [...settings.homePage.features];
                      newFeatures[index] = { ...feature, title: e.target.value };
                      updateHomePage({ features: newFeatures });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-2">الوصف</label>
                  <input
                    type="text"
                    value={feature.description}
                    onChange={(e) => {
                      const newFeatures = [...settings.homePage.features];
                      newFeatures[index] = { ...feature, description: e.target.value };
                      updateHomePage({ features: newFeatures });
                    }}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-blue-400"
                  />
                </div>
                <div className="flex items-center justify-center">
                  <label className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input
                      type="checkbox"
                      checked={feature.visible}
                      onChange={(e) => {
                        const newFeatures = [...settings.homePage.features];
                        newFeatures[index] = { ...feature, visible: e.target.checked };
                        updateHomePage({ features: newFeatures });
                      }}
                      className="rounded bg-white/10 border-white/20"
                    />
                    <span className="text-gray-400 text-sm">مرئي</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypographyTab;
