
-- إنشاء جدول لحفظ المنتجات في Supabase
CREATE TABLE public.products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT 'pubg',
  description TEXT DEFAULT '',
  features JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  videos JSONB DEFAULT '[]'::jsonb,
  text_size TEXT DEFAULT 'medium',
  title_size TEXT DEFAULT 'large',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول لحفظ إعدادات الموقع في Supabase
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  settings_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول لحفظ المستخدمين الإداريين
CREATE TABLE public.admin_users (
  id BIGINT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'مشرف',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول لحفظ العملاء
CREATE TABLE public.customer_users (
  id BIGINT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  username TEXT,
  registration_date TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_verified BOOLEAN DEFAULT true,
  is_blocked BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT false,
  last_seen TEXT
);

-- إنشاء جدول لحفظ محاولات تسجيل الدخول
CREATE TABLE public.login_attempts (
  id BIGINT PRIMARY KEY,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  success BOOLEAN DEFAULT false,
  ip_address TEXT DEFAULT 'localhost',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إضافة triggers للتحديث التلقائي لـ updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- إدراج البيانات الافتراضية
INSERT INTO public.admin_users (id, username, password, role) 
VALUES (1, 'dark', 'dark', 'مدير عام')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, price, category, description, features, images, videos, text_size, title_size)
VALUES 
(1, 'هكر ESP المتقدم', 25, 'pubg', 'رؤية الأعداء من خلال الجدران مع معلومات مفصلة', '["ESP للاعبين", "ESP للأسلحة", "ESP للسيارات", "آمن 100%"]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'medium', 'large'),
(2, 'هكر الرؤية الليلية', 30, 'pubg', 'رؤية واضحة في الظلام والأماكن المظلمة', '["رؤية ليلية متقدمة", "كشف الأعداء المختبئين", "تحسين الرؤية", "آمن ومحدث"]'::jsonb, '[]'::jsonb, '[]'::jsonb, 'medium', 'large')
ON CONFLICT (id) DO NOTHING;

-- إدراج الإعدادات الافتراضية
INSERT INTO public.site_settings (settings_data)
SELECT '{
  "title": "DARK",
  "titleSize": "xl",
  "description": "نوفر لك أفضل الخدمات في مجال التقنية والبرمجة مع جودة عالية وأسعار منافسة",
  "colors": {
    "primary": "#3b82f6",
    "secondary": "#8b5cf6",
    "accent": "#06b6d4"
  },
  "globalTextSize": "medium",
  "navigation": [
    {"id": "official", "name": "الصفحة الرئيسية", "path": "/official", "icon": "Users", "visible": true},
    {"id": "pubg", "name": "هكر ببجي موبايل", "path": "/pubg-hacks", "icon": "Shield", "visible": true},
    {"id": "web", "name": "برمجة مواقع", "path": "/web-development", "icon": "Code", "visible": true},
    {"id": "discord", "name": "برمجة بوتات ديسكورد", "path": "/discord-bots", "icon": "Bot", "visible": true},
    {"id": "tools", "name": "الأدوات", "path": "/tool", "icon": "Wrench", "visible": true},
    {"id": "customer-support", "name": "خدمة العملاء", "path": "/sport", "icon": "MessageCircle", "visible": true}
  ]
}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);
