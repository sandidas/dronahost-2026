# Content Planner

Everything about planning, writing and checking content lives in this folder: the business facts, the rules, the plans for each kind of search, the keyword list and the checking tool. Copy the folder to another project, fill in `project/`, and it works there too (see "Reuse").

## For the AI assistant: do this whenever you are asked to write, edit, review or plan content

"Content" means page copy, blog posts, guides, FAQs, CTAs, headlines, metadata, microcopy, comparison tables and keyword plans.

1. Read this file, then `project/PROJECT.md` (business facts) and `project/DECISIONS.md` (owner decisions).
2. Find the keyword's plan with "Which plan owns a keyword" below, and read that file in `plans/`.
3. Read `rules/voice.md`. Open `rules/content-writing-rules.md` for the section you need (tone, headings, CTAs, errors, SEO copy, human-first and AI use, tools, tables, maintenance, "because" headlines).
4. Check `project/keyword-register.md` for an existing owner of the keyword.
5. Write the **brief** (template below) and show it to the owner **before** long copy.
6. Never invent a fact. Anything not in `project/PROJECT.md`, the claims registry or the pricing file becomes a `[HUMAN REVIEW: ...]` note.
7. After writing, run the checks and update the register.
8. If a rule here conflicts with a request, say so and ask. Do not quietly break a rule.
9. To write any page or article, follow `rules/content-writer-workflow.md`.

## Folder map

```
docs/content-planner/
  README.md                    this file: how it works and where things are
  CHANGELOG.md                 versioned changes to the engine
  MIGRATION_PLAN.md            the Phase 0 plan and the owner's answers (history)
  content-planner.config.json  host integration: paths, adapters, governor, limits (schema: schemas/config.ts)
  project/                     facts and decisions about THIS business (replace for another project)
    PROJECT.md  DECISIONS.md  keyword-register.md  roadmap.md  team-and-workflow.md  url-inventory.md
    measurement.md  learning-log.md  code-follow-ups.md
    brand.md                   voice, terminology and avoid-list for this brand
    rules.config.json          banned phrases, CTA labels, feature words, forbidden channels and claims, disclosure line, no-brand terms
    plan-specifics/            the facts and owner decisions taken out of each plan (same file names as plans/)
    briefs/                    one brief per page; tier-a-briefs.md; briefs/golden/ holds exemplar pages later
    drafts/                    drafts in progress
    facts/                     one fact ledger per page
    later/                     project copy of parked plans (billing system)
  rules/                       how to write (reusable, no business facts)
    content-writing-rules.md   tone, headings, CTAs, errors, SEO copy, human-first, tools, tables
    voice.md  content-writer-workflow.md  sources.md  interview-questions.md  information-gain.md  wordpress-content-model.md
  plans/                       one plan per search intent: 01 to 10, 14, 15 (reusable structure)
  later/                       parked plans: 11 locales and currency, 12 billing system, 13 search and AI launch standard
  templates/  schemas/  claude/  eval/   built in later phases (schemas/ holds the config schemas; eval/fixtures/ holds test fixtures)
  tools/
    check-register.ts          the keyword register (npm run check:register)
    check-content.ts           page JSON and drafts (npm run check:content)
    check-config.ts            the two config files (npm run check:config)
    check-no-brand.ts          the reusable core names no brand (npm run check:no-brand)
    check-links.ts             Markdown links resolve (npm run check:links)
```

## How it works

```
keyword -> intent -> plan -> brief -> owner approves -> write -> checks -> review -> publish -> register
```

1. **Pick a keyword** from the register. One keyword gets one page.
2. **Confirm intent** by looking at what ranks. If the top results are product pages, write a product page.
3. **Open the plan** for that intent and follow its outline and checklist.
4. **Write the brief.** A person fills the human-first fields first, before any AI draft.
5. **Owner approves the brief.**
6. **Write** within the rules. Facts come only from the sources named in `project/PROJECT.md`.
7. **Check:** `npm run check:pages`, `npm run lint:content` (they cover `content/pages/*.json` only) and `npm run check:register`. Blog and guide copy gets the manual self-check in `rules/voice.md`, the checks in `rules/wordpress-content-model.md`, and a second reviewer where one exists (until then the owner reviews).
8. **Review and publish.** The reviewer signs off. The register is updated with owner, reviewer and next review date.
9. **Measure** after 28 days and review on the date set.

