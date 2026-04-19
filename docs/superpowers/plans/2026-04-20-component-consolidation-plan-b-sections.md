# Component Consolidation Plan B — New Unified Sections

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create eight new unified section components in `components/sections/` that replace 25+ scattered duplicates. No pages are modified in this plan — that is Plan C. Old files stay in place until all imports are swapped.

**Architecture:** Eight independent tasks. Each creates one file and proves it compiles. Components import only from `@/components/ui/` (Plan A must be complete before this plan). No `"use client"` on any section component — decorative effects use pure CSS/Tailwind. Interactive children (forms, sliders) add their own `"use client"` in the consumer page.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, `cn()` from `utils/cn.tsx`, `next/image`, `next/link`

**Prerequisite:** Plan A must be fully committed before starting this plan. Imports use `@/components/ui/Section`, `@/components/ui/HeadLineText`, `@/components/ui/Image`, `@/components/ui/Card`, `@/components/ui/Badge`.

---

## File Map

| File | Action |
|---|---|
| `components/sections/JsonLd.tsx` | Create — move from `seo/JsonLd.tsx` (old file stays until Plan C) |
| `components/sections/HomeHero.tsx` | Create — move from `home/hero-section/HomeHeroSection.tsx` (old file stays until Plan C) |
| `components/sections/PageHero.tsx` | Create — new, replaces 5 hero variants |
| `components/sections/TwoColumn.tsx` | Create — new, replaces 4 PricingSection variants + EnterpriseHosting |
| `components/sections/FeatureGrid.tsx` | Create — new, replaces ServiceSection + 4 others |
| `components/sections/ProcessSteps.tsx` | Create — new, replaces HowItWorks + OurProcess |
| `components/sections/CTASection.tsx` | Create — new, replaces 4 CTA variants |
| `components/sections/ResourceGrid.tsx` | Create — new, replaces blog/AllBlogs + FeatureInsight + developmentHub |

---

### Task 1: Create `components/sections/JsonLd.tsx`

**Files:**
- Create: `components/sections/JsonLd.tsx`

Direct copy of `seo/JsonLd.tsx`. The old file stays until Plan C.

- [ ] **Step 1: Create the file**

Create `components/sections/JsonLd.tsx`:

```tsx
type JsonLdProps = {
  schema: Record<string, unknown> | Record<string, unknown>[];
};

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/<\//g, "<\\/") }}
    />
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/JsonLd.tsx
git commit -m "feat: add sections/JsonLd.tsx (copy of seo/JsonLd.tsx)"
```

---

### Task 2: Create `components/sections/HomeHero.tsx`

**Files:**
- Create: `components/sections/HomeHero.tsx`

Move of the already-refactored `home/hero-section/HomeHeroSection.tsx`. Updates imports to use `@/components/ui/` paths.

- [ ] **Step 1: Create the file**

Create `components/sections/HomeHero.tsx`:

