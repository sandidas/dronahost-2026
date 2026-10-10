# Quality rubric (advisory)

For the reviewer. **Not a gate.** The score never decides publication and `check-content` never reads it. The owner decides. The hard checks are in `tools/check-content.ts`; this rubric is for the things a tool cannot judge.

## How to use it

Score each category from 0 to 10 and write **one line of evidence** (a quote from the page or a check result). Any category below 7 gets a named fix in the handoff. A score with no evidence line is not recorded.

The categories follow Google's self-assessment questions ([sources.md](sources.md), item 1; mapped in [eeat-and-people-first.md](eeat-and-people-first.md)). The brief's section 10b asks them as yes-or-no with evidence; this rubric adds the reviewer's degree.

| Category | What a 10 looks like | Evidence to quote |
|---|---|---|
| Intent match | The page is the format the live results show, and answers the reader's question in the first 80 words | The SERP snapshot row and the answer block |
| Content quality | Accurate, complete for the question, no padding, nothing sloppy | A fact-ledger id for each claim spot-checked |
| Topic coverage (Needs Met) | The follow-up questions a reader asks next are answered; the reader would not search again | The reader-questions table from the brief and the IN5 result |
| Keyword relevance | The primary keyword reads naturally in the title, H1 and first 100 words; the page reads well with it removed | The three places it appears |
| Readability | Plain sentences, grade inside the target, no idioms | The check-content readability result |
| Original value | The information-gain line is true and checkable on the page; a page you would bookmark or recommend | The gain sentence and where the page delivers it |
| Experience shown | A visitor sees one first-hand element: a result, a review, a number, a screenshot, a decision and its reason | The section named in brief 6b and the TR7 result |
| Trust | Named reviewer and date visible, sources with dates, honest limits, claims gated, no pressure wording, proof beside the action | The provenance block, the sources list, the TR6 to TR8 results |
| SERP alignment | Differs from the top results where it should, matches where readers expect | The gap named in the brief |
| Answer-engine readiness | Answers under headings, entity named, server-rendered | The heading list |
| CTA relevance | One CTA that fits the intent, with what happens next stated beside it | The CTA, the intent table row and the next-step line |

## Output

A table of the eleven categories with score and evidence line, then a list of fixes for any score below 7. Put it in the handoff ([templates/handoff.md](../templates/handoff.md)) under "Advisory rubric".
