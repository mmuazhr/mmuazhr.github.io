# Design Direction — Portfolio V2

## Positioning (derived, not copied)

Every project in the portfolio shares one property: the system is not allowed to be wrong silently. The NL2SQL agent validates every number against BigQuery or abstains. The DAX agent is attacked by probes before users see it. The Job Agent must cite or reject. The self-improving agent learns from what went wrong. Even QueLess ships with CI, health checks and Sentry.

So the site's claim is:

> **I build AI agents that are checked before anyone sees the answer.**
> Multi-agent systems on Google Cloud, in production at Maxis.

"Ship to production" (V1) is true but generic; every AI portfolio says it. "Checked before anyone sees the answer" is true of all five case studies, is unusual, and is what an engineer or hiring manager actually wants to know about an agent builder. It also gives the site a single mechanic to build around.

## Three creative directions

### A. The Trace

**Core idea.** A request through one of Muaz's systems leaves a trace: router → agent → guardrail → answer or abstain. The portfolio is built around *tracing a request*. The reader can step one plausible request through each system and watch where it gets checked.

- **Why it represents him.** Tracing is the literal instrument of production reliability (spans, guardrail decisions, abstention). It shows *how* the systems are safe, rather than asserting that they are.
- **Hero.** Name, the claim above, one line of context, three proof figures, two CTAs (email, CV). Below the fold, the first trace.
- **Navigation.** Sticky top bar with section links that highlight the current section. Nothing more.
- **Project interaction.** Each major case study has a **Trace** block: a stepper of 4–5 stages, with a scenario switch (e.g. "answerable question" vs "question the guardrail should refuse"). Step forward/back, or click a stage. Each stage shows what that component does and its state (pass / caught / abstain). The same primitive is reused for the harness (probe → failure → regression case) and the Job Agent (claim → cite → verify → reject). Engineering depth lives in a `<details>` block under each trace.
- **Motion language.** State and causality only: the active stage changes, the connector fills to the active stage, a caught input turns the guardrail node orange. No entrance animations on prose; only the metrics count in once.
- **Visual system.** Keep paper/ink/graphite with a single signal orange, General Sans + JetBrains Mono. Orange is reserved for "a check happened here" (guardrail node, rejected claim, abstain) and for the primary CTA, so the accent colour *means* verification everywhere on the page.
- **Mobile.** The trace stacks vertically; stages are tappable; scenario switch becomes a segmented control; step buttons stay. Nothing depends on hover.
- **Risks.** Could read as an observability dashboard if over-styled; mitigated by editorial typography and by keeping the trace inside a case study, not as chrome. Must not fabricate outputs: scenarios are labelled illustrative and describe component behaviour, not invented numbers.
- **Complexity.** Medium. HTML + CSS + ~150 lines of vanilla JS state machine. No dependencies.

### B. The Evidence Ledger

**Core idea.** The site behaves like the Job Agent: every claim on the page carries an evidence marker, and the reader can open the evidence behind any number or sentence. Cite-or-reject, applied to the portfolio itself.

- **Why it represents him.** It is the verification-first philosophy turned on his own claims.
- **Hero.** Claims with superscript evidence marks; opening one shows the source system and how the figure is produced.
- **Navigation.** A numbered ledger; section numbers act as anchors.
- **Project interaction.** Metrics open into "how this number is measured"; case studies are short claim lists with expandable evidence.
- **Motion.** Disclosure only.
- **Visual.** Typographic, tabular, marginalia-heavy; mono figures; hairline rules.
- **Mobile.** Evidence opens inline under the claim.
- **Risks.** The evidence available today is self-reported prose; the mechanic promises audit-grade sourcing the content cannot deliver. Also risks reading dry and legalistic; the mascots would feel out of place.
- **Complexity.** Low.

### C. Naive vs Hardened

**Core idea.** Every case study is a before/after: the naive agent and the hardened one, same input, side by side, with a switch.

- **Why it represents him.** His work is the delta between a demo and a production system.
- **Hero.** A two-state toggle: "demo" / "production", swapping the subtitle and the proof strip.
- **Navigation.** Standard sticky nav.
- **Project interaction.** A switch per case study flips the diagram and result between the naive path and the hardened path.
- **Motion.** State transition between the two panes.
- **Visual.** Split layouts, strong contrast, two-column rhythm.
- **Mobile.** Toggle stacks; panes swap in place.
- **Risks.** The "naive" side would have to be invented for most projects (there was no naive NL2SQL that shipped), which conflicts with the no-fabrication rule. Two panes double the copy. Weakest on mobile.
- **Complexity.** Medium-high in content, medium in code.

## Choice: A, The Trace, with B's metric disclosure folded in

A is chosen because it is the only direction that explains *mechanism* rather than *attitude*. It maps to real components in shipped systems, so nothing has to be invented beyond an illustrative input. It gives the site a single reusable primitive (the trace) instead of a set of unrelated flourishes, which is what "one signature interaction" means in practice. It stays useful with JavaScript off (the stages are a plain ordered list). And it keeps the accent colour honest: orange marks a check.

From B we keep one thing: metrics can be opened to show the one-line context behind the number, using only facts already on the page or in the CV.

C is dropped: it would require fabricating the naive path.

## Interaction principles applied

- Motion communicates state (active stage), causality (connector fill), or feedback (button press). No decorative entrance animations on text. Metrics count once when in view because progression toward the final number is the message; with `prefers-reduced-motion` they are static.
- Hover is never the only path: stages are buttons, scenarios are radio inputs, details are native `<details>`.
- Nothing waits: all content is present on load; JS only adds state.
- No new dependencies. CSS transitions + ~200 lines of JS.

## AI-slop guardrails for this build

No gradients, orbs, glass, glow, particles, code rain, typewriter, floating logos, skill pills, custom cursor, smooth-scroll hijack, parallax. Copy has no "turning ideas into", "building the future", "passionate". Orange appears only where a check happens plus the primary CTA. Mascots appear at most once per viewport.

## Personality

Naro and Exa stay marginalia, and get a role: Naro ("on patrol") is the guardrail's mascot. When a trace ends in a caught/abstained state, a small Naro appears beside the outcome node on wide viewports. Exa keeps the contact band and gets a mobile placement so phones meet at least one of them. The 404 stays.