```tsx
import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import NextImage from "next/image";
import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary" | string;

type ButtonItem = {
  label: string;
  variant: ButtonVariant;
  link: string;
};

type CardPosition = "top-left" | "middle-left" | "bottom-left";

type FloatingCard = {
  title: string;
  description: string;
  position: string;
};

type HomeHeroProps = {
  data: {
    heroSection: {
      title1: string;
      title2: string;
      description: string;
      background?: { src: string; alt: string };
      buttons: ButtonItem[];
      members: { countText: string; avatars: string[] };
      heroImage: { src: string; alt: string };
      floatingCards: FloatingCard[];
      decorations?: {
        backgroundBlur?: boolean;
        gradientOverlay?: boolean;
        curvedLines?: boolean;
      };
    };
  };
};

const cardClassByPosition: Record<CardPosition, string> = {
  "top-left": "card-top-left",
  "middle-left": "card-mid-left",
  "bottom-left": "card-bottom-left",
};

const getCardClassByPosition = (position: string) =>
  cardClassByPosition[position as CardPosition] ?? cardClassByPosition["middle-left"];

const getButtonClassName = (variant: ButtonVariant) =>
  variant === "primary" ? "primary-btn" : "secondary-btn";

const HomeHero: React.FC<HomeHeroProps> = ({ data }) => {
  const { heroSection } = data;

  return (
    <Section size="lg" className="hero" aria-label="DronaHost web hosting">
      <div className="relative z-[1] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pb-9">

        {/* LEFT — text content */}
        <div className="hero-left">
          <HeadLineText as="h1" fontSize="sixXl" align="left" fontWeight="bold">
            {heroSection.title1}
            <span className="text-primary"> {heroSection.title2}</span>
          </HeadLineText>

          <p className="max-w-xl text-gray-600 dark:text-slate-300">
            {heroSection.description}
          </p>

          <div className="action-row">
            {heroSection.buttons.map((button) => (
              <Link key={button.label} href={button.link} className={getButtonClassName(button.variant)}>
                {button.label}
              </Link>
            ))}
          </div>

          <div className="member-row" role="group" aria-label="Trusted by our customers">
            <div className="members">
              {heroSection.members.avatars.map((avatar, index) => (
                <NextImage
                  key={index}
                  src={avatar}
                  alt={`Customer ${index + 1}`}
                  width={32}
                  height={32}
                  loading="lazy"
                  className="member-avatar rounded-full"
                />
              ))}
            </div>
            <span className="text-slate-700 dark:text-slate-200">
              {heroSection.members.countText}
            </span>
          </div>
        </div>

        {/* RIGHT — hero image + floating cards */}
        <div className="hero-right relative">
          {heroSection.decorations?.curvedLines && (
            <div
              aria-hidden="true"
              className="absolute h-125 w-125 border border-orange-300 rounded-full blur-2xl opacity-40"
            />
          )}

          <div className="connector" aria-hidden="true" />

          <Image
            src={heroSection.heroImage.src}
            alt={heroSection.heroImage.alt}
            width={600}
            height={600}
            priority={true}
            skeleton={false}
            className="hero-person"
          />

          {heroSection.floatingCards.map((card, index) => (
            <article key={index} className={`floating-card ${getCardClassByPosition(card.position)}`}>
              <h4>{card.title}</h4>
              <p>{card.description}</p>
            </article>
          ))}

          <div className="orb" aria-hidden="true" />
        </div>
      </div>
    </Section>
  );
};

export default HomeHero;
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/HomeHero.tsx
git commit -m "feat: add sections/HomeHero.tsx (refactored HomeHeroSection with ui/ imports)"
```

---

### Task 3: Create `components/sections/PageHero.tsx`

**Files:**
- Create: `components/sections/PageHero.tsx`

New unified hero for all non-home pages. Replaces `Web-Hosting/HeroSection`, `Experience&Growth/HeroSection`, `blog/blogheroSection`, `HostingPrice/heroSection`, `DomainHosting/HeroSection`.

- `layout="split"` → text left, image right (lg:grid-cols-2). Used by Web-Hosting, Domain.
- `layout="centered"` → centered text, optional children below (blog hero, HostingPrice hero).
- `background="gradient"` → two orange blobs (top-left + bottom-right) via pure CSS, no JS.
- `background="plain"` → white/slate bg, no blobs.
- CTA buttons use the existing `.primary-btn` / `.secondary-btn` CSS classes.
- `priority={true}` always set on hero image (LCP element).

- [ ] **Step 1: Create the file**

Create `components/sections/PageHero.tsx`:

