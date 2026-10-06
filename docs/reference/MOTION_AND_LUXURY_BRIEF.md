# Task: Motion and luxury finishing pass for all /v2 components

## How to use this file
Save as `/reference/MOTION_AND_LUXURY_BRIEF.md`. Then tell Claude Code:
> "Read /reference/MOTION_AND_LUXURY_BRIEF.md. Do Step 1 (audit and plan) only, then wait for my approval."

This pass runs AFTER the current review fixes are done and approved. It builds on
`POLISH_BRIEF.md`. If the two conflict, this file wins for anything about motion and finishing.

---

## 1. Principles

Luxury comes from restraint, precision and consistency, not from effects.
- Motion confirms and guides. It never entertains or delays the user.
- Animate ONLY `transform` and `opacity` (plus color/border/shadow on hover). Never animate
  width, height, top, left, margin or anything that triggers layout.
- The LCP element and everything above the fold render immediately: **no entrance animation
  above the fold.**
- Zero layout shift (CLS < 0.05). Reserve space for everything that appears.
- Full `prefers-reduced-motion` support: reduced = no movement; opacity/color changes only.
- Content must always be in the server-rendered HTML. Motion is a progressive enhancement.
  If JS fails, everything is visible and usable.
- CSS-first. Do NOT add Framer Motion, GSAP, Lottie or any animation library. If something
  truly needs a library, ask me first. Total animation JS must stay under ~3 KB gzipped.
- No infinite loops, no parallax, no video backgrounds, no cursor-follow effects (except the
  optional desktop-only spotlight card below), no auto-playing carousels, no scroll-jacking.

## 2. Motion tokens (add to `tokens.css`)

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* default: entrances, hovers */
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* drawers, accordions */
  --dur-fast: 150ms;    /* color, border, press */
  --dur-base: 250ms;    /* hover lifts, menus */
  --dur-slow: 450ms;    /* drawers, panels */
  --dur-reveal: 700ms;  /* scroll reveals */
  --reveal-distance: 14px;
  --stagger: 70ms;
}

@media (prefers-reduced-motion: reduce) {
  :root { --dur-fast: 1ms; --dur-base: 1ms; --dur-slow: 1ms; --dur-reveal: 1ms; --reveal-distance: 0px; --stagger: 0ms; }
  html { scroll-behavior: auto !important; }
  *, *::before, *::after { animation-duration: 1ms !important; animation-iteration-count: 1 !important; transition-duration: 1ms !important; }
}
```

## 3. Scroll reveal (once only, no-JS safe)

Server components just add `data-reveal` and an optional stagger index. A single tiny client
component, mounted ONCE in the root layout, does the work.

```tsx
// components/motion/RevealObserver.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
    );
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      // Already on screen at mount (above the fold): never animate it.
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add("reveal-armed");
      io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
