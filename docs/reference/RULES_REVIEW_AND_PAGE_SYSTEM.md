# DronaHost: Rules review and JSON page system

Reviewed: `brand-identity.md`, `ui-ux-rules.md`, `content-writing-rules.md`, `seo-rules.md`, `coding-rules.md`.
Not reviewed line by line: UI/UX §7 items 12-15 (toast, skeleton, FAQ accordion, scroll bar) and §16-17
(quick reference, responsive). Nothing in their headings conflicts with the findings below.

Overall: the rules are unusually thorough and most of the thinking is sound (server rendering, claims
discipline, the /v2 review gate, no fake testimonials). The problems are (1) the files contradict each other,
(2) several rules are outdated or factually wrong, (3) example text in the rules contains unverified claims
that Claude Code will copy as facts, and (4) the audience is "Western buyers" while your goal is worldwide
small business owners.

---

## Part 1: Decisions only the owner can make

Everything else in this document can be applied now. These eight cannot be fixed until you decide.

| # | Conflict | Where | Recommendation |
|---|---|---|---|
| 1 | **Indigo `#4F46E5` is the "primary UI color"**, but it is not in your official brand palette (Brand Assets page), and the same file bans purple gradients. The old site's messy indigo/violet/pink buttons came from this. | ui-ux §2 | Remove indigo. Use navy `#092F49` family for surfaces and trust UI, orange for the single primary action, teal for links and data. |
| 2 | **Orange hex differs:** `#FE5403` (brand-identity, ui-ux, coding) vs `#FE5504` (Brand Assets page, current /v2). | all | Pick the value inside the official logo SVG. Define it once in `tokens.css`. |
| 3 | **Default theme:** ui-ux says light is the default; the new design system is dark by default. | ui-ux §1 | Dark default, with system preference respected on first visit. |
| 4 | **Logo on dark backgrounds:** brand-identity says reverse to all-white, but the Brand Assets page says "do not reverse" and "do not recolor". The new /v2 shows the orange/teal logo on dark navy. | brand-identity | Decide which is official, then make both documents say the same thing. |
| 5 | **Renewal policy:** ui-ux requires the exact phrase "No price increase on renewal" on every pricing page. content-writing's urgency example says "$5/month ... renews at $7/month". | ui-ux §11, content §4 | Pick one real policy. `pricing.json` currently says renewal equals signup price. |
| 6 | **Company facts differ:** founding year 2022 (SEO schema) vs 2019 (old site, sample stats); contact email `hello@` vs `sales@`; "Alphabet Force" as legal entity. | seo §2, ui-ux §11, content §5 | Give me the verified values. They go into `content/claims.ts` and nowhere else. |
| 7 | **URL map conflicts between files:** ui-ux uses `/managed-vps-hosting`, `/domain`, `/wordpress-website-design`, `/contact-us`, `/privacy-policy`, `/terms-of-service`. seo and the sitemap use `/vps-hosting`, `/domains`, `/web-design`, `/contact`, `/privacy`, `/terms`. | ui-ux §13 vs seo §3 | Use your **current live URLs** wherever they already rank, and add redirects for the rest. Send me the sitemap or a Search Console export. |
| 8 | **Regions:** `/hosting/uk` (regional landing page) and `/en-gb/...` (locale) both serve UK visitors. | coding §13, seo §4 | Start with one English site, USD default, and a currency selector. Add `/en-gb` etc. only when the content genuinely differs (data location, legal, testimonials). |

---

## Part 2: Corrections to apply now

### 2.1 Audience: worldwide, not "Western"

Rules currently say "Western buyers/businesses" about a dozen times, ban INR display, and call India a
"wrong market". Your goal is educated small business owners worldwide, including wealthy Indian metros.

Replace the audience paragraph everywhere with:

> **Audience:** educated small-business owners, freelancers and agencies worldwide who read English as a
> first or second language. They are smart but not necessarily technical. They compare providers carefully
> and distrust hype.

