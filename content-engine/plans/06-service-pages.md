# Plan 06: Service Pages (agency intent)

**Intent:** the searcher wants a team to do the work: build a site, fix search traffic, develop an app. They compare agencies by proof, process and fit.
**Goal:** a qualified enquiry or booked consultation, not a purchase button.
**Owns:** `web design`, `website redesign`, `seo services`, `custom web development`, `agency`, `hire` queries.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages; Stage 4 output is page-spec copy, not an article. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Buy.
- **Interview:** The **Service page** bank in [interview-questions.md](../rules/interview-questions.md).
- **Page blueprint:** the section count, required sections, order and per-section limits for this page type are in [page-blueprints.md](../rules/page-blueprints.md). The blueprint this project uses for each URL is in `project/page-map.md`; a page spec names it in its `blueprint` field.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). Use it only when it matches the visible content and helps the reader.

## Pages

| Page | URL shape | Seed keyword shape (unvalidated) |
|---|---|---|
| One page per service | `/[service]` | "[service] for small business", "[service] retainer" |
| Consultation | `/[consultation]` | the conversion page for this plan |
| Regional versions | `/[service]/[region]` | see [Plan 05](05-regional-and-location.md) |
| Sub-services | `/[service]/[type]` | "[type] [service]" |
| Case studies and portfolio | `/[work]/[project]` | see "Case study and portfolio pages" below |

The project's service URLs, their status and seeds: the project's plan-specifics for this plan.

Add sub-service pages only for work we have delivered and can show. A page about a service with no case study is a weak page.

## Maintenance cluster (service confirmed by the owner)

[Brand] offers website maintenance once the owner has confirmed the service and its list. Scope, price and response times may be **not defined yet**. Then pages can be planned and drafted but cannot state what is included, how fast we respond or what it costs until the service sheet below is filled.

