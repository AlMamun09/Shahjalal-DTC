-- Blog posts
CREATE TABLE blog_posts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        TEXT UNIQUE NOT NULL,
  title_bn    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  excerpt_bn  TEXT,
  excerpt_en  TEXT,
  content_bn  TEXT,
  content_en  TEXT,
  image_url   TEXT,
  author      TEXT DEFAULT 'Shahjalal Driving Center',
  category    TEXT,
  tags        TEXT[],
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Services (icon cards on homepage)
CREATE TABLE services (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  desc_bn     TEXT,
  desc_en     TEXT,
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- Facilities
CREATE TABLE facilities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn    TEXT NOT NULL,
  title_en    TEXT NOT NULL,
  desc_bn     TEXT,
  desc_en     TEXT,
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- Certificates (for certificate check)
CREATE TABLE certificates (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name    TEXT NOT NULL,
  certificate_no  TEXT UNIQUE NOT NULL,
  course_name     TEXT,
  issue_date      DATE,
  dob             DATE,
  is_valid        BOOLEAN DEFAULT true
);

-- Update courses table with class breakdown
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price_bdt INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS practical_classes INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS auto_classes INTEGER;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS theory_classes INTEGER;

-- RLS for new tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_blog" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "public_read_services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_facilities" ON facilities FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_certificates" ON certificates FOR SELECT USING (true);

CREATE POLICY "admin_all_blog" ON blog_posts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_facilities" ON facilities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "admin_all_certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');

-- Seed services
INSERT INTO services (title_bn, title_en, desc_bn, desc_en, icon, sort_order) VALUES
  ('অটো কার ড্রাইভিং', 'Auto Car Driving', 'অটোমেটিক কার ড্রাইভিং শিখুন সহজেই। আধুনিক প্রশিক্ষণের মাধ্যমে দ্রুত শেখার নিশ্চয়তা।', 'Learn automatic car driving easily. Guaranteed fast learning through modern training.', '🚗', 1),
  ('ম্যানুয়াল কার ড্রাইভিং', 'Manual Car Driving', 'ম্যানুয়াল গাড়ি চালানোর সম্পূর্ণ প্রশিক্ষণ। গিয়ার শিফট থেকে শুরু করে পার্কিং পর্যন্ত।', 'Complete manual car driving training from gear shift to parking.', '⚙️', 2),
  ('বাইক ড্রাইভিং', 'Bike Driving', 'মোটরসাইকেল চালানোর পেশাদার প্রশিক্ষণ। নিরাপত্তা ও ট্রাফিক নিয়ম সহ।', 'Professional motorcycle training with safety and traffic rules.', '🏍️', 3),
  ('স্কুটার ড্রাইভিং', 'Scooter Driving', 'স্কুটার চালানো শিখুন দ্রুত ও সহজে। শহরের যাতায়াতের জন্য আদর্শ।', 'Learn scooter riding quickly and easily. Ideal for city commuting.', '🛵', 4),
  ('ডিফেন্সিভ ড্রাইভিং', 'Defensive Driving', 'নিরাপদ ড্রাইভিং টেকনিক শিখুন। দুর্ঘটনা এড়াতে সচেতন ড্রাইভিং প্রশিক্ষণ।', 'Learn safe driving techniques. Awareness training to avoid accidents.', '🛡️', 5),
  ('সাইকেল চালানো', 'Bicycle Riding', 'সাইকেল চালানোর বেসিক থেকে অ্যাডভান্সড প্রশিক্ষণ। সব বয়সীদের জন্য।', 'Basic to advanced bicycle training for all ages.', '🚲', 6);

-- Seed facilities
INSERT INTO facilities (title_bn, title_en, desc_bn, desc_en, icon, sort_order) VALUES
  ('হোস্টেল সুবিধা', 'Hostel Facilities', 'দূরবর্তী শিক্ষার্থীদের জন্য আধুনিক হোস্টেল ব্যবস্থা।', 'Modern hostel facilities for outstation students.', '🏠', 1),
  ('এসি ক্লাসরুম', 'AC Classroom', 'এয়ার কন্ডিশনেড ক্লাসরুমে আরামদায়ক শিক্ষা পরিবেশ।', 'Comfortable learning environment in AC classrooms.', '❄️', 2),
  ('চাকরির সহায়তা', 'Job Placement', 'পেশাদার ড্রাইভার হিসেবে চাকরি পাওয়ার জন্য সহায়তা।', 'Job placement assistance for professional drivers.', '💼', 3),
  ('সনদপত্র', 'Driving Certificate', 'কোর্স শেষে সরকারী স্বীকৃত সনদপত্র প্রদান।', 'Government recognized certificate after course completion.', '📜', 4),
  ('লাইসেন্স সহায়তা', 'License Assistance', 'বিআরটিএ লাইসেন্স পাওয়ার জন্য সম্পূর্ণ গাইডলাইন ও সহায়তা।', 'Complete guidance and assistance for BRTA license.', '🎯', 5),
  ('সাশ্রয়ী মূল্য', 'Reasonable Price', 'মানসম্মত প্রশিক্ষণ সাশ্রয়ী মূল্যে। কিস্তিতে পেমেন্টের সুবিধা।', 'Quality training at reasonable prices with installment payment.', '💰', 6);

-- Seed blog posts
INSERT INTO blog_posts (slug, title_bn, title_en, excerpt_bn, excerpt_en, author, category, published, created_at) VALUES
  ('brta-driving-test-tips', 'বিআরটিএ ড্রাইভিং টেস্ট পাস করার উপায়', 'BRTA Driving Test Pass Tips', 'বিআরটিএ ড্রাইভিং টেস্টে পাস করার জন্য প্রয়োজনীয় টিপস ও গাইডলাইন।', 'Essential tips and guidelines to pass the BRTA driving test.', 'Shahjalal Team', 'Driving Test', true, NOW() - INTERVAL '3 days'),
  ('new-driver-common-mistakes', 'নতুন ড্রাইভারদের ১০টি সাধারণ ভুল', '10 Common Mistakes of New Drivers', 'নতুন ড্রাইভাররা প্রায়ই যে ভুলগুলো করে থাকেন এবং তা এড়ানোর উপায়।', 'Common mistakes new drivers make and how to avoid them.', 'Shahjalal Team', 'Safety', true, NOW() - INTERVAL '7 days'),
  ('women-driving-training', 'নারীদের জন্য বিশেষ ড্রাইভিং প্রশিক্ষণ', 'Special Driving Training for Women', 'নারীদের জন্য নিরাপদ ও আরামদায়ক ড্রাইভিং প্রশিক্ষণের ব্যবস্থা।', 'Safe and comfortable driving training arrangements for women.', 'Shahjalal Team', 'Training', true, NOW() - INTERVAL '14 days'),
  ('learning-car-driving-guide', 'কার ড্রাইভিং শেখার সম্পূর্ণ গাইড', 'Complete Guide to Learn Car Driving', 'প্রথমবার কার ড্রাইভিং শেখার আগে যে বিষয়গুলো জানা জরুরি।', 'Important things to know before learning car driving for the first time.', 'Shahjalal Team', 'Beginner', true, NOW() - INTERVAL '21 days');

-- Seed certificates (demo data)
INSERT INTO certificates (student_name, certificate_no, course_name, issue_date, dob, is_valid) VALUES
  ('Abdullah Al Mamun', 'SDC-2026-0001', 'Car Driving', '2026-03-15', '1995-06-15', true),
  ('Sharmin Akhter', 'SDC-2026-0002', 'Motorcycle', '2026-03-20', '1998-09-22', true),
  ('Robiul Islam', 'SDC-2026-0003', 'Professional Driving', '2026-02-10', '1992-12-05', true);

-- Update courses with BDT prices and class breakdown
UPDATE courses SET price_bdt = 15000, practical_classes = 22, auto_classes = 4, theory_classes = 4 WHERE slug = 'car-driving';
UPDATE courses SET price_bdt = 8000, practical_classes = 12, auto_classes = 4, theory_classes = 4 WHERE slug = 'motorcycle';
UPDATE courses SET price_bdt = 25000, practical_classes = 34, auto_classes = 6, theory_classes = 6 WHERE slug = 'professional-driving';
UPDATE courses SET price_bdt = 5000, practical_classes = 6, auto_classes = 2, theory_classes = 2 WHERE slug = 'refresher-course';
UPDATE courses SET price_bdt = 3000, practical_classes = 0, auto_classes = 0, theory_classes = 0 WHERE slug = 'license-assistance';
