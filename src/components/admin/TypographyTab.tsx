import React, { useState, useEffect } from 'react';
import { Type, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import AdminStorage from '../../utils/adminStorage';
import type { SiteSettings } from '../../types/admin';

interface TypographyTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const TypographyTab: React.FC<TypographyTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const resetToDefaults = async () => {
    setIsLoading(true);
    try {
      const defaultSettings = await AdminStorage.getSettings();
      setSiteSettings({
        ...siteSettings,
        typography: defaultSettings.typography,
        globalTextSize: defaultSettings.globalTextSize
      });
    } catch (error) {
      console.error('Error resetting typography:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTypographySettings = async () => {
    setIsLoading(true);
    try {
      await AdminStorage.saveSettings(siteSettings);
      saveSiteSettings();
    } catch (error) {
      console.error('Error saving typography settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إعدادات الخطوط</h2>
          <p className="text-gray-400">تخصيص الخطوط وأحجام النصوص في الموقع</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveTypographySettings} disabled={isLoading} className="glow-button">
            <Save className="w-4 h-4 mr-2" />
            حفظ التغييرات
          </Button>
          <Button onClick={resetToDefaults} disabled={isLoading} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            إعادة للوضع الافتراضي
          </Button>
        </div>
      </div>

      <Card className="bg-white/20 backdrop-blur-sm border-white/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Type className="w-5 h-5" />
            تخصيص الخطوط
          </CardTitle>
          <CardDescription className="text-gray-200">
            تغيير نوع الخط وحجم النصوص في الموقع
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="font-family" className="text-white">نوع الخط</Label>
              <Select
                value={siteSettings.typography?.fontFamily || 'Cairo'}
                onValueChange={(value) => setSiteSettings({
                  ...siteSettings,
                  typography: {
                    ...siteSettings.typography,
                    fontFamily: value as any
                  }
                })}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="اختر نوع الخط" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                  <SelectItem value="Cairo">Cairo</SelectItem>
                  <SelectItem value="Arial">Arial</SelectItem>
                  <SelectItem value="Helvetica">Helvetica</SelectItem>
                  <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="heading-weight" className="text-white">وزن العناوين</Label>
              <Select
                value={siteSettings.typography?.headingWeight || 'bold'}
                onValueChange={(value) => setSiteSettings({
                  ...siteSettings,
                  typography: {
                    ...siteSettings.typography,
                    headingWeight: value as any
                  }
                })}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="اختر وزن الخط" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="bold">سميك</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="body-weight" className="text-white">وزن النصوص</Label>
              <Select
                value={siteSettings.typography?.bodyWeight || 'normal'}
                onValueChange={(value) => setSiteSettings({
                  ...siteSettings,
                  typography: {
                    ...siteSettings.typography,
                    bodyWeight: value as any
                  }
                })}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="اختر وزن الخط" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="bold">سميك</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="line-height" className="text-white">ارتفاع الأسطر</Label>
              <Select
                value={siteSettings.typography?.lineHeight || 'normal'}
                onValueChange={(value) => setSiteSettings({
                  ...siteSettings,
                  typography: {
                    ...siteSettings.typography,
                    lineHeight: value as any
                  }
                })}
              >
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="اختر ارتفاع الأسطر" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                  <SelectItem value="normal">عادي</SelectItem>
                  <SelectItem value="relaxed">مريح</SelectItem>
                  <SelectItem value="tight">ضيق</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="global-text-size" className="text-white">حجم النص العام</Label>
            <Select
              value={siteSettings.globalTextSize || 'medium'}
              onValueChange={(value) => setSiteSettings({
                ...siteSettings,
                globalTextSize: value as any
              })}
            >
              <SelectTrigger className="bg-white/20 border-white/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-sm border-white/30">
                <SelectItem value="small">صغير</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="large">كبير</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypographyTab;
