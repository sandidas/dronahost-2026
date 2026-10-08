# DronaHost Voice: Sentence Examples

Read this before writing any page. The full rules are in [docs/content-planner/rules/content-writing-rules.md](content-writing-rules.md). This file shows the rules as sentences you can copy the shape of.

> **Every number, price, location, guarantee and date in an example is `[EXAMPLE, NOT VERIFIED]`.** Do not copy a value into live copy. Real values come from `content/claims.ts` (verified and rendering), `data/pricing.json` and `content/company.ts`. In live copy, a missing fact means the sentence is not written, never guessed.

## The voice in one line

Confident, specific, calm. Plain international English, grade 8 to 10, written for a smart reader who may not read English as a first language.

## Ten sentence rules

| # | Rule | Do | Do not |
|---|---|---|---|
| 1 | Outcome first, technical term second | "Your site stays online while we update it (LiteSpeed server, NVMe storage)." | "Our LiteSpeed-powered NVMe infrastructure ensures high availability." |
| 2 | One idea per sentence, under 20 words on average, never over 28 | "We copy your site. You check it on a private link. You switch when you are ready." | "We copy your site and, once you have checked it on a private link, which we provide, you can switch." |
| 3 | Active voice, a named subject | "DronaHost runs the servers and handles backups." | "Backups are handled and servers are managed." |
| 4 | Specific over vague | "Backups run every day and you can restore from the dashboard." | "Reliable backups give you peace of mind." |
| 5 | Plain verbs | "use", "start", "help", "show" | "utilize", "commence", "facilitate", "leverage" |
| 6 | No idioms or slang | "We reply to every ticket." | "We go the extra mile." |
| 7 | Honest about limits | "We cannot guarantee a ranking position." | "Top rankings, guaranteed." |
| 8 | Calm, no pressure | "The 30-day guarantee applies to new plans." (only when verified) | "Hurry! Offer ends tonight!" |
| 9 | Name the subject, avoid vague pronouns in answers | "Managed WordPress hosting means the host runs the server, updates and backups for you." | "It means they handle it for you." |
| 10 | No exclamation marks in marketing copy | "Your hosting is ready. Here is how to log in." | "Your hosting is ready!!" |

## Word swaps (translates better for second-language readers)

| Avoid | Use |
|---|---|
| utilize, leverage | use |
| commence, initiate | start |
| facilitate | help, let |
| in order to | to |
| a plethora of | many (or a count, if verified) |
| ensure | make sure |
| robust, seamless, cutting-edge | say what it does |
| reach out | contact, write to |
| touch base | talk |
| ballpark | rough estimate |
| circle back | return to |
| hit the ground running | start quickly |
| Kindly, do the needful, revert back | Please, say what to do, reply |

Write dates in full ("6 October 2026") and times with a timezone ("9:00 AM ET", "14:00 UTC").

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

## Human-first notes

- "We" means something we did. Do: "We moved 12 sites last quarter and found this fails when the old host blocks the database export." (`[EXAMPLE, NOT VERIFIED]`; real numbers only.) Do not: "We have years of experience helping businesses."
- Disclosure line on an AI-assisted guide: "Drafted with AI assistance, then edited, fact-checked and approved by [name]."
- Byline: "Written by [name]. Reviewed by [name] on [date]."

## UI and system copy

| Context | Do | Do not |
|---|---|---|
| Error, validation | "Enter a valid email address, for example name@company.com." | "Invalid input!" |
| Error, payment | "Your card was declined. Check the details or try another card." | "Payment failed. Do not worry." |
| Empty state | "No sites yet. Add your first site to see it here." | "Nothing here." |
| Success | "Your hosting is ready. Here is how to log in." | "Woohoo! You did it!" |
| Notification | "Your backup finished at 14:00 UTC. No action needed." | "Great news!" |

## Phrases that never appear

Blazing fast, world-class, cutting-edge, state-of-the-art, next-generation, revolutionary, game-changing, supercharge, unlock the power, all-in-one solution, seamless, robust, scalable (without limits), best-in-class, unlimited (unless the data says so), "Don't worry", "Kindly", "revert back", "do the needful", "prepone". `npm run lint:content` blocks the main ones.

## Quick self-check before you hand a draft over

1. Read the first sentence under each heading. Does it answer that heading?
2. Is there a number, price or guarantee? Where does it come from? If nowhere, remove it.
3. Could a second-language reader follow every sentence without a dictionary?
4. Is any sentence over 28 words? Split it.
5. Is there a sentence that would sound true of any host? Replace it with a specific one, or delete it.
