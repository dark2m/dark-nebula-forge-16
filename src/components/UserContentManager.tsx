
import React, { useState } from 'react';
import { useSupabaseFeatures } from '@/hooks/useSupabaseFeatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Settings, Image, Save, Loader2 } from 'lucide-react';
import FileUploader from './FileUploader';

interface UserContentManagerProps {
  pageName: string;
  title?: string;
}

const UserContentManager: React.FC<UserContentManagerProps> = ({ 
  pageName, 
  title = 'إدارة المحتوى' 
}) => {
  const {
    user,
    content,
    layoutSettings,
    files,
    isLoading,
    isSaving,
    updateContent,
    handleFileUpload,
    isAuthenticated
  } = useSupabaseFeatures(pageName);

  const [contentData, setContentData] = useState({
    title: '',
    subtitle: '',
    description: '',
    customContent: ''
  });

  const [layoutData, setLayoutData] = useState({
    theme: 'dark',
    showHeader: true,
    showFooter: true,
    layout: 'default'
  });

  React.useEffect(() => {
    if (content) {
      setContentData({
        title: content.title || '',
        subtitle: content.subtitle || '',
        description: content.description || '',
        customContent: content.customContent || ''
      });
    }
  }, [content]);

  React.useEffect(() => {
    if (layoutSettings) {
      setLayoutData({
        theme: layoutSettings.theme || 'dark',
        showHeader: layoutSettings.showHeader ?? true,
        showFooter: layoutSettings.showFooter ?? true,
        layout: layoutSettings.layout || 'default'
      });
    }
  }, [layoutSettings]);

  const handleContentSave = async () => {
    await updateContent({
      ...contentData,
      layout_settings: layoutData
    });
  };

  const handleImageUpload = async (file: File) => {
    const url = await handleFileUpload(file, 'images');
    if (url) {
      setContentData(prev => ({
        ...prev,
        customContent: prev.customContent + `\n![Image](${url})`
      }));
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <p className="text-gray-400">يجب تسجيل الدخول لإدارة المحتوى</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto mt-8">
        <CardContent className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-400">جاري تحميل المحتوى...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6" />
              {title} - {pageName}
            </div>
            {isSaving && (
              <span className="text-sm text-green-400 flex items-center gap-1">
                <Save className="w-4 h-4 animate-pulse" />
                جاري الحفظ...
              </span>
            )}
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="content" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">المحتوى</TabsTrigger>
          <TabsTrigger value="layout">التصميم</TabsTrigger>
          <TabsTrigger value="media">الملفات</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">تحرير المحتوى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    العنوان الرئيسي
                  </label>
                  <Input
                    value={contentData.title}
                    onChange={(e) => setContentData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="أدخل العنوان الرئيسي"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    العنوان الفرعي
                  </label>
                  <Input
                    value={contentData.subtitle}
                    onChange={(e) => setContentData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="أدخل العنوان الفرعي"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الوصف
                </label>
                <Textarea
                  value={contentData.description}
                  onChange={(e) => setContentData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل وصف الصفحة"
                  rows={3}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  محتوى مخصص
                </label>
                <Textarea
                  value={contentData.customContent}
                  onChange={(e) => setContentData(prev => ({ ...prev, customContent: e.target.value }))}
                  placeholder="أدخل محتوى إضافي (يدعم Markdown)"
                  rows={6}
                  className="bg-gray-800 border-gray-700 text-white font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout Tab */}
        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Settings className="w-5 h-5" />
                إعدادات التصميم
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    المظهر
                  </label>
                  <select
                    value={layoutData.theme}
                    onChange={(e) => setLayoutData(prev => ({ ...prev, theme: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  >
                    <option value="dark">داكن</option>
                    <option value="light">فاتح</option>
                    <option value="auto">تلقائي</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    تخطيط الصفحة
                  </label>
                  <select
                    value={layoutData.layout}
                    onChange={(e) => setLayoutData(prev => ({ ...prev, layout: e.target.value }))}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-md text-white"
                  >
                    <option value="default">افتراضي</option>
                    <option value="centered">وسط</option>
                    <option value="wide">عريض</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={layoutData.showHeader}
                    onChange={(e) => setLayoutData(prev => ({ ...prev, showHeader: e.target.checked }))}
                    className="rounded border-gray-700 bg-gray-800"
                  />
                  <span className="text-gray-300">إظهار الرأس</span>
                </label>

                <label className="flex items-center space-x-3 rtl:space-x-reverse">
                  <input
                    type="checkbox"
                    checked={layoutData.showFooter}
                    onChange={(e) => setLayoutData(prev => ({ ...prev, showFooter: e.target.checked }))}
                    className="rounded border-gray-700 bg-gray-800"
                  />
                  <span className="text-gray-300">إظهار التذييل</span>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Image className="w-5 h-5" />
                إدارة الملفات والصور
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                onFileUploaded={(url) => console.log('File uploaded:', url)}
                folder={`content/${pageName}`}
                acceptedTypes={['image/*', 'video/*', 'application/pdf']}
                maxSize={20}
              />

              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    الملفات المرفوعة ({files.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Image className="w-4 h-4 text-blue-400" />
                          <span className="text-xs text-white truncate">{file.name}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(file.created_at).toLocaleDateString('ar-SA')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <Card>
        <CardContent className="p-4">
          <Button 
            onClick={handleContentSave} 
            disabled={isSaving}
            className="w-full"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                حفظ جميع التغييرات
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserContentManager;
