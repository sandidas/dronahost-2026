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

## Trust checks on every page (group Trust)

The checks above apply to articles (P1 to P3, E1 to E3, SO1). A page spec has no author or interview, so trust has to show another way. These rules run on page specs and articles. The data (which links, which wording, which page types) is the project's, in `project/profiles.json`. Each rule has a severity, `warn` first and then `fail` (see [search-intent.md](search-intent.md), "Warn first").

| Rule | Passes when | Why |
|---|---|---|
| **TR1** | A link to a page that says who is responsible (About or Contact) is on the page or in the site-wide navigation file named in the profile | Raters look for who is responsible for the site and how to reach them (source 7) |
| **TR2** | A page that asks for money links at least the minimum number of policy pages it relies on | Readers check the terms before they pay; a promise with its source is verifiable |
| **TR3** | Wording that claims authority ("the best", "fastest", "trusted by", "award-winning") has a source link in the same section or paragraph, or a fact in the ledger | A claim with no proof is the first thing a careful buyer distrusts |
| **TR4** | A product, decision or landing page says who it is not for or what it does not cover | Honest limits build trust (rule 4 below) |
| **TR5** | The page was reviewed within the profile's limit (days) | A maintained page is a trustworthy page |

TR3 reads the page, not the gating of single items inside a section. Do not use it to excuse an unsourced claim: if a claim has no source, either find the source or remove the claim.

## What only a person can supply, listed by the engine

`npm run content:owed` prints, per page, which sections are hidden and the facts or content that would show them, grouped by who must supply them (identity, prices, measured numbers, reviews, a case study, a screenshot). It adds no facts. Use it in place of a hand-written list, so the list is the same every run.

## Rules that follow

1. Claude has no first-hand experience. It never writes "in my experience", "we tested" or "our customers say" unless a named person said it in the interview and the words are on file.
2. Every statistic, date and figure maps to the fact ledger ([templates/fact-ledger.json](../templates/fact-ledger.json)) with a source and a retrieval date.
3. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
4. Say when the product is not the right choice. Honest limits build trust.
5. The disclosure line appears on every page where AI produced a substantial part of the draft.
6. Title, description, schema and image alt text are reviewed by a person, not only the body.
