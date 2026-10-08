# Content engine: Phase 0 migration plan

Status: Phase 0 only. Written 2026-10-08 on branch `feat/content-engine` (created from `feat/super-planner-a`). No file other than this one was created or changed. Nothing is deleted until you approve the disposition table (section 2).

Source: `docs/reference/CONTENT_ENGINE_BUILD_PROMPT.md`. Section numbers below match its structure.

## 0. What I found in one page

- The planner already has most of the **content** (rules, plans, project facts, sources, interview, information gain, workflow) and a first `check-content` (rules S1 to S5, V1 to V4, F1 to F3, P1 to P2, M1 to M4, G1). It is committed once, in `876e00d` (2026-10-08), so every planner file shows that date as its last commit.
- Three checkers do overlapping work: `check:pages` (schema and layout), `lint:content` (copy rules on page JSON) and `check:content` (copy rules on page JSON and Markdown). They disagree on several limits (section 4).
- The "core" is not standalone today. `check-content.ts` imports `content/claims.ts` and `lib/content/lint.ts`, and hard-codes "DronaHost" in rules M1, F2 and F3. 29 of 38 planner text files (fixtures excluded) contain brand, tax, channel or provider words.
- Three files the prompt tells me to read do not exist as named (section 3, C1).
- The working tree has 61 uncommitted changes that are not about the planner (pricing, `data/vs`, pages, CI). I will not touch or commit them.

## 1. Inventory

Sizes are bytes. "Last commit" is the last commit that touched the path; `-` means untracked or never committed.

### 1.1 Planner folder `docs/content-planner/`

| Path | Size | Purpose | Last commit |
|---|---|---|---|
| `README.md` | 13,422 | AI instructions, folder map, plan table, brief template, reuse notes | 2026-10-08 |
| `project/PROJECT.md` | 10,755 | Business facts, tax, locations, channels, missing-facts checklist | 2026-10-08 |
| `project/DECISIONS.md` | 5,303 | Owner decisions 1 to 27 | 2026-10-08 |
| `project/keyword-register.md` | 10,330 | One owner per keyword and URL (1 row in flight: ttfb) | 2026-10-08 |
| `project/roadmap.md` | 4,315 | Build order and gates | 2026-10-08 |
| `project/team-and-workflow.md` | 3,362 | Roles, review tiers, capacity | 2026-10-08 |
| `project/url-inventory.md` | 3,847 | Old URL to new URL map | 2026-10-08 |
| `project/measurement.md` | 3,479 | Events, Search Console, review rhythm | 2026-10-08 |
| `project/code-follow-ups.md` | 5,277 | App changes the planner needs | 2026-10-08 |
| `project/tier-a-briefs.md` | 6,395 | Briefs and owner questions for Tier A policy pages | 2026-10-08 |
| `project/briefs/improve-ttfb-wordpress.md` | 6,910 | Phase A test brief | 2026-10-08 |
| `project/drafts/improve-ttfb-wordpress.md` | 8,759 | Phase A test draft (Markdown with front matter) | 2026-10-08 |
| `project/facts/improve-ttfb-wordpress.md` | 1,411 | Fact ledger (Markdown) | 2026-10-08 |
| `rules/content-writing-rules.md` | 49,369 | Tone, terms, headings, CTAs, errors, empty states, SEO copy, AI use, tools, tables, maintenance, "because" headlines (935 lines) | 2026-10-08 |
| `rules/voice.md` | 11,852 | Sentence rules and examples by page type | 2026-10-08 |
| `rules/content-writer-workflow.md` | 12,822 | Stages 0 to 7, intent table, brief template | 2026-10-08 |
| `rules/sources.md` | 9,478 | Dated summaries of Google pages | 2026-10-08 |
| `rules/interview-questions.md` | 3,200 | Question banks by page type | 2026-10-08 |
| `rules/information-gain.md` | 4,099 | How to find and state the gain | 2026-10-08 |
| `rules/wordpress-content-model.md` | 5,565 | Post fields and checks | 2026-10-08 |
| `plans/01-money-pages.md` | 11,613 | Plan 01 | 2026-10-08 |
| `plans/02-commercial-investigation.md` | 5,572 | Plan 02 (`scripts/check-vs.ts` and `data/vs/types.ts` cite this path) | 2026-10-08 |
| `plans/03-informational.md` | 5,996 | Plan 03 | 2026-10-08 |
| `plans/04-problem-and-troubleshooting.md` | 4,504 | Plan 04 | 2026-10-08 |
| `plans/05-regional-and-location.md` | 8,816 | Plan 05 | 2026-10-08 |
| `plans/06-service-pages.md` | 8,943 | Plan 06 | 2026-10-08 |
| `plans/07-compliance-and-trust.md` | 15,141 | Plan 07 (Tier A and B) | 2026-10-08 |
| `plans/08-domains.md` | 4,222 | Plan 08 | 2026-10-08 |
| `plans/09-navigational-brand.md` | 3,491 | Plan 09 | 2026-10-08 |
| `plans/10-ai-search-queries.md` | 3,792 | Plan 10 | 2026-10-08 |
| `plans/14-migration-and-email.md` | 7,977 | Plan 14 | 2026-10-08 |
| `plans/15-off-site-reviews-and-links.md` | 6,060 | Plan 15 | 2026-10-08 |
| `later/11-localization-country-language-currency.md` | 18,012 | Parked: locales and currency | 2026-10-08 |
| `later/12-whmcs-data-and-automation.md` | 25,297 | Parked: billing automation (86 brand or provider words) | 2026-10-08 |
| `later/13-search-and-ai-delivery-standard.md` | 9,803 | Parked: launch gates | 2026-10-08 |
| `tools/check-register.ts` | 5,827 | Register checker (`npm run check:register`) | 2026-10-08 |
| `tools/check-content.ts` | 21,925 | check-content v1 (`npm run check:content`) | 2026-10-08 |
| `tools/check-content.test.ts` | 1,851 | 6 tests on `node:test` (`npm run test:content`) | 2026-10-08 |
| `tools/fixtures/` (8 files: `register.md`, `pass-guide.md`, `pass-draft-with-flags.md`, `pass-page.json`, `fail-structure.md`, `fail-facts.md`, `fail-flags.md`, `facts/pass-guide.md`) | about 17,000 | Test fixtures | 2026-10-08 |
| `.DS_Store` | 8,196 | macOS noise (ignored by `.gitignore`, not tracked) | - |

