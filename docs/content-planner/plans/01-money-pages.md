# Plan 01: Money Pages (transactional and product intent)

**Intent:** the searcher is ready to buy, or one step away. They name a product and often a buying word.
**Goal:** convert. Every element earns trust or removes a doubt about price, risk or fit.
**Owns:** product pages and the pricing page. Nothing else on the site targets these keywords.

## Pages

| Page | URL | Status in repo | Primary keyword (seed, unvalidated) |
|---|---|---|---|
| WordPress hosting | `/wordpress-hosting` | exists | managed wordpress hosting |
| VPS hosting | `/vps-hosting` | exists | managed vps hosting |
| Cloud hosting | `/cloud-hosting` | exists | cloud hosting for small business |
| Business hosting | `/business-hosting` | exists | business web hosting (see "Products and their data": email is not part of it today) |
| Pricing | `/pricing` | exists | hosting plans and pricing |
| Migration | `/migration` | exists as a request form | owned by [Plan 14](14-migration-and-email.md) |
| Email (not hosted) | `/email` | planned | owned by [Plan 14](14-migration-and-email.md) |
| Segment pages | `/wordpress-hosting/[segment]` | planned | see segment list below |

### Segment pages (planned, add only when the plan truly supports the use)

| Segment | Seed keyword | Condition to publish |
|---|---|---|
| Agencies | wordpress hosting for agencies | Plan limits and multi-site features are in `pricing.json` and verified |
| Freelancers | wordpress hosting for freelancers | Same |
| WooCommerce | woocommerce hosting | A feature claim confirms store support |
| Next.js | nextjs hosting | A feature claim confirms Node.js support on the plan |
| (removed) Business email | `pricing.json` says email hosting is discontinued, so no email keyword is targeted until the owner says otherwise | n/a |

If the condition is not met, the page does not exist yet. Do not write a segment page from assumptions.

## Products and their data (checked against `data/pricing.json` v3.0.0, 2026-10-07)

The owner offers five products. Only some have data behind them. A page may state specifics only where the data exists. `pricing.json` itself is marked "recommended, needs owner confirmation", and its `confirmBeforeLaunch` list (limits, backup retention, staging, security and support items, free domain) is still open.

| Product | Page | What `pricing.json` holds | What the page may say today |
|---|---|---|---|
| WordPress hosting | `/wordpress-hosting` | Family "wordpress": Starter, Growth, Pro (managed WordPress, limits, capabilities, add-ons) | Plan names, `bestFor` lines and the structure. Limits and features render only when their claim renders. Prices stay hidden until `pricesConfirmed` |
| Business hosting | `/business-hosting` | Family "web": Essential and Plus (cPanel, unmanaged, any site type). **Confirmed by the owner, 2026-10-07** | Plans and limits as confirmed, prices hidden until confirmed. Never call it managed or WordPress-specific. Email is not included: say so once and link to `/email` |
| VPS hosting | `/vps-hosting` | **No VPS plans.** Only the "high-traffic and dedicated" contact entry (no price, no resources) | "Talk to the team". No price, no specs, no "unlimited" |
| Cloud hosting | `/cloud-hosting` | **No cloud plans** | "Talk to the team". No price or specs |
| Domain registration | `/domains` | **No domain pricing** (the file says so) | Describe the service. No price. Live search stays off until `domainSearch` is on |

**Owner decisions (2026-10-07):**
- **All service prices live in `pricing.json`.** VPS, cloud and business plans are added there by the owner when ready. Until a plan is in the file, its page has no price and no plan cards ("Talk to the team").
- **Domain prices sync from WHMCS later.** They are never typed into copy or into `pricing.json` by hand. Until the sync exists, domain pages show no price.
- **The maintenance plan is added later,** as a plan or add-on in `pricing.json`. Until then maintenance pages are drafts with no inclusions, times or prices (Plan 06).

Consequences for the plans:
- The "Plans" block and the price CTA exist only for WordPress hosting (and the web family once confirmed). VPS, cloud and domains use "Talk to the team" and a clear next step.
- `capabilities` decide what a keyword page may claim. Examples: staging, object cache and automated plugin testing start at Growth. WooCommerce optimisation, advanced security and performance tuning are Pro only. Free domain for the first year is Growth, Pro and Plus (unconfirmed). So "woocommerce hosting" belongs on a Pro-led page, and "wordpress hosting for agencies" fits Pro.
- The web family is **unmanaged**. Never call it managed or give it WordPress-specific tools.
- Segment pages (agencies, WooCommerce, Next.js) wait for the plan limits to be confirmed.

## Keyword seeds

Target (specific, buyer language):
- managed wordpress hosting, managed wordpress hosting usa
- wordpress hosting litespeed, wordpress hosting nvme
- managed vps hosting, vps hosting with root access
- wordpress hosting with free migration (only while `free-migration` renders)
- business web hosting (no email keyword until the owner clarifies the product)
- nextjs hosting

Do not target:
- `best web hosting`, `web hosting`, `cheap web hosting`: owned by large brands with large budgets
- `free web hosting`: wrong intent, does not convert
- `unlimited hosting`: a claim we do not make, and a phrase the content rules discourage

## Page template

Order matters. Each block must work if the reader reads only that block.

