/**
 * The governor: protection against scaled content abuse (rules/governor.md). Counts pages in flight (register rows briefed,
 * drafting or review), new briefs this calendar month (briefs with a `created_on` date, or "Written YYYY-MM-DD"), and reads the
 * pause switch. `check` exits 1 when a new brief must not start.
 * Usage: npx tsx content-engine/tools/governor.ts [status|check] [--today YYYY-MM-DD] [--help]
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { cliError, isMain } from "./is-main";
import type { Config } from "../schemas/config";
import { isIsoDate } from "./dates";
import { parseFrontMatter } from "./front-matter";
import { CONFIG_FILE, loadConfig } from "./load-config";
import { IN_FLIGHT, readRegister } from "./register";

export type GovernorStatus = {
  inFlight: number; maxInFlight: number; monthCount: number; monthCap: number; paused: boolean;
  allowed: boolean; reasons: string[]; undated: string[];
};

/** The date a brief was started: front matter `created_on`, else the first "Written YYYY-MM-DD" in the text. */
export function briefDate(text: string): string | null {
  const { front } = parseFrontMatter(text);
  if (isIsoDate(front.created_on)) return front.created_on;
  const written = text.match(/Written\s+(\d{4}-\d{2}-\d{2})/)?.[1];
  return isIsoDate(written) ? written : null;
}

export function governorStatus(opts: { config: Config; registerFile: string; briefsDir: string; today: string }): GovernorStatus {
  const { config, registerFile, briefsDir, today } = opts;
  const inFlight = readRegister(registerFile).rows.filter((r) => IN_FLIGHT.has(r.status)).length;
  const month = today.slice(0, 7);
  let monthCount = 0;
  const undated: string[] = [];
  if (existsSync(briefsDir)) {
    for (const f of readdirSync(briefsDir).filter((n) => n.endsWith(".md")).sort()) {
      const text = readFileSync(join(briefsDir, f), "utf8");
      const d = briefDate(text);
      if (!d) { undated.push(f); continue; }
      if (d.startsWith(month)) monthCount++;
    }
  }
  const reasons: string[] = [];
  if (config.governor.paused) reasons.push("the pause switch is on (governor.paused)");
  if (inFlight >= config.governor.maxInFlight) reasons.push(`${inFlight} pages in flight; the cap is ${config.governor.maxInFlight}`);
  if (monthCount >= config.governor.monthlyNewPages) reasons.push(`${monthCount} new briefs this month; the cap is ${config.governor.monthlyNewPages}`);
  return { inFlight, maxInFlight: config.governor.maxInFlight, monthCount, monthCap: config.governor.monthlyNewPages, paused: config.governor.paused, allowed: reasons.length === 0, reasons, undated };
}

const invoked = isMain(import.meta.url);
if (invoked) {
  if (process.argv.includes("--help")) {
    console.log("governor [status|check] [--today YYYY-MM-DD]: in-flight count, new briefs this month, pause switch. `check` exits 1 when a new brief may not start. Caps are in content-engine.config.json (governor).");
    process.exit(0);
  }
  const args = process.argv.slice(2);
  const todayArg = args.indexOf("--today") >= 0 ? args[args.indexOf("--today") + 1] : undefined;
  const today = todayArg ?? new Date().toISOString().slice(0, 10);
  if (!isIsoDate(today)) { console.log(`  FAIL GV0 args:1 --today "${today}" is not a real date. Fix: use --today YYYY-MM-DD`); process.exit(1); }
  let s: GovernorStatus;
  try {
    const { config, resolvePath } = loadConfig();
    s = governorStatus({ config, registerFile: resolvePath(config.paths.register), briefsDir: resolvePath(config.paths.briefs), today });
  } catch (e) { cliError("governor", CONFIG_FILE, e); }
  console.log(`In flight (briefed, drafting or review): ${s.inFlight} of ${s.maxInFlight}`);
  console.log(`New briefs this month (${today.slice(0, 7)}): ${s.monthCount} of ${s.monthCap}`);
  console.log(`Pause switch: ${s.paused ? "ON" : "off"}`);
  for (const u of s.undated) console.log(`  note: ${u} has no created_on date, so it is not counted`);
  console.log(s.allowed ? "Result: a new brief may start." : `Result: a new brief may NOT start. ${s.reasons.join("; ")}.`);
  process.exit(args.includes("check") && !s.allowed ? 1 : 0);
}
