/**
 * The content engine's CI sequence, in one command so a pull request fails if any step fails:
 * config, no-brand, links, schemas, register (with the governor cap), check-content on the changed files, posts (when a
 * WordPress API is configured), and the evaluation set. Every step runs; the exit code is 1 if any failed.
 * Usage: npx tsx content-engine/tools/ci.ts [--base <git ref>] [--files a,b] [--help]
 */
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { isMain } from "./is-main";
import { runTsx } from "./run-node";

const TOOLS = fileURLToPath(new URL(".", import.meta.url));
export type Step = { name: string; file: string; args: string[] };

export function steps(extra: string[]): Step[] {
  return [
    { name: "config", file: "check-config.ts", args: [] },
    { name: "no-brand", file: "check-no-brand.ts", args: [] },
    { name: "links", file: "check-links.ts", args: [] },
    { name: "schemas", file: "check-schemas.ts", args: [] },
    { name: "register", file: "check-register.ts", args: [] },
    { name: "changed content", file: "check-changed.ts", args: extra },
    { name: "posts", file: "wp-posts.ts", args: ["--optional", "--status", "publish"] },
    { name: "evaluation set", file: "eval.ts", args: [] },
  ];
}

if (isMain(import.meta.url)) {
  if (process.argv.includes("--help")) {
    console.log("ci [--base ref] [--files a,b]: run every content engine check; exit 1 if any fails.");
  } else {
    const extra = process.argv.slice(2);
    const failed: string[] = [];
    for (const s of steps(extra)) {
      console.log(`\n=== ${s.name} ===`);
      const r = runTsx([join(TOOLS, s.file), ...s.args], { stdio: "inherit" });
      if (r.status !== 0) failed.push(s.name);
    }
    console.log(failed.length ? `\nContent checks FAILED: ${failed.join(", ")}.` : "\nAll content checks passed.");
    process.exit(failed.length ? 1 : 0);
  }
}
