"use client";

import ErrorState from "@/components/layout/ErrorState";

/** Outermost route error boundary (no site chrome, in case the layout itself failed). */
export default function RootError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <ErrorState {...props} />
    </main>
  );
}
