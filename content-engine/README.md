# Content Engine

A reusable content engine. You give it **a keyword or a page title**. It checks the keyword, classifies the search intent, records the live results, builds the brief, interviews the owner for first-hand experience, drafts only from allowed material, runs hard checks, prepares metadata, links and schema, and hands back a page **ready for owner review**. The owner approves and publishes. It cannot guarantee a ranking, a featured snippet or an AI citation; it removes obstacles and measures.

Copy the folder into any project, set the brand in two JSON files, fill in `project/`, and it works (see "Reuse").

## For the AI assistant: do this whenever you are asked to write, edit, review or plan content

"Content" means page copy, blog posts, guides, FAQs, CTAs, headlines, metadata, microcopy, comparison tables and keyword plans. The `content-engine` skill (`claude/skills/content-engine/SKILL.md`, installed to `.claude/skills/`) routes every such request here; in a project with this folder it takes precedence over any general or global content-writing skill.

1. Run `npm run content:voice` and read the card: the brand, business type, audience, locale, voice, limits and banned words, from `project/settings.json` and `project/voice.json`. Then read `project/PROJECT.md` (business facts), `project/DECISIONS.md` (owner decisions) and `project/brand.md` (worked examples and product terms).
2. Follow [rules/content-writer-workflow.md](rules/content-writer-workflow.md), stages 0 to 7. If you were given a **title**, derive the keyword, show it with your reason, and ask the owner to confirm before continuing.
3. Find the keyword's plan with `npm run content:resolve -- "<keyword>"` (routing data: `planRouting` in `project/rules.config.json`, first match wins) and read that file in `plans/`. If `project/plan-specifics/<same name>.md` exists, read it too.
4. For a page (not an article), open [rules/page-blueprints.md](rules/page-blueprints.md) and the project's page map (`project/page-map.md`): the blueprint fixes the section count, the required sections, their order, their limits and the word range. Read [rules/voice.md](rules/voice.md). Read [rules/search-intent.md](rules/search-intent.md) for what the page must show for its intent, [rules/eeat-and-people-first.md](rules/eeat-and-people-first.md) for the trust checks, and [rules/trust-and-intent-design.md](rules/trust-and-intent-design.md) for where each element sits on the page. The project's words and links for the checks are in `project/profiles.json`. Open [rules/content-writing-rules.md](rules/content-writing-rules.md) for the section you need.
5. Check `project/keyword-register.md` for an existing owner of the keyword, and the governor ([rules/governor.md](rules/governor.md)): stop if no row owns the keyword (`needs-row`), a cap is reached or the pause switch is on.
6. Build the brief from [templates/brief.md](templates/brief.md), interview the owner with [rules/interview-questions.md](rules/interview-questions.md), and **stop at APPROVAL 1**. No long copy before it.
7. Never invent a fact, a quote, a customer, a review, or first-hand experience. Anything not in `project/PROJECT.md`, the claims registry, the pricing file or the interview becomes a `[HUMAN REVIEW: ...]` note.
8. Draft, edit, run the checks, fix what fails, and hand off with [templates/handoff.md](templates/handoff.md). The status is "Ready for owner review", never "publish-ready".
9. If a rule here conflicts with a request, say so and ask. Do not quietly break a rule.

## Brand settings and voice (change these to reuse the engine)

Two JSON files in `project/` hold everything that makes the engine sound like one business. The loader merges them into the config before any check runs, so a change there reaches every tool.

| File | Holds | Schema |
|---|---|---|
| `project/settings.json` | Brand name, logo wordmark, domain, wrong spellings, title suffix; business type and category, offerings (offered, planned, paused), where the business is based and the pages that may say it; audience and markets; locale and date style; currencies and the tax line; support channels and channels not offered; who drafts, approves and reviews legal text | `schemas/settings.ts` |
| `project/voice.json` | Voice summary and attributes, the too-formal/too-casual spectrum, brands to write like, readability limits (grade, sentence length), spelling variant and the words to respell, exclamation marks, plain-word swaps, banned phrases, idioms, banned CTA labels, the AI disclosure line | `schemas/voice.ts` |

