
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
        // تحويل آمن من Json إلى SalesOverviewData
        const rawData = data.settings_data as unknown;
        if (rawData && typeof rawData === 'object' && rawData !== null) {
          const typedData = rawData as Record<string, unknown>;
          setSalesData({
            totalSales: typeof typedData.totalSales === 'number' ? typedData.totalSales : 0,
            monthlyRevenue: typeof typedData.monthlyRevenue === 'number' ? typedData.monthlyRevenue : 0,
            pendingOrders: typeof typedData.pendingOrders === 'number' ? typedData.pendingOrders : 0,
            completedOrders: typeof typedData.completedOrders === 'number' ? typedData.completedOrders : 0
          });
        }
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
      
      // تحويل البيانات إلى Json متوافق مع Supabase
      const jsonData = {
        totalSales: newData.totalSales,
        monthlyRevenue: newData.monthlyRevenue,
        pendingOrders: newData.pendingOrders,
        completedOrders: newData.completedOrders
      } as const;

      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'sales_overview',
          settings_data: jsonData
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
