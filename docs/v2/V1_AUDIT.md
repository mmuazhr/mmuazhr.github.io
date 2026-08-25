# Portfolio V1 Audit

Audited 2026-08-25 against the live site (mmuazhr.github.io, commit `9075ec0`), served locally and inspected in headless Chromium at 1440×900 and 390×844. Numbers below are measured, not estimated.

## Who this is (internal profile, derived from repo + CV)

- **Muaz Husaini**, Kuala Lumpur. BSc CS (UKM, First Class, 3.88, Dean's List 8/8), graduated Dec 2024.
- Maxis Graduate Program since Jan 2025. Rotations: Mobile Product → Go-to-Market → **Data & AI DevOps (Jan 2026–now)**, where the agent work lives.
- Earlier: Deloitte AI & Data intern (2024, GenAI document automation on Fabric), PJBUMI MLOps apprentice (2023–24, CV inspection models, Petronas engagement).
- Shipped, in production: a multi-agent NL2SQL system on Vertex AI Agent Engine (Google ADK, BigQuery, Cloud Run) with semantic routing, M-Schema-aware SQL, a grounding guardrail that validates every figure against live BigQuery, and abstention. 300+ monthly users, 4,000+ verified answers, <0.5% unverified-output rate, 2.4× question growth in a quarter. Owns the LLMOps loop.
- Built an NL-to-DAX agent plus an adversarial QA harness (23 failures the green suite missed, each now a regression case).
- Self-improving agent architecture: Firestore policy store + realtime listeners, 31% repeat-question deflection, zero added per-turn latency.
- Independent: Job Agent (cite-or-reject generation, 129 automated tests across 25 files, 6× faster drafting), QueLess (live SaaS, CI + Sentry), Content Studio, FluentAI, fitmu.
- Also did the AI bundle business case at Maxis (financial model, caught a rebate modelling error).
- Voice in existing copy: short declaratives, specific, dry humour ("a pipeline that cannot lie about you"), no filler.

**Derived positioning.** Every single project has the same spine: *the system is not allowed to be wrong without saying so*. Grounding guardrail, abstention, adversarial probes → regression cases, cite-or-reject, CI + health checks. The strongest honest framing is therefore not "agentic AI" (a category) but **verification-first: agents that are checked before a human sees the output**. It is specific, it is true of all five case studies, and it is what separates this from the median "I built a RAG chatbot" portfolio. Seniority is early-career; the evidence (production users, measured error rate) carries the weight, so the copy must stay factual and let the numbers do the arguing.

## Information architecture

| Question | Finding |
|---|---|
| Who is he within 5–10s? | Partially. The hero says "I build AI agents that ship to production" + one line about Maxis. It does **not** say what kind of agents, show any proof, or offer a next step. The 23-word hero occupies 835px (a full viewport) with ~60% empty space. |
| Strongest work prominent? | The flagship (NL2SQL) is first, which is right, but its metrics sit 900px below its title. A recruiter scrolling sees Problem/Approach prose before any number. |
| Too much text? | Yes in the Work section: 654 of 989 words (66%), 4,410px tall, five long-form case studies read at the same depth. Nothing is collapsed; a recruiter and an engineer get the same wall. |
| Attention drop | Measured layout: case studies are 723–913px each, four in a row, same structure (label → paragraph → diagram → metrics). By the third the rhythm is predictable and the eye stops reading. The "coda" (business case) sits at the end where almost nobody reaches. |
| Repetition | "In production" appears in meta, result copy, and skills. Stack lists repeat Python/Agent Engine. The Skills section is a second index of the case studies (good idea, redundant placement). |
| Hierarchy obvious? | Within a case study, no: the H3 title, the metrics, and the diagram compete. The diagram node labels are 13px mono; the lit orange node is the only true focal point. |
| Ordering | Work → Builds → Experience → Skills → Contact is sane. Missing: proof and a CTA at the top. Contact is 7,389px down; the only earlier CTA is a nav link. |

## Recruiter UX by visitor

**1. Recruiter, 30 seconds.** Needs: role, location, seniority signal, 2–3 proof points, CV, contact. Currently gets: a big headline, "Open to roles" in 11px mono, and has to scroll 900px to the first metric and 7,400px to the email. CV link is in the nav (good) but not in the hero. Verdict: 60% of what they need, in the wrong order.

**2. AI/ML engineer.** Needs: what the architecture actually is, what decisions were made and why, what could go wrong and how it was handled, evidence of evaluation discipline. Currently gets: good static flow diagrams and dense paragraphs. Missing: any way to inspect *how* the guardrail works, what "abstain" means operationally, what the probes looked like, why Firestore over the naive approach. The material exists in the copy but is flattened into prose.

**3. Hiring manager.** Needs: shipped-ness, ownership, business understanding, collaboration signal, growth trajectory. Currently gets: strong shipped signal (users, production) and a nice business-case coda, but the trajectory (three rotations, two prior internships) is buried in a timeline at 6,000px, and ownership ("I own the LLMOps loop") is one sentence inside the flagship result paragraph.

## Visual design

- **Typography.** General Sans + JetBrains Mono is a good, non-generic pairing. Display sizes are confident (h1 up to 124px). Body at 17px/1.6 is comfortable. Weakness: only three type roles (display, body, mono label) so long sections look flat; there is no intermediate "lede" or pull-quote size except the coda.
- **Spacing/rhythm.** Generous but uniform. Section padding, case-study gaps and diagram padding are all similar clamps, so nothing is closer to anything else — no grouping through proximity. The hero's dead space is the biggest cost.
- **Hierarchy.** Metrics were recently promoted to large tabular figures (good). But they arrive after the diagram, and the diagram arrives after two paragraphs; the strongest element is third in reading order.
- **Density.** Low on the page, high inside paragraphs. Inverse of what scanning needs.
- **Project presentation.** All five case studies share one template; the split layout of #2 is the only variation. No thumbnails, no visual identity per project, nothing to distinguish "in production at a telco" from "independent build".
- **Diagrams.** Honest, semantic (`role="img"` with real alt text), CSS-only. But they are decorative in practice: they cannot be interacted with, node subtitles are 11px, and the entrance animation is gated on an IntersectionObserver with **no fallback**, so in any environment where the observer does not fire (full-page capture, print, some reader modes) the diagrams are invisible. Metrics have a 2.5s fallback; diagrams do not.
- **Navigation.** Five nav links, no current-section indication, header not sticky, so once past the hero there is no wayfinding on an 8,000px page.
- **Mobile.** Solid: no horizontal overflow at 390px, flows go vertical, type scales. The header stacks into two rows and takes 100px. Both gutter mascots are `display:none` under 1380px, so on mobile and most laptops the "personality" reduces to one Exa at the very bottom.
- **CTAs.** One: "Email Muaz" in the contact band. No CTA above the fold; CV download appears twice but only as text links.
- **Personality.** Restrained and real: the orange full stop, the dry titles, the mascots. But at ≤1379px the mascots are gone, so most visitors never meet Naro at all. The `mascot-note` explaining them is below the fold of the contact band.

## Interaction

Where interaction would genuinely improve things:

- **Comprehension.** The flagship's value is *what the guardrail does to a bad answer*. A step-through of one request (including the abstain path) would explain in 15 seconds what two paragraphs currently do in 90. Same for the harness (probe → failure → regression) and the Job Agent (claim → cite → reject).
- **Exploration / progressive disclosure.** Engineering depth should be opt-in (`<details>`), so recruiters skim and engineers dig.
- **Navigation.** A sticky header with a current-section indicator; on desktop a compact progress affordance.
- **Memorability.** One signature primitive reused three times beats five different flourishes.

What does not need interaction: experience timeline, builds ledger, contact. They need better hierarchy, not motion.

## Technical baseline

- Static HTML/CSS/vanilla JS, no build. 18.6KB HTML, 22.5KB CSS, 2.4KB JS. Fonts 225KB (JetBrains Mono ships two full weights, 186KB, for labels only). Mascot PNGs ~250KB combined. No console errors. Local load 35ms.
- Accessibility: semantic sections, skip link, visible focus, `aria-label`ed diagrams, decorative images hidden, reduced-motion handled. Contrast of `#54545C` graphite on paper ≈ 7.5:1, fine; 11px mono labels are small but pass AA at 500 weight.
- Two problems to carry forward as fixes: diagram reveal has no fallback; the header is not sticky.

## Summary of what V2 must fix

1. Hero must answer who/what/proof/next-step in one viewport.
2. Case studies need a skim layer (title, one line, metrics) and a dig layer (interactive trace, engineering notes).
3. One signature interaction that explains verification, reused consistently.
4. Sticky, section-aware navigation.
5. Personality that survives below 1380px.
6. Nothing hidden behind a reveal that can fail.
