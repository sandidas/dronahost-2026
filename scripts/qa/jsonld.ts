/**
 * JSON-LD validator. Extracts every <script type="application/ld+json"> from the public
 * routes and checks structure against the schema.org / Google rich-result requirements that
 * matter for our types, plus the rule that FAQPage questions must be visible on the page.
 * Usage: QA_BASE=... tsx scripts/qa/jsonld.ts
 */
import { chromium } from "playwright";
import { ALL_ROUTES, BASE } from "./routes";

type Node = Record<string, unknown>;
const problems: string[] = [];
let checked = 0;

const must = (cond: unknown, where: string, msg: string) => {
  if (!cond) problems.push(`${where}: ${msg}`);
};
const str = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

function validate(node: Node, where: string, pageText: string) {
  checked++;
  const type = node["@type"];
  must(str(type), where, "missing @type");
  switch (type) {
    case "Organization":
      must(str(node.name) && str(node.url), where, "Organization needs name and url");
      if (node.sameAs) must(Array.isArray(node.sameAs) && (node.sameAs as unknown[]).every(str), where, "sameAs must be a list of URLs");
      break;
    case "WebSite":
      must(str(node.name) && str(node.url), where, "WebSite needs name and url");
      break;
    case "BreadcrumbList": {
      const items = node.itemListElement as Node[] | undefined;
      must(Array.isArray(items) && items.length > 0, where, "BreadcrumbList needs itemListElement");
      (items ?? []).forEach((it, i) => {
        must(it.position === i + 1, where, `breadcrumb position ${i + 1} is wrong`);
        must(str(it.name), where, `breadcrumb ${i + 1} needs name`);
      });
      break;
    }
    case "FAQPage": {
      const qs = node.mainEntity as Node[] | undefined;
      must(Array.isArray(qs) && qs.length > 0, where, "FAQPage needs mainEntity");
      (qs ?? []).forEach((q, i) => {
        const a = q.acceptedAnswer as Node | undefined;
        must(q["@type"] === "Question" && str(q.name), where, `FAQ ${i + 1} needs @type Question and name`);
        must(a?.["@type"] === "Answer" && str(a?.text), where, `FAQ ${i + 1} needs an Answer with text`);
        // Google: only mark up content that is visible to users.
        must(pageText.includes(String(q.name).slice(0, 40)), where, `FAQ question not visible on the page: "${String(q.name).slice(0, 50)}"`);
      });
      break;
    }
    case "Product": {
      must(str(node.name), where, "Product needs name");
      const o = node.offers as Node | undefined;
      must(o?.["@type"] === "Offer", where, "Product needs an Offer");
      must(str(o?.price) && str(o?.priceCurrency), where, "Offer needs price and priceCurrency");
      break;
    }
    case "Service":
      must(str(node.name) && str(node.description), where, "Service needs name and description");
      break;
    case "Blog":
      must(str(node.name) && str(node.url), where, "Blog needs name and url");
      break;
    case "BlogPosting":
    case "Article":
      must(str(node.headline) && str(node.datePublished), where, `${type} needs headline and datePublished`);
      break;
    default:
      problems.push(`${where}: unvalidated @type "${String(type)}"`);
  }
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  for (const route of ALL_ROUTES) {
    await page.goto(BASE + route, { waitUntil: "load" });
    const scripts = await page.$$eval('script[type="application/ld+json"]', (els) => els.map((e) => e.textContent ?? ""));
    const text = await page.evaluate(() => document.body.innerText);
    // Hidden <details> answers still count as visible content for FAQ purposes (user-expandable).
    const full = await page.evaluate(() => document.body.textContent ?? "");
    if (scripts.length === 0) problems.push(`${route}: no JSON-LD found`);
    scripts.forEach((raw, i) => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        problems.push(`${route} #${i}: invalid JSON`);
        return;
      }
      const roots = Array.isArray(parsed) ? parsed : [parsed];
      for (const root of roots as Node[]) {
        must(root["@context"] === "https://schema.org" || str(root["@context"]), `${route} #${i}`, "missing @context");
        const nodes = Array.isArray(root["@graph"]) ? (root["@graph"] as Node[]) : [root];
        nodes.forEach((n) => validate(n, `${route} #${i}`, text + full));
      }
    });
  }
  await browser.close();
  problems.forEach((p) => console.log("FAIL", p));
  console.log(`\nValidated ${checked} schema node(s) across ${ALL_ROUTES.length} routes: ${problems.length ? `${problems.length} problem(s)` : "all valid"}`);
  process.exit(problems.length ? 1 : 0);
})();
