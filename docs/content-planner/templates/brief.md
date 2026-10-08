---
slug: </path-from-the-register>
plan: <plan number and name>
locale: <en-US>
primary_keyword: <exact register keyword>
secondary_keywords: <phrase one; phrase two>
intent_primary: <Learn | Solve | Compare | Buy | Find | Plan>
intent_secondary: <none or one of the same>
buying_stage: <early | middle | late | none>
state: Brief
governor_in_flight: <N>
governor_in_flight_max: <from the config>
governor_month_count: <N>
governor_month_cap: <from the config>
governor_paused: <true | false>
serp_checked_on: <YYYY-MM-DD or unavailable>
information_gain_status: <confirmed | not-confirmed>
original_element: <artifact | flag>
interview_status: <not-started | gaps | complete>
approval_1: pending
approved_on:
ai_used: <yes | no>
owner: <name>
reviewer: <name>
next_review_on: <YYYY-MM-DD>
---
# Brief: <primary keyword>

Status: **waiting for APPROVAL 1.** No draft before approval. Fields marked (owner) are supplied by a person, never by Claude.

## 1. Keywords and intent

- Primary / secondary keywords (from the register), semantic terms, entities, question keywords.
- Intent: primary, secondary, the reader's problem, the reader's goal, the expected format, the buying stage.

## 2. Governor status

| Item | Value |
|---|---|
| In flight (register rows briefed, drafting or review) | N of <max> |
| New briefs this month | N of <cap> |
| Pause switch | off |
| Result | A new brief may start / refused because ... |

## 3. SERP snapshot

Date checked, locale, and a table: result URL, page type. Then: dominant page type, common topics (own words), questions people ask, recurring entities and terms, typical depth, gaps and weaknesses. If web access was unavailable, write "SERP analysis unavailable" and ask the owner to confirm the intent.

## 4. Information gain

- Gap in the top results (with the URLs checked):
- Our gain, in one sentence ("Unlike the top results, this page ..."):
- Real material behind it (interview answer numbers, artifact, sourced table):
- Status: confirmed by owner / not confirmed. No gain: drop or merge the keyword.

## 5. Human first (owner)

- The reader's real question:
- Our angle:

## 6. Original element (owner)

The one thing this page has that others lack (a real screenshot, log, test result, checklist or table of sourced data), taken from the interview artifacts. If none exists: `[HUMAN REVIEW: original element]` and the page stays a draft.

## 7. Interview answers (verbatim)

Copied from the interview record ([interview.md](interview.md)): question, the owner's exact words, the date, the artifact or "none". Unanswered: `GAP: <question>`; the section that needed it is dropped from the outline.

## 8. Fact ledger

Path of the ledger file (`<facts folder>/<slug>.json`) and a count: verified N, needs check N. The draft may use only ledger facts, interview answers and claims that render.

## 9. Claims, plans and prices needed

- Claim ids and whether each renders today:
- Plans and prices read from the pricing file (never typed):

## 10. Who, How, Why (shown on the page)

- Who: author and reviewer, linked to the author page.
- How: how it was made, including the AI line and what was tested.
- Why: the reader's need.

## 11. Outline

H1, then H2 and H3 following the intent pattern in the workflow. Each H2 states its direct answer in one line. Recommended length: a range and the reason (a guide, not a rule; under 300 words is flagged thin).

## 12. Headline (money, service, regional and landing pages only)

Reason-led version and fallback.

## 13. Tool or table needed

Rules sections 9 and 10, or "none".

## 14. Internal links (3 or more)

| Anchor text | Target page | Why it helps the reader |
|---|---|---|

## 15. CTA

One only, from the CTA-by-intent table in the workflow, and why it fits.

## 16. Schema

From the plan. Must match the visible content.

## 17. Metadata draft

Title (measured with the brand suffix: warn above 60 characters, fail above 70). Description (warn above 160; fail only if missing or duplicate).

## 18. People and review

Owner, reviewer (the owner until a second person exists), next review date, AI used for the draft (yes or no).

## 19. Open flags

Every `[HUMAN REVIEW]` item, each with who can supply it.

## 20. APPROVAL 1

Owner approves the brief and the interview answers: **pending**. Date and name when approved.
