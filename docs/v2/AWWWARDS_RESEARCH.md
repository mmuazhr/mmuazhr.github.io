# Awwwards and reference research

Compiled 2026-08-25 by a research subagent from the Awwwards Interaction Design and Portfolio listings plus ~28 directly fetched sites (HTML/copy extraction, no JS execution; "inferred" is marked where an interaction could not be observed). Full method note, matrix and candidate list follow.

## How this fed V2

- **Adopted:** request-trace timeline with failure flags (candidate 1, Comeau's RSC timelines) became the site's signature primitive; metrics-as-evidence (candidate 4, SSTR provenance) shaped the proof strip and figure captions; Vercel's written motion policy (row 17) is the motion rule in `DESIGN_DIRECTION.md`; Linear's numbered chapters (row 15) became the `01–05` case-study numbering; Comeau's state-keyed mascot (row 9) became Naro appearing on `caught`/`abstain`; Brittany Chiang's scroll-spy nav (row 12) without the spotlight.
- **Rejected:** full-page WebGL, spotlight cursor, preloaders, sound toggles, chat widgets, logo walls, naive-vs-hardened as a fabricated comparison (see `DESIGN_DIRECTION.md`, direction C).
- **Deferred, worth doing later:** machine-readable mirrors (`llms.txt`, `.md` per page), copy-to-clipboard on the email link, a grounding-threshold calculator once there is a real eval curve to publish.

---

## Method note

**What I did.** Fetched the Awwwards Interaction Design listing (pages 1–2) and the Portfolio listing (both server-rendered, readable), then fetched ~28 real sites directly via HTML-to-markdown extraction (no browser, no JS execution). Where a site's interaction lives only in JS/CSS I could not see it; I say "inferred" and back it with the site's own copy, class names, CSS properties, or a published README where possible.

**Could access (HTML/copy visible):** bruno-simon.com, rauno.me (+/craft, /craft/blur-reveal, /craft/history-of-software-design), devouringdetails.com, animations.dev, linear.app (+/method), vercel.com (+/design, /geist), docs.stripe.com, stripe.com, raycast.com, resend.com (metadata only), cursor.com, anthropic.com, joshwcomeau.com (+Flexbox guide, Server Components article), paco.me, emilkowal.ski (+"Friction as a Feature"), henry.codes, brittanychiang.com (+v4 README), leerob.com, lusion.co, gustavobatista.dev, vanlent.dev, bleibtgleich.dev, oimachi.co, mosbyfiles.com, ajbury.com, surinder.design, mathis-biabiany.fr, gilhuybrecht.com, bramvanvugt.com, cipher.tv, sstr.tech.

**Could NOT access:** igloo.inc (JS-rendered), ronik.io and michaelgatt.com (HTTP 403), bouayaben.com (JS shell), rauno.me/craft/x-ray (HTTP 500), web.archive.org (blocked, so no view of the pre-2025 cassie.codes). Awwwards' 2025/2026 interaction-design SOTD names (Artem Shcherban, SŌM, iyO, The Lookback, Unseen Studio Wrapped, Shed; Bruno's Portfolio, Artiom Yakushev, Elliott Mangham, Olha Lazarieva) came from search snippets only; those sites were not fetched.

**Caveat on the Awwwards listing itself:** it is dominated by Webflow/GSAP studio sites and creative-technologist WebGL showcases. Almost none are engineering portfolios. The references closest to Muaz's positioning are the technical-storytelling product sites (Linear, Vercel, Stripe docs, Raycast) and the design-engineer personal sites (Rauno, Emil, Paco, Josh Comeau), none of which are on the Awwwards listing.

## Inspiration Matrix

