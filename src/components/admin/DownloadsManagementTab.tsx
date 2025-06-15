
import React, { useState } from 'react';
import { Download, Key, Clock, Settings, Eye, EyeOff, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { SiteSettings } from '../../types/admin';

interface DownloadPassword {
  id: number;
  name: string;
  password: string;
  expiryDate: string;
  isActive: boolean;
  downloadLimit: number;
  usedCount: number;
}

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
  const [activeSection, setActiveSection] = useState('texts');
  const [passwords, setPasswords] = useState<DownloadPassword[]>([
    {
      id: 1,
      name: 'كلمة مرور عامة',
      password: 'DARK2024',
      expiryDate: '2024-12-31',
      isActive: true,
      downloadLimit: 100,
      usedCount: 25
    },
    {
      id: 2,
      name: 'كلمة مرور VIP',
      password: 'DARKVIP',
      expiryDate: '2024-06-30',
      isActive: false,
      downloadLimit: 50,
      usedCount: 45
    }
  ]);

  const updateDownloadTexts = (field: string, value: any) => {
    setSiteSettings({
      ...siteSettings,
      pageTexts: {
        ...siteSettings.pageTexts,
        downloads: {
          ...siteSettings.pageTexts.downloads,
          [field]: value
        }
      }
    });
  };

  const addPassword = () => {
    const newPassword: DownloadPassword = {
      id: Date.now(),
      name: 'كلمة مرور جديدة',
      password: `DARK${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      downloadLimit: 50,
      usedCount: 0
    };
    setPasswords([...passwords, newPassword]);
    toast({
      title: "تم إضافة كلمة مرور جديدة",
      description: "تم إنشاء كلمة مرور جديدة بنجاح"
    });
  };

  const togglePasswordStatus = (id: number) => {
    setPasswords(passwords.map(pwd => 
      pwd.id === id ? { ...pwd, isActive: !pwd.isActive } : pwd
    ));
  };

  const deletePassword = (id: number) => {
    setPasswords(passwords.filter(pwd => pwd.id !== id));
    toast({
      title: "تم حذف كلمة المرور",
      description: "تم حذف كلمة المرور بنجاح"
    });
  };

  const handleSave = () => {
    saveSiteSettings();
    toast({
      title: "تم الحفظ بنجاح",
      description: "تم حفظ جميع التغييرات"
    });
  };

  const renderTextsSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">نصوص صفحة التنزيلات</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white text-sm font-medium mb-2">عنوان الصفحة</label>
          <input
            type="text"
            value={siteSettings.pageTexts.downloads?.title || ''}
            onChange={(e) => updateDownloadTexts('title', e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            placeholder="عنوان صفحة التنزيلات"
          />
        </div>
        
        <div>
          <label className="block text-white text-sm font-medium mb-2">العنوان الفرعي</label>
          <input
            type="text"
            value={siteSettings.pageTexts.downloads?.subtitle || ''}
            onChange={(e) => updateDownloadTexts('subtitle', e.target.value)}
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
            placeholder="العنوان الفرعي"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <h4 className="text-lg font-semibold text-white mb-4 col-span-full">فئات التنزيلات</h4>
        
        {Object.entries(siteSettings.pageTexts.downloads?.categories || {}).map(([key, value]) => (
          <div key={key}>
            <label className="block text-white text-sm font-medium mb-2 capitalize">
              {key === 'all' ? 'الكل' : 
               key === 'games' ? 'الألعاب' :
               key === 'tools' ? 'الأدوات' :
               key === 'design' ? 'التصميم' :
               key === 'programming' ? 'البرمجة' :
               key === 'music' ? 'الموسيقى' :
               key === 'video' ? 'الفيديو' :
               key === 'books' ? 'الكتب' :
               key === 'security' ? 'الأمان' : key}
            </label>
            <input
              type="text"
              value={value || ''}
              onChange={(e) => updateDownloadTexts('categories', {
                ...siteSettings.pageTexts.downloads?.categories,
                [key]: e.target.value
              })}
              className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPasswordsSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">إدارة كلمات المرور</h3>
        <Button onClick={addPassword} className="bg-blue-500 hover:bg-blue-600">
          <Plus className="w-4 h-4 mr-2" />
          إضافة كلمة مرور
        </Button>
      </div>

      <div className="grid gap-4">
        {passwords.map((password) => (
          <Card key={password.id} className="bg-white/5 border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Key className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{password.name}</CardTitle>
                    <p className="text-gray-400 text-sm">كلمة المرور: {password.password}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={password.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                    {password.isActive ? 'نشط' : 'معطل'}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => togglePasswordStatus(password.id)}
                    className="text-white hover:bg-white/10"
                  >
                    {password.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => deletePassword(password.id)}
                    className="text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <Clock className="w-4 h-4" />
                  <span>انتهاء: {password.expiryDate}</span>
                </div>
                <div className="text-gray-300">
                  الحد الأقصى: {password.downloadLimit}
                </div>
                <div className="text-gray-300">
                  المستخدم: {password.usedCount}/{password.downloadLimit}
                </div>
              </div>
              
              <div className="mt-3 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${(password.usedCount / password.downloadLimit) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">إدارة التنزيلات</h2>
          <p className="text-gray-400">التحكم في نصوص صفحة التنزيلات وكلمات المرور</p>
        </div>
        <Button onClick={handleSave} className="bg-green-500 hover:bg-green-600">
          حفظ التغييرات
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setActiveSection('texts')}
          className={`${activeSection === 'texts' ? 'bg-blue-500' : 'bg-white/10'} hover:bg-blue-600`}
        >
          <Settings className="w-4 h-4 mr-2" />
          النصوص
        </Button>
        <Button
          onClick={() => setActiveSection('passwords')}
          className={`${activeSection === 'passwords' ? 'bg-blue-500' : 'bg-white/10'} hover:bg-blue-600`}
        >
          <Key className="w-4 h-4 mr-2" />
          كلمات المرور
        </Button>
      </div>

      {activeSection === 'texts' && renderTextsSection()}
      {activeSection === 'passwords' && renderPasswordsSection()}
    </div>
  );
};

export default DownloadsManagementTab;
