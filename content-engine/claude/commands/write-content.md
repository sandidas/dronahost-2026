---
description: Plan a page from a keyword or title: resolve, classify, research, fact ledger, brief, interview, then stop at APPROVAL 1. After approval: draft, check, hand off.
argument-hint: <keyword or title>
---
Run the content engine for: $ARGUMENTS

The engine folder is `content-engine/` (its config is `content-engine.config.json`). Read `README.md` there, then follow `rules/content-writer-workflow.md` stages 0 to 7. This file only lists the order; the workflow holds the rules.

**Before APPROVAL 1 (never write the article in this part):**

0. **Load the brand.** Run `npm run content:voice` and read the card (brand, business type, audience, locale, voice, limits, banned words, support channels). Then read `project/PROJECT.md` and `project/DECISIONS.md`. Every later step writes in this voice and uses only these facts.
1. **Resolve.** Run `npm run content:resolve -- "$ARGUMENTS"`. If the input was a title, show the derived keyword with the reason and **ask the owner to confirm it before going on**. Stop and say why if the decision is `needs-row` (propose the register row and wait for the owner to add it), `reject`, `merge` or `refused`.
2. **Classify.** Plan, intent, buying stage and expected format (workflow Stage 1). Pick the interview bank for the page type. Read `rules/search-intent.md`: the brief names the primary intent and what the page must show for it, and a page spec sets `searchIntent`. Decide the output: **a page spec** (money, comparison, regional, service, domain, brand, migration and email pages, and landing pages: plans 01, 02, 05, 06, 08, 09 and 14) built on its blueprint in `rules/page-blueprints.md` and the project's blueprint data, or **an article** (guides, fixes, explainers: plans 03, 04, 07 explainers, 10).
3. **Research.** Use the `researcher` agent for the SERP snapshot (dated). If web access is missing, write "SERP analysis unavailable" and ask the owner to confirm the intent. Name the information gain; if there is none, stop and recommend dropping or merging the keyword.
4. **Fact ledger.** Create `<facts folder>/<slug>.json` from `templates/fact-ledger.json`. Use the `fact-checker` agent on every fact; it returns each row with a status, and you write those rows into the ledger. Add nothing from memory.
5. **Brief.** Fill `templates/brief.md` and save it in the briefs folder. Include the governor status, the **reader questions** table (section 4b: each question and the heading or FAQ item that will answer it), the **experience shown** line (6b), the **people-first self-assessment** (10b) with an evidence line per question, and the target length from the blueprint's word range (a guide, never padding). Read `rules/trust-and-intent-design.md` for where each element sits on the page.
6. **Interview.** Use the question bank for the page type, **one question at a time**. Wait for each answer. Record it word for word in `templates/interview.md` format, with the date, and ask for the artifact. An unanswered question is `GAP: <question>`. Never answer for the owner. Read the answers back.
7. **APPROVAL 1.** Show the brief, the ledger, the SERP snapshot, the open flags, the gaps and the interview. **Stop and wait.**

**After the owner approves:**

8. **Draft** with the `drafter` agent, from the brief, the ledger and the interview only. An article goes to the drafts folder; page copy goes into the page spec, only in the blueprint's sections. Mark every gap `[HUMAN REVIEW]`.
9. **Edit** with the `editor` agent: voice, clarity, banned phrases, spelling variant, plain words, information gain, who/how/why.
10. **Check.** Run `npm run check:content` (it also runs the host's page-spec, visibility and copy-source checks named in the config), `npm run check:register`, `npm run content:similarity -- <file>`, `npm run content:suggest-links -- <file>` and `npm run content:gen-schema -- <file>`. Fix what fails. List what you cannot fix, including the Intent (IN1 to IN5), Trust (TR1 to TR8), Voice (V9 to V12), Structure (S6) and content-page Elements warnings (CP1 to CP7), and run `npm run content:owed` for the facts only the owner can supply.
11. **Handoff** with `templates/handoff.md`: include the self-assessment answered against the finished page. The status is "Ready for owner review", never "publish-ready". Propose the register change; do not set `published`. Do not move the visible review date: the owner sets it after rechecking the whole page.

If subagents are not available, run the four roles in this order inside this command with the same allowed and forbidden actions (see `claude/agents/`).

Never invent a fact, a quote, a customer, a review or first-hand experience. Missing information becomes `[HUMAN REVIEW: ...]`. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text. Tier B pages are never published by Claude. No promise of rankings, featured snippets or AI citations.
