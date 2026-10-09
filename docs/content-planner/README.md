# Content Planner

A reusable content engine. You give it **a keyword or a page title**. It checks the keyword, classifies the search intent, records the live results, builds the brief, interviews the owner for first-hand experience, drafts only from allowed material, runs hard checks, prepares metadata, links and schema, and hands back a page **ready for owner review**. The owner approves and publishes. It cannot guarantee a ranking, a featured snippet or an AI citation; it removes obstacles and measures.

Copy the folder into any project, fill in `project/`, and it works (see "Reuse").

## For the AI assistant: do this whenever you are asked to write, edit, review or plan content

"Content" means page copy, blog posts, guides, FAQs, CTAs, headlines, metadata, microcopy, comparison tables and keyword plans.

1. Read this file, then `project/PROJECT.md` (business facts), `project/DECISIONS.md` (owner decisions) and `project/brand.md` (voice and terms).
2. Follow [rules/content-writer-workflow.md](rules/content-writer-workflow.md), stages 0 to 7. If you were given a **title**, derive the keyword, show it with your reason, and ask the owner to confirm before continuing.
3. Find the keyword's plan with "Which plan owns a keyword" below and read that file in `plans/`. If `project/plan-specifics/<same name>.md` exists, read it too (only plans that held business facts have one).
4. For a page (not an article), open [rules/page-blueprints.md](rules/page-blueprints.md) and the project's page map (`project/page-map.md`): the blueprint fixes the section count, the required sections, their order and their limits. Read [rules/voice.md](rules/voice.md). Read [rules/search-intent.md](rules/search-intent.md) for what the page must show for its intent and [rules/eeat-and-people-first.md](rules/eeat-and-people-first.md) for the trust checks; the project's words and links for both are in `project/profiles.json`. Open [rules/content-writing-rules.md](rules/content-writing-rules.md) for the section you need.
5. Check `project/keyword-register.md` for an existing owner of the keyword, and the governor ([rules/governor.md](rules/governor.md)): stop if a cap is reached or the pause switch is on.
6. Build the brief from [templates/brief.md](templates/brief.md), interview the owner with [rules/interview-questions.md](rules/interview-questions.md), and **stop at APPROVAL 1**. No long copy before it.
7. Never invent a fact, a quote, a customer, a review, or first-hand experience. Anything not in `project/PROJECT.md`, the claims registry, the pricing file or the interview becomes a `[HUMAN REVIEW: ...]` note.
8. Draft, edit, run the checks, fix what fails, and hand off with [templates/handoff.md](templates/handoff.md). The status is "Ready for owner review", never "publish-ready".
9. If a rule here conflicts with a request, say so and ask. Do not quietly break a rule.

## 5-minute quick start (for a person)

1. Open `project/keyword-register.md`, pick a row (status `validated`), or add one (one keyword, one URL).
2. Ask Claude: `/write-content <keyword or title>`. It resolves, classifies, researches, builds the fact ledger and the brief, interviews you one question at a time, and stops at APPROVAL 1.
3. Answer the interview questions, one at a time. Say "none" if you have no answer. Gaps are recorded, never invented.
4. Read the brief and the interview read-back. Approve, or say what to change. This is APPROVAL 1.
5. Read the draft and the handoff. Fix the open flags that need your facts. Run the checks below.
6. Publish it yourself. Update the register row (status, owner, next review date).

```
npm run check:register   the keyword register and the in-flight cap
npm run check:content    drafts and page specs (also: npm run lint:content for page specs)
npm run content:governor in flight, new briefs this month, pause switch
npm run eval             the evaluation set: fails when a rule change breaks an expectation
npm run check:schemas    the schemas against their fixtures
npm run check:config     the two config files
npm run check:no-brand   the reusable core names no business
npm run check:links      Markdown links resolve
```

## Folder map

