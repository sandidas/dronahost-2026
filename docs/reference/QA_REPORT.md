# QA report

Run against the production build (`npm run build`, `npx next start -p 3200`), where numeric prices are hidden. Re-run any time with `npm run qa`.

## Results

| Check | Result |
|---|---|
| Token contrast (`npm run check:contrast`) | **74 of 74 pairs pass** WCAG AA (light and dark). White on `#FE5504` (3.22:1) and `#05A2C6` (3.00:1) fail by design and are never used; brand fills carry ink text |
| Axe (WCAG 2.0 to 2.2 A/AA) | **0 violations of any severity** on all 23 public routes (dark theme; light also on the 5 key pages and 4 regional pages) |
| Internal links | **All 19 internal targets resolve** (database-backed `/blog/<slug>` skipped without MongoDB) |
| JSON-LD | **48 schema nodes valid** across 23 routes (Organization, WebSite, BreadcrumbList, FAQPage, Service, Blog); FAQ questions are checked to be visible on the page |
| Raw HTML entities | **None** in rendered text or attributes on 23 routes |
| Status codes | Unknown routes and dev-only routes return a real **404** |
| Typecheck / build | Pass |

## Lighthouse (production build)

| Page | Mobile perf | Desktop perf | A11y | Best practices | SEO | Mobile LCP | CLS |
|---|---|---|---|---|---|---|---|
| `/` | 95 | 100 | 100 | 100 | 100 | 3.0 s | 0 |
| `/pricing` | 95 | 100 | 100 | 100 | 100 | 2.9 s | 0 |
| `/wordpress-hosting` | 95 | 100 | 100 | 100 | 100 | 2.9 s | 0 |
| `/about` | 97 | 100 | 100 | 100 | 100 | 2.6 s | 0 |
| `/contact` | 94 | 100 | 100 | 100 | 100 | 3.0 s | 0 |

Desktop LCP is 0.6 to 0.8 s. Raw reports are in `docs/reference/lighthouse/`.

### Where we miss the brief

- **Mobile LCP is 2.6 to 3.0 s on Lighthouse's simulated slow-4G profile** against a target of under 2.0 s. First paint is 1.1 to 1.2 s, and in a real mobile browser the hero headline paints within about 0.3 s, so this is mostly the simulation; field data from real users (CrUX / Cloudflare) is the true test.
- **Client JavaScript is about 178 KB gzipped per page** (242 KB on `/contact`, which ships Zod for client validation) against a target of under 150 KB. Most of that is the React/Next framework baseline. Possible savings: lighter hand-written validation on the contact form, and dropping `next-themes` for a tiny inline script.
- Mobile perf scores were 81 to 94 before three fixes: server-rendered `dark` class, no preload of the unused mono font, and a server-side announcement bar that ships no JS when disabled.

## Fixes made during QA

- Soft 404s: the root layout wrapped every page in `Suspense`, so `notFound()` returned HTTP 200. Removed; dev-only routes now 404 in production.
- `/login` prefetch hung and the route does not exist: the "Log in" link is hidden behind `FEATURES.accountArea`.
- Contact form: it said "Message sent" while the API only logged the message. Messages are now stored in MongoDB with validation, a honeypot and a rate limit; failures are reported honestly.
- `llms.txt`/`llms-full.txt` published unverified prices, SLAs, certifications and an email address; the generator now derives everything from verified sources.
- Organization schema: guessed `sameAs` social URLs removed; logo URL fixed.
- Dead DPA PDF link replaced with a "Request the DPA" link.
- `/vs/*` competitor pages (unverified claims) return 404 behind a flag; regional pages are claim-free with hreflang.

## Known gaps

- `/blog/<slug>` returns 500 when MongoDB is unreachable (it should show a 503 page).
- Legal pages are restyled but not reviewed; see `PLACEHOLDERS.md` section 8.
- Axe cannot judge colour contrast on unverified-sample content in `/v2`, which is development-only.
- The `/v2` showcase was not Lighthouse-tested (development only).

## Screenshots

Before: `docs/reference/before/v2-{1440,820,390}.png`. After, by stage, in `docs/reference/after/`: `design-system-*` (Phase 2), `batch-a/` (navigation), `batch-b/` (heroes), `batch-c/` (sections), `batch-d/` (pricing), `batch-ef/` (social proof and content blocks), `surfaces-100pct.png`, `logo-both-themes.png`.
