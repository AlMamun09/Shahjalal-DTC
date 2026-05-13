# Shahjalal Driving Training Center Implementation Plan

> **For agentic workers:** Use `subagent-driven-development` (recommended) or `writing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Each phase references which skill to invoke.

**Goal:** Build a multi-page responsive React website for Shahjalal Driving Training Center with a comprehensive admin panel, Supabase backend, dual-branch SEO, and Vercel deployment.

**Architecture:** React 18 SPA with React Router v6, Supabase (PostgreSQL + Auth + Storage), Tailwind CSS, react-i18next for Bn/En i18n, Recharts for admin analytics, deployed on Vercel.

**Tech Stack:** React 18, Vite, TypeScript, Tailwind CSS, Supabase, React Router v6, Recharts, react-i18next, React Hook Form + Zod, Google Maps Embed, Resend (Edge Function), Vercel

**Skill Usage Key:**
- `writing-plans` → Planning phase creation
- `subagent-driven-development` → Multi-task execution
- `test-driven-development` → Writing tests before code
- `investigate` / `systematic-debugging` → Debugging issues
- `frontend-design` → UI/UX design work
- `react-best-practices` → React component optimization
- `supabase-postgres-best-practices` → DB schema, RLS, queries
- `seo` → Meta tags, JSON-LD, sitemaps
- `accessibility` → WCAG compliance
- `best-practices` → Security, CSP, headers
- `core-web-vitals` / `performance` / `web-perf` → Performance optimization
- `web-quality-audit` → Pre-launch quality check

---

## Phase 0: Project Setup (Week 1)

> **Invoke:** `subagent-driven-development` for executing these tasks

- [ ] **Task 0.1: Initialize Vite + React + TypeScript project**

```bash
npm create vite@latest shahjalal-driving-center -- --template react-ts
cd shahjalal-driving-center
npm install
```

- [ ] **Task 0.2: Install all dependencies**

```bash
npm install react-router-dom@6 @supabase/supabase-js recharts react-i18next i18next tailwindcss @tailwindcss/vite react-hook-form zod @hookform/resolvers
npm install -D @types/react @types/react-dom
```

- [ ] **Task 0.3: Configure Tailwind with brand colors**

> **Invoke:** `frontend-design` for Tailwind config with brand palette

Configure `tailwind.config.ts` with:
- Primary Red: `#CC1616`
- Deep Black: `#111111`
- Gold/Yellow: `#F5C518`
- Success Green: `#16A34A`
- Fonts: Hind Siliguri (Bangla), Poppins (English), Inter (Admin)

- [ ] **Task 0.4: Set up project structure per SRS §13.1**

```
src/
├── components/       # Shared UI
├── pages/            # Public pages
├── admin/            # Admin panel pages
├── lib/              # supabase.ts, i18n.ts
├── hooks/
├── types/
└── locales/          # bn.json, en.json
```

- [ ] **Task 0.5: Create GitHub repo + Vercel project**

```bash
git init
git add .
git commit -m "feat: initial project setup"
gh repo create shahjalal-driving-center --public --push
```

> **Invoke:** `best-practices` to verify no secrets committed, `.env` in `.gitignore`

