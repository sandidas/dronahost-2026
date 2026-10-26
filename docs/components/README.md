# DronaHost component library

Showcased live at `/v2` (development only) and `/v2/design-system`. All components are Server Components unless marked **client**. Every section component takes a `headingLevel` (`"h2" | "h3"`, hero components also `"h1"`) so a page keeps exactly one H1, and labels itself with `aria-labelledby`.

Import the design tokens from `app/styles/tokens.css` (color, radius, shadow, type, motion) and `app/styles/buttons.css`. Never hardcode colors; use Tailwind token utilities (`bg-card`, `text-muted-foreground`, `text-link`, `border-border`, `bg-action`, ...). `npm run check:contrast` verifies every token pair.

## Rules that apply everywhere

- **No invented facts.** Anything factual renders only when verified: `content/claims.ts`, `content/trust.ts`, `content/company.ts`. Sample data lives in `content/placeholders.ts` and is shown only with `showSamples` (development), with no status label on the page (`docs/rules/ui-ux-rules.md` §3.7).
- **Prices come from `data/pricing.json` only**, formatted with `lib/pricing` (`Intl`). Numeric prices are hidden in production until `FEATURES.pricesConfirmed` is set (`lib/flags.ts`).
- **Fonts are fixed**: Sora for headlines, Manrope for every other text. Vary size (responsive), loaded weight, tracking and colour only; never add a family, never italic, mono only for code (`docs/rules/ui-ux-rules.md` §3.6).
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

## Home sections (the "luxe" look, blueprint C1)

The ProductHero `console` variant brings the Home look to a whole page: `lib/content/registry.tsx` `pageLook()` returns `"luxe"` when the first section is `ProductHero:console`, and the shared sections switch to their matching variant (ProcessTimeline `cards`, MigrationRequest `tone="ink"`, FAQSection `lines`, CTABand `tone="ink"`), so the page JSON carries no styling. Styles live in `app/styles/luxe.css`: ink bands (`.tone-ink`, `.tone-ink-2`, always with the `.dark` scope so every text pair is in `npm run check:contrast`; tokens `--ink`, `--ink-2`, `--ink-raised`), the dot texture (`.dot-field`), light Sora 300 headlines with a 500 closing phrase (`.t-luxe-display`, `.t-luxe-h2`, `.luxe-accent`), the hairline eyebrow (`.eyebrow-rule`), pill actions with a soft orange glow (`rounded-full btn-glow`), glass cards and the orbit. Sections that set their own tone put `data-tone` on their root; `.page-tones` leaves them alone and `scripts/page-visibility.ts` reports that tone to BP12. Ink bands look the same in both themes; the other bands follow the theme (pearl in light, the page background or tint in dark).

