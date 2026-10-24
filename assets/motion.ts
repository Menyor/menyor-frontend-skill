// One shared set of motion presets. globals.css mirrors these as custom
// properties (--ease, --reveal-ms, --stagger-ms …) so CSS and JS agree.
// Only transform and opacity animate. prefers-reduced-motion turns all of it
// off: content shows at once, nothing zooms, floats, slides or counts.
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as const,
  revealMs: 600,              // fade + 24px rise
  revealDistance: 24,
  revealThreshold: 0.2,       // 20% of the element in view
  staggerMs: 90,              // between siblings in a group
  headlineLineMs: 120,        // between headline lines
  headerFadeMs: 400,          // header fades in on load
  heroScaleFrom: 1.08,        // hero photo settles from 1.08 to 1
  heroScaleMs: 1600,
  heroParallax: 0.85,         // desktop only: photo scrolls at 0.85× and fades
  tabFadeMs: 250,             // booking card panel cross-fade (12px)
  tabShift: 12,
  checkDrawMs: 500,
  drawerMs: 350,
  pageFadeMs: 200,
  hoverMs: 150,
  countUpMs: 600,             // trip total counting up
} as const;

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Desktop pointer and wide enough for parallax (never on phones). */
export function allowsParallax(): boolean {
  return typeof window !== 'undefined' && !prefersReducedMotion() && window.matchMedia('(min-width: 961px) and (pointer: fine)').matches;
}
