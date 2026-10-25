import { z } from "zod";
import { CLAIMS } from "@/content/claims";
import { computeLayoutSignature } from "../layout-signature";
import { Cta, Href, Slug } from "./common";
import { Section, type SectionSpec } from "./sections";

/** Every string in a value, depth first. Used by the cross-field checks below. */
export function* walkStrings(value: unknown): Generator<string> {
  if (typeof value === "string") yield value;
  else if (Array.isArray(value)) for (const v of value) yield* walkStrings(v);
  else if (value && typeof value === "object") for (const v of Object.values(value)) yield* walkStrings(v);
}

/** Every link a page puts on screen: any `href` field's value. */
export function collectHrefs(value: unknown, found: Set<string> = new Set()): Set<string> {
  if (Array.isArray(value)) {
    for (const v of value) collectHrefs(v, found);
  } else if (value && typeof value === "object") {
    for (const [key, v] of Object.entries(value)) {
      if (key === "href" && typeof v === "string") {
        found.add(v);
      } else if (key === "links" && Array.isArray(v)) {
        for (const link of v) if (typeof link === "string") found.add(link);
      } else if (key === "claims" && Array.isArray(v)) {
        // An assurance claim renders with a link to its published terms page ("Read the SLA"), so that page counts as linked.
        for (const ref of v) {
          const claim = typeof ref === "string" ? CLAIMS.find((c) => `claim:${c.id}` === ref) : undefined;
          if (claim?.verified && claim.termsPage && claim.termsLabel) found.add(claim.termsPage);
        }
      } else {
        collectHrefs(v, found);
      }
    }
  }
  return found;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const PageSpec = z
  .strictObject({
    id: Slug,
    path: Href,
    /** The page blueprint this page follows (project/blueprints.json), for example "C1". check-content enforces it. */
    blueprint: z.string().regex(/^C\d{1,2}[a-z]?$/, 'must look like "C1" or "C10a"').optional(),
    archetype: z.enum(["product", "decision", "trust", "landing"]),
    intent: z.string().min(3),
    /** The search intent the page serves (rules/search-intent.md). check-content tests that the page shows what that intent needs. */
    searchIntent: z.enum(["Learn", "Solve", "Compare", "Buy", "Find", "Plan"]).optional(),
    /** A second intent the page also serves. Its needs are checked as warnings. */
    secondaryIntent: z.enum(["Learn", "Solve", "Compare", "Buy", "Find", "Plan"]).optional(),
    audience: z.string().min(10),
    primaryKeyword: z.string().min(3),
    secondaryKeywords: z.array(z.string().min(3)).max(8),
    /** Declared by the author and checked against the sections, so it cannot drift. */
    layoutSignature: z.array(z.string()).min(2).max(6),
    seo: z.strictObject({
      title: z.string().min(10).max(60),
      description: z.string().min(50).max(160),
      ogImage: z.string().regex(/^\/og\/[a-z0-9-]+\.jpg$/, "must be /og/<slug>.jpg"),
      schema: z.array(z.enum(["Organization", "WebSite", "Product", "Service", "Article", "BreadcrumbList", "FAQPage", "Offer"])).min(1),
    }),
    rules: z.strictObject({
      primaryCta: Cta,
      requiredSections: z.array(Slug).min(1),
      mustLinkTo: z.array(Href),
      forbiddenClaims: z.array(z.string().min(2)),
      reviewedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "YYYY-MM-DD"),
    }),
    /** Rules the owner has overruled for this page (check-content shows their failures as warnings). Needs a reason and an approver. */
    waivers: z.strictObject({ rules: z.array(z.string().regex(/^[A-Z]{1,3}\d{1,2}$/)).min(1), reason: z.string().min(10), approvedBy: z.string().min(3) }).optional(),
    sections: z.array(Section).min(3).max(14),
  })
  .superRefine((page, ctx) => {
    const sections = page.sections as SectionSpec[];
    const ids = sections.map((s) => s.id);
    const dup = ids.find((id, i) => ids.indexOf(id) !== i);
    if (dup) ctx.addIssue({ code: "custom", path: ["sections"], message: `duplicate section id "${dup}"` });

    if (sections[0] && !/Hero$/.test(sections[0].type)) ctx.addIssue({ code: "custom", path: ["sections", 0], message: "the first section must be a hero" });

    for (const required of page.rules.requiredSections) {
      if (!ids.includes(required)) ctx.addIssue({ code: "custom", path: ["rules", "requiredSections"], message: `required section "${required}" is missing` });
    }

    const links = collectHrefs(sections);
    for (const must of page.rules.mustLinkTo) {
      if (!links.has(must)) ctx.addIssue({ code: "custom", path: ["rules", "mustLinkTo"], message: `the page never links to ${must}` });
    }

    const text = [...walkStrings(sections)].join("\n");
    for (const word of page.rules.forbiddenClaims) {
      if (new RegExp(`\\b${escapeRe(word)}\\b`, "i").test(text)) ctx.addIssue({ code: "custom", path: ["rules", "forbiddenClaims"], message: `copy contains the forbidden word "${word}"` });
    }

    const computed = computeLayoutSignature(sections);
    if (computed.join("|") !== page.layoutSignature.join("|")) {
      ctx.addIssue({ code: "custom", path: ["layoutSignature"], message: `declared signature does not match the sections (expected ${computed.join(", ")})` });
    }
  });

export type PageSpecData = z.infer<typeof PageSpec>;
