"use client";

import homeData from "@/data/home.json";
import DropDownMenu from "@/layouts/header/drop-downMenu";
import WebHostingMegaMenu from "@/layouts/header/WebHostingMegaMenu";
import { cn } from "@/utils/cn";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function Header() {
  const navbar = homeData.navbar;
  const navLinks: Record<string, string> = {
    "Web Hosting": "/web-hosting",
    Wordpress: "/",
    "Website Building": "/",
    "E commerce": "/Experience&Growth",
    Price: "/hosting-price",
  };

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const helpMenuRef = useRef<HTMLDivElement>(null);

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

  if (!mounted) return null;

  const isSolidHeader = true;

  const handleNavHover = (label: string, hasDropdown: boolean) => {
    if (!hasDropdown) {
      setActiveDropdown(null);
      return;
    }

    if (label === "Web Hosting") {
      setActiveDropdown("web-hosting");
      return;
    }

    setActiveDropdown("nav-hover");
  };

  return (
    <>
      <header
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
                alt="Dronahost Logo"
                width={150}
                height={40}
                className="h-9 w-auto"
                
              />
            </Link>

            {/* MENU */}
            <nav className="hidden lg:flex items-center gap-8">
              {navbar.menu.map((item) => {
                const isActive = item.label === "Web Hosting" && activeDropdown === "web-hosting";

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
                        : "text-white/95 hover:text-white",
                      isActive && "text-indigo-600"
                    )}
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
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
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-3">

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
                  onClick={() => {
                    setActiveDropdown("nav-hover");
                    setIsHelpOpen((prev) => !prev);
                  }}
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
                <DropDownMenu open={isHelpOpen} />
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
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border transition",
                  isSolidHeader
                    ? "border-slate-300 hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
                    : "border-white/60 text-white hover:bg-white/10"
                )}
              >
                {theme === "dark" ? "🌞" : "🌙"}
              </button>
            </div>
          </div>

          <WebHostingMegaMenu open={activeDropdown === "web-hosting"} />
        </div>
      </header>

      <div className="h-20" />
    </>
  );
}