# Handoff: dronahost (home page, E-E-A-T revision of 2026-10-09)

**Status: Ready for owner review.** Open flags: 6 (listed below). This page is not publish-ready; the owner publishes. The register row for `/` is in `review`. The revised spec in `content/pages/home.json` already renders on the live site; what waits for the owner is the review itself: rechecking the page, then setting the review date. The earlier handoff (the full rewrite of 2026-10-08, with the claims table and the decisions applied then) is kept as [home-2026-10-08.md](home-2026-10-08.md); this one covers only the 2026-10-09 revision.

What changed on 2026-10-09: two sections were added to `content/pages/home.json` under the revised blueprint C1 (`HonestLimits` after the three promises, `PageProvenance` before the closing action); the brief gained the reader-questions table, the experience line and the people-first self-assessment; the draft now mirrors the spec section by section. No price, claim, policy or legal text changed. No fact was added from memory: every new sentence maps to the ledger (`project/facts/home.json`, F7, F8, F11, F14) or a recorded decision (36).

## 1. Open flags and missing facts

| Flag | Who can supply it |
|---|---|
| Visible review date: the provenance band says 8 October 2026 (the owner's last full read). After rechecking the two new sections and the FAQ, set `rules.reviewedOn` and `provenance.reviewedOn` in `home.json` to the same date | Owner |
| Reader question "How much does WordPress hosting cost?" is on the page but hidden until `FEATURES.pricesConfirmed` | Owner (confirm prices) |
| Reader question "Who runs DronaHost, and can I check?" cannot be answered without the legal entity, address and team names (interview Q1, Q2, Q5) | Owner |
| First-hand evidence: one recorded decision shows today. A real dashboard screenshot, a measured number, real reviews and a case study would show more (`npm run content:owed -- /`) | Owner, customers |
| "People also ask" for the brand query not yet pasted from a real search (brief section 1) | Owner |
| The editorial policy page (`/editorial-policy`, decision 17) is not written, so the provenance band cannot link to it yet | Owner (Claude can draft; Tier A) |

## 2. The brief

`project/briefs/home.md`, approved 2026-10-08 with the interview skipped; sections 4b, 6b and 10b added 2026-10-09. The SERP snapshot is in section 3.

## 3. The draft

`project/drafts/home.md`. State: Draft (because the interview has gaps and the original element is missing, per the workflow's "States"). The page spec `content/pages/home.json` is what renders and passes every check.

## 4. Metadata

Title "Hosting With the Same Price at Renewal" (41 characters; 53 with the suffix). Description 143 characters. Slug `/`. Schema: Organization and WebSite (unchanged). No FAQPage markup (no rich result expected; source 5).

## 5. Internal links

Unchanged from the brief (section 14), plus `/support-policy` and `/migration-terms` from the honest-limits items and `/contact` from the provenance band. All resolve.

## 6. CTA

"See WordPress hosting plans" to `/wordpress-hosting`, in the hero and the closing band. Fits Find (the direct link) and the secondary Buy intent. No price in the label.

## 7. Check results (2026-10-09)

- `npm run check:content -- content/pages/home.json`: 0 failures. Blueprint: 8 of 13 sections visible, status Ready, 852 visible words (range 500 to 1,000), signature unique. Warnings: IN2 (secondary Buy: "what is included" shows only when the plans show), IN5 (the two open reader questions above). TR1 to TR8 all pass: identity links, two policies, no unsourced authority wording, honest limits, reviewed 1 day ago, provenance visible with a matching date, one first-hand element, no pressure wording.
- `npx tsx scripts/validate-pages.ts`: valid. `npm run check:copy-source`: no copy in components. `npx tsc --noEmit`: clean. `npm run test:tools`: 184 pass. `npm run check:register`: pass. `npm run content:eval`: 10 of 10.
- Not run: `npm run build` and the browser QA (`npm run qa`). The new sections rendered through the same registry in `scripts/page-visibility.ts`, which is how the word count above was measured.

## 8. Advisory rubric (not a gate)

| Category | Score | Evidence |
|---|---|---|
| Intent match | 8 | Find: entity sentence in the lead, router to the main pages, help section; IN1 to IN3 pass |
| Content quality | 8 | Every statement maps to the ledger or a rendering claim (F1 pass); no padding |
| Topic coverage (Needs Met) | 6 | 10 of 12 reader questions answered; price and "who runs it" open |
| Keyword relevance | 7 | Brand in the lead and the FAQ; K2 waived for the H1 by owner decision |
| Readability | 9 | V7 inside the target, no sentence over 28 words, no idioms |
| Original value | 6 | The honest-limits section and policy-linked promises; the "who we are" half of the gain is not on the page |
| Experience shown | 5 | One recorded decision (reply time). Nothing measured, no screenshot, no review |
| Trust | 8 | Provenance band, policies beside promises, honest limits, TR1 to TR8 pass. No entity facts yet |
| SERP alignment | 7 | Differs from the hosting home pages read: renewal price shown, limits stated, no superlatives |
| Answer-engine readiness | 7 | Entity line, question headings in the FAQ, server-rendered; no byline by owner decision |
| CTA relevance | 8 | One action, next step stated in the router lines and the form text |

Fixes for scores below 7: supply the entity facts and the interview answers (Q1, Q2, Q5, Q6); confirm prices; supply one screenshot or one measured number.

## 9. People-first self-assessment against the finished page

See brief section 10b (answered 2026-10-09). Person-checked design items (`rules/trust-and-intent-design.md`, section 7): proof sits beside the action (the promises and limits sit between the router and the form) yes; nothing covers the main content on a phone, to confirm in the browser; no badges, seals or stock photos, yes; the form states what happens next and carries a privacy line, yes.

## 10. Register update to propose

Row `dronahost` / `/`: status is `review` today; the owner sets `published` after the review. Next review date 2027-04-08 unchanged; note "E-E-A-T revision 2026-10-09". Claude does not set `published`.

## 11. What the owner must verify before publishing

1. Spot-check three ledger facts on the page: F8 (no email hosting), F11 (free move, one site per package), F14 (ticket and email only).
2. The name in the provenance band ("Sandipan Das, owner") is the name you want shown. Decision 36 wording in the honest-limits item is as you intend.
3. Reread the two new sections and the FAQ, then set the review date (flag 1).
4. No Tier B text was touched.
