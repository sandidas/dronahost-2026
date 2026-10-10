/**
 * Lists published pages due for review, and with a Search Console pages export, pages to prune or improve.
 * Usage: npx tsx content-engine/tools/refresh-queue.ts [--today YYYY-MM-DD] [--within 30] [--gsc pages.csv]
 */
import { cliError, isMain } from "./is-main";
import { CONFIG_FILE, loadConfig } from "./load-config";
import { readRegister, type Row } from "./register";
import { readMetrics, CsvShapeError, type Metric } from "./gsc-report";
import { isIsoDate } from "./dates";
import { listDocs, loadText } from "./text";

export type Finding = { id: string; fail: boolean; row: Row; message: string; fix: string };

const DAY = 86_400_000;
const isDate = (s: string): boolean => isIsoDate(s);
/** A page must be this old (published, else last reviewed) before "no impressions" can mean "prune". */
export const PRUNE_MIN_AGE_DAYS = 180;
const pathOf = (u: string): string => {
  let p = u.trim();
  try { p = new URL(p).pathname; } catch { /* already a path */ }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};

/** URL path -> the page's published date (published_on), else its review date (reviewed_on, rules.reviewedOn), from the content files. */
export function pageDates(files: string[], ctx: Parameters<typeof loadText>[1]): Map<string, string> {
  const out = new Map<string, string>();
  for (const f of files) {
    try {
      const d = loadText(f, ctx);
      const when = [d.front.published_on, d.front.reviewed_on].find((x) => isIsoDate(x));
      if (d.front.slug && when) out.set(pathOf(d.front.slug), when);
    } catch { /* an unreadable page has no date; check-content reports it */ }
  }
  return out;
}

export function buildQueue(rows: Row[], today: string, within: number, gsc: Metric[] | null, dates: Map<string, string> = new Map()): { due: Finding[]; info: Finding[] } {
  const limit = Date.parse(today) + within * DAY;
  const due: Finding[] = [];
  const info: Finding[] = [];
  const live = rows.filter((r) => r.status === "published" || r.status === "refresh");
  for (const row of live) {
    if (!row.review) {
      if (row.status === "published") due.push({ id: "RQ1", fail: true, row, message: `published row "${row.keyword}" has no Next review date`, fix: "add a YYYY-MM-DD date in the Next review column" });
      continue;
    }
    if (!isDate(row.review)) { due.push({ id: "RQ1", fail: true, row, message: `Next review "${row.review}" is not YYYY-MM-DD`, fix: "write the date as YYYY-MM-DD" }); continue; }
    const t = Date.parse(row.review);
    if (t < Date.parse(today)) due.push({ id: "RQ2", fail: true, row, message: `OVERDUE: "${row.keyword}" (${row.url}) was due ${row.review}`, fix: "review the page, then set a new Next review date" });
    else if (t <= limit) due.push({ id: "DUE", fail: false, row, message: `due ${row.review}: "${row.keyword}" (${row.url})`, fix: "" });
  }
  if (gsc) {
    const byPath = new Map<string, Metric>();
    for (const m of gsc) byPath.set(pathOf(m.name), m);
    for (const row of rows.filter((r) => r.status === "published" && r.url.startsWith("/"))) {
      const m = byPath.get(pathOf(row.url));
      const since = dates.get(pathOf(row.url));
      const old = !!since && Date.parse(today) - Date.parse(since) >= PRUNE_MIN_AGE_DAYS * DAY;
      if (!m || m.impressions === 0) { if (old) info.push({ id: "prune", fail: false, row, message: `${row.url}: prune review (improve, merge or remove after 6 months with no impressions; live since ${since})`, fix: "" }); }
      else if (m.impressions >= 100 && m.ctr < 0.01) info.push({ id: "performance", fail: false, row, message: `${row.url}: performance (CTR ${(m.ctr * 100).toFixed(1)}% on ${m.impressions} impressions)`, fix: "" });
    }
  }
  due.sort((a, b) => (a.row.review || "").localeCompare(b.row.review || ""));
  return { due, info };
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("refresh-queue [--today YYYY-MM-DD] [--within 30] [--gsc pages.csv]\nLists published/refresh rows due within N days (OVERDUE when past). Exit 1 on overdue rows (RQ2) or published rows with no date (RQ1).");
    process.exit(0);
  }
  const opt = (n: string): string | undefined => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const today = opt("--today") ?? new Date().toISOString().slice(0, 10);
  const within = Number(opt("--within") ?? 30);
  if (!isDate(today) || !Number.isFinite(within)) { console.log("  FAIL RQ0 args:1 bad --today or --within. Fix: use --today YYYY-MM-DD and --within <days>."); process.exit(1); }
  const { config, resolvePath } = loadConfig();
  const file = resolvePath(config.paths.register);
  const dates = pageDates([config.paths.pages, config.paths.drafts, config.paths.posts].flatMap((p) => listDocs(p ? resolvePath(p) : null)), { config, resolvePath });
  let gsc: Metric[] | null = null;
  try { const g = opt("--gsc"); gsc = g ? readMetrics(g, "page") : null; } catch (e) {
    if (!(e instanceof CsvShapeError)) throw e;
    console.log(`  FAIL GS1 ${opt("--gsc")}:1 ${e.message}. Fix: export the Pages report from Search Console as CSV.`); process.exit(1);
  }
  const { due, info } = buildQueue(readRegister(file).rows, today, within, gsc, dates);
  console.log(`Refresh queue for ${today} (next ${within} days)`);
  if (!due.length && !info.length) console.log("  nothing due");
  let fails = 0;
  for (const f of due) {
    if (f.fail) { fails++; console.log(`  FAIL ${f.id} ${file}:${f.row.line} ${f.message}. Fix: ${f.fix}`); }
    else console.log(`  ${f.message}`);
  }
  for (const f of info) console.log(`  ${f.message}`);
  console.log(fails ? `\n${fails} problem(s). Proposals are suggestions, not guarantees.` : "\nOK.");
  process.exit(fails ? 1 : 0);
}

if (isMain(import.meta.url)) { try { main(); } catch (e) { cliError("refresh-queue", CONFIG_FILE, e); } }
