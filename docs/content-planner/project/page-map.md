# Page map (project data)

DronaHost's page-by-page map. The rules for every blueprint are in [rules/page-blueprints.md](../rules/page-blueprints.md). The machine-readable blueprint data (counts, required sections, order, per-section limits) is `blueprints.json` in this folder; `check-content` reads it.

Status of each page (Ready or Blocked, and why) is produced by `npm run content:page-map`, and the latest result is in the table at the end of this file.

## Part C: Blueprints by intent

"Visible sections" is the range of sections a visitor sees. **Required** sections are marked R. A page missing an R section is Blocked.

### C1. Home (navigational and commercial) . 8 to 11 sections

| # | Section | Content for this page | Source | Gate |
|---|---|---|---|---|
| 1 R | ProductHero (dashboard) | H1 states the main service and outcome. Lead names who we are in one sentence. Primary: See WordPress hosting plans. Secondary: Talk to our team | JSON | none |
| 2 | AssuranceStrip | Guarantee, free migration, renewal price. Each links to its policy page | Claims | per claim |
| 3 R | PathRouter | Where are you starting from? 3 to 4 situations | JSON | per card |
| 4 R | Meaning (AnswerBlock plus ResponsibilitySplit as one section) | What managed hosting means in 40 to 80 words, then what we look after and what stays with you | JSON, claims | per line |
| 5 | ProcessTimeline | Moving to the host, 4 steps | JSON, terms | `free-migration` |
| 6 | BentoGrid | What is included on the platform | Pricing file | per tile |
| 7 | PricingPlans | Three plans, link to compare | Pricing file | prices confirmed |
| 8 R | Help and policies (SupportChannels and TrustSignals as one section) | Ticket and email, hours, then plain-language policy links | Company, published pages | per item |
| 9 | Testimonials | Real reviews | Reviews file | at least 3 real |
| 10 R | FAQSection | 6 to 8 questions | JSON | per item |
| 11 R | CTABand | One closing action | JSON | none |

Publish minimum: sections 1, 3, 4, 8, 10 and 11 visible (7 sections with the strip). Visible words: 500 to 900.
This merges two pairs of sections that are separate today (answer and split, support and policies), so the full page is 11, not 13.

### C2. Product page (hosting, VPS, cloud) . 9 to 12 sections. Decide stage

