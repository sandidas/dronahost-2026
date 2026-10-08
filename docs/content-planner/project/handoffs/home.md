# Handoff: dronahost (home page, full rewrite)

**Status: Ready for owner review (owner decisions of 2026-10-08 applied).** State: **Draft**. The page spec `content/pages/home.json` now carries the new copy. It is not published: the register row is `review`, and the owner publishes.

1. **Owner decisions applied**
   - H1 "Managed WordPress hosting without the technical worry". No VPS, no reply-time promise. The brand is not in the title or the H1; the sentence under the H1 names DronaHost.
   - No byline, no AI line, no look-alike-company line. WordPress hosting is the main service; the primary CTA goes to `/wordpress-hosting`.
   - FAQ answer on technical skills is the owner's exact sentence.
   - The "5-minute reply" is off this page. See item 2 for where it still exists.
   - Facts the owner did not supply are left out and listed under "Later".
2. **Claims table** (from `content/claims.ts`, run through `claimRenders()` on 2026-10-08)

   | id | status | termsPage | termsPageStatus | renders |
   |---|---|---|---|---|
   | money-back | verified | /refund-policy | published | yes |
   | support-24-7 | verified | /support-policy | published | yes |
   | free-migration | verified | /migration-terms | published | yes |
   | renewal-price-same | verified | /pricing-policy | published | yes |
   | backups | verified | /backup-policy | published | yes |
   | the other 19 (uptime-sla, ttfb, first-reply, founded, free-ssl, managed-server-care, managed-hosting-tasks, backup-retention, staging-plans, litespeed, ssh-wp-cli, malware-scanning, business-hosting-scope, managed-vps-scope, website-design-service, migration-process, nvme, cpanel, cloudflare-cdn) | unverified | none | draft | no |

   No claim renders without a published terms page. `support-24-7` renders, but its wording is "24/7 support, with a reply within 5 minutes". Using it on the page would show the 5 minutes, so the home page does **not** use it (not in the hero highlights, the assurance strip or the support section). The 5 minutes still appears in the `/support-policy` page text and in the generated `public/llms.txt` line "Support: 24/7". Changing those is a decision for the owner (see "Decisions needed").
3. **Backups.** `data/pricing.json` has `capabilities.dailyBackups: true` and `limits.backupRetentionDays: 1` on all five plans (starter, growth, pro, essential, plus). `/backup-policy` says one daily backup, and the new one replaces the old one. "Automatic backups of your site" stays. It does not say how many copies are kept.
4. **Checks (all run on 2026-10-08)**
   - `check:pages`, `lint:content`: 1 file, 0 failures. `check:content`: 3 files, 0 failures. `check:register` (52 rows), `check:no-brand`, `check:links` pass.
   - `test:tools` 142 pass, `test:reuse` 9 pass, `test:content` 25 pass, `tsc` clean. `npm run build` passes.
   - Playwright `tests/e2e/home.spec.ts`: 6 of 6 pass after updating the spec (it still expected the claims to be unverified and the old title). Axe on `/`: 0 violations in light and dark. The wider `npm run qa` timed out on `/blog` (a page load timeout in the script; `/blog` answers 200 in 16 ms by curl). Not caused by this change; re-run it.
   - Rendered page: title "Managed WordPress Hosting for Small Businesses | DronaHost", one H1, no "5 minutes", no WhatsApp or chat, no price (prices stay hidden until `FEATURES.pricesConfirmed`).
5. **Waivers.** Rules K2 (keyword in the H1) and P2 (AI line) fail by the owner's decisions. The draft front matter records them as `waive_rules: K2, P2` with the reason and approver, and the checker shows them as warnings. This is a new engine feature (changelog 1.0.4).
6. **Engine changes made along the way (changelog 1.0.4):** owner waivers; OV1 and OV3/OV4 no longer treat a Markdown draft and the page spec for the same URL as two competing pages (the root slug "/" was being emptied, so the same-URL skip never matched). Tests added for each.
7. **Page-spec limits that shaped the copy:** the hero lead is limited to 220 characters, and the router to 4 paths. The website-design path was removed to stay at 4 (it was hidden anyway).
8. **Hidden until their claims verify:** business hosting and VPS router paths, the "What is managed" answer block, server care, the migration steps, the platform feature tiles, plans and prices.
9. **Register:** row `dronahost` now: secondary "managed wordpress hosting for small business", owner Sandipan Das, status `review`, next review 2027-04-08. Claude does not set `published`.
10. **Later (facts not supplied, left out):** legal entity, registration number and address; founding year; support email; team names and roles; one original element; "Who is behind DronaHost" and "What we do not do" sections (the page builder has no section type for them yet); server, update and security tasks; migration steps; website design on the home page.
11. **Decisions needed:** see the chat report.
12. **Verify yourself:** F10 and F12 claim wording against what you sign off, and the "You keep" list, which is carried over from the earlier page and is not in the fact ledger.
