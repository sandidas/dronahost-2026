# Keyword Register

The single list of keywords the site targets. **One primary keyword per URL, per locale.** Update this file in the same change that publishes or edits a page. `npm run check:register` fails on duplicates and bad values.

> Revised 2026-10-10. Most rows are **seeds** with status `unvalidated`; a row that has a brief or a page shows its real status (`briefed`, `review`). Volume and difficulty are blank on purpose: no live data has been collected. Fill them from Search Console, Ahrefs or SerpAPI and write the source and the date. The intent check is filled only where the live results were read (the date is in the page's brief).

## Columns

| Column | Meaning |
|---|---|
| Keyword | Exact phrase, lowercase |
| Locale | `en-US`, `en-GB`, `en-AE`, `en-IE`, `ar-AE`, `de-DE`, `fr-FR`, `nl-NL` (see [Plan 11](../later/11-localization-country-language-currency.md)) |
| Secondary | Look-alike and supporting phrases that belong on the **same** page. Separate with `;`. |
| Intent check | Page type seen in the live top 10: `product`, `comparison`, `guide`, `fix`, `policy`, `service`, `brand` |
| Volume / KD | Monthly searches and difficulty with source and date. Blank until measured. |
| Target URL | The one page that owns the keyword. `planned` if the URL is not decided. |
| Owner | Person responsible for the page and its review. Blank until assigned. |
| Status | `unvalidated`, `validated`, `briefed`, `drafting`, `review`, `published`, `refresh`, `dropped` |
| Next review | `YYYY-MM-DD`. Required for `published` rows. |
| AI cited | `yes`, `no` or blank (from the monthly spot-check in [Plan 10](../plans/10-ai-search-queries.md)) |

Valid plans are the section titles below (Plans 01 to 10 and Plan 14). Plan 15 (off-site) has no rows here; it is tracked in [roadmap.md](roadmap.md). A concrete URL (one with no `[ ]` and not `planned`) may be the target of **one** row per locale. Extra phrases for the same page go in Secondary.

## Plan 01: Money pages

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| managed wordpress hosting | en-US | wordpress hosting litespeed; wordpress hosting nvme; managed wordpress hosting usa | | | `/wordpress-hosting` | | unvalidated | | |
| managed vps hosting | en-US | vps hosting with root access | | | `/vps-hosting` | | unvalidated | | |
| cloud hosting for small business | en-US | | | | `/cloud-hosting` | | unvalidated | | |
| business web hosting | en-US | small business web hosting | | | `/business-hosting` | | unvalidated | | |
| hosting plans and pricing | en-US | | | | `/pricing` | | unvalidated | | |
| wordpress hosting for agencies | en-US | | | | planned | | unvalidated | | |
| nextjs hosting | en-US | | | | planned | | unvalidated | | |
| wordpress hosting for freelancers | en-US | | | | planned | | unvalidated | | |
| woocommerce hosting | en-US | | | | planned | | unvalidated | | |

## Plan 02: Commercial investigation

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| siteground alternative | en-US | dronahost vs siteground; siteground alternative for small business |  | | `/vs/siteground` | | unvalidated | | |
| kinsta alternative | en-US | dronahost vs kinsta |  | | `/vs/kinsta` | | unvalidated | | |
| wp engine alternative | en-US | dronahost vs wp engine |  | | `/vs/wp-engine` | | unvalidated | | |
| cloudways alternative | en-US | dronahost vs cloudways |  | | `/vs/cloudways` | | unvalidated | | |
| vercel alternative for nextjs | en-US | | | | planned | | unvalidated | | |

## Plan 03: Informational

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| how to migrate wordpress without downtime | en-US | wordpress migration checklist | | | planned | | unvalidated | | |
| shared vs vps vs cloud hosting | en-US | | | | planned | | unvalidated | | |
| what is whois privacy | en-US | | | | planned | | unvalidated | | |
| gdpr checklist for small business websites | en-US | | | | planned | | unvalidated | | |
| website maintenance checklist | en-US | what does website maintenance include | | | planned | | unvalidated | | |
| how to send wordpress email with smtp | en-US | wordpress smtp setup | | | planned | | unvalidated | | |

## Plan 04: Problem and troubleshooting

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| wordpress site slow | en-US | | | | planned | | unvalidated | | |
| how to remove malware from wordpress | en-US | | | | planned | | unvalidated | | |
| error establishing a database connection | en-US | | | | planned | | unvalidated | | |
| wordpress emails going to spam | en-US | | | | planned | | unvalidated | | |
| how to improve ttfb on wordpress | en-US | reduce ttfb wordpress; high ttfb wordpress | guide | | `/kb/improve-ttfb-wordpress` | Sandipan Das | briefed | | |

## Plan 05: Regional hosting

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| wordpress hosting for uk businesses | en-GB | uk gdpr hosting; managed wordpress hosting uk | | | `/hosting/uk` | | unvalidated | | |
| hosting for eu businesses | en-US | web hosting for eu businesses | | | `/hosting/eu` | | unvalidated | | |
| wordpress hosting for us businesses | en-US | | | | `/hosting/us` | | unvalidated | | |
| uae web hosting | en-AE | wordpress hosting dubai | | | `/hosting/uae` | | unvalidated | | |

## Plan 06: Service pages

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| wordpress web design for small business | en-US | affordable website redesign services | | | `/web-design` | | unvalidated | | |
| seo services for small business | en-US | technical seo retainer | | | `/seo-services` | | unvalidated | | |
| react nextjs development agency | en-US | custom web app development for small business | | | `/custom-development` | | unvalidated | | |
| web design agency for small business uk | en-GB | | | | planned | | unvalidated | | |
| website maintenance services | en-US | website maintenance plans; website maintenance company; wordpress maintenance services; wordpress maintenance plans; wordpress care plan; woocommerce maintenance services; woocommerce store maintenance; website management services; managed website services; website support services; website helpdesk |  | | `/website-maintenance` | | unvalidated | | |
| conversion rate optimization services | en-US | website growth services; website integration services |  | | `/growth-services` | | unvalidated | | |
| website project consultation | en-US | book a website consultation; talk to a web developer |  | | `/consultation` | | unvalidated | | |

## Plan 07: Compliance and trust

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| is my web hosting gdpr compliant | en-US | | | | `/kb/gdpr-and-your-web-host` | | unvalidated | | |
| do i need a dpa with my hosting provider | en-US | data processing agreement hosting | | | `/kb/data-processing-agreement-hosting` | | unvalidated | | |
| uk gdpr requirements for website owners | en-GB | | | | `/kb/uk-gdpr-website-owners` | | unvalidated | | |
| ccpa requirements for small business websites | en-US | | | | `/kb/ccpa-website-owners` | | unvalidated | | |
| uae pdpl for website owners | en-AE | | | | `/kb/uae-pdpl-website-owners` | | unvalidated | | |

## Plan 08: Domains

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| register .co.uk domain | en-GB | | | | `/domains/co-uk` | | unvalidated | | |
| .ae domain registration | en-AE | | | | `/domains/ae` | | unvalidated | | |
| transfer domain to dronahost | en-US | | | | `/domains/transfer` | | unvalidated | | |
| domain registration | en-US | register a domain name; buy a domain name |  | | `/domains` | | unvalidated | | |

## Plan 09: Navigational and brand

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| dronahost | en-US | hosting for small business | brand | | `/` | Sandipan Das | review | 2027-04-08 | |
| dronahost reviews | en-US | | | | `/reviews` | | unvalidated | | |
| is dronahost legit | en-US | | | | `/about` | | unvalidated | | |

## Plan 14: Migration and email

| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |
|---|---|---|---|---|---|---|---|---|---|
| free wordpress migration | en-US | wordpress migration service; free website migration | | | `/migration` | | unvalidated | | |
| business email for your domain | en-US | email for small business website; google workspace for small business; google workspace pricing | | | `/email` | | unvalidated | | |

## Excluded keywords (do not target)

| Keyword | Reason |
|---|---|
| best web hosting, web hosting | Dominated by large brands and affiliate sites |
| cheap hosting, free web hosting | Price-only or wrong intent |
| `[location]` near me | No physical presence |
| hipaa or pci compliant hosting | No verified support, claim not allowed |
| gdpr compliant hosting | Implies a compliance claim. Use "hosting for eu businesses" until the legal review is done |
| whatsapp support hosting, live chat hosting support | We do not offer these channels |
| best seo agency, web design company | Head terms, too competitive, no proof yet |

## Cannibalization check

Before adding a row, search this file for the primary keyword and its close variants. If a row exists, add the phrase to that row's Secondary column instead. Run `npm run check:register`. It fails when:
- the same keyword and locale appear twice,
- a concrete URL is the target of two rows in the same locale,
- a keyword is listed in both a primary row and any row's Secondary column,
- a status, locale or date is invalid, or a `published` row has no review date.

It warns when one primary keyword contains another primary keyword and the two target different URLs (a likely overlap to review by hand).

### Overlaps resolved (2026-10-10)

The owner asked Claude to settle these (decision 52).

- **Competitors:** one page per competitor at `/vs/[competitor]` (the only comparison route). It owns "[competitor] alternative"; "dronahost vs [competitor]" is its Secondary. There are no `/alternatives/*` pages.
- **Maintenance:** one page, `/website-maintenance`, owns the service. WordPress, WooCommerce, management and support phrases are its Secondary until the service sheet (Plan 06) shows a real difference that needs its own page.
- **Routes that had no row:** `/growth-services` ("conversion rate optimization services"), `/consultation` ("website project consultation") and `/domains` ("domain registration") now have rows. All are seeds (`unvalidated`) until a tool records volume and the live results confirm the intent.
- **Email:** `/email` owns "business email for your domain", with "google workspace for small business" as a secondary phrase, now that the plans are in the pricing file (decision 56).
