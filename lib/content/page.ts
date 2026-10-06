import { defaultContext, passes, type ResolveContext } from "./refs";
import { PageSpec, type PageSpecData } from "./schemas/page";
import type { SectionSpec } from "./schemas/sections";

/** Parse and validate a page spec. Throws a readable error listing every problem, so an invalid page fails the build. */
export function parsePage(input: unknown): PageSpecData {
  const result = PageSpec.safeParse(input);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  - ${i.path.join(".") || "(page)"}: ${i.message}`);
    throw new Error(`Invalid page spec:\n${lines.join("\n")}`);
  }
  return result.data;
}

/** Sections that pass their own `requires` and `requiresClaim`. Hidden sections leave no gap. */
export const visibleSections = (spec: PageSpecData, ctx: ResolveContext = defaultContext): SectionSpec[] =>
  (spec.sections as SectionSpec[]).filter((s) => passes(s, ctx));
