# Project Profile: DronaHost

The facts a writer needs, in one place. **Status 2026-10-07.** Every fact has a status:

- **Confirmed**: stated by the owner.
- **Reported**: found in older project notes, not yet confirmed. Do not publish.
- **Missing**: the owner must provide it. Write nothing in its place.

Where a fact also lives in code, that file is what the website renders. If this file and the code differ, stop and ask the owner. Update both.

## 1. Identity

| Fact | Value | Status | Where the site reads it |
|---|---|---|---|
| Brand name (prose) | DronaHost | Confirmed | `content/company.ts` |
| Logo wordmark | `dronahost` (all lowercase, a deliberate design choice) | Confirmed | brand rules |
| Never write | Drona Host, DRONAHOST, Dronahost | Confirmed | `rules/content-writing-rules.md` |
| Domain | dronahost.com | Confirmed | |
| Billing and client area | my.dronahost.com (WHMCS) | Confirmed | |
| One-line description | Managed WordPress, cloud and VPS hosting, plus web design and SEO | Draft | `content/company.ts` |
| Owner and final approver | Sandipan Das | Confirmed | |

## 2. Company details (the owner provides; nothing here may be guessed)

| Fact | Value | Status |
|---|---|---|
| Registered legal entity name | **MISSING.** Older notes mention "Alphabet Force" | Reported, unconfirmed |
| Country of registration | India | Confirmed |
| Company registration number | **MISSING** | Missing |
| Registered business address | **MISSING** (India is fine to show, never a made-up US or UK address) | Missing |
| Public support email | **MISSING.** Older notes show both hello@ and sales@ | Reported, unconfirmed |
| Phone | **MISSING.** No phone number is shown unless a person answers it in English | Missing |
| WhatsApp, live chat, phone support | Not offered. The site must not mention them. Support channels are **ticket and email** | Confirmed 2026-10-07 |
| Content roles | Claude drafts. The owner edits and approves. No other writer or editor is named | Confirmed 2026-10-07 |
| Legal reviewer | **NONE appointed.** Claude may draft. A qualified human must review Tier B documents (see `plans/07`) | Open, blocks Tier B pages |
| Founding year | Owner says about 7 years of trading. Older notes show 2019 and 2022 | Reported, unconfirmed |
| Indian GST number | Registered. Number **MISSING**. Show publicly only if the owner wants | Confirmed (registered), number missing |
| VAT registration outside India | None | Confirmed |
| "TAD" | Unknown. Do not use | Closed |
| Social profiles (LinkedIn, X, and others) | **MISSING.** Only real, owned profiles | Missing |
| Team: names, roles, photos, LinkedIn | **MISSING.** Real people only | Missing |
| Customer counts, awards, review scores | **MISSING.** Only with evidence on file | Missing |

When a missing fact is given, add it to `content/company.ts` (rendering) and to this table (briefing).

## 3. What the business is

- A focused team serving small-business owners, freelancers and agencies worldwide. Where the team is based is a fact for `/about` only (decision 34): no other page says it.
- **Owns no servers or data centres.** Buys servers from AWS, Google Cloud, DigitalOcean, Hetzner and similar providers, in various locations, and resells hosting on them. There is no fixed provider per city or plan.
- Billing runs on WHMCS on a server in Europe (provider and country to be recorded).
- Payments: Stripe (cards) and PayPal. Nothing else is shown as accepted until it is live.
- Years of trading with existing customers in many countries and several currencies.

**What the copy may and may not say about this**
- Say: "a focused team" (never where it is based, except on `/about`), "runs on infrastructure from leading cloud providers", "for UK businesses".
- Do not say: "our data centre", "our servers", "UK servers", "powered by [provider]", "partner of [provider]".
- Name the cloud providers only in the sub-processor list, the DPA and the privacy policy.
- A city is named only if the infrastructure registry (to be built) confirms it for that plan.
- Never target "near me" queries. Never claim a local office or phone line.

## 4. Services and products

| Service | Page | Data behind it today | May state |
|---|---|---|---|
| WordPress hosting | `/wordpress-hosting` | `data/pricing.json`: Starter, Growth, Pro | Plans and limits as confirmed. Prices hidden until confirmed |
| Business hosting | `/business-hosting` | `data/pricing.json`, family "web": Essential, Plus (cPanel, unmanaged, any site type). **Confirmed by the owner, 2026-10-07** | Plans and limits as confirmed. Never call it managed or WordPress-specific. Email is not included. Prices hidden until confirmed |
| VPS hosting | `/vps-hosting` | None yet. Owner will add plans to `pricing.json` | "Talk to the team" |
| Cloud hosting | `/cloud-hosting` | None yet. Same | "Talk to the team" |
| Migration service | `/migration` | Request form exists. Terms page planned (`/migration-terms`) | Process only until the terms page is published (Plan 14) |
| Email | `/email` | Planned. Email hosting is discontinued | "Email is not hosted on DronaHost servers." Points to Google Workspace or premium email. Provider for premium email to be named by the owner (Plan 14) |
| Domain registration | `/domains` | None. Prices will sync from WHMCS later | Describe the service. No price |
| Website design | `/web-design` | Scoped per project | No price. No ranking promises |
| SEO services | `/seo-services` | Scoped per project | No ranking promises |
| Custom development (React, Next.js) | planned | Scoped per project | Real examples only |
| Website maintenance (maintenance, management, WooCommerce, WordPress, support and helpdesk) | planned, see Plan 06 | Plan to be added to `pricing.json` later. Scope sheet not filled | Drafts only. No inclusions, times or prices |