### 1.2 Overlapping files outside the folder

| Path | Size | Purpose | Last commit |
|---|---|---|---|
| `docs/content-planner.zip` | 95,577 | Older snapshot of the planner (25 entries) | - (untracked) |
| `docs/reference/content-writer-workflow.md` | 11,521 | Older copy of the workflow | 2026-10-08 |
| `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md` | 19,929 | The spec the engine extends | 2026-10-08 |
| `docs/reference/CONTENT_ENGINE_BUILD_PROMPT.md` | 21,336 | This job's prompt | - (untracked) |
| `docs/reference/HOME_PAGE_DESIGN.md` | 168 | Stub pointing to `pages/HOME_PAGE_DESIGN.md` | - (untracked) |
| `docs/reference/pages/HOME_PAGE_DESIGN.md` | 21,919 | Page JSON shape and section registry (line 314 tells the builder to read the planner) | 2026-10-06 (modified, uncommitted) |
| `docs/reference/RULES_REVIEW_AND_PAGE_SYSTEM.md` | - | Deleted in the working tree, still in `HEAD`. Not committed as a deletion | 2026-10-06 |
| `docs/reference/PLACEHOLDERS.md`, `CLAIMS_TO_VERIFY.md` | 5,197 / 4,169 | Sources named by `PROJECT.md` | 2026-10-06 |
| `docs/rules/content-writing-rules.md` | 217 | Stub that links to the planner copy (many files link to it) | 2026-10-06 (modified, uncommitted) |
| `docs/rules/seo-rules.md` | 55,565 | SEO implementation, copy rules in section 7 point to the stub | 2026-10-06 |
| `docs/rules/ui-ux-rules.md` | 61,155 | Line 1490 links the stub | 2026-10-06 |
| `docs/rules/coding-rules.md`, `brand-identity.md` | 24,469 / 3,490 | Design and coding rules (stay) | 2026-10-06 |
| `docs/DECISIONS.md` | 2,797 | Design decisions. Line 4 cites the deleted review file | 2026-10-06 |
| `docs/content-system.md` | 4,565 | Describes `check:pages` and `lint:content` | 2026-10-06 |
| `docs/pages/home.md` | 17,816 | Home copy brief (cites the stub twice) | 2026-10-06 |
| `docs/components/CHANGELOG.md` | - | History entries for `check:pages` and `lint:content` (lines 132, 140) | 2026-10-06 |
| `docs/superpowers/specs/2026-05-26-homepage-content-design.md` | 5,018 | Historical spec, cites rules section 7 | 2026-10-06 |
| `CLAUDE.md` (same file as `claude.md` on this case-insensitive disk; git tracks `claude.md`) | 25,661 | Project instructions with content-planner block (lines 53 to 84, 314, 496, 505) | 2026-10-06 (modified, uncommitted) |
| `.claude/commands/write-content.md` | 2,369 | `/write-content` command | 2026-10-08 |
| `.claude/settings.local.json` | 1,590 | Permission allowlist (`Bash(npm run *)` covers new scripts) | - |
| `package.json` | - | Scripts: `check:pages`, `lint:content`, `check:register`, `check:vs`, `check:content`, `test:content` | 2026-10-06 (modified, uncommitted) |
| `.github/workflows/ci.yml` | 1,976 | Static job runs `check:pages`, `lint:content`, `check:register`, `check:vs`. It does not run `check:content` or `test:content` | 2026-10-06 (modified, uncommitted) |

### 1.3 Old scripts and the in-app linter

