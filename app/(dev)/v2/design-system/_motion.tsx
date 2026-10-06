"use client";

import { useState } from "react";
import { SiteDashboardMockup, StagingFlowMockup } from "@/components/sections/hero/mockups";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/skeleton";
import { reveal } from "@/lib/motion";

/**
 * Live motion demos. The toggle forces reduced motion inside this block only
 * (`data-motion="reduced"`), so the reduced path can be checked without changing OS settings.
 */
export default function MotionDemo() {
  const [reduced, setReduced] = useState(false);
  const [run, setRun] = useState(0);

  return (
    <div data-motion={reduced ? "reduced" : undefined} className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" size="sm" aria-pressed={reduced} onClick={() => setReduced((v) => !v)}>
          Reduced motion: {reduced ? "on" : "off"}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setRun((n) => n + 1)}>
          Replay hero mockups
        </Button>
      </div>

      <div key={run} className="grid gap-6 lg:grid-cols-2">
        <SiteDashboardMockup />
        <StagingFlowMockup />
      </div>

      <div>
        <p className="t-small mb-3 text-muted-foreground">Cards: hover lift (hover devices only), keyboard focus gets the same border and shadow.</p>
        <ul className="grid gap-4 sm:grid-cols-3">
          {["One", "Two", "Three"].map((n, i) => (
            <li key={n} className="surface surface-interactive p-6" {...reveal(i)}>
              <a href="#motion" className="t-h4 text-foreground after:absolute after:inset-0">
                Interactive card {n}
              </a>
              <p className="t-small mt-2 text-muted-foreground">
                Scroll reveal staggers by 70ms and plays once.{" "}
                <span aria-hidden="true" className="arrow-nudge">
                  →
                </span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="button">Primary: sheen on hover</Button>
        <Button type="button" variant="secondary">
          Secondary
        </Button>
        <a href="#motion" className="link-grow t-small text-link">
          Text link: underline grows
        </a>
      </div>

      <div className="max-w-sm space-y-3" key={`s${run}`}>
        <p className="t-small text-muted-foreground">Skeleton: two short shimmers, then still.</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
