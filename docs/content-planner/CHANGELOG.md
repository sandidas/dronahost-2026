# Content engine changelog

Versioned changes to the engine (rules, plans, tools). Business decisions are in `project/DECISIONS.md`.

## 1.0.7 (2026-10-09)

- Two new rule groups, driven by a project data file (`paths.profiles`, schema `schemas/profiles.ts`). **Intent:** IN1 intent declared and confirmed against the live results, IN2 the page shows what its intent needs, IN3 the first screen serves the intent, IN4 call to action labels fit the intent. **Trust:** TR1 a reader can find who is responsible, TR2 money pages link their policies, TR3 authority wording has a source, TR4 honest limits are stated, TR5 the page was reviewed recently. They run on page specs and articles. Without profile data they are skipped with a note.
- Each new rule has a severity in the profile data. `warn` shows failures as warnings (the rollout setting); `fail` fails the run.
- Page specs can declare `searchIntent` and `secondaryIntent`. The brief has an optional `intent_confirmed_by`.
- New rule file `rules/search-intent.md`; `rules/eeat-and-people-first.md` gains the Trust checks.
- New tool `content:owed`: per page, the hidden sections and the facts only a person can supply.
- The readiness rules (warn in a Draft) now include IN2, IN3, TR2 and TR4.

## 1.0.6 (2026-10-09)

- New blueprint section `MigrationRequest` (lead capture), plus `ProofBar`, `WhyChoose` and `Evidence`, in `rules/page-blueprints.md`. Home (C1) was reordered and Migration (C4) now requires the request form.
- Section limits can name an allowed set of values with some required (`oneOf`, `mustInclude`): the form fields are limited this way.
- Check BP12: two visible neighbours with the same background tone fail (the host reports tones in its visibility result).
- A page spec can carry a `waivers` block with the same effect as a draft's `waive_rules`.

## 1.0.5 (2026-10-08)

- Rule PO4: where the business is based may be said only on the pages the project lists (`locationClaims` in `project/rules.config.json`). A project without the setting skips it. A test covers it.

## 1.0.4 (2026-10-08)

- Owner waivers. A page's front matter can name rules the owner has overruled: `waive_rules: K2, P2`, `waive_reason`, `waive_approved_by`. Their failures show as warnings that name the approver. Without a reason and an approver the waiver is ignored. A test covers it.
- A Markdown draft and the page spec built from it (same URL, different file kind) no longer fail OV3 and OV4 against each other. OV1 now keeps the root slug "/" when it normalizes slugs, so the draft of the home page is no longer compared with its own page spec. Tests cover both.

## 1.0.3 (2026-10-08)

- Rule K2 now reads the page title together with the site suffix. A brand keyword could not pass before: M1 forbids the brand in the typed title, while K2 required the keyword in it. A test covers it.

## 1.0.2 (2026-10-09), second owner review

- Interview banks for regional (Plan 05), policy (07), domain (08), brand and trust (09) and off-site (15) pages, in the owner's exact wording (decision 32). A test pins each bank by hash so no question can be reworded by accident; each plan names its bank; `rules/interview-questions.md` has a "which bank for which plan" table. Domain question 1 was reworded by the owner on 2026-10-09 ("billing system" instead of a product name), so no no-brand exception is needed; the `noBrand.allowTerms` option stays available but is unused.
- The linter files `lib/content/lint.ts`, `scripts/lint-content.ts` and `project/tests/parity.test.ts` were removed in their own commit after a final parity run (16 of 16) and a `git grep`. `docs/content-system.md` now describes `check-content`.
- The home page (a `product` archetype, 7 FAQ items) is fine; About and Trust pages are the brand archetype (decision 31).
- CI: the reuse proof runs as its own job on `ubuntu-latest` and `windows-latest`.
- Windows readiness: every file reader accepts CRLF line endings (`tools/eol.ts`); tools start `tsx` through Node itself (`tools/run-node.ts`) instead of `npx`; the reuse test links `node_modules` with a junction and starts npm without a shell; paths are compared with forward slashes. A new reuse test converts every text file to CRLF and runs the checks again. Not yet run on a real Windows machine.
- `code-follow-ups.md`: restored an original row I had overwritten by mistake, and gave the three duplicated numbers new ones (28 to 30).

