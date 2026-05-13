# Website Restructure Plan — Inspired by BDDTI

## BDDTI Structure Analysis

bddti.com is a Next.js driving school site with these pages:
- **Home** — hero, services (6 icon cards), stats counter, gallery preview, facilities (6 cards), course pricing cards
- **About** — company info + services + facilities
- **Courses** (on homepage) — pricing cards with class breakdown (practical, auto, theory, total)
- **License** — (planned, 404)
- **Blog** (`/blog`) — article listing with thumbnails, author, date
- **Gallery** (`/gallery`) — photo album grid
- **Branches** (`/branches`) — city-filtered branch cards → individual branch pages with full template
- **Contact** (`/contact-us`) — form + info cards + map + branch quick-links
- **Certificate Check** (`/certificate-check`) — verify certificate by DOB + cert number
- **Cart** — add-to-cart flow for course enrollment (planned, 404)

## Key Design Patterns to Adopt

| Pattern | BDDTI Approach | Our Current State |
|---------|---------------|-------------------|
| Course cards | Price, class breakdown (practical/auto/theory/total), Add to Cart + View Details | Simple cards with duration/fee/description |
| Branch pages | Full landing page: hero, carousel, programs, FAQ, testimonials, map | Basic detail page with info + form |
| Blog | Article listing with images, categories, sidebar | Missing |
| Gallery | Album grid | Simple photo list |
| Cart | Add to cart flow | Missing |
| Contact | 2-col: form + info cards + map | 2-col: form + branch info |
| Navigation | Home, About, Courses, License, Blog, Gallery, Branches, Contact, Sign In, Apply Online | Home, Courses, Branches, Gallery, About, Contact, Enroll |
| Services section | 6 icon cards | Missing |
| Facilities section | 6 facility cards | Missing |
| Stats counter | Animated stats (students, instructors, branches) | Simple trust bar |
| Certificate check | Verification form | Missing |
| License page | Dedicated license info page | Missing |

## Implementation Plan

### Phase 1: Navigation & Layout Restructure
- [ ] Update navbar: Home, About Us, Courses, License, Blog, Gallery, Branches, Contact Us
- [ ] Add Sign In + Apply Online buttons (right side)
- [ ] Add cart icon with counter
- [ ] Update footer with 4-column layout (brand, courses, resources, contact)

### Phase 2: New Pages
- [ ] Blog page (`/blog`) — article listing with cards
- [ ] License page (`/license`) — license types, fees, requirements, application process
- [ ] Certificate Check (`/certificate-check`) — verification form + results display
- [ ] Cart page (`/cart`) — selected courses, checkout flow

### Phase 3: Redesigned Sections
- [ ] **Home hero** — full-width banner with overlay, CTA buttons
- [ ] **Services section** — 6 icon cards (Auto Car, Manual Car, Bike, Scooter, Defensive, Bicycle)
- [ ] **Stats counter** — animated counters (students, instructors, branches, success rate)
- [ ] **Gallery preview** — thumbnail grid linking to full gallery
- [ ] **Facilities section** — 6 facility cards (Hostel, AC Classroom, Job Placement, Certificate, License Assistance, Reasonable Price)

### Phase 4: Redesigned Course Cards
- [ ] Show price prominently (BDT)
- [ ] Class breakdown: Practical classes, Auto classes, Theory classes, Total
- [ ] Two buttons: Add to Cart + View Details
- [ ] Category groupings: Private Car, Bike & Scooter, Bicycle

### Phase 5: Branch Pages Upgrade
- [ ] Branch landing page template: hero with stats, feature carousel, programs (2 cards), FAQ accordion, testimonials, Google Maps, "Our Other Branches" links

### Phase 6: Database Schema Updates
- [ ] Add `blog_posts` table
- [ ] Add `facilities` table
- [ ] Add `services` table 
- [ ] Add `certificates` table
- [ ] Add `cart` / `enrollments` table
- [ ] Update `courses` table: add practical/auto/theory class counts, price_bdt

### Phase 7: Cart & Enrollment Flow
- [ ] Add to cart functionality
- [ ] Cart page with course list, quantities, total
- [ ] Checkout/enrollment submission
