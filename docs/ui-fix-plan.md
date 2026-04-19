# DronaHost UI Fix Plan

> Last updated: 2026-04-19 (Tier 1 quality fixes shipped)
> Update this file as components are fixed. Use /v2 to visually verify status changes.

## Status Legend
- ✅ Built & good
- ⚠️ Built but needs work
- ❌ Missing entirely

## Priority Legend
- 🔴 Critical — blocks launch or destroys trust
- 🟠 High — needed before content phase begins
- 🟡 Medium — polish, improve later
- 🟢 Low — nice to have

---

## 1. Layout

| Component | Status | Issue | Priority |
|---|---|---|---|
| Section | ✅ | Comprehensive variant system, well-structured | — |
| GradientBackground | ⚠️ | 10+ variants with no internal documentation; hard to pick the right one | 🟡 |

---

## 2. Typography

| Component | Status | Issue | Priority |
|---|---|---|---|
| HeadLineText | ⚠️ | Font size jumps abruptly on tablet (768px–1024px) — no `clamp()` interpolation | 🟡 |

---

## 3. Cards

| Component | Status | Issue | Priority |
|---|---|---|---|
| GridCard | ⚠️ | Border logic correct on desktop; missing hover/focus styles on mobile touch devices | 🟢 |
| ResourceCard | ✅ | Works correctly in blog/KB context | — |
| ResourceBox | ✅ | Works correctly in blog/KB context | — |

---

## 4. Buttons & Forms

| Component | Status | Issue | Priority |
|---|---|---|---|
| Primary Button | ⚠️ | `focus-visible` outline added ✓. Still missing disabled state and loading/spinner state. | 🟠 |
| Secondary Button | ⚠️ | `focus-visible` outline added ✓. Still missing disabled state and loading/spinner state. | 🟠 |
| Destructive Button | ❌ | Not built — needed for delete/cancel actions in account dashboard | 🟡 |
| Contact Form | ⚠️ | Embedded in /contact page only — not a reusable component. No loading or success state. | 🟠 |

---

## 5. Navigation

| Component | Status | Issue | Priority |
|---|---|---|---|
| Header | ⚠️ | Mobile hamburger menu not implemented — nav completely hidden on mobile | 🔴 |
| Mega Menu | ✅ | Keyboard accessible — Escape to close, ArrowDown to enter panel, aria-expanded/controls/haspopup | — |
| Footer | ⚠️ | Partner logos are placeholder images. Social links point nowhere. | 🟠 |

---

## 6. Home Sections

| Component | Status | Issue | Priority |
|---|---|---|---|
| Hero Section | ⚠️ | Technical: LazyLoad + a11y fixed ✓, buttons functional ✓. Remaining: floating card icons placeholder, member avatars placeholder, copy lorem ipsum in JSON. | 🔴 |
| Feature Section | ⚠️ | Feature images are placeholder SVGs. No real benchmark data. | 🟠 |
| Services Section | ⚠️ | Technical: icon src, alt text, dark mode fixed ✓. Remaining: descriptions are placeholder copy. | 🟠 |
| Case Study | ⚠️ | Technical: skeleton image, brand colours, aria-labels, dark mode fixed ✓. Remaining: no real case study, metrics hardcoded, image placeholder. | 🟠 |
| CTA Section | ✅ | Structure solid. Needs real copy + final CTA URLs. | — |
| Pricing Section 1 | ⚠️ | Image placeholder. Prices not from real pricing data source. | 🟠 |
| Pricing Section 2 | ⚠️ | Illustration placeholder. Feature copy generic. | 🟡 |
| Pricing Section 3 | ⚠️ | Same issues as Pricing 1. Consider consolidating 1+3 into one configurable component. | 🟡 |
| Pricing Section 4 | ⚠️ | No pricing figures. Missing CTA button. | 🟠 |
| Pricing Journey | ⚠️ | Slider not keyboard accessible. No ARIA labels. | 🟠 |
| Testimonials | ⚠️ | All placeholder data. No LinkedIn links. No real headshots. **Western buyers will notice.** | 🔴 |
| FAQ Section | ⚠️ | Accordion works. Content all placeholder. FAQPage JSON-LD schema not connected. | 🟠 |
| Teams Section | ⚠️ | No real photos. LinkedIn links missing. Bio copy placeholder. | 🟠 |

---

## 7. Trust & Conversion

| Component | Status | Issue | Priority |
|---|---|---|---|
| Trust Badges | ✅ | Stripe, PayPal, Let's Encrypt, Cloudflare, Trustpilot, 30-Day Guarantee | — |
| Uptime / Stats Bar | ✅ | 99.95% uptime SLA, < 200ms TTFB, 18 min support reply, Founded 2019 | — |
| Logo Wall | ⚠️ | Exists in footer. All logos are placeholder. No real partner brands. | 🔴 |
| Review Score Widget | ❌ | Not built. Trustpilot / G2 / HostAdvice score display needed on homepage | 🟠 |

---

## 8. SEO Components

| Component | Status | Issue | Priority |
|---|---|---|---|
| JsonLd | ✅ | Works correctly. Verify output with Google Rich Results Test after content is real. | — |
| Breadcrumbs | ⚠️ | Component exists in /components/seo but not wired on all inner pages | 🟠 |

---

## 9. Build-Next Priority Order

Work through this list in order before moving to the content phase:

1. 🔴 **Mobile hamburger menu** — site is completely broken on mobile without this
2. 🔴 **Real testimonials** — replace all placeholder data with verified customer quotes
3. 🔴 **Trust Badges component** — Stripe, PayPal, Let's Encrypt, Cloudflare logos
4. 🔴 **Uptime / Stats Bar component** — live or static uptime %, TTFB, response time
5. 🔴 **Real logo wall** — get permission from 5–8 clients to use their logo
6. 🟠 **Button disabled + loading states** — needed before any form goes live
7. 🟠 **Contact Form as reusable component** — extract from /contact page
8. 🟠 **Mega menu keyboard navigation** — WCAG 2.1 AA requirement
9. 🟠 **Pricing sections → real data source** — connect to pricing JSON/CMS
10. 🟠 **FAQ JSON-LD schema** — wire FAQPage schema to FAQ section
11. 🟠 **Breadcrumbs on all inner pages** — SEO + UX
12. 🟠 **PricingSection 1+3 consolidation** — DRY, reduces maintenance burden
13. 🟡 **HeadLineText fluid sizing** — clamp() between breakpoints
14. 🟡 **GradientBackground variant docs** — internal dev quality
15. 🟢 **GridCard mobile hover states** — polish
