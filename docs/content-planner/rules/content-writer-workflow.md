# Content writer workflow (stages 0 to 7)

The master workflow for every writing task. The owner gives **a keyword or a page title**. The engine does everything that can honestly be automated, asks the owner for what only a person has, and hands back a page that is **ready for owner review**. It never says "publish-ready". The owner publishes.

Related files: [governor.md](governor.md) (limits), [information-gain.md](information-gain.md), [interview-questions.md](interview-questions.md), [eeat-and-people-first.md](eeat-and-people-first.md), [ai-search.md](ai-search.md), [quality-rubric.md](quality-rubric.md), [sources.md](sources.md), and the templates in [../templates/](../templates/).

## Scope

| Page type | Use the workflow as | Template |
|---|---|---|
| Guides and explainers (Plan 03), fix articles (04), comparisons (02), compliance explainers (07), migration and email guides (14) | All stages, 0 to 7. The output is an article | The plan's page template, and [front-matter.md](../templates/front-matter.md) |
| Money pages (01), regional (05), services (06), domains (08), brand and trust (09), policy pages (07) | Stages 0 to 3 and 5 to 7. The copy goes into the page spec, not an article | The plan's template, and [page-skeleton.json](../templates/page-skeleton.json) |

## Inputs

The only input is **a primary keyword or a page title**, plus optional notes. Everything else comes from the project, through `content-planner.config.json`:

| Input | Source |
|---|---|
| Business, audience, location, tone | `project/PROJECT.md`, `project/brand.md`, [voice.md](voice.md) |
| Secondary keywords, URL, plan, owner | The keyword register |
| Prices and plans | The pricing file |
| Guarantees, support, features | The claims registry (only claims that render) |
| Limits, banned lists, governor caps | `content-planner.config.json`, `project/rules.config.json` |

**Missing information is never inferred.** It becomes `[HUMAN REVIEW: <what is needed>]`. A page ships with none open, except a Draft, which lists them in the handoff.

---

## Stage 0: Resolve and gate

### 0.1 Keyword or title

- **A keyword** is used as given.
- **A title** (for example "How to speed up my WordPress site") is turned into a keyword: take the plain phrase a searcher would type, in lowercase, and check it against the register. Show the derived keyword **and the reason**, then **ask the owner to confirm before going on**. Do not continue on an unconfirmed keyword.

### 0.2 Gate

Stop and report, naming the failed line, if any of these fail:

- [ ] The keyword has a register row with a target URL (or `planned`), and no other page owns it. Look-alike phrases belong in the owning row's Secondary column.
- [ ] The keyword is not in "Excluded keywords", and not a variant of a page that already answers it (cannibalization).
- [ ] The plan that owns it is clear (README table), and the locale and URL fit the register.
- [ ] **The governor allows it** ([governor.md](governor.md)): in flight under the cap, new briefs this month under the cap, not paused.
- [ ] The facts the page needs exist in project files, or are listed as missing.
- [ ] If it touches a Tier B legal topic, say so now: a qualified human must review it, and Claude never publishes it.

## Stage 1: Classify the intent

Classify before anything else. Do not assume the keyword is informational.

| Intent | Meaning | Plan that owns it | Notes |
|---|---|---|---|
| Learn | wants to understand | 03 (also 07 explainers, 14 guides) | |
| Solve | wants to fix something | 04 | |
| Compare | wants to choose between options | 02 (a comparison of concepts is 03) | Any feature gate in the plan applies |
| Buy | wants to buy or hire | 01 products, 06 services, 08 domains | Page spec, not an article |
| Find | wants a specific place | 09 | Direct link answer |
| Plan | wants help deciding what to do | 03 and 10, plus a plan-finder tool | |
| Local | wants a local business | **Not targeted** unless the project has a real local presence. "Near me" is excluded | Region queries go to Plan 05 |

Record the primary and secondary intent, the reader's likely problem and goal, the expected format and the buying stage. Confirm against the live results (Stage 2). If the results disagree with the register's intent, say so and ask the owner.

## Stage 2: Research and fact ledger

### 2.1 SERP snapshot

If web access is available, read the current results and record, in the brief:

