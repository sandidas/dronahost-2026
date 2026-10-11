---
slug: /
plan: 09 Navigational and brand
primary_keyword: dronahost
secondary_keywords: hosting for small business
locale: en-US
state: Draft
author: "[HUMAN REVIEW: no byline on the home page by owner decision; set only if that changes]"
reviewer: "Sandipan Das (owner)"
ai_assisted: yes
waive_rules: K2, P2, S3
waive_reason: "owner decision 2026-10-08: no brand name in the H1 and no AI line on the home page; S3 matches the waiver in content/pages/home.json (conversion review 2026-10-09: the long managed-hosting answer moved to /wordpress-hosting)"
waive_approved_by: Sandipan Das (owner)
reviewed_on: "[HUMAN REVIEW: set when a person rechecks the whole page]"
next_review_on: 2027-04-08
seo_title: Hosting With the Same Price at Renewal
meta_description: DronaHost is a focused team offering managed WordPress hosting for small businesses, freelancers and agencies worldwide. See the plans and policies.
claims_used: money-back; free-migration; renewal-price-same; backups
---

# Managed WordPress hosting without the technical worry

DronaHost is a focused team that offers managed WordPress hosting for small businesses, freelancers and agencies worldwide. We move your site for free, and you can reach us by ticket or email. A 30-day money-back guarantee backs your first month, and the renewal price equals the signup price. [See WordPress hosting plans](/wordpress-hosting).

Editor note: this file mirrors `content/pages/home.json` section by section (the page spec is what renders). The paragraph above is the hero lead plus the highlights that show under it; the lead itself is limited to 220 characters in the spec. Rewritten 2026-10-09 to match the conversion-review order (decision 37) and the E-E-A-T revision (engine 1.0.8): sections 3b and 7b are new.

Editor note: owner decisions of 2026-10-08 are applied. Rules K2 (the keyword in the H1) and P2 (AI line) are waived for this page. The brand is not in the title or the H1, and the sentence under the H1 names DronaHost. There is no byline, no AI line and no look-alike-company line. The lead's "for free" sentence shows only while the free-migration claim renders; the spec holds a fallback without it. Lines that start with "Editor note" are not page copy.

## 1. Hero (home.json: hero)

**Eyebrow:** Managed WordPress hosting

**Primary action:** [See WordPress hosting plans](/wordpress-hosting). **Secondary action:** Move my site free. It anchors to the request form (section 7 of blueprint C1, section 4 of this draft). It shows only while `free-migration` renders and the form has a destination.

Editor note: a real dashboard screenshot shows beside the text when `public/screenshots/home-dashboard.png` exists. With no file the hero shows no visual. No mockup is presented as the product.

## 1b. Proof bar (home.json: proofbar)

Editor note: three or four measured numbers (uptime, speed, first reply, year founded), each from a claim that renders. None renders today, so the bar is hidden. Nothing is typed here.

## 2. Where are you starting from? (home.json: router)

**H2:** Where are you starting from?

Managed hosting means a team looks after the technical side of your site. You keep control of your content, plugins and domain.

- **I already have a WordPress site.** We move it to DronaHost, and the move is free. [See free migration](/migration)
- **I need a new WordPress site.** Choose managed WordPress hosting. [See WordPress hosting](/wordpress-hosting)
- **I need simple hosting for a business site.** Web hosting with a cPanel dashboard, for any kind of site. Email is not included. [See business hosting](/business-hosting)
- **I want full control of my server.** Managed VPS with root access. [See managed VPS](/vps-hosting)

Editor note: the business hosting and VPS paths stay hidden until `business-hosting-scope` and `managed-vps-scope` are verified. The website design path is left out (the owner has not said whether to show it).

## 2b. Plans and pricing (home.json: plans)

**H2:** Plans and pricing

Editor note: the plans component reads `data/pricing.json` and stays hidden in production until `FEATURES.pricesConfirmed`. No price is typed here. Prices exclude tax. Customers in India pay GST at checkout. Link: [Compare all plans](/pricing).

## 3. Three promises you can read in full (home.json: why)

**H2:** Three promises you can read in full

- **30-day money-back guarantee.** If it is not right for you, ask for your money back. The terms are in writing. [Read the refund policy](/refund-policy) (F9)
- **We move your site for free.** Free migration is included on every hosting package. [Read the migration terms](/migration-terms) (F11)
- **The same price at renewal.** Your hosting price does not change when you renew. [Read how renewals work](/pricing-policy) (F12)

Editor note: each reason shows only while its claim renders. All three render today.

## 3b. What DronaHost does not do (home.json: limits)

Added 2026-10-09 (blueprint section `HonestLimits`, trust rule TR4; the reply-time item is a recorded decision and counts as first-hand, TR7). Placed after the three promises and before the free-move form.

**Eyebrow:** Honest limits. **H2:** What DronaHost does not do. **Lead:** Knowing this before you buy saves you a support ticket later.

