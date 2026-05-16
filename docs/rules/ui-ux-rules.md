# DronaHost — UI/UX Rules

> Single source of truth for all visual, interaction, and content decisions.
> Logo-only specs (clear space, print sizes, file formats) live in `docs/rules/brand-identity.md`.

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

---

## 1. Design Philosophy

**Direction:** Ultra-premium minimal luxury. Think Apple × Linear × Vercel — but warmer and more human. Clean layouts with deliberate breathing room. Every element earns its place.

**Both dark and light modes are first-class.** Light is the HTML default; dark activates via the `.dark` class (toggled by `useTheme`). Light must feel equally editorial and refined. The indigo, orange, and teal accents stay consistent across both modes; only surfaces, text, and shadow strengths shift.

**Visual pillars:**

- Whitespace as a luxury signal
- Typography doing the heavy lifting — not icons or illustrations
- Micro-interactions that delight, never distract
- Consistent depth system: page → section → card → element

**Never:** Neon gradients, generic stock photos, cartoon illustrations, cluttered feature lists, or the visual language of "cheap hosting."

---

## 2. Color System

### 2.1 Brand Color Palette

DronaHost uses three core colors with distinct, non-interchangeable roles:

| Name | Hex | RGB | Role |
|---|---|---|---|
| **Brand Indigo** | `#4F46E5` | `79, 70, 229` | Primary UI color — nav, primary buttons, rings, headings, trust signals |
| **Brand Orange** | `#FE5403` | `254, 84, 3` | Action / CTA accent — "drona" in logo, hero CTAs, key highlights |
| **Brand Teal** | `#05A2C6` | `5, 162, 198` | Secondary / info accent — "host" in logo, info states, secondary links |

The logo is the anchor: orange for "drona", teal for "host". Indigo is the dominant UI interaction color — not in the wordmark but signals premium trust (consistent with Linear, Notion, Vercel). Never substitute with visually similar alternatives.

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
| Brand Orange `#FE5403` on White | ~3.7:1 | Fails at normal text — use for large text (18px+) or icons only |
| Brand Orange bold 18px+ on White | ~3.7:1 | Passes (WCAG AA Large) |
| Near-Black `#111827` on White | ~18:1 | Passes |
| White on Brand Teal `#05A2C6` | ~3.2:1 | Fails at normal text — use bold 18px+ only |
| White on Near-Black `#111827` | ~18:1 | Passes |

**Rule:** Never use Brand Orange or Brand Teal for body-size text on white. Use them for display text (≥24px bold), buttons, borders, and decorative elements only.

### 2.5 CSS Custom Properties

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

Load via `next/font/google` as variable fonts with `display: swap`. Latin subset only by default; add Arabic subset for UAE locale pages.

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
              var s=window.matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
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
// variants: 'primary' | 'secondary' | 'ghost' | 'danger' | 'orange'
// sizes: 'sm' | 'md' | 'lg'
```

| Variant | Background | Border | Text | Hover |
|---|---|---|---|---|
| primary | `--gradient-accent` | none | `--text-on-accent` | scale(1.02) + `--shadow-glow` |
| secondary | transparent | `1px solid --border-accent` | `--accent-primary` | `--accent-soft` fill |
| ghost | transparent | none | `--text-secondary` | `color: --text-primary` |
| danger | `--error-soft` | `1px solid --error` | `--error` | `--error` fill + white text |
| orange | `--gradient-orange` | none | `#ffffff` | scale(1.02) + `--shadow-glow-orange` |

`orange` is the hero CTA variant (logo-native). Use `primary` (indigo) for UI actions and form submits. Never use both on the same above-fold section.

All: `--font-body`, `font-weight: 500`, `letter-spacing: 0.01em`, `border-radius: --radius-full`, `transition: all 180ms ease`

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
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem(KEY) as Theme | null;
    const sys: Theme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
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
- Stars: 5 yellow SVG stars, filled to rating value
- Quote: `--text-lg`, `--leading-relaxed`, italic, `--text-secondary`
- Name: `--font-display`, `font-weight: 600`, `--text-primary`
- Role/company: `--text-sm`, `--text-muted`
- Must use real person — name, company, headshot (no stock photos, no anonymous)

---

### 09 · Stats / Counter Block

