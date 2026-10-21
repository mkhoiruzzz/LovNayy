// ====== UBAH TEKS DI SINI ======
const CONFIG = {
  countdown: ["3", "2", "1"],
  words: ["You", "Are", "My", "Love"],
  message: ["I Love ", "♥", " You Sayang"],   // dipakai kalau tidak ada foto
  photo: "assets/nay.jpg",          // contoh: "assets/foto.jpg" agar foto tampil di dalam hati
  showPicker: true    // tombol "Pilih foto" untuk mencoba foto dari perangkat
};
// ===============================

const rain = document.getElementById('rain'), rc = rain.getContext('2d');
const fx = document.getElementById('fx'), c = fx.getContext('2d');
const btn = document.getElementById('bar');
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BG = 'rgba(11,10,31,';
const CREAM = ['#efe9b8', '#f4efc9', '#e6dfa6'];
const PINK = ['#ff4fa3', '#ff7ac0', '#ff9fd2', '#e8409a'];
let W, H, D, cols = [], P = [], cur = null, msgA = 0, runId = 0;

const off = document.createElement('canvas');
const oc = off.getContext('2d', { willReadFrequently: true });

function resize() {
  D = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  for (const k of [rain, fx]) { k.width = W * D; k.height = H * D; }
  rc.setTransform(D, 0, 0, D, 0, 0); c.setTransform(D, 0, 0, D, 0, 0);
  rc.fillStyle = BG + '1)'; rc.fillRect(0, 0, W, H);
  cols = Array.from({ length: Math.ceil(W / 16) }, (_, i) => newCol(i * 16 + 8, true));
  if (cur) apply(cur);
}
function newCol(x, first) {
  return { x, y: first ? Math.random() * -H : -10, t: 2 + Math.floor(Math.random() * 4), c: 0, on: Math.random() < .45 };
}

function drawRain() {
  rc.fillStyle = BG + '.12)'; rc.fillRect(0, 0, W, H);
  rc.font = '13px monospace'; rc.textAlign = 'center';
  for (const k of cols) {
    if (!k.on) { if (Math.random() < .004) { k.on = true; k.y = -10; } continue; }
    if (++k.c < k.t * (RM ? 3 : 1)) continue;
    k.c = 0;
    rc.fillStyle = Math.random() < .08 ? '#ffd1e8' : 'rgba(255,95,168,.85)';
    rc.fillText(Math.random() < .5 ? '0' : '1', k.x, k.y);
    k.y += 14;
    if (k.y > H + 20) { const n = newCol(k.x); n.on = Math.random() < .5; Object.assign(k, n); }
  }
}

function textPts(t) {
  off.width = W; off.height = H;
  const size = Math.min(H * .4, W * .9 / (Math.max(t.length, 1.6) * .62));
  oc.font = `900 ${size}px "Arial Black", Arial, Helvetica, sans-serif`;
  oc.textAlign = 'center'; oc.textBaseline = 'middle'; oc.fillStyle = '#fff';
  oc.fillText(t, W / 2, H * .46);
  const g = Math.max(5, Math.round(size / 20)), d = oc.getImageData(0, 0, W, H).data, pts = [];
  for (let y = 0; y < H; y += g) for (let x = 0; x < W; x += g)
    if (d[(y * W + x) * 4 + 3] > 128) pts.push({ x, y });
  return { pts, r: g * .4, pal: CREAM };
}

function heartW() { return Math.min(W * .72, H * .46); }
function heartPts() {
  const s = heartW() / 32, cx = W / 2, cy = H * .46 + 2.5 * s, pts = [];
  for (let i = 0; i < 950; i++) {
    const t = Math.random() * Math.PI * 2, f = 1 - Math.random() * Math.random() * .17;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push({ x: cx + x * s * f, y: cy + y * s * f });
  }
  return { pts, r: Math.max(1.6, s * .16), pal: PINK };
}

function newP() {
  return { x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, a: 0, ta: 0, free: true, bx: 0, by: 0, r: 3, col: '#fff' };
}

function apply(o) {
  cur = o;
  const { pts, r, pal } = o.kind === 'heart' ? heartPts() : textPts(o.t);
  while (P.length < pts.length) P.push(newP());
  for (let i = pts.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[pts[i], pts[j]] = [pts[j], pts[i]]; }
  P.forEach((p, i) => {
    if (i < pts.length) {
      p.bx = pts[i].x; p.by = pts[i].y; p.free = false; p.ta = 1;
      p.r = r * (.8 + Math.random() * .4); p.col = pal[Math.floor(Math.random() * pal.length)];
    } else { p.free = true; p.ta = 0; }
  });
}