## 1.0.1 (2026-10-09), owner review

- FAQ item counts are set per archetype in the config (`limits.faqItemsByArchetype`, `archetypeByPlan`, `archetypeAliases`): money and pricing pages 6 to 8, guides and brand pages 4 to 6. A page's own `archetype` field wins; the app's `product` and `landing` count as money, `decision` as guide, `trust` as brand. This replaces `faqItemsByPlan`.
- `check:pages` and `lint:content` are thin aliases of `check-content`. The app's own page-spec check (Zod section schemas, layout signatures) now runs inside `check-content` as the host adapter (`adapters.pageSpec.command`, rule SC2), so no check was lost. CI runs `check-content` on every page spec and draft.
- The pricing adapter reads prices through the app's typed loader (`project/adapters/pricing.ts`, built on `lib/pricing`), in every currency. It never reads the pricing file's schema. Projects without a loader keep the generic `json` adapter (`adapters.pricing`).
- `npm run content:copy` (`tools/copy-engine.ts`) replaces the shell copy command in the README: plain Node, the same on macOS, Linux and Windows. The reuse proof uses it.
- The README's "10 minutes" is marked as an untimed estimate.
- Plan 15 has no register rows; off-site work is tracked in `project/roadmap.md`. The spec file is marked superseded. `*.zip` files and `docs/reference/after/` are ignored by git.
- Interview banks for regional, policy, domain, brand and off-site pages are not added yet: the owner is sending the text.

## 1.0.0 (2026-10-09)

The first release: a reusable, standalone content engine. A keyword or a title goes in; a brief, a fact ledger, an interview and, after the owner approves, a checked draft come out, always "Ready for owner review", never "publish-ready". The engine invents no fact, runs offline checks in CI, and works in a project that has nothing to do with the one it was built in (see Phase 6).

### Phase 6: reuse test and documentation

