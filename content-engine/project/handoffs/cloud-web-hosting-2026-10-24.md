# Handoff: cloud hosting for small business

**Status: Ready for owner review.** Open flags: 8. This page is not publish-ready; the owner publishes.

## 1. Open flags and missing facts

| # | Flag | Who supplies it |
|---|---|---|
| 1 | The page is Blocked (BP3) like /business-hosting and /wordpress-hosting: the BentoGrid "What every cloud plan includes" is hidden until feature:performance, feature:security, feature:backups and feature:control-panel render (their claims' terms pages are drafts) | Owner publishes the terms pages |
| 2 | How a plan change is done and billed (proration) is not confirmed (F33). The page says only "move up a plan" | Owner |
| 3 | Case study on this page (brief 6b): not confirmed. ReviewsShowcase renders only verified data | Owner |
| 4 | Support hours: FAQ says 24/7 (claim support-24-7 renders, /support-policy says 24/7 for everyone) while pricing.json confirmBeforeLaunch still lists Starter and Growth hours as unset (F9). Same conflict on /business-hosting | Owner |
| 5 | Traffic above a plan's limits: no fact says whether it is ever charged, throttled or covered by fair use. The bill FAQ says only that plans do not scale on their own and renewal does not rise | Owner |
| 6 | "DronaHost runs the hosting account" and the phrase "managed cloud hosting for small business" (approved secondary): the claim managed-server-care is unverified, so the server-care line stays hidden and the FAQ defines the split (we run the account, monitoring and daily backup; you run the site). Confirm the wording | Owner |
| 7 | No outside source link (CP4 warn): no section in the outline takes one. Option: add the HostingScale finding (F24) via a RenewalCost section, or a Google Cloud definition once a person copies it (F35) | Owner choice |
| 8 | Stale project facts: PROJECT.md line 68 (cloud "None yet", `/cloud-hosting`) and line 105 (uptime SLA and free SSL "unverified"); /pricing-policy says "US dollars for now" while five currencies are live; the page-map rows still list `/cloud-hosting` as Blocked for "needs plans:cloud" | Owner (or Claude on request) |

Ungated text to know about: seo.description says "the same price at renewal", and the CTABand note says "30-day money-back guarantee on every plan." Neither field can be gated; both claims render today.

## 2. The brief

`content-engine/project/briefs/cloud-web-hosting.md` (APPROVAL 1, 2026-10-24, decision 78), interview `briefs/cloud-web-hosting-interview.md`, fact ledger `facts/cloud-web-hosting.json` (31 facts, 24 verified).

## 3. The draft

`content/pages/cloud-web-hosting.json`, rendered by `app/[locale]/(marketing)/cloud-web-hosting/page.tsx` (moved from `content/services.ts` / ServicePage to the page-spec renderer, as /business-hosting). State: Ready for owner review. 14 sections, 1,749 visible words.

New section type for the original element: `PlanGuide` (`components/sections/bespoke/PlanGuide.tsx`, schema in `lib/content/schemas/sections.ts`, data from `buildPlanGuide()` in `lib/pricing/plans.ts`, labels in `content/strings.ts`, registry entry, blueprint order C2 after Meaning, docs/components/README.md). Every figure renders from data/pricing.json; the spec supplies one "good fit when" line per plan with no numbers.

## 4. Metadata

- Title: "Cloud Hosting for Small Business, Fixed Price" (57 characters with " | DronaHost").
- Description: "Cloud hosting for small businesses on infrastructure from leading cloud providers. Four plans, the same price at renewal, free migration, uptime SLA."
- Slug and canonical: `/cloud-web-hosting`. Schema: BreadcrumbList, Service, FAQPage (visible items only). No price, provider or location in schema.

## 5. Internal links

| Anchor | Target | Why |
|---|---|---|
| Read how renewals work | /pricing-policy | Renewal terms (AnswerBlock) |
| Compare every plan and add-on | /pricing | Full comparison (plan guide, plans) |
| Read the support policy | /support-policy | Support terms (honest limits) |
| Read the migration terms | /migration-terms | What the free move covers (FAQ) |
| Help me choose a plan | /contact | Answers "which plan" (hero, CTA) |
| Read the SLA | /sla | Through the uptime-sla claim's terms link (assurance strip) |

Pages that should link here (CP7, 0 today): /business-hosting, /wordpress-hosting, /pricing, the hosting menu.

## 6. CTA

"See cloud hosting plans" to the plan cards (Buy, middle stage); secondary "Help me choose a plan" (the question support hears most, A4). Note: 30-day money-back guarantee.

## 7. Check results (2026-10-24)

- `scripts/validate-pages.ts`: ok, 14 sections.
- `check:content` on the page: one FAIL, BP3 Blocked (flag 1, same as the other product pages). Warnings: IN2 (Learn: no outside source, no "why" heading; Buy: "who it is for" not recognized as a router), IN5 ("Will my site stay up?" matched by an FAQ item the checker does not pick up), TR5 (review date equals today), CP2 (no image alt), CP3 (no video), CP4 (no outside link), CP7 (no inbound links). BP11 1,749 words, inside 700 to 1,800.
- `check:register`: passed. `check:copy-source`: no page copy in 71 component files. `tsc --noEmit`: clean. eslint on changed code: clean. `test:project` 4/4, `test:content` 73/73.
- `content:similarity`: highest overlap /business-hosting, containment 19%, Jaccard 10% (limit 30%).
- `content:gen-schema`: generated. `content:suggest-links`: 28 suggestions. `content:owed`: 13 of 14 sections visible; owed facts are the four BentoGrid features.
- Rendered on the dev server (port 3003): HTTP 200; title, H1 and 13 H2s as planned; plan guide rows Starter to Scale with figures from the pricing file; no horizontal page scroll at 390 px or 1,440 px (the table scrolls inside its frame on phones); no provider name or "Unlimited" in the HTML.

## 8. Advisory rubric

Not scored in this pass; run with `/audit-page /cloud-web-hosting` if wanted.

## 9. People-first self-assessment (against the finished page)

| Question | Yes or no | Evidence |
|---|---|---|
| Original information? | yes | Plan guide from the pricing file, with "next step up" and the honest no-auto-scaling line |
| Complete for the reader's question? | yes | Every brief 4b row has a heading or FAQ item |
| Title and H1 descriptive? | yes | Both carry the primary keyword and the fixed-price reason |
| Would you bookmark or recommend it? | yes | Plain fit/not-fit list and plan guide |
| Clear sourcing and who is behind it? | partly | Byline and policy links; no outside source yet (flag 7) |
| Reviewed by a named person? | pending | Owner review |
| No factual error? | to check | Spot-check below |
| First-hand experience visible? | if confirmed | Case study (flag 3); honest limits marked as our decisions |
| One clear purpose? | yes | Choose a cloud hosting plan |
| Nothing padded? | yes | Repeats cut in the edit pass; 1,749 words |
| Honest limits, no pressure? | yes | Email not included, no automatic scaling, ticket and email only; no urgency |

## 10. Register update to propose

`cloud hosting for small business` → status `review`, owner Sandipan Das, next review date set by the owner at publish.

## 11. What the owner must verify before publishing

1. Spot-check three facts: the plan guide figures against data/pricing.json (F2, F3, F36); "99.99% uptime SLA with service credits" against /sla (F31); "the free move of one website" against /migration-terms (F6).
2. The byline: "DronaHost editorial team", reviewed 2026-10-24.
3. Flags 2 to 6 above.
4. Set the visible review date only after rechecking the whole page.

## Revision 2026-10-24 (owner asked for the three fixes that need no new facts)

- Two FAQ items added (10 of 10): "How is cloud hosting different from shared hosting?" (F30, F34; the opening sentence "On shared hosting, many sites draw on one server's resources" is a general definition with no ledger source: owner to confirm) and "How much does cloud hosting cost for a small business?" (no price typed; F5, F27, new F37 "paying yearly costs less per month"). The tax line moved from the bill FAQ to the cost FAQ.
- Copy trimmed to stay under the C2 cap: 1,795 visible words.
- Inbound links (CP7 now passes): /business-hosting PathRouter path 1 and /wordpress-hosting PathRouter path 4 now point to /cloud-web-hosting ("See the cloud hosting plan guide"); both pages were already reviewed, so the owner rechecks those two lines. /pricing's closing band (PRICING_CTA in content/home.ts) now points to the plan guide instead of linking back to /pricing.
- Checks: validate-pages 4 of 4 valid; check:content only BP3 (shared Blocked state); check:register, check:copy-source, tsc, eslint clean; similarity under 0.3. Rendered on port 3003: both FAQs on the cloud page, and the new link on /business-hosting, /wordpress-hosting and /pricing.

## Revision 2026-10-24 (owner: "add 2 more cards" to "On every plan")

- Two feature-library entries added in `lib/content/features.ts`: `uptime` (claim uptime-sla, renders; F31) and `migration` (claim free-migration, renders; plans' capabilities.freeMigration; F6), each with a link to its terms (/sla, /migration-terms) and a new tile visual (`UptimeVisual`, `MoveVisual` in components/sections/visuals/bento.tsx). The cloud page's BentoGrid lists six tiles.
- Effect: these two tiles render today, so the BentoGrid shows in production (the four older tiles stay hidden until their claims' terms pages are published). /cloud-web-hosting is now **Ready** (BP3 passes, 14 of 14 sections visible, nothing owed). Open flag 1 above is resolved for this page; /business-hosting and /wordpress-hosting are unchanged.
- To stay under 1,800 words: the FAQ "Can you move my site?" was removed (the move is covered by the process steps and the new card), the migration line left ResponsibilitySplit, and three FAQ answers were shortened. 1,795 visible words. Brief 4b row updated.
