# Plan 09: Navigational and Brand

**Intent:** the searcher already knows [Brand] and wants a specific place: login, support, pricing, or independent proof that we are real.
**Goal:** be the first and the cleanest result for our own name, and make every brand search lead to a trust page, not to a rumor.
**Owns:** brand queries and brand-plus-modifier queries.

Project specifics for this plan: [plan-specifics/09-navigational-brand.md](../project/plan-specifics/09-navigational-brand.md)

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages; Stage 4 output is page-spec copy, not an article. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Find.
- **Interview:** the **Brand and trust pages** bank in [interview-questions.md](../rules/interview-questions.md). Ask the questions exactly as written, one at a time.
- **Page blueprint:** the section count, required sections, order and per-section limits for this page type are in [page-blueprints.md](../rules/page-blueprints.md). The blueprint this project uses for each URL is in `project/page-map.md`; a page spec names it in its `blueprint` field.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). Use it only when it matches the visible content and helps the reader.

## Queries and the page that owns each

| Query (seed) | Page | Notes |
|---|---|---|
| [brand] | `/` | Homepage defines the entity in the first 50 words. |
| [brand] login, [brand] client area | the [Billing system] client area | The login page may be indexed with a clear title, so existing customers find it. The rest of the client area, the cart and API paths are `noindex`. The main site links to it in the header and footer. Feature flags for any future in-app account area are in the project specifics |
| [brand] support, [brand] contact | `/contact` | Hours and channels only from verified claims. |
| [brand] pricing | `/pricing` | Plan 01. |
| [brand] reviews | `/reviews` | A page that links to our real profiles on [Review platform]. No ratings typed by hand. |
| [brand] about, who owns [brand] | `/about` | Company registration, address, team, founding year (only when verified). |
| is [brand] legit | `/about` section or `/trust` | The honest answer: who we are, what we do, how to verify us. Where the business is based only on the pages the project allows (`business.basedIn.mentionOnlyOn` in `project/settings.json`). |
| [brand] status | status page | External status page, linked from the footer. Copy rules: "Status, incident and changelog copy" below. |
| [brand] vs [Competitor] | `/vs/[competitor]` | Plan 02. |

## Entity definition (use on every key page)

One sentence in the first 50 words, the same wording everywhere. Place the wording in a single registry (the company registry), not retyped. The sentence says what [Brand] is, not where it is based. Structured data (`Organization`, `WebSite`) uses the same name and the same facts.

Spelling: fix one spelling for the logo, one for prose and one for the domain, and never vary them (the exact forms are in the project specifics).

## Brand SERP checklist

- [ ] Homepage title and description are accurate and unique
- [ ] Sitelinks point to the right pages (pricing, support, about, login)
- [ ] `Organization` schema with `sameAs` links to real profiles only
- [ ] Review profiles claimed and kept current, with real customer reviews
- [ ] LinkedIn company page and team profiles match the site
- [ ] No outdated third-party listings with wrong claims (check quarterly)
- [ ] A Wikidata or knowledge entry only if we qualify and can source it

## Trust page (`/about` or `/trust`)

Must show: registered company name and number, physical address (on the pages the project allows; the real address only, never a virtual office presented as an office), the company's tax registration number if the owner wants it public, team names with LinkedIn links, year founded (verified), how to reach a human. Only verified items render. Anything missing is left out, never faked.

## Reviews page rules

- Link to the real profile and show the review count and score only from that source, with the date retrieved.
- Quote reviews exactly. Include name, company and a link where permission exists.
- Respond to negative reviews on the platform. Do not hide them.

## Status, incident and changelog copy

Format rules: [page-blueprints.md](../rules/page-blueprints.md), Part D. This plan owns them.

- Plain past-tense facts: what happened, what was affected, what we did. "Sites on one server group were unreachable from 14:05 to 14:40 UTC."
- Every time has a timezone. Every update has a timestamp.
- No blame (on a provider, a customer or a person). Name the cause only when it is known.
- No promise (a fix time, a credit, "this will not happen again") unless a claim renders for it.
- A changelog entry says what changed and what the reader must do, if anything.

## Voice

Plain and welcoming. The reader knows us. Do not re-sell. Give the answer and the way to reach us.

## Measure

Brand impressions and clicks, position of owned results on the brand SERP, review platform scores and counts, contact page conversions, brand-plus-"scam" or "legit" query trends.
