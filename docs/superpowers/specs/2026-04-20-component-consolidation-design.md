# Component Library Consolidation — Design Spec

**Date:** 2026-04-20
**Status:** Approved
**Priority:** 🟠 High — foundational architecture, unblocks all future page work

---

## 1. Problem Statement

The codebase has 80+ component files across 10+ feature folders (`home/`, `Web-Hosting/`, `DomainHosting/`, `Experience&Growth/`, `HostingPrice/`, `blog/`, `lazyLoadImage/`, `Card/`, `HeadLineText/`, `section/`, `seo/`, `trust/`). Identical UI patterns (hero, CTA, feature grid) are duplicated 4–6 times. Developers hunt across 8 page-specific folders for components. There is no single source of truth.

**Goal:** Reduce to ~22 components across exactly two folders — `components/ui/` (primitives) and `components/sections/` (page sections) — with zero duplication.

---

## 2. Final Target Structure

```
components/
├── ui/                  ← 6 atomic primitives
│   ├── Button.tsx       (exists — no change to implementation)
│   ├── Section.tsx      (moved from section/section.tsx)
│   ├── HeadLineText.tsx (moved from HeadLineText/HeadLineText.tsx)
│   ├── Image.tsx        (NEW — consolidates all 5 lazyLoadImage/ variants)
│   ├── Card.tsx         (NEW — consolidates GridCard + ResourceCard + ResourceBox)
│   └── Badge.tsx        (NEW — pill/tag used across pricing, features)
│
└── sections/            ← 16 page sections, flat, no sub-folders
    ├── HomeHero.tsx     (moved + renamed from home/hero-section/HomeHeroSection.tsx)
    ├── PageHero.tsx     (NEW — replaces 5 hero variants)
    ├── TwoColumn.tsx    (NEW — replaces PricingSection1–4, EnterpriseHosting)
    ├── FeatureGrid.tsx  (NEW — replaces ServiceSection, trustedPlatform, services, Articles)
    ├── ProcessSteps.tsx (NEW — replaces HowItWorks, OurProcess)
    ├── PricingCards.tsx (moved + renamed from ChooseYourPlan; ChooseAPlan merged in)
    ├── PricingJourney.tsx (moved + merged from home/pricingjourney/)
    ├── Testimonials.tsx (moved + renamed from home/Testimonials/TestimonialsSection.tsx; Web-Hosting/testimonials merged in)
    ├── CTASection.tsx   (NEW — replaces home/CTA, Web-Hosting/CTA, blog/CTA, Experience&Growth/CTA)
    ├── FAQSection.tsx   (moved from home/FAQ/FAQSection.tsx)
    ├── LogoWall.tsx     (moved + renamed from home/Teams/TeamsSection.tsx)
    ├── CaseStudy.tsx    (moved from home/CaseStudy/CaseStudy.tsx)
    ├── ResourceGrid.tsx (NEW — replaces blog/AllBlogs, FeatureInsight, developmentHub)
    ├── StatsBar.tsx     (moved from trust/StatsBar.tsx)
    ├── TrustBadges.tsx  (moved from trust/TrustBadges.tsx)
    └── JsonLd.tsx       (moved from seo/JsonLd.tsx)
```

**Total: 22 files** (6 ui + 16 sections), down from 80+.

---

## 3. Component Disposition Table

### 3a. Deleted (replaced by new unified components)

