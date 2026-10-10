/** Proves check-content catches what it should. Run: npm run test:content */
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { before, test } from "node:test";
import { readFileSync } from "node:fs";
import { type Ctx, checkDoc, duplicateRules, hostPageSpecCheck, loadContext, loadDoc } from "./check-content";

const FIX = "content-engine/eval/fixtures";
process.env.CHECK_CONTENT_REGISTER = `${FIX}/register.md`;
process.env.CHECK_CONTENT_FACTS = `${FIX}/facts`;
process.env.CHECK_CONTENT_BRIEFS = `${FIX}/briefs`;

let ctx: Ctx;
/** The engine's tests use their own word lists and limits, so they pass in any project. */
function testContext(base: Ctx): Ctx {
  return {
    ...base,
    config: { ...base.config, name: "ExampleCo", limits: { ...base.config.limits, titleSuffix: " | ExampleCo" } },
    rules: {
      ...base.rules,
      bannedPhrases: ["world-class", ...base.rules.bannedPhrases], idioms: ["go the extra mile"], bannedCtaLabels: ["get started"],
      featureWords: [{ pattern: "zorbleflux", claim: "zorble" }], forbiddenChannels: ["carrier pigeon", "smoke signal"], forbiddenClaims: ["our moon base"],
      brandSuffixPattern: "(\\s[|]\\s*ExampleCo)", disclosureLine: "Drafted with AI assistance, then edited, fact-checked and approved by",
    },
  };
}
before(async () => { ctx = testContext(await loadContext()); });
const tmp = mkdtempSync(join(tmpdir(), "cc-"));
let n = 0;

const failedIds = (file: string, overlap = false): string[] => checkDoc(ctx, loadDoc(ctx, file), { overlap }).filter((r) => !r.ok).map((r) => r.id);
const result = (file: string, id: string) => checkDoc(ctx, loadDoc(ctx, file), { overlap: false }).find((r) => r.id === id);

/** A guide that passes everything, with `edit` applied to its text. */
function guide(edit: (t: string) => string = (t) => t, name = "pass-guide.md"): string {
  const text = edit(readFix(name));
  const file = join(tmp, `d${n++}.md`);
  writeFileSync(file, text);
  return file;
}
function readFix(name: string): string { return readFileSync(`${FIX}/${name}`, "utf8"); }

function page(edit: (p: Record<string, any>) => void): string { // eslint-disable-line @typescript-eslint/no-explicit-any -- test helper edits arbitrary JSON
  const p = JSON.parse(readFix("pass-page.json"));
  edit(p);
  const file = join(tmp, `p${n++}.json`);
  writeFileSync(file, JSON.stringify(p, null, 2));
  return file;
}

test("the three passing fixtures pass every rule", () => {
  assert.deepEqual(failedIds(`${FIX}/pass-guide.md`), []);
  assert.deepEqual(failedIds(`${FIX}/pass-draft-with-flags.md`), []);
  assert.deepEqual(failedIds(`${FIX}/pass-page.json`), []);
});

test("a Draft may carry open flags and placeholder authors", () => {
  assert.match(result(`${FIX}/pass-draft-with-flags.md`, "G1")?.note ?? "", /open flag/);
});

test("the three failing fixtures each fail one rule", () => {
  assert.deepEqual(failedIds(`${FIX}/fail-structure.md`), ["S2"]);
  assert.deepEqual(failedIds(`${FIX}/fail-facts.md`), ["F1"]);
  assert.deepEqual(failedIds(`${FIX}/fail-flags.md`), ["G1"]);
  assert.match(result(`${FIX}/fail-facts.md`, "F1")?.failures[0]?.message ?? "", /250 ms/);
  assert.ok((result(`${FIX}/fail-structure.md`, "S2")?.failures[0]?.line ?? 0) > 1, "reports the line");
});

test("Structure: FAQ count, answer limits and generic anchors", () => {
  assert.ok(failedIds(guide((t) => t.replace("[contact the team](/contact)", "[here](/contact)"))).includes("S5"));
  const noFaq = (t: string) => (t.includes("## FAQ") ? t.slice(0, t.indexOf("## FAQ")) : t);
  const faq = (items: number, words: number) => `\n## FAQ\n\n${Array.from({ length: items }, (_, i) => `### Question ${i}?\n\n${"word ".repeat(words)}\n`).join("\n")}`;
  assert.ok(failedIds(guide((t) => noFaq(t) + faq(7, 50))).includes("S4"), "7 items on a guide plan fail");
  const tooLong = result(guide((t) => noFaq(t) + faq(4, 90)), "S4");
  assert.equal(tooLong?.ok, false, "answers over 80 words fail");
  const short = result(guide((t) => noFaq(t) + faq(4, 30)), "S4");
  assert.equal(short?.ok, true, "answers under 40 words only warn");
  assert.ok((short?.warnings.length ?? 0) > 0);
});

