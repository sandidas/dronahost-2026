/** Proves each Blueprint check passes a good page and fails a bad fixture. Run: npm run test:content */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { before, test } from "node:test";
import { BlueprintsSchema, VisibilitySchema } from "../schemas/blueprints";
import { type Ctx, checkDoc, loadContext, loadDoc, runChecks } from "./check-content";
import { pageStatus, signatureRules, valuesAt } from "./content/rules-blueprint";

const FIX = "docs/content-planner/eval/fixtures/blueprints";
const read = (f: string): unknown => JSON.parse(readFileSync(`${FIX}/${f}`, "utf8"));
let ctx: Ctx;
before(async () => {
  const base = await loadContext();
  ctx = {
    ...base,
    blueprints: BlueprintsSchema.parse(read("blueprints.json")),
    visibility: VisibilitySchema.parse(read("visibility.json")),
    copySource: read("copy-source-pass.json") as Ctx["copySource"],
  };
});

const run = (name: string, over: Partial<Ctx> = {}) => checkDoc({ ...ctx, ...over }, loadDoc(ctx, `${FIX}/${name}.json`), { overlap: false });
const rule = (name: string, id: string, over: Partial<Ctx> = {}) => {
  const r = run(name, over).find((x) => x.id === id);
  assert.ok(r, `${id} missing for ${name}`);
  return r;
};

test("a good page passes every Blueprint check", () => {
  const bad = run("pass-page").filter((r) => r.group === "Blueprint" && !r.ok && !r.skipped);
  assert.deepEqual(bad.map((r) => r.id), []);
  assert.equal(rule("pass-page", "BP3").note, "Status: Ready");
});

test("BP1: a page must name a blueprint that exists", () => {
  assert.equal(rule("fail-bp1-no-blueprint", "BP1").ok, false);
  assert.match(rule("fail-bp1-no-blueprint", "BP1").failures[0].message, /no "blueprint" field/);
  assert.equal(rule("fail-bp1-unknown-blueprint", "BP1").ok, false);
  assert.equal(rule("fail-bp1-no-blueprint", "BP2").skipped, true, "the other checks wait for a blueprint");
});

test("BP2: visible sections must be inside the range (too few fails, too many fails, below the range warns)", () => {
  assert.equal(rule("fail-bp2-too-few", "BP2").ok, false);
  assert.equal(rule("fail-bp2-too-many", "BP2").ok, false);
  const warn = rule("warn-bp2-below-range", "BP2");
  assert.equal(warn.ok, true);
  assert.equal(warn.warnings.length, 1);
});

test("BP3: a hidden required section makes the page Blocked and names the missing fact", () => {
  const r = rule("fail-bp3-required-hidden", "BP3");
  assert.equal(r.ok, false);
  assert.match(r.failures[0].message, /Blocked: PathRouter is hidden \(needs claim:beta\)/);
  assert.equal(r.note, "Status: Blocked");
});

test("BP4: a required section out of order fails; an optional one warns", () => {
  assert.equal(rule("fail-bp4-order", "BP4").ok, false);
  assert.equal(rule("pass-page", "BP4").ok, true);
});

test("BP5: a field over its limit fails, naming the section and the limit", () => {
  const r = rule("fail-bp5-limit", "BP5");
  assert.equal(r.ok, false);
  assert.ok(r.failures.some((f) => /H1 has \d+ chars, the limit is 40/.test(f.message)));
  assert.ok(r.failures.some((f) => /card line has \d+ words, the limit is 10/.test(f.message)));
});

test("BP6: a section type repeated beyond its allowance fails", () => {
  assert.equal(rule("fail-bp6-duplicate", "BP6").ok, false);
  assert.equal(rule("pass-page", "BP6").ok, true);
});

test("BP7: two primary labels, a second secondary action and a price in a label all fail", () => {
  const price = rule("fail-bp7-cta-label", "BP7");
  assert.equal(price.ok, false);
  assert.ok(price.failures.some((f) => /price inside the button label/.test(f.message)));
  assert.ok(price.failures.some((f) => /more than one primary/.test(f.message)));
  assert.equal(rule("fail-bp7-two-secondary", "BP7").ok, false);
  assert.equal(rule("pass-page", "BP7").ok, true);
});

test("BP8: two pages with the same hero variant and first four section types fail", () => {
  const docs = ["pass-page", "pass-page-twin"].map((n) => loadDoc(ctx, `${FIX}/${n}.json`));
  const out = signatureRules(docs, ctx.blueprints ?? null);
  for (const d of docs) assert.equal(out.get(d.file)?.[0].ok, false);
  const alone = signatureRules([docs[0]], ctx.blueprints ?? null);
  assert.equal(alone.get(docs[0].file)?.[0].ok, true);
});

