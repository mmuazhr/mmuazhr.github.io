# V2 Architecture

Static site, no build step, no dependencies. Three files carry the page: `index.html` (content and structure), `styles.css` (design system and layout), `script.js` (three progressive enhancements). Everything below is implemented and verified in the browser; this document describes what shipped, not a plan.

## Component tree

```
header.site-head            sticky, section-aware (aria-current="true" on the active link)
main#top
  section.hero              eyebrow · h1 claim · lede · proof strip (3 figures) · 3 CTAs
  section#work
    article.cs#nl2sql       cs-head · cs-cols (Problem | Decision) · .trace · metrics · details.notes · stack
    article.cs#qa-harness   same template
    article.cs#job-agent    same template
    article.cs#self-improving   cs-head · cs-cols (Decision | .merge diagram) · metrics
    article.cs.cs-quiet#bundle  coda, one large paragraph, Exa in the right gutter ≥1380px
  section#builds            ledger (4)
  section#experience        timeline (5)
  section#skills            proofs (8 skill → anchor pairs)
  section#contact.dark      h2 · CTAs · note · links · mascot note · Exa on the band edge
footer.dark                 location · link to /v1/
```

## The trace

Markup: `.trace[data-trace]` → `.trace-bar` (label, `fieldset.scn` with two radios, prev/next buttons) → `ol.stages` → `li.stage[data-state-a][data-state-b]` → `button.stage-btn` (name + sub) and `.stage-body` holding one `<p data-scn="a">` and one `<p data-scn="b">`. One `img.trace-naro` per trace.

State (per trace, in `initTrace`):

| Variable | Meaning |
|---|---|
| `scenario` | `"a"` or `"b"`, from the checked radio |
| `index` | active stage, 0..4 |
| `timer` | autoplay interval or null |
| `touched` | true once the reader has interacted; cancels the one-time autoplay |

Render writes: `data-scenario` on the trace (selects which `[data-scn]` text is visible), `data-state` on each stage (copied from `data-state-{scenario}`; values `pass | warn | caught | abstain | skip`), classes `active | done | todo`, `aria-current="step"` on the active button, `data-active-state` on the trace (shows Naro for `caught` / `abstain`), disabled state of prev/next.

Motion: only state changes. Connector segments and node fills transition colour (0.25–0.3s). Autoplay runs once when the trace is 55% in view, 1.5s per stage, unless the reader has already interacted or `prefers-reduced-motion` is set. Switching scenario restarts at stage 0 and plays.

Keyboard: stage buttons are real buttons (Tab, Enter/Space). Arrow keys, Home and End move between stages when a stage button has focus. Scenario radios get the native radio-group arrow behaviour. Prev/next have `aria-label`s.

## Responsive adaptation

| Width | Trace | Elsewhere |
|---|---|---|
| ≥861px (JS) | Five nodes in one row with connectors; the active stage's body renders in a single panel below the row (`.stage { display: contents }`, body in grid row 2). Naro bottom-right of the panel. | Two-column Problem/Decision, section head as h2 + note side by side |
| <861px or no JS | Vertical list; the active stage's body opens directly under its node (accordion). Naro 64px at the trace's bottom-right. | Single column everywhere, timeline stacks, merge diagram stacks |
| ≤600px | Label + arrows on one row, scenario switch full-width beneath | 54px header, smaller nav, hero h1 10vw, 3-column proof strip kept |

## CSS system

Tokens in `:root`: paper `#FAFAF9`, paper-2 `#F3F3F0`, ink `#17171A`, graphite `#54545C`, hairline `#E6E6E4`, line `#C9C9C6`, signal `#E9530E`, signal-soft `#FBE3D6`. Fonts: General Sans variable (self-hosted, preloaded) for text, JetBrains Mono Regular only for labels, figures captions and node text (the Medium weight was dropped, −93KB).

Rule for orange: it marks a check. Hero `em`, `caught`/`abstain` node states and their connectors, the primary CTA. Nothing else.

Reduced motion: one block at the end of the stylesheet zeroes all transitions and animations; JS separately skips autoplay, count-in and the Exa animations.

## Accessibility

Semantic landmarks and headings (`h1` → `h2` per section → `h3` per item), skip link, visible focus rings (ink on paper, paper on ink), `aria-labelledby` on sections, `role="img"` with descriptive `aria-label` on the static merge diagram, decorative mascots `alt=""` + `aria-hidden`. The trace is an ordered list of buttons, so screen readers get "list, 5 items" and can read every stage; the scenario switch is a fieldset of radios with a hidden legend. Native `<details>` for engineering notes. Lighthouse accessibility 100 on desktop and mobile.
