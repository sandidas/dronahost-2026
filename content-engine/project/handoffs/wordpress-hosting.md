# Handoff: wordpress hosting with free migration

**Status: Ready for owner review.** Open flags: 3 (owner facts only). This page is not publish-ready; the owner publishes. No Tier B content on the page.

## Audit, 2026-10-11 (decision 68)

Before: TR2 (policy links), TR7 (no first-hand element), IN2 (risk reducer not shown) and BP2 warned after HelpAndPolicies and HonestLimits left. Fixed with the mjcbdd.com case study after the plans, a money-back note and refund link in the closing band, a migration-terms link under the FAQ, and a byline in place of the provenance card. Copy: the answer block no longer repeats the keyword, three migration FAQ answers no longer repeat the same lines, the audience line names small businesses (secondary keyword). Remaining: BP3 Blocked (claims to publish), IN2 Learn warnings and two IN5 warnings caused by the gated Meaning heading.

## Owner changes, 2026-10-11 (decisions 65, 66)

No cPanel and no SSH or WP-CLI. "Command-line access with SSH and WP-CLI" is replaced by "One control panel to manage files, databases, plugins, themes and backups"; the bento tile is now "Everything in one control panel" with a new animated tool grid; the FAQ "What is not included?" adds SSH and WP-CLI; the panel product is no longer named on the page. The HelpAndPolicies section "Support and the policies behind this page" is removed (decision 67).

## Re-target, 2026-10-11

