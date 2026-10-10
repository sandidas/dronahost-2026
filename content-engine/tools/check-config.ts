/**
 * Validates content-engine.config.json, project/rules.config.json, project/settings.json and project/voice.json against
 * their Zod schemas, checks that every path the config names exists, and that each setting has one home.
 * Usage: npx tsx content-engine/tools/check-config.ts [--help]
 */
import { existsSync, readFileSync } from "node:fs";
import { CONFIG_FILE, loadConfig } from "./load-config";

if (process.argv.includes("--help")) {
  console.log("check-config: validate the config, rules, settings and voice files, that the configured paths exist, and that no value is typed in two places.");
  process.exit(0);
}

/** Problems that make a setting ambiguous: the same value typed in two files, or settings that disagree with each other. */
export function homeProblems(rawConfig: Record<string, unknown>, rawRules: Record<string, unknown>, loaded: ReturnType<typeof loadConfig>): string[] {
  const out: string[] = [];
  const { settings, voice, rules } = loaded;
  const limits = (rawConfig.limits ?? {}) as Record<string, unknown>;
  if (settings) {
    for (const k of ["name", "locale"]) if (k in rawConfig) out.push(`${k} is typed in the config and in settings.json. Fix: delete it from the config; settings.json is its home`);
    if ("titleSuffix" in limits) out.push("limits.titleSuffix is typed in the config. Fix: delete it; settings.json brand.titleSuffix is its home");
    for (const s of settings.support.notOffered) {
      const word = s.toLowerCase().split(/\s+/)[0];
      if (!rules.forbiddenChannels.some((f) => f.toLowerCase().includes(word))) out.push(`settings.json support.notOffered lists "${s}" but no forbiddenChannels phrase in rules.config.json detects it. Fix: add a detection phrase`);
    }
    if (settings.pricing && !settings.pricing.currencies.includes(settings.pricing.defaultCurrency)) out.push(`settings.json pricing.defaultCurrency ${settings.pricing.defaultCurrency} is not in pricing.currencies`);
  }
  if (voice) {
    for (const k of ["gradeTarget", "gradeWarnAbove", "gradeFailAbove", "sentenceMax", "averageSentenceMax"]) if (k in limits) out.push(`limits.${k} is typed in the config. Fix: delete it; voice.json readability is its home`);
    for (const k of ["bannedPhrases", "idioms", "bannedCtaLabels", "disclosureLine"]) if (k in rawRules) out.push(`${k} is typed in rules.config.json. Fix: delete it; voice.json is its home`);
    const variant = settings?.language.locale.endsWith("-US") ? "US" : settings?.language.locale.endsWith("-GB") ? "UK" : null;
    if (variant && variant !== voice.spelling.variant) out.push(`settings.json locale ${settings?.language.locale} expects ${variant} spelling, but voice.json spelling.variant is ${voice.spelling.variant}`);
  }
  return out;
}

try {
  const loaded = loadConfig();
  const { config, resolvePath } = loaded;
  const missing = Object.entries(config.paths)
    .filter(([key, p]) => p !== null && p !== undefined && key !== "posts" && !existsSync(resolvePath(p)))
    .map(([key, p]) => `paths.${key}: ${p} does not exist`);
  const rawConfig = JSON.parse(readFileSync(CONFIG_FILE, "utf8")) as Record<string, unknown>;
  const rawRules = JSON.parse(readFileSync(resolvePath(config.paths.rulesConfig), "utf8")) as Record<string, unknown>;
  const problems = [...missing, ...homeProblems(rawConfig, rawRules, loaded)];
  for (const m of problems) console.log(`  FAIL ${m}`);
  if (!loaded.settings || !loaded.voice) console.log("  NOTE no settings.json or voice.json named in paths: brand and voice values are read from the config and rules (older layout).");
  console.log(problems.length ? `\n${problems.length} problem(s) in ${CONFIG_FILE}.` : `Config OK (${CONFIG_FILE}).`);
  process.exit(problems.length ? 1 : 0);
} catch (e) {
  console.log(`  FAIL ${(e as Error).message}\nFix: edit ${CONFIG_FILE} and the files it names to match schemas/config.ts, rules-config.ts, settings.ts and voice.ts.`);
  process.exit(1);
}
