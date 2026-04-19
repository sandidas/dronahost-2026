# Trust Badges Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static `TrustBadges` Server Component and insert it between `HeroSection` and `FeatureSection` on the homepage to provide payment security and trust signals for Western B2B buyers.

**Architecture:** A single Server Component (`components/trust/TrustBadges.tsx`) with all badge data hardcoded — no props, no data file, no client code. The component renders a horizontal strip with six inline-SVG icon + text label badges. `app/(marketing)/page.tsx` is modified to import and render it in position.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, React Server Components (no `"use client"`).

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `components/trust/TrustBadges.tsx` | Create | Server Component — renders the full badge strip |
| `app/(marketing)/page.tsx` | Modify | Import `TrustBadges` and render between `HeroSection` and `FeatureSection` |

---

## Task 1: Create `TrustBadges` component

**Files:**
- Create: `components/trust/TrustBadges.tsx`

- [ ] **Step 1: Create the file with the full component**

Create `components/trust/TrustBadges.tsx` with this exact content:

```tsx
import React from "react";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const CloudIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M8 18h8a4 4 0 0 0 .7-7.93A5.5 5.5 0 0 0 6.2 8.2 3.8 3.8 0 0 0 8 18z" />
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const RefundIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

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

export default function TrustBadges() {
  return (
    <div
      className="border-y border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950"
      aria-label="Trust and payment signals"
    >
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          Trusted infrastructure &amp; secure payments
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-x-8">
          {badges.map((badge, index) => (
            <React.Fragment key={badge.label}>
              {index > 0 && (
                <span
                  className="hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block"
                  aria-hidden="true"
                />
              )}
              <span className="flex flex-col items-center gap-0.5 text-center sm:flex-row sm:gap-1.5 sm:text-left">
                <span className="text-slate-400 dark:text-slate-500">{badge.icon}</span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  {badge.label}
                </span>
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. `TrustBadges` has no props and no imports that could mismatch. If you see a JSX error on the `badges` array, confirm the file does NOT have `"use client"` at the top — it should not.

- [ ] **Step 3: Commit**

```bash
git add components/trust/TrustBadges.tsx
git commit -m "feat(trust): add TrustBadges Server Component"
```

---

## Task 2: Wire `TrustBadges` into the homepage

**Files:**
- Modify: `app/(marketing)/page.tsx`

Current state of `app/(marketing)/page.tsx` (relevant section):

```tsx
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
// ... other imports ...

export default function Home() {
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <HeroSection data={homeData} />
      <FeatureSection data={homeData} />
      {/* ... rest of sections ... */}
    </>
  );
}
```

- [ ] **Step 1: Add the import**

In `app/(marketing)/page.tsx`, add this import after the existing `HeroSection` import line:

```tsx
import TrustBadges from "@/components/trust/TrustBadges";
```

The import block top of the file should look like:

```tsx
import CaseStudy from "@/components/home/CaseStudy/CaseStudy";
import CTASection from "@/components/home/CTA/CTA";
import FAQSection from "@/components/home/FAQ/FAQSection";
import FeatureSection from "@/components/home/FeatureSection/FeatureSection";
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
import PricingJourney from "@/components/home/pricingjourney/pricingJourney";
import PricingSection1 from "@/components/home/PricingSection1/PricingSection1";
import PricingSection2 from "@/components/home/PricingSection2/PricingSection2";
import PricingSection3 from "@/components/home/PricingSection3/PricingSection3";
import PricingSection4 from "@/components/home/PricingSection4/PricingSection4";
import ServicesSection from "@/components/home/ServiceSection/ServiceSection";
import TeamsSection from "@/components/home/Teams/TeamsSection";
import TestimonialsSection from "@/components/home/Testimonials/TestimonialsSection";
import TrustBadges from "@/components/trust/TrustBadges";
import JsonLd from "@/components/seo/JsonLd";
import homeData from "@/data/home.json";
import { buildMetadata } from "@/lib/seo/metadata";
import { faqPageSchema, organizationSchema, websiteSchema } from "@/lib/seo/jsonld";
```

- [ ] **Step 2: Insert `<TrustBadges />` between `HeroSection` and `FeatureSection`**

In the JSX return, change:

```tsx
<HeroSection data={homeData} />
<FeatureSection data={homeData} />
```

to:

```tsx
<HeroSection data={homeData} />
<TrustBadges />
<FeatureSection data={homeData} />
```

The full updated `Home` function should look like:

```tsx
export default function Home() {
  return (
    <>
      <JsonLd schema={[organizationSchema(), websiteSchema()]} />
      <HeroSection data={homeData} />
      <TrustBadges />
      <FeatureSection data={homeData} />
      <ServicesSection data={homeData} />
      <CaseStudy data={homeData} />
      <CTASection data={homeData} />
      <PricingSection1 data={homeData} />
      <PricingSection2 data={homeData} />
      <PricingSection3 data={homeData} />
      <PricingSection4 data={homeData} />
      <PricingJourney data={homeData} />
      <TestimonialsSection data={homeData} />
      <JsonLd schema={faqPageSchema(homeData.faqSection.faqs.map((f) => ({ question: f.question, answer: f.answer })))} />
      <FAQSection data={homeData} />
      <TeamsSection data={homeData} />
    </>
  );
}
```

- [ ] **Step 3: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors. `TrustBadges` takes no props — the JSX `<TrustBadges />` needs no attributes.

- [ ] **Step 4: Visual verification**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm:
- A narrow horizontal strip appears immediately below the hero section
- Strip contains the label "TRUSTED INFRASTRUCTURE & SECURE PAYMENTS" in small caps
- Six badges are visible: Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot, 30-Day Guarantee
- Each badge shows a small SVG icon + bold label text
- Vertical separator lines appear between badges on sm+ screens
- No console errors

Toggle dark mode (moon icon in header). Confirm:
- Strip background switches to `slate-950`
- Badge text switches to `slate-300`
- Icons and separators visible (not washed out)

- [ ] **Step 5: Commit**

```bash
git add app/(marketing)/page.tsx
git commit -m "feat(home): render TrustBadges between hero and features"
```

---

## Final Verification

- [ ] Run a production build to confirm no broken imports or type errors:

```bash
npm run build
```

Expected: completes without errors. The `generate-llms-txt.ts` script runs first — that is normal.

- [ ] Update `docs/ui-fix-plan.md` — change the Trust Badges row from `❌` to `✅`:

Find:
```
| Trust Badges | ❌ | Not built. Required: Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot | 🔴 |
```

Replace with:
```
| Trust Badges | ✅ | Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot, 30-Day Guarantee | — |
```

```bash
git add docs/ui-fix-plan.md
git commit -m "docs: mark Trust Badges as complete in ui-fix-plan"
```