```tsx
import Badge from "@/components/ui/Badge";
import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { type ReactNode } from "react";

type CtaItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type PageHeroProps = {
  tagline?: string;
  title: string;
  description?: string;
  cta?: CtaItem[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  layout?: "centered" | "split";
  background?: "gradient" | "plain";
  children?: ReactNode;
};

export default function PageHero({
  tagline,
  title,
  description,
  cta = [],
  image,
  layout = "centered",
  background = "gradient",
  children,
}: PageHeroProps) {
  const isSplit = layout === "split";

  return (
    <Section
      size="lg"
      padding="hero"
      className={cn(
        "relative overflow-hidden",
        background === "plain" ? "bg-white dark:bg-gray-900" : "bg-white dark:bg-gray-900",
      )}
      aria-label={title}
    >
      {/* Gradient blobs — pure CSS, no JS */}
      {background === "gradient" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-16 -left-16 h-[28rem] w-[28rem] rounded-full bg-orange-500 opacity-20 blur-xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-16 -right-16 h-[28rem] w-[28rem] rounded-full bg-orange-500 opacity-25 blur-xl"
          />
        </>
      )}

      {isSplit ? (
        /* Split layout: text left, image right */
        <div className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-6">
            {tagline && <Badge variant="neutral">{tagline}</Badge>}

            <HeadLineText as="h1" fontSize="sixXl" fontWeight="bold" align="left">
              {title}
            </HeadLineText>

            {description && (
              <p className="max-w-xl text-gray-600 dark:text-gray-300">{description}</p>
            )}

            {cta.length > 0 && (
              <div className="flex flex-wrap gap-4">
                {cta.map((btn) => (
                  <Link
                    key={btn.label}
                    href={btn.href}
                    className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                  >
                    {btn.label}
                  </Link>
                ))}
              </div>
            )}

            {children}
          </div>

          {image && (
            <div className="flex justify-center lg:justify-end">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 600}
                height={image.height ?? 500}
                priority={true}
                skeleton={false}
                className="w-full max-w-lg object-contain"
              />
            </div>
          )}
        </div>
      ) : (
        /* Centered layout */
        <div className="relative z-10 mx-auto max-w-3xl space-y-6 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}

          <HeadLineText as="h1" fontSize="sixXl" fontWeight="bold" align="center">
            {title}
          </HeadLineText>

          {description && (
            <p className="mx-auto max-w-xl text-gray-600 dark:text-gray-300">{description}</p>
          )}

          {cta.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {cta.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}

          {image && (
            <div className="mt-10 flex justify-center">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width ?? 800}
                height={image.height ?? 500}
                priority={true}
                skeleton={false}
                className="w-full object-contain"
              />
            </div>
          )}

          {children}
        </div>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/PageHero.tsx
git commit -m "feat: add sections/PageHero.tsx (unified non-home hero, replaces 5 variants)"
```

---

### Task 4: Create `components/sections/TwoColumn.tsx`

**Files:**
- Create: `components/sections/TwoColumn.tsx`

Replaces `PricingSection1–4` and `EnterpriseHosting`. A flexible 2-column layout with text + image. Feature list renders as a checkmark `<ul>` when `features` is provided. `imagePosition` swaps column order.

- [ ] **Step 1: Create the file**

Create `components/sections/TwoColumn.tsx`:

```tsx
import Badge from "@/components/ui/Badge";
import HeadLineText from "@/components/ui/HeadLineText";
import Image from "@/components/ui/Image";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { type ReactNode } from "react";

type CtaItem = {
  label: string;
  href: string;
  variant?: "primary" | "secondary";
};

type TwoColumnProps = {
  tagline?: string;
  title: string;
  description?: string;
  features?: string[];
  cta?: CtaItem[];
  image: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  imagePosition?: "left" | "right";
  children?: ReactNode;
  className?: string;
};

export default function TwoColumn({
  tagline,
  title,
  description,
  features = [],
  cta = [],
  image,
  imagePosition = "right",
  children,
  className,
}: TwoColumnProps) {
  const imageFirst = imagePosition === "left";

  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

        {/* Text column */}
        <div className={cn("space-y-6", imageFirst ? "lg:order-last" : "lg:order-first")}>
          {tagline && <Badge variant="neutral">{tagline}</Badge>}

          <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="left">
            {title}
          </HeadLineText>

          {description && (
            <p className="text-gray-600 dark:text-gray-300 max-w-lg">{description}</p>
          )}

          {features.length > 0 && (
            <ul className="space-y-3">
              {features.map((feat, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/30"
                    aria-hidden="true"
                  >
                    <svg
                      className="h-3 w-3 text-orange-600 dark:text-orange-400"
                      fill="none"
                      viewBox="0 0 12 12"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l3 3 5-5" />
                    </svg>
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 text-sm">{feat}</span>
                </li>
              ))}
            </ul>
          )}

          {children}

          {cta.length > 0 && (
            <div className="flex flex-wrap gap-4 pt-2">
              {cta.map((btn) => (
                <Link
                  key={btn.label}
                  href={btn.href}
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Image column */}
        <div className={cn("flex justify-center", imageFirst ? "lg:order-first" : "lg:order-last")}>
          <Image
            src={image.src}
            alt={image.alt}
            width={image.width ?? 560}
            height={image.height ?? 480}
            priority={false}
            skeleton={true}
            className="w-full max-w-lg object-contain"
          />
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/TwoColumn.tsx
git commit -m "feat: add sections/TwoColumn.tsx (replaces PricingSection1-4 + EnterpriseHosting)"
```