```
docs/content-planner/
  README.md                    this file
  CHANGELOG.md                 versioned changes to the engine
  MIGRATION_PLAN.md            the Phase 0 plan and the owner's answers (history)
  content-planner.config.json  host integration: paths, adapters, governor, limits (schema: schemas/config.ts)
  project/                     facts and decisions about THIS business (replaced per project)
    PROJECT.md  DECISIONS.md  keyword-register.md  roadmap.md  team-and-workflow.md  url-inventory.md
    measurement.md  learning-log.md  code-follow-ups.md  brand.md  rules.config.json  profiles.json
    plan-specifics/  briefs/  drafts/  facts/  later/
  rules/                       reusable rules, no business facts (page-blueprints.md: sections by search intent)
    content-writer-workflow.md  content-writing-rules.md  voice.md  eeat-and-people-first.md  search-intent.md  ai-search.md
    governor.md  information-gain.md  interview-questions.md  quality-rubric.md  sources.md  wordpress-content-model.md
  plans/                       one plan per search intent: 01 to 10, 14, 15
  templates/                   brief.md  interview.md  fact-ledger.json  handoff.md  page-skeleton.json  front-matter.md
  schemas/                     Zod: config, rules-config, brief, fact-ledger, page-envelope, front-matter
  eval/                        fixtures now; the evaluation set arrives in Phase 3
  later/                       parked plans: 11 locales and currency, 12 billing system, 13 search and AI launch standard
  claude/                      source for .claude/commands and .claude/agents (copied by `npm run content:install`)
    commands/  write-content  plan-keywords  refresh-content  audit-page  monthly-review  init-project
    agents/    researcher  fact-checker  drafter  editor   (roles with allowed and forbidden actions)
  tools/                       TypeScript run with tsx; read the config; exit non-zero on failure
```

## Tools

All are TypeScript run with `tsx`, read `content-planner.config.json`, print `FAIL <rule> <file>:<line> <what>. Fix: <what to do>`, and exit non-zero on failure. None gives a score. Each has `--help`.

| Tool | npm script | Purpose |
|---|---|---|
| `check-register` | `content:register` | The keyword register: duplicates, values, plan numbers, and the in-flight cap |
| `check-content` | `content:check` | The one checker for page specs and Markdown: 14 rule groups, including Intent and Trust |
| `owed` | `content:owed` | Per page: the hidden sections and the facts only a person can supply |
| `check-changed` | `content:changed` | `check-content` on the files changed in a branch (the CI gate) |
| `ci` | `content:ci` | Every check in order, as CI runs them |
| `governor` | `content:governor` | In flight, new briefs this month, pause switch |
| `resolve` | `content:resolve` | Title to keyword, excluded and cannibalization check, plan and intent |
| `eval` | `content:eval` | The evaluation set: fails when a rule change breaks an expectation |
| `gen-schema` | `content:gen-schema` | JSON-LD from visible fields; fails if schema and content disagree |
| `suggest-links` | `content:suggest-links` | Internal links (anchor, target, reason) from the register and the page inventory |
| `similarity` | `content:similarity` | Overlap with our own pages and the stored SERP notes |
| `gsc-report` | `content:gsc-report` | 28-day report from a Search Console CSV, with proposed changes |
| `refresh-queue` | `content:refresh-queue` | What is due for review, by date and by performance |
| `wp-posts`, `wp-webhook` | `content:posts`, `content:webhook` | Check WordPress posts; a publish-check endpoint (see `rules/wordpress-content-model.md`) |
| `install`, `init-project` | `content:install`, `content:init-project` | Install into a host project; set up a new project |
| `check-config`, `check-schemas`, `check-no-brand`, `check-links` | `content:config`, `content:schemas`, `content:no-brand`, `content:links` | Self-checks of the engine |

The older names `check:register`, `check:content`, `check:schemas`, `check:config`, `check:no-brand`, `check:links` and `lint:content` still work. `check:pages` is the app's own page-spec check and stays in the app.

Reusable core = `rules/ plans/ templates/ schemas/ eval/ tools/ claude/ later/`. It names no brand, price, claim, location, channel or owner (`npm run check:no-brand` proves it). Everything specific to the business is in `project/` and the config.

## How it works

```
keyword or title -> resolve -> classify -> research + fact ledger -> brief -> interview -> APPROVAL 1
                 -> draft -> edit -> metadata -> checks -> handoff -> owner review -> publish -> register -> measure
```

## The plans

