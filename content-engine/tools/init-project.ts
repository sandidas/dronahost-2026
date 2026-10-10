/**
 * Creates the project/ folder, the config, settings.json, voice.json and the register skeleton for a new host project.
 * Never overwrites a file.
 * Usage: npx tsx content-engine/tools/init-project.ts [--out dir] --name "ExampleCo" --domain example.com --owner "Sam Example" --locale en-US
 *        [--type "online bakery"] [--category bakery] [--yes]
 */
import { DEFAULT_ARCHETYPE_ALIASES, DEFAULT_ARCHETYPE_BY_PLAN, DEFAULT_FAQ_BY_ARCHETYPE, DEFAULT_IDIOMS, DEFAULT_PLAN_ROUTING, DEFAULT_WORDPRESS } from "./defaults";
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";
import { ConfigSchema } from "../schemas/config";
import { RulesConfigSchema } from "../schemas/rules-config";
import { SettingsSchema, type Settings } from "../schemas/settings";
import { VoiceSchema, type Voice } from "../schemas/voice";
import { mergeConfig, mergeRules } from "./load-config";
import { COLUMNS } from "./register";
import { isMain } from "./is-main";

export type InitOptions = { out?: string; name: string; domain: string; owner: string; locale: string; type?: string; category?: string };
export type InitResult = { created: string[]; kept: string[] };

const PLANNER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLANS: [string, string][] = [["01", "Money pages"], ["02", "Commercial investigation"], ["03", "Informational"], ["04", "Problem and troubleshooting"], ["05", "Regional and location"], ["06", "Service pages"], ["07", "Compliance and trust"], ["08", "Domains"], ["09", "Navigational and brand"], ["10", "AI search queries"], ["14", "Migration and email"], ["15", "Off-site reviews and links"]];
const EMPTY_FOLDERS = ["briefs", "drafts", "facts", "plan-specifics", "later", "pages"];
const table = (cols: string[]): string => `| ${cols.join(" | ")} |\n|${cols.map(() => "---").join("|")}|\n`;

const slug = (t: string): string => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "business";

/** The project's identity. Every value a person must confirm is a [HUMAN REVIEW] note. */
export function buildSettings(o: InitOptions): Settings {
  const review = (what: string): string => `[HUMAN REVIEW: ${what}]`;
  const type = o.type ?? review("what the business is, in plain words");
  return SettingsSchema.parse({
    $comment: "Brand identity and business settings: change the brand name, business type, locale and channels here. Schema: schemas/settings.ts",
    brand: { name: o.name, domain: o.domain, neverWrite: [] },
    business: { type, category: o.category ?? (o.type ? slug(o.type) : "business"), offerings: [] },
    audience: { summary: review("who you write for, in one or two sentences"), priorityMarkets: [], secondLanguageReaders: true },
    language: { locale: o.locale, otherLocales: [], dateExample: o.locale.endsWith("-US") ? "October 6, 2026" : "6 October 2026", timeExample: "14:00 UTC" },
    support: { channels: [review("the channels a person really answers")], notOffered: [] },
    people: { approver: o.owner, drafter: "Claude", legalReviewer: null },
  });
}

/** A neutral starting voice. The project owns it from here. */
export function buildVoice(o: InitOptions): Voice {
  const us = o.locale.endsWith("-US");
  return VoiceSchema.parse({
    $comment: "Brand voice as data: tone, readability limits, spelling, word swaps and banned lists. Schema: schemas/voice.ts",
    summary: "Clear, specific, calm. Plain words for a smart reader who may not read the language as a first language.",
    attributes: [
      { name: "Clear", means: "One idea per sentence. The outcome first, the technical term second." },
      { name: "Specific", means: "Numbers, steps and names from the project facts. Never a vague adjective." },
      { name: "Calm", means: "No pressure, no countdowns, no exclamation marks." },
      { name: "Honest", means: "Say what we do not do. Never imply a size, place or channel we do not have." },
    ],
    readability: { gradeTarget: [8, 10], gradeWarnAbove: 10, gradeFailAbove: 11, sentenceMax: 28, averageSentenceMax: 20 },
    spelling: { variant: us ? "US" : "UK", avoid: us ? { colour: "color", centre: "center", optimise: "optimize", organise: "organize", analyse: "analyze" } : { color: "colour", center: "centre", optimize: "optimise", organize: "organise", analyze: "analyse" } },
    exclamationMarks: false,
    wordSwaps: [{ avoid: ["utilize", "leverage"], use: "use" }, { avoid: ["commence"], use: "start" }, { avoid: ["in order to"], use: "to" }],
    bannedPhrases: ["lorem ipsum", "world-class", "cutting-edge", "game-changing", "unlock the power", "in today's fast-paced world"],
    idioms: DEFAULT_IDIOMS,
    bannedCtaLabels: ["click here", "learn more", "read more", "submit"],
    disclosureLine: "Drafted with AI assistance, then edited, fact-checked and approved by",
  });
}

