# Plan 10: AI Search and Question Queries

**Intent:** people ask ChatGPT, Perplexity, Claude, Gemini and Google AI Overviews in full sentences. The AI picks a source and quotes it.
**Goal:** be the source that gets quoted, for both informational and buying questions.
**Not a separate set of pages.** This plan is a layer added to every page in Plans 01 to 09.

Project specifics for this plan: [plan-specifics/10-ai-search-queries.md](../project/plan-specifics/10-ai-search-queries.md)

## Workflow fit

This plan is a **layer on every page**, not a page type. Each page follows [content-writer-workflow.md](../rules/content-writer-workflow.md); this plan adds the target questions and the monthly spot-check. The working assumptions are in [ai-search.md](../rules/ai-search.md), the bot table in [sources.md](../rules/sources.md), item 9.

## How AI tools choose a source (working assumptions, re-check each quarter)

- They quote **self-contained, factual sentences** near the heading that asks the question.
- They prefer pages with a named author, a review date and cited sources.
- They read **server-rendered HTML**. Content that needs JavaScript to appear is missed.
- They cross-check claims. A claim that conflicts with other sources is dropped.
- `llms.txt` is optional. No major provider has confirmed using it.

## The answer block

Under every H2 and H3 that is a question, the first paragraph is an **answer block**:

- 40 to 80 words, plain prose, no list, no bold, no link.
- The first sentence answers the question on its own.
- It names the subject ([Brand], [Product], a VPS) instead of "it" or "this".
- It makes sense if pasted alone into an AI answer.

Shape: `[Subject] [specific fact], because [reason], which means [outcome for the reader].`

See [voice.md](../rules/voice.md) for worked examples.

## Question sets by intent (seeds, write in the buyer's voice)

| Intent | Example questions |
|---|---|
| Buy | What is the best managed WordPress hosting for a small business that sells to the UK? How much does managed WordPress hosting cost? Does a host charge more when I renew? |
| Compare | How is [Brand] different from [Competitor]? Is [Competitor] worth the price for a small site? |
| Trust | Is [Brand] a real company? Where is [Brand] based? Does [Brand] have a money-back guarantee? |
| Compliance | Do I need a data processing agreement with my host? Is WordPress hosting GDPR compliant? |
| How-to | How do I move a WordPress site without downtime? How do I fix a high TTFB? |
| Region | Which hosting is suitable for a UAE business that serves EU customers? |

Rules for each: answer only with verified facts. If the honest answer is "we do not offer that", say it and point to a better option. AI tools reward and cite honesty.

## What to add to every page

1. Direct answer under the H1 (40 to 80 words).
2. Answer blocks under question headings.
3. A FAQ with at least 4 questions in full conversational form, 40 to 80 words each, first sentence is the answer, at most one link per answer.
4. A **citable claim** per major section: one active-voice, self-contained sentence with its reason.
5. Comparison tables with real, sourced numbers (Plan 02).
6. Named author, role, credentials and a review date.
7. `FAQPage`, `Article` or `BlogPosting`, `BreadcrumbList` and `Organization` schema that match visible content.
8. Entity clarity: the same name, the same one-line definition, on every page.

## Monitoring (monthly, 30 minutes)

1. Ask 20 target questions in ChatGPT, Perplexity, Gemini, Claude and Google AI Overviews. Record whether [Brand] is named, which page is cited, and whether the facts are correct.
2. Fix wrong facts at the source page. If an AI states a wrong claim, check whether our page is ambiguous.
3. Log results in the register's `AI cited` column.
4. Check server logs and `robots.ts` for AI crawlers. Our policy on which bots to allow is in `docs/rules/seo-rules.md` section 3.

## Do not

- Do not stuff FAQs with keyword questions nobody asks.
- Do not write answers that sound like adverts. They are not quoted.
- Do not hide the answer behind tabs or accordions that require JavaScript to render the text.
- Do not claim to be "the best" or "the fastest" without a method and a date.
