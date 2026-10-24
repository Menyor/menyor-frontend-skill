// Ink bounding boxes in the Figma export (1× coords). Usage: node extent.mjs '[["name", x, y, w, h, "white|dark|blue"], ...]' [image=/1.png] [scale=3]
const [specJson, src = '/1.png', SC = '3'] = process.argv.slice(2);
const t = await (await fetch('http://localhost:9333/json/new?about:blank', { method: 'PUT' })).json();
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const p = new Map(); ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (p.has(m.id)) { p.get(m.id)(m); p.delete(m.id); } });
const send = (method, params = {}) => new Promise(r => { const i = ++id; p.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true }); if (r.result.exceptionDetails) throw new Error(JSON.stringify(r.result.exceptionDetails).slice(0, 500)); return r.result.result.value; };
await send('Page.navigate', { url: 'http://127.0.0.1:8765/' }); await new Promise(r => setTimeout(r, 500));
const out = await ev(`(async () => { const img = new Image(); img.src = '${src}?' + Date.now(); await img.decode(); const S = ${SC};
  const res = {}; for (const [name, x, y, w, h, kind] of ${specJson}) {
    const c = document.createElement('canvas'); c.width = w*S; c.height = h*S; const g = c.getContext('2d'); g.drawImage(img, x*S, y*S, w*S, h*S, 0, 0, w*S, h*S);
    const d = g.getImageData(0, 0, w*S, h*S).data; let x0=1e9,y0=1e9,x1=-1,y1=-1;
    const test = (r,gg,b) => kind==='white' ? (Math.min(r,gg,b) > 235) : kind==='dark' ? (Math.max(r,gg,b) < 90) : (b > 130 && r < 60 && gg < 140);
    for (let yy=0; yy<h*S; yy++) for (let xx=0; xx<w*S; xx++) { const i=(yy*w*S+xx)*4; if (test(d[i],d[i+1],d[i+2])) { if(xx<x0)x0=xx; if(xx>x1)x1=xx; if(yy<y0)y0=yy; if(yy>y1)y1=yy; } }
    res[name] = [ +(x + x0/S).toFixed(1), +(y + y0/S).toFixed(1), +((x1-x0+1)/S).toFixed(1), +((y1-y0+1)/S).toFixed(1) ]; }
  return res; })()`);
console.log(JSON.stringify(out));
await send('Target.closeTarget', { targetId: t.id }).catch(() => {}); ws.close(); process.exit(0);
