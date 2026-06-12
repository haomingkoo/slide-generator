# Package And Workbench Roadmap

The package should make the artifact workflow easy to run. It should not become a giant slide editor before the quality loop is proven.

## Package Shape

Ship as an npm package with a CLI:

```bash
npm create slide-generator my-deck
npx slide-generator init my-deck --theme warm-editorial-light
npx slide-generator status my-deck
npx slide-generator validate my-deck
npx slide-generator render my-deck --html
npx slide-generator qa my-deck
npx slide-generator export my-deck --pdf --pptx
```

The first package should wrap existing scripts rather than rewrite the system.

## Package Contents

Include:

- `skills/slide-generator/`: canonical agent skill and references.
- `scripts/`: CLI entrypoints, validators, scaffold, render, QA and export wrappers.
- `templates/`: starter slide specs and deck archetypes.
- `templates/design-contracts/`: reusable design systems.
- `renderers/`: Marp themes and rendering assets.
- `examples/source-grounded-demo`: small fixture.

Keep large generated decks, local `projects/`, screenshots and private QA output out of the package.

## First CLI Milestone

1. Add `bin/slide-generator.mjs`.
2. Map CLI subcommands to existing scripts.
3. Add package `files` allowlist.
4. Add smoke tests for `init`, `status`, `validate`, and `render`.
5. Publish as a private or GitHub package first.

Do not add a server or UI to the first package. The CLI should prove the artifact contract.

## Review Workbench

The first UI should be a review workbench, not a Canva clone.

Useful first screen:

- slide thumbnails,
- current rendered slide,
- speaker notes,
- claim IDs and source links,
- screenshot or browser QA issues,
- critique comments,
- repair status,
- "copy repair prompt" or "ask agent to repair this slide" action.

What it should not do first:

- freeform drag-and-drop editing,
- full theme marketplace,
- collaborative editing,
- native PowerPoint editing.

Those are expensive and less important than making the deck clear, sourced and repairable.

## Editing Model

Keep edits artifact-first:

- Story edits change `work/slide-sorter.md` or `work/story-spine.json`.
- Claim edits change `work/claim-ledger.json` and slide claim refs.
- Design edits change `work/design-contract.json` or the HTML/CSS renderer.
- Slide-local edits change one slide spec or one HTML section.
- QA edits append to `qa/` and update repair status.

The workbench should make these edit scopes visible. That keeps agent repairs targeted and reduces accidental whole-deck rewrites.

## Later UI Milestones

1. Static review viewer: reads a project folder and displays artifacts next to the deck.
2. Local dev server: watches `work/` and reloads the deck after render.
3. Comment capture: writes slide comments into `qa/review-notes.json`.
4. Repair prompt builder: packages slide spec, screenshot issue, related claims and design contract for Codex.
5. Controlled visual editor: exposes safe fields such as title, bullets, source label, chart values and theme tokens.

Build the UI only after the CLI can reliably create, validate, render and QA a deck.

## Template Studio

After the review workbench, add a template studio. Its job is to create and graduate reusable style packs.

Minimum useful version:

- pick an existing deck project,
- generate 3 style previews,
- preview the same five slide types in each style: title, table, timeline, comparison and appendix,
- score each preview on clarity, distinctiveness, source/footer safety, mobile behavior and density handling,
- save the winning system as `design-systems/<style>/DESIGN.md` plus `templates/design-contracts/<style>.json`,
- add a small preview example under `examples/`.

This is the path to creating styles as strong as `frontend-slides` while keeping this repo's source-grounding and QA discipline.

The first static step exists at `examples/style-workbench/`. It is not a full editor; it is a style picker that exports a design prompt and design-contract JSON.

## Presenter Console

Marp already provides a useful presenter view. A future custom HTML renderer should meet or exceed it before replacing that path for live talks.

Minimum useful custom console:

- audience window and presenter window stay in sync,
- current slide, next slide and speaker notes are visible,
- elapsed timer and slide timing are visible,
- overview can jump to any slide,
- presenter controls do not overlay the 16:9 stage,
- backup link opens the normal audience deck if sync fails.

## Motion And Video

HyperFrames is a useful future reference for deck-to-video work because it treats HTML, CSS, media and seekable animation as deterministic video compositions. Do not pull it into the first package. First, keep the slide workflow stable; then explore a separate export path that translates `design-contract.json` into a video-facing `frame.md` or equivalent.

Useful product lesson from the public HyperFrames design page:

- keep a reusable `design.md` for the visual system,
- create a separate `frame.md` for a specific 16:9 composition,
- specify pacing, scale, dwell and motion as part of the artifact,
- preview frame recipes before asking the agent to render a full video.

That maps well to a future `slides-generator` path: deck contract -> selected slide/frame spec -> HTML preview -> deterministic video export. Keep it separate from the first static slide workflow so the core deck QA remains simple.
