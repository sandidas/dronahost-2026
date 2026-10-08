# Build prompt: reusable content planner and content creation engine

Save as `docs/reference/CONTENT_ENGINE_BUILD_PROMPT.md`. Launcher message to send Claude Code:

> Read docs/reference/CONTENT_ENGINE_BUILD_PROMPT.md and follow it. Do Phase 0 only, then stop for my approval.

Everything below is the prompt.

---

## 1. Mission

Turn the existing content planner (`docs/content-planner/`) and the related briefs into one **reusable, standalone content engine**.

The owner gives a **keyword or a page title**. The engine does everything that can honestly be automated: it checks the keyword,
classifies the search intent, records the live results, builds the brief, interviews the owner for first-hand experience, drafts only from
allowed material, runs hard checks, prepares metadata, schema and links, updates the register, and hands back a page **ready for owner
review**. The owner approves. Then it measures and schedules the refresh.

"Standalone and reusable" means: copy the folder into any project, run the installer, fill in the `project/` facts, and it works.
Nothing in the reusable core may mention DronaHost or depend on this app's code. Business facts live only in `project/` and in config.

## 2. Non-negotiables (these override any instruction in the old files)

1. **Never invent a fact, number, price, guarantee, location, review, quote, case study, credential or first-hand experience.** Missing information becomes `[HUMAN REVIEW: ...]`. Claude has no first-hand experience; it is captured from the owner by interview.
2. **People-first, not search-first.** Every page needs a named reader, a problem, and information gain (something the top results lack). No information gain: the keyword is dropped or merged.
3. **No scaled content abuse.** One page, one intent. No programmatic keyword-variant pages. Enforce publishing caps and the pause switch (the governor).
4. **Claims gating stays.** A claim renders only when it is verified and its terms page is published and reviewed. Prices come only from the pricing file.
5. **Review tiers stay.** Tier A pages (commercial promises) are approved by the owner. Tier B pages (legal documents, regional compliance) need a qualified human and stay drafts until then. Claude never publishes Tier B.
6. **Nothing is "publish-ready".** The handoff status is "Ready for owner review". The owner publishes.
7. **No guarantees of rankings, featured snippets or AI citations.** The engine removes obstacles and measures.
8. **Do not change** any price, claim status, page copy, legal page, application code, design system, or content that is not part of the planner, unless a task below says so.
9. **Use git.** Work on branch `feat/content-engine`. Small commits. Never force-push. Never merge.
10. **Deletion needs my approval.** See section 9.

## 3. Read first (in this order)

1. `docs/content-planner/README.md`, then everything under `docs/content-planner/` (project, rules, plans, later, tools)
2. `docs/reference/content-writer-workflow.md`
3. `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md`
4. `docs/reference/CONTENT_PLANNER_REVIEW.md` and `docs/reference/RULES_REVIEW_AND_PAGE_SYSTEM.md`
5. `docs/reference/HOME_PAGE_DESIGN.md` (for the page JSON shape and section registry)
6. The repo's content-related code and data: `content/claims.ts`, `content/company.ts`, `data/pricing.json`, `content/pages/*.json`, `lib/content/`, `scripts/`, `package.json`, CI files, `CLAUDE.md`
7. `docs/rules/*` (design, SEO, coding, brand). These stay. Note where they overlap with planner rules.

Where documents disagree, apply the newest decisions in `docs/content-planner/project/DECISIONS.md`, then the non-negotiables above. List every conflict you find in the Phase 0 plan. Do not resolve a conflict silently.

## 4. Target architecture

Keep the existing top-level folder names so links and habits survive. Add only what is needed.

