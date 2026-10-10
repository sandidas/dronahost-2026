/** Regression tests for the reviewed bugs: sentence splitting, keyword rules, locale, facts, policy, dates, merge order, CLI guards. Run: npm run test:tools */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { fileURLToPath } from "node:url";
import { gitRoot } from "./check-changed";
import { checkDoc, loadContext, type Ctx } from "./check-content";
import { hostCwd } from "./content/context";
import { runVisibility } from "./content/rules-blueprint";
import { runCases } from "./eval";
import { docFromText, sentencesOf, splitSentences } from "./content/parse";
import { factRules, hasFigure, policyRules } from "./content/rules-facts";
import { anchorMatches } from "./content/rules-intent-trust";
import { gradeLevel, keywordRules, voiceRules } from "./content/rules-text";
import { normSlug } from "./content/types";
import { isIsoDate } from "./dates";
import { isMain } from "./is-main";
import { mergeConfig, mergeRules } from "./load-config";
import { parseRegister } from "./register";
import { buildQueue } from "./refresh-queue";
import type { Settings } from "../schemas/settings";
import type { Voice } from "../schemas/voice";

const TOOLS = fileURLToPath(new URL(".", import.meta.url));
const tmp = mkdtempSync(join(tmpdir(), "fixes-"));
let ctx: Ctx;
before(async () => { ctx = await loadContext(); });

const md = (body: string, front: Record<string, string> = {}): ReturnType<typeof docFromText> => {
  const head = Object.entries({ slug: "/kb/x", state: "Draft", ...front }).map(([k, v]) => `${k}: ${v}`).join("\n");
  return docFromText(join(tmp, "x.md"), `---\n${head}\n---\n${body}\n`, "md", ctx.copy);
};
const ruleOf = (rs: { id: string }[], id: string) => rs.find((r) => r.id === id) as ReturnType<typeof keywordRules>[number];
const HEAD = "| Keyword | Locale | Secondary | Intent check | Volume / KD | Target URL | Owner | Status | Next review | AI cited |\n|---|---|---|---|---|---|---|---|---|---|\n";
const register = (rows: string): Ctx["register"] => parseRegister(`## Plan 03: Guides\n\n${HEAD}${rows}`);

test("sentencesOf keeps abbreviations inside a sentence and still splits real sentences", () => {
  assert.deepEqual(sentencesOf("Use a cache, e.g. a page cache. It helps."), ["Use a cache, e.g. a page cache.", "It helps."]);
  assert.deepEqual(splitSentences("Plans vs. prices differ. See No. 5 below. We serve the U.S. and the U.K. markets."), ["Plans vs. prices differ.", "See No. 5 below.", "We serve the U.S. and the U.K. markets."]);
  assert.deepEqual(splitSentences("Apples, pears, etc. are fruit. Done etc. Next one."), ["Apples, pears, etc. are fruit.", "Done etc.", "Next one."]);
  assert.deepEqual(sentencesOf("![A photo](x.png) Short [link](/a)."), ["A photo Short link."]);
});

test("gradeLevel: short plain sentences grade low, long Latinate ones high, abbreviations do not add sentences", () => {
  assert.equal(gradeLevel(""), 0);
  assert.ok(gradeLevel("The cat sat. The dog ran. We ate.") < 3);
  assert.ok(gradeLevel("Comprehensive infrastructure modernization necessitates organizational transformation initiatives.") > 15);
  assert.equal(gradeLevel("Use a host, e.g. ours, i.e. this one."), gradeLevel("Use a host, eg ours, ie this one."));
});

test("K2: the H1 does not count toward the first 100 words, matching is word-bounded, and a missing H2 is a warning", () => {
  const front = { primary_keyword: "host", seo_title: "Pick a host" };
  const onlyH1 = ruleOf(keywordRules(ctx, md("# Pick a host\n\nA ghost story with no keyword here.\n\n## Other", front)), "K2");
  assert.equal(onlyH1.ok, false);
  assert.match(onlyH1.failures.map((f) => f.message).join(), /first 100 words after the H1/);
  assert.match(onlyH1.warnings.map((f) => f.message).join(), /any H2/);
  const good = ruleOf(keywordRules(ctx, md("# Pick a host\n\nA good host is quick.\n\n## How to pick a host", front)), "K2");
  assert.equal(good.ok, true);
  assert.deepEqual(good.warnings, []);
});

