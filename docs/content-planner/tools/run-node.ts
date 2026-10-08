/** Runs a TypeScript tool with tsx through Node itself: no shell, no `npx`, no quoting, so it works the same on macOS, Linux and Windows. */
import { type SpawnSyncOptions, spawnSync } from "node:child_process";
import { createRequire } from "node:module";

export const tsxCli = (): string => createRequire(import.meta.url).resolve("tsx/cli");

export function runTsx(args: string[], opts: SpawnSyncOptions = {}) {
  return spawnSync(process.execPath, [tsxCli(), ...args], opts);
}