```
docs/content-planner/
  README.md                    AI-assistant instructions plus a 5-minute human quick start
  CHANGELOG.md                 versioned changes to the engine
  content-planner.config.json  HOST INTEGRATION (the only place paths and flags live, see 5)
  project/                     facts and decisions about THIS business (replaced per project)
    PROJECT.md  DECISIONS.md  keyword-register.md  roadmap.md  team-and-workflow.md
    url-inventory.md  measurement.md  learning-log.md  code-follow-ups.md
    brand.md                   voice, terminology, avoid-list for THIS brand (human readable)
    rules.config.json          machine-readable project rules (banned phrases, feature words,
                               forbidden channels, forbidden claims, CTA bans, disclosure line)
    briefs/                    one approved brief per page; briefs/golden/ holds exemplar pages
    facts/                     one fact ledger per page (JSON)
  rules/                       reusable rules, no business facts
    content-writing-rules.md   general writing, headings, CTAs, errors, SEO content, tables, tools
    voice.md                   how to write sentences (examples use placeholders, not brand facts)
    eeat-and-people-first.md   Who/How/Why, experience capture, trust signals
    ai-search.md               answer blocks, entities, crawl access, working assumptions
    governor.md                anti-scaled-content rules and caps
    information-gain.md        how to find and state the gain
    interview-questions.md     question banks by page type
    quality-rubric.md          advisory rubric for the reviewer (never a gate)
    wordpress-content-model.md fields and checks for posts
    sources.md                 dated summaries of primary Google and Bing pages (re-checked quarterly)
    content-writer-workflow.md the master workflow, stages 0 to 7
  plans/                       one plan per search intent (01 to 10, 14, 15), reusable structure
  templates/                   brief.md, interview.md, fact-ledger.json, handoff.md, page-skeleton.json, front-matter.md
  schemas/                     Zod schemas: page spec, section types, brief, fact ledger, config
  eval/                        test set, expected results, sample-project fixture
  later/                       parked plans (localization, WHMCS and billing, search and AI delivery standard)
  tools/                       TypeScript scripts (section 7)
  claude/                      source for .claude/commands and .claude/agents (installed by the installer)
```

Rules for the split:
- **Reusable core** = `rules/`, `plans/`, `templates/`, `schemas/`, `eval/`, `tools/`, `claude/`, `later/`, `README.md`. It contains **no** brand name, price, claim, location, channel or owner name. Examples use placeholders such as `[Brand]`, `[Plan]`, `[Product]`.
- **Project data** = `project/` and `content-planner.config.json`. Everything specific to DronaHost goes here. Existing rule files that mix general rules with DronaHost specifics (character, terminology, support channels, email, India, WhatsApp) must be **split**: the general part to `rules/`, the specific part to `project/brand.md` and `project/rules.config.json`.
- **One home for each rule.** No rule may be copied into two files. Other files link to it.

## 5. Host integration (`content-planner.config.json`)

Tools never hard-code app paths. They read this file:

```
{
  "name": "...",
  "locale": "en-US",
  "paths": {
    "register": "project/keyword-register.md",
    "pricing": "data/pricing.json",
    "claims": "content/claims.ts",
    "company": "content/company.ts",
    "pages": "content/pages",
    "posts": "content/posts",           // or null when posts live in WordPress
    "briefs": "project/briefs",
    "facts": "project/facts"
  },
  "adapters": {
    "claims": "ts-export | json",       // how claims are read; claimRenders() is the gate
    "pricing": "json",
    "posts": "files | wordpress"
  },
  "governor": { "maxInFlight": 3, "monthlyNewPages": 4, "paused": false },
  "cta": { "bannedLabels": [], "cardLabelTemplate": "Choose {plan}" },
  "limits": { "titleMax": 60, "descriptionMax": 160, "answerBlockWords": [40, 80], "sentenceMax": 28 },
  "web": { "serpSource": "claude-web", "gscSource": "csv" }
}
```

The engine must work with **no paid API and no secret**: SERP research uses Claude's web search and fetch; Search Console data is read from CSV exports.
Optional adapters (a SERP API, the Search Console API, WordPress REST) sit behind environment variables and are off by default.

