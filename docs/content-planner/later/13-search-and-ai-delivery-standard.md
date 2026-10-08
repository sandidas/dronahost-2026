# Plan 13: Search and AI Delivery Standard

**Purpose:** the technical and structural standard every page and every locale must meet before launch, so search engines and AI tools can find, read, trust and cite it.
**Applies to:** every page from Plans 01 to 12. It is a launch gate, not a content plan.

> **What this does and does not promise.** No one can make a site "100% SEO optimized" or guarantee a ranking or an AI citation. Search engines and AI tools change and do not publish their rules. What we can do is remove every technical obstacle, publish clear, true, well-sourced pages, and measure. This standard defines that. Where a claim about a search or AI system is uncertain, it is marked as an assumption to re-check.

Related: [docs/rules/seo-rules.md](../../rules/seo-rules.md) holds the implementation code. This file holds the **gates** and does not repeat the code.

## 1. Crawl and index gates

| Gate | Standard | How to check |
|---|---|---|
| Server-rendered | All indexable text, headings, prices (when allowed), FAQ and tables are in the first HTML response | View source and a no-JavaScript fetch |
| Status codes | Live pages 200. Moved pages one 301 hop. Missing pages a real 404 (not a 200). Gated locales 404 | Crawl, `npm run qa` |
| Canonical | Self-referencing on every indexable page, absolute URL, same host and protocol | Crawl, metadata test |
| Robots | Marketing pages allowed. Cart, client area, API, search results and `?` parameter variants disallowed or `noindex` | `app/robots.ts` |
| Sitemap | Only live, indexable, canonical URLs. Accurate `lastmod` tied to real content change. Locale alternates listed | `app/sitemap.ts`, Search Console |
| Internal links | Every page is reachable in 3 clicks from the home page and linked from at least 3 pages. No orphan pages | Crawl |
| Thin and duplicate | No near-duplicate pages. Each locale and region page passes the unique-value test (Plan 11) | Register check, review |
| URL hygiene | Lowercase, hyphenated, no session IDs, no query strings for content | Review |
| Redirects | Locale and region moves use 301 and update links, sitemap and hreflang in one release | Release checklist |

## 2. International gates (all waves)

- Hreflang on every live locale page: itself, all live alternates, `x-default` to the default locale. Reciprocal. Only pages that exist and are indexable.
- `<html lang>` and `dir` match the locale. Right to left for Arabic.
- `og:locale` and `og:locale:alternate` set per locale.
- One currency in the server HTML per URL. See [Plan 11](11-localization-country-language-currency.md), "Remembered currency and SEO".
- Language matches the content. A locale page is never a currency swap on copied text.
- No automatic country redirect. Crawlers from one country must reach every locale.
- Google Search Console: one domain property, plus URL-prefix properties per locale for reporting. Bing Webmaster Tools set up. International targeting relies on hreflang, locale URLs and clear page signals.

## 3. Structured data gates

| Page type | Schema | Rule |
|---|---|---|
| Every page | `BreadcrumbList`, `WebPage` | Matches visible breadcrumbs |
| Site | `Organization` and `WebSite` in one `@graph` with stable `@id` | Same name and facts as `content/company.ts`. `sameAs` lists only real profiles |
| Product pages | `Product` with `Offer` | Price and currency match the visible text, from `pricing.json`. Omitted while `pricesConfirmed` is off. No `AggregateRating` without real linked reviews |
| Guides | `BlogPosting` or `Article` | Named `author` (Person), `datePublished`, `dateModified` |
| Tutorials | `HowTo` | Only where numbered steps are visible. Treat as optional (no rich result) |
| FAQ blocks | `FAQPage` | Matches visible text exactly |
| Services | `Service` | `areaServed` honest, `provider` is the organization |

Validate with the Rich Results Test and the schema validator. `npm run qa:jsonld` runs in CI. JSON-LD `url` and `inLanguage` use the page's locale.

## 4. Performance gates (the ranking and revenue basis)

Targets from `CLAUDE.md`: LCP under 2 s (aim 1.5 s on 4G from London, New York and Dubai), INP under 200 ms, CLS under 0.1, Lighthouse 95 or more, JavaScript under 150 KB gzipped per page.

- Static or incremental generation for marketing pages. Dynamic data (domain search) is client-initiated and does not block the page.
- Cloudflare in front, HTML cached at the edge with short revalidation, static assets immutable, Brotli and HTTP/3.
- Images in AVIF or WebP through `next/image`. The LCP image has `priority`. Below-fold images lazy. Width and height always set.
- Fonts through `next/font`, Latin subset, Arabic subset added for `ar-AE` only.
- Third-party scripts after interaction. Analytics cookieless where possible.
- The currency swap and the consent banner must not shift layout.
- Check with Lighthouse and field data (Search Console Core Web Vitals) per locale.

