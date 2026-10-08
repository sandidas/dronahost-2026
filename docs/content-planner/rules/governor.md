# The governor: protection against scaled content abuse

Google's spam policy targets many pages made mainly to rank, whatever produced them (see [sources.md](sources.md), item 2). A pipeline that turns a keyword list into pages is exactly what that policy describes if it is used carelessly. The governor is the set of limits that stops that. The limits are numbers in `content-planner.config.json` (`governor`), not text in this file.

## The rules

1. **No page without information gain.** The brief names what the page offers that the top results do not ([information-gain.md](information-gain.md)). If it cannot, the keyword is dropped or merged into a page that has a gain.
2. **One page, one intent.** No separate pages for keyword variants. Variants go in the Secondary column of the owning register row.
3. **No programmatic page sets.** A template filled with city, plugin or competitor names is not allowed unless each page holds unique, verified content and the owner approves the pattern in writing.
4. **Velocity limit.** At most `governor.maxInFlight` pages in flight at once (register rows with status `briefed`, `drafting` or `review`), and at most `governor.monthlyNewPages` new briefs per calendar month. The `governor` tool refuses to start another brief beyond either cap.
5. **Cluster first.** Publish a pillar and its supporting posts together, so every page has a purpose inside a topic.
6. **Prune.** A page with no impressions after six months is improved, merged or removed. The refresh queue lists them.
7. **A real person's name is on every page,** and that person has seen the page.
8. **Interview required.** A page with no first-hand answers cannot pass. It stays a draft with the gap named.
9. **Kill switch.** `governor.paused: true` in the config stops all new briefs and drafting. Nothing else is needed to pause.

## What the tool reports

| Item | Where it comes from |
|---|---|
| In flight | Count of register rows with status `briefed`, `drafting` or `review` |
| New this month | Count of briefs whose date is in the current calendar month (from `project/briefs/`) |
| Pause | `governor.paused` |
| Result | "A new brief may start", or the reason it may not |

The brief records the same three lines under GOVERNOR STATUS ([templates/brief.md](../templates/brief.md)).

## What the owner can change

The owner sets both caps and the pause switch. Raising a cap is a decision recorded in `project/DECISIONS.md`. Claude never raises a cap to make a brief fit.
