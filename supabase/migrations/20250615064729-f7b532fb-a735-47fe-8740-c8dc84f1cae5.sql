
-- إنشاء جدول للعملاء في قاعدة البيانات
CREATE TABLE IF NOT EXISTS public.customer_support_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  password_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_verified BOOLEAN DEFAULT false,
  is_blocked BOOLEAN DEFAULT false,
  last_login TIMESTAMP WITH TIME ZONE,
  verification_code TEXT,
  verification_expires_at TIMESTAMP WITH TIME ZONE
);

-- إنشاء جدول للرسائل
CREATE TABLE IF NOT EXISTS public.customer_support_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_support_users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  files JSONB DEFAULT '[]',
  is_from_customer BOOLEAN DEFAULT true,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول لجلسات الدردشة
CREATE TABLE IF NOT EXISTS public.customer_support_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customer_support_users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'waiting')),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  unread_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- إنشاء جدول لمحاولات تسجيل الدخول
CREATE TABLE IF NOT EXISTS public.customer_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  ip_address TEXT,
  success BOOLEAN DEFAULT false,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  user_agent TEXT
);

-- إضافة فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_customer_support_messages_customer_id ON public.customer_support_messages(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_support_messages_created_at ON public.customer_support_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_customer_support_sessions_customer_id ON public.customer_support_sessions(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_login_attempts_email ON public.customer_login_attempts(email);

-- إضافة trigger لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_customer_support_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_support_users_updated_at
    BEFORE UPDATE ON public.customer_support_users
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_support_updated_at();

CREATE TRIGGER update_customer_support_messages_updated_at
    BEFORE UPDATE ON public.customer_support_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_support_updated_at();

CREATE TRIGGER update_customer_support_sessions_updated_at
    BEFORE UPDATE ON public.customer_support_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_customer_support_updated_at();

-- إضافة سياسات الأمان (RLS)
ALTER TABLE public.customer_support_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_login_attempts ENABLE ROW LEVEL SECURITY;

-- سياسات للمستخدمين المصرح لهم فقط
CREATE POLICY "Allow authenticated users to view customer support data" ON public.customer_support_users
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage messages" ON public.customer_support_messages
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to manage sessions" ON public.customer_support_sessions
  FOR ALL USING (true);

CREATE POLICY "Allow authenticated users to view login attempts" ON public.customer_login_attempts
  FOR ALL USING (true);
