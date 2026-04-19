# Mega Menu Keyboard Navigation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add WCAG 2.1 AA keyboard accessibility to the desktop mega menu and Help dropdown — Escape to close, ArrowDown to enter panel, correct ARIA attributes on all triggers.

**Architecture:** Three files modified in order (Tasks 1 and 2 first since they add the `onClose` prop consumed by Task 3). `WebHostingMegaMenu` and `DropDownMenu` each gain an `onClose: () => void` prop and panel `id`/`aria-label`. `header.tsx` gains two trigger refs, converts the "Web Hosting" nav item from `<Link>` to `<button>`, adds `aria-expanded`/`aria-controls`/`aria-haspopup` to both triggers, and adds keyboard handlers plus a global Escape `useEffect`.

**Tech Stack:** Next.js 16 App Router, React `useRef`/`useEffect`, TypeScript strict, Tailwind CSS, `next-themes`.

---

## File Map

| File | Action |
|---|---|
| `layouts/header/WebHostingMegaMenu.tsx` | Add `onClose` prop + `id`/`aria-label` on panel div |
| `layouts/header/drop-downMenu.tsx` | Add `onClose` prop + `id`/`aria-label` on panel div |
| `layouts/header/header.tsx` | Refs, button trigger, ARIA attrs, keyboard handlers, global Escape effect |

---

## Task 1: Update `WebHostingMegaMenu.tsx`

**Files:**
- Modify: `layouts/header/WebHostingMegaMenu.tsx`

Current props type:
```ts
type WebHostingMegaMenuProps = {
  open: boolean;
};
```

- [ ] **Step 1: Update the props type**

Find:
```ts
type WebHostingMegaMenuProps = {
  open: boolean;
};
```

Replace with:
```ts
type WebHostingMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};
```

- [ ] **Step 2: Accept `onClose` in the function signature**

Find:
```tsx
export default function WebHostingMegaMenu({ open }: WebHostingMegaMenuProps) {
```

Replace with:
```tsx
export default function WebHostingMegaMenu({ open, onClose }: WebHostingMegaMenuProps) {
```

(Note: `onClose` is available for future internal use such as closing on link click. It is passed through but not wired to a `useEffect` inside this component — the global `useEffect` in `header.tsx` handles Escape. The prop ensures the interface is consistent and the component can call it if needed.)

- [ ] **Step 3: Add `id` and `aria-label` to the outer panel div**

Find:
```tsx
<div className="absolute left-1/2 top-full z-1200 w-[min(96vw,1600px)] -translate-x-1/2 pt-3">
```

Replace with:
```tsx
<div
  id="web-hosting-mega-menu"
  aria-label="Web Hosting navigation"
  className="absolute left-1/2 top-full z-1200 w-[min(96vw,1600px)] -translate-x-1/2 pt-3"
>
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npx tsc --noEmit
```

Expected: TypeScript will now report an error in `header.tsx` because it passes `<WebHostingMegaMenu open={...} />` without the required `onClose` prop. That is expected — it will be fixed in Task 3. If you see only that error (and no others in `WebHostingMegaMenu.tsx` itself), Task 1 is correct.

- [ ] **Step 5: Commit**

```bash
git add layouts/header/WebHostingMegaMenu.tsx
git commit -m "feat(nav): add onClose prop and panel id/aria-label to WebHostingMegaMenu"
```

---

## Task 2: Update `drop-downMenu.tsx`

**Files:**
- Modify: `layouts/header/drop-downMenu.tsx`

Current props type:
```ts
type DropDownMenuProps = {
  open: boolean;
};
```

- [ ] **Step 1: Update the props type**

Find:
```ts
type DropDownMenuProps = {
	open: boolean;
};
```

Replace with:
```ts
type DropDownMenuProps = {
	open: boolean;
	onClose: () => void;
};
```

- [ ] **Step 2: Accept `onClose` in the function signature**

Find:
```tsx
export default function DropDownMenu({ open }: DropDownMenuProps) {
```

Replace with:
```tsx
export default function DropDownMenu({ open, onClose }: DropDownMenuProps) {
```

- [ ] **Step 3: Add `id` and `aria-label` to the panel div**

Find:
```tsx
<div className="absolute right-0 top-full mt-3 w-96 sm:w-130 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] sm:p-6 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[0_30px_90px_-48px_rgba(2,6,23,0.95)]">
```

Replace with:
```tsx
<div
  id="help-dropdown"
  aria-label="Help navigation"
  className="absolute right-0 top-full mt-3 w-96 sm:w-130 rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 shadow-[0_24px_80px_-36px_rgba(15,23,42,0.45)] sm:p-6 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:shadow-[0_30px_90px_-48px_rgba(2,6,23,0.95)]"
>
```

- [ ] **Step 4: Type-check**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npx tsc --noEmit
```

Expected: TypeScript will report an error in `header.tsx` for the missing `onClose` prop on `<DropDownMenu>` as well. Only errors in `header.tsx` are expected — not in `drop-downMenu.tsx` itself.

- [ ] **Step 5: Commit**

```bash
git add layouts/header/drop-downMenu.tsx
git commit -m "feat(nav): add onClose prop and panel id/aria-label to DropDownMenu"
```

---

## Task 3: Update `header.tsx` — refs, button trigger, ARIA, keyboard handlers

**Files:**
- Modify: `layouts/header/header.tsx`

This task has multiple focused steps. Read the current file first to confirm the exact content before each edit.

**Current state of key sections (from codebase as of this plan's writing):**

```tsx
// Existing refs (line ~29-30):
const helpMenuRef = useRef<HTMLDivElement>(null);

