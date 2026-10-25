# Content Writing Rules

> Covers every word on the site: marketing copy, UI labels, error messages, empty states, blog posts, and meta content.
> For visual design tokens and component patterns, see the project's UI rules. For logo and wordmark usage, see the project's brand identity file.
> Project terms (brand spelling, product names, support channels, locations): see `project/brand.md`.
> Machine-readable voice (readability limits, spelling, word swaps, banned phrases, banned CTA labels): `project/voice.json`; print it with `npm run content:voice`.
> Other machine-readable lists (feature words, forbidden channels, forbidden claims, location claims): `project/rules.config.json`. Limits: the config.

> **Examples in this file are not facts.** Every number, price, SLA, location, certification and date shown in an
> example is marked `[EXAMPLE, NOT VERIFIED]` or is a placeholder. Never copy one into live copy. Real values
> come only from the verified claims registry and the pricing file named in `project/PROJECT.md`.

---

## Table of Contents

1. [Tone of Voice & Brand Voice](#1-tone-of-voice--brand-voice)
2. [Terminology List](#2-terminology-list)
3. [Heading Hierarchy Rules](#3-heading-hierarchy-rules)
4. [CTA Copy Patterns](#4-cta-copy-patterns)
5. [Error Message Guide](#5-error-message-guide)
6. [Empty State Copy Patterns](#6-empty-state-copy-patterns)
7. [SEO Content Rules](#7-seo-content-rules)
8. [Human-First Writing and AI Use](#8-human-first-writing-and-ai-use)
9. [Interactive Landing Pages](#9-interactive-landing-pages)
10. [Comparison Tables](#10-comparison-tables)
11. [Maintenance Pitch](#11-maintenance-pitch)
12. [Reason-Led Headlines](#12-reason-led-headlines-because)
13. [UI Microcopy](#13-ui-microcopy)

---

## Audience and reading level

**Audience:** set in `project/PROJECT.md`. Write for smart readers who may not be technical, who may read English as a
second language, who compare providers carefully and who distrust hype.

| Check | Rule |
|---|---|
| Reading grade | The target and limits are `readability` in `project/voice.json` (defaults: target 8 to 10, warn above 10, fail above 11). A per-page override is allowed only when the owner approves it and a reason is written down |
| Sentence length | `readability.averageSentenceMax` and `readability.sentenceMax` in `project/voice.json` (defaults: average under 20 words, no sentence over 28) |
| FAQ answers | 40 to 80 words. Warn under 40, fail over 80 |
| Title | Measured with the brand suffix. Warn above 60 characters, fail above 70. The suffix text comes from the config (`limits.titleSuffix`), not from this file |
| Meta description | Warn above 160 characters. Fail only if missing or duplicate |
| Exclamation marks | None in marketing copy |

- No idioms or slang that does not translate ("hit the ground running", "ballpark").
- Lead with the business outcome in plain words. Put the technical term second, in the same sentence or in a short
  "How it works" line. Example: "Your site stays online while we update it (LiteSpeed server, NVMe storage)."
- Write dates unambiguously ("6 October 2026"). Show units with their symbol. Show the currency symbol and the
  billing period on every price.
- US English by default. Regional variants only when that locale exists.
- Default currency and the currency selector: see `project/brand.md`. Never show a currency without its symbol and billing period.

## Writing quality standards

Every page meets all seven. The checks catch what a machine can see; a person proofreads the rest before APPROVAL 2.

| Standard | What it means here | How it is checked |
|---|---|---|
| Semantically optimized | Cover the topic, not only the keyword. Name the entities and terms the top results share (brief section 3, "recurring entities and terms"), answer the questions people ask next (brief "Next questions"), and use natural variants of the keyword. Never repeat the exact keyword to hit a count | Brief review; K2, K3, IN5 |
| Skimmable | The answer sits under the H1. A heading every 300 words or fewer, written as the question it answers. Paragraphs of 80 words or fewer, one idea each. A series of three or more items becomes a list or a table. Bold only the key fact in a block, never a whole sentence | S3, S6 (`paragraphWordsMax`, `wordsPerHeadingMax`) |
| Better than the top results | The page covers what the top results all cover, then adds one thing they miss (information gain). Never claim we are better without a fact behind it | Brief "Information gain"; E3, OV2 ([information-gain.md](information-gain.md)) |
| Easy to read | Grade 8 to 10, short sentences, plain words, outcome first and the technical term second | V3, V4, V7, V11 |
| Written in the native language | Written by a fluent writer in the page's own locale and spelling, never machine-translated. A localized page is rewritten, not translated word for word, and a native speaker reviews it before it goes live | V10; owner review |
| No grammar or punctuation mistakes | A person proofreads every page before APPROVAL 2. The checker fails repeated words, double spaces, a space before punctuation, a missing space after a comma, unbalanced parentheses, doubled punctuation and Markdown paragraphs with no end punctuation | V13, plus a human proofread |
| Active voice | Name who does the action: "We back up your site every day", not "Your site is backed up every day". Passive voice only when the actor is unknown or does not matter | V12 warns when more than 10% of sentences are passive (`passiveWarnAbovePercent`) |

## Claims discipline

Copy never contains a number, guarantee, SLA, location or certification that is not rendered from the claims registry
with `status: "verified"`. Unverified claims render nothing. Prices come only from the pricing file; these rules must
never contain a real price.

**Terms-page rule:** a verified claim must link to the page where its terms are published (refund policy, terms, SLA).
A claim **renders only when `status` is `"verified"` AND its `termsPage` is a published, reviewed route**
(`termsPageStatus: "published"`; the derived `verified` flag means exactly this). Each claim carries a
`termsPage` path and a `termsPageStatus`. Helper functions list what blocks each claim and say why one is hidden.
Measured numbers (`kind: "stat"`) render in a stats bar; policy and feature claims (`kind: "assurance"`) render in a
static assurance strip with a link to their terms page.

**What "reviewed" means:** Tier A pages (commercial promises) are approved by the owner. Tier B pages (legal documents) need a
qualified human reviewer. See `plans/07-compliance-and-trust.md`, "Policy tiers".

**Publishing a claim:** when its terms page is published and reviewed, flipping `termsPageStatus` to `"published"` in the
claims registry is the only change needed to show it (set `termsPage` too if it was null). Every place that renders the
claim reads the same gate.

Current claim status and gaps: see `project/brand.md`, "From rules, Claims discipline".

---

## 1. Tone of Voice & Brand Voice

### The character

**Confident, specific, calm.** Attributes: confident, specific, calm, honest, technical second. The full table and the
spectrum diagram are in `project/brand.md`, "From rules section 1: The character".

### Reference points

Named writers to read and to avoid: see `project/brand.md`.

### Phrases to avoid

These phrases cost clarity and credibility with readers worldwide, including readers who use English as a second
language. Do not use them. The full list is `bannedPhrases` in `project/voice.json`, the single source. The linter
reads that list. A few examples:

| Prohibited | Replace with |
|---|---|
| "Don't worry!" | Remove, just say what to do |
| "Kindly..." | "Please..." |
| "World-class", "Cutting-edge" | Name the specific thing that makes it good |
| "Blazing fast" | Cite TTFB, LCP, or benchmark numbers |
| "Supercharge your..." | State the actual improvement |
| "All-in-one solution" | List what is included |
| An uptime figure with no SLA behind it | A figure from the claims registry with its SLA terms, only when verified |
| Exclamation marks | None in marketing copy |

### Replace adjectives with specifics

All right-hand examples are `[EXAMPLE, NOT VERIFIED]`. Render real values from the claims registry and the pricing file only.

| Do not write | Write instead |
|---|---|
| "Blazing fast servers" | "[EXAMPLE, NOT VERIFIED: LiteSpeed + NVMe storage. Average TTFB: 200ms from London, Frankfurt, and New York.]" |
| "World-class support" | "[EXAMPLE, NOT VERIFIED: Average first response: 18 minutes, 24/7 across US, UK, and UAE business hours.]" |
| "Amazing uptime" | "[EXAMPLE, NOT VERIFIED: 99.95% uptime SLA with automatic service credits if we miss it.]" |
| "Affordable pricing" | "[EXAMPLE, NOT VERIFIED: [Plan] from [Price]/month.]" Add "Renews at the same price" only while the renewal claim is verified. |
| "Easy to use" | "[EXAMPLE, NOT VERIFIED: One-click WordPress install. Live in under 4 minutes.]" |
| "Secure hosting" | "[EXAMPLE, NOT VERIFIED: Daily backups, free SSL, DDoS protection via [Provider], malware scanning included.]" |

### Voice across contexts

| Context | Tone adjustment |
|---|---|
| Marketing / landing pages | Authoritative, outcome-first. Sell the result. |
| Pricing pages | Precise and transparent. No asterisks that hide the real cost. |
| Blog posts | Peer-to-peer. We are practitioners sharing what we know. |
| Documentation / KB | Direct and instructional. No personality, just clarity. |
| Error messages | Calm, non-blaming. Say what happened and what to do next. |
| Empty states | Helpful and encouraging. Clear next action. |
| System notifications (email, toast) | Brief, factual, one clear action. |
| Social media | Slightly warmer. Conversational but still no hype. |

### What to always include on marketing pages

Every product or service page must have:
- A specific outcome or benchmark (not just a feature)
- Real social proof (full name, company, role, verifiable)
- A single primary CTA (not three competing options)
- At least one trust signal (SLA, money-back, security badge, review score)

## 2. Terminology List

Use these terms exactly and consistently across all copy, UI, metadata, and blog posts.

### Brand name

[Brand] spelling for logo, prose and domain, and the forms never to use: see `project/brand.md`, "From rules section 2: Terminology".

### Product and service names

[Product] names, preferred and not-to-use forms: see `project/brand.md`, "From rules section 2: Terminology".

### Technical terms (use precisely)

| Term | Usage |
|---|---|
| LiteSpeed | Always capitalized. "LiteSpeed Web Server" on first mention if space allows. |
| NVMe | Always uppercase. "NVMe SSD storage" on first mention. |
| TTFB | Time to First Byte, spell out in blog posts on first mention. |
| LCP | Largest Contentful Paint, spell out in blog posts on first mention. |
| GDPR | Always uppercase. "GDPR-compliant" with hyphen when used as adjective. |
| SSL / TLS | Prefer "SSL certificate" for user-facing copy. TLS is more accurate but SSL is what buyers search for. |
| CDN | Content Delivery Network, spell out in non-technical contexts. |
| cPanel | Lowercase "c", uppercase "P". Never "Cpanel" or "cpanel". |
| WordPress | Always capitalized exactly this way. Never "Wordpress" or "wordpress". |
| WooCommerce | Always this casing. One word. |
| Let's Encrypt | Exactly this casing with apostrophe. |

Third-party names used in this project (for example the CDN provider) and their capitalization: see `project/brand.md`.

### Pricing and commitment terms

| Preferred | Do not use |
|---|---|
| /month | per month, monthly, /mo |
| /year | per year, annually, /yr |
| billed annually | annual billing, yearly plan |
| billed monthly | monthly billing |
| renewal price | renewal rate, ongoing price |
| money-back guarantee | refund policy (in CTAs, use "guarantee") |
| [N]-day money-back guarantee | "risk-free" without specifics |
| service credit | compensation, refund (for SLA breaches) |

### Support terms

| Preferred | Do not use |
|---|---|
| support ticket | help request, case |
| email support | mail us, drop us a line |
| average first response: [EXAMPLE, NOT VERIFIED: N minutes] (only after we measure it and publish the method) | fast response, quick support |
| 24/7 support (only after the owner defines what it means for the channels offered, and the support policy page is published) | round-the-clock (old-fashioned), always-on |
| dedicated support (only if a named person is assigned) | one-to-one support, personal support |

**Channels not offered:** the list is `forbiddenChannels` in `project/rules.config.json`; the owner's note is in
`project/brand.md`. Never mention a forbidden channel in copy, metadata, schema, UI text or the pricing file.

### Regions and locations

Naming guidance only. Never state a server location unless the infrastructure registry confirms it for that plan (see
`plans/05-regional-and-location.md`). Write "for [Country] businesses", never "[Country] servers". How this project
describes its own infrastructure: see `project/brand.md`.

| Preferred | Do not use |
|---|---|
| United States | America, USA (in prose, US is fine in tables) |
| United Kingdom | Britain (informal), UK (fine in tables and CTAs) |
| European Union | Europe (EU is 27 countries; Europe includes more) |
| United Arab Emirates | Dubai (one city, use UAE unless specifically Dubai) |
| Germany, Netherlands, France, Ireland | "Continental Europe" only in contexts where EU applies to all |

---

## 3. Heading Hierarchy Rules

### The rule

One `<h1>` per page. Every other heading follows a strict nesting order. Never skip levels.

```
<h1>  Page title — keyword-rich, one per page
  <h2>  Major section
    <h3>  Subsection within that section
      <h4>  Detail within subsection (use sparingly)
```

### H1 rules

- Exactly one `<h1>` per page
- Must contain the primary keyword
- 20 to 70 characters. The linter fails only on missing, duplicate or over-length values.
- States the outcome or topic — not the brand name
- Never the same as the `<title>` tag (different copy for each)

| Page | Example H1 `[EXAMPLE, NOT VERIFIED]` |
|---|---|
| WordPress Hosting | "Managed WordPress Hosting Built for Performance" |
| VPS Hosting | "VPS Hosting with Full Root Access and NVMe Storage" |
| WordPress Hosting for UK businesses | "WordPress Hosting for UK Businesses" (never "UK servers" unless the infrastructure registry confirms it for the plan) |
| Blog post | "How to Migrate WordPress to a New Host Without Downtime" |
| About | "A Small Team That Runs Your Hosting" |
| Contact | "Talk to the Team" (short is fine for utility pages) |

### H2 rules

- Introduce a new major section
- Should make sense read out of context (a user scanning headings should understand the page)
- Aim for 60 characters or fewer (guideline)
- Can contain secondary keywords naturally
- Written as noun phrases or questions — not fragments

Good H2 examples:
- "Why LiteSpeed Outperforms Apache for WordPress"
- "What Is Included in Every Plan"
- "How Our Staging Environment Works"
- "Frequently Asked Questions" (short, but acceptable for a standard FAQ section)

Bad H2 examples:
- "Features" (too vague — what features?)
- "More About Us" (leads with us, not the reader)
- "AMAZING PERFORMANCE" (all caps, adjective-led)

### H3 rules

- Subsections within an H2 section
- Often used for individual features, FAQ items, step-by-step items
- 20–50 characters (guide). H3s that are FAQ questions are exempt
- Parallel structure within a section (all questions, or all noun phrases — not mixed)

### Heading don'ts

- Do not use headings just to make text larger — use semantic markup, then style with CSS
- Do not keyword-stuff headings ("Best Cheap Affordable WordPress Hosting UK London")
- Do not use punctuation at the end of headings (no periods, no exclamation marks)
- Do not start multiple consecutive H2s with the same word

---

## 4. CTA Copy Patterns

### The core rule

Every CTA tells the user exactly what will happen next. No generic verbs.

| Do not write | Write instead |
|---|---|
| "Click here" | "See [product] plans" |
| "Learn more" | "See what's included" / "Read the full comparison" |
| "Get started" | "See [product] plans" (the price sits beside the button, never in the label) |
| "Submit" | "Send your message" |
| "Sign up" | "Create your account" |
| "Buy now" | "Choose your plan" |
| "Try it" | "Choose [plan name]", with "[N]-day money-back guarantee" as the support line beneath it (only while the money-back claim renders; a money-back guarantee is not a free trial, so never write "try free") |
| "Contact us" | "Talk to the team" / "Ask us anything" |
| "Download" | "Download the PDF" / "Download the case study" |

### Primary CTA

One primary CTA per page or section. It uses the filled/solid button style (brand action color).
It leads directly to the next conversion step.

| Page type | Primary CTA |
|---|---|
| Homepage hero | "See [product] plans" |
| Product page hero | "See [product] plans" |
| Plan card (any page) | "Choose [plan name]". The price, billing period, renewal price and tax line sit above the button, never inside the label. Until checkout is live, the button goes to `/contact` and reads "Talk to the team about [plan name]" |
| Contact page | "Send your message" |
| Blog post | "See our [product] plans" (contextual) |
| `/vs/[competitor]` | "Switch from [Competitor] — see our plans" |

### Secondary CTA

Supporting action. Uses ghost/outline button style. Reduces friction for buyers not ready to commit. The project's secondary label is in `project/brand.md`; the table shows the shape.

| Context | Secondary CTA |
|---|---|
| Hero sections | "See how it compares" / "Read the case study" |
| Hosting plan page | "Ask a question first" |
| Pricing page | "Talk to us before you buy" |

### Urgency — only when real

Fake urgency destroys trust with buyers everywhere. Only use urgency copy when:
- There is a genuine deadline (a sale ending on a specific date — name the date)
- There is a genuine scarcity (last X spots — only if this is literally true)

Acceptable:
> "[EXAMPLE, NOT VERIFIED: Offer ends 31 July 2026.]"

Never hide a higher renewal price behind an introductory price. **Every plan card shows the renewal price** ("Renews
at [Price]/month", from the renewal field in the pricing file). The promise wording ("same price, no increase") is
gated by claims: it renders only when the renewal claim renders and the pricing file agrees. The project's own renewal
rule: see the project's plan-specifics for this file.

Not acceptable:
> "Hurry! Limited time offer!" (no deadline, no specifics)

### Money-back CTA support copy

Every plan CTA benefits from a trust line immediately beneath it:

```
[Choose {{plan name}}]
[N]-day money-back guarantee. Read the refund policy.   (only while the money-back claim renders)
```

Never add "no questions asked" or similar. The refund policy states the real conditions.

### Pricing and CTAs: the price sits beside the button, not inside it

Show the price, billing period, renewal price and tax line directly above the button. Keep the label short and specific.
A price inside the label drifts out of date, breaks when prices are hidden by a flag, and cannot carry the tax line.

✅ "Choose [plan name]" (plan names come from the pricing file, never from this file)
❌ "Get Started"
❌ "Start [plan name] — {{price}}/month" (price inside the label)

---

## 5. Error Message Guide

### Principles

1. **Never blame the user.** "Something went wrong" beats "You entered invalid data."
2. **Say what happened** in plain language.
3. **Say what to do next** — one clear action.
4. **Never show a raw error code alone.** A code is fine alongside a human message.
5. **Match the severity.** A validation error is not a crisis. A payment failure is more serious.

### Format

```
[What happened — one sentence]
[What to do — one sentence or bullet list if multiple steps]
[Optional: link to support or documentation]
```

### Validation errors (form fields)

Short, specific, placed inline next to the field.

| Situation | Message |
|---|---|
| Required field empty | "This field is required." |
| Invalid email format | "Enter a valid email address." |
| Password too short | "Password must be at least [N] characters." ([N] comes from the auth config) |
| Passwords do not match | "Passwords do not match." |
| Domain already taken | "That domain is already registered. Try a different name or extension." |
| Domain invalid format | "Enter a valid domain name, for example: yourbusiness.com" |
| Credit card number invalid | "Check your card number and try again." |
| Card expired | "This card has expired. Use a different payment method." |
| CVV invalid | "Check the security code (CVV) on your card." |

### API / server errors (toast or banner)

| Situation | Message |
|---|---|
| Generic server error | "Something went wrong on our end. Please try again. If this keeps happening, contact support." |
| Network timeout | "This is taking longer than expected. Check your connection and try again." |
| Not authorized | "You do not have permission to do this. If you think this is a mistake, contact support." |
| Session expired | "Your session has expired. Sign in again to continue." |
| Rate limited | "Too many attempts. Please wait a minute before trying again." |
| Maintenance mode | "[Brand] is undergoing scheduled maintenance. We will be back by [time + timezone]. Check our status page for updates." |

### Payment errors

| Situation | Message |
|---|---|
| Card declined (generic) | "Your card was declined. Check the details with your bank and try again, or use a different payment method." |
| Insufficient funds | "Your card was declined. Check your account balance or use a different payment method." |
| 3D Secure failed | "Payment authentication failed. Try again or contact your bank." |
| PayPal error | "Something went wrong with PayPal. Return to checkout and try a different method." |

### Domain and hosting provisioning errors

| Situation | Message |
|---|---|
| Domain check failed | "We could not check availability right now. Try again in a moment." |
| Domain registration failed | "We could not register that domain. Your card has not been charged. Contact support and we will fix this." |
| Hosting provisioning delayed | "Your hosting is taking a little longer than usual to set up. We will email you at [email] when it is ready." (Add a typical time only while a claim for it renders.) |
| Hosting provisioning failed | "Your hosting could not be provisioned. You have not been charged. Our team has been notified and will contact you by email." (Add a response time only while a claim for it renders.) |

### Contact form errors

| Situation | Message |
|---|---|
| Submit failed | "Your message could not be sent right now. Please email us at [support email from the claims registry] or try again." (Leave `[HUMAN REVIEW]` while the address is unconfirmed.) |
| Submit success | "Message received. We will reply by email." (Add a reply time only while a claim for it renders.) |

### Tone rules for errors

- Active voice: "We could not connect" not "A connection could not be established"
- Past tense for what went wrong: "Your payment failed" not "Your payment is failing"
- No technical jargon in user-facing messages (no stack traces, HTTP status codes, or database errors)
- No apology stacking ("We're so sorry" — one "sorry" maximum, only for genuine failures)

---

## 6. Empty State Copy Patterns

Empty states appear when a user reaches a screen with no content yet: no domains, no billing history, no support tickets. They are an underused opportunity to teach and convert.

### Structure

```
[Illustration or icon — optional]
[Short heading — what is empty]
[One-sentence explanation — why it is empty / what this section does]
[Primary action — what to do first]
[Optional secondary link — learn more or see docs]
```

### Examples by context

**No domains registered yet:**
```
You have not registered any domains yet.
Search for a domain to get started. [EXAMPLE, NOT VERIFIED: WHOIS privacy is included free.]
[Search for a domain]
```

**No hosting accounts yet:**
```
No hosting accounts yet.
Pick a plan and we will set up your hosting. [Only while its claim renders: EXAMPLE, NOT VERIFIED: live in under 4 minutes.]
[See hosting plans]
```

**No support tickets:**
```
No tickets yet.
When you open a support request, it will appear here. [Only while its claim renders: EXAMPLE, NOT VERIFIED: Our average first response is 18 minutes.]
[Open a support ticket]
```

**No invoices:**
```
No invoices yet.
Your billing history will appear here once you have an active plan.
[See hosting plans]
```

**No blog posts (admin view):**
```
No posts published yet.
Write your first post to start building your content library.
[Write a post]
```

**Search with no results:**
```
No results for "[query]"
Try a different search term, or browse all articles in the knowledge base.
[Browse all articles]
```

### Empty state rules

- Never show a blank screen. Every empty state has at minimum a heading and a primary action.
- Do not say "Nothing here yet" — that is a dead end.
- Do not say "No data found" — that is database language, not product copy.
- The primary action always moves the user forward, not back.
- If the empty state is expected (first login), it is an onboarding moment — use it.
- If the empty state means something went wrong (no results for a valid search), acknowledge it.

---

## 7. SEO Content Rules

### Title tag format

```
Primary Keyword
```

Rules:
- Titles are written **without** the brand suffix. The metadata helper appends it once (see the project's SEO rules), so titles
  never contain "[Brand]" as a suffix. This avoids a doubled brand name.
- Measure the title with the brand suffix: warn above 60 characters, fail above 70. Google truncates by pixel width,
  not characters. The suffix text comes from the config (`limits.titleSuffix`), not from this file.
- Keyword first
- Feature words (the patterns in `featureWords` in `project/rules.config.json`) appear in a title, H1 or description **only when their claim renders**
- The suffix and its separator are defined in one place only (the metadata helper and the layout title template).
- Every page has a unique `title` in `generateMetadata()`

| Page | Title (suffix added by the helper) `[EXAMPLE, NOT VERIFIED]` |
|---|---|
| Homepage | "Managed WordPress & VPS Hosting" |
| WordPress Hosting | "Managed WordPress Hosting for Small Business" |
| WordPress Hosting for UK businesses | "UK WordPress Hosting for Small Businesses" (differs from the H1; location claims only from the infrastructure registry) |
| VPS Hosting | "VPS Hosting with Root Access" |
| Pricing | "Hosting Plans & Pricing" |
| Contact | "Contact the Team" |
| Blog post | "[Post Title]" (keyword-first post title) |
| `/vs/[competitor]` | "[Brand] vs [Competitor]: [Axis]" (for example "[Brand] vs [Competitor]: Price and Support"; a year is allowed only when set from `reviewedOn`, see below) |

**Years in titles and copy:** allowed only on pages reviewed on a schedule (comparisons, annual reports). The year
comes from the page's `reviewedOn` field, never typed by hand.

### Meta description format

```
[Specific outcome or key fact]. [What makes [Brand] different]. [CTA].
```

Rules:
- Warn above 160 characters (Google truncates by pixel width). Fail only if the description is missing or duplicate
- Every page has a unique description
- Include the primary keyword naturally — do not force it
- End with a clear next step (not "Click here")
- Never copy the title into the description

| Page | Description `[EXAMPLE, NOT VERIFIED]` |
|---|---|
| WordPress Hosting | "Managed WordPress hosting for small business sites. See what is included, compare plans and talk to the team." |
| WordPress Hosting for UK businesses | "Managed WordPress hosting for UK businesses, priced in pounds. See the plans and what UK GDPR means for your site." |
| VPS Hosting | "VPS hosting with root access for teams that want full control. Talk to the team about the right size." |
| `/vs/[competitor]` | "How [Brand] compares to [Competitor] on price, renewal price, support and migration. Sources and review date included." |

Examples contain no number, price or feature that is not in the claims registry or the pricing file. A feature word appears in a
description only when its claim renders. `npm run lint:content` should flag a feature word with no rendering claim.

### Keyword intent matching

Match the page content to what the searcher actually wants. Mismatched intent ranks poorly and converts poorly.

Use the engine's six intents (Learn, Solve, Compare, Buy, Find, Plan), defined in [search-intent.md](search-intent.md).

| Keyword type | Intent | Page type |
|---|---|---|
| "[product] [country]" | Buy | Product or regional page with prices |
| "[competitor] alternative" | Compare | `/vs/[competitor]` comparison page |
| "how to migrate [platform] without downtime" | Learn | Guide or KB article |
| "[site] down", "[error message]" | Solve | Fix article |
| "buy [product]" | Buy | Pricing page or plan selection page |
| "[brand] login", "[brand] review" | Find | Brand or about page, with a link to the [Review platform] profile |
| "which [product] do I need" | Plan | Decision guide |

**Rule:** Never put a Buy keyword on a Learn page or the reverse. Search engines detect the mismatch and the page will not rank.

### Target keyword strategy

Which keywords to target and which to avoid is a project decision: see `project/brand.md` ("From rules section 7: Target keyword strategy") and `project/keyword-register.md`. The rule here: target high commercial intent you can win; avoid terms owned by large advertisers, price-only intent and wrong-intent terms.

### Keyword density and placement

- Primary keyword: in `<h1>`, first 100 words of body, at least one `<h2>`, naturally throughout
- Do not stuff — if a keyword appears more than once every 100 words it is excessive
- Use semantic variants (Google understands synonyms): "WordPress hosting" and "WordPress host" and "managed WordPress" are all valid
- On content pages (below), at least one real image whose `alt` describes it and naturally includes the keyword or a close variant. Every other `alt` stays purely descriptive (WCAG 2.1 AA). Never stuff an `alt`, and a decorative image keeps an empty `alt`

### Required elements on content pages

Content pages are product, service, comparison, regional, domain, migration and email pages, and every guide or blog article: the blueprints listed in `contentPages.blueprints` in the config, plus all Markdown articles. Home, pricing, about, trust, contact, reviews, policy, glossary and hub pages are exempt, and so is any path in `contentPages.exemptPaths`.

| # | Element | Rule | Check |
|---|---|---|---|
| 1 | Keyword in the title | The primary keyword, or all its words, in the SEO title | K2 |
| 2 | Keyword in an H2 | At least one H2 holds the keyword or all its words, phrased as the question the section answers | CP1 |
| 3 | Keyword in an image alt | At least one real image (a screenshot, diagram or licensed photo, never a stock photo presented as ours) whose alt describes it in words that include the keyword | CP2 |
| 4 | A video | At least one real video that helps the reader: our own screen recording or explainer, or a credited video from an authoritative source (for example WordPress.org). Never stock or AI footage presented as ours. It loads on click (privacy-enhanced embed such as youtube-nocookie, no third-party cookies before consent, no LCP cost) and has captions | CP3 |
| 5 | A link to another site | At least one https link to an authoritative source the page relies on: official documentation, a standard, a regulator or the source of a cited number. Never a competitor's sales page or an affiliate link | CP4 |
| 6 | Links to our own pages | At least 3 internal links (S5), of which at least 2 sit in running copy, not only in buttons, the hero or the closing band | S5, CP5 |

**Rollout (decision 77).** CP1, CP2, CP4 and CP5 warn while `contentPages.enforce` is false; the owner switches it on once the live pages are fixed. CP3 (video) warns while `contentPages.videoRequired` is false, because no real video exists yet; a page without one carries `[HUMAN REVIEW: video]` in its brief. In a Draft these rules always warn.

### Content length

Cover the search intent completely. Word counts are planning guides, not pass/fail. Padding to reach a number is
worse than a short, complete page. A page is flagged as potentially thin when it is under its blueprint's word
minimum (see [page-blueprints.md](page-blueprints.md), "Default length per page type"). Only when no blueprint
applies, a page under 300 words is flagged and needs a reason (utility page, legal page, contact page).

### FAQ sections

Where a FAQ is required, by page type: [page-blueprints.md](page-blueprints.md), "Required trust and FAQ sections by
page type". The item count comes from `limits.faqItemsByArchetype` in the config. FAQs:
- Help users and AI answers (FAQ schema is optional and must match the visible text)
- Capture long-tail informational queries
- Are quoted verbatim by AI tools (ChatGPT, Perplexity, Claude, Gemini)

**FAQ writing rules:**
- Questions written as a real buyer would ask them (conversational, first-person)
- Answers in clean declarative prose, 40 to 80 words (warn under 40, fail over 80)
- Answer the question in the first sentence (AI tools grab the first sentence)
- At most one link per answer, and only where the reader's next step is obvious (for example the refund policy). The first sentence still answers on its own

Good FAQ questions are the ones a buyer would type, for example "How much does [Product] cost at [Brand]?", "Does [Brand] offer a money-back guarantee?", "Where is my site hosted?" (use the standard answer: "Your site runs on servers we rent from established cloud providers. We name a location only when we can confirm it for your plan; the providers are listed in our sub-processor list.") and "Can I migrate my existing site to [Brand] for free?". A data processing agreement question is allowed only after the DPA page is published and reviewed by a qualified person.

Bad FAQ questions: "What makes [Brand] amazing?" (not what buyers ask) and "How do I get started?" (too vague).

Worked project examples: `project/brand.md`, "From rules section 7: FAQ questions".

### E-E-A-T signals (required for ranking)

Google rewards pages that demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness.

| Signal | Implementation |
|---|---|
| **Experience** | Case studies with before/after numbers, screenshots, client names and roles |
| **Expertise** | Author bios on all blog posts — name, role, credentials, photo |
| **Authoritativeness** | Third-party review scores ([Review platform]), press mentions |
| **Trustworthiness** | Company registration number, physical address, real team names and LinkedIn profiles |

### AI discoverability (ChatGPT, Perplexity, Claude, Gemini)

AI tools increasingly cite specific pages in answers. To be cited:
- All SEO-critical content must be server-rendered HTML
- FAQ answers in declarative prose (not bullet lists — AI reads prose better)
- Factual, specific headings: "How much does [Product] cost at [Brand]?" not "Pricing"
- Comparison tables with real numbers: [Brand] vs [Competitor] for each named competitor
- `/public/llms.txt` and `/public/llms-full.txt` are an optional extra (made by the host's llms.txt generator); no major AI provider has confirmed using them

### Internal linking rules

Internal links follow a hub-and-spoke map. Every page links to at least 3 related pages (S5), at least 2 of them from running copy (CP5), and every content page receives links from at least 2 other pages (CP7).

**The map.** Each content page belongs to one hub (a product, a service or a guide hub). Plan its links in the brief, before writing:

| Direction | Link to | Example |
|---|---|---|
| Up | Its hub page, once, early in the body | A WordPress guide links to the WordPress hosting page |
| Across | 1 or 2 sibling pages under the same hub | A guide on caching links to the guide on page speed |
| Down | The guides or policies that answer the reader's next question | A product page links to the migration terms |
| Back | When a page is published, add a link to it from its hub and from one sibling (update those pages in the same change) | The hub's list of guides gains the new guide |

**Anchor text:**
- Describes the target page and, where it reads naturally, names its keyword or a close variant ("our WordPress hosting plans", not "click here", "read more" or a bare URL)
- One anchor text points to one URL. Never use the same anchor for two different pages (CP6)
- Vary anchors to the same page across the site; never repeat the exact keyword in every anchor
- Link to the most relevant page, not always the homepage, and never to a page that redirects
- `npm run content:suggest-links -- <file>` suggests links from the register; CP6 warns when an anchor shares no word with its target's keyword, and CP7 warns when fewer than 2 other pages link to a content page (navigation and footer links are not counted)

The project's URL map and which pages exist: see the project's plan-specifics for this file and `project/page-map.md`.

| Page | Must link to |
|---|---|
| Product page | The pricing page, a regional page (if it exists), a relevant guide, a comparison page (if it exists) |
| Technical product page | The pricing page, the security page, the contact page |
| Guide or blog post | The relevant product page, the pricing page, 1–2 other relevant guides |
| `/vs/[competitor]` | The pricing page, the relevant plan page, the contact page |

### Social proof copy rules

All testimonials and case study copy must be:
- **Real and verifiable** — full name, company name, role, LinkedIn link or company site link
- **Specific** — numbers, outcomes, before/after states
- **Permission-granted** — written consent from the person quoted
- Never paraphrased without approval — use the exact words given

- No star ratings unless they come from a real review platform and link to it.

What a good testimonial includes (this sample is invented, `[EXAMPLE, NOT VERIFIED]`, never publish it):
```
"We moved from [Competitor] to [Brand] in [month] and our TTFB dropped from [N] ms to [N] ms.
Our PageSpeed score went from [N] to [N], and our conversion rate went up [N]%."

— [Full name], [Role], [Company] ([company-site])
```

What a bad testimonial looks like (do not publish):
```
"Great hosting! Very fast and cheap. Highly recommend!"
— John S.
```

Buyers reverse-image-search headshots and check LinkedIn. Every social proof element must survive that scrutiny.

---

## 8. Human-First Writing and AI Use

**Principle.** Content is written for readers, not for search engines. AI is a tool. A named person is the author of record and answers for every claim on the page. A page that only summarizes what already ranks, or that was produced in bulk, does not ship.

### 8.1 Lead with human thinking

A person completes these fields in the brief **before** any draft, human or AI:

| Field | Question it answers |
|---|---|
| Reader's real question | What is this person trying to decide or fix, in their words? |
| Our angle | What do we say that others do not, and why do we believe it? |
| What we know first-hand | A test we ran, a support pattern, a migration we did, a decision we made |
| Original element | The one thing on this page that exists only because we made it (see 8.3) |
| Claims and sources needed | Which facts must be verified (see 8.2) |

If the person cannot fill "what we know first-hand", the page is not ready to write. AI may then help with structure, a first draft from the filled brief, and edits. It does not choose the angle.

### 8.2 Verify all facts and data

| Kind of fact | Source required | Checked by |
|---|---|---|
| Our claims, guarantees, SLA, support, locations | The claims registry, rendering only when verified | Owner |
| Prices and plan limits | The pricing file | Writer, against the file |
| Laws, regulations, standards | Primary source (the regulator or standard), with link and date | Reviewer, and a qualified legal reviewer for Tier B legal pages |
| Statistics and studies | Original publication, with link, date and sample or method | Reviewer |
| Competitor facts | Their public page, with link and retrieval date (see Plan 02) | Reviewer |
| How a tool or setting works | We tested it, or the vendor's documentation, with version and date | Writer |

Rules:
- Keep a **verification log** in the brief: fact, source link, date, who checked. A fact not in the log is removed.
- **Open every link and read the source.** AI tools invent citations, quotes and statistics. A number, quote or study supplied by an AI is unverified until checked at the source.
- No statistic without a source and a year. No quote without a named, real person who agreed to it.
- Numbers that need verifying are marked `[HUMAN REVIEW: verify figure]` until checked. A page ships with none open.

### 8.3 Inject original voice and value

Every page contains at least **one original element**:

- our own test or benchmark, with method, tools and date
- a real customer case with permission and numbers
- a screenshot or recording of our own dashboard or process
- a process we actually run, in steps, with its reasons
- a pattern from our support work, in aggregate and anonymous
- a clear decision we made and why (for example, why a plan includes one thing and not another)

The test: **if the top ten results disappeared, could this page still be written?** If yes, it adds nothing and fails review.

Voice: say "we" only for things we did. Prefer a concrete example over a general statement. Keep the [Brand] voice in section 1: confident, specific, calm.

### 8.4 Retain full accountability

- Every page has a **named owner** (the writer) and a **reviewer**. For money, comparison, service, compliance and policy pages the reviewer is a different person when one exists; until then the owner reviews and the byline says so.
- The reviewer signs off in the pull request. Nothing publishes on an AI draft alone.
- AI is **never** used to produce: testimonials, reviews, ratings, team bios or photos, case-study results, quotes attributed to a person, or Tier B legal text that a qualified legal reviewer has not reviewed. Tier A policy pages (commercial promises) need the owner's checklist sign-off (see `plans/07-compliance-and-trust.md`, "Policy tiers").
- Corrections: fix the page, update `dateModified`, and for a material change add a visible note ("Updated 7 October 2026: corrected the backup retention period"). A page has a way to report an error (the contact link).
- The register records owner, reviewer and next review date.

### 8.5 Disclose AI use

| Level | Where | What it says |
|---|---|---|
| Site-wide | An editorial policy page, `/editorial-policy` (planned), linked from the footer and the about page | People are accountable for what we publish. AI may assist with drafting and editing. How we verify facts. How to report an error |
| Byline | Guides, service pages, comparison pages | "Written by [name]. Reviewed by [name] on [date]." |
| AI-assisted line | Guides, knowledge-base and blog posts where AI produced most of the first draft | "Drafted with AI assistance, then edited, fact-checked and approved by [name]." |

Not needed: UI strings, error messages, Tier B legal pages reviewed by a qualified legal reviewer, Tier A policy pages signed off by the owner on the checklist, pages where AI only fixed grammar.

- Whether the project uses the editorial policy page and the "AI-assisted" line is an owner decision, recorded in the project's plan-specifics for this file. The line's text is `disclosureLine` in `project/voice.json`.
- A law, a platform rule or a client contract that requires disclosure overrides this table. The owner confirms with a lawyer whether any rule applies to the site's content.
- **Images:** an AI-generated image is labeled in its caption or alt text where it could mislead. Never present an AI image as a real photo of the team, a customer, a server room or a result.
- Never claim "human-written" or "written by [name]" if that is not true.

---

## 9. Interactive Landing Pages

An interactive element is a tool inside a page: a plan finder, a calculator, a billing-cycle toggle, tabs, a migration checker or domain search. It earns its place only if it helps the reader decide faster than reading would.

| Rule | Detail |
|---|---|
| **Serves the page's intent** | Money pages: plan finder, billing toggle. Guides: calculators and checklists. Service pages: a short enquiry form. No tool for its own sake |
| **Works without JavaScript** | The server-rendered page holds every important fact. The tool improves it. Tab and accordion text is in the HTML, not loaded on click |
| **Real numbers only** | Inputs and outputs come from the pricing file and verified claims. A calculator states its formula and assumptions and labels results "estimate". Never invent a saving or a speed gain |
| **Explains itself** | A plan finder says why it chose a plan ("[Plan], because you need [N] sites and [N] email accounts"). Rules live in a data file a person can read |
| **Fast and stable** | Load the tool as a small island. No layout shift. Keep within the 150 KB JavaScript budget and INP under 200 ms |
| **Accessible** | Keyboard use, visible labels, results announced with `aria-live`, focus handled, reduced motion respected (WCAG 2.1 AA) |
| **Private** | No personal data stored without consent. Any email gate states its purpose. Forms are validated server side, rate limited and protected against CSRF |
| **Leads to one action** | The result ends in one CTA to the recommended plan, carrying the choice. Events are tracked only with consent |
| **Copy follows the guide** | Labels, helper text and errors follow section 5. The result headline is a direct answer |
| **Not the only content** | The page must stand alone as text. A tool with no surrounding content is a thin page |

First tools to build, in order: billing-cycle toggle, plan finder (3 to 5 questions), then a domain search once its feature flag is on.

---

## 10. Comparison Tables

There are two kinds, with separate rules.

- **Service vs service (our own services):** one [Product] against another, or one plan against another. Lives on money pages and the pricing page.
- **Provider vs provider:** [Brand] against a competitor. Governed by `plans/02-commercial-investigation.md`.

### Service vs service rules

1. **Direct answer first.** 40 to 80 words above the table say which to choose when ("Choose VPS hosting if you need root access. Choose managed WordPress hosting if you want us to run the server.").
2. **Same rows for every column, in the same order.** Row and column limits: the `ComparisonTable` row in [page-blueprints.md](page-blueprints.md), the single source.
3. **Row groups:** Who it is for, What we manage and what you manage, Limits (from the pricing file), Backups and security (rendering claims only), Support, Price (signup and renewal from the pricing file), **Best for**, **Not a good fit when**. The last two rows are mandatory.
4. **Words, not only icons.** Cells say "Included", "Not included", "Add-on" or "Not applicable", with an icon as a second signal. A `null` limit is never "Unlimited": it reads "Fair use" (linked to the fair-use policy) when the plan's traffic type is fair use, and "Not included" otherwise. The pricing file decides.
5. **Exact limits** from the data file. Rows whose claim does not render are hidden, not blanked.
6. **Honest recommendations.** When another service suits the reader better, the table says so and links to it.
7. **One highlighted column**, only if it is the real default recommendation, with the reason stated. Never highlight to push the dearest option.
8. **Headers link** to each service page. Add a visually hidden caption and an "Updated [date]" line.
9. **Use the `ComparisonTable` component.** No new table markup. On narrow screens the table scrolls inside its own container with the first column kept visible.
10. **SEO:** the section heading is the question ("WordPress hosting or VPS hosting: which do I need?"). The table is real HTML text. A short FAQ follows.

---

## 11. Maintenance Pitch

**Status:** if the service's scope, price and response times are not defined in the pricing file or the claims registry, pages may be planned and drafted, but they **must not state inclusions, times, hours or prices**. Managed-hosting tasks (updates, backups, security) may be described only as far as their feature claims render. Project status: see `project/brand.md`, "From rules section 11: Maintenance status".

When a service exists, the pitch has these parts:

| Part | Content |
|---|---|
| What we do | A list of the actual tasks, and how often |
| What we watch | What is monitored, and how we find out something broke |
| When something breaks | The steps, who acts, and what is restored (only verified times and hours) |
| What you still do | The reader's part, stated honestly |
| What it costs | From the pricing file (an add-on or plan), with renewal price |
| What it does not cover | Clear exclusions |
| How to reach us | The verified channels |

How to write it:
- The reader's feeling of safety comes from **specific, true detail**. Do not use "peace of mind" as a headline or a promise. Write the detail instead.
- Argue the cost of neglect with sourced facts. Do not scare. No statistic without a source and a year.
- Never promise "no downtime", "never hacked" or "guaranteed protection". Promise the work and what we do when it fails.
- Use the reason-led headline pattern (section 12), with a reason from a rendering claim.

Example shape `[EXAMPLE, NOT VERIFIED]`: "We handle updates and backups because a failed update should not take your site offline. If one breaks your site, we restore the last working copy."

---

## 12. Reason-Led Headlines ("because")

**Pattern:** `[Choice or outcome] because [specific reason]`. A stated reason makes a recommendation easier to accept. For us the reason must also be **true and verified**.

**Where to use it**
- The H1 or hero headline on money pages, service pages, regional pages and landing pages.
- One H2 per page at most, where the section explains why something matters.
- **Not** on policy pages, guides and knowledge-base pages (use question headings), UI copy, or every heading. A "because" in every headline reads as a formula.

**Rules**

| # | Rule |
|---|---|
| 1 | The reason comes from a rendering claim, a `feature:` reference, pricing-file data or a sourced fact. No claim, no "because" |
| 2 | The reason is specific: "because we handle updates and backups", not "because we care" |
| 3 | The reason is a benefit to the reader, not a boast about us |
| 4 | No superlatives. Say why it is **right for the reader** or **why it matters**. Do not say "best" |
| 5 | H1 stays 20 to 70 characters. One clause only |
| 6 | Each reason-led headline has a fallback headline without "because", used while its claim is hidden. The page never renders an unverified reason |
| 7 | Vary the reason across pages: outcome, cost, risk, fit. Do not reuse the same shape site-wide |
| 8 | One reason-led headline per page |

Examples `[EXAMPLE, NOT VERIFIED]`, each needs its claim to render:
- "Managed WordPress hosting, because we run the server for you" (needs the managed-service claim)
- "Choose a VPS because you need root access and full control"
- "Rebuild your site because slow pages cost you visitors" (needs a sourced fact)

Not acceptable:
- "The best hosting because we are number one"
- "Fast hosting because we use the latest technology" (vague, unsourced)
- "Trusted by thousands because we are reliable" (unverified number, circular reason)

Test later with a split test on money and landing pages. Keep a record of the result in the register.

---

## 13. UI Microcopy

Labels, helper text and messages inside forms, dashboards and checkout. Errors and empty states: sections 5 and 6.

| Element | Rule | Do | Do not |
|---|---|---|---|
| Button and field labels | 1 to 3 words, verb first for actions | "Add domain" | "Click here to add a new domain" |
| Helper text | One sentence under the field | "We send the invoice to this address." | A paragraph |
| Form-field help | Show an example of a valid value | "For example: name@company.com" | "Enter a valid value" |
| Tooltips | Never hold required information. Anything the reader needs to finish the task is visible | A visible line under the field | The renewal price only in a tooltip |
| Destructive confirmation | Name the object and the result. The button says the action | "Delete example.com? Its files and email are removed and cannot be restored." Button: "Delete site" | "Are you sure?" Button: "OK" |
| Success toast | Say what happened and what is next | "Domain added. Point its DNS to finish setup." | "Success!" |
| Loading state | Say what is loading | "Loading your invoices" | "Please wait" |
| Time words | No time promise unless a claim for it renders | "We will email you when it is ready." | "Ready in 2 minutes" (no claim) |
| Cancellation | As easy as purchase: same number of steps or fewer, no hidden link, no guilt wording | "Cancel plan" in account settings | "Are you sure you want to lose everything?" |
