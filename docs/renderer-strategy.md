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

The first renderer should consume `slide-specs.json` and produce:

```txt
projects/<name>/deck/index.html
projects/<name>/qa/screenshots/
projects/<name>/qa/qa-report.md
```

Start with a conservative feature set:

- title slide,
- section divider,
- one-column narrative slide,
- two-column comparison slide,
- table slide,
- code-snippet slide,
- simple architecture flow slide,
- speaker notes.

Do not build PPTX export until the HTML path can pass one real rendered eval.
