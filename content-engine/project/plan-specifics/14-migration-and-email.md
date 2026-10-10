# Project specifics for Plan 14: Migration and Email

Generic plan: [../../plans/14-migration-and-email.md](../../plans/14-migration-and-email.md). Placeholders in the plan map to the text below. The original wording is kept.

## Pages

| Page | URL | Status | Primary keyword (seed, unvalidated) | Tier |
|---|---|---|---|---|
| Setup guide | `/kb/point-your-domain-to-google-workspace` | planned | how to set up business email for my domain | guide |

## Facts needed from the owner

| Question | Answer |
|---|---|
| Which premium email provider is offered through WHMCS, at what price, and who gives support for it? | |

## `/migration` page template (block 1)

"Move your WordPress site to DronaHost". The word "free" appears only while `free-migration` renders. Fallback: "Moving your WordPress site to DronaHost"

## `/email` page template

> **Changed 2026-10-10 (decisions 49, 54 and 56):** DronaHost sells **Google Workspace** (Business Starter, Standard, Plus) as its business email service. The blocks below are superseded where they say email is not offered. For `/email`:
>
> - Plans, prices and storage come only from `emailPlans` in `data/pricing.json` (per user per month, renewal equals signup).
> - Name Google Workspace plainly, and show "Google Workspace is a trademark of Google LLC." on the page.
> - Never name the distributor, and never say "Google partner", "official" or "authorized reseller" (all forbidden in `rules.config.json`).
> - Say what DronaHost does (sets it up on your domain, adds the DNS records, bills it, answers tickets) only as far as the owner confirms in the interview. Features beyond email and storage are Google's: describe them only from Google's own pages, dated.
> - Hosting plans still do not include email; the two are bought separately.

- Block 2, direct answer: "Email is not hosted on DronaHost servers. You can use Google Workspace or another email service with your domain. We show you the DNS records to add."
- Block 3, your options: Two cards: Google Workspace, and premium email through DronaHost billing (once the owner names it). Each says who sells it, who gives support for it, and what DronaHost helps with. No price unless it comes from a data file
- Block 7, FAQ: "What happens to my old DronaHost mailboxes?"

Rules:
- Name Google Workspace only to say what it is and that it works with your domain. Do not imply a partnership, endorsement or discount. If the owner joins a partner or referral program, disclose it on the page.

## Notice to existing email customers

Send by email from WHMCS and show a banner in the client area.

| Part | Content |
|---|---|
| Subject | "Changes to email on your DronaHost plan" (plain, no alarm) |
| What is changing | One sentence: DronaHost will stop hosting email on [date]. Website hosting is not affected |
| Where to ask | Support ticket or email. No chat, WhatsApp or phone |

## Pre-ship checklist

- [ ] No mention of mailboxes, chat, WhatsApp or phone as part of any plan

## Moved from the core plan, 2026-10-10

### Pages

| Page | URL | Status | Primary keyword (seed, unvalidated) | Tier |
|---|---|---|---|---|
| Migration service | `/migration` | exists as a request form | free wordpress migration | money page |
| Migration terms | `/migration-terms` | planned | none (terms page) | A |
| Email: what to use | `/email` | planned | business email for your domain | informational and service |
| Setup guide | `/kb/send-wordpress-email-with-smtp` | planned (Plan 03 and 04 own the keyword) | how to send wordpress email with smtp | guide |
| Setup guide | `/kb/point-your-domain-to-[email-service]` | planned | how to set up business email for my domain | guide |

### Facts and wording

- "Does the old site stay live until the customer switches?" The home page copy says yes.
- Email is never bundled with hosting (decision 49). Do not write "free email" or "email included" on any hosting page.
- Target email keywords ("business email", "email hosting") only once email plans are live in `data/pricing.json`.
- Claim ID: `free-migration`. Analytics event: `migration_request`.
- Internal links: `/email` links to `/business-hosting`, `/wordpress-hosting`, the SMTP guide, `/support-policy`, `/contact`.
