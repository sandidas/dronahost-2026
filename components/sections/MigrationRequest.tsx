"use client";

import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import { UI } from "@/content/strings";
import { Link } from "@/i18n/link";
import { isLeadDestinationConfigured } from "@/lib/leads/config";
import { type FieldErrors, type RequestField, validateMigrationRequest } from "@/lib/leads/migration-request";
import { submitMigrationRequest } from "@/lib/leads/submit";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

type MigrationRequestProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  /** The fields to show, in order. The page JSON decides; the blueprint limits them to site URL, current host, email and a note. */
  fields: readonly RequestField[];
  /** The id of the section, so a link such as /#move-my-site scrolls to it. */
  anchorId: string;
  /** Where the privacy line links. Default "/privacy". */
  privacyHref?: string;
  headingLevel?: "h2" | "h3";
  className?: string;
};

type Status = "idle" | "sending" | "mailto" | "sent" | "error";

const inputClass =
  "mt-2 block w-full rounded-lg border border-border-strong bg-card px-4 text-base text-foreground placeholder:text-subtle-foreground transition-colors focus-visible:border-accent aria-[invalid=true]:border-danger";

const L = UI.migrationRequest;

/**
 * Free-migration lead form: site URL, current host, email and an optional note. Validated with Zod, with a honeypot, an error
 * state and a success state. It sends through `submitMigrationRequest` (lib/leads/submit.ts), so where requests go is set in
 * lib/leads/config.ts. No database.
 */
export default function MigrationRequest({ eyebrow, title, description, fields, anchorId, privacyHref = "/privacy", headingLevel = "h2", className }: MigrationRequestProps) {
  const headingId = useId();
  const formId = useId();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState("");
  const set = (name: string, v: string) => setValues((prev) => ({ ...prev, [name]: v }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const checked = validateMigrationRequest(values, fields);
    if (!checked.ok) {
      setErrors(checked.errors);
      setStatus("error");
      setFormError(L.errors.summary);
      return;
    }
    setErrors({});
    setStatus("sending");
    const result = await submitMigrationRequest(checked.data);
    if (!result.ok) {
      setStatus("error");
      setFormError(result.reason === "not-configured" ? L.errors.notConfigured : L.errors.form);
      return;
    }
    if (result.via === "mailto") {
      setStatus("mailto");
      if (result.href) window.location.href = result.href;
    } else setStatus("sent");
  }

  const done = status === "mailto" || status === "sent";
  const labelOf = (f: RequestField) => L.labels[f];

  return (
    <section id={anchorId} aria-labelledby={headingId} className={cn("section-y scroll-mt-20", className)}>
      <div className="container-site grid items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align="start" />

        <div className="surface p-6 sm:p-8">
          {!isLeadDestinationConfigured() && process.env.NODE_ENV === "development" && (
            <p role="note" className="mb-5 rounded-xl border border-warning/40 bg-warning-surface px-4 py-2 text-sm font-medium text-warning">
              {L.preview}
            </p>
          )}

          {done ? (
            <div role="status" aria-live="polite">
              <p className="t-h3 text-foreground">{status === "mailto" ? L.successMailtoTitle : L.successSentTitle}</p>
              <p className="t-body mt-3 text-muted-foreground">{status === "mailto" ? L.successMailtoBody : L.successSentBody}</p>
            </div>
          ) : (
            <form id={formId} onSubmit={onSubmit} noValidate aria-describedby={status === "error" ? `${formId}-error` : undefined} className="space-y-5">
              {status === "error" && (
                <div id={`${formId}-error`} role="alert" className="rounded-xl border border-danger/40 bg-danger-surface px-4 py-3 text-sm font-medium text-danger">
                  <p>{formError}</p>
                  {formError === L.errors.notConfigured && (
                    <Link href="/contact" className="mt-1 inline-block font-semibold underline underline-offset-4">
                      {L.ticketLink}
                    </Link>
                  )}
                </div>
              )}

              {fields.map((f) => {
                const err = errors[f];
                const id = `${formId}-${f}`;
                const common = {
                  id,
                  name: f,
                  value: values[f] ?? "",
                  "aria-invalid": err ? true : undefined,
                  "aria-describedby": err ? `${id}-err` : undefined,
                  placeholder: L.placeholders[f] || undefined,
                  onChange: (ev: { target: { value: string } }) => set(f, ev.target.value),
                } as const;
                return (
                  <div key={f}>
                    <label htmlFor={id} className="text-sm font-semibold text-foreground">
                      {labelOf(f)}
                    </label>
                    {f === "note" ? (
                      <textarea {...common} rows={4} className={cn(inputClass, "py-3")} />
                    ) : (
                      <input {...common} type={f === "email" ? "email" : "text"} inputMode={f === "siteUrl" ? "url" : undefined} autoComplete={f === "email" ? "email" : f === "siteUrl" ? "url" : "off"} className={cn(inputClass, "h-12")} />
                    )}
                    {err && (
                      <p id={`${id}-err`} className="field-msg mt-1.5 text-sm font-medium text-danger">
                        {err}
                      </p>
                    )}
                  </div>
                );
              })}

              {/* Honeypot: people never see or reach it. A bot that fills it is told "sent" and nothing is sent. */}
              <div aria-hidden="true" className="absolute -start-[9999px] size-0 overflow-hidden">
                <label>
                  {L.honeypot}
                  <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={(ev) => set("website", ev.target.value)} />
                </label>
              </div>

              <Button type="submit" size="lg" loading={status === "sending"} className="w-full sm:w-auto">
                {status === "sending" ? L.submitting : L.submit}
              </Button>

              <p className="t-small text-muted-foreground">
                {L.privacyBefore}{" "}
                <Link href={privacyHref} className="font-semibold text-link underline underline-offset-4">
                  {L.privacyLink}
                </Link>
                {L.privacyAfter}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
