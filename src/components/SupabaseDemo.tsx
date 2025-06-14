
import React, { useState } from 'react';
import { useSupabaseFeatures } from '@/hooks/useSupabaseFeatures';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Save, Database, User, FileText } from 'lucide-react';

const SupabaseDemo = () => {
  const {
    content,
    files,
    isLoading,
    isSaving,
    isUploading,
    updateContent,
    handleFileUpload,
    user,
    isAuthenticated
  } = useSupabaseFeatures('demo');

  const [title, setTitle] = useState(content.title || '');
  const [text, setText] = useState(content.text || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSave = async () => {
    await updateContent({ title, text });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await handleFileUpload(selectedFile, 'demo');
      setSelectedFile(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-6 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">يجب تسجيل الدخول لاستخدام ميزات Supabase</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>جاري التحميل...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* معلومات المستخدم */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            معلومات المستخدم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>البريد الإلكتروني:</strong> {user?.email}</p>
          <p><strong>معرف المستخدم:</strong> {user?.id}</p>
          <p><strong>تم التحقق:</strong> {user?.email_confirmed_at ? 'نعم' : 'لا'}</p>
        </CardContent>
      </Card>

      {/* محرر المحتوى */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            محرر المحتوى
            {isSaving && (
              <span className="text-sm text-green-600 flex items-center gap-1">
                <Save className="w-4 h-4 animate-pulse" />
                جاري الحفظ...
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="العنوان"
            className="w-full"
          />
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="المحتوى"
            rows={6}
            className="w-full"
          />
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="w-4 h-4 mr-2" />
            حفظ المحتوى
          </Button>
        </CardContent>
      </Card>

      {/* رفع الملفات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            رفع الملفات
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="file"
            onChange={handleFileSelect}
            accept="image/*,application/pdf,.txt"
            className="w-full"
          />
          {selectedFile && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                ملف مختار: {selectedFile.name}
              </span>
              <Button 
                onClick={handleUpload} 
                disabled={isUploading}
                size="sm"
              >
                {isUploading ? 'جاري الرفع...' : 'رفع'}
              </Button>
            </div>
          )}
          
          {files.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">الملفات المرفوعة:</h4>
              <div className="space-y-1">
                {files.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {file.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* قاعدة البيانات */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            حالة قاعدة البيانات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>الحفظ التلقائي:</strong> 
              <span className="text-green-600 ml-2">مفعل</span>
            </div>
            <div>
              <strong>التخزين السحابي:</strong> 
              <span className="text-green-600 ml-2">متصل</span>
            </div>
            <div>
              <strong>المصادقة:</strong> 
              <span className="text-green-600 ml-2">مفعلة</span>
            </div>
            <div>
              <strong>عدد الملفات:</strong> 
              <span className="text-blue-600 ml-2">{files.length}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupabaseDemo;
