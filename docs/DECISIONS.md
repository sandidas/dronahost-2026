# Decisions

Each resolved conflict, who decided it, and when, so it is not reopened. Source of the questions:
`docs/reference/RULES_REVIEW_AND_PAGE_SYSTEM.md`, Part 1. Rule files carry a `TODO(decision #N)` line wherever an
open decision affects them; do not choose for the owner.

| # | Decision | Outcome | Status | Decided by | Date |
|---|---|---|---|---|---|
| 1 | Primary UI colour | Indigo removed. The palette is navy, orange and teal only | decided | owner | 2026-10-06 |
| 2 | Orange hex | The value inside the official logo SVG, defined once in `app/styles/tokens.css` | decided | owner | 2026-10-06 |
| 3 | Default theme | Dark by default; the system preference is respected on a first visit | decided | owner | 2026-10-06 |
| 4 | Logo on dark backgrounds | The original orange and teal logo on dark navy. The "reverse to all-white" guidance is removed | decided | owner | 2026-10-06 |
| 5 | Renewal policy | The renewal price equals the signup price | decided | owner | 2026-10-06 |
| 6 | Company facts | Founding year 2022 vs 2019; `hello@` vs `sales@`; "Alphabet Force" as legal entity. Needs verified values from the owner | open | | |
| 7 | URL map | ui-ux paths vs seo paths conflict. Needs the live sitemap or a Search Console export | open | | |
| 8 | Regions | One English site, USD default, a currency selector, no regional pages yet. Regional pages and extra locales are Phase 2 | decided | owner | 2026-10-06 |

## Notes

- **Decision #2 detail:** the official logo SVG (`public/logo/dronaHost-logo.svg`) contains three near-identical orange
  fills (`#FE5403`, `#FE5404`, `#FE5504`). `tokens.css` currently uses `#fe5504`. Pick one value when `tokens.css` is next
  touched; the rules intentionally state no hex.
- **Decision #3 detail:** the rules now say dark is the default and the first-visit system preference is respected. The
  current code sets `defaultTheme="dark"` with `enableSystem={false}`, so a visitor whose system prefers light still gets
  dark. Aligning the code is a separate change.
- **Decision #8 detail:** locale routing for `en-gb` and `en-ae` exists in code behind `FEATURES.localeVariants`, which
  stays off. Only `en-us` is live.
- **Claims confirmed 2026-10-06:** 30-day money-back guarantee, 24/7 support, free migration, renewal price equals signup
  price. Each must link to the page that publishes its terms; see `docs/rules/content-writing-rules.md`.
