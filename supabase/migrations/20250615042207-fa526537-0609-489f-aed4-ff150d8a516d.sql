
-- التحقق من Buckets الموجودة وإنشاء المفقودة فقط
DO $$
BEGIN
    -- إنشاء bucket للملفات إذا لم يكن موجود
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'user-files') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('user-files', 'user-files', true);
    END IF;
    
    -- إنشاء bucket للأصول العامة إذا لم يكن موجود
    IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'public-assets') THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('public-assets', 'public-assets', true);
    END IF;
END $$;

-- حذف السياسات الموجودة وإعادة إنشائها
DROP POLICY IF EXISTS "Allow authenticated users to upload files" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to view files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view public assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to manage public assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to update public assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow admins to delete public assets" ON storage.objects;

-- إنشاء سياسات Storage للملفات الشخصية
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-files' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to view files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-files' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow users to update their own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Allow users to delete their own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-files' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- سياسات للأصول العامة
CREATE POLICY "Allow public to view public assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-assets');

CREATE POLICY "Allow admins to manage public assets"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'public-assets');

CREATE POLICY "Allow admins to update public assets"
ON storage.objects FOR UPDATE
USING (bucket_id = 'public-assets');

CREATE POLICY "Allow admins to delete public assets"
ON storage.objects FOR DELETE
USING (bucket_id = 'public-assets');
