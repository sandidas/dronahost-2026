# DronaHost — Content Writing Rules

> Covers every word on the site: marketing copy, UI labels, error messages, empty states, blog posts, and meta content.
> For visual design tokens and component patterns, see `docs/rules/ui-ux-rules.md`.
> For logo and wordmark usage, see `docs/rules/brand-identity.md`.

---

## Table of Contents

1. [Tone of Voice & Brand Voice](#1-tone-of-voice--brand-voice)
2. [Terminology List](#2-terminology-list)
3. [Heading Hierarchy Rules](#3-heading-hierarchy-rules)
4. [CTA Copy Patterns](#4-cta-copy-patterns)
5. [Error Message Guide](#5-error-message-guide)
6. [Empty State Copy Patterns](#6-empty-state-copy-patterns)
7. [SEO Content Rules](#7-seo-content-rules)

---

## 1. Tone of Voice & Brand Voice

### The DronaHost character

**Confident, specific, calm.** We know what we are doing and we do not need to shout about it.

| Attribute | What it means in practice |
|---|---|
| **Confident** | State facts, not hopes. "99.95% uptime SLA with automatic service credits" — not "we try our best." |
| **Specific** | Numbers, locations, benchmarks. Never a vague adjective where a metric can stand. |
| **Calm** | No urgency that isn't real. No exclamation marks in marketing copy. No countdown timers without a genuine deadline. |
| **Honest** | Indian team, Western professionalism. We do not hide where we are from. We do not pretend to be bigger than we are. Being a focused team is a feature — buyers are tired of faceless giants. |
| **Technical** | We talk LiteSpeed, NVMe, TTFB, LCP, LiteSpeed ESI, Nginx, cPanel because our buyers care. Use the correct term, not the dumbed-down one. |

### Reference points (read their copy)

**Write like:** Fathom Analytics, Kinsta, Cloudways, Basecamp, Bunny.net
**Never write like:** Hostinger, GoDaddy, any local Indian reseller site

### The spectrum

```
TOO FORMAL ←————————————————→ TOO CASUAL
  "We are pleased to inform you   "OMG your site is live!! 🚀🎉"
   that your hosting account has
   been provisioned successfully."

                    ▼ DronaHost sits here
           "Your hosting is ready. Here's how to log in."
```

---

### Prohibited patterns (Indian English / salesy)

These patterns read as unprofessional to Western B2B buyers. Never use them.

| Prohibited | Replace with |
|---|---|
| "Don't fret!" | Remove — just say what to do |
| "Don't worry!" | Remove — just say what to do |
| "Kindly..." | "Please..." |
| "Do the needful" | Say what specifically needs doing |
| "Revert back to us" | "Get back to us" / "Reply" |
| "Prepone" | "Reschedule to an earlier time" |
| "Best of luck!" | Remove — irrelevant in product copy |
| "World-class" | Name the specific thing that makes it good |
| "Blazing fast" | Cite TTFB, LCP, or benchmark numbers |
| "Cutting-edge" | Name the specific technology |
| "State-of-the-art" | Name the specific technology |
| "Next-generation" | Name what is actually new |
| "Revolutionary" | Remove — your work speaks for itself |
| "Game-changing" | Remove |
| "99.99% uptime" (uncredited) | "99.95% uptime SLA with automatic service credits" |
| "One-to-one support" | "Dedicated support" |
| "We provide best services" | State the specific service and outcome |
| Multiple exclamation marks!! | One at most, only in celebration moments |

### Prohibited patterns (generic SaaS)

These are worn out and trusted by nobody.

| Prohibited | Replace with |
|---|---|
| "Supercharge your..." | State the actual improvement |
| "Unlock the power of..." | State what it does |
| "Take your business to the next level" | State the specific outcome |
| "All-in-one solution" | List what is included |
| "Seamless integration" | Describe how it connects and what it does |
| "Robust platform" | Name the actual capabilities |
| "Scalable infrastructure" | State the actual scale limits or growth story |
| "Empower your team" | Say what they can now do that they could not before |

### Replace adjectives with specifics

| Do not write | Write instead |
|---|---|
| "Blazing fast servers" | "LiteSpeed + NVMe storage. Average TTFB: 200ms from London, Frankfurt, and New York." |
| "World-class support" | "Average first response: 18 minutes, 24/7 across US, UK, and UAE business hours." |
| "Amazing uptime" | "99.95% uptime SLA with automatic service credits if we miss it." |
| "Affordable pricing" | "WordPress hosting from $5/month. No price hike at renewal." |
| "Easy to use" | "One-click WordPress install. Live in under 4 minutes." |
| "Secure hosting" | "Daily backups, free SSL, DDoS protection via Cloudflare, malware scanning included." |

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

---

## 2. Terminology List

Use these terms exactly and consistently across all copy, UI, metadata, and blog posts.

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
| Website Design | Web Design, Website Development (unless specifically code-only work) |
| Custom Development | Software Development (too broad), App Development (unless it is an app) |
| SEO Services | Search Engine Marketing (SEM is paid ads), Digital Marketing (too broad) |
| Knowledge Base | FAQ (FAQ is a section, KB is the full library), Help Center is acceptable |

### Technical terms (use precisely)

| Term | Usage |
|---|---|
| LiteSpeed | Always capitalised. "LiteSpeed Web Server" on first mention if space allows. |
| NVMe | Always uppercase. "NVMe SSD storage" on first mention. |
| TTFB | Time to First Byte — spell out in blog posts on first mention. |
| LCP | Largest Contentful Paint — spell out in blog posts on first mention. |
| GDPR | Always uppercase. "GDPR-compliant" with hyphen when used as adjective. |
| SSL / TLS | Prefer "SSL certificate" for user-facing copy. TLS is more accurate but SSL is what buyers search for. |
| CDN | Content Delivery Network — spell out in non-technical contexts. |
| cPanel | Lowercase "c", uppercase "P". Never "Cpanel" or "cpanel". |
| Cloudflare | Always capitalised. One word. |
| WordPress | Always capitalised exactly this way. Never "Wordpress" or "wordpress". |
| WooCommerce | Always this casing. One word. |
| Let's Encrypt | Exactly this casing with apostrophe. |

### Pricing and commitment terms

| Preferred | Do not use |
|---|---|
| /month | per month, monthly, /mo |
| /year | per year, annually, /yr |
| billed annually | annual billing, yearly plan |
| billed monthly | monthly billing |
| renewal price | renewal rate, ongoing price |
| money-back guarantee | refund policy (in CTAs — use "guarantee") |
| 30-day money-back guarantee | "risk-free" without specifics |
| service credit | compensation, refund (for SLA breaches) |

### Support terms

| Preferred | Do not use |
|---|---|
| support ticket | help request, case |
| live chat | chat support, instant chat |
| average first response: 18 minutes | fast response, quick support |
| 24/7 support | round-the-clock (old-fashioned), always-on |
| dedicated support | one-to-one support, personal support |

### Regions and locations

| Preferred | Do not use |
|---|---|
| United States | America, USA (in prose — US is fine in tables) |
| United Kingdom | Britain (informal), UK (fine in tables and CTAs) |
| European Union | Europe (EU is 27 countries; Europe includes more) |
| United Arab Emirates | Dubai (one city — use UAE unless specifically Dubai) |
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
- 40–70 characters
- States the outcome or topic — not the brand name
- Never the same as the `<title>` tag (different copy for each)

| Page | Example H1 |
|---|---|
| WordPress Hosting | "Managed WordPress Hosting Built for Performance" |
| VPS Hosting | "VPS Hosting with Full Root Access and NVMe Storage" |
| WordPress Hosting UK | "WordPress Hosting on UK Servers — GDPR-Ready" |
| Blog post | "How to Migrate WordPress to a New Host Without Downtime" |
| About | "We Build Hosting Infrastructure for Western Businesses" |
| Contact | "Talk to the Team" |

### H2 rules

- Introduce a new major section
- Should make sense read out of context (a user scanning headings should understand the page)
- 30–60 characters
- Can contain secondary keywords naturally
- Written as noun phrases or questions — not fragments

Good H2 examples:
- "Why LiteSpeed Outperforms Apache for WordPress"
- "What Is Included in Every Plan"
- "How Our Staging Environment Works"
- "Frequently Asked Questions"

Bad H2 examples:
- "Features" (too vague — what features?)
- "More About Us" (leads with us, not the reader)
- "AMAZING PERFORMANCE" (all caps, adjective-led)

### H3 rules

- Subsections within an H2 section
- Often used for individual features, FAQ items, step-by-step items
- 20–50 characters
- Parallel structure within a section (all questions, or all noun phrases — not mixed)

### Heading don'ts

- Do not use headings just to make text larger — use semantic markup, then style with CSS
- Do not keyword-stuff headings ("Best Cheap Affordable WordPress Hosting UK London")
- Do not use punctuation at the end of headings (no full stops, no exclamation marks)
- Do not start multiple consecutive H2s with the same word

---

## 4. CTA Copy Patterns

### The core rule

Every CTA tells the user exactly what will happen next. No generic verbs.

| Do not write | Write instead |
|---|---|
| "Click here" | "Start your WordPress hosting" |
| "Learn more" | "See what's included" / "Read the full comparison" |
| "Get started" | "Start hosting from $5/month" |
| "Submit" | "Send your message" |
| "Sign up" | "Create your account" |
| "Buy now" | "Choose your plan" |
| "Try it" | "Try free for 30 days" |
| "Contact us" | "Talk to the team" / "Ask us anything" |
| "Download" | "Download the PDF" / "Download the case study" |

### Primary CTA

One primary CTA per page or section. It uses the filled/solid button style (Brand Orange background).
It leads directly to the next conversion step.

| Page type | Primary CTA |
|---|---|
| Homepage hero | "See WordPress hosting plans" |
| Hosting plan page | "Start [plan name] — $X/month" |
| Pricing comparison | "Choose this plan" (per card) |
| Contact page | "Send your message" |
| Blog post | "See our WordPress hosting plans" (contextual) |
| `/vs/[competitor]` | "Switch from [Competitor] — see our plans" |

### Secondary CTA

Supporting action. Uses ghost/outline button style. Reduces friction for buyers not ready to commit.

| Context | Secondary CTA |
|---|---|
| Hero sections | "See how it compares" / "Read the case study" |
| Hosting plan page | "Ask a question first" |
| Pricing page | "Talk to us before you buy" |

### Urgency — only when real

Fake urgency destroys trust with Western B2B buyers. Only use urgency copy when:
- There is a genuine deadline (a sale ending on a specific date — name the date)
- There is a genuine scarcity (last X spots — only if this is literally true)

Acceptable:
> "Introductory price — $5/month until 31 July 2026. Renews at $7/month."

Not acceptable:
> "Hurry! Limited time offer!" (no deadline, no specifics)

### Money-back CTA support copy

Every plan CTA benefits from a trust line immediately beneath it:

```
[Start WordPress Hosting — $5/month]
30-day money-back guarantee. No questions asked.
```

### Pricing CTAs — include the price

If the price is visible on the page, include it in the CTA. This reduces hesitation.

✅ "Start Business Hosting — £12/month"
❌ "Get Started"

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
| Password too short | "Password must be at least 8 characters." |
| Passwords do not match | "Passwords do not match." |
| Domain already taken | "That domain is already registered. Try a different name or extension." |
| Domain invalid format | "Enter a valid domain name, for example: yourbusiness.com" |
| Credit card number invalid | "Check your card number and try again." |
| Card expired | "This card has expired. Use a different payment method." |
| CVV invalid | "Check the 3-digit code on the back of your card." |

### API / server errors (toast or banner)

| Situation | Message |
|---|---|
| Generic server error | "Something went wrong on our end. Please try again. If this keeps happening, contact support." |
| Network timeout | "This is taking longer than expected. Check your connection and try again." |
| Not authorised | "You do not have permission to do this. If you think this is a mistake, contact support." |
| Session expired | "Your session has expired. Sign in again to continue." |
| Rate limited | "Too many attempts. Please wait a minute before trying again." |
| Maintenance mode | "DronaHost is undergoing scheduled maintenance. We will be back by [time + timezone]. Check our status page for updates." |

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
| Domain registration failed | "We could not register that domain. Your card has not been charged. Contact support and we will sort this out." |
| Hosting provisioning delayed | "Your hosting is taking a little longer than usual to set up. We will email you at [email] when it is ready — usually within 10 minutes." |
| Hosting provisioning failed | "Your hosting could not be provisioned. You have not been charged. Our team has been notified and will contact you within 2 hours." |

### Contact form errors

| Situation | Message |
|---|---|
| Submit failed | "Your message could not be sent right now. Please email us directly at hello@dronahost.com or try again." |
| Submit success | "Message received. We will get back to you within 24 hours." |

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
Search for a domain to get started. We include WHOIS privacy free on every registration.
[Search for a domain]
```

**No hosting accounts yet:**
```
No hosting accounts yet.
Pick a plan and your site will be live in under 4 minutes.
[See hosting plans]
```

**No support tickets:**
```
No tickets yet.
When you open a support request, it will appear here. Our average first response is 18 minutes.
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
Primary Keyword — DronaHost
```

Rules:
- 50–60 characters (Google truncates beyond ~60)
- Keyword first, brand name last
- Separator: em dash (—) not pipe (|) not hyphen (-)
- Never duplicate titles across pages
- Every page has a unique `title` in `generateMetadata()`

| Page | Title |
|---|---|
| Homepage | "Managed WordPress & VPS Hosting — DronaHost" |
| WordPress Hosting | "Managed WordPress Hosting — LiteSpeed + NVMe — DronaHost" |
| WordPress Hosting UK | "WordPress Hosting on UK Servers — GDPR-Ready — DronaHost" |
| VPS Hosting | "VPS Hosting with Root Access and NVMe — DronaHost" |
| Pricing | "Hosting Plans & Pricing — DronaHost" |
| Contact | "Contact DronaHost — Talk to the Team" |
| Blog post | "[Post Title] — DronaHost Blog" (keyword-first post title) |
| `/vs/siteground` | "DronaHost vs SiteGround — Honest Comparison 2026" |

### Meta description format

```
[Specific outcome or key fact]. [What makes DronaHost different]. [CTA].
```

Rules:
- 140–160 characters (Google shows up to ~160)
- Every page has a unique description
- Include the primary keyword naturally — do not force it
- End with a clear next step (not "Click here")
- Never copy the title into the description

| Page | Description |
|---|---|
| WordPress Hosting | "LiteSpeed + NVMe hosting with 200ms average TTFB. Free migration, daily backups, and 99.95% uptime SLA. Start from $5/month." |
| WordPress Hosting UK | "WordPress hosting on UK servers with GDPR-compliant infrastructure. LiteSpeed, free SSL, daily backups. From £5/month + VAT." |
| VPS Hosting | "Fully managed VPS with root access, NVMe SSD, and 99.95% uptime SLA. Deploy in minutes. Cloudflare DDoS protection included." |
| `/vs/siteground` | "How DronaHost compares to SiteGround on speed, price, support response time, and renewal pricing. Honest numbers, no spin." |

### Keyword intent matching

Match the page content to what the searcher actually wants. Mismatched intent ranks poorly and converts poorly.

| Keyword type | Searcher intent | Page type |
|---|---|---|
| "wordpress hosting uk" | Navigational / commercial investigation | Product landing page with pricing |
| "siteground alternative" | Commercial investigation | `/vs/siteground` comparison page |
| "how to migrate wordpress without downtime" | Informational | Blog post / KB article |
| "buy wordpress hosting" | Transactional | Pricing page / plan selection page |
| "gdpr compliant hosting europe" | Commercial investigation | `/hosting/eu` regional page |
| "dronahost review" | Navigational | About page + Trustpilot/G2 citation |

**Rule:** Never put a transactional keyword on an informational page or vice versa. Google is very good at detecting this mismatch and will not rank the page.

### Target keyword strategy

**Target (high commercial intent, winnable):**
- "siteground alternative"
- "wordpress hosting uk"
- "managed wordpress hosting usa"
- "gdpr compliant hosting europe"
- "uae web hosting"
- "next.js hosting alternative to vercel"
- "web design agency small business uk"
- "affordable website redesign services"

**Do not target (too competitive or wrong market):**
- "best web hosting" — Hostinger and Bluehost own this with annual SEO budgets we cannot match
- "web hosting" — same reason
- "cheap hosting india" — wrong market
- "free web hosting" — wrong intent; does not convert

### Keyword density and placement

- Primary keyword: in `<h1>`, first 100 words of body, at least one `<h2>`, naturally throughout
- Do not stuff — if a keyword appears more than once every 100 words it is excessive
- Use semantic variants (Google understands synonyms): "WordPress hosting" and "WordPress host" and "managed WordPress" are all valid
- Keyword in the image `alt` attribute when it is genuinely descriptive of the image

### Content length by page type

| Page type | Minimum word count |
|---|---|
| Hosting plan / product page | 800 words |
| Regional landing page (`/hosting/[region]`) | 1,000 words |
| Competitor comparison (`/vs/[competitor]`) | 1,200 words |
| Blog post (informational) | 1,500 words |
| Blog post (technical tutorial) | 2,000 words |
| Legal pages (privacy, terms, SLA) | No minimum — complete coverage matters more |
| Contact page | No minimum |

### FAQ sections (required on product and service pages)

Every plan/product page must have a FAQ section. FAQs:
- Boost SEO (FAQ schema markup)
- Capture long-tail informational queries
- Are quoted verbatim by AI tools (ChatGPT, Perplexity, Claude, Gemini)

**FAQ writing rules:**
- Questions written as a real buyer would ask them (conversational, first-person)
- Answers in clean declarative prose — one or two short paragraphs maximum
- Each answer starts by restating the key fact (AI tools grab the first sentence)
- No links inside FAQ answers (they do not render in AI citations)

Good FAQ questions:
- "How much does WordPress hosting cost at DronaHost?"
- "Does DronaHost offer a money-back guarantee?"
- "Where are DronaHost's servers located?"
- "Can I migrate my existing WordPress site to DronaHost for free?"
- "Is DronaHost hosting GDPR-compliant?"

Bad FAQ questions:
- "What makes DronaHost amazing?" (not what buyers ask)
- "How do I get started?" (too vague)

### E-E-A-T signals (required for ranking)

Google rewards pages that demonstrate Experience, Expertise, Authoritativeness, and Trustworthiness.

| Signal | Implementation |
|---|---|
| **Experience** | Case studies with before/after numbers, screenshots, client names and roles |
| **Expertise** | Author bios on all blog posts — name, role, credentials, photo |
| **Authoritativeness** | Third-party review scores (Trustpilot, G2, HostAdvice), press mentions |
| **Trustworthiness** | Company registration number, physical address, real team names and LinkedIn profiles |

### AI discoverability (ChatGPT, Perplexity, Claude, Gemini)

AI tools increasingly cite specific pages in answers. To be cited:
- All SEO-critical content must be server-rendered HTML — AI crawlers rarely execute JavaScript
- FAQ answers in declarative prose (not bullet lists — AI reads prose better)
- Factual, specific headings: "How much does WordPress hosting cost at DronaHost?" not "Pricing"
- Comparison tables with real numbers: DronaHost vs SiteGround, vs Kinsta, vs WP Engine
- Maintain `/public/llms.txt` and `/public/llms-full.txt` (see `/scripts/generate-llms-txt.ts`)

### Internal linking rules

Every page links to at least 3 related pages. Internal links:
- Use descriptive anchor text (never "click here" or "read more")
- Link to the most relevant destination (not always the homepage)
- Plan internal links before writing, not after

| Page | Must link to |
|---|---|
| `/wordpress-hosting` | `/pricing`, `/hosting/uk`, `/blog` (relevant post), `/vs/siteground` |
| `/vps-hosting` | `/pricing`, `/hosting/us`, `/security`, `/contact` |
| Blog posts | Relevant product page, `/pricing`, 1–2 other relevant blog posts |
| `/vs/[competitor]` | `/pricing`, the relevant plan page, `/contact` |

### Social proof copy rules

All testimonials and case study copy must be:
- **Real and verifiable** — full name, company name, role, LinkedIn link or company site link
- **Specific** — numbers, outcomes, before/after states
- **Permission-granted** — written consent from the person quoted
- Never paraphrased without approval — use the exact words given

What a good testimonial includes:
```
"We moved from [Competitor] to DronaHost in January and our TTFB dropped from 800ms to 190ms.
PageSpeed went from 54 to 91. That is not a rounding error — our conversion rate went up 12%."

— Sarah Mitchell, Head of E-commerce, Brackley Goods Ltd (brackleygoods.co.uk)
```

What a bad testimonial looks like (do not publish):
```
"Great hosting! Very fast and cheap. Highly recommend!"
— John S.
```

Western buyers reverse-image-search headshots and check LinkedIn. Every social proof element must survive that scrutiny.
