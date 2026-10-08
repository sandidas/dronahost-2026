/**
 * Creates the project/ folder, the config and the register skeleton for a new host project. Never overwrites a file.
 * Usage: npx tsx docs/content-planner/tools/init-project.ts [--out dir] --name "ExampleCo" --domain example.com --owner "Sam Example" --locale en-US [--yes]
 */
import { DEFAULT_IDIOMS, DEFAULT_PLAN_ROUTING, DEFAULT_WORDPRESS } from "./defaults";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { ConfigSchema } from "../schemas/config";
import { RulesConfigSchema } from "../schemas/rules-config";
import { COLUMNS } from "./register";

export type InitOptions = { out?: string; name: string; domain: string; owner: string; locale: string };
export type InitResult = { created: string[]; kept: string[] };

const PLANNER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLANS: [string, string][] = [["01", "Money pages"], ["02", "Commercial investigation"], ["03", "Informational"], ["04", "Problem and troubleshooting"], ["05", "Regional and location"], ["06", "Service pages"], ["07", "Compliance and trust"], ["08", "Domains"], ["09", "Navigational and brand"], ["10", "AI search queries"], ["14", "Migration and email"], ["15", "Off-site reviews and links"]];
const EMPTY_FOLDERS = ["briefs", "drafts", "facts", "plan-specifics", "later", "pages"];
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const table = (cols: string[]): string => `| ${cols.join(" | ")} |\n|${cols.map(() => "---").join("|")}|\n`;

export function buildConfig(o: InitOptions) {
  return ConfigSchema.parse({
    $comment: "Host integration. Every path is relative to this file. Schema: schemas/config.ts",
    name: o.name, locale: o.locale,
    paths: { register: "project/keyword-register.md", pricing: "project/pricing.json", claims: "project/claims.json", company: "project/company.json", pages: "project/pages", posts: null, briefs: "project/briefs", facts: "project/facts", drafts: "project/drafts", rulesConfig: "project/rules.config.json" },
    adapters: { claims: "json", pricing: "json", posts: "files", pageSpec: null, wordpress: DEFAULT_WORDPRESS },
    governor: { maxInFlight: 3, monthlyNewPages: 4, paused: false },
    cta: { bannedLabels: [], cardLabelTemplate: "Choose {plan}" },
    limits: {
      titleSuffix: "", titleWarnAbove: 60, titleFailAbove: 70, descriptionWarnAbove: 160, sentenceMax: 28, averageSentenceMax: 20,
      gradeTarget: [8, 10], gradeWarnAbove: 10, gradeFailAbove: 11, answerBlockWords: [40, 80], faqItems: [4, 6], faqAnswerWarnBelow: 40, faqAnswerFailAbove: 80,
      internalLinksMin: 3, faqItemsByPlan: {}, similarity: { shingleWords: 5, threshold: 0.3 }, linksSuggested: 3,
    },
    web: { serpSource: "claude-web", gscSource: "csv" },
  });
}

export function buildRules(o: InitOptions) {
  const brand = esc(o.name);
  return RulesConfigSchema.parse({
    $comment: "Machine-readable project rules. Add your own banned phrases, claims and channels. Schema: schemas/rules-config.ts",
    bannedPhrases: ["lorem ipsum", "world-class", "cutting-edge", "game-changing", "unlock the power", "in today's fast-paced world"],
    bannedCtaLabels: ["click here", "learn more", "read more", "submit"],
    featureWords: [], forbiddenChannels: [], forbiddenClaims: [], channelAllowlistFiles: [],
    disclosureLine: "Drafted with AI assistance, then edited, fact-checked and approved by",
    brandSuffixPattern: `(\\s[|\\-–:]\\s*${brand}|${brand}\\s*[|\\-–:])`,
    noBrand: { terms: [o.name, o.domain, o.owner], patterns: [], allowFiles: ["tools/check-no-brand.ts"] },
    idioms: DEFAULT_IDIOMS,
    planRouting: DEFAULT_PLAN_ROUTING,
    intentByPlan: { "01": "Buy", "02": "Compare", "03": "Learn", "04": "Solve", "05": "Buy", "06": "Buy", "07": "Learn", "08": "Buy", "09": "Find", "10": "Learn", "14": "Solve", "15": "Find" },
  });
}

/** One project-specifics slot per plan, because the plans link to them, plus the parked billing plan's project copy. */
function planSlots(): Record<string, string> {
  const out: Record<string, string> = {};
  const dir = join(PLANNER_DIR, "plans");
  if (existsSync(dir)) {
    for (const f of readdirSync(dir).filter((n) => /^\d{2}-.*\.md$/.test(n)).sort()) {
      out[`project/plan-specifics/${f}`] = `# Plan ${f.slice(0, 2)}: project specifics\n\nNothing recorded yet. Put the facts, dated owner decisions, named providers and channels that belong to this plan here, not in the plan. [HUMAN REVIEW: add when the plan is first used]\n`;
    }
  }
  out["project/later/12-billing-system-integration.md"] = "# Plan 12: project billing system data\n\nNothing recorded yet. Fill this in when the project reaches billing work. See `later/12-billing-system-integration.md` for the outline. [HUMAN REVIEW: add when needed]\n";
  return out;
}

