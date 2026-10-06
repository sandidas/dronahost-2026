# Page system (Phase 2): schemas, resolvers, registry

Pages are described as JSON and rendered from the same design-system components. JSON holds content and structure, never
layout logic. The home page (`/`) is the first page built this way, from `content/pages/home.json`.

```
lib/content/
  schemas/common.ts      Cta, Href, ClaimRef (claim:id), FeatureRef (feature:id), Requires, icon names
  schemas/sections.ts    one Zod schema per section type (13 so far) and the discriminated union
  schemas/page.ts        PageSpec: metadata, rules, sections, plus cross-field checks
  requires-grammar.ts    what a `requires` expression may contain; allowed {{template}} tokens
  refs.ts                resolvers: claim:, feature:, requires, template fill, ResolveContext
  features.ts            feature library: claim, plan availability from pricing.json, draft tile copy
  layout-signature.ts    compute a page's signature and find collisions between pages
  page.ts                parsePage (throws a readable list of problems), visibleSections
  registry.tsx           section type to schema and renderer (adapts JSON to component props)
  render.tsx             renderPage(spec): visible sections through the registry
  published-pages.ts     which policy pages are reviewed and published (empty today)
  reviews.ts             verified customer reviews (empty today)
scripts/validate-pages.ts   npm run check:pages: validates content/pages/*.json and layout signatures
content/pages/home.json   the home page spec (source of the / route), from docs/reference/pages/HOME_PAGE_DESIGN.md
lib/content/lint.ts, scripts/lint-content.ts   npm run lint:content
```

## Rules the schemas enforce
- Strict objects: a typo in a field name fails the build.
- Copy limits: H1 20 to 70 characters, direct answers 40 to 80 words, FAQ answers at most 80 words, titles at most 60, descriptions at most 160.
- Links are site paths only. Icons are from the icon set.
- Page rules: unique section ids, the first section is a hero, every `requiredSections` id exists, every `mustLinkTo` target is linked on the page, no `forbiddenClaims` word appears anywhere in the copy, and the declared `layoutSignature` matches the sections.
- Hard maximums only for FAQ answer length. The 40-word minimum is a guideline: `npm run check:pages` prints a warning.

## References and gates
| Reference | Renders when |
|---|---|
| `claim:<id>` | the claim gate says so: owner-verified AND its terms page is published (`claimRenders`) |
| `feature:<id>` | its capability claim renders AND, if plan-specific, at least one plan in `data/pricing.json` includes it |
| `requires: "FEATURES.<flag>"` | the flag in `lib/flags.ts` is on |
| `requires: "<predicate>"` | a named predicate holds (`verifiedReviews`, false until reviews exist) |
| `requires: "A && B"` | every term holds |
| `requiresClaim` on a section, path, item or FAQ entry | that claim renders |
| `{{pricing.summary}}` in an FAQ answer | filled from `pricing.json`; never typed by hand |

A section that fails its conditions is dropped before rendering, and a renderer that has nothing to show returns null, so a
page never has an empty gap. Everything a page may depend on is looked up through one `ResolveContext`, which tests can replace.

## Content lint
`npm run lint:content` fails on: banned phrases and CTA labels, exclamation marks, raw HTML, numbers in copy that should come from
`claims.ts` or `pricing.json` (digits with a unit, currency amounts, "24/7"), sentences over 28 words, a reading grade above 11,
fewer than three internal links, claim refs missing from `claims.ts`, duplicate titles or descriptions across pages, and any
mention of WhatsApp or live chat while `content/company.ts` has neither. It also prints which referenced claims are not rendering.
CI runs `check:pages` and `lint:content` in the static job.

## Layout signature
A page's signature is its hero as `Type:variant` plus the next four section types. Two pages with the same signature fail
`check:pages`, so money pages never share a template.

## Adding a section type
1. Add its Zod schema to `schemas/sections.ts` and to the union.
2. Add a renderer to `SECTION_REGISTRY` in `registry.tsx`. TypeScript fails until every type has one.
3. Show the component in `/v2` first (review workflow in `docs/rules/coding-rules.md` section 6).

## Reviewing the system
Dev only: `/v2/page-system-preview?mode=today` renders the home spec as it would ship now; `?mode=all` forces every claim and
flag on to exercise every adapter. Neither is the home page.
