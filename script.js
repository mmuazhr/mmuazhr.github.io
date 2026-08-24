// Portfolio V2 behaviour. Three small pieces, all progressive enhancement:
//   1. Trace: the stepper inside each case study.
//   2. Count-in for proof figures.
//   3. Section-aware navigation.
// With JS off the page is complete and static; the <html> class "js" is
// added inline in <head> so styles can opt in.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasIO = "IntersectionObserver" in window;

/* ---------- 1. Trace ---------- */

function initTrace(trace) {
  const stages = Array.from(trace.querySelectorAll(".stage"));
  const buttons = stages.map((s) => s.querySelector(".stage-btn"));
  const radios = Array.from(trace.querySelectorAll('input[type="radio"]'));
  const prev = trace.querySelector('[data-step="-1"]');
  const next = trace.querySelector('[data-step="1"]');
  const last = stages.length - 1;
  const STEP_MS = 1500;

  let scenario = (radios.find((r) => r.checked) || radios[0]).value;
  let index = 0;
  let timer = null;
  let touched = false;

  function render() {
    trace.dataset.scenario = scenario;
    stages.forEach((stage, k) => {
      stage.dataset.state = stage.getAttribute("data-state-" + scenario) || "pass";
      stage.classList.toggle("active", k === index);
      stage.classList.toggle("done", k < index);
      stage.classList.toggle("todo", k > index);
      buttons[k].setAttribute("aria-current", k === index ? "step" : "false");
    });
    trace.dataset.activeState = stages[index].dataset.state;
    prev.disabled = index === 0;
    next.disabled = index === last;
  }

  function go(n) {
    index = Math.max(0, Math.min(last, n));
    render();
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  // Walks the request through the system once, then hands control over.
  function play() {
    stop();
    if (reduceMotion) return;
    timer = setInterval(() => {
      if (index >= last) { stop(); return; }
      go(index + 1);
    }, STEP_MS);
  }

  function userDrove(fn) {
    return (event) => { touched = true; stop(); fn(event); };
  }

  buttons.forEach((btn, k) => btn.addEventListener("click", userDrove(() => go(k))));
  prev.addEventListener("click", userDrove(() => go(index - 1)));
  next.addEventListener("click", userDrove(() => go(index + 1)));

  radios.forEach((r) => r.addEventListener("change", () => {
    if (!r.checked) return;
    touched = true;
    scenario = r.value;
    go(0);
    play(); // switching scenario is a request to see it run
  }));

  // Arrow keys move between stages when focus is on a stage button.
  trace.querySelector(".stages").addEventListener("keydown", (e) => {
    const k = buttons.indexOf(document.activeElement);
    if (k === -1) return;
    let target = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") target = Math.min(last, k + 1);
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") target = Math.max(0, k - 1);
    if (e.key === "Home") target = 0;
    if (e.key === "End") target = last;
    if (target === null) return;
    e.preventDefault();
    touched = true; stop();
    go(target);
    buttons[target].focus();
  });

  // First time the trace scrolls into view it runs once on its own, so a
  // reader who never clicks still sees the request travel. Any interaction
  // beforehand cancels that.
  if (hasIO && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          io.disconnect();
          if (!touched) setTimeout(() => { if (!touched) play(); }, 500);
        }
      });
    }, { threshold: 0.55 });
    io.observe(trace);
  }

  render();
}

document.querySelectorAll(".trace").forEach(initTrace);

/* ---------- 2. Count-in ---------- */

function countIn(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const suffix = el.dataset.suffix || "";
  const final = el.textContent;
  const duration = 900;
  const start = performance.now();
  const fmt = (v) => v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  function frame(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = fmt(target * eased) + suffix;
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = final;
  }
  requestAnimationFrame(frame);
}

if (hasIO && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        countIn(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
}

/* ---------- 3. Section-aware nav ---------- */

const navLinks = Array.from(document.querySelectorAll('.site-head nav a[href^="#"]'));
const navTargets = navLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

if (hasIO && navTargets.length) {
  const setCurrent = (id) => {
    navLinks.forEach((a) => {
      const on = a.getAttribute("href") === "#" + id;
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  };
  const io = new IntersectionObserver((entries) => {
    // The section occupying the middle band of the viewport wins.
    const visible = entries.filter((e) => e.isIntersecting);
    if (visible.length) setCurrent(visible[0].target.id);
    else if (window.scrollY < 200) setCurrent("");
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  navTargets.forEach((s) => io.observe(s));
}

/* ---------- Exa ---------- */

const exa = document.querySelector(".exa");
const cta = document.querySelector("#contact .cta");
if (exa) {
  if (hasIO && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { exa.classList.add("in"); io.disconnect(); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px 40% 0px" });
    io.observe(exa);
  }
  if (cta && !reduceMotion) {
    const excite = () => exa.classList.add("excited");
    const calm = () => exa.classList.remove("excited");
    cta.addEventListener("mouseenter", excite);
    cta.addEventListener("mouseleave", calm);
    cta.addEventListener("focus", excite);
    cta.addEventListener("blur", calm);
  }
}
