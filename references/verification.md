# Build and verify

The quality bar: the result matches the design to within a few pixels, passes the palette, contrast
and axe audits, scores at least 85 for Performance and at least 95 for Accessibility on Lighthouse
mobile, and is reported honestly with screenshots.

## Tooling setup (once per session)

- **Headless Chrome on the DevTools Protocol port 9333:**
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/chrome-cdp about:blank &`
- **Node** lives at `~/.local/node/bin` (`export PATH="$HOME/.local/node/bin:$PATH"`). Use Node 22, which has a global `WebSocket` and `fetch`.
- **Figma export:** put the PNG (usually exported at 3×) in a folder as `1.png` and serve that folder:
  `python3 -m http.server 8765 --bind 127.0.0.1`. Set `IMG_DIR` to the same folder.
- **Scripts** (in `scripts/`; copy them to the scratchpad and run them from there):

| Script | Does |
|---|---|
| `lib.mjs` | `open(w, h)` → `{ go, ev, shot, ok, size, sleep, inDays }`; `setVal(el, v)` sets React-controlled inputs; `byText(sel, re)` |
| `shot.mjs URL OUT W [H/full] [js] [motion]` | screenshot; `full` = full page |
| `sbs.mjs OURS OUT '[[figY, ourY, h, x, w, scale]]'` | side-by-side Figma (left) vs ours (right) |
| `crop.mjs SRC OUTDIR '[[name, x, y, w, h, scale, cols]]'` | crop a region, or cut a tall page into columns |
| `extent.mjs '[[name, x, y, w, h, "white|dark|blue"]]' [img] [scale]` | bounding box of the ink in a region (Figma or ours), in 1× coordinates |
| `audits.mjs` | `paletteAudit` (colours and fonts outside the system), `contrastAudit` (WCAG AA) |
| `axe-full.mjs` | WCAG 2.1 A/AA axe run over pages and open panels at 1440 and 390 |

## Matching a Figma exactly

1. **Sample the colours** from pixels; don't trust the brief's hex values. Sampling gave #006BA6 (blue) and #EBEAEA (grey).
2. **Extract real assets** from the export (photos via bounding boxes). Check whether text was flattened into a photo. If so, ask for the original file; meanwhile retouch it out with diffusion inpainting and say so in the report.
3. **Solve font sizes from text widths, not cap heights.**
   - Measure the Figma's ink width with `extent.mjs`.
   - In the page, measure the same string with canvas `measureText` (`actualBoundingBoxLeft + Right`) at 100px for each weight and letter-spacing.
   - Calculate `size = 100 × figmaWidth ÷ inkWidth@100`. Values that agree across several strings reveal the true size and tracking.
   - That is how 110 / 64 / 30px at 700 weight and -2% tracking was found.
4. **Solve line height** from the gap between the ink tops of consecutive lines, corrected by each line's `actualBoundingBoxAscent`.
5. **Match vertical positions:**
   - Measure the ink tops of every eyebrow, headline, card title and price, in both the Figma and our render.
   - Correct paddings and margins section by section until the deltas are within about 5px.
   - The whole page height should come out equal to the Figma's.
6. **Keep the designer's real offsets** (e.g. a row 28px left of centre) and tell the user. Fix obvious design bugs (duplicated step titles, typos, uneven card heights) only where the brief asks, and list each one.
7. **Report** with full-page and per-section side-by-side images and a "Where it differs" list.

## Every new screen

- Screenshots at 1440, 768 and 390.
  - Full page: scroll through first so lazy images load.
  - Hide fixed elements (`.plan-bar, .fab-ask, .toast-region`).
  - **Set `#main { min-height: 0 }` before resizing the viewport to page height**, or `100dvh` inflates the capture.
- Run `paletteAudit` and `contrastAudit` on every captured state; they must return `[]`.
- Run axe over the pages plus the open drawers and modals.
- Check `document.documentElement.scrollWidth <= innerWidth` at each width (no sideways scrolling).
- Check motion with `prefers-reduced-motion` emulated both ways.
- **Lighthouse on a production build:**
  - `next build`, then `next start -p 3300`.
  - `node lighthouse/cli/index.js URL --port=9333 --form-factor=mobile --output=json`.
  - Targets: Performance at least 85, Accessibility at least 95, CLS 0.
  - CLS from the footer means the loading placeholder is shorter than the screen; keep `#main { min-height: 100dvh }`.
- **End to end:** drive the real flow (forms, drawers, checkout in test mode) and assert on text and state, not pixels. Afterwards, delete only the test data you created (e.g. `@example.com` guests) inside a transaction, and never touch the user's own records.

## Reporting

Publish an HTML report (an artifact) in the Menyor style. It should include:
- headline numbers
- the user's decisions first
- side-by-side images (embedded as JPEG data URIs, about 3MB in total)
- a per-flow gallery for desktop and phone
- the motion table
- the acceptance checks with real results
- what's not done and why
- the files changed

Say plainly what was measured and what was assumed.
