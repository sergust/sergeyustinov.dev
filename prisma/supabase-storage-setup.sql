-- Supabase Storage Setup for Blog Images
-- Run these commands in your Supabase SQL Editor

-- 1. Create storage bucket for blog images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  52428800, -- 50MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
);

-- 2. Set up Row Level Security (RLS) policies for the bucket

-- Allow public read access to all images
CREATE POLICY "Public read access"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'blog-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update their own images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete their own images"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- 3. Alternative: Allow admin users to manage all images
-- Replace 'admin-user-id' with your actual admin user ID
CREATE POLICY "Admin users can manage all images"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'blog-images' AND 
  auth.uid() = 'admin-user-id'::uuid
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id 
ON storage.objects (bucket_id);

CREATE INDEX IF NOT EXISTS idx_storage_objects_name 
ON storage.objects (name);

-- 5. Optional: Create a function to generate optimized image paths
CREATE OR REPLACE FUNCTION generate_image_path(
  user_id UUID,
  filename TEXT,
  folder TEXT DEFAULT 'uploads'
)
RETURNS TEXT AS $$
BEGIN
  RETURN folder || '/' || user_id::text || '/' || extract(year from now()) || '/' || 
         extract(month from now()) || '/' || generate_random_uuid() || '-' || filename;
END;
$$ LANGUAGE plpgsql;

-- 6. Create a function to clean up old images (optional)
CREATE OR REPLACE FUNCTION cleanup_old_images(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM storage.objects 
  WHERE bucket_id = 'blog-images' 
    AND created_at < NOW() - INTERVAL '1 day' * days_old
    AND name NOT IN (
      SELECT hero_image FROM public.posts WHERE hero_image IS NOT NULL
    );
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Enable the storage extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "storage";

-- 8. Grant necessary permissions
GRANT ALL ON storage.objects TO authenticated;
GRANT ALL ON storage.buckets TO authenticated;

-- Setup complete! 
-- Remember to:
-- 1. Replace 'admin-user-id' with your actual admin user ID
-- 2. Test the policies with your application
-- 3. Configure your environment variables:
--    NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key 