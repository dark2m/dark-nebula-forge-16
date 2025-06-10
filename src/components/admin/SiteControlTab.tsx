
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">عام</TabsTrigger>
          <TabsTrigger value="appearance">المظهر</TabsTrigger>
          <TabsTrigger value="layout">التخطيط</TabsTrigger>
          <TabsTrigger value="navigation">التنقل</TabsTrigger>
          <TabsTrigger value="background">الخلفية</TabsTrigger>
          <TabsTrigger value="advanced">متقدم</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                إعدادات الموقع العامة
              </CardTitle>
              <CardDescription>
                إعدادات أساسية للموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site-title">عنوان الموقع</Label>
                  <Input
                    id="site-title"
                    value={siteSettings.title}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      title: e.target.value
                    })}
                    placeholder="اسم الموقع"
                  />
                </div>
                <div>
                  <Label htmlFor="title-size">حجم العنوان</Label>
                  <Select
                    value={siteSettings.titleSize}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      titleSize: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                      <SelectItem value="xl">كبير جداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="site-description">وصف الموقع</Label>
                <Textarea
                  id="site-description"
                  value={siteSettings.description}
                  onChange={(e) => setSiteSettings({
                    ...siteSettings,
                    description: e.target.value
                  })}
                  placeholder="وصف مختصر للموقع"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="global-text-size">حجم النص العام</Label>
                <Select
                  value={siteSettings.globalTextSize}
                  onValueChange={(value: any) => setSiteSettings({
                    ...siteSettings,
                    globalTextSize: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">صغير</SelectItem>
                    <SelectItem value="medium">متوسط</SelectItem>
                    <SelectItem value="large">كبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                إعدادات المظهر
              </CardTitle>
              <CardDescription>
                تخصيص ألوان وشكل الموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary-color">اللون الأساسي</Label>
                  <Input
                    id="primary-color"
                    type="color"
                    value={siteSettings.colors.primary}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        primary: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="secondary-color">اللون الثانوي</Label>
                  <Input
                    id="secondary-color"
                    type="color"
                    value={siteSettings.colors.secondary}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        secondary: e.target.value
                      }
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="accent-color">لون التمييز</Label>
                  <Input
                    id="accent-color"
                    type="color"
                    value={siteSettings.colors.accent}
                    onChange={(e) => setSiteSettings({
                      ...siteSettings,
                      colors: {
                        ...siteSettings.colors,
                        accent: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="border-radius">استدارة الحواف</Label>
                  <Select
                    value={siteSettings.design.borderRadius}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      design: {
                        ...siteSettings.design,
                        borderRadius: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون</SelectItem>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="shadows">الظلال</Label>
                  <Select
                    value={siteSettings.design.shadows}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      design: {
                        ...siteSettings.design,
                        shadows: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">بدون</SelectItem>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="animations"
                  checked={siteSettings.design.animations}
                  onCheckedChange={(checked) => setSiteSettings({
                    ...siteSettings,
                    design: {
                      ...siteSettings.design,
                      animations: checked
                    }
                  })}
                />
                <Label htmlFor="animations">تفعيل الحركات والانتقالات</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Settings */}
        <TabsContent value="layout" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5" />
                إعدادات التخطيط
              </CardTitle>
              <CardDescription>
                تحكم في تباعد العناصر وتخطيط الصفحة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="spacing">تباعد العناصر</Label>
                <Select
                  value={siteSettings.design.spacing}
                  onValueChange={(value: any) => setSiteSettings({
                    ...siteSettings,
                    design: {
                      ...siteSettings.design,
                      spacing: value
                    }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tight">ضيق</SelectItem>
                    <SelectItem value="normal">عادي</SelectItem>
                    <SelectItem value="loose">واسع</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="font-family">نوع الخط</Label>
                  <Select
                    value={siteSettings.typography.fontFamily}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      typography: {
                        ...siteSettings.typography,
                        fontFamily: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="system">النظام الافتراضي</SelectItem>
                      <SelectItem value="arabic">خط عربي</SelectItem>
                      <SelectItem value="modern">خط عصري</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="line-height">ارتفاع الأسطر</Label>
                  <Select
                    value={siteSettings.typography.lineHeight}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      typography: {
                        ...siteSettings.typography,
                        lineHeight: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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

        {/* Navigation Settings */}
        <TabsContent value="navigation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات شريط التنقل</CardTitle>
              <CardDescription>
                تخصيص شريط التنقل وعناصره
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {siteSettings.navigation.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={item.visible}
                      onCheckedChange={(checked) => {
                        const updatedNav = [...siteSettings.navigation];
                        updatedNav[index].visible = checked;
                        setSiteSettings({
                          ...siteSettings,
                          navigation: updatedNav
                        });
                      }}
                    />
                    <span className="text-white">{item.name}</span>
                  </div>
                  <Input
                    value={item.name}
                    onChange={(e) => {
                      const updatedNav = [...siteSettings.navigation];
                      updatedNav[index].name = e.target.value;
                      setSiteSettings({
                        ...siteSettings,
                        navigation: updatedNav
                      });
                    }}
                    className="w-48"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Background Settings */}
        <TabsContent value="background" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>إعدادات الخلفية المتحركة</CardTitle>
              <CardDescription>
                تخصيص النجوم والشهب في الخلفية
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>عدد النجوم: {siteSettings.backgroundSettings.starCount}</Label>
                  <Slider
                    value={[siteSettings.backgroundSettings.starCount || 80]}
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
                  />
                </div>
                <div>
                  <Label>عدد الشهب: {siteSettings.backgroundSettings.meteorCount}</Label>
                  <Slider
                    value={[siteSettings.backgroundSettings.meteorCount || 10]}
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
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>شفافية النجوم: {Math.round((siteSettings.backgroundSettings.starOpacity || 0.8) * 100)}%</Label>
                  <Slider
                    value={[(siteSettings.backgroundSettings.starOpacity || 0.8) * 100]}
                    onValueChange={([value]) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        starOpacity: value / 100
                      }
                    })}
                    max={100}
                    min={10}
                    step={10}
                  />
                </div>
                <div>
                  <Label>شفافية الشهب: {Math.round((siteSettings.backgroundSettings.meteorOpacity || 0.7) * 100)}%</Label>
                  <Slider
                    value={[(siteSettings.backgroundSettings.meteorOpacity || 0.7) * 100]}
                    onValueChange={([value]) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        meteorOpacity: value / 100
                      }
                    })}
                    max={100}
                    min={10}
                    step={10}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>حجم النجوم</Label>
                  <Select
                    value={siteSettings.backgroundSettings.starSize}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        starSize: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>حجم الشهب</Label>
                  <Select
                    value={siteSettings.backgroundSettings.meteorSize}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        meteorSize: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">صغير</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="large">كبير</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>سرعة الحركة</Label>
                  <Select
                    value={siteSettings.backgroundSettings.animationSpeed}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      backgroundSettings: {
                        ...siteSettings.backgroundSettings,
                        animationSpeed: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slow">بطيء</SelectItem>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="fast">سريع</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                إعدادات متقدمة
              </CardTitle>
              <CardDescription>
                إعدادات تقنية ومتقدمة للموقع
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h4 className="text-yellow-400 font-semibold mb-2">تحذير</h4>
                <p className="text-gray-300 text-sm">
                  تغيير هذه الإعدادات قد يؤثر على أداء الموقع. تأكد من معرفة ما تفعله.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>وزن خط العناوين</Label>
                  <Select
                    value={siteSettings.typography.headingWeight}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      typography: {
                        ...siteSettings.typography,
                        headingWeight: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="bold">سميك</SelectItem>
                      <SelectItem value="black">سميك جداً</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>وزن النص العادي</Label>
                  <Select
                    value={siteSettings.typography.bodyWeight}
                    onValueChange={(value: any) => setSiteSettings({
                      ...siteSettings,
                      typography: {
                        ...siteSettings.typography,
                        bodyWeight: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">عادي</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="semibold">نصف سميك</SelectItem>
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
