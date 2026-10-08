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
