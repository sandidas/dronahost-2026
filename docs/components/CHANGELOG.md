# Changelog: v2 polish

Branch `polish/design-system`. Each batch is one commit.

## Font rule (2026-10-09)
- Owner rule: the site keeps its two families, Sora for headlines and Manrope for all other text; components vary size, loaded weight, tracking and colour only. Written into `docs/rules/ui-ux-rules.md` §3.6, `CLAUDE.md` and this README.
- Instrument Serif is removed (`app/fonts.ts`, `RootDocument`, `--font-serif`). The banners that used it now use Sora for display text and Manrope for text, without italic. `t-meta` labels and banner figures use Manrope with tabular numbers instead of the mono family, which stays for code only.

## Intent banners: one concept per banner (2026-10-09)
- Each of the twelve banners now has its own art direction instead of one shared template: dictionary entry, route map, lobby directory, command palette, split screen, magazine cover, ticket, split block, boarding pass, currency wall, footnoted article and instrument panel. See the table in `docs/components/README.md`.
- New shared shape `Ticket.tsx` and art utilities in `tokens.css`. `BannerShell` now carries `SCOPE` (`ink`/`paper` force the dark or light tokens) instead of the old tone set. Tone props are replaced per banner (`layout`, `scope`, `variant`, `ribbon`, `card`); new optional data: `partOfSpeech`, `key`, `issue`, `dateLine`, `planName`, `code`, `currency`, `example.readings`, `example.result`.
- `ResourceGrid` keys posts by title (the sample posts share one link and raised a duplicate-key warning).

## Intent banners: premium restyle (2026-10-09)
- The twelve banners are restyled to "quiet authority": light-weight Sora statements (`t-statement`, `t-statement-sm` in `tokens.css`), mono capitals for metadata (`t-meta`), hairline rules, numbered index rows and hairline tile grids instead of mint fills, pills, check marks and icon tiles. One flat orange action (`PrimaryAction`); every other action is a quiet underlined link (`QuietLink`, `.link-quiet`).
- Tones are now `paper`, `ink` and `framed` (were plain, tinted, glow, card). `ink` is a deep navy band (`.band-ink`) that scopes the dark tokens, so it looks the same in both themes and every colour pair stays covered by the contrast check. `ActionBand` tones are `ink`, `rule` and `framed`.
- Props are unchanged apart from the tone names; `icon` on navigational items is accepted but no longer drawn. Checked at 1440 and 390 pixels in dark and light: no horizontal overflow, no console errors.

## Intent banners (2026-10-09)
- Twelve banners in `components/sections/banners`, two per search intent (informational, navigational, commercial, transactional, local, generative AI), each with three or four variants by props, on one `BannerShell` wrapper with four tones. Shown on `/v2` under "Intent banners" with sample copy from `content/placeholders.ts` (`SAMPLE_BANNERS`). Fixed labels in `UI.banners`; all twelve files are in the copy-source check. Prices in the transactional samples come from `lib/pricing`.

## Header on tablets (2026-10-09)
- Between 768 and 1023px the header showed only the logo and a hamburger. The primary links, the theme toggle and "View plans" now show from `md`; the drawer is for phones only. The currency selector and the account link still need the wide header (`lg`).
- The Hosting mega menu opens on hover only for a mouse pointer (`onPointerEnter` with `pointerType === "mouse"`). On a touch screen a tap used to fire mouseenter and then click, opening and closing the panel in one go. A click after a hover-open keeps the panel open; a click on a click-opened panel closes it.
- The mega panel has two columns on tablets (hosting and web services side by side, the help panel underneath) and three on desktop.
- `tests/e2e/navigation.spec.ts` covers the tablet header and the phone drawer.

## Home page design pass (2026-10-08)
- `TrustSignals` gets `variant="list"` and `SupportChannels` gets `layout="split"`, both shown in `/v2`. The page-spec schema takes `variant` and `layout`. The home page uses them so the same three claims no longer appear as three card grids.

- `PathRouter` gets `compact` (shown in `/v2`). `SiteDashboardMockup` takes `tiles`, and its default labels are now Site, Backups and Support: the old Speed and Security tiles hinted at features that are not verified.

