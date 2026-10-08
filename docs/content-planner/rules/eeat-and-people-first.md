# E-E-A-T and people-first content

Sources: [sources.md](sources.md), items 1, 3 and 7. Google says E-E-A-T is a concept used by raters, not a single ranking factor, and that trust matters most. This file turns that into what the engine does and what only a person can supply.

## The test for every page

A page exists to help a named reader with a real problem. The brief states the reader, the problem and the outcome. If the page would make sense only to a search engine, it is not written.

## Who, How, Why (shown on the page)

| Part | What the page shows | Where it comes from |
|---|---|---|
| **Who** | A real author and reviewer with names, linked to an author page | Front matter: `author`, `reviewer`, `reviewed_on`, `next_review_on` |
| **How** | How the page was made: what was tested, with tool and version, and the AI line when AI drafted it | The interview and the disclosure line (`disclosureLine` in `project/rules.config.json`) |
| **Why** | The reader's need the page serves | The brief: reader's problem and goal |

No fake profiles, no invented credentials, no stock photo presented as a team.

## What the engine supplies and what only a person can

| Signal | The engine does | Only a person supplies |
|---|---|---|
| **Experience** | Asks the interview questions, records answers word for word, places them as the "what we saw" section, asks for artifacts | The actual experience and the artifacts |
| **Expertise** | Shows the real author and reviewer, cites primary sources, tests steps against a checklist, records versions and dates | Real credentials and bios |
| **Authoritativeness** | Links to evidence others give (reviews page, press, partners) and to the trust pages | The reputation itself; it builds over time |
| **Trust** | Accuracy checks, no invented facts, honest limits, claims gated, policies linked, business facts only from the project files, a visible review date | Policies, reviews, legal entity facts |

A page with no interview answer for experience cannot reach "Ready for owner review". It stays a draft with the gap named.

## Rules that follow

1. Claude has no first-hand experience. It never writes "in my experience", "we tested" or "our customers say" unless a named person said it in the interview and the words are on file.
2. Every statistic, date and figure maps to the fact ledger ([templates/fact-ledger.json](../templates/fact-ledger.json)) with a source and a retrieval date.
3. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
4. Say when the product is not the right choice. Honest limits build trust.
5. The disclosure line appears on every page where AI produced a substantial part of the draft.
6. Title, description, schema and image alt text are reviewed by a person, not only the body.
