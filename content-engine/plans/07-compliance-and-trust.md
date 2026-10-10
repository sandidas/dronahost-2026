# Plan 07: Compliance, Trust and Policies

**Intent:** the searcher is checking whether they can legally and safely use us. Often a business owner, a lawyer or an IT lead. They read slowly and screenshot proof.
**Goal:** answer the doubt so completely that the page can be forwarded to a decision maker.
**Owns:** policy pages and compliance explainers that carry search demand.

Project specifics for this plan: [plan-specifics/07-compliance-and-trust.md](../project/plan-specifics/07-compliance-and-trust.md)

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), All stages; for policy pages Stage 4 output is page-spec copy, not an article. This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Learn. A policy page may declare Find as its secondary intent.
- **Interview:** the **Policy pages** bank in [interview-questions.md](../rules/interview-questions.md). Ask the questions exactly as written, one at a time.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ markup gives no Google rich result ([sources.md](../rules/sources.md), item 5). Use it only when it matches the visible content and helps the reader.

## Two kinds of page

| Kind | Purpose | Pages |
|---|---|---|
| Policy pages (the proof) | State terms exactly. Approved by the owner (Tier A) or a qualified human (Tier B), see "Policy tiers". | `/refund-policy`, `/support-policy`, `/migration-terms`, `/pricing-policy`, `/fair-use-policy`, `/backup-policy`, `/security`, `/sla`, `/terms`, `/privacy`, `/cookie-policy`, `/data-processing`, `/sub-processors`, `/acceptable-use-policy`, `/data-retention` |
| Compliance explainers (the search) | Rank for **question and checklist** queries about a rule, explain it, then link to the policy page and the regional hosting page. | One explainer per regime with search demand, for example `/kb/[regime]-website-owners`. The project's list: the project's plan-specifics |

**No overlap with Plan 05.** A buying search ("hosting for [region] businesses") belongs to the regional page. A learning search ( "is my host gdpr compliant" ) belongs to an explainer. Explainers never use a product-style title or a "buy" call to action, and they link to the regional page as the next step.

The claims system depends on policy pages. A claim renders only when its terms page is published and reviewed (see content-writing rules, "Claims discipline"). Publishing these pages unlocks guarantee, SLA and support lines across the whole site, so they are the highest-leverage content on the site.

## Policy page rules

