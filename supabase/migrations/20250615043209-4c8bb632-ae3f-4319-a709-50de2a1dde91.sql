
-- حذف السياسات الموجودة أولاً ثم إعادة إنشائها

-- حذف سياسات site_data الموجودة
DROP POLICY IF EXISTS "Users can view their own site data" ON public.site_data;
DROP POLICY IF EXISTS "Users can create their own site data" ON public.site_data;
DROP POLICY IF EXISTS "Users can update their own site data" ON public.site_data;
DROP POLICY IF EXISTS "Users can delete their own site data" ON public.site_data;

-- حذف سياسات customers الموجودة
DROP POLICY IF EXISTS "Users can view their own customer data" ON public.customers;
DROP POLICY IF EXISTS "Users can insert their own customer data" ON public.customers;
DROP POLICY IF EXISTS "Users can update their own customer data" ON public.customers;

-- حذف سياسات profiles الموجودة
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- حذف سياسات products الموجودة
DROP POLICY IF EXISTS "Public can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can manage products" ON public.products;

-- الآن إعادة إنشاء السياسات

-- سياسات site_data
CREATE POLICY "Users can view their own site data" 
  ON public.site_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own site data" 
  ON public.site_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own site data" 
  ON public.site_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own site data" 
  ON public.site_data 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- سياسات customers
CREATE POLICY "Users can view their own customer data" 
  ON public.customers 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own customer data" 
  ON public.customers 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own customer data" 
  ON public.customers 
  FOR UPDATE 
  USING (auth.uid() = id);

-- سياسات profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- سياسات products - قراءة عامة
CREATE POLICY "Public can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

-- إدارة المنتجات للمشرفين فقط (مؤقتاً مفتوح)
CREATE POLICY "Admins can manage products" 
  ON public.products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- تفعيل RLS للجداول
ALTER TABLE public.site_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
