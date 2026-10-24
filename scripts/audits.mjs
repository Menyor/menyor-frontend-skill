// In-page audits for the Menyor design system. Each export is a JS expression
// string: evaluate it in the page (CDP Runtime.evaluate with returnByValue) and
// it returns an array of problems (empty = pass).
//
//   paletteAudit  - text/icon/background colours outside the Menyor palette,
//                   and any font other than Cormorant Garamond / DM Sans.
//   contrastAudit - text below WCAG AA (4.5:1, or 3:1 for large text).
//
// Usage with lib.mjs:
//   import { paletteAudit, contrastAudit } from './audits.mjs';
//   const b = await open(1440, 900); await b.go('/');
//   console.log(await b.ev(paletteAudit), await b.ev(contrastAudit));

export const paletteAudit = `(() => {
  const parse = c => { const m = c.match(/[\\d.]+/g); if (!m) return [0,0,0,0]; const v = m.map(Number); if (c.startsWith('color(')) { v[0] *= 255; v[1] *= 255; v[2] *= 255; } return v; };
  const hex = c => '#' + c.slice(0, 3).map(v => Math.round(v).toString(16).padStart(2, '0')).join('').toUpperCase();
  const TEXT = ['#111111','#5F6368','#006BA6','#005A8C','#FFFFFF','#C62828'], ICON = [...TEXT, '#1E8E3E'];
  const BG = ['#EBEAEA','#FFFFFF','#006BA6','#005A8C','#E6F0F6','#C62828','#111111'];
  const out = new Set();
  const vis = el => el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden' && !el.closest('[hidden], nextjs-portal, iframe');
  for (const el of document.querySelectorAll('body *')) {
    if (!vis(el) || el.closest('svg') && el.tagName !== 'svg') continue;
    const st = getComputedStyle(el);
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    const col = parse(st.color), bg = parse(st.backgroundColor);
    if (hasText && (col[3] ?? 1) > 0.5 && !TEXT.includes(hex(col))) out.add('text ' + hex(col) + ' on ' + el.tagName + '.' + el.className);
    if (el.tagName === 'svg' && !ICON.includes(hex(col))) out.add('icon ' + hex(col) + ' ' + (el.parentElement?.className ?? ''));
    if ((bg[3] ?? 1) > 0.9 && !BG.includes(hex(bg))) out.add('bg ' + hex(bg) + ' on ' + el.tagName + '.' + el.className);
    if (hasText) { const f = st.fontFamily.split(',')[0].replace(/["']/g, '').trim(); if (!/^(Cormorant Garamond|DM Sans)$/.test(f)) out.add('font ' + f + ' on ' + el.tagName + '.' + el.className); }
  }
  return [...out]; })()`;

export const contrastAudit = `(() => {
  const parse = c => { const m = c.match(/[\\d.]+/g); if (!m) return [0,0,0,0]; const v = m.map(Number); if (c.startsWith('color(')) { v[0] *= 255; v[1] *= 255; v[2] *= 255; } return v; };
  const lum = ([r,g,b]) => { const f = v => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  const blend = (fg, bg) => { const a = fg[3] ?? 1; return [0,1,2].map(i => fg[i]*a + bg[i]*(1-a)); };
  const bgOf = el => { if (el.closest('.pill-tabs') && el.closest('.pill-tab')?.getAttribute('aria-selected') === 'true' && el.closest('.pill-tabs').querySelector('.pill-tabs-indicator')) return parse(getComputedStyle(el.closest('.pill-tabs').querySelector('.pill-tabs-indicator')).backgroundColor);  /* white text on the sliding blue pill */
  const stack = []; for (let n = el; n; n = n.parentElement) { const c = parse(getComputedStyle(n).backgroundColor); if ((c[3] ?? 1) > 0) { stack.push(c); if ((c[3] ?? 1) === 1) break; } } let bg = [255,255,255]; for (let i = stack.length - 1; i >= 0; i--) bg = blend(stack[i], bg); return bg; };
  const fails = []; const seen = new Set();
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (w.nextNode()) { const t = w.currentNode; if (!t.textContent.trim()) continue; const el = t.parentElement; if (seen.has(el)) continue; seen.add(el);
    if (!el.getClientRects().length || el.closest('[hidden], .hero-copy, .toast-region, .media-placeholder, nextjs-portal, [disabled], .is-unset, iframe')) continue;
    const st = getComputedStyle(el); if (st.visibility === 'hidden' || Number(st.opacity) < 1) continue;
    const bg = bgOf(el); const f = blend(parse(st.color), bg); const L1 = lum(f), L2 = lum(bg); const r = (Math.max(L1,L2)+0.05)/(Math.min(L1,L2)+0.05);
    const big = (parseFloat(st.fontSize) >= 18.66 && Number(st.fontWeight) >= 700) || parseFloat(st.fontSize) >= 24; if (r < (big ? 3 : 4.5)) fails.push(el.tagName + '.' + el.className + ' "' + t.textContent.trim().slice(0, 25) + '" ' + r.toFixed(2)); }
  return fails; })()`;