- Added `eval/sample-project/`: a fictional bakery (config, `project/` facts, register, one page spec, one approved brief, one fact ledger, one article) built from `init-project`'s own output. Everything in it passes every check.
- Added `tools/reuse.test.ts` (`npm run test:reuse`): copies only the reusable core into a temporary host, runs `install` and `init-project`, overlays the sample, runs config, no-brand, links, schemas, register, check-content, eval, governor, ci, resolve, gen-schema, suggest-links and similarity, proves a bad draft turns the checks red, builds a brief from the template, and confirms no term of the real project is in the copy.
- Engine tests now run against the sample project (`npm run test:tools`, via `tools/run-tests.ts`), so they cannot depend on this project's data. Tests that import this host's app files moved to `project/tests/` (`npm run test:project`): `parity.test.ts`, `adapters.test.ts`. The engine tests build their own word lists.
- Bugs found by the reuse proof and fixed: an empty `forbiddenChannels` list matched every line and failed rule PO1 in every new project; `check-schemas` validated this project's ledgers whatever the config said; `check-register` looked for plan files next to the register; a new project's evaluation set failed because `init-project` wrote no plan routing; core files linked to project files a new project does not have (`init-project` now creates a project-specifics slot for every plan; the parked billing plan's project copy is `project/later/12-billing-system-integration.md`); one core file linked to a host document; two comments in a tool named this project's vocabulary.
- `tools/defaults.ts`: defaults a new project starts from (plan routing, idioms, page-copy keys, WordPress field map). The installer's script list gained `content:ci`, `content:changed`, `content:posts` and `content:webhook`.
- README: exact reuse commands, the first-brief path, and what stays with the host project.



### Phase 5: integration

- Root npm scripts: every tool has a `content:*` script (see the README "Tools" table), plus `content:changed`, `content:ci`, `content:posts` and `content:webhook`. The `check:*` names stay as aliases.
- CI (`.github/workflows/ci.yml`, job `static`): full git history, then `npm run test:tools`, then `npm run content:ci -- --base <PR base>`: config, no-brand, links, schemas, register with the governor cap, `check-content` on the changed content files, posts (when `CONTENT_POSTS_API_URL` is set), and the evaluation set. A failure fails the job, and the other jobs need it. Making the job a required check is a GitHub setting (follow-up 26).
- `tools/check-changed.ts`: selects page specs, drafts and file-based posts from `git diff base...HEAD`; if the base cannot be read it checks everything. Tests prove exit 0 on a clean file and exit 1 on a deliberately bad fixture.
- WordPress: `tools/wp-posts.ts` reads posts through the REST API (paging, optional application-password auth from the environment, no cross-host redirects), maps them to Markdown with front matter through `adapters.wordpress` in the config, and runs the same checks. `tools/wp-webhook.ts` answers `POST /check` for a publish hook: 200 when every rule passes, 422 with the failing rules otherwise, 401 without the shared secret, 502 if the post cannot be read. It only reads; it changes nothing in WordPress. `tools/html-to-md.ts` converts post HTML. Contract and an example hook: `rules/wordpress-content-model.md`.
- Adapters: claims are read through the host's own `claimRenders()`; prices are read from `data/pricing.json`, and a price typed into copy is reported as such (`adapters.test.ts`). `lib/pricing` is not imported (follow-up 27).
- `check-content` gained `runChecks` so the CI tools share one run path, and `docFromText` so a post that is not a file can be checked.
- Follow-ups 24 to 27 added to `project/code-follow-ups.md` (WordPress fields and hook, GitHub settings, pricing adapter note).
- Fixed: the README tool list was lost in the Phase 2 rewrite; the "Tools" table restores it.

### Phase 4: Claude Code assets

- Added six commands in `claude/commands/`: `/write-content` (stages 0 to 7, stops at APPROVAL 1), `/plan-keywords` (proposes register rows within the governor caps), `/refresh-content`, `/audit-page`, `/monthly-review`, `/init-project`. Each is a short list of steps that points at the workflow and the tools; none copies the rules.
- Added four role agents in `claude/agents/`: `researcher`, `fact-checker`, `drafter`, `editor`, each with allowed and forbidden actions and the least tools it needs. If the host has no subagents, the command runs the four roles in order.
- Added `tools/resolve.ts` as a command (`npm run content:resolve`): Stage 0 and 1 in code (title to keyword, excluded list, cannibalization, plan, intent, governor). The installer now also adds `content:resolve`.
- `npm run content:install` copied the assets into this repo's `.claude/`; the old `.claude/commands/write-content.md` was replaced by the new one (it is the same file the installer now keeps in sync).
- Test: `tools/claude-assets.test.ts` (front matter, allowed and forbidden sections, tool access, scripts exist, `/write-content` stops before drafting).
- Acceptance run: `/write-content "how to improve ttfb on wordpress"` produced a dated SERP snapshot, a verified fact ledger (`project/facts/improve-ttfb-wordpress.json`), a brief in the new template and the first interview question, then stopped. No article was written.

### Phase 3: tools

- `check-content` v2 (`tools/check-content.ts` and `tools/content/`): twelve groups (Structure, Keyword, Voice, Facts, People, Experience, Sources, Metadata, Schema, Policy, Overlap, Flags), 50 rules, pass or fail with file, line and fix, no score. It reproduces every check of `lint:content` (proved by `tools/parity.test.ts`) and every v1 rule. It reads limits, lists and the claims adapter from the config; it no longer imports app code except the claims registry through the adapter. Rule ids changed: v1 M3 and M4 are now K1 and K2; v1 F3 is now PO1 to PO3.
- New limits are enforced: title measured with the suffix (warn above 60, fail above 70), description warn above 160, FAQ answers warn under 40 and fail over 80, FAQ item count by plan (`limits.faqItemsByPlan`), reading grade warn above 10 and fail above 11 with an owner-approved override (`grade_override_reason` and `grade_override_approved_by`, or `rules.gradeOverride`), strict number provenance on money pages and ledger-sourced figures in guides.
- Draft behavior: in a Draft, the readiness rules S4, S5, E1, E3 and SO1 warn instead of failing. They fail once the state is not Draft.
- `check-register` v2 on a shared register parser (`tools/register.ts`): all 16 checks kept; added plan-number validation (R16) and the in-flight cap (GV1). An empty register is a warning.
- New tools: `governor`, `eval` (10 cases in `eval/cases/`), `resolve` (title to keyword, gate, routing), `gen-schema`, `suggest-links`, `similarity`, `gsc-report`, `refresh-queue`, `install`, `init-project`. 94 tests (`npm run test:tools`).
- `npm run lint:content` is now an alias of `check-content` on `content/pages`. `check:pages` stays as the host page-spec check.
- Brief template and schema gain `created_on` (the governor counts briefs by month). Config schema gains `faqItemsByPlan`, `similarity`, `linksSuggested` and the page-copy keys; rules schema gains `idioms`, `planRouting`, `intentByPlan`. All have defaults, so older configs stay valid.
- Fixed a misreading in the Phase 1 note: the FAQ failure was `content/pages/home.json`, not the ttfb draft.

### Phase 2: workflow, templates, schemas, rules

- Rewrote `rules/content-writer-workflow.md` as the master workflow: a keyword **or a title** (a title is turned into a keyword that the owner confirms), the governor in the gate, the interview and APPROVAL 1 in Stage 3, the intent table, outline patterns, CTA by intent and the handoff. The brief field list now lives only in `templates/brief.md`.
- Added `templates/`: `brief.md`, `interview.md`, `fact-ledger.json`, `handoff.md`, `page-skeleton.json`, `front-matter.md`.
- Added Zod schemas: `brief`, `fact-ledger`, `page-envelope`, `front-matter` (plus the two config schemas from Phase 1), with valid and invalid fixtures in `eval/fixtures/schemas/` and `npm run check:schemas` / `npm run test:schemas`. The page envelope holds only what every project needs; section types stay in the host (`adapters.pageSpec`), per the owner's Q9 answer.
- Added `rules/governor.md`, `rules/eeat-and-people-first.md`, `rules/ai-search.md`, `rules/quality-rubric.md` (advisory only). Moved the rubric out of the workflow.
- `rules/sources.md`: added item 9 (AI crawler documents: OpenAI, Google, Anthropic, Perplexity) and IndexNow. Item 8 (Bing guidelines) could not be read by the fetch tool and is recorded as such. Item 6 now states the owner's title limits.
- Every plan has a "Workflow fit" block (intent, interview bank, brief, limits, schema note). Plan 02 title limit and plan 01 and 14 reading-level checklist lines now match the config.
- Converted the ttfb fact ledger to JSON (`project/facts/improve-ttfb-wordpress.json`). The `.md` copy stays until the owner approves its deletion and `check-content` rule F1 reads JSON (Phase 3).
- README rewritten: AI instructions, 5-minute quick start, folder map, reuse steps.

### Phase 1: restructure and de-duplicate

- Added `content-planner.config.json` (paths relative to the file, adapters, governor, limits) and its Zod schema `schemas/config.ts`. Limits follow the owner answers of 2026-10-08: title with suffix warns above 60 and fails above 70; description warns above 160; sentences over 28 words fail; average under 20; reading grade target 8 to 10, warn above 10, fail above 11; FAQ answers warn under 40 and fail over 80.
- Added `project/rules.config.json` (one home for banned phrases, CTA labels, feature words, forbidden channels and claims, disclosure line, no-brand terms) and `schemas/rules-config.ts`. `lib/content/lint.ts` still carries its own copies until Phase 3.
- Split mixed files into core and project: brand, terminology and voice examples moved to `project/brand.md`; each plan's business facts moved to `project/plan-specifics/`; the billing-system plan (12) moved to `project/later/` with a generic outline in `later/12-billing-system-integration.md`.
- Moved `tools/fixtures/` to `eval/fixtures/`, `project/tier-a-briefs.md` to `project/briefs/`. A copy of `/write-content` is in `claude/commands/`; `.claude/commands/` keeps its copy until the installer exists (Phase 3).
- `check-content` reads its lists, paths and brand name from the config files instead of hard-coding them. Behavior change: the channel check no longer skips file paths containing the letters "vs"; it uses `channelAllowlistFiles`.
- New tools: `check-config`, `check-no-brand`, `check-links`. Added `ORIGINAL ELEMENT` to the brief template.
