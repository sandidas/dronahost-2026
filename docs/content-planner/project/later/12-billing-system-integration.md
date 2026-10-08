# Plan 12: WHMCS Data and Automation

**Purpose:** decide what WHMCS owns, what the website owns, how the two stay in agreement, and which content and SEO tasks WHMCS can automate.
**Not an intent plan.** It supports Plans 01, 05, 08 and 11 and is the content side of the billing integration. It does not change code.

> Revised 2026-10-07: no accountant yet, "TAD" dropped, servers are bought from several providers with no fixed provider per city, hosting is resold on them.
>
> Revised 2026-10-07 with the owner's answers on infrastructure (rented from AWS, Google Cloud, DigitalOcean, Hetzner and others), gateways (Stripe and PayPal), tax (Indian GST), currencies (all ready currencies show), event hooks (accepted) and the five existing currency products (confirmed).
>
> Revised 2026-10-07 with the owner's answers (pricing source, EU-hosted WHMCS at `my.dronahost.com`, India-registered business, PayPal and Stripe, hybrid checkout, existing multi-currency WHMCS).
>
> Revised 2026-10-07. Today the repo has a minimal server-only client (`lib/whmcs/client.ts`) that calls `DomainWhois`, a route `/api/domains/search`, and the flag `FEATURES.domainSearch` (off). Everything else below is a plan. **Check every API action name and parameter against the API reference for your installed WHMCS version before building.** Names here come from the standard WHMCS API and may differ by version.

## Who owns what

| Data | System of record | Website role | Why |
|---|---|---|---|
| Plan price in each currency, renewal price, VAT display | **`data/pricing.json`** (the only file the site reads, per `CLAUDE.md`) | Renders it | One place for copy, metadata and JSON-LD. **For now it is edited by hand.** Later it is refreshed from WHMCS by a reviewed sync (see "Price sync, now and later") |
| What the customer is actually charged | **WHMCS** (product pricing per currency) | Never renders it directly | Billing must be correct to the cent |
| Agreement between the two | Now: a **manual check** before any price is published. Later: the sync itself, plus a **drift check** that fails loudly | Blocks publishing a price that billing does not match | A wrong displayed price is a legal and trust problem |
| Customers, orders, invoices, tax, payments | **WHMCS** | Holds a reference only, no copy of personal data | Fewer copies of personal data, simpler GDPR |
| Domains and TLD prices | **WHMCS** (registrar module and TLD pricing) | Shows cached values with a fetch date | Prices change, the registrar is the truth |
| Server and region assignment | **WHMCS** server groups | Describes it in copy only after verification | A claim about a location must match real servers |
| Support tickets | **WHMCS** (or the chosen helpdesk) | Contact form feeds it | One inbox |
| Claims, guarantees, SLA wording | `content/claims.ts` and policy pages | Renders only verified items | WHMCS does not decide claims |

**Rule:** the website never invents a price. WHMCS and `pricing.json` must agree. A person approves any price change before it is published. The site never reads WHMCS at page-render time for plan prices, so a WHMCS outage cannot change or break a price on a page.

## Price sync, now and later

| Stage | How `pricing.json` changes | Safeguard |
|---|---|---|
| **Now** | By hand, in one reviewed change, with `_meta.lastUpdated` updated | The price-check list below, done by a person, before merge |
| **Later (sync)** | A script reads WHMCS (`GetProducts` and `GetCurrencies`) and **writes a proposed `pricing.json` change as a pull request**. A person reviews and merges | The site still reads only `pricing.json`. No price is fetched at render time. Every change has a diff, a reviewer and a date |
| **Always** | A read-only drift check compares the two and fails if they differ | Catches a price changed in only one place |

This keeps the `CLAUDE.md` rule (one price file, never duplicated) while WHMCS becomes the place prices are edited. Build the sync only after the product map and the audit below exist.

**Manual price-check list (now).** Before any price is published or changed:
- [ ] The plan, cycle and currency in `pricing.json` match the WHMCS product for each currency
- [ ] The renewal price matches WHMCS
- [ ] The VAT display for the currency is right
- [ ] `_meta.lastUpdated` is changed
- [ ] The gateway for that currency is live and tested

## Existing WHMCS audit (do before the product map)

The business has traded for years, so WHMCS already holds a catalogue, currencies, tax rules and customers. The new website plans (Starter, Growth, Pro, Essential, Plus in `pricing.json`) may not match the products that exist today. An audit decides what maps, what is new and what is legacy.