test("K3: counts the keyword word-bounded, warns above 1 per 100 and fails above 3", () => {
  const filler = (n: number): string => Array.from({ length: n }, () => "word").join(" ");
  const k3 = (body: string) => ruleOf(keywordRules(ctx, md(`# Title host\n\n${body}`, { primary_keyword: "host", seo_title: "host" })), "K3");
  const ghosts = k3(`${filler(100)} ${"ghost ghosts hosting ".repeat(10)}`);
  assert.equal(ghosts.ok, true);
  assert.deepEqual(ghosts.warnings, [], "ghost and hosting are not the keyword");
  const warn = k3(`${filler(100)} host host`);
  assert.equal(warn.ok, true);
  assert.equal(warn.warnings.length, 1);
  assert.equal(k3(`${filler(100)} ${"host ".repeat(5)}`).ok, false);
});

test("K4: the same keyword in another locale is not a conflict; in the same locale it is", () => {
  const base = { ...ctx, register: register("| best host | en-GB | | | | `/uk/best-host` | | published | 2027-01-01 | |\n| best host | en-US | | | | `/kb/x` | | published | 2027-01-01 | |\n") };
  const doc = md("# Best host\n\nText.", { primary_keyword: "best host" });
  assert.equal(ruleOf(keywordRules(base, doc), "K4").ok, true);
  assert.equal(ruleOf(keywordRules(base, md("# Best host\n\nText.", { primary_keyword: "best host", locale: "en-GB" })), "K4").ok, false);
  assert.equal(ruleOf(keywordRules(base, doc), "K1").ok, true, "the en-US row owns /kb/x");
});

test("F1: every number on a line is checked, and a ledger figure must match as a whole number", () => {
  const facts = join(tmp, "facts");
  mkdirSync(facts, { recursive: true });
  writeFileSync(join(facts, "kb-x.json"), JSON.stringify({ facts: [{ id: "f1", fact: "Refunds within 30 days. Uptime 99%.", kind: "number", status: "verified", source: { type: "project-file", ref: "terms" } }] }));
  const c = { ...ctx, factsDir: facts, priceNumbers: new Set<number>() };
  const f1 = (line: string) => ruleOf(factRules(c, md(`# T\n\n${line}`)), "F1");
  assert.equal(f1("Refunds within 30 days and uptime of 99%.").ok, true);
  const two = f1("Refunds within 30 days and a 45% discount.");
  assert.equal(two.ok, false);
  assert.match(two.failures[0].message, /45%/);
  assert.equal(f1("A 9% fee.").ok, false, '"9%" is not in "99%"');
  assert.equal(hasFigure("Refunds within 30 Days", "30 days"), true);
  assert.equal(hasFigure("130 days", "30 days"), false);
});

test("V2: an image line is not an exclamation mark", () => {
  const v2 = ruleOf(voiceRules(ctx, md("# T\n\n![A screenshot of the panel](panel.png)\n\nPlain text.")), "V2");
  assert.equal(v2.ok, true);
  assert.equal(ruleOf(voiceRules(ctx, md("# T\n\nWow!")), "V2").ok, false);
});

test("V3 counts a long list item as a sentence", () => {
  const long = Array.from({ length: 40 }, (_, i) => `w${i}`).join(" ");
  assert.equal(ruleOf(voiceRules(ctx, md(`# T\n\n- ${long}`)), "V3").ok, false);
});

