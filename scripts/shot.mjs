// Usage: node shot.mjs URL OUT.png WIDTH [HEIGHT|full] [js-before-shot] [motion=reduce|no-preference]
import fs from 'fs';
const [URL, OUT, W = '1440', H = 'full', JS = '', MOTION = 'reduce'] = process.argv.slice(2);
const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); return r.result?.result?.value; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const w = Number(W), mobile = w < 700;
await send('Page.enable');
await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: MOTION }] });
await send('Emulation.setDeviceMetricsOverride', { width: w, height: H === 'full' ? 900 : Number(H), deviceScaleFactor: 1, mobile });
await send('Page.navigate', { url: URL }); await sleep(2500);
if (JS) { await ev(JS); await sleep(1200); }
if (H === 'full') {
  const h = await ev('document.documentElement.scrollHeight');
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
  await sleep(1500);
}
const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: H === 'full' });
fs.writeFileSync(OUT, Buffer.from(r.result.data, 'base64'));
console.log(OUT, await ev('document.documentElement.scrollHeight'));
await send('Target.closeTarget', { targetId: t.id }).catch(() => {});
ws.close(); process.exit(0);
