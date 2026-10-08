/** Zod schema for the front matter of a brief (templates/brief.md). The body is read by a person; these fields are what tools check. */
import { z } from "zod";
import { Bool, IsoDate, SemicolonList, SitePath } from "./common";

const Intent = z.enum(["Learn", "Solve", "Compare", "Buy", "Find", "Plan"]);

export const BriefFrontMatter = z
  .object({
    slug: SitePath,
    plan: z.string().min(2),
    locale: z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
    primary_keyword: z.string().min(3).refine((k) => k === k.toLowerCase(), "keyword must be lowercase"),
    secondary_keywords: SemicolonList.optional(),
    intent_primary: Intent,
    intent_secondary: z.union([Intent, z.literal("none")]),
    buying_stage: z.enum(["early", "middle", "late", "none"]),
    state: z.enum(["Brief", "Approved", "Dropped"]),
    governor_in_flight: z.coerce.number().int().nonnegative(),
    governor_in_flight_max: z.coerce.number().int().positive(),
    governor_month_count: z.coerce.number().int().nonnegative(),
    governor_month_cap: z.coerce.number().int().nonnegative(),
    governor_paused: Bool,
    created_on: IsoDate,
    serp_checked_on: z.union([IsoDate, z.literal("unavailable")]),
    information_gain_status: z.enum(["confirmed", "not-confirmed"]),
    original_element: z.enum(["artifact", "flag"]),
    interview_status: z.enum(["not-started", "gaps", "complete"]),
    approval_1: z.enum(["pending", "approved"]),
    approved_on: z.string().optional(),
    ai_used: z.enum(["yes", "no"]),
    owner: z.string().min(2),
    reviewer: z.string().min(2),
    next_review_on: IsoDate,
  })
  .superRefine((b, ctx) => {
    const issue = (path: string, message: string) => ctx.addIssue({ code: "custom", path: [path], message });
    if (b.governor_paused) issue("governor_paused", "the governor is paused: no brief may start");
    if (b.governor_in_flight > b.governor_in_flight_max) issue("governor_in_flight", "more pages in flight than the cap allows");
    if (b.governor_month_count > b.governor_month_cap) issue("governor_month_count", "more new briefs this month than the cap allows");
    if (b.approval_1 === "approved") {
      if (!b.approved_on || !/^\d{4}-\d{2}-\d{2}$/.test(b.approved_on)) issue("approved_on", "an approved brief needs the approval date");
      if (b.information_gain_status !== "confirmed") issue("information_gain_status", "no approval without a confirmed information gain");
      if (b.interview_status === "not-started") issue("interview_status", "no approval before the interview");
      if (b.state !== "Approved") issue("state", "approval_1 is approved but state is not Approved");
    }
  });

export type BriefFront = z.infer<typeof BriefFrontMatter>;