test("BP9: page copy found in a component fails; no adapter result skips", () => {
  const fail = rule("pass-page", "BP9", { copySource: read("copy-source-fail.json") as Ctx["copySource"] });
  assert.equal(fail.ok, false);
  assert.match(fail.failures[0].message, /is in a component/);
  assert.equal(rule("pass-page", "BP9", { copySource: null }).skipped, true);
});

test("BP10: a visible section whose gate is closed fails", () => {
  assert.equal(rule("fail-bp10-gate-open", "BP10").ok, false);
  assert.equal(rule("pass-page", "BP10").ok, true);
});

test("BP11: visible words outside the range warn, never fail", () => {
  for (const name of ["warn-bp11-thin", "warn-bp11-long"]) {
    const r = rule(name, "BP11");
    assert.equal(r.ok, true);
    assert.equal(r.warnings.length, 1);
  }
});

test("without visibility, the checks that need it are skipped, not passed", () => {
  for (const id of ["BP2", "BP3", "BP4", "BP10", "BP11"]) assert.equal(rule("pass-page", id, { visibility: null }).skipped, true, id);
});

test("articles (Markdown) are not page specs: the Blueprint group is skipped", () => {
  const md = checkDoc(ctx, loadDoc(ctx, "docs/content-planner/eval/fixtures/pass-guide.md"), { overlap: false }).filter((r) => r.group === "Blueprint");
  assert.ok(md.length > 0 && md.every((r) => r.skipped));
});

test("helpers: valuesAt walks arrays; pageStatus lists what is missing", () => {
  assert.deepEqual(valuesAt({ a: [{ b: 1 }, { b: 2 }] }, "a[*].b"), [1, 2]);
  const bps = BlueprintsSchema.parse(read("blueprints.json"));
  const sections = [{ id: "r", type: "PathRouter", visible: false, reason: "gated" as const, missing: ["claim:x"], gatesOk: true, words: 0 }];
  const st = pageStatus(bps.blueprints.B1, bps.heroTypes, sections);
  assert.equal(st.status, "Blocked");
  assert.ok(st.why.some((w) => /Hero is missing from the page spec/.test(w)));
});

test("runChecks still runs the host page-spec adapter and the Blueprint group together", () => {
  const lines: string[] = [];
  const orig = console.log;
  console.log = (...a: unknown[]) => { lines.push(a.join(" ")); };
  let failed: number;
  try {
    const withAdapter = { ...ctx, config: { ...ctx.config, adapters: { ...ctx.config.adapters, pageSpec: { ...(ctx.config.adapters.pageSpec ?? { nonCopyKeys: [], labelKeys: [] }), command: 'node -e "process.exit(0)"' } } } };
    failed = runChecks(withAdapter, [`${FIX}/pass-page.json`]);
  } finally { console.log = orig; }
  const text = lines.join("\n");
  assert.match(text, /PASS SC2 Page specs satisfy the host's own schema/);
  assert.match(text, /PASS BP1 /);
  void failed;
});

test("BP5: a list limited to an allowed set fails on an unknown value and on a missing required value", () => {
  const r = rule("fail-bp5-fields", "BP5");
  assert.equal(r.ok, false);
  assert.ok(r.failures.some((f) => /has "z", allowed: a, b, c, d/.test(f.message)));
  assert.ok(r.failures.some((f) => /must include "b"/.test(f.message)));
  assert.equal(rule("pass-fields", "BP5").ok, true);
});

test("BP12: two visible neighbours with the same tone fail; alternating tones pass; no tones skips", () => {
  const bad = rule("fail-bp12-same-tone", "BP12");
  assert.equal(bad.ok, false);
  assert.match(bad.failures[0].message, /neighbours with the same tone \("tint"\)/);
  assert.equal(rule("pass-tones", "BP12").ok, true);
  assert.equal(rule("pass-page", "BP12").skipped, true, "a host that reports no tones skips the check");
});

test("A page spec's `waivers` block turns the named rule's failures into warnings that name the approver", () => {
  const r = rule("waived-bp5-limit", "BP5");
  assert.equal(r.ok, true);
  assert.ok(r.warnings.length > 0, "the failure stays visible as a warning");
  assert.match(r.note ?? "", /waived by Sam Example/);
  assert.equal(rule("fail-bp5-limit", "BP5").ok, false, "the same page without the block still fails");
});
