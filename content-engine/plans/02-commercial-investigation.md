# Plan 02: Commercial Investigation (comparisons and alternatives)

**Intent:** the searcher is choosing between providers and distrusts hype. They want facts, a verdict and the catch.
**Goal:** earn trust by being fair, then convert the reader who is a good fit.
**Owns:** `vs`, `alternative`, `compare` and "best for [use case]" queries.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages; Stage 4 output is page-spec copy on the comparison blueprint, not an article. A comparison of concepts (not providers) is an article under [Plan 03](03-informational.md). This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Compare.
- **Interview:** The **Comparison** bank in [interview-questions.md](../rules/interview-questions.md).
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). Use it only when it matches the visible content and helps the reader.

## Pages

| Type | URL | Seed keyword shape (unvalidated) |
|---|---|---|
| Head-to-head | `/vs/[competitor]` | [brand] vs [competitor] |
| Alternatives | `/alternatives/[competitor]` | [competitor] alternative |
| Use-case pick | `/best/[use-case]` | best [product] for [use case], [product] for [audience] compared |
| Pricing comparison | a section on the pricing page | [product] renewal price comparison |

Status of each page in this project: the project's plan-specifics for this plan.

### Competitor seed list

Start with providers our audience already compares, grouped by product type. Order of work: pick the competitors whose "alternative" queries have the lowest difficulty and whose users complain about price at renewal, support or speed. Validate before writing.

Project specifics for this plan: [plan-specifics/02-commercial-investigation.md](../project/plan-specifics/02-commercial-investigation.md) (named competitor list, gate).

## Keyword seeds

Target:
- `[competitor] alternative`, `[competitor] alternative for small business`
- `[brand] vs [competitor]` (low volume now, builds the page set)
- `[competitor] renewal price`, `[competitor] vs [competitor] for [platform]` (only if we can add real value)
- `best [product] for [use case]`, `[product] for [audience] compared`

Do not target:
- `best [product category]` with no use case: head terms dominated by affiliate sites, and we would be judge and seller
- `[competitor] review` as a standalone page: review intent is navigational to the competitor, and we cannot be neutral

> **Gate:** comparison pages stay closed until every claim about [Brand] and each competitor is verified. Draft pages offline, publish when the owner opens the gate (flag details in project specifics).

## Honesty rules (these protect trust and legal risk)

1. Every competitor fact has a **source URL and a retrieval date** stored with the data. No source, no claim.
2. Page shows `Reviewed on [date]` from the `reviewedOn` field. A year in the title is allowed only from that field.
3. State **when the competitor is the better choice**. Example reasons: a feature we do not offer, a lower entry price, an existing relationship. This single section builds more trust than any claim.
4. No claim about a competitor's speed, uptime or support that we did not measure with a published method.
5. Use competitor names only to identify them. No logos without permission, no disparaging adjectives.
6. Our own claims follow the same gates as every page. If the uptime claim does not render, the table row says "See our SLA" or is removed.
7. Re-check every comparison each quarter and on any competitor price change.

## Page template: `/vs/[competitor]`

| # | Block | Rule |
|---|---|---|
| 1 | H1 and one-sentence verdict | "[Brand] vs [Competitor]: [who each suits]". The verdict is one sentence an AI tool can quote. |
| 2 | Summary table | Rows and columns within the `ComparisonTable` limits in [page-blueprints.md](../rules/page-blueprints.md), the single source. Price (signup and renewal), [Product] features, backups, support channels, migration, data locations (verified only), money-back terms. Each cell has a source or reads "not stated". |
| 3 | Where [Competitor] is stronger | At least two honest points. |
| 4 | Where [Brand] is stronger | Only points with proof or a verified claim. |
| 5 | Who should choose which | Two short paragraphs by audience type. |
| 6 | Moving from [Competitor] | Link to the migration page. Describe our migration process using the migration process claim only. |
| 7 | Price, in plain terms | Signup vs renewal for both, from sourced data and the pricing file. |
| 8 | FAQ | Count per `limits.faqItemsByArchetype` in the config, questions in buyer language: "Is it hard to move from [Competitor]?" |
| 8a | Honest limits | `HonestLimits`: what we do not do, before the action. |
| 8b | Provenance | `PageProvenance`: named reviewer, review date, how facts were checked. |
| 9 | CTA | `CTABand`. One primary: see the matching plan. Secondary text link to the contact page. |

### `/alternatives/[competitor]`

Same honesty rules. Open with the reasons people leave (price at renewal, support wait, limits), then compare [Brand] and 2 or 3 other alternatives fairly, including providers that are not us. A page that lists only us is a sales page and will not rank.

## Keyword placement and metadata

- Title: `[Brand] vs [Competitor]: [Axis]` kept inside the title limits in the config, measured with the suffix (warn above 60 characters, fail above 70).
- Meta description: the verdict in one sentence, then the date reviewed.
- H2s use the questions buyers ask: "Is [Competitor] cheaper at renewal?"

## Schema

`WebPage` with `BreadcrumbList`, and `FAQPage` matching the visible FAQ. Use `Product` markup only for our own plans, never for the competitor.

## Internal links (minimum)

Matching product page, the pricing page, the migration page, the contact page, the regional page when the competitor is regional, one blog guide on switching hosts.

## Pre-ship checklist

- [ ] Every competitor cell has a source and date
- [ ] At least two honest points in the competitor's favor
- [ ] No unverified [Brand] claim in the table
- [ ] `reviewedOn` set, next review date in the register
- [ ] Verdict sentence stands alone as a quote
- [ ] Legal read for any claim that could be seen as disparaging
- [ ] Lint and page checks pass

## Measure

Primary: clicks to the matching plan page and migration requests. Secondary: position for the alternative keyword, time on page, return visits to the pricing page.
