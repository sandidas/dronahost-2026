---
description: Set up the content engine for a new project (config, project facts skeleton, empty register)
argument-hint: [project name]
---
Set up the content engine for a new project: $ARGUMENTS

1. Ask for the name, the domain, the owner, the locale and what the business is (in plain words) one at a time, or take them from the arguments.
2. Run `npm run content:init-project -- --name "<name>" --domain <domain> --owner "<owner>" --locale <locale> --type "<what the business is>" --yes`. It never overwrites an existing file. It writes `project/settings.json` (brand, business type, audience, locale, channels, people) and `project/voice.json` (tone, readability, spelling, word swaps, banned lists).
3. Run `npm run content:config` and `npm run content:no-brand`; both must pass.
4. Open `project/settings.json`, `project/voice.json` and `project/PROJECT.md` and list every `[HUMAN REVIEW]` placeholder as a question for the owner. Do not fill business facts yourself. Ask the owner to describe the voice (three words, two brands to write like, words to ban) and put the answers in `voice.json`.
5. Run `npm run content:voice` and show the card. Tell the owner the next steps: fill `PROJECT.md` and `brand.md` (worked examples), add register rows, then run `/write-content`.