Add to content rules:
- Reading level: roughly grade 8-10. Average sentence under 20 words. No idioms or slang that does not
  translate ("hit the ground running", "ballpark").
- Lead with the business outcome in plain words. Put the technical term second, in the same sentence or in a
  short "How it works" line. Example: "Your site stays online while we update it (LiteSpeed server, NVMe storage)."
  This replaces "use the correct term, not the dumbed-down one", which suits developers, not business owners.
- Dates written unambiguously ("6 October 2026"). Units shown with their symbol. Currency symbol and period
  on every price.
- US English by default. `en-GB` variants only when that locale exists.
- Rename the section "Prohibited patterns (Indian English / salesy)" to **"Phrases to avoid"**. Keep the list
  (it is good advice), but frame it as clarity and credibility rather than nationality.
- Rewrite example H1 "We Build Hosting Infrastructure for Western Businesses". It excludes most of your audience.
- Change "Do NOT display prices in INR by default" to "Default currency is USD. Offer GBP, EUR, AED and INR
  through a selector or locale. Never show a currency without its symbol and billing period."

### 2.2 Claims inside the rules (highest risk)

The rule files contain example copy with numbers that Claude Code will reuse as if verified: "99.95% uptime SLA",
"200ms TTFB from London, Frankfurt and New York", "average first response 18 minutes", "live in under 4 minutes",
"from $5/month", "$5.99", "10 GB NVMe", "DDoS protection via Cloudflare", "Founded 2022". Several were already
flagged by the audit as unverified, and they contradict your own rule "no claims without data".

Fix:
1. Create `content/claims.ts`, one entry per claim: `id`, `text`, `value`, `status` (`verified` | `unverified`),
   `source` (URL or document), `verifiedBy`, `verifiedOn`.
2. In every rules file, wrap example numbers in `[EXAMPLE, NOT VERIFIED]` or replace them with `{{claim:...}}`.
3. Add this rule to content and coding rules: "Copy never contains a number, guarantee, SLA, location or
   certification that is not rendered from `claims.ts` with `status: verified`. Unverified claims render nothing."
