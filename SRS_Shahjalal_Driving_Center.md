# Software Requirements Specification (SRS)
## Shahjalal Driving Training Center — Official Website

**Version:** 2.1  
**Date:** May 2026  
**Prepared for:** Shahjalal Driving Training Center  
**Document Type:** Software Requirements Specification  
**Changes in v2.1:** Branch B address confirmed (Tongi, Gazipur); Branch B SEO updated; floating action button (FAB) spec added — circular bottom-right with phone + WhatsApp on mobile

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Business Overview](#2-business-overview)
3. [Actors & Roles](#3-actors--roles)
4. [Scope](#4-scope)
5. [Functional Requirements — Visitor](#5-functional-requirements--visitor)
6. [Functional Requirements — Admin Panel](#6-functional-requirements--admin-panel)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Information Architecture](#8-information-architecture)
9. [Page-by-Page Specifications](#9-page-by-page-specifications)
10. [Admin Panel Specifications](#10-admin-panel-specifications)
11. [Database Schema (Supabase)](#11-database-schema-supabase)
12. [Design & Branding](#12-design--branding)
13. [Technical Stack](#13-technical-stack)
14. [Integrations](#14-integrations)
15. [Content Requirements](#15-content-requirements)
16. [SEO Requirements](#16-seo-requirements)
17. [Accessibility](#17-accessibility)
18. [Constraints & Assumptions](#18-constraints--assumptions)
19. [Milestones](#19-milestones)
20. [Appendices](#20-appendices)

---

## 1. Introduction

### 1.1 Purpose
Defines all requirements for the official website of **Shahjalal Driving Training Center** — a BRTA-certified dual-branch driving school with branches in Uttara, Dhaka and Tongi, Gazipur. The site enables visitors to explore courses and contact the center, and gives admin full control over all content and analytics via a comprehensive management panel.

### 1.2 Document Scope
Covers: React frontend, Supabase backend, admin panel, dual-branch SEO, integrations, and deployment.

### 1.3 Definitions
| Term | Meaning |
|------|---------|
| BRTA | Bangladesh Road Transport Authority |
| Visitor | Any unauthenticated user browsing the website |
| Admin | Authenticated center staff with full CMS + analytics access |
| Branch A | Address from visiting card: House 26, Road 12/B, Sector 10, Uttara, Dhaka-1230 |
| Branch B | Cherag Ali to Bhadam Road, Khalil Market, Abdul Awal Biddyaniketon School, Boro Dewra, Mudafa, Tongi, Gazipur |
| Supabase | Open-source Firebase alternative — PostgreSQL + Auth + Storage + Realtime |
| RLS | Row-Level Security (Supabase feature) |

---

## 2. Business Overview

### 2.1 Organization Profile
| Field | Detail |
|-------|--------|
| Name | Shahjalal Driving Training Center |
| Registration | Govt. Reg. No: 142/2021 (BRTA approved) |
| Branch A | House 26, Road 12/B, Sector 10, Uttara, Dhaka-1230 (visiting card) |
| Branch B | Cherag Ali to Bhadam Road, Khalil Market, Abdul Awal Biddyaniketon School, Boro Dewra, Mudafa, Tongi, Gazipur |
| Phone 1 | 01949-965355 |
| Phone 2 | 01304-345060 |
| Facebook | facebook.com/ShahjalalDrivingTrainingCentre78 |
| YouTube | youtube.com/@shahjalaldrivingcenter78 |

### 2.2 Business Goals
- Increase enrollments via professional online presence
- Allow admin to independently manage all site content (no developer needed post-launch)
- Provide admin with analytics on inquiries, page views, course interest
- Compete and outrank other Uttara-area driving schools in local search
- Establish trust via BRTA cert, testimonials, and media presence

### 2.3 Current Digital Presence
- Facebook: ~622 likes, active posts
- YouTube: Training/tutorial videos
- No existing website

---

## 3. Actors & Roles

Only two actor types exist in this system.

### 3.1 Visitor (Unauthenticated)
- Browses all public pages
- Submits inquiry/enrollment forms
- Views courses, gallery, branches, contact info
- Cannot access any `/admin/*` route
- No login or account creation

### 3.2 Admin (Authenticated)
- Single admin role (no multi-level roles in v1)
- Authenticates via Supabase Auth (email + password)
- Full CRUD on all site content
- Views analytics dashboard
- Manages form submissions / leads
- Manages phone numbers, emails, addresses per branch
- Admin login at `/admin/login` — not linked from public site

---

## 4. Scope

### 4.1 In Scope
- Multi-page responsive React website (Bangla primary, English toggle)
- Two-branch display with individual SEO per branch
- Online enrollment/inquiry form stored in Supabase
- WhatsApp + phone CTAs (numbers from Supabase — admin-editable)
- Embedded YouTube videos
- Google Maps for both branches
- Comprehensive admin panel: content management + analytics
- Admin-editable: phone numbers, emails, addresses, courses, testimonials, gallery, hero, site settings
- Supabase backend: PostgreSQL + Auth + Storage + Realtime

### 4.2 Out of Scope (Phase 2)
- Online payment gateway
- Student login portal
- Multi-admin / role-based access
- Mobile app
- Live chat bot
- SMS notifications

---

## 5. Functional Requirements — Visitor

### 5.1 Navigation
- **FR-NAV-01:** Sticky navbar: logo, links (Home, Courses, Branches, Gallery, About, Contact), "Enroll Now" CTA
- **FR-NAV-02:** Mobile hamburger menu
- **FR-NAV-03:** Language toggle: বাংলা / English (i18n)
- **FR-NAV-04:** Active page highlight

### 5.2 Hero Section
- **FR-HERO-01:** Full-width hero — center name, tagline, 2 CTAs ("View Courses", "Contact Us")
- **FR-HERO-02:** Hero image from Supabase Storage (admin-changeable)
- **FR-HERO-03:** BRTA trust badge: "BRTA Approved | Reg No: 142/2021"

### 5.3 Courses
- **FR-CRS-01:** Course cards: name, duration, fee, short description, "Enroll" CTA
- **FR-CRS-02:** Filter by type: All / Car / Motorcycle / Professional / License
- **FR-CRS-03:** Course detail expand/modal
- **FR-CRS-04:** All course data from Supabase `courses` table

### 5.4 Branches Section
- **FR-BRN-01:** "Our Branches" section + dedicated page showing both branches
- **FR-BRN-02:** Each branch card: name, address, phone(s), email(s), embedded Google Map, photo
- **FR-BRN-03:** Branch-specific WhatsApp CTA using that branch's phone
- **FR-BRN-04:** All branch data from Supabase `branches` table (admin-editable)

### 5.5 Enrollment / Inquiry Form
- **FR-FORM-01:** Fields: Name, Phone, Email (optional), Branch Preference, Course Interest, Message
- **FR-FORM-02:** Submission saved to Supabase `leads` table + admin email notification
- **FR-FORM-03:** Success confirmation on submit
- **FR-FORM-04:** Validation: required fields, BD phone format, email format
- **FR-FORM-05:** Spam protection: honeypot field + insert rate limiting

### 5.6 About Section
- **FR-ABT-01:** Center story, mission (admin-editable rich text)
- **FR-ABT-02:** BRTA certification image display
- **FR-ABT-03:** Instructor cards: photo, name, experience
- **FR-ABT-04:** Stats bar: years active, students trained, success rate (admin-editable)

### 5.7 Gallery / Media
- **FR-GAL-01:** Photo grid from Supabase Storage
- **FR-GAL-02:** Lightbox viewer
- **FR-GAL-03:** YouTube video embeds (URLs stored in Supabase)

### 5.8 Testimonials
- **FR-TST-01:** Student review cards: name, photo (optional), rating, text
- **FR-TST-02:** Auto-carousel on mobile
- **FR-TST-03:** Data from Supabase `testimonials` table

### 5.9 Contact Section
- **FR-CON-01:** Both branches: all phones, emails, addresses displayed
- **FR-CON-02:** Google Maps embedded per branch
- **FR-CON-03:** Clickable `tel:` links for phones
- **FR-CON-04:** Circular FAB (Floating Action Button) — bottom-right corner, mobile only (hidden on desktop ≥ 768px). FAB expands on tap to reveal two circular child buttons stacked vertically: (1) Phone call `tel:` link with phone icon, (2) WhatsApp link with WhatsApp icon. Collapse on outside tap. Numbers loaded from Supabase `site_settings`. Smooth spring/fade animation on expand/collapse.
- **FR-CON-05:** Facebook and YouTube links

### 5.10 Footer
- **FR-FTR-01:** Logo, quick links, both branch contact info
- **FR-FTR-02:** Social icons
- **FR-FTR-03:** Copyright (auto year)

---

## 6. Functional Requirements — Admin Panel

Admin panel at `/admin/*`. Protected by Supabase Auth. Not linked from public site.

### 6.1 Authentication
- **FR-ADM-AUTH-01:** Login via email + password (Supabase Auth)
- **FR-ADM-AUTH-02:** Persistent session (secure cookie)
- **FR-ADM-AUTH-03:** Logout clears session
- **FR-ADM-AUTH-04:** Password reset via email
- **FR-ADM-AUTH-05:** All `/admin/*` routes redirect to login if unauthenticated

### 6.2 Dashboard (Analytics Overview)
- **FR-ADM-DASH-01:** Summary cards: total leads today / week / month
- **FR-ADM-DASH-02:** Line chart: leads over last 30 days
- **FR-ADM-DASH-03:** Pie/donut chart: leads by course interest
- **FR-ADM-DASH-04:** Bar chart: leads by branch preference
- **FR-ADM-DASH-05:** Page views tracker (custom Supabase `page_views` table or GA4 API)
- **FR-ADM-DASH-06:** Recent 10 submissions with quick-view
- **FR-ADM-DASH-07:** Quick actions: Add Course, Add Photo, View Leads

### 6.3 Site Settings Manager
Admin edits global settings stored in Supabase `site_settings`:

- **FR-ADM-SET-01:** Center name (Bangla + English)
- **FR-ADM-SET-02:** Admin notification email
- **FR-ADM-SET-03:** Default WhatsApp number (floating button)
- **FR-ADM-SET-04:** Facebook URL, YouTube URL
- **FR-ADM-SET-05:** Hero title, subtitle, image (upload)
- **FR-ADM-SET-06:** Stats: students trained, years active, success rate
- **FR-ADM-SET-07:** BRTA registration number
- **FR-ADM-SET-08:** Footer copyright text

### 6.4 Branch Manager
- **FR-ADM-BRN-01:** List both branches with status
- **FR-ADM-BRN-02:** Per-branch editable fields:
  - Name (Bangla + English)
  - Address (Bangla + English)
  - **Phone numbers** (JSON array — admin can add/remove individual numbers)
  - **Email addresses** (JSON array — admin can add/remove)
  - WhatsApp number
  - Google Maps embed URL
  - Branch photo (upload to Supabase Storage)
  - SEO: meta title, meta description, keywords
- **FR-ADM-BRN-03:** Toggle branch active/inactive

### 6.5 Courses Manager
- **FR-ADM-CRS-01:** List all courses with status
- **FR-ADM-CRS-02:** Add course: name (BN+EN), category, duration, fee, description, icon, status
- **FR-ADM-CRS-03:** Edit any course field
- **FR-ADM-CRS-04:** Soft delete course
- **FR-ADM-CRS-05:** Drag-and-drop reorder

### 6.6 Leads / Inquiry Manager
- **FR-ADM-LEAD-01:** Full paginated table of all submissions
- **FR-ADM-LEAD-02:** Columns: date, name, phone, email, branch pref, course interest, message, status
- **FR-ADM-LEAD-03:** Status workflow: New → Contacted → Enrolled → Closed
- **FR-ADM-LEAD-04:** Filter: status, date range, branch, course
- **FR-ADM-LEAD-05:** Export to CSV
- **FR-ADM-LEAD-06:** Delete lead
- **FR-ADM-LEAD-07:** Admin internal notes per lead

### 6.7 Gallery Manager
- **FR-ADM-GAL-01:** Upload photos (drag-drop) to Supabase Storage
- **FR-ADM-GAL-02:** Delete photos
- **FR-ADM-GAL-03:** Add/edit/remove YouTube video URLs with titles
- **FR-ADM-GAL-04:** Reorder gallery items

### 6.8 Testimonials Manager
- **FR-ADM-TST-01:** Add: name, rating, text (BN+EN), photo
- **FR-ADM-TST-02:** Edit / delete
- **FR-ADM-TST-03:** Toggle visible/hidden

### 6.9 About / Instructors Manager
- **FR-ADM-ABT-01:** Edit about text (BN+EN rich text editor)
- **FR-ADM-ABT-02:** Add/edit/delete instructors: name, photo, experience, specialization

### 6.10 SEO Manager
- **FR-ADM-SEO-01:** Per-page SEO: meta title, meta description, OG image
- **FR-ADM-SEO-02:** Branch-specific SEO (managed inside Branch Manager)
- **FR-ADM-SEO-03:** JSON-LD schema preview per branch

---

## 7. Non-Functional Requirements

### 7.1 Performance
- **NFR-PERF-01:** LCP < 2.5s on 4G mobile
- **NFR-PERF-02:** Lighthouse performance ≥ 85
- **NFR-PERF-03:** Images: WebP, lazy-loaded, Supabase CDN
- **NFR-PERF-04:** React code splitting per route

### 7.2 Responsiveness
- **NFR-RESP-01:** Mobile-first, 320px → 1920px
- **NFR-RESP-02:** Touch targets ≥ 44×44px

### 7.3 Security
- **NFR-SEC-01:** HTTPS everywhere
- **NFR-SEC-02:** Supabase RLS: visitors read-only / insert `leads` only; admin full access
- **NFR-SEC-03:** Admin routes server-protected by Supabase session check
- **NFR-SEC-04:** Form spam: honeypot + rate limit on `leads` inserts
- **NFR-SEC-05:** No secrets in client bundle (env vars only)

### 7.4 Browser Support
- Chrome, Firefox, Safari, Edge (latest 2 versions)
- Android Chrome, iOS Safari

### 7.5 Availability
- Vercel (frontend): 99.9% SLA
- Supabase: 99.9% SLA

### 7.6 Maintainability
- TypeScript throughout
- Component-based React
- All content in Supabase (zero hardcoded strings in production)

---

## 8. Information Architecture

### 8.1 Public Site
```
/ (Home)
├── Hero
├── Trust Bar
├── Courses Teaser
├── Branches Overview
├── Why Choose Us
├── Testimonials
├── YouTube Videos
└── CTA Block

/courses
└── /courses/:slug

/branches
├── /branches/branch-a
└── /branches/branch-b

/about
/gallery
/contact
/enroll
```

### 8.2 Admin Panel
```
/admin/login

/admin                  ← Dashboard / Analytics
/admin/settings         ← Site settings (name, email, WhatsApp, hero...)
/admin/branches         ← Branch manager (phones, emails, address, maps)
/admin/courses          ← Course manager
/admin/leads            ← Inquiry/lead manager
/admin/gallery          ← Photo + video manager
/admin/testimonials     ← Testimonials
/admin/about            ← About text + instructors
/admin/seo              ← Per-page SEO
```

---

## 9. Page-by-Page Specifications

### 9.1 Home Page (`/`)
| Section | Content | Priority |
|---------|---------|----------|
| Hero | Name BN+EN, tagline, 2 CTAs, BRTA badge | P0 |
| Trust Bar | BRTA cert, students, years, success rate | P0 |
| Courses Teaser | Top 3 cards + "See All" | P0 |
| Branches Preview | Both branch cards + map links | P0 |
| Why Us | 4 icon blocks | P1 |
| Testimonials | Carousel | P1 |
| YouTube | 2 embeds | P1 |
| CTA Banner | Phone + Enroll | P0 |

### 9.2 Courses Page (`/courses`)
- 2-col mobile / 3-col desktop
- Filter: All / Car / Motorcycle / Professional / License
- Card: icon, name BN+EN, duration, price, description, CTA

### 9.3 Branches Page (`/branches`)
- Both branches side-by-side (stacked mobile)
- Each: name, address BN+EN, phones (clickable), emails, map, photo, WhatsApp CTA
- Link to individual branch detail page

### 9.4 Branch Detail Page (`/branches/:slug`)
- Full branch info + unique SEO meta tags from Supabase
- Branch-specific JSON-LD LocalBusiness schema
- Inquiry form pre-selecting that branch

### 9.5 About Page (`/about`)
- Story + BRTA cert + instructor grid + timeline

### 9.6 Gallery Page (`/gallery`)
- Masonry photo grid + lightbox + YouTube embeds

### 9.7 Contact Page (`/contact`)
- Both branches: address, phones, emails, maps
- Inquiry form + social links

### 9.8 Enroll Page (`/enroll`)
- Full enrollment form
- Branch dropdown (from Supabase)
- Course dropdown (from Supabase)

---

## 10. Admin Panel Specifications

### 10.1 Layout
- Left sidebar (collapsible on mobile)
- Top bar: admin name, logout, "View Site" link
- Neutral dark sidebar (`#1E293B`), white content area
- Brand red accent for active states

### 10.2 Dashboard Layout
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ Total Leads │ Leads Today │ This Week   │ This Month  │
└─────────────┴─────────────┴─────────────┴─────────────┘
┌──────────────────────────┬──────────────────────────┐
│  Leads Over Time (30d)   │  Leads by Course         │
│  [Line Chart]            │  [Pie/Donut Chart]       │
└──────────────────────────┴──────────────────────────┘
┌──────────────────────────┬──────────────────────────┐
│  Leads by Branch         │  Recent Submissions      │
│  [Bar Chart]             │  [Table, last 10]        │
└──────────────────────────┴──────────────────────────┘
```

### 10.3 Branch Manager — Phone & Email Editing
Each branch: admin sees list of current phones + emails with "Add" / "Remove" per item. Stored as JSONB array in Supabase. WhatsApp field separate. Changes reflect on public site immediately.

### 10.4 Site Settings — All Editable Fields
`site_settings` key-value table:

| Key | Description |
|-----|-------------|
| `site_name_bn` | Center name in Bangla |
| `site_name_en` | Center name in English |
| `admin_email` | Email for lead notifications |
| `whatsapp_default` | Floating WhatsApp button number |
| `facebook_url` | Facebook page URL |
| `youtube_url` | YouTube channel URL |
| `hero_title_bn/en` | Hero heading |
| `hero_subtitle_bn/en` | Hero subheading |
| `hero_image_url` | Hero background image |
| `stat_students` | Students trained count |
| `stat_years` | Years active |
| `stat_success_rate` | Success rate % |
| `brta_reg_number` | BRTA registration number |
| `footer_text` | Footer copyright name |

---

## 11. Database Schema (Supabase)

```sql
-- Global settings (key-value)
CREATE TABLE site_settings (
  key        TEXT PRIMARY KEY,
  value      TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Branches
CREATE TABLE branches (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          TEXT UNIQUE NOT NULL,
  name_bn       TEXT NOT NULL,
  name_en       TEXT NOT NULL,
  address_bn    TEXT,
  address_en    TEXT,
  phones        JSONB DEFAULT '[]',   -- ["01949965355","01304345060"]
  emails        JSONB DEFAULT '[]',   -- ["info@example.com"]
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

-- Courses
CREATE TABLE courses (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug           TEXT UNIQUE NOT NULL,
  name_bn        TEXT NOT NULL,
  name_en        TEXT NOT NULL,
  category       TEXT,  -- car/motorcycle/professional/refresher/license
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

-- Leads / Inquiries
CREATE TABLE leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  name            TEXT NOT NULL,
  phone           TEXT NOT NULL,
  email           TEXT,
  branch_pref     TEXT,
  course_interest TEXT,
  message         TEXT,
  status          TEXT DEFAULT 'new',  -- new/contacted/enrolled/closed
  admin_notes     TEXT
);

-- Testimonials
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

-- Gallery Photos
CREATE TABLE gallery_photos (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url        TEXT NOT NULL,
  alt_text   TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gallery Videos
CREATE TABLE gallery_videos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_bn    TEXT,
  title_en    TEXT,
  youtube_url TEXT NOT NULL,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Instructors
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

-- Page SEO
CREATE TABLE page_seo (
  page_key     TEXT PRIMARY KEY,  -- home/courses/about/gallery/contact
  meta_title   TEXT,
  meta_desc    TEXT,
  og_image_url TEXT,
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Page views (custom analytics)
CREATE TABLE page_views (
  id         BIGSERIAL PRIMARY KEY,
  page       TEXT NOT NULL,
  viewed_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### 11.1 RLS Policies (Key)
```sql
-- Public read on safe tables
CREATE POLICY "public_read_courses"      ON courses      FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_branches"     ON branches     FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_testimonials" ON testimonials FOR SELECT USING (is_visible = true);
CREATE POLICY "public_read_gallery"      ON gallery_photos FOR SELECT USING (true);
CREATE POLICY "public_read_videos"       ON gallery_videos FOR SELECT USING (true);
CREATE POLICY "public_read_settings"     ON site_settings  FOR SELECT USING (true);
CREATE POLICY "public_read_seo"          ON page_seo        FOR SELECT USING (true);
CREATE POLICY "public_read_instructors"  ON instructors     FOR SELECT USING (is_active = true);

-- Visitors insert leads only
CREATE POLICY "public_insert_lead" ON leads FOR INSERT WITH CHECK (true);

-- Visitors can insert page views
CREATE POLICY "public_insert_view" ON page_views FOR INSERT WITH CHECK (true);

-- Leads readable/editable by admin only
CREATE POLICY "admin_all_leads" ON leads FOR ALL USING (auth.role() = 'authenticated');

-- Admin full access on all tables (add per-table)
```

### 11.2 Storage Buckets
| Bucket | Public | Usage |
|--------|--------|-------|
| `hero-images` | Yes | Hero background |
| `gallery` | Yes | Gallery photos |
| `instructor-photos` | Yes | Instructor headshots |
| `branch-photos` | Yes | Branch exterior photos |
| `testimonial-photos` | Yes | Student photos |
| `certificates` | Yes | BRTA cert image |

---

## 12. Design & Branding

### 12.1 Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#CC1616` | CTAs, highlights, headers |
| Deep Black | `#111111` | Nav, dark sections |
| Gold/Yellow | `#F5C518` | Accent, badges, trust bar |
| White | `#FFFFFF` | Body text on dark, cards |
| Light Gray | `#F5F5F5` | Section backgrounds |
| Success Green | `#16A34A` | Form success, enrolled status |

### 12.2 Typography
| Role | Font | Weight |
|------|------|--------|
| Bangla body | Hind Siliguri | 400, 700 |
| English body | Poppins | 400, 600 |
| Headings | Poppins Bold | 700 |
| Admin panel | Inter | 400, 500, 600 |

### 12.3 Brand Name
- Bangla: **শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার**
- English: **Shahjalal Driving Training Center**

---

## 13. Technical Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React 18 + Vite | Fast, component-based |
| Routing | React Router v6 | SPA + protected routes |
| Styling | Tailwind CSS | Rapid responsive UI |
| Language | TypeScript | Type safety |
| Backend / DB | Supabase (PostgreSQL) | Auth + DB + Storage + Realtime |
| Auth | Supabase Auth | Email+password admin login |
| Storage | Supabase Storage | Images / media |
| Charts | Recharts | Admin analytics |
| i18n | react-i18next | BN/EN toggle |
| Forms | React Hook Form + Zod | Validation |
| Maps | Google Maps Embed API | Branch maps |
| Email | Supabase Edge Function + Resend | Lead notifications |
| Hosting | Vercel | Frontend |
| CI/CD | GitHub → Vercel | Auto deploy |

### 13.1 Project Structure
```
/
├── src/
│   ├── components/       # Shared UI
│   ├── pages/            # Public pages
│   │   ├── Home.tsx
│   │   ├── Courses.tsx
│   │   ├── Branches.tsx
│   │   ├── BranchDetail.tsx
│   │   ├── About.tsx
│   │   ├── Gallery.tsx
│   │   ├── Contact.tsx
│   │   └── Enroll.tsx
│   ├── admin/            # Admin panel
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   ├── BranchManager.tsx
│   │   ├── CourseManager.tsx
│   │   ├── LeadsManager.tsx
│   │   ├── GalleryManager.tsx
│   │   ├── TestimonialsManager.tsx
│   │   ├── AboutManager.tsx
│   │   └── SeoManager.tsx
│   ├── lib/
│   │   ├── supabase.ts   # Supabase client
│   │   └── i18n.ts
│   ├── hooks/
│   ├── types/
│   └── locales/
│       ├── bn.json
│       └── en.json
├── supabase/
│   └── functions/
│       └── notify-lead/  # Edge function → email admin
├── .env
└── vercel.json
```

---

## 14. Integrations

| Integration | Purpose | Method |
|-------------|---------|--------|
| Supabase | DB, auth, storage, realtime | `@supabase/supabase-js` |
| Google Maps | Branch maps | Embed iframe URL in Supabase |
| YouTube | Training videos | iframe, URLs in Supabase |
| WhatsApp | Lead conversion | `wa.me/{phone}` from Supabase |
| Google Analytics 4 | Traffic tracking | GA4 gtag |
| Resend (via Edge Fn) | Admin lead email notify | Supabase Edge Function |
| Facebook | Social link | URL from site_settings |

---

## 15. Content Requirements

### 15.1 Languages
- Primary: **বাংলা** — Secondary: **English**
- react-i18next for toggle

### 15.2 Required from Client
- [ ] Which phone numbers belong to which branch
- [ ] Per-branch email addresses
- [ ] Hi-res branch exterior photos
- [ ] Training session photos
- [ ] Instructor names, photos, bios
- [ ] Course fees and durations
- [ ] BRTA certificate scan
- [ ] 3–5 student testimonials
- [ ] Admin login email

### 15.3 Already Available
- Center name, BRTA reg no, phones (business card)
- Branch A address (business card — Sector 10, Uttara)
- Branch B address confirmed (Tongi, Gazipur)
- Cover photo (CoverPhoto.jpg)
- YouTube videos
- Facebook page

---

## 16. SEO Requirements

### 16.1 Dual-Branch SEO Strategy
Each branch has its own page with unique SEO targeting its specific location.

**Branch A — Sector 10, Uttara:**
| Signal | Value |
|--------|-------|
| URL | `/branches/sector-10-uttara` |
| Meta Title | শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার — সেক্টর ১০, উত্তরা |
| Keywords | ড্রাইভিং স্কুল সেক্টর ১০ উত্তরা, driving school sector 10 uttara |

**Branch B — Tongi, Gazipur:**
| Signal | Value |
|--------|-------|
| URL | `/branches/tongi-gazipur` |
| Meta Title | শাহজালাল ড্রাইভিং ট্রেনিং সেন্টার — টঙ্গী, গাজীপুর |
| Keywords | ড্রাইভিং স্কুল টঙ্গী গাজীপুর, driving school Tongi Gazipur, ড্রাইভিং কোর্স মুদাফা বড়দেওড়া |

### 16.2 Keyword Targets
| Keyword (Bangla) | Keyword (English) | Priority |
|-----------------|------------------|---------|
| শাহজালাল ড্রাইভিং সেন্টার | Shahjalal Driving Training Center | P0 |
| ড্রাইভিং স্কুল উত্তরা ঢাকা | Driving school Uttara Dhaka | P0 |
| ড্রাইভিং স্কুল টঙ্গী গাজীপুর | Driving school Tongi Gazipur | P0 |
| বিআরটিএ অনুমোদিত ড্রাইভিং স্কুল | BRTA approved driving school | P0 |
| কার ড্রাইভিং ট্রেনিং উত্তরা | Car driving training Uttara | P1 |
| কার ড্রাইভিং কোর্স গাজীপুর | Car driving course Gazipur | P1 |
| মোটরসাইকেল ড্রাইভিং কোর্স ঢাকা | Motorcycle driving course Dhaka | P1 |
| ড্রাইভিং স্কুল মুদাফা বড়দেওড়া | Driving school Mudafa Boro Dewra | P2 |
| প্রফেশনাল ড্রাইভিং লাইসেন্স | Professional driving license BD | P1 |
| ড্রাইভিং লাইসেন্স সহায়তা ঢাকা | Driving license support Dhaka | P2 |

### 16.3 On-Page SEO
- Unique `<title>` + `<meta description>` per page (from `page_seo` + `branches` tables)
- H1 with primary keyword per page
- Image alt text from Supabase records
- Canonical tags
- Open Graph + Twitter Card
- Sitemap.xml from routes
- robots.txt: allow public, disallow `/admin`

### 16.4 Dual Branch JSON-LD
Two separate `DrivingSchool` schema blocks rendered on relevant pages:

```json
[
  {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "name": "Shahjalal Driving Training Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "House 26, Road 12/B, Sector 10",
      "addressLocality": "Uttara",
      "addressRegion": "Dhaka",
      "postalCode": "1230",
      "addressCountry": "BD"
    },
    "telephone": "+8801949965355",
    "url": "https://shahjalaldrivingcenter.com/branches/sector-10-uttara"
  },
  {
    "@context": "https://schema.org",
    "@type": "DrivingSchool",
    "name": "Shahjalal Driving Training Center",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Cherag Ali to Bhadam Road, Khalil Market, Abdul Awal Biddyaniketon School, Boro Dewra, Mudafa",
      "addressLocality": "Tongi",
      "addressRegion": "Gazipur",
      "addressCountry": "BD"
    },
    "telephone": "+8801304345060",
    "url": "https://shahjalaldrivingcenter.com/branches/tongi-gazipur"
  }
]
```

### 16.5 Post-Launch Local SEO
- Create 2× Google Business Profile listings (one per branch)
- Submit both to Google Search Console
- NAP consistency: name, address, phone same on site + GBP + Facebook

---

## 17. Accessibility

- WCAG 2.1 Level AA
- Color contrast ≥ 4.5:1
- All images have alt text
- Form labels + aria attributes
- Keyboard navigable (public + admin)
- Skip-to-content link
- Visible focus indicators

---

## 18. Constraints & Assumptions

### 18.1 Constraints
- Admin is sole editor — single-role system only
- Budget: Supabase free tier + Vercel hobby for launch
- Admin panel must be non-developer-friendly (clear UI, no raw JSON editing except phones/emails via structured add/remove UI)
- Domain to register: `shahjalaldrivingcenter.com` (or `.com.bd`)

### 18.2 Assumptions
- Client assigns specific phones to specific branches
- Admin email provided for Supabase Auth setup
- Supabase anon key safe for public read (RLS enforces limits)
- Vercel + Supabase sufficient infrastructure for launch traffic

---

## 19. Milestones

| Phase | Tasks | Duration |
|-------|-------|---------|
| **Phase 0 — Setup** | Domain, Supabase project, Vercel, GitHub repo, env config | Week 1 |
| **Phase 1 — DB & Auth** | Schema, RLS, storage buckets, admin auth flow | Week 1–2 |
| **Phase 2 — Admin Panel** | All admin pages: dashboard, settings, branches, courses, leads, gallery, SEO | Week 2–4 |
| **Phase 3 — Public Site** | All public pages with live Supabase data, i18n, maps, forms | Week 3–5 |
| **Phase 4 — Content Entry** | Admin enters all content via panel | Week 5–6 |
| **Phase 5 — SEO** | Meta tags, JSON-LD per branch, sitemap, robots, GSC submit | Week 6 |
| **Phase 6 — Testing** | Cross-browser, mobile, RLS, form, admin flow, analytics | Week 6–7 |
| **Phase 7 — Launch** | DNS, go live, GA4 verify, 2× Google Business Profile | Week 7 |
| **Phase 8 — Post-launch** | GSC monitoring, social link updates, fixes | Week 8 |

---

## 20. Appendices

### Appendix A — Full Sitemap
```
shahjalaldrivingcenter.com/
├── /
├── /courses
│   └── /courses/:slug
├── /branches
│   ├── /branches/sector-10-uttara     (Branch A)
│   └── /branches/tongi-gazipur        (Branch B)
├── /about
├── /gallery
├── /contact
├── /enroll
└── /admin/*  [disallowed in robots.txt, not indexed]
    ├── /admin/login
    ├── /admin
    ├── /admin/settings
    ├── /admin/branches
    ├── /admin/courses
    ├── /admin/leads
    ├── /admin/gallery
    ├── /admin/testimonials
    ├── /admin/about
    └── /admin/seo
```

### Appendix B — Circular FAB Spec (Mobile)

The FAB is visible only on mobile (hidden ≥ 768px via Tailwind `md:hidden`). Positioned `fixed bottom-6 right-6 z-50`.

**States:**
- **Collapsed:** Single circular button (56×56px), brand red background, white "+" or custom icon (phone+WA combined)
- **Expanded (on tap):** Main button stays; two child buttons animate upward with staggered spring:
  - Child 1 (top): WhatsApp — green `#25D366`, WhatsApp SVG icon
  - Child 2 (mid): Phone — brand red `#CC1616`, phone SVG icon
- Tap outside → collapse

**React component sketch:**
```tsx
// FAB numbers from Supabase site_settings
const FAB = () => {
  const [open, setOpen] = useState(false);
  const phone = settings.whatsapp_default; // e.g. "01949965355"
  const waUrl = `https://wa.me/88${phone}?text=${encodeURIComponent(
    'আমি ড্রাইভিং কোর্স সম্পর্কে জানতে চাই'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 md:hidden flex flex-col items-center gap-3">
      {open && (
        <>
          {/* WhatsApp child button */}
          <a href={waUrl} target="_blank"
            className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg
                       animate-in slide-in-from-bottom-2">
            <WhatsAppIcon />
          </a>
          {/* Phone child button */}
          <a href={`tel:+88${phone}`}
            className="w-12 h-12 rounded-full bg-[#CC1616] flex items-center justify-center shadow-lg
                       animate-in slide-in-from-bottom-2 delay-75">
            <PhoneIcon />
          </a>
        </>
      )}
      {/* Main toggle button */}
      <button onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full bg-[#CC1616] flex items-center justify-center shadow-xl
                   transition-transform duration-200 active:scale-95">
        {open ? <XIcon /> : <ChatIcon />}
      </button>
    </div>
  );
};
```

**Admin-editable:** Phone number for FAB comes from `site_settings.whatsapp_default` (Branch-specific override in `branches.whatsapp` used on branch detail pages).
```tsx
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useSupabaseAuth();
  if (loading) return <Spinner />;
  return session ? <>{children}</> : <Navigate to="/admin/login" replace />;
};
```

### Appendix C — Admin Protected Route (React)
```tsx
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading } = useSupabaseAuth();
  if (loading) return <Spinner />;
  return session ? <>{children}</> : <Navigate to="/admin/login" replace />;
};
```

### Appendix D — Environment Variables
```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJxxx...
VITE_GOOGLE_MAPS_KEY=AIzaXXX...
VITE_GA4_ID=G-XXXXXXX
```

### Appendix E — Lead Notification Edge Function
```
supabase/functions/notify-lead/index.ts
Triggered by: Supabase DB Webhook on leads INSERT
Action: Fetch admin_email from site_settings → send via Resend API
```

---

*End of SRS — Shahjalal Driving Training Center v2.1*
