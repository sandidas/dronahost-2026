# Roadmap: what to write, in what order

Status 2026-10-07. Order is by dependency, not by date. The owner adds target dates in the last column.
Roles are in [team-and-workflow.md](team-and-workflow.md). Decisions are in [DECISIONS.md](DECISIONS.md) (24 and 27).

**Why this order:** today none of the four verified claims renders, because no terms page is published. The Tier A policy pages
unlock them, and every money page is stronger once they do. So the policies come first, then the pages that sell.

## Phases

| Phase | What | Who | Gate to start | Done when | Target date |
|---|---|---|---|---|---|
| **0. Facts and decisions** | Fill the missing facts in `PROJECT.md` section 11. Define what "24/7 support" means with ticket and email only. Decide how long "renewal equals signup price" lasts. Name the premium email provider. Decide the fate of old-site products and pages (`url-inventory.md`). Choose a legal reviewer or a legal-document service for Tier B | Owner | none | No open item in the checklist blocks Tier A | |
| **1. Tier A policy pages** | `/refund-policy` (review the draft), `/support-policy`, `/migration-terms`, `/pricing-policy`, `/fair-use-policy`, `/backup-policy`, `/security` (facts only) | Claude drafts, owner approves with the Tier A checklist | Phase 0 answers for each page | Pages published, `termsPageStatus` flipped in `claims.ts`, claims render | |
| **2. Core money pages** | Home (`HOME_PAGE_DESIGN.md`), `/wordpress-hosting`, `/pricing`, `/business-hosting`, `/migration`, `/email` | Claude drafts from the brief, owner approves | Phase 1 for the claims each page uses. `pricing.json` confirmed (`pricesConfirmed`) before prices show | Pages live, checks pass, register rows `published` | |
| **3. Trust pages** | `/about`, `/trust`, `/contact`, `/reviews`, `/sla` (only if an SLA exists) | Claude drafts, owner approves | Company facts, real team, real review profiles | Verified items only render | |
| **3b. Tier B legal documents** | Terms, privacy, cookie, DPA, sub-processors, acceptable use, data retention | Claude drafts outlines, a qualified human reviews | A reviewer or service is chosen | Reviewed, dated, published | |
| **4. Service pages** | `/web-design`, `/seo-services`, `/custom-development`, maintenance cluster | Claude drafts, owner approves | Service sheet filled, at least one real case study per page | Pages live, no ranking promises | |
| **5. Comparisons** | `/vs/[competitor]`, `/alternatives/[competitor]` | Claude drafts, owner approves, legal read | `FEATURES.comparisonPages` on, every competitor fact sourced and dated | Reviewed on a date, honest points both ways | |
| **6. Guides and fixes** | First cluster: "moving a site" (supports `/migration`) and "WordPress email" (supports `/email`). Pillar plus three posts together | Claude drafts, owner (or a named reviewer) checks first-hand details | Keyword validated, first-hand detail supplied | Cluster live, links both ways | |
| **7. Domains** | `/domains`, TLD pages, transfer | Claude drafts | `FEATURES.domainSearch` on, WHMCS price sync | No price typed by hand | |
| **8. Regional and locales** | Regional pages, UK then UAE then EU | Claude drafts, qualified human reviews | Plan 11 and Plan 12 gates, tax adviser answer, legal review | Per wave checklist | |

## Parallel tracks (run from phase 1)

| Track | What | Plan |
|---|---|---|
| Keep legal pages live | Do not remove the current Terms, Privacy and Payment pages until a reviewed replacement is published | Plan 07 |
| Redirects | Build and test the old-to-new URL map before any page goes live | `url-inventory.md` |
| Measurement | Events and Search Console set up before launch | `measurement.md` |
| Keyword validation | Validate each plan's keywords before its pages are briefed | Register |
| Off-site | Claim review profiles, start asking real customers for reviews | Plan 15 |
| AI spot-check | Monthly, 30 minutes | Plan 10 |
| Email notice | Notice and move guide for existing email customers | Plan 14 |

## Limits

- At most **3 pages in flight** at once (briefed, drafting, review). Finish before starting more.
- Start guides at **2 posts a month**. Raise it only when a second reviewer exists and the first-hand material keeps coming.
- No page publishes with an open `[HUMAN REVIEW: ...]` flag.