4. Pricing comes only from `data/pricing.json`. Rules must not contain prices. (Currently: `$5`, `$7`, `$5.99`,
   `$15`, `£12`, and plan names Starter/Business, which differ from pricing.json's Starter/Growth/Pop and the
   old site's Essential/Core/Enterprise.)

### 2.3 Colour and accessibility

- ui-ux §2.4 contrast table is wrong. White on `#FE5504` is **3.22:1** and white on `#05A2C6` is **3.00:1**
  (measured in the audit), not 3.7 and 3.2.
- The light-mode tokens fail too (approximate, the checker script will confirm):
  - `--orange #E04800` with `--text-on-orange #FFFFFF` is about **4.1:1** and fails for 14px button text.
  - `--text-muted #9BA3B8` on `#FAFBFC` is about **2.4:1**, and dark `--text-muted #555C72` on `#08090A` is about **3:1**.
    Both fail for body-size text.
- "Large text" in WCAG means 24px regular or 18.66px bold, not "18px+".
- Fix: orange fills carry **navy text** (`#07131F` on `#FE5504` measured 5.81:1) or use the deeper `#C23700`
  with white text (5.47:1). Teal text on white uses `#027280` (5.64:1).
- **Stop duplicating hex values in the rules.** The rules should point to `app/styles/tokens.css` as the single
  source and enforce it with `scripts/check-contrast.ts` in CI.

### 2.4 Token systems: one, not three

Three naming systems coexist: `--bg-primary / --accent-primary / --text-primary` (ui-ux §2.5),
shadcn-style `--background / --primary / --accent / --card / --muted` (ui-ux §18), and Tailwind
`bg-brand-orange` (coding §11). §18.4 even maps `--primary` to indigo and `--accent` to orange, which clashes
with the new token set.

Fix: keep the new `tokens.css` names and delete §2.5, §2.6 and §18.4 from the rules. Tailwind v4 uses
`@theme` in CSS, so the `tailwind.config.ts` example in §2.6 is out of date and contradicts coding §11.
Enforce "no raw hex and no Tailwind palette classes" with a lint rule or a CI grep. The audit found 387
`slate-*`, 104 `gray-*` and 68 `orange-*` classes, so the rule exists but is not enforced.

### 2.5 Motion rules (align with the motion brief)

| Current rule (ui-ux §8) | Problem | Replace with |
|---|---|---|
| Hero entrance: H1 → subtitle → CTAs → trust bar, staggered fade-up | The H1 is usually the LCP element. Animating it delays LCP, which also conflicts with the <1.5s target. | No entrance animation above the fold. |
| Scroll reveal `translateY(24px)`, 500ms | Fine in principle, but 24px is dramatic. | 14px, 700ms, `ease-out`, once, max 6 staggered items (see motion brief). |
| Button `scale(1.02)` hover, `scale(0.97)` active | Hover scale on buttons feels cheap and shifts text rendering. | Hover: 1px lift plus brightness. Active: `scale(0.98)`. |
| `--ease-bounce` "sparingly" | Bounce reads playful, not premium. | Remove. |
| Hero CTA, `--gradient-accent` buttons | Gradient fills conflict with "calm". | Flat fills with a hairline highlight. |

### 2.6 Content rule fixes

- **Length rules are inconsistent with their own examples.** H1 must be 40-70 chars, yet "Talk to the Team" (16)
  is given as an example. H2 must be 30-60, yet "Frequently Asked Questions" (26) is listed as good. Title tags
  must be 50-60, yet "Hosting Plans & Pricing — DronaHost" (35) and "Contact DronaHost — Talk to the Team" (36) are the
  examples. Google truncates by pixel width, not characters. Make these guidelines: titles **≤60**, descriptions
  **≤160**, H1 **≤70**, and fail the linter only on missing, duplicate or over-length values.
- **Brand suffix duplicated:** `buildMetadata()` appends " — DronaHost", but the content rules show titles that
  already include it, so you will get "— DronaHost — DronaHost". The layout also uses template `%s | DronaHost`
  (pipe), against the "em dash, not pipe" rule. Pick one: the helper appends the suffix, and titles in the rules
  are written without it.
- **Banned CTAs used in the rules themselves:** ui-ux §12 uses "Order Now" and "Get Started"; both are banned in
  content §4.
- **"Try free for 30 days"** implies a free trial. A money-back guarantee is not a trial. Use "30-day money-back
  guarantee" only, and only if verified.
- **Meta description in layout sample** ("Enterprise-grade hosting with premium support") breaks the
  rule against vague superlatives.
- **FAQ answer length:** content says "one or two short paragraphs", SEO says "40-60 words". Use 40-80 words, answer
  in the first sentence.
- **Years in titles:** content/SEO rules want "DronaHost vs SiteGround — Honest Comparison 2026", but the
  design brief says no years in copy. Reconcile: years are allowed only on pages that are reviewed on a schedule
  (comparisons, annual reports), set from a `reviewedOn` field, never typed by hand.
- **Word-count minimums** (800 / 1,000 / 1,200 / 1,500 / 2,000) encourage padding. Replace with "cover the search
  intent completely; word counts are planning guides, not pass/fail". Keep an under-300-words check for thin pages.
- **Testimonial rules** are excellent. Keep them. Add: no star ratings unless they come from a real review
  platform with a link.
- The "Honest: Indian team, Western professionalism" row works as internal guidance but should not appear in copy.
  Replace with: "State where the company is based and who runs it. Do not imply a location you do not have."

### 2.7 SEO rule fixes (technical)

1. **robots.ts bug:** specific groups such as `GPTBot allow: "/"` replace the `*` group for that bot. As written,
   GPTBot, ClaudeBot, PerplexityBot, Googlebot and Bingbot may crawl `/api/`, `/admin/`, `/account/` and
   `/checkout/`. Remove the per-bot groups (not needed, `*` already allows them) or repeat the disallows in each.
2. Remove `host:` from robots (Yandex-only, deprecated).
3. `/v2` and search pages: use `noindex` in metadata. Do not also block in robots.txt, because a blocked page's
   noindex is never seen.
4. **Pagination:** §1 says noindex `?page=N`, §6 says canonicalise each page to itself. Contradiction. Use
   path-based pages (`/blog/page/2`), self-canonical, indexable.
5. **Internal search results:** noindex, not canonical to `/kb`.
6. **hreflang/en-US conflict:** the URL structure says en-US is the unprefixed canonical, but hreflang lists
   `/en-us/...`. Point en-US to the unprefixed URL, and never create `/en-us/` as a duplicate.
7. **Remove meta keywords.** Google and Bing ignore them. There is no evidence AI crawlers use them.
8. **Sitemap `priority` and `changeFrequency`** are ignored by Google. Keep `lastModified` accurate instead
   (real content change dates only).
9. **Outdated schema claims:**
   - `HowTo`: Google removed HowTo rich results in 2023. Keep only if it helps structure, not for a snippet.
   - `FAQPage`: rich results are limited to government and health sites since 2023. Keep the FAQ content (it helps
     users and AI answers), treat schema as optional, and make sure it matches visible text.
   - `WebSite` + `SearchAction`: Google retired the sitelinks search box in late 2024. Remove the promise; the
     schema is harmless but it is not a ranking feature.
10. **Review/AggregateRating:** the rules require it on every plan page and also say "only once 10+ reviews exist".
    Contradiction. Fabricated or self-served ratings risk a manual action. Make it conditional on real, visible,
    linked reviews. Never mark up your own business as `itemReviewed`.
11. **Organization schema defined three ways** (flat in seo, `@graph` in ui-ux, `LocalBusiness` in coding). Use one
    `@graph` with stable `@id` references. `LocalBusiness` is wrong for an online company with no verified
    storefront; use `Organization` with `contactPoint`.
12. **LCP fix "move components to `next/dynamic` with `ssr: false`"** contradicts the server-rendering rule. Delete it.
13. **Overstated claims about AI tools.** The table of "how each AI tool indexes content" and "Google's AI does not
    execute JavaScript" are unverifiable. Keep the actionable rule (server-render everything, allow the bots,
    publish clear factual pages) and delete the speculation.
