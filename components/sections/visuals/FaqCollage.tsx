import NextImage from "next/image";
import type { CSSProperties, ReactNode } from "react";
import { Check, CircleUserRound, Mail, MessageSquareText } from "lucide-react";
import { UI } from "@/content/strings";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";

export type FaqPhoto = { src: string; alt: string };

/** One rounded frame of the collage: a glass rim around a rounded inner panel, as in the Home look. */
function Frame({ children, className, delay }: { children: ReactNode; className?: string; delay: number }) {
  return (
    <div className={cn("gx-pop rounded-[1.75rem] border border-border bg-card/70 p-2 shadow-xl backdrop-blur-sm", className)} style={{ "--d": `${delay}ms` } as CSSProperties}>
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.375rem] bg-surface-raised">{children}</div>
    </div>
  );
}

/**
 * The picture beside the FAQ: three staggered portrait frames over a soft glow and hairlines. With `photos` (real people
 * only: the team or customers who agreed, never stock images presented as either) the frames show them. Without photos the
 * frames show a drawn support exchange: the reader's first question, the answer, and the ticket closing. Decorative.
 */
export function FaqCollage({ question, photos }: { question: string; photos?: readonly FaqPhoto[] }) {
  const t = UI.faqVisual;
  const photo = (i: number) => {
    const p = photos?.[i];
    return p ? <NextImage src={p.src} alt={p.alt} fill sizes="(min-width: 1024px) 14rem, 40vw" className="object-cover" /> : null;
  };
  return (
    <div {...reveal()} aria-hidden={photos?.length ? undefined : true} className="gx-scope relative mx-auto w-full max-w-md">
      <span className="pointer-events-none absolute -inset-16 -z-10 bg-[radial-gradient(closest-side_at_72%_62%,var(--glow-orange),transparent),radial-gradient(closest-side_at_25%_25%,var(--glow-teal),transparent)] blur-2xl" />
      <svg className="pointer-events-none absolute inset-0 -z-10 size-full text-border-strong" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
        <path d="M0 30 L60 8 L100 40 M30 100 L100 62 M48 70 L100 96" stroke="currentColor" strokeWidth="0.25" />
      </svg>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <Frame delay={150}>
            {photo(0) ?? (
              <div className="flex h-full flex-col justify-end gap-3 p-4">
                <CircleUserRound className="size-9 text-muted-foreground" strokeWidth={1.4} />
                <p className="rounded-2xl rounded-bl-sm border border-border bg-card px-3 py-2.5 text-xs font-medium leading-snug text-foreground">{question}</p>
              </div>
            )}
          </Frame>
          <Frame delay={650}>
            {photo(2) ?? (
              <ul className="flex h-full flex-col justify-center gap-2.5 p-4">
                {t.ticketSteps.map((step, i) => (
                  <li key={step} className="gx-row flex items-center gap-2 rounded-xl border border-border bg-card px-2.5 py-2 text-[0.6875rem] font-medium text-foreground" style={{ "--d": `${900 + i * 220}ms` } as CSSProperties}>
                    <span className="grid size-4 shrink-0 place-items-center rounded-full bg-success-surface text-success">
                      <Check className="size-2.5" strokeWidth={3.5} />
                    </span>
                    {step}
                  </li>
                ))}
              </ul>
            )}
          </Frame>
        </div>
        <div className="pt-16">
          <Frame delay={400}>
            {photo(1) ?? (
              <div className="flex h-full flex-col justify-between bg-[linear-gradient(160deg,color-mix(in_srgb,var(--accent)_22%,transparent),transparent_70%)] p-4">
                <span className="flex items-center gap-2 text-[0.6875rem] font-semibold text-link">
                  <MessageSquareText className="size-4" strokeWidth={1.8} />
                  {t.answered}
                </span>
                <span className="space-y-2">
                  <span className="block h-2 w-full rounded-full bg-foreground/15" />
                  <span className="block h-2 w-5/6 rounded-full bg-foreground/15" />
                  <span className="block h-2 w-2/3 rounded-full bg-foreground/15" />
                </span>
                <span className="flex items-center gap-2 text-[0.6875rem] text-muted-foreground">
                  <Mail className="size-3.5" strokeWidth={1.8} />
                  {t.channels}
                </span>
              </div>
            )}
          </Frame>
        </div>
      </div>
    </div>
  );
}
