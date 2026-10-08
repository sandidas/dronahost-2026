---
description: Research candidate keywords for a topic and propose register rows within the governor caps
argument-hint: <topic>
---
Plan keywords for: $ARGUMENTS

Follow `docs/content-planner/README.md` and `rules/governor.md`. This command never writes a page.

1. Run `npm run content:governor`. The number of rows you may propose is the monthly cap minus the briefs already started this month, and zero if the pause switch is on or the in-flight cap is reached. Say the number first.
2. Research the topic with the `researcher` agent: real search suggestions and the live results for each candidate (dated). Use Search Console data if a CSV is available.
3. For each candidate run `npm run content:resolve -- "<keyword>"`. Drop anything excluded, anything that is a variant of an existing row (put it in that row's Secondary column instead), and anything with no information gain you can honestly name.
4. Check intent against the live results. Never target a local intent when the project has no local presence.
5. Propose at most the allowed number of rows as a table: keyword, locale, secondary phrases, intent check (page type seen in the results), plan, target URL or `planned`, and the reason in one line. Volume and difficulty stay blank unless a tool recorded them with a source and a date.
6. Do not edit the register until the owner approves the rows. After approval add them with status `unvalidated` and run `npm run check:register`.
