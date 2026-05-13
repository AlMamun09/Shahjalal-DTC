---
name: core-web-vitals
description: Optimize Core Web Vitals (LCP, INP, CLS) for better page experience and search ranking. Use when asked to "improve Core Web Vitals", "fix LCP", "reduce CLS", "optimize INP", "page experience optimization", or "fix layout shifts".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Core Web Vitals

| Metric | Measures | Good | Needs work | Poor |
|--------|----------|------|------------|------|
| LCP | Loading | ≤ 2.5s | 2.5s-4s | > 4s |
| INP | Interactivity | ≤ 200ms | 200ms-500ms | > 500ms |
| CLS | Visual Stability | ≤ 0.1 | 0.1-0.25 | > 0.25 |

Google measures at the 75th percentile.

## LCP optimization

- TTFB < 800ms (CDN, edge caching)
- LCP image preloaded with `fetchpriority="high"`
- Critical CSS inlined (< 14KB)
- No render-blocking JS in `<head>`
- Fonts: `font-display: swap`

## INP optimization

- No tasks > 50ms on main thread
- Event handlers complete < 100ms
- Visual feedback provided immediately
- Heavy work deferred with `requestIdleCallback`
- Web Workers for CPU-intensive operations

## CLS optimization

- All images have width/height or `aspect-ratio`
- Ads/embeds have reserved space via min-height
- Fonts use `font-display: optional` or matched metrics
- Dynamic content inserted below viewport
- Animations use transform/opacity only
