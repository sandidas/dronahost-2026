# DronaHost v2.0 — Project Context for Claude Code

## Project Overview

Rebuilding **dronahost.com** (web hosting + web design/development agency) as v2.0.
Current status: 4–5 pages complete, actively in development.
The live v1 site at dronahost.com is a reference for **services offered only** — not code patterns or copywriting style.

## Target Markets (CRITICAL — shapes everything)

**Audience:** educated small-business owners, freelancers and agencies worldwide who read English as a first or second language. They are smart but not necessarily technical. They compare providers carefully and distrust hype. Write plain international English (US English by default, roughly grade 8-10, no idioms that do not translate).

**Compliance and currency priority markets:** USA, United Kingdom, United Arab Emirates, European Union (Germany, Netherlands, France, Ireland)
**Everyone else is welcome.** India and the rest of the world are served too; INR is offered through the currency selector.

This shapes: pricing currency, server locations, copywriting voice, compliance requirements, support hours, payment methods, trust signals.

## Services Offered

- WordPress hosting (managed, LiteSpeed-optimized)
- VPS hosting
- Cloud hosting
- Business hosting (email + site bundles)
- Domain registration
- Website design (WordPress, custom)
- SEO services (retainer-based)
- Custom development (React / Next.js solutions)

## Tech Stack

- **Framework**: Next.js 16 (App Router, React Server Components)
- **Language**: TypeScript (strict mode)
- **Database**: MongoDB Atlas with Mongoose ODM (region-specific clusters for GDPR compliance)
- **Styling**: Tailwind CSS
- **Deployment**: Self-hosted VPS running Node.js with PM2
- **Reverse proxy**: Nginx (confirmed)
- **Node version**: 20.x LTS

## Top Priorities (in strict order)

1. **Trust signals for international buyers** — the #1 conversion barrier
2. **SEO** — rank in US/UK/EU Google; be citable by AI tools (ChatGPT, Perplexity, Claude, Gemini)
3. **Performance** — Core Web Vitals all green; LCP < 2s, INP < 200ms, CLS < 0.1
4. **GDPR + compliance** — non-negotiable for EU/UK traffic
5. **Reliability** — hosting company downtime destroys credibility
6. **API integrations** — Stripe/PayPal, domains, control panel, email, analytics, chat, auth
7. **Accessibility** — WCAG 2.1 AA minimum (ADA compliance matters in US market)

---

## Brand Voice & Copywriting

See **[docs/content-planner/rules/content-writing-rules.md](docs/content-planner/rules/content-writing-rules.md)** for the full enforced rule set, covering:

- Tone of voice and phrases to avoid (clarity and credibility, generic SaaS buzzwords)
- Consistent terminology (product names, technical terms, pricing language)
- Heading hierarchy rules (H1–H4 with examples per page type)
- CTA copy patterns (what to write, what to avoid, urgency rules)
- Error message guide (validation, API errors, payment failures, provisioning)
- Empty state copy patterns (structure and examples per context)
- SEO content rules (title format, meta description formula, keyword intent matching, E-E-A-T, AI discoverability)

---

## Content Work: ALWAYS follow the Content Planner

**Trigger.** Whenever you are asked to write, edit, review, translate or plan any content (page copy, blog or guide, FAQ, CTA, headline, metadata, microcopy, comparison table, keyword plan, maintenance or service text), **first read `docs/content-planner/README.md`** and do what its "For the AI assistant" section says. Do not write content from memory or from other files in this repo. Run `/write-content <keyword or title>` to plan a page; it stops at the brief for approval. Where this file and the planner differ, stop and ask.

The planner is a reusable engine: `rules/`, `plans/` and `tools/` hold no business facts; `project/` and `content-planner.config.json` hold everything about DronaHost (facts, `brand.md`, `rules.config.json`, owner decisions, the keyword register).

Guard bullets, non-negotiable even if you skip the folder:

