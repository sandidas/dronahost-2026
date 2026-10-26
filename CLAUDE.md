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

- WordPress hosting (managed, NVMe storage, NGINX caching, managed from a control panel; LiteSpeed, SSH and WP-CLI are not offered; the panel is Plesk and may be named, decisions 61, 66 and 79)
- Managed VPS hosting (`/managed-vps-hosting`)
- Cloud web hosting (`/cloud-web-hosting`)
- Business hosting (unmanaged web hosting with a control panel for any site; cPanel is in use but which products include it is not stated yet, so copy never says a plan includes it, decision 79; email is not included, decision 16)
- Reseller hosting (offered from 2026-10-11, decision 70; plans to come)
- Business email (a separate service with its own plans, never bundled with hosting; planned, decision 49)
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

The brand voice is data in **`content-engine/project/voice.json`** (`npm run content:voice` prints it). See **[content-engine/rules/content-writing-rules.md](content-engine/rules/content-writing-rules.md)** for the full enforced rule set, covering:

- Tone of voice and phrases to avoid (clarity and credibility, generic SaaS buzzwords)
- Consistent terminology (product names, technical terms, pricing language)
- Heading hierarchy rules (H1–H4 with examples per page type)
- CTA copy patterns (what to write, what to avoid, urgency rules)
- Error message guide (validation, API errors, payment failures, provisioning)
- Empty state copy patterns (structure and examples per context)
- SEO content rules (title format, meta description formula, keyword intent matching, E-E-A-T, AI discoverability)

---

## Content Work: ALWAYS follow the Content Engine

**Trigger.** Whenever you are asked to write, edit, review, translate or plan any content (page copy, blog or guide, FAQ, CTA, headline, metadata, microcopy, error or empty-state text, comparison table, keyword plan, maintenance or service text), **first run `npm run content:voice` and read `content-engine/README.md`**, then do what its "For the AI assistant" section says. The project skill `content-engine` (`.claude/skills/content-engine/`) routes these requests; in this repo it overrides any personal or global writing skill (including `seo-content-writer`). Do not write content from memory or from other files in this repo. Run `/write-content <keyword or title>` to plan a page; it stops at the brief for approval. Where this file and the engine differ, stop and ask.

The engine is reusable: `rules/`, `plans/`, `templates/` and `tools/` hold no business facts. Everything about DronaHost is in `content-engine/project/` and `content-engine/content-engine.config.json`:

- `project/settings.json`: brand name, wordmark, domain, business type, offerings, audience, locale, currencies, tax line, support channels, people. **Change the brand here.**
- `project/voice.json`: tone, readability limits, US spelling, word swaps, banned phrases, idioms, banned CTA labels. **Change the voice here.**
- `project/PROJECT.md` (facts), `DECISIONS.md`, `brand.md` (worked examples, product terms), `rules.config.json` (detection lists), the keyword register, the blueprints and page map.

Edit the engine's Claude files in `content-engine/claude/` and copy them to `.claude/` (`npm run content:install` adds missing ones; a test fails when the copies differ).

UI microcopy (labels, errors, empty states, success and helper text) lives in `content/strings.ts` or the page JSON, never in a component, and follows `content-engine/rules/content-writing-rules.md` sections 4 to 6 and 13.

Guard bullets, non-negotiable even if you skip the folder:

