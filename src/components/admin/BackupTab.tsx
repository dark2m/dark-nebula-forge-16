
import React, { useState } from 'react';
import { Download, Upload, Save, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductService } from '../../utils/productService';
import { SettingsService } from '../../utils/settingsService';
import { LocalStorageService } from '../../utils/localStorageService';
import { useToast } from '@/hooks/use-toast';

const BackupTab = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  const exportData = async () => {
    setIsExporting(true);
    try {
      const products = ProductService.getProducts();
      const settings = SettingsService.getSiteSettings();
      const adminUsers = LocalStorageService.getAdminUsers();
      
      const backupData = {
        products,
        settings,
        adminUsers,
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `site-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "تم تصدير النسخة الاحتياطية",
        description: "تم تصدير جميع بيانات الموقع بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backupData = JSON.parse(e.target?.result as string);
        
        if (backupData.products) {
          LocalStorageService.saveProducts(backupData.products);
        }
        if (backupData.settings) {
          LocalStorageService.saveSiteSettings(backupData.settings);
        }
        if (backupData.adminUsers) {
          LocalStorageService.saveAdminUsers(backupData.adminUsers);
        }

        toast({
          title: "تم استيراد النسخة الاحتياطية",
          description: "تم استيراد جميع البيانات بنجاح"
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } catch (error) {
        toast({
          title: "خطأ في الاستيراد",
          description: "تأكد من صحة ملف النسخة الاحتياطية",
          variant: "destructive"
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">النسخ الاحتياطية</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="admin-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            تصدير البيانات
          </h3>
          <p className="text-gray-400 mb-4">
            قم بتصدير جميع بيانات الموقع كنسخة احتياطية
          </p>
          <Button
            onClick={exportData}
            disabled={isExporting}
            className="w-full glow-button"
          >
            {isExporting ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-spin" />
                جاري التصدير...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                تصدير النسخة الاحتياطية
              </>
            )}
          </Button>
        </div>

        {/* Import Section */}
        <div className="admin-card rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5" />
            استيراد البيانات
          </h3>
          <p className="text-gray-400 mb-4">
            قم بتحميل نسخة احتياطية لاستعادة البيانات
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="font-medium">تحذير</span>
              </div>
              <p className="text-sm text-yellow-300">
                سيتم استبدال جميع البيانات الحالية بالبيانات المستوردة
              </p>
            </div>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              disabled={isImporting}
              className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2"
            />
          </div>
        </div>
      </div>

      {/* Backup Info */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          معلومات النسخ الاحتياطية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-blue-400 font-medium">المنتجات</div>
            <div className="text-gray-300">{ProductService.getProducts().length} منتج</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-green-400 font-medium">المستخدمين</div>
            <div className="text-gray-300">{LocalStorageService.getAdminUsers().length} مستخدم</div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg">
            <div className="text-purple-400 font-medium">الإعدادات</div>
            <div className="text-gray-300">محفوظة محلياً</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupTab;
