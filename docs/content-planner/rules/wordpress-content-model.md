# WordPress Content Model (blog, guides and fix articles)

Blog and guide copy lives in headless WordPress, not in `content/pages/*.json`. `npm run lint:content` covers the JSON pages only,
so posts need their own fields and checks. This file defines them. It is the content side. Code and security rules are in
`docs/rules/coding-rules.md` (WordPress data layer) and `docs/rules/seo-rules.md`.

## Fields every post must have

| Field | Type | Rule |
|---|---|---|
| Title | text | Keyword first, 60 characters or fewer, no brand suffix (the helper adds it) |
| Slug | text | Matches the register's Target URL for the primary keyword |
| Plan | choice | One of the plans (03 informational, 04 problem, 14 migration and email, and so on) |
| Primary keyword | text | Must be the register's primary keyword for this URL. One per post |
| Secondary keywords | list | From the register's Secondary column, plus 3 to 6 question phrases |
| Search intent | choice | `guide`, `fix`, `comparison`, `policy` (as seen in the live top 10) |
| Answer block | text, 40 to 80 words | Shown directly under the H1 |
| Author | person | A real person who checked the facts. Never a made-up name |
| Reviewer | person | A second person when one exists. Until then the owner |
| AI-assisted | yes or no | If yes, the page shows the disclosure line |
| Reviewed on | date | Real review date. The only source of any year shown on the page |
| Next review on | date | Required. Also in the register |
| Claims used | list of ids | Every claim the post states, by `content/claims.ts` id. No claim on the page that is not listed |
| Sources | list | Name, URL, retrieval date. At least two for guides, per Plan 03 |
| First-hand detail | text | What we actually did or saw (tool, site type, result). A post without it cannot publish |
| Tested versions | text | For fix posts: WordPress and PHP versions, and the test date |
| Supports | page | The money or policy page this post supports (for the soft link) |
| Cluster | choice | The pillar this post belongs to |
| Internal links | list | Three or more, each with descriptive anchor text |
| Schema | choice | `BlogPosting`, plus `FAQPage` or `HowTo` only if it matches the visible content |

## Workflow states

| State | Meaning | Who moves it |
|---|---|---|
| Idea | Register row exists | Claude |
| Brief approved | Human-first fields filled, owner approved | Owner |
| Drafted | Claude's draft, `[HUMAN REVIEW]` flags present | Claude |
| Checked | Automatic checks pass (below) | The build |
| Reviewed | Flags cleared, facts and first-hand detail confirmed | Owner (and the reviewer) |
| Published | Live | Owner only |

Only the owner has the publish permission in WordPress. Authors and editors can save drafts. This prevents an unreviewed post going live.

## Automatic checks (run on every save of a draft and before publish)

The checks use the same rules as the page linter, applied to the post fields and body. A failure blocks the **Checked** state and the publish webhook.

| Check | Fails when |
|---|---|
| Banned phrases | Any phrase from `rules/voice.md` ("Phrases that never appear") or the content rules avoid list |
| Numbers and claims | A price, percentage, guarantee, SLA, location or "X times faster" that is not rendered from `claims.ts`, `pricing.json` or a listed source |
| Feature words | LiteSpeed, NVMe, free SSL, daily backups, uptime or CDN appear and the matching claim does not render |
| Support channels | WhatsApp, live chat or phone support is mentioned |
| Email | Any wording that suggests we host email |
| Answer block | Missing, under 40 or over 80 words, or the first sentence does not answer |
| FAQ | An answer outside 40 to 80 words, or more than one link per answer |
| Headings | More than one H1, a skipped level, or an H2 over 60 characters (guideline) |
| Reading level | Average sentence over 20 words, or any sentence over 28 words |
| Internal links | Fewer than 3, a link to a missing page, or anchor text like "click here" |
| People | No author or no review date. An author with no author page |
| Sources | Fewer than 2 for guides, or a source with no retrieval date |
| Keyword | The primary keyword is not in the register, is owned by another URL, or is missing from the H1 and first 100 words |
| First-hand | The first-hand field is empty or still contains a `[HUMAN REVIEW]` flag |
| Fix posts | No tested versions and test date, or no backup step before a change |
| Raw text | HTML entities, lorem ipsum, or an unclosed `[HUMAN REVIEW]` flag |

## Disclosure and bylines

- AI-drafted guides carry: "Drafted with AI assistance, then edited, fact-checked and approved by [name]."
- Byline: "Written by [name]. Reviewed by [name] on [date]." If the writer and reviewer are the same person for now, say so once, plainly.
- Author pages exist before the first post ships (real name, role, photo, link). No stock photos or invented people.

## Updating and retiring posts

- Time-sensitive posts are reviewed every month, other posts every 6 months. The register holds the date.
- A changed fact triggers an update the same day. Update `Reviewed on` only when a person rechecked the whole post.
- A post that is wrong and cannot be fixed is unpublished and redirected to the closest page. Record the change in the register.

## Security reminder (content side)

WordPress HTML is sanitised on the server before rendering. Editors cannot add scripts, iframes or inline styles. Preview uses Draft Mode with a secret. A webhook with a shared secret triggers revalidation.
