-- Lead notification via pg_net (database-side HTTP call to Resend)
-- Run in Supabase SQL Editor after enabling pg_net extension:
-- https://supabase.com/dashboard/project/fvapuxfywzpbahbjakwm/settings/database -> Extensions -> enable pg_net

-- Enable the pg_net extension (required for async HTTP calls from triggers)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create the notification function
CREATE OR REPLACE FUNCTION notify_admin_on_lead()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_email TEXT;
  site_name TEXT;
  site_settings_url TEXT;
BEGIN
  -- Fetch admin email from site_settings
  SELECT value INTO admin_email FROM site_settings WHERE key = 'admin_email';
  SELECT value INTO site_name FROM site_settings WHERE key = 'site_name_en';

  IF admin_email IS NULL OR admin_email = '' THEN
    RAISE LOG 'No admin email configured, skipping notification';
    RETURN NEW;
  END IF;

  site_settings_url := current_setting('request.headers')::json ->> 'origin';

  -- Send email via Resend API using pg_net (async)
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

-- Create trigger on leads INSERT
CREATE TRIGGER on_lead_insert
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION notify_admin_on_lead();

-- Set your Resend API key (replace with actual key)
-- SELECT set_config('app.settings.resend_api_key', 're_YOUR_RESEND_KEY', false);
-- To make it persistent: ALTER DATABASE postgres SET app.settings.resend_api_key TO 're_YOUR_RESEND_KEY';
