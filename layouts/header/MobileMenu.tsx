"use client";

import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NavItem = {
  label: string;
  hasDropdown: boolean;
};

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navbar: {
    menu: NavItem[];
    cta: { label: string; link: string };
  };
  navLinks: Record<string, string>;
};

/* Hosting links duplicated here to keep MobileMenu self-contained */
const mobileHostingLinks = [
  { title: "Web Hosting", href: "/wordpress-hosting" },
  { title: "Hosting for WordPress", href: "/wordpress-hosting" },
  { title: "Cloud Hosting", href: "/cloud-hosting" },
  { title: "VPS Hosting", href: "/vps-hosting" },
  { title: "Domains", href: "/domains" },
  { title: "Agency Program", href: "/agency" },
  { title: "Reseller Hosting", href: "/reseller-hosting" },
  { title: "Affiliate Program", href: "/affiliate" },
];

function MobileAccordion({
  item,
  onClose,
}: {
  item: NavItem;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = `accordion-${item.label.replace(/\s+/g, "-").toLowerCase()}`;

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-controls={contentId}
        className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left text-[15px] font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 transition"
      >
        {item.label}
        <svg
          viewBox="0 0 20 20"
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M5 7.5 10 12.5 15 7.5" />
        </svg>
      </button>

      {isOpen && (
        <div id={contentId} className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
          {mobileHostingLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              onClick={onClose}
              className="block rounded-lg px-3 py-2 text-[14px] text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-slate-100 transition"
            >
              {link.title}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MobileMenu({
  open,
  onClose,
  navbar,
  navLinks,
}: MobileMenuProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<Element | null>(null);

  /* Focus close button when drawer opens; restore focus when it closes */
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement;
      closeButtonRef.current?.focus();
    } else {
      (previousFocusRef.current as HTMLElement | null)?.focus();
    }
  }, [open]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape key closes */
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  /* Focus trap */
  const handlePanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const focusable = Array.from(
      panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer panel */}
      <div
        ref={panelRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        onKeyDown={handlePanelKeyDown}
        className={cn(
          "fixed top-0 right-0 z-[999] h-full w-80 bg-white dark:bg-slate-950 shadow-2xl flex flex-col lg:hidden transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <Link href="/" onClick={onClose} className="flex items-center">
            <Image
              src="/images/home/dronahostLogo.svg"
              alt="DronaHost"
              width={120}
              height={32}
              className="h-8 w-auto dark:brightness-[1.15] dark:saturate-[1.1]"
            />
          </Link>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close navigation menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable nav */}
        <nav
          aria-label="Mobile navigation links"
          className="flex-1 overflow-y-auto px-4 py-4 space-y-1"
        >
          {navbar.menu.map((item) =>
            item.hasDropdown && item.label === "Web Hosting" ? (
              <MobileAccordion key={item.label} item={item} onClose={onClose} />
            ) : (
              <Link
                key={item.label}
                href={navLinks[item.label] ?? "/"}
                onClick={onClose}
                className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 transition"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

          <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Help
          </p>
          <Link
            href="/contact"
            onClick={onClose}
            className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 transition"
          >
            Contact Us
          </Link>
          <Link
            href="/blog"
            onClick={onClose}
            className="block rounded-lg px-3 py-3 text-[15px] font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800/60 transition"
          >
            Blog
          </Link>
        </nav>

        {/* Bottom bar */}
        <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-3">
          <Link
            href={navbar.cta.link}
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.2" />
              <path d="M5.5 19c1-3.2 3.6-4.8 6.5-4.8s5.5 1.6 6.5 4.8" />
            </svg>
            {navbar.cta.label}
          </Link>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle colour theme"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 transition"
          >
            {resolvedTheme === "dark" ? (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </>
  );
}
