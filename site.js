// Shared by every page. Loaded in <head> without defer so the html classes are
// set before first paint: .js, .motion (wide screen, motion allowed) and
// .pt-cover (arriving from a page transition, so the ink cover shows at once).
(() => {
  "use strict";
  const root = document.documentElement;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 900px) and (min-height: 560px)");
  const PT_KEY = "pt-arrive";
  const LEAVE_MS = 620;
  const ARRIVE_MS = 760;
  const NAV_FALLBACK_MS = 1400;  // navigate even if the animation stalls

  root.classList.add("js");
  const setMotion = () => root.classList.toggle("motion", wide.matches && !reduce.matches);
  setMotion();
  wide.addEventListener("change", setMotion);
  reduce.addEventListener("change", setMotion);

  let arriving = false;
  try {
    arriving = sessionStorage.getItem(PT_KEY) === "1";
    sessionStorage.removeItem(PT_KEY);
  } catch (e) { /* storage blocked: no arrival animation */ }
  if (arriving && !reduce.matches) root.classList.add("pt-cover");

  // ---------------------------------------------------------------- dither transition
  // A full-screen WebGL pass: an 8x8 Bayer matrix thresholded against value noise
  // plus a bottom-up sweep, so ink "prints" in as halftone dots and dissolves out.
  const VERT = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";
  const FRAG = `precision mediump float;
uniform vec2 r;uniform float p;uniform float s;
float b2(vec2 a){a=floor(a);return fract(dot(a,vec2(.5,a.y*.75)));}
float b4(vec2 a){return b2(.5*a)*.25+b2(a);}
float b8(vec2 a){return b4(.5*a)*.25+b2(a);}
float h(vec2 q){return fract(sin(dot(q,vec2(127.1,311.7))+s)*43758.5453);}
float n(vec2 q){vec2 i=floor(q),f=fract(q);f=f*f*(3.-2.*f);
return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
void main(){
vec2 uv=gl_FragCoord.xy/r;
float field=(1.-uv.y)*.4+n(uv*vec2(r.x/r.y,1.)*3.)*.45+n(uv*18.)*.15;
float c=clamp(p*1.7-field*.7,0.,1.);
if(b8(gl_FragCoord.xy)>=c)discard;
gl_FragColor=vec4(.086,.086,.078,1.);}`;

  let gl = null, canvas = null, uP = null, uR = null;
  const makeGL = () => {
    if (gl) return gl;
    canvas = document.createElement("canvas");
    canvas.className = "pt-canvas";
    canvas.setAttribute("aria-hidden", "true");
    const ctx = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!ctx) return null;
    const sh = (type, src) => {
      const o = ctx.createShader(type);
      ctx.shaderSource(o, src);
      ctx.compileShader(o);
      return ctx.getShaderParameter(o, ctx.COMPILE_STATUS) ? o : null;
    };
    const vs = sh(ctx.VERTEX_SHADER, VERT), fs = sh(ctx.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return null;
    const prog = ctx.createProgram();
    ctx.attachShader(prog, vs);
    ctx.attachShader(prog, fs);
    ctx.linkProgram(prog);
    if (!ctx.getProgramParameter(prog, ctx.LINK_STATUS)) return null;
    ctx.useProgram(prog);
    const buf = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buf);
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), ctx.STATIC_DRAW);
    const loc = ctx.getAttribLocation(prog, "a");
    ctx.enableVertexAttribArray(loc);
    ctx.vertexAttribPointer(loc, 2, ctx.FLOAT, false, 0, 0);
    uP = ctx.getUniformLocation(prog, "p");
    uR = ctx.getUniformLocation(prog, "r");
    ctx.uniform1f(ctx.getUniformLocation(prog, "s"), Math.random() * 100);
    gl = ctx;
    return gl;
  };
  const DOT = 3; // css px per dither cell: chunky, like a print halftone
  const sizeGL = () => {
    canvas.width = Math.ceil(innerWidth / DOT);
    canvas.height = Math.ceil(innerHeight / DOT);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(uR, canvas.width, canvas.height);
  };
  const drawGL = (p) => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uP, p);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  // Plain fade for browsers without WebGL.
  let veil = null;
  const makeVeil = () => {
    if (!veil) {
      veil = document.createElement("div");
      veil.className = "pt-veil";
      veil.setAttribute("aria-hidden", "true");
    }
    return veil;
  };

  const animate = (from, to, ms, step, done) => {
    const t0 = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / ms);
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      step(from + (to - from) * e);
      if (t < 1) requestAnimationFrame(tick);
      else if (done) done();
    };
    requestAnimationFrame(tick);
  };

  const cleanup = () => {
    root.classList.remove("pt-cover");
    if (canvas && canvas.isConnected) canvas.remove();
    if (veil && veil.isConnected) veil.remove();
    leaving = false;
  };

  const arrive = () => {
    if (!root.classList.contains("pt-cover")) return;
    if (makeGL()) {
      document.body.appendChild(canvas);
      sizeGL();
      drawGL(1);
      root.classList.remove("pt-cover");
      animate(1, 0, ARRIVE_MS, drawGL, cleanup);
    } else {
      const v = makeVeil();
      document.body.appendChild(v);
      v.classList.add("on");
      root.classList.remove("pt-cover");
      requestAnimationFrame(() => requestAnimationFrame(() => v.classList.remove("on")));
      setTimeout(cleanup, 600);
    }
  };

  let leaving = false;
  const leave = (url) => {
    if (leaving) return;
    leaving = true;
    try { sessionStorage.setItem(PT_KEY, "1"); } catch (e) { /* fine */ }
    const go = () => { location.href = url; };
    const fallback = setTimeout(go, NAV_FALLBACK_MS);
    const finish = () => { clearTimeout(fallback); go(); };
    if (makeGL()) {
      document.body.appendChild(canvas);
      sizeGL();
      animate(0, 1, LEAVE_MS, drawGL, finish);
    } else {
      const v = makeVeil();
      document.body.appendChild(v);
      requestAnimationFrame(() => v.classList.add("on"));
      setTimeout(finish, 380);
    }
  };

  // Only same-site page changes get the transition: not new tabs, downloads,
  // mail links, files, or jumps within the current page.
  const isPageLink = (a, e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return false;
    if (a.target && a.target !== "_self") return false;
    if (a.hasAttribute("download")) return false;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    if (!/(\.html|\/)$/.test(url.pathname)) return false;
    return url.pathname !== location.pathname;
  };

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest("a[href]");
    if (!a || reduce.matches || !isPageLink(a, e)) return;
    e.preventDefault();
    leave(a.href);
  });

  // Back/forward from the cache must never land on an inked-out screen.
  addEventListener("pageshow", (e) => { if (e.persisted) cleanup(); });

  // ---------------------------------------------------------------- reveals
  const reveal = () => {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduce.matches) {
      items.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("in");
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  };

  document.addEventListener("DOMContentLoaded", () => {
    reveal();
    arrive();
  });
})();
