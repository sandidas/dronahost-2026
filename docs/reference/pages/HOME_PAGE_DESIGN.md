# DronaHost home page: research, concept and build spec

Status: draft for owner review. Nothing here is built. Components marked NEW must pass /v2 review first.
Rules that apply: `docs/rules/*` (updated), `content/claims.ts` (claim gating), `POLISH_BRIEF.md`, `MOTION_AND_LUXURY_BRIEF.md`.

---

## 1. What the leading premium hosts do (research, October 2026)

Sources: the live WP Engine (Australia) home page, Kinsta's current navigation and footer, and independent
reviews of Rocket.net, WP Engine and Kinsta. I read page text and structure only. I could not see the rendered
visuals, so layout notes are structural. Competitor numbers below are their own claims, not verified by me.

| Pattern | WP Engine | Kinsta | Rocket.net |
|---|---|---|---|
| Positioning | Enterprise and agency platform "and beyond": hosting plus ecommerce, newsroom, headless, AI tools | WordPress-first, now with a separate sister brand (Sevalla) for apps and databases | Speed through Cloudflare Enterprise, built for larger WordPress sites |
| Home page shape | Hero, product cards, "why us" list, huge customer logo ticker, support stats, segments (enterprise, agency, developer, media), two case studies, three G2 reviews, FAQ, closing CTA | Mega-menu led: platform, solutions by industry and use case, pricing, resources. Offer banner on top ("first month free"). | Benchmarks, plain plan table, transparent all-in pricing |
| Trust devices | Scale claims ("5M sites"), big-brand logos, named case studies, review quotes with name, role and company size | Trust Center link, SOC 2 Type II, ISO 27001, GDPR, CCPA badges in the footer, status page, public changelog | Public benchmark data, third-party reviews |
| Support | "24/7" with stats | WordPress engineers in chat, inside the dashboard | 24/7 chat |
| CTA | Generic "Get Started" | "Try for free" | Plan-led |
| Weak spots | Abstract and enterprise-heavy. A small business owner has to decode what they get. Pricing sits behind a click. | Premium price, usage limits, little for non-technical buyers | Mostly performance language |

What they do that we should match: a clear product router, real-person reviews, a status page and changelog,
a visible policy and trust hub, FAQs written for AI answers.

What they do that we must not copy: logo walls and scale claims (we have neither, and fabricating them would
break our own rules), generic CTAs, vague adjectives.

### The opening to beat them

The big players sell to enterprises and agencies. The owner of a 5-person business, a clinic, a law firm or a
local shop gets a page full of platform language. We can be the premium host that **talks to that person**:

1. **Plain-language clarity.** Say what we look after and what stays with you, in words a non-technical owner understands.
2. **Honest pricing on the home page.** Price, renewal price and what is included, visible without a click (once prices are confirmed).
3. **A real person, in a channel you already use.** WhatsApp, chat and ticket are all first-class.
4. **Proof you can check.** Every claim links to the page where its terms are published. Competitors ask for faith; we show the policy.
5. **Calm, premium design.** Quiet confidence, not logo walls and gradients.

None of this needs us to be bigger. It needs us to be clearer and more honest, which our claim-gating system already enforces.

---

## 2. Concept: "The calm one"

**Promise (one line):** Your website, looked after properly, by people who explain things clearly.

**Visitor in mind:** an educated small-business owner, not a developer. They have a WordPress site or need
one, they compare three hosts, and they are afraid of downtime, hidden renewal prices and unhelpful support.

**Home page job:** it is not the full sales pitch. It does four things:
1. Tell them within 5 seconds what DronaHost is and who it is for.
2. Route them to the right product by their situation, not our product names.
3. Remove the three fears (moving, price surprises, being alone with a problem).
4. Give a clear next step: see plans, or talk to a person.

