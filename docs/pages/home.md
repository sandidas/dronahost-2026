# DronaHost Homepage — Content Plan

> **File purpose:** Complete copy for every section of the homepage.
> Developers and designers use this as the single source of truth for text, CTA labels, and section order.
> Replace all `[PLACEHOLDER]` values with real data before publishing.
> Follow `docs/rules/content-writing-rules.md` for any edits.

---

## SEO Metadata

```
Title:        Managed WordPress & VPS Hosting — DronaHost
Meta desc:    LiteSpeed + NVMe hosting with [TTFB_MS]ms average TTFB. 99.95% uptime SLA,
              18-min support response, and no price hike at renewal. From $5/month.
H1:           Managed WordPress Hosting Built for Performance
Canonical:    https://dronahost.com/
```

**JSON-LD schemas required:** Organization, WebSite, Product, AggregateRating, FAQPage

**Internal links this page must include:**
- `/wordpress-hosting` — from "WordPress hosting" in body
- `/pricing` — from plan CTAs
- `/vs/siteground` — from comparison section
- `/hosting/uk` — from UK server location card
- `/hosting/us` — from US server location card
- `/hosting/eu` — from EU server location card
- `/security` — from security features mention
- `/sla` — from uptime SLA mention

---

## Section 1 — Hero

**Component:** `HomeHeroBanner`

### H1
```
Managed WordPress Hosting Built for Performance
```

### Subheadline
```
Slow sites lose sales. Unreachable support wastes hours. Renewal price hikes erode trust.
DronaHost fixes all three.
```

### Body copy
```
LiteSpeed Web Server + NVMe SSD storage. 18-minute average first response. No price increase
at renewal. Servers in the US, UK, EU, and UAE. From $5/month.
```

### Trust line (above CTAs)
```
99.95% uptime SLA — with automatic service credits if we miss it.
```

### CTAs
```
Primary:   Start hosting from $5/month          → /pricing
Secondary: See how it compares                  → /vs/siteground
```

### Support line (beneath CTAs)
```
30-day money-back guarantee. No questions asked.
```

---

## Section 2 — Trust Bar

**Component:** `StatsBar`
**Position:** Immediately below the hero fold. No heading — the numbers speak.

| Stat | Label |
|---|---|
| 99.95% | Uptime SLA with automatic service credits |
| [TTFB_MS]ms | Average TTFB from London, Frankfurt, and New York |
| [CUSTOMER_COUNT]+ | Websites hosted across US, UK, EU, and UAE |
| 18 min | Average first support response, 24/7 |

> **Design note:** Each stat should link to its proof page.
> Uptime → `/sla` · TTFB → `/wordpress-hosting#performance` · Support → `/support`

---

## Section 3 — What's Included

**Component:** `FeatureGrid`

### H2
```
Everything That's Included — No Hidden Add-Ons
```

### Lead paragraph
```
Every DronaHost WordPress hosting plan includes the same core set of features.
No essential features locked behind higher tiers. No annual SSL invoice.
No "you need to upgrade for backups."
```

### Feature items (icon + name + one-sentence relief copy)

**Free SSL Certificate**
> Your site stays secure and the browser padlock appears on day one. Renewed automatically — you will never see an SSL invoice.

**Daily Backups**
> 30 days of off-server backups included on every plan. Restore your entire site in one click if anything goes wrong.

**Free Migration**
> We move your existing WordPress site from any host. You do not touch the server. Our migration team targets zero downtime.

**LiteSpeed Web Server + LSCache**
> LiteSpeed processes WordPress requests up to 3× faster than Apache. LSCache eliminates redundant PHP execution on every page load.

**NVMe SSD Storage**
> NVMe delivers 7× faster read speeds than standard SSD. Faster storage means faster database queries and faster WordPress admin.

**Cloudflare DDoS Protection**
> Your site stays online even if someone tries to take it down. Cloudflare's network absorbs attack traffic before it reaches your server.

**cPanel Dashboard**
> Manage files, databases, email accounts, and DNS from a single dashboard. Industry-standard interface — no proprietary lock-in.

**Staging Environment**
> Test theme updates, plugin upgrades, and code changes on a private copy of your site before they go live. Break things safely.

**One-Click WordPress Install**
> WordPress, configured and ready, in under 4 minutes from the moment you confirm your plan.

**GDPR-Compliant Infrastructure**
> EU customer data stored on EU servers. Data Processing Agreement available on request. Meets GDPR Article 3 requirements.

---

## Section 4 — Performance

**Component:** `TwoColumn` (copy left, benchmark visual right)

### H2
```
Speed Is a Business Decision, Not a Technical One
```

