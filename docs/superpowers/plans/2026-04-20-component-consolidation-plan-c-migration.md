# Component Consolidation Plan C — Migration & Cleanup

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the remaining section components to `components/sections/`, update every page import to use new paths, move page-specific components to `app/(marketing)/route/_components/`, and delete all old component folders.

**Architecture:** Five sequential task groups. Group 1 creates the "simple move" sections (same API, updated internal imports). Group 2 updates all page imports. Group 3 migrates pages to use the new unified components (PageHero, TwoColumn, etc.). Group 4 moves page-specific components. Group 5 deletes old folders and updates CLAUDE.md. After Group 5, the `components/` tree has only `ui/` and `sections/`.

**Prerequisite:** Plans A and B must be fully committed before starting this plan.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS

---

## File Map

### Group 1 — Simple section moves (same API, updated internal imports)

| Old path | New path |
|---|---|
| `home/Testimonials/TestimonialsSection.tsx` | `sections/Testimonials.tsx` |
| `home/FAQ/FAQSection.tsx` | `sections/FAQSection.tsx` |
| `home/Teams/TeamsSection.tsx` | `sections/LogoWall.tsx` |
| `home/CaseStudy/CaseStudy.tsx` | `sections/CaseStudy.tsx` |
| `home/pricingjourney/pricingJourney.tsx` + `CustomTierSlider.tsx` | `sections/PricingJourney.tsx` (inlined) |
| `Web-Hosting/ChooseYourPlan/ChooseYourPlan.tsx` | `sections/PricingCards.tsx` |
| `trust/StatsBar.tsx` | `sections/StatsBar.tsx` |
| `trust/TrustBadges.tsx` | `sections/TrustBadges.tsx` |

### Group 2 — Page import updates (simple path swaps)

All pages under `app/(marketing)/` and `app/(dev)/v2/page.tsx`.

### Group 3 — Unified component migration (prop changes)

Pages that use old hero/CTA/FeatureGrid/TwoColumn/ProcessSteps variants — update to new component APIs.

### Group 4 — Page-specific components

Move 31 components to `app/(marketing)/[route]/_components/`.

### Group 5 — Delete old folders + update CLAUDE.md

---

### Task 1: Create `sections/Testimonials.tsx`

**Files:**
- Read: `components/home/Testimonials/TestimonialsSection.tsx` — get the full implementation
- Create: `components/sections/Testimonials.tsx`

Steps: copy the file content, then update internal imports.

- [ ] **Step 1: Read the source file**

Run: `cat components/home/Testimonials/TestimonialsSection.tsx`

- [ ] **Step 2: Create `components/sections/Testimonials.tsx`**

Copy the content. Replace these internal imports:

```tsx
// Change these three lines:
import GridCard from "@/components/Card/GridCard";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

// To:
import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
```

Inside the component body, replace every `<GridCard` with `<Card variant="grid"` and every `</GridCard>` with `</Card>`. Add the `total` and `columns` props to each Card (they're needed by the grid variant's border math — read the TestimonialsSection to find the `columns` value already used there).

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/Testimonials.tsx
git commit -m "feat: add sections/Testimonials.tsx (moved from home/Testimonials)"
```

---

### Task 2: Create `sections/FAQSection.tsx`

**Files:**
- Read: `components/home/FAQ/FAQSection.tsx`
- Create: `components/sections/FAQSection.tsx`

- [ ] **Step 1: Read the source file**

Run: `cat "components/home/FAQ/FAQSection.tsx"`

- [ ] **Step 2: Create `components/sections/FAQSection.tsx`**

Copy the content. Replace internal imports:

```tsx
// Change:
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

// To:
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
```

Keep `"use client"` at the top — FAQSection uses `useState` for accordion state.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/FAQSection.tsx
git commit -m "feat: add sections/FAQSection.tsx (moved from home/FAQ)"
```

---

### Task 3: Create `sections/LogoWall.tsx`

**Files:**
- Read: `components/home/Teams/TeamsSection.tsx`
- Create: `components/sections/LogoWall.tsx`

- [ ] **Step 1: Read the source file**

Run: `cat "components/home/Teams/TeamsSection.tsx"`

- [ ] **Step 2: Create `components/sections/LogoWall.tsx`**

Copy the content. Replace internal imports:

```tsx
// Change:
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

// To:
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
```

