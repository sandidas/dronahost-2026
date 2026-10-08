# Sample project: Crumb and Co

A **fictional** bakery used to prove the content engine works in a project that has nothing to do with the real one. Nothing here is a real business, price, review or fact.

It is exactly what `init-project` writes (the `content-planner.config.json` and `project/` folder), filled in by hand: business facts, a register with rows, one page spec, one approved brief, one fact ledger and one article that passes every check.

Run the engine against it from the repository root:

```
CONTENT_PLANNER_CONFIG=docs/content-planner/eval/sample-project/content-planner.config.json npm run content:ci -- --all
```

`npm run test:reuse` copies the reusable core into a temporary folder, runs `install` and `init-project`, overlays this project and runs the checks there with no other project file present.
