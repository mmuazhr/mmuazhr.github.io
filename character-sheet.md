# Mascot Character Sheet: Naro & Exa

Naro and Exa are the two voxel mascots on the portfolio site. They are Muaz's own
characters, not stock art. This file is the written half of the reference; the
visual half lives in `assets/mascots/`.

| | |
|---|---|
| Visual reference | `assets/mascots/naro-character-sheet.jpg`, `assets/mascots/exa-character-sheet.jpg` |
| Shipped web assets | `naro.png` 186×300, `exa.png` 219×300, `assets/mascots/naro-scout.png` 210×320, `exa-sit.png` 226×320, `naro-adrift.png` 598×800, `exa-source.png` 614×840 (full-res, used only to render the OG card) |
| Asset rules | All transparent. All carry ~5–6% padding so no opaque pixel touches a canvas edge. All sized to ~2.4× their rendered height — enough for retina, no more. **Keep the `width`/`height` attributes in the markup in sync when you resize any of them.** |
| Padding gotcha | That bottom padding means a character positioned with `translateY(-100%)` floats above the edge it should stand on. `.exa` offsets it with `--exa-rest: -96%` (4% padding); `.gm-right` uses `translateY(6%)` (its asset has 6%). **If you regenerate an asset, re-measure its bottom padding and update the matching number.** |
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

## Re-cutting from the source render

`naro.png` and `exa.png` are cut from
`content-studio/assets/mascot-concepts/duo-v2.png` (2048², both characters on a
tan plinth over a cream gradient). The working script is at
`scratchpad/matte/matte.py`. What makes it work:

- **Fit the background, don't assume it.** A per-channel quadratic fit over the
  flood-filled border region, then measure every pixel's deviation from that
  fit. A fixed cream constant is not good enough — the backdrop is a gradient.
- **The plinth is not a colour threshold.** Below its top edge (y=1340; Exa's
  laptop bottoms out at y=1297, so there is no overlap) a pixel is plinth if it
  is warm (`r−b > 15`) **and** `g/r > 0.62`. Measured separation: plinth
  0.80–0.90, its coral-bounce contact shadow 0.70–0.79, coral boots p99 0.585.
  The warmth test is what stops Naro's pale-blue leg highlights being eaten,
  which otherwise notches his legs.
- **Naro's glass dome CAN be reconstructed** — an earlier attempt concluded
  otherwise and was wrong. Take the convex disc around the low-chroma blob at
  his head, guard it with `min channel > 90` so his black eyes and mouth are not
  read as glass, and ramp alpha from D=62 to D=120 capped at 0.75. It renders as
  a thin annulus with a rim specular, which is what real glass looks like.
- **Gate hole-filling on plinth content**, so the wedge between Exa's legs stays
  transparent while the near-cream NARO patch and screen interiors still fill.
- **Take the largest connected component per side**, which drops a coral-tinted
  glass sliver — the dome's right arc refracting Exa's body — that otherwise
  floats beside her.
- **Un-premultiply edge colours against the fitted background** after eroding
  ~3px and feathering. This is what kills the cream halo on the ink band; a
  halo is invisible on paper and glaring on `#17171A`, so always check both.

Known residual: a ~4px tan nub at the lower-right of Exa's left boot, a contact
shadow remnant. Two attempts to remove it bit notches out of the other boot, so
it stays; it reads as contact shadow at display size.

## Regenerating

Feed the **character sheets** as the primary reference — they are 2400px and
show the character from every angle:

```
https://mmuazhr.github.io/assets/mascots/naro-character-sheet.jpg
https://mmuazhr.github.io/assets/mascots/exa-character-sheet.jpg
```

The live PNGs can be passed alongside them, but note they are now only 300px
tall after the 2026-08-22 resize, so on their own they are a weak reference:

```
https://mmuazhr.github.io/naro.png
https://mmuazhr.github.io/exa.png
```

Then generate with `nano-banana-pro` (4:3, 4K, png). The rules that matter:

- Describe the character exactly as above, and say **do not redesign**.
- Board layout stays clean, neutral and technical on `#FAFAF9` — voxel style
  applies to the character only, never to the board.