What they drive: the brand name and title suffix (M1), the brand-suffix pattern, the no-brand test terms (brand, domain, misspellings, people), the readability limits (V3, V4, V7), banned phrases and CTA labels (V1, V5), idioms (V8), exclamation marks (V2), the spelling variant (V10) and plain words (V11). `npm run content:config` fails when one of these values is typed in two files.

The detection lists stay in `project/rules.config.json`: feature words, forbidden channels and claims, location wording, plan routing, intent per plan and the no-brand list. Worked examples per page type stay in `project/brand.md`.

## 5-minute quick start (for a person)

1. Run `npm run content:voice` and check that the card describes your business.
2. Open `project/keyword-register.md`, pick a row (status `validated`), or add one (one keyword, one URL).
3. Ask Claude: `/write-content <keyword or title>` (or just "write content for ..."; the skill routes it). It resolves, classifies, researches, builds the fact ledger and the brief, interviews you one question at a time, and stops at APPROVAL 1.
4. Answer the interview questions, one at a time. Say "none" if you have no answer. Gaps are recorded, never invented.
5. Read the brief and the interview read-back. Approve, or say what to change. This is APPROVAL 1.
6. Read the draft and the handoff. Fix the open flags that need your facts. Run the checks below.
7. Publish it yourself. Update the register row (status, owner, next review date).

```
npm run content:voice    the brand and voice card (read before writing)
npm run check:register   the keyword register and the in-flight cap
npm run check:content    drafts and page specs, plus the host's page-spec, visibility and copy-source checks
npm run content:governor in flight, new briefs this month, pause switch
npm run eval             the evaluation set: fails when a rule change breaks an expectation
npm run check:schemas    the schemas against their fixtures
npm run check:config     config, rules, settings and voice; one home per value
npm run check:no-brand   the reusable core names no business
npm run check:links      Markdown links resolve
```

## Folder map

```
content-engine/
  README.md                    this file
  CHANGELOG.md                 versioned changes to the engine
  content-engine.config.json   host integration: paths, adapters, governor, limits (schema: schemas/config.ts)
  project/                     everything about THIS business (replaced per project)
    settings.json  voice.json  brand identity and voice as data (read by every tool)
    PROJECT.md  DECISIONS.md  brand.md  keyword-register.md  roadmap.md  team-and-workflow.md  url-inventory.md
    measurement.md  learning-log.md  code-follow-ups.md  rules.config.json  profiles.json
    blueprints.json  page-gates.json  page-map.md    page data: sections, word ranges, gates, status
    adapters/  tests/          project-side code the engine calls (for example the pricing loader) and its tests
    plan-specifics/  briefs/  drafts/  facts/  handoffs/  later/
  rules/                       reusable rules, no business facts
    content-writer-workflow.md  content-writing-rules.md  voice.md  eeat-and-people-first.md  search-intent.md  ai-search.md
    trust-and-intent-design.md  page-blueprints.md  governor.md  information-gain.md  interview-questions.md
    quality-rubric.md  sources.md  wordpress-content-model.md
  plans/                       one plan per page family: 01 to 10, 14, 15
  templates/                   brief.md  interview.md  fact-ledger.json  handoff.md  page-skeleton.json  front-matter.md
  schemas/                     Zod: config, rules-config, settings, voice, brief, fact-ledger, page-envelope, front-matter, blueprints, profiles
  eval/                        evaluation cases, fixtures and a fictional sample project
  later/                       parked plans: 11 locales and currency, 12 billing system, 13 search and AI launch standard
  claude/                      source for .claude/ (copied by `npm run content:install`)
    commands/  write-content  plan-keywords  refresh-content  audit-page  monthly-review  init-project
    agents/    researcher  fact-checker  drafter  editor   (roles with allowed and forbidden actions)
    skills/    content-engine   (routes every content request to the engine)
  tools/                       TypeScript run with tsx; read the config; exit non-zero on failure
  history/                     the original build prompt, spec and Phase 0 migration plan (kept for history)
```

## Tools

All are TypeScript run with `tsx`, read `content-engine.config.json` (or `CONTENT_ENGINE_CONFIG`), print `FAIL <rule> <file>:<line> <what>. Fix: <what to do>`, and exit non-zero on failure. None gives a score. Each has `--help`.

