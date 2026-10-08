# Content engine changelog

Versioned changes to the engine (rules, plans, tools). Business decisions are in `project/DECISIONS.md`.

## 1.0.0 (in progress, begins with Phase 1 on 2026-10-08)

### Phase 1: restructure and de-duplicate

- Added `content-planner.config.json` (paths relative to the file, adapters, governor, limits) and its Zod schema `schemas/config.ts`. Limits follow the owner answers of 2026-10-08: title with suffix warns above 60 and fails above 70; description warns above 160; sentences over 28 words fail; average under 20; reading grade target 8 to 10, warn above 10, fail above 11; FAQ answers warn under 40 and fail over 80.
- Added `project/rules.config.json` (one home for banned phrases, CTA labels, feature words, forbidden channels and claims, disclosure line, no-brand terms) and `schemas/rules-config.ts`. `lib/content/lint.ts` still carries its own copies until Phase 3.
- Split mixed files into core and project: brand, terminology and voice examples moved to `project/brand.md`; each plan's business facts moved to `project/plan-specifics/`; the billing-system plan (12) moved to `project/later/` with a generic outline in `later/12-billing-system-integration.md`.
- Moved `tools/fixtures/` to `eval/fixtures/`, `project/tier-a-briefs.md` to `project/briefs/`. A copy of `/write-content` is in `claude/commands/`; `.claude/commands/` keeps its copy until the installer exists (Phase 3).
- `check-content` reads its lists, paths and brand name from the config files instead of hard-coding them. Behavior change: the channel check no longer skips file paths containing the letters "vs"; it uses `channelAllowlistFiles`.
- New tools: `check-config`, `check-no-brand`, `check-links`. Added `ORIGINAL ELEMENT` to the brief template.
- Known: `check:content` reports 7 FAQ items in the ttfb draft (limit 6). This predates Phase 1.
