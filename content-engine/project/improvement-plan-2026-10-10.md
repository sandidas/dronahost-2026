# Content engine and content review: improvement plan (2026-10-10)

Five reviews ran on 2026-10-10: the rules and plans, the tool code, the project data and live pages, the Claude assets and UI copy, and a page-by-page content-volume count. This file records what was found, what was fixed the same day, and what is still open. Open items that need a fact or a decision from the owner are in the last section; nothing there was guessed.

## 1. Structure (done)

| Change | Where |
|---|---|
| The planner moved from `docs/content-planner/` to `content-engine/` at the repo root (git history kept). The build prompt, spec and Phase 0 plan moved to `content-engine/history/`. | whole repo; decision 41 |
| Config renamed `content-engine.config.json`; env var `CONTENT_ENGINE_CONFIG` (the old name still works). | `tools/load-config.ts` |
| **Brand settings as JSON:** `project/settings.json` (brand name, wordmark, domain, misspellings, title suffix, business type and category, offerings, where based and where it may be said, audience, locale, currencies, tax line, support channels, people). | `schemas/settings.ts` |
| **Voice as JSON:** `project/voice.json` (summary, attributes, spectrum, write-like, readability limits, spelling variant and respellings, exclamation marks, word swaps, banned phrases, idioms, banned CTA labels, disclosure line). | `schemas/voice.ts` |
| The loader merges both into the config and rules, so every tool reads them; the brand name, title suffix, brand-suffix pattern, readability limits and banned lists were removed from the config and rules (one home each). `check:config` fails when a value is typed twice. | `tools/load-config.ts`, `tools/check-config.ts` |
| `npm run content:voice` prints the brand and voice card that every writer and agent reads first. | `tools/voice-card.ts` |
| New voice checks: V10 spelling variant (US), V11 plain-word swaps (warnings); V2 follows `exclamationMarks`. | `tools/content/rules-text.ts` |
| `init-project` writes `settings.json` and `voice.json` for a new project (`--type`, `--category`); the sample bakery uses the new layout; `test:reuse` proves it end to end. | `tools/init-project.ts`, `eval/sample-project/` |

## 2. Making later content follow the same method (done)

| Problem | Fix |
|---|---|
| The global `seo-content-writer` skill caught "write content for ..." requests and conflicts with the engine on spelling, title suffix, word counts, keyword density, FAQ counts, invented statistics and bios, Google scraping, and writing before approval. It writes into `content/pages/` with a shape that breaks the page-spec check. | New project skill `content-engine` (`claude/skills/content-engine/SKILL.md`, installed to `.claude/skills/`) with every content trigger, routing to the engine commands and stating precedence. CLAUDE.md and the README say the engine overrides global skills. |
| `/write-content` continued when no register row owned the keyword. | `resolve` returns `needs-row` and exits 1; the command stops on it; eval case 11. |
| Commands did not load the brand first; no page-spec branch for money pages; the fact-checker was told to write a ledger it cannot write; the drafter had no output location; agent descriptions let them be picked for any request. | Commands and agents updated: voice card first, page spec vs article decided at Stage 1, the command writes the fact-checker's rows, drafter writes to `paths.drafts` or the page spec only, agents scoped to the engine commands, `allowed-tools` on `/audit-page` and `/monthly-review`. |
| Installed `.claude/` copies could drift from the engine's source. | Test fails when they differ; the installer also copies skills. |

## 3. Engine rules, plans and templates

Findings from the rules review (contradictions in FAQ counts, title limits, intent names, table limits, Tier A vs Tier B review, CTA examples with prices, location wording in plans 05 and 09, brand facts in the reusable core, UK spellings, missing page types and microcopy rules). Status: see the engine CHANGELOG entry 1.1.0 for what was applied.

## 4. Tool code

Findings from the code review (symlinked CLI silently exits 0, missing files pass, image lines fail V2, K2 always passes, single-number F1, raw substring ledger match, whole-line negation in PO1, invalid calendar dates pass, table cells glued in WordPress HTML, locale ignored in register lookups, sentence splitter and abbreviations, unwaivable rules, crash paths). Status: see CHANGELOG 1.1.0.

## 5. Project data (done)

Page map headings and tables now match `blueprints.json`; section maximums raised where `order` overflowed (C5, C9, C10c, C10d, C15); `/sla` gate is Tier A; `/trust` shows Blocked (no route); PROJECT.md, brand.md and DECISIONS.md stale lines fixed; the ttfb row moved to Plan 04 (`briefed`); home brief, draft and handoff states corrected; the ttfb draft written before APPROVAL 1 is on hold; follow-ups 32 to 36 added in `code-follow-ups.md`.

