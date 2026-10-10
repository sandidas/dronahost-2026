# Tier A policy page briefs

Status 2026-10-07. Briefs only, no page copy yet. Per `README.md`, the owner answers the **Owner must decide** lines first. Claude then drafts from the answers. Each page unlocks a claim in `content/claims.ts` once published (set `termsPage` and the verified flag there).

Common to every page: plan `plans/07`, owner Sandipan Das, AI used for the draft: yes (disclose per `rules/content-writing-rules.md` 8.5), reviewer: owner using the Tier A checklist in Plan 07, next review date 12 months after publishing, schema `WebPage` + `BreadcrumbList`, 3+ internal links (the matching product page, `/pricing-policy` or `/refund-policy`, `/contact`). No headline "because" form on policy pages (Decision 19).

| Page | Unlocks claim | Reader's question | Owner must decide (nothing is written until answered) |
|---|---|---|---|
| `/refund-policy` (draft exists, review it) | `money-back` | "Can I get my money back, and how?" | Window start (order date or activation)? Which items are refundable (hosting only, or domains and add-ons too)? Days to pay a refund and how (original method)? Abuse exclusions? |
| `/support-policy` | `support-24-7` | "When will someone answer me?" | What does "24/7" mean with ticket and email only (tickets received 24/7, answered 24/7, or answered in set hours)? Who answers overnight? Any plan differences? Time zone used when stating hours |
| `/migration-terms` | `free-migration` | "Will you move my site, and is it free?" | How many sites per plan? Which source hosts and site types are covered? What is excluded (custom apps, very large sites)? Time promise or none? What if the move fails |
| `/pricing-policy` | `renewal-price-same` | "What will I pay next year?" | How long does "renewal equals signup price" last (forever, first renewal, or per term)? May a price rise apply to existing customers, with what notice? Billing cycles offered? Failed-payment and cancellation steps. Domains and add-ons excluded? |
| `/fair-use-policy` | plan limits | "What does 'fair' mean on my plan?" | The real resource limits per plan (CPU, memory, inodes, email send limits). Enforcement steps in order (notice, throttle, upgrade offer, suspend) and notice periods. Confirm no "unlimited" wording |
| `/backup-policy` | `backups`, `backup-retention` | "Can I restore my site?" | Real backup frequency, retention per plan, where stored (no provider names), how a customer restores, what is not guaranteed, whether an offsite add-on exists |
| `/security` | security lines | "Is my site and data safe here?" | Only facts true today: access control, update practice, backups, incident handling, breach notice. List any certification actually held (none unless proven). Name no tool you do not run |
| `/sla` | `uptime-sla` | "What uptime do you promise?" | **Only if an SLA exists.** Percentage, how it is measured, credits, exclusions. If none, do not build this page and keep `uptime-sla` unverified |

## Order

1. `/refund-policy` (draft exists), then `/pricing-policy` (price promise), then `/support-policy` and `/migration-terms`.
2. `/backup-policy`, `/fair-use-policy`, `/security`. `/sla` only if the owner confirms an SLA.

## Gate

Do not mark a claim verified and published until the page is live and the owner has ticked the Tier A checklist. Tier B documents (terms, privacy, cookies, DPA) stay out of this file: they need a qualified human (Decision 24).

## Owner answers (2026-10-08) and what is still open

| Page | Answered | Still open |
|---|---|---|
| `/refund-policy` | 30 days from the order. Hosting, VPS and add-ons covered. Domains not refundable. Refund takes up to 30 days, depending on the payment gateway | Owner approval to publish and flip `money-back`. Whether a refund goes to the original payment method (page does not say) |
| `/support-policy` | Support is by tickets. "24/7" read as: tickets are accepted any time | Is a reply promised any time of day, or in set hours? If set hours: which, in which time zone. Until answered `support-24-7` stays hidden |
| `/pricing-policy` | Renewal price same as signup ("same") | For how long (every renewal, or first only)? May a later price rise apply to existing customers? |
| `/backup-policy` | Backups are daily | Retention per plan (how many days kept), where stored, how to restore |

Second round (2026-10-08): support "yes", renewal "Yes", backups "Daily" did not answer the questions asked (see the message to the owner). Nothing drafted for those three.

## Third round (2026-10-08): drafts written, all `noindex`, claims still hidden

Owner answers: support "reply very shortly"; renewal "same price"; backups "nightly". Drafts: `/support-policy`, `/pricing-policy`, `/backup-policy`.

| Page | Written from | Open before approval |
|---|---|---|
| `/support-policy` | Ticket and email, any time; reply "very shortly" | No reply time given, so the page promises none and `support-24-7` should stay hidden until a time is stated |
| `/pricing-policy` | Renewal equals signup price; GST rule; domains excluded | Duration of the promise (read as every renewal); may a price rise reach existing customers? The page says nothing on it |
| `/backup-policy` | Nightly; retention per WordPress plan read from `pricing.json` (7, 14, 30 days) | Confirm those retention figures; restore-by-ticket line is my default, confirm; where backups are stored; Web plans (Essential, Plus) not covered |

## Fourth round (2026-10-08)

- Support: owner says 24/7, reply within 5 minutes. Page now says so. `support-24-7` stays hidden until the owner approves the page.
- Pricing: "same price on renewal on hosting", and Terms must keep "we can change price at any time". The page states both. **Conflict to resolve:** a renewal promise plus a right to change prices at any time may read as misleading. Tier B (Terms) needs a qualified human.
- Backups: nightly backup overwrites the old one, so only the latest copy exists. **Conflict:** `data/pricing.json` says 7, 14 and 30 days retention and "Daily backups, 7-day retention" feature lines. One of them is wrong.

## Fifth round (2026-10-08)

`/migration-terms` drafted (noindex) from: free migration, one website per hosting package, up to 10 websites on a VPS. Not stated: which source hosts and site types, any time promise, what happens if a move fails. `free-migration` stays hidden until the owner approves the page.
