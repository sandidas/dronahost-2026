---
slug: /
plan: 09 Navigational and brand
locale: en-US
primary_keyword: dronahost
secondary_keywords: wordpress and vps hosting for small business
intent_primary: Find
intent_secondary: Buy
buying_stage: middle
state: Approved
governor_in_flight: 2
governor_in_flight_max: 3
governor_month_count: 2
governor_month_cap: 4
governor_paused: false
created_on: 2026-10-08
serp_checked_on: 2026-10-08
information_gain_status: not-confirmed
original_element: flag
interview_status: gaps
approval_1: approved
approved_on: 2026-10-08
ai_used: yes
owner: Sandipan Das
reviewer: Sandipan Das
next_review_on: 2027-04-08
---
# Brief: dronahost (home page, full rewrite)

Status: **APPROVAL 1 given by the owner on 2026-10-08** ("skip the interview, approve the brief"). The interview was skipped, so Q1 to Q6 are gaps. This is a full rewrite of `content/pages/home.json` and the register row for `/` is at `review` (the page spec renders live and waits for the owner's review), so this is a refresh of a live page. Fields marked (owner) are supplied by a person.

## 1. Keywords and intent

- **Primary:** dronahost (brand). **Secondary (register):** wordpress and vps hosting for small business.
- **Entities and terms:** DronaHost, managed WordPress hosting, VPS hosting, cloud hosting, business hosting, free migration, 30-day money-back guarantee, support by ticket and email, renewal price, small business, freelancers, agencies.
- **Question keywords:** not available. The search tool showed no "people also ask" list. `[HUMAN REVIEW: paste the People also ask questions for "dronahost" from a real search]`
- **Intent:** primary Find (the searcher knows the name and wants the right page), secondary Buy (a visitor choosing a host). **Reader's problem:** "Who is DronaHost, can I trust it, and which service is for me?" **Reader's goal:** reach the right service page with confidence. **Format:** brand home page that routes to services. **Buying stage:** middle.
- **Archetype:** `product`, a money page, 6 to 8 FAQ items (decision 31).

## 2. Governor status

| Item | Value |
|---|---|
| In flight (register rows briefed, drafting or review) | 2 of 3 (the TTFB guide and this page) |
| New briefs this month | 2 of 4 |
| Pause switch | off |
| Result | A new brief may start (`npm run content:governor`) |

## 3. SERP snapshot

Google US phrasing, read **2026-10-08** with a search tool that returned titles and URLs only: no ranks, no snippets, no "people also ask". Page summaries come from a fetch tool that summarizes a page, so figures about other companies are unverified and none may be quoted.

**Brand queries ("dronahost", "dronahost reviews", "is dronahost legit")**

| Query | What the tool showed |
|---|---|
| dronahost | 9 results, none is dronahost.com. They are DronaHQ docs, Drone CI docs, domain-lookup pages for unrelated drone sites and an app page. The brand name is confused with DronaHQ and drone terms |
| dronahost reviews | Trustpilot pages for other hosts. No review page for DronaHost |
| is dronahost legit | Scam-check pages for other sites. Nothing about DronaHost |

- **What it means:** no third-party page about DronaHost was visible, so nothing wrong or out of date was found. A visitor asking "is it legit" meets look-alike names. The home page and its trust section must answer plainly. Not searched: social platforms, directories, Wayback. `[HUMAN REVIEW: owner checks Google, Trustpilot and LinkedIn by hand]`
- **Old site (dronahost.com v1, services reference only):** its claims conflict with the rules and none may be reused: an intro price with big discounts, cloud provider names, "500 times faster", a US-looking WhatsApp number, testimonials. It does not say who runs the company or where.

**Non-brand queries ("wordpress and vps hosting for small business", "managed wordpress hosting for small business")**

| Result type | Examples read (titles and summaries only) |
|---|---|
| Host-owned buyer's guides (managed WordPress versus VPS) | DreamHost, Hostinger, AccuWeb, AfriCloud |
| Roundups and publisher articles | a community post, a small-business news site |
| One solution page and one plans page | Pressable (solutions page), a small host's plans page |

- **Dominant type and intent:** guides and comparisons. **No host home page appeared for either query.** The home page is unlikely to rank for the secondary phrase on its own. Plan 01 and Plan 03 pages own that intent. I recommend the home page keeps the phrase as a secondary only and does not compete for it. `[HUMAN REVIEW: owner confirms]`
- **Home pages read for structure (5):** ScalaHosting, Rocket.net, SiteGround, Pressable, Cloudways.
  - **Common:** a hero promise (speed, security, support), review badges near the top, product or use-case cards, testimonials, support numbers, free migration, pricing as "from" prices or a link out.
  - **Only 1 of 5 (Pressable)** has a full FAQ on the home page.
- **Gaps and weaknesses:**
  - Renewal price is not shown on four of five home pages as summarized. Some lead with a one-dollar intro offer.
  - Speed and support figures are given as numbers with no visible method or period.
  - No plain statement of who runs the company or where it is based on most of them (not proven absent).
  - Rating badges with no linked proof. Big logos and awards that a small host cannot match, so a smaller host has to earn trust with plain facts.
  - Guides for the secondary phrase compare managed WordPress with VPS but rarely say which situation fits whom.
- **Our angle:** a plain home page for a reader who is deciding. Who we are, what each service is for, what we do and do not do, what happens at renewal, and how to reach a person, using only claims that render today.

## 4. Information gain

- **Gap in the top results (pages read: ScalaHosting, Rocket.net, SiteGround, Pressable, Cloudways, the old dronahost.com):** unproven superlatives, no renewal price, no plain statement of who runs the company, and no "what we do not do".
- **Our gain:** "Unlike the usual hosting home page, this one says who runs DronaHost (on /about) and shows what we do not do, shows the renewal price next to the signup price, and states what we do not offer, because each statement links to a published policy."
- **Real material behind it:** the five claims that render, each with a published policy page, the renewal-price rule, and the "not offered" list (decision 22). **Not yet available:** your own answers on who runs the company, what you can prove about your history, and what a skeptical buyer should check (interview Q1, Q2, Q4, Q5). A sourced "what we do not do" list is possible now; the "who we are" part is not.
- **Status: not confirmed.** The page can be rewritten with the claims and policies alone, but it stays a Draft until the interview supplies the "who we are" material.

## 4b. Reader questions (what the page must answer)

Added 2026-10-09 (engine 1.0.8, rule IN5). Sources: the reader's problem in section 1, the gaps in section 3, and the FAQ the owner approved on 2026-10-08. "People also ask" is still missing (section 19), so this list is the owner's and Claude's reading, not a measured one. `[HUMAN REVIEW: owner adds or removes questions from a real search and from support tickets]`

Revised 2026-10-10 for the brand home page (decisions 58 and 59). The earlier table is replaced; prices moved to `/pricing`.

| Question | Answered on the page by |
|---|---|
| What does DronaHost offer? | FAQ: What does DronaHost offer? |
| Which service fits my business? | H2: Everything your website needs, from one provider |
| Why choose DronaHost, and where are the terms? | H2: Engineered for growth. Run for you. |
| How does it all fit together? | H2: One ecosystem for every part of your online business |
| Will my website go offline when I move? | FAQ: Will my website go offline during the migration? |
| How does the move work? | H2: We move your site. You approve every step. |
| Will my price increase at renewal? | FAQ: Will my price increase at renewal? |
| What if it is not right for me? | FAQ: What if DronaHost is not right for me? |
| Is email included? | FAQ: Is email included with hosting? |
| How do I log in? | FAQ: How do I log in to my DronaHost account? |
| How do I reach support? | FAQ: How do I contact DronaHost support? |

## 5. Human first (owner)

- **The reader's real question:** `[HUMAN REVIEW: owner confirms or rewrites the question in the reader's words]`
- **Our angle:** `[HUMAN REVIEW: owner confirms the angle in section 3 or states a different one]`

## 6. Original element (owner)

`[HUMAN REVIEW: original element]`: one real artifact that shows the company is real and checkable. Candidates, only if true and yours to supply: a screenshot of your company registration record, a real migration (before and after, with the customer's permission), a dated support-ticket timeline. None exists yet. Without one the page stays a Draft.

## 6b. Experience shown on the page

Added 2026-10-09 (rule TR7). What a visitor sees today: one recorded decision and its reason, in the "What DronaHost does not do" section: "We do not promise a reply time. We reply by email to every ticket. We will publish a reply time only after we have measured it" (decision 36, 2026-10-09), marked first-hand. Nothing else first-hand can show yet. What would show more, from `npm run content:owed`: a real dashboard screenshot in the hero (`public/screenshots/home-dashboard.png`), a measured number for the proof bar, real reviews, one approved case study.

## 7. Interview answers (verbatim)

Bank: **Brand and trust pages** (Plan 09) in [interview-questions.md](../../rules/interview-questions.md). One question at a time. **The owner skipped the interview on 2026-10-08, so every question is a gap.** Answers are recorded word for word in the format of [interview.md](../../templates/interview.md). A question you skip, or answer "none", becomes `GAP` and the section that needs it is dropped.

| # | Question | Owner's answer (verbatim) | Date | Artifact |
|---|---|---|---|---|
| Q1 | Who runs the company, and what is each person's real role? | GAP: owner skipped the interview on 2026-10-08 | | none |
| Q2 | What can you prove about your history? | GAP: owner skipped the interview on 2026-10-08 | | none |
| Q3 | Which review profiles exist, and what do customers say most? | GAP: owner skipped the interview on 2026-10-08 | | none |
| Q4 | What should a skeptical buyer check about you? | GAP: owner skipped the interview on 2026-10-08 | | none |
| Q5 | What are the legal entity, address and contact route? | GAP: owner skipped the interview on 2026-10-08 | | none |
| Q6 | What do you honestly not do? | GAP: owner skipped the interview on 2026-10-08 | | none |

## 8. Fact ledger

`project/facts/home.json`. **Verified 17, needs check 4** (F18 to F21: founding year, legal entity and address, public email, and team, customer counts and unverified features). The draft may use only ledger facts, interview answers and claims that render. Fact-checker role result (2026-10-08): F1 to F17 match their sources; F18 to F21 are correctly needs-check. Corrections made after the check: F15 now notes that the code flags both payment methods unverified, F17 cites CLAUDE.md for the pricing rule, and the source notes on F19 to F21 are more exact. `content/trust.ts` has not been read by the fact-checker role.

## 9. Claims, plans and prices needed

- **Claims that render today:** `money-back` (/refund-policy), `support-24-7` (/support-policy), `free-migration` (/migration-terms), `renewal-price-same` (/pricing-policy), `backups` (/backup-policy).
- **Claims that do not render, so the page must not state them:** uptime SLA, response-time and TTFB figures, founding year, free SSL, managed-server-care, managed-hosting-tasks, LiteSpeed, NVMe, cPanel on every plan, SSH, malware scanning, staging, retention, VPS and Business scope, website-design service, migration-process. Sections that depend on them stay hidden until you verify them (existing `requiresClaim` gates).
- **Plans and prices:** read from `data/pricing.json` through `lib/pricing` by the plans component. Never typed in copy. Hidden in production until `FEATURES.pricesConfirmed`. Tax line: "Prices exclude tax. Customers in India pay GST at checkout."

## 10. Who, How, Why (shown on the page)

- **Who:** reviewer Sandipan Das (owner), shown in the provenance section at the end of the page (added 2026-10-09; the name and role are confirmed facts in `PROJECT.md`, sections 1 and 2). The About and Contact links are in the site navigation. `[HUMAN REVIEW: author page, once /about holds verified facts]`
- **How:** a home page does not need a byline (owner, 2026-10-08). The provenance section carries one sentence instead: "Every promise on this page links to the policy that states its terms, and every price comes from one published price list." The editorial policy link shows once `/editorial-policy` is published.
- **Why:** to help a visitor decide who DronaHost is and which service fits.

## 10b. People-first self-assessment (reviewer)

Answered by Claude on 2026-10-09 against the page spec; the owner re-answers at review. Evidence is a check result or a quote from the page.

| Question | Yes or no | Evidence |
|---|---|---|
| Original information or analysis, not a rewrite of the top results? | Partly | OV1 and OV2 pass. The gain (section 4) rests on the published policies and "what we do not do"; the "who we are" half waits on the interview |
| Complete for the reader's question, so they will not search again (4b all answered)? | No | 10 of 12 reader questions are answered; the price and the "who runs it" rows are open |
| Title and H1 descriptive, not exaggerated? | Yes | Title "Hosting With the Same Price at Renewal" states a rendering claim; H1 names the service and the outcome; TR3 and TR8 pass |
| A page you would bookmark or recommend to a friend with this problem? | Not yet | A friend would ask "who are they?" and the page cannot say until the entity facts arrive |
| Clear sourcing, and background about who is behind the page? | Partly | Every promise links to its policy (WhyChoose, HelpAndPolicies); the provenance section names the reviewer; TR1, TR2, TR6 pass. No About page facts yet |
| Written or reviewed by a named person who knows the topic? | Yes | Reviewer: Sandipan Das (owner), on the page |
| No easily verified factual error? | Yes | F1 passes; every statement maps to the ledger (F1 to F17) or a rendering claim |
| First-hand experience visible on the page? | Yes, one | The reply-time decision (6b); TR7 passes. More is owed |
| Made for our audience with one clear purpose? | Yes | Intent Find, then Buy (IN1); one primary action on the page |
| Nothing dated or padded to look fresh or long? | Yes | 852 visible words inside the 500 to 1,000 range; the visible date equals `rules.reviewedOn` (2026-10-08) and will move only when the owner rechecks |
| Honest limits stated; no pressure wording? | Yes | "What DronaHost does not do" (5 items); TR4 and TR8 pass |

## 11. Outline

Length: a home page is short on prose. About 600 to 900 words of visible copy, plus FAQ. A guide, not a rule.

1. **Hero.** H1, one-sentence entity definition inside the first 50 words (the same sentence everywhere, spelled DronaHost). One primary action.
2. **Where are you starting from?** Four paths, each with one line and a link: move my WordPress site, new WordPress site, simple business hosting, full control with VPS. Cloud is described as "talk to the team". Hidden paths stay hidden until their claims render.
3. **What we look after, and what stays with you.** Backups only today (claim). The rest `[HUMAN REVIEW]`.
4. **Moving to DronaHost.** Only what the free-migration claim says: free on every package, one website per package, up to 10 on a VPS. Steps stay gated.
5. **Plans.** The plans component reads `pricing.json`. Renewal price shown with the signup price. Tax line.
6. **Support.** Ticket and email only, 24/7 (claim). No reply time is promised (decision 36, 2026-10-09, superseded the 5-minute wording). No chat, WhatsApp or phone.
7. **Our policies in plain language.** Links to the refund, support, migration, pricing and backup policies.
8. **Who is behind DronaHost.** A focused team serving small businesses, freelancers and agencies worldwide; where the team is based is said on `/about` only (decision 34). Legal entity, address, names and founding year only when you confirm them (interview Q1, Q2, Q5).
9. **What we do not do.** From decision 22 and the project facts: no hosted email, ticket and email only (a forbidden channel is never named, even to deny it). Plus your answers to Q6. **Built 2026-10-09** as the `HonestLimits` section (five items; the reply-time item states decision 36 and is marked first-hand).
10. **FAQ, 7 items, answers 40 to 80 words.** Candidates: what is managed WordPress hosting; do I need technical skills; does DronaHost host email; can I move my site; will the price go up at renewal; what if I am not happy (refund policy); how do I reach support. Every answer must match a ledger fact or an interview answer.
10b. **About this page.** The `PageProvenance` section (added 2026-10-09): reviewer, role, review date, how facts are checked, report an error, editorial policy once published.
11. **Closing action.** One CTA.

Not included: testimonials, review scores, logo wall, customer counts, awards and uptime figures. None is verified and none may be written by AI.

## 12. Headline (money and landing pages)

Reason-led proposals for you to choose from. They use no unverified fact.
- **A:** "Managed WordPress and VPS hosting, with a team that replies" (claim: reply within 5 minutes). Superseded: decision 36 removed the reply-time promise.
- **B:** "Hosting for small businesses, from a team in India" (F2, F3). Superseded: decision 34 keeps the location on `/about` only.
- **Fallback:** "Managed WordPress, VPS and cloud hosting".

## 13. Tool or table needed

The plans table from `pricing.json` (existing component). No new tool.

## 14. Internal links (3 or more)

| Anchor text | Target page | Why it helps the reader |
|---|---|---|
| WordPress hosting | `/wordpress-hosting` | the main service |
| Business hosting | `/business-hosting` | simple hosting for any site |
| VPS hosting | `/vps-hosting` | full control |
| Cloud hosting | `/cloud-hosting` | talk to the team |
| Pricing | `/pricing` | plans and renewal prices |
| Free migration | `/migration` | moving a site |
| Refund policy | `/refund-policy` | the guarantee terms |
| Support policy | `/support-policy` | what 24/7 means |
| About | `/about` | who runs it (once it holds verified facts) |

## 15. CTA

One: "See WordPress hosting plans", to `/wordpress-hosting` (today's label). For a Find-intent page the direct link is right, and WordPress hosting is the first service. `[HUMAN REVIEW: owner confirms the primary service]`

## 16. Schema

`Organization` and `WebSite` (existing). `sameAs` only for real, owned profiles (none confirmed). `FAQPage` only if it matches the visible FAQ, and expect no rich result. No `Review` or `AggregateRating`.

## 17. Metadata draft

Title: **Managed WordPress, VPS and Cloud Hosting** (40 characters, 52 with the " | DronaHost" suffix; inside the limits). Description: **DronaHost is a team in India running managed WordPress, VPS and cloud hosting for small businesses worldwide. Free migration and a 30-day money-back guarantee.** (159 characters). Superseded: decision 34 removes "a team in India" from the description, and decision 35 sets the reason-led title; the live title and description are in `content/pages/home.json`.

## 18. People and review

Owner and reviewer: Sandipan Das. Next review: 2027-04-08. AI used for the draft: yes.

## 19. Open flags

- **2026-10-09 (E-E-A-T revision):** the visible review date stays 2026-10-08 (the owner's last full read). The owner rechecks the two new sections and the FAQ, then sets `rules.reviewedOn` and the provenance `reviewedOn` to the same date. The first-hand element is one recorded decision; a screenshot, a measured number, reviews and a case study are still owed (`npm run content:owed`). Two reader questions stay open (section 4b).
- Information gain not confirmed. Interview not started (Q1 asked, Q2 to Q6 not asked). Original element missing.
- Missing facts: legal entity, registration number, address, founding year, public support email, team names, social profiles (ledger F18 to F21). Each is left out until supplied.
- "People also ask" list missing. Brand SERP not seen in a real Google search.
- The brand name is confused with DronaHQ. A one-line "not related to other companies with similar names" is possible only if you confirm it is true. `[HUMAN REVIEW]`
- The old site shows a US-looking WhatsApp number and cloud provider names. Neither may be reused. `[HUMAN REVIEW: owner removes the old number from the live v1 site and listings]`
- Competitor figures from the research are unverified and not used.
- The secondary phrase is a guide intent. Recommended: keep it secondary, do not target it (section 3).

## 20. APPROVAL 1

**Approved** by Sandipan Das on 2026-10-08 with the interview skipped (all gaps). The sections that need interview answers (who is behind DronaHost, the original element, and the owner's "what we do not do" answers) are dropped or left as `[HUMAN REVIEW]`. Next step: draft.
