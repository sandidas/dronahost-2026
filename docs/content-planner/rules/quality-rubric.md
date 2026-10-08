# Quality rubric (advisory)

For the reviewer. **Not a gate.** The score never decides publication and `check-content` never reads it. The owner decides. The hard checks are in `tools/check-content.ts`; this rubric is for the things a tool cannot judge.

## How to use it

Score each category from 0 to 10 and write **one line of evidence** (a quote from the page or a check result). Any category below 7 gets a named fix in the handoff. A score with no evidence line is not recorded.

| Category | What a 10 looks like | Evidence to quote |
|---|---|---|
| Intent match | The page is the format the live results show, and answers the reader's question in the first 80 words | The SERP snapshot row and the answer block |
| Content quality | Accurate, complete for the question, no padding | A fact-ledger id for each claim spot-checked |
| Topic coverage | The follow-up questions a reader asks next are answered | The questions list from the brief |
| Keyword relevance | The primary keyword reads naturally in the title, H1 and first 100 words; the page reads well with it removed | The three places it appears |
| Readability | Plain sentences, grade inside the target, no idioms | The check-content readability result |
| Original value | The information-gain line is true and checkable on the page | The gain sentence and where the page delivers it |
| Trust | Real author and reviewer, sources with dates, honest limits, claims gated | The who/how/why block and the sources list |
| SERP alignment | Differs from the top results where it should, matches where readers expect | The gap named in the brief |
| Answer-engine readiness | Answers under headings, entity named, server-rendered | The heading list |
| CTA relevance | One CTA that fits the intent | The CTA and the intent table row |

## Output

A table of the ten categories with score and evidence line, then a list of fixes for any score below 7. Put it in the handoff ([templates/handoff.md](../templates/handoff.md)) under "Advisory rubric".
