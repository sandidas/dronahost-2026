# AI search: working assumptions

Answer engines (AI Overviews, ChatGPT search, Perplexity, Claude, Gemini) publish no rulebook for citation. Google states there is no special markup or file for its AI features ([sources.md](sources.md), item 4). What follows are **working assumptions**. They are checked each quarter against [sources.md](sources.md) and the monthly spot-check ([Plan 10](../plans/10-ai-search-queries.md)). Nothing here promises a citation.

## What we do because it also helps readers

| Practice | How |
|---|---|
| **Answer first** | 40 to 80 words directly under the H1 and under each question heading. The first sentence answers the question. The word range is `limits.answerBlockWords` in the config |
| **Name the subject** | Use the entity's name, not "it" or "this", in answers, so a quoted snippet still makes sense |
| **One entity line** | One identical sentence defining the business, from the company registry, in the first 50 words of key pages. The same name spelling everywhere |
| **Descriptive headings** | Headings that state the question or the topic. Short paragraphs, lists and tables where they help |
| **Honest comparisons** | Every competitor fact has a source URL and a date. Say where the other option is stronger |
| **Server-rendered text** | The answer is in the HTML a crawler receives, not added by script after load |
| **Dated and owned** | A visible review date and a named reviewer |

## Crawl access

| Rule | Detail |
|---|---|
| Decide per bot | Search and answer bots, user-triggered fetchers and training bots are different tools. The table in [sources.md](sources.md), item 9, lists what each provider says |
| Write the policy down | The project's `robots.txt` policy is recorded in the host's SEO rules, with the date and the owner's reason |
| Do not block by accident | A CDN or firewall bot rule can block bots the policy allows. Check after every change |
| User-triggered fetchers | Some providers say their user-triggered bots do not follow `robots.txt`. Do not rely on it to control them |

## What we do not do

- No AI-specific files or schema for Google. Other providers' files (for example `llms.txt`) are optional; treat them as an experiment, not as a rule.
- No writing that sounds unnatural to suit a model. Write for the reader.
- No claim that a page "ranks in" or "is cited by" an AI tool unless the spot-check log shows it, with the date.

## Spot-check

Monthly, ask the 20 target questions from [Plan 10](../plans/10-ai-search-queries.md) in the answer engines. Record whether the business is named, which page is cited, and whether the answer is correct. Write the result in `project/learning-log.md` and set the `AI cited` column in the register.
