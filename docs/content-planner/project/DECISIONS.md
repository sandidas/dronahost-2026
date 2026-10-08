# Owner Decisions for Content

Decisions that shape what is written. Do not reopen without the owner. Date format: year-month-day. All entries below were made by the owner on 2026-10-07 unless noted. Entries 24, 25 and 27 came from the 2026-10-07 review and were applied with the owner's approval of the fixes. Design and UI decisions are in `docs/DECISIONS.md`.

| # | Area | Decision |
|---|---|---|
| 1 | Prices | All service prices live in `data/pricing.json`. Edited by hand for now. Later a reviewed pull request refreshes them from WHMCS. Never fetched at render time |
| 2 | Plans | One plan list and one price list for every country. Only the currency changes. No regional plans or discounts |
| 3 | Tax | Customers in India pay GST. Everyone else pays no tax. One plain line near prices. No "+ VAT" or "VAT included" |
| 4 | Currencies | Every currency that passes the readiness test is shown, starting with USD, GBP, EUR, AED and INR. Prices are explicit stored values, never live conversion |
| 5 | Currency memory | A visitor's currency choice is remembered in a preferences cookie after consent. The server HTML always shows the locale default currency |
| 6 | Country launch order | UK (`en-GB`, GBP), then UAE (`en-AE`, AED), then EU in English (`en-IE`, EUR). UK spelling for all three. US and the rest of the world stay on the default |
| 7 | Region pages | When a locale goes live, its region page moves into it and the old URL redirects (301). The EU keeps `/hosting/eu` as the EU-wide page |
| 8 | Now vs later | The default USD site ships first. Extra countries, currency switching and billing automation are parked in `later/` |
| 9 | Billing | WHMCS at my.dronahost.com on a server in Europe. Checkout is hybrid: start with a hand-off from `/checkout` to the WHMCS cart with plan, cycle and currency filled in. Do more in the app only when safe. Cart and client area are `noindex` |
| 10 | Gateways | Stripe and PayPal. A payment method appears in copy only when it is live |
| 11 | Business | Registered in India. Indian GST only. No VAT registration elsewhere. No tax adviser appointed yet |
| 12 | Infrastructure | No owned servers. Servers are bought from AWS, Google Cloud, DigitalOcean, Hetzner and others and hosting is resold on them, with no fixed provider per city. Location claims are off by default. A city appears only if an infrastructure registry confirms it for that plan |
| 13 | Provider names | Not on marketing pages. Named in the sub-processor list, the DPA and the privacy policy |
| 14 | Domains | Domain prices will sync from WHMCS later. None until then |
| 15 | Maintenance | The service exists (maintenance, management, WooCommerce, WordPress, support and helpdesk). Its plan and price are added to `pricing.json` later. Pages are drafts until the service sheet is filled |
| 16 | Business hosting | **Confirmed 2026-10-07:** the "Web hosting" plans (Essential, Plus) in `pricing.json`. Unmanaged cPanel hosting for any site. Email hosting is discontinued |
| 17 | AI use | The editorial policy page, "Written by / Reviewed by" bylines and an "AI-assisted" line on AI-drafted guides are accepted |
| 18 | Human first | A person fills the brief before any AI draft. AI is never used for testimonials, reviews, team bios, case-study results or unreviewed legal text |
| 19 | Headlines | One reason-led "because" headline on money, service, regional and landing pages, with a fallback. Not on guides or policy pages |
| 20 | Tools and tables | Interactive tools and service-vs-service tables follow rules sections 9 and 10. The first tools are the billing toggle and a plan finder |
| 21 | Simplicity | Keep it simple. The first work is the Tier A policy pages (they unlock the claims), then the money pages on the default USD site (updated 2026-10-07, see 27) |
| 22 | Support channels | WhatsApp, live chat and phone are not offered. Support is by ticket and email only. The site, `pricing.json` and schema must not mention the others (owner, 2026-10-07) |
| 23 | Content roles | Claude drafts, the owner edits and approves. No other writer, editor or legal reviewer is named (owner, 2026-10-07) |
| 24 | Policy tiers | Tier A commercial promises (refund, support, migration, pricing and renewal, fair use, backup, security, SLA) are approved by the owner. Tier B legal documents (terms, privacy, cookies, DPA, sub-processors, acceptable use, retention, regional compliance) need a qualified human reviewer and stay drafts until then. Proposed in the 2026-10-07 review and applied with the fixes. The owner may reopen |
| 25 | CTA labels | Plan cards read "Choose [plan]". Product page heroes read "See [product] plans". The price sits above the button, never inside the label. "Get started" stays banned. Aligned with the shipped code and design rules (2026-10-07 review) |
| 26 | Email | Email is not hosted by DronaHost. `/email` explains the options (Google Workspace or premium email). Existing email customers get a dated notice and a move guide (Plan 14) |
| 27 | Build order | Tier A policy pages, then core money pages, trust pages, services, comparisons, guides, regional locales (see `roadmap.md`). Proposed in the 2026-10-07 review and applied with the fixes |
| 28 | Off-site tracking | Plan 15 has no rows in the keyword register. Off-site work is tracked in `roadmap.md` (owner, 2026-10-09) |
| 29 | FAQ limits | FAQ item counts are set per archetype in the config: money and pricing pages 6 to 8, guides and brand pages 4 to 6 (owner, 2026-10-09) |
| 30 | Spec file | `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md` stays in `docs/reference/` with a "superseded, kept for history" note (owner, 2026-10-09) |
| 31 | Home, About and Trust pages | The home page (`product` archetype) is a money page: 6 to 8 FAQ items, and 7 is fine. About and Trust pages are the brand archetype: 4 to 6 (owner, 2026-10-09) |
| 32 | Interview banks | The interview questions for regional (Plan 05), policy (07), domain (08), brand and trust (09) and off-site (15) pages are the owner's exact wording, asked one at a time, answers recorded word for word, "none" drops the section (owner, 2026-10-09) |
| 33 | Reuse proof in CI | `npm run test:reuse` runs on ubuntu-latest and windows-latest in CI (owner, 2026-10-09) |

## Open (waiting on the owner)

See "Missing facts checklist" in `PROJECT.md`.
