# Super Content Planner: spec

> **Superseded by `content-engine/`, kept for history.** The spec was built out in six phases (see `content-engine/CHANGELOG.md`, version 1.0.0). The workflow, rules, templates, schemas and tools there are the current source. Where this file and the planner differ, the planner wins. Owner decision, 2026-10-09.

Goal: you give a keyword or a page title. The planner researches, classifies the intent, builds the brief, interviews you for the
real experience, drafts, checks, and hands back a page that is ready for your review. Save as `content-engine/history/SUPER_CONTENT_PLANNER_SPEC.md`.
It extends the existing planner (`content-engine/`) and `content-writer-workflow.md`. Nothing here replaces the claims, pricing or approval rules.

---

## 1. What can and cannot be automated

| Part of the work | Automate? | How |
|---|---|---|
| Intent, plan, keyword ownership, cannibalization check | Fully | Register plus the intent table |
| SERP snapshot, questions, entities, gaps | Fully (needs web access) | Search and fetch, recorded with date |
| Outline, brief, metadata, schema, internal links, register update | Fully | Templates plus generators |
| Fact gathering from public sources | Mostly | Fetch the source, store URL, date and the exact fact |
| Draft copy | Fully, from allowed material only | Drafting agent with an allowlist |
| Voice, banned phrases, readability, claims, numbers, links, headings | Fully | `check-content` tool in CI |
| **First-hand experience** (what you did, saw, measured) | **No. Captured, not generated** | A short interview: Claude asks, you answer, Claude records |
| **Facts about the business** | No | `PROJECT.md`, `claims.ts`, `pricing.json` |
| **Legal documents (Tier B)** | No | Qualified human |
| **Approval to publish** | No | The owner |

**Why the human step cannot go away.** Google's own guidance asks whether a page offers original information, research or analysis,
whether it shows first-hand experience, and whether a reader can see who made it, how, and why. Those answers come from real
work. A model cannot supply them honestly, and invented experience is the fastest way to lose trust. The planner shrinks your part to
about 10 to 20 minutes of answering targeted questions per page. Everything else is automated.

## 2. The one-input flow

```
Keyword or title
  1. Resolve        register row, plan, locale, URL, excluded-keyword check
  2. Classify       intent (7 types), buying stage, expected format
  3. Research       SERP snapshot, questions, entities, gaps, Search Console data for related queries
  4. Fact ledger    every fact the page may use, with source, date and status
  5. Brief          full brief with outline, length range, links, CTA, schema, metadata draft
  6. Interview      5 to 8 questions to you, answers recorded word for word, artifacts requested
  7. APPROVAL 1     you approve the brief and the interview answers
  8. Draft          from the allowed material only
  9. Edit           voice, clarity, information gain
 10. Check          automatic gates (section 7)
 11. Handoff        status, open flags, draft, metadata, schema, links, register update
 12. APPROVAL 2     you approve and publish (and a qualified human for Tier B)
 13. Measure        28-day report, refresh queue, learning log
```

You touch steps 6, 7 and 12. Nothing publishes without step 12.

---

## 3. Google and AI rules, turned into checks

Every rule in the planner must point to a source and a date. Primary sources are Google Search Central pages. Secondary blogs are not rules.
Claude Code fetches the primary pages (list in section 9), writes a dated summary in `rules/sources.md`, and the planner re-checks it every quarter.

| Rule (source) | What it means here | Automated check | Human check |
|---|---|---|---|
| **People-first content** (Google: creating helpful, reliable, people-first content) | The page exists to help a reader, not to rank | Brief must state reader, problem, outcome. Title and H1 describe the page without exaggeration | Owner reads as the reader |
| **Original value** (same page, "content and quality questions") | Original information, analysis or a complete answer beyond the obvious. Not a rewrite of other pages | **Information-gain field is required** and must name one thing the top results lack. Similarity check against the SERP notes and our own pages | Owner confirms the gain is real |
| **Who, How, Why** (same page) | Readers can see who made it, how, and why | The page template adds a Who, How and Why block from front matter: author, reviewer, date, "drafted with AI assistance, then edited and approved by [name]", and the purpose | Owner confirms the names are real |
| **Spam policy: scaled content abuse** (Google spam policies) | Many pages made mainly to manipulate rankings are spam, whether AI or humans wrote them | The **governor** (section 6): publishing limits, no keyword-variant pages, one intent per page | Owner reviews the monthly plan |
| **Keyword stuffing, hidden text, cloaking** (spam policies) | | Density and repetition check, no hidden elements, same content for crawlers and users | |
| **Structured data must match visible content** (structured data policies) | | Schema generated from the visible fields. Validator fails on mismatch. No `AggregateRating` without real linked reviews | |
| **E-E-A-T** (Search Quality Rater Guidelines; Google says it is a concept, not a single ranking factor) | Experience, expertise, authoritativeness, trust | See section 4 | |
| **Accuracy and sourcing** | No statistic without a source | Number provenance check: every figure maps to the fact ledger | Owner spot-checks 3 facts |
| **Page experience basics** | Fast, readable, mobile friendly, no intrusive interstitials | Lighthouse in CI (median of 3 mobile runs) | |
| **AI answer engines** (no official rulebook; working assumptions, re-checked each quarter) | Server-rendered text, an answer under each question heading, clear entities, honest comparisons, crawl access per the SEO rules | Answer-block check (40 to 80 words, first sentence answers), crawl and render checks | Monthly 20-question spot-check (Plan 10) |

