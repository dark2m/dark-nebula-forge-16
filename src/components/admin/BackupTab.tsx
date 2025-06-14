import React, { useState, useEffect } from 'react';
import { Save, Download, Upload, Trash2, AlertTriangle, Clock, CheckCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import AdminStorage from '../../utils/adminStorage';
import type { SiteSettings, Product } from '../../types/admin';

interface BackupTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
  saveSiteSettings: () => void;
}

const BackupTab: React.FC<BackupTabProps> = ({
  siteSettings,
  setSiteSettings,
  saveSiteSettings
}) => {
  const { toast } = useToast();
  const [backups, setBackups] = useState<Array<{key: string, timestamp: string, data: any}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    loadBackups();
    loadProducts();
  }, []);

  const loadBackups = () => {
    try {
      const availableBackups = AdminStorage.getBackups();
      setBackups(availableBackups);
    } catch (error) {
      console.error('Error loading backups:', error);
      toast({
        title: "خطأ في تحميل النسخ الاحتياطية",
        description: "حدث خطأ أثناء تحميل النسخ الاحتياطية",
        variant: "destructive"
      });
    }
  };

  const loadProducts = async () => {
    try {
      const loadedProducts = await AdminStorage.getProducts();
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setProducts([]);
    }
  };

  const createBackup = async () => {
    setIsLoading(true);
    try {
      const backupKey = await AdminStorage.createBackup();
      
      toast({
        title: "تم إنشاء النسخة الاحتياطية",
        description: `تم إنشاء نسخة احتياطية بنجاح: ${backupKey}`
      });
      
      loadBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast({
        title: "خطأ في إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const restoreBackup = async (backupKey: string) => {
    setIsLoading(true);
    try {
      await AdminStorage.restoreBackup(backupKey);
      
      // Reload data after restoration
      const restoredSettings = await AdminStorage.getSettings();
      setSiteSettings(restoredSettings);
      await loadProducts();
      
      toast({
        title: "تم استعادة النسخة الاحتياطية",
        description: "تم استعادة النسخة الاحتياطية بنجاح"
      });
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast({
        title: "خطأ في استعادة النسخة الاحتياطية",
        description: "حدث خطأ أثناء استعادة النسخة الاحتياطية",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBackup = (backupKey: string) => {
    try {
      AdminStorage.deleteBackup(backupKey);
      loadBackups();
      
      toast({
        title: "تم حذف النسخة الاحتياطية",
        description: "تم حذف النسخة الاحتياطية بنجاح"
      });
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast({
        title: "خطأ في حذف النسخة الاحتياطية",
        description: "حدث خطأ أثناء حذف النسخة الاحتياطية",
        variant: "destructive"
      });
    }
  };

  const exportData = async () => {
    try {
      const exportedData = await AdminStorage.exportData();
      const blob = new Blob([exportedData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dark-admin-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "تم تصدير البيانات",
        description: "تم تصدير جميع البيانات بنجاح"
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "خطأ في تصدير البيانات",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    }
  };

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      await AdminStorage.importData(text);
      
      // Reload all data after import
      const importedSettings = await AdminStorage.getSettings();
      setSiteSettings(importedSettings);
      await loadProducts();
      loadBackups();
      
      toast({
        title: "تم استيراد البيانات",
        description: "تم استيراد جميع البيانات بنجاح"
      });
    } catch (error) {
      console.error('Error importing data:', error);
      toast({
        title: "خطأ في استيراد البيانات",
        description: "حدث خطأ أثناء استيراد البيانات. تأكد من صحة الملف.",
        variant: "destructive"
      });
    }
    
    // Reset file input
    event.target.value = '';
  };

  const clearAllData = async () => {
    if (!window.confirm('هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!')) {
      return;
    }

    setIsLoading(true);
    try {
      await AdminStorage.clearAllData();
      
      // Reload default data
      const defaultSettings = await AdminStorage.getSettings();
      setSiteSettings(defaultSettings);
      setProducts([]);
      loadBackups();
      
      toast({
        title: "تم حذف جميع البيانات",
        description: "تم حذف جميع البيانات وإعادة تعيين الإعدادات الافتراضية"
      });
    } catch (error) {
      console.error('Error clearing data:', error);
      toast({
        title: "خطأ في حذف البيانات",
        description: "حدث خطأ أثناء حذف البيانات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString('ar-SA');
    } catch {
      return timestamp;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">النسخ الاحتياطية والتصدير</h2>
          <p className="text-gray-400">إدارة النسخ الاحتياطية وتصدير/استيراد البيانات</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={createBackup} disabled={isLoading} className="glow-button">
            {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            إنشاء نسخة احتياطية
          </Button>
          <Button onClick={saveSiteSettings} className="glow-button">
            <Save className="w-4 h-4 mr-2" />
            حفظ الإعدادات الحالية
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">عدد النسخ الاحتياطية</p>
                <p className="text-2xl font-bold text-white">{backups.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">عدد المنتجات</p>
                <p className="text-2xl font-bold text-white">{products.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/20 backdrop-blur-sm border-white/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">حالة البيانات</p>
                <p className="text-lg font-bold text-green-400">محفوظة</p>
              </div>
              <Save className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">النسخ الاحتياطية المتوفرة</h3>
        {backups.length === 0 ? (
          <div className="bg-white/10 p-4 rounded-lg text-center text-gray-400">
            لا توجد نسخ احتياطية متوفرة.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {backups.map((backup) => (
              <Card key={backup.key} className="bg-white/20 backdrop-blur-sm border-white/30">
                <CardHeader>
                  <CardTitle className="text-white">
                    {formatDate(backup.timestamp)}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    تاريخ الإنشاء: {formatDate(backup.timestamp)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <Button onClick={() => restoreBackup(backup.key)} variant="secondary" className="w-1/2 mr-1">
                      <Upload className="w-4 h-4 mr-2" />
                      استعادة
                    </Button>
                    <Button onClick={() => deleteBackup(backup.key)} variant="destructive" className="w-1/2 ml-1">
                      <Trash2 className="w-4 h-4 mr-2" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Export/Import */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">تصدير واستيراد البيانات</h3>
        <p className="text-gray-400">تصدير جميع البيانات إلى ملف أو استيرادها من ملف</p>
        <div className="flex gap-4">
          <Button onClick={exportData} className="glow-button">
            <Download className="w-4 h-4 mr-2" />
            تصدير البيانات
          </Button>
          <Input
            type="file"
            id="import-data"
            className="hidden"
            onChange={handleImportData}
          />
          <Label htmlFor="import-data" className="glow-button cursor-pointer flex items-center justify-center">
            <Upload className="w-4 h-4 mr-2" />
            استيراد البيانات
          </Label>
        </div>
      </div>

      {/* Clear Data */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">إعادة تعيين البيانات</h3>
        <p className="text-gray-400">حذف جميع البيانات وإعادة تعيين الإعدادات الافتراضية</p>
        <Button onClick={clearAllData} variant="destructive" disabled={isLoading} className="glow-button">
          {isLoading ? <AlertTriangle className="w-4 h-4 mr-2 animate-pulse" /> : <AlertTriangle className="w-4 h-4 mr-2" />}
          حذف جميع البيانات
        </Button>
      </div>
    </div>
  );
};

export default BackupTab;