| Tool | npm script | Purpose |
|---|---|---|
| `voice-card` | `content:voice` | The brand and voice card from settings.json and voice.json |
| `check-register` | `content:register` | The keyword register: duplicates, values, plan numbers, and the in-flight cap |
| `check-content` | `content:check` | The one checker for page specs and Markdown: 15 rule groups, including Voice (V1 to V11), Blueprint (BP1 to BP12), Intent (IN1 to IN5) and Trust (TR1 to TR8) |
| `owed` | `content:owed` | Per page: the hidden sections and the facts only a person can supply |
| `check-changed` | `content:changed` | `check-content` on the files changed in a branch (the CI gate) |
| `ci` | `content:ci` | Every check in order, as CI runs them |
| `governor` | `content:governor` | In flight, new briefs this month, pause switch |
| `resolve` | `content:resolve` | Title to keyword, register owner (`needs-row` when none), excluded and cannibalization check, plan and intent |
| `eval` | `content:eval` | The evaluation set: fails when a rule change breaks an expectation |
| `gen-schema` | `content:gen-schema` | JSON-LD from visible fields; fails if schema and content disagree |
| `suggest-links` | `content:suggest-links` | Internal links (anchor, target, reason) from the register and the page inventory |
| `similarity` | `content:similarity` | Overlap with our own pages and the stored SERP notes |
| `gsc-report` | `content:gsc-report` | 28-day report from a Search Console CSV, with proposed changes |
| `refresh-queue` | `content:refresh-queue` | What is due for review, by date and by performance |
| `wp-posts`, `wp-webhook` | `content:posts`, `content:webhook` | Check WordPress posts; a publish-check endpoint (see `rules/wordpress-content-model.md`) |
| `install`, `init-project`, `copy-engine` | `content:install`, `content:init-project`, `content:copy` | Install into a host project; set up a new project; copy the core to another project |
| `check-config`, `check-schemas`, `check-no-brand`, `check-links` | `content:config`, `content:schemas`, `content:no-brand`, `content:links` | Self-checks of the engine |
| `run-tests` | `test:tools`, `test:project` | The engine's own tests (against the sample project) and the project's adapter tests |

Rule IDs a tool adds on its own: BP0 (the configured visibility command failed), CC0 (a path given to `check-content` does not exist), LK0 (`check-links` found no files), JS1 to JS3 (`gen-schema`). Optional config keys, defaults in `schemas/config.ts`: `adapters.cwd` (where host commands run), `limits.keywordDensityWarnAbove` and `keywordDensityFailAbove`, `strictPlans`, `guidePlans`, `firstScreen`, `claimedFigures`, `ctaKeys`.

The older names `check:register`, `check:content`, `check:schemas`, `check:config`, `check:no-brand`, `check:links` and `lint:content` still work and run the same tools. In this project `check:pages` and `lint:content` run `check-content` on the page specs only.

Reusable core = `rules/ plans/ templates/ schemas/ eval/ tools/ claude/ later/` plus this README and the changelog. It names no brand, price, claim, location, channel or owner (`npm run check:no-brand` proves it; the brand terms come from settings.json). Everything specific to the business is in `project/` and the config.

## How it works

```
keyword or title -> voice card -> resolve -> classify -> research + fact ledger -> brief -> interview -> APPROVAL 1
                 -> draft -> edit -> metadata -> checks -> handoff -> owner review -> publish -> register -> measure
```

## The plans

| # | Plan | Searcher thinks | Pages |
|---|---|---|---|
| 01 | [Money pages](plans/01-money-pages.md) | "I want to buy this" | product, plan, pricing and landing pages |
| 02 | [Commercial investigation](plans/02-commercial-investigation.md) | "Which one should I pick?" | comparisons, alternatives |
| 03 | [Informational](plans/03-informational.md) | "I want to understand this" | guides, explainers, glossary, help articles |
| 04 | [Problem and troubleshooting](plans/04-problem-and-troubleshooting.md) | "Something is broken" | fix guides |
| 05 | [Regional](plans/05-regional-and-location.md) | "Is this right for my country?" | regional pages |
| 06 | [Service pages](plans/06-service-pages.md) | "I need someone to do this for me" | service, case study and portfolio pages |
| 07 | [Compliance, trust and policies](plans/07-compliance-and-trust.md) | "Can I trust this?" | policy pages (Tier A and B), rule explainers |
| 08 | [Domains](plans/08-domains.md) | "Is this name free?" | domain and TLD pages |
| 09 | [Navigational and brand](plans/09-navigational-brand.md) | "Take me to the brand" | about, contact, reviews, status and changelog |
| 10 | [AI search and questions](plans/10-ai-search-queries.md) | "Explain it to me" | a layer on every page |
| 14 | [Migration and email](plans/14-migration-and-email.md) | "Can you move my site?" / "Where do I get email?" | migration, migration terms, email |
| 15 | [Off-site: reviews, listings, links](plans/15-off-site-reviews-and-links.md) | "Can I trust what others say?" | reviews, listings, partnerships, press |

