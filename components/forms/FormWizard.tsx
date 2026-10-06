"use client";

import { Link } from "@/i18n/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { z } from "zod";
import Turnstile from "@/components/forms/Turnstile";
import Button from "@/components/ui/Button";
import type { FieldDef, StepDef } from "@/content/forms";
import { track, type AnalyticsEvent } from "@/lib/analytics/track";
import { cn } from "@/utils/cn";

type Props = {
  steps: readonly StepDef[];
  schema: z.ZodType;
  endpoint: string;
  storageKey: string;
  event: AnalyticsEvent;
  submitLabel: string;
  success: { title: string; body: string };
  /** Client-only defaults, e.g. the visitor's time zone. Applied when nothing was saved. */
  initial?: () => Record<string, string>;
};

type Values = Record<string, string>;
type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-lg border border-border-strong bg-card px-4 text-base text-foreground placeholder:text-subtle-foreground transition-colors focus-visible:border-accent aria-[invalid=true]:border-danger";

/**
 * Multi-step form. Each step validates with the same Zod schema the server uses, focus moves to
 * the step heading on change, progress is announced, answers survive a reload (sessionStorage,
 * this tab only, cleared on success) and spam protection is a honeypot, a timing check and
 * Cloudflare Turnstile when configured.
 */
export default function FormWizard({ steps, schema, endpoint, storageKey, event, submitLabel, success, initial }: Props) {
  const uid = useId();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const startedAt = useRef(Date.now());
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const onToken = useCallback((t: string) => setToken(t), []);

  // Restore answers after a reload. Runs once, after mount, so server and client HTML match.
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? "null") as { values?: Values; step?: number } | null;
      if (saved?.values) {
        setValues(saved.values);
        setStep(Math.min(saved.step ?? 0, steps.length - 1));
      } else if (initial) {
        setValues(initial());
      }
    } catch {
      /* storage blocked: start empty */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, steps.length]);

  useEffect(() => {
    if (!hydrated || status === "success") return;
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ values, step }));
    } catch {
      /* ignore */
    }
  }, [values, step, hydrated, status, storageKey]);

  const current = steps[step]!;
  const isLast = step === steps.length - 1;

  const validate = (fields: readonly FieldDef[], full = false) => {
    const blanks = Object.fromEntries(steps.flatMap((st) => st.fields.map((f) => [f.name, ""])));
    const result = schema.safeParse({ ...blanks, ...values, startedAt: startedAt.current, consent: values.consent ?? "", ...(full && { turnstileToken: token }) });
    const found: Record<string, string> = {};
    if (!result.success) {
      const names = new Set(fields.map((f) => f.name));
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? "");
        if ((full || names.has(key)) && !found[key]) found[key] = issue.message;
      }
    }
    return found;
  };

  const goTo = (n: number) => {
    setStep(n);
    setErrors({});
    requestAnimationFrame(() => headingRef.current?.focus());
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validate(current.fields, isLast);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      requestAnimationFrame(() => document.querySelector<HTMLElement>("[aria-invalid=true]")?.focus());
      return;
    }
    if (!isLast) return goTo(step + 1);

    setStatus("loading");
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, startedAt: startedAt.current, turnstileToken: token || undefined }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      track(event);
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        /* ignore */
      }
      setStatus("success");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="surface p-8 text-center sm:p-10">
        <p className="t-h3 text-foreground">{success.title}</p>
        <p className="t-body mx-auto mt-3 max-w-md text-muted-foreground">{success.body}</p>
      </div>
    );
  }

  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const renderField = (f: FieldDef) => {
    const id = `${uid}-${f.name}`;
    const err = errors[f.name];
    const describedBy = [f.hint && `${id}-hint`, err && `${id}-err`].filter(Boolean).join(" ") || undefined;
    const common = { id, name: f.name, value: values[f.name] ?? "", "aria-invalid": Boolean(err), "aria-describedby": describedBy, required: f.required };
    return (
      <div key={f.name}>
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {f.label}
        </label>
        {f.type === "select" ? (
          <select {...common} onChange={(e) => set(f.name, e.target.value)} className={cn(inputClass, "h-12")}>
            <option value="">Choose one</option>
            {f.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ) : f.type === "textarea" ? (
          <textarea {...common} rows={5} onChange={(e) => set(f.name, e.target.value)} className={cn(inputClass, "py-3")} />
        ) : (
          <input {...common} type={f.type} placeholder={f.placeholder} autoComplete={f.autoComplete} onChange={(e) => set(f.name, e.target.value)} className={cn(inputClass, "h-12")} />
        )}
        {f.hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-subtle-foreground">
            {f.hint}
          </p>
        )}
        {err && (
          <p id={`${id}-err`} className="field-msg mt-1.5 text-sm text-danger">
            {err}
          </p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={onSubmit} noValidate className="surface p-6 sm:p-8">
      <ol className="mb-8 flex gap-2" aria-label="Progress">
        {steps.map((s, i) => (
          <li key={s.title} className="flex-1" aria-current={i === step ? "step" : undefined}>
            <span className={cn("block h-1.5 rounded-full", i <= step ? "bg-accent" : "bg-border-strong")} />
            <span className={cn("mt-2 hidden text-xs font-semibold sm:block", i === step ? "text-foreground" : "text-subtle-foreground")}>{s.title}</span>
          </li>
        ))}
      </ol>

      <p className="t-eyebrow" aria-live="polite">
        Step {step + 1} of {steps.length}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="t-h3 mt-2 scroll-mt-24 text-foreground outline-none">
        {current.title}
      </h2>
      <p className="t-small mt-2 text-muted-foreground">{current.description}</p>

      <div className="mt-6 space-y-5">{current.fields.map(renderField)}</div>

      {isLast && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="flex items-start gap-3 text-sm text-foreground">
              <input
                type="checkbox"
                name="consent"
                checked={values.consent === "on"}
                onChange={(e) => set("consent", e.target.checked ? "on" : "")}
                aria-invalid={Boolean(errors.consent)}
                aria-describedby={errors.consent ? `${uid}-consent-err` : undefined}
                className="mt-0.5 size-5 shrink-0 accent-[var(--accent)]"
              />
              <span>
                I agree that DronaHost may contact me about this request. See the{" "}
                <Link href="/privacy" className="font-semibold underline underline-offset-4">
                  privacy policy
                </Link>
                .
              </span>
            </label>
            {errors.consent && (
              <p id={`${uid}-consent-err`} className="field-msg mt-1.5 text-sm text-danger">
                {errors.consent}
              </p>
            )}
          </div>
          <Turnstile onToken={onToken} />
        </div>
      )}

      {/* Honeypot, hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={values.website ?? ""} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div role="alert" className={cn("mt-4 text-sm text-danger", status !== "error" && "sr-only")}>
        {status === "error" ? serverError : ""}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => goTo(step - 1)}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg" loading={status === "loading"}>
          {isLast ? submitLabel : "Continue"}
        </Button>
      </div>
    </form>
  );
}