Project specifics for this plan: [plan-specifics/06-service-pages.md](../project/plan-specifics/06-service-pages.md) (the owner's confirmed service list, owner decisions).

| Page | Searcher thinks |
|---|---|
| Hub: maintenance | "I need someone to keep my site updated and safe" |
| Platform maintenance (one per platform we support) | "Updates, backups and fixes for my [platform] site" |
| Store maintenance | "My shop cannot go down" |
| Site management | "Run the whole site for me" (content edits, updates, reports) |
| Support and helpdesk | "Fix things when they break, on request" |
| Use cases | "Is this for a site like mine?" (only with a real example) |

The project's maintenance URLs, seeds and status: the project's plan-specifics for this plan.

**How the pages differ (so they do not compete):** the hub explains the whole service and links to the rest. WordPress and WooCommerce pages answer platform questions (plugin updates, store checks). Website management covers editing and running the site, which maintenance alone does not. Support and helpdesk covers help on request (tickets), not scheduled care. Each has its own keyword and its own register row.

**Use-case pages** (only when we have a real example and permission): agencies that need maintenance for client sites, online shops, small business sites after a move to [Brand], sites that outgrew a freelancer. Each needs a real case or process we actually run (rules section 8.3). Otherwise fold the use case into a section of the hub.

**Informational support** (Plan 03): "website maintenance checklist", "what does website maintenance include", "how often should wordpress be updated". These pull readers toward the maintenance pages and are owned by Plan 03, not this plan.

**Service definition sheet (the owner fills this in before any pitch is written)**

| Question | Answer |
|---|---|
| What tasks are done, and how often? (updates, backups, security scans, uptime monitoring, performance checks, content edits, fixes) | |
| Does it cover sites **not** hosted with [Brand]? | |
| WordPress only, or other platforms? WooCommerce included or extra? | |
| How many hours or requests per month, if limited? | |
| How do customers ask for help (ticket, email) and what hours do we work? | |
| Response and fix times we can honestly state | |
| Tools used (monitoring, backup, security) and what we may name | |
| Price: per site per month, plans, or custom? Until a maintenance plan is in the pricing data, no price on the pages (owner decision in project specifics) | |
| What is not covered (new design, custom development, third-party plugin bugs) | |
| Reports the customer receives | |
| Contract: minimum term, cancellation, refund terms page | |
| One real example or customer who agreed to be named | |

Until it is filled: draft structure and headlines only. Do not write inclusions, times or prices. Each fact then becomes a feature claim in the claims registry and renders only when verified.

**Pitch and headline:** follow rules sections 11 and 12. The reason in a "because" headline comes from a rendering claim, for example: "We handle your WordPress updates because a failed update should not take your site offline" (needs a verified claim and the restore process described).

**Links to hosting:** each page links to the matching hosting plan and says plainly that maintenance works with or without [Brand] hosting (only if the owner confirms that in the sheet).

## Page template

| # | Block | Rule |
|---|---|---|
| 1 | Hero | H1 names the service and the outcome. CTA: "Book a consultation" (the consultation page). One entity sentence says what the business is, not where it is based. |
| 2 | Direct answer | 40 to 80 words: what we do, for whom, what you get. |
| 3 | Who it suits | Two or three audience types, and one who it does not suit. Honesty builds trust. |
| 4 | What is included | Deliverables as a list, with plain words for each. No guarantees of results. |
| 5 | Process | `ProcessTimeline`: five steps (scope, build, review, launch, support). No invented durations. |
| 6 | Proof | Case study with before and after metrics (load time, conversion, ranking), real client name with permission. Omit the block if none exist. |
| 7 | Pricing approach | "Scoped per project" with what drives the scope. No price unless it is in the pricing file. |
| 8 | Link to hosting | One clear path from a design or SEO page to the hosting plan that fits. |
| 8a | Honest limits | `HonestLimits`: what we do not do and who this does not suit, before the action. |
| 9 | FAQ | Count per `limits.faqItemsByArchetype` in the config. Buyer questions: "Can you guarantee rankings?" (No, and here is what we do commit to.) |
| 10 | CTA | `CTABand`. One primary. |

## Case study and portfolio pages

Format rules: [page-blueprints.md](../rules/page-blueprints.md), Part D. This plan owns them.

- **Real projects only.** Never a mock-up shown as client work.
- **Permission in writing** from the owner and the customer before the page is drafted.
- **Every number in the fact ledger** with its source (analytics export, test report) and date. No number, no claim.
- Say the role we played and what the customer did. Name the limits of the result.
- Uses `CaseStudy` or `Evidence`. AI never writes the results or the quotes (rules section 8.4).

## Headline and maintenance

- The hero uses a reason-led headline where a verified reason exists ([content-writing-rules.md](../rules/content-writing-rules.md) section 12), for example "We rebuild your site because slow pages lose visitors" (needs a sourced fact). It has a fallback without "because".
- A maintenance or care offer is **not pitched** until it exists in the pricing file and the claims (section 11). Do not write around it.
- Case studies, quotes and team bios are real. AI never writes them (section 8.4).

## Rules specific to services

- **Never guarantee rankings, traffic or revenue.** State the work committed and how results are reported.
- **No fake portfolio.** Every project shown is real, with permission, and described with the actual role we played.
- **Show the team.** Named people, roles, LinkedIn links. A faceless agency does not convert.
- **Pricing honesty:** if a price range is shown, it comes from a data file and has a date. If not, say how scoping works and how long a reply takes only if the support claim is verified.
- **Technical depth, second.** Lead with the business outcome ("a site that loads quickly on a phone"), then name the technology (Next.js, WordPress, Core Web Vitals).
- **Tone:** confident, calm, specific. Not "world-class" or "award-winning" unless an award is on file.

## Schema

`Service` with `provider` (Organization), `areaServed`, `serviceType`. `BreadcrumbList`. `FAQPage` matching the visible FAQ. `Review` only with real, linked reviews.

## Internal links (minimum)

The matching hosting page, the consultation page, the about page (team), a case study or guide, the pricing page where hosting is bundled.

## Keyword notes

Target: small business, redesign, WordPress, Next.js, technical SEO, and region qualifiers where real (see Plan 05).
Do not target: `web design company` or `seo company` heads, and `best seo agency`.

## Pre-ship checklist

- [ ] At least one real case study or the proof block is omitted
- [ ] No ranking or revenue guarantee
- [ ] Team shown with real names, or the section is honest about what is pending
- [ ] No location claim; where the business is based appears only on the pages the project allows (`business.basedIn.mentionOnlyOn` in `project/settings.json`)
- [ ] One CTA, pointing to the consultation page
- [ ] Lint and page checks pass

## Measure

Consultation bookings, form completions, qualified enquiry rate, position for service keywords, case study page views.
