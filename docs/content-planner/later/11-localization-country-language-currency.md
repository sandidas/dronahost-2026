# Plan 11: Localization (country, language and currency switching)

**Intent served:** the same search intents as Plans 01 to 10, in the reader's country, language and currency.
**Goal:** a visitor picks a country once and sees the right language, the right currency, the right tax line and the right rules. Search engines see one clean page per locale.
**Not a separate set of pages.** This plan decides *how every other plan is repeated per locale*, and which pages are worth repeating.

> Revised 2026-10-07 with the owner's decisions (launch order, English variants, currency memory, explicit prices). The code has English locales only (`en-us`, `en-gb`, `en-ae`), all variants are off (`FEATURES.localeVariants = false`), the currency selector is off (`FEATURES.currencySelector = false`), and `data/pricing.json` holds USD only. This plan is the content side. It does not change code. Code work needs its own task.

## Three separate things (never mix them)

| Concept | What it is | Where it lives | Changes |
|---|---|---|---|
| **Locale** | Language plus regional wording and formats. One URL per locale (`/en-gb/...`). | `lib/i18n/config.ts`, `messages/<locale>.json`, `content/*.ts` | Page text, spelling, date and number formats, hreflang |
| **Currency** | How prices are displayed. Never changes the plan or the terms. | `data/pricing.json` (`currencies`, per-plan price maps) | Symbol, amount, tax display |
| **Region** | Which legal and compliance facts apply (US, UK, EU, UAE). | `content/regions.ts`, regional pages | Compliance text, VAT, support-hours overlap |

A German reader may use English, pay in euros and need EU rules. So language, currency and region are three independent choices with sensible defaults, not one bundle.

## The switcher (what the visitor sees)

One control in the header and footer: **"Country and currency"**. It opens a small panel with two choices.

1. **Country or region:** United States, United Kingdom, United Arab Emirates, European Union (later: Germany, France, Netherlands, Ireland), Rest of world (English, USD).
   - Choosing a country goes to that locale's URL and sets the default currency for it.
2. **Currency:** USD, GBP, EUR, AED, INR. Starts at the default for the chosen country. The visitor may override it.

| Country choice | Locale URL | Hreflang | Default currency | Tax line shown | Launch |
|---|---|---|---|---|---|
| United States and rest of world | `/` | `en-US`, `x-default` | USD | none (tax excluded) | live |
| United Kingdom | `/en-gb/` | `en-GB` | GBP | "+ VAT" | **Wave 1** |
| United Arab Emirates | `/en-ae/` | `en-AE` | AED | none | **Wave 2** |
| European Union, in English | `/en-ie/` | `en-IE` | EUR | "+ VAT" | **Wave 3** |
| Germany, France, Netherlands | `/de-de/`, `/fr-fr/`, `/nl-nl/` | `de-DE`, `fr-FR`, `nl-NL` | EUR | "+ VAT" | later |
| UAE in Arabic | `/ar-ae/` (right to left) | `ar-AE` | AED | none | later |
| [Country with currency selector only] | any | none | INR | none | offered, never forced |

**Why `en-IE` for the EU English version.** Hreflang takes a language and an optional country. There is no code for "the EU". Ireland is an EU country, English is an official language there, and it uses the euro. So the EU English locale uses `en-IE`. The page copy speaks to businesses across the EU, not only Ireland. The EU-wide landing page `/hosting/eu` stays as the region page (see "Region page versus locale page").

Behaviour rules (these follow existing decisions in `CLAUDE.md` and `docs/components/CHANGELOG.md`):

- **No automatic redirect.** `localeDetection` is off on purpose: visitors stay on the URL they asked for, which is also better for SEO.
- **A suggestion, not a switch.** If the edge country header (`CF-IPCountry`) differs from the current locale, show a small dismissible line: "Prices in pounds for the United Kingdom? Switch." The first page load still shows the page the visitor asked for.
- **Never force a conversion.** The currency changes only when the visitor chooses it, or because the visitor is on a country URL whose default currency is set.
- **The currency choice is remembered** (decided). It is stored in a first-party "preferences" cookie, only after the visitor allows that category in the consent banner. Without consent the choice lasts for the visit and the page follows the locale URL. See "Remembered currency and SEO".
- **Explicit prices only.** Each currency price is a stored value in `pricing.json`. No live exchange-rate conversion in the browser or the server. A price that is not confirmed in a currency does not render in that currency, and that currency is hidden from the selector.
- **The same plan, the same terms,** in every currency. Only the amount, the symbol and the tax line change.

