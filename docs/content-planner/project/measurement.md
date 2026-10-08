# Measurement

Status 2026-10-07. Every plan has a "Measure" section. This file defines what is actually tracked, so the numbers exist
before the pages launch. Targets are left blank on purpose: set them after four weeks of real data.

## Tools

| Need | Tool | Note |
|---|---|---|
| Search performance | Google Search Console and Bing Webmaster Tools | Verify both properties before launch. Submit the sitemap |
| Site analytics | Cookieless analytics (Plausible or Fathom, per `PROJECT.md`) | Anything that sets cookies waits for consent |
| Speed | Lighthouse (median of 3 mobile runs) and field data from Search Console | Targets: LCP under 2.5 s, INP under 200 ms, CLS under 0.1 in field data |
| Orders | WHMCS | Match plan, cycle and currency to the hand-off event |
| AI visibility | Monthly manual spot-check (Plan 10) | Logged in the register's `AI cited` column |
| Reviews | The review platforms (Plan 15) | Count and score, with the date retrieved |

## Events (no personal data in any event)

| Event | Fires when | Properties |
|---|---|---|
| `plan_click` | A plan card button is clicked | plan id, family, billing cycle, page |
| `checkout_handoff` | The visitor leaves for the WHMCS cart | plan id, cycle, currency |
| `migration_request` | The migration form is submitted | source platform (optional field) |
| `contact_submit` | The contact form is submitted | topic |
| `consultation_booked` | A consultation is booked | service |
| `pricing_toggle` | Billing cycle or plan family changes | from, to |
| `faq_open` | A FAQ item is opened | question id |
| `outbound_client_area` | The login link is clicked | page |
| `currency_change` | Selector used (when the selector exists) | from, to |
| `plan_finder_result` | The plan finder returns a result (when it exists) | plan id |

## Key numbers by page type

| Page type | Primary | Secondary |
|---|---|---|
| Money pages (Plan 01) | `plan_click`, `checkout_handoff`, orders | Position for the primary keyword, click-through rate, pricing visits |
| Migration (Plan 14) | `migration_request` | Time on page, FAQ opens |
| Email page (Plan 14) | Support tickets about email (should fall), clicks to the setup guide | Position for the keyword |
| Comparison (Plan 02) | Clicks to the matching plan | Position for the alternative keyword |
| Guides and fixes (Plans 03, 04) | Impressions and clicks by cluster | Assisted conversions, AI citations |
| Services (Plan 06) | `consultation_booked`, qualified enquiries | Case study views |
| Trust (Plans 07, 09) | Brand SERP quality, review count | Tickets asking what a policy now answers (should fall) |

## Rhythm

| When | What | Who |
|---|---|---|
| Weekly (first 8 weeks after launch) | Search Console 404s and redirect errors, indexing, top queries | Claude reports, owner decides |
| 28 days after a page publishes | Read the page's measures, note what to change | Claude reports |
| Monthly | AI spot-check (20 questions), review count, claim status, plan-click conversion | Claude reports |
| Quarterly | Refresh pages due for review, re-check competitor data, prune dropped keywords | Owner |

## Rules

- Do not track what is not used. Remove an event that nobody reads for a quarter.
- Report the denominator with every rate (clicks out of how many views).
- Do not change a page and a price at the same time if you want to learn which one moved the numbers.
- Record each change with its date in the register notes, so a later drop can be traced.
