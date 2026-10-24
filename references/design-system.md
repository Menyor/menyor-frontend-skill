# Menyor design system, in full

Source: the user's Figma home page (1440px frame, 6,625px tall), measured from the export.
The canonical implementation is `assets/globals.css`; copy from it.

## Tokens (`:root`)

```css
:root {
  --brand-blue: #006BA6;  --brand-blue-hover: #005A8C;  --brand-blue-tint: #E6F0F6;
  --bg: #EBEAEA;  --surface: #FFFFFF;  --surface-muted: var(--bg);
  --ink: #111111;  --ink-muted: #5F6368;
  --success: #1E8E3E;     /* icons and "Confirmed" only */
  --error: #C62828;  --on-blue: #FFFFFF;
  --on-blue-divider: color-mix(in srgb, var(--on-blue) 60%, transparent);
  --divider: color-mix(in srgb, var(--ink) 12%, transparent);
  --scrim: color-mix(in srgb, var(--ink) 45%, transparent);

  --font-head: var(--font-cormorant), 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --font-body: var(--font-dm-sans), 'DM Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

  --r-pill: 999px;  --r-lg: 48px;  --r-card: 24px;  --r-img: 24px;  --r-row: 16px;
  --header-h: 96px;  --section-space: 160px;  --container: 1480px;  --gutter: 40px;
  --focus-ring: 0 0 0 2px var(--surface), 0 0 0 4px var(--brand-blue);

  --ease: cubic-bezier(0.22, 1, 0.36, 1);
  --reveal-ms: 600ms;  --reveal-distance: 24px;  --stagger-ms: 90ms;  --line-ms: 120ms;
  --hover-ms: 150ms;  --drawer-ms: 350ms;
}
```

Phones (`max-width: 640px`): `--section-space: 80px; --gutter: 24px; --header-h: 72px`.
Tablets (`max-width: 960px`): `--section-space: 112px`.

Mirror the palette in a `BRAND.colors` config, since emails, PDFs and the manifest can't read CSS variables:
`blue, blueHover, blueTint, bg, surface, ink, inkMuted, success, error, onBlue`.

## Fonts

```ts
// app/layout.tsx
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600', '700'], style: ['normal', 'italic'],
  variable: '--font-cormorant', display: 'swap', preload: true });
const dmSans = DM_Sans({ subsets: ['latin'], axes: ['opsz'], variable: '--font-dm-sans', display: 'swap', preload: true });
// <html className={`${cormorant.variable} ${dmSans.variable}`} data-scroll-behavior="smooth">
```

```css
body { font-family: var(--font-body); font-size: 1rem; line-height: 1.5; font-variation-settings: "opsz" 33; }
button, input, select, textarea { font-family: var(--font-body); font-size: inherit; color: inherit; font-variation-settings: inherit; }
h1, h2, h3, h4 { font-family: var(--font-head); font-weight: 700; line-height: 1.1; letter-spacing: -0.02em; text-wrap: balance; }
code, kbd, pre { font-family: var(--font-body); font-weight: 600; }   /* no monospace: only two fonts */
```

**Why opsz 33:** the Figma's DM Sans is the older, tighter cut. At the default optical size,
text runs about 7% wider and lines break differently.

**Why 700 and -2%:** the Figma's ink widths were solved per font weight. Bold with -0.02em matches
every heading, at 110px, 64px and 30px.

## Type scale

| Role | Class | Desktop | Phone (≤640) |
|---|---|---|---|
| Hero headline | `.hero-title` | 110px / 112px, white | 48px / 1.02 |
| Hero subline | `.hero-sub` | DM Sans 24px / 1.5, max 570px | 17px |
| Section and page headline | `.display` | 64px / 1.22, blue | 40px / 1.1 |
| Step and detail title | `.step-card-title`, `.detail-title` | clamp(2.5rem, 4vw, 4rem), blue | |
| Card titles | `.category-card-title`, `.trip-card-title`, `.listing-card-title`, `.step-title`, `.update-card-title`, `.card-heading`, `.side-card-title`, `.checkout-h2` | 30px / 1.1 | 28–30px |
| Drawer and dialog title | `.drawer-title`, `.dialog-title` | 36px, blue | 30px |
| Listing-row title | `.listing-row-title` | 24px | 20px |
| Eyebrow | `.eyebrow` | DM Sans 16px, UPPERCASE, 0.02em, blue | |
| Body | | 16px / 1.5 (1.75 in card descriptions) | |
| Helper and small text | `.field-help`, `.small` | 14px | |
| Badge | `.badge` | 13px, 500 weight | |
| Price | `.trip-card-price`, `.listing-card-price` | DM Sans 22px, 600, tabular | |
| Nav links | `.nav-link` | 16px, 500 weight | |

