# menyor-frontend

A [Claude Code](https://claude.com/claude-code) skill that captures the Menyor Nigeria frontend: the design
system built from the Figma home page (tokens, Cormorant Garamond + DM Sans type scale, pill controls,
48/24px cards, no shadows), component recipes, motion presets, and the build-and-verify process
(Figma matching, palette/contrast/axe audits, Lighthouse targets).

Claude loads it for any frontend work so new screens and products match the Menyor look.

## Install

```sh
git clone <this repo> ~/.claude/skills/menyor-frontend
```

## Layout

| Path | What |
|---|---|
| `SKILL.md` | Entry point: the rules applied every time |
| `references/` | Design system, components, motion, verification, pitfalls |
| `assets/` | Canonical `globals.css`, logo SVG, `motion.ts`, core React components |
| `scripts/` | Screenshot, side-by-side, measurement and audit scripts (Chrome DevTools Protocol on port 9333) |

The live implementation is the `menyor-nigeria` app (`src/app/globals.css`). When the system changes
there, update this skill too.
