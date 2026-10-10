import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { install, SCRIPT_FILES } from "./install";

const fx = fileURLToPath(new URL("../eval/fixtures/install/", import.meta.url));
const tool = fileURLToPath(new URL("./install.ts", import.meta.url));

function setup(withConfig = true) {
  const root = mkdtempSync(join(tmpdir(), "inst-"));
  const host = join(root, "host");
  const planner = join(host, "planner");
  cpSync(join(fx, "host"), host, { recursive: true });
  cpSync(join(fx, "planner"), planner, { recursive: true });
  if (withConfig) { mkdirSync(join(planner, "project")); writeFileSync(join(planner, "content-engine.config.json"), "{}"); }
  return { host, planner };
}
const opts = (s: { host: string; planner: string }, dryRun = false) => ({ ...s, dryRun, interactive: false });

test("copies files, adds scripts, keeps existing scripts, and is idempotent", async () => {
  const s = setup();
  const first = await install(opts(s));
  assert.equal(first.failed, false);
  assert.ok(existsSync(join(s.host, ".claude/commands/example-command.md")));
  assert.ok(existsSync(join(s.host, ".claude/agents/example-agent.md")));
  const pkg = JSON.parse(readFileSync(join(s.host, "package.json"), "utf8"));
  assert.equal(pkg.scripts.build, "echo build");
  assert.equal(pkg.scripts["content:check"], "echo mine");
  assert.equal(pkg.scripts["content:config"], "tsx planner/tools/check-config.ts");
  assert.equal(Object.keys(pkg.scripts).filter((k) => k.startsWith("content:")).length, Object.keys(SCRIPT_FILES).length);
  assert.match(first.lines.join("\n"), /differs, kept npm script content:check/);
  const before = readFileSync(join(s.host, "package.json"), "utf8");
  const second = await install(opts(s));
  assert.equal(second.changes, 0);
  assert.match(second.lines.join("\n"), /Nothing changed/);
  assert.equal(readFileSync(join(s.host, "package.json"), "utf8"), before);
});

test("a different existing command is kept and listed", async () => {
  const s = setup();
  mkdirSync(join(s.host, ".claude/commands"), { recursive: true });
  writeFileSync(join(s.host, ".claude/commands/example-command.md"), "mine");
  const r = await install(opts(s));
  assert.equal(r.failed, false);
  assert.match(r.lines.join("\n"), /differs, kept .claude\/commands\/example-command\.md/);
  assert.equal(readFileSync(join(s.host, ".claude/commands/example-command.md"), "utf8"), "mine");
});

test("dry run writes nothing", async () => {
  const s = setup();
  const before = readFileSync(join(s.host, "package.json"), "utf8");
  const r = await install(opts(s, true));
  assert.match(r.lines.join("\n"), /would copy/);
  assert.equal(existsSync(join(s.host, ".claude")), false);
  assert.equal(readFileSync(join(s.host, "package.json"), "utf8"), before);
});

test("missing package.json fails IN1", async () => {
  const s = setup();
  const r = await install(opts({ host: join(s.host, "planner"), planner: s.planner }));
  assert.equal(r.failed, true);
  assert.match(r.lines[0], /FAIL IN1 .*Fix:/);
});

test("missing config prints the init command when not interactive", async () => {
  const s = setup(false);
  const r = await install(opts(s));
  assert.match(r.lines.join("\n"), /Run: npx tsx planner\/tools\/init-project\.ts/);
  assert.equal(existsSync(join(s.planner, "project")), false);
});

test("CLI exits 1 on missing package.json and 0 on success", () => {
  const s = setup();
  const bad = spawnSync("npx", ["tsx", tool, "--host", join(s.host, "planner"), "--planner", s.planner], { encoding: "utf8" });
  assert.equal(bad.status, 1);
  const ok = spawnSync("npx", ["tsx", tool, "--host", s.host, "--planner", s.planner, "--dry-run"], { encoding: "utf8" });
  assert.equal(ok.status, 0);
});
