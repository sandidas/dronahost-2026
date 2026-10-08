# Plan 08: Domains

**Intent:** a mix of transactional ("register example.co.uk"), informational ("what is whois privacy") and navigational ("transfer my domain"). Domain searchers act fast and are very price-aware.
**Goal:** convert availability checks into registrations and bundle with hosting, with prices shown honestly.
**Owns:** domain and TLD queries.

## Workflow fit

- **Workflow:** [content-writer-workflow.md](../rules/content-writer-workflow.md), Stages 0 to 3 and 5 to 7 (page spec). This plan supplies the outline (Stage 3), the CTA and the checklist (Stage 6).
- **Intent:** Buy (domains).
- **Interview:** the **Domain pages** bank in [interview-questions.md](../rules/interview-questions.md). Ask the questions exactly as written, one at a time.
- **Brief and limits:** [brief.md](../templates/brief.md) holds the field list, including the information gain and the original element. [governor.md](../rules/governor.md) holds the caps. Length, title, description and reading limits are in the config, not in this plan.
- **Schema:** FAQ and HowTo markup give no Google rich result ([sources.md](../rules/sources.md), item 5). Use them only when they match the visible content and help the reader.

## Pages

| Page | URL | Status | Seed keywords (unvalidated) |
|---|---|---|---|
| Domain search | `/domains` | exists | domain registration, buy a domain name |
| TLD pages | `/domains/[tld]` | planned | register .co.uk domain, .ae domain registration, .eu domain, .de domain, .us domain, .co domain |
| Transfer | `/domains/transfer` | planned | transfer domain to [brand] |
| Domain with hosting | section on product pages | planned | domain and hosting together |
| Guides | `/kb/[slug]` | planned | see [Plan 03](03-informational.md) domains cluster |

TLD pages match the registrar's supported list (the project specifics name it). Publish a TLD page only after the registrar integration supports it.

Project specifics for this plan: [plan-specifics/08-domains.md](../project/plan-specifics/08-domains.md) (supported TLD list, gate, owner decision).

> **Gate:** while the registrar integration is not live, `/domains` and TLD pages describe the service and link to the contact page. They do not show a live search box or live prices.

**Price source rule:** until a synced price source exists, domain and TLD pages show no price. When it exists, prices come only from the synced data with a fetch date, never typed.

## Pricing and legal rules

- **Price includes the ICANN fee** where required, shown in the displayed price (a US legal requirement).
- Show **registration and renewal** prices side by side. Renewal pricing is the top complaint in this market.
- Prices come from the domain pricing source (`lib/services/domains.ts` cache, refreshed hourly) or `pricing.json`. Never typed into copy.
- WHOIS privacy: say it is on by default only once the integration does it and a claim confirms it.
- Region TLD rules (such as eligibility for `.eu`, `.ae`, `.co.uk`) are stated plainly and sourced from the registry's policy. Review them yearly.

## TLD page template

1. **H1:** "Register a `.co.uk` domain" (the TLD in the first words).
2. **Direct answer:** what the TLD is for, who can register it, and the price line (from the data source).
3. **Search box:** domain availability, debounced, 10-second timeout, clear error and empty states per the content rules.
4. **Who it suits:** UK businesses and individuals, with honest notes on eligibility.
5. **What you get:** DNS management, WHOIS privacy (only if verified), email forwarding if supported.
6. **Pair with hosting:** a short block to the matching plan.
7. **FAQ:** "Do I need a UK address for .co.uk?", "How long does registration take?", "Can I transfer later?"
8. **CTA:** one, "Check availability".

## Transfer page

Steps in plain language: unlock at the current registrar, get the auth code, start the transfer, confirm by email, wait for completion. Say what happens to the expiry date, what the extra year costs, and the 60-day lock after a registration (check current ICANN rule before publishing).

## Keyword notes

Target: specific TLDs with regional intent, transfer and switching queries, "domain and hosting for small business".
Do not target: "cheap domains", "free domain", "domain name generator" (utility intent we do not serve), or any single-word domain terms.

## Schema

`WebPage`, `BreadcrumbList`, `FAQPage`. `Product` and `Offer` for the TLD with the current price only where the price is stable and sourced.

## Internal links (minimum)

The hosting plan that pairs with it, `/pricing`, the relevant regional page, a domains guide in the KB, `/contact`.

## Pre-ship checklist

- [ ] Registration and renewal price both shown, ICANN fee included
- [ ] TLD is supported by the registrar integration
- [ ] Eligibility rules checked against the registry source
- [ ] No claim about WHOIS privacy unless live
- [ ] Availability search has loading, error and empty states

## Measure

Availability checks, registrations, domain plus hosting attach rate, transfers started, position for each TLD keyword.
