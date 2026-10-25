import { LifeBuoy, Mail } from "lucide-react";
import { useId, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/content/company";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import SectionHeader from "./SectionHeader";

type Channel = { id: string; icon: ReactNode; title: string; description: string; action: { label: string; href: string; external?: boolean } };

type SupportChannelsProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  /** Showcase only: render every channel even if not configured, with a visible label. */
  showSamples?: boolean;
  /** "stacked" (default) centers the heading above the cards. "split" puts the heading beside them from the lg breakpoint, which suits one or two channels. */
  layout?: "stacked" | "split";
  /** Render only the channel cards, with no section, heading or container. For use inside another section (HelpAndPolicies). */
  bare?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * Support channels: support ticket and email only (owner decision 22). WhatsApp, live chat and phone are not offered.
 * Email shows only once a support address is set in `content/company.ts`, so the page never advertises an address nobody
 * has confirmed. The ticket (the contact form) is always real.
 */
export default function SupportChannels({ eyebrow, title, description, showSamples = false, layout = "stacked", bare = false, headingLevel = "h2", className }: SupportChannelsProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  const all: (Channel & { configured: boolean })[] = [
    {
      id: "ticket",
      configured: true,
      icon: <LifeBuoy className="size-5" aria-hidden="true" />,
      title: UI.support.ticket.title,
      description: UI.support.ticket.description,
      action: { label: UI.support.ticket.action, href: "/contact" },
    },
    {
      id: "email",
      configured: Boolean(COMPANY.supportEmail),
      icon: <Mail className="size-5" aria-hidden="true" />,
      title: UI.support.email.title,
      description: UI.support.email.description,
      action: { label: UI.support.email.action, href: COMPANY.supportEmail ? `mailto:${COMPANY.supportEmail}` : "#", external: true },
    },
  ];
  const channels = showSamples ? all : all.filter((c) => c.configured);
  const split = layout === "split";

  const cards = (
    <ul className={cn("grid gap-4", !split && !bare && channels.length === 1 && "mx-auto max-w-2xl", channels.length > 1 && !bare && "sm:grid-cols-2", !split && !bare && channels.length > 2 && "lg:grid-cols-3", title && !split && !bare && "mt-12 sm:mt-14")}>
          {channels.map((c, i) => (
            <li key={c.id} className="surface flex flex-col p-6" {...reveal(i)}>
              <span aria-hidden="true" className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/12 text-link">
                {c.icon}
              </span>
              <Item className="t-h4 text-foreground">{c.title}</Item>
              <p className="t-small mt-1.5 flex-1 text-muted-foreground">{c.description}</p>
              <Button href={c.action.href} variant="secondary" external={c.action.external} className="mt-5 self-start">
                {c.action.label}
              </Button>
            </li>
          ))}
        </ul>
  );
  if (bare) return cards;

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className={cn("container-site", split && "grid items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16")}>
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} align={split ? "start" : "center"} />}
        {cards}
      </div>
    </section>
  );
}
