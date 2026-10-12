import { BUILDER_TEXT } from "@/content/portal-strings";
import { entryByType } from "./catalog";
import type { LeafBlock, PostKind, RootBlock, SectionBlock } from "./model";

/**
 * Starting layouts for a new post or page. Every block starts empty, exactly as when it is added from the panel, so a
 * template never puts words on the site: publishing waits until each block is filled in.
 */
export type Template = { id: string; kind: PostKind; label: string; hint: string; blocks: () => RootBlock[] };

const T = BUILDER_TEXT.templates;
const block = (type: string) => entryByType(type)!.create() as RootBlock;
const leaf = (type: string) => entryByType(type)!.create() as LeafBlock;
function section(...children: string[]): RootBlock {
  const s = block("section") as SectionBlock;
  s.children = children.map(leaf);
  return s;
}

export const TEMPLATES: readonly Template[] = [
  { id: "landing", kind: "page", ...T.landing, blocks: () => [block("Hero"), block("SplitSection"), block("FeatureCards"), block("Faq"), block("CtaBand")] },
  { id: "service", kind: "page", ...T.service, blocks: () => [block("Hero"), block("FeatureCards"), block("Steps"), block("SplitSection"), block("Faq"), block("OfferBanner")] },
  { id: "guide", kind: "page", ...T.guide, blocks: () => [block("GuideBanner"), section("heading", "richtext"), block("AnswerBanner"), block("Faq"), block("ActionBand")] },
  { id: "article", kind: "post", ...T.article, blocks: () => [section("richtext")] },
  { id: "how-to", kind: "post", ...T.howTo, blocks: () => [section("richtext"), block("Steps"), section("heading", "richtext"), block("Faq")] },
];

export const templatesFor = (kind: PostKind): Template[] => TEMPLATES.filter((t) => t.kind === kind);
