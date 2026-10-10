# Project specifics: Plan 06 Service Pages

Core plan: [../../plans/06-service-pages.md](../../plans/06-service-pages.md). Original wording is kept below, under the plan section it belongs to.

## Maintenance cluster (service confirmed by the owner, 2026-10-07)

DronaHost offers website maintenance. The owner's service list: website maintenance, website management, WooCommerce maintenance, WordPress maintenance, website support and helpdesk, and maintenance use cases. Scope, price and response times are **not defined yet**, so pages can be planned and drafted but cannot state what is included, how fast we respond or what it costs until the service sheet below is filled.

Service definition sheet, row "Does it cover sites not hosted with DronaHost?" refers to the brand: | Does it cover sites **not** hosted with DronaHost? | |

Service definition sheet, price row (original wording): | Price: per site per month, plans, or custom? Owner decision: the maintenance plan is added to `pricing.json` later. Until then no price on the pages | |

Original use-case wording: **Use-case pages** (only when we have a real example and permission): agencies that need maintenance for client sites, online shops, small business sites after a move to DronaHost, sites that outgrew a freelancer. Each needs a real case or process we actually run (rules section 8.3). Otherwise fold the use case into a section of the hub.

Original hosting-link wording: **Links to hosting:** each page links to the matching hosting plan and says plainly that maintenance works with or without DronaHost hosting (only if the owner confirms that in the sheet).

## Page template, block 1 (Hero)

| 1 | Hero | H1 names the service and the outcome. CTA: "Book a consultation" (`/consultation`). Include the location sentence: "A team based in India working with clients worldwide." |

## Moved from the core plan, 2026-10-10

### Pages

| Page | URL | Status | Seed keywords (unvalidated) |
|---|---|---|---|
| Web design | `/web-design` | exists | wordpress web design for small business; affordable website redesign services |
| SEO services | `/seo-services` | exists | seo services for small business; technical seo retainer |
| Custom development | `/custom-development` | planned (growth services page exists) | react nextjs development agency; custom web app development for small business |
| Growth services | `/growth-services` | exists | website growth services |
| Consultation | `/consultation` | exists | the conversion page for this plan |
| Regional versions | `/web-design/[region]` | planned | see [Plan 05](05-regional-and-location.md) |
| Sub-services | `/web-design/[type]` | planned | ecommerce website design; website redesign for slow sites |

### Maintenance cluster pages

| Page | URL (planned) | Searcher thinks | Primary keyword seed (unvalidated) | Status |
|---|---|---|---|---|
| Hub: website maintenance | `/website-maintenance` | "I need someone to keep my site updated and safe" | website maintenance services | planned |
| WordPress maintenance | a section of `/website-maintenance` (decision 52; was `/wordpress-maintenance`) | "Updates, backups and fixes for my WordPress site" | wordpress maintenance services | planned |
| WooCommerce maintenance | a section of `/website-maintenance` (decision 52; was `/woocommerce-maintenance`) | "My shop cannot go down" | woocommerce maintenance services | planned |
| Website management | a section of `/website-maintenance` (decision 52; was `/website-management`) | "Run the whole site for me" (content edits, updates, reports) | website management services | planned |
| Support and helpdesk | a section of `/website-maintenance` (decision 52; was `/website-support`) | "Fix things when they break, on request" | website support services | planned |
| Use cases | `/website-maintenance/[use-case]` | "Is this for a site like mine?" | see below | only with a real example |

### Page template, block 1 (Hero): location sentence superseded

The location sentence above ("A team based in India working with clients worldwide.") conflicts with decision 34 (where we are based is said on `/about` only). From 2026-10-10 the core plan asks for an entity sentence that says what the business is, not where. `[HUMAN REVIEW: owner to confirm the entity sentence for service pages]`

### Internal links and checklist

The consultation page is `/consultation`; the about page is `/about`; the pricing page is `/pricing`. Prices: `pricing.json`. Claims: `content/claims.ts`.
