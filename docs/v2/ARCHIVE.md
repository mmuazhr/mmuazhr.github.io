# Interactive crew portfolio archive

Archived on 2026-08-25 after the Fable version was selected for publication.

## Where this version lives

- Git branch: `v2`
- Archive tag: `archive/interactive-crew-2026-08-25`
- Entry point: `index.html`
- Design and implementation documentation: this `docs/v2/` directory
- Browser review captures: `docs/audit/`

The branch and tag preserve the complete implementation; it is not the production root on `main`.

## What this version explored

This direction treated Exa and Naro as a visitor-responsive verification crew rather than decorative mascots:

- selecting a production claim sends Naro to verify it while Exa reacts;
- selecting trace stages moves Naro through the system architecture;
- scenario choices create visible `caught` and `abstain` states;
- checked claims persist for the current visit;
- touch, keyboard, no-JavaScript and reduced-motion fallbacks remain usable.

It also introduced evidence-led project presentation: real QueLess and Content Studio demonstrations, annotated engineering artifacts, clearer build identities, a rebuilt one-page CV and a revised social card.

## Why it is archived

The implementation is technically sound and well-tested, but the more restrained Fable direction was chosen as the public portfolio. Keeping this work on a dedicated branch makes the interaction experiments and visual assets recoverable without mixing two design systems in production.

## Run locally

From this branch:

```sh
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Verification record

See `QA_RESULTS.md` for the full browser matrix. At archive time:

- desktop Lighthouse: 100 performance / 100 accessibility / 100 best practices / 100 SEO;
- mobile Lighthouse: 94 / 100 / 100 / 100;
- desktop, laptop, tablet and phone layouts were checked with no horizontal overflow;
- core interactions were checked with pointer, touch-equivalent controls and keyboard;
- reduced-motion and no-JavaScript fallbacks were verified.

## Restoring this direction

Create a new worktree from the immutable tag:

```sh
git worktree add ../portfolio-interactive-crew archive/interactive-crew-2026-08-25
```

Do not merge the branch wholesale into `main`: the archived root files intentionally replace the Fable root files. Compare or cherry-pick individual assets and ideas instead.