**Layout signature (so it never feels like a template):** dark navy hero with a live-looking dashboard mockup,
then an intent-based "Where are you starting from?" router, then a responsibility split ("what we look after /
what stays with you"). The WordPress hosting page will open differently (staging workflow), and pricing will be
a decision-first page.

**Design notes (luxury, within the existing design system):**
- Dark default, system preference respected. Navy surfaces, hairline borders, one orange action per viewport, teal for links and data.
- Large display type, generous 96 to 144 px section rhythm, one idea per section.
- Product UI mockups only, drawn in CSS or SVG. No stock photos, no logo walls, no cartoon characters.
- Hero mockup animates once on load (chart draws, bars fill). Nothing above the fold fades in.
- Light theme parity: every section checked in both themes.

---

## 3. Section blueprint

| # | Section | Component | Purpose | Gated by |
|---|---|---|---|---|
| 0 | Header | Header, ThemeToggle | Clear nav: Hosting, Website design, Pricing, Resources, Help, Login. One orange button ("See plans"). | none |
| 1 | Hero | ProductHero | What we are, who for, one primary action, one secondary action | none |
| 2 | Assurance strip | AssuranceStrip | Guarantee, support, migration, renewal, each linking to its terms page | `claimRenders()` per claim |
| 3 | Where are you starting from? | **PathRouter (NEW, bespoke)** | Four situation cards routing to product pages | none |
| 4 | What is managed hosting? | AnswerBlock | 40 to 80 word direct answer for search and AI, then plain explanation | none |
| 5 | What we look after / what stays with you | **ResponsibilitySplit (NEW, bespoke)** | Remove the "what am I buying" confusion | feature facts confirmed |
| 6 | Moving to DronaHost | ProcessTimeline | Remove the fear of migration | `free-migration` |
| 7 | The platform | BentoGrid | Staging, backups, security, performance, tools, each with a small UI mockup | feature facts confirmed |
| 8 | Plans | PricingPlans (3 of 5 plans) | Price, renewal price, what is included, link to compare all | `pricesConfirmed` |
| 9 | Support | SupportChannels | WhatsApp, live chat, ticket | `support-24-7` for hours |
| 10 | Customer proof | Testimonials, CaseStudy | Real names, roles, companies, links | hidden until real |
| 11 | Trust and policies | TrustSignals | Links to refund, terms, SLA, privacy, status | pages published |
| 12 | FAQ | FAQSection | 7 questions, answer first, 40 to 80 words | claim-dependent answers |
| 13 | Closing CTA | CTABand | See plans, or talk to our team | none |
| 14 | Footer | Footer | 4 columns, legal entity, address, contact | decision #6 |

Sections 10 and 11 stay empty-safe: if nothing is verified, they do not render, and the page still works.

### Why this order
Hero (what) → assurance (can I trust this) → router (is this for me) → answer and split (do I understand it) →
migration (will it hurt) → platform (what do I get) → plans (what does it cost) → support (who helps me) →
proof → policies → FAQ → CTA. It follows the questions a careful buyer asks.

---

## 4. Draft copy (plain international English, no unverified claims)

Items marked ⚠ must be confirmed by you before they go live (capabilities, not numbers).

### Hero
- Eyebrow: Managed WordPress, cloud and VPS hosting
- H1 options (pick one):
  - **A (recommended):** Managed WordPress hosting without the technical worry
  - B: Managed WordPress hosting for businesses that run on their website
  - C: WordPress hosting, looked after properly
- Lead: We run the servers, back up your site and move it across for you, so you can get on with your business. ⚠ backups, migration
- Primary CTA: See WordPress hosting plans
- Secondary CTA: Talk to our team
- Three ticks under the buttons come from verified claims only (none show today).

### Where are you starting from? (PathRouter)
| Card | Line | Link |
|---|---|---|
| I already have a WordPress site | We move it to DronaHost and look after it. | WordPress hosting |
| I need a website built | We design a new WordPress site, then host it. ⚠ design service | Website design |
| I need email and hosting for my business | Hosting and professional email together. ⚠ confirm Business Hosting scope | Business hosting |
| I want full control of my server | Managed VPS with root access. ⚠ confirm | Managed VPS hosting |

### What is managed WordPress hosting? (AnswerBlock)
Managed WordPress hosting means your host looks after the technical work behind your website: the servers,
backups, security and updates. You keep control of your content and your business. It suits owners who want a
reliable site without learning server administration. ⚠ confirm which tasks DronaHost does

### What we look after / what stays with you (ResponsibilitySplit)
| We look after | You keep |
|---|---|
| The servers your site runs on ⚠ | Your content, products and pages |
| Backups of your site ⚠ | Which plugins and themes you choose |
| Moving your site across ⚠ | Your domain and your accounts |
| Answering when something goes wrong | Your business decisions |

### Moving to DronaHost (ProcessTimeline)
1. Tell us where your site is hosted now.
2. We copy it to DronaHost.
3. You check the copy on a private link.
4. You switch when you are ready. Your old site stays live until then. ⚠ confirm process

### The platform (BentoGrid), tiles
Staging (test changes on a copy first), Backups, Security, Performance (LiteSpeed ⚠), Developer tools (⚠ SSH, WP-CLI),
WordPress tools. Each tile shows a small UI mockup. Which plan includes which feature is read from `pricing.json`,
never typed by hand.

### Plans
H2: Plans and pricing. Shows Starter, Growth and Pop, price, **renewal price on every card**, billed total for annual
plans, and "Choose {plan name}". "Same price at renewal" appears only when `renewal-price-same` renders.

### Support
H2: Reach a person in the channel you already use. WhatsApp, live chat and support ticket cards. Hours and
availability text come from `support-24-7` once its terms page is published.

### FAQ (answer first, 40 to 80 words)
1. What is managed WordPress hosting?
2. Do I need technical skills to use DronaHost?
3. Can I move my existing WordPress site to DronaHost?
4. What happens to my current site while you move it?
5. How much does WordPress hosting cost at DronaHost? (from `pricing.json`)
6. Will the price go up when my plan renews? (answer renders only when `renewal-price-same` renders; otherwise "Each plan page shows the renewal price.")
7. Is DronaHost the right fit for my site? (honest answer, including who it is not for)

### Closing CTA
H2: Ready to see which plan fits? Primary: See WordPress hosting plans. Secondary: Talk to our team.

### Metadata
- Title (suffix added by helper): Managed WordPress & VPS Hosting
- Description: Managed WordPress, cloud and VPS hosting for growing businesses. See what is included, compare plans and talk to our team.
- Schema: Organization and WebSite in one `@graph`. Founding date and address wait for decision #6. No SearchAction.

---

## 5. Differentiators to build after launch (not on the first home page)

| Idea | Why it wins | Needs |
|---|---|---|
| Public status page and changelog | Kinsta has both; it makes any uptime claim checkable | Status tool, process |
| Trust and policies hub | Our answer to a trust center; lists real policies, no fake badges | Published, reviewed terms pages |
| Published speed benchmarks with method | Rocket.net's strongest trust move | Real tests, repeatable method |
| Honest comparison pages (`/vs/...`) | High AI-answer value and buyer intent | Verified data, dated |
| Named team with roles | Experience and trust signals | Real people, consent |
| Customer stories with numbers | The proof small buyers trust most | Real customers, written permission |

---

## 6. JSON page spec (first page in the new system)

```json
{
  "id": "home",
  "path": "/",
  "archetype": "product",
  "intent": "navigational-commercial",
  "audience": "Small business owners who run or need a WordPress site and want fewer technical worries",
  "primaryKeyword": "managed wordpress hosting",
  "secondaryKeywords": ["wordpress hosting for small business", "managed vps hosting", "wordpress hosting with migration"],
  "layoutSignature": ["ProductHero:dashboard", "AssuranceStrip", "PathRouter", "AnswerBlock", "ResponsibilitySplit"],
  "seo": {
    "title": "Managed WordPress & VPS Hosting",
    "description": "Managed WordPress, cloud and VPS hosting for growing businesses. See what is included, compare plans and talk to our team.",
    "ogImage": "/og/home.jpg",
    "schema": ["Organization", "WebSite"]
  },
  "rules": {
    "primaryCta": { "label": "See WordPress hosting plans", "href": "/pricing" },
    "requiredSections": ["hero", "router", "answer", "plans", "faq"],
    "mustLinkTo": ["/pricing", "/wordpress-hosting", "/contact"],
    "forbiddenClaims": ["unlimited", "best", "fastest"],
    "reviewedOn": "2026-10-06"
  },
  "sections": [
    { "id": "hero", "type": "ProductHero", "variant": "dashboard", "content": {
      "eyebrow": "Managed WordPress, cloud and VPS hosting",
      "h1": "Managed WordPress hosting without the technical worry",
      "lead": "We run the servers, back up your site and move it across for you, so you can get on with your business.",
      "ctaPrimary": { "label": "See WordPress hosting plans", "href": "/pricing" },
      "ctaSecondary": { "label": "Talk to our team", "href": "/contact" },
      "highlights": ["claim:free-migration", "claim:support-24-7", "claim:money-back"] } },

    { "id": "assurance", "type": "AssuranceStrip", "content": {
      "claims": ["claim:money-back", "claim:support-24-7", "claim:free-migration", "claim:renewal-price-same"] } },

    { "id": "router", "type": "PathRouter", "content": {
      "h2": "Where are you starting from?",
      "paths": [
        { "title": "I already have a WordPress site", "line": "We move it to DronaHost and look after it.", "href": "/wordpress-hosting", "cta": "See WordPress hosting" },
        { "title": "I need a website built", "line": "We design a new WordPress site, then host it.", "href": "/web-design", "cta": "See website design" },
        { "title": "I need email and hosting for my business", "line": "Hosting and professional email together.", "href": "/business-hosting", "cta": "See business hosting" },
        { "title": "I want full control of my server", "line": "Managed VPS with root access.", "href": "/vps-hosting", "cta": "See managed VPS" } ] } },

    { "id": "answer", "type": "AnswerBlock", "content": {
      "h2": "What is managed WordPress hosting?",
      "answer": "Managed WordPress hosting means your host looks after the technical work behind your website: the servers, backups, security and updates. You keep control of your content and your business. It suits owners who want a reliable site without learning server administration." } },

    { "id": "split", "type": "ResponsibilitySplit", "content": {
      "h2": "What we look after, and what stays with you",
      "weLookAfter": ["The servers your site runs on", "Backups of your site", "Moving your site across", "Answering when something goes wrong"],
      "youKeep": ["Your content, products and pages", "Which plugins and themes you choose", "Your domain and your accounts", "Your business decisions"] } },

    { "id": "moving", "type": "ProcessTimeline", "requiresClaim": "claim:free-migration", "content": {
      "h2": "Moving to DronaHost, step by step",
      "steps": [
        { "title": "Tell us where your site is", "text": "Share your current host details." },
        { "title": "We copy it", "text": "Your site is copied to DronaHost." },
        { "title": "You check it", "text": "Review the copy on a private link." },
        { "title": "You switch when ready", "text": "Your old site stays live until you switch." } ] } },

    { "id": "platform", "type": "BentoGrid", "content": {
      "h2": "What is included on the platform",
      "tiles": ["feature:staging", "feature:backups", "feature:security", "feature:performance", "feature:developer-tools"] } },

    { "id": "plans", "type": "PricingPlans", "requires": "FEATURES.pricesConfirmed", "content": {
      "h2": "Plans and pricing", "source": "pricing.json",
      "show": ["starter", "growth", "pop"], "highlight": "growth",
      "showRenewalPrice": true, "link": { "label": "Compare all plans", "href": "/pricing" } } },

    { "id": "support", "type": "SupportChannels", "content": {
      "h2": "Reach a person in the channel you already use",
      "channels": ["whatsapp", "live-chat", "ticket"], "hoursFrom": "claim:support-24-7" } },

    { "id": "proof", "type": "Testimonials", "hideIfEmpty": true, "requires": "verifiedReviews", "content": { "source": "reviews.json" } },

    { "id": "policies", "type": "TrustSignals", "content": {
      "h2": "Our policies, in plain language",
      "links": ["/refund-policy", "/terms", "/sla", "/privacy"], "onlyPublished": true } },

    { "id": "faq", "type": "FAQSection", "content": {
      "h2": "Questions before you choose",
      "items": [
        { "q": "What is managed WordPress hosting?", "a": "Managed WordPress hosting means the host looks after the technical side of your site, including servers, backups and security, while you keep control of your content." },
        { "q": "Do I need technical skills to use DronaHost?", "a": "No. You manage your site in WordPress as usual, and the technical work behind it is handled for you. If you get stuck, you can contact our team by chat, WhatsApp or ticket." },
        { "q": "Can I move my existing WordPress site to DronaHost?", "a": "Yes. Share your current host details and we copy your site across. You review it before you switch, and your current site stays live until you do." },
        { "q": "How much does WordPress hosting cost at DronaHost?", "a": "{{from pricing.json: starting price, billing period and renewal price}}", "requires": "FEATURES.pricesConfirmed" },
        { "q": "Will the price go up when my plan renews?", "a": "No. Your renewal price is the same as your signup price.", "requiresClaim": "claim:renewal-price-same" },
        { "q": "Is DronaHost the right fit for my site?", "a": "DronaHost suits businesses that want managed WordPress hosting with a team to talk to. If you need a very large enterprise platform with custom contracts, ask us first and we will tell you honestly if we are not the right fit." } ] } },

    { "id": "cta", "type": "CTABand", "content": {
      "h2": "Ready to see which plan fits?",
      "ctaPrimary": { "label": "See WordPress hosting plans", "href": "/pricing" },
      "ctaSecondary": { "label": "Talk to our team", "href": "/contact" } } }
  ]
}
```

Reference resolution: `claim:` renders only through `claimRenders()`. `feature:` reads plan availability from
`pricing.json`. `requires` hides a section or item when its condition is false. Hidden sections leave no empty gaps.

---

## 7. Facts you must confirm (capabilities, not numbers)

Backups and their retention per plan, staging (which plans), LiteSpeed, SSH and WP-CLI, free SSL, malware
scanning, CDN, what Business Hosting and Managed VPS include, whether website design is sold as shown, and the
migration process (including "old site stays live until you switch"). Until confirmed, Claude Code lists them as
unverified in `claims.ts` and the related tiles do not render.

---

## 8. Build plan for Claude Code

1. **Components first (in /v2, for review):** `PathRouter`, `ResponsibilitySplit` (bespoke tier), plus an `AnswerBlock` if it does not exist. Show all states, both themes, 390 and 1440 px.
2. **Section registry and schemas:** add Zod schemas for every type used above, the `claim:`, `feature:` and `requires` resolvers, and the `layoutSignature` check.
3. **Home page from JSON:** build `/` from `content/pages/home.json`. Server-rendered, no client fetching. Hero mockup animates once.
4. **QA:** content linter, contrast check, axe, Lighthouse (median of 3 mobile runs), JS-disabled and reduced-motion runs, claim-gating e2e.
5. **Staging only.** No merge to main until you approve screenshots.

### Prompt to send

```
Read /reference/HOME_PAGE_DESIGN.md and the updated rules in docs/rules/.
Do Phase 1 only: build PathRouter and ResponsibilitySplit as new components in /v2
(bespoke tier), plus AnswerBlock if missing. Follow the /v2 review workflow. Take
viewport screenshots at 1440 and 390 in dark and light, review them yourself, and fix
weak spots before showing me. Do not build the home page yet and do not touch existing
pages. List every ⚠ item in section 7 as an unverified entry in content/claims.ts.
```
