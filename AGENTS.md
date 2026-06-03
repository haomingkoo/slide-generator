# AGENTS.md

Project-level guidance for Codex when working in this repository.

## Mission

Build an agentic slide-deck generation system that produces professional, presentation-ready decks. The system should optimize for clear narrative, strong visual hierarchy, deterministic rendering, and repeatable QA. Avoid generic AI-generated slide patterns.

## Working Style

- Think before coding. State assumptions when they affect architecture, output quality, or product behavior.
- Prefer the smallest implementation that proves the workflow. Do not add speculative features.
- Make surgical changes. Touch only files needed for the current task.
- Match the style already present in the repo. If no style exists yet, choose simple TypeScript-first project structure.
- Separate research, planning, content generation, design, rendering, and QA. Do not collapse everything into one prompt.
- Treat "good slides" as a verifiable output, not a vibe.

## Slide Quality Bar

Every generated deck should pass these checks:

- The slide titles tell a coherent story when read alone.
- Each slide has one primary idea, one visual job, and limited supporting text.
- Body copy is specific, concrete, and free of filler.
- Visuals prove the point instead of decorating it.
- Layouts use a visible grid, strong alignment, and enough whitespace.
- Typography is calm and readable on a laptop and projector.
- Color is intentional, with consistent semantic state colors.
- No slide relies on a generic card grid, random gradient, decorative blob, or stock SaaS composition.
- Exported decks must be reviewed as actual rendered slides, not just generated source.

## Agent Architecture

- Do not build one giant slide agent.
- Use a manager workflow that keeps ownership of the deck and calls bounded specialists.
- Add specialist agents only when the contract changes: research, story, visual direction, layout, copy polish, export QA, or visual critique.
- Prefer specialists-as-tools over handoffs unless a specialist truly owns a user-facing branch.
- Use typed intermediate artifacts: brief, audience, narrative spine, slide outline, design direction, slide spec, render artifact, QA report.
- Use guardrails for schema validation, text density, unsupported layout requests, and export constraints.
- Use human review before finalizing high-stakes decks, brand-sensitive changes, or major design direction changes.

## Skills Strategy

Use repo-scoped skills under `.agents/skills/` when a workflow becomes reusable or too detailed for prompt context. Codex discovers repo skills from this path. Good candidates:

- `deck-research`: gather source material and produce cited synthesis.
- `deck-story`: turn research into a narrative spine and slide titles.
- `slide-visual-direction`: select visual language, layout families, and anti-patterns.
- `slide-rendering`: convert slide specs into HTML, Slidev, or PPTX artifacts.
- `deck-qa`: inspect rendered slides for overflow, weak hierarchy, repetition, and export issues.

Keep each skill focused. Put detailed rubrics, examples, and scripts in `references/`, `scripts/`, or `assets/` inside the skill folder.

The active deck skill is `.agents/skills/slide-generator`. The top-level `skills/` folder may be used as a development mirror, but Codex-native repo skills belong in `.agents/skills`.

## Rendering and Export

- Prefer deterministic rendering from structured slide specs.
- For beautiful web-first decks, use HTML/CSS or Slidev and verify with browser screenshots.
- For editable PowerPoint, generate native PPTX objects where possible instead of image-only slides.
- Be explicit about export tradeoffs: image-based PPTX preserves design better, editable PPTX preserves editability better.
- Use PptxGenJS or another OOXML-native path when editability is a requirement.
- Use Playwright screenshots for visual QA before calling a deck done.

## Copy Rules

- Use concrete verbs and specific nouns.
- Avoid filler such as "unlock", "transform", "seamless", "powerful", "revolutionary", "game-changing", and vague "insights".
- Titles should be short takeaways, not labels or paragraphs.
- Delete body copy that repeats the title.
- Prefer one strong example over broad claims.

## Verification

For meaningful changes, verify with the tightest relevant checks:

- Schema validation for generated intermediate JSON.
- Unit tests for deterministic helpers.
- Browser screenshot review for HTML/Slidev output.
- PPTX/PDF export smoke test when export code changes.
- A text audit for slide titles, word count, repeated claims, and banned phrases.

If verification cannot be run, say exactly what was not run and why.

## Research Discipline

- Use current official docs for OpenAI APIs, Agents SDK, Skills, MCP, and Responses API.
- Use primary docs for frameworks such as Deep Agents, LangGraph, Slidev, and PptxGenJS.
- Treat third-party slide products as product references, not source-of-truth implementation guidance.
- Record durable architecture decisions in repo docs once the direction stabilizes.

## Non-Goals

- Do not optimize for generating the most slides quickly.
- Do not rely on prompt-only quality control.
- Do not create generic template packs without QA criteria.
- Do not hide export limitations from the user.