function files(o: InitOptions): Record<string, string> {
  const review = (what: string): string => `[HUMAN REVIEW: ${what}]`;
  const regCols = table(COLUMNS);
  const plans = PLANS.map(([n, t]) => `## Plan ${n}: ${t}\n\n${regCols}`).join("\n");
  return {
    "content-planner.config.json": JSON.stringify(buildConfig(o), null, 2) + "\n",
    "project/rules.config.json": JSON.stringify(buildRules(o), null, 2) + "\n",
    "project/pricing.json": "{\n  \"plans\": []\n}\n",
    "project/claims.json": "[]\n",
    "project/company.json": "{}\n",
    "project/PROJECT.md": `# ${o.name}: business facts\n\nThe only source of business facts for content. A missing fact stays a [HUMAN REVIEW: ...] note.\n\n## Business\n\n- Name: ${o.name}\n- Website: ${o.domain}\n- Owner: ${o.owner}\n- Year founded: ${review("year")}\n- Registered company name and number: ${review("legal details")}\n\n## Audience\n\n- Who we write for: ${review("describe the reader")}\n- Markets: ${review("countries and languages")}\n\n## Products and services\n\n- ${review("list each product or service")}\n\n## Prices and tax\n\n- ${review("where prices live and the tax rule")}\n\n## Guarantees and policies\n\n- ${review("only what is written in your published terms")}\n\n## Contact and support\n\n- ${review("channels and hours that are really covered")}\n\n## Proof we can show\n\n- ${review("reviews, customers and results you have permission to name")}\n`,
    "project/DECISIONS.md": `# Owner decisions\n\n${table(["Date", "Decision", "Reason", "Decided by"])}`,
    "project/brand.md": `# ${o.name}: voice and terms\n\n## Voice\n\n- ${review("three words that describe the tone")}\n\n## Words we use\n\n${table(["Say", "Do not say"])}\n## Words we avoid\n\n- ${review("phrases to ban")}\n`,
    "project/keyword-register.md": `# Keyword Register\n\nOne primary keyword per URL, per locale. Update this file in the same change that publishes or edits a page.\n\n## Columns\n\n${table(["Column", "Meaning"])}${COLUMNS.map((c) => `| ${c} | ${review("describe")} |`).join("\n")}\n\n${plans}\n## Excluded keywords (do not target)\n\n${table(["Keyword", "Reason"])}`,
    "project/learning-log.md": `# Learning log\n\nOne row per change and what happened. A result is a note, not proof.\n\n${table(["date", "page", "change", "result", "rule"])}`,
    ...planSlots(),
    ...Object.fromEntries(EMPTY_FOLDERS.map((f) => [`project/${f}/.gitkeep`, ""])),
  };
}

export function initProject(options: InitOptions): InitResult {
  const root = resolve(options.out ?? PLANNER_DIR);
  const result: InitResult = { created: [], kept: [] };
  for (const [rel, content] of Object.entries(files(options))) {
    const target = join(root, rel);
    if (existsSync(target)) { result.kept.push(rel); continue; }
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
    result.created.push(rel);
  }
  return result;
}

/** Asks each missing value, one at a time, with a default. */
export async function askMissing(given: Partial<InitOptions>): Promise<InitOptions> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const ask = async (label: string, key: keyof InitOptions, dflt: string): Promise<string> => given[key] ?? ((await rl.question(`${label} [${dflt}]: `)).trim() || dflt);
  try {
    const name = await ask("Project name", "name", "ExampleCo");
    const domain = await ask("Domain", "domain", "example.com");
    const owner = await ask("Owner (person who approves content)", "owner", "Sam Example");
    const locale = await ask("Default locale", "locale", "en-US");
    return { out: given.out, name, domain, owner, locale };
  } finally { rl.close(); }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("init-project [--out dir] --name \"ExampleCo\" --domain example.com --owner \"Sam Example\" --locale en-US [--yes]\nCreates config and project/ skeleton. Never overwrites: existing files are kept.");
    return;
  }
  const opt = (n: string): string | undefined => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const given: Partial<InitOptions> = { out: opt("--out"), name: opt("--name"), domain: opt("--domain"), owner: opt("--owner"), locale: opt("--locale") };
  const complete = given.name && given.domain && given.owner && given.locale;
  const options = complete || args.includes("--yes")
    ? { out: given.out, name: given.name ?? "ExampleCo", domain: given.domain ?? "example.com", owner: given.owner ?? "Sam Example", locale: given.locale ?? "en-US" }
    : await askMissing(given);
  try {
    const r = initProject(options);
    r.created.forEach((f) => console.log(`created ${f}`));
    r.kept.forEach((f) => console.log(`kept existing ${f}`));
    console.log(`\nDone: ${r.created.length} created, ${r.kept.length} kept. Next: fill project/PROJECT.md, then run check-config and check-no-brand.`);
  } catch (e) {
    console.log(`  FAIL IP1 init-project:1 ${(e as Error).message}. Fix: use a locale such as en-US and non-empty values.`);
    process.exit(1);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) void main();