- **We do not host email.** Your hosting and your email stay separate, so you keep or choose an email service from another provider. (F8)
- **Support is by ticket and email only.** The support policy explains how to reach the team and what to include in a request. [Read the support policy](/support-policy) (F14)
- **We do not promise a reply time.** We reply by email to every ticket. We will publish a reply time only after we have measured it. (decision 36; marked "Our decision")
- **VPS and cloud hosting have no published plans yet.** Ask the team by ticket or email before you buy, and we will say what we can offer today. (F7)
- **The free move covers one website per hosting package.** The migration terms say exactly what is covered. [Read the migration terms](/migration-terms) (F11; shows only while `free-migration` renders)

Editor note: no forbidden channel is named, even to deny it (rule PO1). The owner's own "what we do not do" answers (interview Q6) would extend this list; nothing was added from memory.

## 4. Move your site to us for free (home.json: move-my-site)

**H2:** Move your site to us for free

Tell us where your site lives now. We reply by email with the next steps.

Fields: your website address, who hosts your site now, your email, anything we should know (optional). A privacy line sits under the form.

Editor note: hidden until `free-migration` renders and a destination is configured (`supportEmail` in `content/company.ts` or a route in `lib/leads/config.ts`, decision 38).

## 5. Evidence and reviews (home.json: evidence, reviews)

Editor note: one approved case study with real numbers, and real reviews with name, role, company and a link. Neither exists yet, so both sections are hidden. Never written by AI.

## 6. Help when you need it, and the terms behind our promises (home.json: help)

**H2:** Help when you need it, and the terms behind our promises

Reach the team: support ticket and email. Our policies, in plain language: [support policy](/support-policy), [backup policy](/backup-policy), [refund policy](/refund-policy).

## 7. Questions before you choose (home.json: faq)

**H2:** Questions before you choose

**What is managed WordPress hosting?**
Managed WordPress hosting means the host looks after the server your site runs on, so you can focus on your content and your customers. DronaHost offers it on its WordPress hosting plans. If you want to know what is included before you buy, ask the team by support ticket or email.

**Do I need technical skills to use DronaHost?**
No. You manage your site in WordPress as usual, and we handle the technical side. If you get stuck, you can open a support ticket or write to the team by email, and the team will help with the next step. You do not need to know how servers work to run your site here.

**Does DronaHost host email?**
No. Email is not hosted on DronaHost servers, and Business Hosting does not include email. Your hosting and your email are separate, so you will need an email service from another provider. If you are unsure which option fits, write to the team before you buy.

**Can I move my existing WordPress site to DronaHost?**
Yes, you can move your existing WordPress site to DronaHost. Moving is free on every hosting package, and each package includes the move of one website. The migration terms page explains what is covered. To start, open the free migration page and send your current host details.

**How much does WordPress hosting cost at DronaHost?**
Filled from `data/pricing.json`. Hidden until prices are confirmed.

**Will the price go up when my plan renews?**
No. The hosting price does not change on renewal, because the renewal price equals the signup price. Each plan shows its renewal price next to its signup price. The pricing policy has the full terms. Prices exclude tax. Customers in India pay GST at checkout.

**What if I am not happy with my plan?**
DronaHost offers a 30-day money-back guarantee. The refund policy sets out the exact terms, so please read it before you buy. If you have a question about the guarantee, contact the team by support ticket or email, and the team will explain how it applies to your plan.

**How do I reach support?**
You can reach the team by support ticket or email. Tickets and email are the only support channels we offer. The support policy explains how support works and what to include in your request, so read it before you write. Open a ticket from the contact page, or write to the team by email.

## 7b. About this page (home.json: provenance)

Added 2026-10-09 (blueprint section `PageProvenance`, trust rule TR6). A half-height band before the closing action.

Reviewed by **Sandipan Das** (owner) on 8 October 2026. Every promise on this page links to the policy that states its terms, and every price comes from one published price list. [Report an error on this page](/contact)

Editor note: the date is the owner's last full read. It moves only when the owner rechecks the whole page; `check-content` fails if the visible date and `rules.reviewedOn` differ. The link "How we write and check our pages" (to `/editorial-policy`) appears once that page is published.

## 8. Closing action (home.json: cta)

**H2:** Ready to see which plan fits?

**Primary action:** [See WordPress hosting plans](/wordpress-hosting). **Secondary action:** Move my site free (same gate as the hero).

## Later (facts not supplied; left out of this version)

- Who is behind DronaHost: team names and roles.
- Legal entity name, registration number and registered address.
- Founding year or years in business.
- Public support email address.
- One original element (a real screenshot, a provable number or a named customer story).
- A "Who is behind DronaHost" section (needs interview Q1, Q2 and Q5). The "What we do not do" section now exists (3b); the owner's Q6 answers would extend it.
- Server, update and security tasks; the migration steps; website design path.
- The editorial policy page (`/editorial-policy`), so the provenance band can link to it.
