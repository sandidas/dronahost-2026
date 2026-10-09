/** Proves each Intent (IN1 to IN4) and Trust (TR1 to TR5) check passes a good page and fails a bad fixture. Run: npm run test:content */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { before, test } from "node:test";
import { ProfilesSchema } from "../schemas/profiles";
import { owedFor } from "./owed";
import { type Ctx, checkDoc, loadContext, loadDoc } from "./check-content";

const FIX = "docs/content-planner/eval/fixtures/profiles";
let ctx: Ctx;
before(async () => {
  process.env.CHECK_CONTENT_TODAY = "2026-10-09";
  const base = await loadContext();
  ctx = { ...base, profiles: ProfilesSchema.parse(JSON.parse(readFileSync(`${FIX}/profiles.json`, "utf8"))), briefsDir: `${FIX}/briefs` };
});

const run = (name: string, over: Partial<Ctx> = {}) => checkDoc({ ...ctx, ...over }, loadDoc(ctx, `${FIX}/${name}`), { overlap: false });
const rule = (name: string, id: string, over: Partial<Ctx> = {}) => {
  const r = run(name, over).find((x) => x.id === id);
  assert.ok(r, `${id} missing for ${name}`);
  return r;
};
const failing = (name: string) => run(name).filter((r) => (r.group === "Intent" || r.group === "Trust") && !r.ok).map((r) => r.id);

test("a good Buy page passes every Intent and Trust check", () => {
  assert.deepEqual(failing("pass-buy.json"), []);
  assert.match(rule("pass-buy.json", "IN1").note ?? "", /Buy/);
});

test("a good Learn article passes the Intent checks", () => {
  const bad = run("learn-pass.md").filter((r) => r.group === "Intent" && !r.ok);
  assert.deepEqual(bad.map((r) => r.id), []);
});

test("IN1: a page with no intent fails", () => {
  const r = rule("fail-in1-no-intent.json", "IN1");
  assert.equal(r.ok, false);
  assert.match(r.failures[0].message, /no search intent/);
  assert.equal(rule("fail-in1-no-intent.json", "IN2").skipped, true, "the other Intent checks wait for an intent");
});

test("IN1: a brief that disagrees, or an unconfirmed missing SERP, fails", () => {
  const r = rule("fail-in1-brief.json", "IN1");
  assert.equal(r.ok, false);
  const text = r.failures.map((f) => f.message).join("\n");
  assert.match(text, /page says Buy but the brief says Learn/);
  assert.match(text, /no owner confirmed the intent/);
});

test("IN2: a Buy page without a price, a risk reducer, who it is for or an action fails", () => {
  const r = rule("fail-buy.json", "IN2");
  assert.equal(r.ok, false);
  const text = r.failures.map((f) => f.message).join("\n");
  for (const need of ["price", "risk reducer", "who it is for", "primary action"]) assert.match(text, new RegExp(need));
});

test("IN2: the secondary intent's gaps are warnings, not failures", () => {
  const r = rule("warn-secondary.json", "IN2");
  assert.equal(r.ok, true);
  assert.ok(r.warnings.some((w) => /secondary Buy intent/.test(w.message)));
});

test("IN3: a Learn page that leads with a sales link and no answer fails the first screen", () => {
  const r = rule("fail-learn-sales.md", "IN3");
  assert.equal(r.ok, false);
  assert.match(r.failures.map((f) => f.message).join("\n"), /sales push|first screen/);
});

test("IN4: a Learn page whose call to action pushes a purchase fails", () => {
  const r = rule("fail-learn-sales.md", "IN4");
  assert.equal(r.ok, false);
  assert.match(r.failures[0].message, /Buy now/);
});

test("TR1 and TR2: a money page with no way to reach us and no policies fails", () => {
  assert.equal(rule("fail-buy.json", "TR1").ok, false);
  const r = rule("fail-buy.json", "TR2");
  assert.equal(r.ok, false);
  assert.match(r.failures[0].message, /links 0 of the policies/);
});

test("TR3: authority wording without a source fails; a source in the same section passes", () => {
  const r = rule("fail-buy.json", "TR3");
  assert.equal(r.ok, false);
  assert.ok(r.failures.length >= 2, "the best / trusted by / fastest");
  assert.equal(rule("pass-buy.json", "TR3").ok, true);
});

test("TR4: a money page that never states a limit fails", () => {
  assert.equal(rule("fail-buy.json", "TR4").ok, false);
  assert.equal(rule("pass-buy.json", "TR4").ok, true);
});

test("TR5: a page reviewed long ago fails", () => {
  const r = rule("fail-buy.json", "TR5");
  assert.equal(r.ok, false);
  assert.match(r.failures[0].message, /days ago/);
});

test("warn first: a rule set to warn shows its failures as warnings and still passes", () => {
  const profiles = { ...ctx.profiles!, severity: { IN2: "warn", TR1: "warn" } as const };
  const r = rule("fail-buy.json", "IN2", { profiles });
  assert.equal(r.ok, true);
  assert.ok(r.warnings.length > 0);
  assert.match(r.note ?? "", /warn first/);
  assert.equal(rule("fail-buy.json", "TR2", { profiles }).ok, false, "a rule not listed still fails");
});

test("a Draft article only warns on the readiness rules IN2, IN3, TR2 and TR4", () => {
  const r = rule("draft-learn-sales.md", "IN3");
  assert.equal(r.ok, true, "state is Draft");
  assert.ok(r.warnings.length > 0);
});

test("without profile data both groups are skipped, never passed silently", () => {
  const r = rule("pass-buy.json", "IN2", { profiles: null });
  assert.equal(r.skipped, true);
  assert.equal(rule("pass-buy.json", "TR1", { profiles: null }).skipped, true);
});

test("owed: hidden sections are grouped by what only a person can supply", () => {
  const list = owedFor(
    [
      { id: "plans", type: "PricingPlans", visible: false, missing: ["FEATURES.pricesConfirmed"] },
      { id: "case", type: "Evidence", visible: false, missing: [] },
      { id: "hero", type: "ProductHero", visible: true, missing: ["claim:x"] },
      { id: "odd", type: "Other", visible: false, missing: ["claim:unmapped"] },
    ],
    ctx.profiles!.owed,
  );
  assert.deepEqual(list.map((o) => o.hides[0]), ["plans", "case", "odd"], "a visible section owes nothing");
  assert.match(list[0].label, /prices/i);
  assert.match(list[1].label, /case study/i);
  assert.match(list[2].label, /claim:unmapped/, "an unmapped fact is still reported, never dropped");
});
