"use client";

import EmptyState from "@/components/ui/EmptyState";
import { Newspaper } from "lucide-react";

/** Blog source outage: a calm message with a way forward, never a stack trace. */
export default function BlogError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container-site section-y">
      <EmptyState icon={Newspaper} headingLevel="h1" title="We could not load this article" body="The blog is temporarily unavailable. This is on our side. Please try again in a few minutes." action={{ label: "Contact the team", href: "/contact" }} />
      <p className="mt-6 text-center">
        <button type="button" onClick={reset} className="btn btn-link">
          Try again
        </button>
      </p>
    </div>
  );
}
