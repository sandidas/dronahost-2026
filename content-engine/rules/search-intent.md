# Search intent: what a page must show

Sources: [sources.md](sources.md), items 1 and 7. Google tells creators to write for the person who typed the query and to give a complete answer, so the reader does not have to search again. The rater guidelines judge a page by whether it meets what the searcher needed ("Needs Met"). Neither names a checklist, so what follows is **our rule**, not Google's. It turns "serve the intent" into content a tool can check. It cannot promise a ranking.

## The six intents

The names are the ones in [content-writer-workflow.md](content-writer-workflow.md), Stage 1: Learn, Solve, Compare, Buy, Find, Plan. Every page and every brief declares one **primary** intent and may declare one **secondary**.

| Our intent | Rater "Needs Met" interpretation (source 7) | The searcher thinks |
|---|---|---|
| Learn | Know | "I want to understand this" |
| Solve | Know, then Do | "Something is broken" |
| Compare | Know | "Which one should I pick?" |
| Buy | Do | "I want to buy this" |
| Find | Website | "Take me to the brand" |
| Plan | Know | "Help me decide what to do" |
| (Local) | Visit-in-person | Not targeted unless the project has a real local presence |

| Where the intent is declared | Field |
|---|---|
| Brief | `intent_primary`, `intent_secondary` |
| Markdown draft or post | `intent_primary` in the front matter, otherwise the brief's |
| Page spec | `searchIntent`, and `secondaryIntent` when there is one |

## What the engine checks (group Intent)

| Rule | Passes when |
|---|---|
| **IN1** | The page names a primary intent. If a brief exists it names the same one, and the brief records a live-results check (`serp_checked_on`). When the results were unavailable, the brief names who confirmed the intent (`intent_confirmed_by`). |
| **IN2** | The page shows every element its primary intent needs (below). The secondary intent's gaps are warnings. A hidden section does not count: the check reads what a visitor can see. |
| **IN3** | The elements that must come first are in the first screen (the first two visible sections of a page spec, or the first 200 words of an article), and nothing the profile forbids there (a sales link before a Learn answer). |
| **IN4** | No call to action label matches a label the profile says does not fit the intent. This adds to the label rules BP7 and V5. |
| **IN5** | Every question in the brief's "Reader questions" table is answered by a visible heading, FAQ question or item title on the page, named in the table's second column. A row still marked `[HUMAN REVIEW]` fails. A brief with no table fails; a page with no brief is skipped. This is the "does the reader need to search again?" test (source 1). |

## What each intent needs

The words and links are the project's, in `project/profiles.json` (schema: `schemas/profiles.ts`). The list below is the shape every project starts from. It was widened on 2026-10-09 so that a page meets the reader's whole need, not the first element of it.

| Intent | The page must show | First screen |
|---|---|---|
| **Learn** | A direct answer under the H1. Why it matters to the reader. A real example, a mistake to avoid, or a step they can repeat. A source they can check. A link to a next step. | The answer. No sales link. |
| **Solve** | A quick answer. A backup or safety step before the fix. Numbered or named fix steps. A check that the fix worked. The versions and the date the steps were tested. When to ask for help, with a link. | The answer. |
| **Compare** | A one-sentence verdict. The criteria. A table. Where the other option is stronger. The date the facts were checked. Who should choose which option. | The verdict. |
| **Buy** | A price or a link to prices. A risk reducer. Who it is for, by situation. What is included, in words. What happens after the action. How to reach a person. The last doubts answered (a FAQ). One clear primary action. | The primary action. |
| **Find** | One sentence that says what the business is. A direct link to the place the reader wants. The main destinations by situation. How to reach a person. What the business does not do. | The entity sentence and the link. |
| **Plan** | The decision criteria. Who each option suits. A recommendation with its reason. A link to a next step. | None fixed. |

An element is found in one of seven ways, each a detector in the profile: a section type, a field (for example `ctaPrimary`), a text pattern, a link pattern, a heading pattern, a table, or a direct answer. A project edits patterns, not code.

## Reader questions (Needs Met)

The brief lists, under "Reader questions", the questions the reader asks next: from "People also ask", the interview ("what do they worry about first?"), support patterns and the SERP gaps. Each row names the heading, FAQ question or title on the page that answers it. IN5 checks that each named element is visible. The table is the plan for coverage; the FAQ and the headings are where coverage shows. Do not add a question nobody asks to fill the table, and do not answer a question the page cannot answer honestly: leave `[HUMAN REVIEW]` and the page stays a Draft.

## Rules that follow

1. Confirm the intent against the live results before writing. If they disagree with the register, say so and ask the owner (workflow Stage 1).
2. A page serves one primary intent. A second intent is allowed only as a secondary, and its gaps are warnings.
3. Do not add an element to pass a check. If a page cannot honestly show a risk reducer, the fact is missing: leave `[HUMAN REVIEW]` and list it with `npm run content:owed`.
4. Never write a keyword-variant page to catch a second intent. One keyword, one URL, one intent.
5. The first screen serves the intent before it serves the business: the answer before the offer on Learn and Solve pages, the action with its proof on Buy pages, the entity sentence and the route on Find pages. The layout rules are in [trust-and-intent-design.md](trust-and-intent-design.md).

## Warn first

Each rule has a severity in `project/profiles.json`. `warn` shows failures as warnings and does not fail the run. `fail` fails it. New rules start as `warn`; change one to `fail` once the pages are measured and the warnings are understood. A Markdown draft in state Draft only warns on IN2, IN3 and IN5 either way, like the other readiness rules.