Change the component name from `TeamsSection` to `LogoWall` in both the function declaration and the export line.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/LogoWall.tsx
git commit -m "feat: add sections/LogoWall.tsx (moved from home/Teams/TeamsSection)"
```

---

### Task 4: Create `sections/CaseStudy.tsx`

**Files:**
- Read: `components/home/CaseStudy/CaseStudy.tsx`
- Create: `components/sections/CaseStudy.tsx`

- [ ] **Step 1: Read the source file**

Run: `cat "components/home/CaseStudy/CaseStudy.tsx"`

- [ ] **Step 2: Create `components/sections/CaseStudy.tsx`**

Copy the content. Replace internal imports:

```tsx
// Change:
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

// To (add only what the file actually uses):
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
```

Also replace any `import LazyLoadImageComp` or `import LazyLoadImageCompWithSEO` with `import Image from "@/components/ui/Image"` and replace the old component usage with `<Image ... />`.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/CaseStudy.tsx
git commit -m "feat: add sections/CaseStudy.tsx (moved from home/CaseStudy)"
```

---

### Task 5: Create `sections/PricingJourney.tsx`

**Files:**
- Read: `components/home/pricingjourney/pricingJourney.tsx`
- Read: `components/home/pricingjourney/CustomTierSlider.tsx`
- Create: `components/sections/PricingJourney.tsx`

`CustomTierSlider` is used only inside `pricingJourney.tsx`. Inline it: copy the slider component code directly into the file above the main component.

- [ ] **Step 1: Read both source files**

Run: `cat "components/home/pricingjourney/pricingJourney.tsx"` and `cat "components/home/pricingjourney/CustomTierSlider.tsx"`

- [ ] **Step 2: Create `components/sections/PricingJourney.tsx`**