---

### Task 5: Create `components/sections/FeatureGrid.tsx`

**Files:**
- Create: `components/sections/FeatureGrid.tsx`

Replaces `ServiceSection`, `Web-Hosting/FeatureSection`, `blog/trustedPlatform`, `Experience&Growth/services`, `blog/Articles`.

- `divided={true}` → items use `Card` with `variant="grid"` for border separators (GridCard pattern).
- `divided={false}` (default) → items use a simple card with shadow.
- `columns` controls the desktop grid: 2, 3, or 4.
- `tech` on items renders tech badge images (ResourceBox pattern).

- [ ] **Step 1: Create the file**

Create `components/sections/FeatureGrid.tsx`:

```tsx
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import { type ReactNode } from "react";

type FeatureGridItem = {
  icon?: ReactNode;
  iconKey?: string;
  title: string;
  description: string;
  cta?: { label: string; href: string };
  tech?: string[];
};

type FeatureGridProps = {
  tagline?: string;
  title?: string;
  description?: string;
  columns?: 2 | 3 | 4;
  items: FeatureGridItem[];
  divided?: boolean;
  className?: string;
};

const colClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
};

export default function FeatureGrid({
  tagline,
  title,
  description,
  columns = 3,
  items,
  divided = false,
  className,
}: FeatureGridProps) {
  const total = items.length;

  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title || description) && (
        <div className="mb-12 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
          {description && (
            <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-300">{description}</p>
          )}
        </div>
      )}

      {/* Grid */}
      <div className={cn("grid", colClass[columns])}>
        {items.map((item, index) =>
          divided ? (
            <Card
              key={index}
              variant="grid"
              index={index}
              total={total}
              columns={columns}
              align="left"
            >
              {item.icon && <div className="mb-4 text-primary">{item.icon}</div>}
              <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              {item.cta && (
                <a
                  href={item.cta.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
                >
                  {item.cta.label} →
                </a>
              )}
            </Card>
          ) : (
            <Card
              key={index}
              variant="box"
              icon={item.iconKey}
              title={item.title}
              description={item.description}
              tech={item.tech}
              className="m-3"
            />
          ),
        )}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/FeatureGrid.tsx
git commit -m "feat: add sections/FeatureGrid.tsx (replaces 5 feature/service grid variants)"
```

---

### Task 6: Create `components/sections/ProcessSteps.tsx`

**Files:**
- Create: `components/sections/ProcessSteps.tsx`

Replaces `Web-Hosting/HowItWorks` and `Experience&Growth/OurProcess`.

- `layout="alternating"` → image-text alternating rows with center dashed vertical line (HowItWorks style). Even index: text right + image left. Odd index: image left + text right.
- `layout="numbered"` → vertical numbered list without images (OurProcess style).

- [ ] **Step 1: Create the file**

Create `components/sections/ProcessSteps.tsx`:

