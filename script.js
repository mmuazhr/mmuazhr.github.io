// Home page motion. Only active while <html> has .motion (set by site.js);
// without it the page is a plain stacked layout and this script does nothing visible.
(() => {
  "use strict";
  const root = document.documentElement;
  const intro = document.querySelector(".intro");
  const stage = document.querySelector(".intro-stage");
  const reel = document.querySelector(".reel");
  const gate = document.querySelector(".reel-gate");
  const frames = [...document.querySelectorAll(".reel .frame")];
  const strip = document.querySelector(".reel-strip");
  const thumbs = strip ? [...strip.querySelectorAll("a")] : [];
  const nowEl = document.querySelector(".reel-now");
  const fx = document.querySelector(".reel-fx");
  if (!intro || !stage || !reel || !gate || !frames.length || !fx) return;

  const N = frames.length;
  const CELL = 7;            // css px between halftone dots in the frame transition
  const FX_MS = 900;
  const MAX_SMEAR = 9;       // px of horizontal blur on the strip at full speed
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (x, a, b) => clamp((x - a) / (b - a));
  const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const pad = (n) => String(n).padStart(2, "0");
  const motionOn = () => root.classList.contains("motion");

  reel.style.setProperty("--n", N);

  // Directional blur for the strip: an SVG filter whose stdDeviation tracks scroll speed.
  const NS = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(NS, "svg");
  defs.setAttribute("class", "svg-defs");
  defs.setAttribute("aria-hidden", "true");
  const filter = document.createElementNS(NS, "filter");
  filter.setAttribute("id", "smear");
  filter.setAttribute("x", "-10%");
  filter.setAttribute("width", "120%");
  const blur = document.createElementNS(NS, "feGaussianBlur");
  blur.setAttribute("stdDeviation", "0 0");
  filter.appendChild(blur);
  defs.appendChild(filter);
  document.body.appendChild(defs);

  // ---------------------------------------------------------------- halftone samples
  const samples = new Map();
  let box = { w: 0, h: 0, cols: 0, rows: 0 };
  const ctx = fx.getContext("2d");
  // Park the intro band just under the headline block, as tall as the space allows.
  const copy = document.querySelector(".intro-copy");
  const sizeIntro = () => {
    const bt = copy.offsetTop + copy.offsetHeight + 36;
    const room = innerHeight - bt - 28;
    const bh = Math.max(140, Math.min(innerWidth * 0.28, room));
    stage.style.setProperty("--bt", `${Math.round(bt)}px`);
    stage.style.setProperty("--bh", `${Math.round(bh)}px`);
  };

  const sizeFx = () => {
    const r = fx.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    fx.width = Math.round(r.width * dpr);
    fx.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    box = { w: r.width, h: r.height, cols: Math.ceil(r.width / CELL), rows: Math.ceil(r.height / CELL) };
    samples.clear();
  };

  // Downsample a frame's art (same crop as object-fit: cover; object-position: right)
  // into one darkness value and one "is green" flag per dot.
  const sample = (i) => {
    if (samples.has(i)) return samples.get(i);
    const img = frames[i].querySelector(".frame-art img");
    if (!img || !img.complete || !img.naturalWidth || !box.cols) return null;
    const { w, h, cols, rows } = box;
    const off = document.createElement("canvas");
    off.width = cols;
    off.height = rows;
    const o = off.getContext("2d", { willReadFrequently: true });
    o.fillStyle = "#F8F5EE";
    o.fillRect(0, 0, cols, rows);
    const ar = img.naturalWidth / img.naturalHeight;
    let dw, dh, dx, dy;
    if (ar > w / h) { dh = h; dw = h * ar; dx = w - dw; dy = 0; }
    else { dw = w; dh = w / ar; dx = 0; dy = (h - dh) / 2; }
    o.drawImage(img, dx / CELL, dy / CELL, dw / CELL, dh / CELL);
    const px = o.getImageData(0, 0, cols, rows).data;
    const d = new Float32Array(cols * rows);
    const g = new Uint8Array(cols * rows);
    for (let k = 0; k < cols * rows; k++) {
      const R = px[k * 4], G = px[k * 4 + 1], B = px[k * 4 + 2];
      const lum = (0.3 * R + 0.59 * G + 0.11 * B) / 255;
      d[k] = clamp((0.93 - lum) / 0.93);
      g[k] = G > R + 12 && G > B ? 1 : 0;
    }
    const s = { d, g };
    samples.set(i, s);
    return s;
  };

  // Per-dot random offsets, fixed so the scatter looks like one coherent burst.
  let jit = null;
  const jitter = () => {
    const n = box.cols * box.rows;
    if (jit && jit.length === n * 3) return jit;
    jit = new Float32Array(n * 3);
    for (let k = 0; k < jit.length; k++) jit[k] = Math.random() * 2 - 1;
    return jit;
  };

  let fxRun = 0;
  const runFx = (from, to, dir) => {
    const A = sample(from), B = sample(to);
    if (!A || !B) return;
    const id = ++fxRun;
    const J = jitter();
    const { cols, rows } = box;
    gate.classList.add("fx");
    const t0 = performance.now();
    const draw = (now) => {
      if (id !== fxRun) return;
      const t = clamp((now - t0) / FX_MS);
      const sc = Math.sin(Math.PI * t);                  // scatter: 0 -> 1 -> 0
      const m = clamp((t - 0.3) / 0.4);                  // A -> B mix
      const mix = m * m * (3 - 2 * m);
      ctx.clearRect(0, 0, box.w, box.h);
      const ink = new Path2D(), green = new Path2D();
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const k = y * cols + x;
          const dk = A.d[k] + (B.d[k] - A.d[k]) * mix;
          if (dk < 0.06) continue;
          const r = CELL * 0.6 * Math.sqrt(dk) * (1 - 0.3 * sc);
          const cx = x * CELL + CELL / 2 + J[k * 3] * sc * 64;
          const cy = y * CELL + CELL / 2 + J[k * 3 + 1] * sc * 40 - dir * sc * sc * 56 * (0.5 + 0.5 * J[k * 3 + 2]);
          const path = (mix < 0.5 ? A.g[k] : B.g[k]) ? green : ink;
          path.moveTo(cx + r, cy);
          path.arc(cx, cy, r, 0, 6.2832);
        }
      }
      ctx.fillStyle = "#161614";
      ctx.fill(ink);
      ctx.fillStyle = "#1F4D3A";
      ctx.fill(green);
      if (t < 1) requestAnimationFrame(draw);
      else gate.classList.remove("fx");
    };
    requestAnimationFrame(draw);
  };

  // ---------------------------------------------------------------- reel state
  let active = -1;
  const setActive = (i) => {
    const prev = active;
    active = i;
    frames.forEach((f, k) => f.classList.toggle("is-active", k === i));
    thumbs.forEach((t, k) => {
      t.classList.toggle("is-active", k === i);
      if (k === i) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
    if (nowEl) nowEl.textContent = pad(i + 1);
    if (prev >= 0 && prev !== i) runFx(prev, i, i > prev ? 1 : -1);
  };

  // scroll position that shows frame i (middle of its slice of the pinned reel)
  const frameScrollTop = (i) => {
    const top = reel.getBoundingClientRect().top + scrollY;
    return top + ((i + 0.5) / N) * (reel.offsetHeight - innerHeight);
  };

  thumbs.forEach((t, i) => {
    t.addEventListener("click", (e) => {
      if (!motionOn()) return;
      e.preventDefault();
      scrollTo({ top: frameScrollTop(i), behavior: "smooth" });
    });
  });

  // ---------------------------------------------------------------- frame loop
  let lastY = scrollY, smear = 0, queued = false;
  const update = () => {
    queued = false;
    if (!motionOn()) return;
    const vh = innerHeight;

    const ir = intro.getBoundingClientRect();
    const ip = clamp(-ir.top / Math.max(1, ir.height - vh));
    stage.style.setProperty("--a", easeInOut(seg(ip, 0, 0.34)).toFixed(4));
    stage.style.setProperty("--b", easeOut(seg(ip, 0.38, 0.8)).toFixed(4));
    stage.style.setProperty("--c", seg(ip, 0.88, 1).toFixed(4));

    const rr = reel.getBoundingClientRect();
    const q = clamp(-rr.top / Math.max(1, rr.height - vh));
    const idx = Math.min(N - 1, Math.floor(q * N));
    if (idx !== active) setActive(idx);
    if (strip) strip.style.setProperty("--s", clamp(q * N - 0.5, 0, N - 1).toFixed(4));

    // motion smear follows scroll speed and decays when scrolling stops
    const dy = Math.abs(scrollY - lastY);
    lastY = scrollY;
    const inReel = rr.top < vh && rr.bottom > 0;
    smear = inReel ? Math.max(smear * 0.82, Math.min(MAX_SMEAR, dy * 0.12)) : 0;
    if (strip) {
      blur.setAttribute("stdDeviation", `${smear.toFixed(2)} 0`);
      strip.classList.toggle("smear", smear > 0.3);
    }
    if (smear > 0.05) schedule();
  };
  const schedule = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };

  const init = () => {
    if (motionOn()) {
      frames.forEach((f) => {
        const img = f.querySelector(".frame-art img");
        if (img) img.loading = "eager";
      });
      sizeFx();
      sizeIntro();
    }
    schedule();
  };

  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", () => { if (motionOn()) { sizeFx(); sizeIntro(); } schedule(); });
  if (document.fonts) document.fonts.ready.then(() => { if (motionOn()) sizeIntro(); });
  new MutationObserver(init).observe(root, { attributes: true, attributeFilter: ["class"] });
  init();
})();