- Written for the jurisdictions the project sells into (`audience.priorityMarkets` in `project/settings.json`). Plain English first, legal detail second.
- Each page has `Effective from [date]` and a visible change log.
- Never publish a draft as final. Until its review (the owner's checklist for Tier A, a qualified legal reviewer for Tier B), the page shows a draft notice and the claim stays hidden.
- Specific content requirements:
  - **`/refund-policy`:** the money-back window, what is refundable, how to request, how long it takes, exclusions (domains, add-ons). Terms for the money-back claim live here. The renewal promise lives on `/pricing-policy`.
  - **`/sla`:** uptime target, how it is measured, service credits, exclusions, how to claim. Required before the uptime claim renders.
  - **`/security`:** data protection, backups, access control, incident response, breach notice (72 hours). No claim of a test or certification we do not hold.
  - **`/data-processing`:** the DPA as a downloadable PDF, sub-processors list, transfer mechanisms (SCCs), contact for requests.
  - **`/support-policy`:** hours and [Channel] list (only the channels the business really staffs). Required before the support-hours claim renders.
  - **`/migration-terms`:** what "free migration" covers and excludes. Required before the free-migration claim renders.
  - **`/pricing-policy`:** billing cycles, renewal price, taxes, price changes, cancellation. Required before the renewal claim renders.

## Policy tiers: who may approve a page

**Reviewer status:** recorded in the project's plan-specifics. The owner approves the business's own commercial promises. A qualified human must review the legal documents. Claude may draft either kind. Claude never publishes a Tier B document without that review (content rules section 8.4: no AI for unreviewed legal text).

| Tier | Pages | Approved by | Why |
|---|---|---|---|
| **A: commercial promises** | `/refund-policy`, `/support-policy`, `/migration-terms`, `/pricing-policy`, `/fair-use-policy`, `/backup-policy`, `/security` (operational facts only), `/sla` | The owner, after the Tier A checklist. A lawyer's read is recommended, not required | These state what [Brand] will do. The owner decides, and the promise must match operations |
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
| `/refund-policy` | A | the money-back claim | The window and when it starts, what is refundable, exclusions (domains, add-ons), how to request, how long a refund takes and how it is paid, what happens to the account | Exact window, exclusions, refund time, abuse conditions |
| `/support-policy` | A | the support-hours claim | [Channel] list, what "24/7" means in practice, hours per plan with a timezone, what is and is not supported, escalation, language | What 24/7 means with the [Channel] list, who answers overnight, plan differences |
| `/migration-terms` | A | the free-migration claim | What is moved (platform, how many sites per plan), what is excluded, what the customer must provide, that the old site stays live until the switch (only if true), any limits | Scope, limits, process, exclusions |
| `/pricing-policy` | A | the renewal claim | Billing cycles, renewal price rule for each cycle, taxes (see the tax rule in the project specifics), how and when a price can change and with what notice, add-ons, domains, failed payments, cancellation | **The renewal price rule and how long it lasts**, and whether a later price rise would apply to existing customers |
| `/fair-use-policy` | A | plan limits | What fair use means, the resource limits that apply, what happens first (notice, throttle, upgrade offer). No "unlimited" wording | Resource limits and enforcement steps |
| `/backup-policy` | A | backup lines on plans | Frequency, retention per plan, where backups are stored, how to restore, what is not guaranteed, the offsite add-on | Real frequency and retention, storage location |
| `/security` | A | security lines | Operational facts only: access control, updates, backups, incident handling. No certification we do not hold | Facts that are true today |
| `/sla` | A | the uptime claim | Target, how it is measured, exclusions, service credits and how to claim. Only after a measured basis exists | Whether an SLA exists, measurement method, credit rules |
| `/terms` | B | none directly | Service, accounts, payment, cancellation and suspension, liability, governing law, how policies relate | Governing law and jurisdiction, legal entity |
| `/privacy` | B | none directly | Data collected ([Billing system], payments, analytics, support), purposes, legal bases, transfers (the company's [Country] and the [Billing system] host), rights, retention, contacts, representatives where required, the law of the company's [Country] | Real data flows, legal entity, contacts |
| `/cookie-policy` | B | none directly | Cookie list from the consent tool, purposes, how to withdraw consent | The final consent tool configuration |
| `/data-processing` | B | none directly | DPA as a versioned PDF, roles, security measures, transfers, breach notice, deletion | Reviewed DPA text |
| `/sub-processors` | B | none directly | Company, purpose, location, link to its terms, date of change, change-notice method | Confirmed list from the infrastructure registry |
| `/acceptable-use-policy` | B | none directly | Prohibited use, enforcement, abuse contact, takedown process | Enforcement practice |
| `/data-retention` | B | none directly | What is kept after cancellation and for how long, deletion process, any product sunset the project records | Real retention periods |

## Tax and consumer price display (needs an adviser)

The project's tax line is `pricing.taxLine` in `project/settings.json`. Whether one plain line fits consumer sales in each market the project sells into is a question for a tax adviser, not for this plan. Record the adviser's answer in the project's plan-specifics. Until then, say nothing more than the tax line.

## Compliance explainer template

| # | Block | Rule |
|---|---|---|
| 1 | H1 | The question: "Is my web hosting GDPR compliant?" |
| 2 | Answer first | 40 to 80 words: what the rule asks of a site owner and which part is the host's job. |
| 3 | Who is responsible | Table: controller (the customer), processor (the host), what each must do. |
| 4 | What [Brand] provides | Only verified items: DPA, backups, access controls. Link to the policy pages. |
| 5 | What you still need to do | Cookie banner, privacy policy, consent logging, data subject requests. This honesty is the point. |
| 6 | Checklist | Printable. |
| 7 | FAQ | Count per `limits.faqItemsByArchetype` in the config. "Do I need a DPA with my host?" and similar. |
| 8 | Disclaimer | "This is general information, not legal advice." |

## Keyword seeds (unvalidated)

Target (question and checklist intent only): is my web hosting gdpr compliant, do i need a dpa with my hosting provider, gdpr checklist for small business websites, uk gdpr requirements for website owners, ccpa requirements for small business websites, uae pdpl for website owners.
Owned by Plan 05, not here: hosting for eu businesses, uk gdpr hosting, uae web hosting.
Do not target: `hipaa compliant hosting` and `pci compliant hosting` unless we hold and can show the support for them. Never claim a regime we have not been assessed against.

## Data location statements ([Billing system] location, company [Country])

- Where the billing and account data sits, and where the team accesses it from, is recorded in the project specifics.
- The privacy policy and the DPA must say: what data [Billing system] holds, that [Billing system] is a processor, the hosting location (once recorded), who may access it from [Country] and the transfer mechanism (for the EU and the UK, usually standard contractual clauses). A legal reviewer writes it.
- A public sentence about the billing data location is a claim. Add it to the claims registry as unverified, and render it only when verified and its terms page is published.
- Never write "your data stays in [Region]" without proof that covers the data in question. Billing data, customer websites and backups are different things in different places.

## Representatives and applicable law (needs a lawyer)

[Brand] may be based outside the EU, the UK and the UAE while selling to people there. Using [Provider] or other reputed providers does not remove these duties.

- The EU and UK GDPR can apply to a non-EU business that offers services to people there. In many cases such a business must appoint a local representative and name them in the privacy policy. A legal reviewer decides whether this applies and who acts.
- The UAE PDPL and the data protection law of the company's [Country] may also apply. List which laws the policies rely on.
- Each infrastructure provider has its own data processing terms. Sign and file them, and list the provider as a sub-processor.
- Until the reviewer decides, policy pages do not claim compliance. They state what we do.

## Naming providers (we buy servers and resell hosting)

[Brand] buys servers from [Provider] and others and resells hosting on them. These companies are sub-processors and must be listed. That does not mean we may use their names in marketing.

- **Marketing pages:** say "runs on infrastructure from leading cloud providers". Do not name providers, show their logos, or write "powered by", "partner" or "certified by". Those can breach trademark terms and imply an endorsement we do not have.
- **Sub-processor list, DPA and privacy policy:** name each provider factually, as the law expects.
- **Before naming a provider anywhere beyond that,** read its trademark and reseller or acceptable-use terms and record the result. The owner can change this default for a provider that allows it.
- Do not repeat a provider's certifications or uptime as our own. Cite them as the provider's, with a link and a date, or leave them out.
- Do not describe the product as "reseller hosting" unless that is what we sell. Describe what the customer gets.

## Sub-processors (we run on rented infrastructure)

Because customer data sits on [Provider] infrastructure, and payments go through [Payment provider], these companies process data for us. GDPR and UK GDPR expect them to be listed.

- Publish a **sub-processor list** at `/sub-processors` (planned): company, what it does, where it processes data, link to its own terms, date of last change. Link it from the DPA, privacy policy and footer.
- Candidates to check: [Provider] (hosting), [Payment provider] (payments), the [Billing system] host, the email sender, analytics, support tools. Include only what we really use. The named candidates are in the project specifics.
- Say how customers are told about a change (for example, a notice period) in the DPA. A legal reviewer writes it.
- The list is a policy page: reviewed, dated, and kept in step with the infrastructure registry ([Plan 05](05-regional-and-location.md)).
- Never describe a sub-processor's certification or location unless we checked it on the provider's own page and recorded the date.

## Trust elements around the site

| Element | Where | Source |
|---|---|---|
| Registered company name and number, address | Footer, `/about` | The company registry (verified only) |
| Team names, photos, LinkedIn | `/about` | Real people only |
| Review scores | Home, product pages | Real platform links only ([Review platform]) |
| Security badges | Footer | Only for things we actually hold |

## Schema

`WebPage` with `BreadcrumbList`. `Organization` details match the registry. `FAQPage` for explainers.

## Pre-ship checklist

- [ ] Tier A: the owner ticked every line of the Tier A checklist, name and date recorded
- [ ] Tier B: reviewed by a qualified legal reviewer, name and date recorded
- [ ] Every statement matches what we do today
- [ ] `termsPageStatus` in the claims registry updated only after publication
- [ ] Draft notice removed only after review
- [ ] Effective date and change log present
- [ ] DPA PDF downloads and has a version number

## Measure

Claims unlocked, DPA downloads, time on page from regional product pages, support tickets asking questions the policy now answers (should fall).