- [ ] **Task 0.6: Set up env variables (see SRS Appendix D)**

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_GOOGLE_MAPS_KEY=
VITE_GA4_ID=
```

---

## Phase 1: Database & Auth (Week 1-2)

> **Invoke:** `supabase-postgres-best-practices` for all DB tasks below

### Task 1.1: Create Supabase project

- [ ] Create project at https://supabase.com
- [ ] Copy project URL and anon key to `.env`

### Task 1.2: Execute database schema (SRS §11)

- [ ] Run SQL for all 9 tables:
  - `site_settings` (key-value)
  - `branches` (with JSONB phones/emails)
  - `courses` (with category enum)
  - `leads` (with status workflow)
  - `testimonials` (with rating check)
  - `gallery_photos`
  - `gallery_videos`
  - `instructors`
  - `page_seo`
  - `page_views`

> **Invoke:** `supabase-postgres-best-practices` for schema design, `test-driven-development` to test schema

### Task 1.3: Apply Row-Level Security policies (SRS §11.1)

- [ ] Enable RLS on all tables
- [ ] Create public read policies for courses, branches, testimonials, gallery, settings, SEO, instructors
- [ ] Create public insert policy for leads
- [ ] Create admin full-access policies

> `supabase-postgres-best-practices` → RLS optimization rules (`security-` prefix)

### Task 1.4: Create storage buckets (SRS §11.2)

- [ ] Create buckets: `hero-images`, `gallery`, `instructor-photos`, `branch-photos`, `testimonial-photos`, `certificates`
- [ ] Set all buckets to public
- [ ] Add RLS policies for bucket access

### Task 1.5: Set up Supabase Auth

- [ ] Enable email + password auth
- [ ] Create admin user
- [ ] Configure session settings

### Task 1.6: Initialize Supabase client (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## Phase 2: Admin Panel (Week 2-4)

> **Invoke:** `subagent-driven-development` for managing task execution across all admin pages

### Task 2.1: Admin Layout & Auth

- [ ] **Create AdminRoute component** (protected route wrapper, SRS Appendix C)
- [ ] **Admin login page** at `/admin/login` — email + password form
- [ ] **Admin layout** — left sidebar (collapsible on mobile), top bar with logout + "View Site"
- [ ] **Sidebar** — dark `#1E293B`, white content area, brand red accent for active

> `react-best-practices` → component composition, re-render optimization
> `test-driven-development` → auth flow tests

### Task 2.2: Analytics Dashboard (`/admin`)

- [ ] Summary cards: total leads today/week/month
- [ ] Line chart: leads over last 30 days (Recharts)
- [ ] Donut chart: leads by course interest
- [ ] Bar chart: leads by branch preference
- [ ] Recent 10 submissions table with quick-view
- [ ] Quick actions: Add Course, Add Photo, View Leads

> `react-best-practices` → bundle size, dynamic imports for charts

### Task 2.3: Site Settings Manager (`/admin/settings`)

- [ ] Editable fields per SRS §10.4: site name (Bn/En), admin email, WhatsApp, social URLs, hero content, stats, BRTA reg, footer text
- [ ] Hero image upload → Supabase Storage `hero-images` bucket

### Task 2.4: Branch Manager (`/admin/branches`)

- [ ] List both branches with active/inactive status
- [ ] Per-branch form: name (Bn/En), address (Bn/En), phones (add/remove via JSONB), emails (add/remove), WhatsApp, Google Maps embed URL, photo upload, SEO fields
- [ ] Toggle active/inactive

> `supabase-postgres-best-practices` → JSONB query patterns

### Task 2.5: Courses Manager (`/admin/courses`)

- [ ] List all courses with status
- [ ] Add/edit form: name (Bn/En), category (car/motorcycle/professional/refresher/license), duration (Bn/En), fee, description (Bn/En), icon, status
- [ ] Soft delete, drag-and-drop reorder

### Task 2.6: Leads Manager (`/admin/leads`)

- [ ] Paginated table: date, name, phone, email, branch pref, course, message, status
- [ ] Status workflow: New → Contacted → Enrolled → Closed
- [ ] Filters: status, date range, branch, course
- [ ] Export to CSV, delete, admin notes per lead

### Task 2.7: Gallery Manager (`/admin/gallery`)

- [ ] Photo upload (drag-drop) to Supabase Storage `gallery` bucket
- [ ] Delete photos
- [ ] Add/edit/remove YouTube video URLs with titles
- [ ] Reorder gallery items

### Task 2.8: Testimonials Manager (`/admin/testimonials`)

- [ ] Add: name, rating (1-5), text (Bn/En), photo upload
- [ ] Edit/delete, toggle visible/hidden

### Task 2.9: About Manager (`/admin/about`)

- [ ] Rich text editor for about text (Bn/En)
- [ ] Add/edit/delete instructors: name (Bn/En), photo, experience, specialization

### Task 2.10: SEO Manager (`/admin/seo`)

- [ ] Per-page SEO: meta title, meta description, OG image for each page key
- [ ] JSON-LD schema preview per branch

> `seo` → structured data patterns

---

## Phase 3: Public Site (Week 3-5)

> **Invoke:** `subagent-driven-development` for page implementation

### Task 3.1: i18n Setup

