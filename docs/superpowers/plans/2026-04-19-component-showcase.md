# Component Showcase (/v2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a permanent dev-only component showcase at `/v2` with a sticky sidebar, all existing components rendered with dummy data, and status badges — plus a `docs/ui-fix-plan.md` tracking every component's health.

**Architecture:** A new `(dev)` route group sits alongside `(marketing)`. Its layout is a bare shell (no site header/footer). The `/v2` page has a fixed top bar, sticky sidebar with anchor navigation (Intersection Observer), and a scrollable right panel rendering every component. Complex home sections receive hardcoded dummy data from `_data/dummy.ts`. The page guards itself with a `NODE_ENV` check and returns `notFound()` in production.

**Tech Stack:** Next.js 16 App Router, TypeScript (strict), Tailwind CSS 4, next-themes (already installed), native Intersection Observer API (no new deps).

---

## File Map

| Action | Path | Responsibility |
|---|---|---|
| Modify | `app/robots.ts` | Add `/v2/` to disallow list |
| Create | `app/(dev)/layout.tsx` | Bare shell — just `<html><body>{children}</body>` with globals + providers |
| Create | `app/(dev)/v2/_components/StatusBadge.tsx` | Renders ✅ / ⚠️ / ❌ chip |
| Create | `app/(dev)/v2/_components/ShowcaseSection.tsx` | Section wrapper: id anchor, heading, badge, notes line |
| Create | `app/(dev)/v2/_components/ShowcaseSidebar.tsx` | Client component — sticky sidebar + Intersection Observer active state |
| Create | `app/(dev)/v2/_data/dummy.ts` | All hardcoded dummy data objects for data-driven components |
| Create | `app/(dev)/v2/page.tsx` | Main page: dev guard + full layout wiring all components |
| Create | `docs/ui-fix-plan.md` | Living component health tracker |

---

## Task 1: Block `/v2` in robots.ts

**Files:**
- Modify: `app/robots.ts`

- [ ] **Step 1: Add `/v2/` to the disallow array**

Open `app/robots.ts`. The existing disallow array is:
```ts
disallow: ["/api/", "/admin/", "/account/", "/checkout/", "/_next/"],
```

Replace it with:
```ts
disallow: ["/api/", "/admin/", "/account/", "/checkout/", "/_next/", "/v2/"],
```

- [ ] **Step 2: Verify**

Run: `curl -s http://localhost:3000/robots.txt` (with dev server running) and confirm `/v2/` appears in `Disallow`.

- [ ] **Step 3: Commit**

```bash
git add app/robots.ts
git commit -m "feat: disallow /v2 in robots.txt"
```

---

## Task 2: Create `(dev)` route group layout

**Files:**
- Create: `app/(dev)/layout.tsx`

- [ ] **Step 1: Create the bare layout**

Create `app/(dev)/layout.tsx`:

```tsx
import "@/app/globals.css";
import Providers from "@/app/providers";

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

> Note: This duplicates `<html><body>` from the root layout intentionally. The `(dev)` group is isolated — it must NOT inherit the marketing layout which includes site `<Header>` and `<Footer>`.

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/(dev)/layout.tsx
git commit -m "feat: add bare (dev) route group layout"
```

---

## Task 3: `StatusBadge` component

**Files:**
- Create: `app/(dev)/v2/_components/StatusBadge.tsx`

- [ ] **Step 1: Create the component**

Create `app/(dev)/v2/_components/StatusBadge.tsx`:

```tsx
export type Status = "built" | "needs-work" | "missing";

const config: Record<Status, { label: string; classes: string }> = {
  built: {
    label: "✅ Built",
    classes: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  "needs-work": {
    label: "⚠️ Needs work",
    classes: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  missing: {
    label: "❌ Missing",
    classes: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, classes } = config[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/(dev)/v2/_components/StatusBadge.tsx
git commit -m "feat: add StatusBadge component for /v2 showcase"
```

---

## Task 4: `ShowcaseSection` wrapper

**Files:**
- Create: `app/(dev)/v2/_components/ShowcaseSection.tsx`

- [ ] **Step 1: Create the component**

Create `app/(dev)/v2/_components/ShowcaseSection.tsx`:

```tsx
import StatusBadge, { type Status } from "./StatusBadge";

type ShowcaseSectionProps = {
  id: string;
  title: string;
  status: Status;
  notes?: string;
  children: React.ReactNode;
};

export default function ShowcaseSection({
  id,
  title,
  status,
  notes,
  children,
}: ShowcaseSectionProps) {
  return (
    <section
      id={id}
      className="border-b border-slate-200 dark:border-slate-800 py-12 scroll-mt-14"
    >
      <div className="mb-6 flex items-start gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <div className="mt-1.5 flex items-center gap-2">
            <StatusBadge status={status} />
            {notes && (
              <span className="text-sm text-slate-500 dark:text-slate-400">
                {notes}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/(dev)/v2/_components/ShowcaseSection.tsx
git commit -m "feat: add ShowcaseSection wrapper for /v2 showcase"
```

