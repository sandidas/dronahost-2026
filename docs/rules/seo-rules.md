# DronaHost — SEO Rules

> Goal: rank #1 across every surface — Google search, Google AI Overviews, ChatGPT, Perplexity, Claude, Gemini, Bing, LinkedIn, Reddit, YouTube.
> This document covers all five disciplines: **SEO** (technical + on-page + off-page) · **AEO** (answer engines / featured snippets) · **GEO** (generative engines / AI Overviews) · **LLM optimization** (AI tool citations) · **Social SEO**.
> Copy rules (title format, meta descriptions, keyword strategy, content length, E-E-A-T, FAQ writing): `docs/rules/content-writing-rules.md` §7.

---

## Table of Contents

1. [Metadata Implementation](#1-metadata-implementation)
2. [JSON-LD Structured Data](#2-json-ld-structured-data)
3. [Sitemap, Robots & Crawl Control](#3-sitemap-robots--crawl-control)
4. [International SEO](#4-international-seo)
5. [Core Web Vitals](#5-core-web-vitals)
6. [Crawl Budget & Indexability](#6-crawl-budget--indexability)
7. [AEO — Answer Engine Optimization](#7-aeo--answer-engine-optimization)
8. [GEO — Generative Engine Optimization](#8-geo--generative-engine-optimization)
9. [LLM Optimization](#9-llm-optimization)
10. [Social SEO](#10-social-seo)
11. [Off-Page SEO Strategy](#11-off-page-seo-strategy)
12. [SEO Monitoring & Tooling](#12-seo-monitoring--tooling)
13. [Pre-Ship Checklists](#13-pre-ship-checklists)

---

## 1. Metadata Implementation

### The helper — use it everywhere

All metadata flows through `lib/seo/metadata.ts`. Never construct metadata objects inline in pages.

```ts
// lib/seo/metadata.ts
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME } from "./config";

export interface BuildMetadataInput {
  title: string;           // page-specific portion only — helper appends " — DronaHost"
  description: string;     // 140–160 chars
  path: string;            // e.g. "/wordpress-hosting"
  ogImage?: string;        // absolute URL; defaults to /og/default.jpg
  noIndex?: boolean;
  noFollow?: boolean;
  type?: "website" | "article";
  publishedTime?: string;  // ISO 8601 — article only
  modifiedTime?: string;   // ISO 8601 — article only
  authors?: string[];      // article only
  hreflang?: { locale: string; url: string }[];
  keywords?: string[];     // used for AI crawlers that still read meta keywords
}

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const canonical = `${SITE_URL}${input.path}`;
  const ogImage = input.ogImage ?? `${SITE_URL}/og/default.jpg`;
  const fullTitle = `${input.title} — ${SITE_NAME}`;

  return {
    title: fullTitle,
    description: input.description,
    keywords: input.keywords,
    alternates: {
      canonical,
      languages: Object.fromEntries(
        (input.hreflang ?? []).map(({ locale, url }) => [locale, url])
      ),
    },
    openGraph: {
      title: fullTitle,
      description: input.description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: fullTitle }],
      locale: "en_US",
      type: input.type ?? "website",
      ...(input.type === "article" && {
        publishedTime: input.publishedTime,
        modifiedTime: input.modifiedTime,
        authors: input.authors,
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: input.description,
      images: [ogImage],
      site: "@dronahost",
      creator: "@dronahost",
    },
    robots: {
      index: !input.noIndex,
      follow: !input.noFollow,
      googleBot: {
        index: !input.noIndex,
        follow: !input.noFollow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}
```

### Static pages

```ts
export const metadata = buildMetadata({
  title: "Managed WordPress Hosting — LiteSpeed + NVMe",
  description: "LiteSpeed + NVMe with 200ms TTFB. Free migration, daily backups, 99.95% uptime SLA. From $5/month.",
  path: "/wordpress-hosting",
  keywords: ["wordpress hosting", "managed wordpress", "litespeed wordpress", "wordpress hosting uk"],
  hreflang: [
    { locale: "en-US", url: "https://dronahost.com/en-us/wordpress-hosting" },
    { locale: "en-GB", url: "https://dronahost.com/en-gb/wordpress-hosting" },
    { locale: "en-AE", url: "https://dronahost.com/en-ae/wordpress-hosting" },
    { locale: "x-default", url: "https://dronahost.com/wordpress-hosting" },
  ],
});
```

### Dynamic pages

```ts
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogImage: post.coverImage ?? undefined,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt?.toISOString(),
    authors: [post.author.name],
  });
}
```

### Required fields — no exceptions

| Field | Rule |
|---|---|
| `title` | 50–60 chars total. Unique. Keyword first. |
| `description` | 140–160 chars. Unique. Primary keyword + outcome + CTA. |
| `canonical` | Absolute URL. No trailing slash. HTTPS always. |
| `openGraph.images` | 1200×630px. Stored in `/public/og/`. One per page or use default. |
| `twitter.site` | `@dronahost` on every page — enables Twitter card eligibility. |
| `robots` | Explicit on every page. Default: index + follow. |
| `hreflang` | Required on every page once locales are live. |

### OG image strategy

Every major page needs a unique OG image — not a logo on white. OG images drive click-through on LinkedIn, Twitter/X, WhatsApp, Slack shares.

| Page type | OG image content |
|---|---|
| Homepage | Headline + tagline + DronaHost wordmark on brand background |
| Hosting plans | Plan name + starting price + 3 key features + wordmark |
| Blog posts | Post title (large text) + author name + category tag |
| `/vs/[competitor]` | "DronaHost vs [Competitor]" with logos side by side |
| Regional pages | City/country name + datacenter callout + wordmark |

Store at `/public/og/[page-slug].jpg`. Generate with `@vercel/og` or Satori for dynamic blog OGs.

### Pages that must be noindexed

| Path | Reason |
|---|---|
| `/api/*` | Route Handlers — not pages |
| `/admin/*` | Internal tooling |
| `/account/*` | Authenticated — no SEO value |
| `/checkout/*` | Transactional |
| `/thank-you` | Post-conversion |
| `/v2` | Dev showcase |
| `?page=N` paginated URLs | Canonicalise to page 1 |
| `/search?q=*` | Canonicalise to `/kb` |

---

## 2. JSON-LD Structured Data

### Rules

- Inline `<script type="application/ld+json">` in Server Components only — never `next/script` (defers; crawlers miss it)
- Use `JsonLd` component — never raw `<script>` in page files
- Validate every schema at `validator.schema.org` before shipping
- Multiple schemas on one page: render multiple `<JsonLd>` calls, or use a `@graph` array

```tsx
// components/sections/JsonLd.tsx
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

---

### Organization — homepage

```ts
export function orgSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DronaHost",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/dronaHost-logo.svg`,
    foundingDate: "2022",
    address: { "@type": "PostalAddress", addressCountry: "IN" },
    sameAs: [
      "https://twitter.com/dronahost",
      "https://linkedin.com/company/dronahost",
      "https://www.trustpilot.com/review/dronahost.com",
      "https://g2.com/products/dronahost",
    ],
    contactPoint: [{
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English"],
      areaServed: ["US", "GB", "AE", "DE", "NL", "FR", "IE"],
    }],
  };
}
```

### WebSite — homepage (enables Sitelinks Search Box)

```ts
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "DronaHost",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/kb?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}
```

### BreadcrumbList — every page except homepage

```ts
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
```

### Product + Offer + AggregateRating — hosting plan pages

```ts
export function productSchema(plan: {
  name: string; description: string; url: string;
  price: string; priceCurrency: string; priceValidUntil: string;
  ratingValue: string; reviewCount: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plan.name,
    description: plan.description,
    url: plan.url,
    brand: { "@type": "Brand", name: "DronaHost" },
    offers: {
      "@type": "Offer",
      price: plan.price,
      priceCurrency: plan.priceCurrency,
      priceValidUntil: plan.priceValidUntil,
      availability: "https://schema.org/InStock",
      url: plan.url,
      seller: { "@type": "Organization", name: "DronaHost" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: plan.ratingValue,
      reviewCount: plan.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}
```

### Review — individual testimonials on product pages

```ts
export function reviewSchema(review: {
  author: string; rating: number; body: string; datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    author: { "@type": "Person", name: review.author },
    reviewRating: { "@type": "Rating", ratingValue: review.rating, bestRating: 5 },
    reviewBody: review.body,
    datePublished: review.datePublished,
    itemReviewed: { "@type": "Organization", name: "DronaHost" },
  };
}
```

### BlogPosting — blog post pages

```ts
export function blogPostSchema(post: {
  title: string; excerpt: string; slug: string; coverImage?: string;
  publishedAt: Date; updatedAt: Date;
  author: { name: string; bio?: string; avatar?: string; url?: string };
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage ?? `${SITE_URL}/og/default.jpg`,
    inLanguage: "en-US",
    author: {
      "@type": "Person",
      name: post.author.name,
      description: post.author.bio,
      image: post.author.avatar,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "DronaHost",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/dronaHost-logo.svg` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
  };
}
```

### FAQPage — product, service, and comparison pages

```ts
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
```

### HowTo — tutorial blog posts

Use when a post is a step-by-step guide. Triggers rich result in Google and is cited heavily by AI tools.

```ts
export function howToSchema(data: {
  name: string; description: string; totalTime: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.name,
    description: data.description,
    totalTime: data.totalTime, // ISO 8601 duration e.g. "PT30M"
    step: data.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}
```

### Service — service pages

```ts
export function serviceSchema(service: {
  name: string; description: string; url: string; areaServed: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    url: service.url,
    provider: { "@type": "Organization", name: "DronaHost", url: SITE_URL },
    areaServed: service.areaServed.map((c) => ({ "@type": "Country", name: c })),
  };
}
```

### Person — author pages / team pages

```ts
export function personSchema(person: {
  name: string; jobTitle: string; bio: string;
  image: string; url: string; sameAs?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.jobTitle,
    description: person.bio,
    image: person.image,
    url: person.url,
    worksFor: { "@type": "Organization", name: "DronaHost", url: SITE_URL },
    sameAs: person.sameAs ?? [],
  };
}
```

### Schema per page type — quick reference

| Page | Required schemas |
|---|---|
| `/` | `Organization` + `WebSite` |
| `/wordpress-hosting` | `Product` + `Offer` + `AggregateRating` + `Review[]` + `BreadcrumbList` + `FAQPage` |
| `/vps-hosting` | Same as WordPress hosting |
| `/cloud-hosting` | Same as VPS |
| `/business-hosting` | Same as VPS |
| `/hosting/[region]` | `Product` + `Offer` + `BreadcrumbList` + `FAQPage` |
| `/pricing` | `BreadcrumbList` |
| `/web-design` | `Service` + `BreadcrumbList` + `FAQPage` |
| `/seo-services` | `Service` + `BreadcrumbList` + `FAQPage` |
| `/growth-services` | `Service` + `BreadcrumbList` + `FAQPage` |
| `/domains` | `Service` + `BreadcrumbList` + `FAQPage` |
| `/blog` | `BreadcrumbList` |
| `/blog/[slug]` (article) | `BlogPosting` + `BreadcrumbList` |
| `/blog/[slug]` (tutorial) | `BlogPosting` + `HowTo` + `BreadcrumbList` |
| `/vs/[competitor]` | `Article` + `BreadcrumbList` + `FAQPage` |
| `/contact` | `Organization` (with contactPoint) + `BreadcrumbList` |
| `/about` | `Organization` + `Person[]` (team) + `BreadcrumbList` |
| `/kb/*` | `Article` + `BreadcrumbList` |

---

## 3. Sitemap, Robots & Crawl Control

### `app/sitemap.ts`

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";
import connectToDatabase from "@/lib/mongodb";
import Post from "@/lib/models/post";

const STATIC_PAGES: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`,                     changeFrequency: "weekly",  priority: 1.0 },
  { url: `${SITE_URL}/wordpress-hosting`,    changeFrequency: "weekly",  priority: 0.9 },
  { url: `${SITE_URL}/vps-hosting`,          changeFrequency: "weekly",  priority: 0.9 },
  { url: `${SITE_URL}/cloud-hosting`,        changeFrequency: "weekly",  priority: 0.9 },
  { url: `${SITE_URL}/business-hosting`,     changeFrequency: "weekly",  priority: 0.9 },
  { url: `${SITE_URL}/domains`,              changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/web-design`,           changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/seo-services`,         changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/growth-services`,      changeFrequency: "monthly", priority: 0.7 },
  { url: `${SITE_URL}/pricing`,              changeFrequency: "weekly",  priority: 0.8 },
  { url: `${SITE_URL}/hosting/us`,           changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/hosting/uk`,           changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/hosting/eu`,           changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/hosting/uae`,          changeFrequency: "monthly", priority: 0.8 },
  { url: `${SITE_URL}/blog`,                 changeFrequency: "daily",   priority: 0.7 },
  { url: `${SITE_URL}/about`,               changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/contact`,             changeFrequency: "monthly", priority: 0.6 },
  { url: `${SITE_URL}/security`,            changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/sla`,                 changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/refund-policy`,       changeFrequency: "monthly", priority: 0.4 },
  { url: `${SITE_URL}/privacy`,             changeFrequency: "monthly", priority: 0.4 },
  { url: `${SITE_URL}/terms`,              changeFrequency: "monthly", priority: 0.4 },
  { url: `${SITE_URL}/data-processing`,     changeFrequency: "monthly", priority: 0.4 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const posts = await Post.find({ status: "published", deletedAt: null })
      .select("slug updatedAt")
      .lean()
      .limit(500);
    blogEntries = posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.updatedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // Fail gracefully at build time if DB is unreachable
  }
  return [...STATIC_PAGES, ...blogEntries];
}
```

### `app/robots.ts` — with AI bot control

```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Allow all crawlers including AI bots — we WANT to be cited
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/account/", "/checkout/", "/v2"],
      },
      // Explicitly allow major AI crawlers — belt-and-suspenders
      { userAgent: "GPTBot",        allow: "/" },
      { userAgent: "ClaudeBot",     allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Googlebot",     allow: "/" },
      { userAgent: "Bingbot",       allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
```

**Never block AI crawlers.** GPTBot, ClaudeBot, PerplexityBot are how ChatGPT, Claude, and Perplexity index your content. Blocking them means you will never be cited.

### Sitemap submission

| Where | When |
|---|---|
| Google Search Console | On launch; re-submit after 10+ URL changes |
| Bing Webmaster Tools | On launch; Bing auto-discovers subsequent updates |
| IndexNow (Bing + Yandex + others) | Ping on every new/updated URL programmatically |

**IndexNow** is faster than waiting for Googlebot — implement it in the CMS publish flow:

```ts
// Call after any blog post publish or update
await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    host: "dronahost.com",
    key: process.env.INDEXNOW_KEY,
    urlList: [`${SITE_URL}/blog/${slug}`],
  }),
});
```

---

## 4. International SEO

### Hreflang — every localized page

```ts
hreflang: [
  { locale: "en-US", url: "https://dronahost.com/en-us/wordpress-hosting" },
  { locale: "en-GB", url: "https://dronahost.com/en-gb/wordpress-hosting" },
  { locale: "en-AE", url: "https://dronahost.com/en-ae/wordpress-hosting" },
  { locale: "de-DE", url: "https://dronahost.com/de-de/wordpress-hosting" }, // phase 2
  { locale: "fr-FR", url: "https://dronahost.com/fr-fr/wordpress-hosting" }, // phase 2
  { locale: "nl-NL", url: "https://dronahost.com/nl-nl/wordpress-hosting" }, // phase 2
  { locale: "ar-AE", url: "https://dronahost.com/ar-ae/wordpress-hosting" }, // phase 2
  { locale: "x-default", url: "https://dronahost.com/wordpress-hosting" },  // required
]
```

`x-default` is mandatory. Always points to the base non-prefixed URL.

### URL structure

```
/wordpress-hosting              — en-US default (canonical)
/en-gb/wordpress-hosting        — UK
/en-ae/wordpress-hosting        — UAE
/de-de/wordpress-hosting        — German (phase 2)
```

Do not use query strings for locale (`?lang=en-gb`) — path segments are the only reliable hreflang approach.

### Regional pages — SEO requirements

Each `/hosting/[region]` page must have:

| Element | Requirement |
|---|---|
| Unique `<h1>` | Region keyword (e.g. "WordPress Hosting on UK Servers") |
| Unique body copy | Region-specific pain points, compliance, testimonials |
| Currency | USD / GBP / EUR / AED — never INR as default |
| TTFB callout | Latency figures from major cities in that region |
| GDPR callout | EU + UK pages must state data residency explicitly |
| Testimonial | At least one from that region |
| Hreflang | All locale-prefixed equivalents |

### Google Search Console

- `.com` without country targeting — "All regions" for international
- Separate GSC property per locale path once i18n is live: `dronahost.com/en-gb/`
- Submit locale-specific sitemaps per property

---

## 5. Core Web Vitals

Google uses CWV as a ranking signal. Passing them is a competitive differentiator in tight ranking battles.

### Targets

| Metric | Pass threshold | Our target |
|---|---|---|
| LCP (Largest Contentful Paint) | < 2.5s | < 1.5s from London/New York/Dubai on 4G |
| INP (Interaction to Next Paint) | < 200ms | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |

### LCP fixes

| Cause | Fix |
|---|---|
| Large hero image | `next/image` with `priority` + explicit dimensions; serve AVIF/WebP |
| Hero image lazy-loaded | Add `priority` prop — removes `loading="lazy"`, adds `<link rel="preload">` |
| Render-blocking font | `next/font` with `display: swap`; Latin subset only |
| Slow TTFB | Cloudflare edge cache: `s-maxage=60, stale-while-revalidate=300` |
| Large JS before paint | Move components to `next/dynamic` with `ssr: false` |

```tsx
<Image
  src="/hero/wordpress-hosting.avif"
  alt="LiteSpeed WordPress hosting on NVMe storage"
  width={1200} height={600}
  priority
  sizes="100vw"
/>
```

### CLS fixes

| Cause | Fix |
|---|---|
| Images without dimensions | Always `width` + `height` on `next/image` |
| Font FOUT | `next/font` with `display: swap` + `adjustFontFallback: true` |
| Cookie banner shifts layout | `position: fixed` — never in document flow |
| Chat widget shifts layout | `position: fixed` — load after idle |
| Dynamic content above fold | Reserve space with `min-height` + skeleton |

### INP fixes

| Cause | Fix |
|---|---|
| Heavy main-thread JS on click | `useCallback` / `useMemo`; defer >50ms work to Web Worker |
| Cascading React re-renders | Split state; profile with React DevTools |
| Third-party scripts on input | Load analytics + chat with `strategy="lazyOnload"` |
| Large hydration payload | Default to Server Components; avoid `"use client"` on heavy trees |

### CWV monitoring

- **RUM**: Cloudflare Web Analytics (free, GDPR-compliant, no cookie consent needed)
- **Lab**: Lighthouse in CI on every PR; PageSpeed Insights on every new page before shipping
- **Field**: Google Search Console → Core Web Vitals report (available ~28 days after launch)

---

## 6. Crawl Budget & Indexability

### What to block (robots.ts)

```
/api/*      /admin/*      /account/*      /checkout/*      /v2
```

### What to noindex (metadata, not robots)

```
/thank-you          — post-conversion, no SEO value
/search?q=*         — canonicalise to /kb
?page=2, ?page=3    — canonicalise each paginated page to itself; priority 0.3 in sitemap
```

### Canonical rules

| Rule | Correct form |
|---|---|
| No trailing slash | `/wordpress-hosting` not `/wordpress-hosting/` |
| No query strings | `/pricing` not `/pricing?ref=menu` |
| Absolute URL | `https://dronahost.com/…` never `/wordpress-hosting` |
| HTTPS always | Never `http://` |
| Locale pages self-canonical | `/en-gb/wordpress-hosting` canonical = itself |

### Redirect rules

| Situation | Solution |
|---|---|
| Old URL → new URL | 301 in `next.config.js` redirects |
| HTTP → HTTPS | Cloudflare / Nginx — never Next.js |
| Trailing slash → no slash | `trailingSlash: false` in `next.config.js` |
| www → non-www | Cloudflare page rule |

```js
// next.config.js
module.exports = {
  trailingSlash: false,
  async redirects() {
    return [
      { source: "/wordpress", destination: "/wordpress-hosting", permanent: true },
    ];
  },
};
```

---

## 7. AEO — Answer Engine Optimization

AEO targets Google's direct answer features: **Featured Snippets**, **People Also Ask (PAA)**, **Knowledge Panel**, and **Sitelinks**. Winning these means appearing above position #1.

### Featured Snippets

Google pulls featured snippets from pages already ranking in positions 1–10. Winning a snippet moves you to "position 0".

**Snippet types and how to trigger each:**

| Snippet type | Content format | Example trigger |
|---|---|---|
| Paragraph (definition) | 40–60 word direct answer immediately after an `<h2>` | "What is managed WordPress hosting?" |
| Numbered list | `<ol>` with 5–8 items; each item < 20 words | "How to migrate WordPress to a new host" |
| Table | `<table>` with header row; 3–5 columns | "WordPress hosting prices comparison" |
| Step-by-step | Numbered `<ol>` with bold step names + explanation | "How to install WordPress on DronaHost" |

**Implementation rule:**

Every `<h2>` that could trigger a featured snippet must be immediately followed by a direct answer block — before any supporting detail:

```html
<!-- GOOD — direct answer first -->
<h2>How much does WordPress hosting cost at DronaHost?</h2>
<p>
  DronaHost WordPress hosting starts at $5/month (billed annually) for the Starter plan,
  which includes 10 GB NVMe storage, free SSL, and daily backups. Business plans start
  at $15/month and include priority support and staging environments.
</p>
<p><!-- supporting detail follows --> All plans include ... </p>

<!-- BAD — detail before the answer -->
<h2>WordPress Hosting Pricing</h2>
<p>Choosing the right hosting plan depends on your traffic, storage needs, and...</p>
```

### People Also Ask (PAA)

PAA boxes appear in almost every informational query. Appearing in PAA gives additional SERP real estate without ranking position changes.

**How to target PAA:**

1. Research the PAA questions for your target keywords using Ahrefs, Semrush, or just manual Google search
2. Create a dedicated FAQ section on every product/service page
3. Phrase each FAQ question exactly as a user would type it
4. Answer in 40–60 words, declarative prose, first sentence restates the answer

**PAA target questions per page:**

| Page | PAA questions to target |
|---|---|
| `/wordpress-hosting` | "Is managed WordPress hosting worth it?", "What is the difference between shared and managed WordPress hosting?", "Does DronaHost include free WordPress migration?" |
| `/vps-hosting` | "What is a VPS used for?", "How much RAM do I need for a VPS?", "Is VPS hosting faster than shared hosting?" |
| `/vs/siteground` | "Is DronaHost better than SiteGround?", "Why is SiteGround so expensive at renewal?", "What is a good alternative to SiteGround?" |
| Blog posts | Dynamically — check Google's PAA for each post's target keyword |

### Google Knowledge Panel

A Knowledge Panel appears on branded searches ("DronaHost review", "DronaHost hosting"). It pulls from Google's Knowledge Graph.

**How to influence it:**

1. Keep `Organization` schema consistent and complete (founding date, address, logo, sameAs links)
2. Claim and fully complete Google Business Profile
3. Maintain consistent NAP (Name, Address, Phone) across all directories
4. Have an active Wikipedia page or Wikidata entry (long-term — needs press coverage first)
5. Ensure your social profiles (`sameAs`) are fully filled out with consistent brand name

### Sitelinks

Google shows sitelinks beneath your homepage result for branded queries. They are algorithmically chosen — you cannot add them, but you can influence them:

- Strong internal linking signals which pages are most important
- Clear navigation labels in `<nav>` help Googlebot understand site structure
- `WebSite` schema with `SearchAction` enables the sitelinks search box

---

## 8. GEO — Generative Engine Optimization

GEO targets **Google AI Overviews** (formerly Search Generative Experience / SGE). AI Overviews appear above all organic results for many commercial and informational queries.

### What triggers an AI Overview

Google AI Overviews appear when:
- The query is informational or comparative ("best wordpress hosting uk", "siteground vs dronahost")
- The query has a clear answer that can be synthesised from multiple sources
- There is enough E-E-A-T signal that Google trusts the sources

### How to appear in AI Overviews

**The fundamental requirement:** your page must already rank in the top 10 organically. AI Overviews predominantly cite pages that Google already trusts. SEO comes first.

**Content formatting for AI Overviews:**

| Rule | Why |
|---|---|
| Server-rendered HTML only | Google's AI does not execute JavaScript for AI Overview source selection |
| Direct answer in first 100 words | AI Overview pulls the opening answer, not buried detail |
| Factual, specific claims with numbers | AI prefers citable specifics: "200ms TTFB" beats "fast loading" |
| Short paragraphs (3–4 sentences max) | AI synthesises paragraphs, not long blocks |
| Comparison tables with real data | Frequently cited in comparative AI Overviews |
| FAQ sections in declarative prose | AI Overviews heavily cite FAQ content |
| `dateModified` in schema | Freshness signal — outdated pages are deprioritised |

**Page structure for GEO:**

```
H1: [Target keyword — specific]
[Direct answer paragraph — 60–80 words, includes the key facts]
[Supporting section H2s with direct answer blocks]
[Comparison table if applicable]
[FAQ section — minimum 5 questions, declarative prose answers]
[Author bio with credentials]
```

### What hurts GEO ranking

- Pages that require JavaScript to render content
- Thin content (< 800 words for commercial pages)
- Superlative-heavy copy without evidence ("the best", "world-class")
- Missing `datePublished` / `dateModified` schema
- No E-E-A-T signals (anonymous content, no author bio)
- Paywalled content above the fold

### Comparison pages — highest GEO leverage

`/vs/[competitor]` pages are among the highest-cited sources in AI Overviews for commercial queries. Every comparison page must have:

- Real benchmark data (speed, uptime, support response time, renewal price)
- A clear comparison table
- A fair, honest assessment — AI tools detect and downweight obviously biased content
- A `dateModified` in schema updated whenever data changes
- `Article` + `FAQPage` JSON-LD

---

## 9. LLM Optimization

LLM optimization targets being cited by **ChatGPT** (via Bing), **Perplexity**, **Claude**, **Gemini**, and emerging AI assistants. These tools are increasingly the first place Western buyers research hosting options.

### How each AI tool indexes content

| AI Tool | Index source | Crawl bot | Key signal |
|---|---|---|---|
| ChatGPT (browsing) | Bing index | GPTBot | Bing ranking + freshness |
| ChatGPT (training) | Common Crawl + curated | GPTBot | Authority + E-E-A-T |
| Perplexity | Own crawler + Bing | PerplexityBot | Authority + direct answers |
| Google Gemini | Google index | Googlebot | Google ranking + Knowledge Graph |
| Claude (search) | Web search | ClaudeBot | Bing + Google ranking |
| Microsoft Copilot | Bing index | Bingbot | Bing ranking |

**The single most important rule: rank on Google and Bing. LLM citation follows organic ranking.**

### llms.txt — machine-readable site index

`/public/llms.txt` is a plain-text file that tells LLM crawlers which pages contain your best content. It is the `robots.txt` for AI tools.

```
# llms.txt — DronaHost
# https://dronahost.com/llms.txt

## DronaHost

DronaHost is a web hosting and web design company serving the USA, UK, UAE, and Europe.
We offer managed WordPress hosting, VPS hosting, cloud hosting, domain registration,
website design, and SEO services.

## Core pages

- https://dronahost.com/ : Homepage
- https://dronahost.com/wordpress-hosting : Managed WordPress Hosting
- https://dronahost.com/vps-hosting : VPS Hosting
- https://dronahost.com/cloud-hosting : Cloud Hosting
- https://dronahost.com/business-hosting : Business Hosting
- https://dronahost.com/pricing : All Plans & Pricing
- https://dronahost.com/about : About DronaHost
- https://dronahost.com/sla : Uptime SLA & Service Credits
- https://dronahost.com/security : Security & Data Protection

## Regional pages

- https://dronahost.com/hosting/us : US Datacenter Hosting
- https://dronahost.com/hosting/uk : UK Datacenter Hosting (GDPR)
- https://dronahost.com/hosting/eu : EU Datacenter Hosting (GDPR)
- https://dronahost.com/hosting/uae : UAE Datacenter Hosting

## Comparisons

- https://dronahost.com/vs/siteground : DronaHost vs SiteGround
- https://dronahost.com/vs/kinsta : DronaHost vs Kinsta
- https://dronahost.com/vs/wp-engine : DronaHost vs WP Engine

## Blog (latest posts)

{dynamically injected by /scripts/generate-llms-txt.ts}
```

`/public/llms-full.txt` contains the full text of key pages — not just links. Generate both with `/scripts/generate-llms-txt.ts` on every build or content update.

```ts
// scripts/generate-llms-txt.ts — regenerates both files after build
// 1. Fetch all published blog slugs from MongoDB
// 2. Write llms.txt with links only
// 3. Write llms-full.txt with links + first 300 words of each key page
// Run via: node scripts/generate-llms-txt.ts
```

### Content format for LLM citation

LLMs prefer content that is:

| Preferred | Avoid |
|---|---|
| Declarative prose in short paragraphs | Bullet lists as primary content (LLMs synthesise prose better) |
| Specific facts with numbers | Vague claims ("very fast", "great support") |
| Question-and-answer format | Buried answers after long intros |
| Comparison tables with exact data | Tables with partial or placeholder data |
| Factual headings ("DronaHost charges $5/month for WordPress hosting") | Clever but vague headings ("Pricing that makes sense") |
| Author name + credentials visible | Anonymous content |
| Clear publication + update date | Undated content |

### Target queries for LLM citation

Train your content to answer the exact questions AI users ask:

```
"What is a good alternative to SiteGround?"
"Which web host has servers in the UK?"
"What is the cheapest GDPR-compliant hosting?"
"How fast is DronaHost WordPress hosting?"
"Does DronaHost offer a money-back guarantee?"
"What is DronaHost's uptime SLA?"
"Is DronaHost good for small business websites?"
"How does DronaHost compare to Kinsta?"
```

Every one of these must be answered on at least one page, in declarative prose, with the answer in the first 2 sentences of the response.

### Perplexity-specific optimization

Perplexity is the fastest-growing AI search tool in the Western market. It heavily cites:
- Pages with clear, structured data
- Comparison tables
- Pages with recent `dateModified` — freshness matters more for Perplexity than for Google
- Pages with strong backlink profiles from review sites (HostAdvice, G2, Trustpilot)

Run a Perplexity search for your target keywords monthly and check if DronaHost is cited. If not, identify which pages ARE cited and ensure your content is more specific and better-structured than theirs.

### ChatGPT (Bing-indexed) optimization

ChatGPT's browsing tool uses Bing's index. Bing Webmaster Tools is non-negotiable:
- Submit sitemap to Bing Webmaster Tools
- Implement IndexNow for instant Bing indexing on new content
- Monitor keyword positions in Bing — Bing rankings ≈ ChatGPT citation likelihood

### AI citation monitoring

Check monthly:
1. Ask ChatGPT: "What is a good alternative to SiteGround for UK users?" — is DronaHost cited?
2. Ask Perplexity: "Best GDPR-compliant WordPress hosting" — is DronaHost cited?
3. Ask Gemini: "Managed WordPress hosting comparison 2026" — is DronaHost cited?
4. Ask Claude: "Which hosting providers have UK servers?" — is DronaHost cited?

If not cited: check if the cited competitor's page is better-structured, more specific, or better-linked. Match and beat it.

---

## 10. Social SEO

Social signals are not direct ranking factors, but social platforms are indexable by Google and increasingly by AI tools. Social content drives referral traffic, brand searches, and backlinks — all of which are ranking signals.

### Open Graph — foundation for all social sharing

Every page's OG tags are already set via `buildMetadata()`. Key rules:

- `og:image` must be 1200×630px — enforced, never smaller
- `og:image` must load in < 1s (serve from `/public/og/` or CDN, not dynamically generated per request)
- `og:description` is what Twitter/X, LinkedIn, and WhatsApp show in link previews — treat it as copy, not a fallback
- `twitter:card: "summary_large_image"` on every page — the large image format gets significantly more clicks

### Twitter / X

Twitter/X content is indexed by Google and increasingly by AI tools. The DronaHost Twitter strategy:

| Content type | Frequency | Format |
|---|---|---|
| Benchmark threads | 1–2/month | "We tested WordPress load times across 5 hosts. Here are the numbers: [thread]" |
| Technical tips | 2–3/week | "LiteSpeed ESI reduces TTFB by up to 40% on dynamic WordPress pages. Here's how to enable it:" |
| Case study snippets | 1/month | Before/after speed test screenshot + client outcome |
| Product announcements | As needed | Price, spec, link to the plan page |
| Industry commentary | 1–2/week | Short takes on WordPress, hosting, web performance news |

**Twitter cards for blog posts** — always use `summary_large_image` to maximise click-through in feeds.

**Twitter SEO note:** Twitter content is indexed by Google. A high-engagement tweet about your blog post creates a second indexed result and drives branded search volume.

### LinkedIn

LinkedIn is the primary channel for B2B trust signals in the US, UK, and EU markets. Google indexes LinkedIn content.

| Content type | Frequency | Format |
|---|---|---|
| Case studies | 1–2/month | "Client X moved to DronaHost and LCP dropped from 4.2s to 1.1s. Here's what we changed:" |
| Founder commentary | 1/week | Short, first-person opinion on industry topics — not promotion |
| Hiring posts | As needed | Signals company health to Western buyers researching a vendor |
| Partnership announcements | As needed | Co-post with clients or technology partners |

**LinkedIn SEO rules:**
- Company page `About` section: include target keywords naturally ("managed WordPress hosting", "GDPR-compliant hosting", "UK web hosting agency")
- All posts link to the relevant page on dronahost.com
- Encourage team members to reshare — LinkedIn's algorithm amplifies posts with early engagement

### Reddit

Reddit is cited heavily by AI tools (especially Perplexity and ChatGPT) and ranks in Google for long-tail hosting queries. The subreddits that matter:

| Subreddit | Focus | How to participate |
|---|---|---|
| r/webhosting | Hosting recommendations | Answer questions with specific, helpful advice — no promotion. Build reputation over months. |
| r/wordpress | WordPress help | Help with migration, performance, config questions |
| r/selfhosted | VPS / server users | Answer VPS config questions; mention DronaHost when directly relevant |
| r/sysadmin | Server professionals | Technical credibility building |
| r/Entrepreneur | Business owners | Answer hosting-for-small-business questions |
| r/digitalnomad | Remote workers | UK/UAE/EU hosting questions from nomads |

**Reddit rules (non-negotiable):**
- Never create a post promoting DronaHost directly — immediate downvote and reputation loss
- Build karma in the subreddit through genuine helpful answers before ever mentioning DronaHost
- When you do mention DronaHost, it must be in the context of a direct, relevant question — and disclose that you work there
- Reddit threads that get upvoted rank on Google for months and are cited by AI tools
- Monitor r/webhosting weekly for "SiteGround alternative" and "UK hosting recommendation" threads

### YouTube (phase 2)

YouTube is the second-largest search engine and increasingly cited by AI tools in instructional queries.

| Video type | Target keyword | SEO elements |
|---|---|---|
| "How to migrate WordPress to DronaHost" | "migrate wordpress to dronahost" | Transcript, chapters, description with link |
| "DronaHost setup tutorial" | "dronahost setup" | Transcript, link to KB article |
| "DronaHost speed test vs SiteGround" | "dronahost vs siteground speed" | Real benchmark data, comparison in description |
| "GDPR-compliant WordPress hosting setup" | "gdpr wordpress hosting" | Transcript, link to /hosting/eu |

**YouTube SEO rules:**
- Video title: keyword first, brand last
- Description: first 2 lines visible before "more" — write them as meta descriptions (include keyword + CTA + link)
- Chapters: use timestamps — Google displays chapters in search results
- Transcript: always upload manual transcript — auto-captions are inaccurate for technical content
- Tags: include exact match and semantic variants

### Social SEO — what to track

| Signal | Tool | Frequency |
|---|---|---|
| Branded mentions on Twitter/X | TweetDeck / Mention | Daily |
| Reddit mentions | Google Alerts for "dronahost" | Weekly |
| LinkedIn follower growth | LinkedIn Analytics | Monthly |
| Social referral traffic | Fathom / Plausible | Monthly |
| YouTube search impressions | YouTube Studio | Monthly |

---

## 11. Off-Page SEO Strategy

### Link building — target sites

Relevance and authority over volume. A single link from HostAdvice is worth 100 generic directory links.

| Priority | Type | Targets |
|---|---|---|
| High | Hosting review sites | HostAdvice, Review Signal, WP Hosting Bench, Tooltester, WPBeginner |
| High | Web industry publications | Smashing Magazine, CSS-Tricks, A List Apart — as guest author or cited source |
| High | WordPress ecosystem | WP Tavern, WP Mayor, Elegant Themes Blog, WP Builds |
| High | Journalist outreach (HARO) | Respond to hosting/WordPress/web performance queries on Connectively (HARO) |
| Medium | General SaaS directories | G2, Capterra, Clutch, Trustpilot — claim + complete all profiles |
| Medium | Tech media | TechRound (UK), TechCrunch (if you have original data/story) |
| Medium | Reddit upvotes | Organic, helpful, genuine — see §10 |
| Low | General business directories | Crunchbase, AngelList — brand presence only |

### Link-earning tactics (not link-buying)

1. **Speed benchmarks** — publish DronaHost vs Kinsta vs SiteGround speed tests with real Pingdom/GTmetrix data and screenshots. These get cited by other bloggers and AI tools.
2. **Free tools** — a WordPress speed checker at `dronahost.com/tools/speed-test` generates branded backlinks as people share it.
3. **Original annual data** — "State of WordPress Hosting 2026" or "UK SMB Website Performance Report". Data attracts editorial links.
4. **Guest posts** — technical tutorials on WPBeginner-tier sites. Must be genuinely useful; no promotional content.
5. **Case studies** — published with client permission, concrete before/after numbers. Clients share them; industry sites link to them.
6. **HARO** — respond quickly (same-day) to journalist queries about web hosting, website performance, GDPR.

### Review platform management

| Platform | Priority | Setup action |
|---|---|---|
| Trustpilot | High | Claim profile; add invite emails in post-signup flow |
| G2 | High | Claim profile; import reviews from Trustpilot if possible |
| HostAdvice | High | Submit for directory listing; respond to all reviews |
| Clutch | Medium | For agency services (web design, SEO) |
| Capterra | Medium | For SMB software buyers |

**Rules:**
- Respond to every review — positive and negative — within 48 hours
- Never incentivise reviews (violates platform ToS and Google guidelines)
- Add `AggregateRating` + `Review` schema to product pages once 10+ reviews exist

### Brand mention monitoring

Unlinked brand mentions can be converted to backlinks. Monitor with Google Alerts for "dronahost" and Ahrefs Alerts. When a site mentions DronaHost without a link, email the author and ask politely.

---

## 12. SEO Monitoring & Tooling

### Free tools

| Tool | Purpose | Frequency |
|---|---|---|
| Google Search Console | Impressions, clicks, positions, CWV field data, index coverage, manual actions | Weekly |
| Bing Webmaster Tools | Bing ranking + ChatGPT citation signal | Weekly |
| PageSpeed Insights | CWV lab data per URL | Every new page before shipping |
| Chrome DevTools Lighthouse | Local CWV during development | On every significant UI change |
| Schema Markup Validator | JSON-LD validation | Every new schema before shipping |
| Screaming Frog (free tier) | Broken links, missing H1s, duplicate titles, redirect chains | Monthly crawl |
| Google Alerts | Brand mentions, competitor mentions | Daily digest |

### Paid tools (phase 2)

| Tool | Purpose |
|---|---|
| Ahrefs or Semrush | Keyword research, backlink analysis, competitor gap, SERP tracking |
| Fathom or Plausible | GDPR-compliant RUM analytics + referral traffic |
| Positional or Keyword Insights | Keyword clustering at scale |

### GSC — weekly checks

- **Performance tab**: target keyword positions — any drops? Any unexpected gains to double down on?
- **Coverage tab**: any new "Excluded" pages? Newly discovered crawl errors?
- **Core Web Vitals tab**: any URLs entering "Poor" status?
- **Manual Actions tab**: check monthly — one action tanks the whole site

### AI citation monitoring — monthly

Ask each AI tool the same questions every month and log whether DronaHost is cited:

```
ChatGPT:    "Best alternative to SiteGround for UK users"
Perplexity: "GDPR-compliant managed WordPress hosting"
Gemini:     "Managed WordPress hosting comparison 2026"
Claude:     "Which hosting providers have servers in the UK?"
Bing Copilot: "Fast WordPress hosting with LiteSpeed"
```

Track citation rate (cited / not cited) per tool per month. If declining, run a content audit on the pages that should be cited.

### KPIs

| KPI | Target | Where to measure |
|---|---|---|
| Organic sessions (US + UK + EU + UAE) | Month-over-month growth | Fathom / Plausible + GSC |
| Target keyword positions | Top 3 for primary within 12 months; top 10 within 6 months | GSC Performance |
| Featured snippet wins | 1+ per product page within 6 months | GSC + manual SERP checks |
| AI tool citation rate | Cited in 2+ AI tools for primary queries within 6 months | Manual monthly test |
| LCP field data | < 2.5s across all pages | GSC Core Web Vitals |
| Index coverage | > 95% of submitted URLs indexed | GSC Coverage |
| Referring domains | Month-over-month growth | Ahrefs / Semrush |
| Organic CTR (non-branded) | > 2% average | GSC Performance |
| Review count (Trustpilot + G2) | 50+ within 12 months | Platform dashboards |
| Reddit mentions (positive) | Growing quarter-over-quarter | Google Alerts |

---

## 13. Pre-Ship Checklists

### Every page — base checklist

- [ ] Unique `title` (50–60 chars, keyword first) via `buildMetadata()`
- [ ] Unique `description` (140–160 chars, keyword + outcome + CTA)
- [ ] `canonical` set — absolute URL, no trailing slash, HTTPS
- [ ] `robots` set explicitly
- [ ] `twitter.site` = `@dronahost` and `twitter.creator` = `@dronahost`
- [ ] OG image exists at `/public/og/[slug].jpg` (1200×630px)
- [ ] One `<h1>` containing primary keyword
- [ ] Direct answer block in first 100 words
- [ ] At least 3 internal links with descriptive anchor text
- [ ] All images via `next/image` with `alt`, `width`, `height`
- [ ] `priority` on the LCP image
- [ ] No render-blocking scripts in `<head>`
- [ ] `BreadcrumbList` JSON-LD (except homepage)
- [ ] JSON-LD validated at `validator.schema.org`
- [ ] PageSpeed Insights: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Added to `app/sitemap.ts` with correct `priority`
- [ ] Server-rendered — no indexable content behind JS
- [ ] Page added to `llms.txt` if it is a key content page
- [ ] Internal link from at least one existing high-traffic page

### Hosting plan pages (additionally)

- [ ] `Product` + `Offer` + `AggregateRating` + `Review[]` JSON-LD
- [ ] `FAQPage` JSON-LD (minimum 5 questions)
- [ ] All FAQ answers: 40–60 words, direct answer in first sentence
- [ ] Pricing visible in the CTA
- [ ] Money-back guarantee copy below primary CTA
- [ ] Region-appropriate currency displayed
- [ ] At least one real testimonial (name, company, role, link)
- [ ] Benchmark numbers cited (TTFB, LCP, uptime SLA)
- [ ] Comparison table vs at least one competitor

### Blog posts (additionally)

- [ ] `BlogPosting` JSON-LD with `datePublished`, `dateModified`, `author`, `inLanguage`
- [ ] If tutorial: `HowTo` JSON-LD
- [ ] `type: "article"` in `buildMetadata()`
- [ ] Author bio (name, photo, role, credentials — E-E-A-T)
- [ ] Featured image (1200×630) — unique per post
- [ ] Table of contents for posts > 1,500 words
- [ ] Reading time estimate in byline
- [ ] One internal link to a relevant product page
- [ ] FAQ section (minimum 3 questions, PAA-optimised phrasing)
- [ ] IndexNow ping after publish

### Competitor comparison pages

- [ ] `Article` + `FAQPage` JSON-LD
- [ ] `<h1>`: "DronaHost vs [Competitor] — [Year]"
- [ ] Comparison table: speed, price at signup, price at renewal, support response time, uptime SLA
- [ ] All data verifiable with citations (link to source or screenshot)
- [ ] "Last updated" date visible on the page
- [ ] `dateModified` in schema matches the visible date
- [ ] CTA: "Switch from [Competitor] — see our plans"
- [ ] FAQ section targeting PAA questions for this comparison
- [ ] Factual only — no defamatory claims

### Regional landing pages

- [ ] Region-specific `<h1>` with location keyword
- [ ] Hreflang tags pointing to all locale-prefixed equivalents
- [ ] `x-default` hreflang present
- [ ] Region currency in all pricing
- [ ] GDPR / data residency callout (EU + UK mandatory)
- [ ] TTFB / latency callout with named cities
- [ ] Local testimonial if available
- [ ] Region-specific FAQ section

### New blog post — social distribution checklist

After every blog post is published:

- [ ] Tweet the post (include a data point or insight, not just the title)
- [ ] LinkedIn post from company page (first 2 lines = the hook, link in comment)
- [ ] Reddit — if a relevant thread exists, contribute the post as a resource (only if genuinely helpful)
- [ ] IndexNow ping sent
- [ ] Internal links from 2+ existing posts updated to point to the new post
- [ ] `llms.txt` and `llms-full.txt` regenerated
