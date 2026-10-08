/** The Claude Code assets (claude/commands, claude/agents) are well formed and point at things that exist. */
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { parseFrontMatter } from "./front-matter";
import { SCRIPT_FILES } from "./install";

const DIR = "docs/content-planner/claude";
const files = (sub: string): string[] => readdirSync(join(DIR, sub)).filter((f) => f.endsWith(".md")).sort();
const read = (sub: string, f: string): string => readFileSync(join(DIR, sub, f), "utf8");

test("the six commands exist and have a description", () => {
  assert.deepEqual(files("commands"), ["audit-page.md", "init-project.md", "monthly-review.md", "plan-keywords.md", "refresh-content.md", "write-content.md"]);
  for (const f of files("commands")) assert.ok(parseFrontMatter(read("commands", f)).front.description, `${f} needs a description`);
});

test("the four role agents exist, are named after their file, and list allowed and forbidden actions", () => {
  assert.deepEqual(files("agents"), ["drafter.md", "editor.md", "fact-checker.md", "researcher.md"]);
  for (const f of files("agents")) {
    const text = read("agents", f);
    const { front } = parseFrontMatter(text);
    assert.equal(front.name, f.replace(/\.md$/, ""));
    assert.ok(front.description && front.tools, `${f} needs a description and a tool list`);
    assert.match(text, /\*\*Allowed:\*\*/);
    assert.match(text, /\*\*Not allowed:\*\*/);
  }
});

test("only the researcher and fact-checker can reach the web, and only the drafter can write files", () => {
  const tools = (f: string) => parseFrontMatter(read("agents", f)).front.tools;
  assert.match(tools("researcher.md"), /WebSearch/);
  assert.doesNotMatch(tools("drafter.md"), /Web/);
  assert.doesNotMatch(tools("editor.md"), /Web|Write/);
  assert.doesNotMatch(tools("fact-checker.md"), /Write|Edit/);
  assert.match(tools("drafter.md"), /Write/);
});

test("every npm script a command mentions is one the installer adds", () => {
  const known = new Set([...Object.keys(SCRIPT_FILES), "check:content", "check:register", "eval"]);
  for (const f of files("commands")) {
    for (const m of read("commands", f).matchAll(/npm run ([a-z]+(?::[a-z-]+)?)/g)) assert.ok(known.has(m[1]), `${f} mentions npm run ${m[1]}, which the installer does not add`);
  }
});

test("/write-content stops at APPROVAL 1 before any draft and names every stage", () => {
  const text = read("commands", "write-content.md");
  assert.ok(text.indexOf("APPROVAL 1") < text.indexOf("**Draft**"));
  assert.match(text, /never write the article in this part/i);
  for (const word of ["Resolve", "Classify", "Research", "Fact ledger", "Brief", "Interview", "Draft", "Edit", "Check", "Handoff"]) assert.match(text, new RegExp(word));
  assert.match(text, /never "publish-ready"/);
});

test("commands never claim the engine publishes or guarantees results", () => {
  for (const f of files("commands")) assert.doesNotMatch(read("commands", f), /guarantee[sd]? (a )?(rank|citation)/i);
});