- [ ] Configure react-i18next with Bn/En locales
- [ ] Create `src/locales/bn.json` and `en.json` with all UI strings
- [ ] Language toggle component

### Task 3.2: Shared Components

- [ ] **Navbar**: sticky, logo, links, "Enroll Now" CTA, mobile hamburger, language toggle, active page highlight
- [ ] **Footer**: logo, quick links, both branch contact info, social icons, copyright (auto year)
- [ ] **Floating Action Button** (mobile only, SRS Appendix B): circular `#CC1616` button, expands to WhatsApp (`#25D366`) + Phone (`#CC1616`) on tap
- [ ] **Inquiry Form component**: Name, Phone, Email, Branch, Course, Message, validation via Zod, spam protection (honeypot)
- [ ] **Page SEO wrapper**: reads meta from `page_seo` table per route

> `frontend-design` → navbar design, FAB animation, overall UI polish
> `accessibility` → keyboard nav, focus indicators, skip links, ARIA labels
> `react-best-practices` → component memoization, lazy loading

### Task 3.3: Home Page (`/`)

- [ ] Hero section: center name (Bn/En), tagline, 2 CTAs, BRTA badge
- [ ] Trust bar: BRTA cert, student count, years active, success rate
- [ ] Courses teaser: top 3 cards + "See All" link
- [ ] Branches preview: both branch cards with map links
- [ ] Why Us: 4 icon blocks
- [ ] Testimonials: carousel (auto on mobile)
- [ ] YouTube: 2 video embeds
- [ ] CTA banner: phone + enroll

> `frontend-design` → hero visual hierarchy, testimonial carousel
> `core-web-vitals` → LCP optimization for hero image

### Task 3.4: Courses Page (`/courses`)

- [ ] 2-col mobile / 3-col desktop grid
- [ ] Filter: All / Car / Motorcycle / Professional / License
- [ ] Cards: icon, name (Bn/En), duration, price, description, CTA
- [ ] Course detail modal

### Task 3.5: Branches Page (`/branches`)

- [ ] Both branches side-by-side (stacked on mobile)
- [ ] Each branch: name, address (Bn/En), phones (clickable `tel:`), emails, map iframe, photo, WhatsApp CTA
- [ ] Link to individual branch detail

### Task 3.6: Branch Detail Page (`/branches/:slug`)

- [ ] Full branch info with unique SEO meta tags
- [ ] Branch-specific JSON-LD `DrivingSchool` schema
- [ ] Inquiry form pre-selecting that branch

> `seo` → `DrivingSchool` JSON-LD structured data, unique meta per branch

### Task 3.7: About Page (`/about`)

- [ ] Center story + mission (from DB)
- [ ] BRTA certification image
- [ ] Instructor grid: photo, name, experience
- [ ] Stats bar + timeline

### Task 3.8: Gallery Page (`/gallery`)

- [ ] Masonry photo grid with lightbox
- [ ] YouTube video embeds
- [ ] Supabase Storage image URLs

### Task 3.9: Contact Page (`/contact`)

- [ ] Both branches: address, phones, emails, Google Maps
- [ ] Inquiry form
- [ ] Social links

### Task 3.10: Enroll Page (`/enroll`)

- [ ] Full enrollment form
- [ ] Branch dropdown (from `branches` table)
- [ ] Course dropdown (from `courses` table)
- [ ] Zod validation: required fields, BD phone format (`01XXXXXXXXX`)

---

## Phase 4: Supabase Edge Function (Week 5-6)

> `test-driven-development` → test edge function locally

### Task 4.1: Lead Notification Edge Function

- [ ] Create `supabase/functions/notify-lead/index.ts`
- [ ] Trigger: Supabase DB webhook on `leads` INSERT
- [ ] Fetch `admin_email` from `site_settings`
- [ ] Send email via Resend API with lead details

---

## Phase 5: SEO & Performance (Week 6)

### Task 5.1: SEO Implementation

> **Invoke:** `seo` for all SEO tasks

- [ ] Unique `<title>` + `<meta description>` per page from `page_seo` table
- [ ] robots.txt: allow public, disallow `/admin`
- [ ] sitemap.xml from all routes
- [ ] Canonical tags
- [ ] Open Graph + Twitter Card meta tags
- [ ] Dual `DrivingSchool` JSON-LD schema on branch pages

