# Plan 04: Problem and Troubleshooting (pain-led intent)

**Intent:** something is broken or underperforming and the searcher wants it fixed now. They are stressed and short on time.
**Goal:** solve the problem honestly. The readers who then need hosting or help come to us on their own.
**Owns:** `slow`, `hacked`, `error`, `not working`, `down`, `why is my`, `fix`, `how to remove`, `white screen`, `not secure`.

This is the most useful plan for people who are not yet customers, and the one most likely to be cited by AI tools for "how do I fix ..." questions.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Solve.
- **Interview:** The **Fix or troubleshooting** bank in [interview-questions.md](../rules/interview-questions.md).
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). HowTo markup is not used for Google; it is allowed only if another consumer needs it and it matches the visible steps.

## Content families (seeds, unvalidated)

| Family | Example queries | Typical fix | Soft link |
|---|---|---|---|
| Speed | wordpress site slow; high ttfb wordpress; lcp too high wordpress | Caching, image weight, plugin audit, server response | The matching product page |
| Security | wordpress site hacked; how to remove malware from wordpress; redirect to spam site | Clean-up steps, restore, harden | The security page |
| Errors | wordpress white screen; error establishing a database connection; 500 internal server error | Diagnose by log, config, memory | The contact page |
| Downtime | why is my website down; site down after dns change | Check DNS, hosting, certificate | The SLA page |
| Email | emails going to spam; cannot send email from wordpress | SPF, DKIM, DMARC, SMTP | The page that owns email |
| Migration pain | site broken after migration; dns not propagating | Checklist, TTL, hosts file | The migration page |
| SSL | not secure warning; ssl certificate error | Renewal, mixed content, redirects | The security page |

The project's soft-link URLs: the project's plan-specifics for this plan.

## Page template (diagnose, then fix)

1. **H1:** the symptom in the searcher's words, 20 to 70 characters ("WordPress site slow: how to find the cause"). The byline sits directly under it.
2. **Quick answer (40 to 80 words):** the most common cause and the first thing to check.
3. **Before you start:** take a backup. Say how, in one line. This is also a trust signal.
4. **Find the cause:** a short decision list. "If you see X, go to step A. If Y, step B."
5. **Fixes in order of effort:** each numbered, each with how to confirm it worked.
6. **When to ask for help:** an honest line on when the fix needs a developer, with a link to the contact page. Never hide a hard problem behind an easy one.
7. **Prevent it next time:** two to four habits, plain words.
8. **FAQ:** related symptoms, count per `limits.faqItemsByArchetype` in the config.

## Rules

- **Human first.** A person who has run the fix writes the angle and the steps before any AI draft. Every step has been tested by a person, and the original element is a real screenshot or log from that test (rules section 8).

- **Calm and non-blaming.** The reader is already worried. Say what happened and what to do next. No "Don't worry".
- **Safe first.** Backup before change. Warn before any step that deletes data. Never ask the reader to disable security features without saying why and how to turn them back on.
- **Platform-neutral where possible.** The fix works on any host. Say so. Our hosting is mentioned only where it is truly relevant, in one soft line.
- **Tested steps only.** Every step has been run on a real site by the author. Record the date and the versions tested (WordPress, PHP) in the post. Flag `[HUMAN REVIEW: verify steps on current versions]`.
- **No fake urgency.** No "Your site is at risk" openers.
- **Screenshots and commands** are real, annotated, and have alt text that describes what to look for.

## Keywords

Target specific symptoms plus context: "wordpress site slow after plugin update", "ttfb high wordpress litespeed". Long, specific queries convert better and rank faster.

Do not target: generic "website not working", which has no useful single answer and attracts the wrong audience.

## Format and schema

`BlogPosting` with `BreadcrumbList`. Use `FAQPage` only for the visible FAQ. `HowTo` is not used for Google; it is allowed only if another consumer needs it and it matches the visible steps. Place under `/kb/[slug]` for stable reference fixes and `/blog/[slug]` for time-bound items (a plugin bug, an outage in the news).

## Internal links (minimum)

The related informational pillar, the supported product or trust page, the contact page for help, and one sibling fix.

## Pre-ship checklist

- [ ] Steps tested, versions and date recorded
- [ ] Backup step present before any change
- [ ] First answer in the first 80 words
- [ ] Honest "when to get help" section
- [ ] One soft product link, relevant to the problem
- [ ] Author and review date shown, next review date in the register
- [ ] Lint passes

## Measure

Clicks and impressions by family, time on page, scroll depth to the fix steps, "Contact" and plan clicks from these pages, AI citation spot-checks.
