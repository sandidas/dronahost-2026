/** Loads and validates content-planner.config.json and project/rules.config.json. Every tool starts here. */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ConfigSchema, type Config } from "../schemas/config";
import { RulesConfigSchema, type RulesConfig } from "../schemas/rules-config";

export const PLANNER_DIR = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const CONFIG_FILE = process.env.CONTENT_PLANNER_CONFIG ?? resolve(PLANNER_DIR, "content-planner.config.json");

export type Loaded = { config: Config; rules: RulesConfig; baseDir: string; resolvePath: (p: string) => string };

export function loadConfig(): Loaded {
  const baseDir = dirname(CONFIG_FILE);
  const config = ConfigSchema.parse(JSON.parse(readFileSync(CONFIG_FILE, "utf8")));
  const resolvePath = (p: string): string => resolve(baseDir, p);
  const rules = RulesConfigSchema.parse(JSON.parse(readFileSync(resolvePath(config.paths.rulesConfig), "utf8")));
  return { config, rules, baseDir, resolvePath };
}
