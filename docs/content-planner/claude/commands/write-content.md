---
description: Plan a page from a keyword or title: resolve, classify, research, fact ledger, brief, interview, then stop at APPROVAL 1. After approval: draft, check, hand off.
argument-hint: <keyword or title>
---
Run the content engine for: $ARGUMENTS

The planner folder is `docs/content-planner/` (its config is `content-planner.config.json`). Read `README.md` there, then follow `rules/content-writer-workflow.md` stages 0 to 7. This file only lists the order; the workflow holds the rules.

**Before APPROVAL 1 (never write the article in this part):**

1. **Resolve.** Run `npm run content:resolve -- "$ARGUMENTS"`. If the input was a title, show the derived keyword with the reason and **ask the owner to confirm it before going on**. Stop and say why if the decision is `reject`, `merge` or `refused`.
2. **Classify.** Plan, intent, buying stage and expected format (workflow Stage 1). Pick the interview bank for the page type.
3. **Research.** Use the `researcher` agent for the SERP snapshot (dated). If web access is missing, write "SERP analysis unavailable" and ask the owner to confirm the intent. Name the information gain; if there is none, stop and recommend dropping or merging the keyword.
4. **Fact ledger.** Create `<facts folder>/<slug>.json` from `templates/fact-ledger.json`. Use the `fact-checker` agent on every fact. Add nothing from memory.
5. **Brief.** Fill `templates/brief.md` and save it in the briefs folder. Include the governor status.
6. **Interview.** Use the question bank for the page type, **one question at a time**. Wait for each answer. Record it word for word in `templates/interview.md` format, with the date, and ask for the artifact. An unanswered question is `GAP: <question>`. Never answer for the owner. Read the answers back.
7. **APPROVAL 1.** Show the brief, the ledger, the SERP snapshot, the open flags, the gaps and the interview. **Stop and wait.**

**After the owner approves:**

8. **Draft** with the `drafter` agent, from the brief, the ledger and the interview only. Mark every gap `[HUMAN REVIEW]`.
9. **Edit** with the `editor` agent: voice, clarity, banned phrases, information gain, who/how/why.
10. **Check.** Run `npm run check:content`, `npm run check:register`, `npm run content:similarity -- <file>`, `npm run content:suggest-links -- <file>` and `npm run content:gen-schema -- <file>`. Fix what fails. List what you cannot fix.
11. **Handoff** with `templates/handoff.md`. The status is "Ready for owner review", never "publish-ready". Propose the register change; do not set `published`.

If subagents are not available, run the four roles in this order inside this command with the same allowed and forbidden actions (see `claude/agents/`).

Never invent a fact, a quote, a customer, a review or first-hand experience. Missing information becomes `[HUMAN REVIEW: ...]`. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text. Tier B pages are never published by Claude. No promise of rankings, featured snippets or AI citations.
