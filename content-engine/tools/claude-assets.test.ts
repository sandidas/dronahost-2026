/** The Claude Code assets (claude/commands, claude/agents, claude/skills) are well formed, point at things that exist, and match the installed copies. */
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { parseFrontMatter } from "./front-matter";
import { SCRIPT_FILES } from "./install";

const DIR = "content-engine/claude";
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
    for (const m of parseFrontMatter(read("commands", f)).body.matchAll(/npm run ([a-z]+(?::[a-z-]+)?)/g)) assert.ok(known.has(m[1]), `${f} mentions npm run ${m[1]}, which the installer does not add`);
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

test("the content-engine skill routes every content request to the engine and outranks global writing skills", () => {
  const text = readFileSync(join(DIR, "skills/content-engine/SKILL.md"), "utf8");
  const { front } = parseFrontMatter(text);
  assert.equal(front.name, "content-engine");
  for (const t of ["write content for", "create a page about", "write an article on", "meta titles", "microcopy"]) assert.ok(front.description.includes(t), `the description needs the trigger "${t}"`);
  assert.match(front.description, /takes precedence/);
  for (const c of ["/write-content", "/refresh-content", "/audit-page", "/plan-keywords", "content:voice"]) assert.ok(text.includes(c), `the skill must route to ${c}`);
});

test("the installed copies in .claude/ match the engine's claude/ folder (run npm run content:install after editing claude/)", () => {
  const host = join(DIR, "..", "..", ".claude");
  if (!existsSync(join(host, "commands"))) return; // a fresh copy that has not been installed yet
  const pairs: [string, string][] = [
    ...files("commands").map((f): [string, string] => [join(DIR, "commands", f), join(host, "commands", f)]),
    ...files("agents").map((f): [string, string] => [join(DIR, "agents", f), join(host, "agents", f)]),
    ...readdirSync(join(DIR, "skills")).map((n): [string, string] => [join(DIR, "skills", n, "SKILL.md"), join(host, "skills", n, "SKILL.md")]),
  ];
  for (const [src, dst] of pairs) {
    assert.ok(existsSync(dst), `${dst} is missing. Fix: npm run content:install`);
    assert.equal(readFileSync(dst, "utf8"), readFileSync(src, "utf8"), `${dst} differs from ${src}. Fix: copy the engine file over the installed one`);
  }
});
