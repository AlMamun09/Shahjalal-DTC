---
name: ui-ux-pro-max
description: UI/UX design intelligence with searchable database — 67 UI styles, 161 color palettes, 57 font pairings, 99 UX guidelines, 25 chart types across 16 tech stacks
---

# ui-ux-pro-max

Comprehensive design guide for web and mobile applications. Contains 67 styles, 161 color palettes, 57 font pairings, 99 UX guidelines, and 25 chart types across 16 technology stacks. Searchable database with priority-based recommendations.

## Prerequisites

Check if Python is installed:

```bash
python3 --version || python --version
```

If Python is not installed, install it:

- **macOS:** `brew install python3`
- **Ubuntu/Debian:** `sudo apt update && sudo apt install python3`
- **Windows:** `winget install Python.Python.3.12`

---

## How to Use This Skill

Use this skill when the user requests UI/UX design work — building pages, choosing styles/colors/fonts, reviewing existing UIs, or implementing design systems.

### Step 1: Analyze User Requirements

Extract key information:
- **Product type**: SaaS, e-commerce, portfolio, healthcare, fintech, entertainment, etc.
- **Target audience**: B2B, B2C, age group, usage context
- **Style keywords**: minimal, vibrant, glassmorphism, dark mode, playful, professional
- **Stack**: React, Next.js, Astro, Vue, Svelte, SwiftUI, Flutter, React Native, HTML+Tailwind, etc.

### Step 2: Generate Design System (REQUIRED)

Always start with `--design-system` to get comprehensive recommendations:

```bash
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<product_type> <industry> <keywords>" --design-system [-p "Project Name"]
```

This returns: pattern, style, colors, typography, effects, and anti-patterns.

**Example:**
```bash
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "beauty spa wellness service" --design-system -p "Serenity Spa"
```

### Step 2b: Persist Design System (Master + Overrides)

Add `--persist` to save for hierarchical retrieval across sessions:

```bash
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "Project Name"
```

Creates `design-system/MASTER.md` and `design-system/pages/` for page-specific overrides.

### Step 3: Supplement with Detailed Searches

```bash
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<keyword>" --domain <domain> [-n <max_results>]
```

| Domain | Use For |
|--------|---------|
| `product` | Product type recommendations |
| `style` | UI styles (glassmorphism, minimalism...) |
| `color` | Color palettes by product type |
| `typography` | Font pairings with Google Fonts |
| `landing` | Page structure, CTA strategies |
| `chart` | Chart types, library recommendations |
| `ux` | Best practices, anti-patterns |
| `react` | React/Next.js performance patterns |
| `web` | App interface guidelines |
| `prompt` | AI prompts, CSS keywords |

### Step 4: Stack Guidelines

```bash
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "<keyword>" --stack <stack>
```

Available stacks: `html-tailwind`, `react`, `nextjs`, `astro`, `vue`, `nuxtjs`, `nuxt-ui`, `svelte`, `swiftui`, `react-native`, `flutter`, `shadcn`, `jetpack-compose`, `angular`, `laravel`

---

## Output Formats

```bash
# ASCII box (default)
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system

# Markdown
python3 .opencode/skills/ui-ux-pro-max/src/ui-ux-pro-max/scripts/search.py "fintech crypto" --design-system -f markdown
```

---

## Pre-Delivery Checklist

- [ ] No emojis as icons (use SVG: Heroicons, Phosphor, Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Text contrast 4.5:1 minimum in both light/dark mode
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Touch targets >=44pt (mobile)
- [ ] Safe areas respected (notch, status bar, home indicator)
