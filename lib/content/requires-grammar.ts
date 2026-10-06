import { FEATURES } from "@/lib/flags";

/** Named predicates a page may use in `requires`. Each is resolved by the resolve context, never by the page. */
export const PREDICATES = ["verifiedReviews"] as const;

/** `A && B && C`; each term is `FEATURES.<flag>`, `claim:<id>`, `feature:<id>` or a named predicate. */
const TERM = /^(FEATURES\.[A-Za-z]+|claim:[a-z0-9-]+|feature:[a-z0-9-]+|[A-Za-z]+)$/;

export const splitRequires = (expr: string): string[] => expr.split("&&").map((t) => t.trim());

export function isValidRequires(expr: string): boolean {
  return splitRequires(expr).every((term) => {
    if (!TERM.test(term)) return false;
    if (term.startsWith("FEATURES.")) return term.slice("FEATURES.".length) in FEATURES;
    if (term.includes(":")) return true;
    return (PREDICATES as readonly string[]).includes(term);
  });
}

/** Tokens FAQ answers may contain. Anything else in double braces is rejected by the schema. */
export const TEMPLATE_TOKENS = ["pricing.summary"] as const;
export const TOKEN_RE = /\{\{\s*([A-Za-z.]+)\s*\}\}/g;
