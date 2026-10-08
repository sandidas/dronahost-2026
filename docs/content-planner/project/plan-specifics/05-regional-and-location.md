# Project specifics: Plan 05 Regional and Location

Core plan: [../../plans/05-regional-and-location.md](../../plans/05-regional-and-location.md). Original wording is kept below, under the plan section it belongs to.

## Honesty first: what is true

**What is true (owner, 2026-10-07 and 2026-10-07).** DronaHost is a focused team based in India. It does **not own servers or data centres**. It buys servers from AWS, Google Cloud, DigitalOcean, Hetzner and similar providers in various locations and runs hosting on them. There is **no fixed provider for a given city or plan**. The WHMCS billing system runs on a server in Europe.

## Honesty first: what that means for copy (billing system server)

- The WHMCS server location says nothing about where customer sites run. Do not use it to imply European site hosting.

## Standard answer: "Where is my site hosted?" (Mode B, the default)

> DronaHost is a team based in India. Your site runs on servers that we rent from leading cloud providers. We name a location only when we can confirm it for your plan, and we list the providers we use in our sub-processor list. `[HUMAN REVIEW: Mode A wording needs the infrastructure registry]`

## Page families: locale versions row

| Locale versions | `/en-gb`, `/en-ae` and later `de-de`, `fr-fr`, `nl-nl`, `ar-ae` | off until `FEATURES.localeVariants` | Governed by [Plan 11](../../later/11-localization-country-language-currency.md), including how a region page relates to its locale page |

## Regional hosting page template

Block 5 (Plans and price): | 5 | Plans and price | `PricingCards` with the regional currency and the standard tax line ("Prices exclude tax. Customers in India pay GST at checkout."). Renewal beneath. |

Block 6 (Support across time zones): | 6 | Support across time zones | Only the hours confirmed in the support policy. Channels are ticket and email only. Show times with a timezone ("9:00 AM ET"). |

Block 9 (FAQ): | 9 | FAQ | Region-specific: "Does DronaHost sign a data processing agreement?", "Do I pay tax?" (answer: no, unless you are a customer in India), "Which currency will I be charged in?". |

## Regional services pages (web design and SEO), owned by Plan 06

- State plainly: "We work with clients in [region] from our team in India." No fake address, no local phone.