- Number: `--font-display`, `--text-5xl`, `font-weight: 800`, `--accent-primary` or `--orange`
- Label: `--text-sm`, `--text-muted`, `--tracking-wide`, ALL CAPS
- Animation: CountUp eased over 1500ms, triggered by `IntersectionObserver`

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
  animation: shimmer 1.5s infinite;
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
- Animation: `max-height` transition `300ms ease`
- ARIA: `aria-expanded`, `aria-controls` — keyboard navigable
- Always include `FAQPage` JSON-LD schema when an accordion FAQ is present

---

### 15 · Scroll Progress Bar

- Thin 3px bar pinned below navbar on content-heavy pages (blog, docs)
- Background: `--gradient-accent`
- Width: driven by `useScrollProgress` hook
- Hidden on homepage and marketing landing pages

---

### 16 · Live Chat Widget Wrapper

- Wrapper for Intercom / Crisp — load lazily after page is interactive
- Custom launcher button: `--gradient-accent`, `--radius-full`
- Position: bottom-right, 24px from edge
- Label: "Chat with us" on desktop, icon-only on mobile

---

### 17 · Cookie Consent Banner

- Required for EU/UK visitors (GDPR)
- Position: bottom of viewport, slide-up on first visit
- Background: `--bg-elevated`, `--border-default`, `--shadow-lg`
- Two buttons: "Accept All" (primary variant), "Manage Preferences" (ghost variant)
- Store consent in `localStorage: 'dronahost-cookie-consent'`

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
  --ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1); /* sparingly */
}
```

**Rules:**

- Hero entrance: H1 (0ms) → subtitle (80ms) → CTAs (160ms) → trust bar (240ms) — staggered fade-up
- Cards: `translateY(-3px)` + glow on hover — `200ms --ease-standard`
- Buttons: `scale(1.02)` hover, `scale(0.97)` active — `150ms ease`
- Scroll reveals: `IntersectionObserver` — `opacity 0→1` + `translateY(24px→0)` — `--duration-enter --ease-enter`
- CountUp stats: 1500ms eased, fires on first viewport entry
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
| Specific numbers: "200ms TTFB from London" | Vague claims: "blazing fast" |
| Professional, calm confidence | Exclamation-heavy hype |
| Outcome-led: "Your site loads in under 1s" | Feature-led: "We have NVMe storage!" |
| "please" | "Kindly" |
| "dedicated support" | "one-to-one support" |
| Honest about team size and origin | Fake Western identity |

**By channel:**

- Marketing pages: confident, specific, calm
- Documentation / KB: precise, direct, no filler
- Error messages: helpful, non-blaming, actionable
- Blog posts: conversational, technically credible — light emoji OK

**Banned patterns:** "Don't fret!", "Do the needful", "blazing fast", "world-class", "cutting-edge", "state-of-the-art", "revolutionary", "Click here", ALL CAPS emphasis, excessive exclamation marks.

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
  description: "DronaHost offers premium WordPress hosting, cloud hosting, managed VPS, domain registration, and professional website design & SEO. Serving USA, UK, UAE and Europe.",
  authors: [{ name: "DronaHost Team", url: "https://dronahost.com/about" }],
  creator: "Alphabet Force",
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
    description: "Enterprise-grade hosting with premium support. WordPress, Cloud, VPS, Domains, Design & SEO.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DronaHost — Premium Web Hosting" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@dronahost",
    title: "DronaHost — Premium Web Hosting",
    description: "Enterprise-grade hosting. WordPress, Cloud, VPS & more.",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://dronahost.com" },
  verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },
};
```

### JSON-LD (inline `<script>` in Server Components — never `next/script`)

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
        telephone: "+1-206-201-2431",
        contactType: "customer service",
        email: "sales@dronahost.com",
        availableLanguage: ["English"],
        areaServed: ["US", "GB", "AE", "EU"],
      },
      sameAs: ["https://twitter.com/dronahost", "https://www.linkedin.com/company/dronahost"],
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
| Homepage | `Organization` + `WebSite` + `SearchAction` |
| Hosting plan | `Product` + `Offer` + `AggregateRating` |
| Blog post | `Article` + `BreadcrumbList` + `Person` (author) |
| FAQ section | `FAQPage` — always pair with Accordion |
| Contact | `LocalBusiness` |
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

