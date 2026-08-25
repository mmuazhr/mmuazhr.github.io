// Portfolio behaviour, progressively enhanced. The characters respond to
// visitor input; the document remains complete without JavaScript.

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasIO = "IntersectionObserver" in window;

/* ---------- Hero crew ---------- */

const hero = document.querySelector(".hero");
const heroWrap = hero?.querySelector(".wrap");
const crew = hero?.querySelector(".hero-crew");
const crewNaro = crew?.querySelector(".crew-naro");
const crewStatus = crew?.querySelector(".crew-status");
const crewLive = hero?.querySelector(".crew-live");
const metricChecks = Array.from(hero?.querySelectorAll(".metric-check") || []);
let activeMetric = null;
let crewTimer = null;

function placeCrew(metric = activeMetric) {
  if (!crew || !heroWrap || !crewNaro) return;
  const wrapRect = heroWrap.getBoundingClientRect();
  const compact = window.innerWidth <= 860;

  if (!metric) {
    crew.style.setProperty("--naro-x", `${compact ? 24 : wrapRect.width - 330}px`);
    crew.style.setProperty("--naro-y", `${compact ? 20 : 255}px`);
    return;
  }

  const index = metricChecks.indexOf(metric);
  if (compact) {
    crew.style.setProperty("--naro-x", `${24 + Math.max(0, index) * 74}px`);
    crew.style.setProperty("--naro-y", "20px");
    return;
  }

  const target = metric.getBoundingClientRect();
  crew.style.setProperty("--naro-x", `${target.left - wrapRect.left + target.width / 2 - 31}px`);
  crew.style.setProperty("--naro-y", `${target.top - wrapRect.top - 78}px`);
}

function inspectMetric(metric) {
  if (!crew || !metric) return;
  activeMetric = metric;
  clearTimeout(crewTimer);
  placeCrew(metric);
  crew.classList.add("checking");
  metric.classList.add("is-checking");
  const claim = metric.dataset.crewTarget;
  crewStatus.textContent = `Checking ${claim}…`;
  if (crewLive) crewLive.textContent = `Naro is checking ${claim}.`;

  crewTimer = setTimeout(() => {
    crew.classList.remove("checking");
    metric.classList.remove("is-checking");
    metric.classList.add("is-checked");
    crew.classList.add("confirmed");
    crewStatus.textContent = "Checked against production telemetry.";
    if (crewLive) crewLive.textContent = `${claim} checked against production telemetry.`;
    setTimeout(() => crew.classList.remove("confirmed"), 600);
  }, reduceMotion ? 0 : 520);
}

metricChecks.forEach((metric) => {
  metric.addEventListener("pointerenter", () => inspectMetric(metric));
  metric.addEventListener("focus", () => inspectMetric(metric));
  metric.addEventListener("click", () => inspectMetric(metric));
});

if (hero && crew) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1));
    crew.style.setProperty("--look-x", x.toFixed(3));
    crew.style.setProperty("--look-y", y.toFixed(3));
  });
  hero.addEventListener("pointerleave", () => {
    crew.style.setProperty("--look-x", "0");
    crew.style.setProperty("--look-y", "0");
  });
  placeCrew();
  window.addEventListener("resize", () => placeCrew(), { passive: true });
}

/* ---------- Interactive system traces ---------- */

