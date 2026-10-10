---
slug: </kb/example-post>
plan: <plan number and name>
primary_keyword: <register keyword>
intent_primary: <Learn | Solve | Compare | Buy | Find | Plan>
secondary_keywords: <phrase one; phrase two>
locale: <en-US>
state: <Draft | Ready for owner review>
author: <real name, or "[HUMAN REVIEW: author name and author page]">
reviewer: <real name>
ai_assisted: <yes | no>
reviewed_on: <YYYY-MM-DD, set when a person rechecks the whole post>
next_review_on: <YYYY-MM-DD>
seo_title: <title without the brand suffix>
meta_description: <outcome, difference, next step>
---
# <H1>

<Answer block: 40 to 80 words that answer the question.>

*Drafted with AI assistance, then edited, fact-checked and approved by <name>.*

Front matter keys are read by `check-content` (people, metadata and flags groups) and by the schema in `schemas/front-matter.ts`. A draft may carry `[HUMAN REVIEW: ...]` placeholders in `author`, `reviewer` and `reviewed_on` while its state starts with "Draft".
