---
description: Research, classify and brief a page for a keyword or title, interview the owner, then stop at APPROVAL 1
argument-hint: <keyword or title>
---
Run the DronaHost content planner for: $ARGUMENTS

Read first, in this order: `docs/content-planner/README.md`, `docs/content-planner/rules/content-writer-workflow.md`,
`docs/content-planner/rules/information-gain.md`, `docs/content-planner/rules/interview-questions.md`,
`docs/content-planner/rules/sources.md`, `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md` (sections 2, 6 and 8).

Run these stages in order. Do not write the article. **Stop at APPROVAL 1.**

1. **Resolve.** Find the register row (`project/keyword-register.md`), plan, locale and target URL. Check the excluded list and
   cannibalization. Stop and report if the gate (workflow Stage 0) fails.
2. **Classify.** Intent (workflow Stage 1), buying stage, expected format. Choose the interview bank from the page type.
3. **Research.** SERP snapshot (workflow Stage 2) with the date. If web access is missing, write "SERP analysis unavailable".
4. **Fact ledger.** Create `docs/content-planner/project/facts/<slug>.md`. One row per fact the page may use: the fact, source URL or
   project file, date read, who checked, status. Add nothing from memory.
5. **Brief.** Fill every field of the Stage 3 template, including the governor status (count register rows with status
   `briefed`, `drafting` or `review` against the limit of 3 in flight, and the owner's monthly cap) and the information-gain field.
   Refuse to start another brief if the governor limit is reached or the register has `pause: true`.
   Save it as `docs/content-planner/project/briefs/<slug>.md`.
6. **Interview.** Ask the questions from the bank for this page type **one at a time**. Wait for each answer. Record it
   **verbatim** in the brief with the date. Ask for the artifact after each answer. An unanswered or skipped question is recorded as
   `GAP: <question>` and its section is dropped from the outline. Never answer for the owner. Read the answers back before approval.
7. **APPROVAL 1.** Show the brief, the fact ledger, the SERP snapshot, the open flags and the gaps. Then stop and wait.

Never invent a fact. Missing information becomes `[HUMAN REVIEW: ...]`. Never use AI for testimonials, reviews, team bios,
case-study results or unreviewed legal text.
