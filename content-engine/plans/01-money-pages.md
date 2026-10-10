# Plan 01: Money Pages (transactional and product intent)

**Intent:** the searcher is ready to buy, or one step away. They name a product and often a buying word.
**Goal:** convert. Every element earns trust or removes a doubt about price, risk or fit.
**Owns:** product pages and the pricing page. Nothing else on the site targets these keywords.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages; Stage 4 output is page-spec copy, not an article. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Buy.
- **Interview:** The **Money page** bank in [interview-questions.md](../rules/interview-questions.md).
- **Page blueprint:** the section count, required sections, order and per-section limits for this page type are in [page-blueprints.md](../rules/page-blueprints.md). The blueprint this project uses for each URL is in `project/page-map.md`; a page spec names it in its `blueprint` field.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). Use them only when they match the visible content and help the reader.

## Pages

| Page | Primary keyword shape |
|---|---|
| One product page per [Product] | "[product]", "managed [product]", "[product] for [audience]" |
| Pricing | "[product category] plans and pricing" |
| Landing pages (campaign or segment) | Format rules in [page-blueprints.md](../rules/page-blueprints.md), Part D. Archetype money |
| Migration, email | Owned by [Plan 14](14-migration-and-email.md) |
| Segment pages | `/[product]/[segment]`, see the segment list below |

The project's page inventory (URLs, status in the repo, seed keywords): the project's plan-specifics for this plan.

### Segment pages (planned, add only when the plan truly supports the use)

| Segment | Seed keyword shape | Condition to publish |
|---|---|---|
| An audience (agencies, freelancers) | "[product] for [audience]" | Plan limits and the features that audience needs are in the pricing file and verified |
| A platform or use (a store plugin, a framework) | "[platform] [product]" | A feature claim confirms support on the plan |

If the condition is not met, the page does not exist yet. Do not write a segment page from assumptions.

## Products and their data

A page may state specifics only where the data exists. For each product, list what the pricing data holds and what the page may say today. A product with no plan in the pricing data gets no price and no plan cards: it uses "Talk to the team" and a clear next step. Capabilities in the pricing data decide what a keyword page may claim.

Project specifics for this plan: [plan-specifics/01-money-pages.md](../project/plan-specifics/01-money-pages.md) (products, data status, owner decisions, consequences).

## Keyword seeds

