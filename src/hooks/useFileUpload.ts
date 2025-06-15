
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import AuthService from '@/utils/auth';

export const useFileUpload = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, folder: string = 'general'): Promise<string | null> => {
    // Check if user is admin first
    const adminUser = AuthService.getCurrentUser();
    
    if (!user && !adminUser) {
      toast({
        title: "خطأ",
        description: "يجب تسجيل الدخول أولاً",
        variant: "destructive"
      });
      return null;
    }

    setUploading(true);
    try {
      // For admin users, use service role key to bypass RLS
      const isAdmin = adminUser && !user;
      
      if (isAdmin) {
        // Use service role for admin uploads
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          // Create an anonymous session or use direct upload for admins
          const fileExt = file.name.split('.').pop();
          const fileName = `admin/${folder}/${Date.now()}.${fileExt}`;
          
          // Try direct upload with service key
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch(`${supabase.supabaseUrl}/storage/v1/object/user-files/${fileName}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabase.supabaseKey}`,
              'X-Upsert': 'false'
            },
            body: formData
          });
          
          if (!response.ok) {
            throw new Error('Failed to upload file');
          }
          
          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('user-files')
            .getPublicUrl(fileName);

          toast({
            title: "تم الرفع",
            description: "تم رفع الملف بنجاح"
          });

          return publicUrl;
        }
      }

      // Regular user upload
      const fileExt = file.name.split('.').pop();
      const userId = adminUser?.id || user?.id || 'anonymous';
      const fileName = `${userId}/${folder}/${Date.now()}.${fileExt}`;

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
    const adminUser = AuthService.getCurrentUser();
    
    if (!user && !adminUser) return false;

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
    const adminUser = AuthService.getCurrentUser();
    
    if (!user && !adminUser) return [];

    try {
      const userId = adminUser?.id || user?.id || 'anonymous';
      const folderPath = folder ? `${userId}/${folder}` : `${userId}`;
      
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
