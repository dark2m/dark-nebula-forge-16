
-- إنشاء جدول لحفظ الأدوات
CREATE TABLE public.site_tools (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  button_text TEXT NOT NULL DEFAULT 'استخدام الأداة',
  url TEXT,
  icon TEXT DEFAULT '🔧',
  visible BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  category TEXT DEFAULT 'general',
  custom_html TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إضافة بعض الأدوات الافتراضية
INSERT INTO public.site_tools (name, title, description, button_text, icon, category, custom_html) VALUES
('password-generator', 'مولد كلمات المرور', 'أداة لتوليد كلمات مرور قوية وآمنة مع خيارات متقدمة', 'استخدام المولد', '🔐', 'security', ''),
('general-tool', 'أداة عامة', 'أداة عامة مفيدة للاستخدام اليومي', 'استخدام الأداة', '🔧', 'general', ''),
('dev-tool', 'أداة تطوير', 'أداة مفيدة للمطورين والمبرمجين', 'استخدام الأداة', '💻', 'development', '');

-- إضافة trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_site_tools_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_site_tools_updated_at_trigger
    BEFORE UPDATE ON public.site_tools
    FOR EACH ROW
    EXECUTE FUNCTION update_site_tools_updated_at();
