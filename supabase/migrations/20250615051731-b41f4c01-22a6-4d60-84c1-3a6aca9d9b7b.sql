
-- إنشاء جدول التنزيلات
CREATE TABLE IF NOT EXISTS public.downloads (
  id BIGINT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'أدوات',
  size TEXT,
  downloads INTEGER DEFAULT 0,
  rating NUMERIC DEFAULT 4.0,
  version TEXT,
  last_update TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'جديد',
  icon TEXT DEFAULT 'Package',
  download_url TEXT,
  filename TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  password_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول كلمات مرور التنزيلات
CREATE TABLE IF NOT EXISTS public.download_passwords (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  password TEXT NOT NULL UNIQUE,
  allowed_categories JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول فئات التنزيلات
CREATE TABLE IF NOT EXISTS public.download_categories (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name TEXT NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول تحديثات المنتجات
CREATE TABLE IF NOT EXISTS public.product_updates (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول نصوص الصفحات
CREATE TABLE IF NOT EXISTS public.page_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_name TEXT NOT NULL,
  section_name TEXT NOT NULL,
  text_key TEXT NOT NULL,
  text_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page_name, section_name, text_key)
);

-- إدراج البيانات الافتراضية
INSERT INTO public.download_categories (name) VALUES 
  ('ألعاب'),
  ('أدوات'),
  ('أمان'),
  ('تصميم'),
  ('برمجة')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.download_passwords (id, name, password, allowed_categories, description) VALUES 
  (1, 'العضوية العامة', 'dark123', '["ألعاب", "أدوات", "تصميم"]'::jsonb, 'الوصول للفئات الأساسية'),
  (2, 'عضوية الألعاب', 'games456', '["ألعاب"]'::jsonb, 'الوصول للألعاب فقط'),
  (3, 'عضوية الأمان', 'security789', '["أمان", "أدوات"]'::jsonb, 'الوصول لأدوات الأمان'),
  (4, 'وصول كامل', 'fullaccess999', '["وصول كامل"]'::jsonb, 'الوصول لجميع الفئات والمحتوى')
ON CONFLICT (password) DO NOTHING;

-- إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_downloads_category ON public.downloads(category);
CREATE INDEX IF NOT EXISTS idx_downloads_status ON public.downloads(status);
CREATE INDEX IF NOT EXISTS idx_download_passwords_active ON public.download_passwords(is_active);
CREATE INDEX IF NOT EXISTS idx_product_updates_active ON public.product_updates(is_active);
CREATE INDEX IF NOT EXISTS idx_page_texts_page ON public.page_texts(page_name);

-- إنشاء triggers للتحديث التلقائي
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_downloads_updated_at ON public.downloads;
CREATE TRIGGER update_downloads_updated_at
    BEFORE UPDATE ON public.downloads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_download_passwords_updated_at ON public.download_passwords;
CREATE TRIGGER update_download_passwords_updated_at
    BEFORE UPDATE ON public.download_passwords
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_product_updates_updated_at ON public.product_updates;
CREATE TRIGGER update_product_updates_updated_at
    BEFORE UPDATE ON public.product_updates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_texts_updated_at ON public.page_texts;
CREATE TRIGGER update_page_texts_updated_at
    BEFORE UPDATE ON public.page_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
