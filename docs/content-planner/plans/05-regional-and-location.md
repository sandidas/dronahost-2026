# Plan 05: Regional and Location

**Intent:** the searcher wants a provider that fits their country: local currency, local law, nearby servers, convenient support hours.
**Goal:** win "for my country" queries and prove we understand the rules there.
**Owns:** hosting queries with a country or region, and web design or SEO queries with a country or city.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), Stages 0 to 3 and 5 to 7 (page spec). This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Buy (regional).
- **Interview:** the **Regional pages** bank in [interview-questions.md](../rules/interview-questions.md). Ask the questions exactly as written, one at a time.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ and HowTo markup give no Google rich result ([sources.md](../rules/sources.md), item 5). Use them only when they match the visible content and help the reader.

## Honesty first (this plan has the highest risk of false claims)

**What is true.** The facts about who runs the hosting, on what, and where are owner decisions with dates. They live in the project specifics and nowhere else. Copy may state only those facts.

Project specifics for this plan: [plan-specifics/05-regional-and-location.md](../project/plan-specifics/05-regional-and-location.md)

**Two modes for location claims**

| Mode | When | What copy may say |
|---|---|---|
| **B: no location claim** (default today) | Until the registry below exists and is verified | "Hosting for UK businesses", "runs on infrastructure from leading cloud providers". No city, country or provider. No "UK servers" |
| **A: location chosen at order** | When customers can pick a location and each option maps to a real [Billing system] server group with capacity | "Choose where your site runs: [list]". Only the locations in the registry, for the plans that offer them |

Mode A needs the product to offer it. If a site can be placed anywhere at the team's discretion, only Mode B is honest.

**What that means for copy**
- A location may be named only when it is in the **infrastructure registry** (`content/infrastructure.ts`, planned). One row per **[Billing system] server group**: city, country, whether customers can choose it, which plans offer it, date verified, who verified. The provider is recorded for internal use and the sub-processor list. It is not tied to a plan in public copy.
- Write "hosted in [City]" only for a plan and a group the registry confirms. Never "our data centre", "our servers" or "our own network". We rent the capacity and say so plainly.
- "UK servers" or "hosted in the UK" is allowed only in Mode A with a verified UK group for that plan. Otherwise write for "UK businesses" and describe what applies (UK GDPR and the ICO), not where the server is.
- Provider names are not used on marketing pages (see [Plan 07](07-compliance-and-trust.md), "Naming providers"). The sub-processor list names them.
- The [Billing system] server location says nothing about where customer sites run. Do not use it to imply regional site hosting.
- Do not claim a local office, address or phone line in the US, UK, EU or UAE. Do not target "near me" queries.
- Latency numbers appear only after we measure them with a stated method (tool, date, source and destination cities). Placeholder numbers never ship.

**Infrastructure registry (to build before any location copy).** The owner exports the [Billing system] server list (name, hostname, server group, location) and fills the table. Regional pages, the DPA sub-processor list and the "Where is my site hosted?" FAQ all read from it. `content/regions.ts` keeps the compliance regimes and stays free of locations.

### Standard answer: "Where is my site hosted?" (Mode B, the default)

> [Brand] is a team based in [Country]. Your site runs on servers that we rent from leading cloud providers. We name a location only when we can confirm it for your plan, and we list the providers we use in our sub-processor list. `[HUMAN REVIEW: Mode A wording needs the infrastructure registry]`

Use this wording for the FAQ, the About page and AI-search answers. Do not add a city, country or provider name until the registry confirms it.

## Page families

| Family | URL | Status | Seed keywords (unvalidated) |
|---|---|---|---|
| Regional hosting | `/hosting/us` | route exists | wordpress hosting for us businesses |
| | `/hosting/uk` | route exists | wordpress hosting for uk businesses, uk gdpr web hosting |
| | `/hosting/eu` | route exists | hosting for eu businesses, web hosting for eu businesses (not "gdpr compliant hosting" until the legal review is done) |
| | `/hosting/uae` | route exists | uae web hosting, wordpress hosting dubai |
| Regional services | `/web-design/[region]`, `/seo-services/[region]` | planned, **owned by [Plan 06](06-service-pages.md)** | This plan supplies the regional facts only |
| Country variants (phase 2) | `/hosting/de`, `/hosting/fr`, `/hosting/nl`, `/hosting/ie` | planned | hosting for german businesses |
| Locale versions | `/en-gb`, `/en-ae` and later `de-de`, `fr-fr`, `nl-nl`, `ar-ae` | off until the owner enables them (flag in project specifics) | Governed by [Plan 11](../later/11-localization-country-language-currency.md), including how a region page relates to its locale page |

