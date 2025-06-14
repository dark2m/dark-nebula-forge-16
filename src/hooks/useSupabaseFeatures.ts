
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSiteData } from './useSiteData';
import { useFileUpload } from './useFileUpload';
import { useToast } from '@/hooks/use-toast';

interface SupabaseFeaturesData {
  content: any;
  files: any[];
  isLoading: boolean;
  isSaving: boolean;
}

export const useSupabaseFeatures = (pageName: string = 'default') => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { data, loading, saving, saveData, autoSave } = useSiteData(pageName);
  const { uploadFile, listUserFiles, uploading } = useFileUpload();
  const [files, setFiles] = useState<any[]>([]);

  // تحميل ملفات المستخدم
  useEffect(() => {
    const loadFiles = async () => {
      if (user) {
        const userFiles = await listUserFiles();
        setFiles(userFiles);
      }
    };
    loadFiles();
  }, [user, listUserFiles]);

  // حفظ المحتوى مع التحديث التلقائي
  const updateContent = async (newContent: any) => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive"
      });
      return false;
    }

    try {
      await autoSave({ content: newContent });
      return true;
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ المحتوى",
        variant: "destructive"
      });
      return false;
    }
  };

  // رفع ملف جديد
  const handleFileUpload = async (file: File, folder: string = 'general') => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive"
      });
      return null;
    }

    try {
      const url = await uploadFile(file, folder);
      if (url) {
        // تحديث قائمة الملفات
        const updatedFiles = await listUserFiles();
        setFiles(updatedFiles);
        
        toast({
          title: "تم الرفع بنجاح",
          description: `تم رفع الملف: ${file.name}`
        });
      }
      return url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطأ في الرفع",
        description: "حدث خطأ أثناء رفع الملف",
        variant: "destructive"
      });
      return null;
    }
  };

  return {
    // بيانات المحتوى
    content: data?.content || {},
    layoutSettings: data?.layout_settings || {},
    
    // الملفات
    files,
    
    // حالة التحميل والحفظ
    isLoading: loading,
    isSaving: saving,
    isUploading: uploading,
    
    // وظائف التحديث
    updateContent,
    saveData,
    handleFileUpload,
    
    // معلومات المستخدم
    user,
    isAuthenticated: !!user
  };
};
