
import React, { useState } from 'react';
import { Download, Package, Shield, FileText, Plus, Edit, Trash2, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import DownloadService from '../../utils/downloadService';
import type { DownloadItem } from '../../types/downloads';

interface DownloadsTabProps {
  canAccess: (role: 'مدير عام' | 'مبرمج' | 'مشرف') => boolean;
}

const DownloadsTab: React.FC<DownloadsTabProps> = ({ canAccess }) => {
  const { toast } = useToast();
  const [downloads, setDownloads] = useState<DownloadItem[]>(DownloadService.getDownloads());
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<DownloadItem>>({});

  const availableIcons = [
    { name: 'Shield', component: Shield, label: 'درع' },
    { name: 'Package', component: Package, label: 'حزمة' },
    { name: 'FileText', component: FileText, label: 'ملف نصي' },
    { name: 'Download', component: Download, label: 'تنزيل' },
    { name: 'Star', component: Star, label: 'نجمة' }
  ];

  const categories = ['ألعاب', 'أدوات', 'تصميم', 'برمجة'];
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
      category: "أدوات",
      size: "1.0 MB",
      downloads: 0,
      rating: 5.0,
      version: "1.0.0",
      lastUpdate: "الآن",
      features: ["ميزة 1"],
      status: "جديد",
      icon: 'Package'
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "جديد": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "محدث": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "شائع": return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">إدارة التنزيلات</h2>
          <p className="text-gray-400">إضافة وتعديل منتجات التنزيل</p>
        </div>
        {canAccess('مبرمج') && (
          <Button onClick={handleAdd} className="bg-blue-500 hover:bg-blue-600">
            <Plus className="w-4 h-4 mr-2" />
            إضافة منتج
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {downloads.map((download) => {
          const IconComponent = availableIcons.find(icon => icon.name === download.icon)?.component || Package;
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
                            <option key={cat} value={cat}>{cat}</option>
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
                            <option key={status} value={status}>{status}</option>
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
                            <option key={icon.name} value={icon.name}>{icon.label}</option>
                          ))}
                        </select>
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
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-300">{download.description}</p>
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
    </div>
  );
};

export default DownloadsTab;
