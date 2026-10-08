/**
 * The reuse proof. Copies ONLY the reusable core into a temporary host project, then follows the README: install, init-project,
 * fill project/ (the sample bakery stands in for the person), and run the checks. Nothing from the real project is copied.
 * Run: npm run test:reuse
 */
import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { spawnSync } from "node:child_process";
import { before, test } from "node:test";
import { BriefFrontMatter } from "../schemas/brief";
import { parseFrontMatter } from "./front-matter";
import { PLANNER_DIR } from "./load-config";
import { parseRegister } from "./register";

const REPO = join(PLANNER_DIR, "..", "..");
const CORE_DIRS = ["rules", "plans", "templates", "schemas", "eval", "tools", "claude", "later"];
const SAMPLE = join(PLANNER_DIR, "eval/sample-project");
/** Everything the test needs to know about the sample project is read from the sample's own files. */
function sampleFacts() {
  const config = JSON.parse(readFileSync(join(SAMPLE, "content-planner.config.json"), "utf8")) as { name: string };
  const rules = JSON.parse(readFileSync(join(SAMPLE, "project/rules.config.json"), "utf8")) as { noBrand: { terms: string[] } };
  const [, domain, owner] = rules.noBrand.terms;
  const reg = parseRegister(readFileSync(join(SAMPLE, "project/keyword-register.md"), "utf8"));
  const guide = reg.rows.find((r) => r.planNumber === "03")!;
  const draftRel = `docs/content-planner/project/drafts/${readdirSync(join(SAMPLE, "project/drafts"))[0]}`;
  const pageRel = `docs/content-planner/project/pages/${readdirSync(join(SAMPLE, "project/pages"))[0]}`;
  return { name: config.name, domain, owner, guide, excluded: reg.excluded[0].keywords[0], draftRel, pageRel };
}
const sample = sampleFacts();
let host = "";
let planner = "";

function run(args: string[]): { status: number | null; out: string } {
  const env = { ...process.env, NO_COLOR: "1" } as Record<string, string | undefined>;
  delete env.CONTENT_PLANNER_CONFIG;
  for (const k of ["CHECK_CONTENT_REGISTER", "CHECK_CONTENT_FACTS", "CHECK_CONTENT_BRIEFS", "WORDPRESS_API_URL"]) delete env[k];
  const r = spawnSync("npm", ["run", "-s", ...args], { cwd: host, env: env as NodeJS.ProcessEnv, encoding: "utf8" });
  return { status: r.status, out: `${r.stdout}${r.stderr}` };
}
const ok = (args: string[], expect?: RegExp): string => {
  const r = run(args);
  assert.equal(r.status, 0, `npm run ${args.join(" ")} failed:\n${r.out}`);
  if (expect) assert.match(r.out, expect);
  return r.out;
};

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    if (n === "node_modules") return [];
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

before(() => {
  host = mkdtempSync(join(tmpdir(), "reuse-"));
  planner = join(host, "docs/content-planner");
  mkdirSync(planner, { recursive: true });
  for (const d of CORE_DIRS) cpSync(join(PLANNER_DIR, d), join(planner, d), { recursive: true, filter: (src) => !/[\\/](sample-project|\.DS_Store)$/.test(src) });
  for (const f of ["README.md", "CHANGELOG.md"]) cpSync(join(PLANNER_DIR, f), join(planner, f));
  writeFileSync(join(host, "package.json"), JSON.stringify({ name: "bakery-site", private: true, scripts: { build: "echo build" } }, null, 2));
  symlinkSync(join(REPO, "node_modules"), join(host, "node_modules"));
});

test("the core copy contains no project folder and no config", () => {
  assert.equal(existsSync(join(planner, "project")), false);
  assert.equal(existsSync(join(planner, "content-planner.config.json")), false);
  assert.equal(existsSync(join(planner, "eval/sample-project")), false);
});

test("install adds the commands, the agents and the npm scripts, and a second run changes nothing", () => {
  const r = spawnSync("npx", ["tsx", "docs/content-planner/tools/install.ts", "--host", ".", "--planner", "docs/content-planner"], { cwd: host, encoding: "utf8", stdin: "ignore" } as never);
  assert.equal(r.status, 0, r.stdout + r.stderr);
  assert.equal(readdirSync(join(host, ".claude/commands")).length, 6);
  assert.equal(readdirSync(join(host, ".claude/agents")).length, 4);
  const scripts = JSON.parse(readFileSync(join(host, "package.json"), "utf8")).scripts as Record<string, string>;
  for (const s of ["content:ci", "content:check", "content:eval", "content:register", "content:init-project", "content:posts"]) assert.ok(scripts[s], `script ${s}`);
  assert.equal(scripts.build, "echo build", "an existing script is kept");
  const again = spawnSync("npx", ["tsx", "docs/content-planner/tools/install.ts", "--host", ".", "--planner", "docs/content-planner"], { cwd: host, encoding: "utf8" });
  assert.match(again.stdout, /Nothing changed/);
});