14. **llms.txt:** no major AI provider has confirmed using it. Keep it as a cheap optional extra, not a pillar.
15. **HARO / Connectively** was shut down in 2024. Replace with Qwoted, Featured, Source of Sources.
16. **Lighthouse "95+ on all four categories on every changed page"** is brittle (scores vary run to run). Replace
    with: median of 3 mobile runs, Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95, plus the
    real targets (LCP < 2.5s, INP < 200ms, CLS < 0.1 in field data).
17. `twitter.com` → `x.com` in `sameAs`.
18. The IndexNow example reads `process.env.INDEXNOW_KEY` directly, which breaks coding rule §12. Use `env`.

### 2.8 Coding rule fixes

1. **MongoDB is going away.** Blog moves to headless WordPress and the site becomes front-end only. These are obsolete:
   coding §10 (Mongoose rules), the EU Atlas cluster rule, `MONGODB_URI` in env, the sitemap code that queries
   `Post`, the `llms.txt` generator that reads MongoDB, and the soft-delete rules. Replace with the
   **WordPress data-layer rules** below.
2. **Next.js 16 changes:** `params` and `searchParams` are async (`params: Promise<{ slug: string }>` and `await` it).
   The samples in coding §3 and seo §1 use the old synchronous form. `middleware.ts` is now `proxy.ts`. `next lint`
   was removed, so run ESLint (or Biome) directly. Pin and track the latest patch release.
