import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

type TicketProps = {
  /** The main part. */
  main: ReactNode;
  /** The stub after the tear line. */
  stub: ReactNode;
  /** Main and stub side by side from 40rem (a pass); otherwise stacked (a ticket). */
  row?: boolean;
  /** Width of the stub when `row` is set. */
  stubWidth?: string;
  className?: string;
  partClassName?: string;
};

/**
 * Paper ticket shape shared by the transactional and local banners: two parts with round notches cut where they meet and
 * a dashed tear line. Always on light paper (`light` scope) so it reads as an object on any band. The shadow is a
 * drop-shadow on the wrapper because the mask clips box shadows.
 */
export default function Ticket({ main, stub, row = false, stubWidth = "15rem", className, partClassName }: TicketProps) {
  return (
    <div className={cn("light text-foreground [filter:drop-shadow(0_24px_48px_rgb(0_0_0/0.28))_drop-shadow(0_2px_4px_rgb(0_0_0/0.12))]", row && "tk-row", className)}>
      <div className={cn("flex flex-col", row && "sm:flex-row")}>
        <div className={cn("tk-a min-w-0 flex-1 overflow-hidden rounded-t-2xl bg-card", row && "sm:rounded-e-none sm:rounded-s-2xl", partClassName)}>{main}</div>
        <div
          className={cn("tk-b relative overflow-hidden rounded-b-2xl bg-card", row && "sm:shrink-0 sm:rounded-s-none sm:rounded-e-2xl sm:[width:var(--stub-w)]", partClassName)}
          style={{ ["--stub-w" as string]: stubWidth }}
        >
          <span aria-hidden="true" className={cn("absolute inset-x-5 top-0 border-t-2 border-dashed border-border", row && "sm:inset-x-auto sm:inset-y-5 sm:start-0 sm:top-5 sm:border-s-2 sm:border-t-0")} />
          {stub}
        </div>
      </div>
    </div>
  );
}
