# Button Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a reusable `Button` component with disabled and loading states, wire it into the `/v2` showcase, and add the supporting CSS to `globals.css`.

**Architecture:** Three self-contained tasks in dependency order — CSS first (no component yet), then the component (CSS already present), then the `/v2` update (component already importable). No new packages required; `cn()` utility and existing `.primary-btn` / `.secondary-btn` classes are reused.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS, `cn()` from `utils/cn.tsx`

---

## File Map

| File | Action |
|---|---|
| `app/globals.css` | Modify — append disabled state + spinner animation CSS after line 324 (after `.secondary-btn:focus-visible` block) |
| `components/ui/Button.tsx` | Create — reusable server-compatible button component |
| `app/(dev)/v2/page.tsx` | Modify — replace raw `<button>` elements in Buttons section with `<Button>` component, update status to `"built"` |

---

### Task 1: Add CSS for disabled state and loading spinner

**Files:**
- Modify: `app/globals.css` (after line 324, after the `.secondary-btn:focus-visible` block)

This task has no component to test against yet, so verification is visual: load `/v2` before and after to confirm no regressions.

- [ ] **Step 1: Locate the insertion point**

Open `app/globals.css`. Find the block ending at line 324:

```css
.primary-btn:focus-visible,
.secondary-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
```

The new CSS goes immediately after this closing brace.

- [ ] **Step 2: Append the disabled + spinner CSS**

Add these lines directly after line 324:

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

- [ ] **Step 3: Verify dev server compiles without errors**

Run: `npm run dev` (or check existing terminal — it hot-reloads CSS)

Expected: No CSS parse errors in the terminal. Browser console is clean.

- [ ] **Step 4: Commit**

```bash
git add app/globals.css
git commit -m "feat: add button disabled and spinner CSS to globals"
```

---

### Task 2: Create `components/ui/Button.tsx`

**Files:**
- Create: `components/ui/Button.tsx`

- [ ] **Step 1: Create the file with this exact content**

```tsx
import { cn } from "@/utils/cn";

type ButtonProps = {
  variant?: "primary" | "secondary";
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
};

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

**Why no `"use client"`:** The component is pure JSX with no hooks. Consumers that need click handlers in client contexts add `"use client"` to their own file. This keeps the component usable in Server Components.

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors. If you see `Cannot find module '@/utils/cn'`, check that `tsconfig.json` has `"paths": { "@/*": ["./*"] }` — it should already be present.

- [ ] **Step 3: Verify the component renders in the browser**

Navigate to `http://localhost:3002/v2` (or whatever port the dev server uses). The Buttons section still shows raw `<button>` elements for now — that's fine. Check the browser console: no TypeScript/runtime errors.

- [ ] **Step 4: Commit**

```bash
git add components/ui/Button.tsx
git commit -m "feat: add Button component with disabled and loading states"
```

---

### Task 3: Update `/v2` Buttons section

**Files:**
- Modify: `app/(dev)/v2/page.tsx`

The v2 page is the component showcase. This task replaces the raw `<button>` elements with `<Button>` instances showing all three states (default, disabled, loading), and marks the section as `"built"`.

- [ ] **Step 1: Add the Button import**

In `app/(dev)/v2/page.tsx`, find the existing imports at the top of the file and add:

```tsx
import Button from "@/components/ui/Button";
```

Place it with the other component imports (after `ShowcaseSection` import or alongside other `@/components/` imports).

- [ ] **Step 2: Replace the Buttons ShowcaseSection**

Find this block (around line 222–238):

```tsx
{/* ── Buttons ── */}
<ShowcaseSection
  id="buttons"
  title="Buttons"
  status="needs-work"
  notes="No disabled state. No loading/spinner state. No reusable Button component yet."
>
  <div className="flex flex-wrap items-center gap-4">
    <button className="primary-btn">Primary button</button>
    <button className="secondary-btn">Secondary button</button>
    <button className="primary-btn opacity-45 cursor-not-allowed" disabled>
      Primary (disabled)
    </button>
    <button className="secondary-btn opacity-45 cursor-not-allowed" disabled>
      Secondary (disabled)
    </button>
  </div>
</ShowcaseSection>
```

Replace it entirely with:

```tsx
{/* ── Buttons ── */}
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

- [ ] **Step 3: Verify in browser**

Navigate to `http://localhost:3002/v2` and scroll to the Buttons section. Confirm:

- Status badge shows green "built"
- Default row: two styled buttons with hover styles
- Disabled row: two buttons at 0.45 opacity, `cursor-not-allowed`, not clickable
- Loading row: two buttons each showing a spinning SVG icon + "Loading…" text
- No console errors

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add "app/(dev)/v2/page.tsx"
git commit -m "feat: update /v2 Buttons section to use Button component, status built"
```
