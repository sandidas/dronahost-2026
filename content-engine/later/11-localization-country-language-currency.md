# Plan 11: Localization (country, language and currency switching)

**Intent served:** the same search intents as every on-site plan (01-10, 14), in the reader's country, language and currency.
**Goal:** a visitor picks a country once and sees the right language, the right currency, the right tax line and the right rules. Search engines see one clean page per locale.
**Not a separate set of pages.** This plan decides *how every other plan is repeated per locale*, and which pages are worth repeating. It is the content side and does not change code.

This file is the reusable outline. The facts, owner decisions, feature flags, launch waves and known code gaps for this project are in the project copy, `project/later/11-localization-country-language-currency.md` (a project creates it when it reaches localization work).

## 1. Three separate things (never mix them)

| Concept | What it is | Where it lives | Changes |
|---|---|---|---|
| **Locale** | Language plus regional wording and formats. One URL per locale (`/[locale]/...`) | The host's locale config and message files | Page text, spelling, date and number formats, hreflang |
| **Currency** | How prices are displayed. Never changes the plan or the terms | The pricing file (currencies and per-plan price maps) | Symbol and amount |
| **Region** | Which legal and compliance facts apply | The regions registry, regional pages | Compliance text, tax position, support-hours overlap |

A reader may use English, pay in euros and need EU rules. Language, currency and region are three independent choices with sensible defaults, not one bundle.

## 2. The switcher (what the visitor sees)

One control in the header and footer, "Country and currency", with two choices: country or region (which goes to that locale's URL and sets its default currency) and currency (starts at the country's default; the visitor may override it).

For each country choice, the project copy records: locale URL, hreflang code, default currency, tax line shown, and launch wave.

| Column | Rule |
|---|---|
| Hreflang | A language plus an optional country. There is no code for a group of countries; pick one member country that uses the language and the currency, and say why in the project copy |
| Tax line shown | The project tax line (`pricing.taxLine` in `project/settings.json`). Never a tax wording the project's tax rule does not allow |
| Launch | Each locale goes live in its own wave, behind its own gate |

## 3. Behavior rules

- **No automatic redirect.** Visitors stay on the URL they asked for.
- **A suggestion, not a switch.** If the visitor's country differs from the current locale, show a small dismissible line. The first page load still shows the page the visitor asked for.
- **Never force a conversion.** The currency changes only when the visitor chooses it, or because they are on a country URL with a set default.
- **Remembered currency needs consent.** Store it in a first-party preferences cookie only after the visitor allows that category.
- **Explicit prices only.** Each currency price is a stored value in the pricing file. No live exchange-rate conversion. A price not confirmed in a currency does not render, and that currency is hidden from the selector.
- **One price list everywhere.** Every country sees the same plans, names, terms and offers. Locale and regional pages never add, rename or reprice a plan. One `Offer` per plan and currency.

## 4. Currency readiness test (one currency at a time)

| Check | Pass condition |
|---|---|
| Prices | Every plan, billing cycle, renewal price and add-on has an explicit price in the pricing file and the same price in the billing system |
| Payment | A gateway can charge in that currency for this business, and the payout currency is known (Plan 12) |
| Tax display | The project tax line applies to that market, and the tax position for its main market is confirmed |
| Format | Symbol, decimals and position come from `Intl` for the locale. The currency name is shown where the symbol is ambiguous |

A currency that fails any check is not shown. A script may propose prices from the default currency and a stated rounding rule; a person reviews them and stores them as explicit values. The proposal never applies itself.

## 5. Which pages get a locale version (tiers)

**The unique-value test.** A locale page is justified only if at least **three** of these differ for that audience: currency and tax line, spelling and wording, compliance facts, keyword and search language, support-hours overlap, payment methods, local proof, local examples.

| Tier | Pages | Treatment |
|---|---|---|
| **A: Fully localized** | Home, money pages (Plan 01), pricing, regional (05), services (06), policies (07) | Own keyword research, metadata and proof. Legal review per locale |
| **B: Adapted** | Comparisons (02), domains (08), about and contact | Adapt prices, spelling and links. Check each competitor's local plans |
| **C: Default language only** | Guides and fixes (03, 04) | No locale copies and no hreflang. Translate a post only when it earns traffic in that language |

