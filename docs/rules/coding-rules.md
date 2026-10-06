# DronaHost — Coding Rules

> Enforced on every PR. No exceptions without explicit written justification in a code comment.
>
> **Examples are not facts.** Every number, price, plan name and SLA in a sample below is `[EXAMPLE, NOT VERIFIED]`.
> **Claims rule:** copy never contains a number, guarantee, SLA, location or certification that is not rendered from
> `content/claims.ts` with `status: "verified"`. Unverified claims render nothing.
> **Pricing rule:** prices come only from `data/pricing.json`. These rules must not contain real prices or plan names.

---

## 1. TypeScript Strict Mode

- `strict: true` in `tsconfig.json` — never disable
- No `any` without a comment explaining why it cannot be typed
- No `@ts-ignore` — fix the root type error
- All API responses must have a named type or Zod-inferred type; no inline `{}` or `object`
- Prefer `unknown` over `any` when input shape is genuinely unknown, then narrow with Zod or type guards
- Use `satisfies` operator to catch type mismatches while preserving literal inference

```ts
// BAD
const data: any = await fetch(...).then(r => r.json());

// GOOD
const data = ResponseSchema.parse(await fetch(...).then(r => r.json()));
```

---

## 2. SSR Enforcement

- `"use client"` at the **page level** is banned — pages must be Server Components
- `"use client"` is allowed only in leaf components that require browser APIs, hooks, or event handlers
- Never fetch data inside a Client Component when a Server Component works
- Use `next/dynamic` with `{ ssr: false }` only for genuinely client-only widgets (e.g., map libraries, canvas)
- All indexable content (hero text, pricing, FAQs, blog posts) must render in the server HTML, so crawlers and visitors without JavaScript can read it

```ts
// BAD — page.tsx
"use client";
export default function Page() { ... }

// GOOD — page.tsx is a Server Component; only the interactive child uses "use client"
import { DomainSearchWidget } from "./_components/domain-search-widget";
export default function Page() {
  return <main><DomainSearchWidget /></main>;
}
```

### Next.js 16 notes

- `params` and `searchParams` are async: type them as `Promise<...>` and `await` them (see the samples in §3).
- `middleware.ts` is now `proxy.ts`.
- `next lint` was removed: run ESLint (or Biome) directly in scripts and CI.
- Pin the framework version and track the latest patch release.

---

## 3. SEO — Required on Every Page

### `generateMetadata` / `metadata`

Every `page.tsx` must export either a static `metadata` object or a `generateMetadata` function.
Always use the `buildMetadata()` helper from `lib/seo/metadata.ts` — never construct the metadata object inline.

Required fields:

| Field | Requirement |
|---|---|
| `title` | Keyword-first, unique, 60 chars or fewer including the suffix (guideline; the helper appends the brand suffix, so write titles without it) |
| `description` | Unique, 160 chars or fewer, ends with a next step (guideline). The linter fails only on missing, duplicate or over-length values. |
| `openGraph` | title, description, url, siteName, images [1200×630], locale, type |
| `twitter` | card: "summary_large_image", title, description, images |
| `alternates.canonical` | absolute URL |
| `alternates.languages` | hreflang for all active locales |
| `robots` | index/follow (or noindex for auth/account pages) |

```ts
// Static page — export const metadata
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Managed WordPress Hosting — LiteSpeed + NVMe",
  description: "[EXAMPLE, NOT VERIFIED] LiteSpeed + NVMe with 200ms TTFB. Free migration, daily backups, 99.95% uptime SLA. From $5/month.",
  path: "/wordpress-hosting",
});

// Dynamic page — export generateMetadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
  });
}
```

### Structured Data (JSON-LD)

Place via inline `<script type="application/ld+json">` inside a Server Component — never via `next/script`.

| Page type | Required schema |
|---|---|
| Homepage | `Organization` + `WebSite` in one `@graph` with stable `@id` (no `SearchAction`; see `seo-rules.md` §2) |
| Hosting plan | `Product` + `Offer` (`AggregateRating` only with real, visible, linked reviews) |
| Blog post | `BlogPosting` (author, datePublished, dateModified, image) |
| All non-home | `BreadcrumbList` |
| FAQ section | `FAQPage` (optional; must match the visible text) |
| Service page | `Service` with `areaServed` |
| Contact | `Organization` with `contactPoint` (not `LocalBusiness`) |
| Case study | `Article` with `mentions` |

