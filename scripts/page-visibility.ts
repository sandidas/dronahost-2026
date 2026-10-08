/**
 * Prints, as JSON on stdout, which sections of each page spec are visible after gating, how many words they hold, and which
 * facts (claims, flags, features) would unhide the hidden parts. check-content reads it (adapters.pageVisibility) for the
 * Blueprint checks. It renders each section with the same registry the site uses, so "visible" means "renders something".
 * Usage: npx tsx scripts/page-visibility.ts [dir]
 */
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NextIntlClientProvider } from "next-intl";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { passes, resolveClaimRef, resolveFeatureRef, resolveRequires, defaultContext } from "../lib/content/refs";
import { splitRequires } from "../lib/content/requires-grammar";
import { parsePage } from "../lib/content/page";
import { SECTION_REGISTRY } from "../lib/content/registry";
import type { SectionSpec } from "../lib/content/schemas/sections";

const dir = process.argv[2] ?? "content/pages";
const ctx = defaultContext;

/** Facts the section refers to that do not resolve today: claim and feature refs, requires terms, flags and predicates. */
function missingFacts(value: unknown, out: Set<string> = new Set()): Set<string> {
  const check = (term: string): void => {
    if (term.startsWith("claim:") && !resolveClaimRef(term, ctx)) out.add(term);
    else if (term.startsWith("feature:") && !resolveFeatureRef(term, ctx)) out.add(term);
    else if (term.startsWith("FEATURES.") && !ctx.flag(term.slice(9))) out.add(term);
    else if (!/^(claim:|feature:|FEATURES\.)/.test(term) && !ctx.predicate(term)) out.add(term);
  };
  if (Array.isArray(value)) value.forEach((v) => missingFacts(v, out));
  else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if ((k === "requires" || k === "answerRequires") && typeof v === "string") splitRequires(v).forEach(check);
      else if (k === "requiresClaim" && typeof v === "string") check(v);
      else if ((k === "h1Requires" || k === "leadRequiresClaims") && Array.isArray(v)) v.forEach((x) => typeof x === "string" && check(x));
      else missingFacts(v, out);
    }
  } else if (typeof value === "string" && /^(claim|feature):/.test(value)) check(value);
  return out;
}

const textWords = (html: string): number => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, " ").split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;

const pages: Record<string, { sections: unknown[] }> = {};
for (const file of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  let spec;
  try { spec = parsePage(JSON.parse(readFileSync(join(dir, file), "utf8"))); } catch { continue; }
  const sections = (spec.sections as SectionSpec[]).map((s) => {
    const gatesOk = passes(s, ctx);
    const missing = [...missingFacts(s)];
    if (!gatesOk) return { id: s.id, type: s.type, visible: false, reason: "gated" as const, missing, gatesOk, words: 0 };
    const entry = SECTION_REGISTRY[s.type] as { render: (sec: SectionSpec, c: typeof ctx) => unknown };
    const html = renderToStaticMarkup(createElement(NextIntlClientProvider, { locale: "en", messages: {}, children: entry.render(s, ctx) as ReactNode }));
    const visible = html.length > 0;
    return { id: s.id, type: s.type, visible, reason: visible ? ("ok" as const) : ("empty" as const), missing, gatesOk, words: visible ? textWords(html) : 0 };
  });
  pages[spec.path] = { sections };
}
void resolveRequires;
process.stdout.write(`${JSON.stringify({ pages }, null, 2)}\n`);
