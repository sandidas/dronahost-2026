# Brand file: DronaHost

This file holds the business-specific text that the reusable rules point to. The rule files in `rules/` use the placeholders [Brand], [Product], [Plan], [Competitor], [Country], [Provider], [Billing system], [Channel], [Price] and [Region]. This file says what they mean for this project. Wording is moved from the old rule files without change. Machine-readable lists are in `project/rules.config.json`.

## From rules, Audience and reading level: currency

- Default currency is USD. Offer GBP, EUR, AED and INR through a selector or locale. Never show a currency without its symbol and billing period.
- Locale variants: `en-GB` only when that locale exists.

## From rules, Claims discipline: claim status

Status on 2026-10-06 (owner-confirmed the same day). **None of these renders today**, because no terms page is published:

| Verified claim | `termsPage` | Gap |
|---|---|---|
| `money-back` (30-day money-back guarantee) | `/refund-policy` | Page exists and states the 30-day policy, but it is an unreviewed draft (legal review pending) |
| `support-24-7` (24/7 support) | `/support-policy` (planned) | Page not written. The owner must first define what 24/7 means with ticket and email only |
| `free-migration` (free migration) | `/migration-terms` (planned) | `/migration` is a request form; no page publishes what "free" covers |
| `renewal-price-same` (renewal equals signup price) | `/pricing-policy` (planned) | No page states it, and the owner must define how long the promise lasts |

Still unverified (never rendered): `uptime-sla` (`/sla` exists and is the intended terms page), `ttfb`, `first-reply`,
`founded`, `free-ssl`, `cloudflare-cdn`. Customer counts have no entry yet. They stay hidden until evidence is on file.

## From rules section 1: The character

### The DronaHost character

**Confident, specific, calm.** We know what we are doing and we do not need to shout about it.

| Attribute | What it means in practice |
|---|---|
| **Confident** | State verified facts, not hopes. "[EXAMPLE, NOT VERIFIED: 99.95% uptime SLA with automatic service credits]" — not "we try our best." |
| **Specific** | Numbers, locations, benchmarks. Never a vague adjective where a metric can stand. |
| **Calm** | No urgency that isn't real. No exclamation marks in marketing copy. No countdown timers without a genuine deadline. |
| **Honest** | State where the company is based and who runs it. Do not imply a location you do not have. Do not pretend to be bigger than we are. Being a focused team is a feature. |
| **Technical, second** | Lead with the outcome in plain words, then give the technical term in the same sentence or a short "How it works" line (LiteSpeed, NVMe, TTFB, cPanel). The reader is a business owner, not a sysadmin. |

### Reference points (read their copy)

**Write like:** Fathom Analytics, Kinsta, Cloudways, Basecamp, Bunny.net
**Never write like:** Hostinger, GoDaddy, or any reseller site built on hype and pressure

### The spectrum

```
TOO FORMAL ←————————————————→ TOO CASUAL
  "We are pleased to inform you   "OMG your site is live!! 🚀🎉"
   that your hosting account has
   been provisioned successfully."

                    ▼ DronaHost sits here
           "Your hosting is ready. Here's how to log in."
```

## From rules section 2: Terminology

### Brand name

| Context | Correct usage |
|---|---|
| Logo / wordmark | `dronahost` (all lowercase — deliberate design choice) |
| Prose, headings, page titles | `DronaHost` |
| Domain / URL | `dronahost.com` |
| Never use | `Drona Host`, `DRONAHOST`, `Dronahost` |

### Product and service names

| Preferred term | Do not use |
|---|---|
| WordPress Hosting | Shared Hosting (when specifically selling WordPress plans) |
| Managed WordPress Hosting | cPanel WordPress, PHP hosting |
| VPS Hosting | Virtual Private Server (spell out only on first mention if needed) |
| Cloud Hosting | Cloud Server (unless specifically a cloud server product) |
| Business Hosting | Business Email Hosting, Email + Hosting Bundle |
| Domain Registration | Domain Purchase, Domain Buying |
| Website Design | Web Design in headings and body (the URL `/web-design` and the keyword may still use "web design"), Website Development (unless specifically code-only work) |
| Custom Development | Software Development (too broad), App Development (unless it is an app) |
| SEO Services | Search Engine Marketing (SEM is paid ads), Digital Marketing (too broad) |
| Knowledge Base | FAQ (FAQ is a section, KB is the full library), Help Center is acceptable |

### Third-party names

