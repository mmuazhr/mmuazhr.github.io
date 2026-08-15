# mmuazhr.github.io

Personal portfolio for Muaz Husaini, AI engineer in Kuala Lumpur. Hand-written static HTML/CSS/JS. No build step, no dependencies.

## Files

- `index.html` — the whole site (single page)
- `styles.css`, `script.js` — styling and scroll-reveal progressive enhancement (site works fully without JS)
- `cv-source.html` — print source for `muaz-husaini-cv.pdf` (open in Chrome, print to PDF, A4, default scale)
- `fonts/`, `naro.png`, `exa.png` — self-hosted fonts and mascot art

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Smoke test

```sh
node tools/validate.mjs
```

Verifies that the JS parses, every local href/src/font path exists, in-page anchors resolve, and all images have alt attributes.

## Deploy

Served by GitHub Pages from `main`. **A push to `main` is a production deploy** — run the smoke test and preview locally first.
