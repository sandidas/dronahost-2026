/** Reads the flat `key: value` front matter used by briefs and post drafts. Not a YAML parser: one line per key. */
export function parseFrontMatter(text: string): { front: Record<string, string>; body: string } {
  const lines = text.split("\n");
  if (lines[0]?.trim() !== "---") return { front: {}, body: text };
  const front: Record<string, string> = {};
  let i = 1;
  for (; i < lines.length && lines[i].trim() !== "---"; i++) {
    const m = lines[i].match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) front[m[1]] = m[2].trim().replace(/^"(.*)"$/, "$1");
  }
  return { front, body: lines.slice(i + 1).join("\n") };
}
