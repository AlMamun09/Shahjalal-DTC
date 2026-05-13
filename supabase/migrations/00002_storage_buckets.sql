-- Create storage buckets via Supabase internal functions
-- Run in Supabase SQL Editor

SELECT storage.create_bucket('hero-images', 'public');
SELECT storage.create_bucket('gallery', 'public');
SELECT storage.create_bucket('instructor-photos', 'public');
SELECT storage.create_bucket('branch-photos', 'public');
SELECT storage.create_bucket('testimonial-photos', 'public');
SELECT storage.create_bucket('certificates', 'public');

-- Allow public read access on all buckets
CREATE POLICY "public_read" ON storage.objects FOR SELECT USING (bucket_id IN (
  'hero-images', 'gallery', 'instructor-photos', 'branch-photos', 'testimonial-photos', 'certificates'
));

-- Allow admin (authenticated) full access
CREATE POLICY "admin_all" ON storage.objects FOR ALL USING (
  auth.role() = 'authenticated' AND bucket_id IN (
    'hero-images', 'gallery', 'instructor-photos', 'branch-photos', 'testimonial-photos', 'certificates'
  )
);
