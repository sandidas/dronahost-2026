"use client";

import ErrorState from "@/components/layout/ErrorState";

/** Error boundary for the team portals. */
export default function PortalRouteError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main id="main-content" tabIndex={-1}>
      <ErrorState {...props} />
    </main>
  );
}