- For Exa, spell out the happy face explicitly and forbid angry eyebrows. Left to
  itself the model drifts her into a scowl; the first attempt came back with
  angled-down brows and a flat frown on the NEUTRAL panel.

The exact prompts that produced the current sheets are in
[Generation prompts](#generation-prompts) below. Start from those.

### Downloading results

Take the URL from the `assets[].url` field of the generation result. **Do not**
use a flow's or node's `thumbnail_url` — that is the model's own cover art, which
is how a previous session ended up writing a "GPT Image 2" gradient and a
"Nano Banana 2" banana over `naro.png` and `exa.png`.

Always open a generated image and look at it before it overwrites a committed
asset.

## Usage on the site

Four placements, each in a distinct spot. On-page decorative instances carry
`alt=""` and `aria-hidden="true"`; the 404 illustration has real alt text because
it is the page's subject.

| Where | Asset | Behaviour |
|---|---|---|
| `#contact` band | `exa.png` | Perched on the band's top edge. Fades in on scroll, bobs gently, small excited hop when the contact CTA is hovered or focused. |
| `#bundle` right gutter | `assets/mascots/exa-sit.png` | Seated on the rule that closes the case studies, laptop on her lap. |
| `#builds` left gutter | `assets/mascots/naro-scout.png` | Scouting, hand shading his eyes — "on patrol", surveying the independent builds. |
| `404.html` | `assets/mascots/naro-adrift.png` | Floating untethered with a worried face. Slow drift loop. |

**Naro no longer has a fixed bottom-left corner peek.** It was removed on
2026-08-22: because it was `position: fixed`, it could sit on screen at the same
time as the gutter Naro, putting two of the same character in one viewport. The
gutter placement is now his only appearance, which is also a truer reading of
"on patrol".

The two gutter mascots live in the page's outer margin, outside the reading
measure, and are `display: none` below 1380px where no real gutter exists.

Everything is held still under `prefers-reduced-motion: reduce`.

The `.mascot-note` line in the contact band is what explains them to a visitor.
If the mascots change, that line changes too.

## Generation prompts

Both were run through `mitte_generate` with:

```json
{
  "model": "nano-banana-pro",
  "input": {
    "prompt": "<the prompt below>",
    "image_urls": ["https://mmuazhr.github.io/naro.png"],
    "aspect_ratio": "4:3",
    "resolution": "4K",
    "output_format": "png",
    "num_images": 1
  }
}
```

### Naro

```text
Create a single unified MASTER CHARACTER REFERENCE SHEET of the EXACT character shown in the attached reference image. Do not redesign him. Reproduce his identity precisely in every panel.

STYLE: match the reference exactly — a chunky 3D voxel / blocky-cube toy character, matte plastic surfaces, soft neutral studio lighting, clean and friendly, no outlines, no texture noise.

SUBJECT — NARO:
A small blocky voxel astronaut boy made of visible cubes. Bright leaf-green cube head and green cube hands and green cube boots. Simple pixel-art face on the front of the head: two large black pixel eyes each with a tiny white highlight square, and a small pink smiling pixel mouth. A short stepped stack of small green cubes rises from the top-left of his head like a little antenna tuft. A clear transparent glass sphere helmet dome encloses his head with a faint highlight. His body is a royal-blue voxel spacesuit with a small white rectangular name patch on the chest reading NARO in dark type. One arm is raised in a friendly wave.

BOARD LAYOUT — 4:3 horizontal. The board itself must be clean, neutral, minimal and technical on a pure off-white #FAFAF9 background. Thin light-grey hairline rules and boxes. All labels in a clean uppercase sans-serif, dark near-black #17171A, generous spacing, clearly readable at normal viewing size — never tiny or dense. Use a single orange accent #E9530E sparingly for the title underline and the palette frame only. No clutter, no watermark, no logo. Apply the voxel style only to the character, never to the board layout.

Title at top-left: CHARACTER REFERENCE SHEET — NARO

1. TOP INFO BLOCK (top-left, horizontal row of labelled fields)
NAME: Naro — ALIAS: The Scout — ROLE: On patrol, the vigilant one — PERSONALITY: Alert, curious, slightly mischievous — CORE THEME: Exploration — BUILD: Voxel, 6 heads tall, chunky

2. COLOR PALETTE (top-right header area)
7 clean square swatches, no labels: leaf green, deep green shadow, royal blue, darker blue, near-black, off-white, signal orange.

3. MAIN IDENTITY + SCALE SHEET (largest, most dominant section, centre-left)
Four full-body turnaround views of Naro only, no props: FRONT, 3/4 VIEW, SIDE, BACK. Stand them over a subtle technical scale background with faint horizontal height marks and a light grid. In one corner of this same section place two small secondary silhouette thumbnails labelled NEUTRAL STANCE and PROFILE SILHOUETTE. Add three short pointer notes for silhouette, posture and visual identity.

4. EXPRESSION PROGRESSION (right column)
Exactly 8 small head panels of Naro, labelled: NEUTRAL, CURIOUS, WORRIED, SURPRISED, AFRAID, SAD, DETERMINED, RELIEVED. Show emotion through his pixel eyes and pixel mouth only.

5. MICRO EXPRESSIONS
Exactly 5 small head panels: SUBTLE EYE TENSION, SLIGHT SMIRK, LIP TENSION, MICRO FEAR, CONTROLLED BREATH.

6. HEAD DETAIL SHEET
Three close-ups of the head: helmet dome construction, the green antenna cube stack, the pixel face grid.

7. POSTURE VARIATION
Three small full-body panels labelled RELAXED, TENSE, CONFIDENT.

8. CLOSE-UP POSE
One larger cinematic chest-up hero pose of Naro mid-wave, showing helmet, face and chest name patch clearly.

9. WARDROBE / DETAIL CALLOUTS (bottom row)
Four close-up callouts: the NARO chest name patch, a green cube glove, a green cube boot, the helmet-to-collar seam.

10. HAND GESTURES (bottom-right)
Five small panels: RELAXED HAND, TENSE FINGERS, POINTING, GRIPPING, WAVE.

Keep Naro perfectly consistent across every panel — same green, same blue, same face, same proportions. The MAIN IDENTITY + SCALE SHEET must visually dominate the board. The result should look like a premium production visual bible / character continuity sheet.
```

### Exa

Note the FACE paragraph and the CRITICAL line — those are what stop the model
drifting her into a scowl. Do not trim them.

```text
Create a single unified MASTER CHARACTER REFERENCE SHEET of the EXACT character shown in the attached reference image. Do not redesign her. Reproduce her identity precisely in every panel.

STYLE: match the reference exactly — a chunky 3D voxel / blocky-cube toy robot, matte plastic surfaces, soft neutral studio lighting, clean and friendly, no outlines, no texture noise. Chunky and toy-like, roughly 4 heads tall with a big head and short limbs — NOT a slim realistic humanoid robot.

SUBJECT — EXA:
A small blocky voxel robot built from visible cubes in a warm coral / salmon-pink plastic. Her head is a chunky boxy television-set shape, clearly WIDER than it is tall, with a large flat pale cream screen panel filling most of the front.

HER FACE IS THE MOST IMPORTANT THING TO COPY. It is drawn as black pixel art on the cream screen and it is CHEERFUL, WARM AND OPEN:
- two short black pixel eyebrows that sit HIGH and angle gently UPWARD and outward, relaxed and friendly
- two black pixel eyes below them, wide and round
- a BIG WIDE OPEN SMILING MOUTH: a broad black trapezoid grin spanning most of the lower screen, curving upward at both ends, with a small pale block inside for the tongue
CRITICAL: Exa is happy and welcoming. Her default resting face is this open grin. NEVER give her angled-down angry eyebrows, never a stern scowl, never a flat straight frown, never a serious or menacing look in her NEUTRAL state.

A short stepped stack of small coral cubes rises from the top-left of her head like a little antenna. Coral voxel torso, coral blocky arms and coral blocky legs with slightly darker coral joint cubes, chunky mitten-like cube hands. She carries an open laptop made of grey and light-silver cubes, resting against her left forearm, with a small white label reading EXA on its lid. Her right arm is raised in a friendly wave.

BOARD LAYOUT — 4:3 horizontal. The board itself must be clean, neutral, minimal and technical on a pure off-white #FAFAF9 background. Thin light-grey hairline rules and boxes. All labels in a clean uppercase sans-serif, dark near-black #17171A, generous spacing, clearly readable at normal viewing size — never tiny or dense. Use a single orange accent #E9530E sparingly for the title underline and the palette frame only. No clutter, no watermark, no logo. Apply the voxel style only to the character, never to the board layout.

Title at top-left: CHARACTER REFERENCE SHEET — EXA

1. TOP INFO BLOCK (top-left, horizontal row of labelled fields)
NAME: Exa — ALIAS: The Builder — ROLE: Brought the laptop, the productive one — PERSONALITY: Focused, helpful, ready to work — CORE THEME: Craft — BUILD: Voxel, chunky, big head

2. COLOR PALETTE (top-right header area)
7 clean square swatches, no labels: coral pink, deep coral shadow, pale cream, light silver grey, mid grey, near-black, signal orange.

3. MAIN IDENTITY + SCALE SHEET (largest, most dominant section, centre-left)
Four full-body turnaround views of Exa WITHOUT the laptop, no props at all: FRONT, 3/4 VIEW, SIDE, BACK. In the FRONT and 3/4 views she wears her default wide open grin. Stand them over a subtle technical scale background with faint horizontal height marks and a light grid. In one corner of this same section place two small secondary silhouette thumbnails labelled NEUTRAL STANCE and PROFILE SILHOUETTE. Add three short pointer notes for silhouette, posture and visual identity.

4. EXPRESSION PROGRESSION (right column)
Exactly 8 small head panels of Exa, labelled: NEUTRAL, CURIOUS, WORRIED, SURPRISED, AFRAID, SAD, DETERMINED, RELIEVED. Show emotion entirely through the pixel art on her screen face — eyebrows, eyes and mouth redraw themselves like pixels on a display. The physical head box never changes shape. NEUTRAL must be her warm wide open grin with high relaxed eyebrows.

5. MICRO EXPRESSIONS
Exactly 5 small head panels: SUBTLE EYE TENSION, SLIGHT SMIRK, LIP TENSION, MICRO FEAR, CONTROLLED BREATH. These are subtle variations, all still gentle — not angry.

6. HEAD DETAIL SHEET
Three close-ups of the head: the screen bezel construction, the coral antenna cube stack, the pixel face grid showing the smiling mouth pixels.

7. POSTURE VARIATION
Three small full-body panels labelled RELAXED, TENSE, CONFIDENT.

8. CLOSE-UP POSE
One larger cinematic chest-up hero pose of Exa mid-wave holding her laptop, grinning warmly, showing screen face and laptop clearly.

9. PROP
One clean isolated view of the laptop alone on white, with a small info block reading:
OBJECT NAME: Exa's Laptop — TYPE: Voxel workstation — TRAITS: Always open, always on

10. WARDROBE / DETAIL CALLOUTS (bottom row)
Four close-up callouts: the EXA laptop lid label, a coral cube hand, a coral cube foot, the head-to-torso neck seam.

11. HAND GESTURES (bottom-right)
Five small panels: RELAXED HAND, TENSE FINGERS, POINTING, GRIPPING, WAVE.

Keep Exa perfectly consistent across every panel — same coral, same cream screen, same happy pixel face, same chunky proportions. The MAIN IDENTITY + SCALE SHEET must visually dominate the board. The result should look like a premium production visual bible / character continuity sheet.
```

## Known discrepancies in the current sheets

Small drifts the model introduced. **The shipped PNGs win in all cases.**

- Exa's sheet puts the `EXA` label on her chest. On the canonical `exa.png` it is
  on the laptop lid, which is where it belongs.
- Exa's antenna renders as a plain post rather than the stepped cube stack.
- Naro's sheet is faithful throughout; no known drift.
