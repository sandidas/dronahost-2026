# Task: Polish all /v2 components into a premium, luxury-grade design system

## Context

DronaHost is a managed WordPress & cloud hosting company. Components are showcased
at /v2. They currently look flat, generic and unfinished (placeholder images, inconsistent
button/accent styles, small low-contrast text, weak cards, repetitive heroes).
Target audience: business owners, agencies and CTOs in the USA, UK, UAE, Europe and
the wealthiest metros of India (Mumbai, Delhi NCR, Bengaluru, Dubai, London, NYC, etc.).
Brand feel: luxurious, trustworthy, authentic, calm confidence. Think Stripe, Linear,
Vercel, Kinsta, WP Engine. NOT loud "cheap hosting" with countdown timers and neon gradients.

## Rules

- Do NOT change component prop APIs unless needed; if you do, update all usages.
- Do NOT invent facts. No fake testimonials, customer logos, awards, uptime numbers,
  or stats. Use clearly marked placeholder data in a single `content/placeholders.ts`
  file with `// TODO: replace with verified data`. Never ship fabricated claims.
- No new heavy dependencies without asking. Allowed: Tailwind, shadcn/ui, lucide-react,
  next/font, Framer Motion (or `motion`) used sparingly.
- Server Components by default. `"use client"` only for real interactivity
  (tabs, accordion, billing toggle, mobile nav, carousels).
- Work in batches (see Phases). After each batch run `npm run build`, lint, and
  typecheck, then screenshot /v2 with Playwright (desktop 1440, tablet 820, mobile 390)
  and review your own screenshots critically before moving on. Fix what looks weak.

## Phase 1: Audit (no code changes)

1. List every component under /v2 with file path, purpose, and a one-line critique.
2. Identify inconsistencies: colors, radii, shadows, spacing, type scale, button styles.
3. Identify SEO/accessibility/performance problems per component.
4. Propose a design-token plan and a batch order. Wait for my approval.

## Phase 2: Design system foundation

Define in `tailwind config` / CSS variables (light and dark themes, dark default):

**Color**

