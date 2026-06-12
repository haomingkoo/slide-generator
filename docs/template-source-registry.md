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
| Refero Styles / Refero Skill | Public style-system pages and a research-first design skill | Reference-lock workflow, style-detail artifact shape, anti-slop QA and visual research discipline | Refero Skill is MIT; Refero Styles screenshots and hosted style pages are reference-only unless licensing is explicit | reference |
| VoltAgent `awesome-design-md` | MIT collection of AI-readable `DESIGN.md` files and preview catalogs | Candidate source for design-contract structure, preview UX and style taxonomy | MIT; still avoid using brand names as public style labels | candidate-reference |
| `pptx-design-styles` by TodayCode | 30 PPTX style descriptions with colors, fonts, layout and signature elements | Reference for PPTX style taxonomy and style-selection prompts | README says MIT, but GitHub has no detected license file; do not vendor until verified | reference-only |
| OpenAI `frontend-skill` | Composition-first frontend guidance, visual hierarchy, intentional motion and Playwright verification | Reference for workbench UX and frontend QA discipline | Curated OpenAI skill; install through Codex skill installer for local use | reference |
| Owl-Listener `designer-skills` | Broad design-skill collection covering research, systems, UI, interaction, delivery and inclusive design | Candidate source for design process taxonomy and specialist routing | MIT; inspect individual plugin/skill before adopting rules | candidate-reference |
| Composio `theme-factory` | Reusable theme tokens, palettes and font pairings | Candidate source for theme-token generation and style showcase ideas | Community skill; inspect `theme-factory/SKILL.md` before importing | candidate-reference |
| Excalidraw diagram skills | Whiteboard-style diagram generation from text or codebase analysis | Candidate diagram route for architecture/workflow slides when Mermaid feels too rigid | Inspect license and output format per repo; do not assume `.excalidraw` files are presentation-ready without visual QA | candidate-reference |
| User-provided slide exports | Private pattern references from PDF, PPTX, HTML or screenshots | Extract local pattern notes only | Do not commit raw files, screenshots or assets | private-reference |

## Import Criteria

A source can be vendored only when:

- license allows reuse,
- copyright and license notice are preserved,
- copied scope is intentionally small,
- private/proprietary assets are excluded,
- the workbench or docs clearly credit the source,
- a small validation or browser review confirms the imported templates are usable.

## Public Naming Rule

Do not use company or product names as public style categories unless the user owns that brand or explicitly asks for a private internal comparison. Public UI should use neutral labels such as `Consulting Clarity`, `Frame Design`, `Design Contract` or `Technical Grid`.

Company and product names can appear in:

- attribution links,
- license notices,
- private research notes,
- source registries,
- examples where the point is factual comparison, not imitation.

They should not appear as promises like "make this in X's style" or "Y-style deck" in exported prompts.

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
3. Study Refero-style detail pages for the artifact shape: preview, palette, typography, spacing, components, guidelines and copyable `DESIGN.md`.
4. Add WebSlides component patterns as reference cards, excluding demo images.
5. Add a Slidev theme discovery note, but do not vendor assets until each theme license is checked.
6. Study OpenAI `frontend-skill`, Owl-Listener design skills and theme-factory as process references for a future design-skill bank.
7. Add Mermaid/Excalidraw routing for architecture and workflow slide jobs.
8. Add a `scripts/import-template-source.mjs` only after at least two sources need the same import workflow.
