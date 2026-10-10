# Project specifics: content-writing-rules.md

Core rules: [../../rules/content-writing-rules.md](../../rules/content-writing-rules.md). Project facts and owner decisions that were in the core rules are kept here, under the rules section they belong to.

## Moved from the core plan, 2026-10-10

### Section 4, Urgency (renewal price)

Original wording: "Renewal price equals the signup price (decision #5). Never write an introductory price that "renews at" a higher price, and never imply one. **Every plan card shows the renewal price** ("Renews at $X/month", from `pricing.renewal` in `data/pricing.json`). The promise wording ("same price, no increase") is gated by claims: it renders only when `renewal-price-same` renders."

### Section 4, Money-back CTA support copy

Original wording: "30-day money-back guarantee. Read the refund policy. (only while the `money-back` claim renders)".

### Section 5, Contact form errors

Original wording: "Your message could not be sent right now. Please email us directly at {{support email from claims.ts}} or try again. (TODO(decision #6): the support address is unconfirmed.)"

### Section 7, Internal linking rules

Original wording: "TODO(decision #7): the URLs below are the paths used in these rules and may differ from the live URL map. Regional pages (`/hosting/uk`, `/hosting/us`) are Phase 2 (decision #8) and do not exist yet."

| Page | Must link to |
|---|---|
| `/wordpress-hosting` | `/pricing`, a regional page (if it exists), `/blog` (relevant post), a comparison page (if it exists) |
| `/vps-hosting` | `/pricing`, `/security`, `/contact` |
| Blog posts | Relevant product page, `/pricing`, 1–2 other relevant blog posts |
| `/vs/[competitor]` | `/pricing`, the relevant plan page, `/contact` |

### Section 8.5, Disclose AI use

**Owner decision (7 October 2026):** the editorial policy page and the "AI-assisted" line are accepted.

### Section 9, Interactive landing pages

Original wording: "then the existing domain search once `domainSearch` is on." Plan finder example: "Growth, because you need 3 sites and 5 email accounts".

### Section 10, Comparison tables

Our services compared: WordPress, VPS, Cloud and Business hosting. Lives on money pages and `/pricing`.

### Section 12, Reason-led headlines

The example "Managed WordPress hosting, because we run the server for you" needs the `managed-server-care` claim.