| Audit item | Question | Used by |
|---|---|---|
| Products and groups | Which current WHMCS products match which `pricing.json` plans? Which are legacy or hidden? | Product map, Plan 01 |
| Legacy prices | Do existing customers pay different prices? Are older plans grandfathered? | The "renewal equals signup price" claim, which is true only for the plans and customers it covers |
| Currencies | Which currencies are active, and which have real customers? The site offers USD, GBP, EUR, AED and INR. The others stay in WHMCS for existing customers | Selector list, Plan 11 |
| Currency IDs | WHMCS refers to a currency by ID. Record the ID for each of the five | Checkout hand-off |
| Exchange-rate automation | Is automatic rate updating on for product prices? Turn it off for the five site currencies | Price stability |
| Tax rules | UK, EU and other VAT rules, VAT number field, reverse charge, India GST handling. **Also: what does WHMCS charge UK, EU and UAE customers today?** Seven years of customers means a current practice already exists. Export the current tax settings and the aggregate customers by country for the adviser | Waves 1 to 3, tax adviser |
| Servers | Server list: name, hostname, group, location, provider, which products use each group, whether customers can pick a group at order time | Infrastructure registry, Plan 05 |
| Gateways | Which gateway handles which currency? Payout currency? | Payment lines in copy |
| Customers by country | How many customers are in each country, in aggregate? | **Checks the wave order** (UK, UAE, EU) against real demand, and the region pages |
| Domains | TLD list, registrar modules, cost and price per TLD and currency | Plan 08 |
| Server groups | Which servers serve which regions? | Plan 05 claims, only after verification |
| Existing hooks and custom modules | What already runs on this installation? | Event automations |

**Evidence for claims (A12).** WHMCS holds real evidence for claims the site cannot make yet: how long the company has billed customers, the number of customers (in aggregate), the countries they are in. The owner may use it to verify `founded` and a customer-count claim. Counts are exported by a person as aggregates, reviewed, and entered in `content/claims.ts` with the date. No personal data leaves WHMCS, and nothing is rendered automatically.

## WHMCS setup needed for the launch waves

These are configuration tasks in WHMCS. The content plans depend on them.

| Setup | Needed for | Notes |
|---|---|---|
| Currencies: USD, GBP, AED, EUR, INR | Plan 11 waves | Set each product's price in each currency by hand. **Turn off automatic exchange-rate updates for product pricing** so a currency fluctuation never changes a published price |
| Product group per family, product per plan | Pricing, checkout | Keep a map from `pricing.json` plan id to WHMCS product id in one data file (`data/whmcs-products.json`, planned). The map is one to one and the same for every country and currency. Only the currency id changes |
| Tax rules | Wave 1 (UK VAT), wave 3 (EU VAT) | UK VAT and EU VAT by customer country. VAT number field and reverse charge for EU business customers. Confirm with an accountant |
| Server groups by region | Plan 05 | Used to assign accounts by region. Do not name a location in copy until verified |
| Payment gateways | Plan 01 and 05 payment lines | A method appears in `ACCEPTED_PAYMENT_METHODS` only when its gateway is live and tested |
| Domain registrar module and TLD list | Plan 08 | Matches the TLDs we publish pages for |
| Order form and client area on **`my.dronahost.com`** (decided) | Checkout, login | `noindex` on the cart, client area and all pages except the login page, which may be indexed so existing customers find it. Same logo, name and policy links as the main site |
| API role limited to what each job needs | Security | Separate roles for domain lookup, price read, order creation. Never one all-powerful key |
| WHMCS hosting location | GDPR | Decided: a server in Europe. The exact country and provider are still to be recorded. Until then, copy says nothing specific about it (see "Data location and transfers") |

## Automations (what WHMCS can do for content and search)

