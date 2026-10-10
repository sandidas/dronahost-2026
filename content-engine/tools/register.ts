/** Parses the keyword register (Markdown tables) for every tool that needs it. One parser, one set of column names. */
import { lf } from "./eol";
import { existsSync, readFileSync } from "node:fs";

export const STATUSES = ["unvalidated", "validated", "briefed", "drafting", "review", "published", "refresh", "dropped"] as const;
export const IN_FLIGHT = new Set<string>(["briefed", "drafting", "review"]);
export const LOCALES = ["en-US", "en-GB", "en-AE", "en-IE", "ar-AE", "de-DE", "fr-FR", "nl-NL"] as const;
export const COLUMNS = ["Keyword", "Locale", "Secondary", "Intent check", "Volume / KD", "Target URL", "Owner", "Status", "Next review", "AI cited"];

export type Row = {
  line: number; plan: string; planNumber: string; keyword: string; locale: string; secondary: string[];
  intentCheck: string; url: string; owner: string; status: string; review: string; aiCited: string;
};
export type ParsedRegister = { rows: Row[]; excluded: { line: number; keywords: string[]; reason: string }[]; errors: { line: number; message: string }[]; headings: { line: number; text: string }[] };

const clean = (cell: string): string => cell.trim().replace(/^`|`$/g, "").trim();
export const norm = (kw: string): string => kw.toLowerCase().replace(/\s+/g, " ").trim();
export const isConcreteUrl = (url: string): boolean => url.startsWith("/") && !url.includes("[");

export function parseRegister(text: string): ParsedRegister {
  const out: ParsedRegister = { rows: [], excluded: [], errors: [], headings: [] };
  let plan = "";
  let inRegisterTable = false;
  let inExcluded = false;
  lf(text).split("\n").forEach((line, i) => {
    const n = i + 1;
    const planHeading = line.match(/^## (Plan (\d+)[^\n]*)$/);
    if (/^## /.test(line)) out.headings.push({ line: n, text: line.slice(3) });
    if (planHeading) { plan = planHeading[1]; inRegisterTable = false; inExcluded = false; return; }
    if (/^## /.test(line)) { plan = ""; inRegisterTable = false; inExcluded = /^## Excluded keywords/i.test(line); return; }
    if (!line.startsWith("|")) { inRegisterTable = false; return; }
    const cells = line.split("|").slice(1, -1).map(clean);
    if (inExcluded) {
      if (cells[0] === "Keyword" || /^-+$/.test((cells[0] ?? "").replace(/\s/g, ""))) return;
      out.excluded.push({ line: n, keywords: (cells[0] ?? "").split(",").map((k) => norm(k.replace(/`/g, ""))).filter(Boolean), reason: cells[1] ?? "" });
      return;
    }
    if (!plan) return;
    if (cells[0] === "Keyword") {
      inRegisterTable = true;
      if (cells.join("|") !== COLUMNS.join("|")) out.errors.push({ line: n, message: `columns must be: ${COLUMNS.join(" | ")}` });
      return;
    }
    if (!inRegisterTable || /^-+$/.test((cells[0] ?? "").replace(/\s/g, ""))) return;
    if (cells.length !== COLUMNS.length) { out.errors.push({ line: n, message: `expected ${COLUMNS.length} columns, found ${cells.length}` }); return; }
    const [keyword, locale, secondary, intentCheck, , url, owner, status, review, aiCited] = cells;
    out.rows.push({
      line: n, plan, planNumber: plan.match(/^Plan (\d+)/)?.[1].padStart(2, "0") ?? "", keyword, locale,
      secondary: secondary ? secondary.split(";").map((s) => s.trim()).filter(Boolean) : [], intentCheck, url, owner, status, review, aiCited,
    });
  });
  return out;
}

export function readRegister(file: string): ParsedRegister {
  if (!existsSync(file)) throw new Error(`register not found: ${file}`);
  return parseRegister(readFileSync(file, "utf8"));
}
