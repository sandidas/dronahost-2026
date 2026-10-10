/** Zod schema for the front matter of a post draft (templates/front-matter.md). Placeholders are allowed only while the state starts with "Draft". */
import { z } from "zod";
import { Flag, IsoDate, SitePath } from "./common";

export const PostFrontMatter = z
  .object({
    slug: SitePath,
    plan: z.string().optional(),
    primary_keyword: z.string().min(3),
    secondary_keywords: z.string().optional(),
    locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/).optional(),
    state: z.string().min(3),
    author: z.string().min(2),
    reviewer: z.string().min(2),
    ai_assisted: z.enum(["yes", "no"]),
    reviewed_on: z.string().min(2),
    next_review_on: IsoDate,
    seo_title: z.string().min(1),
    meta_description: z.string().min(1),
  })
  .passthrough()
  .superRefine((f, ctx) => {
    const draft = /^draft/i.test(f.state);
    for (const key of ["author", "reviewer", "reviewed_on"] as const) {
      if (Flag.test(f[key]) && !draft) ctx.addIssue({ code: "custom", path: [key], message: `${key} is still a placeholder; only a Draft may carry one` });
    }
    if (!Flag.test(f.reviewed_on) && !/^\d{4}-\d{2}-\d{2}$/.test(f.reviewed_on)) ctx.addIssue({ code: "custom", path: ["reviewed_on"], message: "use YYYY-MM-DD" });
  });

export type PostFront = z.infer<typeof PostFrontMatter>;
