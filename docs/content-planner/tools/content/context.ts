/** Everything the rules need from the host project, loaded once: config, lists, claims, register, ledgers and briefs. */
import { existsSync, readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { pathToFileURL } from "node:url";
import type { Config } from "../../schemas/config";
import type { RulesConfig } from "../../schemas/rules-config";
import { loadConfig } from "../load-config";
import { parseFrontMatter } from "../front-matter";
import { parseRegister, type ParsedRegister, type Row } from "../register";
import type { CopyOptions, Doc } from "./parse";

export type ClaimInfo = { id: string; verified: boolean; status: string };
export type LedgerFact = { id: string; fact: string; kind: string; status: string; source: { type: string; ref: string }; retrievedOn?: string };
export type Ledger = { found: boolean; path: string; facts: LedgerFact[]; text: string };
export type Brief = { path: string; front: Record<string, string>; text: string };
export type Ctx = {
  config: Config; rules: RulesConfig; resolvePath: (p: string) => string; copy: CopyOptions;
  claims: ClaimInfo[]; register: ParsedRegister | null; briefsDir: string; factsDir: string; pricingText: string;
  /** Every price in the pricing file's "pricing" and "renewal" blocks, as plain numbers, so a typed price can be named as a hard-coded price. */
  priceNumbers: Set<number>;
};

/** Pricing adapter (`json`): collects the numbers under any "pricing" or "renewal" key of the pricing file. */
export function collectPriceNumbers(pricingText: string): Set<number> {
  const out = new Set<number>();
  if (!pricingText) return out;
  const walk = (v: unknown, inPrice: boolean): void => {
    if (typeof v === "number" && inPrice && v > 0) out.add(v);
    else if (Array.isArray(v)) v.forEach((x) => walk(x, inPrice));
    else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, inPrice || k === "pricing" || k === "renewal");
  };
  try { walk(JSON.parse(pricingText), false); } catch { /* an unreadable pricing file only removes the hint */ }
  return out;
}

/** Claims adapter. `ts-export`: the module exports CLAIMS (or a default export) as records with id, verified and status. */
async function loadClaims(config: Config, resolvePath: (p: string) => string): Promise<ClaimInfo[]> {
  const file = resolvePath(config.paths.claims);
  if (!existsSync(file)) return [];
  if (config.adapters.claims === "json") {
    const data = JSON.parse(readFileSync(file, "utf8")) as ClaimInfo[];
    return Array.isArray(data) ? data : [];
  }
  const mod = (await import(pathToFileURL(file).href)) as Record<string, unknown>;
  const list = (mod.CLAIMS ?? mod.default ?? []) as (ClaimInfo & Record<string, unknown>)[];
  // A claim renders only when the host's own claimRenders() says so (verified AND its terms page published). Use it when the module exports it.
  const renders = typeof mod.claimRenders === "function" ? (mod.claimRenders as (c: unknown) => boolean) : null;
  return list.map((c) => ({ id: c.id, verified: renders ? Boolean(renders(c)) : Boolean(c.verified), status: String(c.status ?? "") }));
}

export async function loadContext(): Promise<Ctx> {
  const { config, rules, resolvePath } = loadConfig();
  const registerPath = process.env.CHECK_CONTENT_REGISTER ?? resolvePath(config.paths.register);
  const pricingFile = resolvePath(config.paths.pricing);
  return {
    config, rules, resolvePath,
    copy: { nonCopyKeys: config.adapters.pageSpec?.nonCopyKeys ?? [], labelKeys: config.adapters.pageSpec?.labelKeys ?? [] },
    claims: await loadClaims(config, resolvePath),
    register: existsSync(registerPath) ? parseRegister(readFileSync(registerPath, "utf8")) : null,
    briefsDir: process.env.CHECK_CONTENT_BRIEFS ?? resolvePath(config.paths.briefs),
    factsDir: process.env.CHECK_CONTENT_FACTS ?? resolvePath(config.paths.facts),
    pricingText: existsSync(pricingFile) ? readFileSync(pricingFile, "utf8") : "",
    priceNumbers: collectPriceNumbers(existsSync(pricingFile) ? readFileSync(pricingFile, "utf8") : ""),
  };
}

export const claimRenders = (ctx: Ctx, id: string): boolean => ctx.claims.some((c) => c.id === id && c.verified);

export const slugName = (doc: Doc): string => (doc.front.slug ?? "").replace(/^\/|\/$/g, "").replace(/\//g, "-") || basename(doc.file, extname(doc.file));

export function ledgerFor(ctx: Ctx, doc: Doc): Ledger {
  const names = [slugName(doc), basename(doc.file, extname(doc.file))];
  for (const name of names) {
    const json = join(ctx.factsDir, `${name}.json`);
    if (existsSync(json)) {
      const data = JSON.parse(readFileSync(json, "utf8")) as { facts?: LedgerFact[] };
      const facts = data.facts ?? [];
      return { found: true, path: json, facts, text: facts.map((f) => f.fact).join("\n") };
    }
  }
  for (const name of names) {
    const md = join(ctx.factsDir, `${name}.md`);
    if (existsSync(md)) return { found: true, path: md, facts: [], text: readFileSync(md, "utf8") };
  }
  return { found: false, path: "", facts: [], text: "" };
}

export function briefFor(ctx: Ctx, doc: Doc): Brief | null {
  for (const name of [slugName(doc), (doc.front.slug ?? "").split("/").filter(Boolean).pop() ?? "", basename(doc.file, extname(doc.file))]) {
    if (!name) continue;
    const p = join(ctx.briefsDir, `${name}.md`);
    if (existsSync(p)) {
      const text = readFileSync(p, "utf8");
      return { path: p, front: parseFrontMatter(text).front, text };
    }
  }
  return null;
}

export function rowBySlug(ctx: Ctx, slug: string): Row | undefined {
  return ctx.register?.rows.find((r) => r.url === slug);
}
export function rowByKeyword(ctx: Ctx, kw: string): Row | undefined {
  return ctx.register?.rows.find((r) => r.keyword.toLowerCase() === kw.toLowerCase() && r.status !== "dropped");
}
