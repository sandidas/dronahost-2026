# Content engine changelog

Versioned changes to the engine (rules, plans, tools). Business decisions are in `project/DECISIONS.md`.

## 1.0.0 (in progress, begins with Phase 1 on 2026-10-08)

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
