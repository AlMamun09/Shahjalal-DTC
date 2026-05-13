-- ============================================================
-- Demo/Seed Data for Shahjalal Driving Training Center
-- Run after migrations in Supabase SQL Editor
-- ============================================================

-- COURSES
INSERT INTO courses (slug, name_bn, name_en, category, duration_bn, duration_en, fee, description_bn, description_en, icon, is_active, sort_order) VALUES
  ('car-driving', 'কার ড্রাইভিং', 'Car Driving', 'car', '২ মাস', '2 Months', '৳১৫,০০০', 'বেসিক থেকে এডভান্সড কার ড্রাইভিং শেখানো হয়। হাতে-কলমে প্রশিক্ষণ ও ব্রটার টেস্টের জন্য সম্পূর্ণ প্রস্তুতি।', 'Learn car driving from basics to advanced. Hands-on training with full preparation for BRTA test.', '🚗', true, 1),
  ('motorcycle', 'মোটরসাইকেল', 'Motorcycle', 'motorcycle', '১ মাস', '1 Month', '৳৮,০০০', 'মোটরসাইকেল চালানোর জন্য সম্পূর্ণ প্রশিক্ষণ। নিরাপত্তা ও ট্রাফিক নিয়ম সম্পর্কে ধারণা।', 'Complete motorcycle riding training with safety and traffic rules.', '🏍️', true, 2),
  ('professional-driving', 'পেশাদার ড্রাইভিং', 'Professional Driving', 'professional', '৩ মাস', '3 Months', '৳২৫,০০০', 'পেশাদার ড্রাইভার হওয়ার জন্য সম্পূর্ণ কোর্স। এডভান্সড ড্রাইভিং টেকনিক ও লাইসেন্স সহায়তা।', 'Complete course to become a professional driver. Advanced techniques and license assistance.', '🚛', true, 3),
  ('refresher-course', 'রিফ্রেশার কোর্স', 'Refresher Course', 'refresher', '২ সপ্তাহ', '2 Weeks', '৳৫,০০০', 'যারা আগে ড্রাইভিং জানেন কিন্তু অভ্যাস হারিয়ে ফেলেছেন তাদের জন্য রিফ্রেশার কোর্স।', 'For those who know driving but need to refresh their skills.', '🔄', true, 4),
  ('license-assistance', 'লাইসেন্স সহায়তা', 'License Assistance', 'license', 'ভ্যারিয়েবল', 'Variable', '৳৩,০০০', 'ব্রটার ড্রাইভিং লাইসেন্সের জন্য সম্পূর্ণ সহায়তা। ফর্ম ফিলাপ থেকে টেস্ট প্রস্তুতি পর্যন্ত।', 'Complete BRTA driving license assistance from form fill-up to test preparation.', '📄', true, 5);

