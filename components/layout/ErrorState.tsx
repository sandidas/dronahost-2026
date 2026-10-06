"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/link";

/** Shared 500 body: a calm message, a retry, a way to reach the team and the opaque digest for support. */
export default function ErrorState({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Only the opaque digest is logged, never request data.
    console.error("Route error", error.digest);
  }, [error]);

  return (
    <div className="container-site section-y text-center">
      <p className="t-eyebrow">500</p>
      <h1 className="t-h1 mt-3 text-foreground">Something went wrong on our side</h1>
      <p className="t-lead mx-auto mt-4">Please try again. If it keeps happening, contact us and quote the reference below.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          Try again
        </button>
        <Link href="/" className="btn btn-secondary btn-lg">
          Back to home
        </Link>
        <Link href="/contact" className="btn btn-secondary btn-lg">
          Contact the team
        </Link>
      </div>
      {error.digest && <p className="t-small mt-6 text-muted-foreground">Reference: {error.digest}</p>}
    </div>
  );
}