### One price list everywhere (decided)

- Every country sees the same plans, the same plan names, the same terms and the same discounts. Only the currency changes. A plan costs the same in a given currency whether the visitor is in London or Dubai.
- So `pricing.json` has one list of plans. Locale pages and regional pages never add, rename or reprice a plan. Regional pages change the default currency, the tax line and the compliance text, nothing else.
- Offers, coupons and renewal terms apply in every country. A promotion is never limited to one region without a reason the owner approves.
- The same rule keeps structured data simple: one `Offer` per plan and currency, the same on every locale.

### Currency readiness test (one currency at a time)

| Check | Pass condition |
|---|---|
| Prices | Every plan, billing cycle, renewal price and addon has an explicit price in `pricing.json` and the same price in the billing system |
| Payment | Stripe or PayPal can charge in that currency for this business, and the payout currency is known (Plan 12) |
| Tax display | `pricing.currencies[code]` has its `vatDisplay` and the tax position for its main market is confirmed |
| Format | Symbol, decimals and position come from `Intl` for the locale. The currency name is shown where the symbol is ambiguous (`$` is used by many currencies) |

A currency that fails any check is not shown in the selector. With many currencies, price lists are **proposed by a script** from the USD price and a stated rounding rule, then reviewed by a person and stored as explicit values. The proposal is never applied live and never changes by itself when exchange rates move.

Currency does not change the URL or the locale. A visitor on `/en-gb/` can choose any ready currency. The server HTML still shows the locale default (see "Remembered currency and SEO").

## Which pages get a locale version (tiers)

Do not translate everything. Duplicated pages with only the currency changed hurt search results and waste review time. A page gets a locale version only if it clears the test below.

**The unique-value test.** A locale page is justified only if at least **three** of these differ for that audience: currency and tax line, spelling and wording, compliance facts, keyword and search language, support-hours overlap, payment methods, local proof, local examples.

| Tier | Pages | Treatment |
|---|---|---|
| **A: Fully localized** | Home, product pages (Plan 01), pricing, regional pages (Plan 05), service pages (Plan 06), policy pages (Plan 07) | Own keyword research, own metadata, own proof, legal review per locale. |
| **B: Translated or adapted** | Comparison pages (Plan 02), domains pages (Plan 08), about and contact | Adapt prices, spelling and links. Competitors differ by country, so check each competitor's local plans. |
| **C: English only** | Blog, knowledge base, troubleshooting (Plans 03, 04) | Stay in English. No locale copies. Hreflang is not added. Show them from every locale with a link to the English page. Translate a post only when it earns traffic in that language. |

If a Tier A or B page fails the test for a locale, that locale links to the default page instead of creating a near-duplicate.

## Language and spelling by locale

| Locale | Language | Spelling and style | Dates and numbers | Notes |
|---|---|---|---|---|
| en-US | US English | US spelling ("organization", "color") | "October 6, 2026" or "6 October 2026" | Default |
| en-GB | UK English | UK spelling ("organisation", "colour"). "Licence" is the noun and "license" is the verb | "6 October 2026" | UK terms: "VAT", "ICO" |
| en-AE | English for the UAE | UK spelling (decided) | "6 October 2026" | AED, UAE PDPL |
| en-IE | English for EU businesses | UK spelling (Irish and EU business English follow it) | "6 October 2026", 24-hour times with a timezone | EUR, "+ VAT", GDPR and the DPA, EU proof |
| ar-AE | Arabic | Modern Standard Arabic, plain wording | Western digits unless the owner decides otherwise | Right to left, Arabic font subset, phase 2 |
| de-DE, fr-FR, nl-NL | German, French, Dutch | Formal address (Sie, vous, u) | Local number formats | Phase 2 |

Rules for every locale:
- Plain wording at the same reading level. Translate meaning, not words. No idioms.
- **Native review is required** before a translated page ships. A machine translation alone does not ship.
- Never use the same sentence with only the currency changed as a "localization".
- Legal pages: the English version is the reference unless counsel decides otherwise. Translations carry a note that says so.
- Dates always use a spelled-out month. Times always carry a timezone.