| Path | Size | Purpose | Last commit |
|---|---|---|---|
| `scripts/validate-pages.ts` | 1,822 | `check:pages`: Zod parse of `content/pages/*.json`, layout-signature collisions, FAQ under 40 words warning | 2026-10-06 |
| `scripts/lint-content.ts` | 1,986 | `lint:content`: runs `lintPage`, duplicate title and description across pages, hidden-claim report | 2026-10-06 |
| `lib/content/lint.ts` | 7,308 | The page linter: banned lists, copy extraction, reading grade, link and claim checks. Imported only by `lint-content.ts` and `check-content.ts` | 2026-10-06 (modified, uncommitted) |
| `scripts/check-vs.ts` | 3,246 | Comparison data check (cites Plan 02) | - (untracked) |
| `lib/content/` other files (`schemas/`, `page.ts`, `layout-signature.ts`, `refs.ts`, `features.ts`, `published-pages.ts`, `registry.tsx`, `requires-grammar.ts`, `reviews.ts`) | - | App code that renders page JSON | 2026-10-06 |
| `content/pages/home.json` | 10,832 | The only page spec | 2026-10-06 (modified) |
| `content/claims.ts` | - | `claimRenders(record)`, `isVerified(id)`, `CLAIMS` | 2026-10-06 (modified) |

### 1.4 Files that only mention the planner (comments or links)

`components/ui/EmptyState.tsx` (comment), `content/forms.ts` (comment), `content/home.ts` (comment), `data/pricing.json` line 38 (note string), `data/vs/types.ts` (comment, cites Plan 02), `app/[locale]/(marketing)/vs/[competitor]/page.tsx` (comment, cites Plan 02). These are app files. I will not change them.

## 2. Disposition table

Dispositions use the prompt's words. "Proof" is what I will show before anything is removed. Only rows marked **delete** need your approval to remove; every other row is carried out in Phase 1 or later. New files the prompt asks for (for example `rules/governor.md`) are not listed here; they are created in the phase that owns them.

### 2.1 Planner folder

| Path | Disposition | Reason and proof |
|---|---|---|
| `README.md` | keep (rewritten in Phase 2) | Becomes AI instructions plus a 5-minute quick start. Brand folder map and reuse notes are rewritten. Brief template is removed from it and linked from the workflow (one home per rule) |
| `project/PROJECT.md`, `DECISIONS.md`, `keyword-register.md`, `roadmap.md`, `team-and-workflow.md`, `url-inventory.md`, `measurement.md`, `code-follow-ups.md` | keep | Project data. Already in the right place |
| `project/tier-a-briefs.md` | keep (Q4) | Project data. Not in the target tree. Proposed home: `project/briefs/tier-a-briefs.md` |
| `project/briefs/improve-ttfb-wordpress.md` | keep | Becomes the first brief in `project/briefs/` |
| `project/drafts/improve-ttfb-wordpress.md` | keep (Q4) | `drafts/` is not in the target tree and `check-content` reads it by default |
| `project/facts/improve-ttfb-wordpress.md` | replace by `project/facts/improve-ttfb-wordpress.json` | Target format is JSON. Old `.md` is deleted only after the JSON is generated from it and F1 gives the same result (proof: test X in Phase 2). **Delete later, with approval** |
| `rules/content-writing-rules.md` | split into core and project | General: sections 3 to 12 and the general parts of 5 and 6 go to `rules/content-writing-rules.md`. Brand, terminology, regions, channels, India, tax: sections 1 and 2 and the DronaHost parts go to `project/brand.md` and `project/rules.config.json`. Section numbers stay stable because CLAUDE.md cites section 7 |
| `rules/voice.md` | split into core and project | Rules and placeholder examples stay. Brand examples (12 hits) move to `project/brand.md` |
| `rules/content-writer-workflow.md` | keep (rewritten in Phase 2) | Master workflow. Absorbs the spec. Gets the title-to-keyword step |
| `rules/sources.md`, `interview-questions.md`, `information-gain.md` | keep | Already core and brand-free (sources 0 hits, interview 0, gain 2 minor) |
| `rules/wordpress-content-model.md` | keep | Core. One brand hit to remove |
| `plans/01`, `02`, `05`, `06`, `07`, `08`, `09`, `10`, `14`, `15` | split into core and project | Each has 3 to 13 brand, tax, channel or provider words. Structure and checklists stay. Specifics move to `project/` |
| `plans/03`, `04` | keep | 0 brand hits |
| `later/11-localization-...md`, `later/13-search-and-ai-delivery-standard.md` | split into core and project | 6 and 4 hits |
| `later/12-whmcs-data-and-automation.md` | split into core and project (Q5) | 86 hits. It is mostly DronaHost billing facts. I recommend the generic pattern stays in `later/` and the facts move to `project/later/12-whmcs.md` |
| `tools/check-register.ts` | replace by `tools/check-register.ts` v2 | Same file name, extended (governor, pause, plan numbers). Old checks all kept (parity map 4.3) |
| `tools/check-content.ts` | replace by `tools/check-content.ts` v2 | Rewritten to read config and adapters, add groups, and drop app imports. All current rules kept (parity map 4.2) |
| `tools/check-content.test.ts` | replace by unit tests per tool (Q6) | Same six cases are kept as the starting set |
| `tools/fixtures/*` | move to `eval/fixtures/` (and `tools/fixtures/` for tool unit tests) | Keep fixtures as regression cases. Moved with `git mv` |