test("V10 and V11 warn from rules.spellingAvoid and rules.wordSwaps", () => {
  const c = { ...ctx, rules: { ...ctx.rules, spellingAvoid: { colour: "color" }, wordSwaps: [{ avoid: ["utilize"], use: "use" }] } };
  const rs = voiceRules(c, md("# T\n\nPick a colour. We utilize caching."));
  assert.equal(ruleOf(rs, "V10").ok, true);
  assert.match(ruleOf(rs, "V10").warnings[0].message, /color/);
  assert.match(ruleOf(rs, "V11").warnings[0].message, /use/);
  const none = voiceRules({ ...ctx, rules: { ...ctx.rules, spellingAvoid: {}, wordSwaps: [] } }, md("# T\n\nText."));
  assert.equal(ruleOf(none, "V10").skipped, true);
  assert.equal(ruleOf(none, "V11").skipped, true);
});

test("PO1: a negation counts only before the channel word, in the same sentence", () => {
  const c = { ...ctx, rules: { ...ctx.rules, forbiddenChannels: ["phone support"], channelAllowlistFiles: [] } };
  const po1 = (t: string) => ruleOf(policyRules(c, md(`# T\n\n${t}`)), "PO1");
  assert.equal(po1("We don't offer phone support.").ok, true);
  assert.equal(po1("We never use phone support.").ok, true);
  assert.equal(po1("We do not sell domains. Call our phone support.").ok, false, "the negation is in another sentence");
  assert.equal(po1("Phone support is not included.").ok, false, "the negation comes after the channel");
});

test("non-waivable rules stay failures even with an owner waiver", () => {
  const c = { ...ctx, rules: { ...ctx.rules, forbiddenClaims: ["moon base"] } };
  const doc = md("# T\n\nWe run a moon base.", { waive_rules: "PO2, V2", waive_reason: "test", waive_approved_by: "Owner" });
  const po2 = checkDoc(c, doc, { overlap: false }).find((r) => r.id === "PO2");
  assert.equal(po2?.ok, false);
});

test("IN5 anchor match: empty anchors never match; wording or 60% word overlap does", () => {
  assert.equal(anchorMatches("", "how long does it take"), false);
  assert.equal(anchorMatches("how long does a move take", "how long does a move take"), true);
  assert.equal(anchorMatches("how long a site move takes", "how long does a site move take"), true);
  assert.equal(anchorMatches("pricing", "how long does a site move take"), false, "a short anchor inside the question no longer matches");
});

test("isIsoDate rejects impossible dates; normSlug keeps the home page", () => {
  assert.equal(isIsoDate("2026-02-28"), true);
  assert.equal(isIsoDate("2024-02-29"), true);
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("2026-13-01"), false);
  assert.equal(isIsoDate("2026-1-01"), false);
  assert.equal(isIsoDate(undefined), false);
  assert.deepEqual(["/a/", "/", "", "/a"].map(normSlug), ["/a", "/", "", "/a"]);
});

test("refresh-queue proposes a prune only for a page live for 180 days or more", () => {
  const rows = parseRegister(`## Plan 01: x\n\n${HEAD}| a | en-US | | | | \`/a\` | | published | 2027-01-01 | |\n| b | en-US | | | | \`/b\` | | published | 2027-01-01 | |\n`).rows;
  const { info } = buildQueue(rows, "2026-10-01", 30, [], new Map([["/a", "2026-01-01"], ["/b", "2026-09-01"]]));
  assert.deepEqual(info.map((i) => i.row.url), ["/a"]);
});

test("mergeConfig and mergeRules: settings and voice win over values typed in the config and the rules", () => {
  const settings = { brand: { name: "Brand", wordmark: "BRAND", domain: "brand.example", neverWrite: ["Brandy"] }, language: { locale: "en-GB" }, people: { approver: "Ann", legalReviewer: "Lee" } } as unknown as Settings;
  const voice = { readability: { sentenceMax: 22 }, bannedPhrases: ["synergy"], idioms: [], bannedCtaLabels: [], disclosureLine: "AI note", spelling: { avoid: { color: "colour" } }, wordSwaps: [], exclamationMarks: false } as unknown as Voice;
  const c = mergeConfig({ name: "Typed", locale: "en-US", limits: { sentenceMax: 30, titleSuffix: " | Typed" } }, settings, voice);
  assert.equal(c.name, "Brand");
  assert.equal(c.locale, "en-GB");
  assert.deepEqual(c.limits, { sentenceMax: 22, titleSuffix: " | Brand" });
  const r = mergeRules({ bannedPhrases: ["typed"], brandSuffixPattern: "keep", noBrand: { terms: ["Old"], patterns: [], allowFiles: [] } }, settings, voice);
  assert.deepEqual(r.bannedPhrases, ["synergy"]);
  assert.equal(r.brandSuffixPattern, "keep", "a typed suffix pattern is kept");
  assert.deepEqual(r.spellingAvoid, { color: "colour" });
  assert.deepEqual((r.noBrand as { terms: string[] }).terms, ["Old", "Brand", "BRAND", "brand.example", "Brandy", "Ann", "Lee"]);
  assert.deepEqual(mergeConfig({ name: "Typed" }, null, null), { name: "Typed", limits: {} });
});

