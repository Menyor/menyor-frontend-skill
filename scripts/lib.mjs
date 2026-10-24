import fs from 'fs';
export async function open(W = 1440, H = 900) {
  const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
  let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
  const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) return 'ERR ' + JSON.stringify(r.result.exceptionDetails).slice(0, 300); return r.result?.result?.value; };
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const size = async (w, h) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
  await send('Page.enable'); await size(W, H);
  const helpers = `window.setVal = (el, v) => { const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, v); el.dispatchEvent(new Event(el.tagName === 'SELECT' ? 'change' : 'input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }; window.byText = (sel, re) => [...document.querySelectorAll(sel)].find(e => new RegExp(re).test(e.textContent));`;
  const go = async (url, wait = 2200) => { await send('Page.navigate', { url: url.startsWith('http') ? url : (process.env.APP_URL ?? 'http://localhost:3200') + url }); await sleep(wait); await ev(helpers); };
  const shot = async (n, full = false) => {
    if (full) { const h = await ev('document.documentElement.scrollHeight'); const w = await ev('innerWidth'); await size(w, h); await sleep(800); }
    fs.writeFileSync(`cmp/${n}.png`, Buffer.from((await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full })).result.data, 'base64'));
    if (full) await size(W, H);
  };
  const ok = (name, cond, extra = '') => console.log(cond ? 'PASS' : 'FAIL', name, extra ?? '');
  const close = async () => { await send('Target.closeTarget', { targetId: t.id }).catch(() => {}); ws.close(); };
  const inDays = n => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
  return { send, ev, sleep, go, shot, ok, close, size, inDays, helpers };
}
