
import React, { useState, useEffect } from 'react';
import { Palette, Eye, RotateCcw, Save } from 'lucide-react';
import AdminStorage from '../../utils/adminStorage';
import type { SiteSettings } from '../../types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface DesignTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const DesignTab: React.FC<DesignTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const [previewColors, setPreviewColors] = useState(siteSettings.colors);
  const [isLoading, setIsLoading] = useState(false);

  const resetToDefaults = async () => {
    setIsLoading(true);
    try {
      const defaultSettings = await AdminStorage.getSettings();
      setSiteSettings(defaultSettings);
      setPreviewColors(defaultSettings.colors);
    } catch (error) {
      console.error('Error resetting to defaults:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyColors = () => {
    setSiteSettings({
      ...siteSettings,
      colors: previewColors
    });
  };

  const saveDesignSettings = async () => {
    try {
      await AdminStorage.saveSettings(siteSettings);
    } catch (error) {
      console.error('Error saving design settings:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">تخصيص التصميم</h2>
          <p className="text-gray-400">تغيير الألوان والأنماط البصرية للموقع</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={applyColors} className="glow-button">
            <Eye className="w-4 h-4 mr-2" />
            تطبيق الألوان
          </Button>
          <Button onClick={saveSiteSettings} className="glow-button">
            <Save className="w-4 h-4 mr-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Palette className="w-5 h-5" />
            تعديل الألوان
          </CardTitle>
          <CardDescription className="text-gray-200">
            تغيير الألوان الأساسية للموقع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="primary-color" className="text-white">اللون الأساسي</Label>
              <Input
                id="primary-color"
                type="color"
                value={previewColors?.primary || '#3b82f6'}
                onChange={(e) => setPreviewColors({
                  ...previewColors,
                  primary: e.target.value
                })}
                className="h-12 bg-white/20 border-white/30"
              />
            </div>
            <div>
              <Label htmlFor="secondary-color" className="text-white">اللون الثانوي</Label>
              <Input
                id="secondary-color"
                type="color"
                value={previewColors?.secondary || '#8b5cf6'}
                onChange={(e) => setPreviewColors({
                  ...previewColors,
                  secondary: e.target.value
                })}
                className="h-12 bg-white/20 border-white/30"
              />
            </div>
            <div>
              <Label htmlFor="accent-color" className="text-white">لون التمييز</Label>
              <Input
                id="accent-color"
                type="color"
                value={previewColors?.accent || '#06b6d4'}
                onChange={(e) => setPreviewColors({
                  ...previewColors,
                  accent: e.target.value
                })}
                className="h-12 bg-white/20 border-white/30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={resetToDefaults} disabled={isLoading} className="glow-button">
        {isLoading ? <RotateCcw className="w-4 h-4 mr-2 animate-spin" /> : <RotateCcw className="w-4 h-4 mr-2" />}
        إعادة إلى الافتراضي
      </Button>
    </div>
  );
};

export default DesignTab;