## Keywords per locale

Search language differs by country ("web hosting uk" is not "web hosting us" with a flag). Each locale has its own keyword rows in [keyword-register.md](../project/keyword-register.md), with the locale in its own column. One primary keyword per URL **per locale**. Research each locale separately and never copy volumes between locales.

Examples (seeds, unvalidated): en-GB "managed wordpress hosting uk", en-AE "wordpress hosting dubai", de-DE "wordpress hosting deutschland dsgvo".

## SEO rules for locale pages

- **Hreflang:** every live locale page lists itself and every live alternate, plus `x-default` pointing to the default locale. Alternates must link both ways. Only live, indexable pages appear. Details in `docs/rules/seo-rules.md` section 4.
- **Canonical:** self-referencing in each locale. Never point en-GB at en-US.
- **Sitemap:** alternates listed per URL. Off locales are not listed.
- **JSON-LD:** `url`, `@id` and `inLanguage` use the page's own locale. Today they point at the default locale, which is a code gap (see "Known gaps"). `priceCurrency` matches the displayed currency. No price in JSON-LD while `pricesConfirmed` is false.
- **Metadata:** localized title, description and `og:locale`. Not a currency swap on the same text.
- **Never serve a locale with unconfirmed content.** The variants stay at 404 until the content, prices and regional claims are confirmed (`FEATURES.localeVariants`).

### Remembered currency and SEO (how to keep both)

A search engine crawls without cookies, so every URL must show **one currency in its HTML**, the locale's default. The remembered currency is applied after the page loads.

- Server-rendered HTML, `<title>`, meta description and JSON-LD always use the locale default (`/en-gb/` shows GBP). Crawlers, AI tools and shared links all see the same thing.
- A remembered or chosen currency changes only the visible price text in the browser. Price slots have a reserved width so nothing shifts (CLS stays under 0.1).
- The edge cache never varies by the currency cookie. One cached copy per URL keeps pages fast and avoids cache-key sprawl.
- Never put the currency in the URL as a query string for indexing. If a shareable link is needed, add `?currency=GBP`, set `noindex` through a canonical to the clean URL, and do not list it in the sitemap.
- Structured data price: the locale default only. No `priceCurrency` mismatch with visible text at crawl time.

### Region page versus locale page

`/hosting/uk` (the region page, in the default locale) and `/en-gb/hosting/uk` (the same page in the UK locale) would compete. Decided rule:

- While `localeVariants` is off, `/hosting/uk` is the UK page.
- When a locale goes live, its region page moves into that locale and the unprefixed URL redirects with a 301: `/hosting/uk` to `/en-gb/hosting/uk`, then `/hosting/uae` to `/en-ae/hosting/uae`.
- The EU keeps `/hosting/eu` as the EU-wide region page. In wave 3 `/en-ie/hosting/eu` becomes its home in the same way. `/hosting/us` stays unprefixed because en-US is the default.
- The redirect, the new canonical, the hreflang set and the sitemap entry change in one release. Never leave both URLs live.

## What each plan must add for localization

| Plan | Add per locale |
|---|---|
| 01 Money pages | Currency and VAT line from `pricing.json`; local payment methods only if verified; locale metadata |
| 02 Commercial | Competitor local prices and terms, checked per country |
| 05 Regional | The regional page is the locale's home for its keywords. Wave order: UK, UAE, EU |
| 06 Service pages | Case studies and time-zone overlap for that region |
| 07 Compliance | Policy text reviewed for the jurisdiction. Reference English is stated |
| 08 Domains | The TLD list and prices for that country first |
| 09 Brand | Local review profiles only when real |
| 10 AI search | The FAQ in the locale's language, questions asked the way that country asks them |

## Launch checklist for a new locale

