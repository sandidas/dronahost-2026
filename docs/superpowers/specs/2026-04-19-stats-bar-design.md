# Stats Bar Component — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Priority:** 🔴 Critical — blocks launch

---

## 1. Problem Statement

Western B2B buyers need concrete performance and reliability proof before purchasing hosting. The homepage has no uptime SLA, TTFB benchmark, or support response time visible. The component does not exist.

---

## 2. Architecture

| File | Action |
|---|---|
| `components/trust/StatsBar.tsx` | Create — Server Component, no props |
| `app/(marketing)/page.tsx` | Modify — render `<StatsBar />` immediately after `<TrustBadges />` |

No new directories. Sits in `components/trust/` alongside `TrustBadges.tsx`. Content is hardcoded in a config object — designed so a future ISR fetch (Freshping/UptimeRobot) replaces only the data source, not the component structure.

---

## 3. Component Design

### File: `components/trust/StatsBar.tsx`

- **Server Component** — no `"use client"`, no hooks
- **No props** — fully static, single rendering variant
- **Dark in both modes** — `bg-slate-900 dark:bg-slate-950` (contrasts with the white TrustBadges strip above)

### Outer container

```tsx
<div
  className="bg-slate-900 dark:bg-slate-950"
  aria-label="Service performance statistics"
>
  <dl className="mx-auto grid max-w-5xl grid-cols-2 divide-x divide-y divide-slate-700 sm:grid-cols-4 sm:divide-y-0 px-4 sm:px-6 lg:px-8">
    {stats.map((stat) => (
      // stat cell
    ))}
  </dl>
</div>
```

### Stat cell

```tsx
<div className="flex flex-col items-center justify-center px-6 py-8 text-center">
  <dt className="text-xs font-semibold uppercase tracking-widest text-slate-400">
    {stat.label}
  </dt>
  <dd className="mt-1 text-3xl font-bold tracking-tight text-white sm:text-4xl">
    {stat.value}
  </dd>
  <p className="mt-1 text-xs text-slate-500">{stat.note}</p>
</div>
```

---

## 4. Stats — Hardcoded Config

```ts
const stats = [
  {
    value: "99.95%",
    label: "Uptime SLA",
    note: "with service credits",
  },
  {
    value: "< 200ms",
    label: "Avg. TTFB",
    note: "London · New York · Dubai",
  },
  {
    value: "18 min",
    label: "Avg. first reply",
    note: "24/7 across US/UK/UAE",
  },
  {
    value: "2019",
    label: "Founded",
    note: "5+ years serving businesses",
  },
];
```

Values are conservative and specific — no unsubstantiated superlatives per brand voice rules.

---

## 5. Page Integration

In `app/(marketing)/page.tsx`, add import and render immediately after `<TrustBadges />`:

```tsx
import StatsBar from "@/components/trust/StatsBar";

// In JSX:
<TrustBadges />
<StatsBar />
<FeatureSection data={homeData} />
```

---

## 6. Accessibility

- Outer `<div>` has `aria-label="Service performance statistics"`
- Stats use `<dl>` / `<dt>` / `<dd>` — correct semantic HTML for name-value pairs
- `<p>` for the note line (descriptive, not a term)
- No interactive elements

---

## 7. Responsive Layout

- Mobile: 2-column grid (`grid-cols-2`) with dividers on both axes
- `sm+` (640px+): 4-column grid (`sm:grid-cols-4`), horizontal dividers only (`sm:divide-y-0`)
- Padding: `px-6 py-8` per cell — generous touch targets on mobile

---

## 8. Out of Scope

- Live data fetch from Freshping / UptimeRobot (separate integration task)
- Animated count-up on scroll (JS, separate polish task)
- Region-specific stat variants
- Per-plan uptime tiers
