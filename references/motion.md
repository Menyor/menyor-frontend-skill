# Motion

One presets file: `assets/motion.ts` (`MOTION`, `prefersReducedMotion()`, `allowsParallax()`),
mirrored as CSS variables (`--ease`, `--reveal-ms`, `--stagger-ms`, `--line-ms`, `--hover-ms`, `--drawer-ms`).
Easing everywhere: `cubic-bezier(0.22, 1, 0.36, 1)`.

**Rules:**
- Animate only `transform` and `opacity`. The two deliberate exceptions are the FAQ answer height (`grid-template-rows: 0fr → 1fr`) and the booking card height (measured with a ResizeObserver).
- No parallax on phones (`allowsParallax()` requires min-width 961 and a fine pointer).
- `prefers-reduced-motion: reduce` makes every duration effectively 0, shows hidden reveal states at once, and turns parallax off.
- Never leave content at `opacity: 0` without a reduced-motion override.
- Don't give `animation-fill-mode: both` to a wrapper that contains overlays: it keeps a stacking context and traps drawers. Page fade runs without a fill mode.

| Effect | Spec | How |
|---|---|---|
| Reveal | rise 24px + fade over 600ms when 20% visible, once | `<Reveal>` adds `.is-visible` (IntersectionObserver, threshold 0.2) |
| Stagger | 90ms between siblings | `<Reveal stagger>`; `.reveal-stagger > :nth-child(n)` delays |
| Headline lines | 120ms apart, after the eyebrow | `<SectionHeading lines>` → `.display-line { transition-delay: calc((var(--line) + 1) * 120ms) }` |
| Header | fades in on load | `.site-header { animation: headerFade 400ms }` |
| Hero photo | scale 1.08 → 1 over 1.6s; desktop parallax 0.85× with fade | `.hero-img` keyframes; `HeroParallax` sets `--parallax` / `--hero-fade` on scroll (rAF) |
| Hero text | lines rise 120ms apart | `.line-rise` with `--line` index |
| Tabs | active pill slides | absolutely positioned `.pill-tabs-indicator` moved with `translateX` + width, 350ms |
| Panel swap | 12px cross-fade | `.panel-swap { animation: panelIn 250ms }` keyed on the step or tab |
| Height | booking card follows its content | wrapper height from a ResizeObserver, `transition: height 350ms` |
| Check | draws in 500ms | `<DrawnCheck>`: SVG `pathLength=1`, `stroke-dashoffset 1 → 0` |
| Hover | lift 6px, image 1.05, arrow 4px | only inside `@media (hover: hover) and (pointer: fine)` |
| Timeline | line draws on scroll, circles tint | `--progress` 0…1 drives `scaleY` on `.steps::after` |
| Update card | floats in, rows one by one (300ms apart), clock turns | `.update-card.is-shown`; `--row` index delays; `@keyframes turn` 6s |
| Ticks | green checks draw in, 120ms apart | `.reveal-stagger .tick path` dashoffset |
| Add to trip | button shows "Added", header count bumps, total counts up | `is-added` for 2.4s; `.trip-count.is-bumping` (scale 1.35 keyframe); `useCountUp` 600ms ease-out cubic |
| FAQ | height animates, plus rotates 45° | `.accordion-a` grid rows; `.accordion-sign` rotate |
| Drawers | slide over 350ms; bottom sheets on phones | `drawerIn` / `sheetIn` keyframes |
| Modals | scale 0.96 → 1 + fade | `modalIn` 300ms |
| Pages | fade over 200ms | `app/template.tsx` wraps children in `.page-fade` |
| Buttons | 150ms colour; press scale 0.98 | `.btn:active { transform: scale(0.98) }` |
| Toast | rises 12px | `toastIn` 300ms |

Verify both modes: emulate `prefers-reduced-motion` with Chrome DevTools Protocol and read the computed `animationName`/`animationDuration` and the reveal opacities (see `references/verification.md`).
