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
