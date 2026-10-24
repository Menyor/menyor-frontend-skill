# Component recipes

The markup and class names match `assets/globals.css`. React/Next.js components are in
`assets/components/`, and the full app lives in `~/Projects/menyor-nigeria/src/components`.
Reuse these before inventing anything new.

## Buttons and links

```tsx
<button className="btn btn-primary">Find my flight</button>          {/* solid blue pill, 60px tall */}
<button className="btn btn-outline">Plan my whole trip</button>      {/* 1px blue outline */}
<button className="btn btn-white">Ask Menyor</button>                {/* on the blue band */}
<button className="btn btn-outline-white">Chat on WhatsApp</button>  {/* on the blue band */}
<button className="btn btn-danger">Alert Menyor now</button>
<button className="btn btn-primary btn-sm">Add</button>              {/* 44px */}
<button className="btn btn-primary btn-block">Review and pay</button>
<button className="btn btn-primary is-added"><Icon name="check" /> Added</button>  {/* 2.4s after adding */}
<button className="icon-btn" aria-label="Menu"><Icon name="menu" /></button>
<button className="close-btn" aria-label="Close"><Icon name="close" /></button>   {/* round, outlined */}
<button className="text-link">Change airport</button>               {/* underlined blue, 44px tap height */}
<a className="arrow-link">See cars<ArrowLong /></a>                   {/* long thin arrow, moves 4px on hover */}
```

Loading state: `<button className="btn btn-primary" aria-busy><span className="spinner" aria-hidden="true" />Finding your flight…</button>`.

## Pills: chips, tabs, choices, inputs

```tsx
{/* Toggle (filters, vibes, add-ons) */}
<button className="chip-btn" aria-pressed={on}>{on && <Icon name="check" />}Armoured only</button>

{/* Single choice */}
<div className="pill-choice" role="radiogroup" aria-label="Payment method">
  <button type="button" role="radio" aria-checked={m === 'card'} className="chip-btn"><Icon name="card" /> Card</button>
</div>

{/* Tabs with the sliding active pill (see BookingCard in the app) */}
<div className="pill-tabs" role="tablist">
  <span className="pill-tabs-indicator" style={{ transform: `translateX(${x}px)`, width: w }} aria-hidden />
  <button role="tab" className="pill-tab" aria-selected>Airport Pickup</button>
  <button role="tab" className="pill-tab">Plan my whole trip</button>
</div>

{/* Pill input */}
<div className="field-group">
  <label className="field-label" htmlFor="pickup-flight">Your flight number</label>
  <input id="pickup-flight" className="field" placeholder="e.g. BA075" aria-invalid={!!err} aria-describedby="pickup-flight-error" />
  <p className="field-help">It’s on your ticket or booking email.</p>
  <p className="field-error" id="pickup-flight-error">{err && <><Icon name="alert" /><span>{err}</span></>}</p>
</div>
{/* select.field gets the blue chevron automatically; textarea.field uses a 24px radius */}

{/* Search pill */}
<div className="search-pill" role="search"><Icon name="search" /><input id="cat-q" type="search" placeholder="Search cars…" /></div>

{/* Stepper: − value + inside a pill */}
<Stepper id="nights" label="How many nights?" value={n} min={1} max={60} onChange={setN} />
```

## Badges, notes, toasts

```tsx
<span className="badge">MNY-952208</span>                         {/* blue tint pill, 13px */}
<span className="badge status-chip--ok">Confirmed</span>          {/* green dot + ink text */}
<span className="badge status-chip--warn">Awaiting confirmation</span>
<span className="badge badge-selected"><Icon name="check" />Selected</span>   {/* solid blue */}
<p className="note"><Icon name="plane" />Pickup Sat 14 Nov at 8:30pm</p>     {/* tint row, 16px radius */}
<p className="status-note is-warn" role="alert"><Icon name="alert" />…</p>
```

Toast (white pill, blue outline, green check): `toast('Added to your trip', { label: 'View trip', panel: 'trip' })`
renders "✓ Added to your trip · View trip". Pass `tone: 'alert'` for failures (red icon and border).

## Page structures

```tsx
{/* Centred page head: catalogue, checkout, supporting pages */}
<header className="page-head is-centred">
  <p className="eyebrow">Menyor Rides</p>
  <h1 className="display">{['Your Car And Driver', 'In Lagos'].map(l => <span key={l} className="display-line">{l} </span>)}</h1>
  <p className="page-intro">Luxury SUVs and sedans with a trusted driver…</p>
</header>

{/* Section heading whose lines rise 120ms apart on reveal (HomeClient.tsx) */}
<SectionHeading id="explore-title" eyebrow="Explore" lines={['Everything For Your Trip,', 'In One Place']} className="is-centred" />

{/* Supporting page: grey page, white 720px large card */}
<SupportPage eyebrow="404" lines={['Looks Like You Took', 'A Wrong Turn']}>…</SupportPage>

{/* Blue band (FAQ + closing CTA): .blue-band; buttons inside use btn-white / btn-outline-white */}
```

Empty state: `.empty-state` (white large card, centred): a `.display` title such as "Nothing matches yet",
a muted line, then `.empty-actions` holding `btn-primary` "Clear filters" and `btn-outline` "Ask Menyor".

## Cards

