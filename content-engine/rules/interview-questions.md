# Interview questions

The interview captures what only a person has: first-hand experience. Claude asks, the owner answers, Claude records. Nothing here is answered by Claude. Source: `content-engine/history/SUPER_CONTENT_PLANNER_SPEC.md` section 8.

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

### Regional pages (Plan 05)

1. Which customers from this region do you serve today, and what do they ask for?
2. Which local rules or tax questions have real customers raised?
3. What support hours can you honestly staff, in that time zone?
4. Which currency and payment methods do they actually use?
5. What can you not promise there?
6. Has a qualified person reviewed any local-law wording? Name and date.

### Policy pages (Plan 07)

1. What do you actually do today in practice?
2. Which exclusions and edge cases have come up with real customers?
3. Who keeps this page true, and how are changes announced?
4. What limits or times will you commit to?
5. What would you refuse to promise?
6. For Tier B: who reviews it, and when?

### Domain pages (Plan 08)

1. Which registrar or billing system sells these domains, and who supports transfers?
2. What are the real rules for this TLD?
3. What goes wrong most often?
4. How is the renewal price set, and when can it change?
5. What do you do when a transfer fails?

### Brand and trust pages (Plan 09)

1. Who runs the company, and what is each person's real role?
2. What can you prove about your history?
3. Which review profiles exist, and what do customers say most?
4. What should a skeptical buyer check about you?
5. What are the legal entity, address and contact route?
6. What do you honestly not do?

### Off-site work (Plan 15)

1. Which customers might review you, and how will you ask them?
2. Which partners and communities are you already part of?
3. What original data or insight could you publish?
4. Which relationships need disclosure?
5. Who does the monthly routine?

The five banks above (Regional pages, Policy pages, Domain pages, Brand and trust pages, Off-site work) are the owner's exact wording. Do not reword, merge or shorten them. As with every bank, ask one question at a time, record the answer word for word, and treat "none" as a gap: the section that needed the answer is dropped, never invented.

## Which bank for which plan

| Plan | Bank |
|---|---|
| 01 Money pages | Money page |
| 02 Commercial investigation | Comparison |
| 03 Informational | Guide or explainer |
| 04 Problem and troubleshooting | Fix or troubleshooting |
| 05 Regional | Regional pages |
| 06 Service pages | Service page |
| 07 Compliance and trust | Policy pages |
| 08 Domains | Domain pages |
| 09 Navigational and brand (also About and Trust pages) | Brand and trust pages |
| 14 Migration and email | Migration or email |
| 15 Off-site | Off-site work |
| 10 AI search | None: it is a layer on pages that have their own bank |

## Recording format (in the brief)

```
INTERVIEW ANSWERS (verbatim)
Q1 <question>
A1 "<owner's exact words>"  (answered 2026-10-08)
Artifact: <file or link or "none">
Q2 <question>
GAP: not answered
```
