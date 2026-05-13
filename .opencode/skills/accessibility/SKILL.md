---
name: accessibility
description: Audit and improve web accessibility following WCAG 2.2 guidelines. Use when asked to "improve accessibility", "a11y audit", "WCAG compliance", "screen reader support", "keyboard navigation", or "make accessible".
license: MIT
metadata:
  author: web-quality-skills
  version: "1.1"
---

# Accessibility (a11y)

Comprehensive accessibility guidelines based on WCAG 2.2 and Lighthouse accessibility audits.

## WCAG Principles: POUR

| Principle | Description |
|-----------|-------------|
| Perceivable | Content can be perceived through different senses |
| Operable | Interface can be operated by all users |
| Understandable | Content and interface are understandable |
| Robust | Content works with assistive technologies |

## Perceivable

- Images require alt text; decorative images use `alt=""`
- Icon buttons need accessible names via `aria-label`
- Color contrast: 4.5:1 for normal text, 3:1 for large text (WCAG AA)
- Don't rely on color alone - use icons/text alongside color

## Operable

- All functionality must be keyboard accessible
- Use `:focus-visible` for keyboard-only focus indicators
- Skip links for keyboard users to bypass navigation
- Target size minimum 24x24px (WCAG 2.2), recommended 44x44px

## Understandable

- Set `lang` attribute on `<html>`
- Consistent navigation across pages
- Every input needs a programmatically associated label
- Error identification: describe and associate errors with fields

## Robust

- Prefer native HTML elements over ARIA roles
- Use `aria-live` regions for dynamic content changes
- Valid HTML: no duplicate IDs, properly nested elements

## Testing checklist

- [ ] Keyboard navigation: Tab through entire page
- [ ] Screen reader: VoiceOver (Mac), NVDA (Windows)
- [ ] Zoom: content usable at 200%
- [ ] Reduced motion: `prefers-reduced-motion: reduce`
- [ ] Target size: interactive elements meet 24x24px minimum