## 6. Live site copy and UI

Findings: brand typed twice in page titles ("DronaHost | DronaHost"); Business Hosting copy says email is included; compare table leaks prices while prices are hidden; FAQ tax line mentions VAT; location claims on region and data-processing pages; unverified numbers on /security and /sla; invented governing law on /terms; banned CTA labels ("Learn more", "Contact us", "Get started"); raw API errors shown to visitors; ungated "free" migration label; UK spellings and idioms. Status: see CHANGELOG 1.1.0 and the summary below.

## 7. Content volume by page (2026-10-10 count)

| Page | Blueprint | Range | Words | Verdict |
|---|---|---|---|---|
| / | C1 | 500 to 1,000 | about 850 | OK |
| /wordpress-hosting | C2 | 700 to 1,200 | 1,137 | In range; much of it waits on unverified claims |
| /pricing | C3 | 400 to 800 | 801 | At the ceiling; mostly table |
| /business-hosting | C2 | 700 to 1,200 | 228 | Thin |
| /vps-hosting, /cloud-hosting | C2 | 700 to 1,200 | 261, 272 | Thin; not sellable yet (Blocked) |
| /web-design, /seo-services, /growth-services | C6 | 700 to 1,100 | 211, 303, 213 | Thin |
| /migration | C4 | 500 to 900 | 68 | Very thin |
| /domains | C9 | 300 to 600 | 216 | Thin |
| /about | C10a | 300 to 800 | 233 | Thin; no story or provenance |
| /hosting/us, uk, eu, uae | C8 | 600 to 1,000 | about 250 each | Thin, near duplicates |
| Tier A policies (refund, support, pricing, migration terms, backup) | C11 | 200 to 4,000 | 80 to 145 | Thin; no approval line |

Plan: grow these pages only through `/write-content` or `/refresh-content`, one at a time within the governor (3 in flight, 4 new a month), in roadmap order. Each needs owner facts first (prices, support email, case study, reviews, team, VPS and cloud plans). Never pad to reach a number.

## 8. Owner answers (2026-10-10) and what is still open

Answered the same day and applied (decisions 42 to 48):

| Question | Answer | Applied |
|---|---|---|
| Support email | support@dronahost.com | `content/company.ts`; shows in the footer, on /contact and in form errors; free-migration requests now send to it |
| Pricing, null limits, CTA examples | Follow `data/pricing.json` | Fair-use traffic reads "Fair use", other null limits are hidden, never "Unlimited"; no price inside a button; CLAUDE.md and rules §10 aligned (decision 46) |
| VPS refunds | VPS is prepaid, no refund | /refund-policy updated (decision 44) |
| Uptime | 99.99% | `uptime-sla` claim and /sla body; the claim stays unverified until the credit bands match (decision 45) |
| Legal pages | Later, after about 140 main pages | Tier B pages stay live and noindex; roadmap updated (decision 42) |
| Sitemap | Claude's recommendation | Blocked pages are noindex and out of the sitemap until Ready (decision 47) |
| Global writing skill | All content from content-engine in this repo | Project skill plus a guard in the global skill (decision 48) |

Second round, same day (decisions 49 to 52):

| Question | Answer | Applied |
|---|---|---|
| CLAUDE.md conflicts, email | Update CLAUDE.md; email is never part of hosting and will be a separate service | CLAUDE.md services, footer address (/about only), locales (decision 6), regional pages without datacenter claims; email wording in pricing.json, services, Home and the engine (decision 49) |
| VPS includes 10 free moves | Keep | Decision 51 |
| SLA credit bands | Claude to set | Proposed bands 99.9 to under 99.99: 5%, 99.5 to under 99.9: 10%, below 99.5: 25%. Hidden until the owner confirms them and verifies `uptime-sla` |
| Renewal price duration | Same price, no end date | /pricing-policy and PROJECT.md (decision 50) |
| Keyword overlaps and missing rows | Claude to set | Register updated (decision 52) |

Still open for the owner:

1. Confirm the proposed SLA credit bands, then verify the `uptime-sla` claim.
2. Email service: plans, prices and provider for `/email` (decision 49).
3. Word ranges for About, Trust, Contact, Reviews, policies and C15 are planning guesses to confirm.