3. **A new tier for bespoke sections.** Rule 15 ("no one-off components in pages") conflicts with your plan for
   different layouts per money page. Add: `components/sections/bespoke/` for sections used on one page, still
   built to the same standards and approved in `/v2` before use. Page-level `_components/` stays limited to
   interactive widgets.
4. **File-length cap (300 lines) is not enforced.** The audit found 526- and 669-line components. Enforce with
   ESLint `max-lines`.
5. **Loop guard `.slice(0, MAX)`** silently truncates. For API/user input, reject oversize payloads with a 4xx instead.
6. **Environment:** validate env with Zod at startup (single typed module), not scattered `??` fallbacks.
7. **Currency by IP detection** (`ui-ux`/coding §13) makes pages dynamic and lets crawlers see only one currency.
   Default to USD in static HTML; use locale paths or an explicit selector (cookie read on the client).
8. **"No npm packages without discussing"** is fine. Add a pre-approved list (zod, next-intl, cva, clsx,
   tailwind-merge, lucide-react) so Claude Code is not blocked on basics.
9. **Replace `console.error`** with a logger or error-monitoring service in production.

#### WordPress data-layer rules (new)

- Fetch WordPress only in Server Components or Route Handlers. Validate every response with Zod.
- Render WordPress HTML only after server-side sanitisation (e.g. `sanitize-html`), never raw
  `dangerouslySetInnerHTML` on `content.rendered`. This is an XSS risk.
- Use ISR with tags: `revalidateTag("post:<slug>")` triggered by a WordPress webhook. Verify the webhook with a
  shared secret.
- If WordPress is down, serve the last cached page. Never show an error page for content that was cached.
- Draft preview via Next.js Draft Mode, protected by a secret.
- WordPress lives on a separate subdomain (`cms.dronahost.com`), `noindex`, no public theme, `wp-admin` restricted
  by IP or SSO, minimal plugins. Add `X-Robots-Tag: noindex` on the CMS domain so it never competes with the site.
- Content model: author, reviewer, category, `primaryKeyword`, `searchIntent`, `reviewedOn`, `relatedProduct`
  (links to a product page), and SEO fields. Posts without an author or reviewer date cannot be published.

### 2.9 UI/UX fixes

1. **Cookie banner is non-compliant for the EU and UK:** it offers "Accept All" and a ghost "Manage Preferences".
   Regulators expect "Reject non-essential" to be as easy as "Accept". Add it at the same visual weight,
   record consent with a timestamp, and block non-essential scripts until consent.
2. **Fonts and scripts:** Sora and Manrope have no Arabic or Devanagari glyphs. "Add an Arabic subset" is not
   possible. For Arabic or Hindi pages, load a separate family (e.g. IBM Plex Sans Arabic, Noto Sans Devanagari)
   and keep it out of the Latin pages.
3. **Border/shadow rules:** "pure #FFFFFF forbidden in light mode" conflicts with white cards and white logo
   backgrounds. Say "page background is not pure white; cards may be white".
4. **Page title template** in the sample layout uses `|`. See §2.6.
5. **OG paths differ:** `/og-image.png` (layout) vs `/public/og/[slug].jpg` (SEO). Use the second.
6. **"Live uptime % widget (real API)"** is a great rule. Keep it, and require a public status page behind it.
7. **Hardcoded testimonial star colour** (yellow) is outside the palette; use a token.

### 2.10 Brand-identity fixes

- Resolve decisions #2 and #4 above.
- The file lists JPG as "avoid" but PNG as "fallback"; both are fine for email. Keep SVG for web.
- Add the accessibility note: the orange and teal wordmark on white is a logo (exempt from text contrast), but
  never use those colours for body text.

---

## Part 3: The JSON page system

**Verdict: good idea, with guardrails.** The goal is pages that do not feel templated. Visitors notice repeated
headlines, repeated section order and repeated hero shapes, not shared components. So the system must let each
page choose its own sections, order, variants and copy, while the design system stays single.

### 3.1 Principles

