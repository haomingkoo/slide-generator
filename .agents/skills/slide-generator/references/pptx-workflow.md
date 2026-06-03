# PPTX Workflow

Use whenever PowerPoint files are input, output, templates, or references.

## Reading Existing Decks

Analyze both text and visuals:

1. Extract text.
2. Generate slide thumbnails.
3. Identify layouts, theme, fonts, density, and repeated components.
4. Note placeholder text and template constraints.

## Template-Based Editing

When a template exists:

1. Map each planned slide to a template layout.
2. Vary layouts intentionally.
3. Complete structural slide changes before text edits.
4. Replace every placeholder, including icons, captions, and images.
5. Remove unused template elements instead of clearing text only.
6. Render to images and visually inspect.

## Creating PPTX From Scratch

Use native PPTX objects when editability matters:

- theme colors,
- theme fonts,
- slide masters,
- reusable layouts,
- editable text,
- native charts where feasible.

Use image-based slides only when pixel-perfect fidelity matters more than editability.

## Current Marp Export Boundary

The repo's first export path uses Marp CLI for PPTX/PDF handoff. Treat that PPTX as a visual handoff unless export inspection proves native editable text exists.

Do not promise:

- editable PowerPoint text,
- preserved slide masters,
- native template layouts,
- editable charts,
- native Google Slides objects.

When editability matters, create or edit a native PPTX workflow instead of relying on Marp export.

## PPTX QA

Fail if:

- title/body placeholder text remains,
- new slides do not start on-brand,
- theme fonts/colors are missing for editable mode,
- text overflows or wraps badly,
- layout repetition makes the deck monotonous,
- code snippets or charts are rasterized when editability was required,
- Marp PPTX export is described as editable without verification,
- exported images show overlap, clipping, or low contrast.

Assume the first render has issues. Fix and verify at least once.