/** The config as written to disk: no name, locale, title suffix or readability limits (settings.json and voice.json supply them). */
export function buildConfig(o: InitOptions) {
  const raw = {
    $comment: "Host integration. Every path is relative to this file. Name, locale and title suffix come from project/settings.json; readability limits from project/voice.json. Schema: schemas/config.ts",
    paths: { register: "project/keyword-register.md", pricing: "project/pricing.json", claims: "project/claims.json", company: "project/company.json", pages: "project/pages", posts: null, briefs: "project/briefs", facts: "project/facts", drafts: "project/drafts", rulesConfig: "project/rules.config.json", settings: "project/settings.json", voice: "project/voice.json" },
    adapters: { claims: "json", pricing: "json", posts: "files", pageSpec: null, wordpress: DEFAULT_WORDPRESS },
    governor: { maxInFlight: 3, monthlyNewPages: 4, paused: false },
    cta: { bannedLabels: [], cardLabelTemplate: "Choose {plan}" },
    limits: {
      titleWarnAbove: 60, titleFailAbove: 70, descriptionWarnAbove: 160,
      answerBlockWords: [40, 80], faqItems: [4, 6], faqAnswerWarnBelow: 40, faqAnswerFailAbove: 80,
      internalLinksMin: 3, faqItemsByArchetype: DEFAULT_FAQ_BY_ARCHETYPE, archetypeByPlan: DEFAULT_ARCHETYPE_BY_PLAN, archetypeAliases: DEFAULT_ARCHETYPE_ALIASES, similarity: { shingleWords: 5, threshold: 0.3 }, linksSuggested: 3,
    },
    web: { serpSource: "claude-web", gscSource: "csv" },
  };
  ConfigSchema.parse(mergeConfig(raw, buildSettings(o), buildVoice(o)));
  return raw;
}

/** The rules as written to disk: detection lists only. The voice lists live in voice.json, the brand terms in settings.json. */
export function buildRules(o: InitOptions) {
  const raw = {
    $comment: "Machine-readable detection lists: feature words, channels, claims, plan routing and the no-brand test. Voice lists live in project/voice.json; brand terms come from project/settings.json. Schema: schemas/rules-config.ts",
    featureWords: [], forbiddenChannels: [], forbiddenClaims: [], channelAllowlistFiles: [],
    noBrand: { terms: [], patterns: [], allowFiles: ["tools/check-no-brand.ts"] },
    planRouting: DEFAULT_PLAN_ROUTING,
    intentByPlan: { "01": "Buy", "02": "Compare", "03": "Learn", "04": "Solve", "05": "Buy", "06": "Buy", "07": "Learn", "08": "Buy", "09": "Find", "10": "Learn", "14": "Solve", "15": "Find" },
  };
  RulesConfigSchema.parse(mergeRules(raw, buildSettings(o), buildVoice(o)));
  return raw;
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
  out["project/later/11-localization-country-language-currency.md"] = "# Plan 11: project locales, currencies and tax\n\nNothing recorded yet. Fill this in when the project adds a country, a language or a currency. See `later/11-localization-country-language-currency.md` for the outline. [HUMAN REVIEW: add when needed]\n";
  out["project/later/12-billing-system-integration.md"] = "# Plan 12: project billing system data\n\nNothing recorded yet. Fill this in when the project reaches billing work. See `later/12-billing-system-integration.md` for the outline. [HUMAN REVIEW: add when needed]\n";
  return out;
}