function initTrace(trace) {
  const stages = Array.from(trace.querySelectorAll(".stage"));
  const buttons = stages.map((stage) => stage.querySelector(".stage-btn"));
  const radios = Array.from(trace.querySelectorAll('input[type="radio"]'));
  const prev = trace.querySelector('[data-step="-1"]');
  const next = trace.querySelector('[data-step="1"]');
  const naro = trace.querySelector(".trace-naro");
  const last = stages.length - 1;
  const STEP_MS = 900;
  let scenario = (radios.find((radio) => radio.checked) || radios[0]).value;
  let index = 0;
  let timer = null;

  function positionNaro() {
    if (!naro) return;
    const traceRect = trace.getBoundingClientRect();
    const buttonRect = buttons[index].getBoundingClientRect();
    const compact = window.innerWidth <= 860;
    const x = compact ? traceRect.width - 6 : buttonRect.left - traceRect.left + buttonRect.width / 2;
    const y = compact ? buttonRect.bottom - traceRect.top + 6 : buttonRect.top - traceRect.top - 46;
    trace.style.setProperty("--trace-naro-x", `${x}px`);
    trace.style.setProperty("--trace-naro-y", `${Math.max(0, y)}px`);
  }

  function render() {
    trace.dataset.scenario = scenario;
    stages.forEach((stage, stageIndex) => {
      stage.dataset.state = stage.getAttribute(`data-state-${scenario}`) || "pass";
      stage.classList.toggle("active", stageIndex === index);
      stage.classList.toggle("done", stageIndex < index);
      stage.classList.toggle("todo", stageIndex > index);
      buttons[stageIndex].setAttribute("aria-current", stageIndex === index ? "step" : "false");
    });
    trace.dataset.activeState = stages[index].dataset.state;
    prev.disabled = index === 0;
    next.disabled = index === last;
    requestAnimationFrame(positionNaro);
  }

  function go(nextIndex) {
    index = Math.max(0, Math.min(last, nextIndex));
    render();
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    trace.dataset.running = "false";
  }

  function play() {
    stop();
    go(0);
    if (reduceMotion) { go(last); return; }
    trace.dataset.running = "true";
    timer = setInterval(() => {
      if (index >= last) { stop(); return; }
      go(index + 1);
    }, STEP_MS);
  }

  function userDrove(action) {
    return (event) => { stop(); action(event); };
  }

  buttons.forEach((button, stageIndex) => button.addEventListener("click", userDrove(() => go(stageIndex))));
  prev.addEventListener("click", userDrove(() => go(index - 1)));
  next.addEventListener("click", userDrove(() => go(index + 1)));

  radios.forEach((radio) => radio.addEventListener("change", () => {
    if (!radio.checked) return;
    scenario = radio.value;
    play();
  }));

  trace.querySelector(".stages").addEventListener("keydown", (event) => {
    const current = buttons.indexOf(document.activeElement);
    if (current === -1) return;
    let target = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") target = Math.min(last, current + 1);
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") target = Math.max(0, current - 1);
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = last;
    if (target === null) return;
    event.preventDefault();
    stop();
    go(target);
    buttons[target].focus();
  });

  window.addEventListener("resize", positionNaro, { passive: true });
  render();
}

document.querySelectorAll(".trace").forEach(initTrace);

/* ---------- Section-aware navigation ---------- */

const navLinks = Array.from(document.querySelectorAll('.site-head nav a[href^="#"]'));
const navTargets = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);

if (hasIO && navTargets.length) {
  const setCurrent = (id) => navLinks.forEach((link) => {
    const current = link.getAttribute("href") === `#${id}`;
    if (current) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting);
    if (visible.length) setCurrent(visible[0].target.id);
    else if (window.scrollY < 200) setCurrent("");
  }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
  navTargets.forEach((section) => observer.observe(section));
}

/* ---------- Contact Exa ---------- */

const exa = document.querySelector(".exa");
const contactCta = document.querySelector("#contact .cta");
if (exa) {
  if (hasIO && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { exa.classList.add("in"); observer.disconnect(); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px 40% 0px" });
    observer.observe(exa);
  }
  if (contactCta && !reduceMotion) {
    const excite = () => exa.classList.add("excited");
    const calm = () => exa.classList.remove("excited");
    contactCta.addEventListener("mouseenter", excite);
    contactCta.addEventListener("mouseleave", calm);
    contactCta.addEventListener("focus", excite);
    contactCta.addEventListener("blur", calm);
  }
}
