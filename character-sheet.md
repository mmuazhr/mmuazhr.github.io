# Mascot Character Sheet: Naro & Exa

Naro and Exa are the two voxel mascots on the portfolio site. They are Muaz's own
characters, not stock art. This file is the written half of the reference; the
visual half lives in `assets/mascots/`.

| | |
|---|---|
| Visual reference | `assets/mascots/naro-character-sheet.jpg`, `assets/mascots/exa-character-sheet.jpg` |
| Shipped web assets | `naro.png`, `exa.png` — transparent PNGs, 274×420 and 266×420 |
| Origin | Cut from `content-studio/assets/mascot-concepts/duo-v2.png` by PIL floodfill |
| Reference sheets | Generated 2026-08-21 with `nano-banana-pro` on Mitte, using the live PNGs as `image_urls` |

**The shipped PNGs are canonical.** The reference sheets were derived from them,
not the other way round. If a future render disagrees with `naro.png` / `exa.png`,
the PNG wins.

## Naro

Blocky voxel astronaut boy, built from visible cubes.

- **Head** — bright leaf-green cube. Simple pixel face on the front: two large
  black pixel eyes each with a tiny white highlight square, and a small pink
  smiling pixel mouth.
- **Antenna** — a short stepped stack of small green cubes rising from the
  top-left of the head.
- **Helmet** — a clear glass sphere dome enclosing the head, with a faint
  highlight.
- **Body** — royal-blue voxel spacesuit. Small white rectangular name patch on
  the chest reading `NARO` in dark type.
- **Extremities** — green cube hands, green cube boots.
- **Pose on site** — one arm raised in a friendly wave.
- **Role** — "on patrol", the vigilant one. Alert, curious, slightly mischievous.

Colours: leaf green, deep green shadow, royal blue, darker blue, near-black,
off-white.

## Exa

Blocky voxel robot in warm coral / salmon-pink plastic.

- **Head** — chunky boxy television shape, clearly wider than tall, with a large
  flat pale cream screen panel filling most of the front.
- **Face** — black pixel art drawn on the screen, and it is **cheerful**: short
  eyebrows sitting high and angling gently upward, wide round eyes, and a broad
  open trapezoid grin across the lower screen curving up at both ends.
  Exa's resting face is that open grin. She is never stern, never scowling.
- **Antenna** — a short stack of small coral cubes from the top of the head.
- **Body** — coral voxel torso, blocky arms and legs, slightly darker coral joint
  cubes, chunky mitten-like cube hands.
- **Prop** — an open laptop of grey and light-silver cubes resting on her left
  forearm, small white `EXA` label on it.
- **Pose on site** — right arm raised in a friendly wave, perched on the top edge
  of the ink contact band.
- **Role** — "brought the laptop", the productive one. Focused, helpful, ready to
  work.

Colours: coral pink, deep coral shadow, pale cream, light silver grey, mid grey,
near-black.

## Regenerating

Feed the **live PNGs** as reference images so the model has the real characters:

```
https://mmuazhr.github.io/naro.png
https://mmuazhr.github.io/exa.png
```

Then generate with `nano-banana-pro` (4:3, 4K, png). The full sheet prompts used
for the current reference images are reproduced in the git history of this file's
first accurate revision; the essentials are:

- Describe the character exactly as above, and say **do not redesign**.
- Board layout stays clean, neutral and technical on `#FAFAF9` — voxel style
  applies to the character only, never to the board.
- For Exa, spell out the happy face explicitly and forbid angry eyebrows. Left to
  itself the model drifts her into a scowl.

### Downloading results

Take the URL from the `assets[].url` field of the generation result. **Do not**
use a flow's or node's `thumbnail_url` — that is the model's own cover art, which
is how a previous session ended up writing a "GPT Image 2" gradient and a
"Nano Banana 2" banana over `naro.png` and `exa.png`.

Always open a generated image and look at it before it overwrites a committed
asset.

## Usage on the site

- Both are decorative: `alt=""`, `aria-hidden="true"`.
- Exa is absolutely positioned on `#contact`, fades in on scroll, bobs gently, and
  does a small excited hop when the contact CTA is hovered or focused.
- Naro is fixed to the bottom-left corner, peeks up when the reader reaches the
  contact band, and again after 12 seconds of stillness.
- Both are hidden or held still under `prefers-reduced-motion: reduce`.
- The `.mascot-note` line in the contact band is what explains them to a visitor.
  If the mascots change, that line changes too.
