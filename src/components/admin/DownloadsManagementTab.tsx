
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
import { Download, Plus, Edit, Trash2, Eye, EyeOff, Lock, Unlock, Save, RotateCcw, Settings, FileText, Users } from 'lucide-react';
import DownloadService from '../../utils/downloadService';
import type { DownloadItem } from '../../types/downloads';
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
  const [editingItem, setEditingItem] = useState<DownloadItem | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
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

  const [newFeature, setNewFeature] = useState('');

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
    
    // Reset form
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

  const updateDownloadsTexts = (section: string, field: string, value: any) => {
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        downloads: {
          ...siteSettings.pageTexts?.downloads,
          [section]: {
            ...siteSettings.pageTexts?.downloads?.[section as keyof typeof siteSettings.pageTexts.downloads],
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
        <TabsList className="grid w-full grid-cols-3 bg-white/5">
          <TabsTrigger value="content" className="data-[state=active]:bg-blue-500/20">
            <Download className="w-4 h-4 mr-2" />
            إدارة المحتوى
          </TabsTrigger>
          <TabsTrigger value="texts" className="data-[state=active]:bg-blue-500/20">
            <FileText className="w-4 h-4 mr-2" />
            النصوص
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-500/20">
            <Settings className="w-4 h-4 mr-2" />
            الإعدادات
          </TabsTrigger>
        </TabsList>

        {/* Content Management */}
        <TabsContent value="content" className="space-y-6">
          {/* Add New Item */}
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

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-white">الحجم</Label>
                    <Input
                      value={formData.size}
                      onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: 15.2 MB"
                    />
                  </div>
                  <div>
                    <Label className="text-white">الإصدار</Label>
                    <Input
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="مثال: 1.0.0"
                    />
                  </div>
                  <div>
                    <Label className="text-white">التقييم</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-white">رابط التنزيل</Label>
                    <Input
                      value={formData.downloadUrl}
                      onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="https://example.com/file.zip"
                    />
                  </div>
                  <div>
                    <Label className="text-white">اسم الملف</Label>
                    <Input
                      value={formData.filename}
                      onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="filename.zip"
                    />
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label className="text-white">المميزات</Label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      className="bg-white/5 border-white/20 text-white"
                      placeholder="إضافة ميزة جديدة"
                      onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <Button onClick={addFeature} size="sm">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features?.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{feature}</span>
                        <button
                          onClick={() => removeFeature(index)}
                          className="ml-1 text-red-400 hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={addDownloadItem} className="w-full glow-button">
                  <Plus className="w-4 h-4 mr-2" />
                  إضافة العنصر
                </Button>
              </CardContent>
            )}
          </Card>

          {/* Downloads List */}
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
                إعدادات كلمة المرور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">كلمة مرور التنزيلات</Label>
                <Input
                  type="password"
                  value={siteSettings.downloadsPassword || ''}
                  onChange={(e) => updateDownloadsPassword(e.target.value)}
                  className="bg-white/5 border-white/20 text-white"
                  placeholder="كلمة المرور للوصول للتنزيلات"
                />
                <p className="text-gray-400 text-sm mt-1">
                  هذه الكلمة مطلوبة للوصول لصفحة التنزيلات
                </p>
              </div>

              <Button onClick={saveSiteSettings} className="glow-button">
                <Save className="w-4 h-4 mr-2" />
                حفظ الإعدادات
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Users className="w-5 h-5 mr-2" />
                إحصائيات التنزيلات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {downloads.length}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي العناصر</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {downloads.reduce((sum, item) => sum + item.downloads, 0)}
                  </div>
                  <div className="text-gray-400 text-sm">إجمالي التنزيلات</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {downloads.length > 0 
                      ? (downloads.reduce((sum, item) => sum + item.rating, 0) / downloads.length).toFixed(1)
                      : '0'
                    }
                  </div>
                  <div className="text-gray-400 text-sm">متوسط التقييم</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DownloadsManagementTab;
