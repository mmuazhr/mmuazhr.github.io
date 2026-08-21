// Progressive enhancement: diagrams and sections reveal on scroll.
// Without JS (or with reduced motion) everything is simply visible.
document.documentElement.classList.add("js");

const diagrams = document.querySelectorAll(".diagram");
const revealables = document.querySelectorAll(".metrics, .gutter-mascot");
const exa = document.querySelector(".exa");
const cta = document.querySelector(".cta");


if ("IntersectionObserver" in window) {
  const diagramObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("live");
          diagramObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.35 }
  );
  diagrams.forEach((d) => diagramObserver.observe(d));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealables.forEach((el) => {
    el.classList.add("rv");
    revealObserver.observe(el);
  });

  // The metrics carry the proof, so they must never stay hidden because an
  // observer never fired. Anything still unrevealed after a few seconds is
  // shown regardless.
  setTimeout(() => {
    revealables.forEach((el) => el.classList.add("in"));
  }, 2500);

  // Exa slides into place when contact section approaches
  if (exa) {
    const exaObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            exa.classList.add("in");
            exaObserver.unobserve(exa);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px 40% 0px" }
    );
    exaObserver.observe(exa);
  }

} else {
  diagrams.forEach((d) => d.classList.add("live"));
  if (exa) exa.classList.add("in");
}

// Exa gets excited when the contact CTA is hovered/focused
if (exa && cta) {
  const excite = () => exa.classList.add("excited");
  const calm = () => exa.classList.remove("excited");
  cta.addEventListener("mouseenter", excite);
  cta.addEventListener("mouseleave", calm);
  cta.addEventListener("focus", excite);
  cta.addEventListener("blur", calm);
}

