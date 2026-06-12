# Template Source Registry

This registry tracks where the repo can learn slide designs from, what may be imported, and what must stay reference-only.

The rule is simple: import only when the license and attribution path are clear. Otherwise, extract patterns and link the source.

## Sources

| Source | What It Offers | Use In This Repo | License / Caution | Status |
|---|---|---|---|---|
| `frontend-slides` by Zara Zhang | Agent workflow, style discovery, fixed-stage HTML, 34 bold template references | Vendored reference pack and progressive-loading workflow | MIT, credit preserved in `vendor/frontend-slides/` | imported |
| `beautiful-html-templates` by Zara Zhang | 34 reusable HTML slide templates with metadata and gallery | Upstream template source for future direct import or comparison | MIT, preserve copyright and template notices | candidate |
| `html-ppt-skill` by lewis | 36 themes, 15 full-deck templates, 31 layouts, animations and true presenter mode | Candidate import for themes, layouts, presenter-mode ideas and gallery UX | MIT, inspect files before vendoring | candidate |
| HyperFrames by HeyGen | HTML-to-video framework, `design.md` / `frame.md` workflow, premade frame catalog, agent skills, deterministic MP4 rendering | Reference for future deck-to-video, motion exports and `frame.md` translation from slide design contracts | Apache-2.0; repo uses Git LFS for large MP4 baselines, avoid full clone unless needed | candidate-reference |
| WebSlides | HTML presentation framework, demos, 40+ components, equal-height blocks, keyboard/touch navigation | Pattern source for components and page/slide HTML grammar | MIT for code; demo images/logos are not reusable unless separately licensed | candidate-reference |
| reveal.js | Mature HTML presentation runtime with themes, speaker notes, export and API | Renderer inspiration and possible future renderer option | MIT, preserve license if code is used | reference |
| Slidev themes | Official and community themes for developer presentations | Theme inspiration and possible future Slidev renderer support | Code MIT; images/assets may be CC BY-NC-SA or vary by package | reference |
| Coolors / Happy Hues / Adobe Color / Color Hunt | Palette discovery and color-in-context examples | Palette inspiration and exported source links | Palette inspiration only; do not imply endorsement | reference |
| Ampler / Slideworks / SlideGenius consulting references | Consulting deck examples, BCG-style slide-writing guidance, agency portfolio examples | Communication discipline and layout pattern inspiration | Reference-only; do not copy proprietary decks, screenshots or client work | reference |
| User-provided Gamma/PPTX/PDF downloads | Private pattern references | Extract local pattern notes only | Do not commit raw files, screenshots or assets | private-reference |

## Import Criteria

A source can be vendored only when:

- license allows reuse,
- copyright and license notice are preserved,
- copied scope is intentionally small,
- private/proprietary assets are excluded,
- the workbench or docs clearly credit the source,
- a small validation or browser review confirms the imported templates are usable.

## HyperFrames Notes

HyperFrames should be studied as a motion and frame-composition layer, not imported as another static theme pack yet.

Observed public design-page pattern:

- `design.md` describes the visual brand.
- `frame.md` directs a single 16:9 composition.
- The frame spec should make pacing, scale, dwell and motion explicit.
- Static hierarchy and source legibility must pass before adding motion.

Premade frame names observed from the public design page:

- Biennale Yellow
- BlockFrame
- Blue Professional
- Bold Poster
- Broadside
- Capsule
- Cartesian
- Cobalt Grid
- Coral
- Creative Mode
- Daisy Days
- Editorial Forest

These overlap with several `frontend-slides` / bold-template visual directions. Treat them as inspiration for future deck-to-video export and interactive preview work. Do not copy hosted assets, screenshots or generated video files.

## Next Candidates

1. Import selected `html-ppt-skill` metadata only, not full runtime, then add it as a second workbench template source.
2. Study HyperFrames `frame.md` and presenter/motion patterns for a future deck-to-video export path.
3. Add WebSlides component patterns as reference cards, excluding demo images.
4. Add a Slidev theme discovery note, but do not vendor assets until each theme license is checked.
5. Add a `scripts/import-template-source.mjs` only after at least two sources need the same import workflow.