Do not create a city page for every city. A city page needs a reason a city-specific searcher will not get from the country page (a real local fact we can verify). Otherwise skip it.

## Regional hosting page template

| # | Block | Rule |
|---|---|---|
| 1 | Hero | H1 states the product and the region ("WordPress hosting for UK businesses"). Currency defaults from `pricing.regions[region].defaultCurrency`. |
| 2 | Direct answer | 40 to 80 words: what this page covers and for whom. |
| 3 | Why location matters | Latency, data residency and search, in plain words. No invented numbers. |
| 4 | Rules that apply | Table of regimes from `content/regions.ts` (UK GDPR and ICO, GDPR, CCPA, UAE PDPL), what each means for a site owner, and what [Brand] provides. Link to `/privacy`, `/data-processing`, `/security`. |
| 5 | Plans and price | `PricingCards` with the regional currency and the standard tax line (wording in project specifics). Renewal beneath. |
| 6 | Support across time zones | Only the hours confirmed in the support policy. Channels: only those the support policy lists. Show times with a timezone ("9:00 AM ET"). |
| 7 | Payment methods | Only methods marked verified in `ACCEPTED_PAYMENT_METHODS`. |
| 8 | Region proof | Real testimonial or case study from a customer in the region, with permission. Otherwise omit the block. |
| 9 | FAQ | Region-specific: "Does [Brand] sign a data processing agreement?", "Do I pay tax?" (answer from the tax rule in project specifics), "Which currency will I be charged in?". |
| 10 | CTA | One primary, region currency. |

## Per-region notes

| Region | Compliance themes | Currency and tax | Language notes |
|---|---|---|---|
| US | CCPA and state privacy laws, ADA accessibility, HIPAA mentions only if we can support them | USD, tax excluded | US spelling |
| UK | UK GDPR, ICO, PECR cookie rules | GBP, no tax | British spelling on `en-GB` only when that locale is on |
| EU | GDPR, SCCs for transfers, data subject rights, 72-hour breach notice | EUR, no tax | Germany, Netherlands, France, Ireland first |
| UAE | UAE PDPL | AED, no tax | Arabic locale toggle in phase 2, right-to-left layout and Arabic font subset |

Never state legal conclusions ("this makes you compliant"). Say what we provide and what the customer remains responsible for. A legal review is required before each regional page ships.

## Regional services pages (web design and SEO), owned by Plan 06

Plan 06 owns the keywords and the template. This plan supplies the facts. Rules for those pages:

- State plainly: "We work with clients in [region] from our team in [Country]." No fake address, no local phone.
- Use time-zone overlap for meetings, and real case studies from clients in that region.
- Include region-specific concerns: UK cookie rules for design, local search for SEO, Arabic and right-to-left needs for UAE.

## Hreflang and canonicals

- Every localized page lists all alternates plus `x-default`. Canonical is self-referencing per locale.
- Do not create near-duplicate pages with only a currency swap. Each regional page must hold unique, useful content.
- Details in `docs/rules/seo-rules.md` section 4.

## Schema

`WebPage` with `BreadcrumbList`, `Product` and `Offer` in the regional currency, `FAQPage` matching the visible FAQ. `Organization` stays global and honest about location.

## Internal links (minimum)

The product page, `/pricing`, `/privacy` or the region's policy, `/data-processing`, a relevant compliance explainer from [Plan 07](07-compliance-and-trust.md), `/contact`.

## Pre-ship checklist

- [ ] No data centre, office or phone claim unless verified in the registries
- [ ] Currency comes from `pricing.json`
- [ ] Regime facts reviewed by a person qualified to review them
- [ ] Hreflang alternates and `x-default` present
- [ ] Not a near-duplicate of another regional page
- [ ] Time shown with a timezone

## Measure

Impressions and position per region, share of traffic from the region, currency selector use, plan clicks by region, DPA downloads (EU and UK).
