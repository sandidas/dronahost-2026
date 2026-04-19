# Tier 1 Component Quality Fixes — Design Spec

**Date:** 2026-04-19  
**Status:** Approved  
**Scope:** Tier 1 only — three home components with visible production issues

---

## 1. Problem Statement

Three home components have quality issues that are visible to users in production:

- `HomeHeroSection` — 3 raw `<img>` tags (no lazy load, no SEO noscript fallback), hero buttons are non-functional `<button>` elements with no `href`
- `ServiceSection` — hardcoded wrong icon src, generic alt text, missing dark mode on interactive elements
- `CaseStudy` — `next/image` instead of skeleton variant, off-brand tagline colour, slider arrows missing `aria-label`, dark mode hover gaps

Quality dimensions fixed per component: lazy-loaded images, dark mode, semantic HTML, A11y (WCAG 2.1 AA), performance.

---

## 2. Scope

**In scope:**
- `components/home/hero-section/HomeHeroSection.tsx`
- `components/home/ServiceSection/ServiceSection.tsx`
- `components/home/CaseStudy/CaseStudy.tsx`

**Out of scope:**
- Tier 2/3 components (TestimonialsSection, PricingSection1, PricingJourney, etc.)
- New LazyLoad variants — existing ones are sufficient
- JSON-LD / structured data additions
- Mobile hamburger menu (separate plan)

---

## 3. Image Component Convention

| Use case | Component |
|---|---|
| LCP / above-fold image | `LazyLoadImageCompWithSEO` + `priority={true}` — includes `<noscript>` fallback for crawlers |
| Below-fold images / cards | `LazyLoadImageCompSkeleton` — shimmer placeholder, dark mode skeleton, error state |
| Small icons (SVG, ≤50px) | `next/image` — already lazy by default, no skeleton needed |

Both `LazyLoadImageCompWithSEO` and `LazyLoadImageCompSkeleton` share the same prop interface:
```ts
{ src, alt, className?, width?, height?, priority?, sizes? }
```

---

## 4. Task 1 — HomeHeroSection

**File:** `components/home/hero-section/HomeHeroSection.tsx`

### Changes

**Hero image (line 154) — LCP, above-fold:**
Replace raw `<img>` with `LazyLoadImageCompWithSEO`:
```tsx
<LazyLoadImageCompWithSEO
  src={heroSection.heroImage.src}
  alt={heroSection.heroImage.alt}
  width={600}
  height={600}
  priority={true}
  className="hero-person"
/>
```

**Member avatars (lines 130–136) — small, below-fold:**
Replace raw `<img>` with `next/image`:
```tsx
<Image
  key={index}
  src={avatar}
  alt={`Team member ${index + 1}`}
  width={32}
  height={32}
  loading="lazy"
  className="member-avatar rounded-full"
/>
```

**Buttons (lines 117–123) — currently broken:**
Replace `<button>` with `<Link>` carrying the button className (nesting button inside Link is invalid HTML):
```tsx
<Link
  key={button.label}
  href={button.link}
  className={getButtonClassName(button.variant)}
>
  {button.label}
</Link>
```

**Member row accessibility:**
Add `aria-label` to the wrapper div:
```tsx
<div className="member-row" aria-label="Trusted by our customers">
```

### Imports to add
```ts
import Image from "next/image";
import Link from "next/link";
import LazyLoadImageCompWithSEO from "@/components/lazyLoadImage/LazyLoadImageCompWithSEO";
```

---

## 5. Task 2 — ServiceSection

**File:** `components/home/ServiceSection/ServiceSection.tsx`

### Changes

**Icon src — hardcoded wrong path (line 87):**
```tsx
// Before
src="/icon/clickIcon.svg"

// After
src={service.icon}
```

**Icon alt — generic (line 88):**
```tsx
// Before
alt="service icon"

// After
alt={`${service.title} service icon`}
```

**CTA link — missing dark mode (line 120):**
```tsx
className="border border-orange-400 text-orange-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-50 transition dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
```

**Description — missing dark mode (line 107):**
Add `dark:text-slate-400` to the `className` prop on the description `<HeadLineText>`:
```tsx
className="mb-4 text-gray-500 dark:text-slate-400"
```

No import changes needed — `next/image` is already imported and correct for icons.

---

## 6. Task 3 — CaseStudy

**File:** `components/home/CaseStudy/CaseStudy.tsx`

### Changes

**Case study image (line 98) — below-fold:**
Replace `next/image` with `LazyLoadImageCompSkeleton`:
```tsx
<LazyLoadImageCompSkeleton
  src={section.image.src}
  alt={section.image.alt}
  width={600}
  height={400}
  className="rounded-lg object-cover w-full h-auto"
/>
```

**Tagline colour (line 43) — off-brand:**
```tsx
// Before
className="text-xs tracking-widest text-blue-500 uppercase mb-4"

// After
className="text-xs tracking-widest text-indigo-500 uppercase mb-4"
```

**Slider arrows — missing aria-label and dark hover (lines 113, 118):**
```tsx
{/* Left arrow */}
<button
  aria-label="Previous case study"
  className="w-10 h-10 rounded-full border border-orange-400 text-orange-500 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-white/10 transition"
>
  ←
</button>

{/* Right arrow */}
<button
  aria-label="Next case study"
  className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition"
>
  →
</button>
```

**Stats values — missing explicit dark text (line 88):**
```tsx
<p className="text-2xl font-bold dark:text-white">{stat.value}</p>
```

### Imports to update
```ts
// Remove: import Image from "next/image";
// Add:
import LazyLoadImageCompSkeleton from "@/components/lazyLoadImage/LazyLoadImageCompSkeleton";
```

---

## 7. Success Criteria

- `/` renders with no console errors or hydration warnings
- Hero image loads with `<noscript>` fallback visible in page source
- Member avatars have explicit `width`/`height` and `loading="lazy"`
- Hero buttons navigate correctly when clicked
- Service cards show correct icon per service (from `service.icon`)
- Case study image shows shimmer skeleton on slow connections
- All three components pass dark mode visual check (no white-on-white or invisible elements)
- Slider arrows are reachable and labelled for screen readers
- No TypeScript errors (`tsc --noEmit` passes)

---

## 8. What Is Explicitly Out of Scope

- Floating card dark mode — handled via `.floating-card` CSS class in `globals.css`, not inline Tailwind; separate CSS task
- `HeadLineText` undefined `--font-mulish` var — Tier 3 polish, separate task
- Testimonials, Pricing sections — Tier 2, separate plan
- Mobile hamburger menu — separate Critical plan