test("check-content: a missing path fails, and folders are walked recursively", () => {
  const run = (...args: string[]) => spawnSync(process.execPath, ["--import", "tsx", join(TOOLS, "check-content.ts"), ...args], { encoding: "utf8" });
  const missing = run(join(tmp, "nope.md"));
  assert.equal(missing.status, 1);
  assert.match(missing.stdout, /FAIL CC0 .*nope\.md:1 no such file or folder\. Fix:/);
  const dir = join(tmp, "tree", "deep");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "a.md"), "---\nstate: Draft\n---\n# A\n");
  assert.match(run(join(tmp, "tree")).stdout, /deep\/a\.md/);
});

test("isMain: a tool run through a symlink still runs its main", () => {
  const link = join(tmp, "governor-link.ts");
  symlinkSync(join(TOOLS, "governor.ts"), link);
  assert.equal(isMain(new URL(`file://${join(TOOLS, "governor.ts")}`).href, link), true);
  assert.equal(isMain(new URL(`file://${join(TOOLS, "governor.ts")}`).href, join(TOOLS, "eval.ts")), false);
  const r = spawnSync(process.execPath, ["--import", "tsx", link, "--help"], { encoding: "utf8" });
  assert.match(r.stdout, /governor \[status\|check\]/);
});

test("BP0: a configured visibility command that fails or prints no JSON is an error, not a silent skip", () => {
  const withCmd = (command: string | null) => ({ ...ctx, config: { ...ctx.config, adapters: { ...ctx.config.adapters, pageVisibility: command ? { command } : null } } });
  assert.deepEqual(runVisibility(withCmd(null)), { vis: null });
  assert.match(runVisibility(withCmd('node -e "process.exit(2)"')).error ?? "", /exited 2/);
  assert.match(runVisibility(withCmd('node -e "console.log(1)"')).error ?? "", /did not print the visibility JSON/);
  assert.deepEqual(runVisibility(withCmd(`node -e "console.log(JSON.stringify({pages:{}}))"`)).vis, { pages: {} });
});

test("host commands run from adapters.cwd, by default the config folder's parent", () => {
  assert.equal(hostCwd(ctx), ctx.resolvePath(".."));
  assert.equal(hostCwd({ ...ctx, config: { ...ctx.config, adapters: { ...ctx.config.adapters, cwd: "." } } }), ctx.resolvePath("."));
});

test("eval: a readiness case without its draft path is reported, not a crash", async () => {
  const dir = join(tmp, "cases");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "bad.json"), JSON.stringify({ id: "bad", description: "d", type: "readiness", input: "x", expect: {}, ready: "eval/fixtures/pass-guide.md" }));
  writeFileSync(join(dir, "broken.json"), "{ not json");
  const res = await runCases(dir);
  assert.deepEqual(res.map((r) => [r.id, r.ok]), [["bad", false], ["broken", false]]);
  assert.match(res[0].problems[0], /needs "draft"/);
  assert.equal(process.env.CHECK_CONTENT_TODAY, "2026-10-09", "the eval date is frozen for TR5");
});

test("check-changed compares from the git top level, not the working folder", () => {
  assert.equal(gitRoot(TOOLS), gitRoot(join(TOOLS, "..")));
  assert.equal(gitRoot(tmp), tmp, "outside a repository it falls back to the folder");
});
