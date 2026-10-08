import { useId } from "react";
import type { TrustItem } from "@/content/trust";
import { cn } from "@/utils/cn";
import SectionHeader from "../SectionHeader";
import SupportChannels from "../SupportChannels";
import TrustSignals from "../TrustSignals";

type HelpAndPoliciesProps = {
  eyebrow?: string;
  /** One H2 for the whole section, for example "Help when you need it, and the terms behind our promises". */
  title: string;
  description?: string;
  /** Small label above the support cards. */
  supportLabel: string;
  /** Small label above the policy list. */
  policiesLabel: string;
  /** Policy links to list. Only items marked verified show. */
  policies: readonly TrustItem[];
  /** Showcase only: show samples and unconfigured channels with a visible label. */
  showSamples?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "How to reach us, and what we promise" in one section: the live support channels beside a plain-language policy list.
 * It replaces a SupportChannels section followed by a TrustSignals section, which split one reader question (can I reach a
 * person, and what are the terms?) over two headings. Only live channels show; policies show only when published.
 */
export default function HelpAndPolicies({ eyebrow, title, description, supportLabel, policiesLabel, policies, showSamples = false, headingLevel = "h2", className }: HelpAndPoliciesProps) {
  const headingId = useId();
  const hasPolicies = showSamples ? policies.length > 0 : policies.some((p) => p.verified);

  return (
    <section aria-labelledby={headingId} className={cn("section-y", className)}>
      <div className="container-site">
        <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />
        <div className={cn("mt-12 grid gap-10 sm:mt-14", hasPolicies ? "lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12" : "mx-auto max-w-2xl")}>
          <div className="min-w-0">
            <p className="t-eyebrow mb-4">{supportLabel}</p>
            <SupportChannels bare showSamples={showSamples} headingLevel={headingLevel} />
          </div>
          {hasPolicies && (
            <div className="min-w-0">
              <p className="t-eyebrow mb-4">{policiesLabel}</p>
              <TrustSignals bare variant="list" items={policies} showSamples={showSamples} headingLevel={headingLevel} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