Not a rule, so not encoded: "AI detection scores", "keyword density percentages", and "word count minimums". Where the planner
once had them, they are advisory only.

## 4. E-E-A-T: what the planner supplies and what you must

| Signal | Planner does automatically | Only you can supply |
|---|---|---|
| **Experience** | Asks the interview questions, records the answers, places them as the "what we saw" section, requests artifacts (screenshots, logs, results) | The actual experience and the artifacts |
| **Expertise** | Shows the real author and reviewer, links to the author page, cites primary sources, tests steps against a checklist, records versions and dates | Real credentials and bios |
| **Authoritativeness** | Links to evidence others give (reviews page, press, partners) and to your trust pages | The reputation itself (Plan 15 takes time) |
| **Trust** | Accuracy checks, no invented facts, honest limits, claims gated, policies linked, company facts from `company.ts`, a visible Who, How and Why block, review date | Policies, reviews, legal entity facts |

A page without an interview answer for experience cannot reach "Ready for owner review". It stays a draft with the gap named.

---

## 5. The engine: files and tools to build

```
content-engine/
  rules/
    sources.md                  primary Google pages, summarised, dated, re-checked quarterly
    interview-questions.md      question banks by page type (section 8)
    information-gain.md         how to find and state the gain
    quality-rubric.md           the advisory rubric (reviewer only)
  project/
    learning-log.md             what worked and what did not, from the 28-day reviews
    briefs/                     one approved brief per page (the audit trail)
    briefs/golden/              finished example pages that pass every check (the quality bar)
    facts/                      one fact ledger per page
tools/
  check-content.ts              the validator (section 7)
  gen-schema.ts                 JSON-LD from front matter
  suggest-links.ts              internal-link suggestions from the register and sitemap
  similarity.ts                 overlap check against our own pages and the SERP notes
  gsc-report.ts                 28-day report from Search Console
  refresh-queue.ts              what is due for review
  eval.ts                       runs the test set (section 10)
.claude/
  commands/write-content.md     /write-content "keyword or title"
  commands/refresh-content.md   /refresh-content /url
  commands/audit-page.md        /audit-page /url (check an existing page)
  agents/                       optional subagents: researcher, drafter, fact-checker, editor
```

If subagents are not available in your Claude Code version, the same stages run one after another inside the command. The roles stay the same:

| Role | Allowed to | Not allowed to |
|---|---|---|
| Researcher | Search, fetch, record sources with dates | Write copy |
| Fact-checker | Confirm each ledger item against its source or a project file | Add facts |
| Drafter | Use only the brief, ledger and interview answers | Invent anything. Use outside facts |
| Editor | Cut, clarify, fix voice, enforce the rules | Add claims |
| Validator (code) | Fail the page | Be argued with |

## 6. The governor (protects against scaled content abuse)

Google's spam policy targets many pages made mainly to rank, whatever produced them. A pipeline that turns a keyword list into pages is exactly
what that policy describes if it is used carelessly. These rules are built into the planner.

1. **No page without information gain.** The brief names what this page offers that the top results do not. If it cannot, the keyword is dropped or merged.
2. **One page, one intent.** No separate pages for keyword variants. Variants go in the Secondary column.
3. **No programmatic page sets** (a template filled with city, plugin or competitor names) unless each page holds unique, verified content, and the owner approves the pattern.
4. **Velocity limit.** At most 3 pages in flight and a monthly cap set by the owner (start at 4 new guides a month). The governor refuses to start another brief beyond the cap.
5. **Cluster first.** Publish a pillar and three supporting posts together, so each page has a purpose within a topic.
6. **Prune.** A page with no impressions after 6 months is improved, merged or removed.
7. **A real person's name is on every page,** and that person has seen the page.
8. **Interview required.** A page with no first-hand answers cannot pass.
9. **Kill switch.** One line in the register (`pause: true`) stops all drafting.

