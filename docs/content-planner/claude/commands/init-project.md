---
description: Set up the content engine for a new project (config, project facts skeleton, empty register)
argument-hint: [project name]
---
Set up the content engine for a new project: $ARGUMENTS

1. Ask for the name, the domain, the owner and the locale one at a time, or take them from the arguments.
2. Run `npm run content:init-project -- --name "<name>" --domain <domain> --owner "<owner>" --locale <locale> --yes`. It never overwrites an existing file.
3. Run `npm run content:config` and `npm run content:no-brand`; both must pass.
4. Open `project/PROJECT.md` and list every `[HUMAN REVIEW]` placeholder as a question for the owner. Do not fill business facts yourself.
5. Tell the owner the next steps: fill `PROJECT.md` and `brand.md`, add register rows, then run `/write-content`.
