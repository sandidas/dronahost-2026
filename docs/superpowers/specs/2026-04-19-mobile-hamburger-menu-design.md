# Mobile Hamburger Menu — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Pattern:** Slide-in drawer from right

---

## 1. Problem Statement

The desktop nav (`<nav className="hidden lg:flex">`) is completely invisible on mobile. Below the `lg` breakpoint (1024px) there is no way to navigate the site. This is a launch blocker.

---

## 2. Architecture

Two files:

| File | Action |
|---|---|
| `layouts/header/MobileMenu.tsx` | Create — drawer component, `"use client"` |
| `layouts/header/header.tsx` | Modify — add hamburger button, `isMobileMenuOpen` state, render `<MobileMenu>` |

`MobileMenu` is stateless with respect to open/close — `header.tsx` owns that state and passes `open` + `onClose`. This makes the component independently renderable in the `/v2` showcase.

---

## 3. MobileMenu Component

### File: `layouts/header/MobileMenu.tsx`

```ts
"use client"

Props:
  open: boolean
  onClose: () => void
  navbar: { menu: { label: string; hasDropdown: boolean }[]; cta: { label: string; link: string } }
  navLinks: Record<string, string>
```

### DOM structure

```
<>
  {/* Backdrop */}
  <div
    aria-hidden="true"
    onClick={onClose}
    className="fixed inset-0 z-[998] bg-black/40 backdrop-blur-sm lg:hidden"
    [visible only when open, transition opacity]
  />

  {/* Drawer panel */}
  <div
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label="Mobile navigation"
    className="fixed top-0 right-0 z-[999] h-full w-80 bg-white dark:bg-slate-950
               shadow-2xl flex flex-col lg:hidden
               transition-transform duration-300
               [translate-x-full when closed, translate-x-0 when open]"
  >
    {/* Top bar */}
    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-700">
      <Link href="/" onClick={onClose}>
        <Image src="/images/home/dronahostLogo.svg" alt="DronaHost" width={120} height={32} />
      </Link>
      <button
        ref={closeButtonRef}   ← receives focus on open
        onClick={onClose}
        aria-label="Close navigation menu"
        className="..."
      >
        ✕ icon
      </button>
    </div>

    {/* Scrollable nav area */}
    <nav aria-label="Mobile navigation links" className="flex-1 overflow-y-auto px-4 py-4">

      {/* Main nav items */}
      {navbar.menu.map(item =>
        item.hasDropdown
          ? <MobileAccordion item={item} navLinks={navLinks} onClose={onClose} />
          : <MobileNavLink item={item} navLinks={navLinks} onClose={onClose} />
      )}

      {/* Divider */}
      <div className="my-4 border-t border-slate-200 dark:border-slate-700" />

      {/* Help section */}
      <p className="px-3 text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Help</p>
      <Link href="/contact" onClick={onClose}>Contact Us</Link>
      <Link href="/blog" onClick={onClose}>Blog</Link>
    </nav>

    {/* Bottom bar */}
    <div className="border-t border-slate-200 dark:border-slate-700 px-5 py-4 space-y-3">
      {/* Login CTA */}
      <Link
        href={navbar.cta.link}
        onClick={onClose}
        className="flex w-full items-center justify-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium ..."
      >
        {navbar.cta.label}
      </Link>

      {/* Theme toggle */}
      <button onClick={toggleTheme} className="..." aria-label="Toggle colour theme">
        sun/moon icon + label
      </button>
    </div>
  </div>
</>
```

### MobileAccordion (internal sub-component, same file)

- State: `isOpen: boolean`
- Renders chevron that rotates 180deg when open
- Expanding section shows all `leftColumn` and `rightColumn` items from `WebHostingMegaMenu` as plain `<Link>` rows with icon + title (description omitted for space)
- `aria-expanded` on the accordion trigger button

The mega menu items are hardcoded in `WebHostingMegaMenu.tsx`. To avoid importing them into `MobileMenu` (creating a dependency on a desktop-only file), duplicate the data as a `mobileHostingLinks` constant inside `MobileMenu.tsx`. This keeps the mobile menu self-contained. If the data changes frequently, extract to a shared `data/nav.ts` file — but that is out of scope for this task.

### Behaviours

| Behaviour | Implementation |
|---|---|
| Escape key closes | `useEffect` adds `keydown` listener, calls `onClose` on Escape |
| Body scroll locked when open | `useEffect` toggles `document.body.style.overflow = 'hidden'` |
| Focus on close button when opened | `useEffect` calls `closeButtonRef.current?.focus()` when `open` becomes true |
| Focus trap | `onKeyDown` on panel intercepts Tab/Shift+Tab, cycles through focusable elements within panel |
| Transition | `translate-x-full` → `translate-x-0` via Tailwind + CSS transition, controlled by `open` prop |

---

## 4. Changes to header.tsx

### New state

```tsx
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

### Hamburger button (inside RIGHT SIDE div, before Help dropdown)

```tsx
{/* HAMBURGER — mobile only */}
<button
  className="flex lg:hidden items-center justify-center h-10 w-10 rounded-full border border-slate-300 dark:border-slate-600"
  onClick={() => setIsMobileMenuOpen(true)}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-menu"
  aria-label="Open navigation menu"
>
  {/* 3-line icon */}
  <svg viewBox="0 0 24 24" className="h-5 w-5" ...>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
</button>
```

### MobileMenu rendered at bottom of header JSX (before closing `</header>`)

```tsx
<MobileMenu
  open={isMobileMenuOpen}
  onClose={() => setIsMobileMenuOpen(false)}
  navbar={navbar}
  navLinks={navLinks}
/>
```

### Close mobile menu on route change

When a nav link is clicked, `onClose` is passed down and called — this handles closing on navigation without needing a router event listener.

---

## 5. Styling

- Drawer width: `w-80` (320px) — standard for mobile drawers
- Z-index: backdrop `z-[998]`, panel `z-[999]` — above the fixed header (`z-999`)
- Transition: `transition-transform duration-300 ease-in-out`
- Dark mode: full dark support via `dark:` Tailwind classes, same tokens as header
- No animations on the accordion (simple show/hide) — keeps it fast on low-end devices

---

## 6. Accessibility

- `role="dialog"` + `aria-modal="true"` + `aria-label="Mobile navigation"` on panel
- Close button gets focus on open (via ref + useEffect)
- Focus trap prevents Tab from escaping the panel
- Escape key closes
- Backdrop has `aria-hidden="true"` (not a focusable control)
- All interactive elements have visible focus rings (inherits `focus-visible` from globals.css)
- Hamburger `aria-expanded` reflects open state

---

## 7. Out of Scope

- Animated hamburger → X icon morphing (CSS only, not required for WCAG)
- Swipe-to-close gesture (touch event handling)
- Extracting nav data to `data/nav.ts` (can be done as follow-up when data changes frequently)
- Keyboard arrow-key navigation within accordion (mega menu keyboard nav is a separate High priority item)
