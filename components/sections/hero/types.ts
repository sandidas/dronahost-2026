import type { ReactNode } from "react";

export type HeroCta = { label: string; href: string };

/** Props shared by every hero variant. */
export type HeroBaseProps = {
  /** Small uppercase label above the headline. */
  eyebrow?: string;
  /** Headline. Rendered as an H1 by default; pass `headingLevel="h2"` when the page already has one. */
  title: string;
  /** Optional phrase appended to the headline in teal. Use at most one highlighted phrase. */
  titleAccent?: string;
  /** Answer-first summary under the headline. */
  description: string;
  /** The single primary action (orange). */
  primaryCta: HeroCta;
  /** Optional quieter action. */
  secondaryCta?: HeroCta;
  /** Short supporting facts under the actions. Only verified, specific statements. */
  highlights?: readonly string[];
  /** Fine print under the actions, e.g. a refund line that is true. */
  note?: ReactNode;
  /** H1 by default so a page keeps exactly one. */
  headingLevel?: "h1" | "h2";
  className?: string;
};
