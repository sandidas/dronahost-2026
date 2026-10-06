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
  "inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-foreground";

/** Sticky site header: logo, primary navigation with hosting mega menu, account and theme controls. */
export default function Header() {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeMega = useCallback(() => setMegaOpen(false), []);

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

  return (
    <>
      <header
        inert={drawerOpen || undefined}
        className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md"
      >
        <div ref={rootRef} className="relative" onMouseLeave={closeMega}>
          <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <Link href="/" aria-label="DronaHost home" className="flex shrink-0 items-center rounded-lg">
              <Logo size="md" priority />
            </Link>

            <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={megaOpen}
                aria-controls={MEGA_ID}
                onClick={() => setMegaOpen((v) => !v)}
                onMouseEnter={() => setMegaOpen(true)}
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
              <div className="hidden items-center gap-2 lg:flex">
                <CurrencySelector />
                <ThemeToggle />
                {FEATURES.accountArea && (
                  <Button href={ACCOUNT_LINK.href} variant="ghost" size="sm" leadingIcon={<LogIn className="size-4" aria-hidden="true" />}>
                    {ACCOUNT_LINK.label}
                  </Button>
                )}
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
                className="btn btn-secondary size-11 !min-h-11 !px-0 lg:hidden"
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