| Term | Usage |
|---|---|
| Cloudflare | Always capitalised. One word. |

### Channels not offered

**Not offered (owner, 2026-10-07):** live chat, WhatsApp and phone support. Never mention them in copy, metadata, schema, UI text or `pricing.json`. Support channels are **ticket and email**. Email hosting is also discontinued: write "email support" for contacting us, and send mailbox questions to `/email`.

### Regions and locations: infrastructure naming

Naming guidance only. DronaHost owns no data centres and runs hosting on rented servers, so never state a server location unless the infrastructure registry confirms it for that plan (see `docs/content-planner/plans/05-regional-and-location.md`). Write "for UK businesses", not "UK servers".

## From rules section 7: Target keyword strategy

**Target (high commercial intent, winnable):**
- "siteground alternative"
- "wordpress hosting uk"
- "managed wordpress hosting usa"
- "hosting for eu businesses" (not "gdpr compliant hosting": that phrase claims compliance, which needs the legal review first)
- "uae web hosting"
- "next.js hosting alternative to vercel"
- "web design agency small business uk"
- "affordable website redesign services"

**Do not target (too competitive or wrong intent):**
- "best web hosting" — Hostinger and Bluehost own this with annual SEO budgets we cannot match
- "web hosting" — same reason
- "cheap hosting india" — price-only intent that does not convert (India is not excluded as an audience)
- "free web hosting" — wrong intent; does not convert

## From rules section 7: FAQ questions

Good FAQ questions:
- "How much does WordPress hosting cost at DronaHost?"
- "Does DronaHost offer a money-back guarantee?"
- "Where is my site hosted?" (use the standard answer in `plans/05-regional-and-location.md`)
- "Can I migrate my existing WordPress site to DronaHost for free?"
- "Does DronaHost sign a data processing agreement?" (only after `/data-processing` is published and reviewed by a qualified person)

Bad FAQ questions:
- "What makes DronaHost amazing?" (not what buyers ask)
- "How do I get started?" (too vague)

## From rules section 11: Maintenance status

**Status (7 October 2026):** the owner confirms DronaHost offers website maintenance (website maintenance, website management, WooCommerce and WordPress maintenance, support and helpdesk). Its scope, price and response times are **not yet defined** in `data/pricing.json` or `content/claims.ts`. Until the owner fills the service definition sheet in `docs/content-planner/plans/06-service-pages.md`, pages may be planned and drafted, but they **must not state inclusions, times, hours or prices**. Managed-hosting tasks (updates, backups, security) may be described only as far as their feature claims render.

## From voice.md: Examples by page type, reason-led headlines and maintenance wording

## Examples by page type

### Money page (Plan 01)

- H1: "Managed WordPress hosting for small business sites"
- Hero line: "We run the server, the backups and the security updates, so you can work on your site."
- Direct answer: "Managed WordPress hosting means the host looks after the server your site runs on, including updates, backups and security. You focus on your content and customers. DronaHost offers it on every WordPress plan."
- Price line (price from `pricing.json`): "From `[price]`/month. Renews at `[renewal price]`/month."
- Guarantee line (only when `money-back` renders): "30-day money-back guarantee. Read the refund policy."
- CTA: "Choose `[Plan]`" (the price sits above the button)

### Commercial page (Plan 02)

- Verdict: "DronaHost suits small teams that want one price and direct support. `[Competitor]` suits large stores that need `[specific feature]`."
- Honest point: "`[Competitor]` has a lower entry price. Its renewal price is higher, so compare the second year, not only the first."
- Source line: "Prices checked on `[date]` from `[Competitor]`'s public pricing page."
- Switch line: "Moving from `[Competitor]` takes four steps. We copy your site, you check it, you switch, and your old site stays live until you do."

### Informational page (Plan 03)

- Answer first: "TTFB is the time a server takes to send the first byte of a page. A lower number means visitors start seeing your page sooner. Google publishes a target for a good TTFB, so check the current figure on web.dev." `[HUMAN REVIEW: add citation]` (In page JSON the figure itself is blocked by the linter. Use a `claim:` reference or keep the number in a blog post that a person reviews.)
- Peer voice: "We see this on a lot of WordPress sites: the plugin list grows, and nobody checks what each one loads."
- First-hand detail slot: "On a `[site type]` we moved last year, switching off `[specific plugin]` cut the page weight from `[before]` to `[after]`." `[HUMAN REVIEW: add first-hand insight]`

### Problem page (Plan 04)

