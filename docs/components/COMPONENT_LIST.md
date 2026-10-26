# DronaHost component list

Everything built for the v2 site, grouped by folder. Live demos: `/v2` (all components) and `/v2/design-system` (tokens,
buttons, motion). Both exist in development only and return 404 in production.

**Status key**
- **Live**: used on real pages and visible today.
- **Gated**: built and used, but renders nothing until its data is verified (see `content/claims.ts`, `content/trust.ts`,
  `content/company.ts`) or a flag in `lib/flags.ts` is on.
- **Built**: finished and shown in `/v2`, not used on a page yet.
- **Parked**: built, deliberately not mounted.

Conventions: Server Components by default; every section takes `headingLevel`; tokens come from `app/styles/tokens.css`;
motion is CSS-first and respects `prefers-reduced-motion`; internal links use `Link` from `@/i18n/link`.

---

## 1. UI primitives (`components/ui/`)

| Component | What it is | Status |
|---|---|---|
| `Button` | Variants primary, secondary, ghost, link; sizes sm, md, lg; loading state; renders a link or a real `<button>` | Live |
| `Badge` | Small label chip (primary or secondary tint) | Live |
| `Surface` | Card surface: flat, raised, glass; optional interactive hover | Live |
| `Section` | Layout wrapper with width, padding, background and height presets | Live |
| `HeadLineText` | Fluid headline sizes with a heading-level prop | Live |
| `GradientText` | One highlighted phrase inside a heading (teal family) | Live |
| `FeatureIcon` | Teal icon tile used by grids, bento tiles and menus | Live |
| `Logo` | Official logo SVG at fixed sizes | Live |
| `Image` | `next/image` wrapper with a skeleton | Live |
| `ThemeToggle` | Dark and light switch (follows the system on first visit, then persists) | Live |
| `Breadcrumbs` | Visible trail built from the same source as the BreadcrumbList JSON-LD | Live |
| `EmptyState` | What is missing, why, and one next step | Live |
| `Dialog` | Modal on the native `<dialog>` (focus trap, Escape, focus return) | Live (cookie preferences) |
| `Reveal` | Server component that marks a block for the scroll reveal | Live |
| `Skeleton`, `LoadingStates` | Shimmer placeholder, `TextSkeleton`, `CardGridSkeleton` | Live |
| `CopyButton` | Copy to clipboard with a polite live-region confirmation | Built |
| `CodeBlock` | Code panel with a title bar and copy button | Built |
| `table` | Styled table primitives | Built |
| `Tabs` | WAI-ARIA tabs, keyboard and RTL aware, panels stay in the HTML | Built |
| `Tooltip` | Hover and focus hint, Escape dismisses (WCAG 1.4.13) | Built |
| `Toast` | `ToastProvider` and `useToast`, polite live region, auto-dismiss | Built (not mounted site-wide) |

## 2. Page sections (`components/sections/`)

| Component | What it is | Status |
|---|---|---|
| `ProductHero` | Headline, actions and a dashboard mockup (home) | Live |
| `SplitHero` | Headline beside a staging-flow mockup (service pages) | Live |
| `CenteredHero` | Text-only hero (about, legal, pricing, contact, blog) | Live |
| `SectionHeader` | Eyebrow, heading and summary shared by sections | Live |
| `FeatureGrid` | Cards, divided or plain feature and service grid | Live |
| `BentoGrid` | Asymmetric tiles with a small CSS visual | Live |
| `TwoColumn` | Text, checklist and actions beside a designed visual | Live |
| `ComparisonTable` | Accessible comparison table with sticky first column | Live |
| `FAQSection` | Native `<details>` accordion with an optional help card | Live |
| `CTABand` | One primary and one quiet action on a raised band | Live |
| `ProcessTimeline` | Numbered steps with connecting lines that draw in | Live |
| `ResourceGrid` | Blog and resource cards | Live |
| `PricingPlans` | Plan cards, billing toggle, renewal line, guarantee note | Gated (prices hidden until `pricesConfirmed`) |
| `PricingExtras` | Included list, add-ons and the full feature table | Gated (same) |
| `BackupAddonCard` | One offsite-backup add-on with a size selector | Gated (same) |
| `StatsBar` | Measured numbers with count-up | Gated (claims) |
| `AssuranceStrip` | Static strip for policy claims with a link to each terms page | Gated (claims) |
| `TrustSignals` | Guarantee, SLA, security, DPA, support items | Gated (`content/trust.ts`) |
| `TrustBadges` | Accepted payment methods only, never trust marks | Gated |
| `Testimonials` | Real, verifiable people only | Gated |
| `LogoStrip` | The technology we run (claim-gated); marquee or static row | Gated |
| `CaseStudy` | One to four concrete results | Gated |
| `SupportChannels` | Support ticket and email cards only (owner decision 22). Email shows only when a support address is set in `content/company.ts` | Built; used on the home page |
| `DomainSearch` | Domain availability through the WHMCS WhoisLookup API | Gated (`FEATURES.domainSearch` and credentials) |
| `NewsletterSignup` | Email capture | Gated (`FEATURES.newsletter`, needs an endpoint) |
| `AnswerBlock` | Question as the heading, the direct 40-80 word answer right under it, optional detail | Built (Phase 1, needs review) |
| `bespoke/PathRouter` | "Where are you starting from?": situation cards routing to product pages; omitted with fewer than two visible paths | Built (Phase 1, needs review; gated per path) |
| `bespoke/ResponsibilitySplit` | "What we look after / what stays with you": two plain lists; capability items gated by claims | Built (Phase 1, needs review; gated per item) |
| `JsonLd` | Inline JSON-LD script for a page | Live |
| `hero/HeroContent`, `hero/mockups` | Shared hero copy block; dashboard and staging mockups with one-time animation | Live |
| `visuals/bento`, `visuals/split`, `visuals/shared` | Designed CSS and SVG visuals for bento and two-column sections | Live |

