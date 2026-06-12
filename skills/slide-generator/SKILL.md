---
name: slide-generator
description: Build source-grounded, visually strong presentation decks from dumped files, codebases, research notes, brand guidelines, and rough outlines. Use this skill whenever the user wants to create, improve, audit, render, or iterate on slides, slide decks, talk scripts, speaker notes, presentation visuals, architecture diagrams, before/after comparisons, teaching demos, or HTML/PPTX presentation artifacts, even if they do not explicitly say "deck generator."
---

# Slide Generator

Create presentation-ready decks through verified artifacts. Do not jump from raw notes to rendered slides.

## Default Flow

1. Intake the deck job: audience, purpose, live vs async, time limit, target slide count, Q&A needs, output format, brand, research mode, style preference.
2. For complex, public, client-facing, or unclear decks, run Planning Mode before slide specs.
3. Review sources and code before writing claims.
4. Build `claim-ledger.json` and, when code exists, `architecture-map.json`.
5. Choose the deck archetype, opening hook, and proof spine before writing the full story.
6. Write the audience model, story spine, and title-only slide sorter.
7. Prioritize content against talk length, audience questions, claim strength, and backup needs.
8. Check research coverage. If evidence is thin, missing, stale, or conflicted, search only when allowed or ask for sources.
9. Choose the deck quality mode, benefit statement, and proof bar.
10. Record the phase loop and completion criteria for long-running jobs.
11. Choose visual aids for hard ideas.
12. Offer theme options when taste is unclear.
13. Create slide specs.
14. Render.
15. Run critique, deterministic claim checks, source audit, browser QA, quality scoring, export QA, and targeted repair.
16. Humanize speaker notes and final copy without adding claims, then re-run source audit over edited notes.
17. When the deck reveals a reusable failure, write the lesson into `qa/`, a reference file, a validator, a template, or an eval. Compress repeated fixes into simpler rules instead of adding endless one-off guidance.

## One-Shot Drafting

When the user wants to generate a deck from one prompt, read `references/intake-and-one-shot.md`. Capture the deck contract, ask only material missing questions in one batch, then proceed with explicit defaults recorded as assumptions. One-shot does not bypass the claim ledger, slide sorter, slide specs, critique, source audit, or QA.

## Common Operations

For existing-deck edits such as proofread, simplify, executive summary, audience adaptation, translation, action titles, agenda/dividers, website-to-deck, brief-to-deck, and speaker notes, read `references/deck-operations.md`. It defines the smallest useful context for each operation so simple edits do not trigger the full planning pipeline.

## Memory Rules

- Use whole-deck context only for story, title-only review, and conciseness passes.
- Use slide-local context for visual repair: one slide spec, screenshot, theme, and related claim IDs.
- Use claim IDs for source audit. Do not reload the whole source corpus unless the ledger is missing or suspect.
- Use architecture IDs and snippet IDs for code-heavy slides.
- Summarize completed work into artifacts before clearing or narrowing context.

## Accuracy Rules

- No factual claim appears in a slide without a claim ID.
- No diagram node or edge appears without source, code, or an inference label.
- No fake citations, fake customers, fake benchmarks, fake quotes, or invented features.
- If the evidence is directional, say so.
- If the user disables research, use only their files and code.

## Theme Rules

Dark mode is not the default. Pick theme by audience, setting, and brand.

- Use clean light themes for consulting, academia, classroom, print, and conservative audiences.
- Use dark runtime themes for security, systems, observability, dramatic demos, or when requested.
- Use brand-derived themes when brand assets or guidelines exist.
- If unsure, produce 2 or 3 title-slide previews before rendering the full deck.

## References

Read only what the task needs:

- `references/workflow.md`: artifact sequence and repair loops.
- `references/planning-mode.md`: pre-render planning mode for deck logic, communication, design directions, research loops, and go/no-go gates.
- `references/goal-and-loop.md`: goal contract, phase gates, critique loop, learning rules, and completion criteria.
- `references/intake-and-one-shot.md`: one-prompt deck contract, defaults, and source-handling modes.
- `references/deck-operations.md`: existing-deck edit operations and context routing.
- `references/audience-and-presenter-support.md`: audience model, story spine, speaker notes, likely questions, jargon, objections, and Q&A support.
- `references/content-prioritization.md`: main deck versus backup versus dropped content when sources exceed the slide/time budget.
- `references/deck-archetypes-and-hooks.md`: opening-hook selection and routing to the right deck mode/template.
- `references/deck-quality-benchmark.md`: mode-specific standards for fundraising, hackathon/demo, executive, technical, and teaching decks.
- `references/research-coverage.md`: source sufficiency, research triggers, evidence gaps, source quality, and technical proof depth.
- `references/memory-management.md`: token-efficient iteration.
- `references/source-grounding.md`: claim ledger and audit rules.
- `references/visual-aid-catalog.md`: comparison, mechanism, demo, and teaching visuals.
- `references/theme-selection.md`: light, dark, brand, and audience-fit decisions.
- `references/design-contract.md`: persistent design memory for tokens, layout patterns, and visual decisions.
- `references/design-quality-gates.md`: hierarchy, clutter, accessibility, anti-generic design, and polish review after rendering.
- `references/quality-score-loop.md`: researcher, critic, designer, and repairer score loop with thresholds and stop conditions.
- `references/codebase-review.md`: architecture maps and code snippet selection.
- `references/brand-system.md`: brand extraction and brand-safe theme creation.
- `references/frontend-rendering.md`: HTML/CSS rendering quality.
- `references/pptx-workflow.md`: PowerPoint input, output, template, and QA workflow.
- `references/pdf-ingestion.md`: PDF extraction and OCR workflow.
- `references/product-workflow-lessons.md`: durable lessons from Gamma, Figma Slides, Gemini Slides, Canva, Plus AI, and SlideSpeak.
- `references/evals.md`: how to test this skill.

For the maintainer-level continuous-improvement loop, see `docs/heuristic-slide-system.md` in the repo.
