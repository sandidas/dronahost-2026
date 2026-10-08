# Plan 06: Service Pages (agency intent)

**Intent:** the searcher wants a team to do the work: build a site, fix search traffic, develop an app. They compare agencies by proof, process and fit.
**Goal:** a qualified enquiry or booked consultation, not a purchase button.
**Owns:** `web design`, `website redesign`, `seo services`, `custom web development`, `agency`, `hire` queries.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), Stages 0 to 3 and 5 to 7 (page spec). This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Buy (service).
- **Interview:** The **Service page** bank in [interview-questions.md](../rules/interview-questions.md).
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ and HowTo markup give no Google rich result ([sources.md](../rules/sources.md), item 5). Use them only when they match the visible content and help the reader.

## Pages

| Page | URL | Status | Seed keywords (unvalidated) |
|---|---|---|---|
| Web design | `/web-design` | exists | wordpress web design for small business; affordable website redesign services |
| SEO services | `/seo-services` | exists | seo services for small business; technical seo retainer |
| Custom development | `/custom-development` | planned (growth services page exists) | react nextjs development agency; custom web app development for small business |
| Growth services | `/growth-services` | exists | website growth services |
| Consultation | `/consultation` | exists | the conversion page for this plan |
| Regional versions | `/web-design/[region]` | planned | see [Plan 05](05-regional-and-location.md) |
| Sub-services | `/web-design/[type]` | planned | ecommerce website design; website redesign for slow sites |

Add sub-service pages only for work we have delivered and can show. A page about a service with no case study is a weak page.

## Maintenance cluster (service confirmed by the owner)

[Brand] offers website maintenance once the owner has confirmed the service and its list. Scope, price and response times may be **not defined yet**. Then pages can be planned and drafted but cannot state what is included, how fast we respond or what it costs until the service sheet below is filled.

Project specifics for this plan: [plan-specifics/06-service-pages.md](../project/plan-specifics/06-service-pages.md) (the owner's confirmed service list, owner decisions, location sentence).

| Page | URL (planned) | Searcher thinks | Primary keyword seed (unvalidated) | Status |
|---|---|---|---|---|
| Hub: website maintenance | `/website-maintenance` | "I need someone to keep my site updated and safe" | website maintenance services | planned |
| WordPress maintenance | `/wordpress-maintenance` | "Updates, backups and fixes for my WordPress site" | wordpress maintenance services | planned |
| WooCommerce maintenance | `/woocommerce-maintenance` | "My shop cannot go down" | woocommerce maintenance services | planned |
| Website management | `/website-management` | "Run the whole site for me" (content edits, updates, reports) | website management services | planned |
| Support and helpdesk | `/website-support` | "Fix things when they break, on request" | website support services | planned |
| Use cases | `/website-maintenance/[use-case]` | "Is this for a site like mine?" | see below | only with a real example |

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

Until it is filled: draft structure and headlines only. Do not write inclusions, times or prices. Each fact then becomes a feature claim in `content/claims.ts` and renders only when verified.

**Pitch and headline:** follow rules sections 11 and 12. The reason in a "because" headline comes from a rendering claim, for example: "We handle your WordPress updates because a failed update should not take your site offline" (needs a verified claim and the restore process described).

**Links to hosting:** each page links to the matching hosting plan and says plainly that maintenance works with or without [Brand] hosting (only if the owner confirms that in the sheet).

## Page template

| # | Block | Rule |
|---|---|---|
| 1 | Hero | H1 names the service and the outcome. CTA: "Book a consultation" (`/consultation`). Include the location sentence from project specifics. |
| 2 | Direct answer | 40 to 80 words: what we do, for whom, what you get. |
| 3 | Who it suits | Two or three audience types, and one who it does not suit. Honesty builds trust. |
| 4 | What is included | Deliverables as a list, with plain words for each. No guarantees of results. |
| 5 | Process | `ProcessTimeline`: listen, scope, build, review, launch, support. No invented durations. |
| 6 | Proof | Case study with before and after metrics (load time, conversion, ranking), real client name with permission. Omit the block if none exist. |
| 7 | Pricing approach | "Scoped per project" with what drives the scope. No price unless it is in `pricing.json`. |
| 8 | Link to hosting | One clear path from a design or SEO page to the hosting plan that fits. |
| 9 | FAQ | Buyer questions: "Can you guarantee rankings?" (No, and here is what we do commit to.) |
| 10 | CTA | One primary. |

## Headline and maintenance

- The hero uses a reason-led headline where a verified reason exists ([content-writing-rules.md](../rules/content-writing-rules.md) section 12), for example "We rebuild your site because slow pages lose visitors" (needs a sourced fact). It has a fallback without "because".
- A maintenance or care offer is **not pitched** until it exists in `pricing.json` and the claims (section 11). Do not write around it.
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

The matching hosting page, `/consultation`, `/about` (team), a case study or blog guide, `/pricing` where hosting is bundled.

## Keyword notes

Target: small business, redesign, WordPress, Next.js, technical SEO, and region qualifiers where real (see Plan 05).
Do not target: `web design company` or `seo company` heads, and `best seo agency`.

## Pre-ship checklist

- [ ] At least one real case study or the proof block is omitted
- [ ] No ranking or revenue guarantee
- [ ] Team shown with real names, or the section is honest about what is pending
- [ ] Location stated honestly
- [ ] One CTA, pointing to `/consultation`
- [ ] Lint and page checks pass

## Measure

Consultation bookings, form completions, qualified enquiry rate, position for service keywords, case study page views.
