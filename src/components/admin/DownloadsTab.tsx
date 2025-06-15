import React, { useState, useEffect } from 'react';
import { Download, Package, Shield, FileText, Plus, Edit, Trash2, Image, Video, X, Star, Wrench, Code, Users, Globe, Lock, Heart, Zap, Camera, Music, Book, Calendar, Mail, Phone, Search, Settings, Home, Key, Eye, EyeOff, Clock, Link, Upload, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import FileUploader from '../FileUploader';
import DownloadService from '../../utils/downloadService';
import DownloadCategoriesService from '../../utils/downloadCategoriesService';
import DownloadPasswordService from '../../utils/downloadPasswordService';
import DownloadCategoriesManager from './DownloadCategoriesManager';
import type { DownloadItem, DownloadPassword } from '../../types/downloads';

interface DownloadsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const DownloadsTab: React.FC<DownloadsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>(DownloadService.getDownloads());
  const [passwords, setPasswords] = useState<DownloadPassword[]>(DownloadPasswordService.getDownloadPasswords());
  const [categories, setCategories] = useState<string[]>(DownloadCategoriesService.getCategories());
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<DownloadItem>>({});
  const [showImageUploader, setShowImageUploader] = useState<number | null>(null);
  const [showVideoUploader, setShowVideoUploader] = useState<number | null>(null);
  const [showFileUploader, setShowFileUploader] = useState<number | null>(null);
  
  // Password management states
  const [isEditingPassword, setIsEditingPassword] = useState<number | null>(null);
  const [passwordEditForm, setPasswordEditForm] = useState<Partial<DownloadPassword>>({});
  const [showPassword, setShowPassword] = useState<number | null>(null);

  const [productUpdates, setProductUpdates] = useState<any[]>([]);
  const [newUpdate, setNewUpdate] = useState({
    title: '',
    message: '',
    isActive: true
  });

  useEffect(() => {
    loadProductUpdates();
  }, []);

  const availableIcons = [
    { name: 'Download', component: Download, label: 'تنزيل' },
    { name: 'Shield', component: Shield, label: 'درع' },
    { name: 'Package', component: Package, label: 'حزمة' },
    { name: 'FileText', component: FileText, label: 'ملف نصي' },
    { name: 'Star', component: Star, label: 'نجمة' },
    { name: 'Wrench', component: Wrench, label: 'أدوات' },
    { name: 'Code', component: Code, label: 'برمجة' },
    { name: 'Users', component: Users, label: 'مستخدمين' },
    { name: 'Globe', component: Globe, label: 'موقع' },
    { name: 'Lock', component: Lock, label: 'قفل' },
    { name: 'Heart', component: Heart, label: 'قلب' },
    { name: 'Zap', component: Zap, label: 'برق' },
    { name: 'Camera', component: Camera, label: 'كاميرا' },
    { name: 'Music', component: Music, label: 'موسيقى' },
    { name: 'Video', component: Video, label: 'فيديو' },
    { name: 'Book', component: Book, label: 'كتاب' },
    { name: 'Calendar', component: Calendar, label: 'تقويم' },
    { name: 'Mail', component: Mail, label: 'بريد' },
    { name: 'Phone', component: Phone, label: 'هاتف' },
    { name: 'Search', component: Search, label: 'بحث' },
    { name: 'Settings', component: Settings, label: 'إعدادات' },
    { name: 'Home', component: Home, label: 'الرئيسية' }
  ];

  const statusOptions = ['جديد', 'محدث', 'شائع', 'قديم'];

  const handleAdd = () => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لإضافة منتجات",
        variant: "destructive"
      });
      return;
    }

    const newDownload: DownloadItem = {
      id: Date.now(),
      title: "منتج جديد",
      description: "وصف المنتج",
      category: categories[0] || "أدوات",
      size: "1.0 MB",
      downloads: 0,
      rating: 5.0,
      version: "1.0.0",
      lastUpdate: "الآن",
      features: ["ميزة 1"],
      status: "جديد",
      icon: 'Download'
    };

    const updatedDownloads = [...downloads, newDownload];
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    
    toast({
      title: "تم إضافة المنتج",
      description: "تم إضافة منتج جديد بنجاح"
    });
  };

  const handleEdit = (download: DownloadItem) => {
    setIsEditing(download.id);
    setEditForm(download);
  };

  const handleSave = () => {
    if (!editForm || isEditing === null) return;

    const updatedDownloads = downloads.map(download =>
      download.id === isEditing ? { ...download, ...editForm } : download
    );

    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    setIsEditing(null);
    setEditForm({});

    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث المنتج بنجاح"
    });
  };

  const handleDelete = (id: number) => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحذف منتجات",
        variant: "destructive"
      });
      return;
    }

    const updatedDownloads = downloads.filter(download => download.id !== id);
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);

    toast({
      title: "تم حذف المنتج",
      description: "تم حذف المنتج بنجاح"
    });
  };

  const handleAddImage = (downloadId: number, imageUrl: string) => {
    DownloadService.addImage(downloadId, imageUrl);
    setDownloads(DownloadService.getDownloads());
    setShowImageUploader(null);
    
    toast({
      title: "تم إضافة الصورة",
      description: "تم إضافة الصورة بنجاح"
    });
  };

  const handleRemoveImage = (downloadId: number, imageUrl: string) => {
    DownloadService.removeImage(downloadId, imageUrl);
    setDownloads(DownloadService.getDownloads());
    
    toast({
      title: "تم حذف الصورة",
      description: "تم حذف الصورة بنجاح"
    });
  };

  const handleAddVideo = (downloadId: number, videoUrl: string) => {
    DownloadService.addVideo(downloadId, videoUrl);
    setDownloads(DownloadService.getDownloads());
    setShowVideoUploader(null);
    
    toast({
      title: "تم إضافة الفيديو",
      description: "تم إضافة الفيديو بنجاح"
    });
  };

  const handleRemoveVideo = (downloadId: number, videoUrl: string) => {
    DownloadService.removeVideo(downloadId, videoUrl);
    setDownloads(DownloadService.getDownloads());
    
    toast({
      title: "تم حذف الفيديو",
      description: "تم حذف الفيديو بنجاح"
    });
  };

  const handleAddFile = (downloadId: number, fileUrl: string, filename: string) => {
    const updatedDownloads = downloads.map(download =>
      download.id === downloadId 
        ? { ...download, downloadUrl: fileUrl, filename: filename }
        : download
    );
    
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    setShowFileUploader(null);
    
    toast({
      title: "تم إضافة ملف التنزيل",
      description: "تم إضافة ملف التنزيل بنجاح"
    });
  };

  const handleRemoveFile = (downloadId: number) => {
    const updatedDownloads = downloads.map(download =>
      download.id === downloadId 
        ? { ...download, downloadUrl: undefined, filename: undefined }
        : download
    );
    
    setDownloads(updatedDownloads);
    DownloadService.saveDownloads(updatedDownloads);
    
    toast({
      title: "تم حذف ملف التنزيل",
      description: "تم حذف ملف التنزيل بنجاح"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "محدث": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "شائع": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find(icon => icon.name === iconName);
    return iconData ? iconData.component : Download;
  };

  const handleAddPassword = () => {
    if (!canAccess('مبرمج')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لإضافة كلمات مرور",
        variant: "destructive"
      });
      return;
    }

    const newPassword = DownloadPasswordService.addPassword({
      name: "كلمة مرور جديدة",
      password: `pass_${Date.now()}`,
      allowedCategories: [categories[0] || "أدوات"],
      isActive: true,
      description: "وصف كلمة المرور"
    });

    setPasswords(DownloadPasswordService.getDownloadPasswords());
    
    toast({
      title: "تم إضافة كلمة المرور",
      description: "تم إضافة كلمة مرور جديدة بنجاح"
    });
  };

  const handleEditPassword = (password: DownloadPassword) => {
    setIsEditingPassword(password.id);
    setPasswordEditForm(password);
  };

  const handleSavePassword = () => {
    if (!passwordEditForm || isEditingPassword === null) return;

    DownloadPasswordService.updatePassword(isEditingPassword, passwordEditForm);
    setPasswords(DownloadPasswordService.getDownloadPasswords());
    setIsEditingPassword(null);
    setPasswordEditForm({});

    toast({
      title: "تم حفظ التغييرات",
      description: "تم تحديث كلمة المرور بنجاح"
    });
  };

  const handleDeletePassword = (id: number) => {
    if (!canAccess('مدير عام')) {
      toast({
        title: "خطأ في الصلاحية",
        description: "ليس لديك صلاحية لحذف كلمات المرور",
        variant: "destructive"
      });
      return;
    }

    DownloadPasswordService.deletePassword(id);
    setPasswords(DownloadPasswordService.getDownloadPasswords());

    toast({
      title: "تم حذف كلمة المرور",
      description: "تم حذف كلمة المرور بنجاح"
    });
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPassword(showPassword === id ? null : id);
  };

  const handleCategoryToggle = (category: string, isChecked: boolean) => {
    const current = passwordEditForm.allowedCategories || [];
    if (isChecked) {
      setPasswordEditForm({...passwordEditForm, allowedCategories: [...current, category]});
    } else {
      setPasswordEditForm({...passwordEditForm, allowedCategories: current.filter(c => c !== category)});
    }
  };

  const loadProductUpdates = () => {
    try {
      const updates = JSON.parse(localStorage.getItem('productUpdates') || '[]');
      setProductUpdates(updates);
    } catch (error) {
      console.error('Error loading product updates:', error);
      setProductUpdates([]);
    }
  };

  const saveProductUpdates = (updates: any[]) => {
    localStorage.setItem('productUpdates', JSON.stringify(updates));
    setProductUpdates(updates);
  };

  const addProductUpdate = () => {
    if (!newUpdate.title.trim() || !newUpdate.message.trim()) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول",
        variant: "destructive"
      });
      return;
    }

    const update = {
      id: Date.now(),
      ...newUpdate,
      createdAt: new Date().toISOString()
    };

    const updatedList = [update, ...productUpdates];
    saveProductUpdates(updatedList);
    setNewUpdate({ title: '', message: '', isActive: true });
    
    toast({
      title: "تم الإضافة",
      description: "تم إضافة التحديث بنجاح"
    });
  };

  const deleteProductUpdate = (id: number) => {
    const updatedList = productUpdates.filter(update => update.id !== id);
    saveProductUpdates(updatedList);
    
    toast({
      title: "تم الحذف",
      description: "تم حذف التحديث بنجاح"
    });
  };

  const toggleUpdateStatus = (id: number) => {
    const updatedList = productUpdates.map(update =>
      update.id === id 
        ? { ...update, isActive: !update.isActive }
        : update
    );
    saveProductUpdates(updatedList);
    
    toast({
      title: "تم التحديث",
      description: "تم تغيير حالة التحديث"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">إدارة التنزيلات</h2>
          <p className="text-gray-400">إضافة وتعديل منتجات التنزيل وكلمات المرور</p>
        </div>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/5 border border-white/20">
          <TabsTrigger value="products" className="text-white data-[state=active]:bg-white/10">
            المنتجات
          </TabsTrigger>
          <TabsTrigger value="passwords" className="text-white data-[state=active]:bg-white/10">
            كلمات المرور
          </TabsTrigger>
          <TabsTrigger value="updates" className="text-white data-[state=active]:bg-white/10">
            تحديثات المنتجات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">إدارة المنتجات</h3>
            {canAccess('مبرمج') && (
              <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة منتج
              </Button>
            )}
          </div>

          {/* Categories Management */}
          <DownloadCategoriesManager
            categories={categories}
            onCategoriesChange={setCategories}
          />

          <div className="grid gap-4">
            {downloads.map((download) => {
              const IconComponent = getIconComponent(download.icon);
              const isCurrentlyEditing = isEditing === download.id;

              return (
                <Card key={download.id} className="bg-white/5 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <IconComponent className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{download.title}</CardTitle>
                          <p className="text-gray-400 text-sm">{download.category} • v{download.version}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(download.status)} border`}>
                          {download.status}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(download)}
                            className="text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {canAccess('مبرمج') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(download.id)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isCurrentlyEditing ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">العنوان</label>
                            <input
                              type="text"
                              value={editForm.title || ''}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الفئة</label>
                            <select
                              value={editForm.category || ''}
                              onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                            >
                              {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-gray-800">{cat}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الحالة</label>
                            <select
                              value={editForm.status || ''}
                              onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                            >
                              {statusOptions.map(status => (
                                <option key={status} value={status} className="bg-gray-800">{status}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الأيقونة</label>
                            <select
                              value={editForm.icon || ''}
                              onChange={(e) => setEditForm({...editForm, icon: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                            >
                              {availableIcons.map(icon => (
                                <option key={icon.name} value={icon.name} className="bg-gray-800">{icon.label} ({icon.name})</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الحجم</label>
                            <input
                              type="text"
                              value={editForm.size || ''}
                              onChange={(e) => setEditForm({...editForm, size: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                              placeholder="مثال: 15.2 MB"
                            />
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الإصدار</label>
                            <input
                              type="text"
                              value={editForm.version || ''}
                              onChange={(e) => setEditForm({...editForm, version: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                              placeholder="مثال: 2.0.1"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">الوصف</label>
                          <textarea
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded text-white h-24 resize-none"
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-2">الميزات (مفصولة بفاصلة)</label>
                          <input
                            type="text"
                            value={editForm.features?.join(', ') || ''}
                            onChange={(e) => setEditForm({...editForm, features: e.target.value.split(', ').filter(f => f.trim())})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                            placeholder="ميزة 1, ميزة 2, ميزة 3"
                          />
                        </div>

                        {/* Download Link and Manual URL Input */}
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">رابط التنزيل</h4>
                          
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">رابط التنزيل المباشر</label>
                            <div className="flex gap-2">
                              <input
                                type="url"
                                value={editForm.downloadUrl || ''}
                                onChange={(e) => setEditForm({...editForm, downloadUrl: e.target.value})}
                                className="flex-1 p-2 bg-white/10 border border-white/20 rounded text-white"
                                placeholder="https://example.com/file.zip"
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setEditForm({...editForm, downloadUrl: '', filename: ''})}
                                className="border-white/20 text-white hover:bg-white/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-white text-sm font-medium mb-2">اسم الملف</label>
                            <input
                              type="text"
                              value={editForm.filename || ''}
                              onChange={(e) => setEditForm({...editForm, filename: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                              placeholder="مثال: tool-v1.0.zip"
                            />
                          </div>

                          <div className="border-t border-white/20 pt-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-white text-sm font-medium">أو ارفع ملف</label>
                              <Button
                                size="sm"
                                onClick={() => setShowFileUploader(showFileUploader === download.id ? null : download.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-xs"
                              >
                                <Upload className="w-3 h-3 mr-1" />
                                رفع ملف
                              </Button>
                            </div>
                            
                            {showFileUploader === download.id && (
                              <div className="mb-2">
                                <FileUploader
                                  onFileUploaded={(url) => {
                                    const filename = url.split('/').pop() || 'file';
                                    handleAddFile(download.id, url, filename);
                                  }}
                                  acceptedTypes={['.zip', '.rar', '.exe', '.apk', '.dmg', '.deb', '.msi', '.tar.gz']}
                                  folder="downloads/files"
                                />
                              </div>
                            )}

                            {download.downloadUrl && (
                              <div className="bg-white/5 p-3 rounded border border-white/20">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Link className="w-4 h-4 text-green-400" />
                                    <span className="text-white text-sm">
                                      {download.filename || 'ملف التنزيل'}
                                    </span>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleRemoveFile(download.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                                <p className="text-gray-400 text-xs mt-1 break-all">
                                  {download.downloadUrl}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
                            حفظ
                          </Button>
                          <Button 
                            onClick={() => {setIsEditing(null); setEditForm({});}} 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            إلغاء
                          </Button>
                        </div>

                        {/* Media Management */}
                        <div className="space-y-4">
                          <h4 className="text-white font-medium">إدارة الوسائط</h4>
                          
                          {/* Images Section */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-white text-sm font-medium">الصور</label>
                              <Button
                                size="sm"
                                onClick={() => setShowImageUploader(showImageUploader === download.id ? null : download.id)}
                                className="bg-green-500 hover:bg-green-600 text-xs"
                              >
                                <Image className="w-3 h-3 mr-1" />
                                إضافة صورة
                              </Button>
                            </div>
                            
                            {showImageUploader === download.id && (
                              <div className="mb-2">
                                <FileUploader
                                  onFileUploaded={(url) => handleAddImage(download.id, url)}
                                  acceptedTypes={['image/*']}
                                  folder="downloads/images"
                                />
                              </div>
                            )}
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {(download.images || []).map((image, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={image}
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-20 object-cover rounded border border-white/20"
                                  />
                                  <button
                                    onClick={() => handleRemoveImage(download.id, image)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Videos Section */}
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <label className="block text-white text-sm font-medium">الفيديوهات</label>
                              <Button
                                size="sm"
                                onClick={() => setShowVideoUploader(showVideoUploader === download.id ? null : download.id)}
                                className="bg-purple-500 hover:bg-purple-600 text-xs"
                              >
                                <Video className="w-3 h-3 mr-1" />
                                إضافة فيديو
                              </Button>
                            </div>
                            
                            {showVideoUploader === download.id && (
                              <div className="mb-2">
                                <FileUploader
                                  onFileUploaded={(url) => handleAddVideo(download.id, url)}
                                  acceptedTypes={['video/*']}
                                  folder="downloads/videos"
                                />
                              </div>
                            )}
                            
                            <div className="space-y-2">
                              {(download.videos || []).map((video, index) => (
                                <div key={index} className="flex items-center justify-between bg-white/5 p-2 rounded border border-white/20">
                                  <div className="flex items-center gap-2">
                                    <Video className="w-4 h-4 text-purple-400" />
                                    <span className="text-white text-sm">فيديو {index + 1}</span>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveVideo(download.id, video)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-gray-300">{download.description}</p>
                        
                        {/* Download URL Display */}
                        {download.downloadUrl && (
                          <div className="bg-green-500/10 border border-green-500/20 rounded p-2">
                            <div className="flex items-center gap-2 text-green-300 text-sm">
                              <Link className="w-4 h-4" />
                              <span>رابط التنزيل متوفر</span>
                              {download.filename && (
                                <span className="text-green-400">({download.filename})</span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Features */}
                        <div className="flex flex-wrap gap-1">
                          {download.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-white/20 text-gray-300">
                              {feature}
                            </Badge>
                          ))}
                          {download.features.length > 3 && (
                            <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                              +{download.features.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between text-sm text-gray-400">
                          <span>التنزيلات: {download.downloads.toLocaleString()}</span>
                          <span>التقييم: {download.rating}</span>
                          <span>الحجم: {download.size}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="passwords" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white">إدارة كلمات مرور التنزيلات</h3>
              <p className="text-gray-400 text-sm">إنشاء وإدارة كلمات مرور متخصصة للفئات المختلفة</p>
              <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-300 text-sm">
                  💡 يمكنك تخصيص كل كلمة مرور لفتح فئة أو عدة فئات محددة فقط
                </p>
              </div>
            </div>
            {canAccess('مبرمج') && (
              <Button onClick={handleAddPassword} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة كلمة مرور
              </Button>
            )}
          </div>

          <div className="grid gap-4">
            {passwords.map((password) => {
              const isCurrentlyEditingPassword = isEditingPassword === password.id;
              const isPasswordVisible = showPassword === password.id;

              return (
                <Card key={password.id} className="bg-white/5 border-white/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Key className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{password.name}</CardTitle>
                          <p className="text-gray-400 text-sm">
                            الفئات المسموحة: {password.allowedCategories.join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={`${password.isActive ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} border`}>
                          {password.isActive ? 'نشط' : 'معطل'}
                        </Badge>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => togglePasswordVisibility(password.id)}
                            className="text-white hover:bg-white/10"
                          >
                            {isPasswordVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditPassword(password)}
                            className="text-white hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          {canAccess('مدير عام') && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeletePassword(password.id)}
                              className="text-red-400 hover:bg-red-500/20"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {isCurrentlyEditingPassword ? (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">الاسم</label>
                            <input
                              type="text"
                              value={passwordEditForm.name || ''}
                              onChange={(e) => setPasswordEditForm({...passwordEditForm, name: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                              placeholder="مثال: كلمة مرور الألعاب"
                            />
                          </div>
                          <div>
                            <label className="block text-white text-sm font-medium mb-2">كلمة المرور</label>
                            <input
                              type="text"
                              value={passwordEditForm.password || ''}
                              onChange={(e) => setPasswordEditForm({...passwordEditForm, password: e.target.value})}
                              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white"
                              placeholder="مثال: games123"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-white text-sm font-medium mb-2">الوصف</label>
                          <textarea
                            value={passwordEditForm.description || ''}
                            onChange={(e) => setPasswordEditForm({...passwordEditForm, description: e.target.value})}
                            className="w-full p-2 bg-white/10 border border-white/20 rounded text-white h-20 resize-none"
                            placeholder="وصف استخدام كلمة المرور"
                          />
                        </div>

                        <div>
                          <label className="block text-white text-sm font-medium mb-3">
                            الفئات المسموحة (يمكن اختيار أكثر من فئة)
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {categories.map(category => (
                              <div key={category} className="flex items-center space-x-2 bg-white/5 p-2 rounded border border-white/10">
                                <input
                                  type="checkbox"
                                  id={`cat-${category}`}
                                  checked={passwordEditForm.allowedCategories?.includes(category) || false}
                                  onChange={(e) => handleCategoryToggle(category, e.target.checked)}
                                  className="rounded border-white/20"
                                />
                                <label htmlFor={`cat-${category}`} className="text-white text-sm cursor-pointer">
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                          <p className="text-gray-400 text-xs mt-2">
                            💡 اختر الفئات التي يمكن لحاملي هذه كلمة المرور الوصول إليها
                          </p>
                        </div>

                        <div className="flex items-center space-x-2 bg-white/5 p-3 rounded border border-white/10">
                          <input
                            type="checkbox"
                            id="active-status"
                            checked={passwordEditForm.isActive || false}
                            onChange={(e) => setPasswordEditForm({...passwordEditForm, isActive: e.target.checked})}
                            className="rounded border-white/20"
                          />
                          <label htmlFor="active-status" className="text-white cursor-pointer">
                            كلمة مرور نشطة
                          </label>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={handleSavePassword} className="bg-green-500 hover:bg-green-600">
                            حفظ
                          </Button>
                          <Button 
                            onClick={() => {setIsEditingPassword(null); setPasswordEditForm({});}} 
                            variant="outline" 
                            className="border-white/20 text-white hover:bg-white/10"
                          >
                            إلغاء
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-sm text-gray-300">
                          <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>كلمة المرور: </span>
                            <code className="bg-gray-800 px-2 py-1 rounded">
                              {isPasswordVisible ? password.password : '••••••••'}
                            </code>
                          </div>
                        </div>
                        
                        {password.description && (
                          <p className="text-gray-300 text-sm">{password.description}</p>
                        )}

                        <div className="flex gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>الاستخدامات: {password.usageCount}</span>
                          </div>
                          {password.lastUsed && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>آخر استخدام: {new Date(password.lastUsed).toLocaleDateString('ar')}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-gray-400 text-sm mb-2">الفئات المسموحة:</p>
                          <div className="flex flex-wrap gap-1">
                            {password.allowedCategories.map((category, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-blue-500/30 text-blue-300 bg-blue-500/10">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-6 mt-6">
          <Card className="bg-white/5 border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                إدارة تحديثات المنتجات
              </CardTitle>
              <CardDescription className="text-gray-300">
                إضافة وإدارة تحديثات المنتجات التي تظهر للمستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add New Update Form */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4 space-y-4">
                <h3 className="text-white font-semibold">إضافة تحديث جديد</h3>
                
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      عنوان التحديث
                    </label>
                    <Input
                      value={newUpdate.title}
                      onChange={(e) => setNewUpdate({...newUpdate, title: e.target.value})}
                      placeholder="مثال: تحديث منتج البيباس"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      رسالة التحديث
                    </label>
                    <Input
                      value={newUpdate.message}
                      onChange={(e) => setNewUpdate({...newUpdate, message: e.target.value})}
                      placeholder="مثال: البيباس محدث الآن بميزات جديدة"
                      className="bg-white/5 border-white/20 text-white"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={newUpdate.isActive}
                      onChange={(e) => setNewUpdate({...newUpdate, isActive: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="text-gray-300 text-sm">
                      نشط (سيظهر للمستخدمين)
                    </label>
                  </div>
                </div>
                
                <Button onClick={addProductUpdate} className="w-full">
                  إضافة التحديث
                </Button>
              </div>

              {/* Updates List */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">التحديثات الحالية</h3>
                
                {productUpdates.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    لا توجد تحديثات حالياً
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productUpdates.map((update) => (
                      <div 
                        key={update.id}
                        className="bg-white/5 border border-white/20 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-white font-medium">{update.title}</h4>
                              <Badge 
                                variant={update.isActive ? "default" : "secondary"}
                                className={update.isActive ? "bg-green-500/20 text-green-300" : "bg-gray-500/20 text-gray-300"}
                              >
                                {update.isActive ? "نشط" : "غير نشط"}
                              </Badge>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{update.message}</p>
                            <p className="text-gray-400 text-xs">
                              تم الإنشاء: {new Date(update.createdAt).toLocaleDateString('ar-SA')}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <Button
                              onClick={() => toggleUpdateStatus(update.id)}
                              variant="outline"
                              size="sm"
                              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
                            >
                              {update.isActive ? "إخفاء" : "إظهار"}
                            </Button>
                            <Button
                              onClick={() => deleteProductUpdate(update.id)}
                              variant="destructive"
                              size="sm"
                            >
                              حذف
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DownloadsTab;
