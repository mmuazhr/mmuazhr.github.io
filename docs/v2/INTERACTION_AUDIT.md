# Interaction and liveliness direction

Date: 2026-08-25.

## What was rejected

The first interaction pass added a verification lens, explicit Run buttons and video chapter controls. Although technically coherent, it repeated the original problem: controls were added on top of a traditional page. The visitor operated widgets, but the portfolio itself did not feel inhabited. That pass was removed.

## Revised principle

Bruno Simon's transferable lesson is not 3D or gamification. His environment feels alive because one continuous character responds to input, moves through the content and creates consequences. Muaz's equivalent is a small verification crew that inhabits the portfolio:

- **Exa operates the system.** Pointer movement gives Exa a subtle physical response; when a check begins, Exa works at the laptop.
- **Naro performs the checks.** Pointing at, focusing or tapping a production figure sends Naro to that exact claim. The figure changes only after Naro arrives and the check completes.
- **Exploration persists.** Checked figures keep their mark during the visit, so the visitor's actions leave visible state behind.
- **Naro travels through the architecture.** Selecting a trace stage moves Naro to that node. Switching scenarios starts the chosen path, and Naro grows and reacts when the guardrail catches or abstains.

The characters are therefore not ambient animation. Their movement is caused by the visitor and communicates what the system is doing.

## Mobile and accessibility

- Each production figure is a native button with visible focus and a touch target above 44px.
- The same tap interaction moves Naro along a compact crew strip on mobile instead of flying over the copy.
- Status changes are announced through an `aria-live` region; the visual crew is decorative to assistive technology.
- Trace stage buttons and scenario radios keep their existing keyboard behavior.
- Reduced-motion users receive the checked/result state immediately, with all travel and character animation removed.
- Without JavaScript, the metrics remain ordinary readable figures and every trace stage remains visible.

## Deliberate limits

- No draggable mascots, physics, scoring, achievements or persistent game state.
- No mascot follows the cursor around the whole site or obstructs recruiter scanning.
- Product videos retain native controls; they do not need an invented interaction layer.
- Naro and Exa respond only where their role adds meaning: production proof, system verification and contact.