- [ ] Prices confirmed in the locale's default currency in `data/pricing.json` (every plan, renewal, addons) and `currencies[code]` has `vatDisplay`
- [ ] Tier A pages written, natively reviewed and legally reviewed
- [ ] Keyword rows for the locale validated in the register
- [ ] `messages/<locale>.json` translated (switcher, consent banner, 404, skip link)
- [ ] Hreflang, canonical, sitemap and JSON-LD checked on a production build
- [ ] Right-to-left layout checked for Arabic (logical CSS, Arabic font subset)
- [ ] Support hours for the region stated only from a verified claim
- [ ] `FEATURES.localeVariants` and `FEATURES.currencySelector` turned on together, in one reviewed change
- [ ] Search Console property and country targeting set up, review after 28 days

## Known gaps in the code (content cannot fix these)

| Gap | Effect on content |
|---|---|
| `pricing.json` has USD only | No GBP, EUR, AED or INR price can render |
| `FEATURES.currencySelector` is off | No selector, so currency stays USD |
| `FEATURES.localeVariants` is off | `/en-gb`, `/en-ae` return 404 |
| Page copy in `content/*.ts` is not localized | Locale pages would repeat English text |
| JSON-LD URLs point at the default locale | Wrong `url` in schema on a locale page |
| `messages/en-gb.json`, `en-ae.json` are copies of en-US | Switcher and banner text not localized |
| No `author`, `owner` or locale field in the page spec | Owner and locale are tracked in the register |
| No Arabic, German, French or Dutch locale | Phase 2 |

## Decisions (owner, 2026-10-07)

| # | Decision | Outcome |
|---|---|---|
| 1 | Launch order | UK (wave 1), then UAE (wave 2), then EU in English with euro pricing (wave 3) |
| 2 | Currency memory | Yes. Remembered in a preferences cookie after consent. Static HTML stays in the locale default currency |
| 3 | Region page versus locale page | When a locale goes live, its region page moves into that locale and the unprefixed URL redirects with a 301 (`/hosting/uk` to `/en-gb/hosting/uk`). EU keeps `/hosting/eu` as the EU-wide region page and `/en-ie/hosting/eu` follows the same pattern when wave 3 starts |
| 4 | Prices in other currencies | Explicit stored prices per plan, rounded to local price points, in `pricing.json` (edited by hand for now, synced from the billing system later). the billing system holds the same numbers (see [Plan 12](12-billing-system-integration.md)) |
| 6 | Selector currencies | **All pricing shows in every currency that passes the readiness test**, starting with USD, GBP, EUR, AED and INR, then the others the billing system already holds ("etc"). A currency joins the selector only when it passes all four checks below |
| 5 | English variants | `en-GB` for the UK, `en-AE` (UK spelling) for the UAE, `en-IE` (UK spelling) for the EU |

## Still open

1. **INR.** Offered through the selector only, never a default and no locale. Are INR prices wanted now, or after wave 3?
2. **Arabic and EU languages.** Which comes first after wave 3?
3. **Consent wording.** The "preferences" category text must name the currency memory. Needs the legal reviewer.
4. **Locale config.** `en-IE` is not in `lib/i18n/config.ts` yet. Adding it is a code task for wave 3.

## Waves

| Wave | Locale | Gate to go live (all must be true) |
|---|---|---|
| 0 | `en-US`, USD, worldwide (the default site) | Already the default. All content plans can ship here first. The currency selector and other locales wait for their own waves. No tax display change |
| 1 | `en-GB`, GBP | GBP prices confirmed in `pricing.json` and in the billing system (the manual price-check list in Plan 12). A gateway live for GBP. Tax follows the owner rule (the project tax rule in `project/PROJECT.md`). UK Tier A pages written and reviewed. UK keyword rows validated. `/hosting/uk` redirect ready. Prices flag on. Checkout hand-off works with the GBP currency |
| 2 | `en-AE`, AED | Same for AED (gateway, prices), plus UAE PDPL page reviewed and the support-hours claim verified for UAE hours |
| 3 | `en-IE`, EUR | Same for EUR, plus DPA published with the billing-system location and transfer wording, `en-IE` added to the locale config |

**Check the order against real demand.** Before wave 1, read the aggregate customer count by country from the existing billing system (Plan 12, audit). If the numbers point to a different order, tell the owner. Do not change the order on your own.

## Measure

Share of traffic and impressions by country, locale page position for local keywords, selector use (country and currency), plan clicks by currency, share of visitors who dismiss the suggestion line, bounce rate on locale pages versus the default page.
