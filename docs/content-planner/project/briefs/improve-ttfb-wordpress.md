# Brief: how to improve ttfb on wordpress

Status: **waiting for APPROVAL 1.** Written 2026-10-08 by `/write-content`. No article written. The existing skeleton draft is `project/drafts/improve-ttfb-wordpress.md` (state Draft).

**Slug / Plan / Locale:** `/kb/improve-ttfb-wordpress` / 04 Problem and troubleshooting / en-US
**Primary keyword:** how to improve ttfb on wordpress
**Secondary keywords (register):** reduce ttfb wordpress; high ttfb wordpress
**Entities:** TTFB, PHP version, page caching, object cache, CDN, database cleanup, plugins, server response time
**Question keywords:** a real "People also ask" list is not available with the tools used. `[HUMAN REVIEW: paste PAA from a real search]`

## Governor status

| Item | Value |
|---|---|
| In flight (register rows briefed, drafting or review) | 1 of 3 (this page) |
| New pages started this month | 1 of 4 (the cap is the spec's starting value; the owner has not set one) |
| Pause switch (`pause: true`) | not set |
| Result | A new brief may start |

## Intent

- **Primary:** Solve. **Secondary:** Learn (what TTFB is and what is good).
- **Reader's problem:** the first response from my WordPress site is slow, and a speed test says so.
- **Reader's goal:** lower it without breaking the site.
- **Expected format:** step-by-step guide. **Buying stage:** early.

## SERP snapshot (Google US, read 2026-10-08)

| Result | Page type |
|---|---|
| wp-rocket.me | Vendor guide, sells its caching plugin |
| wpbeginner.com | Guide, about 2,500 words, screenshots, recommends Hostinger and WP Rocket |
| wpbuffs.com | Agency guide (title only read) |
| jetpack.com | Vendor guide (title only read) |
| elegantthemes.com | Vendor guide (title only read) |
| cloudways.com | Vendor guide, about 2,800 words, has before and after test numbers, promotes its own hosting |
| belovdigital.agency | Agency guide, 2026 (title only read) |
| commercegurus.com | WooCommerce-specific guide (title only read) |
| themezhub.com | Guide, "below 200 ms: 6 fixes" (title only read) |

- **Dominant type and intent:** how-to guides. Matches Solve.
- **Common H2 topics:** what TTFB is, how to measure it, caching, CDN, PHP version, database cleanup, plugin and theme updates, "switch to better hosting".
- **Typical depth:** long, 2,500 to 2,800 words.
- **Gaps:** nearly every result is a vendor and ends in a product. Most give no order of effort, no stop point, and no check that a fix worked. Most do not say when the cause is the host.
- **Not available:** "People also ask" and related searches.

## Information gain

- **Gap in the top results (URLs checked: wpbeginner.com, cloudways.com):** lists of tips without an order of effort, a stop point or a check after each step, ending in a product recommendation.
- **Our gain (proposed):** "Unlike the top results, this page orders the fixes by effort, gives a stop point and a check after each one, and says when the cause is your host."
- **Real material behind it:** none yet. It needs the owner's tested numbers (interview Q4, Q5) and an artifact.
- **Status: NOT CONFIRMED.** Until the owner supplies real material, this page cannot reach "Ready for owner review". If no material exists, the keyword is merged or dropped (governor rule 1).

## Interview (owner answers, recorded verbatim)

Bank: Fix or troubleshooting. The interview runs **one question at a time**. This brief shows the full list so you can see what will be asked. Nothing has been answered, so every question is a gap today.

| # | Question | Artifact to ask for | Answer |
|---|---|---|---|
| Q1 | When did you last see a slow response time (high TTFB) on a WordPress site, and on what kind of site? | none | GAP |
| Q2 | What was the cause in that case? | log or test output | GAP |
| Q3 | What did you try first that did not work? | none | GAP |
| Q4 | What fixed it, step by step? | before and after numbers | GAP |
| Q5 | How did you confirm it was fixed? | screenshot of the tool | GAP |
| Q6 | Which versions (WordPress, PHP, plugins, host) were involved? | none | GAP |
| Q7 | What would you tell a reader who cannot fix it alone? | none | GAP |

## Fact ledger

`project/facts/improve-ttfb-wordpress.md`. Two facts verified from source (web.dev: good 0.8 seconds or less, poor above 1.8 seconds). Five facts **need check** and the page cannot state them as fact until checked.

## Claims and prices

None needed. Never render the `ttfb` claim (unverified). No feature words about our hosting (`litespeed` and similar are unverified). No prices.

## Who / How / Why (shown on the page)

- **Who:** author `[HUMAN REVIEW: name]`, reviewer Sandipan Das (owner), linked to an author page that does not exist yet `[HUMAN REVIEW]`.
- **How:** "Drafted with AI assistance, then edited, fact-checked and approved by [name]." Plus what was tested (versions, tool, date) from the interview.
- **Why:** to help a site owner find why their server responds slowly and fix it in order of effort.

## Outline

1. H1: How to improve TTFB on WordPress. Answer block, 40 to 80 words.
2. Before you start: take a backup.
3. How to measure TTFB and what counts as good (web.dev figures).
4. Is it your site or your host? (only if Q2 and Q5 give a tested method)
5. Fixes in order of effort, each with a check (sections dropped if Q4 is a gap).
6. When the cause is your host.
7. When to ask for help (link to `/contact`).
8. How to keep it fast.
9. FAQ, 4 to 6 questions, answers 40 to 80 words.

## Internal links

| Anchor | Target | Why |
|---|---|---|
| WordPress hosting plans | `/pricing` | one soft link after the answer |
| WordPress hosting | `/wordpress-hosting` | only where the host is the cause |
| send us your test results | `/contact` | help route |
| a sibling fix guide | planned | choose with the register |

## CTA, schema, metadata

- **CTA (one):** "Send us your test results", to `/contact`.
- **Schema:** `BlogPosting` and `BreadcrumbList`. Add `FAQPage` only if it matches the visible FAQ, and expect no rich result (Google ended FAQ rich results). **Drop `HowTo`**: Google no longer shows it (`rules/sources.md`, item 5).
- **Title:** How to Improve TTFB on WordPress (32 characters). **Description:** Find out why your WordPress server responds slowly and fix it in order of effort, with a check after each step. Back up first.

## Owner, reviewer, review date, AI

Owner and reviewer: Sandipan Das. **Next review date:** 2027-04-08. **AI used for the draft:** yes.

## Open flags and gaps

- Information gain not confirmed (no real material).
- Interview: Q1 to Q7 unanswered (gaps).
- Fact ledger rows 3 to 7 need a source check. A second primary source is missing.
- "People also ask" list missing. Author name and author page missing.

## APPROVAL 1

Owner decision needed: approve this brief and the interview answers. Today there are no answers, so the answer is "approve the brief, then answer Q1 to Q7".
