# Memory Management

The skill should target 90 percent useful output without repeatedly loading everything.

## Artifact Summaries

After each phase, save the result to disk and rely on the artifact rather than chat memory.

```txt
source corpus -> source-map.md + claim-ledger.json
codebase -> codebase-review.md + architecture-map.json
story -> story-spine.md + slide-sorter.md
visuals -> visual-aid-plan.json + slide-specs.json
render -> screenshots + qa-report.md
```

## Context Budget Modes

### Corpus-Intake Mode

Use when creating the first `source-map.md`, `claim-ledger.json`, or `codebase-review.md` from a large source corpus.

- Process sources by section, page range, module, or directory.
- Save source summaries and candidate claims as you go.
- Discard raw chunks after they are represented in artifacts.
- Keep page numbers, file paths, line ranges, URLs, and extraction caveats.
- Do not use whole-corpus context again for slide-local repairs.

### Whole-Deck Mode

Use when the request affects global narrative:

- improve flow,
- make the deck concise,
- reorder slides,
- change audience,
- change presentation length,
- run title-only test.

Load: `story-spine.md`, `slide-sorter.md`, slide titles and body summaries, not every source.

### Slide-Local Mode

Use when the request affects one slide or a small set:

- fix this slide,
- make this diagram clearer,
- improve this chart,
- change the visual aid,
- repair screenshot overflow.

Load: selected `slide_spec`, screenshot, theme, related claim IDs.

### Source-Audit Mode

Use when accuracy is questioned:

- check this claim,
- verify all stats,
- no hallucination pass,
- audit against original files.

Load: `claim-ledger.json`, affected source excerpts, affected slide specs.

### Code-Audit Mode

Use when code or architecture is involved:

- explain architecture,
- show key snippets,
- verify feature exists,
- build Mermaid diagram from code.

Load: `codebase-review.md`, `architecture-map.json`, selected files or snippets.

## Token Rule

Never spend whole-corpus context to fix a local rendering problem. Never spend local context to decide global story flow.

For screenshot QA, re-render and re-check only affected slides after a local repair. Run whole-deck screenshot QA for final export or global theme changes.
