# Make Deck Workflow

Use this workflow for a new deck.

1. Create a project folder from `projects/_template`.
2. Put user material in `input/`.
3. Fill `input/brief.md`. For one-shot requests, use `skills/slide-generator/references/intake-and-one-shot.md`, ask missing material questions once, and record defaults as assumptions.
4. Run source review.
5. Run codebase review if code exists.
6. Create claim ledger and architecture map.
7. Create audience model.
8. Create story spine.
9. Create slide sorter.
10. Create visual aid plan.
11. Propose theme options or create a design contract from an approved template.
12. Create slide specs.
13. Run deterministic checks before rendering.
14. Render HTML.
15. Inspect rendered HTML.
16. Run critique, deterministic claim checks, source audit, browser QA, and export QA when exporting.
17. Stop for human review after the rendered draft and QA report.
18. Write review decisions to `work/review-log.json`.
19. Repair targeted failures.
20. Export PPTX/PDF when requested and only after QA passes.

Do not render before `work/intake-brief.md` has a clear deck goal and the slide sorter is coherent.