| Old path | Replaced by |
|---|---|
| `home/hero-section/HomeHeroSection.tsx` | `sections/HomeHero.tsx` |
| `Web-Hosting/HeroSection/HeroSection.tsx` | `sections/PageHero.tsx` |
| `Experience&Growth/HeroSection/HeroSection.tsx` | `sections/PageHero.tsx` |
| `blog/blogheroSection/HeroSection.tsx` | `sections/PageHero.tsx` |
| `HostingPrice/heroSection/heroSection.tsx` | `sections/PageHero.tsx` |
| `DomainHosting/HeroSection/HeroSection.tsx` | `sections/PageHero.tsx` |
| `home/CTA/CTA.tsx` | `sections/CTASection.tsx` |
| `Web-Hosting/CTA/cta.tsx` | `sections/CTASection.tsx` |
| `blog/CTA/cta.tsx` | `sections/CTASection.tsx` |
| `Experience&Growth/CTA/cta.tsx` | `sections/CTASection.tsx` |
| `home/PricingSection1/PricingSection1.tsx` | `sections/TwoColumn.tsx` |
| `home/PricingSection2/PricingSection2.tsx` | `sections/TwoColumn.tsx` |
| `home/PricingSection3/PricingSection3.tsx` | `sections/TwoColumn.tsx` |
| `home/PricingSection4/PricingSection4.tsx` | `sections/TwoColumn.tsx` |
| `Web-Hosting/EnterpriseHosting/EnterpriseHosting.tsx` | `sections/TwoColumn.tsx` |
| `home/ServiceSection/ServiceSection.tsx` | `sections/FeatureGrid.tsx` |
| `Web-Hosting/FeatureSection/FeatureSection.tsx` | `sections/FeatureGrid.tsx` |
| `blog/trustedPlatform/trustedPlatform.tsx` | `sections/FeatureGrid.tsx` |
| `Experience&Growth/services/services.tsx` | `sections/FeatureGrid.tsx` |
| `blog/Articles/articles.tsx` | `sections/FeatureGrid.tsx` |
| `Web-Hosting/HowItWorks/HowItWorks.tsx` | `sections/ProcessSteps.tsx` |
| `Experience&Growth/OurProcess/Ourprocess.tsx` | `sections/ProcessSteps.tsx` |
| `Web-Hosting/testimonials/testimonials.tsx` | `sections/Testimonials.tsx` |
| `home/Testimonials/TestimonialsSection.tsx` | `sections/Testimonials.tsx` |
| `DomainHosting/ChooseAPlan/ChooseAPlan.tsx` | `sections/PricingCards.tsx` |
| `Web-Hosting/ChooseYourPlan/ChooseYourPlan.tsx` | `sections/PricingCards.tsx` |
| `home/pricingjourney/pricingJourney.tsx` | `sections/PricingJourney.tsx` |
| `home/pricingjourney/CustomTierSlider.tsx` | `sections/PricingJourney.tsx` (inlined) |
| `home/FAQ/FAQSection.tsx` | `sections/FAQSection.tsx` |
| `home/Teams/TeamsSection.tsx` | `sections/LogoWall.tsx` |
| `home/CaseStudy/CaseStudy.tsx` | `sections/CaseStudy.tsx` |
| `blog/AllBlogs/AllBlogs.tsx` | `sections/ResourceGrid.tsx` |
| `blog/FeatureInsight/FeatureInsight.tsx` | `sections/ResourceGrid.tsx` |
| `blog/developmentHub/developmentHub.tsx` | `sections/ResourceGrid.tsx` |
| `trust/StatsBar.tsx` | `sections/StatsBar.tsx` |
| `trust/TrustBadges.tsx` | `sections/TrustBadges.tsx` |
| `seo/JsonLd.tsx` | `sections/JsonLd.tsx` |
| `section/section.tsx` | `ui/Section.tsx` |
| `HeadLineText/HeadLineText.tsx` | `ui/HeadLineText.tsx` |
| `Card/GridCard.tsx` | `ui/Card.tsx` |
| `Card/ResourceCard.tsx` | `ui/Card.tsx` |
| `Card/ResourceBox.tsx` | `ui/Card.tsx` |
| `lazyLoadImage/LazyLoadImageComp.tsx` | `ui/Image.tsx` |
| `lazyLoadImage/LazyLoadImageCompWithSEO.tsx` | `ui/Image.tsx` |
| `lazyLoadImage/LazyLoadImageCompSkeleton.tsx` | `ui/Image.tsx` |
| `lazyLoadImage/LazyLoadGalleryImage.tsx` | **Deleted** (stub, broken) |
| `lazyLoadImage/LazyLoadGalleryCompWithSEO.tsx` | **Deleted** (stub, broken) |
| `gradient/gradient.tsx` | Absorbed into `ui/Section.tsx` variant props |

### 3b. Moved to app route _components/ (page-specific, non-reusable)

