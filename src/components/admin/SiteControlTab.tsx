import React from 'react';
import { Save, Palette, Type, Layout, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import TaskbarControl from './TaskbarControl';
import type { SiteSettings } from '../../types/admin';

interface SiteControlTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const SiteControlTab: React.FC<SiteControlTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">تحكم شامل في الموقع</h2>
          <p className="text-gray-400">إدارة جميع جوانب الموقع من مكان واحد</p>
        </div>
        <Button onClick={saveSiteSettings} className="glow-button">
          <Save className="w-4 h-4 mr-2" />
          حفظ جميع التغييرات
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-white/10">
          <TabsTrigger value="general" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">عام</TabsTrigger>
          <TabsTrigger value="taskbar" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">شريط المهام</TabsTrigger>
          <TabsTrigger value="appearance" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">المظهر</TabsTrigger>
          <TabsTrigger value="layout" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">التخطيط</TabsTrigger>
          <TabsTrigger value="background" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">الخلفية</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Globe className="w-5 h-5" />
                إعدادات الموقع العامة
              </CardTitle>
              <CardDescription className="text-gray-400">
                إعدادات أساسية للموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-title" className="text-white">عنوان الموقع</Label>
                  <Input
                    id="site-title"
                    value={siteSettings.title || ''}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      title: e.target.value
                    })}
                    placeholder="اسم الموقع"
                    className="bg-white/10 border-white/20 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="title-size" className="text-white">حجم العنوان</Label>
                  <Select
                    value={siteSettings.titleSize || 'large'}
                    onValueChange={(value) => setSiteSettings({
                      ...siteSettings,
                      titleSize: value as any
                    })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                      <SelectItem value="xl">كبير جداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="site-description" className="text-white">وصف الموقع</Label>
                <Textarea
                  id="site-description"
                  value={siteSettings.description || ''}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    description: e.target.value
                  })}
                  placeholder="وصف مختصر للموقع"
                  rows={3}
                  className="bg-white/10 border-white/20 text-white"
                />
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
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Taskbar Control */}
        <TabsContent value="taskbar" className="space-y-6">
          <TaskbarControl
            siteSettings={siteSettings}
            setSiteSettings={setSiteSettings}
            saveSiteSettings={saveSiteSettings}
          />
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Palette className="w-5 h-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription className="text-gray-400">
                تخصيص ألوان وشكل الموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color" className="text-white">اللون الأساسي</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={siteSettings.colors?.primary || '#3b82f6'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        primary: e.target.value
                      }
                    })}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-color" className="text-white">اللون الثانوي</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={siteSettings.colors?.secondary || '#8b5cf6'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        secondary: e.target.value
                      }
                    })}
                    className="h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="accent-color" className="text-white">لون التمييز</Label>
                  <Input
                    id="accent-color"
                    type="color"
                    value={siteSettings.colors?.accent || '#06b6d4'}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        accent: e.target.value
                      }
                    })}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="animations"
                  checked={siteSettings.design?.animations || false}
                  onCheckedChange={(checked) => setSiteSettings({
                    ...siteSettings,
                    design: {
                      ...siteSettings.design,
                      animations: checked
                    }
                  })}
                />
                <Label htmlFor="animations" className="text-white">تفعيل الحركات والانتقالات</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Layout className="w-5 h-5" />
                إعدادات التخطيط
              </CardTitle>
              <CardDescription className="text-gray-400">
                تحكم في تباعد العناصر وتخطيط الصفحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-family" className="text-white">نوع الخط</Label>
                  <Select
                    value={siteSettings.typography?.fontFamily || 'system'}
                    onValueChange={(value) => setSiteSettings({
                      ...siteSettings,
                      typography: {
                        ...siteSettings.typography,
                        fontFamily: value as any
                      }
                    })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="system">النظام الافتراضي</SelectItem>
                      <SelectItem value="arabic">خط عربي</SelectItem>
                      <SelectItem value="modern">خط عصري</SelectItem>
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
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="tight">ضيق</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="relaxed">مريح</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Settings */}
        <TabsContent value="background" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">إعدادات الخلفية المتحركة</CardTitle>
              <CardDescription className="text-gray-400">
                تخصيص النجوم والشهب في الخلفية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">عدد النجوم: {siteSettings.backgroundSettings?.starCount || 80}</Label>
                  <Slider
                    value={[siteSettings.backgroundSettings?.starCount || 80]}
                    onValueChange={([value]) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        starCount: value
                      }
                    })}
                    max={200}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-white">عدد الشهب: {siteSettings.backgroundSettings?.meteorCount || 10}</Label>
                  <Slider
                    value={[siteSettings.backgroundSettings?.meteorCount || 10]}
                    onValueChange={([value]) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        meteorCount: value
                      }
                    })}
                    max={50}
                    min={0}
                    step={5}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">سرعة الحركة</Label>
                  <Select
                    value={siteSettings.backgroundSettings?.animationSpeed || 'normal'}
                    onValueChange={(value) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        animationSpeed: value as any
                      }
                    })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="slow">بطيء</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="fast">سريع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white">حجم النجوم</Label>
                  <Select
                    value={siteSettings.backgroundSettings?.starSize || 'medium'}
                    onValueChange={(value) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        starSize: value as any
                      }
                    })}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/20">
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SiteControlTab;
