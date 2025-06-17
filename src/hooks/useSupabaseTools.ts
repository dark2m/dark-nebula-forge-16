
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import SupabaseToolsService from '../utils/supabaseToolsService';
import type { Tool } from '../types/admin';

export const useSupabaseTools = () => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل الأدوات
  const loadTools = async () => {
    try {
      setIsLoading(true);
      const toolsData = await SupabaseToolsService.getTools();
      setTools(toolsData);
    } catch (error) {
      console.error('Error loading tools:', error);
      toast({
        title: "خطأ في تحميل الأدوات",
        description: "حدث خطأ أثناء تحميل الأدوات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // إضافة أداة جديدة
  const addTool = async (toolData: Omit<Tool, 'id'>) => {
    try {
      setIsSaving(true);
      const newTool = await SupabaseToolsService.addTool(toolData);
      setTools(prev => [...prev, newTool]);
      
      toast({
        title: "تم إضافة الأداة",
        description: "تم إضافة الأداة الجديدة بنجاح",
        variant: "default"
      });
      
      return newTool;
    } catch (error) {
      console.error('Error adding tool:', error);
      toast({
        title: "خطأ في إضافة الأداة",
        description: "حدث خطأ أثناء إضافة الأداة",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث أداة
  const updateTool = async (id: number, updates: Partial<Tool>) => {
    try {
      setIsSaving(true);
      await SupabaseToolsService.updateTool(id, updates);
      
      setTools(prev => prev.map(tool => 
        tool.id === id ? { ...tool, ...updates } : tool
      ));
      
      toast({
        title: "تم تحديث الأداة",
        description: "تم حفظ التعديلات بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error updating tool:', error);
      toast({
        title: "خطأ في تحديث الأداة",
        description: "حدث خطأ أثناء حفظ التعديلات",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  // حذف أداة
  const deleteTool = async (id: number) => {
    try {
      setIsSaving(true);
      await SupabaseToolsService.deleteTool(id);
      setTools(prev => prev.filter(tool => tool.id !== id));
      
      toast({
        title: "تم حذف الأداة",
        description: "تم حذف الأداة بنجاح",
        variant: "default"
      });
    } catch (error) {
      console.error('Error deleting tool:', error);
      toast({
        title: "خطأ في حذف الأداة",
        description: "حدث خطأ أثناء حذف الأداة",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    loadTools();
  }, []);

  return {
    tools,
    isLoading,
    isSaving,
    addTool,
    updateTool,
    deleteTool,
    refreshTools: loadTools
  };
};