## 5. Search engine content gates

- Unique title (60 characters or fewer, no brand suffix typed) and unique description (160 or fewer).
- One H1 that matches the primary keyword and intent. Logical H2 and H3 order.
- Direct answer (40 to 80 words) under the H1 and under question headings.
- Primary keyword in the H1, the first 100 words and one H2. No stuffing.
- 3 or more internal links with descriptive anchors.
- Image `alt` text that describes the image.
- Named author or owner, `Reviewed on` date, sources cited.
- Passes the plan's pre-ship checklist and the voice self-check.

## 6. AI search and answer-engine gates

What is solid: AI tools and AI Overviews read server-rendered text, favour pages that already rank and are trusted, and quote self-contained passages. What is assumption: exactly how each tool picks sources. Re-check quarterly.

| Gate | Standard |
|---|---|
| Answer-first passages | Each question heading is followed by a 40 to 80 word standalone answer (see [Plan 10](../plans/10-ai-search-queries.md)) |
| Entity clarity | One identical line defining DronaHost, in the first 50 words of key pages, from `content/company.ts`. Same name spelling everywhere |
| Citable facts | Specific, sourced, dated. Tables with real figures. No unsupported superlatives |
| Crawler access | `robots.txt` states the policy for AI crawlers explicitly (allowed by default for search and answer bots; the decision on training bots is the owner's, recorded in `seo-rules.md`). Cloudflare bot settings must not silently block the bots we allow |
| Freshness | `dateModified` and `lastmod` change only on real edits, and a review date is visible |
| Consistency | The same fact says the same thing on every page, in every locale. Facts are single-sourced (claims, pricing, company) |
| Corrections | When an AI tool states something wrong, fix the source page first, then record it in the monthly check |
| `llms.txt` | Optional and cheap. Generated by `scripts/generate-llms-txt.ts`. No major provider has confirmed using it, so it is never a substitute for the items above |

## 7. Fast discovery

- **IndexNow** (supported by Bing and some other engines, not Google): ping on publish, on a price change and on a redirect. Fire it from the same step that updates `lastmod` (A10 in [Plan 12](12-whmcs-data-and-automation.md)). Needs a key file on the site. Plan the key file in `public/`.
- **Google:** the sitemap and internal links are the route. Use URL Inspection for key launches. Do not abuse the indexing API.
- **Bing Webmaster Tools:** submit the sitemap and watch coverage. Some AI assistants are reported to use Bing results (assumption, re-check).

## 8. Trust gates (they decide conversion and citation)

- Footer and about page show the registered company name and number, address (India is fine), tax numbers where applicable, and real team names with profile links, only from verified registries.
- Policy pages exist and are published and reviewed before claims that depend on them render.
- Review profiles are real and linked. No ratings typed by hand.
- Accessibility to WCAG 2.1 AA: `npm run qa:axe` passes. Keyboard use works through the switcher and the consent banner.
- Consent banner offers reject-all as prominently as accept-all. The preferences category names the currency memory.

## 9. Launch checklist for a page or locale

- [ ] Plan checklist done (the page's own plan)
- [ ] Sections 1 to 8 above pass on a production build
- [ ] `npm run check:pages`, `lint:content`, `check:register`, `qa` pass
- [ ] Submitted in Search Console and Bing, IndexNow pinged
- [ ] Registered in the keyword register with owner and review date
- [ ] Monitoring set (below)

## 10. Monitoring

| Cadence | Task |
|---|---|
| Weekly | Search Console: coverage and indexing errors, Core Web Vitals, new queries and their pages, hreflang errors |
| Weekly | Bing Webmaster: coverage and crawl errors |
| Monthly | AI spot-check: 20 target questions across ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews. Record mentions and wrong facts in the register |
| Monthly | Drift and freshness: price drift check clean, pages past their review date listed |
| Quarterly | Crawl the whole site (broken links, orphans, duplicate titles, canonical and hreflang audit), refresh this standard and the assumptions in section 6 |
| After any release touching routing, locale or metadata | Re-run the crawl and the hreflang check |

## 11. What would make us fail (watch list)

JavaScript-only content, a locale page that duplicates another, a price in structured data that differs from the page, a stale comparison page, a blocked AI or search crawler by mistake, cart pages indexed, missing or one-way hreflang, layout shift from the currency swap, claims on a page that no verified source backs, and generated pages with no unique value.
