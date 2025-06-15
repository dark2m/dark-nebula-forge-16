
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SalesOverviewData {
  totalSales: number;
  monthlyRevenue: number;
  pendingOrders: number;
  completedOrders: number;
}

export const useAdminOverviewData = () => {
  const [salesData, setSalesData] = useState<SalesOverviewData>({
    totalSales: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // تحميل البيانات من قاعدة البيانات
  const loadSalesData = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('site_settings')
        .select('settings_data')
        .eq('id', 'sales_overview')
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data?.settings_data) {
        setSalesData(data.settings_data as SalesOverviewData);
      }
    } catch (error) {
      console.error('Error loading sales data:', error);
      toast({
        title: "خطأ في التحميل",
        description: "حدث خطأ أثناء تحميل بيانات المبيعات",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // حفظ البيانات في قاعدة البيانات
  const saveSalesData = async (newData: SalesOverviewData) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'sales_overview',
          settings_data: newData
        }, {
          onConflict: 'id'
        });

      if (error) throw error;

      setSalesData(newData);
      
      toast({
        title: "تم الحفظ بنجاح",
        description: "تم حفظ بيانات المبيعات وتطبيقها على الموقع"
      });
      
      return true;
    } catch (error) {
      console.error('Error saving sales data:', error);
      toast({
        title: "خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ بيانات المبيعات",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // تحديث البيانات مع الحفظ التلقائي
  const updateSalesData = async (updates: Partial<SalesOverviewData>) => {
    const newData = { ...salesData, ...updates };
    return await saveSalesData(newData);
  };

  useEffect(() => {
    loadSalesData();
  }, []);

  return {
    salesData,
    isLoading,
    isSaving,
    updateSalesData,
    saveSalesData,
    loadSalesData
  };
};
