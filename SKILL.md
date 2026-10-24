---
name: menyor-frontend
description: The Menyor Nigeria frontend system (built from the user's Figma) - tokens, typography, components, motion, copy rules and the build-and-verify process. Use for ANY frontend, UI, page, component, email or design work for this user (Menyor Nigeria or any new product of theirs), so everything matches the Menyor look and quality bar. Also use when reviewing or fixing their UI.
---

# Menyor frontend

Everything built for this user must look and behave like the Menyor Nigeria app
(`~/Projects/menyor-nigeria`), which was built pixel-exact from their Figma and then
extended to every screen. This skill is that system. Follow it exactly unless the
user says otherwise in the current request.

**Precedence:** the user's words in this request → a Figma/design they attach → this skill → your own taste.
When a new Figma arrives, it wins for that work: measure it (see `references/verification.md`)
and note any deviations from this skill in your report.

## Read before you start

| Need | File |
|---|---|
| Exact tokens, type scale, spacing, breakpoints, copy and accessibility rules | `references/design-system.md` |
| Markup and class names for every component (buttons, pills, cards, drawers, timeline…) | `references/components.md` |
| Motion presets and how each effect is built | `references/motion.md` |
| How to match a Figma, screenshot, audit and report | `references/verification.md` |
| Pitfalls already hit (Next 16, Turbopack, stacking contexts, portals) | `references/gotchas.md` |
| The real stylesheet, logo, motion file and core components to copy | `assets/` |
| Screenshot, side-by-side, measurement and audit scripts | `scripts/` |

For a new project, start from `assets/globals.css`, `assets/motion.ts` and the components in
`assets/components/` rather than re-deriving them.

## The system at a glance

**Fonts (only these two):**
- **Cormorant Garamond** for every heading, weight **700** with `letter-spacing: -0.02em`. That is what the Figma uses, although the original brief said 500/600.
- **DM Sans** 400/500/600 for everything else, including inputs, buttons and selects, with `font-variation-settings: "opsz" 33` so it matches the Figma's tighter cut.
- Load both with `next/font/google`, `display: 'swap'`, preloaded.
- The logo is an SVG, never a font.

**Colours (only these):**

| Token | Hex | Use |
|---|---|---|
| `--brand-blue` | `#006BA6` | buttons, links, headings, blue band, footer |
| `--brand-blue-hover` | `#005A8C` | hover |
| `--brand-blue-tint` | `#E6F0F6` | badges, selected rows |
| `--bg` | `#EBEAEA` | page, rows inside cards |
| `--surface` | `#FFFFFF` | cards, inputs, drawers |
| `--ink` | `#111111` | text |
| `--ink-muted` | `#5F6368` | captions, helper text |
| `--success` | `#1E8E3E` | **icons and "Confirmed" dots only**, never body text (it is 4.2:1 on white) |
| `--error` | `#C62828` | errors |
| `--on-blue` | `#FFFFFF` | text on blue; dividers at 60% |

Hex values live only in `:root` and in the `BRAND.colors` config (emails and PDFs read it).
Dividers and scrims are derived with `color-mix(in srgb, var(--ink) 12%, transparent)`.

**Shape:**
- Every button, tab, input, select, search box and trip control is a **pill**.
- Large cards have a 48px radius, cards 24px, images 24px and rows 16px.
- Outline controls and inputs have a **1px blue border**.
- **Cards have no borders and nothing has a shadow.**
- Hierarchy comes from grey vs white surfaces.

**Type scale (desktop → phone):**

| Element | Size |
|---|---|
| Hero | 110px / 112px line height → 48px |
| Section and page headline (`.display`) | 64px / 1.22 → 40px |
| Card titles | 30px |
| Listing rows | 24px |
| Body | 16px |
| Helper text | 14px |
| Badges | 13px |
| Prices | 22px, weight 600, tabular figures |
| Eyebrows | DM Sans 16px, UPPERCASE, blue |

**Layout:**
- Container max 1480px, gutters 40px (24px on phones).
- Header 96px (72px on phones), sticky on the grey page with a 1px divider once scrolled.
- Sections about 160px apart on desktop and 80px on phones.
- Breakpoints: 1360 (compact trip pill), 1180 (navigation becomes the menu), 960 (one column), 640 (phone).

**Copy:**
- Display headlines in Title Case ("Everything For Your Trip, In One Place").
- UI text in sentence case ("Add to my trip").
- All copy lives in `src/content/*.ts`. Never hard-code strings in components.
- Brand values (email, phone, WhatsApp, legal name, social) come from `BRAND`.
- Prices always go through the currency helper (NGN default, remembered).
- Never invent reviews, ratings, stats or contact details.
- Placeholders stay visibly `[BRACKETED]`.

## Non-negotiables

1. **Only the two fonts and the colours above.** Run `scripts/audits.mjs` (`paletteAudit`) on every new screen.
2. **No shadows, no card borders, no gradients.** The one exception is a subtle photo gradient, and only if text needs it.
3. **Every control is a pill with a 1px blue outline or a solid blue fill.** Focus shows a 2px white + 2px blue ring.
4. **One shared motion presets file.** Animate only `transform` and `opacity`; FAQ and booking-card height are the deliberate exceptions. `prefers-reduced-motion` disables everything and shows content at once.
5. **Accessible by default:**
   - WCAG AA contrast.
   - Labelled controls.
   - Drawers and modals trap focus, close on Escape, return focus to the button that opened them, and render in a portal on `document.body`.
   - Toggles use `aria-pressed`, and pill choices use `role="radio"` with `aria-checked`.
   - Visual-only placeholders are `aria-hidden`.
6. **Copy in content files and brand values from `BRAND`.** Images need real alt text, and their paths live in content files.
7. **Responsive at 390, 768 and 1440px** with no sideways scrolling:
   - Phones get snap carousels with a peek of the next card.
   - Filters and booking forms move into bottom sheets.
   - The main action goes in a sticky bottom bar.
   - Drawers become bottom sheets.
8. **Verify before reporting**:
   - Screenshot at 1440 and 390.
   - Compare against the design side by side.
   - Run the palette and contrast audits and axe.
   - Run Lighthouse mobile on a production build: Performance at least 85, Accessibility at least 95, CLS 0.
   - Report the differences honestly.

## Building a new screen: the order

1. Put the copy in a content file first.
2. Compose it from existing components in `references/components.md`.
   - Typical structure: a centred `page-head` (eyebrow + `.display` lines + intro), then white `large-card`/`step-card`/`checkout-card` blocks on the grey page.
   - Lists go in grey `update-row`/`listing-row` rows inside white cards.
3. Only if nothing fits, add a new class to the right section of `globals.css`, built from tokens. No Tailwind and no inline colours.
4. Wire the motion presets (`Reveal`, `SectionHeading` line rise, hover lift).
5. Verify (`references/verification.md`), then report with screenshots.
