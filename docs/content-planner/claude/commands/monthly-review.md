---
description: Monthly review: AI spot-check, 28-day reports, refresh queue, governor, and the learning log
---
Run the monthly review. Follow `docs/content-planner/README.md`, the AI search plan, `rules/ai-search.md` and `rules/governor.md`.

1. `npm run content:governor` and `npm run check:register`. Report in-flight, new briefs this month, the pause switch and any register error.
2. `npm run content:refresh-queue` (add `-- --gsc <pages.csv>` when an export is available). List what is overdue, what is due within 30 days, and any page with no impressions.
3. For every page published 28 days ago or more, run `npm run content:gsc-report -- <queries.csv> --pages <pages.csv>` when exports exist. If they do not, say which export the owner needs to download and from where.
4. AI spot-check: ask the 20 target questions from the AI search plan in the answer engines you can reach. Record, for each: is the business named, which page is cited, is the answer correct, and the date. Do not guess a result you could not check.
5. Re-check `rules/sources.md` if the quarterly date has passed, and run `npm run eval`.
6. Draft new rows for `project/learning-log.md` (date, page or area, change made, result, rule or file updated) and show them to the owner. Add them only after the owner confirms. Propose rule changes from the log, never from opinion.
