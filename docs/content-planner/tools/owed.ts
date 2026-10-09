/**
 * owed: what the owner still owes, per page. Reads the host's visibility result (which sections are hidden and which facts
 * would show them) and the project's profile data (`owed`: a missing fact matched to what only a person can supply).
 * Prints a list that is the same every run, so it replaces a hand-written "facts still owed" list. Adds nothing.
 * Usage: npx tsx docs/content-planner/tools/owed.ts [page path ...] [--help]. Exit 0 always: this is a report, not a gate.
 */
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { loadContext, loadProfiles } from "./content/context";
import { loadVisibility } from "./content/rules-blueprint";

export type Owed = { label: string; who: string; hides: string[] };

/** Groups the hidden sections of one page by the thing the owner must supply. Facts with no `owed` entry are listed as they are. */
export function owedFor(sections: { id: string; type: string; visible: boolean; missing: string[] }[], owed: { match: string; label: string; who: string }[]): Owed[] {
  const out = new Map<string, Owed>();
  for (const s of sections) {
    if (s.visible) continue;
    const keys = s.missing.length ? s.missing : [""];
    for (const m of keys) {
      const probe = `${s.type}|${m}`;
      const entry = owed.find((o) => new RegExp(o.match, "i").test(probe) || new RegExp(o.match, "i").test(m));
      const label = entry?.label ?? (m ? `A fact the page needs: ${m}` : `Content for the ${s.type} section`);
      const cur = out.get(label) ?? { label, who: entry?.who ?? "owner", hides: [] };
      if (!cur.hides.includes(s.id)) cur.hides.push(s.id);
      out.set(label, cur);
    }
  }
  return [...out.values()];
}

const invoked = process.argv[1] ? resolve(process.argv[1]) === fileURLToPath(import.meta.url) : false;
async function main(): Promise<void> {
  if (process.argv.includes("--help")) {
    console.log("owed [page path ...]: for each page, list the facts and content only a person can supply, from the hidden sections. Needs adapters.pageVisibility and paths.profiles.");
    return;
  }
  const ctx = await loadContext();
  const profiles = loadProfiles(ctx);
  const vis = loadVisibility(ctx);
  if (!vis || !profiles) {
    console.log("Nothing to report: the visibility adapter or the profile data (paths.profiles) is not configured.");
    return;
  }
  const wanted = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  for (const [path, page] of Object.entries(vis.pages)) {
    if (wanted.length && !wanted.includes(path)) continue;
    const list = owedFor(page.sections, profiles.owed);
    const hidden = page.sections.filter((s) => !s.visible).length;
    console.log(`\n${path}: ${page.sections.length - hidden} of ${page.sections.length} sections visible`);
    if (!list.length) console.log("  Nothing owed: every section shows.");
    for (const o of list) console.log(`  - ${o.label} (from: ${o.who}; shows: ${o.hides.join(", ")})`);
  }
}

if (invoked) void main();
