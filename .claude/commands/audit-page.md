---
description: Audit an existing page against the same rules as a new page and report pass or fail per rule (read-only)
argument-hint: <page url or path>
---
Audit the page: $ARGUMENTS

Read-only. Change nothing. Follow `docs/content-planner/README.md`.

1. Find the file and its register row. Report the plan, the keyword and the URL owner. If the page has no register row, say so.
2. Run `npm run check:content -- <file>`, `npm run content:similarity -- <file>`, `npm run content:suggest-links -- <file>` and `npm run content:gen-schema -- <file> --check <jsonld>` when a JSON-LD file exists.
3. Report every rule as pass, warn or fail with the file and line, grouped as the tool groups them. Do not add a score.
4. List the open `[HUMAN REVIEW]` flags, the facts not in the ledger, and the claims that do not render.
5. Close with a short list of proposed fixes, ordered by risk to trust, and say which need the owner.
