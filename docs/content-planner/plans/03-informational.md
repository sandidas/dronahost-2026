# Plan 03: Informational (guides and explainers)

**Intent:** the searcher wants to learn. They are not buying today, but they will remember who explained it clearly.
**Goal:** earn trust and citations, build topical authority, and pass readers to money pages without pressure.
**Owns:** `what is`, `how to`, `guide`, `checklist`, `explained`, `vs` between concepts (not between providers).

For broken-site queries ("my site is slow", "hacked", "error 500") use [Plan 04](04-problem-and-troubleshooting.md).

## Principle: win the long tail, cite the pillars

Head terms like "what is web hosting" are held by large brands and Wikipedia. We target specific, practical questions where an expert answer is rare, then connect them into clusters.

## Pillar and cluster map (seeds, unvalidated)

| Pillar (hub page) | Cluster posts | Money page it supports |
|---|---|---|
| WordPress performance | how to improve ttfb on wordpress; wordpress core web vitals fixes; what does litespeed cache do; nvme vs ssd for websites | `/wordpress-hosting` |
| WordPress security | how to harden wordpress; wordpress backup strategy; what is malware scanning; how to enable two-factor login | `/wordpress-hosting`, `/security` |
| Moving a site | how to migrate wordpress without downtime; migration checklist; how to lower dns ttl before a move | `/migration` |
| Choosing hosting | shared vs vps vs cloud explained; do I need managed wordpress hosting; how much traffic can my plan handle | `/pricing`, product pages |
| VPS basics | what is root access; how to secure a vps; when to move from shared to vps | `/vps-hosting` |
| Domains and DNS | how dns works; how to point a domain to a new host; what is whois privacy | `/domains` |
| Privacy for site owners | gdpr checklist for small business sites; cookie banner requirements; what is a data processing agreement | `/data-processing`, `/privacy` |
| Next.js and modern stacks | how to host a nextjs app on a vps; nextjs vs wordpress for a business site | `/cloud-hosting`, custom development |

Rule: publish the **pillar and 3 cluster posts together**, so the cluster links exist at launch.

## Formats

| Format | When | Shape |
|---|---|---|
| How-to | "how to ..." | Answer, prerequisites, numbered steps, check that it worked, FAQ. `HowTo` schema optional. |
| Explainer | "what is ..." | One-sentence definition, why it matters to a business owner, an example, common mistakes. |
| Checklist | "checklist for ..." | A short intro, a scannable list, a downloadable or printable version if useful. |
| Comparison of concepts | "shared vs vps" | Table first, verdict second, edge cases third. |
| Glossary entry | term lookups | 40 to 80 word definition, one example, links to related terms. Lives at `/kb/glossary/[term]`. |

## Human-first fields (before any draft)

Fill these in the brief first: the reader's real question, our angle, what we know first-hand, the one original element, and the sources to verify ([content-writing-rules.md](../rules/content-writing-rules.md) section 8). If "what we know first-hand" is empty, the post is not ready to write. Guides carry a byline and reviewer, and an "AI-assisted" line when AI produced most of the first draft.

## Page template

1. **H1** that is the question or task in plain words.
2. **Answer first:** 40 to 80 words directly under the H1. A reader who stops here still got the answer.
3. **Who this is for** (one sentence) and the time it takes, if a task.
4. **Body** in H2 sections, each opening with its own direct answer. Short paragraphs, one idea each.
5. **First-hand detail:** at least one real scenario from running sites, with a named tool and outcome. Flag `[HUMAN REVIEW: add first-hand insight]` until added.
6. **Soft product link:** one natural mention where the product solves the problem. Never in the first 150 words, never as a banner.
7. **FAQ:** 4 to 6 questions in conversational form.
8. **Author box and review date:** real name, role, credentials, link to the author page. "Reviewed on [date]".

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

`BlogPosting` with `author`, `datePublished`, `dateModified`. `BreadcrumbList`. `HowTo` for tutorials and `FAQPage` for the FAQ only when they match visible content.

## Internal links (minimum)

Pillar page, one sibling post, the supported money page, and one policy or trust page when relevant (`/security`, `/privacy`).

## Pre-ship checklist

- [ ] Intent confirmed by the live results (informational, not commercial)
- [ ] Answer in the first 80 words
- [ ] Real author, review date, next review date in the register
- [ ] Sources cited with retrieval dates
- [ ] First-hand section written, flags cleared
- [ ] Cluster links in place both directions
- [ ] Lint passes, no banned phrase

## Cadence

Plan 4 posts per month to start (one pillar cluster per quarter). Quality bar over volume: a small set of excellent posts beats many thin ones. Review each post every 6 months; time-sensitive posts every month.

## Measure

Impressions and clicks by cluster, assisted conversions to the supported money page, citations in AI answers (spot-check monthly), backlinks earned.