Create the file with:
- CustomTierSlider code first (copy verbatim from `CustomTierSlider.tsx`, removing its export default)
- PricingJourney code below (copy verbatim from `pricingJourney.tsx`)
- Update the `import CustomTierSlider` line to remove the import (it's now inlined above)
- Replace internal imports: `HeadLineText` → `@/components/ui/HeadLineText`, `Section` → `@/components/ui/Section`

Keep `"use client"` if either file uses React state/effects.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/PricingJourney.tsx
git commit -m "feat: add sections/PricingJourney.tsx (pricingJourney + CustomTierSlider inlined)"
```

---

### Task 6: Create `sections/PricingCards.tsx`

**Files:**
- Read: `components/Web-Hosting/ChooseYourPlan/ChooseYourPlan.tsx`
- Create: `components/sections/PricingCards.tsx`

- [ ] **Step 1: Read the source file**

Run: `cat "components/Web-Hosting/ChooseYourPlan/ChooseYourPlan.tsx"`

- [ ] **Step 2: Create `components/sections/PricingCards.tsx`**

Copy the content. Replace internal imports:

```tsx
// Change:
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import Section from "@/components/section/section";

// To:
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
```

Change the component name from `ChooseYourPlan` to `PricingCards` in both the function declaration and the export default.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/PricingCards.tsx
git commit -m "feat: add sections/PricingCards.tsx (moved from Web-Hosting/ChooseYourPlan)"
```

---

### Task 7: Create `sections/StatsBar.tsx` and `sections/TrustBadges.tsx`

**Files:**
- Read: `components/trust/StatsBar.tsx`
- Read: `components/trust/TrustBadges.tsx`
- Create: `components/sections/StatsBar.tsx`
- Create: `components/sections/TrustBadges.tsx`

Both files have no props and no internal component imports — they're pure JSX. Straight copy.

- [ ] **Step 1: Create `components/sections/StatsBar.tsx`**

Copy the full content of `components/trust/StatsBar.tsx` without changes.

- [ ] **Step 2: Create `components/sections/TrustBadges.tsx`**

Copy the full content of `components/trust/TrustBadges.tsx` without changes.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/StatsBar.tsx components/sections/TrustBadges.tsx
git commit -m "feat: add sections/StatsBar.tsx and sections/TrustBadges.tsx (moved from trust/)"
```

---

### Task 8: Update `app/(marketing)/page.tsx` (home page)

**Files:**
- Modify: `app/(marketing)/page.tsx`

The home page imports many old components. Update all imports and usages.

- [ ] **Step 1: Read the current home page**

Run: `cat "app/(marketing)/page.tsx"`

- [ ] **Step 2: Update all imports**

Replace the entire imports block. The home page currently imports:

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
import StatsBar from "@/components/trust/StatsBar";
import JsonLd from "@/components/seo/JsonLd";
```

Change to:

```tsx
import CaseStudy from "@/components/sections/CaseStudy";
import CTASection from "@/components/sections/CTASection";
import FAQSection from "@/components/sections/FAQSection";
import HeroSection from "@/components/sections/HomeHero";
import PricingJourney from "@/components/sections/PricingJourney";
import LogoWall from "@/components/sections/LogoWall";
import TestimonialsSection from "@/components/sections/Testimonials";
import TrustBadges from "@/components/sections/TrustBadges";
import StatsBar from "@/components/sections/StatsBar";
import JsonLd from "@/components/sections/JsonLd";
```

Notes:
- `FeatureSection` (from home/FeatureSection) → this is a page-specific component. Move it to `app/(marketing)/_components/HomeFeatureSection.tsx` (Task 16 covers this). For now keep the old import.
- `PricingSection1–4` → read each file (Task 14 covers converting to TwoColumn). For now keep old imports.
- `ServicesSection` → this uses GridCard pattern. Read the file and convert to `<FeatureGrid>` in the JSX (Task 14).

Update JSX usages:
- `<TeamsSection data={...} />` → `<LogoWall data={...} />`
- All other components keep their `data={...}` prop shape unchanged.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. If you see errors about missing `data` prop shape, the old component had a different prop name — check the original source.

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat: update home page imports to use sections/ paths"
```

---

### Task 9: Update `app/(marketing)/wordpress-hosting/page.tsx`

**Files:**
- Read: `app/(marketing)/wordpress-hosting/page.tsx`
- Modify: `app/(marketing)/wordpress-hosting/page.tsx`

- [ ] **Step 1: Read the page**

Run: `cat "app/(marketing)/wordpress-hosting/page.tsx"`

- [ ] **Step 2: Update imports**

Replace old imports with new paths:

```tsx
// Change:
import ChooseYourPlan from "@/components/Web-Hosting/ChooseYourPlan/ChooseYourPlan";
import CTA from "@/components/Web-Hosting/CTA/cta";
import EnterpriseSection from "@/components/Web-Hosting/EnterpriseHosting/EnterpriseHosting";
import FeatureSection from "@/components/Web-Hosting/FeatureSection/FeatureSection";
import HeroSection from "@/components/Web-Hosting/HeroSection/HeroSection";
import HowItWorks from "@/components/Web-Hosting/HowItWorks/HowItWorks";
import Testimonials from "@/components/Web-Hosting/testimonials/testimonials";
import JsonLd from "@/components/seo/JsonLd";

// To:
import PricingCards from "@/components/sections/PricingCards";
import CTASection from "@/components/sections/CTASection";
import TwoColumn from "@/components/sections/TwoColumn";
import FeatureGrid from "@/components/sections/FeatureGrid";
import PageHero from "@/components/sections/PageHero";
import ProcessSteps from "@/components/sections/ProcessSteps";
import Testimonials from "@/components/sections/Testimonials";
import JsonLd from "@/components/sections/JsonLd";
```

Page-specific components (keep old imports for now — Task 16 moves them):
- `HeadlessSolutions`, `HostingPro`, `HostingProComparison`, `IntegratedPartner`, `PartnerProgram`, `Performance`, `ResourceInsights`, `ReviewFeedback`, `SupportingTeam`, `TechStack`

- [ ] **Step 3: Update JSX usages for unified components**

Read the data file (`data/hostingLandingPage.json`) to get the data structure. Then:

**HeroSection → PageHero:**
```tsx
// Before:
<HeroSection data={data} />

// After (map from data.heroSection):
<PageHero
  tagline={data.heroSection?.tagline}
  title={data.heroSection?.title}
  description={data.heroSection?.description}
  cta={data.heroSection?.cta?.map((btn: any) => ({ label: btn.label, href: btn.link, variant: btn.variant }))}
  image={data.heroSection?.image ? { src: data.heroSection.image.src, alt: data.heroSection.image.alt } : undefined}
  layout="split"
  background="gradient"
/>
```

**FeatureSection → FeatureGrid:**
```tsx
// Before:
<FeatureSection data={data} />

// After (read data.featureSection to find items array):
<FeatureGrid
  tagline={data.featureSection?.tagline}
  title={data.featureSection?.title}
  columns={3}
  divided={true}
  items={data.featureSection?.features?.map((f: any) => ({ title: f.title, description: f.description }))}
/>
```

**HowItWorks → ProcessSteps:**
```tsx
// Before:
<HowItWorks data={data} />

// After (read data.howItWorks):
<ProcessSteps
  tagline={data.howItWorks?.tagline}
  title={data.howItWorks?.title}
  layout="alternating"
  steps={data.howItWorks?.steps}
/>
```

**EnterpriseSection → TwoColumn:**
```tsx
// Before:
<EnterpriseSection data={data} />

// After (read data.enterpriseSection):
<TwoColumn
  tagline={data.enterpriseSection?.tagline}
  title={data.enterpriseSection?.title}
  description={data.enterpriseSection?.description}
  features={data.enterpriseSection?.features}
  cta={data.enterpriseSection?.cta?.map((btn: any) => ({ label: btn.label, href: btn.link, variant: btn.variant }))}
  image={{ src: data.enterpriseSection?.image?.src, alt: data.enterpriseSection?.image?.alt }}
  imagePosition="right"
/>
```

**CTA → CTASection:**
```tsx
// Before:
<CTA data={data} />

// After (read data.ctaSection):
<CTASection
  title={data.ctaSection?.title}
  description={data.ctaSection?.description}
  tagline={data.ctaSection?.tagline}
  cta={data.ctaSection?.buttons?.map((btn: any) => ({ label: btn.label, href: btn.link, variant: btn.variant }))}
  image={data.ctaSection?.image ? { src: data.ctaSection.image.src, alt: data.ctaSection.image.alt } : undefined}
/>
```

**ChooseYourPlan → PricingCards:**
```tsx
// Before:
<ChooseYourPlan data={data} />

// After (PricingCards has same API — same prop shape):
<PricingCards data={data} />
```

**Testimonials → Testimonials (same API):**
```tsx
// Before:
<Testimonials data={data} />

// After:
<Testimonials data={data} />
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. If the data JSON field names don't match (e.g., `cta` vs `buttons`), read the data JSON file and adjust the mapping.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/wordpress-hosting/page.tsx"
git commit -m "feat: update wordpress-hosting page to use unified section components"
```

---

### Task 10: Update `app/(marketing)/web-design/page.tsx`

**Files:**
- Read: `app/(marketing)/web-design/page.tsx`
- Modify: `app/(marketing)/web-design/page.tsx`

- [ ] **Step 1: Read the page**

Run: `cat "app/(marketing)/web-design/page.tsx"`

- [ ] **Step 2: Identify imports to update**

Look for these patterns and update:
- `from "@/components/Experience&Growth/HeroSection/HeroSection"` → use `PageHero from "@/components/sections/PageHero"`
- `from "@/components/Experience&Growth/CTA/cta"` → use `CTASection from "@/components/sections/CTASection"`
- `from "@/components/Experience&Growth/services/services"` → use `FeatureGrid from "@/components/sections/FeatureGrid"`
- `from "@/components/Experience&Growth/OurProcess/Ourprocess"` → use `ProcessSteps from "@/components/sections/ProcessSteps"`
- `from "@/components/HeadLineText/HeadLineText"` → `from "@/components/ui/HeadLineText"`
- `from "@/components/section/section"` → `from "@/components/ui/Section"`
- `from "@/components/seo/JsonLd"` → `from "@/components/sections/JsonLd"`
- `from "@/components/gradient/gradient"` → **Remove** — replace GradientBackground usage with plain div or CSS class on Section

Page-specific components that stay (just update their import path in Task 16):
- `Expertise`, `HappyClients`, `Integrations`, `OurPartners`, `OurWork`, `WebDesign`, `servicesDetails`

- [ ] **Step 3: Update JSX for each unified component**

Follow the same pattern as Task 9: read the data JSON file for web-design, map fields to the new component props.

For `GradientBackground` wrapper: remove it entirely. Replace `<GradientBackground ...><Section ...>...</Section></GradientBackground>` with just `<Section ...>...</Section>`. The gradient blobs are now built into `PageHero` directly.

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/web-design/page.tsx"
git commit -m "feat: update web-design page to use unified section components"
```

---

### Task 11: Update remaining marketing pages

**Files:**
- Modify all remaining pages under `app/(marketing)/`

For each page, run this pattern:
1. Read the page file
2. Identify any old-path imports
3. Replace with new paths

Simple find-and-replace patterns (apply to every remaining page file):

| Old import path | New import path |
|---|---|
| `@/components/section/section` | `@/components/ui/Section` |
| `@/components/HeadLineText/HeadLineText` | `@/components/ui/HeadLineText` |
| `@/components/seo/JsonLd` | `@/components/sections/JsonLd` |
| `@/components/trust/StatsBar` | `@/components/sections/StatsBar` |
| `@/components/trust/TrustBadges` | `@/components/sections/TrustBadges` |
| `@/components/lazyLoadImage/LazyLoadImageCompWithSEO` | `@/components/ui/Image` |
| `@/components/lazyLoadImage/LazyLoadImageComp` | `@/components/ui/Image` |
| `@/components/lazyLoadImage/LazyLoadImageCompSkeleton` | `@/components/ui/Image` |
| `@/components/Card/GridCard` | `@/components/ui/Card` (add `variant="grid"`) |
| `@/components/Card/ResourceCard` | `@/components/ui/Card` (add `variant="resource"`) |
| `@/components/Card/ResourceBox` | `@/components/ui/Card` (add `variant="box"`) |
| `@/components/home/FAQ/FAQSection` | `@/components/sections/FAQSection` |
| `@/components/home/Testimonials/TestimonialsSection` | `@/components/sections/Testimonials` |
| `@/components/home/Teams/TeamsSection` | `@/components/sections/LogoWall` |
| `@/components/home/CaseStudy/CaseStudy` | `@/components/sections/CaseStudy` |
| `@/components/home/pricingjourney/pricingJourney` | `@/components/sections/PricingJourney` |
| `@/components/Web-Hosting/ChooseYourPlan/ChooseYourPlan` | `@/components/sections/PricingCards` |
| `@/components/DomainHosting/ChooseAPlan/ChooseAPlan` | `@/components/sections/PricingCards` |

Pages to process (apply the simple path swaps above):

- `app/(marketing)/domains/page.tsx`
- `app/(marketing)/blog/page.tsx`
- `app/(marketing)/blog/[slug]/page.tsx`
- `app/(marketing)/blog/[slug]/not-found.tsx`
- `app/(marketing)/pricing/page.tsx`
- `app/(marketing)/vps-hosting/page.tsx`
- `app/(marketing)/cloud-hosting/page.tsx`
- `app/(marketing)/business-hosting/page.tsx`
- `app/(marketing)/seo-services/page.tsx`
- `app/(marketing)/growth-services/page.tsx`
- `app/(marketing)/hosting/[region]/page.tsx`
- `app/(marketing)/about/page.tsx`
- `app/(marketing)/contact/page.tsx`
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/terms/page.tsx`
- `app/(marketing)/data-processing/page.tsx`
- `app/(marketing)/refund-policy/page.tsx`
- `app/(marketing)/sla/page.tsx`
- `app/(marketing)/security/page.tsx`
- `app/(marketing)/vs/[competitor]/page.tsx`

For `GridCard`, `ResourceCard`, `ResourceBox` replacements: when you replace the import, also update the JSX. `<GridCard index={i} total={total} columns={cols} ...>` becomes `<Card variant="grid" index={i} total={total} columns={cols} ...>`. `<ResourceCard post={...} />` becomes `<Card variant="resource" post={...} />`. `<ResourceBox icon={...} title={...} />` becomes `<Card variant="box" icon={...} title={...} />`.

For `LazyLoadImageCompWithSEO` replacements: `<LazyLoadImageCompWithSEO src={...} alt={...} width={...} height={...} priority={...} />` becomes `<Image src={...} alt={...} width={...} height={...} priority={...} />` (same prop names — no change except import).

- [ ] **Step 1: Process each page file**

For each page listed above, read it and apply the find-and-replace patterns. If a page only uses Section/HeadLineText/JsonLd, it's a 3-line change.

- [ ] **Step 2: Verify TypeScript compiles after all pages**

Run: `npx tsc --noEmit`

Expected: No errors. If a file still references an old component, grep for it: `grep -r "from.*components/section/section" app/`

- [ ] **Step 3: Commit**

```bash
git add "app/(marketing)"
git commit -m "feat: update all marketing page imports to use ui/ and sections/ paths"
```

---

### Task 12: Update `app/(dev)/v2/page.tsx` final cleanup

**Files:**
- Modify: `app/(dev)/v2/page.tsx`

- [ ] **Step 1: Read the v2 page**

Run: `cat "app/(dev)/v2/page.tsx"`

- [ ] **Step 2: Update remaining old imports**

Apply the same find-and-replace patterns from Task 11. The v2 page may still import `Section from "@/components/section/section"` or `HeadLineText from "@/components/HeadLineText/HeadLineText"` — update those.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add "app/(dev)/v2/page.tsx"
git commit -m "feat: update /v2 page imports to ui/ and sections/ paths"
```

---

### Task 13: Update remaining component files that import old paths

Several components in `sections/` (Tasks 1–7) still have old internal imports inside other component files. Also, some section components import HeadLineText from the old path.

- [ ] **Step 1: Find remaining old imports inside components/**

Run:
```bash
grep -r "from.*components/HeadLineText/HeadLineText\|from.*components/section/section\|from.*components/Card/GridCard\|from.*components/Card/ResourceCard\|from.*components/seo/JsonLd" components/ -l
```

- [ ] **Step 2: Update each file found**

For each file, apply the same find-and-replace patterns from Task 11.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add components/
git commit -m "feat: update remaining component internal imports to ui/ paths"
```

---

### Task 14: Convert home page pricing sections to TwoColumn

**Files:**
- Read: `components/home/PricingSection1/PricingSection1.tsx` (and 2, 3, 4)
- Read: `data/home.json` — find the data shape for each pricing section
- Modify: `app/(marketing)/page.tsx`

The home page uses PricingSection1–4 independently. Each renders a 2-column layout with an image and feature list. All four are replaced with `<TwoColumn>`.

- [ ] **Step 1: Read the data shape**

Run: `cat "data/home.json" | head -200`

Find the JSON keys for each pricing section (e.g., `pricingSection1`, `pricingSection2`, etc.).

- [ ] **Step 2: Read one PricingSection source**

Run: `cat "components/home/PricingSection1/PricingSection1.tsx"`

Identify: what fields does it read from `data`? (title, description, features[], cta[], image, imagePosition?)

- [ ] **Step 3: Replace in home page JSX**

In `app/(marketing)/page.tsx`, replace each `<PricingSection1 data={homeData} />` etc. with:

```tsx
<TwoColumn
  title={homeData.pricingSection1.title}
  description={homeData.pricingSection1.description}
  features={homeData.pricingSection1.features}
  cta={homeData.pricingSection1.buttons?.map((b: any) => ({ label: b.label, href: b.link, variant: b.variant }))}
  image={{ src: homeData.pricingSection1.image.src, alt: homeData.pricingSection1.image.alt }}
  imagePosition={homeData.pricingSection1.imagePosition ?? "right"}
/>
```

Repeat for sections 2, 3, 4 — adjust the data key name and `imagePosition` for each.

Also update `ServicesSection` to `FeatureGrid`:

```tsx
import FeatureGrid from "@/components/sections/FeatureGrid";

// Replace <ServicesSection data={homeData} /> with:
<FeatureGrid
  tagline={homeData.servicesSection?.tagline}
  title={homeData.servicesSection?.title}
  columns={3}
  divided={true}
  items={homeData.servicesSection?.services?.map((s: any) => ({
    title: s.title,
    description: s.description,
    icon: s.icon,
    cta: s.cta ? { label: s.cta.label, href: s.cta.link } : undefined,
  }))}
/>
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. Fix any field name mismatches by checking the actual data JSON.

- [ ] **Step 5: Commit**

```bash
git add "app/(marketing)/page.tsx"
git commit -m "feat: replace PricingSection1-4 and ServicesSection with unified TwoColumn and FeatureGrid"
```

---

### Task 15: Convert remaining blog page to ResourceGrid

**Files:**
- Read: `app/(marketing)/blog/page.tsx`
- Modify: `app/(marketing)/blog/page.tsx`

- [ ] **Step 1: Read the blog page**

Run: `cat "app/(marketing)/blog/page.tsx"`

- [ ] **Step 2: Identify AllBlogs / FeatureInsight / developmentHub usage**

Find imports of `AllBlogs`, `FeatureInsight`, or `developmentHub` and replace with:

```tsx
import ResourceGrid from "@/components/sections/ResourceGrid";
```

Update JSX — pass `posts={...}` with the blog data array. Read the data to find the array key.

- [ ] **Step 3: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add "app/(marketing)/blog/page.tsx"
git commit -m "feat: update blog page to use ResourceGrid"
```

---

### Task 16: Move page-specific components to `_components/` folders

**Files:**
Move 31 components. Create the destination directories and move each file.

- [ ] **Step 1: Create destination directories**

Run:
```bash
mkdir -p "app/(marketing)/domains/_components"
mkdir -p "app/(marketing)/wordpress-hosting/_components"
mkdir -p "app/(marketing)/pricing/_components"
mkdir -p "app/(marketing)/web-design/_components"
mkdir -p "app/(marketing)/blog/_components"
mkdir -p "app/(marketing)/_components"
```

- [ ] **Step 2: Move domain components**

Run:
```bash
cp "components/DomainHosting/searchDomain/searchDomain.tsx" "app/(marketing)/domains/_components/DomainSearch.tsx"
cp "components/DomainHosting/DomainExtension/DomainExtension.tsx" "app/(marketing)/domains/_components/DomainExtension.tsx"
cp "components/DomainHosting/countryExtension/countryExtension.tsx" "app/(marketing)/domains/_components/CountryExtension.tsx"
cp "components/DomainHosting/BuildCustomCloud/BuildCustomCloud.tsx" "app/(marketing)/domains/_components/BuildCustomCloud.tsx"
cp "components/DomainHosting/Performance/PerformanceSection.tsx" "app/(marketing)/domains/_components/PerformanceSection.tsx"
```

For `DomainHosting/Grow&Manage/Grow&Manage.tsx` (special characters in filename):

```bash
cp "components/DomainHosting/Grow&Manage/Grow&Manage.tsx" "app/(marketing)/domains/_components/GrowManage.tsx"
```

- [ ] **Step 3: Move wordpress-hosting components**

Run:
```bash
cp "components/Web-Hosting/HostingPro/HostingPro.tsx" "app/(marketing)/wordpress-hosting/_components/HostingPro.tsx"
cp "components/Web-Hosting/HostingProComparison/HostingProComparison.tsx" "app/(marketing)/wordpress-hosting/_components/HostingProComparison.tsx"
cp "components/Web-Hosting/HeadlessSolutions/HeadlessSolutions.tsx" "app/(marketing)/wordpress-hosting/_components/HeadlessSolutions.tsx"
cp "components/Web-Hosting/IntegratedPartner/IntegratedPartner.tsx" "app/(marketing)/wordpress-hosting/_components/IntegratedPartner.tsx"
cp "components/Web-Hosting/PartnerProgram/PartnerProgram.tsx" "app/(marketing)/wordpress-hosting/_components/PartnerProgram.tsx"
cp "components/Web-Hosting/ResourceInsights/ResourceInsights.tsx" "app/(marketing)/wordpress-hosting/_components/ResourceInsights.tsx"
cp "components/Web-Hosting/TechStack/TechStack.tsx" "app/(marketing)/wordpress-hosting/_components/TechStack.tsx"
cp "components/Web-Hosting/performance/performance.tsx" "app/(marketing)/wordpress-hosting/_components/Performance.tsx"
cp "components/Web-Hosting/SupportingTeam/SupportingTeam.tsx" "app/(marketing)/wordpress-hosting/_components/SupportingTeam.tsx"
```

For `Web-Hosting/Review&Feedback/Review&Feedback.tsx`:

```bash
cp "components/Web-Hosting/Review&Feedback/Review&Feedback.tsx" "app/(marketing)/wordpress-hosting/_components/ReviewFeedback.tsx"
```

- [ ] **Step 4: Move pricing components**

Run:
```bash
cp "components/HostingPrice/webHostingPrice/pricing.tsx" "app/(marketing)/pricing/_components/WebHostingPrice.tsx"
cp "components/HostingPrice/globalReach/globalReach.tsx" "app/(marketing)/pricing/_components/GlobalReach.tsx"
cp "components/HostingPrice/IncludedEveryPlan/IncludedEveryPlan.tsx" "app/(marketing)/pricing/_components/IncludedEveryPlan.tsx"
cp "components/HostingPrice/WhyBetter/WhyBetter.tsx" "app/(marketing)/pricing/_components/WhyBetter.tsx"
```

- [ ] **Step 5: Move web-design components**

Run:
```bash
cp "components/Experience&Growth/Expertise/Expertise.tsx" "app/(marketing)/web-design/_components/Expertise.tsx"
cp "components/Experience&Growth/HappyClients/HappyClients.tsx" "app/(marketing)/web-design/_components/HappyClients.tsx"
cp "components/Experience&Growth/Integrations/Integrations.tsx" "app/(marketing)/web-design/_components/Integrations.tsx"
cp "components/Experience&Growth/OurPartners/OurPartners.tsx" "app/(marketing)/web-design/_components/OurPartners.tsx"
cp "components/Experience&Growth/OurWork/OurWork.tsx" "app/(marketing)/web-design/_components/OurWork.tsx"
cp "components/Experience&Growth/WebDesign/WebDesign.tsx" "app/(marketing)/web-design/_components/WebDesign.tsx"
cp "components/Experience&Growth/servicesDetails/servicesDetails.tsx" "app/(marketing)/web-design/_components/ServicesDetails.tsx"
```

- [ ] **Step 6: Move blog components**

Run:
```bash
cp "components/blog/AiAssistance/aiAssistance.tsx" "app/(marketing)/blog/_components/AiAssistance.tsx"
cp "components/blog/popularVideos/popularVideos.tsx" "app/(marketing)/blog/_components/PopularVideos.tsx"
cp "components/blog/support/support.tsx" "app/(marketing)/blog/_components/Support.tsx"
```

- [ ] **Step 7: Move home page-specific component**

Run:
```bash
cp "components/home/FeatureSection/FeatureSection.tsx" "app/(marketing)/_components/HomeFeatureSection.tsx"
```

- [ ] **Step 8: Update imports in pages that use moved components**

For each page that imported a moved page-specific component, update the import path:

- `app/(marketing)/wordpress-hosting/page.tsx`: change all `@/components/Web-Hosting/[Name]/[Name]` imports → `@/app/(marketing)/wordpress-hosting/_components/[Name]`
  - Or relative import: `./_components/HostingPro`
- `app/(marketing)/domains/page.tsx`: change `@/components/DomainHosting/...` → `./_components/...`
- `app/(marketing)/pricing/page.tsx`: change `@/components/HostingPrice/...` → `./_components/...`
- `app/(marketing)/web-design/page.tsx`: change `@/components/Experience&Growth/...` → `./_components/...`
- `app/(marketing)/blog/page.tsx`: change blog page-specific imports → `./_components/...`
- `app/(marketing)/page.tsx`: change `@/components/home/FeatureSection/...` → `./_components/HomeFeatureSection`

Also update each moved component's internal imports: `HeadLineText`, `Section`, etc.

- [ ] **Step 9: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 10: Commit**

```bash
git add "app/(marketing)"
git commit -m "feat: move page-specific components to app/(marketing) route _components/ folders"
```

---

### Task 17: Delete old component folders

**Important:** Only run this after `npx tsc --noEmit` shows zero errors. This step is irreversible.

- [ ] **Step 1: Verify zero TypeScript errors**

Run: `npx tsc --noEmit`

Expected output: `(no output)` — meaning zero errors. If there are any errors, do NOT proceed with deletions.

- [ ] **Step 2: Verify no remaining imports from old paths**

Run:
```bash
grep -r "from.*components/home/\|from.*components/Web-Hosting/\|from.*components/DomainHosting/\|from.*components/Experience&Growth/\|from.*components/HostingPrice/\|from.*components/blog/\|from.*components/trust/\|from.*components/seo/JsonLd\|from.*components/section/section\|from.*components/HeadLineText\|from.*components/Card/\|from.*components/lazyLoadImage/\|from.*components/gradient/" app/ --include="*.tsx" --include="*.ts"
```

Expected: no output. If any matches remain, fix them before proceeding.

- [ ] **Step 3: Delete old component folders**

Run:
```bash
rm -rf components/home
rm -rf components/Web-Hosting
rm -rf components/DomainHosting
rm -rf "components/Experience&Growth"
rm -rf components/HostingPrice
rm -rf components/blog
rm -rf components/trust
rm -rf components/seo
rm -rf components/section
rm -rf components/HeadLineText
rm -rf components/Card
rm -rf components/lazyLoadImage
rm -rf components/gradient
```

- [ ] **Step 4: Verify TypeScript still compiles after deletion**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: delete old component folders (all imports migrated to ui/ and sections/)"
```

---

### Task 18: Update CLAUDE.md

**Files:**
- Modify: `CLAUDE.md`

Add the new rules about component location.

- [ ] **Step 1: Find the "What NOT to do" section in CLAUDE.md**

Open `CLAUDE.md` and find the line:
```
- Do NOT build static or one-off components embedded in individual pages — all UI must be global components in `components/`
```

- [ ] **Step 2: Add new rules after that line**

Add these two lines immediately after:

```markdown
- Do NOT add reusable UI to page-level `_components/` folders — if a component is used on 2+ pages, it belongs in `components/sections/` or `components/ui/`
- Page-level `_components/` folders are ONLY for interactive widgets used on exactly one page (domain search, blog filter, comparison tables)
```

- [ ] **Step 3: Update the folder structure section**

Find the `components/` tree in CLAUDE.md and update it to the final structure:

```markdown
/components
  /ui                   # Primitives (Button, Section, HeadLineText, Image, Card, Badge)
  /sections             # Page sections (HomeHero, PageHero, TwoColumn, FeatureGrid, ProcessSteps, CTASection, ResourceGrid, Testimonials, FAQSection, LogoWall, CaseStudy, PricingCards, PricingJourney, StatsBar, TrustBadges, JsonLd)
```

Remove the old sub-folder lines (`/trust`, `/seo`, etc.).

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with final component structure and new rules"
```
