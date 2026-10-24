# Pitfalls already hit (don't repeat them)

## Next.js 16 (App Router, Turbopack, Cache Components)
- **Read `node_modules/next/dist/docs/` first.** APIs differ from older Next.js versions:
  - `proxy.ts` replaces middleware.
  - `params` and `searchParams` are Promises.
  - `revalidateTag` takes two arguments.
  - next/image requires `images.qualities`.
- **With `cacheComponents: true`:**
  - Never call `new Date()` / `Date.now()` in a render that can be prerendered. Server code calls `await connection()`; client code reads today via the `useToday()` hook (`useSyncExternalStore` with an empty server snapshot).
  - Wrap `usePathname`, `cookies()` and other dynamic data in `<Suspense>`.
- **Server component importing a component from a `'use client'` file that also exports other things** can fail with "Element type is invalid … got: undefined". Put shared presentational pieces (e.g. `DrawnCheck`) in their own plain file without `'use client'`.
- **Add `data-scroll-behavior="smooth"`** to `<html>` when using `scroll-behavior: smooth`.
- **`app/template.tsx`** remounts on every navigation; use it for the 200ms page fade.

## CSS and the dev server
- **Don't add Tailwind.** Its Turbopack loader (`@tailwindcss/turbopack`) served a stale `globals.css` after edits. The system is plain CSS with custom properties.
- **If the dev server ever serves stale CSS:** stop it, `rm -rf .next`, and restart. Confirm with `curl` that the served CSS contains your change before judging a screenshot.
- **zsh:**
  - Quote globs in `grep --include='*.tsx'`.
  - Never name a variable `path`, because it clobbers `PATH`.

## Stacking and positioning
- **An animation with `fill-mode: both` on a wrapper** (e.g. a page fade) keeps a stacking context, so drawers inside it render under fixed headers and floating buttons. Use no fill mode, and portal overlays to `document.body`.
- **Any `transform` on an ancestor** (card hover lift) makes `position: fixed` children position relative to that card. Dialogs opened from cards **must** use a portal (`Modal`).
- **Hide floating buttons** while overlays are open: `body:has(.drawer, .dialog, .mobile-menu) :is(.fab-ask, .fab-sos, .plan-bar) { visibility: hidden }`.

## React patterns
- **Drawer and Modal effects must not depend on an inline `onClose`.** Store it in a ref, or the focus jumps on every render.
- **Forms rendered in two places at once** (booking panel + phone sheet) need an `idPrefix` so IDs stay unique. The same applies to reused accordions (`Faq idPrefix`).
- **Native date and select inputs** controlled by React need the native value setter in tests (`setVal` in `scripts/lib.mjs`).

## Accessibility traps found by axe
- **Dimming a whole row with `opacity`** fails contrast. Dim only the image.
- **A progress button whose label is hidden on phones** needs an `aria-label`.
- **A placeholder with `role="img"` and an empty label** fails; make visual-only elements `aria-hidden`.
- **The sliding tab indicator is a sibling element**, so contrast tools see white on white. Teach the audit, or treat it as a known false positive.

## Content and data
- **Figma exports flatten text into photos.** Check before using a hero image as-is.
- **Figma copy has typos and duplicates**, such as "Change airpot", "Its" and three identical step titles. Use the brief's corrected copy and list every fix.
- **Prices follow live exchange rates**, so Figma figures drift. Store prices in one base currency and convert for display.
- **Don't delete the user's own records** when cleaning test data. Filter on test-only markers (`@example.com`) inside a transaction.