| # | Plan | Searcher thinks | Pages |
|---|---|---|---|
| 01 | [Money pages](plans/01-money-pages.md) | "I want to buy this" | product, plan and pricing pages |
| 02 | [Commercial investigation](plans/02-commercial-investigation.md) | "Which one should I pick?" | comparisons, alternatives |
| 03 | [Informational](plans/03-informational.md) | "I want to understand this" | guides, explainers |
| 04 | [Problem and troubleshooting](plans/04-problem-and-troubleshooting.md) | "Something is broken" | fix guides |
| 05 | [Regional hosting](plans/05-regional-and-location.md) | "Is this right for my country?" | regional pages |
| 06 | [Service pages](plans/06-service-pages.md) | "I need someone to do this for me" | web design, SEO, development, maintenance |
| 07 | [Compliance, trust and policies](plans/07-compliance-and-trust.md) | "Can I trust this?" | policy pages (Tier A and B), rule explainers |
| 08 | [Domains](plans/08-domains.md) | "Is this name free?" | domain and TLD pages |
| 09 | [Navigational and brand](plans/09-navigational-brand.md) | "Take me to the brand" | about, contact, reviews |
| 10 | [AI search and questions](plans/10-ai-search-queries.md) | "Explain it to me" | a layer on every page |
| 14 | [Migration and email](plans/14-migration-and-email.md) | "Can you move my site?" / "Where do I get email?" | `/migration`, `/migration-terms`, `/email`, the email notice |
| 15 | [Off-site: reviews, listings, links](plans/15-off-site-reviews-and-links.md) | "Can I trust what others say?" | reviews, listings, partnerships, press |

Build order (see `project/roadmap.md`): Tier A policy pages first (they unlock the claims), core money pages, trust pages, service pages, comparisons, guides, domains, then regional and locale pages. Off-site work runs in parallel.

Plan numbers 11 to 13 live in `later/`. New plans therefore start at 14.

## Which plan owns a keyword

| The query has... | Plan |
|---|---|
| `vs`, `alternative`, `compare` | 02 |
| a country plus a product (`wordpress hosting uk`) | 05 |
| a question about a rule (`do i need a dpa`) | 07 |
| `agency`, `services`, `hire`, `redesign`, `developer`, `maintenance` | 06 |
| `domain`, `.com`, `.co.uk`, `transfer` | 08 |
| `slow`, `hacked`, `error`, `fix`, `why is` | 04 |
| `how to`, `what is`, `guide`, `checklist` | 03 |
| `buy`, `price`, `plans`, `[product] hosting` | 01 |
| `migration`, `move my site`, `switch host` (the service) | 14 |
| `email` for a domain, `business email` | 14 |
| reviews, listings, partnerships, press | 15 |
| the brand name | 09 |

One keyword, one URL. Look-alike phrases go in the Secondary column of the owning row. Keywords in the register are guesses until a tool records a volume with source and date.

## The rules that matter most