```tsx
import Badge from "@/components/ui/Badge";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";

type ProcessStep = {
  step: number;
  title: string;
  description: string;
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
};

type ProcessStepsProps = {
  tagline?: string;
  title?: string;
  steps: ProcessStep[];
  layout?: "alternating" | "numbered";
  className?: string;
};

export default function ProcessSteps({
  tagline,
  title,
  steps,
  layout = "alternating",
  className,
}: ProcessStepsProps) {
  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title) && (
        <div className="mb-16 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
        </div>
      )}

      {layout === "alternating" ? (
        <div className="relative space-y-24">
          {/* Center dashed vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden border-l-2 border-dashed border-orange-300 dark:border-primary lg:block"
          />

          {steps.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={index} className="relative grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
                {isEven ? (
                  <>
                    {/* Text — right side */}
                    <div className="space-y-4 text-center lg:pr-10 lg:text-right">
                      <HeadLineText as="h3" fontSize="xl" fontWeight="bold" align="right" className="text-black dark:text-white">
                        {item.title}
                      </HeadLineText>
                      <p className="ml-auto max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                    {/* Image — left side */}
                    {item.image && (
                      <div className="mx-10 flex justify-start">
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-800">
                          <img
                            src={item.image.src}
                            alt={item.image.alt}
                            className="h-full w-full object-cover opacity-80"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Image — left side */}
                    {item.image && (
                      <div className="order-2 mx-10 flex justify-end lg:order-1">
                        <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-gray-100 shadow-md dark:bg-gray-800">
                          <img
                            src={item.image.src}
                            alt={item.image.alt}
                            className="h-full w-full object-cover opacity-80"
                          />
                        </div>
                      </div>
                    )}
                    {/* Text — right side */}
                    <div className={cn("order-1 space-y-4 text-center lg:order-2 lg:pl-10 lg:text-left", !item.image && "lg:col-start-2")}>
                      <HeadLineText as="h3" fontSize="xl" fontWeight="bold" align="left" className="text-black dark:text-white">
                        {item.title}
                      </HeadLineText>
                      <p className="max-w-md text-sm text-gray-600 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </>
                )}

                {/* Step circle */}
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 hidden h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-orange-500 font-semibold text-white shadow-lg dark:border-gray-900 lg:flex"
                >
                  {item.step}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Numbered layout */
        <ol className="space-y-8">
          {steps.map((item, index) => (
            <li key={index} className="flex gap-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold text-white shadow">
                {item.step}
              </div>
              <div className="space-y-1 pt-1">
                <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/ProcessSteps.tsx
git commit -m "feat: add sections/ProcessSteps.tsx (replaces HowItWorks + OurProcess)"
```

---

### Task 7: Create `components/sections/CTASection.tsx`

**Files:**
- Create: `components/sections/CTASection.tsx`

Replaces `home/CTA`, `Web-Hosting/CTA`, `blog/CTA`, `Experience&Growth/CTA`.

- `variant="default"` → light gray bg, image left + content right grid.
- `variant="gradient"` → gradient-tinted background.
- `children` slot for email input, newsletter form, etc. (consumer adds `"use client"` if needed).

- [ ] **Step 1: Create the file**

Create `components/sections/CTASection.tsx`:

