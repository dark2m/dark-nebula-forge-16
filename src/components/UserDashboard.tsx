
import React, { useState } from 'react';
import { useSupabaseFeatures } from '@/hooks/useSupabaseFeatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, Save, Upload, FileText, Loader2, Shield } from 'lucide-react';
import FileUploader from './FileUploader';

const UserDashboard = () => {
  const {
    user,
    content,
    files,
    isLoading,
    isSaving,
    isUploading,
    updateContent,
    handleFileUpload,
    isAuthenticated
  } = useSupabaseFeatures('dashboard');

  const [formData, setFormData] = useState({
    title: content.title || '',
    description: content.description || '',
    settings: content.settings || {}
  });

  React.useEffect(() => {
    setFormData({
      title: content.title || '',
      description: content.description || '',
      settings: content.settings || {}
    });
  }, [content]);

  const handleSave = async () => {
    await updateContent(formData);
  };

  const handleFileUploadComplete = (url: string) => {
    console.log('File uploaded successfully:', url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-bold text-white mb-2">غير مصرح</h2>
            <p className="text-gray-400 mb-4">يجب تسجيل الدخول للوصول لهذه الصفحة</p>
            <Button 
              onClick={() => window.location.href = '/sport'}
              className="w-full"
            >
              تسجيل الدخول
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white">جاري تحميل بياناتك...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <User className="w-6 h-6 text-blue-400" />
              لوحة تحكم المستخدم
              {isSaving && (
                <span className="text-sm text-green-400 flex items-center gap-1">
                  <Save className="w-4 h-4 animate-pulse" />
                  جاري الحفظ...
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  مرحباً {user?.user_metadata?.username || user?.email?.split('@')[0]}
                </h2>
                <p className="text-gray-400">
                  آخر تحديث: {new Date().toLocaleDateString('ar-SA')}
                </p>
              </div>
              <div className="text-sm text-gray-400">
                <p>المعرف: {user?.id?.slice(0, 8)}...</p>
                <p>البريد: {user?.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="w-5 h-5" />
                محرر المحتوى
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  العنوان
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="أدخل العنوان"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  الوصف
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="أدخل الوصف"
                  rows={4}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    حفظ التغييرات
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* File Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Upload className="w-5 h-5" />
                إدارة الملفات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FileUploader
                onFileUploaded={handleFileUploadComplete}
                folder="dashboard"
                acceptedTypes={['image/*', 'video/*', 'application/pdf', '.txt']}
                maxSize={10}
              />

              {/* Files List */}
              {files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    الملفات المرفوعة ({files.length})
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-white">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(file.created_at).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">إحصائيات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">{files.length}</div>
                <div className="text-sm text-gray-400">الملفات</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  {content.title ? '✓' : '×'}
                </div>
                <div className="text-sm text-gray-400">العنوان</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">
                  {user?.email_confirmed_at ? '✓' : '×'}
                </div>
                <div className="text-sm text-gray-400">التحقق</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">
                  {new Date().getDate()}
                </div>
                <div className="text-sm text-gray-400">اليوم</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
