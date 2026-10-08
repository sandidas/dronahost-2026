# Plan 02: Commercial Investigation (comparisons and alternatives)

**Intent:** the searcher is choosing between providers and distrusts hype. They want facts, a verdict and the catch.
**Goal:** earn trust by being fair, then convert the reader who is a good fit.
**Owns:** `vs`, `alternative`, `compare` and "best for [use case]" queries.

## Pages

| Type | URL | Status | Seed keyword (unvalidated) |
|---|---|---|---|
| Head-to-head | `/vs/[competitor]` | route exists, no content yet | [brand] vs [competitor] |
| Alternatives | `/alternatives/[competitor]` | planned | [competitor] alternative |
| Use-case pick | `/best/[use-case]` | planned, later | wordpress hosting for agencies compared |
| Pricing comparison | section on `/pricing` | planned | hosting renewal price comparison |

### Competitor seed list

Start with providers our audience already compares, grouped by product type. Order of work: pick the competitors whose "alternative" queries have the lowest difficulty and whose users complain about price at renewal, support or speed. Validate before writing.

Project specifics for this plan: [plan-specifics/02-commercial-investigation.md](../project/plan-specifics/02-commercial-investigation.md) (named competitor list, gate).

## Keyword seeds

Target:
- `[competitor] alternative`, `[competitor] alternative for small business`
- `[brand] vs [competitor]` (low volume now, builds the page set)
- `[competitor] renewal price`, `[competitor] vs [competitor] for wordpress` (only if we can add real value)
- `wordpress hosting for agencies compared`

Do not target:
- `best web hosting`, `best wordpress hosting`: head terms dominated by affiliate sites, and we would be judge and seller
- `[competitor] review` as a standalone page: review intent is navigational to the competitor, and we cannot be neutral

> **Gate:** comparison pages stay closed until every claim about [Brand] and each competitor is verified. Draft pages offline, publish when the owner opens the gate (flag details in project specifics).

## Honesty rules (these protect trust and legal risk)

1. Every competitor fact has a **source URL and a retrieval date** stored with the data. No source, no claim.
2. Page shows `Reviewed on [date]` from the `reviewedOn` field. A year in the title is allowed only from that field.
3. State **when the competitor is the better choice**. Example reasons: a feature we do not offer, a lower entry price, an existing relationship. This single section builds more trust than any claim.
4. No claim about a competitor's speed, uptime or support that we did not measure with a published method.
5. Use competitor names only to identify them. No logos without permission, no disparaging adjectives.
6. Our own claims follow the same gates as every page. If `uptime-sla` does not render, the table row says "See our SLA" or is removed.
7. Re-check every comparison each quarter and on any competitor price change.

## Page template: `/vs/[competitor]`

| # | Block | Rule |
|---|---|---|
| 1 | H1 and one-sentence verdict | "[Brand] vs [Competitor]: [who each suits]". The verdict is one sentence an AI tool can quote. |
| 2 | Summary table | 6 to 10 rows. Price (signup and renewal), WordPress features, backups, support channels, migration, data locations (verified only), money-back terms. Each cell has a source or reads "not stated". |
| 3 | Where [Competitor] is stronger | At least two honest points. |
| 4 | Where [Brand] is stronger | Only points with proof or a verified claim. |
| 5 | Who should choose which | Two short paragraphs by audience type. |
| 6 | Moving from [Competitor] | Link to `/migration`. Describe our migration process using the `migration-process` claim only. |
| 7 | Price, in plain terms | Signup vs renewal for both, from sourced data and `pricing.json`. |
| 8 | FAQ | 5 to 6 questions in buyer language: "Is it hard to move from [Competitor]?" |
| 9 | CTA | One primary: see the matching plan. Secondary text link to `/contact`. |

### `/alternatives/[competitor]`

Same honesty rules. Open with the reasons people leave (price at renewal, support wait, limits), then compare [Brand] and 2 or 3 other alternatives fairly, including providers that are not us. A page that lists only us is a sales page and will not rank.

## Keyword placement and metadata

- Title: `[Brand] vs [Competitor]: [Axis]` kept under 60 characters with the suffix.
- Meta description: the verdict in one sentence, then the date reviewed.
- H2s use the questions buyers ask: "Is [Competitor] cheaper at renewal?"

## Schema

`WebPage` with `BreadcrumbList`, and `FAQPage` matching the visible FAQ. Use `Product` markup only for our own plans, never for the competitor.

## Internal links (minimum)

Matching product page, `/pricing`, `/migration`, `/contact`, the regional page when the competitor is regional, one blog guide on switching hosts.

## Pre-ship checklist

- [ ] Every competitor cell has a source and date
- [ ] At least two honest points in the competitor's favour
- [ ] No unverified [Brand] claim in the table
- [ ] `reviewedOn` set, next review date in the register
- [ ] Verdict sentence stands alone as a quote
- [ ] Legal read for any claim that could be seen as disparaging
- [ ] Lint and page checks pass

## Measure

Primary: clicks to the matching plan page and migration requests. Secondary: position for the alternative keyword, time on page, return visits to `/pricing`.