-- TESTIMONIALS
INSERT INTO testimonials (name, rating, text_bn, text_en, is_visible, sort_order) VALUES
  ('আব্দুল্লাহ আল মামুন', 5, 'শাহজালাল ড্রাইভিং সেন্টার থেকে কার ড্রাইভিং শিখে আমি অনেক উপকৃত হয়েছি। প্রশিক্ষকরা খুবই অভিজ্ঞ এবং সহায়ক। ব্রটার টেস্টে প্রথম চেষ্টাতেই পাস করেছি।', 'I benefited greatly from learning car driving at Shahjalal Driving Center. The instructors are very experienced and helpful. I passed the BRTA test on my first attempt.', true, 1),
  ('শারমিন আক্তার', 5, 'মেয়েদের জন্য এটি একটি নিরাপদ এবং আরামদায়ক পরিবেশ। মহিলা প্রশিক্ষক রয়েছে যা খুবই ভালো। সবাইকে রেকমেন্ড করব।', 'This is a safe and comfortable environment for women. They have female instructors which is great. I would recommend to everyone.', true, 2),
  ('রবিউল ইসলাম', 4, 'ভালো মানের প্রশিক্ষণ এবং সাশ্রয়ী মূল্য। দুই মাসের কোর্সে আমি খুবই দক্ষ হয়ে উঠেছি। ধন্যবাদ শাহজালাল টিম।', 'Good quality training at affordable prices. I became very skilled in the two-month course. Thanks to the Shahjalal team.', true, 3),
  ('নাসরিন সুলতানা', 5, 'আমার স্বামী এবং আমি দুজনই এখানে ড্রাইভিং শিখেছি। অত্যন্ত পেশাদার প্রশিক্ষণ। ব্রটার লাইসেন্স পেতেও সাহায্য করেছে।', 'Both my husband and I learned driving here. Extremely professional training. They also helped us get BRTA licenses.', true, 4),
  ('কামরুল হাসান', 5, 'প্রফেশনাল ড্রাইভিং কোর্সটি আমার ক্যারিয়ারে অনেক সাহায্য করেছে। বর্তমানে আমি একটি বেসরকারি কোম্পানিতে ড্রাইভার হিসেবে কাজ করছি।', 'The professional driving course greatly helped my career. I am currently working as a driver at a private company.', true, 5),
  ('ফাতেমা বেগম', 4, 'আমি মোটরসাইকেল কোর্স করেছি। প্রশিক্ষকরা খুবই ধৈর্যশীল এবং প্রতিটি বিষয় বিস্তারিত বোঝান।', 'I took the motorcycle course. The instructors are very patient and explain everything in detail.', true, 6);

-- INSTRUCTORS
INSERT INTO instructors (name_bn, name_en, experience, specialization, photo_url, is_active, sort_order) VALUES
  ('মোঃ জহিরুল ইসলাম', 'Md. Zahirul Islam', '৮ বছর', 'কার ড্রাইভিং ও প্রফেশনাল ট্রেনিং', NULL, true, 1),
  ('মোঃ হাসান মিয়া', 'Md. Hasan Mia', '৬ বছর', 'মোটরসাইকেল ও কার ড্রাইভিং', NULL, true, 2),
  ('নাজমা বেগম', 'Najma Begum', '৪ বছর', 'মহিলা কার ড্রাইভিং', NULL, true, 3),
  ('মোঃ কামাল উদ্দিন', 'Md. Kamal Uddin', '১০ বছর', 'প্রফেশনাল ও এডভান্সড ড্রাইভিং', NULL, true, 4),
  ('মোঃ শাহিন মিয়া', 'Md. Shahin Mia', '৫ বছর', 'কার ও মোটরসাইকেল', NULL, true, 5);

-- GALLERY PHOTOS (using placeholder images - replace with real URLs later)
-- Note: Replace photo_urls with actual uploaded image URLs from your storage
-- INSERT INTO gallery_photos (url, alt_text, sort_order) VALUES
--   ('https://fvapuxfywzpbahbjakwm.supabase.co/storage/v1/object/public/gallery/photo1.jpg', 'Training session', 1),
--   ('https://fvapuxfywzpbahbjakwm.supabase.co/storage/v1/object/public/gallery/photo2.jpg', 'Branch A exterior', 2);

-- GALLERY VIDEOS
INSERT INTO gallery_videos (title_bn, title_en, youtube_url, sort_order) VALUES
  ('ড্রাইভিং ট্রেনিং ওভারভিউ', 'Driving Training Overview', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 1),
  ('শাহজালাল ড্রাইভিং সেন্টার ট্যুর', 'Shahjalal Driving Center Tour', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 2);

