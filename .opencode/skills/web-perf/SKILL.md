---
name: web-perf
description: Analyzes web performance using Chrome DevTools MCP. Measures Core Web Vitals (LCP, INP, CLS) and supplementary metrics (FCP, TBT, Speed Index), identifies render-blocking resources, network dependency chains, layout shifts, caching issues, and accessibility gaps. Use when asked to audit, profile, debug, or optimize page load performance, Lighthouse scores, or site speed.
---

# Web Performance Audit

## Retrieval Sources

| Source | How to retrieve | Use for |
|--------|----------------|---------|
| web.dev | `https://web.dev/articles/vitals` | Core Web Vitals thresholds, definitions |
| Chrome DevTools docs | `https://developer.chrome.com/docs/devtools/performance` | Tooling APIs, trace analysis |
| Lighthouse scoring | `https://developer.chrome.com/docs/lighthouse/performance/performance-scoring` | Score weights, metric thresholds |

## Key Guidelines

- Verify claims by checking network requests, DOM, or codebase
- Quantify impact using estimated savings
- Be specific: say "compress hero.png (450KB) to WebP" not "optimize images"
- Prioritize ruthlessly

## Workflow

1. Navigate to the target URL
2. Start a performance trace with reload
3. Analyze Core Web Vitals (LCP, CLS, TBT)
4. Network analysis for render-blocking resources
5. Accessibility snapshot
6. Codebase analysis (if applicable)

## Key thresholds (good/needs-improvement/poor)

- TTFB: < 800ms / < 1.8s / > 1.8s
- FCP: < 1.8s / < 3s / > 3s
- LCP: < 2.5s / < 4s / > 4s
- INP: < 200ms / < 500ms / > 500ms
- TBT: < 200ms / < 600ms / > 600ms
- CLS: < 0.1 / < 0.25 / > 0.25