| # | Section | Content | Source | Gate |
|---|---|---|---|---|
| 1 R | SplitHero (variant per product) | H1 is the product and outcome. Lead. Primary: See [product] plans | JSON | none |
| 2 | AssuranceStrip | Up to 3 claims | Claims | per claim |
| 3 R | AnswerBlock | What it is and who it is for | JSON | none |
| 4 | TwoColumn: for you / not for you | Honest limits | JSON | none |
| 5 R | FeatureGrid | What is included | Pricing file | per tile |
| 6 | ProcessTimeline | Moving or setup steps (only where relevant) | JSON, terms | claim |
| 7 | ResponsibilitySplit | Managed products only | Claims | per line |
| 8 R | PricingPlans (this product's family) | Price, renewal price, tax line | Pricing file | prices confirmed |
| 9 | Help and policies | Support and policy links | Company, pages | per item |
| 10 | Testimonials or CaseStudy | Real only | Files | real |
| 11 R | FAQSection | 6 to 8 | JSON | per item |
| 12 R | CTABand | Choose plan, or talk to the team | JSON | none |

Visible words: 700 to 1,200. A product page without sellable plans (VPS, cloud today) is Blocked, because plans are required.

### C3. Pricing page (decide) . 6 to 8 sections

| # | Section | Content | Source | Gate |
|---|---|---|---|---|
| 1 R | CenteredHero | H1 "Plans and pricing". Direct answer: what is included, how renewal works | JSON | none |
| 2 R | PricingPlans with tabs by family | Three cards per family plus the high-traffic row | Pricing file | confirmed |
| 3 | ComparisonTable (collapsed) | Every limit and feature by plan | Pricing file | confirmed |
| 4 | TwoColumn | Included on every plan / not included (email) | JSON | none |
| 5 | Add-ons | One card per add-on, one with a size selector | Pricing file | confirmed |
| 6 | Billing and renewal summary | Cycles, renewal price, tax line, link to the pricing policy | JSON, policy | page published |
| 7 R | FAQSection | 6 to 8 on billing and refunds | JSON | per item |
| 8 R | CTABand | Choose plan, or ask us which plan fits | JSON | none |

Visible words: 400 to 800. If prices are not confirmed, this page is Blocked, not published with "Price on request".

### C4. Migration page . 7 to 9 sections

Hero (SplitHero: steps), AnswerBlock R, ProcessTimeline R, TwoColumn (what we need from you / what is covered), "What can go wrong and what we do" (three cards from the owner's interview), Testimonials or CaseStudy (optional), FAQSection R (5 to 6), CTABand with the request form R. Gate: `free-migration` and `/migration-terms`. Words: 500 to 900.

### C5. Email page . 6 to 7 sections

CenteredHero, AnswerBlock R ("Email is not hosted by DronaHost"), Options (two cards, named provider or hidden), ProcessTimeline (5 steps to connect with DNS records), "WordPress mail needs SMTP" (one callout with link to the guide), FAQSection R (4 to 6), CTABand. Words: 400 to 700.

### C6. Service page (web design, SEO, maintenance, development) . 8 to 10 sections. Decide stage

SplitHero R (outcome H1), AnswerBlock R (what we do and for whom), TwoColumn (for you / not for you), FeatureGrid R (what is delivered), ProcessTimeline R, CaseStudy (hide if none), Pricing approach (scoped, with packages only if real data exists), FAQSection R (5 to 6), CTABand R (Book a consultation). No ranking promises. Words: 700 to 1,100.

### C7. Comparison page . 7 to 9 sections. Compare stage

CenteredHero (H1 names both options), AnswerBlock R (the verdict, one sentence plus reason), TwoColumn (what we compared, method and date), ComparisonTable R, "Where each is stronger" R (honest, both sides), "Who should choose which", ProcessTimeline (what switching involves, optional), FAQSection (4 to 6), CTABand. Gate: comparison flag on, every cell sourced and dated, legal read. Words: 800 to 1,400.

### C8. Regional page . 7 to 9 sections (Phase 2)

SplitHero, AnswerBlock R (answer for this region), PricingPlans in local currency (gated), "What applies here" R (reviewed by a qualified person, or the page is Blocked), Support hours with timezone, "Where your site is hosted" (the honest standard answer), Testimonials (real from the region, optional), FAQSection (4 to 6), CTABand. Words: 600 to 1,000.

### C9. Domain pages . 5 to 7 sections

Hero with search box R, AnswerBlock (TLD facts), Prices (registration and renewal from the sync, never typed) R, Rules and eligibility, Transfer steps, FAQSection (4 to 6), CTABand. Gate: domain search flag. Words: 300 to 600.

### C10. About, trust, contact, reviews

| Page | Sections | Content |
|---|---|---|
| About . 6 to 8 | CenteredHero (entity line), Story with verified facts R, People (real names and roles), How we work, Where we operate (honest), Policies, CTABand | Only facts in the company file. Team section hides until real |
| Trust hub . 5 to 7 | Hero, Policies R, Security facts, Support, Reviews, CTABand | Published pages only |
| Contact . 4 to 5 | Hero, Channels R (ticket, email), Form R, Company details, FAQSection (3 to 4) | No chat, WhatsApp or phone |
| Reviews . 3 to 5 | Hero, Profiles with score and retrieval date R, Real quotes, How we ask for reviews, CTABand | Hides until real reviews exist |

### C11. Policy page . 3 to 5 sections

Summary R (plain English, key facts, 40 to 80 words), Full text R (Tier A: owner approved. Tier B: qualified human), Effective date, change log and owner R, Related policies, Contact. Never shows without an approval line.

### C12. Blog guide . article . 6 to 9 sections

Answer block under the H1 R, 5 to 8 H2 sections that each answer a question, a "what we saw" section from the owner interview R, Sources R (2 or more, dated), FAQ (4 to 6), one soft product link, related posts. Words follow the SERP depth, normally 1,000 to 2,000. No CTA band in the first third.

### C13. Fix article . article . 6 to 8 sections

Symptom H1, quick answer R, backup step R, diagnose, fixes in order of effort (each with a check that it worked) R, tested versions and date R, when to ask for help (link to contact), prevent it. Words: 600 to 1,500.

### C14. Glossary or help entry . 4 to 6 sections

Definition R (40 to 80 words), why it matters to a site owner, example, related terms, next step. Words: 250 to 600.

### C15. Hub pages (blog index, resource hub) . 4 to 6 sections

Hero, featured guide, topic groups R (each with a one-line reason), most useful fixes, newsletter (optional), CTABand.

## Part D: DronaHost page map (project data)

| URL | Blueprint | Hero variant | Bespoke or unique | Keyword (from the register) | Gates |
|---|---|---|---|---|---|
| `/` | C1 | ProductHero:dashboard | PathRouter, Meaning | `dronahost` plus the small-business phrase | Claims, prices |
| `/wordpress-hosting` | C2 | SplitHero:staging | ResponsibilitySplit, staging mockup | managed wordpress hosting | Prices, features |
| `/business-hosting` | C2 | SplitHero:cpanel | "Not WordPress-specific" TwoColumn | (register) | Prices, features |
| `/vps-hosting`, `/cloud-hosting` | C2 | SplitHero:server | Size table | (register) | **Blocked until plans exist** |
| `/pricing` | C3 | CenteredHero | Family tabs | pricing keyword | Prices confirmed |
| `/migration` | C4 | SplitHero:steps | Request form | free wordpress migration | `free-migration`, terms |
| `/email` | C5 | CenteredHero:minimal | Options cards | business email for your domain | Provider named |
| `/web-design`, `/seo-services`, `/custom-development`, maintenance | C6 | ProductHero:service | Per-service deliverables | (register) | Service sheet, case study |
| `/vs/[competitor]` | C7 | CenteredHero | Sourced table | (register) | Comparison flag |
| `/hosting/uk`, `/uae`, `/eu`, `/us`, `/in` | C8 | SplitHero:region | "What applies here" | (register) | Phase 2, legal review |
| `/domains`, TLD pages | C9 | Hero with search | Search box | (register) | Domain flag |
| `/about`, `/trust`, `/contact`, `/reviews` | C10 | CenteredHero | People, profiles | brand | Company facts, real reviews |
| Policy pages (listed in Plan 07) | C11 | none | none | none | Tier A or B approval |
| `/blog/*`, `/kb/*` | C12, C13, C14 | none | Interview section | (register) | Interview, sources |
| `/blog`, `/kb` | C15 | CenteredHero | Topic groups | none | At least 3 posts |

## Status of each page

<!-- page-status:start -->

Generated by `npm run content:page-map -- --write`. A page with a spec is judged by its blueprint; a page without one by the gates in `page-gates.json`.

| URL | Blueprint | Page spec | Status | Why |
|---|---|---|---|---|
| `/` | C1 | yes | **Ready** | every required section is visible (8 of 11 sections); hidden parts need claim:business-hosting-scope, claim:managed-vps-scope, claim:managed-server-care, FEATURES.pricesConfirmed |
| `/wordpress-hosting` | C2 | not yet | **Blocked** | needs FEATURES.pricesConfirmed; needs claim:litespeed; needs claim:ssh-wp-cli; needs claim:staging-plans; owner fact: Plan limits confirmed (pricing file 'confirmBeforeLaunch') |
| `/business-hosting` | C2 | not yet | **Blocked** | needs FEATURES.pricesConfirmed; needs claim:business-hosting-scope; needs claim:cpanel |
| `/vps-hosting` | C2 | not yet | **Blocked** | needs plans:vps; needs FEATURES.pricesConfirmed; needs claim:managed-vps-scope; owner fact: Whether VPS is sold |
| `/cloud-hosting` | C2 | not yet | **Blocked** | needs plans:cloud; needs FEATURES.pricesConfirmed; owner fact: Whether cloud hosting is sold |
| `/pricing` | C3 | not yet | **Blocked** | needs FEATURES.pricesConfirmed; owner fact: Confirmation that prices are final |
| `/migration` | C4 | not yet | **Blocked** | needs claim:migration-process; owner fact: 'What can go wrong and what we do' (three cards from the owner's interview) |
| `/email` | C5 | not yet | **Blocked** | owner fact: Premium email provider named |
| `/web-design` | C6 | not yet | **Blocked** | needs claim:website-design-service; owner fact: Service sheet; owner fact: One real case study (or the section hides) |
| `/seo-services` | C6 | not yet | **Blocked** | owner fact: Service sheet; owner fact: Whether SEO is sold as described |
| `/custom-development` | C6 | not yet | **Blocked** | owner fact: Service sheet |
| `/vs/[competitor]` | C7 | not yet | **Blocked** | needs FEATURES.comparisonPages; owner fact: Every comparison cell sourced and dated; owner fact: Legal read |
| `/hosting/uk` | C8 | not yet | **Blocked** | needs FEATURES.localeVariants; owner fact: Legal review of 'what applies here' |
| `/domains` | C9 | not yet | **Blocked** | owner fact: Domain registrar integration and price sync (domain search flag) |
| `/about` | C10a | not yet | **Blocked** | owner fact: Legal entity name and registration number; owner fact: Registered address; owner fact: Founding year; owner fact: Team names and roles |
| `/trust` | C10b | not yet | **Ready** | its gates are met |
| `/contact` | C10c | not yet | **Ready** | its gates are met |
| `/reviews` | C10d | not yet | **Blocked** | needs verifiedReviews; owner fact: Real reviews with permission |
| `/terms` | C11 | not yet | **Blocked** | owner fact: Tier B: qualified human approval |
| `/privacy` | C11 | not yet | **Blocked** | owner fact: Tier B: qualified human approval |
| `/sla` | C11 | not yet | **Blocked** | owner fact: Meaning of 24/7 and the uptime commitment; owner fact: Tier B: qualified human approval |
| `/blog` | C15 | not yet | **Blocked** | owner fact: At least 3 published posts |

<!-- page-status:end -->
