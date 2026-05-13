---
name: web-quality-audit
description: Comprehensive web quality audit covering performance, accessibility, SEO, and best practices. Use when asked to "audit my site", "review web quality", "run lighthouse audit", "check page quality", or "optimize my website".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Web quality audit

Comprehensive quality review based on Google Lighthouse audits. Covers Performance, Accessibility, SEO, and Best Practices across 150+ checks.

## Audit categories

### Performance (40% of typical issues)
- Core Web Vitals: LCP < 2.5s, INP < 200ms, CLS < 0.1
- Resource Optimization: WebP/AVIF, code splitting, critical CSS
- Loading Strategy: preconnect, preload, lazy load, caching

### Accessibility (30% of typical issues)
- Perceivable: alt text, color contrast 4.5:1, captions
- Operable: keyboard accessible, focus visible, skip links
- Understandable: page lang, consistent nav, form labels
- Robust: valid HTML, correct ARIA usage

### SEO (15% of typical issues)
- Crawlability: robots.txt, sitemap, canonical URLs
- On-Page SEO: unique title tags, meta descriptions, heading hierarchy
- Technical SEO: mobile-friendly, HTTPS, structured data

### Best practices (15% of typical issues)
- Security: HTTPS, no vulnerable libs, CSP headers
- Modern Standards: no deprecated APIs, valid doctype
- UX Patterns: no intrusive interstitials, clear permission requests

## Severity levels

| Level | Action |
|-------|--------|
| Critical | Fix immediately |
| High | Fix before launch |
| Medium | Fix within sprint |
| Low | Fix when convenient |