These components render on exactly one page, contain page-specific business logic or interactive state, and cannot be generalized without becoming over-engineered.

| Old path | New path |
|---|---|
| `DomainHosting/searchDomain/searchDomain.tsx` | `app/(marketing)/domains/_components/DomainSearch.tsx` |
| `DomainHosting/DomainExtension/DomainExtension.tsx` | `app/(marketing)/domains/_components/DomainExtension.tsx` |
| `DomainHosting/countryExtension/countryExtension.tsx` | `app/(marketing)/domains/_components/CountryExtension.tsx` |
| `DomainHosting/BuildCustomCloud/BuildCustomCloud.tsx` | `app/(marketing)/domains/_components/BuildCustomCloud.tsx` |
| `DomainHosting/Grow&Manage/Grow&Manage.tsx` | `app/(marketing)/domains/_components/GrowManage.tsx` |
| `DomainHosting/Performance/PerformanceSection.tsx` | `app/(marketing)/domains/_components/PerformanceSection.tsx` |
| `Web-Hosting/HostingPro/HostingPro.tsx` | `app/(marketing)/wordpress-hosting/_components/HostingPro.tsx` |
| `Web-Hosting/HostingProComparison/HostingProComparison.tsx` | `app/(marketing)/wordpress-hosting/_components/HostingProComparison.tsx` |
| `Web-Hosting/HeadlessSolutions/HeadlessSolutions.tsx` | `app/(marketing)/wordpress-hosting/_components/HeadlessSolutions.tsx` |
| `Web-Hosting/IntegratedPartner/IntegratedPartner.tsx` | `app/(marketing)/wordpress-hosting/_components/IntegratedPartner.tsx` |
| `Web-Hosting/PartnerProgram/PartnerProgram.tsx` | `app/(marketing)/wordpress-hosting/_components/PartnerProgram.tsx` |
| `Web-Hosting/ResourceInsights/ResourceInsights.tsx` | `app/(marketing)/wordpress-hosting/_components/ResourceInsights.tsx` |
| `Web-Hosting/Review&Feedback/Review&Feedback.tsx` | `app/(marketing)/wordpress-hosting/_components/ReviewFeedback.tsx` |
| `Web-Hosting/SupportingTeam/SupportingTeam.tsx` | `app/(marketing)/wordpress-hosting/_components/SupportingTeam.tsx` |
| `Web-Hosting/TechStack/TechStack.tsx` | `app/(marketing)/wordpress-hosting/_components/TechStack.tsx` |
| `Web-Hosting/performance/performance.tsx` | `app/(marketing)/wordpress-hosting/_components/Performance.tsx` |
| `HostingPrice/webHostingPrice/pricing.tsx` | `app/(marketing)/pricing/_components/WebHostingPrice.tsx` |
| `HostingPrice/globalReach/globalReach.tsx` | `app/(marketing)/pricing/_components/GlobalReach.tsx` |
| `HostingPrice/IncludedEveryPlan/IncludedEveryPlan.tsx` | `app/(marketing)/pricing/_components/IncludedEveryPlan.tsx` |
| `HostingPrice/WhyBetter/WhyBetter.tsx` | `app/(marketing)/pricing/_components/WhyBetter.tsx` |
| `Experience&Growth/Expertise/Expertise.tsx` | `app/(marketing)/web-design/_components/Expertise.tsx` |
| `Experience&Growth/HappyClients/HappyClients.tsx` | `app/(marketing)/web-design/_components/HappyClients.tsx` |
| `Experience&Growth/Integrations/Integrations.tsx` | `app/(marketing)/web-design/_components/Integrations.tsx` |
| `Experience&Growth/OurPartners/OurPartners.tsx` | `app/(marketing)/web-design/_components/OurPartners.tsx` |
| `Experience&Growth/OurWork/OurWork.tsx` | `app/(marketing)/web-design/_components/OurWork.tsx` |
| `Experience&Growth/WebDesign/WebDesign.tsx` | `app/(marketing)/web-design/_components/WebDesign.tsx` |
| `Experience&Growth/servicesDetails/servicesDetails.tsx` | `app/(marketing)/web-design/_components/ServicesDetails.tsx` |
| `blog/AiAssistance/aiAssistance.tsx` | `app/(marketing)/blog/_components/AiAssistance.tsx` |
| `blog/popularVideos/popularVideos.tsx` | `app/(marketing)/blog/_components/PopularVideos.tsx` |
| `blog/support/support.tsx` | `app/(marketing)/blog/_components/Support.tsx` |
| `home/FeatureSection/FeatureSection.tsx` | `app/(marketing)/_components/HomeFeatureSection.tsx` |

