"use client";

import { Link } from "@/i18n/link";
import { useId, useState } from "react";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { FEATURES } from "@/lib/flags";
import { cn } from "@/utils/cn";

const emailSchema = z.string().trim().email("Enter a valid email address, for example name@company.com.");

type NewsletterSignupProps = {
  title?: string;
  description?: string;
  /** POST endpoint that accepts `{ email }`. Newsletter is off until this exists. */
  endpoint?: string;
  /** Showcase only: render even while FEATURES.newsletter is off. */
  forceEnabled?: boolean;
  className?: string;
};

type Status = "idle" | "loading" | "success" | "error";

/**
 * Newsletter signup. Renders nothing until FEATURES.newsletter is on and an endpoint is
 * provided, so no form can collect addresses it cannot store. Validates with Zod, labels the
 * field, announces results via aria-live, and states the privacy basis (GDPR).
 */
export default function NewsletterSignup({
  title = "Hosting notes, occasionally",
  description = "Practical posts on WordPress, performance and security. Unsubscribe at any time.",
  endpoint,
  forceEnabled = false,
  className,
}: NewsletterSignupProps) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  if (!FEATURES.newsletter && !forceEnabled) return null;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = String(new FormData(e.currentTarget).get("email") ?? "");
    const parsed = emailSchema.safeParse(raw);
    if (!parsed.success) {
      setStatus("error");
      setMessage(parsed.error.issues[0]?.message ?? "Enter a valid email address.");
      return;
    }
    if (!endpoint) {
      setStatus("error");
      setMessage("Signup is not connected yet.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: parsed.data }) });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      setMessage("Thanks. Check your inbox to confirm your subscription.");
    } catch {
      setStatus("error");
      setMessage("We could not sign you up. Please try again in a moment.");
    }
  }

  return (
    <section aria-labelledby={`${id}-h`} className={cn("section-y", className)}>
      <div className="container-site">
        <div className="surface mx-auto grid max-w-4xl items-center gap-8 p-6 sm:p-10 md:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id={`${id}-h`} className="t-h3 text-foreground">
              {title}
            </h2>
            <p className="t-small mt-2 text-muted-foreground">{description}</p>
          </div>
          <form onSubmit={onSubmit} noValidate>
            <label htmlFor={`${id}-email`} className="text-sm font-semibold text-foreground">
              Email address
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id={`${id}-email`}
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={status === "error"}
                aria-describedby={`${id}-msg`}
                placeholder="name@company.com"
                className="h-12 w-full min-w-0 rounded-lg sm:flex-1 border border-border-strong bg-card px-4 text-base text-foreground placeholder:text-subtle-foreground focus-visible:border-accent"
              />
              <Button type="submit" loading={status === "loading"}>
                Subscribe
              </Button>
            </div>
            <p id={`${id}-msg`} role="status" aria-live="polite" className={cn("t-small mt-3 min-h-5", status === "error" ? "text-danger" : "text-success")}>
              {message}
            </p>
            <p className="mt-1 text-xs text-subtle-foreground">
              We use your email only to send this newsletter. See our{" "}
              <Link href="/privacy" className="font-semibold underline underline-offset-4">
                privacy policy
              </Link>
              .
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
