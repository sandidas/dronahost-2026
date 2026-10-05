/**
 * Fails (exit 1) if any design-token text/background pair is below WCAG AA.
 * Run: npm run check:contrast   (also runs first in `npm run build`)
 */
import { readFileSync } from "node:fs";
import { evaluate, parseTokens } from "../lib/design/contrast";

const css = readFileSync("app/styles/tokens.css", "utf8");
const results = evaluate(parseTokens(css));
const failures = results.filter((r) => !r.pass);

for (const r of failures) {
  console.error(`FAIL [${r.theme}] ${r.label}: ${r.fg} on ${r.bg} = ${r.ratio.toFixed(2)}:1 (needs ${r.min}:1)`);
}
console.log(`Contrast check: ${results.length - failures.length}/${results.length} pairs pass`);
if (failures.length) process.exit(1);
