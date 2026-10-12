import { BUILDER_TEXT } from "@/content/portal-strings";
import { pick, type Field, type Props } from "../fields";

/**
 * The band around a content block (text, two columns, image, video, code): how wide its content runs, the space above
 * and below it, and its background. The same three choices on every content block, drawn by BlockShell
 * (components/builder/layout.tsx). Defaults: the site width, the normal section spacing, the page background.
 */

const F = BUILDER_TEXT.fields;

export const FRAME_WIDTHS = ["site", "narrow", "full"] as const;
export const FRAME_PADDINGS = ["normal", "none", "small", "large"] as const;
export const FRAME_BACKGROUNDS = ["default", "muted", "texture", "dark"] as const;

export type Frame = { width: (typeof FRAME_WIDTHS)[number]; padding: (typeof FRAME_PADDINGS)[number]; background: (typeof FRAME_BACKGROUNDS)[number] };

const options = <K extends string>(values: readonly K[], labels: Record<K, string>) => values.map((value) => ({ value, label: labels[value] }));

export const frameFields = (width: Frame["width"] = "site"): Field[] => [
  { kind: "select", key: "width", label: F.width, options: options([width, ...FRAME_WIDTHS.filter((w) => w !== width)], F.widths) },
  { kind: "select", key: "padding", label: F.padding, options: options(FRAME_PADDINGS, F.paddings) },
  { kind: "select", key: "background", label: F.background, options: options(FRAME_BACKGROUNDS, F.frameBackgrounds) },
];

export const frameOf = (p: Props, width: Frame["width"] = "site"): Frame => ({
  width: pick(p.width, FRAME_WIDTHS, width),
  padding: pick(p.padding, FRAME_PADDINGS, "normal"),
  background: pick(p.background, FRAME_BACKGROUNDS, "default"),
});
