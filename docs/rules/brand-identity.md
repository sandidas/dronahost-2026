# DronaHost — Brand Identity

> Logo specs, file formats, and usage rules. Source files in `/public/logo/`.
> Color palette, typography, and UI rules live in `docs/rules/ui-ux-rules.md`.

---

## Brand Name

| Context | Usage |
|---|---|
| Logo / wordmark | `dronahost` (all lowercase) |
| Written copy, headings, page titles | `DronaHost` |
| Domain / URL | `dronahost.com` |
| Never | `Drona Host`, `DRONAHOST`, `Dronahost` |

The lowercase wordmark is a deliberate stylistic choice — approachable and modern. In prose, always use `DronaHost` (capital D, capital H).

---

## Logo Wordmark

The logo is a **two-color wordmark only** — there is no standalone icon or symbol.

- `drona` — rendered in **Brand Orange** (`#FE5403`; TODO(decision #2): the official hex is undecided, `#FE5403` here vs `#FE5504` in the Brand Assets page and `tokens.css`. Define it once in `app/styles/tokens.css`.)
- `host` — rendered in **Brand Teal** (`#05A2C6`)
- A small orange directional accent appears at the base of the `t` in `host`

---

## Source Files

| File | Use |
|---|---|
| `dronaHost-logo.svg` | Web, UI, all digital use — always preferred |
| `dronaHost-logo.png` | Email, social media, fallback digital |
| `dronaHost-logo.jpg` | Acceptable for email on a white background; avoid elsewhere (no transparency) |
| `dronahost-logo.ai` | Editing / design work (Adobe Illustrator) |
| `dronahost-logo.eps` | Print vendor submission |
| `dronahost-logo.pdf` | Print vendor submission, high-res proof |

Always use the SVG on the website. Never rasterize the SVG for web use. PNG and JPG are both fine for email; keep SVG for the web.

---

## Clear Space

Maintain a minimum clear space of **1× the cap-height of the "d"** on all four sides of the wordmark. No logos, text, or graphic elements should enter this zone.

---

## Minimum Size

| Medium | Minimum width |
|---|---|
| Digital (screen) | 120px |
| Print | 30mm |

Below these sizes the rounded letterforms compress and legibility degrades.

---

## Approved Backgrounds

| Background | Usage |
|---|---|
| White `#FFFFFF` | Primary — always acceptable |
| Light grey `#F5F5F5`–`#EEEEEE` | Acceptable |
| Dark backgrounds | TODO(decision #4): undecided. This row says reverse the wordmark to all-white; the Brand Assets page says do not reverse or recolour, and the current design shows the orange and teal logo on dark navy. Do not change the logo on dark until the owner picks one. |
| Brand Orange or Brand Teal solid fill | Do not place the logo on its own brand colors |
| Busy photography | Do not use — the wordmark is a logotype, not a stamp |

---

## Logo Don'ts

- Do not recolor either half of the wordmark
- Do not separate "drona" and "host" into different lines
- Do not add drop shadows, outlines, or glows
- Do not stretch, skew, or rotate the wordmark
- Do not recreate the wordmark in a different typeface
- Do not use the JPG on colored or transparent backgrounds

---

## Pre-publish Checklist

- [ ] Using SVG for web (not JPG/PNG unless email or social)
- [ ] Clear space respected on all sides
- [ ] Logo above minimum width (120px digital, 30mm print)
- [ ] Not placed on Brand Orange or Brand Teal backgrounds
- [ ] Not stretched, rotated, or recolored
- [ ] Wordmark text in copy uses "DronaHost" (not "dronahost" or "Drona Host")

---

## Accessibility note

The orange and teal wordmark on white is a logo, and logos are exempt from text-contrast requirements. That exemption
covers the wordmark only: never use the brand orange or teal as body text colour. Text colours come from
`app/styles/tokens.css`, which is checked by `scripts/check-contrast.ts`.