function files(o: InitOptions): Record<string, string> {
  const review = (what: string): string => `[HUMAN REVIEW: ${what}]`;
  const regCols = table(COLUMNS);
  const plans = PLANS.map(([n, t]) => `## Plan ${n}: ${t}\n\n${regCols}`).join("\n");
  return {
    "content-engine.config.json": JSON.stringify(buildConfig(o), null, 2) + "\n",
    "project/rules.config.json": JSON.stringify(buildRules(o), null, 2) + "\n",
    "project/settings.json": JSON.stringify(buildSettings(o), null, 2) + "\n",
    "project/voice.json": JSON.stringify(buildVoice(o), null, 2) + "\n",
    "project/pricing.json": "{\n  \"plans\": []\n}\n",
    "project/claims.json": "[]\n",
    "project/company.json": "{}\n",
    "project/PROJECT.md": `# ${o.name}: business facts\n\nThe only source of business facts for content. A missing fact stays a [HUMAN REVIEW: ...] note.\n\n## Business\n\n- Name: ${o.name}\n- Website: ${o.domain}\n- Owner: ${o.owner}\n- Year founded: ${review("year")}\n- Registered company name and number: ${review("legal details")}\n\n## Audience\n\n- Who we write for: ${review("describe the reader")}\n- Markets: ${review("countries and languages")}\n\n## Products and services\n\n- ${review("list each product or service")}\n\n## Prices and tax\n\n- ${review("where prices live and the tax rule")}\n\n## Guarantees and policies\n\n- ${review("only what is written in your published terms")}\n\n## Contact and support\n\n- ${review("channels and hours that are really covered")}\n\n## Proof we can show\n\n- ${review("reviews, customers and results you have permission to name")}\n`,
    "project/DECISIONS.md": `# Owner decisions\n\n${table(["Date", "Decision", "Reason", "Decided by"])}`,
    "project/brand.md": `# ${o.name}: voice examples and terms\n\nThe voice itself (tone, readability, banned words, spelling) is data in \`project/voice.json\`; the brand name, business type and channels are in \`project/settings.json\`. Run \`npm run content:voice\` to see both as one card. This file holds what does not fit in JSON: worked examples per page type and product terms.\n\n## Examples by page type\n\n- ${review("one good headline, answer and CTA for each page type you publish")}\n\n## Words we use\n\n${table(["Say", "Do not say"])}\n## Words we avoid\n\n- ${review("phrases to ban")}\n`,
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
    const type = await ask("What the business is, in plain words", "type", "small business");
    return { out: given.out, name, domain, owner, locale, type, category: given.category };
  } finally { rl.close(); }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("init-project [--out dir] --name \"ExampleCo\" --domain example.com --owner \"Sam Example\" --locale en-US [--type \"online bakery\"] [--category bakery] [--yes]\nCreates the config, project/settings.json, project/voice.json and the project/ skeleton. Never overwrites: existing files are kept.");
    return;
  }
  const opt = (n: string): string | undefined => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
  const given: Partial<InitOptions> = { out: opt("--out"), name: opt("--name"), domain: opt("--domain"), owner: opt("--owner"), locale: opt("--locale"), type: opt("--type"), category: opt("--category") };
  const complete = given.name && given.domain && given.owner && given.locale;
  const options = complete || args.includes("--yes")
    ? { out: given.out, name: given.name ?? "ExampleCo", domain: given.domain ?? "example.com", owner: given.owner ?? "Sam Example", locale: given.locale ?? "en-US", type: given.type, category: given.category }
    : await askMissing(given);
  try {
    const r = initProject(options);
    r.created.forEach((f) => console.log(`created ${f}`));
    r.kept.forEach((f) => console.log(`kept existing ${f}`));
    console.log(`\nDone: ${r.created.length} created, ${r.kept.length} kept. Next: set the brand and voice in project/settings.json and project/voice.json, fill project/PROJECT.md, then run check-config and check-no-brand.`);
  } catch (e) {
    console.log(`  FAIL IP1 init-project:1 ${(e as Error).message}. Fix: use a locale such as en-US and non-empty values.`);
    process.exit(1);
  }
}

if (isMain(import.meta.url)) void main();
