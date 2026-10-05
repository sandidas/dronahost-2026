# What you must replace or confirm before launch

Everything below is either **hidden** until you confirm it, or **draft copy** that needs your review. Nothing in this list is shown to the public as a fact unless noted.

## 1. Open questions (still unanswered)

1. **Billing**: `data/pricing.json` lists monthly and annual billing, so the billing toggle exists. Confirm both are real, and whether web-design pricing is one-time.
2. **True claims**: which of uptime SLA, money-back guarantee, support response time, founding year, certifications are real (section 2).
3. **Support numbers**: WhatsApp number(s), per region if any.
4. **Final USD prices** (and whether the other currencies are real).
5. **Legal entity name and registered address.**

## 2. Claims registry: `content/claims.ts` (all `verified: false`)

Flip `verified: true` only with evidence on file. Each renders automatically when verified.

| id | draft value | appears in |
|---|---|---|
| `uptime-sla` | 99.95% | `StatsBar`, llms.txt |
| `ttfb` | < 200ms | `StatsBar` |
| `first-reply` | 18 min | `StatsBar` |
| `founded` | 2019 | `StatsBar` |
| `money-back` | 30-day | pricing cards, `TrustSignals` |
| `free-ssl`, `cloudflare-cdn` | n/a | `StatsBar` |
| Payment methods (`card`, `paypal`) | n/a | `TrustBadges`, footer |

## 3. Trust items: `content/trust.ts` (all `verified: false`)

Money-back guarantee, published uptime commitment, security practices, data-center locations, DPA, support by people. Render in `TrustSignals`.

## 4. Company details: `content/company.ts` (all empty)

`legalName`, `registrationNumber`, `vatNumber`, `address`, `supportEmail`, `whatsappNumber`, `liveChatEnabled`, `socials`. The footer, contact page, Organization schema (`sameAs`) and llms.txt use these automatically once set.

## 5. Feature flags: `lib/flags.ts` (all off)

| flag | turn on when |
|---|---|
| `pricesConfirmed` | USD prices in `data/pricing.json` are final. Until then production shows "Price on request" and omits prices from meta tags, JSON-LD and llms.txt |
| `checkout` | `/checkout` exists; until then plan CTAs go to `/contact?plan=...` |
| `currencySelector` | non-USD prices are final |
| `newsletter` | an endpoint stores consented addresses (`NewsletterSignup` also needs `endpoint`) |
| `accountArea` | `/login` exists (the "Log in" link is hidden until then) |
| `comparisonPages` | every claim on `/vs/*` about DronaHost and each competitor is verified; pages return 404 until then |

## 6. Pricing data: `data/pricing.json`

- Its own `_meta.verifyPrices` says USD prices were read from a screenshot and non-USD prices are market estimates.
- Limits and capabilities (storage, RAM, backup retention, staging, etc.) drive the plan cards and comparison table; confirm them.
- `includedWithEveryPlan[].detail` contains performance multipliers ("3x faster than Apache", "7x faster reads"). The site shows only the labels; do not publish the multipliers without evidence.
- Support block on each plan lists `avgFirstResponse` ("18 minutes") and `availability` ("24/7"); not displayed.

## 7. Draft copy to review

Written to describe what the product is, with no unconfirmed numbers. Review voice and accuracy:

- `content/heroes.ts`, `content/home.ts`, `content/wordpress.ts`, `content/pages.ts`, `content/services.ts`, `content/faqs.ts`
- `content/announcement.ts` is disabled; enable only for real notices.
- Product statements to verify: LiteSpeed servers, server-level caching, staging environments, free migration, SSL on every site, backups with restore points, malware scanning/firewall, "ticket, live chat and WhatsApp" support.

## 8. Legal pages (not edited, need your/legal review)

`/privacy`, `/terms`, `/refund-policy`, `/sla`, `/security`, `/data-processing` were restyled only. They contain commitments I could not verify:

- SLA percentages (99.9% shared/WordPress/business/VPS, 99.99% cloud) and credits.
- A 30-day refund, mailboxes `privacy@`, `legal@`, `security@`, `support@dronahost.com`, a named Data Protection Officer.
- "Last updated: January 1, 2025" dates.
- `/data-processing` points to "Request the DPA" on `/contact`; no DPA PDF exists.

## 9. Sample data (never public)

`content/placeholders.ts`: sample testimonials, logos, case study, posts and code. Rendered only in `/v2` with a visible "Sample, unverified" label.

## 10. Assets

- Hero and section visuals are CSS/SVG illustrations. No customer photos, team photos or logos exist; add real ones (with names, roles, LinkedIn) via `Testimonials` and `LogoWall`.
- The official logo files contain the wordmark only (no tagline). Provide the lockup if you want the tagline shown.
- The default OG image `/images/og/default.jpg` exists; confirm it is on-brand. The Organization schema logo now points at `/logo/dronaHost-logo.png`.

## 11. Security follow-ups

- `blog/[slug]` renders database HTML with `dangerouslySetInnerHTML`; sanitize with DOMPurify (CLAUDE.md requires it) before untrusted authors can publish.
- Contact messages are stored in MongoDB (`ContactMessage`); add email notification and a retention policy, and mention it in the privacy policy.
- Rate limiting is in-memory; add Cloudflare rules in front.
