
import React, { useState } from 'react';
import { Download, Upload, Save, RotateCcw, Database, AlertTriangle } from 'lucide-react';
import { SiteSettings } from '../../types/admin';
import { useToast } from '@/hooks/use-toast';
import ProductService from '../../utils/productService';
import SettingsService from '../../utils/settingsService';

interface BackupTabProps {
  siteSettings: SiteSettings;
  setSiteSettings: (settings: SiteSettings) => void;
}

const BackupTab: React.FC<BackupTabProps> = ({ siteSettings, setSiteSettings }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createFullBackup = () => {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        version: '1.0',
        data: {
          siteSettings,
          products: ProductService.getProducts(),
          adminUsers: JSON.parse(localStorage.getItem('admin_users') || '[]')
        }
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dark-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: "تم إنشاء النسخة الاحتياطية",
        description: "تم تصدير جميع البيانات بنجاح"
      });
    } catch (error) {
      toast({
        title: "خطأ في النسخ الاحتياطي",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive"
      });
    }
  };

  const restoreFromBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        
        if (backup.data) {
          // استعادة الإعدادات
          if (backup.data.siteSettings) {
            SettingsService.saveSiteSettings(backup.data.siteSettings);
            setSiteSettings(backup.data.siteSettings);
          }
          
          // استعادة المنتجات
          if (backup.data.products) {
            ProductService.saveProducts(backup.data.products);
          }
          
          // استعادة المستخدمين
          if (backup.data.adminUsers) {
            localStorage.setItem('admin_users', JSON.stringify(backup.data.adminUsers));
          }

          toast({
            title: "تم استعادة النسخة الاحتياطية",
            description: "تم استعادة جميع البيانات بنجاح"
          });
        }
      } catch (error) {
        toast({
          title: "خطأ في الاستعادة",
          description: "تأكد من صحة ملف النسخة الاحتياطية",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات إلى الوضع الافتراضي؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      // حذف جميع البيانات المحفوظة
      localStorage.removeItem('site_settings');
      localStorage.removeItem('products');
      localStorage.removeItem('cart_pubg');
      localStorage.removeItem('cart_web');
      localStorage.removeItem('cart_discord');
      
      // إعادة تحميل الصفحة لتطبيق الإعدادات الافتراضية
      window.location.reload();
    }
  };

  const exportSettings = () => {
    const settingsBlob = new Blob([JSON.stringify(siteSettings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(settingsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "تم تصدير الإعدادات",
      description: "تم تصدير إعدادات الموقع فقط"
    });
  };

  const exportProducts = () => {
    const products = ProductService.getProducts();
    const productsBlob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(productsBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "تم تصدير المنتجات",
      description: "تم تصدير جميع المنتجات بنجاح"
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white">النسخ الاحتياطي والاستعادة</h2>
      
      {/* نسخة احتياطية كاملة */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          نسخة احتياطية كاملة
        </h3>
        <p className="text-gray-300 mb-4">
          إنشاء نسخة احتياطية شاملة تتضمن جميع الإعدادات والمنتجات والمستخدمين
        </p>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={createFullBackup}
            className="glow-button flex items-center space-x-2 rtl:space-x-reverse"
          >
            <Download className="w-4 h-4" />
            <span>إنشاء نسخة احتياطية كاملة</span>
          </button>
          
          <label className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg cursor-pointer transition-colors">
            <Upload className="w-4 h-4" />
            <span>استعادة من نسخة احتياطية</span>
            <input
              type="file"
              accept=".json"
              onChange={restoreFromBackup}
              className="hidden"
              disabled={isLoading}
            />
          </label>
        </div>
      </div>

      {/* تصدير منفصل */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Save className="w-5 h-5" />
          تصدير منفصل
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportSettings}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير الإعدادات فقط</span>
          </button>
          
          <button
            onClick={exportProducts}
            className="flex items-center justify-center space-x-2 rtl:space-x-reverse px-4 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تصدير المنتجات فقط</span>
          </button>
        </div>
      </div>

      {/* إعادة تعيين */}
      <div className="admin-card rounded-xl p-6 border border-red-500/30">
        <h3 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          منطقة خطر
        </h3>
        <p className="text-gray-300 mb-4">
          إعادة تعيين جميع البيانات إلى الوضع الافتراضي. هذا الإجراء لا يمكن التراجع عنه.
        </p>
        <button
          onClick={resetToDefaults}
          className="flex items-center space-x-2 rtl:space-x-reverse px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>إعادة تعيين كاملة</span>
        </button>
      </div>

      {/* معلومات التخزين */}
      <div className="admin-card rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">معلومات التخزين</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-blue-400 font-semibold mb-2">المنتجات</h4>
            <p className="text-white">{ProductService.getProducts().length} منتج</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-green-400 font-semibold mb-2">عناصر التنقل</h4>
            <p className="text-white">{siteSettings.navigation?.length || 0} عنصر</p>
          </div>
          
          <div className="p-4 bg-white/5 rounded-lg">
            <h4 className="text-purple-400 font-semibold mb-2">المميزات</h4>
            <p className="text-white">{siteSettings.pageTexts?.home?.features?.length || 0} ميزة</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupTab;
