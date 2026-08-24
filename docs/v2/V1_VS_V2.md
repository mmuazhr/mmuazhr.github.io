# V1 vs V2

Both versions live on the `v2` branch: V2 at `/`, V1 archived unchanged at `/v1/`. `main` still holds V1 as the deployed site until V2 is merged.

## Measured

| | V1 | V2 |
|---|---|---|
| Positioning | "I build AI agents that ship to production." | "I build AI agents that are **checked** before anyone sees the answer." |
| Above the fold (1440×900) | Headline + one line. No proof, no CTA. | Eyebrow (role, employer, city, availability), claim, lede, 3 proof figures, Email / CV / GitHub. |
| First metric reached at | ~900px | 0px (hero) |
| First CTA reached at | 7,389px | 0px (hero); repeated in contact |
| Page height (1440) | 8,118px | 8,135px |
| Words | 989 | 1,145 total, of which ~330 are inside collapsed engineering notes and inactive trace scenarios; visible-by-default copy is ~815 |
| Case-study structure | Problem → Approach → static diagram → Result | Title + one line → Problem → Decision → **interactive trace** → metrics → `details` notes |
| Interactive elements | 0 (hover on Exa) | 3 traces × (2 scenarios, 5 stages, prev/next), 3 details, section-aware nav |
| Navigation | Static header, no current state | Sticky header, `aria-current` follows scroll, CV as a pill |
| Mascots below 1380px | Exa only, at the very bottom | Naro in every trace at the moment of a catch (all sizes), Exa on the contact band, Exa in the gutter ≥1380 |
| Diagram visibility without observers | Hidden (no fallback) | Always visible; JS only adds state |
| Fonts | 225KB (3 files) | 132KB (2 files; JetBrains Mono Medium dropped) |
| Lighthouse desktop (perf / a11y / bp / seo) | not measured in V1 audit | 100 / 100 / 100 / 100 |
| Lighthouse mobile | – | 99 / 100 / 100 / 100, LCP 2.0s, CLS 0, TBT 0 |
| Dependencies | none | none |

## What changed and why

- **Hero.** V1 spent a full viewport on nine words. V2 puts identity, proof and next step in one screen, because the 30-second recruiter never scrolled to 7,000px for the email.
- **The trace.** V1's diagrams were honest but inert. V2 turns each into a stepper with a scenario where the check fires, so an engineer sees mechanism, not adjectives. Same primitive three times; no other animation vocabulary.
- **Progressive disclosure.** Engineering detail moved into native `<details>`. Recruiters skim, engineers open.
- **Orange got a meaning.** V1 used it as decoration (hero period, one node, CTA). V2 uses it only where a check happens, plus the primary CTA.
- **Copy.** Rewritten to Problem → Decision → System → Result. Facts and figures unchanged; nothing invented beyond illustrative trace inputs, which the page labels as illustrative.
- **Experience.** Split the Maxis line so the rotations read as a trajectory; added dates.
- **Skills.** Two more evidence rows (data, business cases) so the section covers the CV.

## What was kept

Palette, type pairing, the coda paragraph, the builds ledger, the timeline, the contact band, Exa's bob and hop, the 404, the OG card layout (copy updated).
