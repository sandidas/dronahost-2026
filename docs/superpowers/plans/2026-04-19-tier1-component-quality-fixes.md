# Tier 1 Component Quality Fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix images, dark mode, a11y, and semantic HTML in three home components that have visible production issues.

**Architecture:** Each task touches exactly one component file. No new files are created. All LazyLoad components already exist at `components/lazyLoadImage/`. Tasks are independent and safe to execute sequentially.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, next-themes (dark mode), `next/image`, `LazyLoadImageCompWithSEO`, `LazyLoadImageCompSkeleton`

---

## File Map

| File | Task | Action |
|---|---|---|
| `components/home/hero-section/HomeHeroSection.tsx` | 1 | Modify |
| `components/home/ServiceSection/ServiceSection.tsx` | 2 | Modify |
| `components/home/CaseStudy/CaseStudy.tsx` | 3 | Modify |

---

## Task 1: HomeHeroSection — images, buttons, a11y

**Files:**
- Modify: `components/home/hero-section/HomeHeroSection.tsx`

**Context:**
The component has 3 raw `<img>` tags (no lazy loading, no SEO fallback). The hero buttons render as `<button>` elements but have a `link` prop that is never used — they are non-functional. The member avatar row has no accessible label.

LazyLoad component props (same for both variants):
```ts
interface IProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}
```

- [ ] **Step 1: Update imports**

Replace the existing import block at the top of `components/home/hero-section/HomeHeroSection.tsx`:

```tsx
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import LazyLoadImageCompWithSEO from "@/components/lazyLoadImage/LazyLoadImageCompWithSEO";
import Section from "@/components/section/section";
import Image from "next/image";
import Link from "next/link";
import React from "react";
```

- [ ] **Step 2: Replace hero image**

Find this block (around line 154):
```tsx
{/* HERO IMAGE */}
<img
  src={heroSection.heroImage.src}
  alt={heroSection.heroImage.alt}
  className="hero-person"
/>
```

Replace with:
```tsx
{/* HERO IMAGE */}
<LazyLoadImageCompWithSEO
  src={heroSection.heroImage.src}
  alt={heroSection.heroImage.alt}
  width={600}
  height={600}
  priority={true}
  className="hero-person"
/>
```

- [ ] **Step 3: Replace member avatars**

Find this block (around line 128):
```tsx
<div className="members">
  {heroSection.members.avatars.map((avatar, index) => (
    <img
      key={index}
      src={avatar}
      alt={`Member ${index + 1}`}
      className="member-avatar"
    />
  ))}
</div>
```

Replace with:
```tsx
<div className="members">
  {heroSection.members.avatars.map((avatar, index) => (
    <Image
      key={index}
      src={avatar}
      alt={`Team member ${index + 1}`}
      width={32}
      height={32}
      loading="lazy"
      className="member-avatar rounded-full"
    />
  ))}
</div>
```

- [ ] **Step 4: Fix buttons — replace `<button>` with `<Link>`**

Find this block (around line 115):
```tsx
{/* BUTTONS */}
<div className="action-row">
  {heroSection.buttons.map((button) => (
    <button
      key={button.label}
      className={getButtonClassName(button.variant)}
    >
      {button.label}
    </button>
  ))}
</div>
```

Replace with:
```tsx
{/* BUTTONS */}
<div className="action-row">
  {heroSection.buttons.map((button) => (
    <Link
      key={button.label}
      href={button.link}
      className={getButtonClassName(button.variant)}
    >
      {button.label}
    </Link>
  ))}
</div>
```

- [ ] **Step 5: Add aria-label to member row**

Find this (around line 127):
```tsx
<div className="member-row">
```

Replace with:
```tsx
<div className="member-row" aria-label="Trusted by our customers">
```

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. If you see `Type 'string' is not assignable` on `loading="lazy"`, confirm `next/image` is imported from `"next/image"` (not a local file). The `loading` prop is valid on `next/image`.

- [ ] **Step 7: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- Hero image loads (with shimmer → then image)
- Page source contains `<noscript>` with the hero image (curl or View Source)
- Clicking both hero buttons navigates (no full-page errors)
- Member avatars are circular and render correctly
- No console errors

