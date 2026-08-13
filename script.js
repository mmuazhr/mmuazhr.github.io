// Progressive enhancement: diagrams draw themselves in when scrolled into view.
// Without JS (or with reduced motion) everything is simply visible.
document.documentElement.classList.add("js");

const diagrams = document.querySelectorAll(".diagram");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("live");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.35 }
  );
  diagrams.forEach((d) => observer.observe(d));
} else {
  diagrams.forEach((d) => d.classList.add("live"));
}
