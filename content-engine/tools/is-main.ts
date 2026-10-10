/** True when the module at `metaUrl` is the script node was started with, also when either path is reached through a symlink. */
import { realpathSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const real = (p: string): string => { try { return realpathSync(p); } catch { return resolve(p); } };

export function isMain(metaUrl: string, argv1: string | undefined = process.argv[1]): boolean {
  if (!argv1) return false;
  try { return real(fileURLToPath(metaUrl)) === real(argv1); } catch { return false; }
}

/** A CLI failure (bad JSON, a config that does not validate) prints one FAIL line and exits 1, never a stack trace. */
export function cliError(tool: string, file: string, e: unknown): never {
  const msg = ((e as Error)?.message ?? String(e)).split("\n").map((l) => l.trim()).filter(Boolean).slice(0, 3).join(" ");
  console.log(`  FAIL ${tool} ${file}:1 ${msg}. Fix: correct the file named in the message, then run ${tool} again`);
  process.exit(1);
}