Build order: see `project/roadmap.md`. Plan numbers 11 to 13 live in `later/`. New plans therefore start at 16.

## Which plan owns a keyword

The source is `planRouting` in `project/rules.config.json`: the patterns are tried in order and **the first match wins**; a query that starts with the brand name goes to 09 first; anything unmatched goes to 03. `npm run content:resolve` applies it. A rough guide to the shipped order:

| The query has... | Plan |
|---|---|
| `vs`, `alternative`, `compare` | 02 |
| `migration`, `move my site`, `switch host`, business email | 14 |
| `domain`, `.com`, `transfer`, `tld` | 08 |
| a country plus the product (`wordpress hosting uk`) | 05 |
| a rule (`gdpr`, `dpa`, `privacy`, `terms`, `refund policy`, `sla`) | 07 |
| `agency`, `services`, `hire`, `redesign`, `developer`, `maintenance` | 06 |
| `slow`, `hacked`, `error`, `fix`, `why is`, `not working` | 04 |
| reviews on a named platform, partnerships, press | 15 |
| `how to`, `what is`, `guide`, `checklist`, `explained` | 03 |
| `buy`, `price`, `plans`, the product name | 01 |

One keyword, one URL. Look-alike phrases go in the Secondary column of the owning row. Keywords in the register are guesses until a tool records a volume with source and date.

## Page length (content volume)