### 2.2 Outside the folder

| Path | Disposition | Reason and proof |
|---|---|---|
| `docs/reference/content-writer-workflow.md` | delete (after Phase 2) | The planner copy is a superset. `diff` shows 8 hunks, all newer wording in the planner copy (governor, gain, interview, ledger, who-how-why). One field exists only in the old copy: "one original element" (see C3). I add it to the new brief template first, then show the diff |
| `docs/content-planner.zip` | delete (Q7) | Untracked snapshot from before Phase A. Every file in it exists in the folder in a newer form (checked with `diff -rq`). Not on the never-delete list, but I am asking |
| `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md` | keep until Phase 6, then decide (Q8) | It is the spec. Its content moves into the workflow, `governor.md`, `eeat-and-people-first.md` and `ai-search.md`. Not superseded until those exist |
| `docs/reference/CONTENT_ENGINE_BUILD_PROMPT.md` | keep | The prompt |
| `docs/reference/HOME_PAGE_DESIGN.md` (stub), `pages/HOME_PAGE_DESIGN.md` | keep | Page JSON shape source. Stub keeps old links working |
| `docs/reference/RULES_REVIEW_AND_PAGE_SYSTEM.md` | keep deleted-as-is (Q2) | Your uncommitted deletion. I will not commit it or restore it. Dead links to it are fixed in Phase 1 |
| `docs/reference/PLACEHOLDERS.md`, `CLAIMS_TO_VERIFY.md` | keep | Not superseded |
| `docs/rules/content-writing-rules.md` (stub) | keep | Many files link to it. Never-delete rule applies. I will leave the stub |
| `docs/rules/seo-rules.md`, `ui-ux-rules.md`, `coding-rules.md`, `brand-identity.md` | keep | Stay. Phase 1 adds links where they overlap the planner (C5, C6) |
| `docs/DECISIONS.md` | keep, fix line 4 | Cites the deleted review file |
| `docs/content-system.md`, `docs/pages/home.md`, `docs/components/CHANGELOG.md`, `docs/superpowers/specs/2026-05-26-homepage-content-design.md` | keep, update `content-system.md` only | `content-system.md` describes the old scripts and is updated in Phase 5. The rest are history |
| `CLAUDE.md` | keep, update (Q3) | Pointer block change is approved by Phase 1 of the prompt. Whether the non-negotiable bullets stay is Q3 |
| `.claude/commands/write-content.md` | move to `claude/commands/write-content.md` | The installer copies it back to `.claude/commands/`. To avoid a gap I keep the `.claude` copy until the installer exists (R6) |
| `.claude/settings.local.json` | keep | Not planner |
| `package.json` | keep, add scripts | Old script names stay as aliases (R3) |
| `.github/workflows/ci.yml` | keep, update in Phase 5 | Adds `check-content`, `eval`. Today it does not run `check:content` (R4) |
| `scripts/validate-pages.ts` (`check:pages`) | keep as host adapter, then alias | Zod parse and layout signature are app-specific (Q9). Copy checks move to `check-content` |
| `scripts/lint-content.ts` (`lint:content`) | replace by `check-content` | Becomes a thin alias only after the parity tests in 4.1 pass |
| `lib/content/lint.ts` | split: keep `copyStrings` and the page-JSON extraction as the host adapter; move banned lists to `project/rules.config.json` | The planner must stop importing app code. `claimUsage` stays in the app for the hidden-claim report |
| `scripts/check-vs.ts`, `data/vs/*` | keep | Comparison data check, not planner. Its comment cites Plan 02, whose path does not change |
| `lib/content/*` other, `content/pages/*.json`, `content/claims.ts`, `data/pricing.json`, `content/company.ts` | keep, do not change | Never-delete list and non-negotiable 8 |
| Comment-only mentions (1.4) | keep | App files. No change |

## 3. Conflicts

I list each one, my proposal and its source. None is resolved silently. Items marked **needs you** have no deciding line in `project/DECISIONS.md`.

