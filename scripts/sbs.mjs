// Side by side: Figma (left, 1× from the 3× export) vs ours (right).
// Usage: node sbs.mjs OURS.png OUT.png '[[figY, ourY, h, x=0, w=1440, scale=0.5], ...]'
import fs from 'fs';
const [OURS, OUT, specJson] = process.argv.slice(2);
const IMG = process.env.IMG_DIR;   // folder served by `python3 -m http.server 8765 --bind 127.0.0.1`
fs.copyFileSync(OURS, `${IMG}/_ours.png`);
const specs = JSON.parse(specJson);
const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result.result.value; };
await send('Page.navigate', { url: 'http://127.0.0.1:8765/' }); await new Promise(r => setTimeout(r, 600));
await ev(`Promise.all([['__f','/1.png'],['__o','/_ours.png?'+Date.now()]].map(([k,s]) => new Promise(res => { window[k] = new Image(); window[k].onload = res; window[k].src = s; })))`);
let n = 0;
for (const [fy, oy, h, x = 0, w = 1440, scale = 0.5] of specs) {
  const data = await ev(`(() => { const s=${scale}, c = document.createElement('canvas'); c.width = Math.round(${w}*2*s + 12); c.height = Math.round(${h}*s);
    const g = c.getContext('2d'); g.fillStyle='#f0f'; g.fillRect(0,0,c.width,c.height); g.imageSmoothingQuality='high';
    g.drawImage(__f, ${x}*3, ${fy}*3, ${w}*3, ${h}*3, 0, 0, ${w}*s, ${h}*s);
    g.drawImage(__o, ${x}, ${oy}, ${w}, ${h}, ${w}*s+12, 0, ${w}*s, ${h}*s);
    return c.toDataURL('image/png').split(',')[1]; })()`);
  fs.writeFileSync(OUT.replace('.png', `-${n++}.png`), Buffer.from(data, 'base64'));
}
await send('Target.closeTarget', { targetId: t.id }).catch(() => {});
ws.close(); process.exit(0);
