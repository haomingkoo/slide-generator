# Claude Review Brief

Use this document to have Claude, Codex, or another agent review the `slides-generator` direction and catch blind spots.

## What We Are Building

We are building an agentic slide-making system that can turn dumped information into a clear, accurate, presentation-ready deck. The system should handle rough notes, PDFs, codebases, brand guidelines, research material, diagrams, charts, speaker notes, and visual QA.

The goal is not to generate many slides quickly. The goal is to create decks that help someone explain an idea clearly, influence an audience, and avoid fake or unsupported claims.

The repo should be usable by both Codex and Claude Code. Codex uses `.agents/skills/slide-generator`; Claude Code uses `.claude/skills/slide-generator`. Both mirrors should stay in sync with `skills/slide-generator`.

## Product Standard

The tool should produce at least 90 percent of a strong first draft:

- source-grounded,
- visually clear,
- audience-aware,
- concise,
- brand-aware when brand input exists,
- capable of editing and improving existing decks,
- diagram-capable for architecture and technical systems,
- useful for live presentation with speaker notes,
- repairable without burning context on full rewrites.

The final 10 percent may still need human taste and judgment, but the system should make that review efficient.

## Why We Do Not Generate Slides Directly

One-shot slide generation tends to fail in predictable ways:

- generic story,
- invented facts,
- weak visual hierarchy,
- random images,
- diagrams that look plausible but are not true,
- speaker notes that sound like AI,
- no clean way to repair one slide without regenerating the whole deck,
- PPTX outputs that look decent but have no real slide master, theme, or reusable layouts.

So the repo uses planning artifacts before rendering:

```txt
input files
→ source review
→ codebase review if needed
→ claim ledger
→ architecture map
→ audience model
→ story spine
→ slide sorter
→ visual aid plan
→ theme options
→ slide specs
→ render
→ critique loop
→ source audit loop
→ browser QA loop
→ PPTX/PDF basic export check when requested
→ export
```

## Core Artifacts

The key idea is that every phase writes a durable artifact to disk:

- `intake-brief.md`: user goal, audience, talk length, output mode, research mode.
- `source-map.md`: what files were read and what they contributed.
- `codebase-review.md`: actual implementation, flows, important files, risks.
- `architecture-map.json`: diagram nodes, edges, boundaries, and evidence.
- `claim-ledger.json`: every factual claim with source, confidence, and allowed slide use.
- `audience-model.json`: what the audience knows, cares about, doubts, and decides.
- `story-spine.json`: the audience shift, throughline, beats, transitions, likely questions, and handled objections.
- `slide-sorter.md`: title-only story.
- `visual-aid-plan.json`: visual explanation pattern per hard idea.
- `design-contract.json`: derived or selected colors, typography, spacing, density, patterns, and constraints.
- `slide-specs.json`: renderable slide instructions.
- `qa-report.md`: critique, audit, screenshot, and export findings.

This lets us repair the correct artifact instead of reloading or rewriting everything.

## Memory And Token Strategy

The system should avoid expensive full-deck context unless the task requires it.

Use whole-deck context for:

- improving narrative flow,
- making the deck concise,
- changing audience,
- changing talk length,
- running the title-only story test.

Use slide-local context for:

- fixing one ugly slide,
- repairing a chart,
- improving a diagram,
- changing a visual aid,
- fixing overflow from a screenshot.

Use source-audit context for:

- checking claims,
- validating stats,
- tracing facts back to original files,
- reviewing hallucination risk.

Use code-audit context for:

- architecture diagrams,
- code snippets,
- verifying feature behavior,
- finding actual implementation evidence.

This is the main path to getting 90 percent quality without burning too many tokens.

## Accuracy Guardrails

No factual claim should reach a slide unless it appears in `claim-ledger.json`.

Each claim is tagged:

- `user_file`
- `codebase`
- `external_source`
- `inference`
- `assumption`

The deck fails source audit if:

- a number has no source,
- a quote has no source,
- a chart has no data source,
- a diagram invents a node or edge,
- a code snippet is not from the actual codebase,
- a benchmark mixes incompatible sources without caveat,
- a visual implies a fake customer, result, product, or event,
- a slide title states more than the evidence supports.

## Visual Aid Philosophy

The deck should not just decorate ideas. It should make hard ideas easier to understand.

Useful visual patterns include:

- before/after,
- was/is,
- old world/new world,
- manual/assisted/autonomous,
- pipeline,
- runtime flow,
- loop map,
- state machine,
- probability shift,
- math stepper,
- decision tree,
- benchmark matrix,
- rubric scorecard,
- phone mockup,
- browser scene,
- code snippet proof.

The tool should pick a visual aid whenever the content involves change, causality, sequence, hierarchy, comparison, hidden mechanisms, risk, or tradeoffs.

## Theme Strategy

Dark mode is not the default.

The system should support:

- `clean-surgical-light`: white, precise, minimal, academic/consulting friendly.
- `warm-editorial-light`: product stories, teaching posts, human-centered demos.
- `dark-runtime`: architecture, security, observability, technical drama.
- `brand-derived`: when brand input exists.

If taste is unclear, generate 2 or 3 title-slide previews first. Many audiences prefer clean white/minimal decks, so the system should not reflexively choose dark backgrounds.

## PPTX Strategy

PPTX has two different quality bars:

1. Visual quality: does it look good?
2. Technical deck quality: is it editable and reusable?

For editable PPTX, the output should use:

- theme fonts,
- theme colors,
- slide masters,
- reusable layouts,
- editable text,
- native charts where feasible.

A deck that looks good but starts from blank default PowerPoint layouts is not good enough for reusable professional work.

## Codebase And Architecture Strategy

When code is involved, review the code before slide planning.

Produce:

- `codebase-review.md`
- `architecture-map.json`
- `code-snippets.json`
- `demo-path.md`

Architecture diagrams should come from evidence, not prose. Use:

- Mermaid for runtime flows, sequence diagrams, state machines, C4-style views.
- mingrammer/diagrams for cloud/provider/deployment diagrams.
- Excalidraw for whiteboard-style conceptual sketches.
- Custom SVG/HTML for final polished diagrams when Mermaid is too cramped.

Split dense architecture into multiple slides:

1. system context,
2. runtime happy path,
3. retry/error paths,
4. trust boundaries,
5. code snippet proof.

## Speaker Notes And Humanizer Pass

Speaker notes should sound like something a person can actually say.

The humanizer pass should remove:

- hype,
- generic phrasing,
- fake confidence,
- over-explaining,
- "not just X, but Y" filler,
- vague business language.

It should preserve:

- facts,
- source caveats,
- technical precision,
- the user's natural voice,
- useful transitions.

Speaker notes must not introduce unsupported claims that are absent from the slide and claim ledger.

## Critique Loop

The critique loop should review the deck from multiple angles:

- Story critic: does the title-only story work?
- Audience critic: will this audience understand it?
- Design critic: is the hierarchy clear and polished?
- Technical critic: are diagrams and code claims accurate?
- Presentation critic: can someone actually deliver this aloud?

The critique should identify the weakest slides and route repairs to the right artifact.

## Eval Loop

The repo should use an Anthropic-style skill eval loop:

1. Draft the skill.
2. Write realistic eval prompts.
3. Run with-skill and baseline outputs.
4. Capture qualitative outputs.
5. Grade objective checks.
6. Track token use and time.
7. Ask human reviewer for feedback.
8. Revise the skill.
9. Repeat.

Current eval cases:

- DPO teaching deck.
- PDF parser decision deck.
- Codebase architecture deck.

## MCP And Tooling Ideas

Useful MCP/tool integrations to consider:

- OpenAI docs MCP: official OpenAI/Codex/API docs.
- Context7 MCP: current framework/library docs.
- GitHub MCP: repo search, PRs, issues, source references.
- Browser/Playwright tools: visual QA, screenshots, DOM checks.
- Filesystem tools: project artifact management.
- Web search/fetch: research mode with citations.
- PDF tools: extraction, page rendering, OCR, table extraction.
- PPTX tools: template analysis, thumbnail generation, XML edits, export validation.
- Design/reference MCPs if available: brand assets, Figma, image libraries, icon systems.
- Observability/eval tooling: capture token usage, duration, pass/fail checks, and reviewer feedback.
- Presentation-generation MCP/API surfaces: useful for studying native editability and automation patterns, but generated output still needs the repo's claim ledger, critique, audit, and QA loops.

The system should not depend on MCP for basic operation, but MCPs can improve research, repo inspection, browser QA, and source traceability.

## Known Blind Spots To Review

Please review these areas critically:

1. Are the planning artifacts too heavy, or are they necessary for quality?
2. Which artifacts should be mandatory for MVP and which should be optional?
3. Is the claim ledger strict enough to prevent hallucination without slowing the workflow too much?
4. Is the memory strategy realistic for long decks?
5. Are there better ways to represent architecture truth before rendering diagrams?
6. Should HTML-first remain the MVP, or should editable PPTX become first-class earlier?
7. How do we evaluate visual quality without relying only on subjective taste?
8. What deterministic scripts should be added first?
9. How should brand matching work when the user gives only a website or one example slide?
10. What failure modes are missing from the source audit?
11. How should the system handle conflicting sources?
12. How should the system ask clarifying questions without slowing down momentum?
13. What should happen when the user asks for something visually impressive but the content is unsupported?
14. How do we prevent visual aid overuse?
15. How do we keep speaker notes natural without making them vague?
16. How should Plus-style insert, rewrite, remix, and API/MCP workflows map to deterministic repo artifacts?
17. How should SlideSpeak-style branded template analysis, translation, and video narration fit without weakening source audit?

