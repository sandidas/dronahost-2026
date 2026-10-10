---
name: content-engine
description: Use for ANY content work in a project that has a content-engine/ folder - write, rewrite, edit, review, audit, refresh, translate or plan page copy, blog posts, articles, guides, landing pages, service or product pages, comparison pages, FAQs, CTAs, headlines, meta titles and descriptions, microcopy, error or empty-state text, keyword plans. Triggers include "write content for", "create a page about", "write an article on", "write a blog post", "improve the copy", "find keywords for", "analyze competitors for" (or "analyse"), "audit this page". In such a project this skill takes precedence over any general or global SEO content-writing skill (for example seo-content-writer); do not use those there.
---
# Content engine router

This project writes content only through its content engine. Do not draft from memory, from a global writing skill, or from other files in the repo.

## Always first

1. Run `npm run content:voice` and read the card: brand name, business type, audience, locale and spelling, voice, readability limits, banned words, support channels, people. It is generated from `content-engine/project/settings.json` and `content-engine/project/voice.json`.
2. Read `content-engine/README.md`, section "For the AI assistant", and do what it says.

## Then route the request

| The request | Do this |
|---|---|
| A new page, article, guide or landing page (a keyword or a title) | `/write-content <keyword or title>`. It stops at APPROVAL 1 with a brief; no long copy before the owner approves. |
| Improve, update or rewrite an existing page | `/refresh-content <url or path>` (proposes changes, never publishes) |
| Check or review a page | `/audit-page <url or path>` (read-only) |
| Find or plan keywords, competitor research | `/plan-keywords <topic>` (proposes register rows within the governor caps) |
| Monthly results, AI spot-check | `/monthly-review` |
| A headline, CTA, FAQ answer, meta title or description on a page that exists | Edit inside that page's file, then run `npm run check:content`. Follow `rules/content-writing-rules.md` sections 4 (CTA) and 7 (metadata). |
| UI microcopy: labels, errors, empty states, success, helper text | Edit the shared strings file the host uses (the copy-source check names it), following `rules/content-writing-rules.md` sections 4 to 6 and 13. Run `npm run check:content`. |
| Translate or localize | Stop and ask: locales and currency follow `later/11-localization-country-language-currency.md` and the owner's decisions. |
| Set up the engine in a new project | `/init-project` |

## Never

- Invent a fact, number, price, location, guarantee, customer, review, quote or first-hand experience. A missing fact becomes `[HUMAN REVIEW: ...]`.
- Type a price into copy (prices come from the pricing file) or a brand suffix into a title (the helper adds it).
- Use AI for testimonials, reviews, team bios, case-study results or unreviewed legal text.
- Scrape a search engine, estimate search volume, or promise rankings, featured snippets or AI citations.
- Mark anything "publish-ready", set a register row to `published`, or move a visible review date. The owner does those.

If a request conflicts with a rule in the engine, say so and ask. Do not quietly break the rule.
