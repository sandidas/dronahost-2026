# Project specifics: Plan 05 Regional and Location

Core plan: [../../plans/05-regional-and-location.md](../../plans/05-regional-and-location.md). Original wording is kept below, under the plan section it belongs to.

## Honesty first: what is true

**What is true (owner, 2026-10-07 and 2026-10-07).** DronaHost is a focused team based in India. It does **not own servers or data centers**. It buys servers from AWS, Google Cloud, DigitalOcean, Hetzner and similar providers in various locations and runs hosting on them. There is **no fixed provider for a given city or plan**. The WHMCS billing system runs on a server in Europe.

## Honesty first: what that means for copy (billing system server)

- The WHMCS server location says nothing about where customer sites run. Do not use it to imply European site hosting.

## Standard answer: "Where is my site hosted?" (Mode B, the default)

> Your site runs on servers we rent from established cloud providers. We name a location only when we can confirm it for your plan; the providers are listed in our sub-processor list. `[HUMAN REVIEW: Mode A wording needs the infrastructure registry]`

## Page families: locale versions row

| Locale versions | `/en-gb`, `/en-ae` and later `de-de`, `fr-fr`, `nl-nl`, `ar-ae` | off until `FEATURES.localeVariants` | Governed by [Plan 11](../../later/11-localization-country-language-currency.md), including how a region page relates to its locale page |

## Regional hosting page template

Block 5 (Plans and price): | 5 | Plans and price | `PricingCards` with the regional currency and the standard tax line ("Prices exclude tax. Customers in India pay GST at checkout."). Renewal beneath. |

Block 6 (Support across time zones): | 6 | Support across time zones | Only the hours confirmed in the support policy. Channels are ticket and email only. Show times with a timezone ("9:00 AM ET"). |

Block 9 (FAQ): | 9 | FAQ | Region-specific: "Does DronaHost sign a data processing agreement?", "Do I pay tax?" (answer: no, unless you are a customer in India), "Which currency will I be charged in?". |

## Regional services pages (web design and SEO), owned by Plan 06

- State plainly what we do for clients in [region]. No fake address, no local phone. Where the business is based is said on `/about` only (decision 34). Superseded wording, 2026-10-10: "We work with clients in [region] from our team in India."

## Moved from the core plan, 2026-10-10

### Page families

| Family | URL | Status | Seed keywords (unvalidated) |
|---|---|---|---|
| Regional hosting | `/hosting/us` | route exists | wordpress hosting for us businesses |
| | `/hosting/uk` | route exists | wordpress hosting for uk businesses, uk gdpr web hosting |
| | `/hosting/eu` | route exists | hosting for eu businesses, web hosting for eu businesses (not "gdpr compliant hosting" until the legal review is done) |
| | `/hosting/uae` | route exists | uae web hosting, wordpress hosting dubai |
| Regional services | `/web-design/[region]`, `/seo-services/[region]` | planned, **owned by [Plan 06](06-service-pages.md)** | This plan supplies the regional facts only |
| Country variants (phase 2) | `/hosting/de`, `/hosting/fr`, `/hosting/nl`, `/hosting/ie` | planned | hosting for german businesses |
| Locale versions | `/en-gb`, `/en-ae` and later `de-de`, `fr-fr`, `nl-nl`, `ar-ae` | off until the owner enables them (flag in project specifics) | Governed by [Plan 11](../later/11-localization-country-language-currency.md), including how a region page relates to its locale page |

### Per-region notes

| Region | Compliance themes | Currency and tax | Language notes |
|---|---|---|---|
| US | CCPA and state privacy laws, ADA accessibility, HIPAA mentions only if we can support them | USD, tax excluded | US spelling |
| UK | UK GDPR, ICO, PECR cookie rules | GBP, no tax | British spelling on `en-GB` only when that locale is on |
| EU | GDPR, SCCs for transfers, data subject rights, 72-hour breach notice | EUR, no tax | Germany, Netherlands, France, Ireland first |
| UAE | UAE PDPL | AED, no tax | Arabic locale toggle in phase 2, right-to-left layout and Arabic font subset |

### Registries named in the core plan

- Infrastructure registry: `content/infrastructure.ts` (planned).
- Regions registry: `content/regions.ts`.
- Payment methods registry: `ACCEPTED_PAYMENT_METHODS`.
- Region default currency: `pricing.regions[region].defaultCurrency` in `data/pricing.json`.
- SEO rules: `docs/rules/seo-rules.md` section 4.
