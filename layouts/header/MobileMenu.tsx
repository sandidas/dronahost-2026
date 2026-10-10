"use client";

import { ChevronDown, LogIn, X } from "lucide-react";
import { Link } from "@/i18n/link";
import { useEffect, useRef, useState } from "react";
import CurrencySelector from "@/components/layout/CurrencySelector";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import {
  ACCOUNT_LINK,
  HEADER_CTA,
  HOSTING_LINKS,
  PRIMARY_LINKS,
  SERVICE_LINKS,
  type NavLink,
} from "@/content/navigation";
import { FEATURES } from "@/lib/flags";
import { cn } from "@/utils/cn";
import NavIcon from "./NavIcon";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

const rowClass =
  "flex min-h-12 w-full items-center justify-between rounded-lg px-3 text-base font-semibold text-foreground transition-colors hover:bg-muted";

function LinkGroup({ title, links, onClose }: { title: string; links: readonly NavLink[]; onClose: () => void }) {
  return (
    <div>
      <p className="t-eyebrow px-3 pb-1 pt-3">{title}</p>
      <ul>
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} onClick={onClose} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-[0.9375rem] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <NavIcon name={l.icon} className="size-5 text-link" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Phone navigation drawer (below the md breakpoint; tablets and up show the links in the header). The panel is always in
 * the DOM (inert and translated off-screen while closed) so its links stay in the initial HTML. Traps focus while open,
 * closes on Escape or backdrop tap, and restores focus to the opener.
 */
export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const [hostingOpen, setHostingOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement;
      closeRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      (openerRef.current as HTMLElement | null)?.focus?.();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const trapFocus = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), select");
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-(--dur-slow) ease-(--ease-in-out) md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        inert={!open || undefined}
        onKeyDown={trapFocus}
        className={cn(
          "fixed inset-y-0 end-0 z-[60] flex w-[min(22rem,100vw)] flex-col border-s border-border-strong bg-card shadow-xl transition-transform duration-(--dur-slow) ease-(--ease-in-out) md:hidden",
          open ? "translate-x-0" : "translate-x-full rtl:-translate-x-full",
        )}
      >
        <div className="flex h-[4.5rem] shrink-0 items-center justify-between border-b border-border px-4">
          <Link href="/" onClick={onClose} aria-label="DronaHost home" className="flex items-center">
            <Logo size="sm" />
          </Link>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="btn btn-secondary size-11 !min-h-11 !px-0"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-3">
          <button
            type="button"
            onClick={() => setHostingOpen((v) => !v)}
            aria-expanded={hostingOpen}
            aria-controls="mobile-hosting"
            className={rowClass}
          >
            Hosting
            <ChevronDown className={cn("size-5 transition-transform", hostingOpen && "rotate-180")} aria-hidden="true" />
          </button>
          <div id="mobile-hosting" hidden={!hostingOpen} className="mb-2 ms-3 border-s border-border ps-2">
            <LinkGroup title="Hosting" links={HOSTING_LINKS} onClose={onClose} />
            <LinkGroup title="Web services" links={SERVICE_LINKS} onClose={onClose} />
          </div>
          <ul>
            {PRIMARY_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className={rowClass}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-border bg-muted p-4">
          <Button href={HEADER_CTA.href} fullWidth>
            {HEADER_CTA.label}
          </Button>
          {FEATURES.accountArea && (
            <Button href={ACCOUNT_LINK.href} variant="secondary" fullWidth leadingIcon={<LogIn className="size-4" aria-hidden="true" />}>
              {ACCOUNT_LINK.label}
            </Button>
          )}
          <div className="flex items-center gap-3">
            <ThemeToggle showLabel className="flex-1" />
            <CurrencySelector />
          </div>
        </div>
      </div>
    </>
  );
}
