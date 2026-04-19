# Mobile Hamburger Menu — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a slide-in drawer mobile navigation that makes the site usable below the `lg` (1024px) breakpoint.

**Architecture:** New `MobileMenu.tsx` component owns all drawer UI; `header.tsx` owns open/close state and renders the hamburger button. Desktop nav items (Help, Login, Theme toggle) are hidden on mobile — the drawer provides equivalents. Two tasks, two commits.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, `next-themes`, `"use client"`, `useRef`/`useEffect`/`useState`

---

## File Map

| File | Task | Action |
|---|---|---|
| `layouts/header/MobileMenu.tsx` | 1 | Create |
| `layouts/header/header.tsx` | 2 | Modify |

---

## Task 1: Create MobileMenu.tsx

**Files:**
- Create: `layouts/header/MobileMenu.tsx`

**Context:** This is a `"use client"` component. It receives `open`, `onClose`, `navbar`, and `navLinks` as props — it owns no open/close state itself. It contains one internal sub-component `MobileAccordion` for the Web Hosting dropdown. The hosting links are duplicated here (not imported from `WebHostingMegaMenu.tsx`) to keep the component self-contained.

The `cn` utility is at `@/utils/cn`. The `useTheme` hook is from `next-themes`. `Image` and `Link` are from `next/image` and `next/link`.

- [ ] **Step 1: Create the file with the complete implementation**

Create `/Users/sandipandas/Documents/devops/dronahost-2026/layouts/header/MobileMenu.tsx` with this exact content:

```tsx
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

  return (
    <div>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
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
        <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-700">
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
  const { theme, setTheme } = useTheme();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Focus close button when drawer opens */
  useEffect(() => {
    if (open) {
      closeButtonRef.current?.focus();
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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

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
            item.hasDropdown ? (
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
            <span aria-hidden="true">{theme === "dark" ? "🌞" : "🌙"}</span>
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npx tsc --noEmit
```

Expected: no errors from `MobileMenu.tsx`. Pre-existing errors in other files are acceptable.

- [ ] **Step 3: Commit**

```bash
git add layouts/header/MobileMenu.tsx
git commit -m "feat(mobile-menu): add MobileMenu drawer component"
```

---

## Task 2: Update header.tsx — hamburger button + wire MobileMenu

**Files:**
- Modify: `layouts/header/header.tsx`

**Context:** The current header already has `"use client"`, `useState`, `useEffect`, `useRef` imported. The `RIGHT SIDE` div (around line 138) contains Help dropdown, Login link, and Theme toggle — these are all visible on mobile too, which is incorrect. The plan:
1. Add `isMobileMenuOpen` state
2. Add hamburger button (`lg:hidden`) as first child of the right-side div
3. Wrap Help dropdown, Login link, and Theme toggle in a `hidden lg:flex` div so they hide on mobile
4. Import and render `<MobileMenu>` just before the closing `</header>` tag

The existing `header.tsx` content for reference (right-side section, lines ~138–205):

```tsx
{/* RIGHT SIDE */}
<div className="flex items-center gap-3">

  {/* HELP DROPDOWN */}
  <div
    className="relative"
    ref={helpMenuRef}
    onMouseEnter={() => { ... }}
  >
    <button onClick={...} className="...">Help</button>
    <DropDownMenu open={isHelpOpen} />
  </div>

  {/* LOGIN */}
  <Link href={navbar.cta.link} className="...">
    <svg .../>
    {navbar.cta.label}
  </Link>

  {/* THEME TOGGLE */}
  <button onClick={...} className="...">
    {theme === "dark" ? "🌞" : "🌙"}
  </button>
</div>
```

- [ ] **Step 1: Add `isMobileMenuOpen` state**

In `layouts/header/header.tsx`, find the existing state declarations (around line 23–25):

```tsx
const [isHelpOpen, setIsHelpOpen] = useState(false);
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
```

Add after them:

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

- [ ] **Step 2: Add MobileMenu import**

At the top of the file, after the existing imports, add:

```tsx
import MobileMenu from "@/layouts/header/MobileMenu";
```

- [ ] **Step 3: Add hamburger button and wrap desktop-only items**

Find the `{/* RIGHT SIDE */}` block. Replace the entire `<div className="flex items-center gap-3">` and its children with:

```tsx
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
```

- [ ] **Step 4: Render MobileMenu before closing `</header>`**

Find the closing structure of the header JSX. Currently it looks like:

```tsx
        <WebHostingMegaMenu open={activeDropdown === "wordpress-hosting"} />
      </div>
    </header>

    <div className="h-20" />
  </>
);
```

Add `<MobileMenu>` between `WebHostingMegaMenu` and the closing `</div>`:

```tsx
        <WebHostingMegaMenu open={activeDropdown === "wordpress-hosting"} />

        <MobileMenu
          open={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          navbar={navbar}
          navLinks={navLinks}
        />
      </div>
    </header>

    <div className="h-20" />
  </>
);
```

- [ ] **Step 5: Type-check**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npx tsc --noEmit
```

Expected: no errors from `header.tsx` or `MobileMenu.tsx`.

- [ ] **Step 6: Visual check**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Resize window to < 1024px wide (or use DevTools device emulation).

Confirm:
- Hamburger icon (3 lines) appears in header on mobile, desktop nav items (Help, Login, theme) are hidden
- Clicking hamburger opens drawer from the right with logo + close button
- All nav links appear in drawer
- Web Hosting link has a chevron and expands to show hosting sub-links
- Escape key closes the drawer
- Clicking backdrop closes the drawer
- Login CTA and theme toggle appear in drawer bottom bar
- On desktop (> 1024px): hamburger gone, Help/Login/theme visible as before — no regression

- [ ] **Step 7: Commit**

```bash
git add layouts/header/header.tsx
git commit -m "feat(header): add hamburger button and wire MobileMenu for mobile nav"
```
