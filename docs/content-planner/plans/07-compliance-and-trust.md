# Plan 07: Compliance, Trust and Policies

**Intent:** the searcher is checking whether they can legally and safely use us. Often a business owner, a lawyer or an IT lead. They read slowly and screenshot proof.
**Goal:** answer the doubt so completely that the page can be forwarded to a decision maker.
**Owns:** policy pages and compliance explainers that carry search demand.

## Two kinds of page

| Kind | Purpose | Pages |
|---|---|---|
| Policy pages (the proof) | State terms exactly. Approved by the owner (Tier A) or a qualified human (Tier B), see "Policy tiers". | `/refund-policy`, `/support-policy`, `/migration-terms`, `/pricing-policy`, `/fair-use-policy`, `/backup-policy`, `/security`, `/sla`, `/terms`, `/privacy`, `/cookie-policy`, `/data-processing`, `/sub-processors`, `/acceptable-use-policy`, `/data-retention` |
| Compliance explainers (the search) | Rank for **question and checklist** queries about a rule, explain it, then link to the policy page and the regional hosting page. | `/kb/gdpr-and-your-web-host`, `/kb/data-processing-agreement-hosting`, `/kb/uk-gdpr-website-owners`, `/kb/ccpa-website-owners`, `/kb/uae-pdpl-website-owners` (all planned) |

**No overlap with Plan 05.** A buying search ( "hosting for eu businesses" ) belongs to `/hosting/eu`. A learning search ( "is my host gdpr compliant" ) belongs to an explainer. Explainers never use a product-style title or a "buy" call to action, and they link to the regional page as the next step.

The claims system depends on policy pages. A claim renders only when its terms page is published and reviewed (see content-writing rules, "Claims discipline"). Publishing these pages unlocks guarantee, SLA and support lines across the whole site, so they are the highest-leverage content on the site.

## Policy page rules

- Written for the jurisdictions we sell into: US, UK, EU, UAE. Plain English first, legal detail second.
- Each page has `Effective from [date]` and a visible change log.
- Never publish a draft as final. Until legal review, the page shows a draft notice and the claim stays hidden.
- Specific content requirements:
  - **`/refund-policy`:** the money-back window, what is refundable, how to request, how long it takes, exclusions (domains, add-ons). Terms for `money-back` live here. The renewal promise lives on `/pricing-policy`.
  - **`/sla`:** uptime target, how it is measured, service credits, exclusions, how to claim. Required before `uptime-sla` renders.
  - **`/security`:** data protection, backups, access control, incident response, breach notice (72 hours). No claim of a test or certification we do not hold.
  - **`/data-processing`:** the DPA as a downloadable PDF, sub-processors list, transfer mechanisms (SCCs), contact for requests.
  - **`/support-policy`:** hours and channels (ticket and email only). Required before `support-24-7` renders.
  - **`/migration-terms`:** what "free migration" covers and excludes. Required before `free-migration` renders.
  - **`/pricing-policy`:** billing cycles, renewal price, taxes, price changes, cancellation. Required before `renewal-price-same` renders.

## Policy tiers: who may approve a page

**Reviewer status (owner, 2026-10-07): no legal reviewer is appointed.** The owner approves the business's own commercial promises. A qualified human must review the legal documents. Claude may draft either kind. Claude never publishes a Tier B document without that review (content rules section 8.4: no AI for unreviewed legal text).

| Tier | Pages | Approved by | Why |
|---|---|---|---|
| **A: commercial promises** | `/refund-policy`, `/support-policy`, `/migration-terms`, `/pricing-policy`, `/fair-use-policy`, `/backup-policy`, `/security` (operational facts only), `/sla` | The owner, after the Tier A checklist. A lawyer's read is recommended, not required | These state what DronaHost will do. The owner decides, and the promise must match operations |
| **B: legal documents** | `/terms`, `/privacy`, `/cookie-policy`, `/data-processing`, `/sub-processors`, `/acceptable-use-policy`, `/data-retention`, regional compliance pages and explainers | A qualified human (a lawyer with the right jurisdictions, or a reputable legal-document service whose output the owner reviews). Name and date recorded | Liability, data protection and cross-border duties carry legal risk that a draft cannot carry |

**Tier A checklist (the owner ticks every line):**
- [ ] Every sentence matches what operations really does today
- [ ] The claim wording on the site matches the page
- [ ] Exclusions are stated
- [ ] Effective date and change log present
- [ ] A named person owns keeping the page true
- [ ] The page does not depend on `/terms` for the promise

