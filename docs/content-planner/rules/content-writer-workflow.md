# Content Writer Workflow (brief, draft, checks, handoff)

Save as `docs/content-planner/rules/content-writer-workflow.md`.
Used for every writing task. It merges an intent-first SEO method with this project's rules. Where they differ, the project wins.

## Scope

| Page type | Use this workflow as | Template |
|---|---|---|
| Guides and explainers (Plan 03), fix articles (Plan 04), comparisons (Plan 02), compliance explainers (Plan 07), migration and email guides (Plan 14) | The full workflow, stages 0 to 7. Output is an article | The plan's page template |
| Money pages (01), regional (05), services (06), domains (08), brand and trust (09), policy pages (07) | Stages 0 to 3 and 5 to 7. The copy goes into page JSON, not an article | The plan's template and `content/pages/*.json` |

## Inputs (never typed per request)

The only input is the **primary keyword** and optional notes from the owner. Everything else comes from the project:

| Input | Source |
|---|---|
| Website, business, industry, location | `project/PROJECT.md`, `content/company.ts` |
| Audience and tone | README audience section, `rules/voice.md` |
| Secondary keywords, URL, plan | `project/keyword-register.md` |
| Prices, plans, limits | `data/pricing.json` |
| Guarantees, support, features | `content/claims.ts` (only claims that render) |
| CTA | Intent table below, and the plan's CTA rules |

**Missing information is never inferred.** It becomes `[HUMAN REVIEW: <what is needed>]`. A page ships with none open.

---

## Stage 0: Gate check

Stop and report if any of these fail:

- [ ] The keyword has a register row with a target URL (or `planned`), and no other page owns it
- [ ] The keyword is not in "Excluded keywords"
- [ ] The plan that owns it is clear (README table)
- [ ] The facts the page needs exist in project files, or are listed as missing
- [ ] If it touches a Tier B legal topic, say so now (a qualified human must review it)

## Stage 1: Classify the intent

Classify before anything else. Do not assume the keyword is informational.

| Intent | Meaning | Plan that owns it | Notes |
|---|---|---|---|
| Learn | wants to understand | 03 (also 07 explainers, 14 guides) | |
| Solve | wants to fix something | 04 | |
| Compare | wants to choose between options | 02 (comparison of concepts is 03) | `FEATURES.comparisonPages` gate applies |
| Buy | wants to buy or hire | 01 products, 06 services, 08 domains | Page JSON, not an article |
| Find | wants a specific place | 09 | Direct link answer |
| Plan | wants help deciding what to do | 03 and 10, plus the plan finder tool | |
| Local | wants a local business | **Not targeted.** Region queries go to Plan 05. "Near me" is excluded | No local presence |

Record: primary intent, secondary intent, the reader's likely problem and goal, the expected format, and the buying stage.
Confirm it against the live results (stage 2). If the live results disagree with the register's intent, say so and ask the owner.

## Stage 2: SERP snapshot

If web access is available, look at the current results (Google, and Bing if possible). Record in the brief:

| Field | What to write |
|---|---|
| Date checked, locale | |
| Top results | Up to 8 URLs with the page type of each (product, comparison, guide, fix, policy, service, brand) |
| Dominant page type and intent | |
| Common H2 topics | In your own words. Do not copy headings |
| Questions people ask | From "People also ask" and related searches |
| Entities and terms that recur | Tools, standards, products |
| Typical depth | Short, medium, long, and why |
| Gaps and weaknesses | What is missing, outdated, vague or wrong |
| Our angle | The gap we can honestly fill, using the owner's first-hand material |

Rules: use it to learn what readers expect, never to copy. Do not reuse a competitor's fact without its own source. If web access is unavailable, write "SERP analysis unavailable", infer the intent from the keyword, and flag it for the owner to confirm.

## Stage 3: The brief (stop here for approval)

Fill every field. A person supplies the human-first fields and the interview answers **before** any draft. Claude does not invent them. The interview follows `rules/interview-questions.md`, and the information-gain line follows `rules/information-gain.md`.

