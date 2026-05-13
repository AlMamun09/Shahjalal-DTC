---
name: performance
description: Optimize web performance for faster loading and better user experience. Use when asked to "speed up my site", "optimize performance", "reduce load time", "fix slow loading", "improve page speed", or "performance audit".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Performance optimization

Deep performance optimization based on Lighthouse performance audits.

## Performance budget

| Resource | Budget |
|----------|--------|
| Total page weight | < 1.5 MB |
| JS (compressed) | < 300 KB |
| CSS (compressed) | < 100 KB |
| Images (above-fold) | < 500 KB |
| Fonts | < 100 KB |
| Third-party | < 200 KB |

## Critical rendering path

- TTFB < 800ms, enable Brotli compression, HTTP/2 or HTTP/3
- Preconnect to required origins, preload critical resources
- Defer non-essential scripts (`defer`/`async`)
- Inline critical CSS (< 14KB), defer rest

## Image optimization

- AVIF/WebP with responsive srcset
- LCP image: `fetchpriority="high"`, eager loading
- Below-fold: lazy loading with `loading="lazy"`

## Font optimization

- `font-display: swap` or `optional`
- Preload critical fonts
- Variable fonts reduce file count

## Caching

- Immutable caching for hashed assets (`max-age=31536000, immutable`)
- `stale-while-revalidate` for non-hashed assets

## Runtime performance

- Avoid layout thrashing (batch reads/writes)
- Virtualize long lists (`content-visibility: auto`)
- Use `requestAnimationFrame` for animations
- Debounce scroll/resize handlers
- View Transitions API for smooth navigations