Headings in a `.section-heading` render each line as a block `span.display-line`
(desktop line breaks come from the content array, e.g. `['Everything For Your Trip,', 'In One Place']`).
On phones the lines run inline.

## Shape and surfaces

- **Pills (`999px`):** every button, tab, input, select, currency control, trip button, search box, filter, badge and toast.
- **Large card (48px):**
  - booking card, update card, step card, booking panel, timeline card, side cards, support card, empty state
  - the drawer edge on desktop (`48px 0 0 48px`)
- **Card (24px):** category, trip and listing cards, detail sections, checkout sections; the phone bottom sheet uses `24px 24px 0 0`.
- **Image (24px)** inside cards, with 12px card padding. Thumbnails in rows use 12px.
- **Row (16px):** grey rows inside white cards (`update-row`, `listing-row`, `help-option`, `trip-item`, breakdown, facts).
- **Borders:** 1px `--brand-blue` on outline buttons, inputs, chips and pills. No card borders; selection is shown as tint plus a blue border on rows.
- **No `box-shadow`** except the focus ring and 1px inset outlines. No gradients.
- **Surfaces:** a grey page, white cards and grey rows inside white cards. The blue band (`.blue-band`) carries the FAQ, the closing call to action and the footer.

## Spacing and layout

- `.container { max-width: 1480px; padding-inline: var(--gutter) }`. Inner content widths on the home page are 1216 (explore cards), 1100 (`.container-how`), 1125 (trips) and 1140 (footer).
- Home vertical rhythm, as measured in the Figma:
  - booking card 97px below the hero
  - Explore eyebrow 239px below the card
  - How it works 229px
  - Ready-made trips 304px
  - blue band 130px below the trip cards
  - footer padding 89px / 81px
- Other pages: `.page { padding-block: 72px var(--section-space) }`. Use `.page-head.is-centred` (max 780px) with 56px below it.
- Gaps: rows 10px; card grids 24px (trips 30px); form fields 8px apart side by side; pill groups 8px.
- Inputs 62px tall, buttons 60px, small buttons 44px, chips 48px.
- Booking card: 892px wide, padding 36px 67px. Two 375px inputs with an 8px gap.

## Breakpoints

| Width | What changes |
|---|---|
| ≤1360 | Trip pill becomes compact (bag + count) |
| ≤1180 | Main nav hidden → menu button; card grids 2-up; trips become a swipeable row (columns `min(340px, 42%)`); fixed desktop section gaps fall back to `--section-space` |
| ≤960 | Detail, plan, checkout and dashboard go to one column; booking panel → phone bar + sheet; plan summary → bottom bar |
| ≤640 | Phone: hero 560px tall and 48px headline; booking card full width (16px margins); snap carousels at 78% / 86%; sticky "Plan my trip" bar; drawers become bottom sheets; currency and Sign In move into the menu; blue floating SOS button |

## Copy rules

- Display headlines: Title Case, short, two lines ("Pick A Trip. We’ll Handle", "Every Detail").
- Eyebrow above every section headline: one or two words, UPPERCASE via CSS ("Explore", "How it works").
- UI text: sentence case and active voice ("Add to my trip", "Review and pay", "Keep exploring", "Skip this step").
- After an action, a toast confirms what happened: "Added to your trip · View trip".
- Errors say what to do: "Please enter your flight number, like BA075."
- Typographic apostrophes and quotes (’ “ ”). Full stops on sentences.
- British spelling (favourite, colour). Prices like ₦1,993,370 (no decimals in NGN).
- Never fabricate reviews, ratings, stats or contact details. Example content is labelled "Example".
- Every string lives in `src/content/*.ts` (home, catalogue, plan, panels, trip, site). Components import it.

## Accessibility rules

- AA contrast everywhere: blue on grey 4.8:1, blue on white 5.7:1, muted on grey 5.0:1. **Green is never text.**
- Focus: `:focus-visible { outline: 2px solid transparent; box-shadow: var(--focus-ring) }`. On the blue band and footer the ring inverts (blue inside, white outside).
- Drawers and modals: rendered with `createPortal(…, document.body)`.
  - They trap Tab, close on Escape and on scrim click, and return focus to the button that opened them.
  - `role="dialog"` with `aria-modal`, labelled by their title.
- Tabs: `role="tablist"`/`tab`/`tabpanel` with arrow keys. Toggles use `aria-pressed`; single-choice pill groups use `role="radiogroup"` and `role="radio"` with `aria-checked`.
- Every input has a label. Errors use `aria-invalid` and `aria-describedby` to point at a `.field-error`.
- Visual-only images and placeholders are `aria-hidden`. Photos have descriptive alt text from the content file.
- Icon-only buttons have an `aria-label`. Progress steps carry an `aria-label` when their visible label is hidden on phones.
- Live regions: toasts are `role="status"`; results and totals use `aria-live="polite"`.