### Lead paragraphs
```
Google ranks faster sites higher. Visitors leave slow ones within 3 seconds. Every 100ms
of added latency costs measurable conversion rate — this is not a theory, it is documented
across e-commerce benchmarks at scale.

DronaHost uses LiteSpeed Web Server with NVMe SSD storage on every plan. Our average TTFB
is [TTFB_MS]ms from London, New York, and Frankfurt — measured on live customer sites,
not a controlled benchmark environment.
```

### 3-column performance breakdown

**LiteSpeed Web Server**
> LiteSpeed processes WordPress at up to 3× the throughput of Apache under the same load. For WordPress specifically, LiteSpeed's built-in ESI cache removes the performance ceiling that standard caching plugins hit at scale.
> *Used by: Kinsta, Cloudways, A2 Hosting*

**NVMe SSD Storage**
> NVMe delivers 7× faster read speeds than standard SSD and significantly lower latency on random reads — the workload pattern of WordPress database queries. Faster storage means faster `WP_Query`, faster admin, faster everything.

**Cloudflare Edge Network**
> Your static assets — images, CSS, JavaScript — are served from 300+ Cloudflare edge locations globally. Visitors in Tokyo, Toronto, or Cape Town get your assets from a nearby node, not your origin server.

### Benchmark callout (pull quote style)
```
"Average TTFB: [TTFB_MS]ms from London · [TTFB_MS_NY]ms from New York · [TTFB_MS_FRA]ms from Frankfurt"
Measured on live DronaHost customer sites · [BENCHMARK_DATE]
```

### Internal link line
```
→ See the full performance breakdown on our WordPress Hosting page
```

---

## Section 5 — Server Locations

**Component:** `FeatureGrid` (4 region cards)

### H2
```
Your Customers Deserve Local Speed
```

### Lead paragraph
```
A US server hosting a UK business adds 80–120ms of latency on every single request.
That is not a rounding error — it shows up in your Core Web Vitals, your Google ranking,
and your bounce rate. Pick the region your customers are in. Move later if you expand.
```

### Region cards

**United States 🇺🇸**
- Datacenter: New York / Chicago / Los Angeles
- Best for: US and Canadian audiences, e-commerce, SaaS
- From: $[PLAN_STARTER_PRICE]/month
- Compliance: Suitable for CCPA-aware deployments
- CTA: `See US hosting plans → /hosting/us`

**United Kingdom 🇬🇧**
- Datacenter: London
- Best for: UK businesses, UK SEO rankings, UK e-commerce
- From: £[UK_PRICE]/month + VAT
- Compliance: UK GDPR compliant · ICO-aligned data practices
- CTA: `See UK hosting plans → /hosting/uk`

**European Union 🇪🇺**
- Datacenter: Frankfurt / Amsterdam
- Best for: EU businesses, GDPR data residency, DE / NL / FR audiences
- From: €[EU_PRICE]/month
- Compliance: EU data residency · GDPR Article 3 · SCCs available
- CTA: `See EU hosting plans → /hosting/eu`

**United Arab Emirates 🇦🇪**
- Datacenter: Dubai
- Best for: UAE businesses, GCC e-commerce, Arabic-language sites
- From: AED [AED_PRICE]/month
- Compliance: UAE PDPL aligned
- CTA: `See UAE hosting plans → /hosting/uae`

---

## Section 6 — Testimonials

**Component:** `Testimonials`

### H2
```
What Changes When Your Host Actually Works
```

### Lead paragraph
```
These are not cherry-picked edge cases. These are the outcomes businesses typically
see when they move from a host that was slowing them down.
```

### Testimonial cards (3 — all fields required before publishing)

**Card 1**
```
"[QUOTE — lead with emotional outcome, e.g. 'I stopped dreading Monday mornings waiting
to see if the site was up.' Include one specific metric: TTFB, PageSpeed score,
or conversion rate change.]"

— [FULL NAME], [ROLE], [COMPANY NAME]
   [company-website.com] · [LinkedIn URL]
```

**Card 2**
```
"[QUOTE — focus on support experience or migration. E.g. 'We moved from SiteGround in
an afternoon and our PageSpeed went from [X] to [Y].']"

— [FULL NAME], [ROLE], [COMPANY NAME]
   [company-website.com] · [LinkedIn URL]
```

**Card 3**
```
"[QUOTE — focus on renewal pricing or value. E.g. 'The renewal price was exactly
what we signed up for. First time that has happened with any host.']"

— [FULL NAME], [ROLE], [COMPANY NAME]
   [company-website.com] · [LinkedIn URL]
```

