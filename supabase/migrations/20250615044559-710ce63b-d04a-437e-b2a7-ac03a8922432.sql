
-- حذف جميع السياسات الموجودة أولاً لتجنب التضارب

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

-- الآن إنشاء السياسات الجديدة

-- تفعيل RLS وإنشاء سياسات customers
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

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

-- تفعيل RLS وإنشاء سياسات profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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

-- تفعيل RLS وإنشاء سياسات products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view products" 
  ON public.products 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage products" 
  ON public.products 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- إنشاء bucket للملفات إذا لم يكن موجود
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
SELECT 'user-files', 'user-files', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'application/pdf', 'text/plain']
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user-files');