## 3. Layout and chrome

| Component | What it is | Status |
|---|---|---|
| `layouts/header/header` | Sticky header with hairline-on-scroll | Live |
| `layouts/header/HostingMegaMenu` | Always-in-HTML hosting menu, keyboard and Escape | Live |
| `layouts/header/MobileMenu` | Drawer with focus trap and scroll lock | Live |
| `layouts/header/NavIcon` | Decorative nav icon | Live |
| `layouts/footer/footer` | Link columns, cookie settings, legal strip | Live |
| `layout/RootDocument` | `<html>` and `<body>` shell, theme provider, consent, reveal observer | Live |
| `layout/AnnouncementBar` (+ `Client`) | Dismissible notice bar | Gated (disabled in `content/announcement.ts`) |
| `layout/StickyMobileCTA` | Phone-only action bar after the first screen | Live |
| `layout/NotFoundPage` | Branded 404 with header and footer | Live |
| `layout/ErrorState` | Shared 500 body with retry and reference | Live |
| `layout/CurrencySelector` | Currency picker | Gated (`FEATURES.currencySelector`) |
| `layout/LanguageSwitcher` | Explicit language and region links | Gated (`FEATURES.localeVariants`) |

## 4. Consent and analytics

| Component | What it is | Status |
|---|---|---|
| `consent/CookieConsent` | Banner with equal Accept and Reject, loaded on demand | Live |
| `consent/CookiePreferences` | Per-category preferences dialog | Live |
| `consent/CookieSettingsButton` | Footer link that reopens preferences | Live |
| `analytics/Analytics` | Cookieless Plausible loader | Live when configured |
| `analytics/ConsentScripts` | GA4 and other cookie scripts, only after consent | Live when configured |

## 5. Forms (`components/forms/`)

| Component | What it is | Status |
|---|---|---|
| `FormWizard` | Multi-step form engine with per-step validation and saved progress | Live |
| `MigrationForm` | Migration request (`/migration`) | Live |
| `ConsultationForm` | Consultation request (`/consultation`) | Live |
| `Turnstile` | Cloudflare Turnstile widget | Live when the site key is set |
| Contact form (`contact/_components/ContactForm`) | Contact page form, Zod, honeypot, rate limit | Live |

## 6. Blog (`components/blog/`)

| Component | What it is | Status |
|---|---|---|
| `ArticleLayout` | Breadcrumbs, meta, cover, sticky TOC, author box | Live |
| `ArticleToc` | Server-built table of contents (three headings or more) | Live |
| `AuthorBox` | Shown only when the CMS has a real bio | Live |
| `CategoryFilter` | Category links as real URLs | Live |
| `Pagination` | Crawlable previous, next and numbered links | Live |

## 7. Legal (`components/legal/`)

| Component | What it is | Status |
|---|---|---|
| `LegalPage` | Legal page layout with breadcrumbs, updated date and TOC | Live |
| `PageToc` | "On this page" list from the article's h2 headings | Live |

## 8. Motion (`components/motion/`)

| Component | What it is | Status |
|---|---|---|
| `RevealObserver` | One observer in the root layout that arms `[data-reveal]` below the fold | Live |
| `CountUp` | One-time count-up for measured numbers; final value stays in the HTML | Live (used by `StatsBar`) |

Helpers: `lib/motion.ts` (`reveal(i)`), CSS in `app/styles/motion.css`, tokens in `app/styles/tokens.css`.

---

## Pages built from these components

Home, WordPress hosting, VPS hosting, cloud hosting, business hosting, domains, web design, SEO services, growth services,
pricing, about, contact, migration, consultation, blog and article, security, SLA, refund policy, data processing, privacy,
terms, cookie policy, 404 and 500.

Two route families exist in code but are not part of the public plan right now:
- Comparison pages (`/vs/[competitor]`) are off behind `FEATURES.comparisonPages`.
- Regional pages (`/hosting/[region]`) respond today, but decision #8 says no regional pages yet (Phase 2). Review whether to hide them.

Locale routing (`/en-gb`, `/en-ae`) is built behind `FEATURES.localeVariants` and is off.

## Related docs

- `docs/components/README.md`: component conventions and the review workflow
- `docs/components/CHANGELOG.md`: what changed in each batch
- `docs/reference/PLACEHOLDERS.md`: what still needs real content
- `docs/DECISIONS.md`: resolved and open decisions
