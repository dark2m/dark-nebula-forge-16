
-- إنشاء جدول خاص ببيانات المبيعات
CREATE TABLE IF NOT EXISTS public.sales_overview (
  id TEXT PRIMARY KEY DEFAULT 'sales_data',
  total_sales NUMERIC DEFAULT 0,
  monthly_revenue NUMERIC DEFAULT 0,
  pending_orders INTEGER DEFAULT 0,
  completed_orders INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج بيانات افتراضية
INSERT INTO public.sales_overview (id, total_sales, monthly_revenue, pending_orders, completed_orders)
VALUES ('sales_data', 0, 0, 0, 0)
ON CONFLICT (id) DO NOTHING;

-- إضافة trigger للتحديث التلقائي لوقت التعديل
CREATE OR REPLACE FUNCTION update_sales_overview_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_sales_overview_updated_at ON public.sales_overview;
CREATE TRIGGER update_sales_overview_updated_at
    BEFORE UPDATE ON public.sales_overview
    FOR EACH ROW
    EXECUTE FUNCTION update_sales_overview_updated_at();