test("init-project builds a project that already passes config, no-brand, register and the evaluation set", () => {
  ok(["content:init-project", "--", "--out", "docs/content-planner", "--name", sample.name, "--domain", sample.domain, "--owner", sample.owner, "--locale", "en-US", "--yes"], /Done: \d+ created/);
  ok(["content:config"]);
  ok(["content:no-brand"]);
  ok(["content:register"]);
  ok(["content:eval"], /All 10 evaluation cases match/);
});

test("after the sample bakery's facts are filled in, every check passes with no other project's file present", () => {
  cpSync(join(SAMPLE, "project"), join(planner, "project"), { recursive: true, force: true });
  cpSync(join(SAMPLE, "content-planner.config.json"), join(planner, "content-planner.config.json"), { force: true });
  ok(["content:config"]);
  ok(["content:no-brand"], /passed/);
  ok(["content:links"]);
  ok(["content:schemas"], /All schema checks passed/);
  ok(["content:register"], /Register check passed/);
  ok(["content:check"], /2 file\(s\) checked, 0 with failures/);
  ok(["content:eval"], /All 10 evaluation cases match/);
  ok(["content:governor"], /may start/);
  ok(["content:ci", "--", "--files", `${sample.draftRel},${sample.pageRel}`], /All content checks passed/);
});

test("the tools work on the bakery: resolve, schema, links and overlap", () => {
  ok(["content:resolve", "--", sample.guide.keyword], /Decision:\s+accept/);
  ok(["content:resolve", "--", `How to ${sample.guide.keyword.replace(/^how to /, "").replace(/\b\w/g, (c) => c.toUpperCase())}?`], /Decision:\s+confirm/);
  const rejected = run(["content:resolve", "--", sample.excluded]);
  assert.equal(rejected.status, 1);
  assert.match(rejected.out, /excluded keyword/);
  const draft = sample.draftRel;
  assert.match(ok(["content:gen-schema", "--", draft]), /BlogPosting/);
  ok(["content:suggest-links", "--", draft]);
  ok(["content:similarity", "--", draft]);
});

test("a deliberately bad draft turns the checks red in the new project", () => {
  const good = readFileSync(join(host, sample.draftRel), "utf8");
  const bad = good.replace(/^(# .*)$/m, "$1\n\nThis is a lorem ipsum placeholder, and it is cutting-edge!");
  writeFileSync(join(planner, "project/drafts/bad-draft.md"), bad.replace(/^slug: .*$/m, "slug: /kb/bad-draft"));
  const r = run(["content:check"]);
  assert.equal(r.status, 1);
  assert.match(r.out, /FAIL V1|FAIL V2/);
});

test("a first brief can be built from the template and passes the brief schema", () => {
  const template = readFileSync(join(planner, "templates/brief.md"), "utf8");
  const values: Record<string, string> = {
    slug: "/kb/example-guide", plan: "03 Informational", locale: "en-US", primary_keyword: "how to do the example thing", secondary_keywords: "example thing",
    intent_primary: "Learn", intent_secondary: "none", buying_stage: "early", state: "Brief", governor_in_flight: "1", governor_in_flight_max: "3",
    governor_month_count: "1", governor_month_cap: "4", governor_paused: "false", created_on: "2026-10-09", serp_checked_on: "2026-10-09",
    information_gain_status: "not-confirmed", original_element: "flag", interview_status: "not-started", approval_1: "pending", approved_on: "",
    ai_used: "yes", owner: sample.owner, reviewer: sample.owner, next_review_on: "2027-04-09",
  };
  const filled = template.replace(/^([a-z_0-9]+):.*$/gm, (line, key: string) => (key in values ? `${key}: ${values[key]}` : line));
  const parsed = BriefFrontMatter.safeParse(parseFrontMatter(filled).front);
  assert.equal(parsed.success, true, parsed.success ? "" : JSON.stringify(parsed.error.issues));
});

test("nothing from the real project is in the temporary host", () => {
  const real = JSON.parse(readFileSync(join(PLANNER_DIR, "project/rules.config.json"), "utf8")) as { noBrand: { terms: string[] } };
  const esc = (t: string): string => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const res = real.noBrand.terms.map((t) => ({ t, re: new RegExp(`(^|[^A-Za-z0-9])${esc(t)}($|[^A-Za-z0-9])`, t === t.toUpperCase() ? "" : "i") }));
  const hits: string[] = [];
  for (const f of files(host)) {
    const rel = relative(host, f);
    const text = readFileSync(f, "utf8");
    for (const { t, re } of res) if (re.test(rel) || re.test(text)) hits.push(`${rel} names "${t}"`);
  }
  assert.deepEqual(hits, []);
});
