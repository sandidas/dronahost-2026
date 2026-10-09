# Search intent: what a page must show

Sources: [sources.md](sources.md), items 1 and 7. Google tells creators to write for the person who typed the query and to give a complete answer. The rater guidelines judge a page by whether it meets what the searcher needed. Neither names a checklist, so what follows is **our rule**, not Google's. It turns "serve the intent" into content a tool can check. It cannot promise a ranking.

## The six intents

The names are the ones in [content-writer-workflow.md](content-writer-workflow.md), Stage 1: Learn, Solve, Compare, Buy, Find, Plan. Every page and every brief declares one **primary** intent and may declare one **secondary**.

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

## What each intent needs

The words and links are the project's, in `project/profiles.json` (schema: `schemas/profiles.ts`). The list below is the shape every project starts from.

| Intent | The page must show | First screen |
|---|---|---|
| **Learn** | A direct answer under the H1. A link to a next step. | The answer. No sales link. |
| **Solve** | A quick answer. Numbered or named fix steps. A check that the fix worked. When to ask for help, with a link. | The answer. |
| **Compare** | A one-sentence verdict. The criteria. A table. Who should choose which option. | The verdict. |
| **Buy** | A price or a link to prices. A risk reducer. Who it is for. One clear primary action. | The primary action. |
| **Find** | A direct link to the place the reader wants. | The link. |
| **Plan** | The decision criteria. A recommendation with its reason. A link to a next step. | None fixed. |

An element is found in one of seven ways, each a detector in the profile: a section type, a field (for example `ctaPrimary`), a text pattern, a link pattern, a heading pattern, a table, or a direct answer. A project edits patterns, not code.

## Rules that follow

1. Confirm the intent against the live results before writing. If they disagree with the register, say so and ask the owner (workflow Stage 1).
2. A page serves one primary intent. A second intent is allowed only as a secondary, and its gaps are warnings.
3. Do not add an element to pass a check. If a page cannot honestly show a risk reducer, the fact is missing: leave `[HUMAN REVIEW]` and list it with `npm run content:owed`.
4. Never write a keyword-variant page to catch a second intent. One keyword, one URL, one intent.

## Warn first

Each rule has a severity in `project/profiles.json`. `warn` shows failures as warnings and does not fail the run. `fail` fails it. New rules start as `warn`; change one to `fail` once the pages are measured and the warnings are understood. A Markdown draft in state Draft only warns on IN2 and IN3 either way, like the other readiness rules.
