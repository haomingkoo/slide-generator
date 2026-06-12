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