## The plans

| # | Plan | Searcher thinks | Pages |
|---|---|---|---|
| 01 | [Money pages](plans/01-money-pages.md) | "I want to buy this" | product, plan and pricing pages |
| 02 | [Commercial investigation](plans/02-commercial-investigation.md) | "Which one should I pick?" | comparisons, alternatives |
| 03 | [Informational](plans/03-informational.md) | "I want to understand this" | guides, explainers |
| 04 | [Problem and troubleshooting](plans/04-problem-and-troubleshooting.md) | "Something is broken" | fix guides |
| 05 | [Regional hosting](plans/05-regional-and-location.md) | "Is this right for my country?" | regional pages |
| 06 | [Service pages](plans/06-service-pages.md) | "I need someone to do this for me" | web design, SEO, development, maintenance |
| 07 | [Compliance, trust and policies](plans/07-compliance-and-trust.md) | "Can I trust this?" | policy pages (Tier A and B), rule explainers |
| 08 | [Domains](plans/08-domains.md) | "Is this name free?" | domain and TLD pages |
| 09 | [Navigational and brand](plans/09-navigational-brand.md) | "Take me to the brand" | about, contact, reviews |
| 10 | [AI search and questions](plans/10-ai-search-queries.md) | "Explain it to me" | a layer on every page |
| 14 | [Migration and email](plans/14-migration-and-email.md) | "Can you move my site?" / "Where do I get email?" | `/migration`, `/migration-terms`, `/email`, the email notice |
| 15 | [Off-site: reviews, listings, links](plans/15-off-site-reviews-and-links.md) | "Can I trust what others say?" | reviews, listings, partnerships, press |

Build order (see `project/roadmap.md`): Tier A policy pages first (they unlock the claims), core money pages, trust pages, service pages, comparisons, guides, domains, then regional and locale pages. Off-site work runs in parallel.

Plan numbers 11 to 13 live in `later/`. New plans therefore start at 14.

## Which plan owns a keyword

| The query has... | Plan |
|---|---|
| `vs`, `alternative`, `compare` | 02 |
| a country plus a product (`wordpress hosting uk`) | 05 |
| a question about a rule (`do i need a dpa`) | 07 |
| `agency`, `services`, `hire`, `redesign`, `developer`, `maintenance` | 06 |
| `domain`, `.com`, `.co.uk`, `transfer` | 08 |
| `slow`, `hacked`, `error`, `fix`, `why is` | 04 |
| `how to`, `what is`, `guide`, `checklist` | 03 |
| `buy`, `price`, `plans`, `[product] hosting` | 01 |
| `migration`, `move my site`, `switch host` (the service) | 14 |
| `email` for a domain, `business email` | 14 |
| reviews, listings, partnerships, press | 15 |
| the brand name | 09 |

One keyword, one URL. Look-alike phrases go in the Secondary column of the owning row. Keywords in the register are guesses until a tool records a volume with source and date.

## The rules that matter most