> **Publishing requirement:** Written consent required. Full name, company, role, and a
> verifiable link (LinkedIn or company site) are mandatory. No anonymous quotes.
> Western buyers reverse-image-search headshots and check LinkedIn.

### Trust badge row (beneath testimonials)
```
[Trustpilot] [TRUSTPILOT_SCORE] / 5  ·  [G2 badge]  ·  [HostAdvice badge]
```

---

## Section 7 — Plans

**Component:** `PricingCards`

### H2
```
Pick a Plan. Your Site Is Live in Under 4 Minutes.
```

### Sub-copy
```
All plans include free migration, daily backups, free SSL, and LiteSpeed + NVMe performance.
No setup fees. No essential features locked behind higher tiers.
```

### Plan cards

**Starter**
- Price: `$[PLAN_STARTER_PRICE]/month, billed annually`
- Renewal: `Renews at $[RENEWAL_STARTER]/month — same price, no increase`
- Ideal for: Single WordPress site, personal brand, small business
- Storage: [X]GB NVMe SSD
- Bandwidth: [X]GB/month
- Sites: 1
- CTA: `Start Starter — $[PLAN_STARTER_PRICE]/month`
- Trust: `30-day money-back guarantee`

**Growth** *(most popular)*
- Price: `$[PLAN_GROWTH_PRICE]/month, billed annually`
- Renewal: `Renews at $[RENEWAL_GROWTH]/month — same price, no increase`
- Ideal for: Growing businesses, WooCommerce stores, high-traffic blogs
- Storage: [X]GB NVMe SSD
- Bandwidth: [X]GB/month
- Sites: Up to 3
- CTA: `Start Growth — $[PLAN_GROWTH_PRICE]/month`
- Trust: `30-day money-back guarantee`

**Business**
- Price: `$[PLAN_BUSINESS_PRICE]/month, billed annually`
- Renewal: `Renews at $[RENEWAL_BUSINESS]/month — same price, no increase`
- Ideal for: Agencies, client sites, multi-site WordPress installs
- Storage: [X]GB NVMe SSD
- Bandwidth: [X]GB/month
- Sites: Up to 10
- CTA: `Start Business — $[PLAN_BUSINESS_PRICE]/month`
- Trust: `30-day money-back guarantee`

### Below plan cards
```
All prices shown in USD. UK customers: see GBP pricing → /hosting/uk
EU customers: see EUR pricing → /hosting/eu · UAE customers: see AED pricing → /hosting/uae

Need more than 10 sites or a custom configuration? Talk to the team → /contact
```

---

## Section 8 — Comparison Table

**Component:** Standalone comparison table

### H2
```
How DronaHost Compares to SiteGround and WP Engine
```

### Lead paragraph
```
We are not the biggest host. We are not trying to be. Here is an honest comparison
of what matters to a Western business buying WordPress hosting in 2026.
Figures sourced from published pricing and published SLAs — verified [VERIFIED_DATE].
```

### Comparison table

| | DronaHost | SiteGround | WP Engine |
|---|---|---|---|
| **Starting price** | $[PLAN_STARTER_PRICE]/month | $2.99/month (intro) | $20/month |
| **Renewal price** | Same as intro — no hike | $17.99/month (+503%) | $20/month |
| **Uptime SLA** | 99.95% with service credits | 99.9% | 99.95% |
| **Avg TTFB** | [TTFB_MS]ms | ~350ms | ~280ms |
| **Free migration** | Yes — handled by our team | Yes (1 site on Starter) | Paid plans only |
| **Support response** | 18 min avg, 24/7 | ~10 min avg | ~15 min avg |
| **Server locations** | US, UK, EU, UAE | US, EU, Asia | US, EU, Asia |
| **Money-back guarantee** | 30 days | 30 days | 60 days |
| **EU GDPR data residency** | Yes | Yes | Yes |
| **UAE server location** | Yes | No | No |

### Callout beneath table
```
SiteGround's introductory price of $2.99/month rises to $17.99/month at renewal.
DronaHost charges the same price on renewal as at signup — always.
```

### CTAs beneath table
```
Primary:   Switch to DronaHost — see plans     → /pricing
Secondary: Read the full comparison             → /vs/siteground
```

---

## Section 9 — FAQ

**Component:** `FAQSection` (with FAQPage JSON-LD schema)

### H2
```
Frequently Asked Questions
```

---

### Q1: How much does WordPress hosting cost at DronaHost?