---

## Task 5: `ShowcaseSidebar` with Intersection Observer

**Files:**
- Create: `app/(dev)/v2/_components/ShowcaseSidebar.tsx`

This is a client component because it uses `useState`, `useEffect`, and `IntersectionObserver`.

- [ ] **Step 1: Create the component**

Create `app/(dev)/v2/_components/ShowcaseSidebar.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";

type SidebarItem = {
  id: string;
  label: string;
};

type Category = {
  label: string;
  items: SidebarItem[];
};

const categories: Category[] = [
  {
    label: "Layout",
    items: [
      { id: "section", label: "Section" },
      { id: "gradient-background", label: "GradientBackground" },
    ],
  },
  {
    label: "Typography",
    items: [{ id: "headline-text", label: "HeadLineText" }],
  },
  {
    label: "Cards",
    items: [
      { id: "grid-card", label: "GridCard" },
      { id: "resource-card", label: "ResourceCard" },
      { id: "resource-box", label: "ResourceBox" },
    ],
  },
  {
    label: "Buttons & Forms",
    items: [
      { id: "buttons", label: "Buttons" },
      { id: "contact-form", label: "Contact Form" },
    ],
  },
  {
    label: "Navigation",
    items: [
      { id: "header", label: "Header" },
      { id: "footer", label: "Footer" },
    ],
  },
  {
    label: "Home Sections",
    items: [
      { id: "hero", label: "Hero" },
      { id: "features", label: "Features" },
      { id: "services", label: "Services" },
      { id: "case-study", label: "Case Study" },
      { id: "cta", label: "CTA" },
      { id: "pricing-1", label: "Pricing (Split Image)" },
      { id: "pricing-2", label: "Pricing (Illustration)" },
      { id: "pricing-3", label: "Pricing (Alt Split)" },
      { id: "pricing-4", label: "Pricing (Feature List)" },
      { id: "pricing-journey", label: "Pricing Journey" },
      { id: "testimonials", label: "Testimonials" },
      { id: "faq", label: "FAQ" },
      { id: "teams", label: "Teams" },
    ],
  },
  {
    label: "SEO",
    items: [
      { id: "json-ld", label: "JsonLd" },
    ],
  },
  {
    label: "Trust & Conversion",
    items: [
      { id: "trust-badges", label: "Trust Badges" },
      { id: "uptime-bar", label: "Uptime / Stats Bar" },
    ],
  },
];

export default function ShowcaseSidebar() {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const allIds = categories.flatMap((c) => c.items.map((i) => i.id));
    const elements = allIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-10% 0px -80% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pr-4">
      {categories.map((cat) => (
        <div key={cat.label} className="mb-4">
          <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {cat.label}
          </p>
          <ul>
            {cat.items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`block rounded-md px-3 py-1.5 text-sm transition-colors ${
                    activeId === item.id
                      ? "bg-orange-50 font-medium text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add app/(dev)/v2/_components/ShowcaseSidebar.tsx
git commit -m "feat: add ShowcaseSidebar with intersection observer active state"
```

---

## Task 6: Dummy data file

**Files:**
- Create: `app/(dev)/v2/_data/dummy.ts`

All data-driven home section components require a typed `data` prop. This file provides minimal but valid dummy data for every one of them.

- [ ] **Step 1: Create the dummy data file**

Create `app/(dev)/v2/_data/dummy.ts`:

```ts
export const heroData = {
  heroSection: {
    title1: "Reliable & Powerful",
    title2: "Cloud Web Hosting",
    description:
      "LiteSpeed-optimized WordPress hosting with NVMe storage across US, UK, and EU nodes. 99.95% uptime SLA. Average first response: 18 minutes.",
    background: { src: "/images/home/hero-bg.svg", alt: "" },
    buttons: [
      { label: "Get Started", href: "/pricing", variant: "primary" },
      { label: "View Plans", href: "/hosting/wordpress", variant: "secondary" },
    ],
    members: {
      countText: "2,400+ customers",
      avatars: [
        "/images/home/avatar-1.jpg",
        "/images/home/avatar-2.jpg",
        "/images/home/avatar-3.jpg",
      ],
    },
    heroImage: { src: "/images/home/hero-main.png", alt: "DronaHost dashboard" },
    floatingCards: [
      { title: "99.95% Uptime", subtitle: "SLA guaranteed", icon: "shield" },
      { title: "18 min", subtitle: "Avg. first response", icon: "clock" },
      { title: "200ms TTFB", subtitle: "Global average", icon: "zap" },
    ],
    decorations: {
      backgroundBlur: true,
      gradientOverlay: true,
      curvedLines: false,
    },
  },
};

export const featureData = {
  featureSection: {
    tagline: "Built for performance",
    title: "Everything your site needs to stay fast",
    description:
      "From LiteSpeed caching to automated backups, every feature is tuned for Western audiences expecting sub-second load times.",
    features: [
      {
        title: "LiteSpeed + NVMe",
        description: "200ms average TTFB from London, Frankfurt, and New York nodes.",
        icon: "zap",
        image: { src: "/images/home/feature-speed.png", alt: "Speed dashboard" },
      },
      {
        title: "Daily Backups",
        description: "Automated off-site backups retained for 30 days. One-click restore.",
        icon: "database",
        image: { src: "/images/home/feature-backup.png", alt: "Backup interface" },
      },
      {
        title: "Free SSL + CDN",
        description: "Let's Encrypt SSL auto-renewed. Cloudflare CDN included on all plans.",
        icon: "lock",
        image: { src: "/images/home/feature-ssl.png", alt: "SSL certificate" },
      },
    ],
  },
};

export const serviceData = {
  servicesSection: {
    tagline: "Our services",
    title: "Hosting and web services for growing businesses",
    description: "From shared WordPress hosting to fully managed VPS, we cover every stage of growth.",
    services: [
      { title: "WordPress Hosting", description: "Managed, LiteSpeed-optimized.", icon: "wordpress", href: "/hosting/wordpress" },
      { title: "VPS Hosting", description: "Full root access, scalable resources.", icon: "server", href: "/hosting/vps" },
      { title: "Cloud Hosting", description: "Auto-scaling cloud infrastructure.", icon: "cloud", href: "/hosting/cloud" },
      { title: "Business Hosting", description: "Email + hosting bundles.", icon: "briefcase", href: "/hosting/business" },
      { title: "Domain Registration", description: "1,000+ TLDs from $0.99/yr.", icon: "globe", href: "/domains" },
      { title: "Website Design", description: "WordPress and custom Next.js builds.", icon: "layout", href: "/services/design" },
      { title: "SEO Services", description: "Retainer-based, Western keyword focus.", icon: "search", href: "/services/seo" },
      { title: "Custom Development", description: "React / Next.js solutions.", icon: "code", href: "/services/development" },
    ],
  },
};

export const caseStudyData = {
  caseStudy: {
    tagline: "Case study",
    title: "How Hartwell Legal cut page load time by 68%",
    description:
      "A UK law firm migrated from GoDaddy shared hosting to DronaHost managed WordPress. LCP dropped from 4.2s to 1.3s. Organic enquiries increased 34% in 90 days.",
    metrics: [
      { label: "LCP improvement", value: "68%" },
      { label: "Organic enquiries", value: "+34%" },
      { label: "Migration time", value: "4 hours" },
    ],
    image: { src: "/images/home/case-study.png", alt: "Hartwell Legal website" },
    cta: { label: "Read full case study", href: "/case-studies/hartwell-legal" },
  },
};

export const ctaData = {
  ctaSection: {
    title: "Start hosting that actually performs",
    description: "30-day money-back guarantee. No contracts. Cancel any time.",
    buttons: [
      { label: "Get Started — from $0.99/mo", href: "/pricing", variant: "primary" },
      { label: "Talk to us first", href: "/contact", variant: "secondary" },
    ],
    image: { src: "/images/home/cta-illustration.png", alt: "" },
  },
};

export const pricingSection1Data = {
  pricingSection: {
    tagline: "WordPress hosting",
    title: "Managed WordPress from $0.99/month",
    description:
      "LiteSpeed, NVMe, free SSL, daily backups, and one-click staging. All plans include 24/7 support.",
    features: [
      "LiteSpeed web server",
      "NVMe SSD storage",
      "Free SSL certificate",
      "Daily automated backups",
      "One-click staging environment",
      "99.95% uptime SLA",
    ],
    image: { src: "/images/home/pricing-wp.png", alt: "WordPress hosting dashboard" },
    cta: { label: "View WordPress plans", href: "/hosting/wordpress" },
  },
};

export const pricingSection2Data = {
  managedHostingSection: {
    tagline: "Managed hosting",
    title: "We handle the server. You handle the business.",
    description:
      "Automatic updates, security patches, performance tuning — all handled by our team so you can focus on your product.",
    image: { src: "/images/home/pricing-managed.png", alt: "Managed hosting illustration" },
    features: [
      "Automatic WordPress core updates",
      "Plugin compatibility checks",
      "Malware scanning & removal",
      "Performance audit on request",
    ],
    cta: { label: "Learn about managed hosting", href: "/hosting/wordpress" },
  },
};

export const pricingSection3Data = {
  pricingSection2: {
    tagline: "VPS hosting",
    title: "Full-control VPS from $12/month",
    description:
      "Root access, choose your OS, deploy anything. London, Frankfurt, and New York data centres.",
    image: { src: "/images/home/pricing-vps.png", alt: "VPS control panel" },
    features: [
      "Full root SSH access",
      "Choice of Ubuntu, Debian, CentOS",
      "1Gbps network port",
      "Free Cloudflare integration",
    ],
    cta: { label: "View VPS plans", href: "/hosting/vps" },
  },
};

export const pricingSection4Data = {
  pricingSection4: {
    tagline: "Business hosting",
    title: "Email + hosting bundles for teams",
    description:
      "Professional email on your domain, shared hosting, and Titan Mail — starting at $4.99/month per user.",
    features: [
      "Titan Business Email",
      "5GB mailbox per user",
      "Spam filtering & virus protection",
      "Webmail + mobile sync",
      "GDPR-compliant mail storage",
    ],
    cta: { label: "View business plans", href: "/hosting/business" },
  },
};

export const pricingJourneyData = {
  pricingJourney: {
    title: "Find the right plan for where you are now",
    description: "Slide to your current traffic level and we will show the plan that fits.",
    tiers: [
      { label: "Just starting", traffic: "< 1k visits/mo", plan: "Starter", price: "$0.99" },
      { label: "Growing", traffic: "1k–10k visits/mo", plan: "Professional", price: "$4.99" },
      { label: "Scaling", traffic: "10k–50k visits/mo", plan: "Business", price: "$14.99" },
      { label: "Enterprise", traffic: "50k+ visits/mo", plan: "Enterprise", price: "Custom" },
    ],
  },
};

export const testimonialsData = {
  testimonialsSection: {
    title: "Trusted by businesses across the US, UK, and UAE",
    tabs: [
      { label: "All", active: true },
      { label: "WordPress", active: false },
      { label: "VPS", active: false },
      { label: "Agency", active: false },
    ],
    testimonials: [
      {
        rating: 5,
        content:
          "Migrated from WP Engine and cut our hosting bill by 60% with identical performance. The support team responded in under 15 minutes at 2am UK time.",
        author: { name: "Sarah Mitchell", role: "CTO", company: "Hartwell Legal", avatar: "/images/home/avatar-1.jpg" },
      },
      {
        rating: 5,
        content:
          "As an agency managing 40+ client sites, DronaHost's staging environment and one-click cloning saves us hours every week.",
        author: { name: "James Okonkwo", role: "Founder", company: "Pivot Digital Agency", avatar: "/images/home/avatar-2.jpg" },
      },
      {
        rating: 5,
        content:
          "GDPR compliance was non-negotiable for us. DronaHost had a signed DPA ready in minutes and EU data residency by default.",
        author: { name: "Lena Hoffmann", role: "Head of Engineering", company: "Finovo GmbH", avatar: "/images/home/avatar-3.jpg" },
      },
    ],
    layout: { columns: 3 },
  },
};

export const faqData = {
  faqSection: {
    title: "Frequently asked questions",
    categories: [
      {
        label: "General",
        active: true,
        questions: [
          {
            question: "Where are your servers located?",
            answer:
              "We operate nodes in London (UK), Frankfurt (Germany), and New York (US). EU customer data stays on EU servers by default for GDPR compliance.",
          },
          {
            question: "Do you offer a money-back guarantee?",
            answer:
              "Yes — 30-day money-back guarantee on all hosting plans. No questions asked.",
          },
          {
            question: "What uptime SLA do you offer?",
            answer:
              "99.95% uptime SLA with automatic service credits if we fall below it. Full terms on our SLA page.",
          },
        ],
      },
    ],
  },
};

export const teamsData = {
  teamsSection: {
    tagline: "Our team",
    title: "A small team with deep technical focus",
    description:
      "We are a lean team of engineers and designers based in India, serving clients in the US, UK, and UAE. Small enough to care, experienced enough to deliver.",
    members: [
      {
        name: "Sandipan Das",
        role: "Founder & CEO",
        bio: "10 years in web infrastructure. Previously led platform engineering at a UK SaaS company.",
        avatar: "/images/team/sandipan.jpg",
        linkedin: "https://linkedin.com/in/sandipandas",
      },
    ],
  },
};
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit`
Expected: no errors related to the new file (type mismatches will show up here — fix them by adjusting field names to match what the components actually expect).

- [ ] **Step 3: Commit**

```bash
git add app/(dev)/v2/_data/dummy.ts
git commit -m "feat: add dummy data fixtures for /v2 component showcase"
```

---

## Task 7: Main showcase page

**Files:**
- Create: `app/(dev)/v2/page.tsx`

- [ ] **Step 1: Create the page**

Create `app/(dev)/v2/page.tsx`:

```tsx
import { notFound } from "next/navigation";
import ShowcaseSidebar from "./_components/ShowcaseSidebar";
import ShowcaseSection from "./_components/ShowcaseSection";
import StatusBadge from "./_components/StatusBadge";

// ─── Core components ────────────────────────────────────────────
import Section from "@/components/section/section";
import GradientBackground from "@/components/gradient/gradient";
import HeadLineText from "@/components/HeadLineText/HeadLineText";
import GridCard from "@/components/Card/GridCard";

// ─── Home sections ──────────────────────────────────────────────
import HeroSection from "@/components/home/hero-section/HomeHeroSection";
import FeatureSection from "@/components/home/FeatureSection/FeatureSection";
import ServicesSection from "@/components/home/ServiceSection/ServiceSection";
import CaseStudySection from "@/components/home/CaseStudy/CaseStudy";
import CTASection from "@/components/home/CTA/CTA";
import PricingSection1 from "@/components/home/PricingSection1/PricingSection1";
import PricingSection2 from "@/components/home/PricingSection2/PricingSection2";
import PricingSection3 from "@/components/home/PricingSection3/PricingSection3";
import PricingSection4 from "@/components/home/PricingSection4/PricingSection4";
import PricingJourney from "@/components/home/pricingjourney/pricingJourney";
import TestimonialsSection from "@/components/home/Testimonials/TestimonialsSection";
import FAQSection from "@/components/home/FAQ/FAQSection";
import TeamsSection from "@/components/home/Teams/TeamsSection";

// ─── Layout / Navigation ─────────────────────────────────────────
import Header from "@/layouts/header/header";
import Footer from "@/layouts/footer/footer";

// ─── SEO ─────────────────────────────────────────────────────────
import JsonLd from "@/components/seo/JsonLd";

// ─── Dummy data ──────────────────────────────────────────────────
import {
  heroData,
  featureData,
  serviceData,
  caseStudyData,
  ctaData,
  pricingSection1Data,
  pricingSection2Data,
  pricingSection3Data,
  pricingSection4Data,
  pricingJourneyData,
  testimonialsData,
  faqData,
  teamsData,
} from "./_data/dummy";

export default function ComponentShowcasePage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* ── Top bar ── */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            DronaHost Component Library
          </span>
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            NODE_ENV: development
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span>✅ Built</span>
          <span>⚠️ Needs work</span>
          <span>❌ Missing</span>
        </div>
      </header>

      <div className="flex pt-14">
        {/* ── Sidebar ── */}
        <aside className="w-52 shrink-0 border-r border-slate-200 dark:border-slate-800">
          <ShowcaseSidebar />
        </aside>

        {/* ── Content ── */}
        <main className="flex-1 px-8 py-6 max-w-5xl">

          {/* ─── LAYOUT ─── */}
          <h1 className="mb-8 text-2xl font-bold text-slate-900 dark:text-slate-100">
            Component Showcase
          </h1>

          <ShowcaseSection
            id="section"
            title="Section"
            status="built"
            notes="Layout primitive used on every page. All variants present."
          >
            <div className="space-y-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Default (lg container)</p>
              <Section size="lg" padding="md" className="border border-dashed border-slate-300">
                <p className="text-sm text-slate-600">Section content — lg container, md padding</p>
              </Section>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-4">Surface variant</p>
              <Section size="md" padding="md" variant="surface">
                <p className="text-sm text-slate-600">Section content — surface variant</p>
              </Section>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-4">Featured variant</p>
              <Section size="md" padding="md" variant="featured">
                <p className="text-sm text-white">Section content — featured (amber gradient)</p>
              </Section>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="gradient-background"
            title="GradientBackground"
            status="needs-work"
            notes="Too many variants with no documentation. Needs a variant map and usage guide."
          >
            <div className="rounded-lg overflow-hidden h-48 relative">
              <GradientBackground gradient="blue-cyan" className="absolute inset-0" />
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-white font-medium">blue-cyan gradient</p>
              </div>
            </div>
          </ShowcaseSection>

          {/* ─── TYPOGRAPHY ─── */}
          <ShowcaseSection
            id="headline-text"
            title="HeadLineText"
            status="needs-work"
            notes="No fluid clamp sizing between breakpoints — jumps abruptly on tablet viewports."
          >
            <div className="space-y-4">
              <HeadLineText fontSize="sixXl">Display / Hero (sixXl)</HeadLineText>
              <HeadLineText fontSize="fourXl">Section Title (fourXl)</HeadLineText>
              <HeadLineText fontSize="twoXl">Card Title (twoXl)</HeadLineText>
              <HeadLineText fontSize="md">Body Heading (md)</HeadLineText>
              <HeadLineText fontSize="sm">Caption (sm)</HeadLineText>
            </div>
          </ShowcaseSection>

          {/* ─── CARDS ─── */}
          <ShowcaseSection
            id="grid-card"
            title="GridCard"
            status="needs-work"
            notes="Missing mobile hover/focus states. Border logic correct on desktop only."
          >
            <div className="grid grid-cols-3">
              {["Card One", "Card Two", "Card Three", "Card Four", "Card Five", "Card Six"].map(
                (label, i) => (
                  <GridCard key={i} index={i} total={6} columns={3} size="md">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</p>
                    <p className="text-xs text-slate-500 mt-1">Dummy content for grid card {i + 1}</p>
                  </GridCard>
                )
              )}
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="resource-card"
            title="ResourceCard"
            status="built"
            notes="Used in blog and KB pages. Looks correct."
          >
            <p className="text-sm text-slate-500">ResourceCard renders inside blog/KB contexts — visit /blog to see it in use.</p>
          </ShowcaseSection>

          <ShowcaseSection
            id="resource-box"
            title="ResourceBox"
            status="built"
            notes="Used in blog and KB pages."
          >
            <p className="text-sm text-slate-500">ResourceBox renders inside blog/KB contexts — visit /blog to see it in use.</p>
          </ShowcaseSection>

          {/* ─── BUTTONS & FORMS ─── */}
          <ShowcaseSection
            id="buttons"
            title="Buttons"
            status="needs-work"
            notes="No disabled state. No loading/spinner state. Primary and secondary only — no destructive variant."
          >
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-secondary">Secondary Button</button>
              <button className="btn-primary opacity-50 cursor-not-allowed" disabled>
                Primary Disabled (unstyled)
              </button>
              <button className="btn-secondary opacity-50 cursor-not-allowed" disabled>
                Secondary Disabled (unstyled)
              </button>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="contact-form"
            title="Contact Form"
            status="needs-work"
            notes="Form exists in /contact page only. No reusable component extracted. No loading or success state."
          >
            <p className="text-sm text-slate-500">Contact form is embedded in the /contact page — not yet a standalone reusable component.</p>
          </ShowcaseSection>

          {/* ─── NAVIGATION ─── */}
          <ShowcaseSection
            id="header"
            title="Header"
            status="needs-work"
            notes="Mobile hamburger menu not implemented. Mega menu lacks keyboard navigation (arrow keys, Escape)."
          >
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Header />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="footer"
            title="Footer"
            status="needs-work"
            notes="Partner logo grid uses placeholder images. Social links are not wired to real URLs."
          >
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Footer />
            </div>
          </ShowcaseSection>

          {/* ─── HOME SECTIONS ─── */}
          <ShowcaseSection
            id="hero"
            title="Hero Section"
            status="needs-work"
            notes="Floating cards use placeholder icons. Member avatars are placeholders. Copy is lorem ipsum in JSON."
          >
            <div className="scale-75 origin-top-left w-[133%]">
              <HeroSection data={heroData} />
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="features"
            title="Feature Section"
            status="needs-work"
            notes="Feature images are placeholder SVGs. No real benchmark data shown."
          >
            <FeatureSection data={featureData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="services"
            title="Services Section"
            status="needs-work"
            notes="Icons are generic. Service descriptions are placeholder copy."
          >
            <ServicesSection data={serviceData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="case-study"
            title="Case Study"
            status="needs-work"
            notes="No real case study exists yet. Metrics are hardcoded, not from a CMS."
          >
            <CaseStudySection data={caseStudyData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="cta"
            title="CTA Section"
            status="built"
            notes="Structure is solid. Needs real copy and final CTA destination URLs."
          >
            <CTASection data={ctaData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-1"
            title="Pricing Section 1 (Split Image)"
            status="needs-work"
            notes="Image placeholder. Pricing figures not connected to real pricing data source."
          >
            <PricingSection1 data={pricingSection1Data} />
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-2"
            title="Pricing Section 2 (Managed Illustration)"
            status="needs-work"
            notes="Illustration placeholder. Feature list copy is generic."
          >
            <PricingSection2 data={pricingSection2Data} />
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-3"
            title="Pricing Section 3 (VPS Split)"
            status="needs-work"
            notes="Same structural issues as Pricing 1. Consider consolidating into one configurable component."
          >
            <PricingSection3 data={pricingSection3Data} />
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-4"
            title="Pricing Section 4 (Feature List)"
            status="needs-work"
            notes="No pricing figures shown. Missing CTA button."
          >
            <PricingSection4 data={pricingSection4Data} />
          </ShowcaseSection>

          <ShowcaseSection
            id="pricing-journey"
            title="Pricing Journey (Tier Slider)"
            status="needs-work"
            notes="Slider is client-side only. Not accessible via keyboard. No ARIA labels."
          >
            <PricingJourney data={pricingJourneyData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="testimonials"
            title="Testimonials"
            status="needs-work"
            notes="All testimonials are placeholder data. No LinkedIn links. No headshots. Critical trust gap."
          >
            <TestimonialsSection data={testimonialsData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="faq"
            title="FAQ Section"
            status="needs-work"
            notes="Accordion works. Categories need real Q&A content. FAQPage JSON-LD schema not wired up."
          >
            <FAQSection data={faqData} />
          </ShowcaseSection>

          <ShowcaseSection
            id="teams"
            title="Teams Section"
            status="needs-work"
            notes="No real team photos. LinkedIn links missing. Bio copy is placeholder."
          >
            <TeamsSection data={teamsData} />
          </ShowcaseSection>

          {/* ─── SEO ─── */}
          <ShowcaseSection
            id="json-ld"
            title="JsonLd"
            status="built"
            notes="Outputs inline script tag. Verify schema markup with Google Rich Results Test."
          >
            <p className="text-sm text-slate-500 mb-3">JsonLd injects a script tag — no visual output. Example schema passed:</p>
            <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-4 rounded overflow-auto">
              {JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "DronaHost", url: "https://dronahost.com" }, null, 2)}
            </pre>
            <JsonLd schema={{ "@context": "https://schema.org", "@type": "Organization", name: "DronaHost", url: "https://dronahost.com" }} />
          </ShowcaseSection>

          {/* ─── TRUST & CONVERSION ─── */}
          <ShowcaseSection
            id="trust-badges"
            title="Trust Badges"
            status="missing"
            notes="Not built. Required before launch: Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot badges."
          >
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-red-200 rounded-lg">
              <p className="text-sm text-red-400">Component not yet built — see ui-fix-plan.md for priority.</p>
            </div>
          </ShowcaseSection>

          <ShowcaseSection
            id="uptime-bar"
            title="Uptime / Stats Bar"
            status="missing"
            notes="Not built. Should show live uptime %, avg TTFB, response time. Feeds from /api/stats or a status page."
          >
            <div className="flex items-center justify-center h-24 border-2 border-dashed border-red-200 rounded-lg">
              <p className="text-sm text-red-400">Component not yet built — see ui-fix-plan.md for priority.</p>
            </div>
          </ShowcaseSection>

        </main>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start dev server and verify the page loads**

```bash
npm run dev
```

Open `http://localhost:3000/v2` in a browser.

Expected:
- Top bar visible with "DronaHost Component Library" and amber `NODE_ENV: development` badge
- Sidebar visible with all categories
- All components render (some may show image 404s — that is expected for placeholder image paths)
- No React hydration errors in browser console

- [ ] **Step 3: Fix any TypeScript errors from prop mismatches**

Run: `npx tsc --noEmit`

If prop fields in `_data/dummy.ts` don't match what a component expects, the error will name the field. Fix the field name in `dummy.ts` to match the component's TypeScript interface. Do NOT change the component itself.

- [ ] **Step 4: Verify production guard**

```bash
npm run build && NODE_ENV=production node .next/standalone/server.js
```

Open `http://localhost:3000/v2` — expected: 404 page.

- [ ] **Step 5: Commit**

```bash
git add app/(dev)/v2/page.tsx app/(dev)/v2/_data/dummy.ts
git commit -m "feat: add /v2 component showcase page with dev guard"
```

---

## Task 8: Write `docs/ui-fix-plan.md`

**Files:**
- Create: `docs/ui-fix-plan.md`

- [ ] **Step 1: Create the file**

Create `docs/ui-fix-plan.md`:

```markdown
# DronaHost UI Fix Plan

> Last updated: 2026-04-19
> Update this file as components are fixed. Use /v2 to visually verify status changes.

## Status Legend
- ✅ Built & good
- ⚠️ Built but needs work
- ❌ Missing entirely

## Priority Legend
- 🔴 Critical — blocks launch or destroys trust
- 🟠 High — needed before content phase begins
- 🟡 Medium — polish, improve later
- 🟢 Low — nice to have

---

## 1. Layout

| Component | Status | Issue | Priority |
|---|---|---|---|
| Section | ✅ | Comprehensive variant system, well-structured | — |
| GradientBackground | ⚠️ | 10+ variants with no internal documentation; hard to pick the right one | 🟡 |

---

## 2. Typography

| Component | Status | Issue | Priority |
|---|---|---|---|
| HeadLineText | ⚠️ | Font size jumps abruptly on tablet (768px–1024px) — no `clamp()` interpolation | 🟡 |

---

## 3. Cards

| Component | Status | Issue | Priority |
|---|---|---|---|
| GridCard | ⚠️ | Border logic correct on desktop; missing hover/focus styles on mobile touch devices | 🟢 |
| ResourceCard | ✅ | Works correctly in blog/KB context | — |
| ResourceBox | ✅ | Works correctly in blog/KB context | — |

---

## 4. Buttons & Forms

| Component | Status | Issue | Priority |
|---|---|---|---|
| Primary Button | ⚠️ | No disabled state styling. No loading/spinner state. | 🟠 |
| Secondary Button | ⚠️ | No disabled state styling. No loading/spinner state. | 🟠 |
| Destructive Button | ❌ | Not built — needed for delete/cancel actions in account dashboard | 🟡 |
| Contact Form | ⚠️ | Embedded in /contact page only — not a reusable component. No loading or success state. | 🟠 |

---

## 5. Navigation

| Component | Status | Issue | Priority |
|---|---|---|---|
| Header | ⚠️ | Mobile hamburger menu not implemented — nav completely hidden on mobile | 🔴 |
| Mega Menu | ⚠️ | No keyboard navigation (arrow keys, Escape). Not accessible. | 🟠 |
| Footer | ⚠️ | Partner logos are placeholder images. Social links point nowhere. | 🟠 |

---

## 6. Home Sections

| Component | Status | Issue | Priority |
|---|---|---|---|
| Hero Section | ⚠️ | Floating card icons placeholder. Member avatars placeholder. Copy lorem ipsum in JSON. | 🔴 |
| Feature Section | ⚠️ | Feature images are placeholder SVGs. No real benchmark data. | 🟠 |
| Services Section | ⚠️ | Icons generic. Descriptions are placeholder copy. | 🟠 |
| Case Study | ⚠️ | No real case study. Metrics hardcoded. Image placeholder. | 🟠 |
| CTA Section | ✅ | Structure solid. Needs real copy + final CTA URLs. | — |
| Pricing Section 1 | ⚠️ | Image placeholder. Prices not from real pricing data source. | 🟠 |
| Pricing Section 2 | ⚠️ | Illustration placeholder. Feature copy generic. | 🟡 |
| Pricing Section 3 | ⚠️ | Same issues as Pricing 1. Consider consolidating 1+3 into one configurable component. | 🟡 |
| Pricing Section 4 | ⚠️ | No pricing figures. Missing CTA button. | 🟠 |
| Pricing Journey | ⚠️ | Slider not keyboard accessible. No ARIA labels. | 🟠 |
| Testimonials | ⚠️ | All placeholder data. No LinkedIn links. No real headshots. **Western buyers will notice.** | 🔴 |
| FAQ Section | ⚠️ | Accordion works. Content all placeholder. FAQPage JSON-LD schema not connected. | 🟠 |
| Teams Section | ⚠️ | No real photos. LinkedIn links missing. Bio copy placeholder. | 🟠 |

---

## 7. Trust & Conversion

| Component | Status | Issue | Priority |
|---|---|---|---|
| Trust Badges | ❌ | Not built. Required: Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot | 🔴 |
| Uptime / Stats Bar | ❌ | Not built. Should surface live uptime %, TTFB, support response time | 🔴 |
| Logo Wall | ⚠️ | Exists in footer. All logos are placeholder. No real partner brands. | 🔴 |
| Review Score Widget | ❌ | Not built. Trustpilot / G2 / HostAdvice score display needed on homepage | 🟠 |

---

## 8. SEO Components

| Component | Status | Issue | Priority |
|---|---|---|---|
| JsonLd | ✅ | Works correctly. Verify output with Google Rich Results Test after content is real. | — |
| Breadcrumbs | ⚠️ | Component exists in /components/seo but not wired on all inner pages | 🟠 |

---

## 9. Build-Next Priority Order

Work through this list in order before moving to the content phase:

1. 🔴 **Mobile hamburger menu** — site is completely broken on mobile without this
2. 🔴 **Real testimonials** — replace all placeholder data with verified customer quotes
3. 🔴 **Trust Badges component** — Stripe, PayPal, Let's Encrypt, Cloudflare logos
4. 🔴 **Uptime / Stats Bar component** — live or static uptime %, TTFB, response time
5. 🔴 **Real logo wall** — get permission from 5–8 clients to use their logo
6. 🟠 **Button disabled + loading states** — needed before any form goes live
7. 🟠 **Contact Form as reusable component** — extract from /contact page
8. 🟠 **Mega menu keyboard navigation** — WCAG 2.1 AA requirement
9. 🟠 **Pricing sections → real data source** — connect to pricing JSON/CMS
10. 🟠 **FAQ JSON-LD schema** — wire FAQPage schema to FAQ section
11. 🟠 **Breadcrumbs on all inner pages** — SEO + UX
12. 🟠 **PricingSection 1+3 consolidation** — DRY, reduces maintenance burden
13. 🟡 **HeadLineText fluid sizing** — clamp() between breakpoints
14. 🟡 **GradientBackground variant docs** — internal dev quality
15. 🟢 **GridCard mobile hover states** — polish
```

- [ ] **Step 2: Commit**

```bash
git add docs/ui-fix-plan.md
git commit -m "docs: add UI fix plan with component status and priority order"
```

---

## Self-Review Checklist

- [x] All spec requirements covered: `/v2` page, dev guard, robots.txt, sidebar, status badges, `docs/ui-fix-plan.md`
- [x] No TBDs or placeholder steps — all code blocks are complete
- [x] Type names consistent: `Status` used in `StatusBadge` and `ShowcaseSection` throughout
- [x] Exact file paths in every task
- [x] Commit after every task
- [x] `(dev)` layout intentionally duplicates `<html><body>` — explained in Task 2 note
- [x] Dummy data field names may need adjustment to match component interfaces — Task 7 Step 3 covers this
