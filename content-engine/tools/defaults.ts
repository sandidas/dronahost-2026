/** Defaults a new project starts from. init-project writes them into the project's own config; the project then owns them. */
export const DEFAULT_PLAN_ROUTING: { plan: string; patterns: string[] }[] = [
  { plan: "02", patterns: ["\\bvs\\b", "alternatives?\\b", "\\bcompare\\b", "comparison"] },
  { plan: "14", patterns: ["\\bmigrat", "move my .{0,25}(site|website)", "switch host", "business email", "email hosting", "email for (my |a )?domain"] },
  { plan: "08", patterns: ["\\bdomains?\\b", "\\.com\\b", "\\.co\\.uk\\b", "\\btransfer\\b", "\\btld\\b"] },
  { plan: "05", patterns: ["\\b(uk|us|usa|eu|uae|europe|german|germany|france|netherlands|ireland|dubai)\\b.*\\b(hosting|delivery|service)\\b", "\\b(hosting|delivery|service)\\b.*\\b(uk|us|usa|eu|uae|europe|germany|france|netherlands|ireland|dubai)\\b"] },
  { plan: "07", patterns: ["\\bgdpr\\b", "\\bdpa\\b", "data processing", "\\bccpa\\b", "privacy", "\\bterms\\b", "refund policy", "\\bsla\\b"] },
  { plan: "06", patterns: ["\\bagency\\b", "\\bservices?\\b", "\\bhire\\b", "\\bredesign\\b", "\\bdeveloper\\b", "\\bmaintenance\\b", "web design"] },
  { plan: "04", patterns: ["\\bslow\\b", "\\bhacked\\b", "\\berror\\b", "\\bfix\\b", "\\bwhy is\\b", "\\bnot (working|rising)\\b", "\\bttfb\\b"] },
  { plan: "15", patterns: ["\\breviews?\\b.*\\b(trustpilot|g2|hostadvice|clutch)\\b", "\\bpartnership\\b", "\\bpress\\b"] },
  { plan: "03", patterns: ["^how to\\b", "^what is\\b", "\\bguide\\b", "\\bchecklist\\b", "\\bexplained\\b", "^how (do|does|can)\\b"] },
  { plan: "01", patterns: ["\\bbuy\\b", "\\bprice\\b", "\\bplans?\\b", "\\bsubscription\\b", "\\bhosting\\b"] },
];

export const DEFAULT_IDIOMS = [
  "go the extra mile", "at the end of the day", "think outside the box", "hit the ground running", "low-hanging fruit", "touch base",
  "ballpark figure", "move the needle", "game plan", "raise the bar", "in a nutshell", "piece of cake", "hit the nail on the head",
  "back to square one", "the ball is in your court",
];

/** Keys of a page spec whose strings are structure, not copy, when a project has no page-spec adapter. */
export const DEFAULT_NON_COPY_KEYS = ["id", "type", "variant", "icon", "href", "source", "show", "highlight", "claims", "links", "requires"];
export const DEFAULT_LABEL_KEYS = ["label", "cta"];

export const DEFAULT_WORDPRESS = {
  apiUrlEnv: "WORDPRESS_API_URL", userEnv: "WORDPRESS_USER", passwordEnv: "WORDPRESS_APP_PASSWORD", webhookSecretEnv: "CONTENT_WEBHOOK_SECRET",
  urlTemplate: "/kb/{slug}",
  fields: {
    title: "title.rendered", slug: "slug", content: "content.rendered", author: "_embedded.author.0.name", seo_title: "meta.seo_title",
    meta_description: "meta.meta_description", primary_keyword: "meta.primary_keyword", plan: "meta.plan", locale: "meta.locale",
    reviewer: "meta.reviewer", ai_assisted: "meta.ai_assisted", reviewed_on: "meta.reviewed_on", next_review_on: "meta.next_review_on",
    author_page: "meta.author_page", reviews_source: "meta.reviews_source", url_path: "meta.url_path",
  },
  stateMap: { draft: "Draft", "auto-draft": "Draft", pending: "Ready for owner review", future: "Ready for owner review", publish: "Published", private: "Published" },
};

/** FAQ item counts by page archetype, which plan belongs to which archetype, and how another system's archetype names map to ours. */
export const DEFAULT_FAQ_BY_ARCHETYPE: Record<string, [number, number]> = { money: [6, 8], pricing: [6, 8], guide: [4, 6], brand: [4, 6] };
export const DEFAULT_ARCHETYPE_BY_PLAN: Record<string, string> = {
  "01": "money", "02": "guide", "03": "guide", "04": "guide", "05": "money", "06": "money", "07": "guide", "08": "money", "09": "brand", "10": "guide", "14": "guide", "15": "brand",
};
export const DEFAULT_ARCHETYPE_ALIASES: Record<string, string> = { product: "money", landing: "money", decision: "guide", trust: "brand" };