## Suggested Review Prompt

Use this prompt with another agent:

```txt
Please review the slides-generator repo direction. Focus on blind spots, missing guardrails, unnecessary complexity, and execution risks.

Read:
- AGENTS.md
- docs/workflow.md
- docs/architecture.md
- docs/no-hallucination-policy.md
- docs/quality-rubric.md
- docs/skill-eval-loop.md
- docs/codex-ecosystem.md
- docs/runtime-compatibility.md
- .agents/skills/slide-generator/SKILL.md
- .claude/skills/slide-generator/SKILL.md
- .agents/skills/slide-generator/references/*.md
- .claude/skills/slide-generator/references/*.md

Evaluate:
1. Is the pipeline likely to produce accurate, clear, high-quality decks?
2. What parts are overbuilt for MVP?
3. What parts are under-specified?
4. Where can hallucinations still enter?
5. Where can token usage blow up?
6. What deterministic scripts should be built first?
7. What MCP integrations would materially improve the workflow?
8. How should we test this against baseline one-shot slide generation?
9. What would you change before implementation?

Please be critical and specific. Reference files and proposed fixes.
```

## Post-Workflow Tooling Review Prompt

Use this prompt after commit `23256c9 Add agentic deck workflow tooling`.

```txt
You are reviewing the current `slides-generator` repo after the agentic workflow tooling landed.

Do not re-brainstorm the whole product. This is an implementation-risk and slide-quality review. Break the current system, find mismatches between docs and executable behavior, and identify the next highest-leverage fixes.

Start by running:

- `npm test`
- `npm run agentic:run -- examples/source-grounded-demo --render --export`
- `npm run workflow:status -- examples/source-grounded-demo --agentic`

Read these files first:

- `README.md`
- `docs/workflow.md`
- `docs/agentic-execution.md`
- `docs/status-and-roadmap.md`
- `skills/slide-generator/SKILL.md`
- `skills/slide-generator/references/content-prioritization.md`
- `skills/slide-generator/references/pptx-workflow.md`
- `skills/slide-generator/references/design-quality-gates.md`
- `scripts/create-deck-artifacts.mjs`
- `scripts/deck-workflow-status.mjs`
- `scripts/run-agentic-workflow.mjs`
- `scripts/render-marp.mjs`
- `scripts/browser-qa-marp.mjs`
- `scripts/inspect-exports.mjs`
- `scripts/theme-utils.mjs`
- `examples/source-grounded-demo/work/*`

Specific questions:

1. Does the current workflow really qualify as agentic, or is it mostly a scripted renderer with agent instructions around it?
2. Does `content-priority.md` solve the "too much source material for the slide/time budget" problem, or is it still too weak?
3. Does `deck-workflow-status.mjs --render-ready` ignore anything that should block rendering?
4. Can stale QA or export reports create false confidence?
5. Does multi-viewport browser QA catch meaningful visual problems, or does it miss common slide issues such as cramped tables, poor hierarchy, and weak aesthetics?
6. Is the claim-reference linter still too easy to bypass with factual language that avoids the regex terms?
7. Does `inspect-exports.mjs` clearly and correctly report Marp PPTX as image-based when text is not editable?
8. Does `theme-utils.mjs` apply design-contract tokens safely, or can it silently distort theme semantics such as risk/safe colors?
9. Are the docs honest about current PPTX/Google Slides capabilities?
10. Are there hidden fallbacks, no-op arguments, unexplained hardcoded values, or hand-waving assumptions?
11. Does the source-backed demo prove the workflow, or is it too self-referential?
12. What one change would most improve actual slide quality, not just validator coverage?

If you have local access to the same machine, also inspect the ignored local RedFlag test deck:

- `projects/redflag-remix/deck/index.html`
- `projects/redflag-remix/work/claim-ledger.json`
- `projects/redflag-remix/work/content-priority.md`
- `projects/redflag-remix/work/slide-specs.json`
- `projects/redflag-remix/qa/browser-qa.json`
- `projects/redflag-remix/qa/export-inspection.json`

Compare it against:

- `/Users/koohaoming/red-teaming/pitch/redflag-deck.html`
- `/Users/koohaoming/red-teaming/pitch/redflag-slide-audit.md`
- `/Users/koohaoming/red-teaming/research/strategy-memo.md`
- `/Users/koohaoming/red-teaming/prototype/README.md`
- `/Users/koohaoming/red-teaming/prototype/generated/gate.report.json`

Judge whether the new RedFlag deck is actually clearer, less text-heavy, more source-grounded, and more presentable. Be blunt about slide-level weaknesses. Do not assume the QA passing means the deck is good.

Return:

- blocker findings,
- important-but-not-blocking findings,
- overbuild or scope concerns,
- slide-quality concerns,
- concrete file-level fixes,
- the next 3 implementation tasks in order.
```