### HTML rules

- One `<h1>` per page
- Semantic elements: `<main>`, `<article>`, `<nav>`, `<section>`, `<aside>`
- All `<img>` via `next/image` with descriptive `alt` and explicit `width`/`height`
- Internal links via `next/link` with locale awareness — bare `<a href>` for internal routes is banned
- URLs: lowercase, hyphenated, no trailing slash, no query strings for primary content

### Sitemap & robots

- `app/sitemap.ts` — dynamic, includes all published posts (from WordPress, see §10a) and hreflang alternates
- `app/robots.ts` — block `/api/*`, `/admin/*`, `/account/*`, `/checkout/*`

---

## 4. Code Readability

- **File length**: hard cap 300 lines; split into smaller modules if exceeded. Enforced with the ESLint `max-lines` rule, not by review alone.
- **Function length**: aim for ≤ 40 lines; extract helpers rather than growing functions
- **Naming**: files `kebab-case.ts`, components `PascalCase`, hooks `useCamelCase`, constants `SCREAMING_SNAKE_CASE`
- **One component per file** — named export preferred over default export
- **No comments explaining WHAT** — well-named identifiers do that; only comment WHY (hidden constraint, workaround, non-obvious invariant)
- **No multi-paragraph docstrings** — one short JSDoc line max for exported utilities:

```ts
/** Returns the region-appropriate currency code for a given ISO country code. */
export function getCurrencyForCountry(countryCode: string): CurrencyCode { ... }
```

- No inline styles except for genuinely dynamic values (e.g., `style={{ width: progress + "%" }}`)
- No magic numbers — extract to named constants

---

## 5. Reusable Components

- All components used on 2+ pages belong in `components/ui/` (primitives) or `components/sections/` (page sections)
- Page-level `_components/` is only for interactive widgets used on exactly one page (domain search, blog filter)
- **Bespoke sections:** a section used on exactly one page lives in `components/sections/bespoke/`. It is built to the same standards and approved in `/v2` before use, like any other component.
- Every component must have typed props — no implicit `any`, no untyped `children`
- Use `React.ComponentPropsWithoutRef<"div">` or similar to forward HTML attributes cleanly
- **Never edit files inside `node_modules/` or shadcn source files** — extend via wrapper components or `cva` variants

```ts
// GOOD — typed props with HTML attribute forwarding
interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  variant?: "default" | "bordered";
}
export function Card({ variant = "default", className, ...props }: CardProps) { ... }
```

---

## 6. Component Review Workflow — MANDATORY

> Every new component must go through `/v2` before it touches any real page. No exceptions.

### The rule

**Never build a new component directly on a page.**
Design it → publish to `/v2` → get approval → then use it anywhere.

### Step-by-step

```
1. Build the component in components/ui/ or components/sections/
2. Add it to app/(dev)/v2/page.tsx — show all variants and states
3. Tell the project owner: "Component X is ready for review at /v2"
4. Wait for explicit approval ("looks good", "approved", etc.)
5. Only after approval — import and use the component on real pages
```

### What to show in `/v2`

Every component added to `/v2` must demonstrate:

| State | Examples |
|---|---|
| Default | Normal render with representative content |
| Variants | All `variant` prop values (e.g. `primary`, `secondary`, `ghost`) |
| Sizes | All `size` prop values if applicable |
| Dark mode | Component must work on both light and dark backgrounds |
| Edge cases | Long text, empty content, loading state, error state where relevant |

```tsx
// app/(dev)/v2/page.tsx — example entry for a new component ([EXAMPLE, NOT VERIFIED]: plan data comes from pricing.json)
<Section heading="PricingCard" status="needs-verification">
  <PricingCard
    plan={plans[0]}   {/* from data/pricing.json; never typed inline */}
  />
  <PricingCard
    plan={plans[1]}
    highlighted
  />
</Section>
```

### Status badges in `/v2`

Use a `status` prop on the section wrapper so review state is visible at a glance:

| Status | Meaning |
|---|---|
| `"needs-verification"` | Built and tested, but renders claims the owner must confirm before launch |
| `"approved"` | Approved — safe to use on real pages |
| `"revision"` | Approval rejected — needs changes before re-review |

### Why this rule exists

- Catches visual and UX problems before they reach real pages
- Keeps the component library consistent — every component is reviewed against the design system
- Prevents one-off styles getting baked into pages and bypassing the design token system
- Creates a living reference for all approved components in one place

