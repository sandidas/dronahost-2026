# DronaHost — UI/UX Rules

> Single source of truth for all visual, interaction, and content decisions.
> Logo-only specs (clear space, print sizes, file formats) live in `docs/rules/brand-identity.md`.
> **Motion:** `docs/reference/MOTION_AND_LUXURY_BRIEF.md` wins over §8 for anything about motion and finishing.
> **Examples are not facts.** Every number, price, SLA, location, phone number and email shown in a sample below is
> `[EXAMPLE, NOT VERIFIED]`. Real values come only from `content/claims.ts` (status `verified`) and
> `data/pricing.json`. Copy never contains a number, guarantee, SLA, location or certification that is not rendered
> from `claims.ts` with `status: "verified"`.
> **Audience:** educated small-business owners, freelancers and agencies worldwide who read English as a first or
> second language. They are smart but not necessarily technical. They compare providers carefully and distrust hype.

---

## Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing, Layout & Radius](#4-spacing-layout--radius)
5. [Iconography](#5-iconography)
6. [Imagery & Photography](#6-imagery--photography)
7. [Component Library](#7-component-library)
8. [Animation & Motion](#8-animation--motion)
9. [Voice & Tone](#9-voice--tone)
10. [SEO Implementation](#10-seo-implementation)
11. [E-E-A-T Implementation](#11-e-e-a-t-implementation)
12. [Search Intent Architecture](#12-search-intent-architecture)
13. [Project File Structure](#13-project-file-structure)
14. [DO's — Always](#14-dos--always)
15. [DON'Ts — Never](#15-donts--never)
16. [Quick Reference](#16-quick-reference)
17. [Responsive Design](#17-responsive-design)
18. [Dark / Light Mode](#18-dark--light-mode)
19. [Pre-Ship Checklist](#19-pre-ship-checklist)

---

## 1. Design Philosophy

**Direction:** Ultra-premium minimal luxury. Think Apple × Linear × Vercel — but warmer and more human. Clean layouts with deliberate breathing room. Every element earns its place.

**Both dark and light modes are first-class.** Dark is the default theme (decision #3): the server renders `.dark` on `<html>`, and on a first visit the visitor's system preference is respected (a system that prefers light gets light). A stored choice wins afterwards. Light must feel equally editorial and refined. The navy, orange and teal palette stays consistent across both modes; only surfaces, text, and shadow strengths shift.

**Visual pillars:**

- Whitespace as a luxury signal
- Typography doing the heavy lifting — not icons or illustrations
- Micro-interactions that delight, never distract
- Consistent depth system: page → section → card → element

**Never:** Neon gradients, generic stock photos, cartoon illustrations, cluttered feature lists, or the visual language of "cheap hosting."

---

## 2. Color System

### 2.1 Brand Color Palette

DronaHost uses navy, orange and teal, with distinct, non-interchangeable roles. **Indigo is removed (decision #1).**

Hex values live only in `app/styles/tokens.css`, enforced by `scripts/check-contrast.ts`. The orange is the value inside the official logo SVG, defined once in `tokens.css` (decision #2). Do not write brand hex values in rules, components or content.

| Name | Role |
|---|---|
| **Navy family** | Surfaces, headings, trust UI, primary text |
| **Brand Orange** | The single primary action (buttons, hero CTA) and "drona" in the logo |
| **Brand Teal** | Links, data, info states, secondary accents, and "host" in the logo |

The logo is the anchor: orange for "drona", teal for "host". Never substitute visually similar alternatives.

### 2.2 Supporting Neutrals

| Name | Hex | Usage |
|---|---|---|
| Near-Black | `#111827` | Body text, headings |
| Dark Grey | `#374151` | Secondary text |
| Mid Grey | `#6B7280` | Captions, meta, disabled |
| Light Grey | `#F3F4F6` | Surface backgrounds, cards |
| White | `#FFFFFF` | Page background, logo lockup |

### 2.3 Semantic Colors

| State | Hex | Notes |
|---|---|---|
| Success | `#16A34A` | Neutral green — distinct from teal |
| Warning | `#D97706` | Amber — close to orange, use sparingly |
| Error | `#DC2626` | Standard red — does not conflict with orange |
| Info | `#05A2C6` | Brand Teal — reuse directly |

### 2.4 Accessibility Constraints

| Combination | Contrast ratio | WCAG AA (4.5:1) |
|---|---|---|
| Brand Orange on White (and white on orange) | 3.22:1 | Fails at normal text. Passes only as large text (see definition below) or for icons and borders |
| Near-Black `#111827` on White | ~18:1 | Passes |
| White on Brand Teal `#05A2C6` | 3.00:1 | Fails at normal text. Meets the 3:1 large-text minimum with no margin; do not rely on it |
| White on Near-Black `#111827` | ~18:1 | Passes |

(Ratios are measured for the orange currently in `tokens.css`. Re-run `scripts/check-contrast.ts` whenever that token changes.)

**Large text (WCAG):** 24px regular, or 18.66px bold (14pt bold). "18px+" is not enough.

**Rule:** Never use Brand Orange or Brand Teal for body-size text on white. Use them for large display text, borders and decorative elements only. Orange buttons need a label that passes 4.5:1, so check the pair with the contrast script.

### 2.5 CSS Custom Properties

> **SUPERSEDED by `app/styles/tokens.css`.** That file is the single source for colour, radius, shadow, type and motion tokens, and `scripts/check-contrast.ts` enforces it in CI. Do not add or copy tokens from this section. It still contains indigo values, which were removed from the brand (decision #1).

> Note: the token block below predates `app/styles/tokens.css`, which is the single source of truth for colour, radius, shadow, type and motion.

All components reference only CSS variables. **Hardcoded hex values are forbidden.**
Theme is controlled via the `.dark` class on `<html>` (Tailwind v4). Toggle via `classList.toggle("dark", isDark)` — never use `data-theme` attributes.

```css
/* =============================================================
   LIGHT MODE — Default (:root, no class required)
   ============================================================= */
:root {
  /* Surfaces */
  --bg-primary: #fafbfc;
  --bg-secondary: #ffffff;
  --bg-elevated: #f2f4f8;
  --bg-subtle: #e8ecf2;
  --bg-overlay: rgba(0, 0, 0, 0.45);

  /* Brand Indigo — primary UI color */
  --accent-primary: #4f46e5;
  --accent-secondary: #6d64f0;
  --accent-glow: rgba(79, 70, 229, 0.1);
  --accent-soft: rgba(79, 70, 229, 0.06);
  --accent-border: rgba(79, 70, 229, 0.25);

  /* Brand Orange — CTA / action accent (logo "drona") */
  --orange: #e04800;
  --orange-muted: #c23d00;
  --orange-subtle: rgba(224, 72, 0, 0.07);
  --orange-glow: rgba(224, 72, 0, 0.12);

  /* Brand Teal — secondary / info (logo "host") */
  --teal: #0489a8;
  --teal-muted: #036e89;
  --teal-subtle: rgba(4, 137, 168, 0.07);

  /* Text */
  --text-primary: #0d0f14;
  --text-secondary: #4a5268;
  --text-muted: #9ba3b8;
  --text-disabled: #c5cad8;
  --text-on-accent: #ffffff;
  --text-on-orange: #ffffff;

  /* Borders */
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-default: rgba(0, 0, 0, 0.1);
  --border-strong: rgba(0, 0, 0, 0.16);
  --border-accent: rgba(79, 70, 229, 0.25);
  --border-orange: rgba(224, 72, 0, 0.3);

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.12);
  --shadow-glow: 0 0 24px rgba(79, 70, 229, 0.12);
  --shadow-glow-orange: 0 0 16px rgba(224, 72, 0, 0.12);

  /* Semantic */
  --success: #16a34a;
  --success-soft: rgba(22, 163, 74, 0.07);
  --warning: #d97706;
  --warning-soft: rgba(217, 119, 6, 0.07);
  --error: #dc2626;
  --error-soft: rgba(220, 38, 38, 0.07);
  --info: #0284c7;
  --info-soft: rgba(2, 132, 199, 0.07);

  /* Gradients */
  --gradient-page: linear-gradient(160deg, #fafbfc 0%, #eef1f8 60%, #f2f5fb 100%);
  --gradient-accent: linear-gradient(135deg, #4f46e5 0%, #6d64f0 100%);
  --gradient-orange: linear-gradient(135deg, #e04800 0%, #ff6a2a 100%);
  --gradient-card: linear-gradient(145deg, #ffffff 0%, #f4f6fb 100%);
  --gradient-hero-radial: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(79, 70, 229, 0.08) 0%, transparent 70%);
}

/* =============================================================
   DARK MODE — Applied when <html class="dark">
   ============================================================= */
.dark {
  /* Surfaces */
  --bg-primary: #08090a;
  --bg-secondary: #0f1012;
  --bg-elevated: #16181c;
  --bg-subtle: #1c1e24;
  --bg-overlay: rgba(0, 0, 0, 0.7);

  /* Brand Indigo — brighter for dark backgrounds */
  --accent-primary: #6d64f0;
  --accent-secondary: #8a83f5;
  --accent-glow: rgba(109, 100, 240, 0.15);
  --accent-soft: rgba(109, 100, 240, 0.08);
  --accent-border: rgba(109, 100, 240, 0.3);

  /* Brand Orange — slightly brighter for dark backgrounds */
  --orange: #fe5403;
  --orange-muted: #d94602;
  --orange-subtle: rgba(254, 84, 3, 0.08);
  --orange-glow: rgba(254, 84, 3, 0.15);

  /* Brand Teal — slightly brighter for dark backgrounds */
  --teal: #05a2c6;
  --teal-muted: #0489a8;
  --teal-subtle: rgba(5, 162, 198, 0.08);

  /* Text */
  --text-primary: #f0f2f7;
  --text-secondary: #9ba3b8;
  --text-muted: #555c72;
  --text-disabled: #333844;
  --text-on-accent: #ffffff;
  --text-on-orange: #ffffff;

  /* Borders */
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-default: rgba(255, 255, 255, 0.1);
  --border-strong: rgba(255, 255, 255, 0.16);
  --border-accent: rgba(109, 100, 240, 0.3);
  --border-orange: rgba(254, 84, 3, 0.3);

  /* Shadows */
  --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.35);
  --shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 4px 16px rgba(0, 0, 0, 0.5);
  --shadow-lg: 0 8px 40px rgba(0, 0, 0, 0.6);
  --shadow-xl: 0 16px 64px rgba(0, 0, 0, 0.7);
  --shadow-glow: 0 0 30px rgba(109, 100, 240, 0.18);
  --shadow-glow-orange: 0 0 20px rgba(254, 84, 3, 0.18);

  /* Semantic */
  --success: #22c55e;
  --success-soft: rgba(34, 197, 94, 0.08);
  --warning: #f59e0b;
  --warning-soft: rgba(245, 158, 11, 0.08);
  --error: #ef4444;
  --error-soft: rgba(239, 68, 68, 0.08);
  --info: #38bdf8;
  --info-soft: rgba(56, 189, 248, 0.08);

  /* Gradients */
  --gradient-page: linear-gradient(160deg, #08090a 0%, #0c0e14 60%, #0e1018 100%);
  --gradient-accent: linear-gradient(135deg, #6d64f0 0%, #8a83f5 100%);
  --gradient-orange: linear-gradient(135deg, #fe5403 0%, #ff7a3d 100%);
  --gradient-card: linear-gradient(145deg, #13151a 0%, #1a1d24 100%);
  --gradient-hero-radial: radial-gradient(ellipse 80% 60% at 50% -10%, rgba(109, 100, 240, 0.12) 0%, transparent 70%);
}
```

### 2.6 Tailwind Brand Tokens

> **SUPERSEDED by `app/styles/tokens.css`.** Tailwind v4 reads tokens from `@theme` in CSS, so a `tailwind.config.ts` token map is out of date and contradicts `coding-rules.md` §11. Use the token utilities defined from `tokens.css` (`bg-card`, `text-muted-foreground`, `bg-action`) and never raw palette classes.

```ts
// tailwind.config.ts
colors: {
  brand: {
    indigo: '#4F46E5',  // primary UI — buttons, rings, nav active states
    orange: '#FE5403',  // CTA / action accent (logo "drona")
    teal:   '#05A2C6',  // secondary / info accent (logo "host")
  },
  neutral: {
    950: '#111827',
    700: '#374151',
    500: '#6B7280',
    100: '#F3F4F6',
  },
}
```

Use `brand-indigo` as the dominant UI color, `brand-orange` for CTAs and hero buttons, `brand-teal` for secondary / info. Never swap their roles.

---

## 3. Typography

### 3.1 Font Stack

| Role | Font | Fallback |
|---|---|---|
| Display / Hero headings | [Sora](https://fonts.google.com/specimen/Sora) ExtraBold (800) | system-ui, sans-serif |
| UI headings (H2–H4) | Sora Bold (700) | system-ui, sans-serif |
| Body copy | [Manrope](https://fonts.google.com/specimen/Manrope) Regular (400) / Medium (500) | system-ui, sans-serif |
| Code / technical | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | monospace |

Load via `next/font/google` as variable fonts with `display: swap`. Latin subset only by default. Sora and Manrope have no Arabic or Devanagari glyphs, so an Arabic or Hindi subset is not possible for them. For Arabic or Hindi pages, load a separate family (for example IBM Plex Sans Arabic, Noto Sans Devanagari) on those pages only, and keep it out of the Latin pages.

### 3.2 Type Scale

| Token | Size | Weight | Usage |
|---|---|---|---|
| `text-5xl` / `text-6xl` | 48–60px | 800 | Hero headline |
| `text-3xl` / `text-4xl` | 30–36px | 700 | Section headings |
| `text-xl` / `text-2xl` | 20–24px | 600 | Card titles, sub-heads |
| `text-base` / `text-lg` | 16–18px | 400 | Body copy |
| `text-sm` | 14px | 400 | Captions, meta, labels |
| `text-xs` | 12px | 400 | Legal, footnotes only |

Line height: 1.5–1.6 for body; 1.1–1.2 for display headings.

### 3.3 Font Setup

```tsx
// app/layout.tsx
import { Sora, Manrope } from "next/font/google";

const displayFont = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
  preload: true,
});

const bodyFont = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var t=localStorage.getItem('dronahost-theme');
              var s=window.matchMedia('(prefers-color-scheme:light)').matches?'light':'dark'; /* dark is the default */
              if((t||s)==='dark') document.documentElement.classList.add('dark');
            }catch(e){}}())`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 3.4 CSS Tokens

```css
/* globals.css */
:root {
  --font-display: "Sora", sans-serif;
  --font-body: "Manrope", sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: clamp(1.375rem, 2vw, 1.5rem);
  --text-3xl: clamp(1.75rem, 3vw, 2.125rem);
  --text-4xl: clamp(2.25rem, 4vw, 2.875rem);
  --text-5xl: clamp(2.75rem, 5vw, 3.875rem);
  --text-6xl: clamp(3.5rem, 7vw, 5.25rem);
  --text-hero: clamp(3rem, 8vw, 6.5rem);

  --leading-tight: 1.1;
  --leading-snug: 1.3;
  --leading-normal: 1.6;
  --leading-relaxed: 1.75;

  --tracking-tighter: -0.04em;
  --tracking-tight: -0.03em;
  --tracking-snug: -0.02em;
  --tracking-normal: 0em;
  --tracking-wide: 0.06em;
  --tracking-widest: 0.16em;
}
```

### 3.5 Usage Rules

- `<h1>`: display font, `--text-hero`, `--leading-tight`, `--tracking-tighter`, weight 700–800
- `<h2>`: display font, `--text-5xl`, `--leading-tight`, `--tracking-tight`, weight 700
- `<h3>`: display font, `--text-3xl`, `--leading-snug`, `--tracking-snug`, weight 600
- `<p>` body: body font, `--text-base` or `--text-lg`, `--leading-relaxed`, weight 400
- Eyebrow labels: body font, ALL CAPS, `--text-xs`, `--tracking-widest`, `--accent-primary`, weight 600
- Buttons / UI labels: body font, `--text-sm`, weight 500
- Code: mono font only

---

## 4. Spacing, Layout & Radius

```css
:root {
  /* 4px base grid */
  --space-1: 0.25rem;   --space-2: 0.5rem;
  --space-3: 0.75rem;   --space-4: 1rem;
  --space-5: 1.25rem;   --space-6: 1.5rem;
  --space-8: 2rem;      --space-10: 2.5rem;
  --space-12: 3rem;     --space-16: 4rem;
  --space-20: 5rem;     --space-24: 6rem;
  --space-32: 8rem;     --space-40: 10rem;
  --space-48: 12rem;

  --section-gap: clamp(5rem, 10vw, 9rem);
  --container-pad: clamp(1rem, 5vw, 2rem);

  --max-w-xs: 480px;
  --max-w-sm: 640px;
  --max-w-md: 780px;
  --max-w-content: 1200px;
  --max-w-wide: 1440px;

  --radius-xs: 4px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
  --radius-full: 9999px;

  --z-base: 0;
  --z-raised: 10;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal: 300;
  --z-toast: 400;
  --z-tooltip: 500;
}
```

---

## 5. Iconography

- Use [Lucide](https://lucide.dev/) exclusively (`lucide-react`) — MIT licensed, tree-shakable
- Style: **outline**, 1.5px stroke, 24×24px default
- Fill-style only for active / selected states
- Color: `currentColor` to match surrounding text, or `--teal` for standalone emphasis
- Never mix icon libraries on the same page

---

## 6. Imagery & Photography

### Permitted

- Abstract infrastructure imagery (servers, data centers, network cables — clean, modern, desaturated)
- Flat-lay tech still life (keyboard, monitor, code editor)
- Diverse, authentic professional headshots for testimonials (must be the real person — no stock)
- Custom illustrations aligned to the brand palette

### Prohibited

- Generic stock-photo teams or people presented as DronaHost staff
- Imagery that reads as AI-generated without disclosure
- Oversaturated or heavily filtered photography
- Clip art, 3D rendered cartoon characters
- Flags or maps that could imply political positions

### Treatment

- Prefer photos with neutral or dark backgrounds that pair with the UI
- Apply a subtle `--teal` or `--orange` tint overlay at ≤15% opacity if needed for cohesion
- Every image must have descriptive `alt` text

---

## 7. Component Library

### 01 · Button

```tsx
// variants: 'primary' | 'secondary' | 'ghost' | 'link' (primary is the single orange action)
// sizes: 'sm' | 'md' | 'lg'
```

| Variant | Background | Border | Text | Hover |
|---|---|---|---|---|
| primary | Orange action fill (`--action-fill`, flat) | none | Navy label (`--on-action`; white on orange fails contrast) | translateY(-1px) + brightness + soft shadow |
| secondary | Surface (navy family) | `1px` hairline (`--border-strong`) | `--foreground` | Teal border + faint teal fill |
| ghost | transparent | none | `--foreground` | faint foreground fill |
| link | transparent | none | `--link` (teal) | thicker underline |

Fills are flat colours with a 1px inner top highlight, not gradients (a gradient reads as busy, not calm). Hover is a 1px lift plus a small brightness change; active is `scale(0.98)`. There is no hover scale. Colours come from `tokens.css`; the names above are roles, not token names.

One primary (orange) action per section, and at most one above the fold. Use `primary` for the main action and form submits.

All: `--font-body`, `font-weight: 500`, `letter-spacing: 0.01em`, `border-radius: --radius-full`, `transition` on colour, shadow and transform only (never `all`)

---

### 02 · Card

- Background: `var(--bg-secondary)` or `var(--gradient-card)`
- Border: `1px solid var(--border-subtle)`
- Radius: `var(--radius-xl)`
- Padding: `var(--space-8)` min
- Hover: `border-color: --border-accent`, `box-shadow: --shadow-glow`, `translateY(-3px)`
- Transition: `border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease`
- Must be visually elevated above page background in both themes

---

### 03 · Badge / Chip

```css
padding: 0.25rem 0.75rem;
border-radius: var(--radius-full);
font: 600 var(--text-xs) / 1 var(--font-body);
letter-spacing: var(--tracking-wide);
/* variants use semantic color vars + -soft backgrounds */
```

---

### 04 · Input / Textarea

```css
.input {
  background: var(--bg-subtle);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font: 400 var(--text-base) / var(--leading-normal) var(--font-body);
  padding: 0.75rem 1rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.input:focus {
  outline: none;
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px var(--accent-soft);
}
.input::placeholder { color: var(--text-muted); }
```

---

### 05 · Navbar

- Position: sticky top-0, `z-index: var(--z-sticky)`, height 64px desktop / 56px mobile
- Backdrop: `backdrop-filter: blur(20px) saturate(180%)`
- Dark bg: `rgba(8,9,10,0.82)` | Light bg: `rgba(250,251,252,0.85)`
- Border-bottom: `1px solid var(--border-subtle)` — only when `scrollY > 10`
- Layout: Logo left | Nav links center | [ThemeToggle + Login + CTA] right
- Mobile: Hamburger → slide-down drawer, no overlay push

---

### 06 · ThemeToggle

```tsx
// components/ui/ThemeToggle.tsx
"use client";
import { useTheme } from "@/hooks/useTheme";
import { SunIcon, MoonIcon } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggle, mounted } = useTheme();
  if (!mounted) return <div className="w-8 h-8" />; // prevent CLS

  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      {theme === "dark" ? <SunIcon size={16} /> : <MoonIcon size={16} />}
    </button>
  );
}
```

```tsx
// hooks/useTheme.ts
"use client";
import { useState, useEffect } from "react";
type Theme = "dark" | "light";
const KEY = "dronahost-theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("dark"); // dark is the default (decision #3)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(KEY) as Theme | null;
    const sys: Theme = window.matchMedia("(prefers-color-scheme:light)").matches ? "light" : "dark"; // first visit respects the system
    const resolved = saved ?? sys;
    setTheme(resolved);
    document.documentElement.classList.toggle("dark", resolved === "dark");
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem(KEY, next);
  };

  return { theme, toggle, mounted };
}
```

---

### 07 · Pricing Card

- Regular: standard Card rules
- Featured: `border: 1px solid var(--accent-primary)`, `box-shadow: var(--shadow-glow)`, orange "Most Popular" badge at top
- Price: `--font-display`, `--text-5xl`, `font-weight: 800`
- Period `/mo`: `--text-lg`, `--text-muted`
- Feature list: accent-colored checkmark SVGs, `--text-sm`, `--leading-relaxed`
- Billing toggle: pill-shaped monthly/annual switcher above all cards

---

### 08 · Testimonial Card

- Avatar: 40×40px circle, `object-fit: cover`, `border: 2px solid var(--border-accent)`
- Stars: show a rating only when it comes from a real review platform and the card links to it. Otherwise show no stars. Star colour uses a token, never a hard-coded yellow.
- Quote: `--text-lg`, `--leading-relaxed`, italic, `--text-secondary`
- Name: `--font-display`, `font-weight: 600`, `--text-primary`
- Role/company: `--text-sm`, `--text-muted`
- Must use real person — name, company, headshot (no stock photos, no anonymous)

---

### 09 · Stats / Counter Block

- Number: `--font-display`, `--text-5xl`, `font-weight: 800`, `--accent-primary` or `--orange`
- Label: `--text-sm`, `--text-muted`, `--tracking-wide`, ALL CAPS
- Animation: count up only for numbers that are `verified` in `claims.ts`; the final value is in the server HTML (see the motion brief for timing)

---

### 10 · Section Eyebrow

```tsx
<p className="eyebrow">HOSTING PLANS</p>
// font-body · text-xs · font-weight 600 · tracking-widest
// color: --accent-primary · text-transform: uppercase
// margin-bottom: --space-3
```

---

### 11 · Tooltip

- Trigger: hover + focus (keyboard accessible)
- Background: `--bg-elevated`, `border: 1px solid var(--border-subtle)`, `--shadow-md`
- Radius: `--radius-md`, max-width 240px, `--text-sm`
- Delay: 300ms show / 100ms hide
- ARIA: `role="tooltip"` + `aria-describedby` on trigger

---

### 12 · Toast / Notification

```tsx
// variants: 'success' | 'error' | 'warning' | 'info'
// position: top-right, stacked, auto-dismiss 4s with progress bar
```

- Background: `--bg-elevated`, `border-left: 3px solid [semantic-color]`
- Slide-in from right on enter, slide-out on dismiss

---

### 13 · Skeleton Loader

```css
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-elevated) 25%,
    var(--bg-subtle) 50%,
    var(--bg-elevated) 75%
  );
  background-size: 200% 100%;
  border-radius: var(--radius-sm);
  animation: shimmer 1s ease-in-out 2; /* two passes at most (about 2s), then static */
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
```

---

### 14 · FAQ Accordion

- Each item: `--bg-secondary`, `border: 1px solid var(--border-subtle)`, `--radius-lg`
- Trigger: `--font-display`, `--text-lg`, `font-weight: 600`, chevron rotates 180° when open
- Content: `--font-body`, `--text-base`, `--leading-relaxed`, `--text-secondary`
- Animation: native `<details>` with `::details-content` block-size transition where supported; browsers without support open instantly. Never remove the answer from the HTML.
- ARIA: `aria-expanded`, `aria-controls` — keyboard navigable
- `FAQPage` JSON-LD is optional (rich results are limited to government and health sites). If used, it must match the visible text.

---

### 15 · Scroll Progress Bar

- Thin 3px bar pinned below navbar on content-heavy pages (blog, docs)
- Background: `--gradient-accent`
- Width: driven by `useScrollProgress` hook
- Hidden on homepage and marketing landing pages

---

### 16 · Live Chat Widget Wrapper

**Retired (owner decision 22, 2026-10-07).** Live chat, WhatsApp and phone are not offered. Support is by ticket and email only. Do not build this component. If live chat is ever offered, the owner reopens decision 22 first.

---

### 17 · Cookie Consent Banner

- Required for EU/UK visitors (GDPR)
- Position: bottom of viewport, slide-up on first visit
- Background: `--bg-elevated`, `--border-default`, `--shadow-lg`
- Buttons: "Reject non-essential" and "Accept all" at the **same size, style and visual weight**, plus "Manage preferences". A ghost-only "Manage" next to a filled "Accept" is not compliant for the EU and UK.
- Record the decision with a timestamp and a policy version, and block every non-essential script until consent is given
- Storage location is an implementation detail (first-party cookie or storage); it is not fixed by this rule

---

### 18 · Breadcrumb

```tsx
// components/seo/Breadcrumb.tsx
// Rendered on all inner pages — not homepage
// Pairs with BreadcrumbList JSON-LD schema
// Style: --text-sm, --text-muted, separator "/"
// Current page: --text-primary, not a link
```

---

## 8. Animation & Motion

```css
:root {
  --duration-instant: 50ms;
  --duration-fast: 150ms;
  --duration-normal: 250ms;
  --duration-slow: 400ms;
  --duration-enter: 500ms;

  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}
```

**Rules:**

- **No entrance animation above the fold.** The H1 is usually the LCP element, so animating it delays LCP.
- Cards (interactive only): `translateY(-3px)` + glow on hover, only where hover exists — `200ms --ease-standard`
- Buttons: hover is a 1px lift plus a brightness change; active is `scale(0.98)` — `150ms`. No hover scale.
- Scroll reveals: `IntersectionObserver`, once — `opacity 0→1` + `translateY(14px→0)` — 700ms `ease-out`, at most 6 staggered items
- No bounce easing. Do not define or use `--ease-bounce`.
- Flat fills with a hairline highlight, not gradient fills, on buttons
- CountUp stats: only for verified numbers, fires once on first viewport entry (timing in the motion brief)
- Modal: `opacity + scale(0.97→1)` enter, reverse on exit
- Always include:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 9. Voice & Tone

| Do | Don't |
|---|---|
| Specific, verified numbers: "[EXAMPLE, NOT VERIFIED: 200ms TTFB from London]" | Vague claims: "blazing fast" |
| Professional, calm confidence | Exclamation-heavy hype |
| Outcome-led: "Your site loads in under 1s" | Feature-led: "We have NVMe storage!" |
| "please" | "Kindly" |
| "dedicated support" | "one-to-one support" |
| State where the company is based and who runs it | Implying a location or identity you do not have |

**By channel:**

- Marketing pages: confident, specific, calm
- Documentation / KB: precise, direct, no filler
- Error messages: helpful, non-blaming, actionable
- Blog posts: conversational, technically credible — light emoji OK

**Phrases to avoid:** "Don't fret!", "Do the needful", "blazing fast", "world-class", "cutting-edge", "state-of-the-art", "revolutionary", "Click here", ALL CAPS emphasis, excessive exclamation marks.

---

## 10. SEO Implementation

### Global Metadata (`app/layout.tsx`)

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://dronahost.com"),
  title: {
    default: "DronaHost — Premium Web Hosting, Domains & Website Design",
    template: "%s | DronaHost",
  },
  description: "[EXAMPLE, NOT VERIFIED] DronaHost offers WordPress hosting, cloud hosting, managed VPS, domain registration, and website design & SEO for businesses worldwide.",
  authors: [{ name: "DronaHost Team", url: "https://dronahost.com/about" }],
  creator: "Alphabet Force", // TODO(decision #6): legal entity name is unconfirmed
  publisher: "DronaHost",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://dronahost.com",
    siteName: "DronaHost",
    title: "DronaHost — Premium Web Hosting & Website Design",
    description: "[EXAMPLE, NOT VERIFIED] Managed WordPress, cloud and VPS hosting, domains, web design and SEO from one team.",
    images: [{ url: "/og/home.jpg", width: 1200, height: 630, alt: "DronaHost" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dronahost",
    title: "DronaHost — Premium Web Hosting",
    description: "[EXAMPLE, NOT VERIFIED] Managed WordPress, cloud and VPS hosting.",
    images: ["/og/home.jpg"],
  },
  alternates: { canonical: "https://dronahost.com" },
  verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },
};
```

### JSON-LD (inline `<script>` in Server Components — never `next/script`)

> The single Organization and WebSite `@graph` is defined in `seo-rules.md` §2. The sample below is illustrative only; do not keep a second definition in code.

```tsx
const orgSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://dronahost.com/#organization",
      name: "DronaHost",
      url: "https://dronahost.com",
      logo: { "@type": "ImageObject", url: "https://dronahost.com/logo.png", width: 200, height: 60 },
      contactPoint: {
        "@type": "ContactPoint",
        // telephone: omitted. Phone support is not offered (owner decision 22). Use a ContactPoint with url and email only.
        contactType: "customer service",
        email: "sales@dronahost.com", // [EXAMPLE, NOT VERIFIED] TODO(decision #6): hello@ vs sales@
        availableLanguage: ["English"],
        areaServed: ["US", "GB", "AE", "EU"],
      },
      sameAs: ["https://x.com/dronahost", "https://www.linkedin.com/company/dronahost"], // [EXAMPLE, NOT VERIFIED] use only real, owned profiles
    },
    {
      "@type": "WebSite",
      "@id": "https://dronahost.com/#website",
      url: "https://dronahost.com",
      name: "DronaHost",
      publisher: { "@id": "https://dronahost.com/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: "https://dronahost.com/search?q={search_term_string}" },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
```

### Per-page schemas

| Page type | Required schema |
|---|---|
| Homepage | `Organization` + `WebSite` in one `@graph` with stable `@id` (no `SearchAction`) |
| Hosting plan | `Product` + `Offer` (`AggregateRating` only with real, visible, linked reviews) |
| Blog post | `Article` + `BreadcrumbList` + `Person` (author) |
| FAQ section | `FAQPage` is optional; if used it must match the visible Accordion text |
| Contact | `Organization` with `contactPoint` (not `LocalBusiness`) |
| Service page | `Service` with `areaServed` |

### Core Web Vitals Checklist

- `<Image priority>` on all LCP images (hero, above-fold)
- Explicit `width` + `height` on every `<Image>` to prevent CLS
- `next/font` with `display: 'swap'` — no layout shift from fonts
- Theme init inline `<script>` before React hydrates — prevents theme flash (CLS)
- `loading="lazy"` on all below-fold images
- Dynamic import heavy components (charts, maps) with `next/dynamic`

---

## 11. E-E-A-T Implementation

**E-E-A-T = Experience · Expertise · Authoritativeness · Trustworthiness**

### Experience — show real-world proof

- Genuine testimonials: name + company + country (no anonymous reviews). No star rating unless it comes from a real review platform and links to it.
- Case studies: real client, specific metrics, before/after
- Live uptime % widget (real API, never hardcoded), and only with a public status page behind it
- Team About page: names, photos, roles, LinkedIn, years of experience

### Expertise — demonstrate domain knowledge

- Blog and KB with original, in-depth articles by named authors
- Each article: author name, bio, date published, date updated, reading time
- Comparison pages (DronaHost vs WP Engine) — factual, no spin
- No AI-generated thin content — every page must be genuinely useful

### Authoritativeness — build external trust signals

- Footer: legal entity, country and founding year, rendered from `claims.ts` once verified. TODO(decision #6): the entity name ("Alphabet Force") and the founding year (2022 vs 2019) are unconfirmed.
- Partner / technology logos: WordPress, cPanel, Cloudflare, LiteSpeed
- Client count / countries served (real numbers only, from `claims.ts`)
- Privacy Policy, Terms, Refund Policy linked in footer on every page

### Trustworthiness — technical + content trust

- HTTPS canonical enforced in metadata
- Consistent NAP (Name, Address, Phone) format across all pages
- Renewal price equals the signup price (decision #5). Every pricing card shows the renewal price ("Renews at $X/month", from `pricing.renewal`). The promise wording ("same price, no increase") is a claim: it renders only when `renewal-price-same` renders (verified AND its terms page published, see `content/claims.ts`). Never hide the renewal price or put it in a tooltip.
- Money-back guarantee badge on hosting pages, only if the guarantee is verified in `claims.ts`
- Real phone and email from `claims.ts`, never hidden. TODO(decision #6): values unconfirmed.
- Cookie consent banner for EU/UK visitors
- SSL badge + DDoS protection mention on hosting pages

---

## 12. Search Intent Architecture

Every page is built for one primary user intent.

TODO(decision #7): the paths in this table and in §13 conflict with the sitemap URLs in `seo-rules.md`
(`/managed-vps` vs `/vps-hosting`, `/wordpress-website-design` vs `/web-design`, `/contact-us` vs `/contact`). Do not
change any URL until the owner supplies the live URL map.

| Page | Intent | Key CTA |
|---|---|---|
| Homepage | Navigational + Commercial | → Service pages |
| /wordpress-hosting | Commercial Investigation | "See WordPress hosting plans" |
| /managed-vps | Commercial Investigation | "See VPS hosting plans" / "Talk to the team" |
| /wordpress-website-design | Commercial Investigation | "Request Consultation" |
| /about | Navigational + Trust | No hard CTA |
| /blog/* | Informational | Newsletter / soft CTA |
| /contact-us | Transactional | Form / phone |

**Copy rules:**

- Commercial pages: lead with the outcome. "Your site loads in under 1s" not "We use LiteSpeed servers."
- Informational pages: depth, accuracy, original research — no keyword stuffing
- Transactional pages: single CTA, minimal form fields, trust signals prominent

---

## 13. Project File Structure

```
dronahost/
├── app/
│   ├── layout.tsx              ← fonts, theme init, global metadata, org JSON-LD
│   ├── sitemap.ts
│   ├── robots.ts
│   └── [locale]/               ← i18n from day one; only en-us is live (decision #8). en-gb, en-ae and others are Phase 2.
│       ├── page.tsx
│       ├── (marketing)/
│       │   ├── wordpress-hosting/page.tsx
│       │   ├── cloud-hosting/page.tsx
│       │   ├── managed-vps-hosting/page.tsx
│       │   ├── domain/page.tsx
│       │   ├── wordpress-website-design/page.tsx
│       │   ├── seo-services/page.tsx
│       │   └── about/page.tsx
│       ├── (legal)/
│       │   ├── privacy-policy/page.tsx
│       │   ├── terms-of-service/page.tsx
│       │   └── refund-policy/page.tsx
│       ├── blog/[slug]/page.tsx
│       └── contact-us/page.tsx
├── api/                        ← Route handlers (not locale-prefixed)
│   ├── contact/route.ts
│   ├── newsletter/route.ts
│   └── gdpr/
│       ├── export/route.ts
│       └── delete/route.ts
├── components/
│   ├── ui/                     ← Primitives
│   ├── sections/               ← Page sections
│   └── seo/
│       ├── JsonLd.tsx
│       └── Breadcrumb.tsx
├── hooks/
│   ├── useTheme.ts
│   ├── useScrollProgress.ts
│   └── useIntersectionObserver.ts
├── lib/
│   ├── models/                 ← Mongoose schemas (obsolete, to be removed: data moves to WordPress)
│   ├── services/               ← Third-party API wrappers
│   ├── seo/                    ← Metadata helpers
│   ├── i18n/                   ← Translation helpers
│   ├── pricing/                ← Price formatting from data/pricing.json (USD default)
│   ├── compliance/             ← GDPR, CCPA helpers
│   ├── mongodb.ts              ← (obsolete, to be removed)
│   └── utils.ts
├── messages/                   ← Translation JSON files per locale
└── styles/
    └── globals.css
```

---

## 14. DO's — Always

### Design

- CSS variables for every color, shadow, spacing, and radius — no exceptions
- `clamp()` for fluid typography and spacing
- Test every component in both dark and light mode before completion
- Semantic HTML: `<main>`, `<section>`, `<article>`, `<aside>`, `<nav>`, `<header>`, `<footer>`
- Minimum 4.5:1 contrast ratio for body text in both themes (WCAG AA)
- `aria-label` on all icon-only buttons
- Visible `focus-visible` styles for keyboard navigation
- `prefers-reduced-motion` media query on all animation blocks — use `motion-reduce:transition-none` and `motion-safe:hover:` Tailwind variants on components, global `@media` block in `globals.css` for CSS animations
- Cards visually elevated above page background in both themes
- One orange CTA above the fold maximum
- Mobile-first: write base styles for 320px, scale up with `sm:` `md:` `lg:` `xl:` prefixes
- All interactive elements ≥ 44×44px touch target (WCAG 2.5.5)
- `aspect-*` utilities on all image containers — never fixed `h-*` heights on image wrappers
- `sizes` prop on every `next/image` — match actual rendered width at each breakpoint
- Test every component at 320px / 375px / 768px / 1024px / 1440px before `/v2` approval
- No horizontal scroll at any breakpoint — treat any overflow as a blocker

### Code

- TypeScript strict mode — all props explicitly typed with interfaces
- Server Components by default; `"use client"` only when strictly needed
- `<Image>` with `width`, `height`, descriptive `alt`, and `priority` on LCP images
- `<Link>` for all internal navigation
- `mounted` guard in `useTheme` to prevent hydration mismatch
- Theme init inline `<script>` before React hydration in `<head>`
- Lazy-load below-fold sections with `next/dynamic` or `IntersectionObserver`

### SEO

- Unique `title` + `description` on every page via `generateMetadata`
- Canonical URL on every page
- JSON-LD schema on every page — minimum `WebPage` + `Organization`
- One `<h1>` per page, logical heading hierarchy
- Descriptive `alt` on all meaningful images
- OG image (1200×630px) for every public-facing page
- `FAQPage` schema on FAQ sections is optional; if present it must match the visible text
- `Article` schema with author on all blog posts

---

## 15. DON'Ts — Never

### Design

- Hardcode any hex, rgb, or hsl color — CSS variables only
- Use Inter, Roboto, Arial, system-ui, DM Sans, or Geist as heading/body fonts — use Sora + Manrope
- Purple-to-pink gradients, rainbow, or neon glow aesthetics
- Pure `#FFFFFF` as the light-mode **page** background — use `var(--background)`. Cards and logo backgrounds may be white.
- Pure `#000000` in dark mode — use `var(--background)` (dark value)
- Clip art, stock photo grids, or generic SaaS illustration packs
- Looping / auto-playing animations — only on interaction or scroll entry
- Transitions > 600ms on any interactive element
- Orange CTA on more than one hero-level button per page
- Centered walls of text longer than 2 lines
- Any component that looks identical in both themes — means variables weren't used
- `dark:text-gray-300` — use `text-[var(--muted-foreground)]` (auto-switches, no `dark:` override needed)
- `bg-white dark:bg-gray-900` — use `bg-[var(--card)]`
- `border-black/5 dark:border-white/10` — use `border` (global token) or `color-mix` separator patterns (§18.5)
- `style={{ color: '#...' }}` (any hard-coded hex) — always a token, for example `style={{ color: 'var(--foreground)' }}`
- Tailwind palette colors (`gray-*`, `neutral-*`, `orange-*`) for surfaces, text, or borders — use design token variables
- Fixed `h-*` heights on image containers — use `aspect-video`, `aspect-square`, or `aspect-[n/n]`
- Fixed `px` widths on layout containers or section wrappers
- Horizontal scroll on any breakpoint — treat as a blocker before shipping
- Hiding SEO-critical content with `hidden sm:block` — Google indexes mobile-first; keep in DOM with `sr-only` if needed visually hidden

### Code

- Uncontrolled `<form>` without `onSubmit` handler and Zod validation
- `style={{ color: '#anything' }}` — always use CSS variables
- `!important` in any stylesheet
- Tables for layout
- `localStorage` access outside `useEffect` — causes SSR crash
- Missing `"use client"` on components using hooks or browser APIs
- Skipping `mounted` guard in `useTheme`
- `next/script` for JSON-LD — use native `<script>` tag

### SEO

- Duplicate `<title>` or `<description>` across pages
- Generic meta description ("Welcome to our website")
- Missing `alt` on feature or product images
- Multiple `<h1>` on one page
- Keyword stuffing
- Missing canonical tag
- Blocking CSS or JS in `robots.txt`
- AI-generated thin content
- `FAQPage` schema that does not match the visible FAQ text
- Missing `Article` schema with author on blog posts

---

## 16. Quick Reference

### Implemented CSS tokens

> **SUPERSEDED by `app/styles/tokens.css`.** The table below predates it and still lists indigo rows that were removed from the brand (decision #1).

| Variable | Tailwind usage | Light | Dark |
|---|---|---|---|
| `--background` | `bg-background` | `oklch(0.99 0.003 75)` | `oklch(0.148 0.008 75)` |
| `--foreground` | `text-foreground` | `oklch(0.21 0.01 75)` | `oklch(0.95 0.005 75)` |
| `--card` | `bg-[var(--card)]` | `oklch(0.968 0.005 75)` | `oklch(0.19 0.01 75)` |
| `--card-foreground` | `text-[var(--card-foreground)]` | same as foreground | same |
| `--muted` | `bg-[var(--muted)]` | `oklch(0.95 0.006 75)` | `oklch(0.21 0.01 75)` |
| `--muted-foreground` | `text-[var(--muted-foreground)]` | `oklch(0.52 0.012 75)` | `oklch(0.56 0.01 75)` |
| `--border` | `border` (global default) | `oklch(0.9 0.008 75)` | `oklch(0.27 0.01 75)` |
| `--accent` | `text-accent`, `bg-accent/N` | orange `oklch(0.648 0.22 38.17)` | `oklch(0.72 0.185 44)` (brighter) |
| `--secondary` | `text-secondary` | teal `oklch(0.62 0.13 220)` | same |

> `bg-primary/N`, `text-accent/N`, `border-primary/N` opacity modifiers work because `--color-primary`, `--color-accent`, `--color-foreground`, `--color-background` are registered in the `@theme` block. All other variables must use `var(--*)` arbitrary syntax.

### Breakpoints

| Prefix | Min-width | Common use |
|---|---|---|
| (none) | 0px | Mobile base |
| `sm:` | 640px | Large mobile / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop / desktop |
| `xl:` | 1280px | Wide desktop |

### Fonts & brand

| Role | Font | CSS variable |
|---|---|---|
| Display / headings | Sora | `var(--font-heading)` |
| Body copy | Manrope | `var(--font-sans)` |
| Code | JetBrains Mono | — |

| Item | Value |
|---|---|
| Theme class | `.dark` on `<html>` = dark (the default, decision #3); no class = light |
| Theme storage key | `localStorage: 'dronahost-theme'` |
| Framework | Next.js 16 App Router + TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Phone | [EXAMPLE, NOT VERIFIED] TODO(decision #6): use `claims.ts` |
| Email | [EXAMPLE, NOT VERIFIED] TODO(decision #6): use `claims.ts` |

---

## 17. Responsive Design

> Mobile-first. Every component works at 320px before it works at 1440px.

### 17.1 Approach

- **Mobile-first always** — base Tailwind classes target 320px+; use `sm:` `md:` `lg:` `xl:` to scale up
- **Never** use `max-width` Tailwind media queries — always min-width (mobile-first direction)
- The most important content stacks first on mobile — visual embellishments come last

### 17.2 Breakpoints

| Tailwind prefix | Min-width | Target viewport |
|---|---|---|
| (none) | 0px | Mobile (320px – 639px) |
| `sm:` | 640px | Large mobile / small tablet |
| `md:` | 768px | Tablet portrait |
| `lg:` | 1024px | Laptop / desktop |
| `xl:` | 1280px | Wide desktop |
| `2xl:` | 1536px | Ultra-wide |

Always define columns for every applicable breakpoint — never leave a mid-size viewport unaddressed.

### 17.3 Touch Targets

- All interactive elements: minimum **44×44px** (WCAG 2.5.5 — required for US ADA compliance)
- Buttons: `min-h-[2.75rem]` is the floor — never shrink below this
- Dense navigation links: add `py-2 px-3` to expand the tap area without changing visual size
- Icon-only buttons: always wrap in a `min-w-11 min-h-11` container

### 17.4 Typography

- Use `clamp()` for all display heading sizes — CSS tokens `--text-2xl` through `--text-hero` have this built in (§3.4)
- **Body text minimum: `text-base` (16px)** — never below `text-sm` (14px) for body copy
- Line length: `max-w-prose` (65ch) on body paragraphs — never let text span >80ch on desktop
- Use `text-balance` on multi-line headings to prevent orphan words on narrow viewports

```tsx
// GOOD — fluid heading via CSS token
<h1 className="text-balance" style={{ fontSize: "var(--text-hero)" }}>...</h1>

// BAD — fixed Tailwind size, no fluid scaling
<h1 className="text-6xl">...</h1>
```

### 17.5 Layout & Containers

```tsx
// Standard content container
<div className="w-full max-w-[var(--max-w-content)] mx-auto px-[clamp(1rem,5vw,2rem)]">

// Section vertical rhythm
<section className="py-[clamp(5rem,10vw,9rem)]">
```

Rules:
- Never use fixed `px` widths on layout containers — `max-w-*` sets the ceiling, width is always fluid
- Grids: always declare columns for every relevant breakpoint: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Stacking order on mobile: primary content first, decorative visuals last (SEO + readability)
- Avoid fixed `height` on layout rows — use `min-h-*` or let content define height naturally

### 17.6 Images

```tsx
// GOOD — fluid aspect-ratio container
<div className="relative aspect-video w-full overflow-hidden rounded-xl">
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    className="object-cover"
  />
</div>

// BAD — fixed height prevents fluid scaling
<div className="relative h-48 w-full">
  <Image src={src} alt={alt} fill className="object-cover" />
</div>
```

Rules:
- All images via `next/image` with a `sizes` prop matching actual rendered width at each breakpoint
- Use `aspect-video`, `aspect-square`, or `aspect-[n/n]` on image containers — **never fixed `h-*` heights**
- LCP image: `priority` prop, no lazy loading, explicit `sizes`
- Below-fold: `next/image` lazy-loads by default — no extra attribute needed
- Use `fill` + positioned parent for card images; `width`/`height` for fixed-size icons/avatars

### 17.7 Component Responsive Behaviour

| Component | Mobile (default) | `sm:` | `lg:` |
|---|---|---|---|
| Card grid | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Pricing cards | `grid-cols-1` | `grid-cols-1` | `grid-cols-3` |
| Hero section | single column, centre-aligned | single column | two columns side-by-side |
| Navbar | hamburger + slide drawer | hamburger | full horizontal links |
| Footer columns | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` → `grid-cols-6` |
| Stats bar | `grid-cols-2` | `grid-cols-2` | `grid-cols-4` |
| Feature grid | `grid-cols-1` | `grid-cols-2` | `grid-cols-3` |
| Testimonials | single column | `grid-cols-2` | `grid-cols-3` |

### 17.8 Testing Requirements

Test every new component at these widths **before** marking it `approved` in `/v2`:

| Width | Device reference |
|---|---|
| 320px | Oldest supported Android |
| 375px | iPhone SE / 13 mini |
| 390px | iPhone 14 |
| 768px | iPad portrait |
| 1024px | iPad landscape / laptop |
| 1440px | Standard desktop |

- Use browser DevTools device emulation — window resizing alone is insufficient
- Check for horizontal scroll (`overflow-x`) — any overflow is a blocker, not a warning
- Verify all interactive elements are tappable without pinch-zoom

### 17.9 DON'Ts — Responsive

- Fixed `px` widths on layout containers or section wrappers
- `max-width` media queries in Tailwind — use min-width (mobile-first)
- `hidden sm:block` on SEO-critical content — Google indexes mobile-first; use `sr-only` to hide visually
- `vh` units for primary content height — unreliable on iOS Safari with browser chrome showing/hiding
- Fixed `h-*` on image containers — use `aspect-*` instead
- Horizontal scroll on any breakpoint — zero tolerance

---

## 18. Dark / Light Mode

> Both modes are first-class. A component that looks identical in both themes has a bug.

### 18.1 The Token-Only Rule

Every surface color, text color, border, and shadow must reference a CSS custom property. Hardcoded hex, rgb, hsl, or oklch values in component `className` or `style={}` props are forbidden.

```tsx
// BAD — hardcoded, breaks dark mode
<div className="bg-white text-gray-900 border-gray-200">

// GOOD — token-driven, switches automatically
<div className="bg-[var(--card)] text-foreground border">
```

Dark is the default theme (decision #3): the server renders `.dark` on `<html>`, and the first-visit system preference is respected. Light mode is the absence of `.dark`. Toggle via `classList.toggle("dark", isDark)` — never `data-theme` attributes.

### 18.2 Surface Hierarchy

| Layer | CSS Variable | Tailwind | Notes |
|---|---|---|---|
| Page background | `var(--background)` | `bg-background` | `<body>` and page wrappers |
| Muted section / input | `var(--muted)` | `bg-[var(--muted)]` | Alternating sections, inputs, skeleton loaders |
| Card / panel | `var(--card)` | `bg-[var(--card)]` | All card, panel, drawer backgrounds |
| Elevated overlay | `var(--card)` + `shadow-lg` | — | Dropdowns, tooltips — elevation via shadow, not bg colour |
| Border | `var(--border)` | `border` | Global `* { border-color: var(--border) }` — just add `border` class |

**Rule:** Card must appear visually elevated above page background in both modes. If they look the same in dark mode, the token was not applied.

### 18.3 Text Hierarchy

| Role | Variable | Tailwind |
|---|---|---|
| Headings, key UI text | `var(--foreground)` | `text-foreground` |
| Body copy, labels, descriptions | `var(--muted-foreground)` | `text-[var(--muted-foreground)]` |
| Text on orange action buttons | navy label from `--on-action` (white on orange is 3.22:1 and fails; see §2.4) | `text-(--on-action)` |

### 18.4 Brand Colour Usage in Both Modes

> **SUPERSEDED by `app/styles/tokens.css`.** The `--primary` / `--accent` mapping below clashes with the newer token names and still lists indigo, which was removed from the brand (decision #1). Read the live token names from `tokens.css`.


| Colour | Variable | Tailwind token works? | Usage |
|---|---|---|---|
| Brand Orange | `var(--accent)` | `text-accent`, `bg-accent/N`, `border-accent/N` ✅ | Hero CTA, badges, highlights |
| Brand Teal | `var(--secondary)` | `text-secondary` ✅ | Info accents, secondary links |

The variable auto-shifts value between light and dark — never hardcode either value.

**Opacity modifiers** (require `--color-*` registration in `@theme` — already done for primary, accent, foreground, background):

```tsx
bg-accent/10       // 10% orange fill — category badges
text-accent        // full orange text
text-accent/80     // 80% orange — read-time, secondary accents
```

### 18.5 Separator and Border Patterns

```tsx
// Standard — picks up var(--border) globally, just use border class
<div className="border-t" />

// Soft (60% opacity of border token)
<div className="[border-color:color-mix(in_oklch,var(--border)_60%,transparent)]" />

// Strong (80% of foreground — near-black light / near-white dark)
<div className="[border-color:color-mix(in_oklch,var(--foreground)_80%,transparent)]" />
```

### 18.6 Shadow Treatment by Mode

| Mode | What works | What disappears |
|---|---|---|
| Light | Neutral grey shadows (`shadow-sm` – `shadow-xl`) | — |
| Dark | Coloured glows via `color-mix` | Neutral grey shadows — invisible against dark bg |

Use coloured glows for all interactive hover states:

```tsx
// Primary UI hover glow (teal or navy family; no indigo)
"motion-safe:hover:[box-shadow:0_8px_32px_-4px_color-mix(in_oklch,var(--primary)_20%,transparent)]"

// CTA / featured card hover glow (orange)
"motion-safe:hover:[box-shadow:0_8px_32px_-4px_color-mix(in_oklch,var(--accent)_20%,transparent)]"
```

Always test shadows in dark mode before approving in `/v2`.

### 18.7 Component Dark Mode Checklist

Before marking any component `approved` in `/v2`:

- [ ] Card background visually distinct from page background in dark mode
- [ ] All text passes 4.5:1 contrast in dark mode (WCAG AA)
- [ ] Borders visible in dark mode — not invisible against dark surfaces
- [ ] Focus rings visible in dark mode
- [ ] Hover shadows visible in dark mode (coloured glow, not neutral)
- [ ] No hardcoded hex/rgb/oklch in `className` or `style={}`
- [ ] Brand colours use variables — not Tailwind palette (`orange-500`, `teal-500`, `slate-*`, etc.)

### 18.8 Theme Flash Prevention

The inline script in `app/layout.tsx` must run before React hydrates. Never rely on `useEffect` alone — it runs after paint and causes CLS.

```tsx
// app/layout.tsx — inside <head>, before any React output
<script dangerouslySetInnerHTML={{ __html: `(function(){
  try {
    var t = localStorage.getItem('dronahost-theme');
    var s = window.matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark'; // dark is the default
    if ((t || s) === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {}
}())` }} />
```

### 18.9 DON'Ts — Dark / Light Mode

- `dark:text-gray-300` — use `text-[var(--muted-foreground)]` (auto-switches, no `dark:` needed)
- `bg-white dark:bg-gray-900` — use `bg-[var(--card)]`
- `text-gray-600 dark:text-gray-300` — use `text-[var(--muted-foreground)]`
- `border-black/5 dark:border-white/10` — use `border` or `color-mix` patterns (§18.5)
- `style={{ color: '#...' }}` (any hard-coded hex) — always a token, for example `style={{ color: 'var(--foreground)' }}`
- A component that looks identical in light and dark — this is a bug, not a design choice
- `data-theme` attribute — always `.dark` class on `<html>`
- `localStorage` access outside `useEffect` — causes SSR crash

---

## 19. Pre-Ship Checklist

> Run before every PR that touches a component, page, or content block.
> Each item cites its authoritative rule file.

### Design & UI/UX (`docs/rules/ui-ux-rules.md`)

- [ ] Every colour references a CSS variable — no hardcoded hex, rgb, or oklch (§2.5, §18.1)
- [ ] Component verified visually in **both light and dark mode** (§18.7)
- [ ] No Tailwind palette colors (`gray-*`, `neutral-*`, `orange-*`) for surfaces, text, or borders (§18.9)
- [ ] Interactive card hover: `translateY(-3px)`, `duration-200`, coloured glow shadow, hover devices only (§7.02, §18.6)
- [ ] Transitions wrapped with `motion-reduce:transition-none` or `motion-safe:hover:` guard (§8)
- [ ] All interactive elements have visible `focus-visible` ring (§14)
- [ ] Touch targets ≥ 44×44px (§17.3)
- [ ] Image containers use `aspect-*` — no fixed `h-*` heights on image wrappers (§17.6)
- [ ] All `next/image` has descriptive `alt` and `sizes` prop (§17.6)
- [ ] LCP image has `priority` prop (§17.6)
- [ ] Card visually elevated above page background in both themes (§7.02, §18.2)
- [ ] Component tested at 320px / 375px / 768px / 1024px / 1440px — no horizontal scroll (§17.8)
- [ ] Shadows verified in dark mode — use coloured glow if neutral shadow is invisible (§18.6)

### Code (`docs/rules/coding-rules.md`)

- [ ] No `"use client"` at page level — pages are Server Components (§2)
- [ ] `"use client"` only on leaf components that need hooks or browser APIs (§2)
- [ ] No bare `<img>` — always `next/image` (§3)
- [ ] No bare `<a href>` for internal routes — always `next/link` (§3)
- [ ] `generateMetadata` or static `metadata` exported from every `page.tsx` (§3)
- [ ] JSON-LD schema included for the page type (§3)
- [ ] File ≤ 300 lines, functions ≤ 40 lines (§4)
- [ ] All props explicitly typed — no `any`, no implicit `any` (§1, §5)
- [ ] `cn()` used for all conditional class strings — no string concatenation (§11)
- [ ] No `@ts-ignore` — root type error fixed instead (§1)
- [ ] No `style={{ color: '#...' }}` — always `var(--*)` (§11, §18.9)
- [ ] New component reviewed and approved in `/v2` before use on real pages (§6)

### SEO (`docs/rules/seo-rules.md`)

- [ ] `buildMetadata()` helper used — never inline metadata object
- [ ] `title` unique, keyword-first, 60 chars or fewer including the suffix (guideline)
- [ ] `description` unique, 160 chars or fewer, ends with a next step (guideline)
- [ ] `alternates.canonical` absolute URL set
- [ ] `hreflang` alternates for all active locales
- [ ] One `<h1>` per page, logical H1 → H2 → H3 hierarchy
- [ ] JSON-LD schema correct for page type (see CLAUDE.md schema table)
- [ ] OG image (1200×630px) set in metadata
- [ ] Lighthouse (median of 3 mobile runs): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95
- [ ] No client-side-only rendering for indexable content

### Content (`docs/rules/content-writing-rules.md`)

- [ ] No banned phrases: "Don't fret!", "blazing fast", "world-class", "cutting-edge", "Kindly"
- [ ] No phrases from the "Phrases to avoid" list; plain international English at roughly grade 8-10
- [ ] All performance/uptime claims backed by real data in `claims.ts` — no invented stats
- [ ] Prices come from `data/pricing.json` and show currency symbol and period (format only, for example `{{symbol}}{{amount}}/month`)
- [ ] CTA copy is action-led — not "Click here", "Learn more", or "Submit"

### Performance (CLAUDE.md)

- [ ] Total JS per changed page < 150KB gzipped
- [ ] No blocking third-party scripts in `<head>`
- [ ] New `"use client"` components checked for client bundle size impact
- [ ] `next/dynamic` with `ssr: false` only for genuinely client-only widgets (maps, canvas)
- [ ] Below-fold heavy components lazy-loaded via `IntersectionObserver` or `next/dynamic`

### Trust & Compliance (CLAUDE.md)

- [ ] New user-data features reviewed for GDPR implications before shipping to EU/UK
- [ ] New forms have CSRF protection and Zod validation on the server
- [ ] New API routes are rate-limited and Zod-validated before processing
- [ ] No secrets, API keys, or tokens in client-side code or committed `.env` files