| Field | What to write |
|---|---|
| Date checked, locale | |
| Top results | Up to 8 URLs with the page type of each (product, comparison, guide, fix, policy, service, brand) |
| Dominant page type and intent | |
| Common H2 topics | In your own words. Do not copy headings |
| Questions people ask | From "People also ask" and related searches, if the tool shows them |
| Entities and terms that recur | Tools, standards, products |
| Typical depth | Short, medium, long, and why |
| Gaps and weaknesses | What is missing, outdated, vague or wrong |
| Our angle | The gap we can honestly fill, using the owner's first-hand material |

Use it to learn what readers expect, never to copy. If web access is unavailable, write "SERP analysis unavailable", infer the intent from the keyword, and ask the owner to confirm it. Pull any Search Console data available for related queries.

### 2.2 Information gain

Name what this page offers that the top results do not ([information-gain.md](information-gain.md)). **No gain: drop the keyword or merge it into a page that has one.**

### 2.3 Fact ledger

Create the ledger ([fact-ledger.json](../templates/fact-ledger.json)) with every fact the page may state: the fact, its source (URL, project file or interview), the date read, who checked it, and its status. Facts about the business come only from the project files, the claims registry and the pricing file. Nothing is added from memory.

## Stage 3: The brief and the interview (stop at APPROVAL 1)

### 3.1 The brief

Fill every field of [brief.md](../templates/brief.md). It holds: keywords, intent, governor status, SERP snapshot, information gain, human-first fields, **original element**, interview answers, ledger summary, claims and prices needed, who/how/why, outline, headline, internal links, CTA, schema, metadata draft, people, and open flags. The template is the one home of the field list.

### 3.2 The interview

Ask the questions for the page type from [interview-questions.md](interview-questions.md) (how-to and explainer pages use the **Guide** bank), **one at a time**, recording each answer word for word in [interview.md](../templates/interview.md) and asking for the artifact. An unanswered or skipped question is a `GAP`, and the section that needed it is dropped from the outline. Claude never answers for the owner. Read the answers back before approval.

### 3.3 APPROVAL 1

Show the brief, the ledger, the SERP snapshot, the open flags and the gaps. **Stop.** No long copy until the owner approves.

### Outline patterns by intent

| Intent | Pattern |
|---|---|
| Solve | Problem, quick answer, backup step, diagnose, fixes in order of effort (each with a check that it worked), when to ask for help, prevent it |
| Compare | One-sentence verdict, criteria, options, where each is stronger, table with sourced cells, who should choose which, FAQ |
| Learn | Direct definition, why it matters to a business owner, how it works, a real example, common mistakes, next step, FAQ |
| Plan | The decision, criteria, who each option suits, a recommendation with the reason, next step, FAQ |
| Find | The answer and the link, then one line of context |
| Buy | Use the plan's page template (money, service, domain), not an article |

## Stage 4: Draft and edit

Draft **only** from the approved brief, the ledger and the interview answers. Mark every gap `[HUMAN REVIEW]`. Write within [voice.md](voice.md) and [content-writing-rules.md](content-writing-rules.md). In addition:

1. **Answer first.** A direct answer under the H1 and under each question heading, with the word range in `limits.answerBlockWords`.
2. **Keywords are natural.** Primary keyword in the title, H1, first 100 words and one H2. Secondary and semantic terms only where they fit. The text must read well without them. No density targets.
3. **Cover the follow-up questions** a reader will ask next. Do not add sections to reach a length.
4. **Unique value comes from real material only.** Allowed: steps a person tested, the owner's first-hand details, tables of sourced data, checklists, real examples from the brief, calculations the reader can repeat. Not allowed: invented statistics, studies, customers, testimonials, case studies, quotes, expert opinions, specifications, prices, or "in my experience" statements. Claude has no first-hand experience. Where first-hand detail is missing, write `[HUMAN REVIEW: add first-hand insight]`.
5. **Trust is real.** The author and reviewer lines name real people. No manufactured expertise.
6. **Claims and prices** come only from rendering claims and the pricing file. No feature word in a title, H1 or description unless its claim renders.
7. **Honest limits.** Say when the product is not the right choice. State what is not offered (see `project/brand.md` and `forbiddenChannels` in `project/rules.config.json`).
8. **Sources.** At least two primary sources for guides, each with a retrieval date. No statistic without one.
9. **Structure for answer engines, written for people** ([ai-search.md](ai-search.md)).
10. **Edit.** Cut, clarify, fix voice, remove banned phrases, confirm the information gain is on the page, and add the Who/How/Why block ([eeat-and-people-first.md](eeat-and-people-first.md)). Run the voice self-check at the end of [voice.md](voice.md). The editor adds no claims.