## Page blueprints: home (2026-10-08)
- New `MeaningSection` and `HelpAndPolicies` (shown in `/v2`); `SupportChannels`, `TrustSignals` and `ResponsibilitySplit` get a `bare` mode so a composite can hold them. The support button is secondary. The hero mockup (`SiteDashboardMockup`, `StagingFlowMockup`) shows a visible "Example dashboard" caption, and its text comes from the page JSON or `content/strings.ts`.
- `content/strings.ts` holds the shared UI text. `npm run check:copy-source` fails on a text literal in a section component.

## Home conversion pass (2026-10-09)
- New `WhyChoose` (three reasons, each with a source link) and `MigrationRequest` (free-move lead form: Zod validation, honeypot, error and success states, privacy line; sends through `lib/leads/submit.ts`). Both are in `/v2`.
- `ProductHero` shows a real screenshot from `public/screenshots/` or, with none, no visual and centred text. The fake dashboard is no longer the default on Home.
- Pages built from a spec alternate a tinted band on every second section (`.page-tones`), so neighbours never share a background.
- Body text on dark is brighter (`--muted-foreground`, `--subtle-foreground`) and `t-body` and `t-small` are larger.
- The footer lists only what is sold and Ready. The mobile call to action on Home reads "Move my site free" and hides when the form is not on the page.

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
- `WhatsAppButton` was built but parked. **Removed 2026-10-07** (owner decision 22: WhatsApp, live chat and phone are not offered), together with `COMPANY.whatsappNumber` and `COMPANY.liveChatEnabled`.
- Branded 500: shared `ErrorState`, with a `(marketing)/error.tsx` boundary that keeps header and footer.
- `TextSkeleton` / `CardGridSkeleton` for in-page Suspense fallbacks (no route-level `loading.tsx`).
- Showcase entries in `/v2`.

## Motion and luxury pass (per `docs/reference/MOTION_AND_LUXURY_BRIEF.md`)
- Tokens: easing (`--ease-out`, `--ease-in-out`), durations 150/250/450/700ms, `--reveal-distance`, `--stagger`; reduced motion collapses them all.
- One `RevealObserver` in `RootDocument` arms `[data-reveal]` below the fold only; `reveal(i)` from `lib/motion.ts` (stagger capped at 5); `Reveal` is now a server component. Nothing above the fold animates and no-JS shows everything.
- `app/styles/motion.css`: card hover lift (hover devices only) with focus-within parity, button press and one-shot sheen, link underline grow, arrow nudge, native `<details>` FAQ animation, grain, theme fade, scrollbar, `accent-color`, shimmer skeletons (2 short passes), inline message fade.
- Hero mockups play once: chart line draws, bars fill, status pill fades, checklist ticks in sequence, one soft pulse on "Go live". Hero text is static.
- Header hairline and stronger blur via an IntersectionObserver sentinel; drawer 450ms, mega menu fade and rise.
- Pricing: staggered cards, one slow border glow on the highlighted plan, price crossfade on billing switch, `tabular-nums`.
- Process timeline lines draw as steps reveal; `CountUp` for verified stats only (final value in HTML).
- Removed the unused `components/loader/*` set (infinite spinners and pulses).
- `/v2/design-system` Motion section: live demos with a reduced-motion toggle.
- Tests: `tests/e2e/motion.spec.ts` (no horizontal scroll at 390/820/1440, JS disabled, reduced motion, CLS per page). The axe script now scans the settled page.

## UX review fixes (browser review at 1440 and 390)
- Section rhythm tightened: `--section-y` is now 48px (mobile) to 76px (wide) per side, so stacked sections sit 96-152px apart instead of up to 288px.
- Footer: copyright and Cookie settings share one row.
- Hero `primaryCta` is optional; the contact, blog and pricing heroes drop their CTA because the page already holds the action.
- Contact page: sticky intro column, form in a card, redundant ticket card removed.
- Copy: removed WhatsApp and live chat mentions (neither is live); support visuals now show Ticket, Follow-up, Resolved. Pricing hero no longer says prices are listed while they are hidden.
- Hero mockup "Go live" button uses the orange action colour; pricing badge slot has a fixed height so card prices align.

