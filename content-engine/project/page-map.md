# Page map (project data)

DronaHost's page-by-page map. The rules for every blueprint are in [rules/page-blueprints.md](../rules/page-blueprints.md). The machine-readable blueprint data (counts, required sections, order, per-section limits) is `blueprints.json` in this folder; `check-content` reads it.

Status of each page (Ready or Blocked, and why) is produced by `npm run content:page-map`, and the latest result is in the table at the end of this file.

## Part C: Blueprints by intent

"Visible sections" is the range of sections a visitor sees. **Required** sections are marked R. A page missing an R section is Blocked.

### C1. Home (navigational and commercial) . 7 to 12 sections

Revised 2026-10-10 (owner, decision 58): the brand home page of a global brand. No prices (they appear only on `/pricing`), no personal names (decision 59). Order follows a brand searcher: what is DronaHost, can I trust it, what do I get, what else do you do, how does it fit together, what do customers say, how does the move work, ask for a plan, questions, who checked this, act.

| # | Section | Content for this page | Source | Gate |
|---|---|---|---|---|
| 1 R | ProductHero:console | H1 promise, entity lead ("DronaHost is a managed WordPress hosting and web services company..."), "Plan my migration" button to the migration section, console example visual, rail of four verified promises | JSON, claims | form needs `free-migration` and a lead destination |
| 2 | RatingBand | Rating and review-platform links | Verified reviews | real reviews only |
| 3 R | AdvantageGrid | Four commitments with large figures, each linked to its policy; one marked as our decision | JSON, claims | per item |
| 4 R | SolutionsGrid | Two featured solutions and six services, no prices | JSON | per item |
| 5 R | Ecosystem | Orbit of services and four "one provider" points | JSON | per point |
| 5b | SupportTeam | "Real support from real people, 24/7": three points, a ticket link, and one premium atmosphere photo (content/team.ts, licensed, no names or roles, never presented as our staff) with the 24/7 badge and a ticket reply over it; until then an illustration of a ticket answered in writing | JSON, photo registry | `support-24-7` |
| 6 | ReviewsShowcase | Featured case study and review cards | Case studies, reviews | real only |
| 7 | ProcessTimeline | Four migration steps | JSON | `free-migration` |
| 8 | MigrationPromo | No form (owner, 2026-10-10): three reassurances, a graphic of the move and one button to the client area (my.dronahost.com, from the company registry) | JSON, company | `free-migration` |
| 9 R | FAQSection | 6 to 8 brand questions, including login and support | JSON | per item |
| 10 R | PageProvenance | Reviewed by the DronaHost editorial team, date, how facts are checked, report an error | JSON | none |
| 11 R | CTABand | One closing action, plus a link to `/pricing` | JSON | none |

Publish minimum: sections 1, 3, 4, 5, 9, 10 and 11 (7 sections). Visible words: 700 to 1,400 (raised 2026-10-10 when the support section was added).

### C2. Product page (hosting, VPS, cloud) . 10 to 15 sections. Decide stage

