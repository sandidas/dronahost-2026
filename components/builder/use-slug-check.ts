"use client";

import { useEffect } from "react";
import { checkSlugAction } from "@/lib/portal/actions/posts";
import { slugPrefixWords, type SeoSource } from "@/lib/builder/seo-generate";
import { SLUG_PATTERN } from "@/lib/portal/slug";
import { useBuilder, useBuilderApi, type BuilderState } from "./store";

/** What the SEO generator reads from the editor. */
export const seoSource = (s: BuilderState): SeoSource => ({ doc: s.doc, kind: s.kind, title: s.meta.title, excerpt: s.meta.excerpt, keyword: s.meta.seo.focusKeyword });

const WAIT_MS = 500;

/**
 * Checks the slug against the database half a second after it changes, and keeps a free alternative ready (the slug
 * with one of the page's own words in front). The Page and SEO tabs show the result next to the slug field.
 */
export function useSlugCheck(): void {
  const api = useBuilderApi();
  const slug = useBuilder((s) => s.meta.slug);
  const kind = useBuilder((s) => s.kind);
  const postId = useBuilder((s) => s.postId);
  useEffect(() => {
    const set = api.getState().set;
    if (!slug || !SLUG_PATTERN.test(slug)) {
      set({ slugCheck: null });
      return;
    }
    set({ slugCheck: { slug, state: "checking" } });
    const timer = setTimeout(async () => {
      const res = await checkSlugAction({ slug, kind, postId, words: slugPrefixWords(seoSource(api.getState()), slug) }).catch(() => null);
      // A newer slug has been typed in the meantime: its own check reports.
      if (api.getState().meta.slug !== slug) return;
      set({ slugCheck: res?.ok ? { slug, state: res.data.state, suggestion: res.data.suggestion } : null });
    }, WAIT_MS);
    return () => clearTimeout(timer);
  }, [api, slug, kind, postId]);
}
