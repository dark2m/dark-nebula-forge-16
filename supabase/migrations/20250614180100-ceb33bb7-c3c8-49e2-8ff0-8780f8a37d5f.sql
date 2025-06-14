
-- تحديث دالة التعامل مع المستخدمين الجدد لتجنب خطأ التكرار
CREATE OR REPLACE FUNCTION public.handle_new_customer()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  -- التحقق من وجود username مكرر وإنشاء واحد فريد
  INSERT INTO public.customers (id, username)
  VALUES (
    new.id,
    CASE 
      WHEN new.raw_user_meta_data->>'username' IS NOT NULL 
      THEN new.raw_user_meta_data->>'username' || '_' || substring(new.id::text from 1 for 8)
      ELSE split_part(new.email, '@', 1) || '_' || substring(new.id::text from 1 for 8)
    END
  )
  ON CONFLICT (username) DO UPDATE SET
    username = EXCLUDED.username || '_' || extract(epoch from now())::bigint;
  
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- في حالة أي خطأ آخر، نحاول مرة أخرى بـ username بسيط
    INSERT INTO public.customers (id, username)
    VALUES (
      new.id,
      'user_' || substring(new.id::text from 1 for 8)
    )
    ON CONFLICT (username) DO UPDATE SET
      username = 'user_' || extract(epoch from now())::bigint;
    
    RETURN new;
END;
$$;

-- التأكد من وجود فهرس فريد على username
CREATE UNIQUE INDEX IF NOT EXISTS customers_username_key ON public.customers (username);

-- إضافة constraint للتأكد من أن username ليس فارغ
ALTER TABLE public.customers 
ADD CONSTRAINT customers_username_not_empty 
CHECK (username IS NOT NULL AND length(trim(username)) > 0);
