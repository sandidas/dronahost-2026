# Rule sources (Google primary pages)

Only Google's own pages are treated as rules. Blogs and tool vendors are not. Each entry has the URL, the date fetched, the date shown on the page, a summary in our words, and what it means for this planner. **Re-check every quarter** (next: 2027-01-08). If a page changes, update the entry and run the evaluation set.

Fetched on **2026-10-08** with the web fetch tool. The tool reads a page and returns a summary, so these entries are a second reading of Google's text. Where the fetched text was thin, the entry says so. Items 1 to 7 were fetched in Phase A. Items 8 and 9 (Bing, AI crawler documents) were fetched on 2026-10-08 in Phase 2; Bing could not be read (see item 8).

---

## 1. Creating helpful, reliable, people-first content

- URL: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Fetched: 2026-10-08. Page dated: 2026-10-05.
- Summary:
  - Google's systems reward content made to help people, not content made to attract search visits.
  - Quality questions: does the page give original information, research or analysis, a complete answer beyond the obvious, and real effort? Does it avoid mass-produced or hasty work?
  - Expertise questions: is the sourcing clear, is it clear who is behind it, and are there no easily checked factual errors?
  - **Who, How, Why.** *Who* made it: show bylines and honest author background, with no fake profiles or false credentials. *How* it was made: say so when automation or AI produced a substantial part, and why. *Why* it exists: to help readers, not mainly to rank.
  - Of the E-E-A-T qualities, trust is the most important.
- For the planner: the brief must state the reader, the problem and the outcome. A page needs an information-gain line, a visible Who/How/Why block, and sourced facts.

## 2. Spam policies

- URL: https://developers.google.com/search/docs/essentials/spam-policies
- Fetched: 2026-10-08. Page dated: 2026-08-28.
- Summary:
  - **Scaled content abuse:** many pages made mainly to rank, with little value, however they are made (generative AI, scraping, stitching sources together). Original content that serves users is fine.
  - **Keyword stuffing:** repeating terms or lists of places and numbers unnaturally. Natural use in good writing is fine.
  - **Cloaking:** showing crawlers something different from users. Content that both can reach is fine.
  - **Hidden text and links:** content placed only for crawlers. Accordions, tabs and screen-reader text are fine.
  - **Link spam**, **thin affiliate content**, **site reputation abuse**, **expired domain abuse** and **sneaky redirects** are also covered. Affiliate pages are fine when they add original value (testing, comparison, analysis).
- For the planner: the governor limits volume, forbids keyword-variant pages and programmatic page sets, and requires information gain. The FAQ accordions used on our pages are allowed.

## 3. Using generative AI content

- URL: https://developers.google.com/search/docs/fundamentals/using-gen-ai-content
- Fetched: 2026-10-08. Page dated: 2026-10-01.
- Summary:
  - AI is acceptable as a research and structuring tool when the result is original and useful.
  - Using it to produce many pages without adding value is spam.
  - Output must be checked by a person, because models can state wrong facts. Review titles, descriptions, structured data and image alt text too.
  - Consider telling readers how the content was made. AI-generated images and product data may need to be labelled in their metadata.
- For the planner: the disclosure line, the fact ledger and the human review gate are consistent with this guidance. Alt text is reviewed by a person.

## 4. Generative AI features in Search (AI Overviews and AI Mode)

- URL: https://developers.google.com/search/docs/appearance/ai-features
- Fetched: 2026-10-08. Page dated: 2025-12-10.
- Summary:
  - There are no extra requirements and no special markup or files for AI features. Normal search fundamentals apply: crawlable, indexed, snippet-eligible, people-first content, good page experience.
  - Traffic from these features is counted in the Search Console "Web" performance data.
  - Site owners can limit display with `nosnippet`, `data-nosnippet`, `max-snippet` or `noindex`.
- For the planner: do not build AI-specific files or schema for Google. Answer-first writing helps readers and is fine, but it is not a ranking lever by itself.

## 5. Structured data general guidelines, and the types we use