| Card | Class | Anatomy |
|---|---|---|
| Category | `.category-card` | white, 24px, 12px padding · image 262/251 at 24px radius · 30px title · 16px/1.75 text (max 200px) · `.arrow-link` pinned to the bottom (cards equal height) |
| Trip | `.trip-card` | 30px top/bottom and 20px side padding · image 315/251 · title · muted duration · `.tick-list` (green ticks draw in) · foot: price 22/600 + "Total for 2 people" + `btn-primary` |
| Listing | `.listing-card` | 12px padding · `.card-media` 4:3 with an optional `.card-badge` · 30px title · pin + location · `.listing-card-facts` badges (or `CheckList` for packages) · foot: price + unit + "Add to my trip" |
| Listing row | `.listing-row` (in `.listing-rows`) | grey row with 120px thumbnail · title 24px · facts · price · action column shows Add (`btn-outline btn-sm`) or `badge-selected` + Remove · `.is-selected` = tint + blue border · `.listing-row-extra` holds inline options |
| Update card | `.update-card` | white 48px, padding 33px · blue 30px title · "Example" label when illustrative · `.update-rows` of grey 46px `.update-row` rows (`is-done` green check, `is-pending` blue turning clock, `is-problem` red alert) |
| Step card | `.step-card` | white 48px large card that holds one planner step: eyebrow "Plan my trip · 2 of 5", blue title, lead, content, `.builder-actions` (Back outline · Skip text link · Continue primary on the right) |
| Detail section | `.detail-section` | white 24px card, padding 32px, 30px title; facts as grey 16px tiles |
| Booking panel | `.book-panel` | sticky white 48px card holding `AddToTripForm`: pill inputs, add-on chips, `.breakdown` (grey rows + total), Add button; on phones → `.book-bar` + bottom sheet |
| Next action | `.next-card` | **solid blue** 48px card, white text, `btn-white`: the one action that matters now |
| Side card | `.side-card` | white 48px card in the right column (guides, Ask) |
| Driver card | `.driver-card` | white 48px · 88px round photo or initials on tint · Cormorant name · Verified badge · car + **plate** · pickup time · reference badge |

## Lists and timelines

```tsx
{/* Step items (How it works) */}
<ol className="steps" style={{ '--progress': p }}>      {/* 1px line; blue progress scales on scroll */}
  <li className="step-item is-reached"><span className="step-num">1</span><div><h3 className="step-title">Tell us when you land</h3><p className="step-text">…</p></div></li>
</ol>

{/* Day by day (plan review, dashboard) */}
<ol className="day-list"><li className="day"><span className="day-num">1</span><div>
  <h3 className="day-title">Day 1 <span className="muted">· Saturday 14 November</span></h3>
  <ul className="day-events"><li className="day-entry"><span className="ev-time">8:30pm</span><span className="entry-title">Airport pickup</span>
    <span className="badge status-chip--ok">Confirmed</span><span className="entry-links"><button className="text-link small">Change</button>…</span></li></ul>
</div></li></ol>

{/* Progress circles (planner): .progress > li.done|.current > button > .progress-dot + .progress-label */}
```

Multi-day items appear above the day list as `update-row span-row` rows, each with a `badge` reading "Days 1–6".

## Overlays

- **Drawer** (`assets/components/Drawer.tsx`): right side on desktop (48px left radius) and a bottom sheet on phones; 350ms slide; portal; focus trap.
  - Body `.drawer-body`, footer `.drawer-footer` (stacked buttons).
  - Add `className="sheet"` for filter and booking sheets.
- **Modal** (`assets/components/Modal.tsx`): centred white 48px card that scales 0.96 → 1; portal; focus trap; returns focus to the opener.
  - Use it for add-to-trip, sign-in and the SOS confirmation.
  - Never render a `position: fixed` overlay inside a card, because hover transforms break fixed positioning.
- **My Trip drawer**: rows of 64px thumbnail + title/detail/price + × button; footer has the total (counts up), "Review and pay" (primary) and "Keep exploring" (outline).
- **Ask Menyor**: greeting in a grey bubble, then outline prompt pills.
  - Guest bubbles are blue, Menyor bubbles grey (20px radius with a 6px tail corner).
  - Proposals appear as `.mini-card` (56px thumbnail, Cormorant title, price, Add button).
  - The input is a pill `.ask-form` with a round blue `.send-btn`, plus a "Talk to a person" link that opens WhatsApp.
- **Help**: `.help-option` grey rows (icon, title, sub), then the FAQ accordion in blue on white.
- **Sign In modal**: "Welcome to Menyor", Google and Apple as outline buttons, an "or" divider, an email field, "Continue with email" (magic link), terms, and "No account needed to book".

## Chrome

**Header:** grey and sticky.
- 208px SVG logo; navigation with a 1px underline on hover or for the current page.
- Currency pill (`NGN ₦`, native select).
- My Trip pill: bag icon, circled count that bumps when it changes, total that counts up.
- Solid "Sign In" pill.
- ≤1180: menu button opening a full-screen `.mobile-menu` with 36px Cormorant links.
- Phones: logo, compact trip pill and menu only.

**Footer:** blue.
- Logo, brand line and cities on the left; EXPLORE and SUPPORT columns.
- A 60% white divider; ©, legal links and social icons along the bottom.
- Unset social links render inert at 60% opacity.

**Floating:** "Ask Menyor" is a white pill with a blue outline, bottom right. The phone SOS button is blue, bottom left. Both hide while a drawer or dialog is open.

## Icons

`assets/components/Icon.tsx`: 24×24 line icons drawn with `stroke="currentColor"`, 1.8 stroke width and round caps.
Add new icons in that style, keyed by name.
Notable icons:
- `checkCircle` and `pending` (the clock with a circular arrow)
- `arrowLong` and `ArrowLong`
- `send`, `filter`, `bag`, `chevronDown`
- `google`, `apple`, `bank`, `sos`, `copyright`

The logo is `assets/menyor-logo.svg`, rendered by `Logo.tsx` with `fill="currentColor"`: blue on grey, white on blue.
