"use client";

import { ChevronDown, LogIn, Menu } from "lucide-react";
import { Link } from "@/i18n/link";
import { usePathname } from "@/i18n/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import CurrencySelector from "@/components/layout/CurrencySelector";
import Button from "@/components/ui/Button";
import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { ACCOUNT_LINK, HEADER_CTA, PRIMARY_LINKS } from "@/content/navigation";
import { FEATURES } from "@/lib/flags";
import { cn } from "@/utils/cn";
import HostingMegaMenu from "./HostingMegaMenu";
import MobileMenu from "./MobileMenu";

const MEGA_ID = "hosting-mega-menu";
const linkClass =
  "inline-flex min-h-11 items-center rounded-lg px-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground lg:px-3";

/** Sticky site header: logo, primary navigation with hosting mega menu, account and theme controls. */
export default function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** True while the panel is open because the mouse hovered the trigger (so the next click does not close it). */
  const hoverOpened = useRef(false);
  const closeMega = useCallback(() => { hoverOpened.current = false; setMegaOpen(false); }, []);

  useEffect(() => {
    if (!megaOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMegaOpen(false);
      triggerRef.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [megaOpen]);

  // A sentinel at the very top of the page (not a scroll listener) tells us when the header is stuck.
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setStuck(!entry?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div ref={sentinelRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-6" />
      <header
        inert={drawerOpen || undefined}
        data-stuck={stuck || undefined}
        className={cn(
          "site-header sticky top-0 z-40 border-b backdrop-blur-md",
          stuck ? "border-border bg-background/95 backdrop-blur-xl" : "border-border/60 bg-background/80",
        )}
      >
        <div ref={rootRef} className="relative" onMouseLeave={closeMega}>
          <div className="mx-auto flex h-[4.5rem] max-w-(--container-max) items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="DronaHost home" className="flex shrink-0 items-center rounded-lg">
              <Logo size="md" priority />
            </Link>

            {/* Tablets (md) get the real links and the action, not a hamburger; only phones use the drawer. */}
            <nav aria-label="Primary" className="hidden items-center gap-0.5 md:flex lg:gap-1">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={megaOpen}
                aria-controls={MEGA_ID}
                // A click after a hover-open keeps the panel open (the hover already opened it; the click confirms). A click
                // on a panel that was opened by click, or by keyboard, closes it.
                onClick={() => {
                  if (hoverOpened.current) { hoverOpened.current = false; setMegaOpen(true); return; }
                  setMegaOpen((v) => !v);
                }}
                // Hover opens only for a mouse. On a touch screen a tap fires mouseenter and then click, which would open and
                // immediately close the panel, so touch and pen rely on the click alone.
                onPointerEnter={(e) => { if (e.pointerType === "mouse" && !megaOpen) { hoverOpened.current = true; setMegaOpen(true); } }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setMegaOpen(true);
                    requestAnimationFrame(() =>
                      document.getElementById(MEGA_ID)?.querySelector<HTMLElement>("a[href]")?.focus(),
                    );
                  }
                }}
                className={cn(linkClass, "gap-1 text-foreground", megaOpen && "bg-muted")}
              >
                Hosting
                <ChevronDown className={cn("size-4 transition-transform", megaOpen && "rotate-180")} aria-hidden="true" />
              </button>
              {PRIMARY_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={pathname === link.href ? "page" : undefined}
                  onMouseEnter={closeMega}
                  className={linkClass}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                {/* The currency selector and the account link need the wide header; on tablets they live in the footer and the account page. */}
                <div className="hidden items-center gap-2 lg:flex">
                  <CurrencySelector />
                  {FEATURES.accountArea && (
                    <Button href={ACCOUNT_LINK.href} variant="ghost" size="sm" leadingIcon={<LogIn className="size-4" aria-hidden="true" />}>
                      {ACCOUNT_LINK.label}
                    </Button>
                  )}
                </div>
                <ThemeToggle />
                <Button href={HEADER_CTA.href} size="sm">
                  {HEADER_CTA.label}
                </Button>
              </div>

              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-expanded={drawerOpen}
                aria-controls="mobile-menu"
                aria-label="Open navigation menu"
                className="btn btn-secondary size-11 !min-h-11 !px-0 md:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <HostingMegaMenu id={MEGA_ID} open={megaOpen} onNavigate={closeMega} />
        </div>
      </header>

      <MobileMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
