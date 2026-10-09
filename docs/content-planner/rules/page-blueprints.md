# Page blueprints: sections, counts and content by search intent

Reusable rules. They name no business. The blueprints themselves (how many sections, which are required, in what order) are project data in `project/blueprints.json`, and the page-by-page map is `project/page-map.md`.

**What this fixes:** pages were being built section by section from a template, so counts, order and content depended on guesswork. These rules say, for each kind of search intent, how many sections, which ones, in what order, what each must contain, where its content comes from and what hides it.

## Part A: Rules that apply to every page

1. **One job per section.** The H2 states the point. One idea, one reader question.
2. **A section is any block between the header and the footer**, including the hero, the assurance strip and the final CTA band. Ranges below are for visible sections.
3. **Every blueprint has required sections.** If gating hides a required section, the page is **Blocked** (not published) until the missing fact arrives. The status says which section needs which fact.
4. **Order follows the reader's questions** for that intent (pattern per stage below).
5. **One conversion goal per page.** One primary CTA label, repeated wherever a CTA appears. At most one secondary action (usually "Talk to our team").
6. **Layout signature.** No two key pages share the same hero variant and the same first four section types. The linter checks this. Within a page, two neighbouring sections never share a background tone, so the page reads as separate blocks.
7. **A section type appears once per page**, except `CTABand` (max 2: a middle one and the final one) and `TwoColumn` (max 2).
8. **Hidden sections leave no gap.** Spacing recalculates. An empty section never renders a heading alone.
9. **Content comes from the right place.** Copy: page JSON. Prices and plan features: the pricing file. Promises: claims. Company facts: the company file. UI chrome (button labels like "Open a ticket"): the shared strings file.
10. **Length is a guide.** Visible body words per blueprint are ranges for planning. Under the minimum is flagged thin. Over the maximum is flagged long. Neither is a pass or fail.

### Order patterns by reader stage

| Stage | Order |
|---|---|
| Decide (buy) | Outcome, answer, who it is for, what you get, risk removers, price, proof, questions, action |
| Compare | Verdict, how we compared, table, where each is stronger, who should choose which, action |
| Learn | Direct answer, explanation, example, common mistakes, next step |
| Fix | Symptom, quick answer, backup, steps, when to ask for help, prevent |
| Trust | Who we are, facts, people, proof, policies, how to reach us |

## Part B: The section library (content rules per section type)