## /v2 showcase review
- Removed the unused legacy `Card` component and its GridCard, ResourceCard and ResourceBox showcase entries.
- Updated stale notes: site width, contact form status (now needs verification: SES and retention), and WhatsApp or live chat mentions in the verify lists.
- Skeletons are more visible on dark cards (`bg-foreground/10`); price amounts no longer have a minimum width that left a gap before "/month".

## Comparison data rewrite (2026-10-07)
- **Data model:** `data/vs/types.ts`. Every competitor fact has `{ value, source: { url, retrieved } }`; `value: null` means "not stated on the page we checked". `checkedAtSource` stays false until a person confirms the source.
- **Competitors:** SiteGround, Kinsta, WP Engine, Bluehost, Hostinger, Cloudways. A2 Hosting removed (its site redirects to hosting.com).
- **DronaHost's side:** built in `lib/vs/compare.ts` from `data/pricing.json` (prices only when `showPrices()`) and claims that render. Rows with no showable DronaHost value are left out.
- **Page `/vs/[competitor]`:** rewritten to the Plan 02 template with `CenteredHero`, `ComparisonTable`, "Where {name} is stronger", "Where DronaHost is stronger" (needs a rendering claim), "Which one should you choose?", sources with dates, and `CTABand`. The made-up "DronaHost Editorial Team" author, the "which host is better in 2025" title and the raw palette classes are gone.
- **Check:** `npm run check:vs` (`scripts/check-vs.ts`) validates sources, dates, strengths and token fills, and fails when `FEATURES.comparisonPages` is on while any competitor is not checked at source. It runs in CI.
- **Routing fix:** `proxy.ts` no longer treats `/vs` or other two-letter route segments as locales.
- The page is still closed by `FEATURES.comparisonPages`.

## Home Phase 1 re-review and planner alignment (2026-10-07)
- **SupportChannels:** ticket and email only (owner decision 22). WhatsApp and live chat removed from the component, the `SupportChannels` Zod enum (`["ticket", "email"]`), the `/v2` notes and `content/pages/home.json`. Email renders only once `COMPANY.supportEmail` is set.
- **ResponsibilitySplit:** when the two lists differ by two or more items (likely once claims hide some left-hand items), each card keeps its own height on desktop instead of stretching into a hollow box.
- **Home spec (`content/pages/home.json`):** primary keyword is the brand, secondary keyword "wordpress and vps hosting for small business" (register); the third router card is now "I need simple hosting for a business site" (Web hosting plans, email not included); a "Does DronaHost host email?" FAQ was added; FAQ answer about skills mentions ticket or email; `reviewedOn` 2026-10-07.
- **Claims:** `business-hosting-scope` text describes the Web hosting plans, not email. Still unverified.
- **Review tooling:** `scripts/screenshot-phase1.ts` takes clean 1440 and 390, dark and light screenshots of the three components in `/v2/phase1-preview` and `/v2` (cookie banner and fixed chrome hidden, scroll reveals forced on). Output: `docs/reference/after/phase1-review/`.
- **Follow-up #5 audit:** the announcement bar, footer, contact page, JSON-LD `contactPoint` (URL only) and `llms.txt` were already clean. Removed the dead `WhatsAppButton` and the `whatsappNumber` and `liveChatEnabled` company fields. The content linter now fails any mention of WhatsApp, live chat or phone support. The Support row in `data/vs/*` now says "Support ticket and email".
- **Design doc:** the two copies of the home design doc were merged into `docs/reference/pages/HOME_PAGE_DESIGN.md`; the old path is a stub.

## Home page Phase 1: new components (per `docs/reference/pages/HOME_PAGE_DESIGN.md`)
- `components/sections/bespoke/PathRouter` and `ResponsibilitySplit` (bespoke tier), plus a reusable `components/sections/AnswerBlock`. All three are server components, reveal once below the fold, use logical properties and tokens, and omit themselves (no empty gaps) when their claims are not rendering.
- `lib/sections/gated.ts` (`visibleItems`): claim-gated list items. `content/claims.ts` gains kind `feature` and twelve unverified capability entries from section 7 of the design doc; none renders until confirmed, verified and published.
- `/v2` showcase entries (default, edge cases, as-shipped-today states) and a dev-only `/v2/phase1-preview` that shows the three at real page width. Reviewed with screenshots at 1440 and 390 px in dark and light, plus keyboard focus; axe has no violations in either theme.
- The home page is not built and no existing page was touched.


