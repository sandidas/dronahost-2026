"use client";

import ErrorState from "@/components/layout/ErrorState";

/** Marketing error boundary: renders inside the layout, so the header and footer stay available. */
export default function MarketingError(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorState {...props} />;
}