```tsx
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";
import NextImage from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

type CtaItem = {
  label: string;
  href?: string;
  variant?: "primary" | "secondary";
};

type CTASectionProps = {
  title: string;
  description?: string;
  tagline?: string;
  cta: CtaItem[];
  image?: {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  };
  variant?: "default" | "gradient";
  children?: ReactNode;
  className?: string;
};

export default function CTASection({
  title,
  description,
  tagline,
  cta,
  image,
  variant = "default",
  children,
  className,
}: CTASectionProps) {
  return (
    <Section
      size="lg"
      padding="lg"
      className={cn(
        variant === "gradient"
          ? "bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-orange-950/20 dark:via-gray-900 dark:to-orange-950/20"
          : "bg-gray-50 dark:bg-gray-900",
        className,
      )}
    >
      <div className={cn("grid gap-12 lg:items-center", image ? "lg:grid-cols-2" : "lg:grid-cols-1")}>

        {/* Image — always left when present */}
        {image && (
          <div className="flex justify-center lg:justify-center">
            <NextImage
              src={image.src}
              alt={image.alt}
              width={image.width ?? 500}
              height={image.height ?? 400}
              className="w-full max-w-md object-contain"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className={cn("space-y-6", image ? "text-center lg:text-left" : "mx-auto max-w-2xl text-center")}>
          {tagline && (
            <span className="inline-block rounded-full bg-blue-50 px-4 py-1 text-xs uppercase tracking-widest text-blue-500 dark:bg-blue-900/30">
              {tagline}
            </span>
          )}

          <HeadLineText
            as="h2"
            fontSize="fourXl"
            fontWeight="bold"
            align={image ? "left" : "center"}
          >
            {title}
          </HeadLineText>

          {description && (
            <p className="text-gray-600 dark:text-gray-300">{description}</p>
          )}

          {children}

          <div className={cn("flex flex-wrap gap-4", image ? "items-center lg:items-start" : "justify-center")}>
            {cta.map((btn, i) =>
              btn.href ? (
                <Link
                  key={i}
                  href={btn.href}
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </Link>
              ) : (
                <button
                  key={i}
                  type="button"
                  className={btn.variant === "secondary" ? "secondary-btn" : "primary-btn"}
                >
                  {btn.label}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add components/sections/CTASection.tsx
git commit -m "feat: add sections/CTASection.tsx (replaces 4 CTA variants)"
```

---

### Task 8: Create `components/sections/ResourceGrid.tsx`

**Files:**
- Create: `components/sections/ResourceGrid.tsx`

Replaces `blog/AllBlogs`, `blog/FeatureInsight`, `blog/developmentHub`.

- Uses `Card` with `variant="resource"` for each post.
- `featured={true}` → first post renders at full width.
- `showFilters` is a hint to the consumer page to add filter tabs — this component itself stays server-safe; the consumer that passes filtered `posts` can be client-side.
- `columns` controls the grid: 2 or 3.

- [ ] **Step 1: Create the file**

Create `components/sections/ResourceGrid.tsx`:

```tsx
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import HeadLineText from "@/components/ui/HeadLineText";
import Section from "@/components/ui/Section";
import { cn } from "@/utils/cn";

type ResourcePost = {
  category?: string;
  title: string;
  description?: string;
  readTime?: string;
  button?: string;
  image?: string;
  href?: string;
  publishedAt?: string;
};

type ResourceGridProps = {
  tagline?: string;
  title?: string;
  posts: ResourcePost[];
  columns?: 2 | 3;
  featured?: boolean;
  className?: string;
};

const colClass: Record<2 | 3, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
};

export default function ResourceGrid({
  tagline,
  title,
  posts,
  columns = 3,
  featured = false,
  className,
}: ResourceGridProps) {
  const [firstPost, ...restPosts] = posts;

  return (
    <Section size="lg" padding="lg" className={cn("bg-white dark:bg-gray-900", className)}>
      {/* Header */}
      {(tagline || title) && (
        <div className="mb-12 space-y-4 text-center">
          {tagline && <Badge variant="neutral">{tagline}</Badge>}
          {title && (
            <HeadLineText as="h2" fontSize="fiveXl" fontWeight="bold" align="center">
              {title}
            </HeadLineText>
          )}
        </div>
      )}

      {/* Featured first post */}
      {featured && firstPost && (
        <div className="mb-12">
          <Card
            variant="resource"
            post={{
              category: firstPost.category,
              title: firstPost.title,
              description: firstPost.description,
              readTime: firstPost.readTime,
              button: firstPost.button ?? "Read article",
              image: firstPost.image,
              href: firstPost.href,
            }}
            showCategory={true}
            showDescription={true}
            showCTA={true}
            imageClassName="h-72"
          />
        </div>
      )}

      {/* Grid */}
      <div className={cn("grid gap-8", colClass[columns])}>
        {(featured ? restPosts : posts).map((post, index) => (
          <Card
            key={index}
            variant="resource"
            post={{
              category: post.category,
              title: post.title,
              description: post.description,
              readTime: post.readTime,
              button: post.button ?? "Read article",
              image: post.image,
              href: post.href,
            }}
            showCategory={true}
            showDescription={true}
            showCTA={true}
          />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 3: Update `/v2` showcase with new sections**

In `app/(dev)/v2/page.tsx`, add imports for the new sections:

```tsx
import PageHero from "@/components/sections/PageHero";
import TwoColumn from "@/components/sections/TwoColumn";
import FeatureGrid from "@/components/sections/FeatureGrid";
import ProcessSteps from "@/components/sections/ProcessSteps";
import CTASection from "@/components/sections/CTASection";
import ResourceGrid from "@/components/sections/ResourceGrid";
```

Before the closing `</main>` tag, add a new ShowcaseSection group:

```tsx
{/* ── Sections ── */}
<ShowcaseSection
  id="page-hero"
  title="PageHero"
  status="built"
  notes="Centered and split layouts. gradient/plain backgrounds. Used on all non-home pages."