| Section type | Job | Content and limits | Source | Hides when |
|---|---|---|---|---|
| `ProductHero`, `SplitHero`, `CenteredHero` | Say what this is, for whom, and the one next step | Eyebrow 40 chars or fewer. H1 70 or fewer, one accent phrase at most. Lead 220 or fewer. One primary CTA, one secondary. Mockup only if it is labelled as an example | Page JSON | never (required) |
| `AssuranceStrip` | Remove the top three fears with linked proof | 3 or 4 claims, each with a link to its policy page | Claims | each claim hides alone. Section hides if none render |
| `AnswerBlock` | Direct answer for readers and answer engines | H2 as a question. 40 to 80 words. First sentence answers. No list, no link | Page JSON | never (required on most) |
| `PathRouter` | Send the reader by situation | 3 or 4 cards: situation (a sentence in the reader's words), one line of 20 words or fewer, link | Page JSON | a card hides if its product is not sold or its claim is missing. Section needs 2 cards |
| `ResponsibilitySplit` | Show who looks after what | Two columns, 3 to 5 lines each. Every "we look after" line maps to a confirmed capability | Claims and features | a line hides alone |
| `TwoColumn` | Pair an explanation with a visual or a contrast ("for you / not for you") | Heading, two blocks of 60 words or fewer | Page JSON | never |
| `FeatureGrid`, `BentoGrid` | Show what is included | 4 to 6 tiles. Title 6 words or fewer. One line of 20 words or fewer. A small mockup where it helps | Pricing file features, claims | a tile hides if its feature is unverified. Section needs 3 tiles |
| `ProcessTimeline` | Show how it works | 3 to 5 steps. Title 5 words or fewer. One sentence each. No invented times | Page JSON, terms page | hides if the matching claim does not render |
| `PricingPlans` | Show price and decision | 3 plan cards plus one "high-traffic" row. Price, billing period, renewal price, tax line above a "Choose [plan]" button | Pricing file | hides until prices are confirmed |
| `ComparisonTable` | Compare with evidence | 8 rows or fewer, 3 columns or fewer. Every cell has a source and a date. "Where they are stronger" is mandatory | Comparison data | hides until the comparison feature flag is on and every cell is sourced |
| `SupportChannels` | Say how to reach us | Only live channels (ticket, email). Hours from the support policy | Company file, claims | hours hide until the support claim renders |
| `Testimonials` | Real voices | 3 to 6 quotes, each with name, role, company and a link. Exact words, with permission | Reviews file | hides if fewer than 3 are real |
| `CaseStudy` | One real result | One project, named with permission, real numbers with a source | Case-study file | hides if not approved |
| `StatsBar` | Show measured numbers | 3 or 4 numbers, each measured and linked to its method | Claims | each stat hides alone |
| `TrustSignals` | Link to policies and proof | 4 to 7 policy links, only published pages | Published pages | a link hides until its page is published |
| `FAQSection` | Answer the last doubts | Money, pricing and product pages 6 to 8 items. Other pages 4 to 6. Answers 40 to 80 words, first sentence answers, at most one link | Page JSON | an item hides if it depends on a claim that does not render |
| `ResourceGrid` | Point to next reads | 3 or 4 links with a reason each | Register, posts | hides if fewer than 3 pages exist |
| `CodeBlock` | Show commands or config | Short, copyable, tested | Page or post | never |
| `ContactForm` | Collect a request | Only the fields the team needs. Error, success and empty states | Strings file | never |
| `ProofBar` | Show measured numbers or ratings above the fold | 3 or 4 items, each a number, a short label and a link to its method | Claims, reviews file | each item hides alone. Section hides if fewer than 3 render |
| `WhyChoose` (a page names its own heading) | Give three reasons to choose us, each with a source | Exactly 3 items. Title 6 words or fewer, one line of 20 words or fewer, a source link to the page that publishes the terms | Claims, published pages | an item hides if its claim does not render. Section needs 2 items |
| `MigrationRequest` | Capture a lead for a free move | Fields: site URL, current host, email, optional note. A honeypot, an error state, a success state and a privacy line. The page JSON lists the fields. Submit goes through one function that the project points at its destination | Page JSON, strings file | hides until the destination is configured and the migration claim renders |
| `Evidence` | Show one real result | One approved case study with real numbers and a source link | Case-study file | hides until a case study is approved |
| `CTABand` | Close with one action | H2 8 words or fewer. Primary CTA, optional secondary | Page JSON | never (required) |

## How the engine enforces this (Part E)

A page spec (`content/pages/*.json`) names its blueprint in a `blueprint` field. `check-content` then runs the Blueprint group, pass or fail, with no score. The host project supplies two adapters: one that reports which sections are visible (after gating) and how many words they hold, and one that scans components for page copy that is not in the page JSON or the shared strings file. Blueprint data is read from `paths.blueprints` in the config.

### Checks

| Check | Fails when |
|---|---|
| Blueprint set | The page does not name a blueprint, or the blueprint does not exist |
| Count | Visible sections fall outside the blueprint's range |
| Required | A required section is missing or hidden. Status becomes Blocked with the missing fact |
| Order | Sections are out of the pattern for the stage (warns, not fails, for optional ones) |
| Section limits | Any field breaks its limit: H1 70, lead 220, FAQ answers 40 to 80, FAQ count per archetype, tiles 4 to 6, steps 3 to 5, and so on. A list may also be limited to an allowed set of values with some values required (for example the fields of a request form) |
| Duplicates | A section type is repeated beyond its allowance |
| CTA | More than one primary label, a banned label, or a price inside a button label |
| Signature | Two key pages share hero variant and first four section types |
| Copy source | Page copy appears in a component instead of page JSON or the content files (strings file for UI chrome only) |
| Gate | A section shows although its claim, flag or page does not render |
| Neighbours | Two visible sections next to each other share a background tone |
| Thin or long | Visible words outside the blueprint range (warning) |

Two readings the engine uses:
- **Count.** A blueprint has a range (for example 8 to 11 sections) and a publish minimum. Visible sections above the range fail. Below the publish minimum they fail. Between the minimum and the range start they warn, because gating is hiding sections.
- **Status.** A page is **Ready** when every required section is visible. It is **Blocked** when a required section is hidden, and the check names the missing fact.
