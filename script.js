// Progressive enhancement: diagrams and sections reveal on scroll.
// Without JS (or with reduced motion) everything is simply visible.
document.documentElement.classList.add("js");

const diagrams = document.querySelectorAll(".diagram");
const revealables = document.querySelectorAll(
  "h2, .cs, .ledger > li, .timeline > li, .proofs > li, .contact-line, .cta, .contact-note, .contact-links"
);

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

  const pauseObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("offscreen", !entry.isIntersecting);
      }
    },
    { rootMargin: "10% 0px" }
  );
  diagrams.forEach((d) => pauseObserver.observe(d));

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
} else {
  diagrams.forEach((d) => d.classList.add("live"));
}