Target (specific, buyer language):
- "managed [product]", "[product] [country]"
- "[product] [verified feature]" (only while that feature's claim renders)
- "[product] with free migration" (only while the migration claim renders)
- The project's seeds: the project's plan-specifics for this plan, and the keyword register

Do not target:
- `best web hosting`, `web hosting`, `cheap web hosting`: owned by large brands with large budgets
- `free web hosting`: wrong intent, does not convert
- `unlimited hosting`: a claim we do not make, and a phrase the content rules discourage

## Page template

Order matters. Each block must work if the reader reads only that block.

| # | Block | Component | Content rule |
|---|---|---|---|
| 1 | Hero | `ProductHero` | H1 names the product and one outcome. One primary CTA, "See [product] plans"; the price sits beside it (from the pricing file), never in the label. One trust line from a rendering claim. |
| 2 | Direct answer | `AnswerBlock` | 40 to 80 words answering "what is this and who is it for". |
| 2a | Honest limits | `HonestLimits` | What the product does not do and who it is not for, before the plans. See [page-blueprints.md](../rules/page-blueprints.md), rule 12. |
| 3 | Plans | `PricingPlans` | Signup price, renewal price beneath (the renewal field in the pricing file), the project tax line (`pricing.taxLine` in `project/settings.json`). A null limit is never shown as "Unlimited": show "Fair use" (link to the fair use policy) when the plan's traffic type is fair use, and hide any field that is null. |
| 4 | What is included | `FeatureGrid` | Items use `feature:` refs, so unverified features do not render. |
| 5 | How it works | `ProcessTimeline` | Order, set up, migrate, go live. Plain steps, no invented timings. |
| 6 | Proof | `Testimonials`, `CaseStudy`, `StatsBar` | Real, named, with permission. Renders only when the reviews gate and claims allow. Otherwise the block is dropped, not faked. |
| 7 | Compare | link block | Link to the matching `/vs/[competitor]` and the pricing page. |
| 8 | FAQ | `FAQSection` | Count per `limits.faqItemsByArchetype` in the config, first sentence answers, 40 to 80 words, at most one link per answer. |
| 8a | Provenance | `PageProvenance` | Named reviewer and review date. |
| 9 | Closing CTA | `CTABand` | Same CTA as the hero. Guarantee line only if the money-back claim renders. |

**Extra blocks (rules in [content-writing-rules.md](../rules/content-writing-rules.md), sections 9 to 12):**

| Block | Where | Rule |
|---|---|---|
| Which service fits? (service vs service table) | Product pages and the pricing page, after the plans | Section 10. Use `ComparisonTable`. Direct answer above it, "Best for" and "Not a good fit when" rows, words not only icons |
| Plan finder (3 to 5 questions) | The pricing page and the product overview | Section 9. Recommends a plan from the pricing file's limits and says why. Works without JavaScript for the facts |
| Reason-led headline | Hero H1 | Section 12. "[Outcome] because [verified reason]" with a fallback headline when the claim is hidden |
| Maintenance pitch | Product pages (a short block) and the maintenance cluster | Section 11. No inclusions, times or prices until the service sheet in Plan 06 is filled (project status: the project's plan-specifics) |

The layout signature must differ between money pages (`npm run check:pages` enforces it). Vary the hero variant and the section order, not the quality bar.

**Exclusions customers may assume.** Where a product does not include something customers expect (for example email), product pages say so once, in plain words, and link to the page that owns it. Never imply it comes with a plan. Project specifics hold the current exclusions.

**Same plans everywhere.** Locale and regional versions of these pages show the same plans and terms. Only the currency, tax line and regional compliance text differ ([Plan 11](../later/11-localization-country-language-currency.md)).

## Keyword placement

- H1: primary keyword or a close variant, 20 to 70 characters.
- First 100 words: primary keyword once, with the entity named ("[Brand] is a [business description] ...").
- One H2 contains a secondary keyword. Do not repeat the primary keyword in every heading.
- Title: keyword first, no brand suffix (the helper adds it). Meta description: outcome, difference, next step.

## Copy formulas

- **H1:** reason-led first ([content-writing-rules.md](../rules/content-writing-rules.md), section 12). Fallback while its claim is hidden: `[Product] for [audience], [outcome]`. Example shape: "Managed WordPress hosting for small business sites".
- **Hero line:** the server work we handle, then the technical term in brackets. See [voice.md](../rules/voice.md).
- **CTA:** the card button reads `Choose [Plan Name]`. The price, billing period, renewal price and tax line sit above it, read from the pricing file, and never inside the label. While prices or checkout are not confirmed, the button goes to the contact page and the price block shows "Price on request" (gate details in project specifics). Beneath the button: the guarantee line, only when its claim renders.
- **Price line:** symbol, amount, billing period, and the tax line. Always the renewal price beneath.

## Proof and claims needed

| Need | Source | If missing |
|---|---|---|
| Money-back guarantee | The money-back claim and a published refund policy | Omit the line |
| Uptime | The uptime claim and a published SLA | Omit the figure |
| Support hours | The support-hours claim and a published support page | Say "contact the team" |
| Migration | The migration claims | Describe the process only |
| Reviews and logos | The trust registry and the reviews file | Drop the block |

Claim IDs and file paths for this project: the project's plan-specifics for this plan.

## Schema

- `Product` with `Offer` per plan. Prices from the pricing file. **No `AggregateRating`** without real, linked reviews.
- `BreadcrumbList` on every page. `FAQPage` only if it matches the visible FAQ exactly.

## Internal links (minimum)

The pricing page, the migration page, the matching regional page, the matching `/vs/` page, the security page, the page that owns an excluded product (on product pages), one relevant guide or KB article, the contact page. Anchors are descriptive ("compare WordPress hosting plans").

## Pre-ship checklist

- [ ] Primary keyword is unique in the register and confirmed as Buy intent in the live results
- [ ] No hardcoded price, number, guarantee or location in copy
- [ ] Page works with the price and checkout gates both off (no numeric price in metadata or JSON-LD, CTA goes to the contact page)
- [ ] Currency and tax line come from the pricing file and `project/settings.json` for the page's locale ([Plan 11](../later/11-localization-country-language-currency.md))
- [ ] One primary CTA only
- [ ] Renewal price shown on every plan card
- [ ] FAQ answers start with the answer
- [ ] Reading grade and sentence length inside `readability` in `project/voice.json`, no banned phrase
- [ ] Unique title and description, JSON-LD validates
- [ ] LCP image has `priority`, below-fold images lazy, CLS under 0.1
- [ ] `npm run check:pages` and `npm run lint:content` pass

## Measure

Primary: plan selection clicks, checkout starts, purchases. Secondary: position for the primary keyword, click-through rate, pricing page visits from this page. Review after 28 days, then quarterly.