1. **JSON holds content and structure, not layout logic.** No CSS, conditions or code in JSON.
2. **Every section type has a Zod schema.** Invalid content fails the build.
3. **Long prose lives in MDX or WordPress.** JSON is for structured fields.
4. **Facts come from registries.** Prices from `pricing.json`, claims from `claims.ts`. Pages reference IDs.
5. **Every key page has a "layout signature."** CI fails if two money pages share the same hero variant and the
   same first four section types.
6. **Bespoke sections are allowed** but follow the same /v2 approval.

### 3.2 Folder structure

```
content/
  claims.ts                      verified facts only
  pages/
    home.json
    wordpress-hosting.json
    vps-hosting.json
    pricing.json
    migration.json
  rules/
    global.json                  tone, banned phrases, reading level
    archetypes/product.json      required sections, limits
    archetypes/decision.json
    archetypes/trust.json
    archetypes/landing.json
  locales/                       later: de/, fr/, ar/ ... same file names
lib/content/
  schemas/                       Zod schemas per section type
  registry.ts                    section type to component map
  lint.ts                        content linter (runs in CI)
```

### 3.3 Page file (example)

```json
{
  "id": "wordpress-hosting",
  "path": "/wordpress-hosting",
  "archetype": "product",
  "intent": "commercial-investigation",
  "audience": "Small business owners who run a WordPress site and want fewer technical worries",
  "primaryKeyword": "managed wordpress hosting",
  "secondaryKeywords": ["wordpress hosting for small business", "wordpress hosting with free migration"],
  "seo": {
    "title": "Managed WordPress Hosting for Small Business",
    "description": "Managed WordPress hosting with free migration and daily backups. See plans and pricing.",
    "ogImage": "/og/wordpress-hosting.jpg",
    "schema": ["Product", "BreadcrumbList", "FAQPage"]
  },
  "rules": {
    "primaryCta": { "label": "See WordPress hosting plans", "href": "/pricing" },
    "requiredSections": ["hero", "answer", "pricing", "faq"],
    "mustLinkTo": ["/pricing", "/migration", "/blog"],
    "forbiddenClaims": ["unlimited"],
    "reviewedOn": "2026-10-06"
  },
  "sections": [
    {
      "id": "hero",
      "type": "SplitHero",
      "variant": "staging",
      "content": {
        "eyebrow": "Managed WordPress hosting",
        "h1": "WordPress hosting, managed for you",
        "lead": "We run the servers, back up your site and move it across for you.",
        "ctaPrimary": { "label": "See WordPress hosting plans", "href": "/pricing" },
        "ctaSecondary": { "label": "Ask a question first", "href": "/contact" }
      }
    },
    {
      "id": "answer",
      "type": "AnswerBlock",
      "content": {
        "h2": "What is managed WordPress hosting?",
        "answer": "Managed WordPress hosting means your host handles updates, backups, security and server tuning, so you can focus on your content and customers."
      }
    },
    {
      "id": "proof",
      "type": "StatsBar",
      "content": { "claims": ["claim:uptime-sla", "claim:first-reply-time"] }
    },
    {
      "id": "pricing",
      "type": "PricingPlans",
      "content": { "source": "pricing.json", "highlight": "growth" }
    },
    {
      "id": "faq",
      "type": "FAQSection",
      "content": {
        "h2": "Questions about WordPress hosting",
        "items": [
          { "q": "Can I move my existing WordPress site to DronaHost?", "a": "Yes. Share your current host details and we copy your site across. Your old site stays live until you switch." }
        ]
      }
    }
  ]
}
```

A `claim:` reference renders only if that claim is `verified`. Unverified claims render nothing, and the linter
reports them.

### 3.4 Schema sketch (Zod)

