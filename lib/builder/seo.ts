import { slugify } from "@/lib/portal/slug";
import { blockText, docHeadings, docImages } from "./doc";
import type { BuilderDoc } from "./model";

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

export { faqEntries } from "./doc";

export type SeoCheck = { id: string; ok: boolean };

type CheckInput = { seo: PostSeo; title: string; excerpt: string; slug: string; doc: BuilderDoc; kind: "post" | "page" };

const has = (haystack: string, needle: string) => needle.length > 0 && haystack.toLowerCase().includes(needle.toLowerCase());

/**
 * The SEO tab's checklist. Each check is a plain fact about the page; none of them is a ranking promise. The ids map to
 * sentences in content/portal-strings.ts (BUILDER_TEXT.seo.checks).
 */
export function seoChecks({ seo, title, excerpt, slug, doc, kind }: CheckInput): SeoCheck[] {
  const kw = seo.focusKeyword.trim();
  const searchTitle = seo.title.trim() || title.trim();
  const description = seo.description.trim() || excerpt.trim();
  const [h1, ...rest] = docHeadings(doc, title, kind);
  const levels = rest.map((h) => h.level);
  const skips = levels.some((l, i) => l > (i === 0 ? 2 : (levels[i - 1] ?? 2) + 1));
  // The first words a reader sees in the body.
  const opening = doc.blocks.map(blockText).find(Boolean) ?? "";
  return [
    { id: "keywordSet", ok: kw.length > 0 },
    { id: "keywordInTitle", ok: has(searchTitle, kw) },
    { id: "keywordInDescription", ok: has(description, kw) },
    { id: "keywordInH1", ok: has(h1?.text ?? "", kw) },
    { id: "keywordInSlug", ok: kw.length > 0 && slug.includes(slugify(kw)) },
    { id: "keywordInOpening", ok: has(opening, kw) },
    { id: "titleLength", ok: searchTitle.length >= SEO_LIMITS.title.min && searchTitle.length <= SEO_LIMITS.title.max },
    { id: "descriptionLength", ok: description.length >= SEO_LIMITS.description.min && description.length <= SEO_LIMITS.description.max },
    { id: "imagesHaveAlt", ok: docImages(doc).every((img) => img.alt.trim().length > 0) },
    { id: "headingOrder", ok: !skips },
    { id: "indexable", ok: !seo.noindex },
  ];
}