- [ ] **Step 8: Commit**

```bash
git add components/home/hero-section/HomeHeroSection.tsx
git commit -m "fix(hero): replace raw img tags, fix non-functional buttons, add a11y label"
```

---

## Task 2: ServiceSection — icon src, alt text, dark mode

**Files:**
- Modify: `components/home/ServiceSection/ServiceSection.tsx`

**Context:**
The service icon `src` is hardcoded to `/icon/clickIcon.svg` and ignores `service.icon` from data. Alt text is the generic string `"service icon"` across all cards. The CTA link and card description are missing dark mode classes.

- [ ] **Step 1: Fix icon src and alt text**

Find this block (around line 84):
```tsx
{/* Icon */}
<div className="mb-6">
  <Image
    src="/icon/clickIcon.svg"
    alt="service icon"
    width={50}
    height={50}
    className="object-contain"
  />
</div>
```

Replace with:
```tsx
{/* Icon */}
<div className="mb-6">
  <Image
    src={service.icon}
    alt={`${service.title} service icon`}
    width={50}
    height={50}
    className="object-contain"
  />
</div>
```

- [ ] **Step 2: Add dark mode to description**

Find this block (around line 106):
```tsx
<HeadLineText
  as="p"
  fontSize="sm"
  fontWeight="light"
  align="left"
  className="mb-4 text-gray-500"
>
  {service.description}
</HeadLineText>
```

Replace with:
```tsx
<HeadLineText
  as="p"
  fontSize="sm"
  fontWeight="light"
  align="left"
  className="mb-4 text-gray-500 dark:text-slate-400"
>
  {service.description}
</HeadLineText>
```

- [ ] **Step 3: Add dark mode to CTA link**

Find this (around line 118):
```tsx
<Link
  href={service.cta.link}
  className="border border-orange-400 text-orange-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-50 transition"
>
  {service.cta.label}
</Link>
```

Replace with:
```tsx
<Link
  href={service.cta.link}
  className="border border-orange-400 text-orange-500 px-6 py-2 rounded-md text-sm font-medium hover:bg-orange-50 transition dark:text-orange-400 dark:border-orange-400 dark:hover:bg-orange-500/10"
>
  {service.cta.label}
</Link>
```

- [ ] **Step 4: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. `service.icon` is type `string` — it matches the `src: string` prop on `next/image`.

- [ ] **Step 5: Visual check in dark mode**

```bash
npm run dev
```

Open `http://localhost:3000`. Toggle dark mode (moon icon in header). Confirm:
- Service card CTA links are visible (orange border and text, not invisible)
- Description text is legible (slate-400, not washed out)
- Each service card shows its own icon (not the same click icon on every card)

- [ ] **Step 6: Commit**

```bash
git add components/home/ServiceSection/ServiceSection.tsx
git commit -m "fix(services): use service.icon, fix alt text, add dark mode to CTA and description"
```

---

## Task 3: CaseStudy — skeleton image, tagline colour, aria-labels, dark mode

**Files:**
- Modify: `components/home/CaseStudy/CaseStudy.tsx`

**Context:**
The case study image uses `next/image` with a hardcoded `src` path that ignores `section.image.src`. The tagline uses `text-blue-500` instead of the brand indigo. Slider arrow buttons have no `aria-label`. The outline arrow `hover:bg-orange-50` is invisible in dark mode. Stats values have no explicit dark text colour.

- [ ] **Step 1: Update imports**

Replace the import block at the top of `components/home/CaseStudy/CaseStudy.tsx`:

```tsx
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import LazyLoadImageCompSkeleton from "@/components/lazyLoadImage/LazyLoadImageCompSkeleton";
import Section from "@/components/section/section";
import Link from "next/link";
```

Note: `Image` from `next/image` is removed — `LazyLoadImageCompSkeleton` handles rendering internally.

- [ ] **Step 2: Replace case study image**