- Business facts come only from `docs/content-planner/project/PROJECT.md` and the registries it names. A missing fact becomes `[HUMAN REVIEW: ...]`. Never invent an address, number, name, location, guarantee or review.
- Prices come only from `data/pricing.json`; same plans and prices for every country; only the currency changes.
- Tax: customers in India pay GST, everyone else pays none. Never "+ VAT" or "VAT included".
- No location claims and no cloud provider names on marketing pages. Write "for UK businesses", never "UK servers".
- Where we are based is said on `/about` only (decision 34). No title, description, headline or lead on any other page says "India" or "a team in India". The GST line is a tax rule and stays. `npm run check:content` enforces it (PO4).
- Page titles carry a reason to choose us (decision 35), from a rendering claim, a ledger fact or the page's plain job.
- One keyword, one URL. Run `npm run check:register` after changing the register.
- A person fills the brief (reader's question, our angle, first-hand knowledge, one original element) before any AI draft. Show the brief before long copy.
- Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
- After publishing, update the register and run `npm run check:pages`, `npm run lint:content`, `npm run check:content` and `npm run check:register`.

---

## Trust Signals (NON-NEGOTIABLE for international B2B conversion)

Every page should reinforce trust. Required elements across the site:

### Global (footer, about page)

- Registered company name + registration number
- Physical business address (India is fine — be honest, don't fake a US address)
- VAT / tax registration numbers where applicable
- Founder/team photos with real names and LinkedIn links
- Year founded, number of customers, years in business
- Security badges (SSL, PCI-DSS if handling cards directly)

### Homepage + landing pages

- Testimonials with: full name, company, role, headshot, link to LinkedIn or company site
- Logo wall of customer brands (with permission)
- Case studies with concrete metrics (load time before/after, conversion lift, etc.)
- Trust badges: Stripe, PayPal, Let's Encrypt, Cloudflare
- Third-party review scores: Trustpilot, G2, HostAdvice, Clutch

### Explicit transparency pages

- `/security` — data protection, pentests, backup policy
- `/sla` — uptime SLA, service credits, definitions
- `/refund-policy` — 30-day money-back guarantee with clear terms
- `/data-processing` — GDPR DPA download (PDF)
- `/privacy` — GDPR + CCPA compliant
- `/terms` — written for the jurisdictions we sell into (US, UK, EU, UAE)

### What to avoid

- Stock photos presented as "our team"
- Fake testimonials (buyers reverse-image-search and LinkedIn-check)
- US phone number that isn't actually answered by a native English speaker
- Claims without proof ("we've served 50,000+ customers" needs evidence)

---

## Multi-Currency & Localization

### Currencies to support

- **USD ($)** — default for US, Canada, rest-of-world
- **GBP (£)** — UK users
- **EUR (€)** — EU users
- **AED (د.إ)** — UAE users
- **INR** — offered through the currency selector or a locale, never forced

### Detection

- Use Cloudflare `CF-IPCountry` header or IP geolocation at edge
- Allow manual currency override via cookie
- Persist user choice across sessions
- Show prices in detected currency on first load, never force conversion

### Pricing display

- Show price WITH currency symbol always: `$5.99/month` not `5.99/month`
- Tax line: one plain sentence near prices ("Prices exclude tax. Customers in India pay GST at checkout."). No "+ VAT" or "VAT included" (see Tax handling)
- US pricing: tax excluded by convention
- UAE: "AED X/month" — show in Arabic numerals, offer Arabic locale toggle

### Internationalization

- Use `next-intl` or `next-international` for i18n
- Locales: `en-US` (default), `en-GB`, `en-AE`, `ar-AE`, `de-DE`, `fr-FR`, `nl-NL`
- Hreflang tags on every localized page
- i18n from day one — locale segment (`/[locale]/`) in app router from the start
- Phase rollout: English variants first (en-US, en-GB, en-AE), Arabic + EU languages in phase 2

### Date/time formatting

- Never use DD/MM/YYYY or MM/DD/YYYY alone (ambiguous)
- Use ISO format or spelled-out months: "15 January 2026" or "January 15, 2026"
- Display times with timezone: "14:00 UTC" or "9:00 AM ET"

---

## Pricing — Single Source of Truth (NON-NEGOTIABLE)

**All pricing data lives in `data/pricing.json` and nowhere else.**

### The rule

- **Never hardcode a price** in a component, page, metadata, CTA label, or copy string.
- **Never duplicate pricing** into another file, constant, or inline object.
- All components, `generateMetadata()`, JSON-LD schemas, CTAs, and content files read from `data/pricing.json`.
- When a price changes, update `data/pricing.json` only — every consumer updates automatically.

### How to read prices

```ts
import pricing from "@/data/pricing.json";

// Get annual USD price for Growth plan
const plan = pricing.plans.find(p => p.id === "growth");
const price = plan.pricing.annual.USD; // 19.99

// Format for CTA (content-writing-rules §4: include price in CTA)
// → "Start Growth — $19.99/month"

// Get currency metadata (symbol, VAT display)
const currency = pricing.currencies.USD;
// → { symbol: "$", vatDisplay: null }

// UK: "Start Growth — £15.99/month"
// EU: "Start Growth — €17.99/month"
```

### Rendering conventions

| Value | What to render |
|---|---|
| `null` on a limit field | "Unlimited" |
| `trafficType: "semi-dedicated"` | "Semi-Dedicated" badge |
| `trafficType: "dedicated"` | "Dedicated" badge |
| `pricing.monthly.USD: null` | "Custom pricing — contact us" |
| `vatDisplay: null` | Show price only: "$19.99/month" |

### Renewal pricing

- **Every card shows the renewal price** beneath the signup price: `Renews at $X/month`. The value comes from the explicit `pricing.renewal` field in `data/pricing.json`, never derived from the signup price.
- **Promise wording is gated by claims.** The phrase "same price, no increase" renders only when the `renewal-price-same` claim renders (`isVerified("renewal-price-same")`: verified AND its terms page published) and the data agrees. Until then the card shows the price without the promise.
- Never hide the renewal price or put it in a tooltip.

### CTA format (per content-writing-rules §4)

```
Start [Plan Name] — $[annual price]/month
30-day money-back guarantee. No questions asked.
```

### Tax handling (owner rule, 2026-10-07)

- Customers in India are charged GST. Customers everywhere else are charged no tax.
- Pages show one line near prices: "Prices exclude tax. Customers in India pay GST at checkout."
- Never display "+ VAT" or "VAT included". `vatDisplay` stays empty for every currency.
- If the business later registers for VAT in another market, this section changes first.

### Addons

- All addon pricing in `pricing.addons[]`.
- Never create a one-off addon price outside this file.
- Addons rendered as optional line items on plan cards and checkout.

### Regional pages

- Each region's default currency is in `pricing.regions[regionKey].defaultCurrency`.
- Use this to auto-select currency on `/hosting/uk`, `/hosting/eu`, `/hosting/us`, `/hosting/uae`.

### When to update pricing.json

- A plan price changes → update `pricing` object for that plan in all currencies.
- A new plan is added → add to `plans[]` array with all required fields.
- A feature changes → update `limits` or `capabilities` objects.
- A new addon is introduced → add to `addons[]`.
- **Always update `_meta.lastUpdated`** when any value changes.

---

## Server Locations Strategy (SEO + Compliance)

Create dedicated landing pages for each region:

- `/hosting/us` — US datacenter (target: US market, low-latency US audience)
- `/hosting/uk` — UK datacenter (target: UK market + data residency)
- `/hosting/eu` — EU datacenter (Frankfurt or Amsterdam — GDPR data residency)
- `/hosting/uae` — UAE datacenter (if available, or nearest: Frankfurt/Mumbai)

Each page should:

- Explain why location matters (latency, compliance, SEO)
- Show approximate latency from major cities in that region
- Include region-specific testimonials and case studies
- Address region-specific concerns (GDPR for EU, HIPAA mentions for US, etc.)
- Use region-specific currency by default

---

## GDPR + Data Protection Compliance (MANDATORY for EU/UK)

### Required implementation

- **Cookie consent banner**: granular (necessary / preferences / analytics / marketing), with reject-all option equally prominent as accept-all — required by EU law
- Use a compliant CMP: Cookiebot, Iubenda, or self-built with proper consent logging
- **Privacy policy**: GDPR Article 13/14 compliant — lawful basis, retention periods, third-party processors, data subject rights
- **Data Processing Agreement (DPA)**: available for download, signed automatically on account creation for business plans
- **Cookie policy**: list every cookie, purpose, duration, third-party

### Data subject rights endpoints

- `POST /api/gdpr/export` — user data export (JSON download)
- `POST /api/gdpr/delete` — account + data deletion request
- `POST /api/gdpr/rectify` — data correction
- All with email confirmation + 30-day response window logged

### Infrastructure requirements

- EU customer data stored on EU servers (Frankfurt/Amsterdam)
- No transfer to non-adequate countries without SCCs (Standard Contractual Clauses)
- Log data processing activities (Article 30 record)
- Breach notification procedure: 72-hour reporting obligation

### Other regional compliance

- **CCPA (California)**: "Do Not Sell My Personal Information" link if applicable
- **UK GDPR**: mirrors EU GDPR but with ICO as supervisory authority
- **UAE PDPL**: Personal Data Protection Law — similar to GDPR
- **Accessibility**: WCAG 2.1 AA for ADA compliance (US lawsuit risk)

---

## SEO Requirements

See **[docs/rules/seo-rules.md](docs/rules/seo-rules.md)** for the full enforced rule set, covering:

- `buildMetadata()` helper usage and required fields for every page
- JSON-LD schema code for every page type (Organization, WebSite, Product, Offer, AggregateRating, BlogPosting, BreadcrumbList, FAQPage, Service, Article)
- `app/sitemap.ts` and `app/robots.ts` implementation patterns
- International SEO — hreflang rules, locale URL structure, regional landing page requirements
- Core Web Vitals — LCP, CLS, INP targets and what breaks them in Next.js
- Crawl budget — what to noindex, canonical rules, redirect patterns
- Off-page strategy — link building targets, review platforms, Reddit citation tactics
- SEO monitoring — Google Search Console setup, KPIs, weekly checks
- Per-page-type pre-ship checklists (hosting plans, blog posts, comparison pages, regional pages)

See also **[docs/content-planner/rules/content-writing-rules.md §7](docs/content-planner/rules/content-writing-rules.md)** for the copy side: title format, meta description formula, keyword intent matching, content length requirements, FAQ writing rules, and E-E-A-T implementation.

---

## Performance Rules (VPS-specific)

### Next.js patterns

- Default to **Server Components**; add `"use client"` ONLY for interactivity/hooks
- Use `next/dynamic` with `ssr: false` only for genuinely client-only widgets
- Prefer SSG (`generateStaticParams`) for blog posts; ISR (`revalidate: 3600`) for plan pages
- Avoid client-side data fetching for indexable content

### Assets

- Images: `next/image`, AVIF/WebP, lazy below fold, `priority` only for LCP image
- Fonts: `next/font` with `display: swap`, subset to Latin only (add Arabic subset for UAE pages)
- Third-party scripts: `next/script` with `strategy="lazyOnload"` for non-critical

### CDN + Edge (critical for global performance)

- **Cloudflare in front of the VPS** — non-negotiable for global latency
- Cache HTML at edge with short TTL + revalidation
- Cache static assets at edge with long TTL + immutable
- Use Cloudflare's geo-routing for currency detection
- Enable Brotli, HTTP/3, 0-RTT

### Caching on VPS

- Nginx: cache static assets (`_next/static/*`) with `Cache-Control: public, max-age=31536000, immutable`
- HTML: `Cache-Control: public, s-maxage=60, stale-while-revalidate=300`
- MongoDB: use `.lean()` for reads; cache hot queries in Redis (add in phase 2)
- Add `Cache-Control` headers in Route Handlers via `NextResponse`

### Targets

- Lighthouse: 95+ on Performance, SEO, Accessibility, Best Practices
- Total JS per page: < 150KB gzipped
- LCP < 1.5s on 4G from London/New York/Dubai
- No blocking third-party scripts in `<head>`

---

## Folder Structure

```
/app
  /[locale]             # Locale segment: en-us, en-gb, en-ae, de-de, etc. — from day one
    /(marketing)        # Public/marketing pages (confirmed route group name)
    /(app)              # Authenticated pages (dashboard, account)
    /blog
    /kb
    /experience         # Confirmed URL slug (was "Experience&Growth")
  /api                  # Route handlers (not locale-prefixed)
  sitemap.ts
  robots.ts
/components
  /ui                   # Primitives (Button, Section, HeadLineText, Image, Card, Badge)
  /sections             # Page sections (HomeHero, PageHero, TwoColumn, FeatureGrid, ProcessSteps, CTASection, ResourceGrid, Testimonials, FAQSection, LogoWall, CaseStudy, PricingCards, PricingJourney, StatsBar, TrustBadges, JsonLd)
/lib
  /models               # Mongoose schemas
  /services             # Third-party API wrappers
  /seo                  # Metadata helpers, schema generators
  /i18n                 # Translation helpers
  /pricing              # Currency conversion, regional pricing
  /compliance           # GDPR, CCPA helpers
  /auth
  mongodb.ts
  utils.ts
/messages               # Translation JSON files per locale
/content                # Static marketing copy
/public
  llms.txt
  llms-full.txt
/scripts
  generate-llms-txt.ts
/types
```

---

## MongoDB Conventions

- Connection: singleton in `/lib/mongodb.ts` with global caching (Next.js hot-reload safe)
- Schemas in `/lib/models/`, one per file, named export
- Always `.lean()` for read queries
- Index fields used in queries (`slug`, `status`, `publishedAt`, `region`, `userId`)
- Never expose Mongoose queries to client — Server Components or Route Handlers only
- Use Zod schemas to validate ALL incoming data before DB writes
- Soft-delete pattern (`deletedAt` field) — never hard-delete user/order/payment data (required for tax/audit in the jurisdictions we sell into)
- **EU user data on EU-region MongoDB cluster** (GDPR data residency)
- Use MongoDB Atlas with region-specific clusters (confirmed — chosen for GDPR compliance simplicity)

---

## API Integration Guide (Market-Specific)

All integrations wrapped in `/lib/services/[service].ts`. Each service exports typed functions, handles errors, logs failures.

### Domain Registrar

- Wrap in `/lib/services/domains.ts`
- Cache TLD pricing (refresh hourly)
- Availability checks: debounce client-side, 10s timeout server-side
- Support region-specific TLDs: `.co.uk`, `.de`, `.fr`, `.nl`, `.eu`, `.ae`, `.us`, `.co`
- Include ICANN fee in displayed price (US legal requirement)
- Store registrations in `domains` collection linked to user
- WHOIS privacy enabled by default (buyers expect it free)

### Hosting Control Panel (WHMCS/cPanel/Plesk)

- Wrap in `/lib/services/hosting.ts`
- Provisioning is async — use a job queue pattern (DB-backed queue on VPS)
- Store provisioning state machine in `hosting_accounts` collection
- Expose status via polling or SSE
- **Assign to regional server based on user location** at provisioning time

### Analytics

- **Plausible or Fathom preferred** — cookieless, GDPR-compliant, no consent banner required
- GA4 acceptable but requires cookie consent banner in EU/UK
- Load via `next/script` with `strategy="afterInteractive"`
- Track conversions: signup, purchase, contact form, discovery call booking
- Consider server-side tracking for accuracy (Stape, or custom)

### Live Chat (not offered)

- Live chat, WhatsApp and phone support are not offered (owner decision 22, 2026-10-07). Support is by ticket and email only.
- Do not add a chat widget, a chat or WhatsApp button, or a phone number anywhere. If this changes, the owner reopens decision 22 first.

## Security Rules (hosting companies are high-value targets)

- All secrets in `.env.local`, never committed — `.gitignore` rules
- Validate ALL user input with Zod before processing
- Rate-limit public API routes (Cloudflare rules + app-level)
- CSRF tokens on state-changing forms
- Content Security Policy via `next.config.js`
- Strict security headers: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- Sanitize all user-generated content (DOMPurify for rich text)
- Log auth failures, payment events, admin actions to separate audit collection (required for PCI-DSS if applicable)
- Never log secrets, tokens, passwords — even in errors
- Stripe: use Radar for fraud detection; expect higher attempt rates on US, UK and EU cards
- Plan for DDoS protection (Cloudflare) — hosting companies are targeted

## Coding Rules

See **[docs/rules/coding-rules.md](docs/rules/coding-rules.md)** for the full enforced rule set, covering:

- TypeScript strict mode (no `any`, typed API responses)
- SSR enforcement (`"use client"` banned at page level)
- SEO (`generateMetadata` on every page, JSON-LD schemas, sitemap/robots)
- Code readability (file/function length limits, naming conventions)
- Reusable components (typed props, no editing shadcn source)
- Optional chaining + nullish coalescing patterns
- Loop guards (array checks, hard caps on user input)
- Fallback guards (error boundaries, DB try/catch, route handler shape)
- Mongoose rules (`.lean()`, `select: false`, Zod validation)
- Tailwind + shadcn (`cn()`, dark mode, design tokens)
- What NOT to do (banned patterns across SSR, SEO, copy, security)
- **Pricing source of truth** — `data/pricing.json` only. No hardcoded prices anywhere. See [Pricing — Single Source of Truth](#pricing--single-source-of-truth-non-negotiable).

---

## When suggesting changes

- Explain SEO/performance impact when relevant
- Show full metadata + JSON-LD for any new page
- Flag Core Web Vitals regressions
- Flag GDPR/compliance implications for any feature touching user data
- Flag copywriting that uses a phrase from the content rules' "Phrases to avoid" list or misses the reading-level rule
- **Pricing changes:** Always update `data/pricing.json` first — never suggest hardcoded prices in components or copy. Show the JSON diff alongside any component change.
- **Any component that renders a price:** Verify it imports from `data/pricing.json`, not a hardcoded value. Flag and fix if not.
- **New plan pages or pricing sections:** Confirm `data/pricing.json` has the plan before writing any component or copy.
- For DB schema changes, propose migration strategy
- For payment/auth changes, call out security implications explicitly

---

## Content & Brand Voice Summary

See **[docs/content-planner/rules/content-writing-rules.md](docs/content-planner/rules/content-writing-rules.md)** — full tone guide, terminology list, CTA patterns, error messages, empty states, and SEO content rules.

---

## Design system and QA (added during the v2 polish)

- **Tokens**: `app/styles/tokens.css` (colour, radius, shadow, type, motion; dark default) and `app/styles/buttons.css`. Layers declared directly in `globals.css` get flattened by this build, so layered CSS must live in imported files. Use token utilities (`bg-card`, `text-muted-foreground`, `text-link`, `bg-action`), never raw palette colours. `npm run check:contrast` gates every token pair and runs first in `npm run build`.
- **Components**: see `docs/components/README.md`. Every section takes `headingLevel`; heroes are `ProductHero`, `SplitHero`, `CenteredHero`. Showcase: `/v2` and `/v2/design-system` (development only; they return 404 in production).
- **No invented facts**: public facts render only from verified registries (`content/claims.ts`, `content/trust.ts`, `content/company.ts`). Sample data lives only in `content/placeholders.ts`. Prices come only from `data/pricing.json` via `lib/pricing`, and are hidden in production until `FEATURES.pricesConfirmed` (`lib/flags.ts`). The full to-do list is `docs/reference/PLACEHOLDERS.md`.
- **Copy**: draft copy lives in `content/*.ts`. Follow `docs/content-planner/rules/content-writing-rules.md`; no unconfirmed numbers, guarantees or competitor claims.
- **QA**: after `npm run build && npx next start -p 3200`, run `npm run qa` (contrast, axe, links, JSON-LD, raw entities). Lighthouse and screenshot helpers are in `scripts/`; results are in `docs/reference/QA_REPORT.md`.
- **Gotchas**: do not run `next build` while `next dev` is running in the same folder (intermittent font import-map error; re-run). Do not wrap the root layout children in `Suspense` (it turns 404s into 200s).

- **Locale routing**: next-intl with `as-needed` prefixes (English unprefixed). Use `Link` from `@/i18n/link`, never `next/link`, for internal links. Variants (`/en-gb`, `/en-ae`) stay off until `FEATURES.localeVariants`. See the "Locale routing" entry in `docs/components/CHANGELOG.md`.

