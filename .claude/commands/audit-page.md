---
description: Audit an existing page against the same rules as a new page and report pass or fail per rule (read-only)
argument-hint: <page url or path>
allowed-tools: Read, Grep, Glob, Bash(npm run check:*), Bash(npm run content:*), Bash(npm run eval)
---
Audit the page: $ARGUMENTS

Read-only. Change nothing. Follow `content-engine/README.md`. Run `npm run content:voice` first and judge the copy against that card.

1. Find the file and its register row. Report the plan, the keyword and the URL owner. If the page has no register row, say so.
2. Run `npm run check:content -- <file>`, `npm run content:similarity -- <file>`, `npm run content:suggest-links -- <file>` and `npm run content:gen-schema -- <file> --check <jsonld>` when a JSON-LD file exists.
3. Report every rule as pass, warn or fail with the file and line, grouped as the tool groups them. Do not add a score. For the Intent and Trust groups (IN1 to IN5, TR1 to TR8) say in one line what the page would need to show.
4. List the open `[HUMAN REVIEW]` flags, the facts not in the ledger, the claims that do not render, and the result of `npm run content:owed -- <url>` (the first-hand element, the screenshot, the reviews the page is waiting for).
4b. Answer the people-first self-assessment (`templates/brief.md`, section 10b) against the live page, one evidence line each, and check the person-judged design items in `rules/trust-and-intent-design.md`, section 7.
5. Close with a short list of proposed fixes, ordered by risk to trust, and say which need the owner.
