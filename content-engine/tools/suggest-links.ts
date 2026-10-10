/**
 * suggest-links: proposes internal links for a draft from the register and the page inventory.
 * Usage: npx tsx content-engine/tools/suggest-links.ts <file> [--min N]
 * Rule SL1: fewer than N suggestions with a score above zero fails (N defaults to limits.linksSuggested). Never suggests an excluded keyword's page.
 */
import { cliError, isMain } from "./is-main";
import { CONFIG_FILE } from "./load-config";
import { extname } from "node:path";
import { readRegister, norm, isConcreteUrl } from "./register";
import { fail, listDocs, loadCtx, loadText, parseArgs, words, type Ctx, type TextDoc } from "./text";

export type Suggestion = { anchor: string; target: string; reason: string; live: boolean; linked: boolean; score: number };
type Cand = { url: string; keyword: string; phrases: string[]; plan: string; live: boolean };

const STOP = new Set("the a an and or of to for in on with your you how what is are do does can my our from by at as it be this that".split(" "));
const GENERIC = /^(click here|here|read more|learn more|this page|link|more)$/i;
const slugOf = (s: string): string => s.replace(/\/+$/, "") || "/";
const sig = (phrase: string): string[] => [...new Set(words(phrase).filter((w) => w.length > 2 && !STOP.has(w)))];
const splitList = (v: string | undefined): string[] => (v ?? "").split(";").map((s) => s.trim()).filter(Boolean);

export function inventory(ctx: Ctx): Map<string, { keyword: string; phrases: string[]; locale: string }> {
  const out = new Map<string, { keyword: string; phrases: string[]; locale: string }>();
  for (const f of listDocs(ctx.resolvePath(ctx.config.paths.pages)).filter((x) => extname(x) === ".json")) {
    const d = loadText(f, ctx);
    const spec = JSON.parse(d.raw.join("\n")) as { path?: string; primaryKeyword?: string; secondaryKeywords?: string[] };
    if (spec.path) out.set(slugOf(spec.path), { keyword: spec.primaryKeyword ?? "", phrases: spec.secondaryKeywords ?? [], locale: ctx.config.locale });
  }
  for (const f of listDocs(ctx.resolvePath(ctx.config.paths.drafts)).filter((x) => extname(x) !== ".json")) {
    const d = loadText(f, ctx);
    if (d.front.slug) out.set(slugOf(d.front.slug), { keyword: d.front.primary_keyword ?? "", phrases: splitList(d.front.secondary_keywords), locale: d.front.locale || ctx.config.locale });
  }
  return out;
}

export function suggest(doc: TextDoc, ctx: Ctx): Suggestion[] {
  const reg = readRegister(ctx.resolvePath(ctx.config.paths.register));
  const excluded = new Set(reg.excluded.flatMap((e) => e.keywords));
  const inv = inventory(ctx);
  const locale = doc.front.locale || ctx.config.locale;
  const self = slugOf(doc.front.slug ?? "");
  const docPlan = doc.front.plan?.match(/^(\d+)/)?.[1].padStart(2, "0") ?? "";
  const cands = new Map<string, Cand>();
  for (const r of reg.rows) {
    if (r.status === "dropped" || r.locale !== locale || !isConcreteUrl(r.url)) continue;
    cands.set(slugOf(r.url), { url: slugOf(r.url), keyword: r.keyword, phrases: r.secondary, plan: r.planNumber, live: inv.has(slugOf(r.url)) });
  }
  for (const [url, v] of inv) {
    if (cands.has(url) || v.locale !== locale) continue;
    cands.set(url, { url, keyword: v.keyword || url.split("/").pop()!.replace(/-/g, " "), phrases: v.phrases, plan: "", live: true });
  }
  const docWords = new Set(words(doc.text));
  const lowText = doc.text.toLowerCase();
  const linked = new Set(doc.links.map((l) => slugOf(l.href.split("#")[0])));
  const out: Suggestion[] = [];
  for (const c of cands.values()) {
    if (c.url === self || norm(c.keyword) === norm(doc.front.primary_keyword ?? "\0")) continue;
    if (excluded.has(norm(c.keyword)) || c.phrases.some((p) => excluded.has(norm(p)))) continue;
    const shared = [...new Set([c.keyword, ...c.phrases].flatMap(sig))].filter((w) => docWords.has(w));
    const samePlan = !!docPlan && c.plan === docPlan;
    const supported = !!doc.front.supports && slugOf(doc.front.supports) === c.url;
    const score = shared.length + (samePlan ? 1 : 0) + (supported ? 3 : 0);
    if (score <= 0) continue;
    const phrase = [c.keyword, ...c.phrases].find((p) => p && lowText.includes(p.toLowerCase()));
    const anchor = phrase ?? c.keyword;
    const reasons = [shared.length ? `shares terms: ${shared.slice(0, 5).join(", ")}` : "", samePlan ? "same plan" : "", supported ? "supported page" : ""].filter(Boolean);
    out.push({ anchor: GENERIC.test(anchor) ? c.keyword : anchor, target: c.url, reason: reasons.join("; "), live: c.live, linked: linked.has(c.url), score });
  }
  return out.sort((a, b) => b.score - a.score || a.target.localeCompare(b.target));
}

export function run(argv: string[], ctx: Ctx = loadCtx()): number {
  const { files, flags, help } = parseArgs(argv, ["--min"]);
  if (help || files.length !== 1) {
    console.log("suggest-links <file> [--min N]\n  Suggests internal links (anchor, target, reason, live or planned) from the register and the page inventory.\n  N defaults to limits.linksSuggested. Rule SL1: fewer than N suggestions with a score above zero fails.");
    return help ? 0 : 1;
  }
  const min = flags["--min"]?.[0] ? Number(flags["--min"][0]) : ctx.config.limits.linksSuggested;
  const doc = loadText(files[0], ctx);
  const list = suggest(doc, ctx);
  for (const s of list.slice(0, 10)) console.log(`  ${s.linked ? "[already linked]" : "[suggested]"} "${s.anchor}" -> ${s.target} (${s.live ? "live" : "planned"}; ${s.reason})`);
  if (list.length < min) {
    console.log(fail("SL1", files[0], 1, `only ${list.length} link suggestion(s) found, need ${min}`, "write about the related topics so terms overlap, or add the target pages to the register"));
    return 1;
  }
  console.log(`OK ${list.length} suggestion(s), need ${min}`);
  return 0;
}

if (isMain(import.meta.url)) {
  let ctx: Ctx;
  try { ctx = loadCtx(); } catch (e) { cliError("suggest-links", CONFIG_FILE, e); }
  try { process.exit(run(process.argv.slice(2), ctx)); } catch (e) { cliError("suggest-links", process.argv.slice(2).find((a) => !a.startsWith("--")) ?? CONFIG_FILE, e); }
}
