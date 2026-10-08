/**
 * Alias. `npm run lint:content` is now check-content on the page specs (docs/content-planner/tools/check-content.ts), which
 * performs every check the old page linter did (parity proven in docs/content-planner/tools/parity.test.ts). This file stays
 * only so old links work; lib/content/lint.ts is no longer used by any tool and can be removed with the owner's approval.
 */
import { spawnSync } from "node:child_process";

const dir = process.argv[2] ?? "content/pages";
const r = spawnSync("npx", ["tsx", "docs/content-planner/tools/check-content.ts", dir], { stdio: "inherit" });
process.exit(r.status ?? 1);