```ts
const Cta = z.object({ label: z.string().min(3).max(40), href: z.string().startsWith("/") });

const SplitHero = z.object({
  type: z.literal("SplitHero"),
  id: z.string(),
  variant: z.enum(["staging", "dashboard", "migration"]),
  content: z.object({
    eyebrow: z.string().max(40),
    h1: z.string().min(20).max(70),
    lead: z.string().max(220),
    ctaPrimary: Cta,
    ctaSecondary: Cta.optional(),
  }),
});

const Section = z.discriminatedUnion("type", [SplitHero, ProductHero, AnswerBlock, FeatureGrid, PricingPlans,
  FAQSection, StatsBar, ProcessTimeline /* ... one per component */]);

export const PageSpec = z.object({
  id: z.string(), path: z.string().startsWith("/"),
  archetype: z.enum(["product", "decision", "trust", "landing"]),
  seo: SeoFields, rules: PageRules,
  sections: z.array(Section).min(3).max(14),
});
```

### 3.5 Archetypes (not templates)

| Archetype | Opens with | Typical order | Examples |
|---|---|---|---|
| **product** | The outcome and a dashboard mockup | hero, answer block, how it works, plans, proof, FAQ, CTA | WordPress, VPS, cloud |
| **decision** | The question the reader is stuck on | hero, quick answer, comparison table, who it is for, pricing, FAQ | pricing, vs pages, "which plan" |
| **trust / process** | What happens next, step by step | hero, timeline, guarantees, team, support channels, CTA | migration, about, support |
| **landing** | One offer | hero, 3 reasons, proof, form | campaigns, design services |

Archetypes set required sections and limits only. Each page still picks its own order, variants, imagery,
headline angle and one bespoke section where it adds value (home, WordPress hosting, pricing and migration
should each have one).

### 3.6 Content linter (CI, fails the build)

- Missing, duplicate or over-length title, description, H1.
- More than one H1, skipped heading levels.
- Banned phrases (global rules file). Exclamation marks in marketing copy.
- Numbers or guarantees not coming from `claims.ts` (regex for digits plus units in copy).
- Unverified claim referenced in a page.
- Reading level above target (Flesch-Kincaid grade over 11) and sentences over 28 words.
- Fewer than 3 internal links, or links to missing pages, or bare "click here" anchors.
- Required sections missing for the archetype.
- Two money pages with the same layout signature.
- FAQ answers longer than 80 words or starting with a non-answer.
- Raw HTML entities or lorem ipsum.
- Prices without symbol and period.

### 3.7 Who edits content

If non-developers update copy often, JSON in Git becomes a bottleneck. Keep this structure now, then move
selected pages into WordPress (ACF Flexible Content or blocks) later. The Zod schemas make that migration
mechanical. Long guides and legal pages should be MDX or WordPress from the start.

---

## Part 4: Suggested consolidation

Five files with overlapping content cause the contradictions above. Suggested layout:

| File | Contains |
|---|---|
| `CLAUDE.md` | Index and the ten rules that matter most, plus a link to each file |
| `docs/rules/brand.md` | Name, logo, voice, terminology (merge brand-identity and content §1-2) |
| `docs/rules/design.md` | Principles, component behaviour, motion. Colours and sizes live in `tokens.css` only |
| `docs/rules/content.md` | Writing, headings, CTAs, errors, empty states, FAQ, testimonials |
| `docs/rules/seo.md` | Metadata, schema, crawl control, i18n, CWV, AI visibility |
| `docs/rules/engineering.md` | Code, data layer (WordPress), forms, env, security, i18n |
| `content/claims.ts` | Every verified fact |
| `docs/DECISIONS.md` | Each resolved conflict and who decided it, so it is not reopened |

## Part 5: Next steps

1. Answer the eight decisions in Part 1.
2. Send me your current sitemap or Search Console export and the verified facts (founding year, guarantee, SLA,
   support hours, locations, legal entity, address).
3. I then produce the rewritten rule files, `claims.ts`, the global content rules JSON, and the first three page
   specs (home, WordPress hosting, pricing) in the new format.
4. Claude Code builds the section registry, schemas and linter, and migrates the first page as the pilot.
5. Roll out page by page, each with its own layout signature.
