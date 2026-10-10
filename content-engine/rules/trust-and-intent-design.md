# Trust and intent in the design: where things sit on the page

Reusable rules, no business facts. Sources: [sources.md](sources.md), items 1 and 7 (people-first content; the rater guidelines on who is responsible for a page, customer-service information, main content prominence and Needs Met). Google publishes no layout checklist, so these are **our rules**, written so a designer, a writer and the blueprint checker read the same thing. The content side is in [eeat-and-people-first.md](eeat-and-people-first.md) and [search-intent.md](search-intent.md); the section library and counts are in [page-blueprints.md](page-blueprints.md).

## 1. The main content comes first and stays prominent

1. The first screen holds the main content for the page's intent (section 3), not a banner, a cookie wall that hides the H1, a video, or a decoration that pushes the H1 down. Nothing animates above the fold.
2. Supplementary content (navigation, related links, footer, newsletter) never competes with the main content for size, color or position. One primary action color on the page; one primary action above the fold.
3. No interstitial, overlay or sticky element covers the main content on a phone. A cookie banner sits at the bottom, with "reject" and "accept" the same size.
4. Text a reader needs is in the HTML, visible without a click: accordion and tab text is rendered, not fetched. Nothing is hidden only for small screens if a reader on a phone needs it.
5. Every section has one job and one H2 that states it (page-blueprints, Part A). A reader who scans only the headings understands the page.

## 2. Trust shows where the doubt is

| Reader's doubt | Where the answer sits | Section |
|---|---|---|
| "Who is this?" | One entity sentence in the first 50 words, the same wording site-wide | Hero lead |
| "Is it real?" | Who is responsible: About and Contact in the header or footer of every page; legal entity, registration and address in the footer once confirmed | Site chrome; `CompanyDetails` |
| "Can I reach a person?" | Customer-service information near every buy action and on the contact page: the live channels, what to include, and what happens next. A page that sells, or that collects personal data, shows this without scrolling far | `HelpAndPolicies`, `SupportChannels`, the form's note |
| "What are the terms?" | Every promise sits next to a link to the page that publishes its terms. A promise with no terms page does not render | `WhyChoose`, `AssuranceStrip`, plan cards |
| "What does it really cost?" | Signup price, billing period, renewal price and the tax line together, above the button, never inside the label or in a tooltip | `PricingPlans` |
| "What happens after I click?" | One line under the primary action or the form: the next step, who replies, how. No promised time unless measured | CTA note, form success state |
| "What is the catch?" | Honest limits on the page, in plain words, before the form or the plans, not in a footnote | `HonestLimits`, "not for you" column |
| "Who checked this, and when?" | A provenance band near the end: a named reviewer with a role, the date (spelled-out month), one sentence on how facts are checked, a link to report an error, and the editorial policy once published | `PageProvenance`; byline on articles |
| "Did anyone else trust them?" | Real proof only, with name, role, company and a link, placed beside the decision point (the plans or the form), not in a carousel at the top. The section hides until real | `Testimonials`, `Evidence`, `ProofBar` |

Rules:

1. Proof sits next to the action it supports. A review far from the plans is decoration; a review beside them is evidence.
2. A trust element is a fact a reader can check: a name, a date, a link. Badges, seals, star icons and logos with no link to their source do not render.
3. A photo presented as the team, a customer or a result is a real photo. An AI image is labeled where it could mislead.
4. Review dates are spelled out ("9 October 2026") and use `<time>` with the machine date. The visible date equals the recorded one.
5. The footer carries the policy links, the company identity block (when confirmed) and the ways to reach a person. Nothing else is required of it.

## 3. The first screen, by intent

The first screen is what a reader sees before scrolling on a phone: the first two sections of a page spec, or the first 200 words of an article (IN3).

| Intent | First screen shows | First screen never shows |
|---|---|---|
| Learn | The H1 as the question or topic, the 40 to 80 word answer, the byline | A plan, a price, a sales banner |
| Solve | The symptom as H1, the quick answer, the backup warning | "Your site is at risk" wording, a sales link |
| Compare | Both options in the H1, the verdict sentence, the date the facts were checked | A "winner" badge with no criteria |
| Buy | What this is and for whom, one primary action, one risk reducer beside it, the price or the way to it | Two competing actions, a countdown, a price inside a button |
| Find | The entity sentence, the route to the main destinations, how to reach a person | A re-sell of the product to someone who already knows it |
| Plan | The decision in one sentence and the criteria | A recommendation before the criteria |

## 4. Forms and lead capture

1. Only the fields the team needs. Each field has a visible label; "optional" is marked, not "required".
2. Above or beside the submit button: what happens next, who replies, and by which channel. No reply time unless it is measured and published.
3. A privacy line under the form, linking to the privacy policy once published. No pre-ticked consent. No newsletter opt-in hidden in a signup.
4. The success state repeats the next step. The error state says what to fix. Neither blames the reader.
5. The form works without JavaScript for the facts around it; the page is complete text without the form.

## 5. Pressure and deception: never

Fake urgency, invented scarcity, countdowns with no real deadline, "no questions asked", pre-ticked boxes, confirm-shaming ("No thanks, I like slow sites"), a renewal price hidden behind a tooltip, a cancel path harder than the buy path, a "most popular" badge on a plan that is not the real default. TR8 checks the wording; the reviewer checks the rest.

## 6. Accessibility is a trust signal

One H1, headings in order, visible focus, 44 by 44 px targets, 4.5:1 contrast for body text, reduced motion respected, every image with alt text, tables as real tables, accordions on native elements with the text in the HTML. A page that fails this fails the reader it was written for.

## 7. What the engine checks and what a person checks

| Checked by a tool | Checked by the reviewer |
|---|---|
| IN3 first screen; TR1, TR2, TR6 links and provenance; TR7 a visible first-hand element; TR8 pressure wording; BP7 one primary label; BP12 neighboring tones | Proof beside the action; nothing covering the main content on a phone; badge and photo honesty; form notes; the cancel path |

The reviewer records the person-checked items in the handoff's self-assessment with one line of evidence each.