## 6. Phases

**Stop at the end of every phase, report, and wait for my "go".**

### Phase 0: Inventory and plan (no changes)

Produce `docs/content-planner/MIGRATION_PLAN.md` containing:
1. **Inventory:** every file that is part of, or overlaps with, the content planner and content writing system. Include duplicates (for example two copies of the content writing rules), the old scripts (`check-register`, `check:pages`, `lint:content`), the content linter in `lib/content/`, briefs in `docs/reference/`, and npm scripts. For each: path, size, purpose, last commit date.
2. **Disposition table:** for each file, one of **keep**, **move to [path]**, **merge into [path]**, **split into core and project**, **replace by [tool]**, **delete**. Give the reason and the proof (for example "all 14 checks are covered by check-content: see test X").
3. **Conflicts:** every contradiction between files, with your proposed resolution and the source of the resolution.
4. **Linter parity map:** list every check the existing linter and scripts perform and where each will live in `check-content`.
5. **Risk list:** anything that could break the app, CI, links, or `CLAUDE.md` pointers.
6. **Open questions** for me. Do not guess.

Acceptance: the plan is complete, no file is changed, and every file in the repo that mentions the planner appears in the table.

### Phase 1: Restructure and de-duplicate

Execute the approved disposition table, **except deletions**.
1. Create the folder layout in section 4. Move and split files as approved. Keep git history where possible (`git mv`).
2. Split mixed files into core and project parts. Move DronaHost specifics into `project/brand.md` and `project/rules.config.json`.
3. Create `content-planner.config.json` and its Zod schema.
4. Fix every internal link. Run a link checker over all `.md` files and report zero broken links.
5. Update `CLAUDE.md` (one short pointer block), `README.md`, and `CHANGELOG.md` (version 1.0.0 begins here).
6. Core must pass the **no-brand test**: a script greps `rules/ plans/ templates/ schemas/ eval/ tools/ claude/ later/` for the project's name, domain, owner name, prices and channel names (read from `project/`) and fails on any hit.

Acceptance: layout matches, no broken links, no-brand test passes, `npm run check:register` still passes, the app builds.

### Phase 2: Workflow, templates, schemas

1. `rules/content-writer-workflow.md`: the master workflow (Stages 0 to 7, from the existing workflow file and the spec), including the intent table, outline patterns by intent, CTA by intent, and the handoff format. It must accept **a keyword or a title**: if a title is given, derive the keyword, show it, and ask me to confirm before continuing.
2. `templates/`: brief, interview, fact ledger (JSON), handoff, page skeleton, front matter. Fields: information gain, SERP snapshot, interview answers verbatim and artifacts, Who/How/Why lines, governor status, claims and prices needed, sources with retrieval dates.
3. `schemas/`: Zod schemas for the page spec and each section type used by the page registry (use `HOME_PAGE_DESIGN.md` section 6 as the starting shape), the brief, the fact ledger, and the config.
4. `rules/sources.md`: fetch and summarize in your own words (no long quotes), with URL and fetch date, the primary pages in spec section 9. If a page cannot be fetched, say so. This file is the single source for "what Google and Bing say". Each rule in `rules/` that depends on them links here.
5. `rules/interview-questions.md`, `rules/information-gain.md`, `rules/governor.md`, `rules/eeat-and-people-first.md`, `rules/ai-search.md`, `rules/quality-rubric.md` (advisory only).
6. Reconcile `plans/01` to `10`, `14`, `15` with the workflow. Keep their templates and checklists. Remove DronaHost specifics into `project/`.

Acceptance: a reviewer can read `README.md`, the workflow, and one plan and write a page without opening any other file. Every schema validates the sample fixtures.

### Phase 3: Tools

All tools are TypeScript run with `tsx`, read `content-planner.config.json`, print clear pass or fail with file and line, and exit non-zero on failure. Add unit tests with passing and failing fixtures for each.

