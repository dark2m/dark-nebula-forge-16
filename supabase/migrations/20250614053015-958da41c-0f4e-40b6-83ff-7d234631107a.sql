
-- إنشاء جدول العملاء
CREATE TABLE public.customers (
  id uuid not null references auth.users on delete cascade,
  username text,
  phone text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  is_verified boolean default true,
  primary key (id)
);

-- تفعيل RLS للحماية
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- السياسات: العملاء يمكنهم رؤية بياناتهم فقط
CREATE POLICY "Users can view own customer data" ON public.customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert own customer data" ON public.customers
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own customer data" ON public.customers
  FOR UPDATE USING (auth.uid() = id);

-- دالة لإنشاء بيانات العميل تلقائياً عند التسجيل
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.customers (id, username)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username'
  );
  RETURN new;
END;
$$;

-- تفعيل الدالة عند إنشاء مستخدم جديد
CREATE TRIGGER on_auth_user_created_customer
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_customer();