1. **Human first.** A person fills the brief (reader's question, our angle, what we know first-hand, one original element) before any AI draft. Every fact is in a verification log. Every page has an owner and a reviewer. Never use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text. Disclosure follows `rules/content-writing-rules.md` section 8.5.
2. **No invented facts.** Business facts come from `project/PROJECT.md` and the registries it names. Prices come only from the pricing file.
3. **Answer first.** A 40 to 80 word direct answer under the H1 and under question headings.
4. **One reason-led headline** ("[Outcome] because [verified reason]") on money, service, regional and landing pages, with a fallback. Not on guides or policy pages.
5. **Tools and tables** follow rules sections 9 and 10. **Maintenance pages** follow section 11.
6. **Location, tax and claims rules** are in `project/PROJECT.md`. They override any example.
7. **Every page** has 3 or more internal links, a FAQ on product, service and guide pages, a named owner and a next review date.
8. **Roles and legal text.** Claude drafts, the owner approves. Tier A policy pages (commercial promises) are approved by the owner. Tier B legal documents need a qualified human and stay drafts until then (`plans/07`).
9. **Support is ticket and email only.** Never mention WhatsApp, live chat or phone. Email is not hosted: send it to `/email`.
10. **Flag, do not guess.** Missing facts become `[HUMAN REVIEW: ...]` notes. A page ships with none open.

## Where project rules override the `seo-content-writer` skill

Use the skill for research (competitors, gaps, People Also Ask). Where it disagrees, this folder wins: titles carry no brand suffix and stay under 60 characters, word counts are guides, FAQ answers are 40 to 80 words, and years come only from a review date field.

## Brief template

The full brief is Stage 3 of `rules/content-writer-workflow.md`. Copy of the template:

```
Slug (from the register) / Plan / Locale
Primary keyword / Secondary keywords (from the register) / Semantic terms / Entities / Question keywords
GOVERNOR STATUS: in-flight pages (register rows briefed, drafting or review) N of 3 / new pages this month N of cap (owner sets the cap, start at 4) / pause switch off
INTENT: primary / secondary / reader's problem / reader's goal / expected format / buying stage
SERP SNAPSHOT: (table in Stage 2)
INFORMATION GAIN: gap in the top results (with URLs checked) / our gain in one sentence ("Unlike the top results, this page ...")
  / the real material behind it / status (confirmed by owner or not). See rules/information-gain.md. No gain = drop or merge
RECOMMENDED LENGTH: a range and the reason. A guide, not a rule. Under 300 words is flagged thin
HUMAN FIRST (owner supplies): reader's real question / our angle
INTERVIEW ANSWERS (verbatim): each question from rules/interview-questions.md, the owner's exact words, the date, and the artifact
  (screenshot, log, numbers) or "none". An unanswered question is written as GAP and its section is dropped, never invented
FACT LEDGER (project/facts/<slug>.md): every fact the page may use: the fact, source URL or project file, date read, who checked,
  status (verified, needs check). The draft may use only ledger facts, interview answers and rendering claims
CLAIMS NEEDED (ids from claims.ts, and whether each renders) / PLANS AND PRICES NEEDED (from pricing.json)
WHO / HOW / WHY (shown on the page): who = real author and reviewer, linked to the author page / how = how it was made, including the AI
  line ("Drafted with AI assistance, then edited, fact-checked and approved by [name]") and what was tested / why = the reader's need
OUTLINE: H1, H2, H3 following the intent pattern below. Each H2 states its direct answer in one line
HEADLINE: reason-led version and fallback (money, service, regional and landing pages only)
TOOL OR TABLE needed (rules sections 9 and 10)
INTERNAL LINKS (3 or more): anchor text / target page / why it helps the reader
CTA: from the intent table, one only
SCHEMA: from the plan. Must match the visible content. Google no longer shows FAQ or HowTo rich results (rules/sources.md, item 5)
METADATA DRAFT: title (60 characters or fewer, no brand suffix), description (160 or fewer). These limits are project rules
OWNER / REVIEWER (the owner until a second person exists) / NEXT REVIEW DATE
AI USED FOR THE DRAFT: yes or no / OPEN FLAGS: every [HUMAN REVIEW] item
APPROVAL 1: owner approves the brief and the interview answers (no draft before this)
```

## Reuse in another project

1. Copy this whole folder into the new project's `docs/`.
2. Replace everything in `project/`: new `PROJECT.md` (use the existing one as the template), `brand.md`, `rules.config.json`, an empty `DECISIONS.md`, an empty register, and empty `briefs/`, `drafts/`, `facts/`, `plan-specifics/`, `later/`.
3. Edit `content-planner.config.json` (name, paths, limits, governor).
4. Run `npm run check:config` and `npm run check:no-brand`. The second must pass before and after the swap: it proves the reusable core names no business.
5. Add a short block to the new project's `CLAUDE.md` that points here (copy the block from this project's `claude.md`).
6. Add the scripts from this project's `package.json`: `check:register`, `check:content`, `check:config`, `check:no-brand`, `check:links`.

The installer and the sample project arrive in Phases 3 and 6. Stack-specific code (page JSON linter, metadata helper, sitemap code) is not in this folder; it lives in the host project and is registered in the config.

## Not in this folder (by design)

- Technical SEO code (`docs/rules/seo-rules.md`): metadata helper, JSON-LD code, sitemap, robots. Stack-specific.
- Machine-readable sources of truth in code: `data/pricing.json`, `content/claims.ts`, `content/company.ts`. `project/PROJECT.md` describes them and points to them. If they differ, the code file renders and the owner decides which is right.

## Later (parked)

[`later/`](later/) holds multi-country launch and currency switching, billing-system automation and the technical search and AI launch standard. Open them when the site is ready for another country or checkout work.
