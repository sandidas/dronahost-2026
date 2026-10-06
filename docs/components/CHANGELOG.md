# Changelog: v2 polish

Branch `polish/design-system`. Each batch is one commit.

## Baseline
- Snapshot of in-progress work before the polish (`c82d00b`).

## Batch 0: claims, headings, landmarks
- `content/claims.ts` registry; stats, trust badges, testimonials, logos and case study render only when verified.
- Removed Trustpilot/G2 "verified" labels; payment brands appear only as accepted methods.
- `headingLevel` props and `aria-labelledby` on shared sections; skip link and `<main id="main-content">`.
- Official logo SVG in header, drawer and footer.
- `lib/pricing` reads `data/pricing.json`; meta descriptions no longer hardcode prices.
- Missing shadcn `skeleton`/`table` added so the build type-checks.

## Phase 2: design system
- `app/styles/tokens.css`: dark-default light/dark tokens, brand-anchored (orange action, teal secondary), 12/16/24 radius, layered shadows, fluid type, motion tokens.
- `npm run check:contrast` gates 74 token pairs against WCAG AA (runs first in `npm run build`).
- `Button` rewritten (4 variants, 3 sizes, loading/disabled); `Surface`, `Reveal`; `Badge`/`GradientText` recolored.
- `/v2/design-system` page. Dark surface separation measured and increased.

## Batch A: navigation
- Header, hosting mega menu (crawlable), mobile drawer, footer, announcement bar, theme toggle, currency selector (flagged off).
- `content/navigation.ts` is the single source for links.

## Batch B: heroes
- Nine hero variants replaced by `ProductHero`, `SplitHero`, `CenteredHero`.

## Batch C: content sections
- `FeatureGrid`, `BentoGrid`, `ComparisonTable`, `TwoColumn` with designed visuals; homepage recomposed.

## Batch D: pricing
- `PricingPlans` + `PricingExtras`; `/pricing` rebuilt on `pricing.json` only (a second conflicting price list deleted).
- Price visibility flag; `/wordpress-hosting` rebuilt (WP Engine template removed).

## Batches E and F: social proof and content blocks
- Verified-only `Testimonials`, `LogoWall`, `CaseStudy`, `StatsBar`, `TrustSignals`, `TrustBadges`.
- `FAQSection` (native `<details>`), `CTABand`, `ProcessTimeline`, `ResourceGrid`, `CodeBlock`, `NewsletterSignup`, `SupportChannels`.

## Phase 4: QA and site-wide cleanup
- Remaining pages moved onto the design system: About, SEO, VPS, cloud, business hosting, domains, web design, growth, regions, blog, contact, legal pages (restyled), 404 and error pages.
- Fixed: soft 404s (root `Suspense` removed; dev routes return a real 404), contact form that discarded messages (now stored in MongoDB with a honeypot and rate limit), dead `/login` link (flagged), dead DPA PDF link, guessed `sameAs` social URLs in Organization schema.
- Competitor comparison pages (`/vs/*`) gated off (unverified claims); regional pages made claim-free.
- QA scripts: `npm run qa` (contrast, axe, links, JSON-LD, raw entities).

## Batch G: launch features

- **Primitives:** `Breadcrumbs` (shares its source with the JSON-LD), `EmptyState`, `Dialog` (native `<dialog>`), `Skeleton` loading blocks, `global-error.tsx`.
- **Layouts:** `LegalPage` (breadcrumbs, last-updated date, on-this-page list) applied to all six policy pages; `StickyMobileCTA` (phones only, CSS transition, reduced-motion safe).
- **Consent and analytics:** `CookieConsent` (Reject all and Accept all identical; preferences dialog loaded on demand), `CookieSettingsButton` in the footer, `/api/consent` log, Plausible (cookieless) plus GA4 only after analytics consent. Env: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_GA_ID`.
- **Forms:** `FormWizard` with `MigrationForm` and `ConsultationForm` at `/migration` and `/consultation`; Zod schemas in `lib/forms/schemas.ts`; honeypot, timing check, in-memory rate limit and Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`); stored with a TTL (`FORM_RETENTION_DAYS`, default 730); team email through Amazon SES (`AWS_REGION`, `SES_FROM`, `SES_TO`). The contact form uses the same guards.
- **Blog:** source switches on `WORDPRESS_API_URL` (headless WordPress REST) and falls back to the legacy MongoDB posts. HTML is sanitized with an allow-list (`sanitize-html`). New: `ArticleLayout`, `ArticleToc`, `AuthorBox` (only with a real bio), related posts, `CategoryFilter`, `Pagination`.
- **Domains:** `DomainSearch` and `/api/domains/search` on the WHMCS `DomainWhois` action, behind `FEATURES.domainSearch` (off).
- **Tests and CI:** Playwright e2e (`npm run test:e2e`, 18 tests: consent, forms, blog with a WordPress mock, keyboard, 404s), `.github/workflows/ci.yml` (types, lint, contrast, build, e2e, axe, links, JSON-LD, entities) and `lighthouserc.json` budgets.