Each page blueprint has a word range (`words` in the project's blueprint data, `paths.blueprints`); `rules/page-blueprints.md` gives the defaults for a new project. The brief states the target from that range. Word counts are guides: cover the intent completely and never pad. A page under its blueprint's minimum is flagged as thin; above the maximum, as long (BP11, a warning).

## The rules that matter most

1. **Human first.** A person fills the brief (reader's question, our angle, what we know first-hand, one original element) before any AI draft. Every fact is in the fact ledger. Every page has an owner and a reviewer. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text. Disclosure follows `rules/content-writing-rules.md` section 8.5.
2. **No invented facts.** Business facts come from `project/PROJECT.md` and the registries it names. Prices come only from the pricing file.
3. **Answer first, and answer everything.** A 40 to 80 word direct answer under the H1 and under question headings, and every reader question listed in the brief answered on the page (rule IN5).
4. **Trust is visible.** Every page shows who reviewed it and when (a byline or the provenance section), one first-hand element, and its honest limits; it never uses pressure wording (rules TR6 to TR8, [rules/trust-and-intent-design.md](rules/trust-and-intent-design.md)).
5. **One reason-led headline** ("[Outcome] because [verified reason]") on money, service, regional and landing pages, with a fallback. Not on guides or policy pages.
6. **Tools and tables** follow rules sections 9 and 10. **Maintenance pages** follow section 11. **UI microcopy** follows sections 4 to 6 and 13.
7. **Location, tax and claims rules** are in `project/PROJECT.md` and `project/settings.json`. They override any example.
8. **Every page** has 3 or more internal links, a named owner and a next review date. A FAQ is required on money, service, regional, domain, guide and fix pages, with the count per `limits.faqItemsByArchetype`.
9. **Roles and legal text.** Claude drafts, the owner approves. Tier A policy pages (commercial promises) are approved by the owner. Tier B legal documents need a qualified human and stay drafts until then (`plans/07`).
10. **Only offered channels.** Never mention a support channel the project does not offer (`support` in `project/settings.json`; detection phrases in `forbiddenChannels`).
11. **Flag, do not guess.** Missing facts become `[HUMAN REVIEW: ...]` notes. A page is published with none open.

## Where this engine overrides general writing skills

A global skill such as `seo-content-writer` may be installed for other projects. In a project with this folder, the `content-engine` skill and `/write-content` take precedence, and where they disagree this folder wins: no typed brand suffix in titles (measured with the suffix the helper adds: warn above 60 characters, fail above 70), word counts are guides from the blueprint, FAQ counts per archetype and answers of 40 to 80 words, no keyword-density targets, no statistic without a source and a date, no invented volume or difficulty, no scraping of search engines, years only from a review date field, and nothing written before APPROVAL 1. The global skill may still be used for research ideas (competitor gaps, People Also Ask) through the `researcher` agent's rules.

## Reuse in another project

Needs Node 20 or newer, `tsx` and `zod` (`npm i -D tsx zod`). Nothing else, no paid API and no secret: the web research uses Claude's own search and fetch, and Search Console data comes from CSV exports.

```
# 1. In the project that has the engine, copy it into your project (plain Node; the same on macOS, Linux and Windows)
npm run content:copy -- --to ../your-project
#    no copy of this project at hand? run the tool straight from the engine folder:
#    npx tsx content-engine/tools/copy-engine.ts --to ../your-project

# 2. In your project: install the dependencies, then the commands, the agents, the skill and the npm scripts
cd ../your-project
npm i -D tsx zod
npx tsx content-engine/tools/install.ts

# 3. Create the project folder, the config, settings.json and voice.json
npm run content:init-project -- --name "Your Business" --domain example.com --owner "Your Name" --locale en-US --type "what the business is" --yes

# 4. Set the brand and the voice, then prove the engine is healthy
#    edit content-engine/project/settings.json and voice.json, then:
npm run content:voice && npm run content:config && npm run content:no-brand && npm run content:eval
```

Add `--with-sample` to step 1 to copy the fictional bakery example too. `npm run content:copy -- --to <folder> --dry-run` lists what would be copied and writes nothing.

Then fill in the facts, in this order: `project/settings.json` and `project/voice.json` (who you are and how you sound), `project/PROJECT.md` (business facts), `project/brand.md` (worked examples and product terms), `project/rules.config.json` (channels you do not offer, claims you cannot make, feature words), `project/pricing.json` and `project/claims.json` if you sell anything, and register rows in `project/keyword-register.md`. Every `[HUMAN REVIEW]` marker is a question for you. Then ask Claude `/write-content "<your first keyword>"`.

**Your first brief (estimate, untimed):** (1) add one register row with status `validated`; (2) `/write-content "<keyword>"` runs the gate, the research and the ledger; (3) answer the interview questions, one at a time ("none" is a fine answer and is recorded as a gap); (4) read the brief and approve it. A rough guess is 10 to 20 minutes of your time.

**See a finished example:** `eval/sample-project/` is a fictional bakery set up exactly as step 3 produces, with settings, a voice, a register, a page, a brief, a ledger and an article that passes every check. Run the engine against it with
`CONTENT_ENGINE_CONFIG=content-engine/eval/sample-project/content-engine.config.json npm run content:ci -- --all`.

**What stays with your project, not in this folder:** the page renderer and its section schemas (register a check command in `adapters.pageSpec`), the metadata helper and sitemap code, the claims and pricing files if they are not JSON (the claims adapter can also read a TypeScript module that exports `CLAIMS` and `claimRenders()`), the CI workflow, and the branch protection that makes the check required. Add a short block to your `CLAUDE.md` that points to this README.

**Proof that it works elsewhere:** `npm run test:reuse` copies only the reusable core into a temporary project (with the same `copy-engine` tool as step 1), runs `install` and `init-project`, overlays the sample bakery and runs every check, then confirms that nothing from this project is in the copy. `npm run test:tools` runs the engine's own tests against the sample project.

## Not in this folder (by design)

- Technical SEO code (the host's SEO rules, metadata helper, JSON-LD code, sitemap, robots). Stack-specific.
- Machine-readable sources of truth in code: the pricing file, the claims registry and the company registry (`paths` in the config). `project/PROJECT.md` describes them and points to them. If they differ, the code file renders and the owner decides which is right.

## Later (parked)

[`later/`](later/) holds multi-country launch and currency switching, billing-system automation and the technical search and AI launch standard. Open them when the site is ready for another country or checkout work.
