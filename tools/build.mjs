#!/usr/bin/env node
// Generates work/<slug>.html and the reel + "also built" blocks inside index.html
// from tools/cases.mjs. Run: node tools/build.mjs   (then node tools/validate.mjs)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { cases, alsoBuilt } from "./cases.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://mmuazhr.github.io";
const ART_W = 2000, ART_H = 667;          // assets/art/<name>-2000.webp
const CROP_W = 1100, CROP_H = 688;        // assets/art/<name>-crop-1100.webp
const CSP = "default-src 'self'; img-src 'self' data:; style-src 'self'; font-src 'self'; script-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'";
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23F1EDE3'/%3E%3Ctext x='11' y='45' font-family='Helvetica,Arial,sans-serif' font-weight='700' font-size='34' fill='%23161614'%3EM%3C/text%3E%3Ccircle cx='48' cy='42' r='5' fill='%231F4D3A'/%3E%3C/svg%3E";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const pad = (n) => String(n).padStart(2, "0");
const total = pad(cases.length);

const header = (base) => `
  <header class="site-head">
    <div class="wrap head-row">
      <a class="brand" href="${base}index.html">Muaz Husaini</a>
      <nav aria-label="Sections">
        <a href="${base}index.html#work">Work</a>
        <a href="${base}index.html#method">Method</a>
        <a href="${base}index.html#experience">Experience</a>
        <a href="${base}muaz-husaini-cv.pdf">CV</a>
        <a href="${base}index.html#contact">Contact</a>
      </nav>
    </div>
  </header>`;

const footer = `
  <footer class="site-foot">
    <div class="wrap foot-row">
      <p>Muaz Husaini, Kuala Lumpur.</p>
      <p class="mono">Artwork: engraved halftone collages made for this site.</p>
    </div>
  </footer>`;

const picture = (c, base, cls, eager) => `<picture class="${cls}">
          <source media="(max-width: 820px)" srcset="${base}assets/art/${c.art}-crop-${CROP_W}.webp" width="${CROP_W}" height="${CROP_H}">
          <img src="${base}assets/art/${c.art}-${ART_W}.webp" srcset="${base}assets/art/${c.art}-1100.webp 1100w, ${base}assets/art/${c.art}-${ART_W}.webp ${ART_W}w" sizes="(max-width: 1340px) 100vw, 1240px" alt="${esc(c.alt)}" width="${ART_W}" height="${ART_H}"${eager ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async">
        </picture>`;

const stack = (items) => `<ul class="stack" aria-label="Stack">${items.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>`;
const paras = (list) => list.map((p) => `<p>${esc(p)}</p>`).join("\n          ");

const flow = (c) => !c.flow ? "" : `
          <ol class="flow" aria-label="How it works, step by step">
            ${c.flow.map(([name, sub, key]) => `<li${key ? ' class="key"' : ""}><span>${esc(name)}</span>${sub ? `<small>${esc(sub)}</small>` : ""}</li>`).join("\n            ")}
          </ol>`;

// ---------------------------------------------------------------- case pages
const casePage = (c, i) => {
  const next = cases[(i + 1) % cases.length];
  const url = `${SITE}/work/${c.slug}.html`;
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="Content-Security-Policy" content="${CSP}">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(c.title)} · Muaz Husaini</title>
  <meta name="description" content="${esc(c.line)}">
  <meta property="og:title" content="${esc(c.title)}">
  <meta property="og:description" content="${esc(c.line)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="canonical" href="${url}">
  <meta name="theme-color" content="#F1EDE3">
  <link rel="icon" href="${FAVICON}">
  <link rel="preload" href="../fonts/GeneralSans-Variable.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="../styles.css">
  <script src="../site.js"></script>
</head>
<body class="case">
  <a class="skip" href="#main">Skip to content</a>