>
  <PageHero
    tagline="WordPress Hosting"
    title="High-performance hosting built for WordPress"
    description="LiteSpeed + NVMe storage. 200ms average TTFB from London, Frankfurt, and New York."
    cta={[{ label: "Get started", href: "#" }, { label: "View plans", href: "#", variant: "secondary" }]}
    layout="centered"
    background="gradient"
  />
</ShowcaseSection>

<ShowcaseSection
  id="two-column"
  title="TwoColumn"
  status="built"
  notes="Image left or right. Optional feature checklist. Replaces PricingSection1–4."
>
  <TwoColumn
    tagline="Managed WordPress"
    title="Everything you need, nothing you don't"
    description="Pre-configured caching, automatic updates, and daily backups — so you focus on your site."
    features={["LiteSpeed cache pre-installed", "Daily off-site backups", "One-click staging", "Free SSL forever"]}
    cta={[{ label: "Start free trial", href: "#" }]}
    image={{ src: "/images/placeholder.png", alt: "Feature illustration", width: 560, height: 480 }}
    imagePosition="right"
  />
</ShowcaseSection>

<ShowcaseSection
  id="feature-grid"
  title="FeatureGrid"
  status="built"
  notes="divided and undivided modes. 2/3/4 columns. Replaces ServiceSection and 4 others."
>
  <FeatureGrid
    tagline="Why DronaHost"
    title="Built for speed, reliability, and growth"
    columns={3}
    divided={true}
    items={[
      { title: "LiteSpeed + NVMe", description: "200ms average TTFB from our London, Frankfurt, and New York nodes." },
      { title: "99.95% Uptime SLA", description: "Automatic service credits if we miss. No excuses, no workarounds." },
      { title: "18-min first response", description: "24/7 across US, UK, and UAE business hours. Real humans, not bots." },
    ]}
  />
</ShowcaseSection>

<ShowcaseSection
  id="process-steps"
  title="ProcessSteps"
  status="built"
  notes="alternating and numbered layouts. Replaces HowItWorks + OurProcess."
>
  <ProcessSteps
    tagline="How it works"
    title="Up and running in under 10 minutes"
    layout="numbered"
    steps={[
      { step: 1, title: "Choose your plan", description: "Pick the hosting plan that fits your site size and traffic." },
      { step: 2, title: "Point your domain", description: "Update your nameservers or transfer your domain to us." },
      { step: 3, title: "Go live", description: "We migrate your site for free and you go live with zero downtime." },
    ]}
  />
</ShowcaseSection>

<ShowcaseSection
  id="cta-section"
  title="CTASection"
  status="built"
  notes="default and gradient variants. Image left + content right. Replaces 4 CTA components."
>
  <CTASection
    title="Ready to move your WordPress site?"
    description="We migrate for free. Your site stays live the entire time."
    tagline="Free migration"
    cta={[{ label: "Start free trial", href: "#" }, { label: "Talk to an expert", href: "#", variant: "secondary" }]}
  />
</ShowcaseSection>
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add components/sections/ResourceGrid.tsx "app/(dev)/v2/page.tsx"
git commit -m "feat: add sections/ResourceGrid.tsx and wire all new sections into /v2 showcase"
```