- URL: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Fetched: 2026-10-08. Page dated: 2026-07-10.
- Summary:
  - JSON-LD is the recommended format. Do not block marked-up pages.
  - Mark up only what a reader can see on the page. It must be relevant, complete for its type, and not misleading (no fake reviews, no impersonation).
  - Violations can bring a manual action: the page loses rich results but stays in ordinary results. Correct markup does not guarantee a rich result.
- **FAQ rich results.** URL: https://developers.google.com/search/docs/appearance/structured-data/faqpage. Fetched 2026-10-08. The fetched page says FAQ rich results were limited to well-known government and health sites from September 2023 and are no longer shown in Search (removal noted as June 2026). *Confidence: medium. The fetch returned a change notice, not a full page. Re-read the page by hand before relying on it.*
- **HowTo rich results.** URL: https://developers.google.com/search/docs/appearance/structured-data/how-to. Fetched 2026-10-08. The fetched page says the feature is deprecated (September 2023) and no longer shown on desktop or mobile, and its documentation has been removed.
- Types we use (Article or BlogPosting, BreadcrumbList, Organization, Product): the general guidelines apply. Per-type pages were not fetched in this phase.
- For the planner: **keep FAQs on the page for readers, but do not expect an FAQ rich result, and do not use HowTo markup for Google.** Existing plans that list `HowTo` or `FAQPage` as schema (plans 02, 03, 04, the workflow, the TTFB draft) need review. `FAQPage` markup may still be kept if it matches the visible text, since it is harmless, but it must not be sold internally as a ranking feature. Schema must always match visible content.

## 6. Title links, snippets and meta descriptions

- Title links: https://developers.google.com/search/docs/appearance/title-link (fetched 2026-10-08, dated 2025-12-10).
  - Google builds the title link from the `<title>`, the main heading and other on-page signals, and may rewrite it. Give every page a unique, descriptive title. Avoid vague, repeated or stuffed titles, and titles in the wrong language.
  - Including the site name briefly is accepted. There is no fixed length limit, but long titles are cut to fit the screen.
- Snippets and meta descriptions: https://developers.google.com/search/docs/appearance/snippet (fetched 2026-10-08, dated 2026-04-20).
  - Google writes snippets from page content and uses the meta description only when it describes the page better. Write a unique, readable description per page. No keyword lists. No official length limit.
- For the planner: our limits are **project rules, not Google rules**. Title: measured with the brand suffix, warn above 60 characters, fail above 70, which keeps titles inside the room Google shows. Description: warn above 160, fail only if missing or duplicate. Google accepts a brand name in the title. The suffix text is `limits.titleSuffix` in the config. The validator labels these checks "project rule".

## 7. Search Quality Rater Guidelines (E-E-A-T)

- URL fetched first: https://services.google.com/fh/files/misc/hsw-sqrg.pdf. This is only a **36-page overview dated November 2023**, not the full guidelines. Not used as a source.
- Full guidelines: https://static.googleusercontent.com/media/guidelines.raterhub.com/en//searchqualityevaluatorguidelines.pdf. Fetched 2026-10-08. 182 pages, version dated **11 September 2025**. The fetch tool could not read the PDF text. The saved PDF was read directly with a text extractor instead. Quotes below are from section 3.4 and section 4.6.5.
- Summary:
  - **Trust** is the most important member of the E-E-A-T family. A page is judged on whether it is accurate, honest, safe and reliable for its purpose.
  - **Experience:** does the creator have first-hand or life experience of the topic (the guidelines contrast a review by someone who used the product with one by someone who did not).
  - **Expertise:** does the creator have the knowledge or skill the topic needs.
  - **Authoritativeness:** is the creator or site a go-to source for the topic.
  - Raters also look at who is responsible for the website and who created the content (section 2.5.2).
  - **Scaled content abuse** (4.6.5): many pages made mainly to help the site owner, with little original value, rate Lowest, however they were made. Content made with little effort, originality or added value also rates Lowest (4.6.6).
