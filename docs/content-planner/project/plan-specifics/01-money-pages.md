# Project specifics: Plan 01 Money Pages

Core plan: [../../plans/01-money-pages.md](../../plans/01-money-pages.md). Original wording is kept below, under the plan section it belongs to.

## Pages (table row note)

Business hosting row, primary keyword cell: "business web hosting (see "Products and their data": email is not part of it today)".

## Segment pages (removed row)

| Segment | Seed keyword | Condition to publish |
|---|---|---|
| (removed) Business email | `pricing.json` says email hosting is discontinued, so no email keyword is targeted until the owner says otherwise | n/a |

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

## Page template, block 3 (Plans): tax line

The tax line is "Prices exclude tax. Customers in India pay GST at checkout."

## Page template: exclusions

**Email is not hosted by DronaHost.** Product pages say so once, in plain words, and link to `/email`. Never imply a mailbox comes with a plan.

## Keyword placement: entity sentence

First 100 words: the entity is named as "DronaHost is a hosting and web agency ...".

## Copy formulas: CTA gate

While `FEATURES.pricesConfirmed` and `FEATURES.checkout` are not both on, the button goes to `/contact` and reads "Talk to the team about [Plan Name]", and the price block shows "Price on request" in production.
