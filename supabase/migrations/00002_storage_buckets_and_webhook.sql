-- ============================================================
-- Migration: Storage Buckets + Lead Notification Webhook
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

-- 1. STORAGE BUCKETS
-- -------------------

INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('instructor-photos', 'instructor-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('branch-photos', 'branch-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('testimonial-photos', 'testimonial-photos', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', true) ON CONFLICT (id) DO NOTHING;

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

-- 2. LEAD NOTIFICATION WEBHOOK
-- -----------------------------

CREATE EXTENSION IF NOT EXISTS pg_net;

CREATE OR REPLACE FUNCTION notify_admin_on_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_email TEXT;
  site_name TEXT;
BEGIN
  SELECT value INTO admin_email FROM site_settings WHERE key = 'admin_email';
  SELECT value INTO site_name FROM site_settings WHERE key = 'site_name_en';

  IF admin_email IS NULL OR admin_email = '' THEN
    RAISE LOG 'No admin email configured, skipping notification';
    RETURN NEW;
  END IF;

  PERFORM net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.resend_api_key', true),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', site_name || ' <noreply@shahjalaldrivingcenter.com>',
      'to', jsonb_build_array(admin_email),
      'subject', 'New Lead: ' || NEW.name,
      'html', format(
        '<h2>New Enrollment Inquiry</h2>
         <p><strong>Name:</strong> %s</p>
         <p><strong>Phone:</strong> %s</p>
         <p><strong>Email:</strong> %s</p>
         <p><strong>Branch:</strong> %s</p>
         <p><strong>Course:</strong> %s</p>
         <p><strong>Message:</strong> %s</p>
         <p><strong>Date:</strong> %s</p>
         <hr />
         <p><a href="https://supabase.com/dashboard/project/fvapuxfywzpbahbjakwm">View in Supabase</a></p>',
        NEW.name, NEW.phone, COALESCE(NEW.email, 'N/A'),
        COALESCE(NEW.branch_pref, 'N/A'), COALESCE(NEW.course_interest, 'N/A'),
        COALESCE(NEW.message, 'N/A'), NEW.created_at::text
      )
    )
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_lead_insert
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_lead();

-- Set your Resend API key (replace with actual key)
-- ALTER DATABASE postgres SET app.settings.resend_api_key TO 're_YOUR_RESEND_KEY';
