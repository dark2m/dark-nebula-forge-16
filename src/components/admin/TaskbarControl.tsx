
import React, { useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, Edit3, Menu, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { SiteSettings } from '../../types/admin';

interface TaskbarControlProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

interface TaskbarItem {
  id: string;
  name: string;
  icon: string;
  path: string;
  visible: boolean;
  position: number;
}

const TaskbarControl: React.FC<TaskbarControlProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingItem, setEditingItem] = useState<TaskbarItem | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<TaskbarItem>({
    id: '',
    name: '',
    icon: 'Menu',
    path: '',
    visible: true,
    position: 0
  });

  const taskbarItems: TaskbarItem[] = siteSettings.navigation?.map((item, index) => ({
    id: item.id || `item-${index}`,
    name: item.name,
    icon: item.icon || 'Menu',
    path: item.path,
    visible: item.visible !== false,
    position: index
  })) || [];

  const iconOptions = [
    { value: 'Home', label: 'الرئيسية' },
    { value: 'User', label: 'المستخدم' },
    { value: 'Users', label: 'المستخدمين' },
    { value: 'Settings', label: 'الإعدادات' },
    { value: 'Menu', label: 'القائمة' },
    { value: 'Shield', label: 'الحماية' },
    { value: 'Code', label: 'البرمجة' },
    { value: 'Bot', label: 'البوت' },
    { value: 'Wrench', label: 'الأدوات' },
    { value: 'Tools', label: 'أدوات' },
    { value: 'Support', label: '📞 دعم العملاء' }
  ];

  // قائمة المسارات المتوفرة في التطبيق
  const availableRoutes = [
    { path: '/', label: 'الصفحة الرئيسية' },
    { path: '/official', label: 'الصفحة الرئيسية' },
    { path: '/pubg-hacks', label: 'هكر ببجي موبايل' },
    { path: '/web-development', label: 'برمجة مواقع' },
    { path: '/discord-bots', label: 'برمجة بوتات ديسكورد' },
    { path: '/tool', label: 'الأدوات' },
    { path: '/sport', label: 'خدمة العملاء' }
  ];

  // التحقق من صحة المسار
  const validateRoute = (path: string): boolean => {
    return availableRoutes.some(route => route.path === path);
  };

  // الحصول على حالة المسار
  const getRouteStatus = (path: string) => {
    const isValid = validateRoute(path);
    return {
      isValid,
      icon: isValid ? CheckCircle : AlertTriangle,
      color: isValid ? 'text-green-400' : 'text-red-400',
      message: isValid ? 'مسار صحيح' : 'مسار غير موجود - قد يسبب خطأ 404'
    };
  };

  const toggleItemVisibility = (itemId: string) => {
    console.log('Toggling visibility for item:', itemId);
    
    const updatedNavigation = siteSettings.navigation?.map(item => {
      const currentId = item.id || `item-${siteSettings.navigation.indexOf(item)}`;
      if (currentId === itemId) {
        console.log('Found item to toggle:', item.name, 'current visible:', item.visible);
        return { ...item, visible: !item.visible };
      }
      return item;
    }) || [];

    console.log('Updated navigation:', updatedNavigation);

    const newSettings = {
      ...siteSettings,
      navigation: updatedNavigation
    };

    setSiteSettings(newSettings);
    
    // حفظ فوري وإطلاق حدث للتحديث
    setTimeout(() => {
      saveSiteSettings();
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: newSettings }
      }));
    }, 100);
  };

  const addNewItem = () => {
    if (!newItem.name || !newItem.path) return;

    // التحقق من صحة المسار قبل الإضافة
    if (!validateRoute(newItem.path)) {
      alert('تحذير: المسار المحدد غير موجود في التطبيق. هذا قد يسبب خطأ 404.');
      return;
    }

    console.log('Adding new item:', newItem);

    const updatedNavigation = [
      ...(siteSettings.navigation || []),
      {
        id: newItem.id || `item-${Date.now()}`,
        name: newItem.name,
        icon: newItem.icon,
        path: newItem.path,
        visible: newItem.visible
      }
    ];

    const newSettings = {
      ...siteSettings,
      navigation: updatedNavigation
    };

    setSiteSettings(newSettings);

    setNewItem({
      id: '',
      name: '',
      icon: 'Menu',
      path: '',
      visible: true,
      position: 0
    });

    // حفظ فوري وإطلاق حدث للتحديث
    setTimeout(() => {
      saveSiteSettings();
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: newSettings }
      }));
    }, 100);
  };

  const deleteItem = (itemId: string) => {
    console.log('Deleting item:', itemId);
    
    const updatedNavigation = siteSettings.navigation?.filter(item => {
      const currentId = item.id || `item-${siteSettings.navigation.indexOf(item)}`;
      return currentId !== itemId;
    }) || [];

    const newSettings = {
      ...siteSettings,
      navigation: updatedNavigation
    };

    setSiteSettings(newSettings);

    // حفظ فوري وإطلاق حدث للتحديث
    setTimeout(() => {
      saveSiteSettings();
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: newSettings }
      }));
    }, 100);
  };

  const updateItem = (updates: Partial<TaskbarItem>) => {
    if (!editingItem) return;

    // التحقق من صحة المسار عند التحديث
    if (updates.path && !validateRoute(updates.path)) {
      alert('تحذير: المسار المحدد غير موجود في التطبيق. هذا قد يسبب خطأ 404.');
      return;
    }

    console.log('Updating item:', editingItem.id, 'with:', updates);

    const updatedNavigation = siteSettings.navigation?.map(item => {
      const currentId = item.id || `item-${siteSettings.navigation.indexOf(item)}`;
      return currentId === editingItem.id
        ? { ...item, ...updates }
        : item;
    }) || [];

    const newSettings = {
      ...siteSettings,
      navigation: updatedNavigation
    };

    setSiteSettings(newSettings);

    setEditingItem(null);
    setIsEditDialogOpen(false);

    // حفظ فوري وإطلاق حدث للتحديث
    setTimeout(() => {
      saveSiteSettings();
      window.dispatchEvent(new CustomEvent('settingsUpdated', {
        detail: { settings: newSettings }
      }));
    }, 100);
  };

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            تحكم شريط المهام
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
            />
            <Label className="text-white text-sm">وضع التعديل</Label>
          </div>
        </CardTitle>
        <CardDescription className="text-gray-400">
          إدارة عناصر شريط المهام وإعدادات الرؤية مع التحقق من صحة المسارات
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* قائمة العناصر الحالية */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">العناصر الحالية</h3>
          {taskbarItems.length === 0 ? (
            <p className="text-gray-400 text-center py-4">لا توجد عناصر في شريط المهام</p>
          ) : (
            taskbarItems.map((item) => {
              const routeStatus = getRouteStatus(item.path);
              const StatusIcon = routeStatus.icon;
              
              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                    item.visible 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${item.visible ? 'bg-green-400' : 'bg-red-400'}`} />
                    <span className="text-white font-medium">{item.name}</span>
                    <span className="text-gray-400 text-sm">({item.path})</span>
                    <span className="text-gray-500 text-xs">{item.icon}</span>
                    
                    {/* مؤشر حالة المسار */}
                    <div className={`flex items-center gap-1 ${routeStatus.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-xs">{routeStatus.message}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* زر الرؤية */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleItemVisibility(item.id)}
                      className={`text-white hover:bg-white/10 ${
                        item.visible ? 'text-green-400' : 'text-red-400'
                      }`}
                    >
                      {item.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    
                    {/* زر التعديل */}
                    {isEditMode && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setEditingItem(item);
                            setIsEditDialogOpen(true);
                          }}
                          className="text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteItem(item.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* إضافة عنصر جديد */}
        {isEditMode && (
          <div className="space-y-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-white font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              إضافة عنصر جديد
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">اسم العنصر</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم العنصر"
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">المسار</Label>
                <Select
                  value={newItem.path}
                  onValueChange={(value) => setNewItem(prev => ({ ...prev, path: value }))}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="اختر المسار" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    {availableRoutes.map(route => (
                      <SelectItem key={route.path} value={route.path}>
                        {route.label} ({route.path})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-white">الأيقونة</Label>
              <Select
                value={newItem.icon}
                onValueChange={(value) => setNewItem(prev => ({ ...prev, icon: value }))}
              >
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-white/20">
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={addNewItem}
              disabled={!newItem.name || !newItem.path}
              className="glow-button w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              إضافة العنصر
            </Button>
          </div>
        )}

        {/* قائمة المسارات المتوفرة */}
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            المسارات المتوفرة في التطبيق
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableRoutes.map(route => (
              <div key={route.path} className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-3 h-3 text-green-400" />
                <span className="text-gray-300">{route.path}</span>
                <span className="text-gray-500">({route.label})</span>
              </div>
            ))}
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="flex justify-end pt-4 border-t border-white/20">
          <Button onClick={saveSiteSettings} className="glow-button">
            <Save className="w-4 h-4 mr-2" />
            حفظ جميع التغييرات
          </Button>
        </div>
      </CardContent>

      {/* Dialog للتعديل */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">تعديل العنصر</DialogTitle>
            <DialogDescription className="text-gray-400">
              تعديل خصائص عنصر شريط المهام مع التحقق من صحة المسار
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div>
                <Label className="text-white">اسم العنصر</Label>
                <Input
                  value={editingItem.name}
                  onChange={(e) => setEditingItem(prev => 
                    prev ? { ...prev, name: e.target.value } : null
                  )}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
              <div>
                <Label className="text-white">المسار</Label>
                <Select
                  value={editingItem.path}
                  onValueChange={(value) => setEditingItem(prev => 
                    prev ? { ...prev, path: value } : null
                  )}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    {availableRoutes.map(route => (
                      <SelectItem key={route.path} value={route.path}>
                        {route.label} ({route.path})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">الأيقونة</Label>
                <Select
                  value={editingItem.icon}
                  onValueChange={(value) => setEditingItem(prev => 
                    prev ? { ...prev, icon: value } : null
                  )}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-white/20">
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => updateItem(editingItem)}
                className="glow-button w-full"
              >
                حفظ التغييرات
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default TaskbarControl;