- Genuine testimonials: name + company + country + star rating (no anonymous reviews)
- Case studies: real client, specific metrics, before/after
- Live uptime % widget (real API — never hardcoded)
- Team About page: names, photos, roles, LinkedIn, years of experience

### Expertise — demonstrate domain knowledge

- Blog and KB with original, in-depth articles by named authors
- Each article: author name, bio, date published, date updated, reading time
- Comparison pages (DronaHost vs WP Engine) — factual, no spin
- No AI-generated thin content — every page must be genuinely useful

### Authoritativeness — build external trust signals

- Footer: "Operated by Alphabet Force, India — Founded [year]"
- Partner / technology logos: WordPress, cPanel, Cloudflare, LiteSpeed
- Client count / countries served (real numbers only)
- Privacy Policy, Terms, Refund Policy linked in footer on every page

### Trustworthiness — technical + content trust

- HTTPS canonical enforced in metadata
- Consistent NAP (Name, Address, Phone) format across all pages
- "No price increase on renewal" — on all pricing pages — use this exact phrase
- Money-back guarantee badge (30 days) on all hosting pages
- Real phone (+1-206-201-2431) and email (sales@dronahost.com) — never hidden
- Cookie consent banner for EU/UK visitors
- SSL badge + DDoS protection mention on hosting pages

---

## 12. Search Intent Architecture

Every page is built for one primary user intent.

| Page | Intent | Key CTA |
|---|---|---|
| Homepage | Navigational + Commercial | → Service pages |
| /wordpress-hosting | Commercial Investigation | "Order Now" |
| /managed-vps | Commercial Investigation | "Get Started" / Live Chat |
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
│   └── [locale]/               ← i18n from day one (en-us, en-gb, en-ae, de-de …)
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
│   ├── models/                 ← Mongoose schemas
│   ├── services/               ← Third-party API wrappers
│   ├── seo/                    ← Metadata helpers
│   ├── i18n/                   ← Translation helpers
│   ├── pricing/                ← Currency conversion
│   ├── compliance/             ← GDPR, CCPA helpers
│   ├── mongodb.ts
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
- `prefers-reduced-motion` media query on all animation blocks
- Cards visually elevated above page background in both themes
- One orange CTA above the fold maximum

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
- `FAQPage` schema on all FAQ sections
- `Article` schema with author on all blog posts

---

## 15. DON'Ts — Never

### Design

- Hardcode any hex, rgb, or hsl color — CSS variables only
- Use Inter, Roboto, Arial, system-ui, DM Sans, or Geist as heading/body fonts — use Sora + Manrope
- Purple-to-pink gradients, rainbow, or neon glow aesthetics
- Pure `#FFFFFF` in light mode — use `--bg-primary: #FAFBFC`
- Pure `#000000` in dark mode — use `--bg-primary: #08090A`
- Clip art, stock photo grids, or generic SaaS illustration packs
- Looping / auto-playing animations — only on interaction or scroll entry
- Transitions > 600ms on any interactive element
- Orange CTA on more than one hero-level button per page
- Centered walls of text longer than 2 lines
- Any component that looks identical in both themes — means variables weren't used

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
- Missing `FAQPage` schema when an accordion FAQ is present
- Missing `Article` schema with author on blog posts

---

## 16. Quick Reference

| Token | Light | Dark |
|---|---|---|
| `--bg-primary` | `#FAFBFC` | `#08090A` |
| `--bg-secondary` | `#FFFFFF` | `#0F1012` |
| `--bg-elevated` | `#F2F4F8` | `#16181C` |
| `--accent-primary` | `#4F46E5` (indigo) | `#6D64F0` (brighter) |
| `--orange` | `#E04800` | `#FE5403` |
| `--teal` | `#0489A8` | `#05A2C6` |
| `--text-primary` | `#0D0F14` | `#F0F2F7` |
| `--text-secondary` | `#4A5268` | `#9BA3B8` |
| Display font | Sora | same |
| Body font | Manrope | same |
| Mono font | JetBrains Mono | same |
| Theme class | none (light default) | `.dark` on `<html>` |
| Theme storage | `localStorage: 'dronahost-theme'` | same |
| Framework | Next.js 16 App Router + TypeScript | same |
| Styling | Tailwind CSS + CSS custom properties | same |
| Phone | +1-206-201-2431 | same |
| Email | sales@dronahost.com | same |