| # | Conflict | Proposed resolution | Source of the resolution |
|---|---|---|---|
| C1 | The prompt's read list names `CONTENT_PLANNER_REVIEW.md` (never existed in git, any branch) and `RULES_REVIEW_AND_PAGE_SYSTEM.md` (deleted in your working tree; `HEAD` still has it). It names `docs/reference/HOME_PAGE_DESIGN.md`, which is a stub. | Skip the first. Read the second from `HEAD` (done). Use `docs/reference/pages/HOME_PAGE_DESIGN.md` for the section shapes. | Facts on disk. Needs you only for Q2 |
| C2 | Two copies of the workflow: `docs/reference/` (older) and `rules/` (newer). | Keep the `rules/` copy. Delete the old one after Phase 2. | Prompt section 9: "keep the one in the planner" |
| C3 | The old workflow brief has "HUMAN FIRST: ... what we know first-hand / the one original element". The new brief dropped "one original element" and moved first-hand into the interview. CLAUDE.md and README rule 1 still say the brief must hold an original element. | Add an `ORIGINAL ELEMENT` field back to the brief template, filled from interview artifacts. | `CLAUDE.md` non-negotiable bullet 4; README rule 1 |
| C4 | Exclamation marks: `content-writing-rules.md` allows one in "celebration moments"; `lint.ts` and check-content V2 fail on any `!`; headings rule bans them. | Ban `!` in all marketing copy (what the code does). Change the rules table row to match. | Prompt section 10 ("no exclamation marks"); code behavior |
| C5 | Title length: seo-rules and `content-writing-rules.md` section 7 say 60 characters **including** the brand suffix that `buildMetadata()` adds. `check-content` M1 and the prompt's `limits.titleMax` count the page title **without** the suffix. A 60-character title plus a suffix breaks the rule. | Add `titleSuffix` to the config. `check-content` measures title plus suffix against `titleMax`. **Needs you** (I could not find the suffix text in `lib/seo/metadata.ts` or the layout; Q10). | `seo-rules.md` line 151 |
| C6 | Reading level has four statements: grade 8 to 10 (CLAUDE.md, voice, rules), average sentence under 20 (rules), grade over 11 fails (`lint.ts`), average over 20 fails (`check-content` V4, no grade computed). | Config holds three values: `gradeTarget [8,10]`, `gradeFailAbove 11`, `avgSentenceMax 20`. Both measures run. Grade above 10 warns, above 11 fails. | Existing code (lint.ts) plus V4; **needs you** to confirm (Q11) |
| C7 | FAQ answers: `check-content` S4 fails any answer outside 40 to 80 words and any FAQ outside 4 to 6 items. `docs/content-system.md` line 30 says only the maximum is hard; under 40 is a warning (`validate-pages` and `lint.ts` warn). | Fail above 80. Warn below 40. Fail on item count outside 4 to 6. | `content-system.md` (design owner decision); **needs you** (Q11) |
| C8 | Two regexes for "a number that must come from claims or pricing" differ. `lint.ts` also catches `50+ sites/customers/clients/countries` and omits `seconds`. `check-content` catches `seconds` and omits the customer-count form. | One pattern in core with both additions. | Union of both (safer for "no invented numbers") |
| C9 | Banned phrase lists drift. `lint.ts` has 23 phrases. `check-content` adds 5 more. The rules table lists others (`Don't worry!`, `We provide best services`, `An uptime figure with no SLA`). They are three lists with no single owner. | One list in `project/rules.config.json`, the rules file shows a link and a few examples. Generic ones ("in today's fast-paced world", "dive into") move to core defaults. | Prompt section 4: one home per rule |
| C10 | Unsupported channels: `lint.ts` fails any mention. `check-content` F3 allows a sentence that negates it ("we do not offer WhatsApp") and skips files whose path contains the letters `vs` (`doc.file.indexOf("vs") < 0`), which also skips unrelated paths such as `.../servers/...`. | Keep the negation allowance. Replace the path hack with an explicit `rules.config.json` allowlist of files. | Code review; DECISIONS 22 |
| C11 | Pause switch: the spec says "one line in the register (`pause: true`)". The register has no such line, the brief says "not set", and the prompt puts `governor.paused` in the config. | Config is the home (`governor.paused`). The register gets no flag. | Prompt section 5 |
| C12 | Fact ledger: spec and prompt say JSON. The workflow, `/write-content` and rule F1 use Markdown (`project/facts/<slug>.md`). | JSON. Convert the ttfb ledger. F1 reads JSON. | Prompt section 4 and Phase 2 |
| C13 | `check-register`: the prompt lists "every `published` row has a review date" as new. It already exists. The prompt also says "plan numbers valid"; the current tool records the plan heading but never validates it. The register's own text says valid plans are 01 to 10 and 14; Plan 15 (off-site) is not listed. | Validate plan numbers against the `plans/` folder. Decide Plan 15 keywords (Q12). | Code and register text |
| C14 | Core must be brand-free but `check-content` imports `content/claims.ts` and `lib/content/lint.ts`, and hard-codes "DronaHost" (M1, F2, F3), `FEATURE_WORDS` (`litespeed`, `nvme`, `uptime`, `cdn`) and a local `claimRenders(id)` that is not the app's `claimRenders(record)`. | Move to config plus adapters (prompt section 5). Feature words go to `rules.config.json`. The claims adapter calls the real `claimRenders()`. | Prompt sections 4, 5 |
| C15 | CLAUDE.md already holds the non-negotiable bullets and says "where this file and the planner differ, stop and ask". The prompt wants "one short pointer block". Shrinking it removes guard bullets. | Keep the guard bullets (about 9 lines), shorten the rest. **Needs you** (Q3). | `CLAUDE.md` |
| C16 | Brief location of review dates: the prompt says Tier B is never published by Claude; `DECISIONS` 24 agrees. No conflict. Noted so it is not rechecked. | none | DECISIONS 24 |
| C17 | A global `seo-content-writer` skill writes `content/pages/[slug].json` with its own rules. The README already says the folder wins. The skill and `/write-content` can both fire on "write content for". | Leave the skill. State in the workflow that `/write-content` is the entry point. | README "Where project rules override" |
| C18 | `content-writing-rules.md` has two sections titled "Phrases to avoid" (lines 112 and 138) and two preambles before its table of contents (lines 13 and 28). | Merge into one section during the split. | Reading the file |

