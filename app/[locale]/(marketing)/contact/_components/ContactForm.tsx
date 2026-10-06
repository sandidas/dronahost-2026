"use client";

import { Link } from "@/i18n/link";
import { useCallback, useId, useRef, useState } from "react";
import Turnstile from "@/components/forms/Turnstile";
import { track } from "@/lib/analytics/track";
import Button from "@/components/ui/Button";
import { contactSchema } from "@/lib/contact-schema";
import { cn } from "@/utils/cn";

type Fields = "name" | "email" | "subject" | "message";
type Errors = Partial<Record<Fields, string>>;
type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "mt-2 block w-full rounded-lg border bg-card px-4 text-base text-foreground placeholder:text-subtle-foreground transition-colors focus-visible:border-accent aria-[invalid=true]:border-danger";

/**
 * Contact form. Client-side Zod validation mirrors the server, errors are tied to fields with
 * aria-describedby, and the outcome is announced in an aria-live region. The honeypot field
 * is hidden from people and assistive tech.
 */
export default function ContactForm({ defaultPlan }: { defaultPlan?: string }) {
  const id = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const startedAt = useRef(0);
  const [token, setToken] = useState("");
  const onToken = useCallback((t: string) => setToken(t), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const parsed = contactSchema.safeParse(data);
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        email: fieldErrors.email?.[0],
        subject: fieldErrors.subject?.[0],
        message: fieldErrors.message?.[0],
      });
      setStatus("idle");
      form.querySelector<HTMLElement>("[aria-invalid=true], :invalid")?.focus();
      return;
    }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...parsed.data, startedAt: startedAt.current || Date.now() - 10_000, turnstileToken: token || undefined }) });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Something went wrong. Please try again.");
      }
      track("contact_submit");
      setStatus("success");
      form.reset();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="surface p-8 text-center">
        <p className="t-h4 text-foreground">Message received</p>
        <p className="t-small mt-2 text-muted-foreground">Thank you. We have your message and will reply by email.</p>
        <Button variant="link" className="mt-3" type="button" onClick={() => setStatus("idle")}>
          Send another message
        </Button>
      </div>
    );
  }

  const field = (name: Fields, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <div>
      <label htmlFor={`${id}-${name}`} className="text-sm font-semibold text-foreground">
        {label}
      </label>
      <input
        id={`${id}-${name}`}
        name={name}
        required
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${id}-${name}-err` : undefined}
        className={cn(inputClass, "h-12 border-border-strong")}
        {...props}
      />
      {errors[name] && (
        <p id={`${id}-${name}-err`} className="mt-1.5 text-sm text-danger">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={onSubmit} onFocus={() => { startedAt.current ||= Date.now(); }} noValidate className="space-y-5">
      {field("name", "Full name", { type: "text", autoComplete: "name", placeholder: "Jane Smith" })}
      {field("email", "Email address", { type: "email", autoComplete: "email", placeholder: "jane@company.com" })}
      {field("subject", "Subject", { type: "text", placeholder: "How can we help?" })}
      <div>
        <label htmlFor={`${id}-message`} className="text-sm font-semibold text-foreground">
          Message
        </label>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${id}-message-err` : undefined}
          placeholder="Tell us about your site and what you need."
          className={cn(inputClass, "border-border-strong py-3")}
        />
        {errors.message && (
          <p id={`${id}-message-err`} className="mt-1.5 text-sm text-danger">
            {errors.message}
          </p>
        )}
      </div>

      {defaultPlan && <input type="hidden" name="plan" value={defaultPlan} />}
      {/* Honeypot */}
      <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Turnstile onToken={onToken} />

      <div role="alert" className={cn("text-sm text-danger", status !== "error" && "sr-only")}>
        {status === "error" ? serverError : ""}
      </div>

      <Button type="submit" loading={status === "loading"} size="lg" fullWidth>
        Send message
      </Button>
      <p className="text-xs text-subtle-foreground">
        We use these details only to reply to you. See our{" "}
        <Link href="/privacy" className="font-semibold underline underline-offset-4">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