WordPress hosting at DronaHost starts at $[PLAN_STARTER_PRICE]/month, billed annually. The Growth plan starts at $[PLAN_GROWTH_PRICE]/month and the Business plan at $[PLAN_BUSINESS_PRICE]/month. UK customers are billed in GBP from £[UK_PRICE]/month + VAT. EU customers are billed in EUR from €[EU_PRICE]/month. All prices are the same at renewal — we do not raise prices after the introductory period.

---

### Q2: Does DronaHost offer a money-back guarantee?

DronaHost offers a 30-day money-back guarantee on all WordPress hosting plans. If you are not satisfied for any reason within the first 30 days, contact our support team and we will refund your payment in full. No questions asked and no deductions for usage.

---

### Q3: Where are DronaHost's servers located?

DronaHost operates servers in the United States (New York, Chicago, Los Angeles), the United Kingdom (London), the European Union (Frankfurt and Amsterdam), and the United Arab Emirates (Dubai). You choose your server region when you sign up. EU and UK servers meet GDPR data residency requirements.

---

### Q4: Can I migrate my existing WordPress site to DronaHost for free?

Yes. Every DronaHost plan includes a free migration handled by our team. You give us access to your current host and we move your site — files, database, emails, and DNS — targeting zero downtime. Most migrations are complete within 4 hours. Contact us before you sign up if you have a complex multi-site setup.

---

### Q5: Is DronaHost hosting GDPR-compliant?

Yes. EU customer data is stored on EU-region servers in Frankfurt or Amsterdam. DronaHost provides a Data Processing Agreement (DPA) on request, which is required under GDPR for businesses processing personal data via a third-party host. UK customers are covered under UK GDPR with ICO-aligned data practices.

---

### Q6: What happens if my site goes down?

DronaHost's infrastructure is monitored 24/7. If a server-side issue causes downtime, our team is automatically alerted and begins investigation immediately. You can open a support ticket at any time — our average first response is 18 minutes. If our uptime falls below the 99.95% SLA in any calendar month, you receive automatic service credits without needing to ask.

---

### Q7: Does the price go up when I renew?

No. The price you sign up at is the price you pay at renewal. DronaHost does not use introductory pricing that jumps at renewal. The renewal price is shown alongside the signup price on every plan card so there are no surprises.

---

### Q8: What is the difference between DronaHost and SiteGround?

The most significant difference is renewal pricing. SiteGround's introductory price starts at $2.99/month but rises to $17.99/month at renewal — a 6× increase. DronaHost charges the same price at renewal as at signup. On performance, DronaHost averages [TTFB_MS]ms TTFB from London compared to approximately 350ms on independent SiteGround tests. DronaHost also offers server locations in the UAE, which SiteGround does not. See the full comparison at dronahost.com/vs/siteground.

---

## Section 10 — Final CTA

**Component:** `CTASection`

### H2
```
Start With Zero Risk
```

### Body copy
```
Every DronaHost plan includes a 30-day money-back guarantee. If you are not satisfied
for any reason within the first 30 days, we return your money in full.
No questions asked. No conditions. No partial refunds.

Your site will be live in under 4 minutes. Our team handles the migration if you
are moving from another host. And if anything goes wrong after that — we respond
in 18 minutes on average, around the clock.
```

### CTAs
```
Primary:   Start hosting from $5/month          → /pricing
Secondary: Talk to the team first               → /contact
```

### Trust line beneath CTAs
```
30-day money-back guarantee · No setup fee · Cancel anytime
```

### Company verification (builds Western buyer trust)
```
DronaHost · Company registration [COMPANY_REG_NUMBER]
[REGISTERED_ADDRESS]
hello@dronahost.com · dronahost.com

Trustpilot: [TRUSTPILOT_SCORE]/5  ·  [TRUSTPILOT_REVIEW_COUNT] reviews
```

---

## Publishing Checklist

Before this content goes live, confirm:

- [ ] All `[PLACEHOLDER]` values replaced with real data
- [ ] All 3 testimonials have written consent, full name, company, role, verifiable link
- [ ] Trustpilot / G2 / HostAdvice scores are current
- [ ] Comparison table figures verified against competitor published pricing
- [ ] TTFB benchmarks measured on live infrastructure (not a test environment)
- [ ] Company registration number and address confirmed
- [ ] UK / EU / AED pricing variants exist on `/pricing` and regional pages
- [ ] `generateMetadata()` written with title and meta description above
- [ ] JSON-LD schemas implemented: Organization, WebSite, Product, AggregateRating, FAQPage
- [ ] Hreflang tags added for en-US, en-GB, en-AE
- [ ] Internal links tested (all linked pages exist before launch)
- [ ] Page reviewed against `docs/rules/content-writing-rules.md` prohibited patterns list
