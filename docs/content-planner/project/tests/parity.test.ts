/**
 * Parity: every check the old page linter (lib/content/lint.ts, `npm run lint:content`) performs must also fail in check-content
 * on the same input. Temporary: delete this file together with lib/content/lint.ts and scripts/lint-content.ts once the owner
 * approves their removal (docs/content-planner/MIGRATION_PLAN.md, section 4.1).
 */
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { lintPage } from "../../../../lib/content/lint";
import { type Ctx, checkDoc, duplicateRules, loadContext, loadDoc } from "../../tools/check-content";

type Spec = { sections: { type: string; content: Record<string, unknown> }[]; seo: { title: string; description: string } } & Record<string, unknown>;
let ctx: Ctx;
const tmp = mkdtempSync(join(tmpdir(), "parity-"));
let n = 0;
before(async () => { ctx = await loadContext(); });

const home = (): Spec => JSON.parse(readFileSync("content/pages/home.json", "utf8")) as Spec;
const answerBlock = (s: Spec) => s.sections.find((x) => x.type === "AnswerBlock")!.content as { answer: string };

function both(mutate: (s: Spec) => void): { old: { level: string; message: string }[]; fresh: ReturnType<typeof checkDoc> } {
  const spec = home();
  mutate(spec);
  const file = join(tmp, `p${n++}.json`);
  writeFileSync(file, JSON.stringify(spec, null, 2));
  return { old: lintPage(spec as never), fresh: checkDoc(ctx, loadDoc(ctx, file), { overlap: false }) };
}
const oldErrors = (r: { old: { level: string; message: string }[] }, re: RegExp) => r.old.some((i) => i.level === "error" && re.test(i.message));
const newFails = (r: { fresh: ReturnType<typeof checkDoc> }, id: string) => r.fresh.some((x) => x.id === id && !x.ok);

const CASES: [string, string, RegExp, (s: Spec) => void][] = [
  ["L1", "V1", /banned phrase/, (s) => { answerBlock(s).answer += " This is world-class."; }],
  ["L2", "V2", /exclamation/, (s) => { answerBlock(s).answer += " Great news!"; }],
  ["L3", "PO1", /which is not offered/, (s) => { answerBlock(s).answer += ` Chat to us on ${ctx.rules.forbiddenChannels[0]}.`; }],
  ["L4", "PO1", /which is not offered/, (s) => { answerBlock(s).answer += ` Use our ${ctx.rules.forbiddenChannels[1]}.`; }],
  ["L5", "PO1", /which is not offered/, (s) => { answerBlock(s).answer += " Call us any time."; }],
  ["L6", "V6", /raw HTML/, (s) => { answerBlock(s).answer += " Use the &nbsp; code."; }],
  ["L7", "F1", /number in copy/, (s) => { answerBlock(s).answer += " It is 50% faster."; }],
  ["L9", "V3", /sentence of/, (s) => { answerBlock(s).answer += ` ${"This sentence keeps going with more and more words ".repeat(4)}end.`; }],
  ["L10", "V7", /reading grade/, (s) => { answerBlock(s).answer += " Interdependent configuration characteristics necessitate comprehensive administrative reconsideration notwithstanding organizational infrastructure considerations. Consequently multidisciplinary implementation methodologies demonstrate substantially disproportionate environmental vulnerabilities.".repeat(8); }],
  ["L12", "F3", /not in claims\.ts/, (s) => { answerBlock(s).answer += " claim:no-such-claim"; }],
];

test("the real home page passes both linters", () => {
  const r = both(() => undefined);
  assert.deepEqual(r.old.filter((i) => i.level === "error"), []);
  assert.deepEqual(r.fresh.filter((x) => !x.ok).map((x) => x.id), []);
});

for (const [oldId, newId, re, mutate] of CASES) {
  test(`${oldId}: the old linter and check-content ${newId} both fail`, () => {
    const r = both(mutate);
    assert.ok(oldErrors(r, re), `lint:content should fail ${oldId}`);
    assert.ok(newFails(r, newId), `check-content ${newId} should fail`);
  });
}

test("L8: a banned CTA label fails in both", () => {
  const r = both((s) => {
    const walk = (v: unknown): boolean => {
      if (Array.isArray(v)) return v.some(walk);
      if (v && typeof v === "object") {
        const o = v as Record<string, unknown>;
        if (typeof o.label === "string") { o.label = "Get started"; return true; }
        return Object.values(o).some(walk);
      }
      return false;
    };
    walk(s.sections);
  });
  assert.ok(oldErrors(r, /banned CTA/));
  assert.ok(newFails(r, "V5"));
});

test("L11: fewer than 3 internal links fails in both", () => {
  const r = both((s) => {
    const walk = (v: unknown): void => {
      if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") for (const [k, x] of Object.entries(v as Record<string, unknown>)) { if (k === "href" && typeof x === "string" && x.startsWith("/")) (v as Record<string, unknown>)[k] = "https://example.com"; else if (k === "links" && Array.isArray(x)) (v as Record<string, unknown>)[k] = []; else walk(x); }
    };
    walk(s.sections);
  });
  assert.ok(oldErrors(r, /internal links/));
  assert.ok(newFails(r, "S5"));
});

test("L13: a short FAQ answer warns in both and fails in neither", () => {
  const r = both((s) => { (s.sections.find((x) => x.type === "FAQSection")!.content as { items: { a: string }[] }).items[0].a = "Short answer."; });
  assert.ok(r.old.some((i) => i.level === "warn" && /FAQ answer/.test(i.message)));
  const s4 = r.fresh.find((x) => x.id === "S4")!;
  assert.equal(s4.ok, true);
  assert.ok(s4.warnings.length > 0);
});

test("L14 and L15: duplicate title and description across pages fail", () => {
  const files = [0, 1].map((i) => { const f = join(tmp, `dup${i}.json`); writeFileSync(f, JSON.stringify(home())); return loadDoc(ctx, f); });
  const d = duplicateRules(files).get(files[1].file)!;
  assert.equal(d.find((r) => r.id === "OV3")?.ok, false);
  assert.equal(d.find((r) => r.id === "OV4")?.ok, false);
});

test("L16: claims referenced but not rendering are reported, not failed", () => {
  const f4 = checkDoc(ctx, loadDoc(ctx, "content/pages/home.json"), { overlap: false }).find((r) => r.id === "F4")!;
  assert.equal(f4.ok, true);
  assert.ok(f4.note);
});
