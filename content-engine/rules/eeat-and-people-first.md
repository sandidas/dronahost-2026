# E-E-A-T and people-first content

Sources: [sources.md](sources.md), items 1, 3 and 7. Google says E-E-A-T is a concept used by raters, not a single ranking factor, and that trust matters most. This file turns that into what the engine does and what only a person can supply. The layout side (where trust shows on the page) is in [trust-and-intent-design.md](trust-and-intent-design.md).

## The test for every page

A page exists to help a named reader with a real problem. The brief states the reader, the problem and the outcome. If the page would make sense only to a search engine, it is not written.

## Google's self-assessment, answered by the engine

Google's helpful-content page asks site owners to assess their own pages ([sources.md](sources.md), item 1, re-read 2026-10-09). Each question has a home in the engine. The brief asks them in order ("People-first self-assessment"); the reviewer answers with one line of evidence, never with a score.

| Google asks (in our words) | Where the engine answers it |
|---|---|
| Original information, research or analysis? | Information gain line in the brief, and the original element |
| A complete answer, beyond the obvious, so the reader does not search again? | The reader-questions table in the brief, checked by IN5 |
| Not a copy or rewrite of other sources? | OV1 and OV2, and the fact ledger |
| A descriptive title and heading, not exaggerated or shocking? | M1, V-group, TR3 and TR8 |
| A page you would bookmark, share or expect in a printed reference? | The reviewer's line in the self-assessment (no tool can judge it) |
| Not sloppy, not mass-produced? | Voice checks; the governor caps volume |
| Clear sourcing, evidence of expertise, background about the author or the site, with links to an author page or About page? | TR1 (who is responsible), TR6 (visible provenance), SO1 (sources) |
| Written or reviewed by someone who demonstrably knows the topic? | The interview, the byline and the reviewer |
| No easily verified factual errors? | The fact ledger and the fact-checker role |
| First-hand expertise shown, for example from having used the product? | Interview answers on articles; TR7 (a visible first-hand element) on pages |
| Made for an existing audience, with one clear purpose? | The brief's reader and one primary intent (IN1) |
| Not written to a word count, not dated to look fresh, not changed only to look fresh? | Length is a guide only (BP11); the visible review date moves only when a person rechecks the page (TR6 compares it with the record) |
| Who made it, how, and why? | The Who, How, Why block below |

## Who, How, Why (shown on the page)

| Part | What the page shows | Where it comes from |
|---|---|---|
| **Who** | Articles: a real author and reviewer with names, linked to an author page. Page specs: the provenance section (a named reviewer with a role) and the site's About and Contact pages | Front matter: `author`, `reviewer`, `reviewed_on`, `next_review_on`. Page specs: the `PageProvenance` section and `rules.reviewedOn` |
| **How** | How the page was made: what was tested, with tool and version, the AI line when AI drafted it, and on page specs one sentence on how its facts are checked | The interview, the disclosure line (`disclosureLine` in `project/voice.json`), the provenance `howLine` |
| **Why** | The reader's need the page serves | The brief: reader's problem and goal |

No fake profiles, no invented credentials, no stock photo presented as a team, no team name in place of a person.

## What the engine supplies and what only a person can

| Signal | The engine does | Only a person supplies |
|---|---|---|
| **Experience** | Asks the interview questions, records answers word for word, places them as the "what we saw" section, asks for artifacts, and checks that one first-hand element is visible on the page (TR7) | The actual experience and the artifacts |
| **Expertise** | Shows the real author and reviewer, cites primary sources, tests steps against a checklist, records versions and dates | Real credentials and bios |
| **Authoritativeness** | Links to evidence others give (reviews page, press, partners) and to the trust pages | The reputation itself; it builds over time |
| **Trust** | Accuracy checks, no invented facts, honest limits, claims gated, policies linked, business facts only from the project files, a visible review date and reviewer, no pressure wording | Policies, reviews, legal entity facts |

A page with no interview answer for experience cannot reach "Ready for owner review". It stays a draft with the gap named. A page spec with no visible first-hand element shows the gap in `npm run content:owed`.

## Trust checks on every page (group Trust)

The checks above apply to articles (P1 to P3, E1 to E3, SO1). A page spec has no author or interview, so trust has to show another way. These rules run on page specs and articles. The data (which links, which wording, which page types) is the project's, in `project/profiles.json`. Each rule has a severity, `warn` first and then `fail` (see [search-intent.md](search-intent.md), "Warn first").

| Rule | Passes when | Why |
|---|---|---|
| **TR1** | A link to a page that says who is responsible (About or Contact) is on the page or in the site-wide navigation file named in the profile | Raters look for who is responsible for the site and how to reach them (source 7) |
| **TR2** | A page that asks for money links at least the minimum number of policy pages it relies on | Readers check the terms before they pay; a promise with its source is verifiable |
| **TR3** | Wording that claims authority ("the best", "fastest", "trusted by", "award-winning") has a source link in the same section or paragraph, or a fact in the ledger | A claim with no proof is the first thing a careful buyer distrusts |
| **TR4** | A product, decision or landing page says who it is not for or what it does not cover (an `HonestLimits` section, or the wording the profile lists) | Honest limits build trust (rule 4 below) |
| **TR5** | The page was reviewed within the profile's limit (days) | A maintained page is a trustworthy page |
| **TR6** | The page shows who reviewed it, when, and how to report an error: a byline on an article, a provenance section on a page spec. On a page spec the visible date equals `rules.reviewedOn`, so the date cannot be changed to look fresh without a record | Google asks for background about who is behind the page and warns against changing dates to seem fresh (source 1) |
| **TR7** | One first-hand element is visible: a real result, a real review, a measured number, a real screenshot, a "what we saw" section, an interview-cited sentence, or a decision we made and why (an item marked `firstHand`). Hidden sections do not count | Experience is the first E. A page whose proof is all hidden has none to show (sources 1 and 7) |
| **TR8** | No wording that pressures or misleads: fake urgency, invented scarcity, "no questions asked", countdowns | Deceptive design rates Lowest (source 7); fake urgency destroys trust with careful buyers |

TR3 reads the page, not the gating of single items inside a section. Do not use it to excuse an unsourced claim: if a claim has no source, either find the source or remove the claim. TR7 is a readiness rule: it warns in a Draft and fails once the page claims to be ready.

## What only a person can supply, listed by the engine

`npm run content:owed` prints, per page, which sections are hidden and the facts or content that would show them, grouped by who must supply them (identity, prices, measured numbers, reviews, a case study, a screenshot, the editorial policy page). It adds no facts. Use it in place of a hand-written list, so the list is the same every run.

## Rules that follow

1. Claude has no first-hand experience. It never writes "in my experience", "we tested" or "our customers say" unless a named person said it in the interview and the words are on file.
2. Every statistic, date and figure maps to the fact ledger ([templates/fact-ledger.json](../templates/fact-ledger.json)) with a source and a retrieval date.
3. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
4. Say when the product is not the right choice. Honest limits build trust. On a page spec, use the `HonestLimits` section; a decision we made and its reason may be marked `firstHand` only when the decision is recorded in the project's decisions file.
5. The disclosure line appears on every page where AI produced a substantial part of the draft.
6. Title, description, schema and image alt text are reviewed by a person, not only the body.
7. The visible review date changes only when a person has rechecked the whole page. Editing a section does not move the date; the handoff asks the owner to recheck and set it.
8. Provenance names a person, never "the team". If no person will put their name to the page, the page is not ready.
