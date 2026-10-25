"use client";

import { ArrowRight } from "lucide-react";
import { useId, type FormEvent } from "react";
import { setPrefill } from "@/lib/leads/prefill";
import { cn } from "@/utils/cn";

export type HeroFormCopy = {
  /** Accessible label of the one field (visually hidden). */
  label: string;
  placeholder: string;
  /** Submit button text. */
  button: string;
  /** One line under the form, for example what happens next. */
  note?: string;
  /** Id of the section that holds the full request form. */
  targetId: string;
};

/**
 * The hero's one-field form: the visitor types a website address, and the full request form further down the page opens
 * with it filled in (lib/leads/prefill.ts). With JavaScript the page scrolls to that form and focuses the next empty field;
 * without it the form is a plain GET to `/?siteUrl=...#targetId`, which the request form also reads.
 */
export default function HeroSiteForm({ label, placeholder, button, note, targetId, className }: HeroFormCopy & { className?: string }) {
  const id = useId();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const target = document.getElementById(targetId);
    if (!target) return; // No request form on this page: let the GET submit carry the value to Home.
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("siteUrl") ?? "").trim();
    if (value) setPrefill("siteUrl", value);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
    // Keyboard and screen reader users land on the next field to fill, not back at the top of the page.
    const next = [...target.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("input:not([tabindex='-1']), textarea")].find((el) => !el.value && el.name !== "siteUrl");
    (next ?? target.querySelector<HTMLElement>("input, textarea, button"))?.focus({ preventScroll: true });
  }

  return (
    <div className={className}>
      <form action={`/#${targetId}`} method="get" onSubmit={onSubmit} className="glass-pill flex max-w-[38.75rem] flex-wrap gap-2 rounded-[1.75rem] p-2 sm:rounded-full">
        <label htmlFor={id} className="sr-only">
          {label}
        </label>
        <input
          id={id}
          name="siteUrl"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder={placeholder}
          className="min-h-12 min-w-0 flex-[1_1_15rem] rounded-full bg-transparent px-5 text-base text-foreground outline-none placeholder:text-subtle-foreground focus-visible:outline-none"
        />
        <button type="submit" className={cn("btn btn-primary btn-lg btn-glow w-full rounded-full sm:w-auto")}>
          {button}
          <ArrowRight className="arrow-nudge size-[1.125rem]" aria-hidden="true" />
        </button>
      </form>
      {note && <p className="t-small mt-4 ps-5 text-subtle-foreground">{note}</p>}
    </div>
  );
}