| Tool | Purpose |
|---|---|
| `check-register` | Existing checks, plus: governor caps, `pause`, plan numbers valid, every `published` row has a review date |
| `check-content` | The single content linter for page JSON, Markdown or MDX, and posts. Groups: structure, keyword, facts, voice, people, experience, sources, metadata, schema, policy, overlap, flags. Project-specific lists (banned phrases, feature words, forbidden channels and claims, banned CTA labels, disclosure line) come from `project/rules.config.json`. It must reproduce every check in the Phase 0 parity map |
| `gen-schema` | JSON-LD from the visible fields. Fails if schema and content disagree. No rating or review markup without real, linked reviews |
| `suggest-links` | Internal links (anchor, target, reason) from the register and the page inventory. 3 or more per page |
| `similarity` | Overlap against our own pages and the stored SERP notes (shingle or TF-IDF, no heavy dependency) |
| `gsc-report` | 28-day report from a Search Console CSV export: impressions, clicks, position, queries, and proposed changes |
| `refresh-queue` | What is due for review, by next-review date and by performance |
| `governor` | Reads config and register: in-flight count, monthly count, pause. Refuses to start a new brief beyond the caps |
| `eval` | Runs the evaluation set (section 8) and fails when a result differs from the expectation |
| `install` | Copies `claude/` into the host's `.claude/`, adds npm scripts, creates `project/` from templates if missing, prints next steps |
| `init-project` | Interactive (or flag-driven) setup for a new project: asks for the facts in `PROJECT.md`, writes `project.config`, `brand.md` and `rules.config.json` skeletons, creates an empty register |

`check-content` must never produce a score. It reports pass or fail per rule.

Acceptance: `npm run check:register`, `npm run check:content`, and `npm run eval` pass. Old scripts (`lint:content`, `check:pages`) become thin aliases of `check-content` only after the parity tests pass.

### Phase 4: Claude Code assets (`claude/`, installed to `.claude/`)

Commands (each is a short markdown file that points to the workflow, not a copy of it):
- `/write-content <keyword or title>`: stages 0 to 7. **Stops at APPROVAL 1** (the brief plus the interview). After approval it drafts, checks, and hands off.
- `/plan-keywords <topic>`: researches candidate keywords, applies the governor and intent rules, proposes register rows, never adds more than the cap allows.
- `/refresh-content <url>` and `/audit-page <url>`: check an existing page against the same rules and propose changes.
- `/monthly-review`: runs the AI spot-check list, the 28-day reports and the refresh queue, and updates `project/learning-log.md`.
- `/init-project`: runs `init-project` for a new project.

Subagents, if the installed Claude Code supports them: `researcher`, `fact-checker`, `drafter`, `editor`, each with the allowed and forbidden actions from the spec. If not supported, the same roles run in order inside the command.

Acceptance: `/write-content "how to improve ttfb on wordpress"` produces a brief with a SERP snapshot, fact ledger and interview, then stops. No article is written.

### Phase 5: Integration

1. npm scripts at the repo root, for example `content:check`, `content:eval`, `content:register`, `content:governor`, `content:install`.
2. CI: run `check-register`, `check-content` on changed content files and all posts, and `eval`, on every pull request. A failure blocks merge.
3. WordPress posts: adapter `posts: wordpress` reads posts through the REST or GraphQL API and runs the same checks. The publish webhook must fail when checks fail. Build the check; do not change the WordPress setup itself.
4. Claims and pricing adapters read the real `content/claims.ts` and `data/pricing.json` through `claimRenders()` and `lib/pricing`. Do not change those files.
5. Update `project/code-follow-ups.md` with anything in the app that still has to change.

Acceptance: CI runs green on a clean branch and red on a deliberately bad fixture.

### Phase 6: Reuse test and documentation