- Note: the rater guidelines tell human raters how to judge quality. They are not a list of ranking factors, and Google has said E-E-A-T is a concept, not a single ranking factor.
- For the planner: interview answers carry Experience, named authors and sources carry Expertise and Trust, and Authoritativeness comes from Plan 15 over time. A page with no real experience, no owner and no added value is what the guidelines rate lowest.


## 8. Bing Webmaster guidelines

- URLs tried: https://www.bing.com/webmasters/help/webmaster-guidelines-30fba23a and https://www.bing.com/webmasters/help/webmasters-guidelines-30fba23a. A third try, a Bing blog post, returned 404.
- Fetched: 2026-10-08. **Could not be read.** Both pages returned only the title "Bing Webmaster Tools - Help Documentation"; the guideline text is loaded by script and the fetch tool does not run it. Nothing is summarised here, and no rule in this folder is based on Bing's guidelines.
- Next step: the owner pastes the guidelines text, or reads them in a browser, and Claude summarises the pasted text. Until then Bing is covered only by the same fundamentals as Google (crawlable, original, people-first content).
- IndexNow (https://www.indexnow.org/documentation, fetched 2026-10-08, no date shown). A protocol for telling participating search engines that a URL was added, changed or removed. A site hosts a key file at its root and sends the URL, or up to 10,000 URLs in one batch, to an endpoint. The page does not say which engines take part and does not mention Google. For the planner: optional; see `later/13-search-and-ai-delivery-standard.md`. It is not a ranking lever.

## 9. AI crawler documents

Each provider splits its crawlers by purpose. A site can allow search and answer bots and block training bots. These entries describe what each provider says; which bots a project allows is a project decision (the host's SEO rules and `robots.txt`), not a rule here.

| Provider | Bot | What the provider says it is for | robots.txt |
|---|---|---|---|
| OpenAI | OAI-SearchBot | Finds sites for ChatGPT search results | Obeys. Blocking it keeps the site out of ChatGPT search answers |
| OpenAI | GPTBot | Collects content to train OpenAI models | Obeys. Blocking it opts out of training |
| OpenAI | ChatGPT-User | Visits a page when a user asks ChatGPT to | robots.txt does not govern it, because a person triggers the visit |
| Google | Googlebot | Search, Images, News, Discover | Obeys. This is the bot that matters for Search |
| Google | Google-Extended | A token that controls use of content for Gemini training and grounding | Obeys. Google says it has no effect on inclusion in Search or as a ranking signal |
| Anthropic | ClaudeBot | Collects public content that may be used in training | Obeys. Blocking signals exclusion from future training |
| Anthropic | Claude-SearchBot | Indexes content to improve search answers | Obeys. Blocking keeps the site out of that index |
| Anthropic | Claude-User | Fetches a page when a user asks Claude to | Obeys. Blocking may cut visibility when users ask about the site |
| Perplexity | PerplexityBot | Surfaces sites in Perplexity search results; separate from training | Obeys |
| Perplexity | Perplexity-User | Fetches a page when a user asks | Perplexity says it generally ignores robots.txt, because a person triggers it |

- URLs and dates: https://developers.openai.com/api/docs/bots (no date shown); https://developers.google.com/search/docs/crawling-indexing/google-common-crawlers (updated 2026-07-14); https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler (April 7, 2026); https://docs.perplexity.ai/guides/bots (no date shown). All fetched 2026-10-08. The OpenAI and Anthropic links were redirects from older addresses (platform.openai.com/docs/bots and support.anthropic.com).
- Not fetched: Microsoft Bingbot documentation, Apple (Applebot), Meta, Common Crawl, and other providers. Add them if the project decides on a policy for them.
- For the planner: do not block search and answer bots by accident (a CDN bot rule can). Do not promise that allowing a bot gets a citation. Plan 10 and `rules/ai-search.md` use this table.

---

## Review log

| Date | Who | What changed |
|---|---|---|
| 2026-10-08 | Claude (fetched), owner to confirm | First summaries, items 1 to 7 |
| 2026-10-08 | Claude (fetched), owner to confirm | Item 6 title rule aligned with owner limits; item 8 (Bing) not readable; item 9 crawler table added |