---

## 4. New Component APIs

### 4a. `ui/Image.tsx`

Consolidates `LazyLoadImageComp`, `LazyLoadImageCompWithSEO`, `LazyLoadImageCompSkeleton`.

```ts
type ImageProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;          // true = LCP image, disables lazy loading
  skeleton?: boolean;          // true = shimmer placeholder while loading
  fill?: boolean;              // true = next/image fill mode
  sizes?: string;
  className?: string;
};
```

- No `"use client"` — skeleton uses CSS animation only, no JS state
- Renders `next/image` with structured `noscript` fallback for SEO crawlers
- `priority={true}` → `loading="eager"`, no lazy; `priority={false}` (default) → `loading="lazy"`
- Replaces all 3 functional lazyLoadImage variants; the 2 stub/gallery variants are deleted

### 4b. `ui/Card.tsx`

Consolidates `GridCard`, `ResourceCard`, `ResourceBox`.

```ts
type CardProps = {
  variant?: "grid" | "resource" | "box";   // default: "resource"
  // grid variant (GridCard)
  index?: number;
  total?: number;
  columns?: number;
  // resource variant (ResourceCard)
  post?: { category?: string; title: string; image?: string; description?: string; href: string };
  showCategory?: boolean;
  showDescription?: boolean;
  // box variant (ResourceBox)
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  tech?: string[];
  // shared
  className?: string;
  children?: React.ReactNode;
};
```

- No `"use client"`
- Each variant renders what the original component rendered — no behavior changes

### 4c. `ui/Badge.tsx`

New primitive — small labelled pill used for taglines, plan badges, status tags.

```ts
type BadgeProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success" | "neutral";  // default: "primary"
  className?: string;
};
```

- No `"use client"`, pure JSX

### 4d. `sections/PageHero.tsx`

Replaces 5 hero variants. All non-home pages use this.

```ts
type PageHeroProps = {
  tagline?: string;
  title: string;
  description?: string;
  cta?: Array<{ label: string; href: string; variant?: "primary" | "secondary" }>;
  image?: { src: string; alt: string; width: number; height: number };
  layout?: "centered" | "split";   // default: "centered"
  background?: "gradient" | "plain"; // default: "gradient"
  children?: React.ReactNode;        // interactive slot: filters, search bars
};
```

