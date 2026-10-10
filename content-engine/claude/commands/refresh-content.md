---
description: Check an existing page against the rules and the live results, and propose changes (never publishes)
argument-hint: <page url or path>
---
Refresh the page: $ARGUMENTS

Follow `content-engine/rules/content-writer-workflow.md` for the checks and `rules/information-gain.md` for the gain. Never publish and never change a price, claim or legal text. Run `npm run content:voice` first and keep the copy in that voice.

1. Find the file: the register row for the URL, then the page spec or the post. Say which file and which plan.
2. Run `npm run check:content -- <file>` and `npm run content:similarity -- <file>`. List every failure and warning.
3. Re-read the live results for the primary keyword (dated). Compare: has the intent changed, are there new questions, has a source gone out of date? Re-check every fact in the ledger against its source; a fact you cannot re-verify is marked `needs-check`.
4. If a Search Console CSV is available, run `npm run content:gsc-report -- <queries.csv>` and use its proposals for this page only.
5. Propose changes as a list: what to change, why (rule id, source or query), and which interview answer or artifact supports it. Anything that needs first-hand material becomes a question to the owner, never an invention.
6. After the owner approves, edit the draft, update `reviewed_on` only when a person has rechecked the whole page, run the checks again, and hand off as "Ready for owner review" with a register update to propose (next review date).
