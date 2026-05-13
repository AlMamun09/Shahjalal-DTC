---
name: seo
description: Optimize for search engine visibility and ranking. Use when asked to "improve SEO", "optimize for search", "fix meta tags", "add structured data", "sitemap optimization", or "search engine optimization".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# SEO optimization

Search engine optimization based on Lighthouse SEO audits and Google Search guidelines.

## Technical SEO

- robots.txt: allow public, disallow /admin/
- XML sitemap with all important pages, submitted to Search Console
- Canonical URLs to prevent duplicate content
- HTTPS everywhere
- URLs: hyphens, lowercase, < 75 chars, include keywords

## On-Page SEO

- Title tags: 50-60 chars, primary keyword near beginning, unique per page
- Meta descriptions: 150-160 chars, compelling and unique
- Single `<h1>` per page, logical heading hierarchy
- Descriptive anchor text (not "click here")
- Image alt text with keywords

## Structured Data (JSON-LD)

Key schema types: Organization, Article, Product, FAQPage, BreadcrumbList, LocalBusiness

Validate at: https://search.google.com/test/rich-results

## International SEO (for i18n)

- Hreflang tags for multi-language sites
- Language declaration via `lang` attribute

## SEO audit checklist

- [ ] HTTPS enabled
- [ ] robots.txt allows crawling
- [ ] Title tags present and unique
- [ ] Meta descriptions present
- [ ] Sitemap submitted
- [ ] Canonical URLs set
- [ ] Mobile-responsive
- [ ] Core Web Vitals passing
- [ ] Structured data implemented