- Calm opening: "A white screen on WordPress usually means a plugin or a PHP memory limit. Check the error log first."
- Safe first: "Before you change anything, take a backup. In your dashboard, open Backups and choose Create backup."
- Honest hand-off: "If the log mentions your database, the fix needs a developer. You can send us the log and we will look at it."

### Regional page (Plan 05)

- Honest location: "DronaHost is a team based in India. We work with businesses in the UK from our time zone, and we share the hours when we are online."
- Rule sentence: "UK GDPR applies if you collect personal data from people in the UK, wherever your host is. You are the controller. We act as your processor and we sign a data processing agreement." `[HUMAN REVIEW: legal read]`
- Tax line: "Prices exclude tax. Customers in India pay GST at checkout."
- Currency line: "We show prices in pounds because you are in the UK. You can change the currency."

### Service page (Plan 06)

- Outcome: "We rebuild your site so it loads quickly on a phone and is easy for you to update."
- Boundary: "We cannot promise a rank in Google. We commit to the work in the plan and report the results every month."
- Fit: "This service suits teams with a site that already earns money. It does not suit a one-page brochure."

### Compliance page (Plan 07)

- Who does what: "You decide why personal data is collected, so you are the controller. We store and process it for you, so we are the processor."
- Limit: "A host cannot make a site compliant on its own. You also need a privacy policy, a cookie banner and a way to answer data requests."
- Disclaimer: "This is general information, not legal advice."

### Domain page (Plan 08)

- Price: "A `.co.uk` domain costs `[registration price]` for the first year and `[renewal price]` each year after. The price includes the ICANN fee." (prices from the data source)
- Eligibility: "Anyone can register a `.co.uk` domain. You do not need a UK address." `[HUMAN REVIEW: confirm against registry rules]`

### Navigational page (Plan 09)

- Entity line: "DronaHost is a web hosting and web design company based in India, working with clients worldwide." (single source in the company registry)
- Verify us: "You can check us in three places: our company registration, our profile on `[review site]` and our team on LinkedIn."

### FAQ answers (Plan 10)

- Question: "Does DronaHost move my WordPress site for free?"
- Answer: "Yes, we move your WordPress site to DronaHost at no extra cost. We copy the site, you check it on a private link, and you switch when you are ready. Your old site stays live until then." (render only while `free-migration` renders)

- Question: "Can you guarantee my site will rank first on Google?"
- Answer: "No. No agency can guarantee a ranking position. We commit to specific work, such as fixing technical issues and writing content, and we report the results every month."

### Email and support pages (Plans 14 and 07)

- Email: "Email is not hosted on DronaHost servers. You can use Google Workspace or another email service with your domain, and we show you the DNS records to add." `[HUMAN REVIEW: confirm the premium email provider and what we help with]`
- Support: "You can reach the team by support ticket or email." (No chat, WhatsApp or phone. Hours only from the published support policy.)
- Honest limit: "We cannot fix a mailbox hosted by another provider, but we can check that your DNS records point to it." `[HUMAN REVIEW]`

## Reason-led headlines (the "because" pattern)

Use on money, service, regional and landing pages, once per page. Each needs its reason to be a rendering claim, a `feature:` reference, `pricing.json` data or a sourced fact, and a fallback headline for when it is hidden. `[EXAMPLE, NOT VERIFIED]`.

| Do | Fallback while the claim is hidden | Do not |
|---|---|---|
| "Managed WordPress hosting, because we run the server for you" | "Managed WordPress hosting for small business sites" | "The best hosting because we are number one" |
| "Choose a VPS because you need root access and full control" | "VPS hosting with root access" | "Fast hosting because we use the latest technology" |
| "Move your site to us because your old host charges more at renewal" (needs a sourced competitor fact) | "Moving your WordPress site to DronaHost" | "Trusted by thousands because we are reliable" |
| "A smaller plan is enough because one site needs one plan" | "Plans for one site or many" | "Because we care about you" |

Say why it is right for the reader or why it matters. Never say "best".

## Maintenance (write only what the service sheet confirms)

Write the detail, not the feeling. `[EXAMPLE, NOT VERIFIED]`.

- Do: "We update your plugins and test them first. If an update breaks your site, we restore the last working copy and tell you what happened."
- Do not: "Enjoy peace of mind with our maintenance plan."
- Do: "You still choose your content and your plugins. We handle the updates."
- Do not: "We guarantee you will never be hacked."
