# DronaHost v2.0 — Pages & Architecture

> Codebase snapshot: May 2026. Live site (dronahost.com) currently returns 403 — this document reflects the codebase, not the deployed state.

---

## Table of Contents

1. [Pages Tree](#1-pages-tree)
2. [Layout Hierarchy](#2-layout-hierarchy)
3. [Auth Flow Map](#3-auth-flow-map)
4. [API Routes Map](#4-api-routes-map)
5. [Data Flow Diagram](#5-data-flow-diagram)
6. [SEO Metadata](#6-seo-metadata)

---

## 1. Pages Tree

All routes live under `app/`. The `[locale]` segment described in `CLAUDE.md` is planned but not yet wired — current routes are not locale-prefixed.

```
app/
├── layout.tsx                          root layout — fonts, Providers, <html>
├── providers.tsx                       Client wrapper for theme/context providers
├── robots.ts                           /robots.txt (allow all except /api, /admin, /account)
├── sitemap.ts                          /sitemap.xml (static pages + dynamic blog slugs)
│
├── (dev)/                              Dev-only route group — not deployed to production
│   ├── layout.tsx
│   └── v2/
│       └── page.tsx                   /v2 — component library showcase (source of truth)
│
├── (marketing)/                        Public marketing site
│   ├── layout.tsx                      Wraps every marketing page with <Header> + <Footer>
│   ├── page.tsx                        /  — Homepage
│   │
│   ├── about/
│   │   └── page.tsx                   /about
│   │
│   ├── blog/
│   │   ├── page.tsx                   /blog — post listing (SSG + MongoDB)
│   │   └── [slug]/
│   │       └── page.tsx               /blog/[slug] — post detail (ISR 3600s)
│   │
│   ├── business-hosting/
│   │   └── page.tsx                   /business-hosting
│   │
│   ├── cloud-hosting/
│   │   └── page.tsx                   /cloud-hosting
│   │
│   ├── contact/
│   │   └── page.tsx                   /contact — contact form (POSTs to /api/contact)
│   │
│   ├── data-processing/
│   │   └── page.tsx                   /data-processing — GDPR DPA page
│   │
│   ├── domains/
│   │   └── page.tsx                   /domains — domain registration landing
│   │
│   ├── growth-services/
│   │   └── page.tsx                   /growth-services — SEO + marketing services
│   │
│   ├── hosting/
│   │   └── [region]/
│   │       └── page.tsx               /hosting/[us|uk|eu|uae] — regional datacenter landing
│   │
│   ├── pricing/
│   │   └── page.tsx                   /pricing — plan comparison
│   │
│   ├── privacy/
│   │   └── page.tsx                   /privacy — GDPR + CCPA privacy policy
│   │
│   ├── refund-policy/
│   │   └── page.tsx                   /refund-policy — 30-day money-back terms
│   │
│   ├── security/
│   │   └── page.tsx                   /security — data protection + backup policy
│   │
│   ├── seo-services/
│   │   └── page.tsx                   /seo-services
│   │
│   ├── sla/
│   │   └── page.tsx                   /sla — uptime SLA + service credit definitions
│   │
│   ├── terms/
│   │   └── page.tsx                   /terms — ToS (written for Western jurisdictions)
│   │
│   ├── vps-hosting/
│   │   └── page.tsx                   /vps-hosting
│   │
│   ├── vs/
│   │   └── [competitor]/
│   │       └── page.tsx               /vs/[siteground|kinsta|wp-engine|...] — comparison pages
│   │
│   ├── web-design/
│   │   └── page.tsx                   /web-design
│   │
│   └── wordpress-hosting/
│       └── page.tsx                   /wordpress-hosting
│
└── api/
    └── contact/
        └── route.ts                   POST /api/contact — Zod-validated contact form handler
```

### Page classification

| Page | Render mode | Public | Auth required | MongoDB |
|---|---|---|---|---|
| `/` | SSG | Yes | No | No |
| `/about` | SSG | Yes | No | No |
| `/blog` | SSG + MongoDB | Yes | No | Yes (list) |
| `/blog/[slug]` | ISR 3600s | Yes | No | Yes (findOne) |
| `/business-hosting` | SSG | Yes | No | No |
| `/cloud-hosting` | SSG | Yes | No | No |
| `/contact` | SSG | Yes | No | No |
| `/data-processing` | SSG | Yes | No | No |
| `/domains` | SSG | Yes | No | No |
| `/growth-services` | SSG | Yes | No | No |
| `/hosting/[region]` | SSG | Yes | No | No |
| `/pricing` | SSG | Yes | No | No |
| `/privacy` | SSG | Yes | No | No |
| `/refund-policy` | SSG | Yes | No | No |
| `/security` | SSG | Yes | No | No |
| `/seo-services` | SSG | Yes | No | No |
| `/sla` | SSG | Yes | No | No |
| `/terms` | SSG | Yes | No | No |
| `/vps-hosting` | SSG | Yes | No | No |
| `/vs/[competitor]` | SSG | Yes | No | No |
| `/web-design` | SSG | Yes | No | No |
| `/wordpress-hosting` | SSG | Yes | No | No |
| `/v2` | SSG (dev only) | Yes | No | No |

### Planned routes (not yet built)

Per `CLAUDE.md`, the following routes are planned but not yet scaffolded:

```
/[locale]/...                          Locale prefix for all marketing routes
/(app)/                                Authenticated user area
  /dashboard
  /account
  /account/billing
  /account/domains
  /account/hosting
/kb/                                   Knowledge base
/experience/                           "Experience & Growth" (confirmed URL slug)
/api/gdpr/export                       GDPR data export
/api/gdpr/delete                       GDPR account deletion
/api/gdpr/rectify                      GDPR data correction
```

---

## 2. Layout Hierarchy

```
app/layout.tsx  (root)
│
│   Responsibility:
│   - <html lang="en"> with theme-init script (classList.add('dark') on match)
│   - next/font: Geist + Geist_Mono CSS vars (defined but not consumed by body)
│   - <Providers> — client boundary for theme/context state
│   - No auth logic, no redirects
│
└── app/(marketing)/layout.tsx
│
│   Responsibility:
│   - Renders <Header /> + {children} + <Footer />
│   - All public marketing pages inherit this
│   - No auth, no session checks
│
└── app/(dev)/layout.tsx
│
│   Responsibility:
│   - Thin wrapper for dev tooling and component showcase
│   - Not present in production build
│
└── Page components  (leaf nodes — Server Components by default)
```

### Applied fonts vs declared fonts

`app/layout.tsx` imports `Geist` and `Geist_Mono` and exposes them as `--font-geist-sans` / `--font-geist-mono` CSS vars. These are **not applied to the body**.

`app/globals.css` sets:
```css
--font-sans: "Manrope", sans-serif;
--font-heading: "Sora", sans-serif;
```

The body reads `--font-sans` (Manrope). Sora is loaded via `next/font/google` for headings. Geist is vestigial — remove it when cleaning up `app/layout.tsx`.

### Planned layout additions

```
app/[locale]/layout.tsx                i18n-aware root (en-US, en-GB, en-AE, de-DE, etc.)
app/(app)/layout.tsx                   Auth-gated layout — session check + redirect to /login
```

---

## 3. Auth Flow Map

**Current state: no auth system exists.**

All 22 public routes are accessible without authentication. There is no:
- Login or signup page
- Session or JWT middleware
- Protected route group
- `middleware.ts` at the root
- User model in `lib/models/`

### Planned auth flow (per CLAUDE.md)

```
User visits /(app)/* route
        │
        ▼
middleware.ts  (root — not yet created)
  Check session token (cookie or Authorization header)
        │
  ┌─────┴─────┐
  │           │
Valid       Invalid / missing
  │           │
  ▼           ▼
Render      Redirect to /login?next=[original path]
dashboard
```

### Planned auth boundaries

| Route group | Access | Guard location |
|---|---|---|
| `/(marketing)/*` | Public — no auth | None |
| `/(app)/*` | Authenticated users only | `middleware.ts` |
| `/api/contact` | Public — rate-limited | Cloudflare WAF |
| `/api/gdpr/*` | Authenticated user (own data only) | Route Handler session check |
| `/admin/*` | Admin role only | `middleware.ts` + role check |

---

## 4. API Routes Map

### Current routes

| Method | Path | Handler | Auth | Validation |
|---|---|---|---|---|
| POST | `/api/contact` | `app/api/contact/route.ts` | None | Zod (`contactSchema`) |

**`/api/contact` schema:**
```ts
contactSchema = z.object({
  name:    z.string().min(1).max(100),
  email:   z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(10).max(5000),
})
```

Current behavior: validates → logs to console → returns `{ success: true }`. Email delivery is a TODO.

**`/robots.txt`** and **`/sitemap.xml`** are generated by `app/robots.ts` and `app/sitemap.ts` respectively — not Route Handlers but Next.js metadata routes.

### Planned routes (per CLAUDE.md)

| Method | Path | Purpose | Auth |
|---|---|---|---|
| POST | `/api/gdpr/export` | Download user data as JSON | Session |
| POST | `/api/gdpr/delete` | Initiate account deletion | Session |
| POST | `/api/gdpr/rectify` | Data correction request | Session |
| GET | `/api/hosting/status` | Provisioning state polling | Session |
| POST | `/api/domains/check` | Domain availability check | None (rate-limited) |
| POST | `/api/domains/register` | Domain registration | Session |
| POST | `/api/webhooks/stripe` | Stripe payment events | Stripe signature |

All Route Handlers must follow the pattern in `docs/rules/coding-rules.md`: Zod validation, typed `NextResponse`, try/catch returning `{ error }` on failure.

---

## 5. Data Flow Diagram

```
Browser / CDN Edge
        │
        │ Static HTML (SSG/ISR — cached at Cloudflare edge)
        ▼
Next.js Server (VPS + PM2 + Nginx)
        │
        ├── Static pages (/, /about, /pricing, /wordpress-hosting, etc.)
        │     No data fetching — all content is hardcoded in page components
        │     Rendered at build time, served from edge cache
        │     Cache-Control: public, s-maxage=60, stale-while-revalidate=300
        │
        ├── /blog  (SSG)
        │     Build time: connectToDatabase() → Post.find({ status:"published" })
        │     Renders post listing from MongoDB
        │     Rebuild required to update list (no ISR on listing page)
        │
        ├── /blog/[slug]  (ISR — revalidate: 3600)
        │     Request time: connectToDatabase() → Post.findOne({ slug }).lean()
        │     Falls back to 404 (notFound()) if post missing or deletedAt set
        │     Re-fetches from MongoDB at most every 60 minutes
        │
        ├── /sitemap.xml
        │     Build time: Post.find({ status:"published", deletedAt:null }).lean()
        │     Static pages hardcoded in array (24 entries)
        │     Falls back gracefully if DB unreachable at build time
        │
        ├── /hosting/[region]  (SSG — params: us, uk, eu, uae)
        │     generateStaticParams returns the 4 regions
        │     Content is static — no DB fetch
        │
        ├── /vs/[competitor]  (SSG — dynamic segment)
        │     Content is static — no DB fetch
        │
        └── POST /api/contact
              Client form → Zod validation → console.log (email TODO)
              Returns: { success: true } | { error, details }
```

### MongoDB interactions (current)

```
lib/mongodb.ts
  └── connectToDatabase()   Singleton connection, global cache (hot-reload safe)

lib/models/post.ts
  └── Post model            IPost interface — blog posts only

Callers:
  app/(marketing)/blog/page.tsx          Post.find()     build time
  app/(marketing)/blog/[slug]/page.tsx   Post.findOne()  request time (ISR)
  app/sitemap.ts                         Post.find()     build time
```

All reads use `.lean()`. No writes from marketing pages — the only write path is `POST /api/contact`, which does not touch MongoDB (logs to console, no storage).

### Font and asset loading

```
Browser
  ├── Sora + Manrope          next/font/google — self-hosted, preloaded, display:swap
  ├── /public/logo/*.svg      Served as static assets from Nginx
  ├── /_next/static/*         JS bundles — Cache-Control: immutable, max-age=31536000
  └── Third-party scripts     next/script strategy="lazyOnload" (chat, analytics)
```

### Environment variables consumed

| Variable | Used in | Required |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `lib/seo/config.ts` | Yes (falls back to `https://dronahost.com`) |
| `MONGODB_URI` | `lib/mongodb.ts` | Yes (build fails without it for blog pages) |

---

## Architecture Notes

### What exists vs what CLAUDE.md specifies

| Feature | Status |
|---|---|
| `/[locale]/` route prefix | **Planned — not implemented** |
| `(marketing)` route group | Implemented |
| `(app)` authenticated area | **Not scaffolded** |
| Auth middleware | **Not created** |
| GDPR API routes | **Not created** |
| MongoDB models | Only `Post` — no User, Order, Domain, HostingAccount |
| Stripe / PayPal | **Not integrated** |
| i18n (`next-intl`) | **Not wired** |
| Redis caching | **Phase 2** |
| Cookie consent banner | **Not implemented** |
| `/v2` component showcase | Implemented (dev only) |

### Constraints to keep in mind

- Adding `[locale]` prefix is a **breaking URL change** — needs redirects from bare paths or a simultaneous cutover. Coordinate with any existing SEO indexing.
- Auth (middleware.ts) must exclude `/(marketing)/*`, `/api/contact`, and static assets — over-eager auth breaks public SEO crawlability.
- `Post` model uses soft-delete (`deletedAt`) — always filter `deletedAt: null` in every read query. The sitemap already does this correctly.
- `revalidate: 3600` on blog posts means a published post takes up to 1 hour to appear. Lower if needed, but increases DB load.

---

## 6. SEO Metadata

SEO metadata per page. Use these values verbatim in each page's `generateMetadata()` / `buildMetadata()` call. All titles follow the format `{Page Topic} | DronaHost`.

---

### Homepage (`/`)

| Field | Value |
|---|---|
| **Title tag** | Fast Cloud Web Hosting & WordPress Hosting \| DronaHost |
| **Meta description** | Get blazing-fast cloud web hosting & WordPress hosting with free SSL, daily backups, 24/7 expert support, and 99.9% uptime. Free migration. 30-day money-back guarantee. |
| **Canonical** | `https://dronahost.com/` |
| **H1 (banner)** | Cloud web hosting built for speed |

**Keywords**

| Type | Terms |
|---|---|
| Primary | cloud web hosting |
| Secondary | fast cloud web hosting · WordPress hosting · managed WordPress hosting · business email hosting · web hosting with free SSL · affordable web hosting for small business |

**JSON-LD schemas required**

- `Organization` — company name, URL, logo, address, social profiles
- `WebSite` — sitelinks search box potential
- `Product` + `Offer` — if pricing section is on the homepage
- `AggregateRating` — once Trustpilot / G2 scores are live

**Notes**

- Primary keyword "cloud web hosting" must appear in H1, first `<p>` of the hero description, and at least one subheading.
- "Free migration" and "30-day money-back guarantee" are trust signals required on the page per `CLAUDE.md`.
- Page targets US / UK / UAE — use USD pricing by default; show GBP/AED via geo-detection cookie.
