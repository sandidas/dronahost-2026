# Plan 14: Migration and Email

**Intent:** two different worries. "Can you move my site without breaking it?" and "Hosting does not include email, so what do I use?"
**Goal:** remove both doubts, and turn the email change into a clear, kind explanation instead of a surprise.
**Owns:** `/migration`, `/migration-terms`, `/email`, the notice to existing email customers.

Project specifics for this plan: [plan-specifics/14-migration-and-email.md](../project/plan-specifics/14-migration-and-email.md)
Numbers 11 to 13 are used in `later/`, so this plan is 14.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages for guides; stages 0 to 3 and 5 to 7 for service pages. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Solve and Buy.
- **Interview:** The **Migration or email** bank in [interview-questions.md](../rules/interview-questions.md).
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ and HowTo markup give no Google rich result ([sources.md](../rules/sources.md), item 5). Use them only when they match the visible content and help the reader.

## Pages

| Page | URL | Status | Primary keyword (seed, unvalidated) | Tier |
|---|---|---|---|---|
| Migration service | `/migration` | exists as a request form | free wordpress migration | money page |
| Migration terms | `/migration-terms` | planned | none (terms page) | A |
| Email: what to use | `/email` | planned | business email for your domain | informational and service |
| Setup guide | `/kb/send-wordpress-email-with-smtp` | planned (Plan 03 and 04 own the keyword) | how to send wordpress email with smtp | guide |
| Setup guide | `/kb/point-your-domain-to-[email-service]` | planned | how to set up business email for my domain | guide |

Support pillar for moving a site (Plan 03, "Moving a site") links to `/migration`. Plan 04 "Migration pain" fixes link here too.

## Facts needed from the owner (nothing is guessed)

| Question | Answer |
|---|---|
| Which platforms do we migrate (WordPress only, other CMS, cPanel accounts)? | |
| How many sites per plan are covered by "free"? | |
| What is excluded (very large sites, custom server setups, mail, databases outside WordPress)? | |
| What does the customer give us (hosting login, backup file, DNS access)? | |
| Does the old site stay live until the customer switches? (The home page copy says yes.) | |
| Any timing we can honestly state? (No time without a measured basis.) | |
| Which premium email provider is offered through [Billing system], at what price, and who gives support for it? | |
| Do we help with DNS records for email (MX, SPF, DKIM, DMARC)? On which plans? | |
| Will we say why email is no longer hosted? (Only if the owner chooses to.) | |
| End date for email on our servers, and the notice period the terms require | |

## `/migration` page template

| # | Block | Rule |
|---|---|---|
| 1 | H1 and one-sentence promise | "Move your [Product] site to [Brand]". The word "free" appears only while `free-migration` renders. Fallback: "Moving your [Product] site to [Brand]" |
| 2 | Direct answer | 40 to 80 words: what we move, what you do, what stays live |
| 3 | Steps | `ProcessTimeline`: tell us where your site is, we copy it, you check it on a private link, you switch when ready. No invented timings |
| 4 | What we need from you | Plain list from the owner's answers |
| 5 | What is covered and what is not | From `/migration-terms`. Honest about exclusions |
| 6 | If something goes wrong | What we do, in the owner's words. No guarantee of "zero downtime" unless verified |
| 7 | Proof | Real before and after story with permission, or omit the block |
| 8 | FAQ | 5 to 6 questions: "Will my site go down?", "Do I lose my emails?", "What if I use a page builder?" |
| 9 | CTA | One: "Request your migration" (the form). Secondary link to `/contact` |

The form asks only what the team needs (site address, current host, platform, contact email). Add a plain error and success state per the content rules (sections 5 and 6).

## `/migration-terms` (Tier A)

Short and exact. Follows the brief in Plan 07. The `free-migration` claim renders only when this page is published and approved by the owner.

## `/email` page template

