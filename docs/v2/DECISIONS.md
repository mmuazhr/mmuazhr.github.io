# V2 Design Decisions

Each decision, and the reason it exists. If a reason stops being true, the decision should be revisited.

1. **Positioning: "checked before anyone sees the answer".** Every case study has a verification step as its central idea; this is the one honest sentence that covers all of them and that competing AI portfolios do not say.
2. **Hero carries proof and CTAs.** The 30-second recruiter should not have to scroll. Three figures already on the page, three actions (email, CV, GitHub) in one row.
3. **One signature interaction, the trace, used three times.** One primitive learned once beats five flourishes. It explains mechanism (where the check fires) rather than asserting reliability.
4. **Two scenarios per trace, one of which gets caught.** A trace where everything passes teaches nothing. The caught path is the argument for the whole portfolio.
5. **Illustrative inputs, labelled.** No real SQL, DAX, figures or facts are invented. The Work section states that inputs are illustrative and the components are real.
6. **Autoplay once, then hand over.** Readers who never click still see the request travel; anyone who interacts takes control and autoplay never returns. Reduced motion disables it entirely.
7. **Orange means a check.** Hero `em`, caught/abstain node states and their connectors, primary CTA. Removing decorative orange (V1's hero period) makes the accent legible as a signal.
8. **Native `<details>` for engineering notes.** Accessible, zero JS, and the honest form of progressive disclosure: recruiters skip it, engineers open it.
9. **Sticky header with `aria-current`.** An 8,000px page needs wayfinding; a one-line sticky bar costs 60px and nothing else.
10. **Everything visible without JavaScript.** V1 hid diagrams behind an observer with no fallback. V2 only adds state with JS; content is never gated.
11. **No dependencies.** ~200 lines of JS and CSS transitions cover every interaction; importing an animation library for this would contradict the "engineering portfolio" claim.
12. **Dropped JetBrains Mono Medium.** It was 93KB for a weight that synthesised acceptably; fonts fell from 225KB to 132KB.
13. **Naro appears where a check catches something.** Gives the mascot a role that matches the site's idea, and puts personality on mobile where V1 had none.
14. **Kept the palette, type pairing, coda, ledger, timeline, contact band.** They were not the problem; changing them would be churn.
15. **V1 archived at `/v1/` on the same branch.** Comparison should not require checking out another branch.
16. **Metrics after the trace, not before.** The brief asked for Problem → Decision → System → Result → Evidence; the hero already gives the recruiter the headline numbers, so the case study can keep its narrative order.
17. **Merge diagram stays static.** Case study 04 has no request to trace; forcing the primitive on it would be a gimmick.
18. **OG card copy updated, layout kept.** The share card should make the same claim as the page.
