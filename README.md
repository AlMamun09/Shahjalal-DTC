# Shahjalal Driving Training Center

A full-stack web application for a BRTA-approved driving school in Bangladesh. Built with React, TypeScript, Vite, Tailwind CSS v4, and Supabase.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| **Backend** | Supabase (PostgreSQL, Auth, Storage) |
| **Routing** | React Router v6 |
| **Forms** | React Hook Form + Zod |
| **i18n** | i18next (Bengali + English) |
| **Charts** | Recharts |
| **UI** | shadcn/ui components (Card, Badge), custom components |
| **Fonts** | Hind Siliguri, Poppins, Inter, Noto Sans Bengali |

## Project Structure

```
src/
├── admin/              # Admin panel pages (CRUD for all entities)
│   ├── BlogManager.tsx
│   ├── BranchManager.tsx
│   ├── CourseManager.tsx
│   ├── Dashboard.tsx
│   ├── GalleryManager.tsx
│   ├── LeadsManager.tsx
│   ├── Login.tsx
│   ├── SeoManager.tsx
│   ├── Settings.tsx
│   └── TestimonialsManager.tsx
├── components/         # Shared components
│   ├── ui/             # shadcn-style UI primitives
│   │   ├── badge.tsx
│   │   ├── blog-post-card.tsx
│   │   └── card.tsx
│   ├── AdminLayout.tsx
│   ├── FAB.tsx
│   ├── FloatingLangToggle.tsx
│   ├── Footer.tsx
│   ├── ImageUpload.tsx
│   ├── InquiryForm.tsx
│   ├── Navbar.tsx
│   ├── PublicLayout.tsx
│   └── ScrollToTop.tsx
├── hooks/
│   ├── useAuth.ts       # Supabase auth hook
│   ├── useReveal.ts     # Scroll reveal animation
│   └── useTheme.tsx     # Dark mode context
├── lib/
│   ├── i18n.ts          # i18next configuration
│   ├── supabase.ts      # Supabase client
│   └── utils.ts         # cn() utility (clsx + tailwind-merge)
├── locales/
│   ├── bn.json          # Bengali translations
│   └── en.json          # English translations
├── pages/               # Public pages
│   ├── About.tsx
│   ├── Blog.tsx
│   ├── BlogDetail.tsx
│   ├── BranchDetail.tsx
│   ├── Branches.tsx
│   ├── CertificateCheck.tsx
│   ├── Contact.tsx
│   ├── CourseDetail.tsx
│   ├── Courses.tsx
│   ├── Enroll.tsx
│   ├── Gallery.tsx
│   ├── Home.tsx
│   └── License.tsx
└── types/
    └── index.ts         # TypeScript interfaces matching DB schema

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- A Supabase project (free tier works)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd shahjalal-driving-center

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

### Build

```bash
npm run build
npm run preview
```

## Database Schema (Supabase)

The project uses 15 tables. The full schema is available in `SRS_Shahjalal_Driving_Center.md`. Key tables:

| Table | Purpose |
|-------|---------|
| `courses` | Driving courses with pricing, class breakdowns |
| `branches` | Branch locations with phones, emails, maps |
| `blog_posts` | Blog articles (bilingual) |
| `leads` | Student inquiries with status tracking |
| `testimonials` | Student reviews with ratings |
| `instructors` | Instructor profiles with photos |
| `gallery_photos` | Training gallery images |
| `site_settings` | Key-value configuration store |
| `page_seo` | Per-page SEO metadata |

### Storage Buckets

- `gallery` — Course images, instructor photos, blog covers, gallery photos, site logo

### Auth

Supabase Auth with email/password for admin login. Admin credentials are managed through the Supabase dashboard.

## Admin Panel

Access at `/admin/login`. Features:

- **Dashboard** — Lead statistics with charts (30-day trends, by course, by branch)
- **Courses** — CRUD with image upload, reorder, activate/deactivate
- **Branches** — Branch management with phone/email arrays
- **Leads** — Lead tracking with status workflow (new → contacted → enrolled → closed)
- **Blog** — Bilingual blog posts with publish/unpublish
- **Gallery** — Photo upload + YouTube video embedding
- **Testimonials** — Student reviews with visibility toggle
- **Instructors** — Instructor profiles with photo upload
- **SEO** — Per-page meta titles and descriptions
- **Settings** — Site-wide configuration (names, social links, hero content)

## Features

- **Bilingual** — Full Bengali/English support with language toggle (floating button bottom-right)
- **Dark mode only** — Premium dark theme with orange accents
- **Responsive** — Mobile-first with carousels on the home page (courses, facilities, gallery)
- **SEO** — JSON-LD structured data, per-page meta tags
- **Performance** — Lazy loading images, scroll-triggered animations
- **Accessibility** — Focus states, skip link, reduced-motion support

## Styling

The project uses Tailwind CSS v4 with CSS variables for theming. Custom utilities:

- `.card-hover` — Lift effect with orange glow on hover
- `.gradient-text` — Orange-to-yellow text gradient
- `.section-divider` — Orange gradient divider line
- `.bg-gradient-energy` — Orange gradient background
- `.text-gradient` — Orange-to-yellow text gradient

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `@supabase/supabase-js` | Database, auth, storage |
| `react-router-dom` | Client-side routing |
| `react-hook-form` + `zod` | Form validation |
| `i18next` + `react-i18next` | Internationalization |
| `recharts` | Analytics charts (admin dashboard) |
| `class-variance-authority` | Component variants (shadcn pattern) |
| `clsx` + `tailwind-merge` | Class name utility |
