import { BUILDER_TEXT } from "@/content/portal-strings";
import { createBlock } from "./blocks";
import type { Block, PostKind } from "./model";

/**
 * Starting layouts for a new post or page. Every block starts empty, exactly as when it is added from the panel, so a
 * template never puts words on the site: a block left empty shows nothing.
 */
export type Template = { id: string; kind: PostKind; label: string; hint: string; blocks: () => Block[] };

const T = BUILDER_TEXT.templates;
const of = (...types: string[]) => () => types.map((t) => createBlock(t)!);

export const TEMPLATES: readonly Template[] = [
  { id: "landing", kind: "page", ...T.landing, blocks: of("CenteredHero", "SplitSection", "FeatureCards", "Faq", "CtaBand") },
  { id: "service", kind: "page", ...T.service, blocks: of("CenteredHero", "FeatureCards", "Steps", "SplitSection", "Faq", "OfferSplit") },
  { id: "guide", kind: "page", ...T.guide, blocks: of("GuideBanner", "Text", "AnswerBanner", "Faq", "ActionBand") },
  { id: "gallery", kind: "page", ...T.gallery, blocks: of("CenteredHero", "Gallery", "Text", "CtaBand") },
  { id: "article", kind: "post", ...T.article, blocks: of("Text") },
  { id: "how-to", kind: "post", ...T.howTo, blocks: of("Text", "Steps", "Text", "Faq") },
];

export const templatesFor = (kind: PostKind): Template[] => TEMPLATES.filter((t) => t.kind === kind);
