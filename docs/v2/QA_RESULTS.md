# V2 Browser QA, Performance and Accessibility

Final checks run against the current worktree served locally at port 4173, using the in-app Chrome browser at four responsive viewports plus Lighthouse 13.4.1. Date: 2026-08-25.

## Viewports

| Viewport | Result |
|---|---|
| 1440×1000 (large desktop) | Hero, trace row, verifier artifact, media-led builds, timeline and contact verified by full-page screenshot. No horizontal overflow. |
| 1280×800 (laptop) | Hero proof and CTAs remain above the fold; featured build keeps its split layout. No overflow (1280/1280). |
| 768×1024 (tablet) | Traces switch to accordion form; verifier cells and build feature stack; full navigation still fits. No overflow (768/768). |
| 390×844 (phone) | Work / Builds / CV header, full-width trace controls, stacked verifier cells, usable videos and stacked merge diagram. No overflow (390/390). |

## Interaction checks

| Check | Result |
|---|---|
| Hero crew | Pointing, focusing and tapping all three production figures moves Naro to the chosen claim. After 520ms the figure keeps a checked mark, Exa stops typing and the live region announces the result. |
| Scenario switch | Nothing runs on scroll. Radio change starts the visitor-chosen path at 900ms/stage; `caught` then `abstain` states were observed on scenario B with Naro travelling to the orange guardrail. |
| Prev / next buttons | Disabled at the ends; stepping verified. |
| Clicking a stage | Jumps to that stage, moves Naro to the node and stops an active scenario run. |
| Keyboard | Metric and stage buttons are focusable; stage ArrowRight/Down, ArrowLeft/Up, End and Home move both focus and Naro. Scenario radios retain native arrow-key input. |
| Section-aware nav | `aria-current="true"` moves across Work / Builds / Experience / Contact while scrolling (visible in screenshots as the underlined link). |
| Proof metrics | Static and correct from first paint. Count-in animation removed after it displayed intermediate false values in visual captures. |
| `<details>` engineering notes | Native open/close, rotating `+`. |
| Exa | Bobs when the band is in view, hops on CTA hover/focus. |
| Reduced motion | Metric checks and visitor-chosen trace scenarios resolve immediately; all character travel, bobbing and CSS transitions are removed. Content remains complete. |
| No JS (`html.js` removed, `.no-js` added) | Metrics remain readable buttons, every scenario paragraph remains visible and trace nodes render as a plain list. Native video controls remain. |
| Links | CV PDF is one page (181,921 bytes), /v1/ and media assets load. QueLess production and all five public GitHub destinations were opened successfully. |
| Console | 0 errors on every load. |
| Job Agent repository | 129 tests collected: 125 passed, 2 skipped, and 2 web-detail tests failed because the local run could not reach the configured Supabase endpoint. The verifier tests used by this page passed. |

## Lighthouse

| | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | 100 | 100 | 100 | 100 | 0.7s | 0 | 0ms |
| Mobile (simulated 4G, 4× CPU) | 94 | 100 | 100 | 100 | 3.0s | 0 | 0ms |

Remaining advisory items are the unminified single-file CSS, no cache headers from the local development server, and the intentionally render-blocking primary stylesheet. None produced layout shift or blocking JavaScript work.

## Payload

HTML 33KB, CSS 32KB, JS 9KB, primary fonts 132KB. The independent hero crew uses two transparent WebP assets totalling 32KB. Added product media remains two posters totalling 60KB, a 520KB QueLess demo and a 256KB Content Studio excerpt. Both videos use `preload="none"`, controls, `playsinline`, poster frames and fixed dimensions. No third-party requests on initial load.

## Accessibility notes

- Landmarks: header, nav (labelled), main, sections with `aria-labelledby`, footer.
- Heading order h1 → h2 → h3 throughout.
- Focus rings: 2px ink on paper, 2px paper on the ink band; segmented control shows the ring on the label.
- Contrast: graphite on paper 7.5:1; paper on ink 15:1; ink on signal orange 4.9:1 (AA for the 13px mono node text at 500 weight).
- Touch targets: hero metrics are 61px tall at 390px; stage nodes and prev/next controls are at least 44px tall on mobile.
- Decorative images `alt=""` + `aria-hidden`; the 404 Naro keeps real alt text.

## Known limitations

- The two Maxis trace inputs are illustrative and labelled by context; they do not expose real SQL, DAX or internal data. Job Agent uses exact public test-fixture content.
- Trace scenarios are curated, redacted examples rather than a live model endpoint; the interface labels them as system behaviour and never accepts free text.
