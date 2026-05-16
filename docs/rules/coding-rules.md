# DronaHost — Coding Rules

> Enforced on every PR. No exceptions without explicit written justification in a code comment.

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
- All indexable content (hero text, pricing, FAQs, blog posts) must render in HTML — AI crawlers and Googlebot do not execute JS reliably

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

---

## 3. SEO — Required on Every Page

### `generateMetadata` / `metadata`

Every `page.tsx` must export either a static `metadata` object or a `generateMetadata` function.
Always use the `buildMetadata()` helper from `lib/seo/metadata.ts` — never construct the metadata object inline.

Required fields:

| Field | Requirement |
|---|---|
| `title` | 50–60 chars, keyword-first, unique |
| `description` | 140–160 chars, includes CTA, unique |
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
  description: "LiteSpeed + NVMe with 200ms TTFB. Free migration, daily backups, 99.95% uptime SLA. From $5/month.",
  path: "/wordpress-hosting",
});

// Dynamic page — export generateMetadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
  });
}
```

### Structured Data (JSON-LD)

Place via inline `<script type="application/ld+json">` inside a Server Component — never via `next/script`.

| Page type | Required schema |
|---|---|
| Homepage | `Organization` + `WebSite` + `SearchAction` |
| Hosting plan | `Product` + `Offer` + `AggregateRating` |
| Blog post | `BlogPosting` (author, datePublished, dateModified, image) |
| All non-home | `BreadcrumbList` |
| FAQ section | `FAQPage` |
| Service page | `Service` with `areaServed` |
| Contact | `LocalBusiness` / `Organization` with `contactPoint` |
| Case study | `Article` with `mentions` |

### HTML rules

- One `<h1>` per page
- Semantic elements: `<main>`, `<article>`, `<nav>`, `<section>`, `<aside>`
- All `<img>` via `next/image` with descriptive `alt` and explicit `width`/`height`
- Internal links via `next/link` with locale awareness — bare `<a href>` for internal routes is banned
- URLs: lowercase, hyphenated, no trailing slash, no query strings for primary content

### Sitemap & robots

- `app/sitemap.ts` — dynamic, includes all published posts and hreflang alternates
- `app/robots.ts` — block `/api/*`, `/admin/*`, `/account/*`, `/checkout/*`

---

## 4. Code Readability

- **File length**: hard cap 300 lines; split into smaller modules if exceeded
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
- Page-level `_components/` is only for interactive widgets used on exactly one page (domain search, blog filter, comparison tables)
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
// app/(dev)/v2/page.tsx — example entry for a new component
<Section heading="PricingCard" status="pending-review">
  <PricingCard
    name="Starter"
    price="$5"
    period="month"
    features={["10 GB NVMe", "Free SSL", "Daily backups"]}
    cta="Start Starter Plan"
  />
  <PricingCard
    name="Business"
    price="$15"
    period="month"
    features={["50 GB NVMe", "Free SSL", "Priority support"]}
    highlighted
    cta="Start Business Plan"
  />
</Section>
```

### Status badges in `/v2`

Use a `status` prop on the section wrapper so review state is visible at a glance:

| Status | Meaning |
|---|---|
| `"pending-review"` | Built, awaiting approval — do not use on real pages yet |
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

2. **Enforce a hard cap** on user-supplied array lengths to prevent memory exhaustion:

```ts
const MAX_ITEMS = 100;
const safeItems = items.slice(0, MAX_ITEMS);
```

3. Use `for...of` over `.forEach` for async-friendly iteration.

---

## 9. Fallback Guards

### Error boundaries

- Every route that fetches remote data must have a colocated `error.tsx` boundary
- UI components that fetch async data must handle loading and error states explicitly — no silent failures

### DB / service calls

Wrap every database and external API call in try/catch with typed error logging:

```ts
try {
  const result = await PostModel.findOne({ slug }).lean();
  if (!result) notFound(); // Next.js 404
  return result;
} catch (err) {
  console.error("[post] Failed to fetch:", slug, err);
  throw new Error("Post fetch failed");
}
```

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
    console.error("[POST /api/orders]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

## 10. Mongoose Rules

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

## 11. Tailwind + shadcn

- Always use the `cn()` utility (`clsx` + `tailwind-merge`) for conditional class names — never string concatenation
- Use design tokens (CSS variables) for brand colors — never hardcode hex values in Tailwind classes (`bg-[#FE5403]` is banned; use `bg-brand-orange`)
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

```ts
// lib/env.ts — single source of truth for all env vars
export const env = {
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronahost.com",
  MONGODB_URI: process.env.MONGODB_URI ?? "",
  // add vars here as they are introduced
} as const;
```

- `NEXT_PUBLIC_` prefix: only for values that are safe to expose to the browser. All other vars stay server-side.
- If a required var is missing at runtime, fail loudly during startup — do not silently fall back to a wrong value for a secret:

```ts
if (!env.MONGODB_URI) throw new Error("MONGODB_URI is not set");
```

- `.env.example` must stay up to date — every new env var added to code must also be documented there with a placeholder value and a comment describing what it is.

---

## 13. i18n & Locale Awareness

i18n is built from day one. Every routing and linking decision must be locale-aware.

### URL structure

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
- Currency display follows the detected locale — never hardcode `$` symbols in components; use the pricing context

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
- Do NOT build static or one-off components embedded in individual pages — all UI must be global components in `components/`
- Do NOT add reusable UI to page-level `_components/` folders — if a component is used on 2+ pages, it belongs in `components/sections/` or `components/ui/`
- Do NOT use a new component on real pages before it has been reviewed and approved in `/v2` (see §6)
- Do NOT add npm packages without discussing first
- Do NOT create new page routes without confirming URL structure (SEO + i18n implications)
- Do NOT use special characters (`&`, `+`, etc.) in folder/route names — use hyphenated slugs
- Do NOT disable TypeScript errors with `@ts-ignore` — fix the type
- Do NOT hardcode secrets, API keys, or URLs — use typed env config
- Do NOT skip `alt` text, meta descriptions, canonical tags, or hreflang
- Do NOT use `<a href>` for internal links — always `next/link` with locale awareness
- Do NOT fetch data in client components when a Server Component works
- Do NOT commit `.env*` files (except `.env.example`)
- Do NOT ship without Lighthouse 95+ on changed pages
- Do NOT write Indian-English marketing copy ("Don't fret!", "Kindly", "blazing fast")
- Do NOT display prices in INR by default — auto-detect and show USD/GBP/EUR/AED
- Do NOT use emojis in marketing copy (OK selectively in blog posts)
- Do NOT use stock photos as testimonials
- Do NOT make performance/uptime claims without data to back them
- Do NOT load non-essential scripts in EU without GDPR cookie consent
