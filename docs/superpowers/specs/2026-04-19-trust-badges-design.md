# Trust Badges Component — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Priority:** 🔴 Critical — blocks launch

---

## 1. Problem Statement

The homepage has no trust signals visible above the fold after the hero. Western B2B buyers (US/UK/EU/UAE) expect to see payment security logos, SSL proof, and review platform badges before they consider purchasing. The component does not exist.

---

## 2. Architecture

| File | Action |
|---|---|
| `components/trust/TrustBadges.tsx` | Create — Server Component, no props |
| `app/(marketing)/page.tsx` | Modify — import and render between HeroSection and FeatureSection |

No new directories beyond `components/trust/`. No data file needed — content is hardcoded and static.

---

## 3. Component Design

### File: `components/trust/TrustBadges.tsx`

- **Server Component** — no `"use client"`, no hooks
- **No props** — fully static, single rendering variant
- **Dark mode** — full support via Tailwind `dark:` classes

### Visual structure

```
┌─────────────────────────────────────────────────────────────┐
│  TRUSTED INFRASTRUCTURE & SECURE PAYMENTS                   │  ← xs label
│                                                             │
│  [Stripe icon] Stripe  │  [PayPal icon] PayPal  │  ...     │  ← badge row
└─────────────────────────────────────────────────────────────┘
```

### Outer container

```tsx
<div className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
  <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
    ...
  </div>
</div>
```

### Label

```tsx
<p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
  Trusted infrastructure &amp; secure payments
</p>
```

### Badge row

```tsx
<div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
  {badges.map(...)}
</div>
```

### Badge shape

Each badge is a plain `<span>` (no interactive behaviour — purely presentational):

```tsx
<span className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
  {badge.icon}   {/* inline SVG, aria-hidden */}
  {badge.label}
</span>
```

Between badges, a visual separator:
```tsx
<span className="hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block" aria-hidden="true" />
```

---

## 4. Badges — Complete List

### Stripe

```tsx
icon: (
  <svg viewBox="0 0 24 10" className="h-4 w-auto" aria-hidden="true" fill="currentColor">
    <text x="0" y="9" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Stripe</text>
  </svg>
)
label: "Secure Payments"
```

Instead of SVG text (which has font rendering issues), use a shield/lock icon + text label:

**Actual badge format** — icon from a standard SVG path + text:

```
[Lock SVG] Stripe   |   [Shield SVG] PayPal   |   [Lock SVG] SSL by Let's Encrypt   |   [Cloud SVG] Cloudflare   |   [Star SVG] Trustpilot   |   [Arrow SVG] 30-Day Guarantee
```

### Badge data array (hardcoded in component)

```tsx
const badges = [
  {
    label: "Stripe",
    sublabel: "Secure payments",
    icon: <LockIcon />,
  },
  {
    label: "PayPal",
    sublabel: "Accepted",
    icon: <ShieldIcon />,
  },
  {
    label: "Let's Encrypt",
    sublabel: "Free SSL",
    icon: <LockIcon />,
  },
  {
    label: "Cloudflare",
    sublabel: "CDN & DDoS protection",
    icon: <CloudIcon />,
  },
  {
    label: "Trustpilot",
    sublabel: "Verified reviews",
    icon: <StarIcon />,
  },
  {
    label: "30-Day Guarantee",
    sublabel: "Money-back, no questions",
    icon: <RefundIcon />,
  },
];
```

Each badge renders as:
```tsx
<span className="flex flex-col items-center gap-0.5 text-center sm:flex-row sm:text-left sm:gap-1.5">
  <span className="text-slate-400 dark:text-slate-500">{badge.icon}</span>
  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{badge.label}</span>
</span>
```

### Inline SVG icons (all `h-4 w-4`, `aria-hidden="true"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.8"`)

**Lock (Stripe, Let's Encrypt):**
```tsx
<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
  <rect x="5" y="11" width="14" height="10" rx="2" />
  <path d="M8 11V7a4 4 0 0 1 8 0v4" />
</svg>
```

**Shield (PayPal):**
```tsx
<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
</svg>
```

**Cloud (Cloudflare):**
```tsx
<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
  <path d="M8 18h8a4 4 0 0 0 .7-7.93A5.5 5.5 0 0 0 6.2 8.2 3.8 3.8 0 0 0 8 18z" />
</svg>
```

**Star (Trustpilot):**
```tsx
<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
</svg>
```

**Refund arrow (30-Day Guarantee):**
```tsx
<svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
  <path d="M3 3v5h5" />
</svg>
```

---

## 5. Page Integration

In `app/(marketing)/page.tsx`, add the import and render between HeroSection and FeatureSection:

```tsx
import TrustBadges from "@/components/trust/TrustBadges";

// In JSX:
<HeroSection data={homeData} />
<TrustBadges />
<FeatureSection data={homeData} />
```

---

## 6. Accessibility

- The entire strip is presentational — no interactive elements
- Outer `<div>` has `aria-label="Trust and payment signals"` for screen reader context
- All SVG icons have `aria-hidden="true"` — the text labels convey the meaning
- Separator spans have `aria-hidden="true"`

---

## 7. Out of Scope

- Actual brand SVG logo files (using icon + text label approach instead)
- Linking badges to external pages (purely decorative for this phase)
- Animated/hover effects
- Trustpilot live score widget (static badge only — live widget is a separate integration)
- Review score numbers (no verified data yet)
