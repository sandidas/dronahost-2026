# Plan 12: Billing system data and automation

**Purpose:** decide what the billing system owns, what the website owns, how the two stay in agreement, and which content and search tasks the billing system can automate.
**Not an intent plan.** It supports Plans 01, 05, 08 and 11 and is the content side of a billing integration. It does not change code.

This file is the reusable outline. The facts, owner decisions, audit results and price rules for this project are in the project copy: [project/later/12-billing-system-integration.md](../project/later/12-billing-system-integration.md).

## Sections to fill in for a new project

| # | Section | What to decide |
|---|---|---|
| 1 | Who owns what | Which system holds plans, prices, taxes, customers, orders and invoices, and which holds page copy |
| 2 | Price sync | How prices reach the pricing file (by hand, or by a reviewed pull request). Never fetch prices when a page renders |
| 3 | Audit of the existing system | Products, currencies, tax settings, gateways and customer counts by country, before any product map |
| 4 | Setup for each launch wave | What the billing system needs before each locale or currency goes live |
| 5 | Automations | Which content or search tasks it can trigger (price changes, redirects, notices), and the rules every automation follows |
| 6 | Programmatic pages | Guardrails. See `rules/governor.md`: no page sets built from a template without unique, verified content |
| 7 | Checkout | Hand-off to the billing cart, or a checkout inside the app; what is indexed and what is `noindex` |
| 8 | Gateways and tax | Which payment methods are live, which tax rules apply, and what the page may say until a tax adviser decides |
| 9 | Data location and transfers | Where billing and account data sits, who can access it, and what the privacy policy and the data processing agreement must say |
| 10 | Price display rules | Currency, tax line, renewal price, and what shows when a price is missing |
| 11 | Decisions and open items | Owner decisions with dates; questions still open |
| 12 | Pre-build checklist | What must be true before any integration code is written |
| 13 | Measure | Which events and reports show whether the integration works |