- Business facts come only from `content-engine/project/PROJECT.md` and the registries it names (identity in `project/settings.json`). A missing fact becomes `[HUMAN REVIEW: ...]`. Never invent an address, number, name, location, guarantee or review.
- Prices come only from `data/pricing.json`; same plans and prices for every country; only the currency changes. Prices appear on `/pricing` and on product pages' plan cards (decision 63, which reopened decision 58 for product pages); Home, comparisons, titles, descriptions, schema and FAQ answers carry no price.
- Tax: customers in India pay GST, everyone else pays none. Never "+ VAT" or "VAT included".
- No location claims. Cloud providers (AWS, Google Cloud, DigitalOcean) may be named in plain text in FAQ and answer copy and in the providers band under the technology strip, with a line that the provider can vary; never their logos, "partner" or "powered by", or in titles, descriptions or headings (decision 80). Write "for UK businesses", never "UK servers".
- Where we are based is said on `/about` only (decision 34). No title, description, headline or lead on any other page says "India" or "a team in India". The GST line is a tax rule and stays. `npm run check:content` enforces it (PO4).
- Page titles carry a reason to choose us (decision 35), from a rendering claim, a ledger fact or the page's plain job.
- Every page shows who reviewed it and when (`PageProvenance` section or a byline), one visible first-hand element, and its honest limits (`HonestLimits`); never pressure wording. Where trust and intent sit on the page: `content-engine/rules/trust-and-intent-design.md`. Checks IN5 and TR6 to TR8 enforce it (warnings first, decision 40).
- One keyword, one URL. Run `npm run check:register` after changing the register.
- A person fills the brief (reader's question, our angle, first-hand knowledge, one original element) before any AI draft. Show the brief before long copy.
- Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
- After publishing, update the register and run `npm run check:content` (it includes the page-spec and copy-source checks), `npm run check:register` and `npm run check:copy-source`.

---

## Trust Signals (NON-NEGOTIABLE for international B2B conversion)

Every page should reinforce trust. Required elements across the site:

### Global (footer, about page)

- Registered company name + registration number
- Physical business address on `/about` only (decision 34): be honest, never a made-up US or UK address. The footer carries the registered name and number, not the address
- VAT / tax registration numbers where applicable
- Team photos and names only where the owner chooses; marketing pages never name the owner and never say "small team" (decision 59)
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
- Locales: `en-US` (default), then `en-GB`, `en-AE` and `en-IE` (English for the EU), in that order (decision 6). Arabic and EU languages (`ar-AE`, `de-DE`, `fr-FR`, `nl-NL`) are a later phase
- Hreflang tags on every localized page
- i18n from day one — locale segment (`/[locale]/`) in app router from the start
- Phase rollout: English variants first (UK, then UAE, then EU in English), Arabic and EU languages after

### Date/time formatting

- Never use DD/MM/YYYY or MM/DD/YYYY alone (ambiguous)
- Use ISO format or spelled-out months: "15 January 2026" or "January 15, 2026"
- Display times with timezone: "14:00 UTC" or "9:00 AM ET"

---

## Pricing — Single Source of Truth (NON-NEGOTIABLE)

**All pricing data lives in `data/pricing.json` and nowhere else.**

**One price list for every product page (owner, 2026-10-11, decision 73).** `data/pricing.json` holds one lineup of hosting plans (Starter, Growth, Pro, Scale since version 4.0.0). There is no separate WordPress hosting, Business hosting or other per-product pricing. `/wordpress-hosting`, `/business-hosting` and every other commercial page may have its own copy and keyword, but each shows the same plans at the same prices through one component, `components/sections/HostingPricing.tsx` (preview at `/v2/pricing`). A page may change only the heading text and whether the extras show; it never picks plans, reorders them or adds a price.

### The rule

- **Never hardcode a price** in a component, page, metadata, CTA label, or copy string.
- **Never duplicate pricing** into another file, constant, or inline object.
- All components, `generateMetadata()`, JSON-LD schemas, CTAs, and content files read from `data/pricing.json`.
- When a price changes, update `data/pricing.json` only — every consumer updates automatically.

### How to read prices

```ts
// Read prices through the typed loader in lib/pricing (it applies FEATURES.pricesConfirmed), never by copying a number.
import pricing from "@/data/pricing.json";

const plan = pricing.plans.find((p) => p.id === "growth");
const annualUsd = plan?.pricing.annual.USD; // whatever pricing.json holds today; never typed into copy

// The button label never holds a price (decision 25): "Choose Growth".
// The price, billing period, renewal price and tax line sit above the button, formatted per currency.
```

### Rendering conventions (follow `data/pricing.json` and `lib/pricing`)

| Value | What to render |
|---|---|
| A limit named in `limits.fairUse` (e.g. Scale: `["sites", "domains", "databases", "bandwidth"]`) | "Fair use" (`isFairUse()` in `lib/pricing`), linked to the fair-use policy once it exists. Never "Unlimited" |
| `null` on a limit not named in `limits.fairUse` | Not set yet: render nothing (or "Not included" in a comparison table). Never "Unlimited" |
| `limits.resourceType` | "Shared", "Semi-dedicated" or "Dedicated" |
| `internal.*` (mailboxes, bandwidth, visits) | Never rendered. Bandwidth lives only in `internal.bandwidthGB` |
| `headlineFeatures` | The plan card's feature list, as written; only limits and capabilities true in the same file |
| `pricing.monthly.USD: null` | "Custom pricing. Talk to the team for a quote." |
| `vatDisplay: null` | Show the price only, with its currency symbol and billing period |

### Renewal pricing

- **Every card shows the renewal price** beneath the signup price: `Renews at $X/month`. The value comes from the explicit `pricing.renewal` field in `data/pricing.json`, never derived from the signup price.
- **Promise wording is gated by claims.** The phrase "same price, no increase" renders only when the `renewal-price-same` claim renders (`isVerified("renewal-price-same")`: verified AND its terms page published) and the data agrees. Until then the card shows the price without the promise.
- Never hide the renewal price or put it in a tooltip.

### CTA format (per content-writing-rules §4)

```
[Choose {{plan name}}]            (price, billing period, renewal price and tax line sit above the button, never inside it)
30-day money-back guarantee. Read the refund policy.   (only while the `money-back` claim renders)
```

Never "no questions asked", a countdown or "only X left": pressure wording fails trust check TR8 (`content-engine/rules/trust-and-intent-design.md`, section 5).

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

## Regional Pages Strategy (SEO + Compliance)

DronaHost owns no data centers and has no fixed server location per plan (decision 12). Regional pages target the market, not a server location. Write "for UK businesses", never "UK servers" or "UK datacenter".

- `/hosting/us`: for US businesses
- `/hosting/uk`: for UK businesses (UK GDPR)
- `/hosting/eu`: for EU businesses (GDPR), English, `en-IE` (decision 6)
- `/hosting/uae`: for UAE businesses (PDPL)

Each page should:

- Explain what matters for that market (rules that apply, currency, support hours) without claiming a server location
- Name a city or latency only when the infrastructure registry confirms it for that plan
- Include region-specific testimonials and case studies (real only)
- Address region-specific concerns (GDPR for EU, UK GDPR for UK, PDPL for UAE)
- Use region-specific currency by default

Regional pages are noindex until the page map marks them Ready (decision 47). They follow `content-engine/plans/05-regional-and-location.md`.
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

See also **[content-engine/rules/content-writing-rules.md §7](content-engine/rules/content-writing-rules.md)** for the copy side: title format, meta description formula, keyword intent matching, content length requirements, FAQ writing rules, and E-E-A-T implementation.

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
  /sections             # Page sections (HomeHero, PageHero, TwoColumn, FeatureGrid, ProcessSteps, CTASection, ResourceGrid, Testimonials, FAQSection, LogoStrip, CaseStudy, PricingCards, PricingJourney, StatsBar, TrustBadges, JsonLd)
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

See **[content-engine/rules/content-writing-rules.md](content-engine/rules/content-writing-rules.md)** — full tone guide, terminology list, CTA patterns, error messages, empty states, and SEO content rules.

---

## Design system and QA (added during the v2 polish)

- **Tokens**: `app/styles/tokens.css` (colour, radius, shadow, type, motion; dark default) and `app/styles/buttons.css`. Layers declared directly in `globals.css` get flattened by this build, so layered CSS must live in imported files. Use token utilities (`bg-card`, `text-muted-foreground`, `text-link`, `bg-action`), never raw palette colours. `npm run check:contrast` gates every token pair and runs first in `npm run build`.
- **Fonts are fixed**: Sora for headlines (`font-heading`), Manrope for every other text (`font-sans`). Never add or swap a font family in a component, section or page; vary only size (responsive), loaded weight, tracking and colour. No italic, no mono outside code. See `docs/rules/ui-ux-rules.md` §3.6.
- **Components**: see `docs/components/README.md`. Every section takes `headingLevel`; heroes are `ProductHero`, `SplitHero`, `CenteredHero`. Showcase: `/v2` and `/v2/design-system` (development only; they return 404 in production).
- **No invented facts**: public facts render only from verified registries (`content/claims.ts`, `content/trust.ts`, `content/company.ts`). Sample data lives only in `content/placeholders.ts`. No section prints a status label such as "unverified", "sample" or "draft" (`docs/rules/ui-ux-rules.md` §3.7); gates keep unready data out of production. Prices come only from `data/pricing.json` via `lib/pricing`, and are hidden in production until `FEATURES.pricesConfirmed` (`lib/flags.ts`). The full to-do list is `docs/reference/PLACEHOLDERS.md`.
- **Copy**: draft copy lives in `content/*.ts`. Follow `content-engine/rules/content-writing-rules.md`; no unconfirmed numbers, guarantees or competitor claims.
- **QA**: after `npm run build && npx next start -p 3200`, run `npm run qa` (contrast, axe, links, JSON-LD, raw entities). Lighthouse and screenshot helpers are in `scripts/`; results are in `docs/reference/QA_REPORT.md`.
- **Gotchas**: do not run `next build` while `next dev` is running in the same folder (intermittent font import-map error; re-run). Do not wrap the root layout children in `Suspense` (it turns 404s into 200s).

- **Locale routing**: next-intl with `as-needed` prefixes (English unprefixed). Use `Link` from `@/i18n/link`, never `next/link`, for internal links. Variants (`/en-gb`, `/en-ae`) stay off until `FEATURES.localeVariants`. See the "Locale routing" entry in `docs/components/CHANGELOG.md`.

