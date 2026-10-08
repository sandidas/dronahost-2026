/** CI gate: only changed content files are checked, a clean file passes (exit 0) and a deliberately bad one fails (exit 1). */
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { changedSince, selectContentFiles } from "./check-changed";
import { steps } from "./ci";

const FIX = "docs/content-planner/eval/fixtures";
const folders = [{ dir: "content/pages", ext: /\.json$/ }, { dir: "docs/content-planner/project/drafts", ext: /\.(md|mdx)$/ }];
const env = { ...process.env, CHECK_CONTENT_REGISTER: `${FIX}/register.md`, CHECK_CONTENT_FACTS: `${FIX}/facts`, CHECK_CONTENT_BRIEFS: `${FIX}/briefs` };
const run = (files: string) => spawnSync("npx", ["tsx", "docs/content-planner/tools/check-changed.ts", "--files", files], { env, encoding: "utf8" });

test("only page specs and drafts are selected, and README files are not", () => {
  const changed = ["content/pages/home.json", "app/page.tsx", "docs/content-planner/project/drafts/a.md", "docs/content-planner/project/drafts/README.md", "content/pages/notes.txt", "package.json"];
  assert.deepEqual(selectContentFiles(changed, folders), ["content/pages/home.json", "docs/content-planner/project/drafts/a.md"]);
});

test("changedSince lists the files changed on a branch in a real git repository", () => {
  const dir = mkdtempSync(join(tmpdir(), "git-"));
  const git = (...a: string[]) => execFileSync("git", ["-c", "user.email=a@example.com", "-c", "user.name=Sam Example", ...a], { cwd: dir, stdio: "pipe" });
  git("init", "-q", "-b", "main");
  mkdirSync(join(dir, "content/pages"), { recursive: true });
  writeFileSync(join(dir, "content/pages/a.json"), "{}");
  git("add", "."); git("commit", "-q", "-m", "base");
  git("checkout", "-q", "-b", "feature");
  writeFileSync(join(dir, "content/pages/b.json"), "{}");
  writeFileSync(join(dir, "other.txt"), "x");
  git("add", "."); git("commit", "-q", "-m", "change");
  assert.deepEqual(changedSince("main", dir)?.sort(), ["content/pages/b.json", "other.txt"]);
  assert.equal(changedSince("no-such-ref", dir), null, "an unreadable base returns null so the caller checks everything");
});

test("a clean content file passes the CI gate (exit 0)", () => {
  const r = run(`${FIX}/pass-guide.md`);
  assert.equal(r.status, 0, r.stdout);
});

test("a deliberately bad content file fails the CI gate (exit 1) and names the rule", () => {
  const r = run(`${FIX}/fail-flags.md,${FIX}/pass-guide.md`);
  assert.equal(r.status, 1);
  assert.match(r.stdout, /FAIL G1/);
});

test("no changed content files means nothing to check (exit 0)", () => {
  const r = spawnSync("npx", ["tsx", "docs/content-planner/tools/check-changed.ts", "--base", "HEAD"], { env, encoding: "utf8" });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /nothing to check/);
});

test("the CI sequence covers config, no-brand, links, schemas, register, changed content, posts and the evaluation set", () => {
  assert.deepEqual(steps([]).map((s) => s.name), ["config", "no-brand", "links", "schemas", "register", "changed content", "posts", "evaluation set"]);
});