| # | Block | Component | Content rule |
|---|---|---|---|
| 1 | Hero | `ProductHero` | H1 names the product and one outcome. One primary CTA with price from `pricing.json`. One trust line from a rendering claim. |
| 2 | Direct answer | `TwoColumn` or short text | 40 to 80 words answering "what is this and who is it for". |
| 3 | Plans | `PricingCards` | Signup price, renewal price beneath (`pricing.renewal`), the tax line ("Prices exclude tax. Customers in India pay GST at checkout."), A null limit is never shown as "Unlimited": show "Fair use" (link to `/fair-use-policy`) when `trafficType` is `fair-use`, and hide any field that is null. |
| 4 | What is included | `FeatureGrid` | Items use `feature:` refs, so unverified features do not render. |
| 5 | How it works | `ProcessSteps` | Order, set up, migrate, go live. Plain steps, no invented timings. |
| 6 | Proof | `Testimonials`, `CaseStudy`, `StatsBar` | Real, named, with permission. Renders only when `verifiedReviews` and claims allow. Otherwise the block is dropped, not faked. |
| 7 | Compare | link block | Link to the matching `/vs/[competitor]` and `/pricing`. |
| 8 | FAQ | `FAQSection` | 6 to 8 questions, first sentence answers, 40 to 80 words, at most one link per answer. |
| 9 | Closing CTA | `CTASection` | Same CTA as the hero. Guarantee line only if `money-back` renders. |

**Extra blocks (rules in `docs/content-planner/rules/content-writing-rules.md`, sections 9 to 12):**

| Block | Where | Rule |
|---|---|---|
| Which service fits? (service vs service table) | Product pages and `/pricing`, after the plans | Section 10. Use `ComparisonTable`. Direct answer above it, "Best for" and "Not a good fit when" rows, words not only icons |
| Plan finder (3 to 5 questions) | `/pricing` and the hosting overview | Section 9. Recommends a plan from `pricing.json` limits and says why. Works without JavaScript for the facts |
| Reason-led headline | Hero H1 | Section 12. "[Outcome] because [verified reason]" with a fallback headline when the claim is hidden |
| Maintenance pitch | Product pages (a short block) and the maintenance cluster | Section 11. The service exists, but its scope and price are not defined, so no inclusions, times or prices until the service sheet in Plan 06 is filled |

The layout signature must differ between money pages (`npm run check:pages` enforces it). Vary the hero variant and the section order, not the quality bar.

**Email is not hosted by DronaHost.** Product pages say so once, in plain words, and link to `/email`. Never imply a mailbox comes with a plan.

**Same plans everywhere.** Locale and regional versions of these pages show the same plans and terms. Only the currency, tax line and regional compliance text differ ([Plan 11](../later/11-localization-country-language-currency.md)).

## Keyword placement

- H1: primary keyword or a close variant, under 70 characters.
- First 100 words: primary keyword once, with the entity named ("DronaHost is a hosting and web agency ...").
- One H2 contains a secondary keyword. Do not repeat the primary keyword in every heading.
- Title: keyword first, no brand suffix (the helper adds it). Meta description: outcome, difference, next step.

## Copy formulas

- **H1:** `[Product] for [audience], [outcome]`. Example shape: "Managed WordPress hosting for small business sites".
- **Hero line:** the server work we handle, then the technical term in brackets. See [voice.md](../rules/voice.md).
- **CTA:** the card button reads `Choose [Plan Name]`. The price, billing period, renewal price and tax line sit above it, read from `pricing.json`, and never inside the label. While `FEATURES.pricesConfirmed` and `FEATURES.checkout` are not both on, the button goes to `/contact` and reads "Talk to the team about [Plan Name]", and the price block shows "Price on request" in production. Beneath the button: the guarantee line, only when its claim renders.
- **Price line:** symbol, amount, billing period, and the tax line. Always the renewal price beneath.

## Proof and claims needed

| Need | Source | If missing |
|---|---|---|
| Money-back guarantee | `money-back` claim and a published `/refund-policy` | Omit the line |
| Uptime | `uptime-sla` claim and published `/sla` | Omit the figure |
| Support hours | `support-24-7` claim and a published support page | Say "contact the team" |
| Migration | `free-migration`, `migration-process` | Describe the process only |
| Reviews and logos | `content/trust.ts`, `lib/content/reviews.ts` | Drop the block |

## Schema

- `Product` with `Offer` per plan. Prices from `pricing.json`. **No `AggregateRating`** without real, linked reviews.
- `BreadcrumbList` on every page. `FAQPage` only if it matches the visible FAQ exactly.

## Internal links (minimum)

`/pricing`, `/migration`, the matching regional page, the matching `/vs/` page, `/security`, `/email` (on product pages), one relevant blog or KB guide, `/contact`. Anchors are descriptive ("compare WordPress hosting plans").

## Pre-ship checklist

- [ ] Primary keyword is unique in the register and confirmed as transactional or commercial in the live results
- [ ] No hardcoded price, number, guarantee or location in copy
- [ ] Page works with `pricesConfirmed` and `checkout` both off (no numeric price in metadata or JSON-LD, CTA goes to `/contact`)
- [ ] Currency and tax line come from `pricing.json` for the page's locale ([Plan 11](../later/11-localization-country-language-currency.md))
- [ ] One primary CTA only
- [ ] Renewal price shown on every plan card
- [ ] FAQ answers start with the answer
- [ ] Reading grade 8 to 10, sentences under 28 words, no phrase from the avoid list
- [ ] Unique title and description, JSON-LD validates
- [ ] LCP image has `priority`, below-fold images lazy, CLS under 0.1
- [ ] `npm run check:pages` and `npm run lint:content` pass

## Measure

Primary: plan selection clicks, checkout starts, purchases. Secondary: position for the primary keyword, click-through rate, pricing page visits from this page. Review after 28 days, then quarterly.