// Existing nav map (lines ~101-135):
{navbar.menu.map((item) => {
  const isActive = item.label === "Web Hosting" && activeDropdown === "wordpress-hosting";
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

// Existing Help button (lines ~173-189):
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

// Existing DropDownMenu (line ~189):
<DropDownMenu open={isHelpOpen} />

// Existing WebHostingMegaMenu (line ~239):
<WebHostingMegaMenu open={activeDropdown === "wordpress-hosting"} />
```

- [ ] **Step 1: Add trigger refs after `helpMenuRef`**

Find:
```tsx
const helpMenuRef = useRef<HTMLDivElement>(null);
```

Replace with:
```tsx
const helpMenuRef = useRef<HTMLDivElement>(null);
const webHostingTriggerRef = useRef<HTMLButtonElement>(null);
const helpTriggerRef = useRef<HTMLButtonElement>(null);
```

- [ ] **Step 2: Add global Escape `useEffect` after the existing click-outside `useEffect`**

The existing click-outside effect ends around line 49. After it (before `const isSolidHeader = true;`), add:

```tsx
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
```

- [ ] **Step 3: Replace the nav `.map()` block**

Find the entire nav map block:
```tsx
{navbar.menu.map((item) => {
  const isActive = item.label === "Web Hosting" && activeDropdown === "wordpress-hosting";

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
```

Replace with:
```tsx
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
        aria-haspopup="true"
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
```

- [ ] **Step 4: Update the Help `<button>` — add ref, ARIA attrs, ArrowDown handler**

Find:
```tsx
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
```

Replace with:
```tsx
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
  aria-haspopup="true"
  className={cn(
    "rounded-full border px-4 py-2 text-sm font-medium transition",
    isSolidHeader
      ? "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      : "border-white/60 text-white hover:bg-white/10"
  )}
>
  Help
</button>
```

- [ ] **Step 5: Update `<DropDownMenu>` usage — add `onClose` prop**

Find:
```tsx
<DropDownMenu open={isHelpOpen} />
```

Replace with:
```tsx
<DropDownMenu
  open={isHelpOpen}
  onClose={() => {
    setIsHelpOpen(false);
    helpTriggerRef.current?.focus();
  }}
/>
```

- [ ] **Step 6: Update `<WebHostingMegaMenu>` usage — add `onClose` prop**

Find:
```tsx
<WebHostingMegaMenu open={activeDropdown === "wordpress-hosting"} />
```

Replace with:
```tsx
<WebHostingMegaMenu
  open={activeDropdown === "wordpress-hosting"}
  onClose={() => {
    setActiveDropdown(null);
    webHostingTriggerRef.current?.focus();
  }}
/>
```

- [ ] **Step 7: Type-check — expect clean**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npx tsc --noEmit
```

Expected: no errors. All three files now satisfy their updated type contracts. If you see `useRef<HTMLButtonElement>` errors, confirm the ref is attached to a `<button>` element (not a `<Link>`).

- [ ] **Step 8: Commit**

```bash
git add layouts/header/header.tsx
git commit -m "feat(nav): keyboard accessibility — button trigger, ARIA attrs, Escape/ArrowDown handlers"
```

---

## Task 4: Manual keyboard verification + docs update

**Files:**
- Modify: `docs/ui-fix-plan.md`

- [ ] **Step 1: Start dev server and verify keyboard behaviour**

```bash
cd /Users/sandipandas/Documents/devops/dronahost-2026 && npm run dev
```

Open `http://localhost:3000`. Use only the keyboard (no mouse):

1. Press Tab until focus reaches the "Web Hosting" button in the header
2. Confirm `aria-expanded="false"` visible in browser DevTools → Elements
3. Press Enter — mega menu opens, `aria-expanded="true"`
4. Press ArrowDown — focus moves to first link inside the mega menu panel
5. Press Tab — cycles through remaining links in the panel
6. Press Escape — menu closes, focus returns to "Web Hosting" button ✓

7. Press Tab until focus reaches "Help" button
8. Press Enter — Help dropdown opens
9. Press ArrowDown — focus moves to "Contact Us" link
10. Press Tab — focus moves to "Blog" link
11. Press Escape — dropdown closes, focus returns to "Help" button ✓

12. Toggle dark mode — confirm all interactive elements have visible focus rings in dark mode

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: completes without errors.

- [ ] **Step 3: Update `docs/ui-fix-plan.md`**

Find:
```
| Mega Menu | ⚠️ | No keyboard navigation (arrow keys, Escape). Not accessible. | 🟠 |
```

Replace with:
```
| Mega Menu | ✅ | Keyboard accessible — Escape to close, ArrowDown to enter panel, aria-expanded/controls/haspopup | — |
```

- [ ] **Step 4: Commit**

```bash
git add docs/ui-fix-plan.md
git commit -m "docs: mark Mega Menu keyboard nav as complete in ui-fix-plan"
```