| # | Reference | Interaction | Why it works | Appropriate for Muaz? | How we could reinterpret it |
|---|---|---|---|---|---|
| 1 | Bruno Simon — bruno-simon.com | Whole portfolio is a drivable 3D world; in-page controls legend, touch and gamepad mappings, "I'm stuck!" respawn, "Leave a whisper". Observed in copy. | One committed metaphor; the controls legend doubles as onboarding; the fun is the proof because his skill is WebGL. | **No.** Proves 3D craft, not agent-reliability craft; huge build; contradicts paper/ink restraint. | Keep only the controls legend as onboarding: a tiny "how to read this" key beside any interactive diagram. |
| 2 | Bruno Simon | Honest degraded state shown inline: "Server currently offline. Scores can't be saved." Observed. | Degradation is visible and specific, never hidden. | **Yes.** Fits a verification-first engineer. | Every demo displays its own state truthfully ("illustrative input", "recorded fixture"). |
| 3 | Rauno Freiberg — rauno.me | Home = one-paragraph bio + mantra; email link swaps to "Copied" on click. Observed. | Extreme restraint; the single micro-interaction is functional. | **Yes.** Matches editorial tone. | Copy-to-clipboard on email with inline state swap; no toasts. |
| 4 | Rauno — rauno.me/craft | Dated index of isolated experiments, each its own page, chained prev/next. Observed. | Interactions quarantined into a lab; the main site stays calm. | **Partial.** Structure yes; his experiments are UI ornament, Muaz's should be engineering artefacts. | A `/lab` section: one small interactive artefact per entry, prev/next chained. |
| 5 | Devouring Details — devouringdetails.com | Chapters are live React prototypes; principles named (Inferring intent, Contained gestures, Motion choreography). Observed. | Teaching by letting the reader touch the thing. | **Partial.** Prototype-in-prose fits case studies; the dark glossy look does not. | Case studies embed one scoped live prototype per key idea instead of screenshots. |
| 6 | Emil Kowalski — animations.dev | A/B "right feels better" animation pairs, click-to-fire demos. Observed. | Side-by-side comparison makes taste legible without explanation. | **Yes** (the comparison pattern). | "Naive vs hardened": same prompt through an unguarded agent and through the pipeline. |
| 7 | Emil — "Friction as a Feature" | Essay: deliberate friction filters low-value action. Observed. | Frames restraint as intent. | **Yes** (as principle). | One deliberate friction: hold-to-run or confirm before an expensive demo. |
| 8 | Paco Coursey — paco.me | Flat sections; projects as "title: one-line description". Observed. | The list is the portfolio; zero chrome. | **Yes.** | Projects as terse "name — what it guarantees" lines; no cards. |
| 9 | Josh W. Comeau — joshwcomeau.com | Footer controls for dark mode / sounds; mascot ships as happy-dark / happy-light variants. Observed. | Personality via a character that responds to site state. | **Yes**, he already has Naro and Exa. | Naro/Exa as a small sprite set keyed to state (idle, running, blocked, 404). |
| 10 | Josh Comeau — Interactive Guide to Flexbox | In-article widgets: draggable container width, display toggles, live playgrounds; widget precedes theory. Observed. | Manipulate first, explain second; each control changes exactly one variable. | **Yes.** Best-fit pattern in the whole set. | Explainers where one control = one system parameter and the output visibly changes. |
| 11 | Josh Comeau — Server Components article | Horizontal timeline diagrams of request/response with flags for perf metrics, then a "why not do this?" reveal of the improved flow. Observed. | Architecture explained as time, with a before/after reveal. | **Yes.** | Request-trace of one NL2SQL call with flags where failures get caught. |
| 12 | Brittany Chiang — brittanychiang.com | Sticky left column with scroll-spy; cursor spotlight; project rows lift on hover; skip link. Sticky/anchors/skip observed; spotlight and scroll-spy inferred. | Orientation always visible; one ambient effect only. | **Partial.** Sticky nav + scroll-spy yes; the spotlight is now the most-cloned effect on the web. | Sticky nav with current-section highlight; no glow. |
| 13 | Lee Robinson — leerob.com | Pure text: Bio, Notes, Blogs. No effects. Observed. | Credibility through writing; nothing to break. | **Yes** as baseline. | Keep writing plain; spend the interaction budget on demos. |
| 14 | Henry Desroches — henry.codes | Digital-garden IA; editor's notes; live location/weather line. Observed. | Small true data points give life without animation. | **Partial.** "Now" page and maturity labels fit; confessional tone doesn't. | Confidence/maturity labels on notes; optional "Now" line. |
| 15 | Linear — linear.app | Sections numbered 1.0 / 2.0 / 3.0; counts shown collapsed before expansion; product UI rendered as real components. Observed; scroll animation inferred. | Numbered chapters + real UI as illustration. | **Yes.** | Number the pipeline stages; use real (redacted) artefacts as the "screenshots". |
| 16 | Linear — /method | Multi-page essay, numbered chapters, page per chapter. Observed. | Book-like pacing; authority through structure. | **Partial.** | "How I build agents" as a short numbered method. |
| 17 | Vercel — vercel.com/design | Written rules: "The first viewport is the argument, not a masthead"; never add marquees, simulated typing, pulsing status dots; motion only to explain state change or confirm action; no parallax/bounce/reveal-on-scroll; calculators as evidence. Observed. | An explicit anti-slop constitution from a company whose brand is engineering. | **Yes, strongly.** | Adopt as the motion policy; build one "calculator" as evidence when data allows. |
| 18 | Vercel — vercel.com | Dark/light-paired imagery; case → feature callouts. Observed. | Paired theme assets. | **Partial.** | Author diagrams in currentColor so they survive theme changes. |
| 19 | Stripe Docs — docs.stripe.com | "Read this page in your terminal"; every page available as `.md`; task-first entry cards. Observed. | Content offered in the reader's native medium; task-first IA. | **Yes.** | Ship `/cv.md`, `/projects.md`, `llms.txt`. |
| 20 | Stripe — stripe.com | Hero gradient canvas with static fallback; bento grid; big stats. Observed. | Canvas has a static fallback; stats anchor sections. | **No** for the gradient; **Yes** for fallback discipline. | Any canvas gets a static fallback and honours reduced motion. |
| 21 | Raycast — raycast.com | Hero is a literal keyboard diagram with per-key callouts; shortcut notation repeated. Observed. | The input device is the illustration. | **Partial.** | Keyboard nav with visible key hints. |
| 22 | Cursor — cursor.com | Real interface mockups with concrete task names. Observed. | Specific task names beat "AI-powered" copy. | **Partial.** | Show real prompts and real (redacted) traces instead of abstract diagrams. |
| 23 | Anthropic — anthropic.com | Restrained editorial layout; large whitespace; no effects observed. | Seriousness by omission. | **Yes**, closest tonal match to paper/ink. | Interactivity only inside artefacts, never on the chrome. |
| 24 | Lusion — lusion.co | "scroll to explore" prompts; reel with timecode; discipline tags. Observed; WebGL inferred. | Scroll prompts manage expectations in a heavy experience. | **No** for the heavy scene; **Partial** for tags. | Tag projects by guarantee (grounded, adversarially tested, verified), not by tech. |
| 25 | SSTR — sstr.tech (SOTD Aug 2026) | Themed loader; before/after stats with provenance tags. Observed. | Engineering numbers as proof, each with provenance. | **Partial.** Loader is a gimmick; stat + provenance is excellent. | Every metric carries provenance; click opens the evidence. |
| 26 | AJ Bury — ajbury.com | "Click and hold to visualise"; "Proof, not promises" accordion; on-page chat robot; tech-logo row. Observed. | Press-and-hold as a deliberate gesture. | **Partial.** Chat widgets are slop unless they are the artefact. | Hold-to-reveal for "what the guardrail blocked". |
| 27 | Surinder — surinder.design | Case carousel; hover shows outcome metric; sparkle "Ask" button. Observed. | Outcome-on-hover is compact. | **Partial.** Sparkle-AI button = avoid. | Hover reveals the guarantee + number, not a screenshot. |
| 28 | Van Lent — vanlent.dev | `clip-path: inset(...)` reveal masks; GSAP. Observed in CSS. | Clip-path reveals are cheap and crisp. | **Partial.** | CSS-only clip-path wipe to reveal the hardened half of a comparison. |
| 29 | gustavobatista.dev / bleibtgleich.dev / cipher.tv | Giant name repeated in hero; "Click to enable sound"; icon-only nav; "0%" preloader. Observed. | — | **No.** Award-bait vocabulary. | Counter-examples for the avoid list. |
| 30 | Oimachi — oimachi.co / Mosby's Files — mosbyfiles.com (SOTD Aug 2026) | Experiments gallery; categorical case index. Observed. | A labelled experiments gallery reads as curiosity, not sales. | **Partial.** | "Experiments" gallery of small tools with a one-line status each. |

