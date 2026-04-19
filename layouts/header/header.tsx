"use client";

import homeData from "@/data/home.json";
import DropDownMenu from "@/layouts/header/drop-downMenu";
import WebHostingMegaMenu from "@/layouts/header/WebHostingMegaMenu";
import MobileMenu from "@/layouts/header/MobileMenu";
import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const navbar = homeData.navbar;
  const navLinks: Record<string, string> = {
    "Web Hosting": "/wordpress-hosting",
    Wordpress: "/",
    "Website Building": "/",
    "E commerce": "/experience-growth",
    Price: "/pricing",
  };

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const helpMenuRef = useRef<HTMLDivElement>(null);
  const webHostingTriggerRef = useRef<HTMLButtonElement>(null);
  const helpTriggerRef = useRef<HTMLButtonElement>(null);

  /*  Fix hydration */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*  Close dropdown on outside click with stable effect deps */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!helpMenuRef.current?.contains(e.target as Node)) {
        setIsHelpOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeDropdown === "wordpress-hosting") {
        setActiveDropdown(null);
        webHostingTriggerRef.current?.focus();
      }
      if (isHelpOpen) {
        setIsHelpOpen(false);
        helpTriggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeDropdown, isHelpOpen]);

  const isSolidHeader = true;

  const handleNavHover = (label: string, hasDropdown: boolean) => {
    if (!hasDropdown) {
      setActiveDropdown(null);
      return;
    }

    if (label === "Web Hosting") {
      setActiveDropdown("wordpress-hosting");
      return;
    }

    setActiveDropdown("nav-hover");
  };

  return (
    <>
      <header
        inert={isMobileMenuOpen || undefined}
        className={cn(
          "fixed top-0 left-0 right-0 z-999 transition-all duration-200",
          isSolidHeader
            ? "bg-white/95 text-slate-900 shadow-sm backdrop-blur border-b border-slate-200 dark:bg-slate-950/90 dark:border-slate-700 dark:text-slate-100"
            : "bg-transparent text-white border-b border-transparent"
        )}
      >
        <div
          className="relative"
          onMouseLeave={() => {
            setIsHelpOpen(false);
            setActiveDropdown(null);
          }}
        >
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

            {/* LOGO */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/home/dronahostLogo.svg"
                alt="DronaHost"
                width={150}
                height={40}
                className="h-9 w-auto transition-opacity duration-200 dark:brightness-[1.15] dark:saturate-[1.1]"
                priority
              />
            </Link>

            {/* MENU */}
            <nav className="hidden lg:flex items-center gap-8">
              {navbar.menu.map((item) => {
                const isWebHosting = item.hasDropdown && item.label === "Web Hosting";
                const isActive = isWebHosting && activeDropdown === "wordpress-hosting";

                if (isWebHosting) {
                  return (
                    <button
                      key={item.label}
                      ref={webHostingTriggerRef}
                      onClick={() => {
                        setIsHelpOpen(false);
                        setActiveDropdown((prev) =>
                          prev === "wordpress-hosting" ? null : "wordpress-hosting"
                        );
                      }}
                      onMouseEnter={() => {
                        setIsHelpOpen(false);
                        handleNavHover(item.label, item.hasDropdown);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault();
                          const panel = document.getElementById("web-hosting-mega-menu");
                          const firstFocusable = panel?.querySelector<HTMLElement>(
                            "a[href], button:not([disabled])"
                          );
                          firstFocusable?.focus();
                        }
                      }}
                      aria-expanded={isActive}
                      aria-controls="web-hosting-mega-menu"
                      aria-haspopup="menu"
                      className={cn(
                        "flex items-center gap-1 text-[16px] font-semibold transition cursor-pointer",
                        isSolidHeader
                          ? "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                          : "text-white/95 hover:text-white",
                        isActive && "text-indigo-600"
                      )}
                    >
                      <span>{item.label}</span>
                      <svg
                        viewBox="0 0 20 20"
                        className={cn("h-4 w-4 transition-transform", isActive && "rotate-180")}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M5 7.5 10 12.5 15 7.5" />
                      </svg>
                    </button>
                  );
                }

                return (
                  <Link
                    key={item.label}
                    href={navLinks[item.label] ?? "/"}
                    onMouseEnter={() => {
                      setIsHelpOpen(false);
                      handleNavHover(item.label, item.hasDropdown);
                    }}
                    className={cn(
                      "flex items-center gap-1 text-[16px] font-semibold transition cursor-pointer",
                      isSolidHeader
                        ? "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
                        : "text-white/95 hover:text-white"
                    )}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

              {/* HAMBURGER — mobile only */}
              <button
                className="flex lg:hidden h-10 w-10 items-center justify-center rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label="Open navigation menu"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-5 w-5 text-slate-700 dark:text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* DESKTOP-ONLY: Help, Login, Theme toggle */}
              <div className="hidden lg:flex items-center gap-3">

                {/* HELP DROPDOWN */}
                <div
                  className="relative"
                  ref={helpMenuRef}
                  onMouseEnter={() => {
                    setActiveDropdown("nav-hover");
                    setIsHelpOpen(true);
                  }}
                >
                  <button
                    ref={helpTriggerRef}
                    onClick={() => {
                      setActiveDropdown(null);
                      setIsHelpOpen((prev) => !prev);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowDown") {
                        e.preventDefault();
                        const panel = document.getElementById("help-dropdown");
                        const firstFocusable = panel?.querySelector<HTMLElement>(
                          "a[href], button:not([disabled])"
                        );
                        firstFocusable?.focus();
                      }
                    }}
                    aria-expanded={isHelpOpen}
                    aria-controls="help-dropdown"
                    aria-haspopup="menu"
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-medium transition",
                      isSolidHeader
                        ? "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                        : "border-white/60 text-white hover:bg-white/10"
                    )}
                  >
                    Help
                  </button>

                  {/* Dropdown */}
                  <DropDownMenu
                    open={isHelpOpen}
                    onClose={() => {
                      setIsHelpOpen(false);
                      helpTriggerRef.current?.focus();
                    }}
                  />
                </div>

                {/* LOGIN */}
                <Link
                  href={navbar.cta.link}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition",
                    isSolidHeader
                      ? "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
                      : "border-white/60 text-white hover:bg-white/10"
                  )}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="12" cy="8" r="3.2" />
                    <path d="M5.5 19c1-3.2 3.6-4.8 6.5-4.8s5.5 1.6 6.5 4.8" />
                  </svg>
                  {navbar.cta.label}
                </Link>

                {/* THEME TOGGLE */}
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  aria-label={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle colour theme"}
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border transition",
                    isSolidHeader
                      ? "border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                      : "border-white/60 text-white hover:bg-white/10"
                  )}
                >
                  {mounted ? (
                    theme === "dark" ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <circle cx="12" cy="12" r="4"/>
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                      </svg>
                    )
                  ) : (
                    <span className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <WebHostingMegaMenu
            open={activeDropdown === "wordpress-hosting"}
            onClose={() => {
              setActiveDropdown(null);
              webHostingTriggerRef.current?.focus();
            }}
          />
        </div>
      </header>

      <div className="h-20" />
      <MobileMenu
        open={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navbar={navbar}
        navLinks={navLinks}
      />
    </>
  );
}