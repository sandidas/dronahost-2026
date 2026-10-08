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
| Support channels | A channel listed in `forbiddenChannels` (`project/rules.config.json`) is mentioned |
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

## Publish check: posts adapter and webhook

Two read-only tools answer one question: does this post pass every content rule? They never create, edit or publish anything in WordPress. The owner alone holds the publish permission. A passing check does not publish a post; it only allows the owner to.

### Commands

| Command | What it does |
|---|---|
| `npm run content:posts` | Reads posts over the REST API and runs every rule on each. Options: `--id N`, `--status publish,draft,pending`, `--fixture file.json` (a JSON array of REST posts, no network), `--optional` (exit 0 with a skip message when the adapter is not configured; without it a missing setting is a failure). |
| `npm run content:webhook` | Starts a small server for `POST /check`. Options: `--port 4010`, `--host 127.0.0.1`. |

Both need `adapters.posts` set to `"wordpress"` and the `adapters.wordpress` block in the config.

### Environment variables

The names live in `adapters.wordpress`; the values live only in the environment. Nothing prints or stores them.

| Config key | Holds |
|---|---|
| `apiUrlEnv` | The REST base URL, for example `https://example.com/wp-json/wp/v2` |
| `userEnv`, `passwordEnv` | A WordPress user and an application password with read access (Basic auth is sent only when both are set) |
| `webhookSecretEnv` | The shared secret for the webhook, 16 characters or more |

### Field map

`adapters.wordpress.fields` maps each field the rules need to a dotted path in the REST post, such as `meta.primary_keyword` or `_embedded.author.0.name` (array indexes are allowed). `urlTemplate` (for example `/kb/{slug}`) gives the public path unless the map supplies `url_path`. `stateMap` turns a WordPress status into a workflow state. Only the title, slug, content and excerpt are WordPress core fields. Every custom field must be exposed in the REST API by the WordPress side (for example with `register_post_meta` and `show_in_rest`). This tool does not change WordPress. A field that is missing is left out, and the matching rule then fails; no value is invented.

### Webhook contract

`POST /check` with the header `x-planner-secret` set to the shared secret. The body is JSON: `{ "id": 123 }` (the tool reads that post) or `{ "post": { ... } }` (a REST post, no read).

| Status | Meaning |
|---|---|
| 200 | `{ "ok": true, "checked": 1 }`. Every rule passes |
| 422 | `{ "ok": false, "failures": [{ "rule", "line", "message" }] }`. At least one rule fails |
| 401 | Missing or wrong secret, no detail |
| 400 | Invalid JSON, or neither `id` nor `post` |
| 404 / 405 | Another path / another method |
| 413 | Body over 1 MB |
| 502 | The post could not be read from WordPress |

The server will not start if the secret variable is unset or shorter than 16 characters. It listens on `127.0.0.1` unless `--host` says otherwise; put it behind HTTPS if it is reachable from another machine.

### Example hook (for the WordPress developer to adapt)

This is an example only. We do not install it. It asks the endpoint before a post becomes published and keeps the post in its current state when the answer is not 200.

```php
<?php
// Example only. Adapt, review and install on the WordPress side.
add_filter( 'wp_insert_post_data', function ( $data, $postarr ) {
    if ( 'post' !== $data['post_type'] || 'publish' !== $data['post_status'] || empty( $postarr['ID'] ) ) {
        return $data;
    }
    $response = wp_remote_post( 'https://planner.example.com/check', array(
        'timeout' => 15,
        'headers' => array(
            'Content-Type'     => 'application/json',
            'x-planner-secret' => getenv( 'CONTENT_WEBHOOK_SECRET' ),
        ),
        'body'    => wp_json_encode( array( 'id' => (int) $postarr['ID'] ) ),
    ) );
    if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
        $data['post_status'] = 'pending'; // block the change to publish
        set_transient( 'planner_check_failed_' . $postarr['ID'], wp_remote_retrieve_body( $response ), 60 );
    }
    return $data;
}, 10, 2 );
```

The hook sends the saved post by id, so the author must save the latest text before publishing. The owner reads the failures, fixes the post and publishes it.