## 4. Linter parity map

Every existing check, and where it lives in `check-content` v2. "Host adapter" means app-specific code behind `content-planner.config.json`. Phase 3 writes a test for each row; the old scripts become aliases only after all pass.

### 4.1 `lint:content` (`scripts/lint-content.ts`, `lib/content/lint.ts`)

| # | Check | Level today | Goes to |
|---|---|---|---|
| L1 | Banned phrases (23, whole word) | error | Voice V1, list from `rules.config.json` |
| L2 | Exclamation mark | error | Voice V2 |
| L3 | WhatsApp mention | error | Policy (channels from config) |
| L4 | Live chat mention | error | Policy |
| L5 | Phone support mention | error | Policy |
| L6 | Raw HTML or entity in copy | error | Voice (new rule V6, not in check-content today) |
| L7 | Number in copy not from claims or pricing | error | Facts F1 (one regex, see C8) |
| L8 | Banned CTA label (9 labels) | error | Voice V5, list from config `cta.bannedLabels` (not in check-content today) |
| L9 | Sentence over 28 words | error | Voice V3 |
| L10 | Reading grade over 11 (warn at 10) | error / warn | Voice V4 (C6) |
| L11 | Fewer than 3 distinct internal links | error | Structure S5 |
| L12 | `claim:` ref not in claims | error | Facts (new rule F4; via claims adapter) |
| L13 | FAQ answer under 40 words | warn | Structure S4 (C7) |
| L14 | Duplicate SEO title across pages | error | Overlap (new group) |
| L15 | Duplicate SEO description across pages | error | Overlap |
| L16 | Claims referenced but not rendering | info | Facts (printed note, not a failure) |
| L17 | Copy extraction: skips structural keys, `claim:` and `feature:` refs, `{{tokens}}` | behavior | Host adapter for page JSON |

### 4.2 `check:content` v1 (rules already in `check-content.ts`)

| Rule | Check | v2 home |
|---|---|---|
| S1, S2 | One H1, no skipped levels | Structure (unchanged) |
| S3 | Answer block 40 to 80 words under the H1 | Structure, limit from `limits.answerBlockWords` |
| S4 | FAQ 4 to 6 items, 40 to 80 words, at most one link | Structure (C7) |
| S5 | 3 or more internal links, no generic anchors | Structure |
| V1 to V4 | Banned phrases, `!`, sentence over 28, average over 20 | Voice, limits from config |
| F1 | Numbers map to the ledger | Facts, ledger read as JSON (C12) |
| F2 | Feature words only when the claim renders | Facts, words from config, brand test removed |
| F3 | Channel, email, location, ranking, VAT wording | Policy |
| P1, P2 | Author, reviewer, review dates, AI disclosure line | People (disclosure line from config) |
| M1, M2 | Title and description limits, no brand suffix, description not equal to title | Metadata (C5; brand name from config) |
| M3 | Slug and keyword match the register | Keyword group |
| M4 | Keyword in title, H1, first 100 words | Keyword group |
| G1 | No open `[HUMAN REVIEW]` unless state is Draft | Flags (unchanged) |

New groups with no current rule: Experience, Sources, Schema, Overlap (beyond L14, L15), and the Keyword checks for density and "not owned by another URL".

### 4.3 `check:register`

All 16 checks stay: column header, column count, empty keyword, lowercase keyword, locale list, status list, AI-cited values, target URL form, review date format, published row needs a review date, duplicate keyword per locale, duplicate URL per locale, secondary clashing with a primary, secondary listed twice, overlap warning, empty register. Added in Phase 3: governor caps, pause, plan numbers valid.

### 4.4 `check:pages` (`scripts/validate-pages.ts`)

| Check | Goes to |
|---|---|
| Zod parse of every page spec | Host adapter (`pageSpec`), keeps `check:pages` (Q9) |
| Layout-signature collision between pages | Host adapter, same |
| FAQ under 40 words warning | Structure S4 (also L13) |

Not covered by anything in the planner today: `check:vs` (stays separate).

## 5. Risk list

