
import React from 'react';
import { Plus, Trash2, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SettingsService } from '../../utils/settingsService';
import { useToast } from '@/hooks/use-toast';
import type { SiteSettings } from '../../types/admin';

interface TaskbarControlProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const TaskbarControl: React.FC<TaskbarControlProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const { toast } = useToast();

  const updateNavigation = (newNavigation: typeof siteSettings.navigation) => {
    setSiteSettings({
      ...siteSettings,
      navigation: newNavigation
    });
  };

  const addNavItem = () => {
    const newItem = {
      id: `nav_${Date.now()}`,
      name: 'عنصر جديد',
      path: '/new-page',
      icon: 'Home',
      visible: true
    };
    updateNavigation([...siteSettings.navigation, newItem]);
  };

  const removeNavItem = (id: string) => {
    updateNavigation(siteSettings.navigation.filter(item => item.id !== id));
  };

  const updateNavItem = (id: string, updates: Partial<typeof siteSettings.navigation[0]>) => {
    updateNavigation(siteSettings.navigation.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const resetToDefaults = () => {
    const defaultNavigation = [
      { id: 'home', name: 'الرئيسية', path: '/', icon: 'Home', visible: true },
      { id: 'pubg', name: 'هاكات PUBG', path: '/pubg-hacks', icon: 'Gamepad2', visible: true },
      { id: 'web', name: 'تطوير المواقع', path: '/web-development', icon: 'Code', visible: true },
      { id: 'discord', name: 'بوتات Discord', path: '/discord-bots', icon: 'Bot', visible: true },
      { id: 'tools', name: 'الأدوات', path: '/tool', icon: 'Wrench', visible: true },
      { id: 'support', name: 'الدعم الفني', path: '/sport', icon: 'HeadphonesIcon', visible: true },
      { id: 'official', name: 'الصفحة الرسمية', path: '/official', icon: 'Shield', visible: true }
    ];
    updateNavigation(defaultNavigation);
    toast({
      title: "تم إعادة التعيين",
      description: "تم إعادة تعيين شريط التنقل للوضع الافتراضي"
    });
  };

  return (
    <Card className="bg-transparent border-white/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          إدارة شريط التنقل
          <div className="flex gap-2">
            <Button
              onClick={resetToDefaults}
              variant="outline"
              size="sm"
              className="border-red-500/50 text-red-400 hover:bg-red-500/20"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              إعادة تعيين
            </Button>
            <Button
              onClick={addNavItem}
              size="sm"
              className="glow-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة عنصر
            </Button>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-300">
          إدارة عناصر التنقل وترتيبها
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {siteSettings.navigation.map((item, index) => (
          <div key={item.id} className="p-4 bg-white/10 rounded-lg border border-white/20">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
              <div>
                <Label className="text-white text-sm">الاسم</Label>
                <Input
                  value={item.name}
                  onChange={(e) => updateNavItem(item.id, { name: e.target.value })}
                  className="bg-white/20 border-white/30 text-white mt-1"
                />
              </div>
              
              <div>
                <Label className="text-white text-sm">المسار</Label>
                <Input
                  value={item.path}
                  onChange={(e) => updateNavItem(item.id, { path: e.target.value })}
                  className="bg-white/20 border-white/30 text-white mt-1"
                />
              </div>
              
              <div>
                <Label className="text-white text-sm">الأيقونة</Label>
                <Input
                  value={item.icon}
                  onChange={(e) => updateNavItem(item.id, { icon: e.target.value })}
                  className="bg-white/20 border-white/30 text-white mt-1"
                  placeholder="Home"
                />
              </div>
              
              <div>
                <Label className="text-white text-sm">الترتيب</Label>
                <div className="text-gray-300 text-center mt-1 py-2">
                  {index + 1}
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={item.visible}
                    onCheckedChange={(checked) => updateNavItem(item.id, { visible: checked })}
                  />
                  <Label className="text-white text-sm">
                    {item.visible ? 'مرئي' : 'مخفي'}
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-center">
                <Button
                  onClick={() => removeNavItem(item.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {siteSettings.navigation.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">لا توجد عناصر تنقل</p>
            <Button
              onClick={addNavItem}
              className="mt-4 glow-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة عنصر التنقل الأول
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskbarControl;