- No `"use client"` — interactive `children` add their own
- `priority={true}` always set on image (it's always the LCP element)
- `layout="split"` → text left column, image right column (lg:grid-cols-2)
- `layout="centered"` → title and description centered, optional children below
- `background="gradient"` → uses gradient CSS vars matching existing design
- `background="plain"` → white/slate bg for domain-style heroes

### 4e. `sections/TwoColumn.tsx`

Replaces 4 pricing section variants + EnterpriseHosting. A flexible 2-column content section.

```ts
type TwoColumnProps = {
  tagline?: string;
  title: string;
  description?: string;
  features?: string[];
  cta?: Array<{ label: string; href: string; variant?: "primary" | "secondary" }>;
  image: { src: string; alt: string; width: number; height: number };
  imagePosition?: "left" | "right";   // default: "right"
  children?: React.ReactNode;          // for custom content between description and CTA
};
```

- No `"use client"`
- Feature list renders as checkmark `<ul>` when `features` is provided
- `imagePosition` swaps grid column order via `lg:order-first` / `lg:order-last`

### 4f. `sections/FeatureGrid.tsx`

Replaces ServiceSection, FeatureSection, trustedPlatform, services, Articles.

```ts
type FeatureGridItem = {
  icon?: React.ReactNode;
  title: string;
  description: string;
  cta?: { label: string; href: string };
  tech?: string[];   // for ResourceBox-style tech badge lists
};

type FeatureGridProps = {
  tagline?: string;
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;   // default: 3; responsive: 1 col mobile → N col desktop
  items: FeatureGridItem[];
  divided?: boolean;       // true = GridCard separator borders between items
};
```

- No `"use client"`
- `divided={true}` uses the GridCard border separator pattern

### 4g. `sections/ProcessSteps.tsx`

Replaces HowItWorks + OurProcess.

```ts
type ProcessStep = {
  step: number;
  title: string;
  description: string;
  image?: { src: string; alt: string; width: number; height: number };
};

type ProcessStepsProps = {
  tagline?: string;
  title?: string;
  steps: ProcessStep[];
  layout?: "alternating" | "numbered";  // default: "alternating"
};
```

- No `"use client"`
- `layout="alternating"` → image-text alternating rows (HowItWorks style)
- `layout="numbered"` → vertical numbered list (OurProcess style)

### 4h. `sections/CTASection.tsx`

Replaces 4 CTA variants.

```ts
type CTASectionProps = {
  title: string;
  description?: string;
  cta: Array<{ label: string; href?: string; variant?: "primary" | "secondary" }>;
  image?: { src: string; alt: string };
  variant?: "default" | "gradient";   // default: "default"
  children?: React.ReactNode;          // email form, newsletter input
};
```

- No `"use client"` — form children add their own
- `variant="gradient"` uses gradient background
- `variant="default"` uses Section with dark or light bg

### 4i. `sections/ResourceGrid.tsx`

Replaces blog/AllBlogs, FeatureInsight, developmentHub.

```ts
type ResourceGridProps = {
  tagline?: string;
  title?: string;
  posts: Array<{
    category?: string;
    title: string;
    description?: string;
    image?: { src: string; alt: string };
    href: string;
    publishedAt?: string;
  }>;
  columns?: 2 | 3;         // default: 3
  showFilters?: boolean;    // renders category filter tabs (requires "use client" in consumer)
  featured?: boolean;       // first post renders large
};
```

- No `"use client"` on the component itself
- Filter state is lifted to the consumer page (which adds `"use client"`)

---

## 5. Performance Constraints

| Rule | Rationale |
|---|---|
| No `"use client"` on any new `sections/` component | Server Components for all section-level rendering; interactivity via children or consumer |
| `ui/Image.tsx` always uses `next/image` | Core Web Vitals — avoids layout shift |
| `priority={true}` on all hero images | LCP optimization — hero image is always above fold |
| `loading="lazy"` on all below-fold images | Reduces initial payload |
| Gradient backgrounds via CSS vars + Tailwind | No runtime JS for decoration |
| `"use client"` stays only on: FAQSection (accordion state), PricingJourney (slider), ResourceGrid consumer when filters needed | Minimal client boundary surface |

---

## 6. Import Path Changes

All pages update from deep paths to:

```ts
// Before
import HeroSection from "@/components/Web-Hosting/HeroSection/HeroSection";
import Section from "@/components/section/section";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import JsonLd from "@/components/seo/JsonLd";

// After
import PageHero from "@/components/sections/PageHero";
import Section from "@/components/ui/Section";
import HeadLineText from "@/components/ui/HeadLineText";
import JsonLd from "@/components/sections/JsonLd";
```

---

## 7. CLAUDE.md Rule Update

Add to the "What NOT to do" section:

> - Do NOT add reusable UI to page-level `_components/` folders — if a component is used on 2+ pages, it belongs in `components/sections/` or `components/ui/`
> - Page-level `_components/` folders are ONLY for interactive widgets used on exactly one page (domain search, blog filter, comparison tables)

---

## 8. Out of Scope

- Home-page pricing sections that feed dynamic data (PricingSection1–4 data shape normalization) — data normalization is a separate task
- i18n / locale-prefixed routes
- Animated transitions between sections
- Dark mode variants beyond what Tailwind `dark:` classes already provide
- `gradient/gradient.tsx` internals — absorbed silently into Section variant props, no public API change
