import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ConfigSchema } from "../schemas/config";
import { RulesConfigSchema } from "../schemas/rules-config";
import { parseRegister, COLUMNS } from "./register";
import { initProject } from "./init-project";

const opts = { name: "ExampleCo", domain: "example.com", owner: "Sam Example", locale: "en-US" };
const tool = fileURLToPath(new URL("./init-project.ts", import.meta.url));

test("generates valid config, rules and register", () => {
  const out = mkdtempSync(join(tmpdir(), "init-"));
  const r = initProject({ ...opts, out });
  assert.ok(r.created.includes("content-planner.config.json"));
  const cfg = ConfigSchema.parse(JSON.parse(readFileSync(join(out, "content-planner.config.json"), "utf8")));
  const rules = RulesConfigSchema.parse(JSON.parse(readFileSync(join(out, cfg.paths.rulesConfig), "utf8")));
  assert.deepEqual(rules.noBrand.terms, ["ExampleCo", "example.com", "Sam Example"]);
  const reg = parseRegister(readFileSync(join(out, cfg.paths.register), "utf8"));
  assert.equal(reg.rows.length, 0);
  assert.deepEqual(reg.errors, []);
  assert.equal(reg.headings.filter((h) => h.text.startsWith("Plan ")).length, 12);
  assert.ok(reg.headings.some((h) => h.text === "Plan 15: Off-site reviews and links"));
  assert.ok(readFileSync(join(out, cfg.paths.register), "utf8").includes(`| ${COLUMNS.join(" | ")} |`));
  assert.ok(existsSync(join(out, "project/briefs/.gitkeep")));
  assert.match(readFileSync(join(out, "project/PROJECT.md"), "utf8"), /\[HUMAN REVIEW:/);
});

test("never overwrites an existing file", () => {
  const out = mkdtempSync(join(tmpdir(), "init-"));
  initProject({ ...opts, out });
  writeFileSync(join(out, "project/PROJECT.md"), "mine");
  const r = initProject({ ...opts, out });
  assert.equal(r.created.length, 0);
  assert.ok(r.kept.includes("project/PROJECT.md"));
  assert.equal(readFileSync(join(out, "project/PROJECT.md"), "utf8"), "mine");
});

test("a bad locale throws and writes nothing", () => {
  const out = mkdtempSync(join(tmpdir(), "init-"));
  assert.throws(() => initProject({ ...opts, locale: "english", out }));
  assert.equal(existsSync(join(out, "project")), false);
});

test("CLI is non-interactive with all flags and prints kept existing on rerun", () => {
  const out = mkdtempSync(join(tmpdir(), "init-"));
  const args = ["tsx", tool, "--out", out, "--name", opts.name, "--domain", opts.domain, "--owner", opts.owner, "--locale", "en-US"];
  assert.equal(spawnSync("npx", args, { encoding: "utf8" }).status, 0);
  const again = spawnSync("npx", args, { encoding: "utf8" });
  assert.match(again.stdout, /kept existing project\/PROJECT\.md/);
  const bad = spawnSync("npx", [...args.slice(0, -1), "xx"], { encoding: "utf8" });
  assert.equal(bad.status, 1);
});
