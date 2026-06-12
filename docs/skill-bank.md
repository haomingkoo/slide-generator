# Slide Generator Skill Bank

This repo's skill bank is the operating system for source-backed deck work. It should help an agent decide what kind of deck problem it is facing, which module to use, what artifacts to edit, and how to verify the result.

The goal is not to collect prompts. The goal is to maintain a tested set of deck-making capabilities that can absorb feedback and keep improving.

## Operating Model

Every serious deck run should follow this loop:

1. Sense: inspect the brief, project artifacts, sources, rendered deck, QA files and review logs.
2. Select: choose the smallest relevant skill module.
3. Act: edit the right artifact, not the whole repo.
4. Verify: run the closest deterministic check or browser review.
5. Remember: write durable lessons into review logs, the heuristic registry, docs, templates, validators or examples.
6. Compress: replace repeated local fixes with a simpler reusable rule or tool.

## Skill Modules

| Module | Job | Primary artifacts | Verification | Maturity |
|---|---|---|---|---|
| Intake | Turn a messy request into a deck contract. | `input/brief.md`, `work/intake-brief.md` | `npm run workflow:status -- <project>` | tested |
| Planning | Decide audience shift, proof spine, slide logic, research plan and theme direction before slide specs. | `work/deck-plan.md`, `work/story-spine.json`, `work/slide-sorter.md` | title-only review, story validator | tested |
| Source-Backed Research | Convert sources into claims with confidence, caveats and slide-use limits. | `work/source-map.md`, `work/claim-ledger.json` | `npm run validate:ledger -- <project>`, `npm run lint:claim-refs -- <project>` | tested |
| Content Priority | Decide what belongs in main deck, backup, appendix or nowhere. | `work/content-priority.md` | human review and slide-count fit | absorbed |
| Visual Aid Selection | Pick tables, charts, diagrams, timelines, maps, screenshots or image panels based on the slide job. | `work/visual-aid-plan.json`, slide specs | slide-spec validation, rendered review | absorbed |
| Visual Style System | Choose or create a design contract from audience, brand and references such as Gamma, Canva, Figma Slides or frontend-slides. | `work/design-contract.json`, `design-systems/`, `templates/design-contracts/` | `npm run validate:design -- <project>`, Playwright screenshots | absorbed |
| Rendering | Convert slide specs to fixed presentation output. | `work/slide-specs.json`, `deck/` | `npm run render:marp -- <project> --html`, `npm run inspect:marp -- <project>` | tested |
| Browser Visual QA | Catch overflow, footer/source collisions, stale browser state, bad mobile controls and unreadable layouts. | `qa/browser-qa.json`, screenshots | `npm run qa:browser -- <project>` plus manual screenshot review for custom HTML | tested |
| Quality Loop | Score, critique and repair from researcher, critic, designer and delivery lenses. | `work/quality-rubric.json`, `qa/slide-scorecard.json`, `qa/repair-plan.json` | `npm run deck:score -- <project>`, `npm run deck:iterate -- <project>` | tested |
| PPTX/PDF Ingestion | Study existing deck files for content, layout grammar, theme and export constraints. | source extracts, `template_intelligence.json` in future | PDF/PPTX extraction checks, source audit | absorbed |
| Heuristic System | Promote repeated failures into docs, skill rules, validators, templates, examples or evals. | `docs/heuristic-registry.md`, `work/review-log.json`, `qa/` | `npm run heuristic:status -- <project>` | tested |
| Publishing | Publish HTML examples and verify live output. | `examples/`, GitHub Pages output | live fetch, browser review, export QA if needed | absorbed |

## Command Layer

Use these commands as the agent's executable interface:

| Command | When to use |
|---|---|
| `npm run deck:agent -- <project>` | Ask the repo what module and action should run next. |
| `npm run workflow:status -- <project>` | Check artifact completeness and freshness. |
| `npm run heuristic:status -- <project>` | Check what the repo has learned and which lessons apply. |
| `npm run deck:build -- <project> --render` | Validate render readiness, render, inspect and browser-QA a Marp deck. |
| `npm run deck:iterate -- <project> --threshold 88` | Run the deterministic build and quality validation loop after critique artifacts exist. |
| `npm test` | Regression check before committing repo-level changes. |

The command layer is intentionally small. Codex or Claude still performs judgment, research, writing and design repair; scripts provide state, gates and repeatable checks.

## Maturity Levels

- `proposed`: useful idea, not yet encoded enough to trust.
- `absorbed`: encoded in docs, skill guidance, templates or examples.
- `tested`: covered by a validator, QA script, eval, committed example or repeatable command.
- `compressed`: folded into a simpler rule or tool; old narrow rules can be removed.

Promote a module only when it prevents a real failure or speeds up a real workflow. Do not create modules for every nice idea.

## Reference Policy

Tools like Gamma, Canva, Figma Slides, Plus AI, SlideSpeak and frontend-slides are pattern libraries. Learn their workflow and layout grammar, but do not copy proprietary templates, private account exports or raw downloaded assets into the repo unless the user explicitly asks and licensing/privacy has been checked.

For user-provided references, extract durable patterns:

- intake modes,
- outline checkpoints,
- slide-local versus deck-level edits,
- design direction previews,
- template intelligence,
- fixed-size export QA,
- visual layout patterns,
- editing and presenter controls.

Useful visual patterns observed from user-provided Gamma/PDF/PPTX exports:

- split cover,
- image-led problem rail,
- hero metric plus evidence,
- 2x3 metric constellation,
- ask panel,
- alternating image rail,
- equal-height card row,
- obstacle matrix,
- commitment rows,
- numbered challenge rows,
- budget allocation ladder,
- KPI strip,
- persona card.

Every extracted pattern must answer: what slide job does it solve, what evidence does it need, what copy budget keeps it readable, and what browser QA failure would invalidate it.

Reusable style packs created from references:

- `warm-editorial-light`: human-centered teaching, demos and product stories.
- `clean-surgical-light`: executive, consulting and source-heavy decks.
- `dark-runtime`: technical, security and system decks.
- `cool-campaign-light`: campaign strategy, launch, go-to-market and marketing proposal decks.

## Deep-Agent Behavior

A deep agent in this repo should be able to:

1. inspect a project,
2. identify the active failure mode,
3. choose the right skill module,
4. edit the smallest relevant artifact,
5. run verification,
6. record the lesson,
7. recommend the next move.

If the agent cannot identify a verifiable next move, it should ask a focused question rather than generate more slides.

## Boundaries

- Do not hide unsupported claims behind polished visuals.
- Do not treat passing validators as proof that a deck is persuasive.
- Do not use browser QA as a substitute for human taste review.
- Do not let style references override the deck's audience, evidence or message.
- Do not store personal cross-agent memory in committed repo files. Use `/Users/koohaoming/.agent-memory/` for local private memory.
