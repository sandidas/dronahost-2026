import { LifeBuoy, MessageCircle, MessagesSquare } from "lucide-react";
import { useId, type ReactNode } from "react";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/content/company";
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
  headingLevel?: "h2" | "h3";
  className?: string;
};

const waLink = (num: string) => `https://wa.me/${num.replace(/[^0-9]/g, "")}`;

/**
 * Support trio: WhatsApp, live chat, ticket. WhatsApp leads when configured. A channel
 * renders only when it actually exists (number set / chat widget installed), so the page
 * never advertises a channel nobody answers. Ticket (the contact form) is always real.
 */
export default function SupportChannels({ eyebrow, title, description, showSamples = false, headingLevel = "h2", className }: SupportChannelsProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";
  const all: (Channel & { configured: boolean })[] = [
    {
      id: "whatsapp",
      configured: Boolean(COMPANY.whatsappNumber),
      icon: <MessageCircle className="size-5" aria-hidden="true" />,
      title: "WhatsApp",
      description: "Message the team directly from your phone.",
      action: { label: "Message us on WhatsApp", href: COMPANY.whatsappNumber ? waLink(COMPANY.whatsappNumber) : "#", external: true },
    },
    {
      id: "chat",
      configured: COMPANY.liveChatEnabled,
      icon: <MessagesSquare className="size-5" aria-hidden="true" />,
      title: "Live chat",
      description: "Chat with support while you work in your dashboard.",
      action: { label: "Start a live chat", href: "/contact" },
    },
    {
      id: "ticket",
      configured: true,
      icon: <LifeBuoy className="size-5" aria-hidden="true" />,
      title: "Support ticket",
      description: "Describe the issue and we reply by email with next steps.",
      action: { label: "Open a ticket", href: "/contact" },
    },
  ];
  const channels = showSamples ? all : all.filter((c) => c.configured);

  return (
    <section aria-labelledby={title ? headingId : undefined} className={cn("section-y", className)}>
      <div className="container-site">
        {title && <SectionHeader id={headingId} eyebrow={eyebrow} title={title} description={description} headingLevel={headingLevel} />}
        <ul className={cn("grid gap-4", channels.length === 1 && "mx-auto max-w-2xl", channels.length > 1 && "sm:grid-cols-2", channels.length > 2 && "lg:grid-cols-3", title && "mt-12 sm:mt-14")}>
          {channels.map((c, i) => (
            <li key={c.id} className="surface flex flex-col p-6" {...reveal(i)}>
              <span aria-hidden="true" className="mb-4 inline-flex size-11 items-center justify-center rounded-xl border border-accent/25 bg-accent/12 text-link">
                {c.icon}
              </span>
              <Item className="t-h4 text-foreground">{c.title}</Item>
              <p className="t-small mt-1.5 flex-1 text-muted-foreground">{c.description}</p>
              {!c.configured && <p className="mt-2 text-xs font-semibold text-warning">Sample, not configured</p>}
              <Button href={c.action.href} variant={c.id === channels[0]?.id ? "primary" : "secondary"} external={c.action.external} className="mt-5 self-start">
                {c.action.label}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
