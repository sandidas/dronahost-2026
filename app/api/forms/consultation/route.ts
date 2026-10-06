import { createFormHandler } from "@/lib/forms/handler";
import { consultationSchema } from "@/lib/forms/schemas";

export const POST = createFormHandler({ type: "consultation", schema: consultationSchema, subject: (d) => `Consultation request: ${String(d.interest)}` });
