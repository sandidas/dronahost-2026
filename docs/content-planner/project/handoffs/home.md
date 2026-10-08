# Handoff: dronahost (home page, full rewrite)

**Status: Ready for owner review.** Open flags: 12 `[HUMAN REVIEW]` placeholders plus 6 owner decisions. The state is **Draft**. This page is not publish-ready; the owner publishes. It is not a Tier B page. `content/pages/home.json` was **not changed**: the live page still carries the old copy until you approve this draft.

1. **Open flags and missing facts** (who can supply each)
   - Who is behind DronaHost: names and roles (owner; interview Q1, skipped).
   - Legal entity, registration number, address (owner; ledger F19, Q5).
   - Founding year or years in business (owner; ledger F18, Q2).
   - Public support email (owner; ledger F20).
   - The original element: a real, checkable artifact (owner).
   - Server, update and security tasks, and the "You keep" list (owner; needs the `managed-server-care` and `managed-hosting-tasks` claims verified).
   - Migration steps (owner; needs the `migration-process` claim verified).
   - The owner's own "what we do not do" answers (Q6).
   - Author name and author page, and the date a person rechecks the page.
2. **The brief,** with the SERP snapshot: `project/briefs/home.md`. Ledger: `project/facts/home.json` (17 verified, 4 need a check).
3. **The draft:** `project/drafts/home.md`. State: Draft.
4. **Metadata:** title "Managed WordPress, VPS and Cloud Hosting" (40 characters, 52 with the suffix), description 159 characters, slug `/`, schema `Organization` and `WebSite` (existing; the article-schema tool does not apply to the home page).
5. **Internal links:** `/wordpress-hosting`, `/business-hosting`, `/vps-hosting`, `/cloud-hosting`, `/migration`, `/migration-terms`, `/refund-policy`, `/support-policy`, `/pricing-policy`, `/backup-policy`, `/about`. Each helps the reader reach the right service or read the terms behind a claim.
6. **CTA:** one, "See WordPress hosting plans" to `/wordpress-hosting`. It fits Find intent: a direct link. Please confirm WordPress hosting is the primary service.
7. **Check results**
   - `check:content`: 3 files, 0 failures (the draft passes all rules; open placeholders are allowed while the state is Draft). The SO2 warnings are the policy pages, which exist in the app but not in the register.
   - `check:register`, `check:no-brand`, `test:tools` (139), `test:reuse` (9) pass. `content:similarity`: 10% overlap with the current home page, so it is a genuine rewrite. `content:suggest-links`: 29 suggestions, all for pages that do not exist yet.
   - `content:gen-schema` is for articles and fails on the home page (a root slug). I left it alone.
   - **Engine fix made along the way:** rule K2 checked the typed title only. A brand keyword can never appear in a title that M1 forbids from carrying the brand. K2 now reads the title plus the site suffix. A test was added.
   - Could not fix without a new fact: the FAQ "Do I need technical skills" answer opens "Not necessarily", a soft claim (confirm or cut). The managed-WordPress FAQ answer is generic until the managed-hosting claim is verified.
8. **Advisory rubric** (not a gate)

   | Category | Score | Evidence |
   |---|---|---|
   | Intent match | 6 | Find intent, a direct route to each service. The brand SERP was not seen in a real Google search |
   | Content quality | 7 | Every claim maps to ledger F1 to F17 |
   | Topic coverage | 6 | 7 FAQ items. "People also ask" list not available |
   | Keyword relevance | 7 | "DronaHost" is in the H1, the first sentence and the title with the suffix |
   | Readability | 8 | `check-content` passes V1 to V9; every sentence is 28 words or fewer |
   | Original value | 4 | The gain ("who runs it, renewal price, what we do not do") is only half delivered |
   | Trust | 4 | No team, entity or address yet; claims are gated and linked to their policies |
   | SERP alignment | 7 | Shows the renewal price and states what we do not do, which the pages read did not |
   | Answer-engine readiness | 7 | Answers under question headings; the entity sentence is in the first 50 words |
   | CTA relevance | 8 | One CTA, direct link |

   **Fixes for scores below 7:** intent match and topic coverage need a manual Google check and the "People also ask" list. Original value and trust need your interview answers (who runs it, legal entity and address, an artifact). Until then the page stays a Draft.
9. **Register update to propose:** the row `dronahost` (Plan 09, `/`) stays `published` until you approve; then set status `review`, owner Sandipan Das, next review 2027-04-08. The governor already counts this brief (2 of 3 in flight, 2 of 4 this month). Claude does not set `published`.
10. **What the owner must verify before publishing**
    - Spot-check three ledger facts: F10 (24/7 with a reply in 5 minutes), F11 (free migration scope: one website per package, up to 10 on a VPS) and F12 (renewal price equals signup).
    - Decide: the headline (A with the brand first, or B), the brand-first H1 and the brand in the page title, whether the page has a byline and AI line, and whether to add a "not related to other companies with similar names" line.
    - Decide on the business-hosting and VPS router paths: they stay hidden until their claims are verified.
    - Remove the old US-looking WhatsApp number and cloud provider names from the live v1 site and any listings.
    - The old `home.json` has a "Domains are not covered by this promise" line that is not in the ledger. Confirm before it returns.
