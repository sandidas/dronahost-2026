# Project specifics: Plan 08 Domains

Core plan: [../../plans/08-domains.md](../../plans/08-domains.md). Original wording is kept below, under the plan section it belongs to.

## Pages: supported TLDs

TLD pages match the supported list in CLAUDE.md: `.co.uk`, `.de`, `.fr`, `.nl`, `.eu`, `.ae`, `.us`, `.co`, plus `.com`. Publish a TLD page only after the registrar integration supports it.

## Pages: gate

> **Gate:** `FEATURES.domainSearch` is off until the WHMCS credentials are set. While off, `/domains` and TLD pages describe the service and link to `/contact`. They do not show a live search box or live prices.

## Pages: owner decision

**Owner decision (2026-10-07):** domain prices will sync from WHMCS later. Until the sync exists, domain and TLD pages show no price. When it exists, prices come only from the synced data with a fetch date, never typed.
