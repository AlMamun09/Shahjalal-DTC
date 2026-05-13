-- Shahjalal Driving Training Center - Initial Schema
-- Run this in Supabase SQL Editor

-- 1. Site Settings (key-value)
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Branches
CREATE TABLE branches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name_bn       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  address_bn    TEXT,
  address_en    TEXT,
  phones        JSONB DEFAULT '[]',
  emails        JSONB DEFAULT '[]',
  whatsapp      TEXT,
  map_embed_url TEXT,
  photo_url     TEXT,
  seo_title     TEXT,
  seo_desc      TEXT,
  seo_keywords  TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Courses
CREATE TABLE courses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name_bn        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  category       TEXT CHECK (category IN ('car', 'motorcycle', 'professional', 'refresher', 'license')),
  duration_bn    TEXT,
  duration_en    TEXT,
  fee            TEXT,
  description_bn TEXT,
  description_en TEXT,
  icon           TEXT,
  is_active      BOOLEAN DEFAULT TRUE,
  sort_order     INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Leads / Inquiries
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  branch_pref     TEXT,
  course_interest TEXT,
  message         TEXT,
  status          TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled', 'closed')),
  admin_notes     TEXT
);

-- 5. Testimonials
CREATE TABLE testimonials (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  rating     INT CHECK (rating BETWEEN 1 AND 5),
  text_bn    TEXT,
  text_en    TEXT,
  photo_url  TEXT,
  is_visible BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Gallery Photos
CREATE TABLE gallery_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Gallery Videos
CREATE TABLE gallery_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn    TEXT,
  title_en    TEXT,
  youtube_url TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Instructors
CREATE TABLE instructors (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_bn         TEXT NOT NULL,
  name_en         TEXT NOT NULL,
  experience      TEXT,
  specialization  TEXT,
  photo_url       TEXT,
  sort_order      INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT TRUE
);

-- 9. Page SEO
CREATE TABLE page_seo (
  page_key     TEXT PRIMARY KEY,
  meta_title   TEXT,
  meta_desc    TEXT,
  og_image_url TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Page Views (analytics)
CREATE TABLE page_views (
  id         BIGSERIAL PRIMARY KEY,
  page       TEXT NOT NULL,
  viewed_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_seo ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "public_read_courses"      ON courses      FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_branches"     ON branches     FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read_gallery"      ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "public_read_videos"       ON gallery_videos FOR SELECT USING (true);
CREATE POLICY "public_read_settings"     ON site_settings  FOR SELECT USING (true);
CREATE POLICY "public_read_seo"          ON page_seo        FOR SELECT USING (true);
CREATE POLICY "public_read_instructors"  ON instructors     FOR SELECT USING (is_active = true);

-- Visitors can insert leads and page views
CREATE POLICY "public_insert_lead" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "public_insert_view" ON page_views FOR INSERT WITH CHECK (true);

-- Admin full access (authenticated users)
CREATE POLICY "admin_all_settings"     ON site_settings  FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_branches"     ON branches       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_courses"      ON courses        FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_leads"        ON leads          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_testimonials" ON testimonials    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_gallery"      ON gallery_photos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_videos"       ON gallery_videos FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_instructors"  ON instructors    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_seo"          ON page_seo       FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_views"        ON page_views     FOR ALL USING (auth.role() = 'authenticated');

-- Seed default site settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name_bn', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার'),
  ('site_name_en', 'Shahjalal Driving Training Center'),
  ('admin_email', ''),
  ('whatsapp_default', '01949965355'),
  ('facebook_url', 'https://facebook.com/ShahjalalDrivingTrainingCentre78'),
  ('youtube_url', 'https://youtube.com/@shahjalaldrivingcenter78'),
  ('hero_title_bn', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার'),
  ('hero_title_en', 'Shahjalal Driving Training Center'),
  ('hero_subtitle_bn', 'বিআরটিএ অনুমোদিত ড্রাইভিং ট্রেনিং সেন্টার'),
  ('hero_subtitle_en', 'BRTA Approved Driving Training Center'),
  ('hero_image_url', ''),
  ('stat_students', '5000'),
  ('stat_years', '5'),
  ('stat_success_rate', '95'),
  ('brta_reg_number', '142/2021'),
  ('footer_text', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার');

-- Seed branches
INSERT INTO branches (slug, name_bn, name_en, address_bn, address_en, phones, emails, whatsapp, seo_title, seo_desc) VALUES
  ('sector-10-uttara', 'শাখা এ - সেক্টর ১০, উত্তরা', 'Branch A - Sector 10, Uttara', 'হাউস ২৬, রোড ১২/বি, সেক্টর ১০, উত্তরা, ঢাকা-১২৩০', 'House 26, Road 12/B, Sector 10, Uttara, Dhaka-1230', '["01949965355"]', '[]', '01949965355', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার — সেক্টর ১০, উত্তরা', 'BRTA approved driving school in Sector 10, Uttara, Dhaka'),
  ('tongi-gazipur', 'শাখা বি - টঙ্গী, গাজীপুর', 'Branch B - Tongi, Gazipur', 'চেরাগ আলী থেকে ভাদাম রোড, খলিল মার্কেট, আব্দুল আওয়াল বিদ্যানিকেতন স্কুল, বড়দেওড়া, মুদাফা, টঙ্গী, গাজীপুর', 'Cherag Ali to Bhadam Road, Khalil Market, Abdul Awal Biddyaniketon School, Boro Dewra, Mudafa, Tongi, Gazipur', '["01304345060"]', '[]', '01304345060', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার — টঙ্গী, গাজীপুর', 'BRTA approved driving school in Tongi, Gazipur');

-- Seed page SEO
INSERT INTO page_seo (page_key, meta_title, meta_desc) VALUES
  ('home', 'শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার | Shahjalal Driving Training Center', 'BRTA approved driving school in Uttara Dhaka & Tongi Gazipur. Car, motorcycle & professional driving courses.'),
  ('courses', 'ড্রাইভিং কোর্স | Shahjalal Driving Training Center', 'Explore our driving courses: car, motorcycle, professional & license training. BRTA approved.'),
  ('about', 'আমাদের সম্পর্কে | Shahjalal Driving Training Center', 'Learn about Shahjalal Driving Training Center - BRTA approved, experienced instructors.'),
  ('gallery', 'গ্যালারি | Shahjalal Driving Training Center', 'Photos and videos from Shahjalal Driving Training Center.'),
  ('contact', 'যোগাযোগ | Shahjalal Driving Training Center', 'Contact Shahjalal Driving Training Center. Two branches in Uttara and Tongi.');
