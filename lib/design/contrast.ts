/**
 * WCAG contrast helpers + the token pairs that must pass.
 * Used by `scripts/check-contrast.ts` (build gate) and the /v2/design-system page.
 * Parses `app/styles/tokens.css`, so the CSS stays the single source of truth.
 */

export type Theme = "light" | "dark";
export type TokenMap = Record<string, string>;

export type PairSpec = {
  fg: string;
  bg: string;
  /** Minimum ratio: 4.5 normal text, 3 large text / UI components. */
  min: 4.5 | 3;
  label: string;
  /** Blend `bg` over `under` at this opacity (tinted badge backgrounds). */
  blend?: { under: string; alpha: number };
};

export type PairResult = PairSpec & { theme: Theme; ratio: number; pass: boolean };

const HEX = /^#([0-9a-f]{6})$/i;

/** Extracts `--token: #rrggbb;` declarations per theme from tokens.css. */
export function parseTokens(css: string): Record<Theme, TokenMap> {
  const out: Record<Theme, TokenMap> = { light: {}, dark: {} };
  const rules = css.matchAll(/([^{}]+)\{([^{}]*)\}/g);
  for (const [, rawSelector, body] of rules) {
    const selector = rawSelector.replace(/\/\*[\s\S]*?\*\//g, "").trim();
    const targets: Theme[] = [];
    if (/\.dark\b/.test(selector) && !/\.light\b/.test(selector)) targets.push("dark");
    else if (/(^|,)\s*(:root|\.light)\b/.test(selector) && !/\.dark\b/.test(selector)) targets.push("light");
    for (const m of body.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{6})\s*;/g)) {
      for (const t of targets) out[t][m[1]] = m[2].toLowerCase();
    }
  }
  return out;
}

const channel = (v: number) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export function luminance(hex: string): number {
  const m = HEX.exec(hex);
  if (!m) throw new Error(`Not a 6-digit hex color: ${hex}`);
  const n = parseInt(m[1], 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

export function blend(over: string, under: string, alpha: number): string {
  const o = parseInt(over.slice(1), 16);
  const u = parseInt(under.slice(1), 16);
  const mix = (shift: number) =>
    Math.round(((o >> shift) & 255) * alpha + ((u >> shift) & 255) * (1 - alpha))
      .toString(16)
      .padStart(2, "0");
  return `#${mix(16)}${mix(8)}${mix(0)}`;
}

const surfaces = ["background", "card", "surface-raised", "muted"] as const;
const text = (fg: string, min: 4.5 | 3 = 4.5, label = fg): PairSpec[] =>
  surfaces.map((bg) => ({ fg, bg, min, label: `${label} on ${bg}` }));

/** Every text/background (and key UI) pair the design system promises. */
export const PAIRS: PairSpec[] = [
  ...text("foreground"),
  ...text("muted-foreground"),
  ...text("subtle-foreground"),
  ...text("link"),
  ...text("action", 4.5, "action (text)"),
  { fg: "ring", bg: "background", min: 3, label: "focus ring on background" },
  { fg: "ring", bg: "card", min: 3, label: "focus ring on card" },
  { fg: "on-action", bg: "action-fill", min: 4.5, label: "button label on action fill" },
  { fg: "on-action", bg: "action-fill-hover", min: 4.5, label: "button label on action fill (hover)" },
  { fg: "on-action", bg: "action-fill-active", min: 4.5, label: "button label on action fill (active)" },
  { fg: "accent-foreground", bg: "accent", min: 4.5, label: "label on accent fill" },
  { fg: "accent-foreground", bg: "accent-hover", min: 4.5, label: "label on accent fill (hover)" },
  { fg: "success", bg: "success-surface", min: 4.5, label: "success text on its surface" },
  { fg: "warning", bg: "warning-surface", min: 4.5, label: "warning text on its surface" },
  { fg: "danger", bg: "danger-surface", min: 4.5, label: "danger text on its surface" },
  { fg: "success", bg: "card", min: 4.5, label: "success text on card" },
  { fg: "warning", bg: "card", min: 4.5, label: "warning text on card" },
  { fg: "danger", bg: "card", min: 4.5, label: "danger text on card" },
  { fg: "inverse-foreground", bg: "inverse-surface", min: 4.5, label: "text on inverse band" },
  { fg: "inverse-muted", bg: "inverse-surface", min: 4.5, label: "muted text on inverse band" },
  { fg: "action", bg: "card", min: 4.5, label: "action badge text on 12% tint", blend: { under: "card", alpha: 0.12 } },
  { fg: "link", bg: "accent", min: 4.5, label: "teal badge text on 12% tint", blend: { under: "card", alpha: 0.12 } },
];

export function evaluate(tokens: Record<Theme, TokenMap>, pairs: PairSpec[] = PAIRS): PairResult[] {
  const results: PairResult[] = [];
  for (const theme of ["light", "dark"] as const) {
    const t = tokens[theme];
    for (const spec of pairs) {
      const fg = t[spec.fg];
      let bg = t[spec.bg];
      if (!fg || !bg) throw new Error(`Missing token for "${spec.label}" (${spec.fg} / ${spec.bg}) in ${theme}`);
      if (spec.blend) {
        const under = t[spec.blend.under];
        bg = blend(bg, under, spec.blend.alpha);
      }
      const ratio = contrastRatio(fg, bg);
      results.push({ ...spec, theme, ratio, pass: ratio >= spec.min });
    }
  }
  return results;
}
