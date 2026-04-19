# Component Showcase & UI Fix Plan — Design Spec

**Date:** 2026-04-19  
**Status:** Approved  
**Deliverables:** `/v2` component showcase page + `docs/ui-fix-plan.md`

---

## 1. Problem Statement

The DronaHost codebase has a growing library of UI components with no central reference. It is unclear:
- Which components exist and what variants they support
- Which components are production-ready vs. need work
- Which components are missing entirely

Before fixing content or brand alignment, we need a clear picture of the component inventory.

---

## 2. Deliverable 1 — `/v2` Component Showcase Page

### Route & File Structure

```
app/
  (dev)/
    layout.tsx          ← bare layout, no site header/footer
    v2/
      page.tsx          ← main showcase entry point
      _components/      ← showcase-only UI (sidebar, status badge, section wrapper)
        ShowcaseSidebar.tsx
        ShowcaseSection.tsx
        StatusBadge.tsx
```

### Dev Guard

Top of `app/(dev)/v2/page.tsx`:

```ts
import { notFound } from 'next/navigation'
if (process.env.NODE_ENV !== 'development') notFound()
```

This ensures the page returns 404 in staging and production builds.

### robots.txt

`/v2` must be disallowed in `app/robots.ts`:

```ts
disallow: ['/api/', '/admin/', '/account/', '/checkout/', '/v2/'],
```

### Layout

Two-column layout:
- **Left:** Sticky sidebar (200px wide), lists all component categories as anchor links. Active item highlighted as user scrolls (Intersection Observer).
- **Right:** Scrollable content area. Each component gets a named `<section id="...">` block.

Top bar: fixed, shows `DronaHost Component Library` title + `NODE_ENV: development` badge.

### Sidebar Categories (in order)

1. Layout — `Section`, `GradientBackground`
2. Typography — `HeadLineText`
3. Cards — `GridCard`
4. Buttons & Forms — Primary button, Secondary button, Contact form
5. Navigation — `Header`, `Footer`, Mega Menu
6. Home Sections — Hero, Features, Services, CTA, Case Study, Pricing (×4), Testimonials, FAQ, Teams
7. SEO — `JsonLd`, Breadcrumbs

### Per-Component Block Structure

Each component section renders:
1. **Component name** as `<h2>`
2. **All variants** side-by-side with dummy content
3. **Status badge**: `✅ Built` / `⚠️ Needs work` / `❌ Missing`
4. **Notes line**: one sentence describing the issue (if any)

Dummy content: hardcoded strings — no API calls, no DB queries. Page must be fully static.

### Styling

- Uses existing Tailwind setup
- Sidebar and top bar are showcase-only UI, not reused anywhere else
- Dark mode toggle inherited from `next-themes` (already in project)
- No animations on the showcase page itself — components render in static state so issues are visible

---

## 3. Deliverable 2 — `docs/ui-fix-plan.md`

### Purpose

A living markdown document that tracks the status of every component. Updated as fixes are made. Not auto-generated — manually maintained.

### Structure

```markdown
# DronaHost UI Fix Plan

## Status Legend
- ✅ Built & good
- ⚠️ Built but needs work
- ❌ Missing entirely

## Priority Legend
- 🔴 Critical (blocks launch)
- 🟠 High (needed before content phase)
- 🟡 Medium (polish)
- 🟢 Low (nice to have)

---

## 1. Layout
## 2. Typography
## 3. Cards
## 4. Buttons & Forms
## 5. Navigation
## 6. Home Sections
## 7. Trust & Conversion
## 8. SEO Components
## 9. Build-Next Priority Order
```

Each section uses a table: `Component | Status | Issue | Priority`.

The final section (`Build-Next Priority Order`) is a numbered list derived from all `🔴 Critical` and `🟠 High` items.

---

## 4. What Is Explicitly Out of Scope

- No Storybook integration
- No automated component discovery (components listed manually)
- No interactive controls (knobs/props editor)
- No visual regression testing setup
- No authentication on the `/v2` route (NODE_ENV guard is sufficient)
- The showcase page does not import or wrap real page layouts

---

## 5. Success Criteria

- `/v2` page renders in `npm run dev` and returns 404 in `npm run build && npm start`
- `/v2` is blocked in `robots.txt`
- Every component in `/components` appears in the showcase with at least one rendered variant
- Every component has a status badge and notes line
- `docs/ui-fix-plan.md` exists and covers all components with priority assignments
- No layout shift or console errors on the showcase page

---

## 6. Implementation Notes

- The `(dev)` route group layout must NOT include the site `<Header>` or `<Footer>` — those are rendered inside the showcase as components, not as page chrome
- `ShowcaseSection` wrapper component handles: section `id`, heading, status badge, notes — keeps `page.tsx` clean
- `StatusBadge` is a tiny presentational component, not shared with the main app
- Intersection Observer for sidebar active state: native browser API, no extra dependency