A page that fails the test for a locale links to the default page instead of creating a near-duplicate.

## 6. Language and spelling by locale

For each locale the project copy records: language, spelling variant, date and number format, and notes. Rules for every locale:

- Plain wording at the same reading level. Translate meaning, not words. No idioms.
- **Native review is required** before a translated page ships. A machine translation alone does not ship.
- Never use the same sentence with only the currency changed as a "localization".
- Legal pages: the default-language version is the reference unless counsel decides otherwise. Translations say so.
- Dates use a spelled-out month. Times carry a timezone.

## 7. Keywords per locale

Each locale has its own keyword rows in the register, with the locale in its own column. One primary keyword per URL **per locale**. Research each locale separately and never copy volumes between locales.

## 8. SEO rules for locale pages

- **Hreflang:** every live locale page lists itself and every live alternate, plus `x-default`. Alternates link both ways. Only live, indexable pages appear.
- **Canonical:** self-referencing in each locale.
- **Sitemap:** alternates listed per URL. Off locales are not listed.
- **JSON-LD:** `url`, `@id` and `inLanguage` use the page's own locale. `priceCurrency` matches the displayed currency. No price while prices are unconfirmed.
- **Metadata:** localized title, description and `og:locale`.
- **Never serve a locale with unconfirmed content.** It stays off until its content, prices and regional claims are confirmed.

### Remembered currency and SEO

- Server HTML, title, description and JSON-LD always use the locale default currency. A remembered currency changes only the visible price text in the browser, in a slot with reserved width (no layout shift).
- The edge cache never varies by the currency cookie.
- A shareable `?currency=` link is canonical to the clean URL and not in the sitemap.

### Region page versus locale page

A region page in the default locale and the same page in a regional locale would compete. Decide one rule and record it in the project copy: when a locale goes live, its region page moves into that locale and the old URL redirects with a 301. The redirect, canonical, hreflang set and sitemap entry change in one release. Never leave both URLs live.

## 9. What each plan must add per locale

| Plan | Add per locale |
|---|---|
| 01 Money pages | Currency from the pricing file and the project tax line; local payment methods only if verified; locale metadata |
| 02 Comparisons | Competitor local prices and terms, checked per country |
| 05 Regional | The regional page is the locale's home for its keywords |
| 06 Services | Case studies and time-zone overlap for that region |
| 07 Compliance | Policy text reviewed for the jurisdiction. The reference language is stated |
| 08 Domains | The TLD list and prices for that country first |
| 09 Brand | Local review profiles only when real |
| 10 AI search | The FAQ in the locale's language, asked the way that country asks |
| 14 Migration and email | The setup guides' links and examples for that locale |

## 10. Launch checklist for a new locale

- [ ] Prices confirmed in the locale's default currency in the pricing file (every plan, renewal, add-on) and in the billing system
- [ ] Tier A pages written, natively reviewed and legally reviewed
- [ ] Keyword rows for the locale validated in the register
- [ ] Locale messages translated (switcher, consent banner, 404, skip link)
- [ ] Hreflang, canonical, sitemap and JSON-LD checked on a production build
- [ ] Right-to-left layout checked where the language needs it
- [ ] Support hours for the region stated only from a verified claim
- [ ] The locale and currency feature flags turned on together, in one reviewed change
- [ ] Search Console property set up, review after 28 days

## 11. Sections the project copy fills in

| # | Section | What to record |
|---|---|---|
| 1 | Country table | Locale URL, hreflang, default currency, tax line, launch wave per country |
| 2 | Decisions | Owner decisions with dates (launch order, currency memory, region vs locale, price rounding, English variants, selector currencies) |
| 3 | Still open | Questions waiting for the owner or a reviewer |
| 4 | Waves | The gate for each wave, all of which must be true |
| 5 | Known code gaps | What the code cannot do yet, and the effect on content |
| 6 | Demand check | Customer counts by country from the billing system, read before wave 1 |

## Measure

Share of traffic and impressions by country, locale page position for local keywords, selector use (country and currency), plan clicks by currency, share of visitors who dismiss the suggestion line, bounce rate on locale pages versus the default page.
