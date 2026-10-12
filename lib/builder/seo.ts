import { docText, type TiptapNode } from "@/lib/editor/schema";
import { slugify } from "@/lib/portal/slug";
import type { BuilderDoc } from "./model";
import { prepareSection, sectionText } from "./sections";
import { flatten } from "./tree";

/**
 * Search settings for one post or page, edited in the builder's SEO tab. Empty strings mean "use the default": the
 * title, the summary, the page's own address, the cover image. Client-safe (the editor runs the checks live).
 */
export type PostSeo = {
  /** Shown as the search result title. Default: the post or page title. */
  title: string;
  /** Meta description. Default: the summary. */
  description: string;
  /** The phrase the page should rank for; drives the checklist only, never output on the page. */
  focusKeyword: string;
  /** A site path or a full address on this site. Default: the page's own address. */
  canonical: string;
  noindex: boolean;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  /** Add FAQPage structured data from the page's FAQ blocks. */
  faqSchema: boolean;
};

export const DEFAULT_SEO: PostSeo = { title: "", description: "", focusKeyword: "", canonical: "", noindex: false, ogTitle: "", ogDescription: "", ogImage: "", faqSchema: true };

/** Reads stored settings safely: older documents have none, and anything of the wrong type falls back to the default. */
export function normalizeSeo(raw: unknown): PostSeo {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const text = (k: keyof PostSeo) => (typeof r[k] === "string" ? (r[k] as string) : (DEFAULT_SEO[k] as string));
  return {
    title: text("title"),
    description: text("description"),
    focusKeyword: text("focusKeyword"),
    canonical: text("canonical"),
    noindex: r.noindex === true,
    ogTitle: text("ogTitle"),
    ogDescription: text("ogDescription"),
    ogImage: text("ogImage"),
    faqSchema: r.faqSchema !== false,
  };
}

export const SEO_LIMITS = { title: { min: 30, max: 60 }, description: { min: 70, max: 160 } } as const;

/** Questions and answers from the page's FAQ blocks, for FAQPage structured data and the editor's notice. */
export function faqEntries(doc: BuilderDoc): { question: string; answer: string }[] {
  return doc.blocks.flatMap((b) => (b.type === "site" && b.section.type === "Faq" ? (prepareSection("Faq", b.section.content)?.items ?? []) : []));
}

export type SeoCheck = { id: string; ok: boolean };

type CheckInput = { seo: PostSeo; title: string; excerpt: string; slug: string; doc: BuilderDoc; kind: "post" | "page" };

const has = (haystack: string, needle: string) => needle.length > 0 && haystack.toLowerCase().includes(needle.toLowerCase());

function headingLevels(doc: BuilderDoc): number[] {
  const levels: number[] = [];
  const walkTiptap = (n: TiptapNode) => {
    if (n.type === "heading") levels.push(Number(n.attrs?.level ?? 2));
    (n.content ?? []).forEach(walkTiptap);
  };
  for (const { block } of flatten(doc)) {
    if (block.type === "heading") levels.push(block.props.level);
    if (block.type === "richtext" && typeof block.props.content !== "string") walkTiptap(block.props.content);
    if (block.type === "site" && block.section.type !== "Hero" && prepareSection(block.section.type, block.section.content)) levels.push(2);
  }
  return levels;
}

/** The first words a reader sees in the body: the first text block, or the hero's summary. */
function openingText(doc: BuilderDoc): string {
  for (const { block } of flatten(doc)) {
    if (block.type === "richtext") return typeof block.props.content === "string" ? block.props.content : docText(block.props.content);
    if (block.type === "site") {
      const t = sectionText(block.section.type, block.section.content);
      if (t) return t;
    }
  }
  return "";
}

/**
 * The SEO tab's checklist. Each check is a plain fact about the page; none of them is a ranking promise. The ids map to
 * sentences in content/portal-strings.ts (BUILDER_TEXT.seo.checks).
 */
export function seoChecks({ seo, title, excerpt, slug, doc, kind }: CheckInput): SeoCheck[] {
  const kw = seo.focusKeyword.trim();
  const searchTitle = seo.title.trim() || title.trim();
  const description = seo.description.trim() || excerpt.trim();
  const first = doc.blocks[0];
  const heroTitle = kind === "page" && first?.type === "site" && first.section.type === "Hero" ? prepareSection("Hero", first.section.content)?.title : undefined;
  const h1 = heroTitle ?? title;
  const levels = headingLevels(doc);
  const skips = levels.some((l, i) => l > (i === 0 ? 2 : (levels[i - 1] ?? 2) + 1));
  const images = flatten(doc).flatMap(({ block }) => {
    if (block.type === "image") return block.props.src ? [block.props.alt] : [];
    if (block.type === "site" && (block.section.type === "SplitSection" || block.section.type === "Hero")) {
      const img = (block.section.content as { image?: { src?: unknown; alt?: unknown } }).image;
      return typeof img?.src === "string" && img.src.trim() ? [String(img.alt ?? "")] : [];
    }
    return [];
  });
  const checks: SeoCheck[] = [
    { id: "keywordSet", ok: kw.length > 0 },
    { id: "keywordInTitle", ok: has(searchTitle, kw) },
    { id: "keywordInDescription", ok: has(description, kw) },
    { id: "keywordInH1", ok: has(h1, kw) },
    { id: "keywordInSlug", ok: kw.length > 0 && slug.includes(slugify(kw)) },
    { id: "keywordInOpening", ok: has(openingText(doc), kw) },
    { id: "titleLength", ok: searchTitle.length >= SEO_LIMITS.title.min && searchTitle.length <= SEO_LIMITS.title.max },
    { id: "descriptionLength", ok: description.length >= SEO_LIMITS.description.min && description.length <= SEO_LIMITS.description.max },
    { id: "imagesHaveAlt", ok: images.every((alt) => alt.trim().length > 0) },
    { id: "headingOrder", ok: !skips },
    { id: "indexable", ok: !seo.noindex },
  ];
  return checks;
}
