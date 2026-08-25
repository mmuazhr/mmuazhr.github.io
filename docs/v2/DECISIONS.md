# V2 Design Decisions

Each decision, and the reason it exists. If a reason stops being true, the decision should be revisited.

1. **Positioning: "checked before anyone sees the answer".** Every case study has a verification step as its central idea; this is the one honest sentence that covers all of them and that competing AI portfolios do not say.
2. **Hero carries proof and CTAs.** The 30-second recruiter should not have to scroll. Three figures already on the page, three actions (email, CV, GitHub) in one row.
3. **One living crew, expressed at two scales.** Exa and Naro inhabit the hero proof and the two system traces. Their movement is caused by visitor input and communicates checking; Job Agent still uses an exact public artifact because inspectable evidence is stronger than another illustrative trace.
4. **Two scenarios per trace, one of which gets caught.** A trace where everything passes teaches nothing. The caught path is the argument for the whole portfolio.
5. **Illustrative inputs, labelled.** No real SQL, DAX, figures or facts are invented. The Work section states that inputs are illustrative and the components are real.
6. **No scroll-triggered trace autoplay.** Clicking a stage moves Naro directly. Choosing a different scenario runs that chosen path and moves him through it; reduced motion resolves the path immediately.
7. **Orange means a check.** Hero `em`, caught/abstain node states and their connectors, primary CTA. Removing decorative orange (V1's hero period) makes the accent legible as a signal.
8. **Native `<details>` for engineering notes.** Accessible, zero JS, and the honest form of progressive disclosure: recruiters skip it, engineers open it.
9. **Sticky header with `aria-current`.** An 8,000px page needs wayfinding; a one-line sticky bar costs 60px and nothing else.
10. **Everything visible without JavaScript.** V1 hid diagrams behind an observer with no fallback. V2 only adds state with JS; content is never gated.
11. **No dependencies.** Small, framework-free JavaScript and CSS cover every interaction; importing an animation or 3D library would contradict the restraint of an engineering portfolio.
12. **Dropped JetBrains Mono Medium.** It was 93KB for a weight that synthesised acceptably; fonts fell from 225KB to 132KB.
13. **Naro performs the checks.** He travels to hero metrics and trace nodes, then reacts more strongly at caught/abstain states. Exa responds at the laptop while checks run and at the contact CTA.
14. **Kept the palette, type pairing, coda, timeline and contact band.** The equal-weight builds ledger was replaced because it hid the only project with a real customer workflow.
15. **V1 archived at `/v1/` on the same branch.** Comparison should not require checking out another branch.
16. **Metrics after the trace, not before.** The brief asked for Problem → Decision → System → Result → Evidence; the hero already gives the recruiter the headline numbers, so the case study can keep its narrative order.
17. **Merge diagram stays static.** Case study 04 has no request to trace; forcing the primitive on it would be a gimmick.
18. **OG card copy updated, layout kept.** The share card should make the same claim as the page.
19. **Proof numbers never animate.** Intermediate count values read as incorrect evidence and conflict with the portfolio's trust premise.
20. **Media must explain something.** QueLess video shows the end-to-end mobile workflow; Content Studio video shows the pipeline output. Both use native controls and stay poster-first rather than receiving an invented interaction layer.
21. **The hero characters are separate actors, not a static illustration.** Two optimized transparent assets can move independently in response to pointer, focus and touch input. On mobile they occupy a dedicated crew strip below the recruiter content.
22. **Exploration is optional.** Default recruiter scanning remains unchanged. Mascot responses add depth without hiding identity, outcomes, project names or contact actions.