Buy page with prices (decision 63 reopens decision 58 for product pages). Primary keyword "wordpress hosting with free migration" (owner choice from the 2026-10-11 research); "managed wordpress hosting" is secondary. New title "WordPress Hosting with Free Migration" (49 with suffix), H1 "WordPress hosting with free migration and the same price at renewal" (gated on free-migration and renewal-price-same), new lead and answer block, the move section right after the answer (C2 order updated), FAQ "What does the free migration include?" added and "How do you protect my site?" removed. Plan cards now show price, renewal price, "Choose [plan]" and the tax line (the tax line also now shows on /pricing, where it was missing). Visible words in production: 1,326. Checks: only BP3 (Blocked until the page's claims are published). Register row updated; propose status `review`, next review 2027-01-09.

## Refresh, 2026-10-11

Audit of the v1 page, WP Engine and SiteGround. Added, with owner approval: "Who moves their WordPress sites to DronaHost" (PathRouter, four situations from interview A1), "How managed WordPress hosting differs from regular hosting" (Meaning: WordPress hosting vs Business hosting) and two FAQ items ("How do you protect my site?", "Is staging included?"). C2 caps raised to 1,800 words and 10 FAQ items (decision 62). Visible words in production: 1,224 now, about 1,600 once the page's claims are published. Waiting on owner facts: plan upgrades, time to go live, lapsed accounts, CDN, Astra Pro and Blocksy, DDoS protection and Git, a WordPress customer story, measured speed. Open decision: retire or align the v1 site, which promises email, chat, WhatsApp, phone and "unlimited".

## 1. Open flags and missing facts

| Flag | Who |
|---|---|
| Publish the page's own claims: in `content/claims.ts`, set `termsPageStatus: "published"` on nvme, nginx-caching, backup-layers, premium-themes, free-domain, wp-control-panel, staging-plans, malware-scanning, managed-hosting-tasks and free-ssl. Until then production hides the hero lead, highlights, most "we look after" lines, the feature grid and three FAQ items, and the page stays **Blocked** (noindex). Development shows them for review | Owner |
| Free domain: which domain endings, and the renewal price (not used on the page until set) | Owner |
| What Extra Layer Security adds (pricing file description; not shown on this page) | Owner |
| Acceptable use policy: owner will write it later; the page states the rule with no link | Owner, then a qualified reviewer |

## 2. Brief

`content-engine/project/briefs/wordpress-hosting.md` (SERP snapshot 2026-10-11, APPROVAL 1 on 2026-10-11). Interview: `briefs/wordpress-hosting-interview.md`. Ledger: `facts/wordpress-hosting.json` (34 rows: 30 verified, 1 needs check, 3 rejected).

## 3. Draft

`content/pages/wordpress-hosting.json` (blueprint C2, 12 sections), rendered by `app/[locale]/(marketing)/wordpress-hosting/page.tsx`. State: Ready for owner review. Hero visual: `components/sections/hero/PanelMockup.tsx`, an illustration modeled on the owner's control panel screenshot with no customer data; the caption says "control panel" (decision 66).

## 4. Metadata

- Title: "Managed WordPress Hosting, Same Price at Renewal" (60 with " | DronaHost")
- Description: "Managed WordPress hosting with daily backups, 24/7 support by ticket and email, and a free move from your old host. The price stays the same when you renew." (no price, no unrendered feature word)
- Slug and canonical: `/wordpress-hosting`. Schema: BreadcrumbList, Service (no Offer price), FAQPage built from the FAQ items that render. No AggregateRating. `/og/wordpress-hosting.jpg` does not exist yet (default share image used).

## 5. Internal links

`/pricing` (plans and prices), `/email` (email is separate), `/support-policy`, `/migration-terms`, `/sla`, `/pricing-policy`, `/backup-policy` (feature tile), `/contact` (root access, report an error), `/refund-policy` (assurance strip, plan cards).

## 6. CTA

"See WordPress plans" in the hero and the closing band (decision 25, Buy intent), jumping to the plan cards; each card's button goes to `/pricing` (decision 58).

## 7. Check results (2026-10-11)

- `check:content`: one FAIL, BP3 "required sections visible": Blocked because the feature grid's claims are drafts until published (expected; see flag 1). Warnings: IN2 (secondary Learn: no "why it matters" heading, no outside source; Buy: risk reducer and "who it is for" not detected by heading) and IN5 for "Is staging included?" (answered by a feature tile title that comes from the feature library, so the checker does not see it).
- Page spec schema: valid. `check:register`, `check:copy-source`, `check:contrast` (89/89), engine tests (208/208), type check: pass.
- `content:similarity`: max 7% containment with Home. `content:suggest-links`: 27 suggestions; links above cover the minimum.
- Voice: editor self-check passed (longest sentence 22 words; FAQ answers 43 to 61 words; no banned phrase).

## 8. Advisory rubric

Not scored in this pass; not a gate.

## 9. People-first self-assessment (finished page)

| Question | Answer | Evidence |
|---|---|---|
| Original information? | Yes | Same price at renewal, old site live until DNS points, Plesk panel illustration, stated limits |
| Complete for the reader? | Yes | All 4b questions answered (8 FAQ items, limits, feature grid) |
| Title and H1 honest? | Yes | Reason-led H1 gated on the renewal claim |
| Bookmark-worthy? | Yes | Limits and exclusions in one place |
| Sourcing and who is behind it? | Yes | PageProvenance, policy links |
| Reviewed by a named team? | Yes | DronaHost editorial team (decision 59), AI disclosure line |
| No factual error? | Yes, pending owner spot-check | Every fact in the ledger |
| First-hand element visible? | Yes | "Our decision" support limit; Plesk illustration from the real dashboard |
| One clear purpose? | Yes | Buy, one CTA |
| Not padded? | Yes | Within the C2 word range |
| Honest limits, no pressure? | Yes | HonestLimits section; no urgency |

## 10. Register update to propose

`managed wordpress hosting`: status `briefed` -> `review`, owner Sandipan Das, next review 2027-01-09. Claude does not set `published`.

## 11. Owner checks before publishing

1. Spot-check three facts: staging with clone and sync on every WordPress plan (F9), two daily backups that overwrite (F32), Divi, Elementor Pro and Astra on every plan (F29).
2. The provenance names "DronaHost editorial team" and the AI disclosure line.
3. The Plesk illustration matches what customers see.
4. Set the visible review date only after rechecking the whole page, then flip the claims in flag 1.