| # | Risk | What breaks | Mitigation |
|---|---|---|---|
| R1 | 61 unrelated uncommitted changes in the tree, including `claude.md`, `package.json`, `ci.yml`, `lib/content/lint.ts`, pricing and `data/vs` | A careless `git add -A` would commit your work in a planner commit, and a `git mv` or edit on a modified file mixes histories | Stage by path only. Ask you to commit or stash your changes before Phase 1 (Q1) |
| R2 | `feat/super-planner-a` is 52 commits ahead of `main` and unmerged. `feat/content-engine` branches from it | A later merge pulls in the whole v2 branch | Merge order is yours. I never merge |
| R3 | Renaming scripts | `CLAUDE.md`, `ci.yml`, `docs/content-system.md`, `docs/components/CHANGELOG.md` and your habits use `check:pages`, `lint:content`, `check:register`, `check:content` | Keep every old name as an alias for the life of 1.x |
| R4 | CI gap | `check:content` and `test:content` are not in CI today, so changes to them are unguarded until Phase 5 | I run them locally and report output each phase |
| R5 | Link breakage when files move | About 35 files link into the planner, 6 app files cite `plans/02` or the rules stub | Keep paths for `plans/`, `rules/content-writing-rules.md`, the stub, and section numbers. Run a link checker in Phase 1 |
| R6 | `/write-content` disappears between Phase 1 and the installer | The slash command stops working | Keep `.claude/commands/write-content.md` until `install` is built and has copied the new one |
| R7 | `CLAUDE.md` and `claude.md` are one file on this disk but only `claude.md` is tracked | On a Linux CI or a fresh clone the name matters, and an edit under the other casing can create a second file | Edit only `claude.md`. Confirm with Q3 |
| R8 | `check-content` imports app code | Moving it breaks `npm run check:content` and `test:content` until adapters exist | Do the config and adapter change inside the same commit as the move |
| R9 | Splitting `content-writing-rules.md` renumbers sections | CLAUDE.md, `seo-rules.md` and the stub cite section 7 and `§4` | Keep section numbers; move content out, leave a numbered pointer line |
| R10 | `docs/content-planner/project/drafts/` and `facts/*.md` read by the current tool | Changing format or location breaks F1 and the default scan | Convert and re-run the six tests before deleting anything |
| R11 | Dependencies | The prompt allows `vitest`; it is not installed. `zod` and `tsx` are | Stay on `node:test` unless you say otherwise (Q6) |
| R12 | Build | `npm run build` does not run planner tools; moving planner files cannot break it unless a file under `lib/` or `content/` changes | I will not touch those. I run `npx tsc --noEmit` at the end of each phase |
| R13 | The zip | If it is deleted and someone wanted the pre-Phase-A text | It is untracked, so it cannot be recovered from git. Keep until you approve (Q7) |

## 6. Open questions for you

I recommend an answer for each, but I have not acted on any.

1. **Uncommitted work.** Can you commit or stash the 61 unrelated changes before Phase 1? If not, I will stage only the files I touch and never run `git add -A`. I also have not committed anything in Phase 0, including this file. Do you want it committed alone on `feat/content-engine`? (Recommended: yes.)
2. **`RULES_REVIEW_AND_PAGE_SYSTEM.md`.** Your working tree deletes it, and `docs/DECISIONS.md` and `scripts/lint-content.ts` still cite it. Was the deletion intended? (Recommended: yes, and I fix the two citations.)
3. **`CLAUDE.md`.** Shrink the planner block to a pointer but keep the guard bullets (no invented facts, pricing, tax, no location claims, Tier B, one keyword per URL)? (Recommended: yes.) Confirm that `claude.md` is the name to edit.
4. **Layout gaps.** The target tree has no `project/drafts/` and no `tier-a-briefs.md`. Add `project/drafts/` and `project/briefs/tier-a-briefs.md`? (Recommended: yes. The ttfb draft needs a home.)
5. **`later/12-whmcs`.** Move the DronaHost-specific text to `project/later/` and keep a short generic pattern in core? Or leave the whole file out of core? (Recommended: split.)
6. **Test runner.** Stay on `node:test` with `tsx` (no new dependency) or add `vitest`? (Recommended: stay on `node:test`.)
7. **`docs/content-planner.zip`.** Delete after Phase 1? It is untracked and older than the folder.
8. **`SUPER_CONTENT_PLANNER_SPEC.md`.** After Phase 6, keep in `docs/reference/`, move into the planner as `docs/content-planner/SPEC.md`, or archive? (Recommended: keep in `docs/reference/` as history.)
9. **`check:pages`.** Keep the page-spec Zod parse and layout-signature check in the app as a host adapter that `check-content` calls, instead of copying `lib/content/schemas` into the planner's `schemas/`? (Recommended: yes. The app renders from those schemas, so a copy would drift. The planner's `schemas/` would hold the page envelope, brief, ledger and config.)
10. **Title suffix.** What exact brand suffix does the live title template add, and should `titleMax` count it (C5)? I could not find it in `lib/seo/metadata.ts`.
11. **Limits.** Confirm C6 (grade target 8 to 10, fail above 11, average sentence 20) and C7 (FAQ answer under 40 words warns, over 80 fails).
12. **Plan 15 and the register.** Do off-site rows (reviews, listings, press) belong in the register? Today only Plans 01 to 10 and 14 are valid headings.
13. **Facts that the engine may not touch.** The prompt says `/write-content "how to improve ttfb on wordpress"` is the Phase 4 test. That keyword is already `drafting` in the register with a draft file. Reuse it as the test case, or start from a different keyword?

## 7. Acceptance for Phase 0