| # | Automation | WHMCS source | What it does | Phase |
|---|---|---|---|---|
| A1 | **Price drift check** | `GetProducts`, `GetCurrencies` | Compares every plan, cycle and currency with `pricing.json`. Fails a nightly CI job and a pre-publish check on any mismatch. Never writes. Optional now (manual list instead), required once the sync exists | 2 |
| A1b | **Price sync** | `GetProducts`, `GetCurrencies` | Creates a pull request that updates `pricing.json` from WHMCS. A person reviews and merges. Build after the audit and the product map | later |
| A2 | **Currency readiness check** | `GetCurrencies`, `GetProducts` | A currency appears in the selector and a locale can go live only when every plan has a price in it in both systems | 1 |
| A3 | **Live domain search** | `DomainWhois` (exists) | Availability on `/domains` and TLD pages, server-side, rate limited, no price guessing | 1 |
| A4 | **TLD price table** | `GetTLDPricing` | Cached hourly. Shows registration, renewal and transfer for the TLDs we sell, with the ICANN fee shown where required, and a "prices checked on [date]" line | 2 |
| A5 | **Hand-off to checkout** | WHMCS order form | The plan button goes to `my.dronahost.com` with the plan's product id, billing cycle and currency. The cart shows the same price (see "Checkout: hybrid") | 1 |
| A6 | **Order and account events to our server** | Action hooks in WHMCS posting to a signed endpoint | Events: order placed, invoice paid, account created, service suspended. Used to fire analytics conversion events, send the welcome email and keep status in sync | 2 |
| A7 | **Provisioning status** | Service status from WHMCS | Shows "being set up" and "ready" in the account area | 2 |
| A8 | **Support ticket creation** | `OpenTicket` | The contact and consultation forms create a ticket, so nothing lives only in email | 2 |
| A9 | **GDPR requests** | `GetClientsDetails` and related | Export and deletion requests in the account area call WHMCS. Deletion follows the soft-delete and tax-retention rules | 3 |
| A10 | **Content freshness signals** | Price or TLD change detected | Revalidates the affected pages, updates `dateModified` and the sitemap `lastmod`, and pings IndexNow (see [Plan 13](../../later/13-search-and-ai-delivery-standard.md)) | 2 |
| A12 | **Claim evidence report** | Aggregate counts only | A person exports and reviews counts of years billed, customers and countries for claim verification | 1 |
| A11 | **Status and SLA data** | Monitoring, not WHMCS | Not a WHMCS job. Listed to avoid mixing it in | later |

### Rules for every automation

- **Server side only.** The browser never calls WHMCS and never sees the identifier or secret. All calls go through `lib/whmcs/`.
- **Least privilege.** One API role per job. Rotate keys. Restrict by IP where WHMCS allows it.
- **Timeouts and fallbacks.** The existing client uses a 10 second timeout. A failure never breaks a marketing page. Pages render from `pricing.json` and cached data, and the live piece shows a plain message.
- **Cache and label.** Domain and TLD data is cached and shows when it was fetched. Availability results are never cached for long.
- **Rate limit** every public route that reaches WHMCS (the domain search route already does).
- **No personal data in logs.** Log the action and a result code only.
- **Verify before trusting.** Events from WHMCS to our endpoints use a shared secret signature and a replay window. Reject anything unsigned.
- **Flags.** Each automation sits behind a flag in `lib/flags.ts` until tested end to end.
- **One source for the content plans.** Copy that mentions price, TLD price or availability reads from the fetched or stored data. Never typed.

## Programmatic pages (guardrails)

WHMCS makes it easy to generate many pages, such as one per TLD. That risks thin duplicate pages, which hurt the whole site.

- Create a TLD page only if it passes the test in [Plan 08](../../plans/08-domains.md): a real reason to search for that TLD, unique eligibility and use text, and the TLD is actually sold.
- Start with a short list (about 8 TLDs from the supported list in `CLAUDE.md`). Fold the rest into the table on `/domains`.
- A TLD page with only a price and a search box is thin. Add eligibility rules, who it suits, transfer notes and a real FAQ, or do not publish it. Unpublished candidates are `noindex` or not generated.
- The same guardrail applies to any page type generated from WHMCS data. Generated does not mean exempt from the plan's checklist.

## Checkout: hybrid (decided)

**Rule:** do in this application what can be done safely and well. Send the customer to `my.dronahost.com` with the cart already filled for the rest.

| Stage | What happens in this app | What happens on `my.dronahost.com` | When |
|---|---|---|---|
| **0: Hand-off** | The plan button opens an internal link such as `/checkout?plan=growth&cycle=annual&currency=GBP`. The server redirects (302) to the WHMCS cart with the mapped product id, cycle and currency | Cart, account, payment, invoice | First |
| **1: Order summary** | An on-site step confirms plan, cycle, currency, extras and a domain choice, shows the total and VAT note, then hands off the filled cart | Account and payment | Next |
| **2: Order through the API** | Collects the customer's details with consent and creates the order through the API (`AddClient`, `AddOrder`) | Customer pays the invoice on the WHMCS-hosted payment page | When tested end to end |
| **3: Payment in this app** | Only if there is a clear gain. It brings card-handling and fraud duties | n/a | Probably never |

Why this order: payment pages and gateway rules stay on a system built for them, and PayPal and Stripe work through WHMCS gateways. The risk and the PCI burden stay low. We can move a stage later without changing `pricing.json` or the URLs.

