"use client";

import FormWizard from "@/components/forms/FormWizard";
import { CONSULTATION_STEPS } from "@/content/forms";
import { consultationSchema } from "@/lib/forms/schemas";

export default function ConsultationForm() {
  return (
    <FormWizard
      steps={CONSULTATION_STEPS}
      schema={consultationSchema}
      endpoint="/api/forms/consultation"
      storageKey="dh-consultation"
      initial={() => ({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "" })}
      event="consultation_submit"
      submitLabel="Request a consultation"
      success={{ title: "Request received", body: "Thank you. We will reply by email to agree a time. No call is booked until you confirm." }}
    />
  );
}