| Criterion | Result |
|---|---|
| Plan is complete (inventory, dispositions, conflicts, parity map, risks, questions) | Done |
| No file changed except this one | Done. `git status` shows only the new branch and this file as new |
| Every repo file that mentions the planner is in a table | Done: 1.1 and 1.2 cover the folder and outside files; 1.4 lists the six comment-only mentions. The grep covered `*.md`, `*.ts`, `*.tsx`, `*.json`, `*.yml` outside `node_modules`, `.next` and `.git` |

Next: Phase 1 (restructure and de-duplicate, no deletions). It needs your answers to Q1 to Q5, Q9 and Q10, and your "go".

## 8. Owner answers (2026-10-08) and what changed

Recorded from the owner review. Phase 1 has not started.

| Q | Answer | Status |
|---|---|---|
| Q1 | Checkpoint the unrelated work on `feat/super-planner-a`; commit this plan alone on `feat/content-engine` | Done. Checkpoint `e4da7b4` (57 files). Left out on purpose: `docs/content-planner.zip` (Q7) and `docs/reference/after/` (198 PNG files, 58 MB). A secret scan of every changed and new text file found no key, token, connection string or `.env` file. `feat/content-engine` was fast-forwarded to the checkpoint before this commit |
| Q2 | Restore `RULES_REVIEW_AND_PAGE_SYSTEM.md` from `HEAD`; do not delete yet | Done. The file is restored and unchanged against `HEAD`. Dispositions in section 2.2 now read "keep" for it |
| Q3 | Pointer block plus guard bullets in tracked `claude.md`; later, a separate commit renames it to `CLAUDE.md` with a two-step `git mv` | Accepted. Carried out in Phase 1 |
| Q9 | Zod page-spec and layout-signature checks stay in the app as a host adapter registered in `content-planner.config.json` | Accepted. `schemas/` will not copy `lib/content/schemas` |
| Q10 | Read the suffix from the layout template | `app/[locale]/layout.tsx` sets `title.template: "%s \| DronaHost"` and default `"DronaHost — Managed WordPress & Cloud Hosting"`. Config value: `titleSuffix: " \| DronaHost"` (12 characters; separator is a pipe with spaces). No built HTML was available in `.next`, so I did not read a rendered `<title>`; Phase 3 adds a check against built pages. Note: the 2026-05-26 homepage spec still shows an em dash separator, which is out of date |
| Q11 | Reading level: target 8 to 10, warn above 10, fail above 11, per-page override with a stated reason. FAQ answers: warn under 40, fail over 80 | Accepted. Resolves C6 and C7 |
| Extra | "One original element" returns as a required brief field, checked by `check-content` (an artifact or an open flag) | Accepted. Resolves C3 |
| Extra | Limits: title plus suffix warns above 60, fails above 70, missing or duplicate. Description warns above 160, fails only if missing or duplicate. Any sentence over 28 words fails. Average sentence under 20 | Accepted. Resolves C5. With the 12-character suffix, a page title warns above 48 characters and fails above 58 |
| Extra | Number rules: money pages use strict provenance (claims, pricing or ledger only). Guides also allow version numbers, step numbers and sourced figures that are in the ledger | Accepted. Splits C8 into a strict and a guide mode, chosen by plan |
| Q4 to Q8, Q12, Q13 | Wait for the owner | Open. Phase 1 does not start |

## 9. Linter parity report (final run, 2026-10-09)

Run after `lint:content` and `check:pages` became aliases of `check-content`. Command: `npx tsx --test docs/content-planner/project/tests/parity.test.ts`. The test feeds the same input to the old page linter (`lib/content/lint.ts`) and to `check-content`, and requires both to fail. L8 to L11 are inside the test bodies; the list shows one line per test.

```
✔ the real home page passes both linters
✔ L1: the old linter and check-content V1 both fail
✔ L2: the old linter and check-content V2 both fail
✔ L3: the old linter and check-content PO1 both fail
✔ L4: the old linter and check-content PO1 both fail
✔ L5: the old linter and check-content PO1 both fail
✔ L6: the old linter and check-content V6 both fail
✔ L7: the old linter and check-content F1 both fail
✔ L9: the old linter and check-content V3 both fail
✔ L10: the old linter and check-content V7 both fail
✔ L12: the old linter and check-content F3 both fail
✔ L8: a banned CTA label fails in both
✔ L11: fewer than 3 internal links fails in both
✔ L13: a short FAQ answer warns in both and fails in neither
✔ L14 and L15: duplicate title and description across pages fail
✔ L16: claims referenced but not rendering are reported, not failed
ℹ tests 16
ℹ pass 16
ℹ fail 0
```

What the aliases are now:

| Script | Runs |
|---|---|
| `npm run lint:content` | `check-content` on `content/pages` |
| `npm run check:pages` | `check-content` on `content/pages`, which also runs the app's own page-spec check (`scripts/validate-pages.ts`: Zod section schemas and layout signatures) as the host adapter, rule SC2 |
| `npm run check:content` | `check-content` on the drafts and pages folders |

Nothing in `lib/content/lint.ts`, `scripts/lint-content.ts` or `project/tests/parity.test.ts` is used by any other tool. They stay until the owner approves their removal (hold, 2026-10-09).
