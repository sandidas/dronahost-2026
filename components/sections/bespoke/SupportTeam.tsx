import { ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { useId } from "react";
import Button from "@/components/ui/Button";
import { Link } from "@/i18n/link";
import { reveal } from "@/lib/motion";
import { cn } from "@/utils/cn";
import LuxeHeader from "../luxe/LuxeHeader";

export type SupportPhotoProps = { src: string; width: number; height: number };

type SupportTeamProps = {
  eyebrow?: string;
  title: string;
  accent?: string;
  description?: string;
  /** Two or three reassurances, already gated by their claims. */
  points: readonly { title: string; text: string }[];
  links: readonly { label: string; href: string }[];
  /** One decorative atmosphere photo (content/team.ts). Never a named person. Without it the illustration shows. */
  photo?: SupportPhotoProps | null;
  /** Text of the ticket card (shown over the photo, or as the illustration when there is no photo). */
  visual: { badge: string; question: string; answer: string; signature: string; caption: string };
  headingLevel?: "h2" | "h3";
  className?: string;
};

/**
 * "Real support from real people": the support promise beside one premium atmosphere photo (content/team.ts) with the 24/7
 * badge and a ticket reply floating over it. No names or roles, ever (owner, 2026-10-10). Without a photo it shows a
 * theme-aware illustration of a ticket answered in writing.
 */
export default function SupportTeam({ eyebrow, title, accent, description, points, links, photo, visual, headingLevel = "h2", className }: SupportTeamProps) {
  const headingId = useId();
  const Item = headingLevel === "h2" ? "h3" : "h4";

  return (
    <section aria-labelledby={headingId} className={cn("luxe-band section-luxe", className)}>
      <div className="container-site grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        <div>
          <LuxeHeader id={headingId} eyebrow={eyebrow} title={title} accent={accent} description={description} headingLevel={headingLevel} align="start" />
          <ul className="mt-10 space-y-6">
            {points.map((p, i) => (
              <li key={p.title} {...reveal(i)} className="flex gap-4">
                <span className="mt-0.5 grid size-9 flex-none place-items-center rounded-full border border-link/40">
                  <Check className="size-4 text-link" aria-hidden="true" strokeWidth={2.4} />
                </span>
                <span>
                  <Item className="font-heading text-lg font-medium text-foreground">{p.title}</Item>
                  <span className="mt-1 block text-base text-muted-foreground">{p.text}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            {links.map((l, i) =>
              i === 0 ? (
                <Button key={l.href} href={l.href} size="lg" variant="secondary" className="rounded-full" trailingIcon={<ArrowRight className="arrow-nudge size-[1.125rem]" aria-hidden="true" />}>
                  {l.label}
                </Button>
              ) : (
                <Link key={l.href} href={l.href} className="inline-flex min-h-11 items-center gap-2 font-bold text-link">
                  {l.label}
                  <ArrowRight className="arrow-nudge size-4" aria-hidden="true" />
                </Link>
              ),
            )}
          </div>
        </div>

        {photo ? (
          <figure {...reveal(1)} className="relative m-0 pb-10 sm:pb-0">
            <div className="console-frame">
              <div className="overflow-hidden rounded-[1.5625rem]">
                <Image src={photo.src} alt="" width={photo.width} height={photo.height} className="aspect-[4/3] w-full object-cover" sizes="(min-width: 1024px) 40rem, 100vw" />
              </div>
            </div>
            <span className="absolute end-5 top-5 rounded-full bg-accent px-4 py-1.5 text-sm font-bold text-accent-foreground shadow-lg">{visual.badge}</span>
            <div className="glass-form absolute -bottom-2 start-4 max-w-[min(26rem,calc(100%-2rem))] rounded-2xl p-4 sm:-bottom-8 sm:-start-8 sm:p-5">
              <span className="t-eyebrow block text-[0.625rem]">{visual.signature}</span>
              <p className="mt-2 text-[0.9375rem] text-foreground">{visual.answer}</p>
            </div>
          </figure>
        ) : (
          <figure {...reveal(1)} className="relative m-0">
            <div className="console-frame">
              <div className="console-body flex flex-col gap-5 p-6 sm:p-10">
                <div className="flex items-center justify-between gap-4">
                  <span className="t-eyebrow text-[0.6875rem]">{visual.signature}</span>
                  <span className="rounded-full bg-accent px-3.5 py-1 text-sm font-bold text-accent-foreground">{visual.badge}</span>
                </div>
                <p className="max-w-[85%] self-start rounded-2xl rounded-bl-md border border-border bg-card px-5 py-4 text-[0.9375rem] text-foreground">{visual.question}</p>
                <div className="flex max-w-[88%] items-end gap-3 self-end">
                  <p className="rounded-2xl rounded-br-md bg-surface-raised px-5 py-4 text-[0.9375rem] text-foreground ring-1 ring-link/30">{visual.answer}</p>
                  <span aria-hidden="true" className="grid size-10 flex-none place-items-center rounded-full bg-accent text-accent-foreground">
                    <Check className="size-4" strokeWidth={2.6} />
                  </span>
                </div>
              </div>
            </div>
            <figcaption className="t-small mt-4 text-center text-muted-foreground">{visual.caption}</figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