**Hand-off design**
- The internal `/checkout` URL is stable. It is the `href` already in `pricing.json`. The mapping from plan id to WHMCS product id lives in one data file (`data/whmcs-products.json`, planned), not in copy.
- `/checkout` is `Disallow` in robots, `noindex`, and never in the sitemap. It does not redirect for crawlers to a state that shows a price.
- The cart link carries plan, cycle and currency. The first cart screen shows the same price as the page. A mismatch is a bug.
- WHMCS accepts a product, billing cycle and currency in the cart link. **Verify the parameter names on your version.**
- If WHMCS is unreachable, `/checkout` shows a plain message and a link to `/contact`. It never shows a price.
- The CTA label is always "Choose [Plan Name]". The price is shown above the button, never inside the label (see README gates).

**`my.dronahost.com` and search**
- `noindex` and `Disallow` for the cart, the client area and API paths. They add nothing to search.
- The login page may be indexed with a clear title so brand searches for "dronahost login" land there.
- One analytics setup across the two hosts. The consent state follows the visitor. Conversions fire from the cart thank-you page or from an event hook (A6).
- WHMCS session cookies are strictly necessary. Anything else follows the consent banner.
- It is the last trust test before payment: same name, logo, support link, refund policy and terms links.

## Payment gateways, tax and an India-registered business

Gateways in use: **Stripe and PayPal.** The company is registered in India with Indian GST. This is a checklist, not legal or tax advice.

**Gateways**
- Payment lines in copy come from `ACCEPTED_PAYMENT_METHODS` and name only what is live: "Credit and debit cards" (through Stripe) and "PayPal". No other logo or method until it is switched on and tested. Do not write "Apple Pay", "Google Pay", "bank transfer" or "UPI" unless enabled.
- **Per currency:** confirm for each currency that Stripe and PayPal can charge it for this entity, the payout currency, and any conversion fee. A PayPal or Stripe restriction on a currency means that currency fails the readiness test in [Plan 11](../../later/11-localization-country-language-currency.md).
- Stripe Radar and PayPal's own checks handle fraud. Expect more attempts on US, UK and EU cards.
- Never store card details. Card entry stays on Stripe or PayPal pages.

**Tax (owner rule, 2026-10-07):** customers in India are charged GST. Customers everywhere else are charged no tax. This is the current practice and the site follows it.

- Pages show one line near prices: "Prices exclude tax. Customers in India pay GST at checkout." The tax follows the customer's billing country, not the currency.
- Pages never show "+ VAT" or "VAT included". The `vatDisplay` value is empty for every currency.
- WHMCS tax rules: GST for India only. No VAT rules for the UK, EU or UAE.
- Nothing here has been checked by a tax adviser. If the business later registers for VAT somewhere, this section and the price line change.
- "TAD" is not used anywhere.

## Data location, infrastructure and transfers

- **Billing data:** WHMCS is on a server in Europe. The exact provider and country are still to be recorded (they are probably one of the providers below).
- **Customer sites:** run on rented infrastructure from AWS, Google Cloud, DigitalOcean, Hetzner and similar providers, in various locations. Each plan and location is recorded in the infrastructure registry ([Plan 05](../../plans/05-regional-and-location.md)). Each WHMCS server group maps to one registry entry, so the cart, the provisioning and the page copy agree.
- **People:** the team works from India and accesses systems from there. Customer data therefore moves between the hosting location and India when the team works on accounts.
- **Copy may say** where a plan runs only from the registry, and where billing data is held only after the owner records it and the claim is verified. A sentence such as "billing data is held in Europe" starts as an unverified claim in `content/claims.ts`.
- **Never say** "our data centre", "our own servers" or "your data stays in Europe" without proof covering that data. Billing data, customer sites and backups can be in different places.
- **Privacy policy, DPA and `/sub-processors`** list WHMCS and each infrastructure and payment provider as processors, with locations and the transfer mechanism for access from India (for the EU and the UK, usually standard contractual clauses). A legal reviewer writes them ([Plan 07](../../plans/07-compliance-and-trust.md)).
- **Backups and monitoring** may sit with other providers. List them too, once known.

## Price display rules that involve WHMCS

- The price on the page comes from `pricing.json`. The cart price comes from WHMCS. A1 keeps them equal.
- VAT line per currency comes from `pricing.currencies[code].vatDisplay`. The cart adds the real VAT by customer country.
- Renewal price appears beneath the signup price, from `pricing.renewal`. WHMCS must hold the same renewal price. The "same price at renewal" promise renders only while the `renewal-price-same` claim renders **and** A1 confirms the two systems agree.
- Never show a price in a currency whose WHMCS products are not priced.

## Decisions (owner, 2026-10-07)

