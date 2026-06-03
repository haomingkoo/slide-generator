# Design Skill Adoption Review

This review answers one narrow question: which external design skills should shape this repo, and which ones are actually in use.

## Current Status

The repo has one runtime skill: `slide-generator`. It is mirrored into:

- `skills/slide-generator`
- `.agents/skills/slide-generator`
- `.claude/skills/slide-generator`

The repo does not automatically load every design skill installed on this machine. External skills are treated as sources of process lessons unless their checks are implemented in scripts, docs, templates, or the slide-generator skill itself.

## Actual Usage

| Skill or pattern | Actually installed locally | Implemented in this repo | Decision |
|---|---:|---:|---|
| Anthropic `frontend-design` / Codex frontend equivalent | Not exact | Partly represented by `design-quality-gates.md` | Do not add a second generic frontend skill. Use slide-specific gates. |
| `impeccable` | Yes | Partly represented by design contract, theme discipline, and anti-generic checks | Use as optional review inspiration, not a repo dependency. |
| Figma implementation skills | Available in curated cache, not installed as active repo capability | No | Later, after brand observation is deterministic. |
| Playwright / webapp testing | Playwright is now a repo dev dependency | Yes, via `scripts/browser-qa-marp.mjs` | Adopt now. This is the highest-value validation loop. |
| Designer skills collections | Not active | No | Do not import wholesale. Too broad for this repo. |
| `theme-factory` | Available in `/tmp/awesome-codex-skills` during review | Partly, via `design-contract.json` and Marp themes | Adopt the token idea, not the preset-theme chooser as-is. |
| Design process pack | Available in `/tmp/julian-designer-skills` during review | Partly, via intake, story spine, design contract, QA | Keep our slide-specific process. |
| Composio skill | Not active | No | Later for source ingestion, not core rendering. |
| Excalidraw diagram skill | Reviewed from source, not active | No | Later for editable diagrams after asset validation exists. |
| `accesslint` | Reviewed from source, not active | Partly, via browser contrast checks | Use executable contrast/overflow checks first; add full a11y engine later if needed. |

## What We Learned

### Frontend Design And Impeccable

Generic frontend design skills are useful because they force a model to choose a visual direction instead of producing default card grids. The repo should not depend on personal global skills, though. The durable adoption is:

- `work/design-contract.json` records the visual memory.
- `references/design-quality-gates.md` blocks generic generated-design tells.
- Marp themes use stable type and spacing scales.
- Browser QA checks the rendered artifact.

### Playwright / Webapp Testing

This is the most important imported lesson. A slide agent without browser feedback is visually blind. The repo now uses Playwright to:

- open the rendered Marp HTML,
- check slide and presenter-note counts,
- capture screenshots,
- detect console errors,
- detect section overflow and out-of-bounds elements,
- run a focused text-contrast check,
- verify keyboard navigation,
- verify step-reveal fragments when motion is requested.

The report is written to `qa/browser-qa.json`.

### Theme Factory

The good idea is not "pick one of ten pretty palettes." The good idea is reusable design tokens. This repo should keep themes as contracts:

- `tokens.colors`
- `tokens.typography`
- `tokens.spacing`
- `patterns`
- `rules`
- `decisions`

Future work should add brand extraction and theme generation, but only after the extractor records evidence for every color, font, and logo decision.

### Design Process Packs

The useful pattern is phase discipline:

1. Ask only material questions.
2. Write a brief.
3. Define audience and information architecture.
4. Choose tokens.
5. Build.
6. Review screenshots.

The slide-specific version is now:

1. `intake-brief.md`
2. `source-map.md`
3. `claim-ledger.json`
4. `audience-model.json`
5. `story-spine.json`
6. `slide-sorter.md`
7. `visual-aid-plan.json`
8. `design-contract.json`
9. `slide-specs.json`
10. rendered HTML
11. browser QA
12. PPTX/PDF export when requested

### Excalidraw

The Excalidraw skill has a strong diagram principle: diagrams should argue visually, not just display boxes. This repo should adopt that standard for visual aids, but the renderer should not emit `.excalidraw` until it can:

- validate the file exists,
- render it to SVG or PNG,
- inspect the exported asset,
- fall back to static structure when the asset fails.

### Accesslint

The reviewed accesslint skill reinforces that accessibility should be measured where possible. The current repo implements a first slice directly in browser QA: contrast, overflow, keyboard navigation, and presenter controls. A full a11y engine can come later if HTML decks become interactive beyond slide navigation.

## Near-Term Adoption Order

1. Keep Playwright browser QA in CI.
2. Keep `design-contract.json` required for render fixtures.
3. Expand `audience-model.json` and `story-spine.json` into real deck projects.
4. Add export validation for PPTX/PDF.
5. Add brand extraction only when source evidence can be recorded.
6. Add editable diagram formats only when rendered visual assets can be validated.

## Operating Principles

- Be humble: label assumptions and limits instead of hiding them.
- Keep integrity as a hard requirement: no fake sources, fake benchmarks, fake customer quotes, or unsupported claims.
- Stay technical where accuracy matters: claims, architecture, code paths, export behavior, and visual QA should be backed by artifacts or executable checks.
- Communicate plainly: a deck is successful only when the audience can understand, question, and retell the point.
- Make impressive work through craft, not exaggeration.

## Explicit Non-Goals For Now

- Do not claim native Google Slides generation yet.
- Do not claim Figma import until Figma asset evidence exists.
- Do not claim full WCAG coverage from the current contrast helper.
- Do not add broad external skill packs as runtime dependencies.
- Do not let animation bypass reduced-motion fallback or browser validation.
