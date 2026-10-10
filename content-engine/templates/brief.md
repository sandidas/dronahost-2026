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
created_on: <YYYY-MM-DD, the day the brief was started; the governor counts briefs by month>
serp_checked_on: <YYYY-MM-DD or unavailable>
intent_confirmed_by: <owner name; required only when serp_checked_on is unavailable, otherwise remove this line>
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

## 4b. Reader questions (what the page must answer)

The questions the reader asks next, so they do not have to search again: from "People also ask", the interview ("what do they worry about first?"), support patterns and the gaps in section 3. One row per question. The second column names the heading, FAQ question or item title on the page that answers it; `check-content` rule IN5 looks for that text on the page. Do not add a question nobody asks. A question the page cannot answer honestly stays `[HUMAN REVIEW: ...]` and keeps the page a Draft.

| Question | Answered on the page by |
|---|---|
| | |

## 5. Human first (owner)

- The reader's real question:
- Our angle:

## 6. Original element (owner)

The one thing this page has that others lack (a real screenshot, log, test result, checklist or table of sourced data), taken from the interview artifacts. If none exists: `[HUMAN REVIEW: original element]` and the page stays a draft.

## 6b. Experience shown on the page

Which first-hand element a visitor will **see** (trust rule TR7): a real result, a real review, a measured number, a real screenshot, a "what we saw" section, or a decision we made and why (recorded in the decisions file). Name the section. If none can show yet, write what would unhide one; `npm run content:owed` lists it.

## 7. Interview answers (verbatim)

Copied from the interview record ([interview.md](interview.md)): question, the owner's exact words, the date, the artifact or "none". Unanswered: `GAP: <question>`; the section that needed it is dropped from the outline.

## 8. Fact ledger

Path of the ledger file (`<facts folder>/<slug>.json`) and a count: verified N, needs check N. The draft may use only ledger facts, interview answers and claims that render.

## 9. Claims, plans and prices needed

- Claim ids and whether each renders today:
- Plans and prices read from the pricing file (never typed):

## 10. Who, How, Why (shown on the page)

- Who: author and reviewer, linked to the author page. On a page spec: the provenance section (named reviewer, role, date) and the About and Contact links.
- How: how it was made, including the AI line and what was tested. On a page spec: the one-sentence "how we check facts" line.
- Why: the reader's need.

## 10b. People-first self-assessment (reviewer, before approval and again at handoff)

Google's own questions for a page, in our words ([rules/eeat-and-people-first.md](../rules/eeat-and-people-first.md), "Google's self-assessment"). Answer each with **one line of evidence** from the page or a check result. No scores. A "no" with no fix planned keeps the page a Draft.

| Question | Yes or no | Evidence |
|---|---|---|
| Original information or analysis, not a rewrite of the top results? | | |
| Complete for the reader's question, so they will not search again (section 4b all answered)? | | |
| Title and H1 descriptive, not exaggerated? | | |
| A page you would bookmark or recommend to a friend with this problem? | | |
| Clear sourcing, and background about who is behind the page (byline or provenance, About link)? | | |
| Written or reviewed by a named person who knows the topic? | | |
| No easily verified factual error (every number in the ledger)? | | |
| First-hand experience visible on the page (section 6b)? | | |
| Made for our audience with one clear purpose, not to catch a keyword? | | |
| Nothing dated or padded to look fresh or long? | | |
| Honest limits stated; no pressure wording? | | |

## 11. Outline

H1, then H2 and H3 following the intent pattern in the workflow. Each H2 states its direct answer in one line. Recommended length: the blueprint's `words` range and the reason (a guide, not a rule; under the blueprint minimum is flagged thin, and under 300 words only when no blueprint applies).

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
