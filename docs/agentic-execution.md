# Agentic Execution

This repo is a slide-generation skill and artifact workflow first, with deterministic rendering and QA tools underneath it.

The renderer can turn `work/slide-specs.json` into HTML, PPTX, PDF, and screenshots. That is useful, but it is not the whole system. The agentic part is the loop around the renderer: intake, source review, claim ledger, audience model, story spine, visual aid plan, design contract, slide specs, QA, human review, and targeted repair.

## How The System Executes Today

Today the execution model is human-directed agentic work plus a deterministic build runner:

1. A human opens the repo in Codex or Claude Code.
2. The human asks the agent to use the `slide-generator` skill.
3. The agent follows `skills/slide-generator/references/workflow.md`.
4. The agent writes durable artifacts into `projects/<name>/work/`.
5. The agent runs deterministic validators and render/QA commands, usually through `npm run deck:build`.
6. The agent writes quality score and repair artifacts after screenshot review.
7. The agent stops for review after the rendered draft, QA report, and scorecard.
8. The human reviews the deck slide by slide.
9. The agent records review decisions in `work/review-log.json`.
10. The agent repairs only the failed artifact or slide.

That run is agentic because the agent plans, writes state, calls tools, validates output, uses browser feedback, and resumes from files instead of relying on chat memory.

`npm run deck:build` itself is not the agent. It is a deterministic runner for checks, render, browser QA, export, and export inspection. If the planning artifacts are wrong, the runner should fail or expose the problem; it should not invent missing decisions.

It is not yet a fully automated server-side agent runner. There is no LangGraph, Deep Agents, Temporal, queue, or hosted orchestration layer in the repo today.

## How To Tell Whether A Run Is Actually Agentic

A run is agentic only if it produces and uses the artifacts, not just the final deck.

Minimum evidence of a real run:

- `work/intake-brief.md` has a clear `deck_goal`, audience shift, constraints, assumptions, and open questions.
- `work/claim-ledger.json` exists before factual slides are written.
- `work/audience-model.json` names likely questions, objections, jargon tolerance, and audience needs.
- `work/story-spine.json` explains the throughline and slide jobs.
- `work/slide-sorter.md` gives a title-only story that can be reviewed before rendering.
- `work/content-priority.md` explains what belongs in the main deck, backup, appendix, or dropped content.
- `work/design-contract.json` records theme tokens and layout decisions.
- `work/quality-rubric.json` records the threshold, hard gates, and weighted review dimensions.
- `work/slide-specs.json` maps each slide to a job, claims, visual aid, and speaker notes.
- `qa/browser-qa.json` exists after rendering and includes multi-viewport slide reports.
- `qa/slide-scorecard.json` records researcher, story, designer, and critic reviews.
- `qa/repair-plan.json` names targeted repairs when the threshold is not met.
- `qa/export-inspection.json` exists after PPTX/PDF export.
- `work/review-log.json` records human review decisions and recurring mistakes.

If an agent only runs `npm run render:marp`, it is using the renderer, not the workflow.

## Relation To Deep Agents And LangGraph

LangChain Deep Agents and similar frameworks provide orchestration primitives: planning tools, subagents, filesystem-backed context, and long-running execution. Those ideas fit this repo well, but they should wrap the artifact contract rather than replace it.

The clean architecture is:

```txt
artifact contract first
agent runner second
UI or API third
```

The artifact contract is the stable part:

```txt
input/brief.md
work/intake-brief.md
work/claim-ledger.json
work/audience-model.json
work/story-spine.json
work/slide-sorter.md
work/content-priority.md
work/visual-aid-plan.json
work/design-contract.json
work/quality-rubric.json
work/slide-specs.json
qa/browser-qa.json
qa/slide-scorecard.json
qa/repair-plan.json
qa/export-inspection.json
work/review-log.json
```

A Deep Agents or LangGraph implementation can then map each phase to a node or subagent:

- intake agent,
- source review agent,
- claim ledger agent,
- story editor agent,
- design director agent,
- slide-spec writer,
- renderer tool,
- browser QA tool,
- researcher sufficiency critic,
- audience-review critic,
- design critic,
- repair agent.

The runner should pass file paths and artifact IDs between phases. It should not pass a giant transcript as memory.

## Recommended Build Path

Build in this order:

1. Keep the current skill-and-workflow execution working in Codex and Claude Code.
2. Add artifact generators for intake, claim ledger, audience model, story spine, design contract, and slide specs.
3. Use the quality score loop on real decks and compare before/after repairs.
4. Add a real eval deck from source material and compare baseline prompt vs skill workflow.
5. Add an optional Deep Agents or LangGraph runner once the artifact shapes are stable.
6. Add UI/API wrappers after the runner works.

This keeps the system honest. The deck quality comes from the artifact loop, not from choosing a framework early.

## Failure Rules

No orchestrator should hide failure.

- If a source is missing, stop or record the assumption.
- If browser QA fails, do not export as if the deck passed.
- If PPTX export is degraded, say so in the export report.
- If a deck only passes one viewport, keep it in review instead of calling it present-ready.
- If an interactive or animated visual cannot be validated, use the declared static fallback.
- If the claim ledger is incomplete, do not render factual slides as final.

The agent can be autonomous about work, but it should be conservative about truth.