## 7. The validator: `check-content`

Runs on page JSON, MDX and WordPress posts. A failure blocks the "Ready for owner review" status. Rules already in the planner are reused.

| Group | Checks |
|---|---|
| Structure | One H1, no skipped levels, answer block under each question heading (40 to 80 words), FAQ 4 to 6 items, internal links 3 or more with descriptive anchors |
| Keyword | Primary keyword is in the register for this URL, in the title, H1 and first 100 words. No density spikes. Not owned by another URL |
| Facts | Every number, price, date, guarantee and location maps to the fact ledger, `claims.ts` or `pricing.json`. Feature words only when the claim renders |
| Voice | Banned phrases, exclamation marks, sentences over 28 words, reading grade, idioms, vague pronouns in answers |
| People | Author, reviewer, review date, next review date, "how it was made" line, author page exists |
| Experience | Interview answers present and quoted into the page. No "in my experience" without a named human who said it |
| Sources | Two or more primary sources with retrieval dates (guides). No dead links |
| Metadata | Title 60 characters or fewer, no brand suffix, description 160 or fewer, slug equals register URL |
| Schema | Generated from the visible content, validates, no unsupported rating or review markup |
| Policy | No mention of WhatsApp, live chat or phone support. No "we host email". No location or provider names. No ranking guarantees |
| Overlap | Similarity to our own pages and to the SERP notes under a threshold |
| Flags | No open `[HUMAN REVIEW]` unless the status is "Draft" |

The validator reports each failure with the line and the rule. It does not give a "score", only pass or fail.

## 8. The interview (what Claude asks you)

The interview is the E-E-A-T engine. Claude asks only what the page needs, one question at a time, and records your answer word for word.
It asks for an artifact for each answer where one exists. Answer "none" and the section is dropped, not invented.

| Page type | Questions |
|---|---|
| **Fix or troubleshooting** (Plan 04) | 1. When did you last see this problem, on what kind of site? 2. What was the cause in that case? 3. What did you try first that did not work? 4. What fixed it, step by step? 5. How did you confirm it was fixed? 6. Which versions (WordPress, PHP, plugin) were involved? 7. What would you tell a reader who cannot fix it alone? Artifacts: the log, a screenshot, before and after numbers |
| **Guide or explainer** (Plan 03) | 1. Which mistake do you see most often on this topic? 2. What do most guides get wrong or skip? 3. What did you do on a real site? 4. What surprised you? 5. What do you recommend, and for whom? 6. When would you recommend against it? Artifacts: a screenshot, a checklist you use |
| **Comparison** (Plan 02) | 1. Who should pick each option? 2. Where is the competitor better, honestly? 3. What have customers told you about switching? (only real answers) 4. What did you check yourself? Artifacts: the sources and dates for each competitor fact |
| **Migration or email** (Plan 14) | 1. What do you actually do, in order? 2. What goes wrong most often? 3. What do you need from the customer? 4. What is excluded? 5. How long does it take in practice? (only if measured) |
| **Service page** (Plan 06) | 1. What exactly is delivered? 2. Who is it for, and who is it not for? 3. What is your process? 4. A real project you can name, with permission 5. What can you not promise? |
| **Money page** (Plan 01) | 1. Who buys this plan and why? 2. What do they worry about first? 3. What is the honest limit of this plan? 4. What do customers ask support most? |

## 9. Rules sources Claude Code must fetch and summarise (`rules/sources.md`)

Record the URL, the date fetched and a summary in your own words for each. Re-check quarterly. If a page cannot be fetched, say so.

1. Google Search Central: creating helpful, reliable, people-first content
2. Google Search Central: spam policies (scaled content abuse, keyword stuffing, cloaking, link spam)
3. Google Search Central: guidance on using generative AI content
4. Google Search Central: generative AI features in Search (guidance for site owners)
5. Google Search Central: structured data general guidelines, and the page for each schema type we use
6. Google Search Central: title links, snippets and meta descriptions
7. Google Search Quality Rater Guidelines (the E-E-A-T sections)
8. Bing Webmaster guidelines
9. The AI crawler documentation of each provider whose bot we allow or block