## Stage 5: Metadata, schema and links

| Field | Rule |
|---|---|
| SEO title | Keyword first. Measured with the brand suffix: warn above `limits.titleWarnAbove`, fail above `limits.titleFailAbove`. No suffix typed by hand (the helper adds it). No feature word without a rendering claim |
| Meta description | Warn above `limits.descriptionWarnAbove`; fail only if missing or duplicate. Outcome, difference, next step. Not a copy of the title |
| URL slug | The register's target URL. Do not invent one. If `planned`, propose one and wait for approval |
| Keywords and intent | As in the register and Stage 1 |
| Schema | From the plan. It must match the visible content. No rating or review markup without real, linked reviews. FAQ and HowTo markup do not give rich results in Google ([sources.md](sources.md), item 5); add them only for readers or other tools, never as a ranking lever |
| Internal links | 3 or more, each with a descriptive anchor and a reason, from the register and the page inventory |

## Stage 6: Checks (evidence, not a self-score)

Run `npm run check:register`, `npm run check:content` and the host's page-spec check (`npm run check:pages`). For WordPress posts, also the checks in [wordpress-content-model.md](wordpress-content-model.md). Fix what fails. List what you cannot fix.

Then answer each line **yes or no with proof** (a quote or a check result):

| Check | Proof |
|---|---|
| The first sentence under each heading answers it | |
| Every number, price, guarantee, location and date has a ledger entry or a rendering claim | |
| No banned phrase. No sentence over `limits.sentenceMax` words | |
| Intent matches the live results | |
| 3 or more internal links with descriptive anchors | |
| One CTA, from the table below | |
| The original element is on the page, or its flag is listed | |
| No `[HUMAN REVIEW]` flag open (or each is listed in the handoff) | |
| Author, reviewer and review date are real | |
| Reading grade inside the target (warn above `limits.gradeWarnAbove`, fail above `limits.gradeFailAbove`); average sentence under `limits.averageSentenceMax` | |

The rubric in [quality-rubric.md](quality-rubric.md) is **advisory**. It is never a gate.

## Stage 7: Handoff (never "publish-ready")

Fill [handoff.md](../templates/handoff.md): status "Ready for owner review" with the number of open flags; open flags and missing facts; the brief; the draft; metadata; internal links; the CTA; check results and the advisory rubric; the register update to propose; and what the owner must verify, including any Tier B review. A page with unconfirmed information gain, a missing original element or an unanswered experience question stays a Draft.

---

## States: Draft and Ready for owner review

A missing first-hand answer has one outcome, in this order: the question is a `GAP` (3.2); the section that needed it is dropped from the outline (3.2); if the page then has no experience answer at all, or the information gain is unconfirmed, or the original element is missing, the page stays a **Draft**. The flag `[HUMAN REVIEW: add first-hand insight]` marks the spot in a Draft. A page is not "not ready to write" because of a gap; it is a Draft with the gap named.

| State | Allowed open flags | Allowed to publish |
|---|---|---|
| Draft | Any, each listed in the handoff | No |
| Ready for owner review | Only flags that need the owner's own facts (for example a reviewer's name), each listed with who can fill it. No gap on the experience questions, gain confirmed, original element present | No. The owner publishes after clearing the flags |
| Published | None | Owner only (and a qualified human first for Tier B) |

## CTA by intent

| Intent | CTA | Never |
|---|---|---|
| Learn | Link to the next guide, or one soft product link after the answer, named for what the link is ("See hosting plans"), with no price in the sentence | A sales banner in the first 150 words |
| Solve | "Send us the error log" (to the contact page) when the fix may need help | "Your site is at risk" |
| Compare | "See [product] plans" or "Read the full comparison" | Disparaging a competitor |
| Buy | "Choose [plan]" or "See [product] plans". The price sits above, not inside the label | A label in `bannedCtaLabels` |
| Plan | "Compare your options" or the plan finder | Pressure |
| Find | The direct link | |
| Local | Not used | |

## The rule behind all of it

Optimize for the person who typed the query: their problem, what they expect, the best format, a complete answer, real value, trust, then visibility and the business result. Never for a keyword alone, and never at the cost of a fact we cannot prove. No tool or workflow can guarantee a ranking, a featured snippet or an AI citation.
