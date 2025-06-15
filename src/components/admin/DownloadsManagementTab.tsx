import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Download, Plus, Edit, Trash2, Eye, EyeOff, Lock, Unlock, Save, RotateCcw, Settings, FileText, Users, Key, Shield } from 'lucide-react';
import DownloadService from '../../utils/downloadService';
import DownloadPasswordService from '../../utils/downloadPasswordService';
import type { DownloadItem, DownloadPassword } from '../../types/downloads';
import type { SiteSettings } from '../../types/admin';

interface DownloadsManagementTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const DownloadsManagementTab: React.FC<DownloadsManagementTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>(DownloadService.getDownloads());
  const [passwords, setPasswords] = useState<DownloadPassword[]>(DownloadPasswordService.getDownloadPasswords());
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [editingPassword, setEditingPassword] = useState<DownloadPassword | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAddPasswordForm, setShowAddPasswordForm] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState<Partial<DownloadItem>>({
    title: '',
    description: '',
    category: 'tools',
    size: '',
    version: '',
    downloadUrl: '',
    filename: '',
    rating: 5,
    downloads: 0,
    features: [],
    status: 'جديد'
  });

  const [passwordFormData, setPasswordFormData] = useState<Partial<DownloadPassword>>({
    name: '',
    password: '',
    allowedCategories: ['ألعاب'],
    isActive: true,
    description: ''
  });

  const [newFeature, setNewFeature] = useState('');

  // Set default password on component mount if not already set
  React.useEffect(() => {
    if (!siteSettings.downloadsPassword || siteSettings.downloadsPassword === '') {
      setSiteSettings({
        ...siteSettings,
        downloadsPassword: 'dark'
      });
    }
  }, []);

  const handleSaveDownloads = () => {
    try {
      DownloadService.saveDownloads(downloads);
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ التنزيلات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التنزيلات",
        variant: "destructive"
      });
    }
  };

  const addPassword = () => {
    if (!passwordFormData.name || !passwordFormData.password) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء الاسم وكلمة المرور",
        variant: "destructive"
      });
      return;
    }

    try {
      const newPassword = DownloadPasswordService.addPassword({
        name: passwordFormData.name!,
        password: passwordFormData.password!,
        allowedCategories: passwordFormData.allowedCategories || ['ألعاب'],
        isActive: passwordFormData.isActive || true,
        description: passwordFormData.description || ''
      });

      setPasswords(DownloadPasswordService.getDownloadPasswords());
      setPasswordFormData({
        name: '',
        password: '',
        allowedCategories: ['ألعاب'],
        isActive: true,
        description: ''
      });
      setShowAddPasswordForm(false);

      toast({
        title: "تم إضافة كلمة المرور",
        description: "تم إضافة كلمة مرور جديدة بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة كلمة المرور",
        variant: "destructive"
      });
    }
  };

  const updatePassword = (id: number, updates: Partial<DownloadPassword>) => {
    try {
      DownloadPasswordService.updatePassword(id, updates);
      setPasswords(DownloadPasswordService.getDownloadPasswords());
      toast({
        title: "تم التحديث",
        description: "تم تحديث كلمة المرور بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description: "حدث خطأ أثناء تحديث كلمة المرور",
        variant: "destructive"
      });
    }
  };

  const deletePassword = (id: number) => {
    try {
      DownloadPasswordService.deletePassword(id);
      setPasswords(DownloadPasswordService.getDownloadPasswords());
      toast({
        title: "تم الحذف",
        description: "تم حذف كلمة المرور بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف كلمة المرور",
        variant: "destructive"
      });
    }
  };

  const addDownloadItem = () => {
    if (!formData.title || !formData.description) {
      toast({
        title: "بيانات ناقصة",
        description: "يرجى ملء العنوان والوصف على الأقل",
        variant: "destructive"
      });
      return;
    }

    const newItem: DownloadItem = {
      id: Math.max(0, ...downloads.map(d => d.id)) + 1,
      title: formData.title!,
      description: formData.description!,
      category: formData.category!,
      size: formData.size || '0 MB',
      version: formData.version || '1.0',
      downloadUrl: formData.downloadUrl || '',
      filename: formData.filename || formData.title,
      rating: formData.rating || 5,
      downloads: 0,
      features: formData.features || [],
      status: formData.status || 'جديد',
      lastUpdate: 'الآن',
      icon: 'Package'
    };

    const updatedDownloads = [...downloads, newItem];
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    
    setFormData({
      title: '',
      description: '',
      category: 'tools',
      size: '',
      version: '',
      downloadUrl: '',
      filename: '',
      rating: 5,
      downloads: 0,
      features: [],
      status: 'جديد'
    });
    setShowAddForm(false);

    toast({
      title: "تم إضافة العنصر",
      description: "تم إضافة عنصر التنزيل بنجاح"
    });
  };

  const updateDownloadItem = (id: number, updates: Partial<DownloadItem>) => {
    const updatedDownloads = downloads.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
  };

  const deleteDownloadItem = (id: number) => {
    const updatedDownloads = downloads.filter(item => item.id !== id);
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    
    toast({
      title: "تم حذف العنصر",
      description: "تم حذف عنصر التنزيل بنجاح"
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...(formData.features || []), newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features?.filter((_, i) => i !== index) || []
    });
  };

  const updateDownloadsTexts = (section: 'loginPage' | 'mainPage', field: string, value: any) => {
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        downloads: {
          ...siteSettings.pageTexts?.downloads,
          [section]: {
            ...siteSettings.pageTexts?.downloads?.[section],
            [field]: value
          }
        }
      }
    });
  };

  const updateDownloadsPassword = (password: string) => {
    setSiteSettings({
      ...siteSettings,
      downloadsPassword: password
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30";
  };

  const handleCategoryToggle = (category: string, isChecked: boolean) => {
    if (editingPassword) {
      const current = editingPassword.allowedCategories || [];
      if (isChecked) {
        setEditingPassword({...editingPassword, allowedCategories: [...current, category]});
      } else {
        setEditingPassword({...editingPassword, allowedCategories: current.filter(c => c !== category)});
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">إدارة التنزيلات</h2>
          <p className="text-gray-400">إدارة المحتوى وكلمات المرور والنصوص</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSaveDownloads} className="glow-button">
            <Save className="w-4 h-4 mr-2" />
            حفظ التغييرات
          </Button>
        </div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white/5">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
            <Download className="w-4 h-4 mr-2" />
            إدارة المحتوى
          </TabsTrigger>
          <TabsTrigger value="passwords" className="data-[state=active]:bg-purple-500/20">
            <Key className="w-4 h-4 mr-2" />
            كلمات المرور
          </TabsTrigger>
          <TabsTrigger value="texts" className="data-[state=active]:bg-green-500/20">
            <FileText className="w-4 h-4 mr-2" />
            النصوص
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-orange-500/20">
            <Settings className="w-4 h-4 mr-2" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* Content Management */}
        <TabsContent value="content" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">إضافة عنصر جديد</CardTitle>
                <Button
                  onClick={() => setShowAddForm(!showAddForm)}
                  variant="outline"
                  className="border-white/20"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {showAddForm ? 'إلغاء' : 'إضافة عنصر'}
                </Button>
              </div>
            </CardHeader>
            
            {showAddForm && (
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">العنوان</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="عنوان العنصر"
                    />
                  </div>
                  <div>
                    <Label className="text-white">الفئة</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="games">ألعاب</SelectItem>
                        <SelectItem value="tools">أدوات</SelectItem>
                        <SelectItem value="design">تصميم</SelectItem>
                        <SelectItem value="programming">برمجة</SelectItem>
                        <SelectItem value="music">موسيقى</SelectItem>
                        <SelectItem value="video">فيديو</SelectItem>
                        <SelectItem value="books">كتب</SelectItem>
                        <SelectItem value="security">أمان</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-white">الوصف</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="وصف العنصر"
                  />
                </div>

                <Button onClick={addDownloadItem} className="w-full glow-button">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة العنصر
                </Button>
              </CardContent>
            )}
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">قائمة التنزيلات</CardTitle>
              <CardDescription className="text-gray-400">
                إجمالي {downloads.length} عنصر
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {downloads.map((item) => (
                  <div key={item.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <p className="text-gray-400 text-sm">{item.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{item.category}</Badge>
                          <span className="text-gray-400 text-sm">{item.size}</span>
                          <span className="text-gray-400 text-sm">{item.downloads} تنزيل</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingItem(item)}
                          className="border-white/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteDownloadItem(item.id)}
                          className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Password Management */}
        <TabsContent value="passwords" className="space-y-6">
          {/* Current Default Password */}
          <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-400" />
                كلمة المرور الافتراضية المؤقتة
              </CardTitle>
              <CardDescription className="text-purple-200">
                كلمة المرور الحالية للوصول لصفحة التنزيلات
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-black/20 p-4 rounded-lg border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-purple-300 text-sm">كلمة المرور الحالية</Label>
                    <div className="text-2xl font-bold text-white mt-1">
                      {siteSettings.downloadsPassword || 'dark'}
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    نشطة
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-white">تغيير كلمة المرور الافتراضية</Label>
                <div className="flex space-x-2 mt-2">
                  <Input
                    type="password"
                    value={siteSettings.downloadsPassword || ''}
                    onChange={(e) => updateDownloadsPassword(e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="كلمة المرور الجديدة"
                  />
                  <Button onClick={saveSiteSettings} className="bg-purple-500 hover:bg-purple-600">
                    <Save className="w-4 h-4 mr-2" />
                    حفظ
                  </Button>
                </div>
                <p className="text-gray-400 text-sm mt-1">
                  ⚠️ هذه كلمة مرور مؤقتة - ننصح بإنشاء نظام كلمات مرور متقدم أدناه
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Password System */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Key className="w-5 h-5 mr-2 text-blue-400" />
                    نظام كلمات المرور المتقدم
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    إنشاء كلمات مرور مخصصة لفئات مختلفة
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setShowAddPasswordForm(!showAddPasswordForm)}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة كلمة مرور
                </Button>
              </div>
            </CardHeader>
            
            {showAddPasswordForm && (
              <CardContent className="space-y-4 border-t border-white/10 pt-4">
                <div className="bg-blue-500/5 p-4 rounded-lg border border-blue-500/20">
                  <h4 className="text-blue-300 font-medium mb-3">إضافة كلمة مرور جديدة</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">اسم كلمة المرور</Label>
                      <Input
                        value={passwordFormData.name}
                        onChange={(e) => setPasswordFormData({ ...passwordFormData, name: e.target.value })}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="مثال: كلمة مرور الألعاب"
                      />
                    </div>
                    <div>
                      <Label className="text-white">كلمة المرور</Label>
                      <Input
                        value={passwordFormData.password}
                        onChange={(e) => setPasswordFormData({ ...passwordFormData, password: e.target.value })}
                        className="bg-white/5 border-white/20 text-white"
                        placeholder="مثال: games123"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="text-white">الوصف</Label>
                    <Textarea
                      value={passwordFormData.description}
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, description: e.target.value })}
                      className="bg-white/5 border-white/20 text-white h-20 resize-none"
                      placeholder="وصف استخدام كلمة المرور"
                    />
                  </div>

                  <div className="mt-4">
                    <Label className="text-white">الفئات المسموحة</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                      {['ألعاب', 'أدوات', 'تصميم', 'برمجة', 'موسيقى', 'فيديو', 'كتب', 'أمان'].map(category => (
                        <div key={category} className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/10">
                          <input
                            type="checkbox"
                            id={`new-cat-${category}`}
                            checked={passwordFormData.allowedCategories?.includes(category) || false}
                            onChange={(e) => {
                              const current = passwordFormData.allowedCategories || [];
                              if (e.target.checked) {
                                setPasswordFormData({...passwordFormData, allowedCategories: [...current, category]});
                              } else {
                                setPasswordFormData({...passwordFormData, allowedCategories: current.filter(c => c !== category)});
                              }
                            }}
                            className="rounded border-white/20"
                          />
                          <label htmlFor={`new-cat-${category}`} className="text-white text-sm cursor-pointer">
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4">
                    <Button onClick={addPassword} className="bg-green-500 hover:bg-green-600">
                      <Plus className="w-4 h-4 mr-2" />
                      إضافة
                    </Button>
                    <Button 
                      onClick={() => setShowAddPasswordForm(false)} 
                      variant="outline" 
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}

            <CardContent className="space-y-4">
              {passwords.length > 0 ? (
                <div className="space-y-3">
                  {passwords.map((password) => (
                    <div key={password.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-white font-medium">{password.name}</h4>
                            <Badge className={password.isActive 
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-red-500/20 text-red-400 border-red-500/30"
                            }>
                              {password.isActive ? 'نشط' : 'معطل'}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm mb-2">{password.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-300">
                            <span>كلمة المرور: ••••••••</span>
                            <span>الاستخدامات: {password.usageCount}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {password.allowedCategories.map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingPassword(password)}
                            className="border-white/20"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deletePassword(password.id)}
                            className="border-red-500/20 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Key className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-white font-medium mb-2">لا توجد كلمات مرور متقدمة</h3>
                  <p className="text-gray-400 text-sm">قم بإضافة كلمة مرور جديدة للبدء</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Password Edit Modal */}
          {editingPassword && (
            <Card className="bg-white/5 border-white/20 mt-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white">تعديل كلمة المرور</CardTitle>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                    onClick={() => setEditingPassword(null)}
                  >
                    إلغاء
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">اسم كلمة المرور</Label>
                    <Input
                      value={editingPassword.name}
                      onChange={(e) => setEditingPassword({...editingPassword, name: e.target.value})}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: كلمة مرور الألعاب"
                    />
                  </div>
                  <div>
                    <Label className="text-white">كلمة المرور</Label>
                    <Input
                      value={editingPassword.password}
                      onChange={(e) => setEditingPassword({...editingPassword, password: e.target.value})}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: games123"
                    />
                  </div>
                </div>
                
                <div>
                  <Label className="text-white">الوصف</Label>
                  <Textarea
                    value={editingPassword.description}
                    onChange={(e) => setEditingPassword({...editingPassword, description: e.target.value})}
                    className="bg-white/5 border-white/20 text-white h-20 resize-none"
                    placeholder="وصف استخدام كلمة المرور"
                  />
                </div>

                <div>
                  <Label className="text-white">الفئات المسموحة (يمكن اختيار أكثر من فئة)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {['ألعاب', 'أدوات', 'تصميم', 'برمجة', 'موسيقى', 'فيديو', 'كتب', 'أمان'].map(category => (
                      <div key={category} className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/10">
                        <input
                          type="checkbox"
                          id={`edit-cat-${category}`}
                          checked={editingPassword.allowedCategories?.includes(category) || false}
                          onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                          className="rounded border-white/20"
                        />
                        <label htmlFor={`edit-cat-${category}`} className="text-white text-sm cursor-pointer">
                          {category}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 bg-white/5 p-3 rounded border border-white/10">
                  <input
                    type="checkbox"
                    id="active-status-edit"
                    checked={editingPassword.isActive || false}
                    onChange={(e) => setEditingPassword({...editingPassword, isActive: e.target.checked})}
                    className="rounded border-white/20"
                  />
                  <label htmlFor="active-status-edit" className="text-white cursor-pointer">
                    كلمة مرور نشطة
                  </label>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      if (editingPassword) {
                        updatePassword(editingPassword.id, editingPassword);
                        setEditingPassword(null);
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    حفظ
                  </Button>
                  <Button 
                    onClick={() => setEditingPassword(null)} 
                    variant="outline" 
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    إلغاء
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Password Statistics */}
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                إحصائيات كلمات المرور
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {passwords.length + 1}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي كلمات المرور</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {passwords.filter(p => p.isActive).length + 1}
                  </div>
                  <div className="text-gray-400 text-sm">كلمات المرور النشطة</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {passwords.reduce((sum, p) => sum + p.usageCount, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي الاستخدامات</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Text Management */}
        <TabsContent value="texts" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">نصوص صفحة تسجيل الدخول</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">العنوان الرئيسي</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.loginPage?.title || ''}
                    onChange={(e) => updateDownloadsTexts('loginPage', 'title', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="المشتركين فقط"
                  />
                </div>
                <div>
                  <Label className="text-white">العنوان الفرعي</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.loginPage?.subtitle || ''}
                    onChange={(e) => updateDownloadsTexts('loginPage', 'subtitle', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="تواصل مع خدمة العملاء للحصول على رمز الدخول"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">تسمية كلمة المرور</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.loginPage?.passwordLabel || ''}
                    onChange={(e) => updateDownloadsTexts('loginPage', 'passwordLabel', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="رمز الدخول"
                  />
                </div>
                <div>
                  <Label className="text-white">نص زر الدخول</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.loginPage?.loginButton || ''}
                    onChange={(e) => updateDownloadsTexts('loginPage', 'loginButton', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="دخول"
                  />
                </div>
              </div>

              <div>
                <Label className="text-white">نص زر خدمة العملاء</Label>
                <Input
                  value={siteSettings.pageTexts?.downloads?.loginPage?.contactSupport || ''}
                  onChange={(e) => updateDownloadsTexts('loginPage', 'contactSupport', e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="تواصل مع خدمة العملاء"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">نصوص الصفحة الرئيسية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">عنوان الصفحة</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.mainPage?.title || ''}
                    onChange={(e) => updateDownloadsTexts('mainPage', 'title', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="مركز التنزيلات"
                  />
                </div>
                <div>
                  <Label className="text-white">الوصف</Label>
                  <Input
                    value={siteSettings.pageTexts?.downloads?.mainPage?.subtitle || ''}
                    onChange={(e) => updateDownloadsTexts('mainPage', 'subtitle', e.target.value)}
                    className="bg-white/5 border-white/20 text-white"
                    placeholder="احصل على أفضل الأدوات والبرامج المتخصصة"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="w-5 h-5 mr-2" />
                إعدادات عامة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={saveSiteSettings} className="glow-button w-full">
                <Save className="w-4 h-4 mr-2" />
                حفظ جميع الإعدادات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DownloadsManagementTab;