## Home page Phase 2: section registry and schemas (`docs/content-system.md`)
- `lib/content/`: Zod schemas for the 13 section types and the page spec, the `claim:`, `feature:` and `requires` resolvers behind one `ResolveContext`, a feature library read against `pricing.json`, the layout-signature check, and a section registry with renderers for the existing components.
- `npm run check:pages` validates `content/pages/*.json` and fails on layout-signature collisions. `tests/fixtures/home.page.json` is the home spec from the design doc; `tests/e2e/content-system.spec.ts` covers schemas, resolvers, gating and signatures.
- `ResponsibilitySplit` now needs at least two items per column (a single bullet read as an afterthought); the registry gates items with the resolve context and passes plain items on.
- Dev preview `/v2/page-system-preview` (modes `today` and `all`). The home page is still not built and no existing page changed.

## Home page Phase 3: `/` built from `content/pages/home.json`
- `app/[locale]/(marketing)/page.tsx` validates the spec at build time and renders it through the section registry. Metadata comes from the spec; structured data is Organization and WebSite (no SearchAction).
- Hero: the lead and the three ticks depend on the capability claims (servers, backups, migration). Until they are confirmed, a neutral fallback lead shows and no ticks. A hero accent phrase is supported in the schema.
- Because nothing is verified yet, the page today is the hero, the support card, the FAQ (three questions) and the closing CTA. Router, assurance strip, answer, responsibility split, moving, platform, plans, proof and policies appear as their claims are verified and their terms pages published, with no code change.
- `npm run lint:content` (banned phrases, unclaimed numbers, reading level, links, WhatsApp or live chat mentions while neither exists) joins `check:pages` in CI.
- A single support channel now shows as one centred card instead of a full-width bar.
- Home e2e: one h1, only confirmed content, no empty sections, FAQ answers in the HTML without JavaScript, structured data and metadata.


## Pricing v3.0.0 (`data/pricing.json`)
- Plans are now two families: WordPress (`starter`, `growth`, `pro`) and Web (`essential`, `plus`). `pop` is now `pro`; Scale, Dedicated Core and Enterprise are one contact-only `highTraffic` tier with no published price.
- `/pricing` renders one plans section per family plus a high-traffic contact band. `/wordpress-hosting` shows the WordPress family only. Home spec uses `pro`.
- `lib/pricing/plans.ts`: `PLAN_FAMILIES`, `buildFamilyCards`, `HIGH_TRAFFIC`; headline features say "managed WordPress site(s)" or "website(s)", never "unlimited". Offsite backup is one add-on with `options`.
- `lib/pricing/compare.ts`: mailboxes row removed (email hosting discontinued); traffic shows "Fair use" instead of "Unlimited"; added hosting type and three capability rows.
- "Included with every plan" now lists only items whose `claimId` is verified. Added `nvme` and `cpanel` claims (unverified) to `content/claims.ts`.
- Regional facts moved from `pricing.regions` to `content/regions.ts` (non-price data). Datacenter city names were dropped until confirmed. India region entry was not carried over.
- `tests/e2e/pricing-v3.spec.ts` guards the new shape.

## Home page completion pass (2026-10-08)

- `money-back`, `support-24-7`, `renewal-price-same` and `backups` now render (their policy pages are published), so the hero, assurance strip, split list, support section and FAQ show them.
- `AssuranceStrip` and `TrustSignals` centre their cards when fewer than a full row shows. The policies section lists the four published policies (`POLICY_LINKS` extended; `/sla` removed from the home list because no SLA exists).
- `BentoGrid` section on the home page waits until two or more tiles can render (one lone tile looked unfinished).
- Still hidden until the owner confirms the capability facts: the answer block, router paths 2 to 4, "Moving to DronaHost" (needs `/migration-terms` approved), platform tiles, plans (needs `pricesConfirmed`), reviews.