Not built (nothing needs them yet): tabs, tooltip, toast, floating WhatsApp button (needs a verified number), locale routing (`/[locale]`).

Known trade-off: a `loading.tsx` file wraps the whole route segment in Suspense, which turns `notFound()` into a 200 response. The blog therefore uses an in-page Suspense for its list and has no `loading.tsx`.

## Locale routing (next-intl)

- **URLs:** English is the default and has no prefix, so every existing URL is unchanged. Variants live at `/en-gb/...` and `/en-ae/...` (lowercase segments; `lang`, hreflang and `og:locale` use `en-GB`, `en-AE`).
- **Off by default:** `FEATURES.localeVariants` (lib/flags.ts) is false, so the variants return 404, are not in the sitemap and have no hreflang. Turn it on once their content, currency and regional claims are confirmed. With it on, canonical, hreflang, sitemap alternates and a footer language switcher appear automatically (verified with `E2E_VARIANTS=1 npm run test:e2e` against a build with the flag on).
- **No cookie, no redirect:** `localeDetection` and `localeCookie` are off. Visitors stay on the URL they asked for; switching language is an explicit link. No extra cookie to disclose.
- **Structure:** `app/[locale]/` is the root layout (`<html lang dir>` per locale, via `components/layout/RootDocument.tsx`); `app/(dev)` has its own root layout for `/v2`. `proxy.ts` does the locale routing and sends non-live locale-like paths to the 404 page. Config lives in `lib/i18n/config.ts`, routing in `i18n/`, UI strings in `messages/<locale>.json` (skip link, consent banner, 404, language switcher; the en-GB and en-AE files are copies of en-US for now).
- **Use `Link` from `@/i18n/link`** (a client module, which keeps pages statically generated) and `usePathname`/`useRouter` from `@/i18n/navigation`. Do not import `next/link` for internal links.
- **Metadata:** pages export `generateMetadata` and pass `locale` to `buildMetadata`, which sets canonical, hreflang and `og:locale`.
- **404:** `experimental.globalNotFound` plus `app/global-not-found.tsx` serve unmatched URLs as a real, server-rendered 404. A `notFound()` thrown inside a page (for example an unknown blog slug) returns 404 but its HTML body is rendered by the browser, because the root layout sits in a dynamic segment; visitors with JavaScript see the full branded page.
- **Phase 2:** to add Arabic (`ar-ae`, `dir: "rtl"`) or an EU language, add the entry to `LOCALES`, create `messages/<locale>.json`, translate the content in `content/*.ts` and list it in `LIVE_LOCALES`. Logical CSS properties are already used, so RTL layout should hold.

Not localized yet: page copy (`content/*.ts`), JSON-LD URLs (they point at the default locale), prices and currency (USD only), dates (en-US).

## Batch G completion: remaining primitives
- `Tabs` (ARIA tabs, keyboard, RTL-aware), `Tooltip` (WCAG 1.4.13), `Toast` (`ToastProvider` + `useToast`, not mounted site-wide yet).
- `WhatsAppButton`: rendered by the marketing layout only when `COMPANY.whatsappNumber` is set (currently null, so hidden).
- Branded 500: shared `ErrorState`, with a `(marketing)/error.tsx` boundary that keeps header and footer.
- `TextSkeleton` / `CardGridSkeleton` for in-page Suspense fallbacks (no route-level `loading.tsx`).
- Showcase entries in `/v2`.
