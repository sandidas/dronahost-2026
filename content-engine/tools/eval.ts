/**
 * The evaluation harness: runs every case in eval/cases/*.json and fails when a result differs from its written expectation.
 * Run it whenever a rule, a routing pattern or a prompt changes. A change that breaks an expectation needs the owner's approval.
 * Cases: `resolve` (title or keyword -> decision, plan, intent) and `readiness` (can the draft reach "Ready for owner review").
 * Paths in a case are relative to the planner folder. Usage: npx tsx content-engine/tools/eval.ts [--cases dir] [--help]
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cliError, isMain } from "./is-main";
import { z } from "zod";
import { CONFIG_FILE, PLANNER_DIR } from "./load-config";

const Case = z.object({
  id: z.string(), description: z.string(), type: z.enum(["resolve", "readiness"]), input: z.string(),
  expect: z.object({
    decision: z.enum(["accept", "confirm", "needs-row", "reject", "merge", "refused"]).optional(), plan: z.string().optional(), intent: z.string().optional(), keyword: z.string().optional(),
    readyAllowed: z.boolean().optional(), draftAllowed: z.boolean().optional(), failing: z.array(z.string()).optional(),
  }),
  ready: z.string().optional(), draft: z.string().optional(),
}).superRefine((c, ctx) => {
  // A readiness case checks two copies of one page; without both paths it would read a folder.
  if (c.type === "readiness") for (const k of ["ready", "draft"] as const) if (!c[k]?.trim()) ctx.addIssue({ code: "custom", path: [k], message: `a readiness case needs "${k}" (a path relative to the engine folder)` });
});
type CaseT = z.infer<typeof Case>;
export type EvalResult = { id: string; ok: boolean; problems: string[] };

const EVAL_FIXTURES = "eval/fixtures/eval";
export function setEvalFixtures(today?: string): void {
  // The cases are dated: freezing "today" keeps the review-age rule (TR5) from failing them as the calendar moves on.
  if (today) process.env.CHECK_CONTENT_TODAY = today;
  process.env.CHECK_CONTENT_REGISTER = join(PLANNER_DIR, EVAL_FIXTURES, "register.md");
  process.env.CHECK_CONTENT_FACTS = join(PLANNER_DIR, EVAL_FIXTURES, "facts");
  process.env.CHECK_CONTENT_BRIEFS = join(PLANNER_DIR, EVAL_FIXTURES, "briefs");
}

export async function runCases(casesDir: string, today = "2026-10-09"): Promise<EvalResult[]> {
  setEvalFixtures(today);
  const [{ loadContext, checkDoc, loadDoc }, { resolveInput }, { governorStatus }] = await Promise.all([import("./check-content"), import("./resolve"), import("./governor")]);
  const ctx = await loadContext();
  const gov = governorStatus({ config: ctx.config, registerFile: process.env.CHECK_CONTENT_REGISTER!, briefsDir: process.env.CHECK_CONTENT_BRIEFS!, today });
  const out: EvalResult[] = [];
  for (const f of readdirSync(casesDir).filter((n) => n.endsWith(".json")).sort()) {
    try { out.push(runCase(Case.parse(JSON.parse(readFileSync(join(casesDir, f), "utf8"))))); } catch (e) {
      const msg = e instanceof z.ZodError ? e.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ") : (e as Error).message.split("\n")[0];
      out.push({ id: f.replace(/\.json$/, ""), ok: false, problems: [`${join(casesDir, f)}:1 could not run the case: ${msg}`] });
    }
  }
  return out;

  function runCase(c: CaseT): EvalResult {
    const problems: string[] = [];
    const expect = (what: string, want: unknown, got: unknown) => { if (want !== undefined && JSON.stringify(want) !== JSON.stringify(got)) problems.push(`${what}: expected ${JSON.stringify(want)}, got ${JSON.stringify(got)}`); };
    if (c.type === "resolve") {
      const r = resolveInput(c.input, { config: ctx.config, rules: ctx.rules, register: ctx.register, governor: gov });
      expect("decision", c.expect.decision, r.decision);
      expect("plan", c.expect.plan, r.plan);
      expect("intent", c.expect.intent, r.intent);
      expect("keyword", c.expect.keyword, r.keyword);
    } else {
      const failing = (file: string): string[] => checkDoc(ctx, loadDoc(ctx, join(PLANNER_DIR, file)), { overlap: false }).filter((x) => !x.ok).map((x) => x.id);
      const ready = failing(c.ready ?? "");
      const draft = failing(c.draft ?? "");
      expect("readyAllowed", c.expect.readyAllowed, ready.length === 0);
      expect("draftAllowed", c.expect.draftAllowed, draft.length === 0);
      if (c.expect.failing) for (const id of c.expect.failing) if (!ready.includes(id)) problems.push(`expected rule ${id} to fail on the Ready copy; failing: ${ready.join(", ") || "none"}`);
    }
    return { id: c.id, ok: problems.length === 0, problems };
  }
}

const invoked = isMain(import.meta.url);
async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log("eval [--cases dir]: run the evaluation cases in eval/cases and fail when a result differs from its expectation.");
    return;
  }
  const i = process.argv.indexOf("--cases");
  const dir = i >= 0 ? process.argv[i + 1] : join(PLANNER_DIR, "eval/cases");
  const results = await runCases(dir);
  for (const r of results) {
    console.log(`  ${r.ok ? "PASS" : "FAIL"} ${r.id}`);
    for (const p of r.problems) console.log(`         ${p}. Fix: change the rule or routing back, or get the owner's approval to change the expectation in ${dir}.`);
  }
  const bad = results.filter((r) => !r.ok).length;
  console.log(bad ? `\n${bad} of ${results.length} evaluation case(s) differ from their expectation.` : `\nAll ${results.length} evaluation cases match.`);
  process.exitCode = bad ? 1 : 0;
}
if (invoked) main().catch((e) => cliError("eval", CONFIG_FILE, e));
