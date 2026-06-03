# Workflow Reference

## Intake Questions

Ask only for missing information that materially affects the deck:

- Who is the audience?
- What decision, belief, or action should the deck drive?
- Is this live presentation or async reading?
- How long is the talk?
- Can external research be used?
- Are there brand guidelines or example slides?
- Is the requested output HTML, PDF, PPTX, or all of them?

For one-shot deck generation, read `intake-and-one-shot.md`. Ask missing material questions once, then proceed with explicit defaults recorded as assumptions.

## Artifact Order

1. `intake-brief.md`
2. `source-map.md`
3. `codebase-review.md` when code exists
4. `claim-ledger.json`
5. `architecture-map.json` when architecture exists
6. `audience-model.json`
7. `story-spine.md`
8. `slide-sorter.md`
9. `visual-aid-plan.json`
10. `theme-options.md`
11. `slide-specs.json`
12. rendered deck
13. QA reports

## Repair Routing

- Story unclear: repair `story-spine.md` and `slide-sorter.md`.
- Too wordy: repair slide titles, body copy, and notes across `slide-specs.json`.
- One slide ugly: repair only that slide spec and render.
- Claim failed: repair `claim-ledger.json` and affected slides.
- Diagram inaccurate: repair `architecture-map.json`, then diagram slide.
- Theme disliked: repair theme selection and rerender visual layer without changing claims.