| Component | Use | Notes |
|---|---|---|
| `ProductHero` `variant="console"` (`hero/ConsoleHero.tsx`) | Home hero | eyebrow with hairline, light H1 with heavier `accent`, entity lead, the one-field form (`hero/HeroSiteForm.tsx`, **client**) while `formRequires` holds, otherwise the two actions; the example console (title, status, 3 tiles from claims or "Label: value", 4 steps done/current/next, caption that says it is an example); the assurance rail (rendering claims as "value label" with their terms link). No entrance animation |
| `RatingBand` | Score and review-platform links | only from `loadVerifiedRating()`; nothing in production today; development sample `SAMPLE_RATING` |
| `AdvantageGrid` | 3 to 4 commitments as large numerals on a hairline rule | each item gates on `requiresClaim`; `firstHand` shows "Our decision" (TR7) |
| `ProductCards` | 2 to 4 product cards under the hero: line icon, optional tag, title, one sentence, a full-width button to the product page | no visible heading (screen-reader `h2`); no prices (decision 58); items gate with `requiresClaim` |
| `SolutionsGrid` | 1 to 2 featured glass cards and 3 to 8 small cards with line icons (`FeatureIcon` names) | ink band; section id is the anchor (`/#solutions`); optional `note` |
| `Ecosystem` | Points beside a CSS orbit of 4 to 8 nodes | `role="img"` with a label that lists every node; phones get a wrapped cluster |
| `ReviewsShowcase` | Dark featured case study beside review cards | `CASE_STUDIES` (with a real screenshot of the customer's site) and `loadVerifiedReviews()`; hidden in production until one exists; samples in development, unlabelled (§3.7) |
| `LuxeHeader` (`luxe/LuxeHeader.tsx`) | Shared header: eyebrow, light heading with closing phrase, description (`layout="split"` puts it beside the heading) | `lastSentence()` makes the second sentence of a two-sentence heading the closing phrase |

Prefill: the hero form calls `setPrefill("siteUrl", value)` (`lib/leads/prefill.ts`: sessionStorage plus a `dh:prefill` event); `MigrationRequest` reads it with `useSyncExternalStore`. Without JavaScript the hero form is a GET to `/?siteUrl=...#plan`, which the request form also reads.

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
| `FAQSection` | Open question cards beside `FaqCollage` | every answer visible; optional `photos` (real people only) and `link`; pair with `faqPageSchema` |
| `CTABand` | Closing call to action | one primary action |
| `VideoEmbed` | One real, captioned video on a content page (CP3) | click-to-load (`VideoFacade`, **client**) from youtube-nocookie.com, VideoObject JSON-LD, credit, transcript link; never stock or AI footage |
| `WhyChoose` | Blueprint section: three reasons to choose us, each with a source link to its terms page |
| `MigrationRequest` (**client**) | Free-move lead form: site URL, current host, email, optional note. Zod, honeypot, error and success states. Sends through `lib/leads/submit.ts`; the destination is `lib/leads/config.ts` (mailto by default) |
| `MeaningSection` | Blueprint section "Meaning": the direct answer under one question heading, then who looks after what (replaces AnswerBlock plus ResponsibilitySplit) |
| `HelpAndPolicies` | Blueprint section "Help and policies": live support channels beside a policy list (replaces SupportChannels plus TrustSignals) |
| `HonestLimits` | Blueprint section "HonestLimits": what we do not do, one limit per line with a reason and a link to the better option; items gate on claims; `firstHand` marks a recorded decision (trust rule TR7) |
| `PlanGuide` | Which plan fits which stage of a business: a table of websites, NVMe storage, memory and CPU, resource type and the next step up, all from `data/pricing.json`, with one "good fit when" line per plan from the page spec (decision 78) |
| `PageProvenance` | Blueprint section "PageProvenance": a named reviewer, role, review date (`<time>`, spelled-out month), one "how we check facts" line, a report-an-error link, and the editorial policy link once that page is published (trust rule TR6). Half-height band (`section-y-sm`) |
| `SupportChannels` | Ticket and email only; `layout="split"` puts the heading beside the cards | email renders only if `COMPANY.supportEmail` is set; ticket is always real |
| `NewsletterSignup` (**client**) | Email capture | off until `FEATURES.newsletter` and an `endpoint` exist |

## Intent banners (`components/sections/banners`)

Two banners per search intent. Each has its own art direction, so no two read as the same template, and its variants come from props. Copy comes from props; fixed labels live in `UI.banners` (`content/strings.ts`). `BannerShell.tsx` holds only the shared pieces: the landmark wrapper, `SCOPE` (`ink` forces the dark tokens, `paper` the light ones, so a navy band or a paper ticket looks the same in both themes and stays inside the contrast check), `Kicker`, `QuietLink`, `PrimaryAction`, `indexNo`, `currencySymbol` (Intl, formatting only). `Ticket.tsx` is the notched two-part paper shape. Art utilities are in `tokens.css` (`.outline-text`, `.tk-a`/`.tk-b`/`.tk-row`, `.barcode`, `.graph-paper`, `.contours`, `.index-card`, `.horizon-glow`, `.band-ink`, `.dotted-leader`, `t-statement`, `t-meta`). Every banner uses the site families only: Sora for headlines, Manrope for all other text (`docs/rules/ui-ux-rules.md` §3.6); each one gets its character from size, weight, tracking and art, never a new font. Shown with samples on `/v2` under "Intent banners". The rules behind them: `content-engine/rules/search-intent.md` and `rules/trust-and-intent-design.md`.

| Intent | Component | Concept | Variants (props) |
|---|---|---|---|
| Informational | `AnswerBanner` | Dictionary entry: the question as a large Sora headword, the answer as definition 1 signed by the reviewer, a giant outline question mark cropped off the edge | `layout` entry/margin/centered, `card` (ruled index card), `partOfSpeech`, `toc`, `next` |
| Informational | `GuideBanner` | Route map: the outcomes as a transit line from an orange start to a teal end, reading time on a sign, contour lines | `layout` line/vertical, `numbered`, `scope` ink/page |
| Navigational | `BrandBanner` | Lobby directory: the name cropped huge as an outline watermark, destinations lettered with dotted leaders | `layout` board/inline, `scope` ink/paper, `primaryCta`, `logo` |
| Navigational | `DestinationBanner` | Command palette: a glass quick-jump panel with keycaps; the search row is drawn, each row is a link | `layout` palette/split/tiles, `columns`, `key` per item |
| Commercial | `VerdictBanner` | Split screen: navy and paper halves with a "vs" seal, the verdict on a ribbon, criteria on a scoreboard with the check date | `layout` split/ribbon, `ribbon` teal/ink, `criteria`, actions |
| Commercial | `BuyersGuideBanner` | Magazine cover: masthead with double rule and issue mark, large Sora title, a contents page of what was compared, best-for and not-for stamps | `layout` cover/column, `scope` paper/ink, `issue`, `dateLine`, `notFor` |
| Transactional | `OfferBanner` | Ticket: plan and price on a notched paper ticket, renewal and tax as line items, the action and a barcode on the stub, navy with a low orange horizon | `layout` split/centered/compact, `scope` ink/page, `price` optional, `planName` |
| Transactional | `ActionBand` | Split block: the plan on navy, price and action on a solid orange block; or a whole orange band; or a floating pill | `variant` split/orange/pill, `sticky`, `price` optional |
| Local | `RegionBanner` | Boarding pass: the reader's region code in giant outline letters, its currency symbol, region facts as pass fields, action on the stub | `layout` split/pass, `scope`, `code`, `currency`, fact count |
| Local | `ServiceAreaBanner` | Currency wall: one column per region under its giant currency symbol, filled when a regional page exists, outlined when not | `layout` wall/list, `scope` ink/page, `currency` per region |
| Generative AI | `CitableFactBanner` | Footnoted article: the quotable sentences with superscript citations linked to footnotes (source, date checked) | `layout` article/quote/cards, `scope` |
| Generative AI | `TaskBanner` | Instrument panel on graph paper: the worked example drawn as sliders, ticks or choice chips with the answer on a dark result screen | `kind` calculator/checklist/planner, `layout` split/stacked, `example.readings`, `example.result` |

Local intent is served without a local claim: no office, phone or map, no "near me" targeting (workflow Stage 1); the boarding pass names the reader's region, never a server location. Transactional prices render only through `lib/pricing` and the guarantee and renewal lines only while their claims render. The orange horizon on `OfferBanner` and the orange block on `ActionBand` are the only places the action colour is a surface.

## Social proof and trust (all hidden unless verified)

| Component | Renders only when |
|---|---|
| `Testimonials` | name, role, company **and** source link are present; photo optional |
| `LogoStrip` | each logo needs its claim to render |
| `CaseStudy` | it links to a published, customer-approved `sourceUrl` |
| `StatsBar` | a claim in `content/claims.ts` is `verified` |
| `TrustSignals` | an item in `content/trust.ts` is `verified` (`variant="list"` is the compact divided list) |
| `TrustBadges` | a payment method in `content/claims.ts` is `verified` (shown as accepted methods only) |

## Layout chrome (`layouts`, `components/layout`)

`Header` (**client**: sticky, hosting mega menu that is always in the HTML, keyboard support), `MobileMenu` (focus trap, `inert` when closed), `Footer` (four unique columns; company details only when set), `AnnouncementBar` (active announcements from `/dashboard/announcements`, plus `content/announcement.ts` when enabled; renders nothing when none are active), `CurrencySelector` (**client**, behind `FEATURES.currencySelector`).

## Page templates

`components/templates/ServicePage` builds a standard service page (hero, feature grid, FAQ, CTA, JSON-LD) from an entry in `content/services.ts`.

## Team portals (`components/portal`, `components/builder`)

Used by `/dashboard` (admins and staff; Team and Announcements are admin only); see `docs/reference/PORTALS.md`. Shown on `/v2` under "Team portals" with sample records from `content/placeholders.ts`. Server views load data and pass it to a component that only renders, so `/v2` can show it without a database: `PostsView` → `PostsList`, `OverviewView` → `OverviewCards`, `PortalShell` → `PortalHeader`. **Client**: the page builder `BuilderApp` (`components/builder`: `TopBar`, `LeftPanel`, `Canvas`, `Inspector`, `FieldControl`, `SiteBlockView`, `PreviewFrame`, state in `store.ts` with zustand and zundo undo), `editor/RichTextEditor` (Tiptap; imports `app/styles/rich-content.css` itself; `variant="inline"` on the builder canvas), `TeamManager`, `InviteForm`, `AnnouncementsManager`, `AnnouncementForm`, `GoogleSignInButton`, `SignOutButton`. Buttons call the real server actions, which check `lib/auth/permissions.ts`: signed out, `/v2` changes nothing; signed in to a portal in the same browser, adding a member or saving an announcement there creates a real record (sample ids match nothing, so edits, deletes and role changes still do nothing).

## Structured data

`lib/seo/jsonld.ts`: `organizationSchema`, `websiteSchema`, `breadcrumbSchema`, `faqPageSchema`, `serviceSchema`, `hostingPlansSchema` (omitted while prices are hidden), `blogPostingSchema`, `articleSchema`. Only mark up content visible on the page.

## Real hero screenshot

Put a real screenshot of the customer dashboard at `public/screenshots/home-dashboard.png` (1600 by 1000 works well). The home hero shows it automatically. With no file the hero shows no visual and centres its text, so a fake picture never appears. Edit `hero.screenshot.alt` in `content/pages/home.json` so it describes the real image.

## Feature flags (`lib/flags.ts`)

`currencySelector`, `pricesConfirmed`, `checkout`, `newsletter`, `accountArea`, `comparisonPages` are all **off**. Turn each on only when the thing it guards is real and verified.
