/** Converts the HTML of a CMS post to Markdown in plain code (no library). Covers what a post body uses; other tags are stripped. */

const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…",
  lsquo: "‘", rsquo: "’", ldquo: "“", rdquo: "”", copy: "©", reg: "®", trade: "™",
  bull: "•", middot: "·", laquo: "«", raquo: "»", euro: "€", pound: "£", times: "×",
};

export function decodeEntities(s: string): string {
  return s.replace(/&(?:#(\d+)|#x([0-9a-f]+)|([a-z]+));/gi, (m, dec?: string, hex?: string, name?: string) => {
    const code = dec ? Number(dec) : hex ? parseInt(hex, 16) : NaN;
    if (!Number.isNaN(code)) return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    return name ? NAMED[name.toLowerCase()] ?? m : m;
  });
}

const BLOCKS = new Set(["p", "div", "section", "article", "header", "footer", "main", "aside", "figure", "figcaption", "table", "hr"]);
const attr = (tag: string, name: string): string | undefined => {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? decodeEntities(m[1] ?? m[2] ?? m[3] ?? "") : undefined;
};

export function htmlToMarkdown(html: string): string {
  const saved: string[] = [];
  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<(script|style|iframe)\b[\s\S]*?<\/\1\s*>/gi, "")
    .replace(/<(script|style|iframe)\b[^>]*\/?>/gi, "")
    .replace(/<pre\b[^>]*>([\s\S]*?)<\/pre\s*>/gi, (_m, inner: string) => {
      saved.push(decodeEntities(inner.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "")).replace(/^\n+|\n+$/g, ""));
      return `<pre-slot n="${saved.length - 1}">`;
    });

  let out = "";
  const stack: { out: string; kind: "quote" | "link"; href?: string }[] = [];
  const lists: { ordered: boolean; n: number }[] = [];
  // Table rows become Markdown rows ("| a | b |"), with a separator after a header row, so cells never run together.
  let row: { cells: number; header: boolean } | null = null;
  let headerDone = false;
  const breakBlock = (): void => { if (out !== "" && !out.endsWith("\n\n")) out = out.replace(/[ \t]+$/, "").replace(/\n?$/, "\n\n"); };
  const newLine = (): void => { if (out !== "" && !out.endsWith("\n")) out += "\n"; };

  for (const tok of cleaned.split(/(<\/?[a-zA-Z][^>]*>)/)) {
    const tag = tok.match(/^<(\/?)([a-zA-Z][a-zA-Z0-9-]*)/);
    if (!tag || !tok.startsWith("<")) {
      const text = decodeEntities(tok).replace(/\s+/g, " ").replace(/\|/g, row ? "\\|" : "|");
      out += out === "" || /(\n|\| )$/.test(out) ? text.replace(/^ /, "") : text;
      continue;
    }
    const close = tag[1] === "/";
    const name = tag[2].toLowerCase();
    if (/^h[1-6]$/.test(name)) { breakBlock(); if (!close) out += `${"#".repeat(Number(name[1]))} `; else breakBlock(); }
    else if (name === "ul" || name === "ol") {
      if (close) { lists.pop(); newLine(); if (lists.length === 0) breakBlock(); }
      else { if (lists.length === 0) breakBlock(); else newLine(); lists.push({ ordered: name === "ol", n: 0 }); }
    } else if (name === "li") {
      if (close) newLine();
      else {
        newLine();
        const cur = lists[lists.length - 1] ?? { ordered: false, n: 0 };
        cur.n += 1;
        out += `${"  ".repeat(Math.max(0, lists.length - 1))}${cur.ordered ? `${cur.n}.` : "-"} `;
      }
    } else if (name === "tr") {
      if (!close) { newLine(); out += "|"; row = { cells: 0, header: false }; }
      else if (row) {
        if (row.header && !headerDone && row.cells) { out += `\n|${" --- |".repeat(row.cells)}`; headerDone = true; }
        newLine();
        row = null;
      }
    } else if (name === "td" || name === "th") {
      if (!row) continue;
      if (!close) { out += " "; row.cells++; if (name === "th") row.header = true; }
      else out = `${out.replace(/[ \t]+$/, "")} |`;
    } else if (name === "table") { breakBlock(); headerDone = false; }
    else if (name === "br") { out = out.replace(/[ \t]+$/, "") + "\n"; }
    else if (name === "strong" || name === "b") out += "**";
    else if (name === "em" || name === "i") out += "*";
    else if (name === "code") out += "`";
    else if (name === "pre-slot") { breakBlock(); out += "```\n" + saved[Number(attr(tok, "n") ?? -1)] + "\n```"; breakBlock(); }
    else if (name === "a") {
      if (!close) { stack.push({ out, kind: "link", href: attr(tok, "href") }); out = ""; }
      else if (stack[stack.length - 1]?.kind === "link") {
        const top = stack.pop();
        const text = out.replace(/\s+/g, " ").trim();
        out = top!.out + (top!.href && text ? `[${text}](${top!.href})` : text);
      }
    } else if (name === "blockquote") {
      if (!close) { breakBlock(); stack.push({ out, kind: "quote" }); out = ""; }
      else if (stack[stack.length - 1]?.kind === "quote") {
        const top = stack.pop();
        const quoted = out.trim().split("\n").map((l) => (l.trim() === "" ? ">" : `> ${l}`)).join("\n");
        out = top!.out;
        breakBlock();
        out += quoted;
        breakBlock();
      }
    } else if (BLOCKS.has(name)) breakBlock();
  }
  while (stack.length) { const top = stack.pop()!; out = top.out + out; }
  return out
    .split("\n").map((l) => l.replace(/[ \t]+$/, "")).join("\n")
    .replace(/\n{3,}/g, "\n\n").trim();
}