test("Structure: a money page needs 6 to 8 FAQ items, a guide 4 to 6, and a page's own archetype wins", () => {
  const items = (n: number) => Array.from({ length: n }, (_, i) => ({ q: `Question ${i}?`, a: "word ".repeat(50) }));
  const withItems = (n: number, archetype?: string) => page((p) => { p.sections.find((s: { type: string }) => s.type === "FAQSection").content.items = items(n); if (archetype) p.archetype = archetype; });
  assert.equal(result(withItems(8), "S4")?.ok, true, "8 items on a money page");
  assert.equal(result(withItems(5), "S4")?.ok, false, "5 items on a money page");
  assert.equal(result(withItems(5, "decision"), "S4")?.ok, true, "the page's own archetype (a guide) allows 5");
  assert.equal(result(withItems(7, "product"), "S4")?.ok, true, "the app's 'product' archetype is a money page");
  assert.equal(result(withItems(7, "trust"), "S4")?.ok, false, "a brand page allows at most 6");
});

test("Keyword: the brand suffix the site adds counts as part of the title (a brand keyword needs no brand in the typed title)", () => {
  const file = guide((t) => t.replace("primary_keyword: how to check wordpress version", "primary_keyword: exampleco").replace("seo_title: How to Check Your WordPress Version", "seo_title: Find Your Software Number"));
  const k2 = result(file, "K2");
  assert.ok(!k2?.failures.some((f) => f.message.includes("not in the title")), "the title plus ' | ExampleCo' contains the keyword");
});

test("Keyword: the register must own the URL and the keyword", () => {
  assert.ok(failedIds(guide((t) => t.replace("slug: /kb/check-wordpress-version", "slug: /kb/other"))).includes("K1"));
  assert.ok(failedIds(guide((t) => t.replace("primary_keyword: how to check wordpress version", "primary_keyword: how to find wordpress version"))).includes("K1"));
  assert.ok(failedIds(guide((t) => t.replace("seo_title: How to Check Your WordPress Version", "seo_title: Find Your Software Number"))).includes("K2"));
});

test("Voice: banned phrase, exclamation, long sentence, banned CTA, HTML, idiom", () => {
  assert.ok(failedIds(guide((t) => t + "\nThis is a world-class host.\n")).includes("V1"));
  assert.ok(failedIds(guide((t) => t + "\nGreat news!\n")).includes("V2"));
  assert.ok(failedIds(guide((t) => t + `\n${"This sentence keeps going with more and more words ".repeat(4)}end.\n`)).includes("V3"));
  assert.ok(failedIds(guide((t) => t.replace("[contact the team]", "[Get started]"))).includes("V5"));
  assert.ok(failedIds(guide((t) => t + "\nUse the &nbsp; code.\n")).includes("V6"));
  assert.ok(failedIds(guide((t) => t + "\nWe go the extra mile.\n")).includes("V8"));
});

test("Voice: reading grade warns above 10, fails above 11, and an approved override downgrades the fail", () => {
  const dense = "\nInterdependent configuration characteristics necessitate comprehensive administrative reconsideration notwithstanding organizational infrastructure considerations. Consequently multidisciplinary implementation methodologies demonstrate substantially disproportionate environmental vulnerabilities.\n";
  assert.equal(result(guide((t) => t + dense.repeat(6)), "V7")?.ok, false);
  const overridden = result(guide((t) => t.replace("ai_assisted: yes", "ai_assisted: yes\ngrade_override_reason: legal terms\ngrade_override_approved_by: Sam Example") + dense.repeat(6)), "V7");
  assert.equal(overridden?.ok, true);
  assert.ok((overridden?.warnings.length ?? 0) > 0);
});

test("Facts: strict mode needs a project-file source; guide mode accepts a verified ledger fact", () => {
  const strictPage = page((p) => p.sections.find((s: { type: string }) => s.type === "AnswerBlock").content.answer += " It is 50% faster.");
  assert.ok(failedIds(strictPage).includes("F1"));
  assert.ok(failedIds(guide((t) => t + "\nThe check takes 250 ms.\n")).includes("F1"));
});

test("Facts: a feature word about the business needs a rendering claim", () => {
  assert.ok(failedIds(guide((t) => t + "\nOur ovens give zorbleflux heat.\n")).includes("F2"));
});

