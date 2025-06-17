
import { supabase } from '@/integrations/supabase/client';
import { Tool } from '../types/admin';

class SupabaseToolsService {
  // تحميل جميع الأدوات
  static async getTools(): Promise<Tool[]> {
    try {
      const { data, error } = await supabase
        .from('site_tools')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      return (data || []).map(tool => ({
        id: tool.id,
        name: tool.name,
        title: tool.title,
        description: tool.description || '',
        buttonText: tool.button_text,
        url: tool.url || '',
        icon: tool.icon || '🔧',
        visible: tool.visible || true,
        isActive: tool.is_active || true,
        category: tool.category || 'general',
        customHtml: tool.custom_html || ''
      }));
    } catch (error) {
      console.error('SupabaseToolsService: Error loading tools:', error);
      return [];
    }
  }

  // إضافة أداة جديدة
  static async addTool(tool: Omit<Tool, 'id'>): Promise<Tool> {
    try {
      const { data, error } = await supabase
        .from('site_tools')
        .insert([{
          name: tool.name,
          title: tool.title,
          description: tool.description,
          button_text: tool.buttonText,
          url: tool.url,
          icon: tool.icon,
          visible: tool.visible,
          is_active: tool.isActive,
          category: tool.category,
          custom_html: tool.customHtml
        }])
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        title: data.title,
        description: data.description || '',
        buttonText: data.button_text,
        url: data.url || '',
        icon: data.icon || '🔧',
        visible: data.visible || true,
        isActive: data.is_active || true,
        category: data.category || 'general',
        customHtml: data.custom_html || ''
      };
    } catch (error) {
      console.error('SupabaseToolsService: Error adding tool:', error);
      throw error;
    }
  }

  // تحديث أداة
  static async updateTool(id: number, updates: Partial<Tool>): Promise<void> {
    try {
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.buttonText !== undefined) updateData.button_text = updates.buttonText;
      if (updates.url !== undefined) updateData.url = updates.url;
      if (updates.icon !== undefined) updateData.icon = updates.icon;
      if (updates.visible !== undefined) updateData.visible = updates.visible;
      if (updates.isActive !== undefined) updateData.is_active = updates.isActive;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.customHtml !== undefined) updateData.custom_html = updates.customHtml;

      const { error } = await supabase
        .from('site_tools')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('SupabaseToolsService: Error updating tool:', error);
      throw error;
    }
  }

  // حذف أداة
  static async deleteTool(id: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('site_tools')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('SupabaseToolsService: Error deleting tool:', error);
      throw error;
    }
  }
}

export default SupabaseToolsService;