```

```css
/* globals.css */
.reveal-armed {
  opacity: 0;
  transform: translate3d(0, var(--reveal-distance), 0);
  transition: opacity var(--dur-reveal) var(--ease-out), transform var(--dur-reveal) var(--ease-out);
  transition-delay: calc(var(--i, 0) * var(--stagger));
}
.reveal-armed.is-in { opacity: 1; transform: none; }
```

Usage: `<div data-reveal style={{ "--i": index } as React.CSSProperties}>`.
Rules: stagger max 6 items (cap `--i` at 5). Reveal whole cards or headings, never individual
words or lines. Never put `data-reveal` on the hero, header, or any LCP candidate.

## 4. Interaction details

**Buttons**
- Hover: slight brightness/lift (`translateY(-1px)`) plus shadow deepening, 150ms.
- Active: `scale(0.98)`. Focus-visible: 2px ring with 2px offset, brand teal.
- Primary only: one soft light sheen sweeping once on hover (pseudo-element, transform only).
  Never looping.
- Loading: spinner replaces the icon, width stays fixed, `aria-busy="true"`.

**Links**
- Text links: underline grows from the left via `background-size` or `scaleX`, 250ms.
- Arrow icons in "Learn more →" shift 3px right on hover.

**Cards** (only interactive ones)
```css
.card-interactive {
  transition: transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base);
}
@media (hover: hover) {
  .card-interactive:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--border-strong); }
}
```
No hover transforms on touch devices. Keyboard focus-within gets the same border/shadow change.

**Optional desktop spotlight** (pricing and feature cards only; ask before building):
a soft radial highlight following the cursor, driven by two CSS variables updated with
`pointermove` (throttled with rAF), only when `(hover: hover) and (pointer: fine)` and
reduced motion is off.

**Accordion (FAQ)**: keep native `<details>`. Progressive smooth open/close:
```css
details { interpolate-size: allow-keywords; }
details::details-content {
  block-size: 0; overflow: hidden;
  transition: block-size var(--dur-base) var(--ease-in-out), content-visibility var(--dur-base) allow-discrete;
}
details[open]::details-content { block-size: auto; }
details summary .chevron { transition: transform var(--dur-base) var(--ease-out); }
details[open] summary .chevron { transform: rotate(180deg); }
```
Browsers without support simply open instantly. Never remove the answer from the HTML.

**Theme switch**: fade colors over 200ms (`transition: background-color, color, border-color`),
but disable transitions on first paint to avoid a flash.

**Sticky header**: after ~24px scroll, add a hairline border and a slightly stronger blur
background. Height must not change (no layout shift). Use an IntersectionObserver sentinel,
not a scroll listener.

**Mobile drawer / mega menu**: transform + opacity only, `--dur-slow` / `--dur-base`,
`--ease-in-out`. Trap focus, close on Esc, restore focus on close, lock body scroll.

## 5. Hero mockups (the "wow", done quietly)

Play ONCE on load, CSS only, ~1.5s total. Content is visible from the first paint; the animation
only decorates it.
- **ProductHero dashboard:** chart line draws in; progress bars (speed/backups/security) fill;
  status pill fades in.
- **SplitHero staging checklist:** four items tick in sequence (120ms apart); the "Go live"
  button gets a single soft pulse at the end.

```css
.draw-line { stroke-dasharray: 1; stroke-dashoffset: 1; animation: draw 1400ms var(--ease-out) 300ms forwards; }
@keyframes draw { to { stroke-dashoffset: 0; } }  /* use pathLength="1" on the <path> */
.bar-fill { transform-origin: left; transform: scaleX(0); animation: grow 900ms var(--ease-out) 400ms forwards; }
@keyframes grow { to { transform: scaleX(1); } }
@media (prefers-reduced-motion: reduce) { .draw-line { stroke-dashoffset: 0; } .bar-fill { transform: scaleX(1); } }
```

## 6. Per-component motion spec

| Component | Motion |
|---|---|
| AnnouncementBar | None. Dismiss collapses with opacity only. |
| Header / MegaMenu | Menu panel fades and rises 6px, 250ms. Link underline on hover. |
| MobileDrawer | Slide from side + overlay fade, 450ms. Focus trapped. |
| ProductHero / SplitHero / CenteredHero | Mockup animation (section 5). Text static, no entrance animation. |
| FeatureGrid / BentoGrid / GridCard | Reveal cards with stagger (max 6). Hover lift on interactive cards. |
| TwoColumn | Reveal text and visual as two blocks. |
| ComparisonTable | Row highlight on hover. Sticky header and first column. No entrance animation. |
| PricingPlans | Reveal cards. Highlighted plan has a very slow, subtle border glow on load (once). Billing toggle: price crossfades (opacity only, 200ms). No layout shift when price length changes (`tabular-nums`, fixed min-width). |
| Testimonials / LogoWall | Reveal. Carousel (if used) is user-controlled only. No marquee. |
| StatsBar | Count-up ONLY for verified numbers. Final value is in the server HTML. Animate on first view, 1.2s, then stop. Reduced motion: show the final value. |
| TrustSignals / TrustBadges | Reveal only. |
| FAQSection | Native `<details>` animation (section 4). |
| CTABand | Reveal. Ambient glow is static (no animation). |
| ProcessTimeline | Connecting line draws as the section enters (scaleY, once). Steps reveal in order. |
| CodeBlock | Copy button shows a check icon for 1.5s. No typing animation. |
| NewsletterSignup / ContactForm | Inline validation fades in. Success message replaces the form without layout jump. |
| SupportChannels | Reveal. Subtle hover lift. |
| Footer | None. |
| Skeletons | Shimmer allowed, but only while loading and max 2s. Reduced motion: static. |

## 7. Luxury finishing details (non-motion)

**Typography**
- `font-variant-numeric: tabular-nums` for prices, stats and tables.
- `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs. No orphans or widows
  in headlines.
