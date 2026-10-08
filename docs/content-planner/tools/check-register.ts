/**
 * Checks docs/content-planner/project/keyword-register.md: one owner per keyword and URL per locale, valid values.
 * Exits 1 on any error; warnings (likely overlaps) are printed but do not fail. Usage: npx tsx docs/content-planner/tools/check-register.ts [file]
 */
import { readFileSync } from "node:fs";

const FILE = process.argv[2] ?? "docs/content-planner/project/keyword-register.md";
const STATUSES = new Set(["unvalidated", "validated", "briefed", "drafting", "review", "published", "refresh", "dropped"]);
const LOCALES = new Set(["en-US", "en-GB", "en-AE", "en-IE", "ar-AE", "de-DE", "fr-FR", "nl-NL"]);
const COLUMNS = ["Keyword", "Locale", "Secondary", "Intent check", "Volume / KD", "Target URL", "Owner", "Status", "Next review", "AI cited"];
const AI_CITED = new Set(["", "yes", "no"]);

type Row = { line: number; plan: string; keyword: string; locale: string; secondary: string[]; url: string; status: string; review: string; aiCited: string };

const issues: { level: "error" | "warn"; line: number; message: string }[] = [];
const err = (line: number, message: string) => issues.push({ level: "error", line, message });
const warn = (line: number, message: string) => issues.push({ level: "warn", line, message });

const clean = (cell: string): string => cell.trim().replace(/^`|`$/g, "").trim();
const norm = (kw: string): string => kw.toLowerCase().replace(/\s+/g, " ").trim();
const isConcreteUrl = (url: string): boolean => url.startsWith("/") && !url.includes("[");

const lines = readFileSync(FILE, "utf8").split("\n");
const rows: Row[] = [];
let plan = "";
let inRegisterTable = false;

lines.forEach((text, i) => {
  const line = i + 1;
  const heading = text.match(/^## (Plan \d+[^\n]*)$/);
  if (heading) {
    plan = heading[1];
    inRegisterTable = false;
    return;
  }
  if (/^## /.test(text)) {
    plan = "";
    inRegisterTable = false;
    return;
  }
  if (!plan || !text.startsWith("|")) {
    if (!text.startsWith("|")) inRegisterTable = false;
    return;
  }
  const cells = text.split("|").slice(1, -1).map(clean);
  if (cells[0] === "Keyword") {
    inRegisterTable = true;
    if (cells.join("|") !== COLUMNS.join("|")) err(line, `columns must be: ${COLUMNS.join(" | ")}`);
    return;
  }
  if (!inRegisterTable || /^-+$/.test(cells[0].replace(/\s/g, ""))) return;
  if (cells.length !== COLUMNS.length) return err(line, `expected ${COLUMNS.length} columns, found ${cells.length}`);

  const [keyword, locale, secondary, , , url, , status, review, aiCited] = cells;
  if (!keyword) return err(line, "empty keyword");
  if (keyword !== keyword.toLowerCase()) err(line, `keyword must be lowercase: "${keyword}"`);
  if (!LOCALES.has(locale)) err(line, `unknown locale "${locale}"`);
  if (!STATUSES.has(status)) err(line, `unknown status "${status}"`);
  if (!AI_CITED.has(aiCited)) err(line, `AI cited must be yes, no or blank: "${aiCited}"`);
  if (url !== "planned" && !url.startsWith("/")) err(line, `Target URL must start with "/" or be "planned": "${url}"`);
  if (review && !/^\d{4}-\d{2}-\d{2}$/.test(review)) err(line, `Next review must be YYYY-MM-DD: "${review}"`);
  if (status === "published" && !review) err(line, "a published row needs a next review date");
  rows.push({ line, plan, keyword, locale, secondary: secondary ? secondary.split(";").map((s) => s.trim()).filter(Boolean) : [], url, status, review, aiCited });
});

if (rows.length === 0) err(1, "no register rows found");

const live = rows.filter((r) => r.status !== "dropped");

// 1. The same keyword and locale twice.
const byKeyword = new Map<string, Row>();
for (const r of live) {
  const key = `${r.locale}::${norm(r.keyword)}`;
  const other = byKeyword.get(key);
  if (other) err(r.line, `"${r.keyword}" (${r.locale}) is already a primary keyword on line ${other.line}`);
  else byKeyword.set(key, r);
}

// 2. A concrete URL owned by two rows in one locale.
const byUrl = new Map<string, Row>();
for (const r of live.filter((x) => isConcreteUrl(x.url))) {
  const key = `${r.locale}::${r.url}`;
  const other = byUrl.get(key);
  if (other) err(r.line, `${r.url} (${r.locale}) already targets "${other.keyword}" on line ${other.line}. Put the phrase in Secondary.`);
  else byUrl.set(key, r);
}

// 3. A secondary phrase that is also a primary keyword (or listed twice).
const secondaries = new Map<string, Row>();
for (const r of live) {
  for (const s of r.secondary) {
    const key = `${r.locale}::${norm(s)}`;
    const primary = byKeyword.get(key);
    if (primary) err(r.line, `secondary "${s}" is a primary keyword on line ${primary.line}`);
    const other = secondaries.get(key);
    if (other && other !== r) err(r.line, `secondary "${s}" is also a secondary on line ${other.line}`);
    secondaries.set(key, r);
  }
}

// 4. Overlap warning: a multi-word primary keyword is contained in another and they target different pages.
for (const a of live) {
  for (const b of live) {
    if (a === b || a.locale !== b.locale || a.url === b.url || norm(a.keyword).length >= norm(b.keyword).length || !norm(a.keyword).includes(" ")) continue;
    if (new RegExp(`(^| )${norm(a.keyword).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}( |$)`).test(norm(b.keyword))) {
      warn(b.line, `"${b.keyword}" contains "${a.keyword}" (line ${a.line}) but targets a different page. Check the intents differ.`);
    }
  }
}

for (const i of issues) console.log(`  ${i.level === "error" ? "error" : "warn "} line ${i.line}: ${i.message}`);
const errors = issues.filter((i) => i.level === "error").length;
const statusCounts = [...STATUSES].map((s) => `${s} ${rows.filter((r) => r.status === s).length}`).filter((t) => !t.endsWith(" 0"));
console.log(`${rows.length} register rows (${statusCounts.join(", ")}). ${errors ? `${errors} error(s).` : "Register check passed."}`);
process.exit(errors ? 1 : 0);