Until a Tier B document is reviewed and published, the page shows a draft notice, and nothing that depends on it renders.

## Policy page briefs (what each page must contain)

Facts in the last column are for the owner. Claude drafts from the answers and flags the rest `[HUMAN REVIEW]`.

| Page | Tier | Unlocks | Must contain | The owner provides |
|---|---|---|---|---|
| `/refund-policy` | A | `money-back` | The window and when it starts, what is refundable, exclusions (domains, add-ons), how to request, how long a refund takes and how it is paid, what happens to the account | Exact window, exclusions, refund time, abuse conditions |
| `/support-policy` | A | `support-24-7` | Channels (ticket and email), what "24/7" means in practice, hours per plan with a timezone, what is and is not supported, escalation, language | What 24/7 means with ticket and email only, who answers overnight, plan differences |
| `/migration-terms` | A | `free-migration` | What is moved (platform, how many sites per plan), what is excluded, what the customer must provide, that the old site stays live until the switch (only if true), any limits | Scope, limits, process, exclusions |
| `/pricing-policy` | A | `renewal-price-same` | Billing cycles, renewal price rule for each cycle, taxes (GST for India), how and when a price can change and with what notice, add-ons, domains, failed payments, cancellation | **How long "renewal equals signup price" lasts**, and whether a later price rise would apply to existing customers |
| `/fair-use-policy` | A | plan limits | What fair use means, the resource limits that apply, what happens first (notice, throttle, upgrade offer). No "unlimited" wording | Resource limits and enforcement steps |
| `/backup-policy` | A | backup lines on plans | Frequency, retention per plan, where backups are stored, how to restore, what is not guaranteed, the offsite add-on | Real frequency and retention, storage location |
| `/security` | A | security lines | Operational facts only: access control, updates, backups, incident handling. No certification we do not hold | Facts that are true today |
| `/sla` | A | `uptime-sla` | Target, how it is measured, exclusions, service credits and how to claim. Only after a measured basis exists | Whether an SLA exists, measurement method, credit rules |
| `/terms` | B | none directly | Service, accounts, payment, cancellation and suspension, liability, governing law, how policies relate | Governing law and jurisdiction, legal entity |
| `/privacy` | B | none directly | Data collected (WHMCS, payments, analytics, support), purposes, legal bases, transfers (India and the WHMCS host), rights, retention, contacts, representatives where required, Indian law | Real data flows, legal entity, contacts |
| `/cookie-policy` | B | none directly | Cookie list from the consent tool, purposes, how to withdraw consent | The final consent tool configuration |
| `/data-processing` | B | none directly | DPA as a versioned PDF, roles, security measures, transfers, breach notice, deletion | Reviewed DPA text |
| `/sub-processors` | B | none directly | Company, purpose, location, link to its terms, date of change, change-notice method | Confirmed list from the infrastructure registry |
| `/acceptable-use-policy` | B | none directly | Prohibited use, enforcement, abuse contact, takedown process | Enforcement practice |
| `/data-retention` | B | none directly | What is kept after cancellation and for how long, deletion process, the email discontinuation sunset | Real retention periods |

## Tax and consumer price display (needs an adviser)

The owner rule is one plain line: "Prices exclude tax. Customers in India pay GST at checkout." As the reviewer understands it, businesses outside the UK and the EU that sell digital services to **consumers** there generally have to register for VAT and show consumer prices including VAT, while sales to registered **businesses** are treated differently. The one-line rule may therefore not fit sole traders and private customers in the UK and EU. This is not a legal conclusion. Ask a tax adviser before selling actively to those markets, and record the answer. Until then, say nothing more than the plain line, and do not target UK or EU consumers in ads or pages.

## Compliance explainer template

| # | Block | Rule |
|---|---|---|
| 1 | H1 | The question: "Is my web hosting GDPR compliant?" |
| 2 | Answer first | 40 to 80 words: what the rule asks of a site owner and which part is the host's job. |
| 3 | Who is responsible | Table: controller (the customer), processor (the host), what each must do. |
| 4 | What DronaHost provides | Only verified items: DPA, backups, access controls. Link to the policy pages. |
| 5 | What you still need to do | Cookie banner, privacy policy, consent logging, data subject requests. This honesty is the point. |
| 6 | Checklist | Printable. |
| 7 | FAQ | "Do I need a DPA with my host?" and similar. |
| 8 | Disclaimer | "This is general information, not legal advice." |

## Keyword seeds (unvalidated)