Find this block (around line 96):
```tsx
{/* RIGHT IMAGE */}
<div className="relative">

  <Image
    src="/images/home/caseStudy.svg"
    alt={section.image?.alt}
    width={600}
    height={400}
    className="rounded-lg object-cover w-xl h-auto"
  />

</div>
```

Replace with:
```tsx
{/* RIGHT IMAGE */}
<div className="relative">

  <LazyLoadImageCompSkeleton
    src={section.image.src}
    alt={section.image.alt}
    width={600}
    height={400}
    className="rounded-lg object-cover w-full h-auto"
  />

</div>
```

Note: `w-xl` is not a valid Tailwind class — corrected to `w-full`.

- [ ] **Step 3: Fix tagline colour**

Find this (around line 43):
```tsx
<p className="text-xs tracking-widest text-blue-500 uppercase mb-4">
```

Replace with:
```tsx
<p className="text-xs tracking-widest text-indigo-500 uppercase mb-4">
```

- [ ] **Step 4: Fix slider arrows — aria-labels and dark hover**

Find this block (around line 110):
```tsx
{/* SLIDER CONTROLS */}
<div className="mt-12 flex justify-center gap-4">
  
  {/* Left Arrow */}
  <button className="w-10 h-10 rounded-full border border-orange-400 text-orange-500 flex items-center justify-center hover:bg-orange-50 transition">
    ←
  </button>

  {/* Right Arrow */}
  <button className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition">
    →
  </button>
</div>
```

Replace with:
```tsx
{/* SLIDER CONTROLS */}
<div className="mt-12 flex justify-center gap-4">

  {/* Left Arrow */}
  <button
    aria-label="Previous case study"
    className="w-10 h-10 rounded-full border border-orange-400 text-orange-500 flex items-center justify-center hover:bg-orange-50 dark:hover:bg-white/10 transition"
  >
    ←
  </button>

  {/* Right Arrow */}
  <button
    aria-label="Next case study"
    className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition"
  >
    →
  </button>
</div>
```

- [ ] **Step 5: Add dark text to stats values**

Find this block (around line 87):
```tsx
{section.stats.map((stat, index) => (
  <div key={index}>
    <p className="text-2xl font-bold">{stat.value}</p>
    <p className="text-sm text-gray-500">{stat.label}</p>
  </div>
))}
```

Replace with:
```tsx
{section.stats.map((stat, index) => (
  <div key={index}>
    <p className="text-2xl font-bold dark:text-white">{stat.value}</p>
    <p className="text-sm text-gray-500 dark:text-slate-400">{stat.label}</p>
  </div>
))}
```

- [ ] **Step 6: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. `section.image.src` and `section.image.alt` are both `string` on the existing `CaseStudyProps` type. `LazyLoadImageCompSkeleton` expects `src: string, alt: string` — both match.

If you see `Cannot find module '@/components/lazyLoadImage/LazyLoadImageCompSkeleton'`, confirm the file exists at `components/lazyLoadImage/LazyLoadImageCompSkeleton.tsx`.

- [ ] **Step 7: Visual check in dark mode**

```bash
npm run dev
```

Open `http://localhost:3000`. Scroll to the Case Study section. Then toggle dark mode. Confirm:
- Case study image shows shimmer skeleton while loading, then the image
- Tagline reads in indigo (not blue)
- Slider arrow buttons show `Previous case study` / `Next case study` on hover (browser tooltip from `aria-label`)
- Outline arrow hover is visible in dark (white tint, not orange wash)
- Stats values are white/light in dark mode

- [ ] **Step 8: Commit**

```bash
git add components/home/CaseStudy/CaseStudy.tsx
git commit -m "fix(case-study): skeleton image, brand tagline colour, aria-labels, dark mode"
```

---

## Final Verification

- [ ] Run build to confirm no broken imports or type errors:

```bash
npm run build
```

Expected: completes without errors. (Note: `npm run build` also runs `generate-llms-txt.ts` first — that is normal.)

- [ ] Confirm `/v2` showcase page still renders all three components without console errors:

Open `http://localhost:3000/v2` and scroll to HomeHeroSection, ServiceSection, CaseStudy sections.
