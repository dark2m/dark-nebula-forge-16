
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder: string = 'general'): Promise<string | null> => {
    if (!user) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${folder}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('user-files')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('user-files')
        .getPublicUrl(fileName);

      toast({
        title: "تم الرفع",
        description: "تم رفع الملف بنجاح"
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "خطأ في الرفع",
        description: "حدث خطأ أثناء رفع الملف",
        variant: "destructive"
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (filePath: string): Promise<boolean> => {
    if (!user) return false;

    try {
      const { error } = await supabase.storage
        .from('user-files')
        .remove([filePath]);

      if (error) throw error;

      toast({
        title: "تم الحذف",
        description: "تم حذف الملف بنجاح"
      });

      return true;
    } catch (error) {
      console.error('Error deleting file:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف الملف",
        variant: "destructive"
      });
      return false;
    }
  };

  const listUserFiles = async (folder: string = ''): Promise<any[]> => {
    if (!user) return [];

    try {
      const folderPath = folder ? `${user.id}/${folder}` : `${user.id}`;
      
      const { data, error } = await supabase.storage
        .from('user-files')
        .list(folderPath);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  };

  return {
    uploadFile,
    deleteFile,
    listUserFiles,
    uploading
  };
};
