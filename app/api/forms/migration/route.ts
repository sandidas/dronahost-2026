import { createFormHandler } from "@/lib/forms/handler";
import { migrationSchema } from "@/lib/forms/schemas";

export const POST = createFormHandler({ type: "migration", schema: migrationSchema, subject: (d) => `Migration request: ${String(d.siteUrl)}` });
