# Plan 03: Informational (guides and explainers)

**Intent:** the searcher wants to learn. They are not buying today, but they will remember who explained it clearly.
**Goal:** earn trust and citations, build topical authority, and pass readers to money pages without pressure.
**Owns:** `what is`, `how to`, `guide`, `checklist`, `explained`, `vs` between concepts (not between providers).

For broken-site queries ("my site is slow", "hacked", "error 500") use [Plan 04](04-problem-and-troubleshooting.md).

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Learn. A decision guide may declare Plan as its secondary intent.
- **Interview:** The **Guide or explainer** bank in [interview-questions.md](../rules/interview-questions.md).
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). HowTo markup is not used for Google; it is allowed only if another consumer needs it and it matches the visible steps.

## Principle: win the long tail, cite the pillars

Head terms like "what is web hosting" are held by large brands and Wikipedia. We target specific, practical questions where an expert answer is rare, then connect them into clusters.

## Pillar and cluster map (seeds, unvalidated)

| Pillar (hub page) | Cluster posts | Money page it supports |
|---|---|---|
| [Topic] performance | how to improve [metric] on [platform]; [platform] core web vitals fixes | The matching product page |
| [Topic] security | how to harden [platform]; backup strategy | The product page, the security page |
| Moving a site | how to migrate [platform] without downtime; migration checklist | The migration page |
| Choosing a [product category] | [option A] vs [option B] explained; do I need [product] | The pricing page, product pages |

The project's pillar and cluster seeds: the project's plan-specifics for this plan.

Rule: publish the **pillar plus 2 cluster posts together** (within `governor.maxInFlight`), so the cluster links exist at launch, and the third cluster post within the month. A keyword outside this seed map goes into the closest pillar, chosen by the owner when the brief is approved; if no pillar fits, propose a new one. The "together" rule applies to a new pillar, not to a single post added to a live cluster.

## Formats

| Format | When | Shape |
|---|---|---|
| How-to | "how to ..." | Answer, prerequisites, numbered steps, check that it worked, FAQ. No `HowTo` markup for Google (see Schema). |
| Explainer | "what is ..." | One-sentence definition, why it matters to a business owner, an example, common mistakes. |
| Checklist | "checklist for ..." | A short intro, a scannable list, a downloadable or printable version if useful. |
| Comparison of concepts | "shared vs vps" | Table first, verdict second, edge cases third. |
| Glossary entry | term lookups | Blueprint C14. 40 to 80 word definition, one example, links to related terms. The URL pattern is the project's. |
| KB help article | "how do I [task] in [Brand]" | Blueprint C14. One task, numbered steps, tested version and date, byline under the H1. See [page-blueprints.md](../rules/page-blueprints.md), Part D. |

## Human-first fields (before any draft)

Fill these in the brief first ([brief.md](../templates/brief.md)): the reader's real question, our angle, the original element, the interview answers (what we know first-hand), and the sources to verify ([content-writing-rules.md](../rules/content-writing-rules.md) section 8). If "what we know first-hand" is empty, the post stays a Draft with the gap named (see "States" in the workflow). Guides carry a byline and reviewer, and an "AI-assisted" line when AI produced most of the first draft.

## Page template

1. **H1** that is the question or task in plain words, 20 to 70 characters, with the byline ("Written by [name]. Reviewed by [name] on [date].") directly under it.
2. **Answer first:** directly under the H1, inside the answer-block word range in the config. A reader who stops here still got the answer.
3. **Who this is for** (one sentence) and the time it takes, if a task.
4. **Body** in H2 sections, each opening with its own direct answer. Short paragraphs, one idea each.
5. **First-hand detail:** at least one real scenario from running sites, with a named tool and outcome. Flag `[HUMAN REVIEW: add first-hand insight]` until added.
6. **Soft product link:** one natural mention where the product solves the problem. Never in the first screen (the first 200 words), never as a banner.
7. **FAQ:** count per `limits.faqItemsByArchetype` in the config, questions in conversational form.
8. **Author box at the end:** real name, role, credentials, link to the author page. The review date matches the byline.

## Keyword rules

- One primary keyword per post, 3 to 6 secondary and question keywords from People Also Ask.
- Do not target a keyword another post already owns. Extend the existing post instead.
- Informational pages never use transactional phrasing ("buy", "best price"). They do not show plan prices in the body.

## Trust and E-E-A-T

- Author pages exist before the first post ships (`Person` schema, LinkedIn, photo of the real person).
- At least two external citations to primary sources (documentation, standards bodies, regulators). Add the source and retrieval date.
- No statistic without a source. Remove it if it cannot be sourced.
- No AI-generated text published without a human edit and the first-hand detail added.

## Voice

Peer to peer. We are practitioners sharing what we know. Direct and instructional in how-to steps. See [voice.md](../rules/voice.md).

## Schema

`BlogPosting` with `author`, `datePublished`, `dateModified`. `BreadcrumbList`. `FAQPage` only when it matches the visible FAQ. `HowTo` is not used for Google; it is allowed only if another consumer needs it and it matches the visible steps.

## Internal links (minimum)

Pillar page, one sibling post, the supported money page, and one policy or trust page when relevant (the security or privacy page).

## Pre-ship checklist

- [ ] Intent confirmed by the live results (Learn, not Buy)
- [ ] Answer block under the H1, inside the configured range
- [ ] Real author, review date, next review date in the register
- [ ] Sources cited with retrieval dates
- [ ] First-hand section written, flags cleared
- [ ] Cluster links in place both directions
- [ ] Lint passes, no banned phrase

## Cadence

Publish within `governor.monthlyNewPages`, a cap shared with all plans (one pillar cluster per quarter). Quality bar over volume: a small set of excellent posts beats many thin ones. Review each post every 6 months; time-sensitive posts every month.

## Measure

Impressions and clicks by cluster, assisted conversions to the supported money page, citations in AI answers (spot-check monthly), backlinks earned.
