/**
 * gen-schema: builds JSON-LD from the visible fields of a draft, and checks existing JSON-LD against the page.
 * Usage: npx tsx docs/content-planner/tools/gen-schema.ts <file> [--out file.json] [--check existing-jsonld.json]
 * Rules: SC1 generated from visible fields; SC2 schema and content agree; SC3 no rating or review markup without real linked reviews.
 * It never emits AggregateRating or Review. Exits 1 on any FAIL.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { fail, isPlaceholder, isRealDate, loadCtx, loadText, normSpace, parseArgs, type Ctx, type TextDoc } from "./text";

type Node = Record<string, unknown>;
export type Result = { graph: Node | null; failures: string[]; warnings: string[] };

const titleCase = (seg: string): string => seg.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export function generate(doc: TextDoc): Result {
  const failures: string[] = [];
  const warnings: string[] = [];
  const f = doc.front;
  if (!doc.h1) failures.push(fail("SC1", doc.file, 1, "no H1, so there is no visible headline to use", "add one H1 to the page"));
  const segments = (f.slug ?? "").split("/").filter(Boolean);
  if (segments.length === 0) failures.push(fail("SC1", doc.file, 1, "no slug, so there is no path for the breadcrumb", "set `slug` in the front matter"));
  if (failures.length) return { graph: null, failures, warnings };

  const post: Node = { "@type": "BlogPosting", headline: doc.h1 };
  if (f.meta_description) post.description = f.meta_description;
  else warnings.push("meta_description is missing: description left out");
  if (isPlaceholder(f.author)) warnings.push("author is missing or a [HUMAN REVIEW] placeholder: author left out");
  else post.author = { "@type": "Person", name: f.author };
  if (isRealDate(f.reviewed_on)) post.dateModified = f.reviewed_on;
  else warnings.push("reviewed_on is not a real date: dateModified left out");
  if (isRealDate(f.published_on)) post.datePublished = f.published_on;

  const crumbs = [{ name: "Home", item: "/" }, ...segments.map((s, i) => ({ name: titleCase(s), item: `/${segments.slice(0, i + 1).join("/")}` }))];
  const trail: Node = {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };
  const graph: Node[] = [post, trail];
  if (doc.hasFaq && doc.faq.length > 0) {
    graph.push({
      "@type": "FAQPage",
      mainEntity: doc.faq.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })),
    });
  }
  return { graph: { "@context": "https://schema.org", "@graph": graph }, failures, warnings };
}

const flatten = (data: unknown): Node[] => {
  const root = data as Node;
  if (Array.isArray(data)) return data.flatMap(flatten);
  return Array.isArray(root?.["@graph"]) ? (root["@graph"] as Node[]) : root && typeof root === "object" ? [root] : [];
};
const typesOf = (n: Node): string[] => [n["@type"]].flat().map(String);
const deepFind = (v: unknown, type: string): boolean => {
  if (Array.isArray(v)) return v.some((x) => deepFind(x, type));
  if (v && typeof v === "object") return typesOf(v as Node).includes(type) || Object.values(v as Node).some((x) => deepFind(x, type));
  return false;
};
const personNames = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.flatMap(personNames);
  if (v && typeof v === "object") {
    const o = v as Node;
    const own = typesOf(o).includes("Person") && typeof o.name === "string" ? [o.name] : [];
    return [...own, ...Object.values(o).flatMap(personNames)];
  }
  return [];
};

export function check(doc: TextDoc, data: unknown, jsonFile: string, jsonRaw: string[]): string[] {
  const out: string[] = [];
  const nodes = flatten(data);
  const at = (needle: string): number => { const i = jsonRaw.findIndex((l) => l.includes(needle)); return i >= 0 ? i + 1 : 1; };
  const f = doc.front;
  for (const n of nodes.filter((x) => typesOf(x).some((t) => /Posting$|^Article$/.test(t)))) {
    if (typeof n.headline === "string" && normSpace(n.headline) !== normSpace(doc.h1)) {
      out.push(fail("SC2", jsonFile, at("headline"), `headline "${n.headline}" differs from the visible H1 "${doc.h1}"`, "make the headline equal to the H1"));
    }
    const allowed = [f.author, f.reviewer].filter((x) => !isPlaceholder(x));
    for (const name of personNames([n.author, n.reviewedBy, n.editor, n.contributor])) {
      if (!allowed.includes(name)) out.push(fail("SC2", jsonFile, at(name), `person "${name}" is not in the front matter`, "use only the author or reviewer named on the page"));
    }
    if (typeof n.dateModified === "string" && n.dateModified !== f.reviewed_on) out.push(fail("SC2", jsonFile, at("dateModified"), `dateModified ${n.dateModified} does not match reviewed_on ${f.reviewed_on || "(none)"}`, "use the reviewed_on date from the front matter"));
    if (typeof n.datePublished === "string" && n.datePublished !== f.published_on) out.push(fail("SC2", jsonFile, at("datePublished"), `datePublished ${n.datePublished} does not match published_on ${f.published_on || "(not set)"}`, "set published_on in the front matter or remove datePublished"));
  }
  const faqNode = nodes.find((x) => typesOf(x).includes("FAQPage"));
  if (faqNode && !(doc.hasFaq && doc.faq.length)) out.push(fail("SC2", jsonFile, at("FAQPage"), "FAQPage markup but the page shows no FAQ section", "remove FAQPage or add the visible FAQ"));
  if (!faqNode && doc.hasFaq && doc.faq.length) out.push(fail("SC2", jsonFile, 1, "the page shows a FAQ but the JSON-LD has no FAQPage", "add FAQPage built from the visible questions"));
  if (faqNode) {
    const items = ((faqNode.mainEntity as Node[] | undefined) ?? []).map((e) => ({ q: normSpace(String(e.name ?? "")), a: normSpace(String((e.acceptedAnswer as Node | undefined)?.text ?? "")) }));
    const seen = new Map(doc.faq.map((x) => [normSpace(x.q), normSpace(x.a)]));
    for (const it of items) {
      if (!seen.has(it.q)) out.push(fail("SC2", jsonFile, at(it.q), `FAQ question "${it.q}" is not on the page`, "use only the questions the page shows"));
      else if (seen.get(it.q) !== it.a) out.push(fail("SC2", jsonFile, at(it.q), `FAQ answer for "${it.q}" differs from the visible answer`, "copy the visible answer exactly"));
    }
    for (const q of seen.keys()) if (!items.some((i) => i.q === q)) out.push(fail("SC2", jsonFile, at("mainEntity"), `visible FAQ question "${q}" is missing from the JSON-LD`, "add it, or regenerate with gen-schema"));
  }
  const hasReviewMarkup = deepFind(data, "Review") || deepFind(data, "AggregateRating");
  if (hasReviewMarkup && !/^https:\/\/\S+$/.test(f.reviews_source ?? "")) {
    out.push(fail("SC3", jsonFile, at("Review") > 1 ? at("Review") : at("AggregateRating"), "Review or AggregateRating markup but the front matter has no reviews_source (https URL)", "remove the markup, or set reviews_source to the real public reviews page"));
  }
  return out;
}

export function run(argv: string[], ctx: Ctx = loadCtx()): number {
  const { files, flags, help } = parseArgs(argv, ["--out", "--check"]);
  if (help || files.length !== 1) {
    console.log("gen-schema <file> [--out file.json] [--check existing-jsonld.json]\n  Generates BlogPosting, BreadcrumbList and (only if the page shows a FAQ) FAQPage from visible fields.\n  --check compares existing JSON-LD with the page. Rules: SC1, SC2, SC3. Exit 1 on FAIL.");
    return help ? 0 : 1;
  }
  const doc = loadText(files[0], ctx);
  const check_ = flags["--check"]?.[0];
  if (check_) {
    const raw = readFileSync(check_, "utf8");
    const failures = check(doc, JSON.parse(raw), check_, raw.split("\n"));
    failures.forEach((x) => console.log(x));
    console.log(failures.length ? `${failures.length} problem(s) in ${check_}` : `OK ${check_} agrees with ${files[0]}`);
    return failures.length ? 1 : 0;
  }
  const res = generate(doc);
  res.warnings.forEach((w) => console.log(`  WARN ${w}`));
  if (!res.graph) { res.failures.forEach((x) => console.log(x)); return 1; }
  const json = `${JSON.stringify(res.graph, null, 2)}\n`;
  const out = flags["--out"]?.[0];
  if (out) { writeFileSync(out, json); console.log(`Wrote ${out}`); } else process.stdout.write(json);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exit(run(process.argv.slice(2)));
