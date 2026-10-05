"use client";

import { useEffect } from "react";

/** Route-level error boundary: a calm message and a retry, never a stack trace. */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Only the opaque digest is logged, never request data.
    console.error("Route error", error.digest);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1} className="container-site section-y text-center">
      <p className="t-eyebrow">Something went wrong</p>
      <h1 className="t-h1 mt-3 text-foreground">We could not load this page</h1>
      <p className="t-lead mx-auto mt-4">This is on our side. Please try again, and contact us if it keeps happening.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className="btn btn-primary btn-lg">
          Try again
        </button>
        <a href="/contact" className="btn btn-secondary btn-lg">
          Contact the team
        </a>
      </div>
    </main>
  );
}
