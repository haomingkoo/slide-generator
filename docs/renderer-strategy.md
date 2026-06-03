# Renderer Strategy

The first renderer should target standalone HTML before PPTX.

## Why HTML First

HTML gives the project a faster quality loop:

- browser screenshots are easy to automate,
- overflow and contrast can be checked in the DOM,
- speaker notes and presenter views are possible,
- PDF export can come later through the browser,
- custom diagrams and mockups are easier than in PPTX.

Editable PPTX is still important, but it needs stricter rules around slide masters, theme colors, native charts, and layout objects. That is a later layer.

## Reference Format: Marp-Style HTML

The `amd-redteam-audit-deck-2026-06-03.html` example is a Marp/Marpit standalone HTML deck:

- slides are fixed `1280x720` pages,
- each slide is rendered as SVG with `foreignObject`,
- navigation is handled by the Bespoke/Marp runtime,
- presenter view is built in through `?view=presenter`,
- overview and fullscreen controls are included,
- speaker notes can be shown in presenter mode.

That format is a strong MVP target because it is self-contained, presentation-ready, and browser-testable.

## First Renderer Contract

The first renderer consumes `work/slide-specs.json` and can produce:

```txt
projects/<name>/deck/index.html
projects/<name>/deck/index.md
projects/<name>/deck/speaker-notes.txt
projects/<name>/qa/browser-qa.json
projects/<name>/qa/browser-screenshots/
projects/<name>/deck/exports/
```

Implemented feature set:

- title slide,
- section divider,
- one-column narrative slide,
- two-column comparison slide,
- table slide,
- code-snippet slide,
- simple architecture flow slide,
- speaker notes.
- step-reveal fragments,
- restrained slide transitions,
- browser screenshot QA,
- PPTX/PDF export after QA.

Run:

```bash
npm run render:marp -- projects/my-deck --html
npm run inspect:marp -- projects/my-deck
npm run qa:browser -- projects/my-deck
npm run screenshots:marp -- projects/my-deck
npm run export:marp -- projects/my-deck --pptx --pdf
```

## Export Policy

PPTX/PDF export is available through Marp after the HTML path passes inspection and browser QA. This is an export layer, not a native PowerPoint template editor.

Google Slides support is currently a handoff path: export PPTX, then import the PPTX into Google Slides. Native Google Slides API generation is future work because it requires authentication, template mapping, and separate formatting validation.