function scatter() {
  for (const p of P) {
    const a = Math.random() * 6.283, s = 3 + Math.random() * 10;
    p.free = true; p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s; p.ta = 0;
  }
}

let img = null;
function setPhoto(src) { const i = new Image(); i.onload = () => { img = i; }; i.src = src; }
if (CONFIG.photo) setPhoto(CONFIG.photo);

function drawPhoto(sc) {
  const s = heartW() / 32, f = .84, cx = W / 2, cy = H * .46 + 2.5 * s, k0 = s * f;
  c.save(); c.globalAlpha = msgA;
  c.translate(W / 2, H * .46); c.scale(sc, sc); c.translate(-W / 2, -H * .46);
  c.beginPath();
  for (let i = 0; i <= 120; i++) {
    const t = i / 120 * 6.2832, x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    const px = cx + x * k0, py = cy + y * k0;
    i ? c.lineTo(px, py) : c.moveTo(px, py);
  }
  c.closePath(); c.clip();
  const bw = 32 * k0, bh = 29 * k0, k = Math.max(bw / img.width, bh / img.height);
  const dw = img.width * k, dh = img.height * k;
  c.drawImage(img, cx - dw / 2, cy - 12 * k0 + (bh - dh) / 2, dw, dh);
  c.restore();
}

function drawMsg(sc) {
  if (img) return drawPhoto(sc);
  const w = heartW(), fs = w * .085, cx = W / 2, cy = H * .46 + w * .06;
  c.save(); c.globalAlpha = msgA; c.translate(cx, cy); c.scale(sc, sc);
  c.font = `italic bold ${fs}px Georgia, "Times New Roman", serif`;
  c.textAlign = 'left'; c.textBaseline = 'middle';
  const ws = CONFIG.message.map(m => c.measureText(m).width);
  let x = -ws.reduce((a, b) => a + b, 0) / 2;
  CONFIG.message.forEach((m, i) => { c.fillStyle = i === 1 ? '#ff5a3c' : '#fff'; c.fillText(m, x, 0); x += ws[i]; });
  c.restore();
}

function frame(t) {
  drawRain();
  c.clearRect(0, 0, W, H);
  const cx = W / 2, cy = H * .46, heart = cur && cur.kind === 'heart';
  const sc = heart && !RM ? 1 + .07 * Math.pow(Math.abs(Math.sin(t / 380)), 10) : 1;
  for (const p of P) {
    if (p.free) { p.x += p.vx; p.y += p.vy; p.vx *= .95; p.vy *= .95; p.vy += .02; }
    else {
      const tx = cx + (p.bx - cx) * sc, ty = cy + (p.by - cy) * sc;
      p.vx += (tx - p.x) * .07; p.vy += (ty - p.y) * .07; p.vx *= .8; p.vy *= .8; p.x += p.vx; p.y += p.vy;
    }
    p.a += (p.ta - p.a) * .08;
    if (p.a < .02) continue;
    c.globalAlpha = p.a; c.fillStyle = p.col;
    c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.283); c.fill();
  }
  c.globalAlpha = 1;
  if (heart) { msgA += (1 - msgA) * .04; drawMsg(sc); } else msgA = 0;
  requestAnimationFrame(frame);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));
async function run() {
  const id = ++runId, live = () => id === runId;
  btn.classList.remove('show'); msgA = 0; scatter(); cur = null;
  if (RM) { apply({ kind: 'heart' }); btn.classList.add('show'); return; }
  await sleep(1800);
  for (const t of [...CONFIG.countdown, ...CONFIG.words]) {
    if (!live()) return;
    apply({ kind: 'text', t });
    await sleep(isNaN(t) ? 1500 : 1100);
    if (!live()) return;
    scatter(); cur = null; await sleep(500);
  }
  if (!live()) return;
  apply({ kind: 'heart' });
  await sleep(1500);
  if (live()) btn.classList.add('show');
}

document.getElementById('again').addEventListener('click', run);
if (!CONFIG.showPicker) document.getElementById('pick').remove();
document.getElementById('file').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const r = new FileReader(); r.onload = () => setPhoto(r.result); r.readAsDataURL(f);
});
addEventListener('resize', resize);
resize(); requestAnimationFrame(frame); run();