- Typographic punctuation: real apostrophes and quotes, en dashes in ranges, non-breaking
  spaces between numbers and units (e.g. `200 GB`).
- Consistent headline tracking: tighter at display sizes, normal at body sizes.

**Surfaces**
- Every card: 1px hairline border, a 1px inner top highlight (`inset 0 1px 0 rgba(255,255,255,.06)`
  in dark), and a layered soft shadow. Dark-theme card, background and raised surfaces must be
  clearly distinguishable.
- Subtle film-grain/noise overlay (inline SVG data URI, 3 to 4% opacity, `pointer-events:none`)
  on large dark hero and CTA backgrounds only, to avoid banding and flat color.
- Ambient glows: static, very low opacity, brand orange/teal only.

**Details people notice without knowing why**
- `::selection` uses brand teal at low opacity.
- Slim, low-contrast custom scrollbar (`scrollbar-width: thin; scrollbar-color`).
- `color-scheme`, `accent-color` and form controls match the theme.
- Consistent icon set (lucide, stroke 1.5, one size scale).
- Images: consistent radius, 1px hairline border, fixed aspect ratios, blur-free placeholders.
- Section rhythm: consistent 96-144px vertical spacing on desktop, aligned to the 8px grid.
- Focus states are visible and designed, not browser defaults.
- Prices, dates and numbers always formatted with `Intl` (locale-aware).
- Microcopy: calm, specific, no exclamation marks, no hype.
- Empty, loading, error and success states exist for every dynamic component.

**Imagery**
- No stock photos of smiling people. Use product UI mockups, SVG illustrations in brand colors
  and real team/data-center photography when available.

## 8. Performance and accessibility budgets

- LCP < 2.0s, CLS < 0.05, INP < 200ms on mobile Lighthouse.
- No animation runs on the main thread longer than 50ms. No `will-change` left permanently on elements.
- Animation JS (RevealObserver + count-up + any small helpers) under ~3 KB gzipped total.
- Every animated element is usable with keyboard and screen reader; no focus loss during animation.
- Every animation has a reduced-motion path (verify with `page.emulateMedia({ reducedMotion: "reduce" })`).
- Add Playwright checks: (a) no horizontal scroll at 390, 820, 1440; (b) page is fully readable with
  JavaScript disabled; (c) reduced-motion run has no transforms in flight; (d) CLS measured per page.

## 9. Steps for Claude Code

1. **Audit and plan (no code).** For every /v2 component, list what motion exists today, what the
   table in section 6 says it should have, and any conflicts with the rules. Flag existing infinite
   loops or heavy effects that must go. Report current animation JS weight. Wait for approval.
2. **Foundation.** Add motion tokens, `RevealObserver` in the root layout, shared utility classes,
   reduced-motion rules. Show the result in `/v2/design-system` (a "Motion" section with live demos
   and a reduced-motion toggle).
3. **Apply in batches** matching the earlier batches (A to F). After each batch, take Playwright
   screenshots and a short screen recording (or frame sequence) of the key interactions, review them
   yourself, and fix anything that feels slow, bouncy, busy or cheap.
4. **Luxury details pass** (section 7) across all components.
5. **QA** (section 8). Report Lighthouse, CLS, axe, JS-disabled and reduced-motion results.

## 10. Definition of done

The site feels calm, fast and expensive. Nothing moves unless it helps. Every interaction has a
precise, quiet response. Turning off JavaScript or enabling reduced motion changes nothing about what
a visitor can read or do.
