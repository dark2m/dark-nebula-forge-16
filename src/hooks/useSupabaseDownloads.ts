
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { DownloadItem } from '@/types/downloads';

export const useSupabaseDownloads = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل التنزيلات من قاعدة البيانات
  const loadDownloads = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('downloads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedDownloads: DownloadItem[] = (data || []).map(download => ({
        id: Number(download.id),
        title: download.title,
        description: download.description || '',
        category: download.category,
        size: download.size || '',
        downloads: download.downloads || 0,
        rating: Number(download.rating) || 4.0,
        version: download.version || '',
        lastUpdate: download.last_update || '',
        features: Array.isArray(download.features) ? 
          (download.features as string[]) : [],
        status: download.status || 'جديد',
        icon: download.icon || 'Package',
        downloadUrl: download.download_url || '',
        filename: download.filename || '',
        images: Array.isArray(download.images) ? 
          (download.images as string[]) : [],
        videos: Array.isArray(download.videos) ? 
          (download.videos as string[]) : [],
        passwordCategory: download.password_category || ''
      }));

      setDownloads(formattedDownloads);
    } catch (error) {
      console.error('Error loading downloads:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل التنزيلات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة تنزيل جديد
  const addDownload = async () => {
    try {
      setIsSaving(true);
      
      const { data: existingDownloads } = await supabase
        .from('downloads')
        .select('id')
        .order('id', { ascending: false })
        .limit(1);

      const nextId = existingDownloads && existingDownloads.length > 0 
        ? existingDownloads[0].id + 1 
        : 1;

      const newDownloadData = {
        id: nextId,
        title: 'تنزيل جديد',
        description: 'وصف التنزيل',
        category: 'أدوات',
        size: '1 MB',
        downloads: 0,
        rating: 4.0,
        version: '1.0',
        last_update: new Date().toLocaleDateString('ar-SA'),
        features: [],
        status: 'جديد',
        icon: 'Package',
        download_url: '',
        filename: '',
        images: [],
        videos: [],
        password_category: ''
      };

      const { data, error } = await supabase
        .from('downloads')
        .insert([newDownloadData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "تم إضافة التنزيل",
        description: "تم إضافة تنزيل جديد بنجاح",
        variant: "default"
      });

      await loadDownloads();
      return data;
    } catch (error) {
      console.error('Error adding download:', error);
      toast({
        title: "خطأ في الإضافة",
        description: "حدث خطأ أثناء إضافة التنزيل",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث تنزيل
  const updateDownload = async (id: number, updates: Partial<DownloadItem>) => {
    try {
      setIsSaving(true);

      const dbUpdates: any = {};
      
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.size !== undefined) dbUpdates.size = updates.size;
      if (updates.downloads !== undefined) dbUpdates.downloads = updates.downloads;
      if (updates.rating !== undefined) dbUpdates.rating = updates.rating;
      if (updates.version !== undefined) dbUpdates.version = updates.version;
      if (updates.lastUpdate !== undefined) dbUpdates.last_update = updates.lastUpdate;
      if (updates.features !== undefined) dbUpdates.features = updates.features;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.downloadUrl !== undefined) dbUpdates.download_url = updates.downloadUrl;
      if (updates.filename !== undefined) dbUpdates.filename = updates.filename;
      if (updates.images !== undefined) dbUpdates.images = updates.images;
      if (updates.videos !== undefined) dbUpdates.videos = updates.videos;
      if (updates.passwordCategory !== undefined) dbUpdates.password_category = updates.passwordCategory;

      const { error } = await supabase
        .from('downloads')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;

      setDownloads(prevDownloads => 
        prevDownloads.map(download => 
          download.id === id ? { ...download, ...updates } : download
        )
      );

      console.log(`Download ${id} updated successfully`);
      
    } catch (error) {
      console.error('Error updating download:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ التنزيل",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // حذف تنزيل
  const deleteDownload = async (id: number) => {
    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('downloads')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDownloads(prevDownloads => prevDownloads.filter(d => d.id !== id));

      toast({
        title: "تم حذف التنزيل",
        description: "تم حذف التنزيل بنجاح",
        variant: "default"
      });
      
    } catch (error) {
      console.error('Error deleting download:', error);
      toast({
        title: "خطأ في الحذف",
        description: "حدث خطأ أثناء حذف التنزيل",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadDownloads();
  }, []);

  return {
    downloads,
    isLoading,
    isSaving,
    addDownload,
    updateDownload,
    deleteDownload,
    refreshDownloads: loadDownloads
  };
};
