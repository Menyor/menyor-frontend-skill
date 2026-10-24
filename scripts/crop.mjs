// Usage: node crop.mjs SRC.png OUTDIR '[["name",x,y,w,h,scale], ...]'  (strips side by side if 'strip' given)
import fs from 'fs';
const [SRC, OUT, cropsJson] = process.argv.slice(2);
const IMG = process.env.IMG_DIR;   // folder served by `python3 -m http.server 8765 --bind 127.0.0.1`
fs.copyFileSync(SRC, `${IMG}/_crop.png`);
const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 300)); return r.result.result.value; };
await send('Page.navigate', { url: 'http://127.0.0.1:8765/' }); await new Promise(r => setTimeout(r, 500));
await ev(`new Promise(res => { window.__i = new Image(); __i.onload = res; __i.src = '/_crop.png?' + Date.now(); })`);
// Each crop: [name, x, y, w, h, scale, cols]: with cols > 1 the region is cut into vertical strips placed side by side.
for (const [name, x, y, w, h, s = 1, cols = 1] of JSON.parse(cropsJson)) {
  const data = await ev(`(() => { const sh = Math.ceil(${h}/${cols}); const c = document.createElement('canvas'); c.width = Math.round((${w}*${cols} + 10*(${cols}-1))*${s}); c.height = Math.round(sh*${s});
    const g = c.getContext('2d'); g.fillStyle = '#f0f'; g.fillRect(0,0,c.width,c.height); g.imageSmoothingQuality = 'high';
    for (let k = 0; k < ${cols}; k++) g.drawImage(__i, ${x}, ${y} + k*sh, ${w}, sh, k*(${w}+10)*${s}, 0, ${w}*${s}, sh*${s});
    return c.toDataURL('image/png').split(',')[1]; })()`);
  fs.writeFileSync(`${OUT}/${name}.png`, Buffer.from(data, 'base64'));
}
await send('Target.closeTarget', { targetId: t.id }).catch(() => {}); ws.close(); process.exit(0);
