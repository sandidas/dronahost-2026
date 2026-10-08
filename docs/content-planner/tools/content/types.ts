export type Group = "Structure" | "Keyword" | "Voice" | "Facts" | "People" | "Experience" | "Sources" | "Metadata" | "Schema" | "Policy" | "Overlap" | "Blueprint" | "Flags";
export type Finding = { line: number; message: string };
export type RuleResult = { id: string; group: Group; name: string; ok: boolean; skipped?: boolean; failures: Finding[]; warnings: Finding[]; note?: string };

export const rule = (id: string, group: Group, name: string, failures: Finding[], extra: Partial<RuleResult> = {}): RuleResult => ({ id, group, name, ok: failures.length === 0, failures, warnings: [], ...extra });
export const skipped = (id: string, group: Group, name: string, note: string): RuleResult => ({ id, group, name, ok: true, skipped: true, failures: [], warnings: [], note });
export const esc = (t: string): string => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export const phraseRe = (p: string): RegExp => new RegExp(`(^|[^a-z])${esc(p)}([^a-z]|$)`, "i");
