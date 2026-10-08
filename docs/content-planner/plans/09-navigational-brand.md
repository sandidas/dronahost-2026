# Plan 09: Navigational and Brand

**Intent:** the searcher already knows DronaHost and wants a specific place: login, support, pricing, or independent proof that we are real.
**Goal:** be the first and the cleanest result for our own name, and make every brand search lead to a trust page, not to a rumour.
**Owns:** brand queries and brand-plus-modifier queries.

## Queries and the page that owns each

| Query (seed) | Page | Notes |
|---|---|---|
| dronahost | `/` | Homepage defines the entity in the first 50 words. |
| dronahost login, dronahost client area | `my.dronahost.com` (the WHMCS client area) | The login page may be indexed with a clear title, so existing customers find it. The rest of the client area, the cart and API paths are `noindex`. The main site links to it in the header and footer. `FEATURES.accountArea` governs only a future in-app account area, not this link |
| dronahost support, dronahost contact | `/contact` | Hours and channels only from verified claims. |
| dronahost pricing | `/pricing` | Plan 01. |
| dronahost reviews | `/reviews` (planned) | A page that links to our real profiles on Trustpilot, G2, HostAdvice and Clutch. No ratings typed by hand. |
| dronahost about, who owns dronahost | `/about` | Company registration, address, team, founding year (only when verified). |
| is dronahost legit | `/about` section or `/trust` (planned) | The honest answer: who we are, where we are based, how to verify us. |
| dronahost status | status page (planned) | External status page, linked from the footer. |
| dronahost vs [x] | `/vs/[x]` | Plan 02. |

## Entity definition (use on every key page)

One sentence in the first 50 words, the same wording everywhere. Place the wording in a single registry (for example `content/company.ts`), not retyped. The sentence says what DronaHost is and where it is based. Structured data (`Organization`, `WebSite`) uses the same name and the same facts.

Spelling: logo reads `dronahost`, prose reads `DronaHost`, domain reads `dronahost.com`. Never `Drona Host`, `DRONAHOST`, `Dronahost`.

## Brand SERP checklist

- [ ] Homepage title and description are accurate and unique
- [ ] Sitelinks point to the right pages (pricing, support, about, login)
- [ ] `Organization` schema with `sameAs` links to real profiles only
- [ ] Review profiles claimed and kept current, with real customer reviews
- [ ] LinkedIn company page and team profiles match the site
- [ ] No outdated third-party listings with wrong claims (check quarterly)
- [ ] A Wikidata or knowledge entry only if we qualify and can source it

## Trust page (`/about` or `/trust`)

Must show: registered company name and number, physical address (India is fine), Indian GST number if the owner wants it public, team names with LinkedIn links, year founded (verified), how to reach a human. Only verified items render. Anything missing is left out, never faked.

## Reviews page rules

- Link to the real profile and show the review count and score only from that source, with the date retrieved.
- Quote reviews exactly. Include name, company and a link where permission exists.
- Respond to negative reviews on the platform. Do not hide them.

## Voice

Plain and welcoming. The reader knows us. Do not re-sell. Give the answer and the way to reach us.

## Measure

Brand impressions and clicks, position of owned results on the brand SERP, review platform scores and counts, contact page conversions, brand-plus-"scam" or "legit" query trends.
