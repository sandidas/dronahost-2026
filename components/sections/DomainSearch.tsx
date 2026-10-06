"use client";

import { Search } from "lucide-react";
import { useId, useRef, useState } from "react";
import { Link } from "@/i18n/link";
import Button from "@/components/ui/Button";
import { track } from "@/lib/analytics/track";
import { normalizeDomain } from "@/lib/whmcs/domain";
import { cn } from "@/utils/cn";

type Result = { domain: string; status: "available" | "unavailable" } | { error: string } | null;

/**
 * Domain availability search backed by /api/domains/search (WHMCS). The result is announced in an
 * aria-live region. An available name leads to the contact form because checkout is not built yet.
 * Rendered only when FEATURES.domainSearch is on.
 */
export default function DomainSearch() {
  const id = useId();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [clientError, setClientError] = useState("");
  const input = useRef<HTMLInputElement>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const domain = normalizeDomain(input.current?.value ?? "");
    if (!domain) {
      setClientError("Enter a full domain name, for example example.com.");
      setResult(null);
      return;
    }
    setClientError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/domains/search?q=${encodeURIComponent(domain)}`);
      const body = (await res.json()) as Result;
      setResult(res.ok ? body : { error: (body as { error?: string })?.error ?? "Something went wrong. Please try again." });
      if (res.ok) track("domain_search");
    } catch {
      setResult({ error: "Network error. Please check your connection and try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={onSubmit} noValidate role="search" aria-label="Domain search" className="surface flex flex-col gap-3 p-3 sm:flex-row">
        <label htmlFor={`${id}-q`} className="sr-only">
          Domain name
        </label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-subtle-foreground" aria-hidden="true" />
          <input
            ref={input}
            id={`${id}-q`}
            type="text"
            inputMode="url"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="Find your domain, e.g. example.com"
            aria-invalid={Boolean(clientError)}
            aria-describedby={`${id}-status`}
            className="h-12 w-full rounded-lg border border-border-strong bg-card ps-12 pe-4 text-base text-foreground placeholder:text-subtle-foreground aria-[invalid=true]:border-danger"
          />
        </div>
        <Button type="submit" size="lg" loading={loading}>
          Search
        </Button>
      </form>

      <div id={`${id}-status`} role="status" aria-live="polite" className="mt-4 min-h-6 text-center text-sm">
        {clientError && <p className="text-danger">{clientError}</p>}
        {result && "error" in result && <p className="text-danger">{result.error}</p>}
        {result && "status" in result && (
          <p className={cn("font-semibold", result.status === "available" ? "text-success" : "text-muted-foreground")}>
            {result.status === "available" ? (
              <>
                {result.domain} is available.{" "}
                <Link href={`/contact?plan=domain-${encodeURIComponent(result.domain)}`} className="text-link underline underline-offset-4">
                  Ask us to register it
                </Link>
              </>
            ) : (
              <>{result.domain} is already registered. Try another name.</>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
