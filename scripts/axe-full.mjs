import fs from 'fs';
import { open } from './lib.mjs';
const [tripPath] = process.argv.slice(2);
// WCAG 2.1 A/AA axe run over pages (and open drawers/modals) at 1440 and 390.
// Needs axe-core: AXE_PATH=/path/to/axe-core/axe.min.js (npm i axe-core in any folder).
// Edit `pages` for the app; '#help', '#ask', '#trip', '#signin', '#menu' open panels first.
const AXE = fs.readFileSync(process.env.AXE_PATH ?? 'node_modules/axe-core/axe.min.js', 'utf8');
const pages = ['/', '/rides', '/stays', '/tables', '/escapes', '/rides/range-rover-autobiography-lwb', '/stays/obsidian-waterfront-penthouse',
  '/plan?step=arrival', '/plan?step=ride', '/plan?step=stay', '/plan?step=enjoy', '/plan?step=review', '/checkout', '/explore', '/search?q=armoured',
  tripPath, '/my-menyor', '/guide', '/account', '/about', '/privacy', '/terms', '/cancellation-policy', '/lagos/airport-pickup', '/no-such-page', '/admin/login',
  '/#help', '/#ask', '/#trip', '/#signin', '/#menu'];
const out = [];
for (const [w, h] of [[1440, 900], [390, 844]]) {
  const b = await open(w, h);
  await b.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  for (const path of pages) {
    if (path === '/#menu' && w > 700) continue;
    await b.go(path.replace(/#.*/, ''), 2500);
    const panel = path.split('#')[1];
    if (panel === 'help') await b.ev(`byText('.footer-link-btn', '^Help$').click()`);
    if (panel === 'ask') { await b.ev(`document.querySelector('.fab-ask').click()`); await b.sleep(400); await b.ev(`byText('.ask-suggestions .chip-btn', 'table').click()`); await b.sleep(5000); }
    if (panel === 'trip') await b.ev(`document.querySelector('${w > 1360 ? '.trip-full' : '.trip-compact'} .trip-pill').click()`);
    if (panel === 'signin') await b.ev(w > 700 ? `document.querySelector('.signin-btn').click()` : `(() => { document.querySelector('.menu-btn').click(); setTimeout(() => byText('.mobile-menu .btn', 'Sign In').click(), 300); })()`);
    if (panel === 'menu') await b.ev(`document.querySelector('.menu-btn').click()`);
    if (panel) await b.sleep(900);
    await b.ev(AXE + ';true');
    const r = JSON.parse(await b.ev(`axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }, resultTypes: ['violations'] }).then(r => JSON.stringify(r.violations.map(v => v.id + ' (' + v.nodes.length + '): ' + v.nodes.slice(0, 2).map(n => n.target.join(' ')).join(' | '))))`));
    out.push(`${r.length ? 'FAIL' : 'PASS'}  [${w}] ${path}${r.length ? '\n      ' + r.join('\n      ') : ''}`);
  }
  await b.close();
}
console.log(out.join('\n'));
console.log(`\n${out.filter(l => l.startsWith('PASS')).length}/${out.length} pages clean`);
process.exit(0);