${header("../")}

  <main id="main">
    <article>
      <header class="case-hero wrap">
        <p class="case-crumbs mono"><a href="../index.html#work">&larr; All work</a><span>Case ${pad(i + 1)} / ${total}</span></p>
        <p class="kicker mono">${esc(c.kicker)}</p>
        <h1>${esc(c.title)}</h1>
        <p class="lede">${esc(c.line)}</p>
        <dl class="facts">
          <div><dt>Role</dt><dd>${esc(c.role)}</dd></div>
          <div><dt>When</dt><dd>${esc(c.when)}</dd></div>
          <div><dt>Status</dt><dd>${esc(c.status)}</dd></div>
        </dl>
      </header>

      <figure class="case-art wrap reveal">
        ${picture(c, "../", "art", true)}
      </figure>

      <div class="case-body wrap">
        <section class="reveal">
          <h2 class="label">The problem</h2>
          <div class="case-text">
          ${paras(c.problem)}
          </div>
        </section>
        <section class="reveal">
          <h2 class="label">What I built</h2>
          <div class="case-text">
          ${paras(c.approach)}${flow(c)}
          </div>
        </section>
        <section class="reveal">
          <h2 class="label">Where it stands</h2>
          <div class="case-text">
          ${paras(c.result)}${c.link ? `
          <p><a class="text-link" href="${esc(c.link.href)}" rel="noopener">${esc(c.link.label)} &#8599;</a></p>` : ""}${c.note ? `
          <p class="note">${esc(c.note)}</p>` : ""}
          ${stack(c.stack)}
          </div>
        </section>
      </div>

      <nav class="case-next wrap" aria-label="Next case study">
        <a href="${next.slug}.html">
          <span class="label">Next case &middot; ${pad(((i + 1) % cases.length) + 1)} / ${total}</span>
          <span class="next-title">${esc(next.title)} &rarr;</span>
        </a>
      </nav>
    </article>
  </main>
${footer}
</body>
</html>
`;
};

mkdirSync(join(root, "work"), { recursive: true });
cases.forEach((c, i) => writeFileSync(join(root, "work", `${c.slug}.html`), casePage(c, i)));

// ---------------------------------------------------------------- index blocks
const reel = `<!-- reel:start (generated by tools/build.mjs) -->
        <ol class="reel-frames">
${cases.map((c, i) => `          <li class="frame" id="case-${c.slug}">
            <a class="frame-link" href="work/${c.slug}.html">
              ${picture(c, "", "frame-art", false)}
              <div class="frame-meta">
                <p class="frame-kicker mono"><span class="frame-no">${pad(i + 1)}</span>${esc(c.kicker)} &middot; ${esc(c.status)}</p>
                <h3>${esc(c.title)}</h3>
                <p class="frame-line">${esc(c.line)}</p>
                ${stack(c.stack.slice(0, 4))}
                <span class="frame-cta mono">Read the case study &rarr;</span>
              </div>
            </a>
          </li>`).join("\n")}
        </ol>
        <nav class="reel-strip" aria-label="Jump to a case">
${cases.map((c, i) => `          <a href="#case-${c.slug}" data-i="${i}"><img src="assets/art/${c.art}-crop-700.webp" alt="" width="700" height="438" loading="lazy" decoding="async"><span class="mono">${pad(i + 1)}</span><span class="visually-hidden">${esc(c.title)}</span></a>`).join("\n")}
        </nav>
        <!-- reel:end -->`;

const also = `<!-- also:start (generated by tools/build.mjs) -->
        <ul class="ledger">
${alsoBuilt.map(([t, d]) => `          <li class="reveal"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`).join("\n")}
        </ul>
        <!-- also:end -->`;

const swap = (html, name, block) => {
  const re = new RegExp(`<!-- ${name}:start[\\s\\S]*?<!-- ${name}:end -->`);
  if (!re.test(html)) throw new Error(`index.html is missing the ${name} markers`);
  return html.replace(re, block);
};
const indexPath = join(root, "index.html");
let index = readFileSync(indexPath, "utf8");
index = swap(index, "reel", reel);
index = swap(index, "also", also);
index = index.replace(/(<span class="reel-total">)\d+(<\/span>)/, `$1${total}$2`);
writeFileSync(indexPath, index);
console.log(`built ${cases.length} case pages and the index reel`);
