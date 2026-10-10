# Voice: Sentence Examples

Read this before writing any page. The full rules are in [content-engine/rules/content-writing-rules.md](content-writing-rules.md). This file shows the rules as sentences you can copy the shape of.

> **Every number, price, location, guarantee and date in an example is `[EXAMPLE, NOT VERIFIED]`.** Do not copy a value into live copy. Real values come only from the verified project registries named in `project/PROJECT.md`. In live copy, a missing fact means the sentence is not written, never guessed.

## The voice in one line

The project's voice is data: `summary`, `attributes` and `readability` in `project/voice.json`. Run `npm run content:voice` to print it as a card before you write. The examples below follow the default limits (grade 8 to 10, sentences under 20 words on average and never over 28).

## Ten sentence rules

| # | Rule | Do | Do not |
|---|---|---|---|
| 1 | Outcome first, technical term second | "Your site stays online while we update it (LiteSpeed server, NVMe storage)." | "Our LiteSpeed-powered NVMe infrastructure ensures high availability." |
| 2 | One idea per sentence, within `readability` in `project/voice.json` (defaults: under 20 words on average, never over 28) | "We copy your site. You check it on a private link. You switch when you are ready." | "We copy your site and, once you have checked it on a private link, which we provide, you can switch." |
| 3 | Active voice, a named subject | "[Brand] runs the servers and handles backups." | "Backups are handled and servers are managed." |
| 4 | Specific over vague | "Backups run every day and you can restore from the dashboard." | "Reliable backups give you peace of mind." |
| 5 | Plain verbs | "use", "start", "help", "show" | "utilize", "commence", "facilitate", "leverage" |
| 6 | No idioms or slang | "We reply to every ticket." | "We go the extra mile." |
| 7 | Honest about limits | "We cannot guarantee a ranking position." | "Top rankings, guaranteed." |
| 8 | Calm, no pressure | "The guarantee applies to new plans." (only when verified) | "Hurry! Offer ends tonight!" |
| 9 | Name the subject, avoid vague pronouns in answers | "Managed WordPress hosting means the host runs the server, updates and backups for you." | "It means they handle it for you." |
| 10 | No exclamation marks in marketing copy | "Your hosting is ready. Here is how to log in." | "Your hosting is ready!!" |

## Word swaps (translates better for second-language readers)

The project's list is `wordSwaps` in `project/voice.json` (check V11 warns on each). The table shows the default shape.

| Avoid | Use |
|---|---|
| utilize, leverage | use |
| commence, initiate | start |
| facilitate | help, let |
| in order to | to |
| a plethora of | many (or a count, if verified) |
| ensure | make sure |
| robust, seamless, cutting-edge | say what it does |
| reach out | contact, write to |
| touch base | talk |
| ballpark | rough estimate |
| circle back | return to |
| hit the ground running | start quickly |
| Kindly, do the needful, revert back | Please, say what to do, reply |

Write dates in full ("6 October 2026") and times with a timezone ("9:00 AM ET", "14:00 UTC").

## Examples by page type, reason-led headlines and maintenance

Worked examples for each page type, the reason-led ("because") headlines and the maintenance wording use this project's real services and tone. They live in `project/brand.md`, sections "From voice.md". The rules for them are in `content-writing-rules.md` sections 11 and 12.


## Human-first notes

- "We" means something we did. Do: "We moved 12 sites last quarter and found this fails when the old host blocks the database export." (`[EXAMPLE, NOT VERIFIED]`; real numbers only.) Do not: "We have years of experience helping businesses."
- Disclosure line on an AI-assisted guide (`disclosureLine` in `project/voice.json`): "Drafted with AI assistance, then edited, fact-checked and approved by [name]."
- Byline: "Written by [name]. Reviewed by [name] on [date]."

## UI and system copy

| Context | Do | Do not |
|---|---|---|
| Error, validation | "Enter a valid email address, for example name@company.com." | "Invalid input!" |
| Error, payment | "Your card was declined. Check the details or try another card." | "Payment failed. Do not worry." |
| Empty state | "No sites yet. Add your first site to see it here." | "Nothing here." |
| Success | "Your hosting is ready. Here is how to log in." | "Woohoo! You did it!" |
| Notification | "Your backup finished at 14:00 UTC. No action needed." | "Great news!" |

## Phrases that never appear

The full list is `bannedPhrases` in `project/voice.json`. Examples: "blazing fast", "world-class", "cutting-edge", "supercharge", "seamless", "Don't worry", "Kindly", "revert back". The content linter blocks the listed phrases. Banned CTA labels are `bannedCtaLabels` and idioms are `idioms` in the same file. The spelling variant is `spelling` (check V10 warns on the other variant).

## Quick self-check before you hand a draft over

1. Read the first sentence under each heading. Does it answer that heading?
2. Is there a number, price or guarantee? Where does it come from? If nowhere, remove it.
3. Could a second-language reader follow every sentence without a dictionary?
4. Is any sentence over the `readability.sentenceMax` in `project/voice.json` (default 28 words)? Split it.
5. Is there a sentence that would sound true of any host? Replace it with a specific one, or delete it.