## 5. Audience and markets

- Educated small-business owners, freelancers and agencies who read English as a first or second language. Smart, not always technical, compare providers, distrust hype.
- Writing level: plain international English, US spelling by default, about grade 8 to 10, no idioms.
- Priority markets: USA, United Kingdom, United Arab Emirates, European Union. Everyone else is welcome, India included.
- Launch order for other countries: UK, then UAE, then EU in English (see `later/`). Today the site is English and USD.

## 6. Prices, tax and currency

- **Prices come only from `data/pricing.json`.** Every country sees the same plans and prices. Only the currency changes.
- Currencies: USD today. GBP, EUR, AED, INR and others join when each passes the readiness test in `later/11-...`.
- **Tax:** customers in India pay GST. Everyone else pays no tax. Pages show one line: "Prices exclude tax. Customers in India pay GST at checkout." Never "+ VAT" or "VAT included".
- **Risk note (review, 2026-10-07):** the one-line tax rule may not fit UK and EU consumers. See Plan 07, "Tax and consumer price display". Ask a tax adviser before selling actively there.
- Renewal price equals the signup price (owner decision). The promise wording renders only while its claim renders.
- Domain prices: sync from WHMCS later. None until then.
- `pricing.json` is marked "needs owner confirmation". Its `confirmBeforeLaunch` list is the open work.

## 7. Claims (what may be promised)

A claim renders only when it is verified **and** its terms page is published. The source is `content/claims.ts`. Do not copy claim wording into this file or into copy by hand.

| Claim | Status on 2026-10-07 |
|---|---|
| 30-day money-back guarantee | Owner-approved and published 2026-10-08 (`/refund-policy`). Renders |
| 24/7 support | Owner-approved 2026-10-08, reworded 2026-10-09 (decision 36): ticket and email, any hour. No reply time is promised. Terms page `/support-policy` |
| Free migration | Owner-approved and published 2026-10-08 (`/migration-terms`): free on every package, one website per package, up to 10 on a VPS. Renders |
| Renewal price equals signup price | Owner-approved and published 2026-10-08 (`/pricing-policy`): hosting price does not change on renewal. Renders. Terms of Service must not say prices can change at any time |
| Uptime SLA, response times, founding year, free SSL, CDN, features | Unverified. Never render |

## 8. Where facts come from (sources of truth)

| Kind of fact | Source |
|---|---|
| Plans, prices, limits, add-ons | `data/pricing.json` (through `lib/pricing`) |
| Guarantees, SLA, support, features | `content/claims.ts` |
| Company details, contacts | `content/company.ts` |
| Trust badges, logos, reviews | `content/trust.ts`, `lib/content/reviews.ts` |
| Regional compliance facts | `content/regions.ts` |
| Server locations | infrastructure registry (to be built, `content/infrastructure.ts`) |
| Locale and currency settings | `lib/i18n/config.ts`, `lib/flags.ts` |
| Which features are live | `lib/flags.ts` |
| Placeholders still to replace | `docs/reference/PLACEHOLDERS.md` |

## 9. Tools and systems

| System | Use |
|---|---|
| Site | Next.js, English now. `/checkout` hands off to my.dronahost.com |
| Billing | WHMCS at my.dronahost.com. Domain search uses the WHMCS API behind a flag |
| Payments | Stripe, PayPal |
| Email sender | Amazon SES in the code. Business email is not hosted by DronaHost |
| Analytics | Cookieless (Plausible or Fathom) preferred. Consent banner required for anything else |

## 10. Brand and voice pointers

- Voice: confident, specific, calm. Write like Fathom Analytics, Kinsta, Basecamp. Never like a hype reseller.
- Full rules: `rules/content-writing-rules.md`. Sentence examples: `rules/voice.md`.
- Visual and logo rules: `docs/rules/brand-identity.md`, `docs/rules/ui-ux-rules.md`.

## 11. Missing facts checklist (owner)

- [ ] Legal entity name, registration number, registered address
- [ ] Public support email and, if any, phone
- [ ] Founding year
- [ ] GST number: public or private
- [ ] Team names, roles, photos and LinkedIn links
- [ ] Social profiles
- [x] What Business Hosting is: the Web hosting plans (Essential, Plus), no email (owner, 2026-10-07)
- [ ] A named human legal reviewer, or a legal-document service, for Tier B documents
- [ ] What "24/7 support" means with ticket and email only
- [ ] How long "renewal equals signup price" lasts
- [ ] The premium email provider named on `/email`
- [ ] Old-site products and pages: reseller hosting, serverless solutions, SSL and SiteLock certificates, affiliate program, careers, offers, brand assets: keep, merge or drop? (see `url-inventory.md`)
- [ ] VPS and cloud plans and prices in `pricing.json`
- [ ] Maintenance service sheet (Plan 06) and price
- [ ] Which `confirmBeforeLaunch` items in `pricing.json` are real
- [ ] WHMCS server provider and country
- [ ] Server list for the infrastructure registry
- [ ] Stripe and PayPal currencies and payout details
