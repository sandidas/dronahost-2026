/**
 * Loads and validates content-engine.config.json, project/rules.config.json and, when the config names them,
 * project/settings.json and project/voice.json. Every tool starts here.
 *
 * Settings and voice are the single home for the brand name, the locale, the title suffix, the readability limits and
 * the banned lists. They are merged into the raw config and rules before validation, so a tool only ever sees one
 * Config and one RulesConfig. A value in settings or voice wins over the same value typed in the config or the rules.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ConfigSchema, type Config } from "../schemas/config";
import { RulesConfigSchema, type RulesConfig } from "../schemas/rules-config";
import { SettingsSchema, type Settings } from "../schemas/settings";
import { VoiceSchema, type Voice } from "../schemas/voice";

/** The engine folder (the parent of tools/). The folder name does not matter: nothing depends on it. */
export const PLANNER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const ENGINE_DIR = PLANNER_DIR;
/** CONTENT_PLANNER_CONFIG is the old name of the variable; it still works. */
export const CONFIG_FILE = process.env.CONTENT_ENGINE_CONFIG ?? process.env.CONTENT_PLANNER_CONFIG ?? resolve(PLANNER_DIR, "content-engine.config.json");

export type Loaded = {
  config: Config;
  rules: RulesConfig;
  settings: Settings | null;
  voice: Voice | null;
  baseDir: string;
  resolvePath: (p: string) => string;
};

type Raw = Record<string, unknown>;
const readJson = (file: string): Raw => JSON.parse(readFileSync(file, "utf8")) as Raw;
const esc = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Reads settings.json and voice.json named by a raw config, or null when the config names none. */
function readBrand(raw: Raw, baseDir: string): { settings: Settings | null; voice: Voice | null } {
  const paths = (raw.paths ?? {}) as Record<string, unknown>;
  const read = <T>(key: string, parse: (v: unknown) => T): T | null => {
    const p = paths[key];
    if (typeof p !== "string") return null;
    const file = resolve(baseDir, p);
    if (!existsSync(file)) throw new Error(`paths.${key} points to ${file}, which does not exist`);
    try {
      return parse(readJson(file));
    } catch (e) {
      throw new Error(`${file} is not valid: ${(e as Error).message}`);
    }
  };
  return { settings: read("settings", (v) => SettingsSchema.parse(v)), voice: read("voice", (v) => VoiceSchema.parse(v)) };
}

/** The title suffix the metadata helper adds, from settings. */
export const titleSuffixOf = (s: Settings): string => s.brand.titleSuffix ?? ` | ${s.brand.name}`;

/** A typed brand suffix in a title, such as " | Brand" or "Brand: ". */
export const brandSuffixPatternOf = (name: string): string => `(\\s[|\\-–:]\\s*${esc(name)}|${esc(name)}\\s*[|\\-–:])`;

/** Merges settings and voice into a raw config object, before validation. */
export function mergeConfig(raw: Raw, settings: Settings | null, voice: Voice | null): Raw {
  const out: Raw = { ...raw };
  const limits: Raw = { ...((raw.limits ?? {}) as Raw) };
  if (settings) {
    out.name = settings.brand.name;
    out.locale = settings.language.locale;
    limits.titleSuffix = titleSuffixOf(settings);
  }
  if (voice) Object.assign(limits, voice.readability);
  out.limits = limits;
  return out;
}

/** Merges settings and voice into a raw rules object, before validation. */
export function mergeRules(raw: Raw, settings: Settings | null, voice: Voice | null): Raw {
  const out: Raw = { ...raw };
  if (voice) {
    out.bannedPhrases = voice.bannedPhrases;
    out.idioms = voice.idioms;
    out.bannedCtaLabels = voice.bannedCtaLabels;
    out.disclosureLine = voice.disclosureLine;
    out.spellingAvoid = voice.spelling.avoid;
    out.wordSwaps = voice.wordSwaps;
    out.allowExclamationMarks = voice.exclamationMarks;
  }
  if (settings) {
    if (typeof out.brandSuffixPattern !== "string") out.brandSuffixPattern = brandSuffixPatternOf(settings.brand.name);
    const nb = { ...((out.noBrand ?? { patterns: [], allowFiles: [] }) as Raw) };
    const brandTerms = [settings.brand.name, settings.brand.wordmark, settings.brand.domain, ...settings.brand.neverWrite, settings.people.approver, settings.people.legalReviewer].filter((t): t is string => !!t);
    nb.terms = [...new Set([...((nb.terms as string[] | undefined) ?? []), ...brandTerms])];
    out.noBrand = nb;
  }
  return out;
}

/** Reads one config file with its settings and voice merged in. Needs no rules file (gen-schema, suggest-links, similarity). */
export function readConfig(file: string = CONFIG_FILE): { config: Config; settings: Settings | null; voice: Voice | null; baseDir: string } {
  const baseDir = dirname(file);
  const raw = readJson(file);
  const { settings, voice } = readBrand(raw, baseDir);
  return { config: ConfigSchema.parse(mergeConfig(raw, settings, voice)), settings, voice, baseDir };
}

export function loadConfig(): Loaded {
  const { config, settings, voice, baseDir } = readConfig(CONFIG_FILE);
  const resolvePath = (p: string): string => resolve(baseDir, p);
  const rules = RulesConfigSchema.parse(mergeRules(readJson(resolvePath(config.paths.rulesConfig)), settings, voice));
  return { config, rules, settings, voice, baseDir, resolvePath };
}