```
Slug (from the register) / Plan / Locale
Primary keyword / Secondary keywords (from the register) / Semantic terms / Entities / Question keywords
GOVERNOR STATUS: in-flight pages (register rows briefed, drafting or review) N of 3 / new pages this month N of cap (owner sets the cap, start at 4) / pause switch off
INTENT: primary / secondary / reader's problem / reader's goal / expected format / buying stage
SERP SNAPSHOT: (table in Stage 2)
INFORMATION GAIN: gap in the top results (with URLs checked) / our gain in one sentence ("Unlike the top results, this page ...")
  / the real material behind it / status (confirmed by owner or not). See rules/information-gain.md. No gain = drop or merge
RECOMMENDED LENGTH: a range and the reason. A guide, not a rule. Under 300 words is flagged thin
HUMAN FIRST (owner supplies): reader's real question / our angle
INTERVIEW ANSWERS (verbatim): each question from rules/interview-questions.md, the owner's exact words, the date, and the artifact
  (screenshot, log, numbers) or "none". An unanswered question is written as GAP and its section is dropped, never invented
FACT LEDGER (project/facts/<slug>.md): every fact the page may use: the fact, source URL or project file, date read, who checked,
  status (verified, needs check). The draft may use only ledger facts, interview answers and rendering claims
CLAIMS NEEDED (ids from claims.ts, and whether each renders) / PLANS AND PRICES NEEDED (from pricing.json)
WHO / HOW / WHY (shown on the page): who = real author and reviewer, linked to the author page / how = how it was made, including the AI
  line ("Drafted with AI assistance, then edited, fact-checked and approved by [name]") and what was tested / why = the reader's need
OUTLINE: H1, H2, H3 following the intent pattern below. Each H2 states its direct answer in one line
HEADLINE: reason-led version and fallback (money, service, regional and landing pages only)
TOOL OR TABLE needed (rules sections 9 and 10)
INTERNAL LINKS (3 or more): anchor text / target page / why it helps the reader
CTA: from the intent table, one only
SCHEMA: from the plan. Must match the visible content. Google no longer shows FAQ or HowTo rich results (rules/sources.md, item 5)
METADATA DRAFT: title (60 characters or fewer, no brand suffix), description (160 or fewer). These limits are project rules
OWNER / REVIEWER (the owner until a second person exists) / NEXT REVIEW DATE
AI USED FOR THE DRAFT: yes or no / OPEN FLAGS: every [HUMAN REVIEW] item
APPROVAL 1: owner approves the brief and the interview answers (no draft before this)
```

**Show the brief to the owner and stop (APPROVAL 1).** No long copy until it is approved.

### Outline patterns by intent

| Intent | Pattern |
|---|---|
| Solve | Problem, quick answer, backup step, diagnose, fixes in order of effort (each with a check that it worked), when to ask for help, prevent it |
| Compare | One-sentence verdict, criteria, options, where each is stronger, table with sourced cells, who should choose which, FAQ |
| Learn | Direct definition, why it matters to a business owner, how it works, a real example, common mistakes, next step, FAQ |
| Plan | The decision, criteria, who each option suits, a recommendation with the reason, next step, FAQ |
| Find | The answer and the link, then one line of context |
| Buy | Use the plan's page template (money, service, domain), not an article |

## Stage 4: Draft

Write within the project rules (`voice.md`, content rules). In addition:

1. **Answer first.** A 40 to 80 word direct answer under the H1 and under each question heading.
2. **Keywords are natural.** Primary keyword in the title, H1, first 100 words and one H2. Secondary and semantic terms only where they fit. The text must read well if they are removed. No density targets.
3. **Cover the follow-up questions** a reader will ask next. Do not add sections to reach a length.
4. **Unique value comes from real material only.** Allowed: steps a person tested, the owner's first-hand details, tables of sourced data, checklists, real examples from the brief, calculations the reader can repeat. Not allowed: invented statistics, studies, customers, testimonials, case studies, quotes, expert opinions, product specifications, prices, or "in my experience" statements. Claude has no first-hand experience. Where first-hand detail is missing, write `[HUMAN REVIEW: add first-hand insight]`.
5. **Trust is real.** The author and reviewer lines name real people. Credentials come from the author page. No manufactured expertise.
6. **Claims and prices** come only from rendering claims and `pricing.json`. No feature word in a title, H1 or description unless its claim renders.
7. **Honest limits.** Say when DronaHost is not the right choice. State what we do not offer (email hosting, live chat, WhatsApp or phone support).
8. **Sources.** At least two primary sources for guides, each with a retrieval date. No statistic without one.
9. **Structure for answer engines, written for people.** Descriptive headings, short answer paragraphs, lists and tables where they help, defined terms. Do not write unnaturally for AI.
10. **No AI-sounding filler.** Run the voice self-check (`voice.md`, last section).

## Stage 5: Metadata

| Field | Rule |
|---|---|
| SEO title | Keyword first, 60 characters or fewer, no brand suffix (the helper adds it), no feature word without a rendering claim |
| Meta description | 160 characters or fewer. Outcome, difference, next step. Not a copy of the title |
| URL slug | The register's target URL. Do not invent one. If `planned`, propose one and wait for approval |
| Primary and secondary keywords | As in the register |
| Search intent | From stage 1 |
| Schema | From the plan. `FAQPage` or `HowTo` only if it matches the visible content |

## Stage 6: Checks (evidence, not a self-score)

Run: `npm run check:pages`, `npm run lint:content`, `npm run check:register`. For WordPress posts, the checks in `rules/wordpress-content-model.md`.

Then answer each line **yes or no with proof** (a quote or a check result):

| Check | Proof |
|---|---|
| The first sentence under each heading answers it | |
| Every number, price, guarantee, location and date has a source or a rendering claim | |
| No phrase from the avoid list. No sentence over 28 words | |
| Intent matches the live results | |
| 3 or more internal links with descriptive anchors | |
| One CTA, from the intent table | |
| No `[HUMAN REVIEW]` flag open (or each is listed in the handoff) | |
| Author, reviewer and review date are real | |
| Reading grade 8 to 10 | |

**Quality rubric (advisory, for the reviewer).** Score 0 to 10 on intent match, content quality, topic coverage, keyword relevance, readability, original value, trust, SERP alignment, answer-engine readiness and CTA relevance. Give one line of evidence per score. The score is **not** a gate and never decides publication. The owner decides. Any category below 7 gets a named fix.

## Stage 7: Handoff (never "publish-ready")

Return, in this order:

1. **Status:** "Ready for owner review" and the number of open flags. Never "ready to publish".
2. **Open flags and missing facts**, each with who can supply it.
3. **The brief**, with the SERP snapshot.
4. **The draft.**
5. **Metadata** (stage 5).
6. **Internal links** (anchor, target, why).
7. **CTA** and the reason it fits the intent.
8. **Check results** (stage 6) and the advisory rubric.
9. **Register update:** the row changes to propose (status, owner, next review date).
10. **What the owner must verify** before publishing, including any Tier B review.

## CTA by intent

| Intent | CTA | Never |
|---|---|---|
| Learn | Link to the next guide, or one soft product link ("See WordPress hosting plans") after the answer | A sales banner in the first 150 words |
| Solve | "Send us the error log" (to `/contact`) when the fix may need help | "Your site is at risk" |
| Compare | "See [product] plans" or "Read the full comparison" | Disparaging a competitor |
| Buy | "Choose [plan]" or "See [product] plans". The price sits above, not inside the label | "Get started", "Buy now" |
| Plan | "Compare your options" or the plan finder | Pressure |
| Find | The direct link | |
| Local | Not used | |

## The rule behind all of it

Optimize for the person who typed the query: their problem, what they expect, the best format, a complete answer, real value, trust, then visibility and the business result. Never for a keyword alone, and never at the cost of a fact we cannot prove.
