"use client";

import FormWizard from "@/components/forms/FormWizard";
import { MIGRATION_STEPS } from "@/content/forms";
import { migrationSchema } from "@/lib/forms/schemas";

export default function MigrationForm() {
  return (
    <FormWizard
      steps={MIGRATION_STEPS}
      schema={migrationSchema}
      endpoint="/api/forms/migration"
      storageKey="dh-migration"
      event="migration_submit"
      submitLabel="Send migration request"
      success={{ title: "Request received", body: "Thank you. We will review your site and reply by email with the next steps. Nothing changes on your current site until you approve it." }}
    />
  );
}
