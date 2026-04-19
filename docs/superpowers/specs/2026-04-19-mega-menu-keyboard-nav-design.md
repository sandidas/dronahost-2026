# Mega Menu Keyboard Navigation — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Priority:** 🟠 High — WCAG 2.1 AA requirement

---

## 1. Problem Statement

The desktop navigation has two dropdown triggers with zero keyboard support:
- "Web Hosting" nav item is a `<Link>` that opens a mega menu on mouse hover only — keyboard users can't open it
- "Help" button has no `aria-expanded`, no `aria-controls`, no Escape-to-close

Neither panel can be closed with Escape. Focus is not restored to the trigger on close. This fails WCAG 2.1 AA Success Criteria 2.1.1 (Keyboard) and 4.1.2 (Name, Role, Value).

---

## 2. Architecture

Three files modified, no new files created.

| File | Change |
|---|---|
| `layouts/header/header.tsx` | Keyboard handlers, ARIA attrs on triggers, focus refs |
| `layouts/header/WebHostingMegaMenu.tsx` | Add `id`, `aria-label`, `onClose` prop, Escape handler |
| `layouts/header/drop-downMenu.tsx` | Add `id`, `aria-label`, `onClose` prop, Escape handler |

---

## 3. Changes to `header.tsx`

### 3.1 New ref

```tsx
const webHostingTriggerRef = useRef<HTMLButtonElement>(null);
const helpTriggerRef = useRef<HTMLButtonElement>(null);
```

### 3.2 "Web Hosting" nav item — `<Link>` → `<button>`

Items with `hasDropdown` currently render as `<Link>`. "Web Hosting" is the only `hasDropdown: true` item in the nav (all others are plain links). Change the nav item for "Web Hosting" to:

```tsx
<button
  key={item.label}
  ref={webHostingTriggerRef}
  onClick={() => {
    setIsHelpOpen(false);
    setActiveDropdown((prev) =>
      prev === "wordpress-hosting" ? null : "wordpress-hosting"
    );
  }}
  onKeyDown={(e) => {
    if (e.key === "Escape") {
      setActiveDropdown(null);
      webHostingTriggerRef.current?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const panel = document.getElementById("web-hosting-mega-menu");
      const firstFocusable = panel?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      firstFocusable?.focus();
    }
  }}
  aria-expanded={activeDropdown === "wordpress-hosting"}
  aria-controls="web-hosting-mega-menu"
  aria-haspopup="true"
  className={cn(
    "flex items-center gap-1 text-[16px] font-semibold transition cursor-pointer",
    isSolidHeader
      ? "text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white"
      : "text-white/95 hover:text-white",
    activeDropdown === "wordpress-hosting" && "text-indigo-600"
  )}
>
  <span>{item.label}</span>
  <svg
    viewBox="0 0 20 20"
    className={cn("h-4 w-4 transition-transform", activeDropdown === "wordpress-hosting" && "rotate-180")}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 7.5 10 12.5 15 7.5" />
  </svg>
</button>
```

Items without `hasDropdown` remain as `<Link>` elements (no change).

The nav `.map()` becomes a conditional: if `item.hasDropdown && item.label === "Web Hosting"`, render the button above; otherwise render the existing `<Link>`.

### 3.3 Help button — add ARIA attrs and ref

```tsx
<button
  ref={helpTriggerRef}
  onClick={() => {
    setActiveDropdown(null);
    setIsHelpOpen((prev) => !prev);
  }}
  onKeyDown={(e) => {
    if (e.key === "Escape") {
      setIsHelpOpen(false);
      helpTriggerRef.current?.focus();
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const panel = document.getElementById("help-dropdown");
      const firstFocusable = panel?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      firstFocusable?.focus();
    }
  }}
  aria-expanded={isHelpOpen}
  aria-controls="help-dropdown"
  aria-haspopup="true"
  className={cn(/* existing classes unchanged */)}
>
  Help
</button>
```

### 3.4 Close callbacks passed to panels

```tsx
<WebHostingMegaMenu
  open={activeDropdown === "wordpress-hosting"}
  onClose={() => {
    setActiveDropdown(null);
    webHostingTriggerRef.current?.focus();
  }}
/>

<DropDownMenu
  open={isHelpOpen}
  onClose={() => {
    setIsHelpOpen(false);
    helpTriggerRef.current?.focus();
  }}
/>
```

### 3.5 Global Escape effect

Add a `useEffect` that closes all open menus on Escape (catches the case where focus is inside a panel but the Escape keydown fires on the panel element):

```tsx
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      if (activeDropdown === "wordpress-hosting") {
        setActiveDropdown(null);
        webHostingTriggerRef.current?.focus();
      }
      if (isHelpOpen) {
        setIsHelpOpen(false);
        helpTriggerRef.current?.focus();
      }
    }
  };
  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [activeDropdown, isHelpOpen]);
```

---

## 4. Changes to `WebHostingMegaMenu.tsx`

### 4.1 Updated props

```ts
type WebHostingMegaMenuProps = {
  open: boolean;
  onClose: () => void;
};
```

### 4.2 Panel element — add `id` and `aria-label`

```tsx
<div
  id="web-hosting-mega-menu"
  aria-label="Web Hosting navigation"
  className="absolute left-1/2 top-full z-1200 w-[min(96vw,1600px)] -translate-x-1/2 pt-3"
>
```

`if (!open) return null` stays — panel is unmounted when closed (no visibility toggle needed since focus is managed via triggerRef).

---

## 5. Changes to `drop-downMenu.tsx`

### 5.1 Updated props

```ts
type DropDownMenuProps = {
  open: boolean;
  onClose: () => void;
};
```

### 5.2 Panel element — add `id` and `aria-label`

```tsx
<div
  id="help-dropdown"
  aria-label="Help navigation"
  className="absolute right-0 top-full mt-3 w-96 sm:w-130 ..."
>
```

`onClose` is available if needed for internal Escape handling, but since the global effect in `header.tsx` covers it, no additional `useEffect` is needed inside `DropDownMenu`. The prop is accepted to keep the interface consistent and allow future internal use.

---

## 6. Focus Flow (complete)

```
Tab → "Web Hosting" button
  Enter / Space → mega menu opens (aria-expanded: true)
  ArrowDown     → focus moves to first link inside #web-hosting-mega-menu
  Tab           → cycles through all links in the panel
  Escape        → menu closes, focus returns to "Web Hosting" button

Tab → "Help" button
  Enter / Space → dropdown opens (aria-expanded: true)
  ArrowDown     → focus moves to first link inside #help-dropdown
  Tab           → cycles through Contact Us, Blog links
  Escape        → dropdown closes, focus returns to "Help" button

Click outside  → existing mouseLeave handler closes menus (unchanged)
```

---

## 7. Accessibility Checklist

- ✅ SC 2.1.1 Keyboard: all dropdown functionality reachable by keyboard
- ✅ SC 2.4.3 Focus Order: focus enters mega menu in DOM order
- ✅ SC 2.4.7 Focus Visible: focus-visible styles from globals.css apply to all links/buttons
- ✅ SC 4.1.2 Name, Role, Value: `aria-expanded`, `aria-controls`, `aria-haspopup` on all triggers
- ✅ Focus restored to trigger on Escape close

---

## 8. Out of Scope

- Arrow Up/Down key navigation between mega menu items (not required for WCAG 2.1 AA disclosure pattern)
- `role="menu"` / `role="menuitem"` ARIA menubar pattern (overkill for disclosure nav)
- Roving tabindex within panel
- Animated open/close transition (existing instant show/hide unchanged)