---

## 7. Optional Chaining & Nullish Coalescing

- Prefer `?.` over manual null checks for property access chains
- Prefer `??` over `||` when `0`, `""`, or `false` are valid values
- Never assume an array exists — always guard before accessing `.length` or iterating

```ts
// BAD
const name = user && user.profile && user.profile.name;
const count = total || 0;

// GOOD
const name = user?.profile?.name;
const count = total ?? 0;
```

---

## 8. Loop Guards

Every loop over external or user-supplied data must:

1. **Confirm the value is an array** before iterating:

```ts
// BAD
for (const item of data) { ... }

// GOOD
if (!Array.isArray(data)) throw new Error("Expected array from API");
for (const item of data) { ... }
```

2. **Enforce a hard cap** on user-supplied array lengths to prevent memory exhaustion. For API and user input, **reject** an oversize payload with a 4xx; do not silently truncate it with `.slice(0, MAX)`:

```ts
const MAX_ITEMS = 100;
if (items.length > MAX_ITEMS) {
  return NextResponse.json({ error: "Too many items" }, { status: 413 });
}
```

`.slice()` is acceptable only for display lists you build yourself (for example "show the first 6 related posts").

3. Use `for...of` over `.forEach` for async-friendly iteration.

---

## 9. Fallback Guards

### Error boundaries

- Every route that fetches remote data must have a colocated `error.tsx` boundary
- UI components that fetch async data must handle loading and error states explicitly — no silent failures

### DB / service calls

Wrap every external API call (WordPress, WHMCS, email) in try/catch with typed error logging through the logger, not `console.error`:

```ts
try {
  const result = await getPost(slug); // validated with Zod, see §10a
  if (!result) notFound(); // Next.js 404
  return result;
} catch (err) {
  logger.error("post.fetch_failed", { slug, err });
  throw new Error("Post fetch failed");
}
```

Obsolete MongoDB version of the same rule (kept until §10 is removed; do not copy):

```ts
// OBSOLETE, to be removed
try {
  const result = await PostModel.findOne({ slug }).lean();
  if (!result) notFound();
  return result;
} catch (err) {
  console.error("[post] Failed to fetch:", slug, err);
  throw new Error("Post fetch failed");
}
```

In production, errors go to a logger or error-monitoring service. `console.error` is for local development only. Never log secrets, tokens or personal data.

### Route handler shape

Every Route Handler (`app/api/**/route.ts`) must:

- Return `NextResponse.json({ error: string }, { status: N })` on failure — never throw unhandled
- Validate all input with Zod before processing
- Include a `try/catch` wrapping the entire handler body

```ts
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    // ... handler logic
  } catch (err) {
    logger.error("api.orders.post_failed", { err });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## 10. Mongoose Rules

> **OBSOLETE, TO BE REMOVED.** The blog moves to headless WordPress and the site becomes front-end only (see §10a).
> This section, the EU Atlas cluster rule, `MONGODB_URI`, the soft-delete rules and any code that reads MongoDB for
> posts, sitemaps or `llms.txt` are obsolete. Do not delete them yet; do not extend them. Form submissions and the
> consent log currently still use MongoDB until their replacement is decided.

- Always call `.lean()` on read queries — returns plain objects, ~2× faster, no Mongoose overhead
- Never expose raw Mongoose queries to Client Components — Server Components and Route Handlers only
- Use `select: false` on sensitive fields in schema definition (passwords, tokens, internal flags):

```ts
password: { type: String, required: true, select: false }
```

- Always use Zod to validate ALL incoming data before writing to the DB
- Soft-delete pattern: add `deletedAt?: Date` field and filter `{ deletedAt: null }` — never hard-delete user, order, or payment records (tax/audit requirement)
- Index every field used in queries: `slug`, `status`, `publishedAt`, `region`, `userId`
- EU user data must be stored in the EU-region MongoDB Atlas cluster — enforce at provisioning time
- **Hot-reload-safe model export** — always use the `??` guard so Next.js dev mode does not re-register models on every HMR cycle:

```ts
// lib/models/post.ts
const Post = (mongoose.models.Post as mongoose.Model<IPost>) ??
  mongoose.model<IPost>("Post", PostSchema);