## Patterns worth stealing

1. **Manipulate-then-explain widgets (Comeau).** One control changes one variable; the reader sees the output change before reading the theory.
2. **Time-based architecture diagrams with failure flags (Comeau).** Draw the request as a timeline; flag where a check catches something; then reveal the hardened version.
3. **Metrics with provenance and click-through evidence (SSTR, Linear).** No naked numbers.
4. **Side-by-side A/B comparison (animations.dev)** repurposed as naive vs hardened, from recorded fixtures only.
5. **Machine-readable mirrors (Stripe, Vercel).** `llms.txt` and `.md` per page.
6. **Vercel's written motion policy.** Motion only to explain state change or confirm action.
7. **Quarantined lab with prev/next chaining (Rauno).**
8. **State-reactive mascots (Comeau).** A sprite set keyed to page state, never animated continuously.

## Patterns to avoid

- Cursor-following spotlight/glow and gradient-mesh hero canvases: both now read as template/AI-slop.
- Preloaders with percentages, "click to enable sound", repeated giant-name typography, icon-only navigation.
- Sparkle "Ask me" AI buttons and floating chat robots unless the chat is the demonstrated guarded pipeline with its trace exposed.
- Scroll-prompt dependence ("scroll to explore"): if the page must tell you to scroll, the first viewport isn't the argument.
- Full-page WebGL metaphors: prove 3D craft, not the skill being sold.
- Aspirational tech-logo walls: logos are not evidence.
- Desktop-only interactive demos without fallback.
- Typewriter cursors, marquees, pulsing "live" dots.

## Signature interaction candidates

1. **Request-trace timeline.** One request through the pipeline; step a stage to see its artefact and the flags where a failure would be caught. Small JS; static fallback. *Shipped in V2 as the trace.*
2. **Guardrail reveal (hold-to-show).** Press-and-hold peels back a clip-path wipe to show which rule fired. CSS wipe + ~30 lines JS.
3. **Naive vs hardened comparison.** Same prompt, two columns, replayed from cached fixtures with a visible recorded-date stamp. Small JS + JSON.
4. **Evidence inspector behind every metric.** Every number is a button opening the eval table, sample size, date, method. `<dialog>` or `<details>`. *Partially shipped: figure captions carry context; a full inspector needs publishable eval data.*
5. **Grounding-threshold calculator.** One slider drives coverage % and unsupported-claim rate from a real eval curve. Needs real data.
6. **Machine-readable mirror + keyboard layer + mascots with jobs.** `llms.txt`, `.md` per page, `?` key legend, Naro/Exa sprite states. *Mascot-with-a-job shipped; mirrors deferred.*
