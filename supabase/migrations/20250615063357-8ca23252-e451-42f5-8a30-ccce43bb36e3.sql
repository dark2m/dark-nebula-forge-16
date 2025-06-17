
-- حذف الجدول الموجود إذا كان فارغاً أو إنشاء جدول جديد بشكل صحيح
DROP TABLE IF EXISTS public.admin_users CASCADE;

-- إنشاء جدول المستخدمين الإداريين من جديد
CREATE TABLE public.admin_users (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'مشرف',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إدراج المستخدم الافتراضي
INSERT INTO public.admin_users (username, password, role) VALUES 
  ('dark', 'dark', 'مدير عام');

-- إنشاء فهرس للبحث السريع
CREATE INDEX idx_admin_users_username ON public.admin_users(username);

-- إنشاء trigger للتحديث التلقائي
CREATE TRIGGER update_admin_users_updated_at
    BEFORE UPDATE ON public.admin_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