1. Create `eval/sample-project/`: a fake business (for example a bakery) with its own `project/` and config.
2. Run `install` and `init-project` against a temporary copy of the repo or a temp folder. Prove that `check-register`, `check-content` and `eval` run on the sample project with **no DronaHost file present**.
3. Write the 5-minute quick start in `README.md` and a "Reuse in another project" section with exact commands.
4. Tag version 1.0.0 in `CHANGELOG.md`.

Acceptance: the sample project passes. The no-brand test passes. A new developer can follow the README and write a first brief in under 10 minutes.

## 7. Behavior of `/write-content` (the contract)

1. **Resolve:** find the keyword or title in the register. Check ownership, exclusion, plan, locale and URL. Run the governor. Stop if refused, and say why.
2. **Classify:** the seven intents mapped to plans. "Local" is never targeted when there is no local presence.
3. **Research:** SERP snapshot (date, top results and page types, common topics, questions, entities, depth, gaps). If web access is unavailable, say so and ask me to confirm the intent. Pull any Search Console data available for related queries.
4. **Fact ledger:** every fact the page may use, with source, retrieval date and status. Facts about the business come only from `project/`, claims, pricing and company files.
5. **Brief:** the full template with the outline by intent, the information gain, internal links (anchor, target, reason), the CTA, schema, and metadata draft.
6. **Interview:** ask the questions for the page type, one at a time. Record answers word for word. Request artifacts. Unanswered becomes a gap, never an invention.
7. **APPROVAL 1:** show the brief and interview. Stop.
8. **Draft:** only from the brief, ledger and interview. Mark every gap `[HUMAN REVIEW]`.
9. **Edit:** voice, clarity, banned phrases, information gain, and a Who/How/Why block.
10. **Check:** run the tools. Fix what fails. List what you cannot fix.
11. **Handoff:** "Ready for owner review", open flags, the draft, metadata, schema, links, CTA, check results, register changes to propose, and what the owner must verify (including any Tier B review).

## 8. Evaluation set (`eval/`)

Ten fixtures with written expectations: a fix keyword, a guide, a comparison, a migration or email page, a service page, a money page, a keyword that must be rejected (excluded), a keyword that cannibalizes an existing page, a keyword with no first-hand answers (must stay "Draft"), and a title that must be turned into a keyword. Add a regression fixture for each failure you find later. The engine must not be changed in a way that breaks an expectation without my approval.

## 9. Deletion rules

- Delete **nothing** until I approve the Phase 0 disposition table.
- Delete only files whose content is fully merged or replaced, with the proof recorded in `MIGRATION_PLAN.md`.
- Deletions go in **their own commit** (`chore: remove superseded planner files`), so they can be reverted alone.
- **Never delete:** application code, `data/`, `content/claims.ts`, `content/company.ts`, `content/pages/`, legal pages, the design, SEO, coding and brand rules in `docs/rules/` (update them to link to the planner where they overlap), `docs/reference/` briefs that are not superseded, or anything you are unsure about. Ask.
- Where two copies of a rule exist, keep the one in the planner and make the other a link.

## 10. Standards

- TypeScript strict. No `any` without a comment. Zod at every boundary. No new dependency without listing it and the reason in the plan (allowed by default: `zod`, `tsx`, `vitest`).
- Readability, similarity and link checks are implemented in plain code.
- Every tool has `--help` and clear messages. Every failing check names the rule, the file, the line and the fix.
- Markdown: US English, short sentences, no emojis, no exclamation marks, tables for lookups.
- Commit messages follow the repo style. One concern per commit.

## 11. Report format after each phase

1. What was done (files created, moved, changed, with counts).
2. Acceptance results: each criterion, pass or fail, with the command output.
3. Anything you did not do, and why.
4. Questions for me.
5. The next phase and what it needs from me.

## 12. Ask me, do not guess

Anything about business facts, legal wording, which old files are safe to delete, WordPress credentials, API keys, paid tools, and any rule where two documents disagree and the decision log is silent.