- Deep ink/navy base (e.g. #070B14 to #0E1524), layered surfaces with subtle borders
  (1px rgba white 6-10%), NOT flat black boxes.
- ONE primary accent (refined, e.g. warm amber/gold or a restrained electric blue; pick one
  and justify it). Use a secondary neutral-cool tone for supporting UI. Remove the
  pink/purple/orange mix. Gradients only as subtle ambient glows behind hero/CTA areas.
- Text: high contrast (WCAG AA minimum, AAA for body where feasible). Muted text must still
  pass 4.5:1.
- Semantic colors for success/warning/danger.

**Typography**

- Use next/font with a premium pairing (e.g. Inter or Geist for UI + a refined display
  face or tighter-tracked variant for headlines). Fluid type scale with clamp().
- Headlines: large, tight tracking, balanced wrapping (`text-wrap: balance`).
  Body: 16-18px, 1.6-1.7 line height, max ~65ch.
- Eyebrow labels in small caps/uppercase with letter-spacing.

**Spacing and layout**

- 8px grid. Generous section padding (96-144px desktop, 64-80px mobile).
- Container max-width ~1200-1280px. Consistent gutters.
- Whitespace is a luxury signal. Reduce clutter rather than adding elements.

**Surfaces**

- Consistent radius scale (e.g. 12 / 16 / 24). Layered shadows (soft, multi-layer),
  hairline borders, subtle inner highlight on cards, glass effects used sparingly.

**Buttons**

- Variants: primary, secondary, ghost, link. Sizes: sm/md/lg. Clear hover, focus-visible,
  active, disabled, loading states. Minimum 44px touch target. One primary CTA per section.

**Motion**

- Subtle: fade/translate on scroll-in (once), 150-250ms hover transitions, ease-out.
- Respect `prefers-reduced-motion`. No animation that causes layout shift.

**Imagery**

- Replace empty placeholders with real, designed visuals: inline SVG illustrations,
  CSS/SVG product UI mockups (dashboards, server/speed graphics), abstract mesh/grid
  backgrounds. No stock-photo clichés, no broken image boxes.
- All images via next/image with explicit width/height, proper `sizes`, AVIF/WebP,
  descriptive alt text (empty alt only for decorative).

Deliverable: a `/v2/design-system` page showing tokens, type scale, buttons, cards,
and states. Get my approval before Phase 3.

## Phase 3: Component polish (in batches, approve each batch)

Batch A: Navigation (header w/ mega menu, mobile drawer), Footer, Announcement bar
Batch B: Heroes (consolidate repetitive variants into 3 distinct, excellent ones:
product hero, split hero with UI mockup, minimal centered hero)
Batch C: Feature grids, bento grid, "What we offer", comparison table
Batch D: Pricing (monthly/annual toggle, highlighted plan, feature lists, currency-ready,
trust microcopy under CTAs such as "30-day money-back guarantee" ONLY if true)
Batch E: Social proof (testimonials, logos, case study, stats). Authentic layout that
supports real names, roles, company, optional photo, and source link.
Batch F: FAQ (accessible accordion), CTA bands, migration steps/timeline, resources/blog cards,
code block, newsletter

Per-component requirements:

- Premium look at all breakpoints; no horizontal scroll; no overlapping text.
- Handles long text, missing images, and 1-12 items gracefully.
- Skeleton or sensible empty states where data is dynamic.
- Dark and light theme both look intentional.
- Props documented with TypeScript types and JSDoc. Showcase at /v2 with variants.

## SEO and AI-search (AEO/GEO) requirements for EVERY component

Be realistic: no component alone guarantees rankings. Make every component _capable_
of supporting top-tier technical SEO:

1. **Semantic HTML**: `header`, `nav`, `main`, `section` with `aria-labelledby`, `article`,
   `footer`, `ul/li` for lists, `table` for real tabular data, `figure/figcaption`,
   `details/summary` or accessible accordion for FAQs.
2. **Heading hierarchy**: components must accept a `headingLevel`/`as` prop so pages can
   keep exactly one H1 and a logical H2/H3 order. Never hardcode H1 in non-hero sections.
3. **Content in HTML, not JS**: all copy rendered server-side. Accordion/tab content must be
   present in the initial HTML (hidden visually, not absent). No content fetched client-side.
4. **Structured data (JSON-LD)** helpers in `lib/schema.ts`, rendered server-side:
   Organization, WebSite (+SearchAction if applicable), Product/Offer for plans,
   FAQPage (only for visible FAQs), BreadcrumbList, Article/BlogPosting, Review/AggregateRating
   ONLY when backed by real, verifiable reviews. Validate all output.
5. **Links**: descriptive anchor text (no "click here"), `next/link`, external links with
   `rel` set appropriately, crawlable `<a href>` for every nav item (no JS-only routing).
6. **Performance (Core Web Vitals)**: LCP < 2.0s, CLS < 0.05, INP < 200ms. Preload hero font/
   image, avoid layout shift (reserve space), lazy-load below-fold media, no unused JS.
   Keep client bundle per component minimal.
7. **Accessibility** (also an SEO signal): WCAG 2.2 AA, visible focus, keyboard navigation,
   skip-to-content link, ARIA only where needed, color contrast verified, form labels.
8. **AI-readiness**: concise, answer-first copy blocks (definition/summary near the top of
   sections), clear entity naming (DronaHost, managed WordPress hosting), scannable lists
   and tables, consistent terminology. Add an `llms.txt` plan to the audit.
9. **International**: components must support `hreflang`-ready pages, currency/locale
   formatting via `Intl` (USD, GBP, EUR, AED, INR), and RTL-safe layout (use logical
   properties like `ms-/me-/ps-/pe-`) so Arabic can be added later.

## Trust and authenticity (UI-level)

- Dedicated trust components: security/compliance badges (GDPR, SOC 2, ISO, etc. ONLY if the
  company actually holds them), money-back guarantee, support SLA, data center locations,
  real team/about snippet, transparent pricing note ("no hidden fees; renewal price same").
- Copy tone: precise, calm, specific. Avoid hype ("500x faster", "best ever", "up to 88% OFF").
  Prefer verifiable specifics ("NVMe storage", "daily backups, 30-day retention").
- Show real support channels and company details in footer (legal name, address,
  contact) for credibility.

## Phase 4: QA and handoff

- Run Lighthouse (mobile + desktop) on key /v2 showcase pages; report scores.
- Run axe accessibility checks; fix all serious/critical issues.
- Validate JSON-LD with a schema validator; fix errors.
- Provide before/after screenshots and a short CHANGELOG + usage docs for each component.
- List every placeholder/claim I must replace with verified real content.

## Definition of done

A visitor from London, Dubai, or Mumbai should feel this is an established,
premium infrastructure company within 3 seconds, while every page remains fast,
accessible, semantically clean, and fully crawlable.

# Task: Polish all /v2 components into a premium, luxury-grade design system for DronaHost

## How to use this file

Save as `/reference/POLISH_BRIEF.md`. Then tell Claude Code:

> "Read /reference/POLISH_BRIEF.md and follow it. Start with Phase 1 only and wait for my approval."

---

## 1. Context

DronaHost is a managed WordPress and cloud hosting company. We are rebuilding the website in
Next.js (latest, App Router). Reusable components are showcased under the `/v2` route.
They currently look flat, generic and unfinished: empty image placeholders, inconsistent
button and accent styles, small low-contrast text, weak cards, repetitive hero variants.

**Target audience:** business owners, agencies and CTOs in the USA, UK, UAE, Europe, and the
wealthiest metros of India (Mumbai, Delhi NCR, Bengaluru) plus Dubai, London, New York.

**Brand feel:** luxurious, trustworthy, authentic, calm confidence. Think Stripe, Linear,
Vercel, Kinsta, WP Engine. NOT loud "cheap hosting" with neon gradients, countdown timers,
or stock-photo smiles.

## 2. Existing brand and old-site reference (READ FIRST)

View all files in `/reference/old-site/` and `/reference/brand/` before doing anything.
The old-site screenshots are for **content inventory and brand constraints only**.
Do NOT copy its layout or design.

**Brand constraints (from the official Brand Assets page):**

- Logo: orange "drona" + teal "host" wordmark with tagline. Use ONLY the official SVG.
  Never recolor, apply gradients/shadows/effects, stretch, rotate (whole or part), outline,
  reverse, repeat as a pattern, change the arrangement, or place it on a similar-colored
  background (including orange or teal fills). Keep generous clear space around it.
- Brand colors: orange `#FE5504`, teal `#05A2C6`. The wider brand palette also includes
  deep navy `#092F49`, deep teal `#052F2E`, light tint `#F1FAFA`, and orange/teal shade scales.

**Keep from the old site:** orange + teal identity, dark/light toggle, currency selector,
WhatsApp / Live Chat / Ticket support trio, free-migration story, the four product lines
(Cloud, WordPress, Business, Managed VPS), FAQ.

**Fix from the old site:**

- Generic stock photos and a repeated parachute illustration
- Flat gray-slate surfaces with no depth
- Cramped pricing cards (20+ features, info icon on nearly every line, "SAVE x%" badges)
- Testimonials with only a name and no role, company, photo, or source
- Visible bugs: `don&os;t` HTML-entity text, price shown as "1.28 /mo." with no currency symbol,
  year "2024" in page title vs "2026" in headings
- Footer with six cramped columns and two columns both titled "Resources"
- Teal highlighted word in nearly every heading (diluted emphasis)
- Hype copy ("500x faster", "up to 88% OFF", "Best ever")

## 3. Global rules

- Do NOT change component prop APIs unless needed. If you do, update all usages.
- Do NOT invent facts. No fake testimonials, customer logos, awards, uptime numbers,
  certifications, or statistics. Put any sample data in a single `content/placeholders.ts`
  with `// TODO: replace with verified data`. Never ship fabricated claims.
- No new heavy dependencies without asking. Allowed: Tailwind, shadcn/ui, lucide-react,
  `next/font`, and Framer Motion (or `motion`) used sparingly.
- Server Components by default. Use `"use client"` only for real interactivity
  (tabs, accordion, billing toggle, currency selector, mobile nav, carousels).
- Work in batches (see phases). After each batch: run `npm run build`, lint and typecheck;
  take Playwright screenshots of `/v2` at 1440, 820 and 390 px widths; review your own
  screenshots critically; fix what still looks weak before moving on.

---

## Phase 1: Audit (NO code changes)

1. List every component under `/v2` with its file path, purpose, and a one-line critique.
2. Identify inconsistencies in color, radius, shadow, spacing, type scale, button styles.
3. Identify SEO, accessibility, and performance problems per component.
4. Check every text/background color pair against WCAG contrast and report failures.
5. Propose the design-token plan, a consolidation plan for repetitive components, and a
   batch order. Include an `llms.txt` plan.
6. **Stop and wait for my approval.**

## Phase 2: Design system foundation

Define tokens in Tailwind config / CSS variables for both dark and light themes (dark default).

### Color (brand-anchored)

- **Orange `#FE5504` = primary ACTION color only** (main CTAs, key highlights). Use sparingly:
  at most one orange element per viewport besides the logo.
- **Teal `#05A2C6` = secondary** (links, icons, data accents, at most ONE highlighted word per
  heading). No other hues: no pink, no purple.
- **Dark theme surfaces** derive from brand navy `#092F49`, pushed darker (roughly `#07131F`
  base, `#0B1B2B` / `#10263A` raised surfaces) with hairline borders (1px, white at 6-10%
  opacity) and soft ambient glows in brand orange/teal at very low opacity. Replace the
  flat gray-slate backgrounds.
- **Light theme** uses `#F1FAFA` tints with white cards.
- **CONTRAST:** white text on `#FE5504` or `#05A2C6` fails AA (about 3:1). Use dark navy text
  on bright orange/teal fills, or deeper shades from the brand scale (e.g. `#C23700` /
  `#D33E00` for orange, `#027280` for teal) with white text. On white backgrounds use those
  deeper shades for orange/teal text. Add a script that checks every text/background token
  pair for 4.5:1 (3:1 for large text) and fails the build on violations.
- Semantic colors for success, warning, danger.

### Typography

- Use `next/font` with a premium pairing (e.g. Inter or Geist for UI, plus a refined display
  face or tighter-tracked variant for headlines). Fluid scale using `clamp()`.
- Headlines: large, tight tracking, `text-wrap: balance`. Body: 16-18px, line-height 1.6-1.7,
  max about 65ch. Eyebrow labels in small uppercase with letter-spacing.

### Spacing and layout

- 8px grid. Generous section padding (96-144px desktop, 64-80px mobile).
- Container max-width about 1200-1280px with consistent gutters.
- Whitespace is a luxury signal. Reduce clutter rather than adding elements.

### Surfaces

- Consistent radius scale (12 / 16 / 24). Soft multi-layer shadows, hairline borders,
  subtle inner highlight on cards. Glass effects used sparingly.

### Buttons

- Variants: primary, secondary, ghost, link. Sizes: sm / md / lg.
- States: hover, focus-visible, active, disabled, loading. Minimum 44px touch target.
- One primary CTA per section.

### Motion

- Subtle: fade/translate on scroll-in (once only), 150-250ms hover transitions, ease-out.
- Respect `prefers-reduced-motion`. No animation that causes layout shift.

### Imagery

- Replace empty placeholders and stock photos with designed visuals: inline SVG illustrations
  in brand colors, CSS/SVG product UI mockups (dashboards, uptime/speed panels, server
  graphics), subtle mesh/grid backgrounds. No stock-photo clichés, no broken image boxes.
- The old parachute illustration must not be reused across sections.
- All raster images via `next/image` with explicit width/height, proper `sizes`, AVIF/WebP,
  and descriptive alt text (empty alt only for decorative images).

**Deliverable:** a `/v2/design-system` page showing tokens, type scale, buttons, cards, states,
and the contrast-check results. **Wait for my approval before Phase 3.**

## Phase 3: Component polish (in batches, approve each batch)

- **Batch A:** Navigation (header with mega menu, mobile drawer), Footer, Announcement bar,
  Theme toggle, Currency/region selector
- **Batch B:** Heroes. Consolidate the repetitive variants into 3 distinct, excellent ones:
  (1) product hero, (2) split hero with UI mockup, (3) minimal centered hero.
- **Batch C:** Feature grids, bento grid, "What we offer", comparison table
- **Batch D:** Pricing
  - Max 5-6 headline features per plan. The full list lives in an expandable
    "Compare all features" table below. No info tooltip on every line.
  - ALWAYS show currency symbol and billing period. Show the renewal price next to the
    intro price.
  - Currency selector supports USD, GBP, EUR, AED, INR using per-currency price values
    in config (not live FX conversion). Format with `Intl.NumberFormat`.
  - Highlighted plan, billing toggle only if we actually offer multiple billing periods
    (see Open Questions).
  - Strikethrough "was" price or "SAVE x%" badge only as an OPTIONAL data field, used
    only when the higher price was genuinely charged (UK/EU regulators scrutinize reference
    prices). Default: no discount badges.
  - Trust microcopy under CTAs (e.g. "30-day money-back guarantee") ONLY if true.
- **Batch E:** Social proof (testimonials, logos, case study, stats)
  - Render testimonials only if they have name, role, company, and a verifiable source or
    link (photo optional). If none are real yet, hide the section rather than show vague ones.
  - Stats and logo strips must be driven by real data in `content/`.
- **Batch F:** FAQ (accessible accordion), CTA bands, migration steps/timeline,
  resources/blog cards, code block, newsletter, support trio (WhatsApp / Live Chat /
  Ticket; WhatsApp-first, with region-specific numbers if they exist)

### Per-component requirements

- Premium look at all breakpoints. No horizontal scroll, no overlapping text.
- Handles long text, missing images, and 1-12 items gracefully.
- Skeleton or sensible empty state wherever data is dynamic.
- Dark and light themes both look intentional.
- Typed props with JSDoc. Showcased at `/v2` with all variants.

## SEO and AI-search (AEO/GEO) requirements for EVERY component

No component alone guarantees rankings. Make every component capable of supporting
top-tier technical SEO:

1. **Semantic HTML:** `header`, `nav`, `main`, `section` with `aria-labelledby`, `article`,
   `footer`, `ul/li` for lists, `table` for real tabular data, `figure/figcaption`, and
   `details/summary` or an accessible accordion for FAQs.
2. **Heading hierarchy:** every component accepts a `headingLevel` / `as` prop so pages keep
   exactly one H1 and a logical H2/H3 order. Never hardcode H1 in non-hero sections.
3. **Content in HTML, not JS:** all copy rendered server-side. Accordion/tab content must be
   present in the initial HTML (visually hidden, not absent). No client-side content fetching.
4. **Structured data (JSON-LD)** helpers in `lib/schema.ts`, rendered server-side:
   Organization, WebSite, Product/Offer for plans, FAQPage (only for visible FAQs),
   BreadcrumbList, Article/BlogPosting. Review/AggregateRating ONLY when backed by real,
   verifiable reviews. Validate all output.
5. **Links:** descriptive anchor text (no "click here"), `next/link`, every nav item is a
   crawlable `<a href>`, external links with appropriate `rel`.
6. **Core Web Vitals:** LCP < 2.0s, CLS < 0.05, INP < 200ms. Preload hero font/image,
   reserve space to avoid layout shift, lazy-load below-fold media, ship minimal client JS.
7. **Accessibility** (also an SEO signal): WCAG 2.2 AA, visible focus, full keyboard
   navigation, skip-to-content link, ARIA only where needed, verified contrast, labeled
   form fields.
8. **AI-readiness:** concise answer-first copy blocks near the top of sections, clear entity
   naming (DronaHost, managed WordPress hosting), scannable lists and tables, consistent
   terminology.
9. **International:** `hreflang`-ready pages, `Intl` formatting for currency and dates
   (USD, GBP, EUR, AED, INR), and RTL-safe layout using logical properties
   (`ms-` / `me-` / `ps-` / `pe-`) so Arabic can be added later.

## Trust and authenticity (UI-level)

- Trust components: security/compliance badges (GDPR, SOC 2, ISO, etc.) ONLY if the company
  actually holds them; money-back guarantee; support SLA; data-center locations; about/team
  snippet; transparent pricing note ("no hidden fees; renewal price shown").
- **Copy tone:** precise, calm, specific. Avoid hype. Prefer verifiable specifics
  ("NVMe storage", "daily backups with 30-day retention") over superlatives.
- **Footer:** max 4-5 columns, no duplicate headings, legal entity name and address (confirm
  the legal name with me before finalizing), contact numbers, and payment-method icons only
  for methods we actually accept.
- **No years** in titles, H1s, or component copy. Keep any year in config if needed.
- **No raw HTML entities** in rendered text. Add a test that fails if `&os;` or other raw
  entities appear in rendered output.
- **Logo:** only the official SVG, following the brand rules in section 2.

## Phase 4: QA and handoff

- Run Lighthouse (mobile and desktop) on key `/v2` showcase pages and report scores.
- Run axe accessibility checks and fix all serious/critical issues.
- Run the contrast-token check and the raw-entity test.
- Validate JSON-LD with a schema validator and fix errors.
- Provide before/after screenshots, a short CHANGELOG, and usage docs per component.
- List every placeholder and claim I must replace with verified real content.

## Open questions (ask me; don't guess)

1. Are plans billed monthly, annually, or both? Is the web-design package pricing one-time?
2. Which compliance badges, guarantees, and SLAs are actually true today?
3. Are there region-specific support numbers (US, UK, UAE, India)?
4. Which currencies have fixed prices set, and what are they?
5. What is the correct legal entity name and address for the footer?

## Definition of done

A visitor from London, Dubai, or Mumbai feels within 3 seconds that this is an established,
premium infrastructure company, while every page stays fast, accessible, semantically clean,
fully crawlable, and faithful to the DronaHost brand rules.