| # | Decision | Outcome |
|---|---|---|
| 1 | Source of price truth | `pricing.json` for now, edited by hand. Later it is refreshed from WHMCS by a reviewed pull request, never at render time |
| 2 | WHMCS hosting | A server in Europe. Country and provider to be recorded |
| 3 | Billing host | `my.dronahost.com` |
| 4 | Checkout | Hybrid. Do what is possible in this app and send the rest to `my.dronahost.com` with the cart filled. Start with the hand-off |
| 5 | Gateways | PayPal, Stripe and others. Live methods only appear in copy |
| 6 | Business | Registered in India, trading for years, with an existing multi-currency WHMCS and customers worldwide |
| 7 | Infrastructure | Rented from AWS, Google Cloud, DigitalOcean, Hetzner and others in various locations. No owned data centres. Locations in copy come from the infrastructure registry only |
| 8 | Gateways | Stripe and PayPal only for now |
| 9 | Currencies on the site | Every currency that passes the readiness test (Plan 11), starting with USD, GBP, EUR, AED and INR |
| 10 | Event hooks | A small PHP action hook on the WHMCS server is accepted. A maintainer is still to be named |
| 11 | Existing currency products | The five launch currencies already have correct products in WHMCS. Still verified once with the manual price-check list |
| 12 | Remaining recommendations | Accepted as written in this plan |
| 14 | Tax adviser | **None yet.** The tax gate has no decision maker. Appointing one is the first action before wave 1 (see "Still open") |
| 15 | Provider and city | No fixed provider per city or plan. Servers are bought from several providers and hosting is resold on them. Location copy follows the two modes in Plan 05, default "no location claim" |
| 16 | Naming providers | Not on marketing pages. Listed in the sub-processor list, the DPA and the privacy policy |
| 13 | Plans and pricing everywhere | **One plan list and one price list for every country.** The WHMCS plans are the `pricing.json` plans. Only the currency changes, never the plan, the terms or the discount. No regional plans, regional discounts or regional price levels |

## Still open

1. **Tax adviser (recommended before selling actively to consumers in the UK or EU).** None exists. The owner rule above lets Wave 0 ship, but see the risk note in Plan 07, "Tax and consumer price display". Appoint one who knows Indian GST and also cross-border digital VAT for the UK, the EU and the UAE. For example a chartered accountant with international VAT experience, or a VAT agent for those markets. Bring them: the WHMCS tax settings, customers by country (aggregate), gateways, and the wave plan. They decide for each market: register, use another route, or delay. The answer is written down.
2. **Server list export** from WHMCS (name, hostname, group, location, provider, products using it) to build the infrastructure registry and decide Mode A or Mode B in Plan 05.
3. **WHMCS server provider and country** (the billing server).
4. **Stripe and PayPal currencies:** which currencies each can charge for this entity, and where payouts land. Ask Stripe and PayPal support or check the dashboard.
5. **Legacy plans:** how older WHMCS plans that existing customers use are handled. They stay off the website unless the owner says otherwise.
6. **Hook maintainer:** who looks after the WHMCS PHP hook.
7. **Provider terms:** a person reads each provider's reseller and trademark terms and records the result.

### Until the tax adviser decides: what ships

- **Wave 0, now:** the default site in USD, worldwide. All content plans (money, comparison, guides, troubleshooting, services, compliance, domains, brand) can ship here under their own gates. This is the current business.
- **Prepared, not launched:** GBP, AED and EUR prices stay in `pricing.json` and WHMCS, but the selector and the locale pages stay off. Locale pages can be drafted offline.
- **Not changed:** existing customers are served as they are today.

## Pre-build checklist (before any WHMCS code)

- [ ] Existing WHMCS audit done (table above)
- [ ] Product and currency map written (`pricing.json` plan id to WHMCS product id, and the currency id for each of the five)
- [ ] Prices entered in every wave currency in both systems
- [ ] Tax rules agreed with an accountant
- [ ] API roles created, keys stored in `.env.local` only, never committed
- [ ] Staging WHMCS available for tests
- [ ] The manual price-check list is in use; the drift check and the sync are designed before the sync starts
- [ ] A tax adviser appointed and the written decision for each launch market on file
- [ ] Stripe and PayPal currency questions answered
- [ ] Server list exported, infrastructure registry drafted, and every WHMCS server group mapped to a registry entry (or Mode B chosen)
- [ ] Provider reseller and trademark terms read and recorded
- [ ] Privacy policy and DPA list WHMCS as a processor, with its hosting location and the transfer mechanism

## Measure

Drift check failures (target zero), checkout hand-off success, cart abandonment from each page type, domain search success rate and error rate, time from price change to refreshed page and sitemap `lastmod`.