export default Post;
```

---

## 10a. WordPress Data-Layer Rules

- Fetch WordPress only in Server Components or Route Handlers. Validate every response with Zod.
- Render WordPress HTML only after server-side sanitisation (for example `sanitize-html`). Never use raw
  `dangerouslySetInnerHTML` on `content.rendered`: it is an XSS risk.
- Use ISR with tags: `revalidateTag("post:<slug>")` triggered by a WordPress webhook. Verify the webhook with a shared secret.
- If WordPress is down, serve the last cached page. Never show an error page for content that was cached.
- Draft preview uses Next.js Draft Mode, protected by a secret.
- WordPress lives on a separate subdomain (for example `cms.<domain>`), `noindex`, no public theme, `wp-admin`
  restricted by IP or SSO, minimal plugins. Send `X-Robots-Tag: noindex` on the CMS domain so it never competes with the site.
- Content model: author, reviewer, category, `primaryKeyword`, `searchIntent`, `reviewedOn`, `relatedProduct` (links to a
  product page), and SEO fields. A post without an author or a reviewed date cannot be published.

---

## 11. Tailwind + shadcn

- Always use the `cn()` utility (`clsx` + `tailwind-merge`) for conditional class names — never string concatenation
- Use design tokens (CSS variables) for brand colors — never hardcode hex values in Tailwind classes (`bg-[#FE5403]` is banned; use a token utility such as `bg-action`. TODO(decision #2): the official orange hex is undecided; the hex lives only in `app/styles/tokens.css`)
- **Dark mode — Tailwind v4**: the project uses `@custom-variant dark (&:where(.dark, .dark *))` in `globals.css`. Use `dark:` prefix classes as normal; toggle dark by adding/removing the `dark` class on `<html>` — never via `data-theme` attribute
- Extract repeated class strings into `cva` variants, not copy-pasted strings
- Do not add inline `style` attributes for values that can be expressed as Tailwind classes
- Do not override shadcn component source files — wrap and extend instead

```ts
// BAD
<div className={"px-4 py-2 rounded" + (active ? " bg-primary text-white" : " bg-muted")} />

// GOOD
<div className={cn("px-4 py-2 rounded", active ? "bg-primary text-white" : "bg-muted")} />
```

---

## 12. Environment Variables

- All secrets in `.env.local` — never committed (only `.env.example` is committed)
- Never access `process.env.X` directly in components or pages — always go through a typed config module:

- Validate the environment with Zod once, at startup, in a single typed module. Do not scatter `?? ""` fallbacks:

```ts
// lib/env.ts — single source of truth for all env vars
import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  WORDPRESS_API_URL: z.string().url().optional(),
  // MONGODB_URI is obsolete (see §10); add vars here as they are introduced
});

export const env = EnvSchema.parse(process.env); // throws at startup with a clear message
```

- `NEXT_PUBLIC_` prefix: only for values that are safe to expose to the browser. All other vars stay server-side.
- If a required var is missing, fail loudly during startup. Never silently fall back to a wrong value for a secret.
- `NEXT_PUBLIC_` prefix: only for values that are safe to expose to the browser. All other vars stay server-side.

Obsolete MongoDB env handling (kept until §10 is removed; do not copy):

```ts
// OBSOLETE, to be removed
export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com",
  MONGODB_URI: process.env.MONGODB_URI ?? "",
} as const;
if (!env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
```

- `.env.example` must stay up to date — every new env var added to code must also be documented there with a placeholder value and a comment describing what it is.

---

## 13. i18n & Locale Awareness

i18n is built from day one. Every routing and linking decision must be locale-aware.

### URL structure

TODO(decision #8): regions. Start with one English site, USD default and a currency selector. Add `/en-gb` and similar
only when the content genuinely differs (data location, legal text, testimonials). The structure below is the target
shape, not a commitment to ship every locale.

```
/wordpress-hosting              — en-US default (no prefix, canonical)
/en-gb/wordpress-hosting        — UK English
/en-ae/wordpress-hosting        — UAE English
/de-de/wordpress-hosting        — German (phase 2)
```

Route file: `app/[locale]/(marketing)/wordpress-hosting/page.tsx`

### Rules

- Never hardcode locale-less paths in `<Link href>` when inside a locale segment — always prefix with the current locale
- Use `next-intl` helpers (`useTranslations`, `getTranslations`) for all user-facing strings once the i18n layer is wired
- Phase 1 locales: `en-US` (default), `en-GB`, `en-AE` — implement routing for these first
- Phase 2 locales: `de-DE`, `fr-FR`, `nl-NL`, `ar-AE` — do not block on these; plan the locale segment now
- Every page must include hreflang alternates in its `buildMetadata()` call once locales are live
- Default currency is USD. Offer GBP, EUR, AED and INR through a selector or locale. Never show a currency without its symbol and billing period.
- Do not choose the currency from the visitor's IP in the page render. That makes pages dynamic and lets crawlers see only one currency. Render USD in the static HTML and read an explicit selector choice (a cookie) on the client.
- Never hardcode `$` symbols in components; format through the pricing helper

```ts
// BAD — hardcoded locale-less link inside a [locale] page
<Link href="/wordpress-hosting">See plans</Link>

// GOOD — locale-aware link
import { Link } from "@/lib/i18n/navigation"; // next-intl wrapper
<Link href="/wordpress-hosting">See plans</Link>
```

---

## 14. Server Actions vs Route Handlers

Use the right primitive for the right job.

| Scenario | Use |
|---|---|
| Form mutation called from a Client Component | Server Action (`"use server"` function) |
| Webhook receiver (Stripe, third-party) | Route Handler (`app/api/.../route.ts`) |
| Data fetched on page load | Server Component direct call (no API needed) |
| Public API consumed by external clients | Route Handler |
| File upload | Route Handler (streams; Server Actions have 1 MB limit) |
| Mutation needing a redirect after success | Server Action (`redirect()` after mutation) |

### Server Action rules

```ts
// app/(marketing)/contact/_actions/send-message.ts
"use server";
import { ContactSchema } from "@/lib/schemas/contact";

export async function sendMessage(formData: FormData) {
  const parsed = ContactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.flatten() };
  // ... send email / save to DB
  return { success: true };
}
```

- Always validate with Zod inside the action — `FormData` is untyped
- Return a typed result object (`{ success, error }`) — do not throw from Server Actions used in forms
- Never put auth checks inside a page; put them inside the action or a shared `requireAuth()` helper

### Route Handler rules

- File: `app/api/[resource]/route.ts`
- Always export named HTTP method functions (`GET`, `POST`, `PATCH`, `DELETE`) — no default export
- Always return `NextResponse.json(...)` — never `Response` directly
- See §9 (Fallback Guards) for the required try/catch and Zod validation shape

---

## 15. What NOT to do

- Do NOT use client-side rendering for indexable content
- Do NOT build static or one-off components embedded in individual pages — all UI lives in `components/` (a single-use section goes in `components/sections/bespoke/`, see §5)
- Do NOT add reusable UI to page-level `_components/` folders — if a component is used on 2+ pages, it belongs in `components/sections/` or `components/ui/`
- Do NOT use a new component on real pages before it has been reviewed and approved in `/v2` (see §6)
- Do NOT add npm packages without discussing first. Pre-approved, no discussion needed: `zod`, `next-intl`, `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`.
- Do NOT create new page routes without confirming URL structure (SEO + i18n implications)
- Do NOT use special characters (`&`, `+`, etc.) in folder/route names — use hyphenated slugs
- Do NOT disable TypeScript errors with `@ts-ignore` — fix the type
- Do NOT hardcode secrets, API keys, or URLs — use typed env config
- Do NOT skip `alt` text, meta descriptions, canonical tags, or hreflang
- Do NOT use `<a href>` for internal links — always `next/link` with locale awareness
- Do NOT fetch data in client components when a Server Component works
- Do NOT commit `.env*` files (except `.env.example`)
- Do NOT ship a changed page that misses these targets: median of 3 mobile Lighthouse runs with Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95, and field data LCP < 2.5s, INP < 200ms, CLS < 0.1
- Do NOT use phrases from the content rules' "Phrases to avoid" list ("Don't fret!", "Kindly", "blazing fast")
- Do NOT show a price without its currency symbol and billing period. Default currency is USD; GBP, EUR, AED and INR come from a selector or locale.
- Do NOT put a number, guarantee, SLA, location or certification in copy unless it renders from `claims.ts` with `status: "verified"`
- Do NOT use emojis in marketing copy (OK selectively in blog posts)
- Do NOT use stock photos as testimonials
- Do NOT make performance/uptime claims without data to back them
- Do NOT load non-essential scripts in EU without GDPR cookie consent