1. **Human first.** A person fills the brief (reader's question, our angle, what we know first-hand, one original element) before any AI draft. Every fact is in the fact ledger. Every page has an owner and a reviewer. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text. Disclosure follows `rules/content-writing-rules.md` section 8.5.
2. **No invented facts.** Business facts come from `project/PROJECT.md` and the registries it names. Prices come only from the pricing file.
3. **Answer first.** A 40 to 80 word direct answer under the H1 and under question headings.
4. **One reason-led headline** ("[Outcome] because [verified reason]") on money, service, regional and landing pages, with a fallback. Not on guides or policy pages.
5. **Tools and tables** follow rules sections 9 and 10. **Maintenance pages** follow section 11.
6. **Location, tax and claims rules** are in `project/PROJECT.md`. They override any example.
7. **Every page** has 3 or more internal links, a FAQ on product, service and guide pages, a named owner and a next review date.
8. **Roles and legal text.** Claude drafts, the owner approves. Tier A policy pages (commercial promises) are approved by the owner. Tier B legal documents need a qualified human and stay drafts until then (`plans/07`).
9. **Only offered channels.** Never mention a support channel the project does not offer (`forbiddenChannels` in `project/rules.config.json`; the reason and the allowed channels are in `project/brand.md`).
10. **Flag, do not guess.** Missing facts become `[HUMAN REVIEW: ...]` notes. A page is published with none open (see "States" in the workflow for what "Ready for owner review" may still carry).

## Where project rules override the `seo-content-writer` skill

Use the skill for research (competitors, gaps, People Also Ask). Where it disagrees, this folder wins: titles carry no typed brand suffix and are measured with the suffix the helper adds (warn above 60 characters, fail above 70), word counts are guides, FAQ answers are 40 to 80 words (warn under 40, fail over 80), and years come only from a review date field.

## Reuse in another project

Needs Node 20 or newer, `tsx` and `zod` (`npm i -D tsx zod`). Nothing else, no paid API and no secret: the web research uses Claude's own search and fetch, and Search Console data comes from CSV exports.

```
# 1. In the project that has the engine, copy it into your project (plain Node; the same on macOS, Linux and Windows)
npm run content:copy -- --to ../your-project
#    no copy of this project at hand? run the tool straight from the engine folder:
#    npx tsx docs/content-planner/tools/copy-engine.ts --to ../your-project

# 2. In your project: install the dependencies, then the commands, the agents and the npm scripts
cd ../your-project
npm i -D tsx zod
npx tsx docs/content-planner/tools/install.ts

# 3. Create the project folder and the config
npm run content:init-project -- --name "Your Business" --domain example.com --owner "Your Name" --locale en-US --yes

# 4. Prove the engine is healthy
npm run content:config && npm run content:no-brand && npm run content:eval
```

Add `--with-sample` to step 1 to copy the fictional bakery example too. `npm run content:copy -- --to <folder> --dry-run` lists what would be copied and writes nothing.

Then fill in the facts, in this order: `project/PROJECT.md` (business facts), `project/brand.md` (voice and words), `project/rules.config.json` (banned phrases, channels you do not offer, claims you cannot make), `project/pricing.json` and `project/claims.json` if you sell anything, and register rows in `project/keyword-register.md`. Every `[HUMAN REVIEW]` marker is a question for you. Then ask Claude `/write-content "<your first keyword>"`.

**Your first brief (estimate, untimed; nobody has timed this with a new user yet):** (1) add one register row with status `validated`; (2) `/write-content "<keyword>"` runs the gate, the research and the ledger; (3) answer the interview questions, one at a time ("none" is a fine answer and is recorded as a gap); (4) read the brief and approve it. A rough guess is 10 to 20 minutes of your time.

**See a finished example:** `eval/sample-project/` is a fictional bakery set up exactly as step 3 produces, with a register, a page, a brief, a ledger and an article that passes every check. Run the engine against it with
`CONTENT_PLANNER_CONFIG=docs/content-planner/eval/sample-project/content-planner.config.json npm run content:ci -- --all`.

**What stays with your project, not in this folder:** the page renderer and its section schemas (register a check command in `adapters.pageSpec`), the metadata helper and sitemap code, the claims and pricing files if they are not JSON (the claims adapter can also read a TypeScript module that exports `CLAIMS` and `claimRenders()`), the CI workflow (copy the step from this project's `.github/workflows/ci.yml`), and the GitHub branch protection that makes the check required. Add a short block to your `CLAUDE.md` that points to the README (copy the one in this project's `CLAUDE.md`).

**Proof that it works elsewhere:** `npm run test:reuse` copies only the reusable core into a temporary project (with the same `copy-engine` tool as step 1), runs `install` and `init-project`, overlays the sample bakery and runs every check, then confirms that nothing from this project is in the copy. `npm run test:tools` runs the engine's own tests against the sample project, so they do not depend on this project's data.

## Not in this folder (by design)

- Technical SEO code (`docs/rules/seo-rules.md`): metadata helper, JSON-LD code, sitemap, robots. Stack-specific.
- Machine-readable sources of truth in code: `data/pricing.json`, `content/claims.ts`, `content/company.ts`. `project/PROJECT.md` describes them and points to them. If they differ, the code file renders and the owner decides which is right.

## Later (parked)

[`later/`](later/) holds multi-country launch and currency switching, billing-system automation and the technical search and AI launch standard. Open them when the site is ready for another country or checkout work.
