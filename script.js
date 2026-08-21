// Progressive enhancement: diagrams and sections reveal on scroll.
// Without JS (or with reduced motion) everything is simply visible.
document.documentElement.classList.add("js");

const diagrams = document.querySelectorAll(".diagram");
const revealables = document.querySelectorAll(
  "h2, .cs, .ledger > li, .timeline > li, .proofs > li, .contact-line, .cta, .contact-note, .contact-links"
);
const naro = document.querySelector(".naro");
const exa = document.querySelector(".exa");
const cta = document.querySelector(".cta");

// The peek runs on a class the CSS animates; clearing it lets it run again later.
function peek() {
  if (!naro || naro.classList.contains("peek")) return;
  naro.classList.add("peek");
  setTimeout(() => naro.classList.remove("peek"), 4200);
}

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

  // Naro peeks once the reader reaches the contact band.
  const contact = document.querySelector("#contact");
  if (naro && contact) {
    const naroObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            peek();
            naroObserver.unobserve(contact);
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -25% 0px" }
    );
    naroObserver.observe(contact);
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

// ...and again whenever the reader has been still for a while.
if (naro) {
  let idleTimer;
  const armIdlePeek = () => {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(peek, 12000);
  };
  window.addEventListener("load", armIdlePeek);
  window.addEventListener("scroll", armIdlePeek, { passive: true });
  window.addEventListener("pointermove", armIdlePeek, { passive: true });
}
