# Information gain

A page must offer something the pages already ranking do not. Google's guidance asks for original information, research or analysis and a complete answer beyond the obvious (see `sources.md`, item 1). The brief names that something in one line. If it cannot, the keyword is dropped or merged into a page that has one (the governor, spec section 6).

## How to find the gain

Work from the SERP snapshot (workflow Stage 2). Do this in order.

1. **List what the top results all cover.** That is the baseline. Covering it is required, not valuable.
2. **List what the top results miss, get wrong or skip.** Look for:
   - no stop point or order ("do these ten things" with no sequence),
   - no way to check a fix worked,
   - no numbers, or numbers with no method,
   - vendor bias: every result ends in the author's own product,
   - out-of-date versions or steps,
   - a reader type they ignore (small business owner, agency, non-technical).
3. **Match each gap to material we really have.** The gain must come from the interview, our own tests, our own data, or a table of sourced data. If we have nothing real for a gap, it is not our gain.
4. **Pick one.** Name the single strongest gain. Two is fine if both are real. Do not list five.
5. **State it as a testable sentence:** "Unlike the top results, this page ___, because ___." A reviewer must be able to check it by reading the page.

## The form in the brief

```
INFORMATION GAIN
Gap in the top results: <what they miss, with the result URLs checked>
Our gain: <one sentence, "Unlike the top results, this page ...">
Real material behind it: <interview answer numbers, artifact, or sourced table>
Status: confirmed by owner / not confirmed
```

If "Real material behind it" is empty, the status is **not confirmed** and the page cannot reach "Ready for owner review".

## Acceptable gain

- Tested fixes in order of effort, with before and after numbers from our own site (with tool, versions and date).
- A real screenshot or log from our test.
- A table of sourced data we gathered and cite, for example competitor facts with URL and date.
- A decision aid that is true and repeatable: "if X then Y", checked on real cases.
- Honest limits: when the advice does not apply, or when our product is the wrong choice.
- A clearly better structure for a reader that is not served today, as long as it is also complete and accurate.

## Not acceptable gain

- A longer version of the same steps.
- A rewrite of the top results in different words.
- Words like "comprehensive", "ultimate" or "complete guide" as the gain.
- Invented statistics, studies, quotes, customers or "in my experience" statements. Claude has no first-hand experience.
- A table of numbers with no source and date.
- A new page for a keyword variant that the existing page already answers.
- A claim about [Brand] that is not in `claims.ts`.

## Examples (illustrative, not real data)

| Page | Gap in the top results | Acceptable gain | Why |
|---|---|---|---|
| How to improve TTFB on WordPress | Most guides list tips with no order, no stop point and a product pitch | "Unlike the top results, this page orders fixes by effort and gives a stop point and a check after each one." Needs the owner's tested numbers | Testable, and it rests on real tests |
| Same page, weak version | The same | "A complete guide to TTFB" | Not testable. No real material behind it |
| [Brand] vs a competitor | Most comparisons are affiliate lists with no sources | "Each competitor fact has its source URL and the date we read it, and the page names where the competitor is stronger." | Checkable on the page. Already how our comparison data works |
| Migration guide | Guides skip what goes wrong | "The three failures we see most often, each with the fix." Needs the owner's interview answers | Only valid if the failures are real. Otherwise: dropped |

## Check

- The validator requires the field to exist in the brief. A person judges whether the gain is real.
- The similarity check (later phase) compares the draft with the SERP notes and our own pages.
