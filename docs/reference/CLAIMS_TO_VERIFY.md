# Claims to verify before launch

Every factual claim the components or their data currently render. Nothing here is proven yet.
For each one: confirm it is true today, or tell me to remove it. Source column = where to change it.

| Claim | Where it appears | Source |
|---|---|---|
| **Staging environment** (clone, test, push live) | Home bento and split section, WordPress hero and feature grid, FAQ, hero mockup, plan cards and comparison table (Growth and above only) | `content/home.ts`, `content/wordpress.ts`, `content/faqs.ts`, `data/pricing.json` capabilities |
| **CDN / Cloudflare** | Plan capabilities flag `cloudflare` on every plan; "Cloudflare DDoS Protection" in *Included with every plan*; claim `cloudflare-cdn` (hidden) | `data/pricing.json`, `content/claims.ts` |
| **Uptime SLA** (99.95%, service credits) | `/sla` page, "Published uptime commitment" trust item (hidden), `uptime-sla` stat (hidden), footer link "Service level agreement" | `content/claims.ts`, `content/trust.ts`, `app/(marketing)/sla` |
| **WAF / firewall** | "Extra Layer Security" add-on (WAF, brute-force protection, threat intelligence); "firewall rules" in home split, WordPress features, VPS copy | `data/pricing.json` addons, `content/home.ts`, `content/wordpress.ts`, `content/services.ts` |
| **Renewal price = signup price** | "Renews at $X/month, same price, no increase" on every annual plan card; FAQ answer; pricing hero | `data/pricing.json` (`pricing.renewal`, `renewalPolicy`), `lib/pricing/plans.ts` |
| **30-day money-back guarantee** | In pricing.json "Included with every plan" (now hidden until `money-back` is verified), `/refund-policy`, guarantee note on plan cards (hidden), trust item (hidden) | `content/claims.ts`, `data/pricing.json` |
| **"Unlimited" resources** | Scale, Dedicated Core and Enterprise: WordPress sites, storage, traffic, domains, mailboxes, databases (null limit renders "Unlimited") | `data/pricing.json` limits |
| LiteSpeed web servers with server-level caching | Home and WordPress heroes, bento, split, FAQ, site description | `content/heroes.ts`, `content/home.ts` |
| NVMe SSD storage | "Included with every plan" (from pricing.json) | `data/pricing.json` |
| Control panel, one-click WordPress install | "Included with every plan" | `data/pricing.json` |
| Free migration, review before DNS switch | Hero, split section, FAQ, every plan | `content/*`, `data/pricing.json` |
| Backups, restore points, per-plan retention (1 to 30 days) | Plan cards, comparison table, split section | `data/pricing.json` limits |
| Malware scanning, SSL auto-renew, network-level DDoS | WordPress features, home split | `content/wordpress.ts`, `content/home.ts` |
| Support by ticket and email (live chat and WhatsApp removed, owner decision 22) | Heroes, bento, support split, support channels | `content/*` |
| Priority support queue, performance tuning, dedicated account manager, one-click scaling | Comparison table and plan cards | `data/pricing.json` capabilities |
| Team based in India serving US, UK, UAE and Europe | About hero, meta description | `content/heroes.ts`, `app/(marketing)/about/page.tsx` |
| Data centers in the US, UK, EU and UAE | `/hosting/[region]` pages (copy kept claim-free); trust item hidden | `content/trust.ts` |

## Data problems found while listing these

- **Annual discount does not match pricing.json's own note.** `_meta.annualSavings` says "2 months free (~16.7%)", but Starter is $14.99 monthly vs $9.99 annual (33% off). Growth is 20% off, Pop 20%, Scale 33%. Confirm the real prices.
- **The guarantee was leaking.** It sat in `includedWithEveryPlan` and rendered on `/pricing` regardless of verification. Fixed: hidden until `money-back` is verified.
- **Plan naming.** "Pop" is the only plan name that isn't a size or role (Starter, Growth, Scale, Dedicated Core, Enterprise). It sits between Growth and Scale, with badge "High Power". Needs your decision: keep, or rename (e.g. "Plus" or "Business"). Badges "Most Popular" and "High Power" are also unsupported claims until you have data.
- **Meta descriptions** claimed "High-performance" and "NVMe". Softened to neutral wording.
