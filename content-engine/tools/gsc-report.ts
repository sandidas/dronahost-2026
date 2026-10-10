/**
 * Reads Search Console CSV exports and prints a report with proposed changes (suggestions, not guarantees).
 * Usage: npx tsx content-engine/tools/gsc-report.ts <queries.csv> [--pages pages.csv] [--days 28] [--md]
 */
import { readFileSync } from "node:fs";
import { cliError, isMain } from "./is-main";

export type Metric = { name: string; clicks: number; impressions: number; ctr: number; position: number };
export class CsvShapeError extends Error {}

/** RFC-4180 parser: quoted fields, doubled quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^﻿/, "");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

const NAME_HEADERS: Record<"query" | "page", string[]> = { query: ["top queries", "query", "queries"], page: ["top pages", "page", "pages"] };
const num = (s: string): number => Number((s ?? "").replace(/[%,\s]/g, "")) || 0;

export function readMetrics(file: string, kind: "query" | "page"): Metric[] {
  let text: string;
  try { text = readFileSync(file, "utf8"); } catch { throw new CsvShapeError(`cannot read ${file}`); }
  const rows = parseCsv(text);
  if (rows.length === 0) throw new CsvShapeError(`${file} is empty`);
  const head = rows[0].map((h) => h.trim().toLowerCase());
  const find = (names: string[]): number => head.findIndex((h) => names.includes(h));
  const idx = { name: find(NAME_HEADERS[kind]), clicks: find(["clicks"]), impressions: find(["impressions"]), ctr: find(["ctr"]), position: find(["position"]) };
  const label: Record<keyof typeof idx, string> = { name: kind === "query" ? "Top queries (or Query)" : "Top pages (or Page)", clicks: "Clicks", impressions: "Impressions", ctr: "CTR", position: "Position" };
  const missing = (Object.keys(idx) as (keyof typeof idx)[]).filter((k) => idx[k] < 0).map((k) => label[k]);
  if (missing.length) throw new CsvShapeError(`${file} is missing column(s): ${missing.join(", ")}`);
  return rows.slice(1).map((r) => ({
    name: (r[idx.name] ?? "").trim(), clicks: num(r[idx.clicks]), impressions: num(r[idx.impressions]),
    ctr: num(r[idx.ctr]) / 100, position: num(r[idx.position]),
  })).filter((m) => m.name !== "");
}

/** Expected CTR by position (rough planning table, not a measured benchmark). */
export function expectedCtr(position: number): number {
  if (position < 1.5) return 0.25;
  if (position < 2.5) return 0.12;
  if (position < 3.5) return 0.08;
  if (position < 5.5) return 0.05;
  if (position < 10.5) return 0.02;
  return 0;
}

export type Proposal = { rule: string; name: string; action: string };

export function propose(items: Metric[], kind: "query" | "page"): Proposal[] {
  const out: Proposal[] = [];
  for (const m of items) {
    const p = m.position;
    if (m.impressions < 10) { out.push({ rule: "d", name: m.name, action: "too little data; wait" }); continue; }
    if (m.impressions >= 100 && p <= 10.5 && m.ctr < expectedCtr(p)) out.push({ rule: "a", name: m.name, action: `rewrite title and description to match the ${kind}` });
    if (p >= 10.5 && p < 20.5 && m.impressions >= 50) out.push({ rule: "b", name: m.name, action: `add a section that answers the ${kind} and 2 internal links` });
    if (p > 30 && m.impressions >= 20) out.push({ rule: "c", name: m.name, action: "check the search results: the intent may not match this page" });
  }
  return out;
}

export function totals(items: Metric[]) {
  const clicks = items.reduce((s, m) => s + m.clicks, 0);
  const impressions = items.reduce((s, m) => s + m.impressions, 0);
  const position = impressions ? items.reduce((s, m) => s + m.position * m.impressions, 0) / impressions : 0;
  return { clicks, impressions, ctr: impressions ? clicks / impressions : 0, position };
}

export function buckets(items: Metric[]): Record<string, number> {
  const b: Record<string, number> = { "1-3": 0, "4-10": 0, "11-20": 0, "21+": 0 };
  for (const m of items) {
    const p = Math.round(m.position);
    b[p <= 3 ? "1-3" : p <= 10 ? "4-10" : p <= 20 ? "11-20" : "21+"]++;
  }
  return b;
}

const pct = (x: number): string => `${(x * 100).toFixed(1)}%`;

export function buildReport(queries: Metric[], pages: Metric[] | null, days: number, md: boolean, today = new Date().toISOString().slice(0, 10)): string {
  const t = totals(queries);
  const out: string[] = [`Search Console report, last ${days} days`, "",
    `Totals: ${t.clicks} clicks, ${t.impressions} impressions, CTR ${pct(t.ctr)}, average position ${t.position.toFixed(1)}`, "", "Top 10 queries by impressions:"];
  [...queries].sort((a, b) => b.impressions - a.impressions).slice(0, 10)
    .forEach((m) => out.push(`  ${m.name}: ${m.impressions} impressions, ${m.clicks} clicks, CTR ${pct(m.ctr)}, position ${m.position.toFixed(1)}`));
  out.push("", "Queries by position:");
  Object.entries(buckets(queries)).forEach(([k, v]) => out.push(`  ${k}: ${v}`));
  const props = [...propose(queries, "query").map((p) => ({ ...p, kind: "query" })), ...(pages ? propose(pages, "page").map((p) => ({ ...p, kind: "page" })) : [])];
  out.push("", "Proposed changes (suggestions, not guarantees; no change is certain to improve rankings):");
  if (!props.length) out.push("  none");
  props.forEach((p) => out.push(`  [${p.rule}] ${p.kind} "${p.name}": ${p.action}`));
  if (md) {
    out.push("", "Learning-log rows (paste into project/learning-log.md; fill result and rule later):", "| date | page | change | result | rule |", "|---|---|---|---|---|");
    const acted = props.filter((p) => p.rule !== "d");
    (acted.length ? acted : [{ name: "", action: "", rule: "" }]).forEach((p) => out.push(`| ${today} | ${p.name} | ${p.action} |  | ${p.rule} |`));
  }
  return out.join("\n");
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.length === 0) {
    console.log("gsc-report <queries.csv> [--pages pages.csv] [--days 28] [--md]\nReads Search Console CSV exports and prints totals, top queries and proposed changes. Proposals are suggestions, not guarantees.");
    process.exit(args.length === 0 ? 1 : 0);
  }
  const opt = (name: string): string | undefined => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };
  const file = args.find((a, i) => !a.startsWith("--") && !["--pages", "--days"].includes(args[i - 1] ?? ""));
  try {
    if (!file) throw new CsvShapeError("no queries.csv given");
    const queries = readMetrics(file, "query");
    const pagesFile = opt("--pages");
    const pages = pagesFile ? readMetrics(pagesFile, "page") : null;
    console.log(buildReport(queries, pages, Number(opt("--days") ?? 28) || 28, args.includes("--md")));
  } catch (e) {
    if (!(e instanceof CsvShapeError)) throw e;
    console.log(`  FAIL GS1 ${file ?? "-"}:1 ${e.message}. Fix: export the Performance report from Search Console as CSV (columns: query or page, Clicks, Impressions, CTR, Position).`);
    process.exit(1);
  }
}

if (isMain(import.meta.url)) { try { main(); } catch (e) { cliError("gsc-report", process.argv[2] ?? "-", e); } }
