# mmuazhr.github.io

Personal portfolio for Muaz Husaini, AI engineering for agents and LLM systems, Kuala Lumpur. Static HTML/CSS/JS with no dependencies; one small Node script generates the case-study pages.

## Files

- `index.html` — home: opening, the case-study reel, also built, method, experience, contact
- `work/*.html` — one page per case study (**generated, do not hand-edit**)
- `tools/cases.mjs` — the copy for every case study and the "also built" list
- `tools/build.mjs` — writes `work/*.html` and the reel and "also built" blocks inside `index.html` (between the `reel:` / `also:` markers)
- `styles.css` — all styling. The page works as a plain stacked layout; `html.motion` switches on the pinned opening and reel
- `site.js` — shared: sets `.js` / `.motion`, scroll reveals, and the halftone page transition (WebGL, with a fade fallback)
- `script.js` — home only: opening zoom, proof cards, reel frames and the halftone particle transition
- `assets/art/` — web copies of the artwork (WebP). Raw sources stay out of git in `assets/source/`
- `og-src.html` + `og-src.css` — source for `og-image.png` (render command inside the file)
- `cv-source.html` — print source for `muaz-husaini-cv.pdf` (open in Chrome, print to PDF, A4, default scale)

Motion is off for reduced-motion users and on narrow screens; everything is real HTML text and links either way.

## Edit a case study

```sh
# change tools/cases.mjs, then
node tools/build.mjs
node tools/validate.mjs
```

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Smoke test

```sh
node tools/validate.mjs
```

Checks that the JS parses, every local href/src/srcset/url() path exists (resolved from each page's own folder), in-page anchors resolve, all images have alt text, and no referenced file is git-ignored (it would 404 on Pages).

## Deploy

Served by GitHub Pages from `main`. **A push to `main` is a production deploy** — run the build, the smoke test and a local preview first.

## Archived directions

- `v2` branch and tag `archive/interactive-crew-2026-08-25` — the interactive Exa/Naro verification-crew version.
- `archive/wip-2026-08-31` — the unfinished character-hero WIP.
