
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Database, Upload, Save, LogOut } from 'lucide-react';
import StarryBackground from '../components/StarryBackground';
import FileUploader from '../components/FileUploader';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteData } from '@/hooks/useSiteData';
import { useFileUpload } from '@/hooks/useFileUpload';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { data, loading, saving, autoSave } = useSiteData('dashboard');
  const { listUserFiles } = useFileUpload();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [userFiles, setUserFiles] = useState<any[]>([]);

  useEffect(() => {
    if (data) {
      setContent(data.content?.text || '');
      setTitle(data.content?.title || '');
    }
  }, [data]);

  useEffect(() => {
    loadUserFiles();
  }, []);

  const loadUserFiles = async () => {
    const files = await listUserFiles();
    setUserFiles(files);
  };

  const handleContentChange = (field: string, value: string) => {
    if (field === 'content') {
      setContent(value);
    } else if (field === 'title') {
      setTitle(value);
    }

    // Auto-save with debouncing
    autoSave({
      content: {
        text: field === 'content' ? value : content,
        title: field === 'title' ? value : title
      }
    });
  };

  const handleFileUploaded = (url: string) => {
    setContent(prev => prev + `\n\n![صورة](${url})`);
    loadUserFiles();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link to="/" className="text-white hover:text-blue-400 transition-colors">
                  العودة للموقع
                </Link>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse text-white">
                  <User className="w-5 h-5" />
                  <span>{user?.email}</span>
                </div>
                <button
                  onClick={signOut}
                  className="flex items-center space-x-2 space-x-reverse text-red-400 hover:text-red-300 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              لوحة التحكم الشخص
            </h1>
            <p className="text-xl text-gray-300">
              إدارة المحتوى والملفات الخاصة بك
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Content Editor */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <Database className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">محرر المحتوى</h2>
                {saving && (
                  <div className="flex items-center space-x-2 space-x-reverse text-green-400">
                    <Save className="w-4 h-4 animate-pulse" />
                    <span className="text-sm">جاري الحفظ...</span>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    العنوان
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => handleContentChange('title', e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400"
                    placeholder="أدخل العنوان..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    المحتوى
                  </label>
                  <textarea
                    value={content}
                    onChange={(e) => handleContentChange('content', e.target.value)}
                    rows={10}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-400 resize-none"
                    placeholder="اكتب محتواك هنا..."
                  />
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center space-x-2 space-x-reverse mb-4">
                <Upload className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold text-white">رفع الملفات</h2>
              </div>

              <FileUploader
                onFileUploaded={handleFileUploaded}
                folder="dashboard"
              />

              {userFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-white font-medium mb-3">ملفاتك المرفوعة:</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {userFiles.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 space-x-reverse text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>{file.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          {(title || content) && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">معاينة المحتوى</h2>
              <div className="bg-white/5 rounded-lg p-4">
                {title && (
                  <h3 className="text-2xl font-bold text-white mb-4">{title}</h3>
                )}
                {content && (
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {content}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
