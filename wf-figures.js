/* Witness Fitness - exercise demonstrator (wf-figures.js)
   Draws an animated mannequin for every exercise id used in index.html.
   Public function: fig(id, name) -> SVG string.
   How it works: every pose is built from real limb lengths with forward / inverse kinematics,
   so feet and hands stay planted on the floor, wall or bench and the limbs never stretch. */
(function () {
"use strict";
const D = Math.PI / 180, GY = 138, AY = 132.5, AF = 136, FT = 13, TH = 31, SH = 31, TR = 34, UA = 22, FA = 21, NK = 14, HY = 70.9;
const sn = a => Math.sin(a * D), cs = a => Math.cos(a * D);
const V = (a, l) => [sn(a) * l, cs(a) * l], AD = (p, v) => [p[0] + v[0], p[1] + v[1]];
const cl = (x, a, b) => Math.max(a === undefined ? 0 : a, Math.min(b === undefined ? 1 : b, x));
const L = (a, b, t) => a + (b - a) * t, sm = x => x * x * (3 - 2 * x), rp = (x, a, b) => sm(cl((x - a) / (b - a)));
const LP = (p, r, t) => [L(p[0], r[0], t), L(p[1], r[1], t)];
const bf = s => sm(cl((1 - Math.abs(2 * s - 1) - .12) / .76));          /* 0 -> 1 -> 0 with short pauses */
const pa = (x, f) => { f = f === undefined ? 65 : f; return [x - FT * sn(f), GY - FT * cs(f)]; }; /* ankle for a toe on the floor at x */
const r1 = n => Math.round(n * 10) / 10;
const NEAR = "var(--ink)", FAR = "var(--mute)", ACC = "var(--acc)";

/* angle convention: 0 = pointing down, 90 = forward (right), 180 = up, -90 = backward (left) */
function ik(p, t, l1, l2, b) {
  let dx = t[0] - p[0], dy = t[1] - p[1], d = Math.hypot(dx, dy);
  const mx = l1 + l2 - .02, mn = Math.abs(l1 - l2) + 1;
  if (d > mx) { dx *= mx / d; dy *= mx / d; d = mx; }
  if (d < mn) { if (d < .01) { dx = 0; dy = mn; } else { dx *= mn / d; dy *= mn / d; } d = mn; }
  const a0 = Math.atan2(dx, dy) / D, A = Math.acos(cl((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)) / D;
  return [AD(p, V(a0 + b * A, l1)), [p[0] + dx, p[1] + dy]];
}
function leg(h, s) {
  let k, a;
  if (s.a) { k = AD(h, V(s.a[0], TH * (s.k || 1))); a = AD(k, V(s.a[1], SH)); }
  else { const r = ik(h, s.t, TH, SH, s.b === undefined ? 1 : s.b); k = r[0]; a = r[1]; }
  return [h, k, a, AD(a, V(s.f === undefined ? 65 : s.f, s.fl || FT))];
}
function arm(sh, s) {
  let e, w;
  if (s.a) { e = AD(sh, V(s.a[0], UA)); w = AD(e, V(s.a[1], FA)); }
  else { const r = ik(sh, s.t, UA, FA, s.b === undefined ? -1 : s.b); e = r[0]; w = r[1]; }
  return [sh, e, w];
}
function body(o) {                      /* side view, figure faces right */
  const hip = o.hip, t = o.t === undefined ? 180 : o.t, sh = AD(hip, V(t, TR)), hd = AD(sh, V(o.hd === undefined ? t : o.hd, NK));
  return { hip, sh, hd, t, arch: o.arch || 0, l: [leg(hip, o.ln), leg(hip, o.lf || o.ln)], a: [arm(sh, o.an), arm(sh, o.af || o.an)], hold: o.hold, belly: o.belly };
}
function bodyF(o) {                     /* front view */
  const hip = o.hip, t = o.t === undefined ? 180 : o.t;
  let sh = AD(hip, V(t, TR)); sh = [sh[0] + (o.sdx || 0), sh[1]];
  const w = o.w === undefined ? 12 : o.w, hd = AD(sh, V(o.hd === undefined ? 180 : o.hd, NK)); hd[0] += o.hdx || 0;
  const hl = [hip[0] - 6, hip[1]], hr = [hip[0] + 6, hip[1]], sl = [sh[0] - w, sh[1]], sr = [sh[0] + w, sh[1]];
  return { front: 1, hip, sh, hd, t, arch: 0, l: [leg(hl, o.ll), leg(hr, o.lr)], a: [arm(sl, o.al), arm(sr, o.ar)], belly: 0 };
}
/* straight body line from the toes up to the shoulder (push-up, plank, burpee) */
function pushGeo(ank, Hs) {
  const ph = Math.asin(cl((Hs - (GY - ank[1])) / 96, -1, 1)) / D;
  return { ph, hip: [ank[0] + 62 * cs(ph), ank[1] - 62 * sn(ph)], t: 90 + ph };
}
const SEATED = o => body(Object.assign({ hip: [96, 101.5], t: 180, ln: { a: [90, 0] }, lf: { a: [90, 0] } }, o));
const H0 = .985 * (UA + FA), AY10 = GY - FT * cs(10), PH0 = Math.asin((H0 - (GY - AY10)) / 96) / D;
const jog = (TM, AM, AB) => s => {
  const lf = x => Math.max(0, sn(360 * x)), a = lf(s), b = lf((s + .5) % 1), sw = sn(360 * s);
  return body({ hip: [108.2, HY], hd: 180, ln: { a: [TM * a, 0] }, lf: { a: [TM * b, 0] }, an: { a: [-AM * sw, -AM * sw + AB] }, af: { a: [AM * sw, AM * sw + AB] } });
};

/* scenery */
const R = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="var(--mute)" opacity=".28"/>`;
const chairS = R(80, 62, 5, 46.5) + R(80, 107.5, 52, 5) + R(82, 112.5, 4, 29) + R(124, 112.5, 4, 29);
const chairQ = R(58, 64, 5, 44) + R(58, 107.5, 44, 5) + R(62, 112.5, 4, 29) + R(92, 112.5, 4, 29);
const chairF = R(88, 56, 44, 46) + R(80, 104, 60, 5) + R(84, 109, 4, 32.5) + R(132, 109, 4, 32.5);
const benchB = R(62, 106, 78, 7) + R(68, 113, 5, 28.5) + R(129, 113, 5, 28.5);
const benchR = R(66, 106, 86, 7) + R(72, 113, 5, 28.5) + R(140, 113, 5, 28.5);
const wallS = x => R(x, 6, 12, 135.5);
const ring = (cx, cy, T) => `<circle cx="${cx}" cy="${cy}" r="12" fill="none" stroke="var(--acc)" stroke-width="2" stroke-dasharray="4 5" stroke-linecap="round"><animateTransform attributeName="transform" type="rotate" from="0 ${cx} ${cy}" to="360 ${cx} ${cy}" dur="${T / 2}s" repeatCount="indefinite"/></circle>`;

/* the exercises: P(s) returns the pose at loop position s (0..1); F = frames, T = seconds per loop */
const EX = {
squat: { F: 36, T: 3.2, P: s => { const u = bf(s), a = L(8, 88, u);
  return body({ hip: [L(108.2, 84, u), L(HY, 100, u)], t: 180 - 42 * u, hd: L(180, 168, u), ln: { t: pa(120) }, lf: { t: pa(114) }, an: { a: [a, a] } }); } },
pushup: { F: 36, T: 3.2, P: s => { const u = bf(s), ank = [65 - FT * sn(10), AY10], g0 = pushGeo(ank, H0), W = [ank[0] + 96 * cs(g0.ph) - 5, GY], g = pushGeo(ank, L(H0, 15, u));
  return body({ hip: g.hip, t: g.t, hd: g.t - 12, ln: { a: [g.ph - 90, g.ph - 90], f: 10 }, lf: { a: [g.ph - 90, g.ph - 90], f: 10 }, an: { t: W, b: -1 } }); } },
plank: { F: 2, T: 3, P: () => { const ex = 165, sy = GY - .5 - UA, Hs = GY - sy, ph = Math.asin((Hs - (GY - AY10)) / 96) / D, g = pushGeo([ex - 96 * cs(ph), AY10], Hs);
  return body({ hip: g.hip, t: g.t, hd: g.t - 8, ln: { a: [g.ph - 90, g.ph - 90], f: 10 }, an: { a: [0, 90] } }); } },
lunge: { F: 56, T: 5, P: s => { const h = s < .5 ? 0 : 1, p = bf((s * 2) % 1), X0 = 108.2, mv = { t: [X0 + 62 * p, AY - 18 * sn(180 * p)], b: 1 },
  f = L(65, 25, rp(p, .55, 1)), bk = { t: pa(120, f), b: 1, f: f }, hip = [L(X0, X0 + 31, p), L(HY, 99.5, p)];
  return body({ hip, t: 176, hd: 180, ln: h ? bk : mv, lf: h ? mv : bk, an: { a: [6, 26] }, af: { a: [2, 20] } }); } },
burpee: { F: 64, T: 6.5, P: s => {
  const q1 = rp(s, 0, .16), q2 = rp(s, .16, .36), q3 = rp(s, .52, .70), q4 = rp(s, .70, .80), fb = q2 - q3, d = q1 * (1 - q4),
    hop = sn(180 * cl((s - .16) / .2)) + sn(180 * cl((s - .52) / .18)), j = sn(180 * cl((s - .80) / .12)),
    up = rp(s, .74, .82) * (1 - rp(s, .92, 1)),
    AP = [136 - 96 * cs(PH0), AY10], gp = pushGeo(AP, H0), ank = LP([110.2, AY], AP, fb),
    hip = LP(LP([110.2, HY], [95, 108], d), gp.hip, fb), t = L(L(180, 110, d), gp.t, fb), hd = L(L(180, 128, d), gp.t - 10, fb);
  ank[1] -= 24 * hop + 14 * j; hip[1] -= 6 * hop + 14 * j;
  const f = L(L(65, 10, fb), 40, j), sh = AD(hip, V(t, TR)), tg = LP(LP([sh[0] + 4, sh[1] + 40], [131, GY], d), [sh[0] + 4, sh[1] - 40], up);
  return body({ hip, t, hd, ln: { t: ank, b: 1, f: f }, an: { t: tg, b: -1 } }); } },
jacks: { F: 32, T: 2.2, P: s => { const u = bf(s), sp = L(1, 28, u), ay = AF - 6 * sn(180 * u), hy = ay - Math.sqrt(61.8 * 61.8 - sp * sp), aa = L(8, 172, u);
  return bodyF({ hip: [110, hy], ll: { t: [104 - sp, ay], b: -1, f: -80, fl: 9 }, lr: { t: [116 + sp, ay], b: 1, f: 80, fl: 9 }, al: { a: [-aa, -aa] }, ar: { a: [aa, aa] } }); } },
knees: { F: 24, T: 1.2, P: jog(95, 40, 85) },
march: { F: 32, T: 2, P: jog(68, 24, 60) },
sprints: { F: 24, T: .8, P: s => {
  const lg = ps => { const c = cs(360 * ps), w = Math.max(0, sn(360 * ps)), th = 15 - 50 * c, sh = th - (15 + 75 * w); return [th, sh, sh + 65]; },
    dr = l => { const a = TH * cs(l[0]) + SH * cs(l[1]); return Math.max(a, a + FT * cs(l[2])); },
    n = lg(s), fr = lg((s + .5) % 1), hy = GY - Math.max(dr(n), dr(fr)), c = cs(360 * s);
  return body({ hip: [105, hy], t: 168, hd: 176, ln: { a: [n[0], n[1]], f: n[2] }, lf: { a: [fr[0], fr[1]], f: fr[2] }, an: { a: [50 * c, 50 * c + 80] }, af: { a: [-50 * c, -50 * c + 80] } }); } },
punch: { F: 40, T: 3, scene: chairS, P: s => { const b = x => Math.max(0, sn(360 * x)), arm2 = p => ({ a: [L(10, 88, p), L(160, 90, p)] });
  return SEATED({ an: arm2(b(s)), af: arm2(b((s + .5) % 1)) }); } },
deadlift: { F: 44, T: 4, P: s => { const u = bf(s);
  return body({ hip: [L(108.2, 83, u), L(HY, 98, u)], t: L(178, 118, u), hd: L(180, 128, u), ln: { t: pa(120) }, lf: { t: pa(113) }, an: { a: [0, 0] }, hold: "plate" }); } },
bench: { F: 40, T: 4, scene: benchB, P: s => { const u = bf(s);
  return body({ hip: [120, 98], t: -90, hd: -95, ln: { t: [146, AY], b: 1 }, lf: { t: [142, AY], b: 1 }, an: { t: LP([88, 56], [94, 86], u), b: -1 }, hold: "bar" }); } },
row: { F: 44, T: 4, scene: benchR, P: s => { const u = bf(s), hip = [100, HY], t = 96, sh = AD(hip, V(t, TR));
  return body({ hip, t, hd: 102, ln: { t: pa(117), b: 1 }, lf: { t: [69, 101.9], b: 1, f: -70 }, an: { t: LP([sh[0] + 1, sh[1] + 42], [121, 85], u), b: -1 }, af: { t: [134, 102.9], b: -1 }, hold: "db" }); } },
press: { F: 40, T: 4, scene: chairS, P: s => { const u = bf(s);
  return SEATED({ an: { a: [10 + 168 * Math.pow(u, 1.6), L(170, 180, u)] }, af: { a: [8, 75] }, hold: "db" }); } },
curl: { F: 36, T: 3.4, P: s => { const u = bf(s);
  return body({ hip: [108.2, HY], hd: 180, ln: { t: pa(120) }, lf: { t: pa(113) }, an: { a: [L(0, 14, u), L(4, 152, u)] }, af: { a: [2, 6] }, hold: "db" }); } },
hams: { F: 40, T: 5, P: s => { const u = bf(s), hip = [70, 133];
  return body({ hip, t: L(176, 102, u), hd: L(176, 96, u), ln: { a: [90, 90], f: 155 }, lf: { t: [hip[0] + 24, AY], b: 1 }, an: { t: LP([98, 128], [139, 124], u), b: 1 } }); } },
quad: { F: 44, T: 6, scene: wallS(170), P: s => { const u = rp(s, 0, .25) - rp(s, .75, 1), th = L(0, -3, u), sk = L(0, -160, u), hip = [130, HY],
    ank = AD(AD(hip, V(th, TH)), V(sk, SH)), sho = AD(hip, V(180, TR));
  return body({ hip, t: 180, hd: 180, ln: { a: [th, sk], f: sk + 65 }, lf: { t: pa(142), b: 1 }, an: { t: LP([sho[0] + 2, sho[1] + 41], ank, rp(u, .3, .95)), b: -1 }, af: { t: [167, sho[1] + 8], b: -1 } }); } },
catcow: { F: 44, T: 6, P: s => { const u = bf(s), hip = [100, 136 - TH];
  return body({ hip, t: 107, hd: L(140, 40, u), arch: L(-10, 15, u), ln: { a: [0, -90], f: -92 }, lf: { a: [0, -90], f: -92 }, an: { a: [0, 0] } }); } },
child: { F: 48, T: 6, P: s => { const u = bf(s), kx = 112, KY = 136, hip = LP([kx, KY - TH], [kx - 30, 128.2], u);
  return body({ hip, t: L(107, 80, u), hd: L(120, 40, u), ln: { t: [kx - 31, KY], b: 1, f: -92 }, an: { t: [L(kx + 32.5, kx + 46, u), GY], b: -1 } }); } },
chairsq: { F: 40, T: 3.6, scene: chairQ, P: s => { const u = bf(s), a = L(6, 86, u);
  return body({ hip: [L(108.2, 84, u), L(HY, 102, u)], t: 180 - 40 * u, hd: L(180, 170, u), ln: { t: pa(120) }, lf: { t: pa(114) }, an: { a: [a, a] } }); } },
wallpush: { F: 36, T: 3, scene: wallS(170), P: s => { const u = bf(s), ps = L(25, 34, u), ank = pa(98.3);
  return body({ hip: [ank[0] + 62 * sn(ps), ank[1] - 62 * cs(ps)], t: 180 - ps, hd: 170, ln: { a: [-ps, -ps] }, an: { t: [168, 58], b: -1 } }); } },
bridge: { F: 40, T: 4, P: s => { const al = L(0, 28, bf(s)), sx = 60, sy = 133.2;
  return body({ hip: [sx + 34 * cs(al), sy - 34 * sn(al)], t: al - 90, hd: -88, ln: { t: [126.5, AY], b: 1 }, lf: { t: [123, AY], b: 1 }, an: { a: [88, 88] } }); } },
stand1: { F: 48, T: 8, scene: wallS(170), P: s => { const u = rp(s, 0, .2) - rp(s, .8, 1), hip = [130, HY], sho = AD(hip, V(180, TR));
  return body({ hip, t: 180, hd: 180, ln: { t: [pa(142)[0] - 3, AY - 12 * u], b: 1 }, lf: { t: pa(142), b: 1 }, an: { a: [2, 2] }, af: { t: [167, sho[1] + 7], b: -1 } }); } },
heeltoe: { F: 48, T: 6, walk: 1, P: s => { const st = 8.5, h = s < .5, pp = (s * 2) % 1,
    sup = st - 2 * st * pp, swx = -st + 2 * st * sm(pp), sy = AY - 10 * sn(180 * pp),
    nx = h ? sup : swx, ny = h ? AY : sy, fx = h ? swx : sup, fy = h ? sy : AY;
  return body({ hip: [110, HY + 1.2], hd: 180, ln: { t: [110 + nx, ny], b: 1 }, lf: { t: [110 + fx, fy], b: 1 }, an: { a: [18, 40] }, af: { a: [10, 30] } }); } },
sideleg: { F: 40, T: 5, scene: wallS(50), P: s => { const ang = L(0, 38, bf(s)), hip = [110, AF - 61.5];
  return bodyF({ hip, ll: { t: [104, AF], b: -1, f: -80, fl: 9 }, lr: { a: [ang, ang], f: 80, fl: 9 }, al: { t: [62, hip[1] - TR + 21.5], b: 1 }, ar: { a: [10, 10] } }); } },
twist: { F: 40, T: 5, scene: chairF, P: s => { const r = 50 * sn(360 * s), w = 12 * cs(r), dx = 5 * sn(r), hip = [110, 95.8], shx = 110 + dx, shy = hip[1] - TR;
  return bodyF({ hip, sdx: dx, w, hdx: 4 * sn(r), ll: { a: [-8, 0], k: .3, f: -80, fl: 9 }, lr: { a: [8, 0], k: .3, f: 80, fl: 9 }, al: { t: [shx + w - 1, shy + 11], b: -1 }, ar: { t: [shx - w + 1, shy + 14], b: 1 } }); } },
breath: { F: 40, T: 10, scene: chairS, P: s => { const u = s < .4 ? sm(s / .4) : sm(1 - (s - .4) / .6), x = L(108, 114, u);
  return SEATED({ belly: L(5, 9.5, u), an: { t: [x, 88], b: -1 }, af: { t: [x - 2, 91], b: -1 } }); } },
smarch: { F: 32, T: 2.4, scene: chairS, P: s => { const a = Math.max(0, sn(360 * s)), b = Math.max(0, sn(360 * ((s + .5) % 1)));
  return SEATED({ ln: { a: [90 + 26 * a, 0] }, lf: { a: [90 + 26 * b, 0] }, an: { a: [8, 75] }, af: { a: [6, 72] } }); } },
arms: { F: 48, T: 4, scene: T => chairF + ring(55, 61.8, T) + ring(165, 61.8, T), P: s => { const aa = 90 + 20 * sn(720 * s);
  return bodyF({ hip: [110, 95.8], ll: { a: [-8, 0], k: .3, f: -80, fl: 9 }, lr: { a: [8, 0], k: .3, f: 80, fl: 9 }, al: { a: [-aa, -aa] }, ar: { a: [aa, aa] } }); } },
legext: { F: 40, T: 4, scene: chairS, P: s => { const u = bf(s);
  return SEATED({ ln: { a: [90, L(0, 88, u)], f: L(65, 150, u) }, an: { t: [104, 105], b: -1 }, af: { t: [100, 105], b: -1 } }); } }
};
["pushup", "plank", "lunge", "burpee", "sprints", "knees", "march", "jacks", "squat", "deadlift", "curl", "row", "bench", "heeltoe", "stand1", "bridge", "catcow", "child", "quad", "hams", "wallpush", "chairsq", "sideleg"].forEach(k => { if (!EX[k].scene && !EX[k].walk) EX[k].scene = ""; });

/* turn one pose into an ordered list of shapes (the order is the same for every frame of an exercise) */
const M = (a, b) => "M" + r1(a[0]) + " " + r1(a[1]) + "L" + r1(b[0]) + " " + r1(b[1]);
function E(f) {
  const o = [], pt = (c, w, d) => o.push({ t: "p", c, w, d }), cc = (r, p, fill, st, sw, op) => o.push({ t: "c", r, p, fill, st, sw, op });
  const lc = i => (f.front || !i) ? NEAR : FAR,
    lg = (l, i) => { const c = lc(i); pt(c, 11, M(l[0], l[1])); pt(c, 8.5, M(l[1], l[2])); pt(c, 6, M(l[2], l[3])); },
    ar = (a, i) => { const c = lc(i); pt(c, 7.5, M(a[0], a[1])); pt(c, 6.2, M(a[1], a[2])); };
  lg(f.l[1], 1); ar(f.a[1], 1);
  if (f.front) pt(ACC, 11, M(f.l[0][0], f.l[1][0]));
  const a = f.hip, b = f.sh, cx = (a[0] + b[0]) / 2 + cs(f.t) * 2 * f.arch, cy = (a[1] + b[1]) / 2 - sn(f.t) * 2 * f.arch;
  pt(ACC, 16, "M" + r1(a[0]) + " " + r1(a[1]) + "Q" + r1(cx) + " " + r1(cy) + " " + r1(b[0]) + " " + r1(b[1]));
  if (f.front) pt(ACC, 10, M(f.a[0][0], f.a[1][0]));
  if (f.belly) { const p = AD(a, V(f.t, 14)); cc(f.belly, [p[0] + 8, p[1]], ACC, "none", 0, .55); }
  cc(8, f.hd, NEAR);
  lg(f.l[0], 0); ar(f.a[0], 0);
  if (f.hold) { const h = f.hold; cc(h === "db" ? 6 : h === "bar" ? 9 : 14, f.a[0][2], h === "db" ? ACC : FAR, NEAR, h === "db" ? 2 : 2.5, h === "db" ? 1 : .85); }
  return o;
}

function fig(id, name) {
  const X = EX[id]; if (!X) return "";
  const RM = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches), F = X.F || 36, T = X.T || 3, n = RM ? 1 : F + 1, fr = [];
  for (let k = 0; k < n; k++) fr.push(E(X.P(RM ? (X.rm === undefined ? .5 : X.rm) : k / F)));
  let g = "";
  for (let i = 0; i < fr[0].length; i++) {
    const e = fr[0][i];
    if (e.t === "p") {
      const v = fr.map(f => f[i].d), an = v.some(x => x !== v[0]) ? '<animate attributeName="d" dur="' + T + 's" repeatCount="indefinite" values="' + v.join(";") + '"/>' : "";
      g += '<path d="' + v[0] + '" fill="none" stroke="' + e.c + '" stroke-width="' + e.w + '" stroke-linecap="round" stroke-linejoin="round">' + an + "</path>";
    } else {
      const ax = k => { const v = fr.map(f => r1(f[i].p[k])); return v.some(x => x !== v[0]) ? '<animate attributeName="' + (k ? "cy" : "cx") + '" dur="' + T + 's" repeatCount="indefinite" values="' + v.join(";") + '"/>' : ""; };
      g += '<circle cx="' + r1(e.p[0]) + '" cy="' + r1(e.p[1]) + '" r="' + e.r + '" fill="' + e.fill + '" stroke="' + (e.st || "none") + '" stroke-width="' + (e.sw || 0) + '" fill-opacity="' + (e.op === undefined ? 1 : e.op) + '">' + ax(0) + ax(1) + "</circle>";
    }
  }
  const sc = typeof X.scene === "function" ? X.scene(T) : (X.scene || "");
  const walk = X.walk ? '<line x1="8" y1="141.5" x2="232" y2="141.5" stroke="var(--acc)" stroke-width="3" stroke-dasharray="3 14"><animate attributeName="stroke-dashoffset" from="0" to="34" dur="' + T + 's" repeatCount="indefinite"/></line>' : "";
  return '<svg viewBox="0 0 240 150" role="img" aria-label="Animated demonstration: ' + String(name || id).replace(/[<>&"]/g, "") + '" style="width:100%;max-width:320px;display:block;margin:10px auto;background:var(--bg);border:1px solid var(--line);border-radius:14px">' +
    sc + '<line x1="8" y1="141.5" x2="232" y2="141.5" stroke="var(--mute)" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/>' + walk + g + "</svg>";
}
window.fig = fig;
window.WF_FIG_IDS = Object.keys(EX);
})();
