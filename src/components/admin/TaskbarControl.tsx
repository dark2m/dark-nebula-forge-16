import React, { useState } from 'react';
import { Save, Eye, EyeOff, Plus, Trash2, Edit3, Menu, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import SettingsService from '../../utils/settingsService';
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
  const [isCustomPathMode, setIsCustomPathMode] = useState(false);
  const [newItem, setNewItem] = useState<TaskbarItem>({
    id: '',
    name: '',
    icon: 'Menu',
    path: '',
    visible: true,
    position: 0
  });
  const { toast } = useToast();

  const taskbarItems: TaskbarItem[] = siteSettings.navigation?.map((item, index) => ({
    id: item.id || `item-${index}`,
    name: item.name,
    icon: item.icon || 'Menu',
    path: item.path,
    visible: item.visible !== false,
    position: index
  })) || [];

  // قائمة شاملة بالأيقونات المتوفرة
  const iconOptions = [
    // أيقونات أساسية
    { value: 'Home', label: '🏠 الرئيسية', category: 'أساسي' },
    { value: 'User', label: '👤 المستخدم', category: 'أساسي' },
    { value: 'Users', label: '👥 المستخدمين', category: 'أساسي' },
    { value: 'Settings', label: '⚙️ الإعدادات', category: 'أساسي' },
    { value: 'Menu', label: '☰ القائمة', category: 'أساسي' },
    
    // أيقونات الأمان والحماية
    { value: 'Shield', label: '🛡️ الحماية', category: 'أمان' },
    { value: 'Lock', label: '🔒 القفل', category: 'أمان' },
    { value: 'Key', label: '🔑 المفتاح', category: 'أمان' },
    { value: 'Eye', label: '👁️ المراقبة', category: 'أمان' },
    { value: 'ShieldCheck', label: '✅ الأمان المؤكد', category: 'أمان' },
    
    // أيقونات التقنية والبرمجة
    { value: 'Code', label: '💻 البرمجة', category: 'تقنية' },
    { value: 'Code2', label: '⌨️ الكود', category: 'تقنية' },
    { value: 'Terminal', label: '📟 Terminal', category: 'تقنية' },
    { value: 'Database', label: '🗄️ قاعدة البيانات', category: 'تقنية' },
    { value: 'Server', label: '🖥️ الخادم', category: 'تقنية' },
    { value: 'Globe', label: '🌐 الويب', category: 'تقنية' },
    { value: 'Wifi', label: '📶 الشبكة', category: 'تقنية' },
    
    // أيقونات الألعاب
    { value: 'Gamepad2', label: '🎮 الألعاب', category: 'ألعاب' },
    { value: 'Joystick', label: '🕹️ عصا التحكم', category: 'ألعاب' },
    { value: 'Target', label: '🎯 الهدف', category: 'ألعاب' },
    { value: 'Crosshair', label: '⚡ التصويب', category: 'ألعاب' },
    { value: 'Zap', label: '⚡ القوة', category: 'ألعاب' },
    
    // أيقونات التواصل
    { value: 'MessageCircle', label: '💬 خدمة العملاء', category: 'تواصل' },
    { value: 'MessageSquare', label: '💬 الرسائل', category: 'تواصل' },
    { value: 'Phone', label: '📞 الهاتف', category: 'تواصل' },
    { value: 'Mail', label: '📧 البريد', category: 'تواصل' },
    { value: 'Send', label: '📤 إرسال', category: 'تواصل' },
    { value: 'Bot', label: '🤖 البوت', category: 'تواصل' },
    
    // أيقونات الأدوات
    { value: 'Wrench', label: '🔧 الأدوات', category: 'أدوات' },
    { value: 'Tools', label: '🛠️ أدوات', category: 'أدوات' },
    { value: 'Hammer', label: '🔨 المطرقة', category: 'أدوات' },
    { value: 'Cog', label: '⚙️ الترس', category: 'أدوات' },
    { value: 'Screwdriver', label: '🪛 المفك', category: 'أدوات' },
    
    // أيقونات الدعم والمساعدة
    { value: 'HeadphonesIcon', label: '🎧 الدعم الفني', category: 'دعم' },
    { value: 'HelpCircle', label: '❓ المساعدة', category: 'دعم' },
    { value: 'Info', label: 'ℹ️ المعلومات', category: 'دعم' },
    { value: 'LifeBuoy', label: '🛟 الإنقاذ', category: 'دعم' },
    { value: 'Support', label: '🆘 الدعم', category: 'دعم' },
    
    // أيقونات التجارة
    { value: 'ShoppingCart', label: '🛒 السلة', category: 'تجارة' },
    { value: 'CreditCard', label: '💳 الدفع', category: 'تجارة' },
    { value: 'Package', label: '📦 المنتجات', category: 'تجارة' },
    { value: 'Store', label: '🏪 المتجر', category: 'تجارة' },
    { value: 'DollarSign', label: '💲 السعر', category: 'تجارة' },
    
    // أيقونات المحتوى
    { value: 'FileText', label: '📄 النص', category: 'محتوى' },
    { value: 'Image', label: '🖼️ الصور', category: 'محتوى' },
    { value: 'Video', label: '🎥 الفيديو', category: 'محتوى' },
    { value: 'Music', label: '🎵 الموسيقى', category: 'محتوى' },
    { value: 'Book', label: '📚 الكتب', category: 'محتوى' },
    
    // أيقونات خاصة
    { value: 'Star', label: '⭐ النجمة', category: 'خاص' },
    { value: 'Heart', label: '❤️ القلب', category: 'خاص' },
    { value: 'Crown', label: '👑 التاج', category: 'خاص' },
    { value: 'Award', label: '🏆 الجائزة', category: 'خاص' },
    { value: 'Gift', label: '🎁 الهدية', category: 'خاص' },
    { value: 'Sparkles', label: '✨ البريق', category: 'خاص' }
  ];

  // تجميع الأيقونات حسب الفئة
  const groupedIcons = iconOptions.reduce((acc, icon) => {
    if (!acc[icon.category]) {
      acc[icon.category] = [];
    }
    acc[icon.category].push(icon);
    return acc;
  }, {} as Record<string, typeof iconOptions>);

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
    // إذا كان مسار مخصص (يبدأ بـ /)
    if (path.startsWith('/') && path !== '/') {
      return true; // نسمح بالمسارات المخصصة
    }
    return availableRoutes.some(route => route.path === path);
  };

  // الحصول على حالة المسار
  const getRouteStatus = (path: string) => {
    const isKnownRoute = availableRoutes.some(route => route.path === path);
    const isCustomRoute = path.startsWith('/') && !isKnownRoute;
    
    if (isKnownRoute) {
      return {
        isValid: true,
        icon: CheckCircle,
        color: 'text-green-400',
        message: 'مسار صحيح'
      };
    } else if (isCustomRoute) {
      return {
        isValid: true,
        icon: AlertTriangle,
        color: 'text-yellow-400',
        message: 'مسار مخصص - تأكد من وجوده'
      };
    } else {
      return {
        isValid: false,
        icon: AlertTriangle,
        color: 'text-red-400',
        message: 'مسار غير صحيح'
      };
    }
  };

  // دالة حفظ محسنة لضمان الثبات
  const saveSettingsWithPersistence = (newSettings: SiteSettings) => {
    try {
      console.log('TaskbarControl: Saving settings with persistence:', newSettings);
      
      setSiteSettings(newSettings);
      SettingsService.saveSiteSettings(newSettings);
      
      const event = new CustomEvent('settingsUpdated', {
        detail: { settings: newSettings }
      });
      window.dispatchEvent(event);
      
      console.log('TaskbarControl: Settings saved successfully');
      
      toast({
        title: "تم الحفظ",
        description: "تم حفظ التغييرات في شريط المهام بنجاح",
      });
      
    } catch (error) {
      console.error('TaskbarControl: Error saving settings:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive"
      });
    }
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

    saveSettingsWithPersistence(newSettings);
  };

  const addNewItem = () => {
    if (!newItem.name || !newItem.path) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive"
      });
      return;
    }

    // التحقق من صحة المسار قبل الإضافة
    if (!validateRoute(newItem.path)) {
      toast({
        title: "تحذير",
        description: "تأكد من صحة المسار المدخل",
        variant: "destructive"
      });
      return;
    }

    const uniqueId = `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    console.log('Adding new item:', { ...newItem, id: uniqueId });

    const newNavItem = {
      id: uniqueId,
      name: newItem.name,
      icon: newItem.icon,
      path: newItem.path,
      visible: true
    };

    const updatedNavigation = [
      ...(siteSettings.navigation || []),
      newNavItem
    ];

    const newSettings = {
      ...siteSettings,
      navigation: updatedNavigation
    };

    saveSettingsWithPersistence(newSettings);

    setNewItem({
      id: '',
      name: '',
      icon: 'Menu',
      path: '',
      visible: true,
      position: 0
    });

    toast({
      title: "تم الإضافة",
      description: `تم إضافة "${newItem.name}" إلى شريط المهام بنجاح`,
    });
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

    saveSettingsWithPersistence(newSettings);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف العنصر من شريط المهام",
    });
  };

  const updateItem = (updates: Partial<TaskbarItem>) => {
    if (!editingItem) return;

    if (updates.path && !validateRoute(updates.path)) {
      toast({
        title: "تحذير",
        description: "تأكد من صحة المسار المدخل",
        variant: "destructive"
      });
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

    saveSettingsWithPersistence(newSettings);

    setEditingItem(null);
    setIsEditDialogOpen(false);
    
    toast({
      title: "تم التحديث",
      description: "تم تحديث العنصر بنجاح",
    });
  };

  return (
    <Card className="bg-white/5 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Menu className="w-5 h-5" />
            تحكم شريط المهام المتقدم
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
          إدارة عناصر شريط المهام مع أيقونات متنوعة ومسارات مخصصة
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* قائمة العناصر الحالية */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold">العناصر الحالية ({taskbarItems.length})</h3>
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
                    
                    <div className={`flex items-center gap-1 ${routeStatus.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      <span className="text-xs">{routeStatus.message}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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
                <Label className="text-white">اسم العنصر *</Label>
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="اسم العنصر"
                  className="bg-white/10 border-white/20 text-white"
                  required
                />
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
                  <SelectContent className="bg-gray-800 border-white/20 max-h-80">
                    {Object.entries(groupedIcons).map(([category, icons]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-700">
                          {category}
                        </div>
                        {icons.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Label className="text-white">المسار *</Label>
                <Switch
                  checked={isCustomPathMode}
                  onCheckedChange={setIsCustomPathMode}
                />
                <span className="text-sm text-gray-300">
                  {isCustomPathMode ? 'مسار مخصص' : 'مسار جاهز'}
                </span>
              </div>
              
              {isCustomPathMode ? (
                <Input
                  value={newItem.path}
                  onChange={(e) => setNewItem(prev => ({ ...prev, path: e.target.value }))}
                  placeholder="/my-custom-page"
                  className="bg-white/10 border-white/20 text-white"
                />
              ) : (
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
              )}
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

        {/* معلومات المسارات */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              المسارات الجاهزة
            </h3>
            <div className="space-y-1">
              {availableRoutes.map(route => (
                <div key={route.path} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">{route.path}</span>
                  <span className="text-gray-500">({route.label})</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              المسارات المخصصة
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <p>• يمكنك إنشاء مسارات مخصصة</p>
              <p>• يجب أن تبدأ بـ /</p>
              <p>• مثال: /my-page</p>
              <p>• تأكد من وجود الصفحة</p>
            </div>
          </div>
        </div>

        {/* زر الحفظ العام */}
        <div className="flex justify-end pt-4 border-t border-white/20">
          <Button 
            onClick={() => saveSettingsWithPersistence(siteSettings)} 
            className="glow-button"
          >
            <Save className="w-4 h-4 mr-2" />
            حفظ جميع التغييرات نهائياً
          </Button>
        </div>
      </CardContent>

      {/* Dialog للتعديل */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 border-white/20 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">تعديل العنصر</DialogTitle>
            <DialogDescription className="text-gray-400">
              تعديل خصائص عنصر شريط المهام
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
                  <SelectContent className="bg-gray-800 border-white/20 max-h-80">
                    {Object.entries(groupedIcons).map(([category, icons]) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-700">
                          {category}
                        </div>
                        {icons.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-white">المسار</Label>
                <Input
                  value={editingItem.path}
                  onChange={(e) => setEditingItem(prev => 
                    prev ? { ...prev, path: e.target.value } : null
                  )}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="/custom-path أو اختر من القائمة"
                />
                <div className="mt-2 text-xs text-gray-400">
                  المسارات الجاهزة: {availableRoutes.map(r => r.path).join(', ')}
                </div>
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
