# Homepage Content Design — DronaHost v2.0

**Date:** 2026-05-26
**Author:** Claude Code (Senior Full-Stack / UI-UX / SEO)
**Status:** Approved
**Output file:** `docs/pages/home.md`

---

## Context

DronaHost is rebuilding dronahost.com as v2.0 targeting Western buyers (US, UK, EU, UAE). The primary conversion barrier is trust — buyers need to verify who they're dealing with before they purchase. Both main competitors (WP Engine, SiteGround) lead with vague positioning ("Managed Hosting & Beyond", "Web hosting & beyond") and hide pricing. Neither leads with hard performance numbers in the hero. This is the opening.

The homepage's job is to:
1. Identify the buyer's pain immediately (slow sites, unreachable support, renewal price hikes)
2. Promise specific relief (not adjectives — numbers)
3. Prove the promise with real metrics and verifiable social proof
4. Remove purchase risk (30-day money-back guarantee)

---

## Key Decisions

| Decision | Choice | Reason |
|---|---|---|
| Primary product | WordPress Hosting | Highest search volume, clearest buyer intent |
| Structure | Trust-Architecture-First | #1 CLAUDE.md priority is trust signals for Western buyers |
| Pricing in hero | Yes — "from $5/month" | Anchors expectations, filters wrong-fit buyers, outperforms competitors who hide it |
| Emotional strategy | Pain → Relief → Proof | People buy emotion; specs are proof of the emotional promise |
| Agency services | Off homepage | Cleaner conversion path; design/SEO/dev get dedicated pages |
| Testimonials | Placeholder format | Real testimonials required before publishing |

---

## Emotional Architecture

The copy is structured around three buyer pains:

1. **"My site was slow and I didn't know why"** → Relief: TTFB numbers, LiteSpeed + NVMe story
2. **"Support took hours to respond"** → Relief: 18-minute average first response, 24/7
3. **"My price doubled at renewal"** → Relief: transparent renewal pricing, no hike guarantee

Every section pairs an emotional statement with its rational proof. Specs never appear without a business-outcome translation.

---

## Section Map

| # | Section | Emotional job | H-tag |
|---|---|---|---|
| 1 | Hero | Pain recognition + solution promise + price anchor | H1 |
| 2 | Trust bar | Rational proof of emotional claims | — |
| 3 | What's included | "What you stop worrying about" — features as relief | H2 |
| 4 | Performance | Business outcome first, specs second | H2 |
| 5 | Server locations | Regional identity + GDPR/latency | H2 |
| 6 | Testimonials | Social proof with metrics (placeholder) | H2 |
| 7 | Plans | Friction-reduced, renewal price visible | H2 |
| 8 | Comparison | Rational decision support — honest, no spin | H2 |
| 9 | FAQ | 8 questions, SEO + AI citation optimised | H2 |
| 10 | Final CTA | Risk removal + company verification | H2 |

---

## SEO Targets

- **Title tag:** `Managed WordPress & VPS Hosting — DronaHost` (per content-writing-rules §7)
- **Meta description:** `LiteSpeed + NVMe hosting with [X]ms average TTFB. 99.95% uptime SLA, 18-min support response, and no price hike at renewal. From $5/month.`
- **H1:** `Managed WordPress Hosting Built for Performance`
- **Primary keyword:** managed WordPress hosting
- **Secondary keywords:** wordpress hosting uk, wordpress hosting usa, siteground alternative, gdpr compliant hosting
- **Internal links required:** `/pricing`, `/wordpress-hosting`, `/vs/siteground`, `/hosting/uk`, `/hosting/us`, `/hosting/eu`
- **Minimum word count:** 800 (product page) — target 1,000+
- **JSON-LD schemas required:** Organization, WebSite, Product, AggregateRating, FAQPage

---

## Content Rules Applied

- All adjectives replaced with specific metrics
- No prohibited patterns (no "blazing fast", "world-class", "seamless")
- CTA copy per §4: "Start hosting from $5/month" not "Get Started"
- Trust line under every CTA: "30-day money-back guarantee. No questions asked."
- Testimonials: full name / company / role / metric (placeholder format)
- FAQ: conversational first-person questions, declarative prose answers
- Heading hierarchy: one H1, H2 per section, H3 for subsections
- Pricing format: `$X/month` with renewal price visible

---

## Placeholders That Must Be Filled Before Publishing

| Placeholder | What's needed |
|---|---|
| `[TTFB_MS]` | Actual average TTFB from London, Frankfurt, New York |
| `[CUSTOMER_COUNT]` | Real number of active hosted websites |
| `[PLAN_STARTER_PRICE]` | Starting price (USD, then GBP/EUR/AED variants) |
| `[PLAN_GROWTH_PRICE]` | Growth plan price |
| `[PLAN_BUSINESS_PRICE]` | Business plan price |
| `[RENEWAL_PRICE_X]` | Renewal price per plan (must be visible — no surprise hikes) |
| `[COMPANY_REG_NUMBER]` | Company registration number |
| `[TRUSTPILOT_SCORE]` | Live Trustpilot rating |
| `[TESTIMONIAL_x]` | 3× real testimonials with full name / company / role / metric |
| `[AED_PRICE]` | UAE pricing in AED |
| `[UK_PRICE]` | UK pricing in GBP |
| `[EU_PRICE]` | EU pricing in EUR |
