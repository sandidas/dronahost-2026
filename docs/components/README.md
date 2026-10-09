# DronaHost component library

Showcased live at `/v2` (development only) and `/v2/design-system`. All components are Server Components unless marked **client**. Every section component takes a `headingLevel` (`"h2" | "h3"`, hero components also `"h1"`) so a page keeps exactly one H1, and labels itself with `aria-labelledby`.

Import the design tokens from `app/styles/tokens.css` (color, radius, shadow, type, motion) and `app/styles/buttons.css`. Never hardcode colors; use Tailwind token utilities (`bg-card`, `text-muted-foreground`, `text-link`, `border-border`, `bg-action`, ...). `npm run check:contrast` verifies every token pair.

## Rules that apply everywhere

- **No invented facts.** Anything factual renders only when verified: `content/claims.ts`, `content/trust.ts`, `content/company.ts`. Unverified sample data lives in `content/placeholders.ts` and is shown only with `showSamples`.
- **Prices come from `data/pricing.json` only**, formatted with `lib/pricing` (`Intl`). Numeric prices are hidden in production until `FEATURES.pricesConfirmed` is set (`lib/flags.ts`).
- One primary (orange) action per section. Teal is for links and a single highlighted phrase.

## Layout and primitives (`components/ui`)

| Component | Use | Key props |
|---|---|---|
| `Button` | `<a>` (via `next/link`) when `href` is set, otherwise `<button>` | `variant` primary/secondary/ghost/link, `size` sm/md/lg, `loading`, `disabled`, `fullWidth`, `external`, `leadingIcon`, `trailingIcon` |
| `Surface` | Layered card: hairline border, inner highlight, soft shadow | `variant` default/raised/glass, `padding`, `interactive`, `as` |
| `Badge` | Small status/category label | `variant` primary/secondary/success/warning/danger/neutral |
| `Logo` | The official SVG only (no color or filter props) | `size` sm/md/lg, `priority` |
| `FeatureIcon` | Teal icon tile from a curated lucide set | `name`, `size` |
| `ThemeToggle` (**client**) | Dark (default) / light switch, no hydration flash | `showLabel` |
| `Reveal` (**client**) | Fade-and-lift once on scroll, reduced-motion aware, no layout shift | `as`, `className` |
| `CodeBlock` + `CopyButton` (**client**) | `<pre><code>` in the initial HTML with a copy button | `code`, `title`, `language` |
| `HeadLineText`, `Section`, `GradientText` | Legacy typographic/layout helpers kept for older pages | see JSDoc |

## Heroes (`components/sections`)

| Component | Use |
|---|---|
| `ProductHero` | Homepage/flagship: display headline, highlights, dashboard mockup (decorative; three neutral tile labels) |
| `SplitHero` | Service/feature pages: text beside a staging-workflow mockup (`reverse` swaps sides) |
| `CenteredHero` | Text-led pages (About, SEO, blog, contact, regions) |

Shared props: `eyebrow`, `title`, `titleAccent`, `description`, `primaryCta`, `secondaryCta`, `highlights`, `note`, `headingLevel`. Copy lives in `content/heroes.ts`.

## Content sections

| Component | Use | Notes |
|---|---|---|
| `SectionHeader` | Eyebrow + heading + lead | used by all sections below |
| `FeatureGrid` | Features / "What we offer" | `variant` cards/divided/plain, `columns` 2-4, 1-12 items, stretched-link cards |
| `BentoGrid` | "Why us" mosaic | `items[].span` third/half/twoThirds/full, CSS `visual` slot |
| `TwoColumn` | Text + checklist + actions beside a `visual` | `visualPosition`; four visuals in `visuals/split.tsx` |
| `ComparisonTable` | Accessible comparison | real `<table>`, sticky first column, keyboard-scrollable, `bare` mode for `<details>`; plans via `lib/pricing/compare.ts` |
| `PricingPlans` (**client**) + `PricingExtras` | Plans, billing toggle, add-ons, full table | toggle only if both periods are offered; renewal line under the price; "Price on request" when prices are hidden |
| `ProcessTimeline` | Migration / process steps | semantic `<ol>`, 2-6 steps |
| `ResourceGrid` | Blog/resource cards | no image required, unambiguous dates |
| `FAQSection` | Accordion on native `<details>` | answers in the initial HTML, works without JS; pair with `faqPageSchema` |
| `CTABand` | Closing call to action | one primary action |
| `WhyChoose` | Blueprint section: three reasons to choose us, each with a source link to its terms page |
| `MigrationRequest` (**client**) | Free-move lead form: site URL, current host, email, optional note. Zod, honeypot, error and success states. Sends through `lib/leads/submit.ts`; the destination is `lib/leads/config.ts` (mailto by default) |
| `MeaningSection` | Blueprint section "Meaning": the direct answer under one question heading, then who looks after what (replaces AnswerBlock plus ResponsibilitySplit) |
| `HelpAndPolicies` | Blueprint section "Help and policies": live support channels beside a policy list (replaces SupportChannels plus TrustSignals) |
| `SupportChannels` | Ticket and email only; `layout="split"` puts the heading beside the cards | email renders only if `COMPANY.supportEmail` is set; ticket is always real |
| `NewsletterSignup` (**client**) | Email capture | off until `FEATURES.newsletter` and an `endpoint` exist |

## Social proof and trust (all hidden unless verified)

| Component | Renders only when |
|---|---|
| `Testimonials` | name, role, company **and** source link are present; photo optional |
| `LogoWall` | logos are flagged `verified` (written permission); rating needs a source URL |
| `CaseStudy` | it links to a published, customer-approved `sourceUrl` |
| `StatsBar` | a claim in `content/claims.ts` is `verified` |
| `TrustSignals` | an item in `content/trust.ts` is `verified` (`variant="list"` is the compact divided list) |
| `TrustBadges` | a payment method in `content/claims.ts` is `verified` (shown as accepted methods only) |

## Layout chrome (`layouts`, `components/layout`)

`Header` (**client**: sticky, hosting mega menu that is always in the HTML, keyboard support), `MobileMenu` (focus trap, `inert` when closed), `Footer` (four unique columns; company details only when set), `AnnouncementBar` (disabled by default), `CurrencySelector` (**client**, behind `FEATURES.currencySelector`).

## Page templates

`components/templates/ServicePage` builds a standard service page (hero, feature grid, FAQ, CTA, JSON-LD) from an entry in `content/services.ts`.

## Structured data

`lib/seo/jsonld.ts`: `organizationSchema`, `websiteSchema`, `breadcrumbSchema`, `faqPageSchema`, `serviceSchema`, `hostingPlansSchema` (omitted while prices are hidden), `blogPostingSchema`, `articleSchema`. Only mark up content visible on the page.

## Real hero screenshot

Put a real screenshot of the customer dashboard at `public/screenshots/home-dashboard.png` (1600 by 1000 works well). The home hero shows it automatically. With no file the hero shows no visual and centres its text, so a fake picture never appears. Edit `hero.screenshot.alt` in `content/pages/home.json` so it describes the real image.

## Feature flags (`lib/flags.ts`)

`currencySelector`, `pricesConfirmed`, `checkout`, `newsletter`, `accountArea`, `comparisonPages` are all **off**. Turn each on only when the thing it guards is real and verified.