Target (question and checklist intent only): is my web hosting gdpr compliant, do i need a dpa with my hosting provider, gdpr checklist for small business websites, uk gdpr requirements for website owners, ccpa requirements for small business websites, uae pdpl for website owners.
Owned by Plan 05, not here: hosting for eu businesses, uk gdpr hosting, uae web hosting.
Do not target: `hipaa compliant hosting` and `pci compliant hosting` unless we hold and can show the support for them. Never claim a regime we have not been assessed against.

## Data location statements (WHMCS in Europe, company in India)

- Billing and account data sits in WHMCS on a server in Europe. The team works from India and accesses it from there.
- The privacy policy and the DPA must say: what data WHMCS holds, that WHMCS is a processor, the hosting location (once recorded), who may access it from India and the transfer mechanism (for the EU and the UK, usually standard contractual clauses). A legal reviewer writes it.
- A public sentence about the billing data location is a claim. Add it to `content/claims.ts` as unverified, and render it only when verified and its terms page is published.
- Never write "your data stays in Europe" without proof that covers the data in question. Billing data, customer websites and backups are different things in different places.

## Representatives and applicable law (needs a lawyer)

DronaHost is outside the EU, the UK and the UAE but sells to people there. Using AWS, Google Cloud or other reputed providers does not remove these duties.

- The EU and UK GDPR can apply to a non-EU business that offers services to people there. In many cases such a business must appoint a local representative and name them in the privacy policy. A legal reviewer decides whether this applies and who acts.
- The UAE PDPL and Indian data protection law may also apply. List which laws the policies rely on.
- Each infrastructure provider has its own data processing terms. Sign and file them, and list the provider as a sub-processor.
- Until the reviewer decides, policy pages do not claim compliance. They state what we do.

## Naming providers (we buy servers and resell hosting)

DronaHost buys servers from AWS, Google Cloud, DigitalOcean, Hetzner and others and resells hosting on them. These companies are sub-processors and must be listed. That does not mean we may use their names in marketing.

- **Marketing pages:** say "runs on infrastructure from leading cloud providers". Do not name providers, show their logos, or write "powered by", "partner" or "certified by". Those can breach trademark terms and imply an endorsement we do not have.
- **Sub-processor list, DPA and privacy policy:** name each provider factually, as the law expects.
- **Before naming a provider anywhere beyond that,** read its trademark and reseller or acceptable-use terms and record the result. The owner can change this default for a provider that allows it.
- Do not repeat a provider's certifications or uptime as our own. Cite them as the provider's, with a link and a date, or leave them out.
- Do not describe the product as "reseller hosting" unless that is what we sell. Describe what the customer gets.

## Sub-processors (we run on rented infrastructure)

Because customer data sits on AWS, Google Cloud, DigitalOcean and Hetzner, and payments go through Stripe and PayPal, these companies process data for us. GDPR and UK GDPR expect them to be listed.

- Publish a **sub-processor list** at `/sub-processors` (planned): company, what it does, where it processes data, link to its own terms, date of last change. Link it from the DPA, privacy policy and footer.
- Candidates to check: AWS, Google Cloud, DigitalOcean, Hetzner (hosting), Stripe, PayPal (payments), the WHMCS host, the email sender (`@aws-sdk/client-sesv2` is in the code), analytics, support tools. Include only what we really use.
- Say how customers are told about a change (for example, a notice period) in the DPA. A legal reviewer writes it.
- The list is a policy page: reviewed, dated, and kept in step with the infrastructure registry ([Plan 05](05-regional-and-location.md)).
- Never describe a sub-processor's certification or location unless we checked it on the provider's own page and recorded the date.

## Trust elements around the site

| Element | Where | Source |
|---|---|---|
| Registered company name and number, address | Footer, `/about` | `content/company.ts` (verified only) |
| Team names, photos, LinkedIn | `/about` | Real people only |
| Review scores | Home, product pages | Real platform links only (Trustpilot, G2, HostAdvice, Clutch) |
| Security badges | Footer | Only for things we actually hold |

## Schema

`WebPage` with `BreadcrumbList`. `Organization` details match the registry. `FAQPage` for explainers.

## Pre-ship checklist

- [ ] Reviewed by a qualified legal reviewer, name and date recorded
- [ ] Every statement matches what we do today
- [ ] `termsPageStatus` in `content/claims.ts` updated only after publication
- [ ] Draft notice removed only after review
- [ ] Effective date and change log present
- [ ] DPA PDF downloads and has a version number

## Measure

Claims unlocked, DPA downloads, time on page from regional product pages, support tickets asking questions the policy now answers (should fall).