## 10. Evaluation harness (`eval.ts`)

A set of 10 test keywords across the plans (fix, guide, comparison, migration, email, service, money page, a keyword that must be rejected,
a keyword that cannibalizes, a keyword with no first-hand answers). For each, the expected result is written down: which plan, which intent,
accept or reject, which checks fail. Run it whenever a rule or prompt changes. A change that breaks an expectation is reviewed before it ships.
This is how the planner improves without drifting.

## 11. Measurement and learning

- 28 days after publishing: `gsc-report.ts` pulls impressions, clicks, position and queries for the page. The planner proposes changes.
- Quarterly: refresh queue, pruning review, re-check the sources in `rules/sources.md`, re-run the evaluation harness.
- `project/learning-log.md` records what changed and what happened (date, page, change, result). Rules are updated from this log, not from opinions.
- Monthly AI spot-check (Plan 10) feeds the same log.

## 12. Build phases (Claude Code)

| Phase | Build | Done when |
|---|---|---|
| **A. Foundation** | `rules/sources.md`, `interview-questions.md`, `information-gain.md`, the new brief template, `/write-content`, `check-content` v1 (structure, voice, facts, people, metadata, flags) | `/write-content` runs stages 1 to 6 on a test keyword and the validator reports on a sample page |
| **B. Research and generation** | SERP snapshot capture, fact ledger, `gen-schema.ts`, `suggest-links.ts`, register updater, similarity check | A brief arrives with research, links and schema filled |
| **C. Governor and measurement** | Velocity limit, pause switch, `gsc-report.ts`, `refresh-queue.ts`, `learning-log.md`, `/refresh-content`, `/audit-page` | Caps enforced, a 28-day report generated |
| **D. Evaluation and CI** | `eval.ts`, CI job that runs the validator on every changed content file and every WordPress post | A rule change cannot merge if it breaks the test set |
| **E. WordPress** | Fields and webhook checks from `wordpress-content-model.md` | Posts cannot publish unless checks pass |

### Prompt: Phase A

```
Read content-engine/history/SUPER_CONTENT_PLANNER_SPEC.md, content-engine/README.md, and
content-engine/rules/content-writer-workflow.md. Build Phase A only. Do not change any
price, claim or page copy.

1. Fetch the Google Search Central pages listed in spec section 9 (items 1 to 7). For each, write
   a dated summary in your own words (no long quotes) in content-engine/rules/sources.md,
   with the URL and the date fetched. If a page cannot be fetched, say so and stop on that item.
2. Create content-engine/rules/interview-questions.md from spec section 8.
3. Create content-engine/rules/information-gain.md: how to find the gain from the SERP
   snapshot, the form it takes in the brief, and examples of acceptable and unacceptable gain.
4. Update the brief template in the README and in content-writer-workflow.md with these new
   fields: information gain, interview answers (verbatim) and artifacts, fact ledger, Who/How/Why
   lines, governor status (in-flight count, monthly cap).
5. Create .claude/commands/write-content.md (arguments: a keyword or title) that runs spec
   stages 1 to 7 and stops at "APPROVAL 1". It asks the interview questions one at a time for
   the page type, records answers verbatim, and marks any unanswered question as a gap.
6. Build tools/check-content.ts v1 with groups Structure, Voice, Facts, People, Metadata, Flags
   (spec section 7). It reads page JSON and MDX. It prints pass or fail per rule with the line.
   Add npm run check:content.
7. Add 6 fixture files under tools/fixtures/ (3 passing, 3 failing, each failing for a
   different rule) and tests that prove the validator catches them.
8. Test: run /write-content for "how to improve ttfb on wordpress" through the interview.
   Show me the brief, the fact ledger, the SERP snapshot, and the questions you ask me. Do not
   write the article.
9. Run npm run check:register and npm run check:content. Report results and list every file
   created or changed. Commit on branch feat/super-planner-a. Do not merge.
```

---

## 13. Limits to accept

- No tool can guarantee rankings, featured snippets or AI citations. The planner removes technical and quality obstacles and measures results.
- Google's guidance changes. The sources file and the quarterly re-check exist for that reason. Several summaries of Google policy found online are second-hand. Only the Google pages count as rules.
- The planner can make good pages fast. It cannot make them true. Experience, business facts, legal review and approval stay with people.
- Output volume is limited on purpose (section 6). A smaller set of excellent pages, each with real first-hand material, beats a large set of thin ones.