-- DEMO LEADS (for admin dashboard)
INSERT INTO leads (name, phone, email, branch_pref, course_interest, message, status, created_at) VALUES
  ('Abdullah Al Mamun', '01949965355', 'abdullah@example.com', 'sector-10-uttara', 'Car Driving', 'I am interested in car driving course. Please contact me.', 'new', NOW() - INTERVAL '1 hour'),
  ('Sharmin Akhter', '01712345678', 'sharmin@example.com', 'tongi-gazipur', 'Motorcycle', 'মোটরসাইকেল কোর্স সম্পর্কে জানতে চাই।', 'new', NOW() - INTERVAL '3 hours'),
  ('Robiul Islam', '01612345678', NULL, 'sector-10-uttara', 'Professional Driving', 'Professional driving course fee and duration please.', 'contacted', NOW() - INTERVAL '1 day'),
  ('Nasrin Sultana', '01512345678', 'nasrin@example.com', 'tongi-gazipur', 'Car Driving', 'আমার বয়স ৩৫, আমি কি কার ড্রাইভিং শিখতে পারব?', 'new', NOW() - INTERVAL '2 days'),
  ('Kamrul Hasan', '01312345678', NULL, 'sector-10-uttara', 'Refresher Course', 'আমি আগে ড্রাইভিং জানি, কিন্তু ২ বছর ধরে চালাইনি। রিফ্রেশার কোর্স করলে কি হবে?', 'contacted', NOW() - INTERVAL '3 days'),
  ('Fatema Begum', '01812345678', 'fatema@example.com', 'tongi-gazipur', 'Motorcycle', 'মহিলাদের জন্য মোটরসাইকেল ট্রেনিং আছে কি?', 'enrolled', NOW() - INTERVAL '5 days'),
  ('Md. Jamil Hasan', '01911112222', NULL, 'sector-10-uttara', 'License Assistance', 'ব্রটার লাইসেন্সের জন্য কী কী ডকুমেন্ট লাগবে?', 'new', NOW() - INTERVAL '1 week'),
  ('Sadia Islam', '01722223333', 'sadia@example.com', 'tongi-gazipur', 'Car Driving', 'Car driving course fee and schedule please.', 'closed', NOW() - INTERVAL '10 days');

-- DEMO PAGE VIEWS (for admin analytics)
INSERT INTO page_views (page, viewed_at) VALUES
  ('/', NOW() - INTERVAL '1 hour'),
  ('/', NOW() - INTERVAL '1 hour'),
  ('/courses', NOW() - INTERVAL '2 hours'),
  ('/branches', NOW() - INTERVAL '3 hours'),
  ('/enroll', NOW() - INTERVAL '3 hours'),
  ('/', NOW() - INTERVAL '5 hours'),
  ('/about', NOW() - INTERVAL '6 hours'),
  ('/contact', NOW() - INTERVAL '8 hours'),
  ('/courses', NOW() - INTERVAL '10 hours'),
  ('/branches/sector-10-uttara', NOW() - INTERVAL '12 hours'),
  ('/', NOW() - INTERVAL '1 day'),
  ('/courses', NOW() - INTERVAL '1 day'),
  ('/gallery', NOW() - INTERVAL '1 day'),
  ('/enroll', NOW() - INTERVAL '1 day'),
  ('/', NOW() - INTERVAL '2 days'),
  ('/branches', NOW() - INTERVAL '2 days'),
  ('/branches/tongi-gazipur', NOW() - INTERVAL '2 days'),
  ('/contact', NOW() - INTERVAL '3 days'),
  ('/', NOW() - INTERVAL '3 days'),
  ('/about', NOW() - INTERVAL '4 days'),
  ('/courses', NOW() - INTERVAL '4 days'),
  ('/enroll', NOW() - INTERVAL '5 days'),
  ('/', NOW() - INTERVAL '5 days'),
  ('/branches', NOW() - INTERVAL '6 days'),
  ('/', NOW() - INTERVAL '7 days'),
  ('/courses', NOW() - INTERVAL '7 days'),
  ('/contact', NOW() - INTERVAL '8 days'),
  ('/', NOW() - INTERVAL '10 days'),
  ('/gallery', NOW() - INTERVAL '12 days'),
  ('/enroll', NOW() - INTERVAL '14 days');
