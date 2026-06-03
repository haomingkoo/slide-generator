# Status And Roadmap

## Current Status

`slides-generator` is an early render-capable slide-generation scaffold with executable guardrails.

Done:

- Codex skill mirror in `.agents/skills/slide-generator`.
- Claude Code skill mirror in `.claude/skills/slide-generator`.
- One-shot intake contract.
- Common deck-operation routing.
- Source-grounding policy.
- Product workflow lessons from Gamma, Figma Slides, Gemini, Canva, Plus AI, and SlideSpeak.
- Deterministic claim-ledger validator.
- Deterministic slide claim-reference linter.
- Deterministic architecture evidence validator.
- Deterministic audience-model validator.
- Deterministic story-spine validator.
- Deterministic slide-spec validator.
- Deterministic design-contract validator.
- First Marp HTML renderer.
- Rendered HTML inspection for slide count, presenter notes, and slide IDs.
- Browser QA for slide count, presenter notes, keyboard navigation, screenshots, overflow, contrast, and step-reveal fragments.
- Multi-viewport browser QA for standard 16:9, laptop review, and smaller review windows.
- PPTX/PDF export command through Marp after browser QA passes.
- Export inspection that reports Marp PPTX image-based editability boundaries.
- Optional Marp screenshot export for manual visual review.
- Three Marp themes.
- Starter slide-spec templates for pitch, teaching, and technical architecture decks.
- Starter design-contract templates for the three Marp themes.
- Design contract reference for persistent theme, spacing, typography, pattern, and decision memory.
- Design quality gate reference for content discipline, hierarchy, accessibility, anti-generic design, screenshot review, and polish.
- Positive and negative validator fixtures.
- GitHub CI.
- Artifact starter generator for local deck projects.
- Workflow status and local runner commands.
- Initial brand extraction from text-based brand files.
- Source-backed demo deck under `examples/source-grounded-demo`.
- Content-priority workflow for main deck versus appendix decisions.

Not done:

- Full automatic artifact generation from arbitrary source corpora.
- Image-based brand sampling from screenshots, logos, and decks.
- Code snippet evidence validator.
- Native PPTX template editor.
- Native Google Slides API export.
- Full accessibility engine beyond the focused browser QA checks.
- Pixel-accurate contrast checks over gradient or image backgrounds.

## Near-Term Roadmap

1. Add a native editable PPTX workflow for decks that require PowerPoint text editing.
2. Add brand observation from CSS, website screenshots, and uploaded decks.
3. Add code-snippet evidence validation.
4. Compare skill output against a one-shot baseline.
5. Add PPTX-specific visual QA and template analysis.
6. Add native Google Slides export only after auth, import, and formatting risks are designed.

## MVP Bar

The first MVP should produce one complete HTML deck from committed source material:

- claim-ledger passes,
- slide claim references pass,
- architecture evidence passes when architecture exists,
- audience model and story spine pass for presentation-oriented decks,
- design contract passes,
- rendered HTML inspection passes,
- browser visual QA passes,
- PPTX/PDF basic export check passes when requested,
- source audit has no unsupported factual claims,
- speaker notes are usable for a live talk.