### Task 5.2: Performance Optimization

> **Invoke:** `performance`, `core-web-vitals`, `web-perf`, `react-best-practices`

- [ ] WebP/AVIF images with responsive srcset
- [ ] Lazy loading for below-fold images
- [ ] React code splitting per route (`React.lazy`)
- [ ] Critical CSS inline
- [ ] Font optimization: `font-display: swap`, preload
- [ ] Bundle analysis and tree-shaking
- [ ] LCP optimization: preload hero image with `fetchpriority="high"`

---

## Phase 6: Testing (Week 6-7)

> **Invoke:** `test-driven-development` for test creation, `web-quality-audit` for QA

### Task 6.1: Component Tests

- [ ] Navbar: renders links, toggles mobile menu, language switch works
- [ ] FAB: expands/collapses on tap, calls correct phone/WhatsApp URLs
- [ ] Inquiry form: validates required fields, BD phone format, shows errors

### Task 6.2: Admin Panel Tests

- [ ] Auth: login with valid/invalid credentials, protected routes redirect
- [ ] CRUD operations for branches, courses, testimonials, gallery
- [ ] Leads: status workflow, filtering, CSV export

### Task 6.3: Integration Tests

- [ ] Supabase queries: fetch courses, branches, testimonials
- [ ] Form submission: insert lead, verify redirect
- [ ] RLS: public can read, admin can write

### Task 6.4: Cross-Browser & Mobile Testing

- [ ] Chrome, Firefox, Safari, Edge (latest 2)
- [ ] Android Chrome, iOS Safari
- [ ] Mobile-first responsive: 320px → 1920px

> `accessibility` → WCAG 2.1 AA audit
> `web-quality-audit` → full Lighthouse audit

---

## Phase 7: Security & Best Practices (Week 7)

> **Invoke:** `best-practices` for all security tasks

### Task 7.1: Security Hardening

- [ ] Verify RLS policies block unauthorized writes
- [ ] CSP headers on Vercel
- [ ] HSTS enabled
- [ ] Input sanitization on all form fields
- [ ] No secrets in client bundle
- [ ] Rate limiting on lead form submissions

### Task 7.2: Production Readiness

- [ ] Error boundaries on all routes
- [ ] Loading states for all async operations
- [ ] 404 page
- [ ] `.env` template documented

---

## Phase 8: Launch (Week 7-8)

### Task 8.1: Domain & Deploy

- [ ] Register domain: `shahjalaldrivingcenter.com`
- [ ] Deploy to Vercel via GitHub
- [ ] Configure custom domain + SSL
- [ ] Set env variables in Vercel dashboard

### Task 8.2: Post-Launch SEO

- [ ] Submit sitemap to Google Search Console
- [ ] Create 2x Google Business Profile listings (one per branch)
- [ ] Verify NAP consistency across site + GBP + Facebook

### Task 8.3: Monitoring

- [ ] Configure GA4
- [ ] Monitor Core Web Vitals in Search Console
- [ ] Set up uptime monitoring

> `web-perf` → verify Core Web Vitals post-deploy
> `investigate` → debug any launch issues

---

## Skill Summary by Phase

| Phase | Skills to Invoke |
|-------|-----------------|
| 0 — Setup | `subagent-driven-development`, `frontend-design`, `best-practices` |
| 1 — DB & Auth | `supabase-postgres-best-practices`, `test-driven-development` |
| 2 — Admin Panel | `subagent-driven-development`, `react-best-practices`, `supabase-postgres-best-practices`, `seo`, `test-driven-development` |
| 3 — Public Site | `subagent-driven-development`, `frontend-design`, `accessibility`, `react-best-practices`, `core-web-vitals`, `seo` |
| 4 — Edge Function | `test-driven-development` |
| 5 — SEO & Perf | `seo`, `performance`, `core-web-vitals`, `web-perf`, `react-best-practices` |
| 6 — Testing | `test-driven-development`, `web-quality-audit`, `accessibility`, `investigate` |
| 7 — Security | `best-practices` |
| 8 — Launch | `web-perf`, `investigate` |