| # | Block | Rule |
|---|---|---|
| 1 | H1 | "Business email for your domain" |
| 2 | Direct answer (40 to 80 words) | "Email is not hosted on [Brand] servers. You can use [Email service] or another email service with your domain. We show you the DNS records to add." |
| 3 | Your options | Two cards: [Email service], and premium email through [Brand] billing (once the owner names it). Each says who sells it, who gives support for it, and what [Brand] helps with. No price unless it comes from a data file |
| 4 | How to connect it | Steps: choose a service, add the MX record, add SPF and DKIM, add DMARC, check. Link to the setup guide |
| 5 | WordPress contact forms and shop emails | One honest paragraph: your site needs a sending service (SMTP) so mail from forms and orders is delivered. Link to the SMTP guide |
| 6 | What stays the same | Your website and domain are not affected |
| 7 | FAQ | "Do hosting plans include email?" (No.) "Can I keep my current email?" "Who do I contact about a mailbox problem?" "What happens to my old [Brand] mailboxes?" |
| 8 | CTA | One: "See the setup steps" |

Rules:
- Name [Email service] only to say what it is and that it works with your domain. Do not imply a partnership, endorsement or discount. If the owner joins a partner or referral program, disclose it on the page.
- No claims about a third party's price, uptime or features. Link to their own page with a retrieval date if you must mention one.
- Do not write "free email", "email included" or "business email hosting". Email hosting is discontinued.
- Mailbox support: say who answers (the provider), and what we can check (DNS records). Do not promise to fix another provider's service.
- `[HUMAN REVIEW]` on anything about the premium email provider until the owner names it.

## Notice to existing email customers (draft structure)

Send by email from [Billing system] and show a banner in the client area. The owner sets the dates and checks the terms for the notice period they require. A longer notice is kinder: plan at least as long as the terms need, and allow time for people to move.

| Part | Content |
|---|---|
| Subject | "Changes to email on your [Brand] plan" (plain, no alarm) |
| What is changing | One sentence: [Brand] will stop hosting email on [date]. Website hosting is not affected |
| What you need to do | Choose an email service, move your mailboxes before the date, update your DNS records |
| How to do it | Link to `/email` and the setup guide |
| How we help | Only what the owner confirms (for example a checklist, or a ticket for DNS questions) |
| Important dates | End date, last day mail is delivered to the old mailboxes, when old mail is deleted (from `/data-retention`) |
| Where to ask | [Channel] only. No channel the business does not staff (see project specifics) |
| Tone | Calm, specific, no blame, no "unfortunately we regret" |

Send a reminder before the date, and a final notice the day before. Keep a record of who was told and when.

## Keyword notes

Target: "free wordpress migration" (only while the claim renders), "business email for your domain", SMTP setup, DNS records for email.
Do not target: "business email hosting", "email hosting" (we do not offer it), "free email hosting".

## Schema

`WebPage` and `BreadcrumbList` on both pages. `HowTo` only for the setup guides, and only if it matches the visible steps. `FAQPage` matching the visible FAQ. No `Product` or `Offer` for email.

## Internal links (minimum)

`/migration`: the matching product page, `/migration-terms`, `/pricing`, `/contact`, one moving-a-site guide.
`/email`: `/business-hosting`, `/wordpress-hosting`, the SMTP guide, `/support-policy`, `/contact`.

## Pre-ship checklist

- [ ] Every migration fact comes from the owner's answers or a rendering claim
- [ ] "Free" appears only while `free-migration` renders
- [ ] `/migration-terms` is published and approved before the claim shows
- [ ] No mention of mailboxes or any unstaffed support channel as part of any plan
- [ ] Premium email provider named by the owner, or the card is hidden
- [ ] Email notice has dates, steps and a support route, and a record of sending
- [ ] 3 or more internal links, reading grade inside the target, checks pass

## Measure

Migration: `migration_request` submissions, completion rate, tickets about migration (should fall). Email: tickets about mailboxes (should fall), clicks to the setup guide, position for the keyword.
