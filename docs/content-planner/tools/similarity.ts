/**
 * similarity: finds copy that overlaps with other pages (OV1) or with the SERP notes in briefs (OV2).
 * Usage: npx tsx docs/content-planner/tools/similarity.ts <file> [--against dir-or-file ...]
 * Method: lower-case word shingles of limits.similarity.shingleWords words. containment = shared / doc shingles. FAIL above limits.similarity.threshold.
 * --against replaces the default own-page set (drafts, pages, posts); SERP notes in briefs are always checked.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fail, listDocs, loadCtx, loadText, lineOfText, parseArgs, words, type Ctx } from "./text";

export type Match = { rule: "OV1" | "OV2"; other: string; containment: number; jaccard: number; phrase: string };

const shingles = (w: string[], k: number): string[] => (w.length < k ? [] : w.slice(0, w.length - k + 1).map((_, i) => w.slice(i, i + k).join(" ")));

/** Longest run of consecutive shared shingles in doc order, as a phrase of words. */
function sharedPhrase(w: string[], k: number, shared: Set<string>): string {
  const sh = shingles(w, k);
  let best = { start: -1, len: 0 };
  for (let i = 0; i < sh.length; ) {
    if (!shared.has(sh[i])) { i++; continue; }
    let j = i;
    while (j < sh.length && shared.has(sh[j])) j++;
    if (j - i > best.len) best = { start: i, len: j - i };
    i = j;
  }
  return best.start < 0 ? "" : w.slice(best.start, best.start + best.len + k - 1).slice(0, 14).join(" ");
}

export function serpNotes(briefFile: string): string {
  const lines = readFileSync(briefFile, "utf8").split("\n");
  const start = lines.findIndex((l) => /^#{2,}\s.*SERP snapshot/i.test(l));
  if (start < 0) return "";
  const end = lines.findIndex((l, i) => i > start && /^## /.test(l));
  return lines.slice(start, end < 0 ? undefined : end).join("\n");
}

export function compare(file: string, ctx: Ctx, against: string[] = []): Match[] {
  const { shingleWords: k, threshold } = ctx.config.limits.similarity;
  const doc = loadText(file, ctx);
  const dw = words(doc.text);
  const ds = new Set(shingles(dw, k));
  const selfPath = resolve(file);
  const slug = (doc.front.slug ?? "").replace(/\/+$/, "");
  const sources: { rule: Match["rule"]; file: string; text: string }[] = [];
  const own = against.length
    ? against.flatMap((a) => listDocs(resolve(a)))
    : [ctx.config.paths.drafts, ctx.config.paths.pages, ctx.config.paths.posts].flatMap((p) => listDocs(p ? ctx.resolvePath(p) : null));
  for (const f of own) {
    if (resolve(f) === selfPath) continue;
    const o = loadText(f, ctx);
    if (slug && (o.front.slug ?? "").replace(/\/+$/, "") === slug) continue;
    sources.push({ rule: "OV1", file: f, text: o.text });
  }
  for (const f of listDocs(ctx.resolvePath(ctx.config.paths.briefs)).filter((x) => x.endsWith(".md"))) {
    const t = serpNotes(f);
    if (t) sources.push({ rule: "OV2", file: f, text: t });
  }
  const out: Match[] = [];
  for (const s of sources) {
    const ow = words(s.text);
    const os = new Set(shingles(ow, k));
    const shared = new Set([...ds].filter((x) => os.has(x)));
    if (ds.size === 0 || shared.size === 0) continue;
    const union = new Set([...ds, ...os]).size;
    out.push({ rule: s.rule, other: s.file, containment: shared.size / ds.size, jaccard: shared.size / union, phrase: sharedPhrase(dw, k, shared) });
  }
  void threshold;
  return out.sort((a, b) => b.containment - a.containment);
}

export function run(argv: string[], ctx: Ctx = loadCtx()): number {
  const { files, flags, help } = parseArgs(argv, ["--against"]);
  if (help || files.length !== 1) {
    console.log("similarity <file> [--against dir-or-file ...]\n  Compares a draft with other drafts, pages, posts (OV1) and the SERP snapshot notes in briefs (OV2).\n  FAIL when containment is above limits.similarity.threshold. Exit 1 on FAIL.");
    return help ? 0 : 1;
  }
  if (!existsSync(files[0])) { console.log(`file not found: ${files[0]}`); return 1; }
  const { threshold } = ctx.config.limits.similarity;
  const doc = loadText(files[0], ctx);
  const matches = compare(files[0], ctx, flags["--against"] ?? []);
  let bad = 0;
  for (const m of matches.slice(0, 5).concat(matches.slice(5).filter((x) => x.containment > threshold))) {
    const pct = `containment ${(m.containment * 100).toFixed(0)}%, jaccard ${(m.jaccard * 100).toFixed(0)}%`;
    if (m.containment > threshold) {
      bad++;
      console.log(fail(m.rule, files[0], lineOfText(doc.raw, m.phrase), `${pct} with ${m.other}, shared: "${m.phrase}"`, m.rule === "OV1" ? "rewrite the overlapping passages in your own words, or merge the pages" : "rewrite from first-hand knowledge, not from the SERP notes"));
    } else console.log(`  ok ${pct} with ${m.other}${m.phrase ? `, shared: "${m.phrase}"` : ""}`);
  }
  if (!matches.length) console.log("No overlap found.");
  if (bad === 0) console.log(`OK no match above ${threshold}`);
  return bad ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(run(process.argv.slice(2)));
