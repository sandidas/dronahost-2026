# Button Component — Design Spec

**Date:** 2026-04-19
**Status:** Approved
**Priority:** 🟠 High — required before any form goes live

---

## 1. Problem Statement

The site has `.primary-btn` and `.secondary-btn` CSS classes used on `<Link>` and raw `<button>` elements. There is no reusable React `Button` component. The `/v2` showcase shows buttons without disabled or loading states. Forms cannot safely submit without a loading state (double-submit risk) or a disabled state (invalid input).

---

## 2. Architecture

| File | Action |
|---|---|
| `components/ui/Button.tsx` | Create — reusable client-compatible button component |
| `app/globals.css` | Modify — add disabled state and spinner animation CSS |
| `app/(dev)/v2/page.tsx` | Modify — replace raw `<button>` elements in Buttons section with `<Button>` component, update status to `built` |

---

## 3. Component Design

### File: `components/ui/Button.tsx`

- **No `"use client"`** — the component itself is pure JSX with no hooks; consumers add `"use client"` when needed
- Renders a native `<button>` element (not a `<Link>` — Links are for navigation, Buttons are for actions)
- Uses existing `.primary-btn` / `.secondary-btn` CSS classes
- `loading` prop implies `disabled` — prevents double-submission

### Props

```ts
type ButtonProps = {
  variant?: "primary" | "secondary";   // default: "primary"
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset"; // default: "button"
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};
```

### Component implementation

```tsx
import { cn } from "@/utils/cn";

export default function Button({
  variant = "primary",
  disabled = false,
  loading = false,
  type = "button",
  onClick,
  className,
  children,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={cn(
        variant === "primary" ? "primary-btn" : "secondary-btn",
        className
      )}
    >
      {loading ? (
        <>
          <svg
            className="btn-spinner mr-2 h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
          </svg>
          <span className="sr-only">Loading</span>
          <span aria-hidden="true">Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
```

---

## 4. CSS additions to `globals.css`

Append after the existing `.primary-btn:focus-visible` block:

```css
/* ── Button disabled state ── */
.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: none;
}

/* ── Button loading spinner ── */
@keyframes btn-spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-spinner {
  display: inline-block;
  animation: btn-spin 0.7s linear infinite;
}
```

---

## 5. `/v2` Buttons section update

Replace the raw `<button>` showcase with `<Button>` component instances showing all states. Update `status` from `"needs-work"` to `"built"`.

```tsx
import Button from "@/components/ui/Button";

<ShowcaseSection
  id="buttons"
  title="Buttons"
  status="built"
  notes="Primary and secondary variants. Disabled state and loading/spinner state implemented."
>
  <div className="space-y-6">
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Default</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary">Primary button</Button>
        <Button variant="secondary">Secondary button</Button>
      </div>
    </div>
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Disabled</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" disabled>Primary disabled</Button>
        <Button variant="secondary" disabled>Secondary disabled</Button>
      </div>
    </div>
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Loading</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="primary" loading>Primary loading</Button>
        <Button variant="secondary" loading>Secondary loading</Button>
      </div>
    </div>
  </div>
</ShowcaseSection>
```

---

## 6. Accessibility

- `disabled` attribute on the native `<button>` — browser prevents all interaction; assistive tech announces "dimmed" or "unavailable"
- `aria-busy={true}` when loading — screen readers announce the busy state
- Loading spinner SVG is `aria-hidden="true"`
- `<span className="sr-only">Loading</span>` provides screen reader text
- `<span aria-hidden="true">Loading…</span>` provides visible text (hidden from AT to avoid duplication)
- `focus-visible` ring inherited from existing globals.css rules (`.primary-btn:focus-visible`, `.secondary-btn:focus-visible`)

---

## 7. Out of Scope

- Destructive/danger variant (separate task when account dashboard is built)
- Icon-only button variant
- Size variants (sm/md/lg) — current pill size is sufficient for all current use cases
- Link-styled button (use `next/link` with button CSS class directly for navigation)
- `asChild` / render prop pattern