test("People: author, reviewer, dates and the AI disclosure line", () => {
  assert.ok(failedIds(guide((t) => t.replace("author: Sam Example\n", ""))).includes("P1"));
  assert.ok(failedIds(guide((t) => t.replace(/\*Drafted with AI assistance[^\n]*\n/, ""))).includes("P2"));
});

test("Experience: first-person claims need an interview reference; a non-draft needs a complete interview and an original element", () => {
  assert.ok(failedIds(guide((t) => t + "\nIn my experience this is rare.\n")).includes("E2"));
  assert.equal(guide((t) => t + "\nIn my experience this is rare (Q3).\n") !== "", true);
  assert.ok(!failedIds(guide((t) => t + "\nIn my experience this is rare (Q3).\n")).includes("E2"));
  const noBrief = guide((t) => t.replace("slug: /kb/check-wordpress-version", "slug: /kb/check-wordpress-version\nplan: x"), "pass-guide.md");
  assert.equal(result(noBrief, "E1")?.ok, true, "this fixture's brief is found by slug");
});

test("Draft downgrade: readiness rules warn in a Draft and fail otherwise", () => {
  const text = (state: string) => readFix("pass-guide.md").replace("state: Ready for owner review", `state: ${state}`).replace("slug: /kb/check-wordpress-version", "slug: /kb/no-such-brief");
  const asDraft = guide(() => text("Draft"));
  const asReady = guide(() => text("Ready for owner review"));
  assert.equal(result(asDraft, "E1")?.ok, true);
  assert.equal(result(asReady, "E1")?.ok, false);
});

test("Sources: guides need two verified URL sources with retrieval dates", () => {
  assert.ok(failedIds(guide((t) => t.replace("slug: /kb/check-wordpress-version", "slug: /kb/check-wordpress-version2"))).some((id) => id === "SO1" || id === "K1"));
});

test("Metadata: title length with the suffix, typed suffix, description, slug", () => {
  const suffix = ctx.config.limits.titleSuffix.length;
  const titleOf = (len: number) => "A".repeat(len - suffix);
  const warn = result(guide((t) => t.replace("seo_title: How to Check Your WordPress Version", `seo_title: how to check wordpress version ${titleOf(62).slice(0, 20)}`.slice(0, 20 + 100))), "M1");
  assert.ok(warn);
  const long = guide((t) => t.replace(/seo_title: .*/, `seo_title: how to check wordpress version ${"x".repeat(80 - suffix)}`));
  assert.equal(result(long, "M1")?.ok, false);
  const typed = guide((t) => t.replace(/seo_title: .*/, `seo_title: How to Check Your WordPress Version |${" "}${ctx.config.name}`));
  assert.equal(result(typed, "M1")?.ok, false);
  assert.equal(result(guide((t) => t.replace(/meta_description: .*/, "meta_description: How to Check Your WordPress Version")), "M2")?.ok, false);
});

test("Metadata: a title between 49 and 58 characters passes with a warning at the suffix limit", () => {
  const suffix = ctx.config.limits.titleSuffix.length;
  const f = guide((t) => t.replace(/seo_title: .*/, `seo_title: ${"how to check wordpress version ".padEnd(ctx.config.limits.titleWarnAbove - suffix + 2, "x")}`));
  const r = result(f, "M1");
  assert.equal(r?.ok, true);
  assert.ok((r?.warnings.length ?? 0) > 0);
});

test("Schema: FAQPage needs a visible FAQ; a rating needs linked reviews", () => {
  assert.ok(failedIds(guide((t) => t.slice(0, t.indexOf("## FAQ") >= 0 ? t.indexOf("## FAQ") : t.length).replace("state:", "schema: FAQPage\nstate:"))).includes("SC1"));
  assert.ok(failedIds(guide((t) => t.replace("state:", "schema: AggregateRating\nstate:"))).includes("SC1"));
});

test("Policy: unsupported channel, forbidden claim, ranking guarantee", () => {
  assert.ok(failedIds(guide((t) => t + `\nChat to us on ${ctx.rules.forbiddenChannels[0]} any time.\n`)).includes("PO1"));
  assert.ok(failedIds(guide((t) => t + "\nOur moon base is close to you.\n")).includes("PO2"));
  assert.ok(failedIds(guide((t) => t + "\nWe guarantee a top ranking.\n")).includes("PO3"));
  assert.ok(!failedIds(guide((t) => t + `\nWe do not offer ${ctx.rules.forbiddenChannels[0]} support.\n`)).includes("PO1"));
});

