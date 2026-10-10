# Team, roles and the page workflow

Status 2026-10-07 (owner decision 23). One human is named: the owner. Claude drafts. This file says who does what, so the
planner's "owner, reviewer, legal reviewer" rules can be followed honestly with a small team.

## Roles

| Role | Who today | Does | Cannot do |
|---|---|---|---|
| Owner and final approver | Sandipan Das | Gives facts, edits, approves every brief and page, ticks the Tier A checklist, flips claims live | Delegate Tier B legal review to Claude |
| Drafter | Claude | Briefs, drafts, self-checks against the rules, runs the checks, updates the register | Invent facts, write testimonials, reviews, team bios, case-study results, or publish a Tier B document |
| Reviewer (second pair of eyes) | **Not named.** The owner reviews until one exists | Reads for facts, tone and first-hand detail | |
| Legal reviewer | **Not appointed** (blocker for Tier B) | Reviews Tier B documents and regional pages | |
| Tax adviser | **Not appointed** | Answers the UK, EU and UAE tax questions in Plan 07 and Plan 12 | |
| WordPress and code | The owner or developer (to name) | Builds pages, runs checks, handles redirects | |

**Byline rule until a second person exists:** the byline names a real person who checked the facts (the owner, or a named
colleague who ran the fix). Guides drafted by Claude carry the line "Drafted with AI assistance, then edited, fact-checked and
approved by [name]". Never put a made-up author on a page.

## The page workflow

| Step | Who | Output |
|---|---|---|
| 1. Pick the keyword and plan | Claude proposes, owner agrees | Register row |
| 2. Brief | Owner fills the human-first fields (reader question, our angle, first-hand knowledge, original element). Claude fills the rest | Brief (README template) |
| 3. Approve the brief | Owner | "Approved" in the brief |
| 4. Draft | Claude | Copy with `[HUMAN REVIEW: ...]` flags for every missing fact |
| 5. Self-check | Claude | Voice self-check, `check:pages`, `lint:content`, `check:register` all clean |
| 6. Review and fix flags | Owner (and the reviewer when one exists) | Flags cleared with real facts |
| 7. Tier check | Owner | Tier A: checklist ticked. Tier B: reviewed by a qualified human, name and date recorded |
| 8. Publish | Owner | Page live, register updated (owner, reviewer, next review date) |
| 9. Measure | Claude reports, owner decides | 28-day review (`measurement.md`) |

## What Claude does when a fact is missing

1. Writes `[HUMAN REVIEW: <what is needed>]` in place of the sentence.
2. Lists the missing facts at the top of the draft.
3. Does not publish, and does not paraphrase around the gap.

## Capacity guidance

- Maximum 3 pages in flight (roadmap).
- Guides start at 2 posts a month.
- The owner is the single approver, so approval is the bottleneck. Batch approvals once or twice a week.
- If the owner is unavailable, nothing publishes. Pre-approved exceptions: fixing a typo or a broken link, with no change to any claim, price or policy.

## Hiring or buying help (in order of impact)

1. A legal reviewer or reputable legal-document service for Tier B documents.
2. A tax adviser who knows Indian GST and UK, EU and UAE rules for digital services.
3. A second person to review facts and first-hand detail on guides.
4. A named WordPress developer for the headless setup and redirects.
