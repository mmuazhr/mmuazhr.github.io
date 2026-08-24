# V2 Browser QA, Performance and Accessibility

All checks run against the `v2` worktree served locally (`python3 -m http.server 8900`), headless Chromium via gstack browse, plus Lighthouse 12 (`npx lighthouse`) and chrome-devtools for the reduced-motion emulation. Date: 2026-08-25.

## Viewports

| Viewport | Result |
|---|---|
| 1440×900 (large desktop) | Hero, trace row, metrics, merge diagram, ledger, timeline, skills, contact all verified by screenshot. No horizontal overflow (`scrollWidth === innerWidth`). |
| 1280×800 (laptop, Lighthouse desktop preset) | Lighthouse pass, no layout defects reported. |
| 768×1024 (tablet) | Trace switches to the accordion form below 861px; hero keeps the 3-figure strip; sections stack. Verified by screenshot. |
| 390×844 (phone) | Header on one line, hero readable, trace accordion with full-width scenario switch, merge diagram stacked, contact band with Exa. No overflow (390/390). Page height 12,435px. |

## Interaction checks

| Check | Result |
|---|---|
| Trace autoplay when 55% in view | Runs once, 1.5s/stage, ends on the outcome stage. Cancelled by any interaction. |
| Scenario switch | Radio change resets to stage 0 and plays the new scenario; `caught` then `abstain` states observed on NL2SQL scenario B with the guardrail node orange and Naro visible. |
| Prev / next buttons | Disabled at the ends; stepping verified. |
| Clicking a stage | Jumps to that stage, stops autoplay. |
| Keyboard | Stage buttons focusable; ArrowRight ×3 → stage 3, End → 4, Home → 0, focus follows. Scenario radios: ArrowRight switches to B. 56 focusable elements, all reachable in DOM order. |
| Section-aware nav | `aria-current="true"` moves across Work / Builds / Experience / Contact while scrolling (visible in screenshots as the underlined link). |
| Metric count-in | Runs once per figure when 60% in view; final text restored exactly (e.g. `2.4 x`, `4,000+`). |
| `<details>` engineering notes | Native open/close, rotating `+`. |
| Exa | Bobs when the band is in view, hops on CTA hover/focus. |
| Reduced motion (matchMedia emulated) | No autoplay (stage stays 0 after 4s in view), no count-in (`300+` static), Exa `animation: none`, all CSS transitions zeroed by the reduced-motion block. Content complete. |
| No JS (`html.js` removed, `.no-js` added) | All 10 scenario paragraphs visible per trace, prefixed `a)` / `b)`, nodes rendered as a plain list, step buttons hidden. |
| Links | CV PDF 200 (169,818 bytes), /v1/ 200, mascot assets 200, 404.html renders with the V2 header. External: github.com/mmuazhr (+4 repos), linkedin, queless-production.up.railway.app, mailto. |
| Console | 0 errors on every load. |

## Lighthouse

| | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 | 0.5s | 0 | 0ms |
| Mobile (simulated 4G, 4× CPU) | 99 | 100 | 100 | 100 | 2.0s | 0 | 0ms |

Remaining sub-0.9 audits are advisory: unminified CSS (~22KB; minification would save ~6KB), no cache headers (GitHub Pages controls these), render-blocking stylesheet (single 22KB CSS file, intentionally not inlined).

## Payload

HTML 30.6KB, CSS 22.8KB, JS 6.1KB, fonts 132KB (was 225KB), mascots loaded lazily: naro-scout 74KB ×1 (shared across traces), exa-sit 65KB (≥1380px only), exa 63KB. No third-party requests.

## Accessibility notes

- Landmarks: header, nav (labelled), main, sections with `aria-labelledby`, footer.
- Heading order h1 → h2 → h3 throughout.
- Focus rings: 2px ink on paper, 2px paper on the ink band; segmented control shows the ring on the label.
- Contrast: graphite on paper 7.5:1; paper on ink 15:1; ink on signal orange 4.9:1 (AA for the 13px mono node text at 500 weight).
- Touch targets: stage nodes ≥44px tall on mobile, prev/next 36px with 6px gap (slightly under the 44px ideal, but they duplicate the tappable nodes).
- Decorative images `alt=""` + `aria-hidden`; the 404 Naro keeps real alt text.

## Known limitations

- The trace's scenario inputs are illustrative and labelled as such; they do not show real SQL, real DAX or real facts.
- Under reduced motion, switching scenario leaves the reader at stage 0 to step manually (by design: no autoplay).
- Prev/next buttons are 36px; acceptable given the redundant node buttons, but could grow to 40px if the bar is ever reworked.
