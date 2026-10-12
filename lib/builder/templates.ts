import { BUILDER_TEXT } from "@/content/portal-strings";
import { createBlock } from "./blocks";
import type { Block } from "./model";

/**
 * Starting layouts for a new post or page: one list for both, since posts and pages share one editor. Every block starts empty, exactly as when it is added from the panel, so a
 * template never puts words on the site: a block left empty shows nothing.
 */
export type Template = { id: string; label: string; hint: string; blocks: () => Block[] };

const T = BUILDER_TEXT.templates;
const of = (...types: string[]) => () => types.map((t) => createBlock(t)!);

export const TEMPLATES: readonly Template[] = [
  { id: "landing", ...T.landing, blocks: of("CenteredHero", "SplitSection", "FeatureCards", "Faq", "CtaBand") },
  { id: "service", ...T.service, blocks: of("CenteredHero", "FeatureCards", "Steps", "SplitSection", "Faq", "OfferSplit") },
  { id: "guide", ...T.guide, blocks: of("GuideBanner", "Text", "AnswerBanner", "Faq", "ActionBand") },
  { id: "gallery", ...T.gallery, blocks: of("CenteredHero", "Gallery", "Text", "CtaBand") },
  { id: "article", ...T.article, blocks: of("Text") },
  { id: "how-to", ...T.howTo, blocks: of("Text", "Steps", "Text", "Faq") },
];
