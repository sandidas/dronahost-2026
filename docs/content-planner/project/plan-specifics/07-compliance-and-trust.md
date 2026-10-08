# Project specifics for Plan 07: Compliance, Trust and Policies

Generic plan: [../../plans/07-compliance-and-trust.md](../../plans/07-compliance-and-trust.md). Placeholders in the plan map to the text below. The original wording is kept.

## Policy page rules (`/support-policy`)

- **`/support-policy`:** hours and channels (ticket and email only). Required before `support-24-7` renders.

## Policy tiers: who may approve a page (Tier A reason)

- Tier A reason column: "These state what DronaHost will do. The owner decides, and the promise must match operations"

## Policy page briefs

- `/support-policy` must contain: Channels (ticket and email), what "24/7" means in practice, hours per plan with a timezone, what is and is not supported, escalation, language. The owner provides: What 24/7 means with ticket and email only, who answers overnight, plan differences.
- `/pricing-policy` must contain: Billing cycles, renewal price rule for each cycle, taxes (GST for India), how and when a price can change and with what notice, add-ons, domains, failed payments, cancellation.
- `/privacy` must contain: Data collected (WHMCS, payments, analytics, support), purposes, legal bases, transfers (India and the WHMCS host), rights, retention, contacts, representatives where required, Indian law.

## Tax and consumer price display (needs an adviser)

The owner rule is one plain line: "Prices exclude tax. Customers in India pay GST at checkout."

## Compliance explainer template (block 4)

- Block 4 heading: "What DronaHost provides"

## Data location statements (WHMCS in Europe, company in India)

- Billing and account data sits in WHMCS on a server in Europe. The team works from India and accesses it from there.
- The privacy policy and the DPA must say: what data WHMCS holds, that WHMCS is a processor, the hosting location (once recorded), who may access it from India and the transfer mechanism (for the EU and the UK, usually standard contractual clauses). A legal reviewer writes it.
- Never write "your data stays in Europe" without proof that covers the data in question. Billing data, customer websites and backups are different things in different places.

## Representatives and applicable law (needs a lawyer)

DronaHost is outside the EU, the UK and the UAE but sells to people there. Using AWS, Google Cloud or other reputed providers does not remove these duties.

- The UAE PDPL and Indian data protection law may also apply. List which laws the policies rely on.

## Naming providers (we buy servers and resell hosting)

DronaHost buys servers from AWS, Google Cloud, DigitalOcean, Hetzner and others and resells hosting on them. These companies are sub-processors and must be listed. That does not mean we may use their names in marketing.

## Sub-processors (we run on rented infrastructure)

Because customer data sits on AWS, Google Cloud, DigitalOcean and Hetzner, and payments go through Stripe and PayPal, these companies process data for us. GDPR and UK GDPR expect them to be listed.

- Candidates to check: AWS, Google Cloud, DigitalOcean, Hetzner (hosting), Stripe, PayPal (payments), the WHMCS host, the email sender (`@aws-sdk/client-sesv2` is in the code), analytics, support tools. Include only what we really use.

## Trust elements around the site

- Review scores source: Real platform links only (Trustpilot, G2, HostAdvice, Clutch)