test("Overlap: two pages cannot share a title or a description", () => {
  const a = loadDoc(ctx, guide());
  const b = loadDoc(ctx, guide());
  const d = duplicateRules([a, b]);
  assert.equal(d.get(b.file)?.find((r) => r.id === "OV3")?.ok, false);
  assert.equal(d.get(b.file)?.find((r) => r.id === "OV4")?.ok, false);
  assert.equal(d.get(a.file)?.find((r) => r.id === "OV3")?.ok, true);
});

test("Flags: an open flag fails a page that is not a Draft", () => {
  assert.ok(failedIds(guide((t) => t + "\n[HUMAN REVIEW: add a source]\n")).includes("G1"));
});

test("a project with no forbidden channels, claims or feature words passes policy and fact rules (regression: an empty list once matched every line)", () => {
  const bare = { ...ctx, rules: { ...ctx.rules, forbiddenChannels: [], forbiddenClaims: [], featureWords: [], bannedPhrases: [], idioms: [] } };
  const failing = checkDoc(bare, loadDoc(bare, `${FIX}/pass-guide.md`), { overlap: false }).filter((r) => !r.ok).map((r) => r.id);
  assert.deepEqual(failing, []);
});

test("the host page-spec adapter passes when its command passes, fails when it fails, and only runs for page specs", () => {
  const withCommand = (command: string): Ctx => ({ ...ctx, config: { ...ctx.config, adapters: { ...ctx.config.adapters, pageSpec: { command, nonCopyKeys: [], labelKeys: [] } } } });
  const spec = loadDoc(ctx, `${FIX}/pass-page.json`);
  const article = loadDoc(ctx, `${FIX}/pass-guide.md`);
  assert.deepEqual(hostPageSpecCheck(withCommand('node -e "process.exit(0)"'), [spec]), { ran: true, ok: true });
  assert.deepEqual(hostPageSpecCheck(withCommand('node -e "process.exit(1)"'), [spec]), { ran: true, ok: false });
  assert.deepEqual(hostPageSpecCheck(withCommand('node -e "process.exit(1)"'), [article]), { ran: false, ok: true }, "an article is not a page spec");
  assert.deepEqual(hostPageSpecCheck({ ...ctx, config: { ...ctx.config, adapters: { ...ctx.config.adapters, pageSpec: null } } }, [spec]), { ran: false, ok: true });
});

test("Waiver: an owner waiver turns the named rule's failures into warnings only when a reason and an approver are given", () => {
  const noAi = (extra: string) => guide((t) => t.replace(/^.*Drafted with AI assistance.*$/m, "").replace("ai_assisted: yes", `ai_assisted: yes${extra}`));
  assert.equal(result(noAi(""), "P2")?.ok, false, "baseline: the disclosure line is missing in this fixture");
  const full = result(noAi("\nwaive_rules: P2\nwaive_reason: owner wants no AI line on this page\nwaive_approved_by: Sam Example"), "P2");
  assert.equal(full?.ok, true);
  assert.ok(full?.warnings.length, "the waived failure stays visible as a warning");
  assert.equal(result(noAi("\nwaive_rules: P2"), "P2")?.ok, false, "no reason and no approver: the waiver is ignored");
});

test("Overlap: a Markdown draft and the page spec for the same URL do not clash on title or description", () => {
  const a = loadDoc(ctx, guide((t) => t));
  const b = { ...a, file: a.file + ".json", kind: "json" as const };
  const dupes = duplicateRules([a, b]);
  assert.ok((dupes.get(b.file) ?? []).every((r) => r.ok));
});

test("Policy: where the business is based may be said only on the allowed pages (PO4)", () => {
  const rules = { ...ctx.rules, locationClaims: { patterns: ["\\bbased in springfield\\b"], allowedPages: ["/about-us"] } };
  const withRules = { ...ctx, rules };
  const text = (t: string) => t + "\nWe are a team based in Springfield.\n";
  const bad = checkDoc(withRules, loadDoc(withRules, guide(text)), { overlap: false }).find((r) => r.id === "PO4");
  assert.equal(bad?.ok, false);
  assert.match(bad?.failures[0].message ?? "", /says where we are based/);
  const allowed = checkDoc(withRules, loadDoc(withRules, guide((t) => text(t).replace("slug: /kb/check-wordpress-version", "slug: /about-us"))), { overlap: false }).find((r) => r.id === "PO4");
  assert.equal(allowed?.ok, true);
  const noRule = { ...ctx, rules: { ...ctx.rules, locationClaims: undefined } };
  const unset = checkDoc(noRule, loadDoc(noRule, guide(text)), { overlap: false }).find((r) => r.id === "PO4");
  assert.equal(unset?.skipped, true, "a project with no locationClaims skips the rule");
});
