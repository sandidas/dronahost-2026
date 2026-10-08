# Interview questions

The interview captures what only a person has: first-hand experience. Claude asks, the owner answers, Claude records. Nothing here is answered by Claude. Source: `docs/reference/SUPER_CONTENT_PLANNER_SPEC.md` section 8.

## How the interview works

1. Claude picks the page-type question bank below and asks **one question at a time**. It waits for the answer before asking the next.
2. Claude records each answer **word for word** in the brief under "Interview answers", with the question number and the date. It does not tidy, shorten or improve the owner's words. Spelling is kept.
3. After each answer Claude asks for the **artifact** for that question (screenshot, log, numbers) if one exists. The owner can say "none".
4. **"None", "skip" or no answer = a gap.** Claude records `GAP: <question>`. The section that needed the answer is dropped from the outline, never invented. A page with gaps on the experience questions cannot reach "Ready for owner review" (it stays a draft with the gap named).
5. Claude may add at most two follow-up questions for one answer that is unclear. It never answers a question for the owner.
6. Before approval, Claude reads the answers back in a list and asks the owner to confirm they are accurate and may be published.

If a question does not apply to this page, Claude says so and skips it.

## Question banks by page type

### Fix or troubleshooting (Plan 04)

1. When did you last see this problem, and on what kind of site?
2. What was the cause in that case?
3. What did you try first that did not work?
4. What fixed it, step by step?
5. How did you confirm it was fixed?
6. Which versions (WordPress, PHP, plugin) were involved?
7. What would you tell a reader who cannot fix it alone?

Artifacts: the log, a screenshot, before and after numbers.

### Guide or explainer (Plan 03)

1. Which mistake do you see most often on this topic?
2. What do most guides get wrong or skip?
3. What did you do on a real site?
4. What surprised you?
5. What do you recommend, and for whom?
6. When would you recommend against it?

Artifacts: a screenshot, a checklist you use.

### Comparison (Plan 02)

1. Who should pick each option?
2. Where is the competitor better, honestly?
3. What have customers told you about switching? (only real answers)
4. What did you check yourself?

Artifacts: the source and date for each competitor fact.

### Migration or email (Plan 14)

1. What do you actually do, in order?
2. What goes wrong most often?
3. What do you need from the customer?
4. What is excluded?
5. How long does it take in practice? (only if measured)

### Service page (Plan 06)

1. What exactly is delivered?
2. Who is it for, and who is it not for?
3. What is your process?
4. A real project you can name, with permission.
5. What can you not promise?

### Money page (Plan 01)

1. Who buys this plan and why?
2. What do they worry about first?
3. What is the honest limit of this plan?
4. What do customers ask support most?

## Recording format (in the brief)

```
INTERVIEW ANSWERS (verbatim)
Q1 <question>
A1 "<owner's exact words>"  (answered 2026-10-08)
Artifact: <file or link or "none">
Q2 <question>
GAP: not answered
```
