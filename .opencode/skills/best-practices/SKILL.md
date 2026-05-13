---
name: best-practices
description: Apply modern web development best practices for security, compatibility, and code quality. Use when asked to "apply best practices", "security audit", "modernize code", "code quality review", or "check for vulnerabilities".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.0"
---

# Best practices

Modern web development standards based on Lighthouse best practices audits.

## Security

- HTTPS everywhere, HSTS header
- Content Security Policy (CSP) headers
- No vulnerable libraries (`npm audit`)
- Trusted Types for DOM-XSS defense
- Subresource Integrity (SRI) for third-party scripts
- Secure cookies: Secure; HttpOnly; SameSite=Strict
- Input sanitization with DOMPurify

## Browser compatibility

- HTML5 doctype `<!DOCTYPE html>`
- Charset declared first in `<head>`
- Viewport meta tag
- Feature detection, not browser detection
- Prefer bundling polyfills at build time

## Deprecated APIs to avoid

- `document.write`
- Synchronous XHR
- Application Cache
- Non-passive touch/wheel listeners (use `{ passive: true }`)

## Code quality

- Valid HTML (no duplicate IDs)
- Semantic HTML5 elements
- Error boundaries in React
- Global error handlers
- Hidden source maps in production