| # | Section | Content | Source | Gate |
|---|---|---|---|---|
| 1 R | SplitHero (variant per product) | H1 is the product and outcome. Lead. Primary: See [product] plans | JSON | none |
| 2 | AssuranceStrip | Up to 3 claims | Claims | per claim |
| 3 R | AnswerBlock | What it is and who it is for | JSON | none |
| 4 | TwoColumn: for you / not for you | Who it suits and who it does not | JSON | none |
| 5 | HonestLimits | What this product does not include or do | JSON, decisions, claims | per item; section needs 2 |
| 6 R | FeatureGrid | What is included | Pricing file | per tile |
| 7 | ProcessTimeline | Moving or setup steps (only where relevant) | JSON, terms | claim |
| 8 | ResponsibilitySplit | Managed products only | Claims | per line |
| 9 R | PricingPlans (this product's family) | Plan cards without prices, each linking to `/pricing` (decision 58) | Pricing file | none |
| 10 | HelpAndPolicies | Support and policy links | Company, pages | per item |
| 11 | Testimonials | Real only | Reviews file | real |
| 12 | CaseStudy | Real only | Case-study file | approved case study |
| 13 R | FAQSection | 6 to 8 | JSON | per item |
| 14 R | PageProvenance | Who reviewed the page and when, how facts are checked, report an error | JSON, published pages | none |
| 15 R | CTABand | Choose plan, or talk to the team | JSON | none |

Publish minimum: the 7 required sections (1, 3, 6, 9, 13, 14, 15). Visible words: 700 to 1,200. A product page without sellable plans (VPS, cloud today) is Blocked, because plans are required.

### C3. Pricing page (decide) . 7 to 9 sections

| # | Section | Content | Source | Gate |
|---|---|---|---|---|
| 1 R | CenteredHero | H1 "Plans and pricing". Direct answer: what is included, how renewal works | JSON | none |
| 2 R | PricingPlans with tabs by family | Three cards per family plus the high-traffic row | Pricing file | confirmed |
| 3 | ComparisonTable (collapsed) | Every limit and feature by plan | Pricing file | confirmed |
| 4 | TwoColumn | Included on every plan / not included (email) | JSON | none |
| 5 | Add-ons | One card per add-on, one with a size selector | Pricing file | confirmed |
| 6 | Billing and renewal summary | Cycles, renewal price, tax line, link to the pricing policy | JSON, policy | page published |
| 7 R | FAQSection | 6 to 8 on billing and refunds | JSON | per item |
| 8 R | PageProvenance | Who reviewed the page and when, how facts are checked, report an error | JSON, published pages | none |
| 9 R | CTABand | Choose plan, or ask us which plan fits | JSON | none |

Publish minimum: 5 sections (1, 2, 7, 8, 9). Visible words: 400 to 800. If prices are not confirmed, this page is Blocked, not published with "Price on request".

### C4. Migration page . 8 to 10 sections

Hero R (SplitHero: steps), AnswerBlock R, ProcessTimeline R, TwoColumn (what we need from you / what is covered), "What can go wrong and what we do" (RiskCards, three cards from the owner's interview), Testimonials or CaseStudy (optional, one of the two), MigrationRequest R (the request form), FAQSection R (5 to 6), PageProvenance R, CTABand. Publish minimum: 6 sections. Gate: `free-migration` and `/migration-terms`. Words: 500 to 900.

### C5. Email page . 6 to 8 sections

CenteredHero R, AnswerBlock R ("Email is not hosted by DronaHost"), Options (two cards, named provider or hidden), ProcessTimeline (5 steps to connect with DNS records), "WordPress mail needs SMTP" (one callout with link to the guide), FAQSection R (4 to 6), PageProvenance, CTABand. Publish minimum: 3 sections. Words: 400 to 700.

### C6. Service page (web design, SEO, maintenance, development) . 9 to 13 sections. Decide stage

Hero R (outcome H1; ProductHero:service per Part D. The check accepts any hero type in `blueprints.json` `heroTypes`), AnswerBlock R (what we do and for whom), TwoColumn (for you / not for you), HonestLimits (what the service does not include or promise), FeatureGrid R (what is delivered), ProcessTimeline R, CaseStudy (hide if none), Pricing approach (scoped, with packages only if real data exists), FAQSection R (5 to 6), PageProvenance R, CTABand R (Book a consultation). Publish minimum: 7 sections. No ranking promises. Words: 700 to 1,100.

### C7. Comparison page . 8 to 10 sections. Compare stage

CenteredHero R (H1 names both options), AnswerBlock R (the verdict, one sentence plus reason), TwoColumn (what we compared, method and date), ComparisonTable R, "Where each is stronger" R (honest, both sides), "Who should choose which", ProcessTimeline (what switching involves, optional), FAQSection (4 to 6), PageProvenance R, CTABand. Publish minimum: 5 sections. Gate: comparison flag on, every cell sourced and dated, legal read. Words: 800 to 1,400.

### C8. Regional page . 8 to 11 sections (Phase 2)

SplitHero R, AnswerBlock R (answer for this region), plan cards linking to `/pricing` (no prices, decision 58), "What applies here" R (reviewed by a qualified person, or the page is Blocked), HonestLimits, Support hours with timezone, "Where your site is hosted" (the honest standard answer), Testimonials (real from the region, optional), FAQSection (4 to 6), PageProvenance R, CTABand. Publish minimum: 4 sections. Words: 600 to 1,000.

### C9. Domain pages . 5 to 8 sections

Hero with search box R, AnswerBlock (TLD facts), Prices (registration and renewal from the sync, never typed) R, Rules and eligibility, Transfer steps, FAQSection (4 to 6), PageProvenance, CTABand. Publish minimum: 3 sections. Gate: domain search flag. Words: 300 to 600.

### C10. About, trust, contact, reviews

| Page | Sections | Content |
|---|---|---|
| About (C10a) . 7 to 9, words 300 to 800 | CenteredHero R (entity line), Story with verified facts R, People (real names and roles), How we work, Where we operate (honest), Policies, PageProvenance R, CTABand | Only facts in the company file. Team section hides until real |
| Trust hub (C10b) . 5 to 7, words 200 to 600 | Hero R, Policies R, Security facts, Support, Reviews, PageProvenance, CTABand | Published pages only |
| Contact (C10c) . 4 to 6, words 100 to 400 | Hero R, Channels R (ticket, email), Form R, Company details, FAQSection (3 to 4), PageProvenance | No chat, WhatsApp or phone |
| Reviews (C10d) . 3 to 6, words 100 to 400 | Hero R, Profiles with score and retrieval date R, Real quotes, How we ask for reviews, PageProvenance, CTABand | Hides until real reviews exist |

The word ranges for C10 to C15 in `blueprints.json` were confirmed by the owner on 2026-10-10 (decision 55).

### C11. Policy page . 3 to 5 sections

Summary R (plain English, key facts, 40 to 80 words), Full text R (Tier A: owner approved. Tier B: qualified human), Effective date, change log and owner R, Related policies, Contact. Never shows without an approval line. Words: 200 to 4,000.

### C12. Blog guide . article . 6 to 9 sections

Answer block under the H1 R, 5 to 8 H2 sections that each answer a question, a "what we saw" section from the owner interview R, Sources R (2 or more, dated), FAQ (4 to 6), one soft product link, related posts. Words follow the SERP depth, normally 1,000 to 2,000. No CTA band in the first third.

### C13. Fix article . article . 6 to 8 sections

Symptom H1, quick answer R, backup step R, diagnose, fixes in order of effort (each with a check that it worked) R, tested versions and date R, when to ask for help (link to contact), prevent it. Words: 600 to 1,500.

### C14. Glossary or help entry . 4 to 6 sections

Definition R (40 to 80 words), why it matters to a site owner, example, related terms, next step. Words: 250 to 600.

### C15. Hub pages (blog index, resource hub) . 4 to 7 sections

Hero, featured guide, topic groups R (each with a one-line reason), most useful fixes, newsletter (optional), PageProvenance, CTABand. Words: 100 to 400.

## Part D: DronaHost page map (project data)

| URL | Blueprint | Hero variant | Bespoke or unique | Keyword (from the register) | Gates |
|---|---|---|---|---|---|
| `/` | C1 | ProductHero:dashboard | PathRouter, WhyChoose, HonestLimits | `dronahost` plus the small-business phrase | Claims, prices |
| `/wordpress-hosting` | C2 | SplitHero:staging | ResponsibilitySplit, staging mockup | managed wordpress hosting | Prices, features |
| `/business-hosting` | C2 | SplitHero:control-panel | "Not WordPress-specific" TwoColumn | (register) | Prices, features |
| `/vps-hosting`, `/cloud-hosting` | C2 | SplitHero:server | Size table | (register) | **Blocked until plans exist** |
| `/pricing` | C3 | CenteredHero | Family tabs | pricing keyword | Prices confirmed |
| `/migration` | C4 | SplitHero:steps | Request form | free wordpress migration | `free-migration`, terms |
| `/email` | C5 | CenteredHero:minimal | Options cards | business email for your domain | Provider named |
| `/web-design`, `/seo-services`, `/custom-development`, maintenance | C6 | ProductHero:service | Per-service deliverables | (register) | Service sheet, case study |
| `/vs/[competitor]` | C7 | CenteredHero | Sourced table | (register) | Comparison flag |
| `/hosting/uk`, `/uae`, `/eu`, `/us` | C8 | SplitHero:region | "What applies here" | (register) | Phase 2, legal review |
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
| `/` | C1 | yes | **Ready** | every required section is visible (11 of 12 sections); hidden parts need nothing |
| `/wordpress-hosting` | C2 | yes | **Blocked** | BentoGrid is hidden (needs feature:staging, feature:performance, feature:security, feature:backups, feature:control-panel) |
| `/wordpress-hosting` | C2 | not yet | **Blocked** | needs claim:wp-control-panel |
| `/business-hosting` | C2 | not yet | **Blocked** | needs claim:business-hosting-scope; needs claim:control-panel |
| `/vps-hosting` | C2 | not yet | **Blocked** | needs plans:vps; needs claim:managed-vps-scope; owner fact: Whether VPS is sold |
| `/cloud-hosting` | C2 | not yet | **Blocked** | needs plans:cloud; owner fact: Whether cloud hosting is sold |
| `/pricing` | C3 | not yet | **Blocked** | needs FEATURES.pricesConfirmed; owner fact: Confirmation that prices are final |
| `/migration` | C4 | not yet | **Blocked** | owner fact: 'What can go wrong and what we do' (three cards from the owner's interview) |
| `/email` | C5 | not yet | **Ready** | its gates are met |
| `/web-design` | C6 | not yet | **Blocked** | needs claim:website-design-service; owner fact: Service sheet; owner fact: One real case study (or the section hides) |
| `/seo-services` | C6 | not yet | **Blocked** | owner fact: Service sheet; owner fact: Whether SEO is sold as described |
| `/custom-development` | C6 | not yet | **Blocked** | owner fact: Service sheet |
| `/vs/[competitor]` | C7 | not yet | **Blocked** | needs FEATURES.comparisonPages; owner fact: Every comparison cell sourced and dated; owner fact: Legal read |
| `/hosting/uk` | C8 | not yet | **Blocked** | needs FEATURES.localeVariants; owner fact: Legal review of 'what applies here' |
| `/domains` | C9 | not yet | **Blocked** | owner fact: Domain registrar integration and price sync (domain search flag) |
| `/about` | C10a | not yet | **Blocked** | owner fact: Legal entity name and registration number; owner fact: Registered address; owner fact: Founding year; owner fact: Team names and roles |
| `/trust` | C10b | not yet | **Blocked** | owner fact: No route yet: app/[locale]/(marketing)/trust must be built |
| `/contact` | C10c | not yet | **Ready** | its gates are met |
| `/reviews` | C10d | not yet | **Blocked** | needs verifiedReviews; owner fact: Real reviews with permission |
| `/terms` | C11 | not yet | **Blocked** | owner fact: Tier B: qualified human approval |
| `/privacy` | C11 | not yet | **Blocked** | owner fact: Tier B: qualified human approval |
| `/sla` | C11 | not yet | **Ready** | its gates are met |
| `/blog` | C15 | not yet | **Blocked** | owner fact: At least 3 published posts |

<!-- page-status:end -->
