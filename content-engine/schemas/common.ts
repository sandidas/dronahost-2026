import { z } from "zod";

export const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "use YYYY-MM-DD");
export const SitePath = z.string().regex(/^\/[a-z0-9\-\/\[\]]*$/, "a site path such as /kb/example");
export const Flag = /\[HUMAN REVIEW[^\]]*\]/;
/** Semicolon-separated list in front matter -> array. */
export const SemicolonList = z.string().transform((s) => s.split(";").map((x) => x.trim()).filter(Boolean));
export const Bool = z.enum(["true", "false"]).transform((v) => v === "true");
