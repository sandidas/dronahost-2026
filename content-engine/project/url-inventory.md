# URL inventory and redirects

Status 2026-10-07. **Not yet built.** Protecting pages that already earn traffic matters more than any new page. This file
holds the decisions. The data comes from a crawl and from Search Console.

## How to build the inventory

1. List every live URL: the old site's `sitemap.xml`, the old repo's routes, and a crawl (for example Screaming Frog, free up to 500 URLs).
2. Export Search Console > Performance > Pages, last 16 months (clicks, impressions, position).
3. Merge. For each URL record the title, H1, status code, clicks and impressions.
4. Decide for each: **keep** (same URL), **move** (new URL, 301), **merge** (301 to a stronger page), or **drop** (410 or 301 to the closest page).
5. Fill the table below. The 301 map becomes a redirect file in the new site.

Prompt for Claude Code:

```
Build /reference/url-inventory.csv for dronahost.com with columns: old_url, title, h1, status,
clicks_16m, impressions_16m, decision (keep|move|merge|drop), new_url, notes. Sources: the old
sitemap.xml, the old repo routes, and the Search Console pages export I will place in /reference.
Do not change any code. Flag URLs with clicks that have no new home.
```

## Rules

- Keep the URL where a page already ranks and the new page covers the same intent.
- One-to-one 301 redirects. No chains (old to old to new). No redirect to the home page as a catch-all.
- Redirect map is tested before launch: every old URL with clicks returns 301 to a live, relevant page.
- After launch, watch Search Console for 404s weekly for 8 weeks.
- Keep current legal pages (Terms, Privacy, Payment policy) live until reviewed replacements exist.

## Known from the old footer (screenshots, 2026-10-06; real URLs not yet captured)

| Old page or product | In the planner today? | Decision needed (owner) | Notes |
|---|---|---|---|
| About Us | Plan 09 (`/about`) | keep | Needs verified facts |
| Contact, Contact Us | Plan 09 (`/contact`) | keep | Ticket and email only |
| Open Support Ticket, Account | Client area (`my.dronahost.com`) | keep | Client area stays `noindex` |
| DronaHost Blogs | Blog (headless WordPress) | keep and migrate posts | Check which posts rank |
| Request a consultation | `/consultation` (Plan 06) | keep | |
| Affiliate Program | **No plan** | keep, merge or drop? | Needs terms and a page if kept |
| Careers | **No plan** | keep or drop? | Only if hiring |
| Offers | **No plan** | keep or drop? | Real offers only, with dates |
| Brand Assets | **No plan** | keep or drop? | Useful for press. Contains the logo rules |
| Reseller Hosting | **Not in `PROJECT.md`** | still sold? | If yes it needs data in `pricing.json` and a page |
| Serverless Solutions | **Not in `PROJECT.md`** | still sold? | Same |
| SSL Certificates, SiteLock Certificates | **Not in `PROJECT.md`** | still sold? | Same. Resold products need terms |
| Hosting With Free SSL, Hosting With Full Access, Self-managed WordPress, cPanel/Plesk, Premium Cloud Servers, Free Domain, Regular Backup, Next-Gen Security | Landing-style pages | merge into product pages or drop | Do not repeat unverified claims |
| Free WordPress Migration, 30 Days Money Back Guarantee | Plan 14 and Plan 07 | merge into `/migration` and `/refund-policy` | Old URLs 301 to them |
| Wordpress Expert Assistant, Premium Theme and Page Builder | **No plan** | keep, merge or drop? | Check claims |
| Terms and Conditions, Privacy Policy, Payment Policy | Plan 07 | keep until replaced | Do not remove |
| WordPress Website Design, Custom Website Development | Plan 06 | move to `/web-design`, `/custom-development` | |
| Register a New Domain, Transfer Domain To Us | Plan 08 | move | No price until WHMCS sync |

## Table to fill

| Old URL | Clicks (16 months) | Decision | New URL | Redirect tested | Notes |
|---|---|---|---|---|---|
| | | | | | |
