# Skill Eval Loop

The slide skill should improve through examples, not vibes.

## Loop

1. Draft or revise the skill.
2. Save realistic prompts in `evals/evals.json`.
3. Run each prompt with the skill and without the skill, or against the previous skill version.
4. Save outputs under `slide-generator-workspace/iteration-N/`.
5. Grade objective checks where possible.
6. Ask the human to review qualitative output.
7. Compare quality, token use, and time.
8. Revise the skill based on recurring failures.
9. Expand the eval set once the first examples pass.

## What To Measure

- Story coherence from title-only outline.
- Claim traceability.
- Correct handling of research mode.
- Diagram accuracy from code or source.
- Visual aid quality.
- Speaker note naturalness.
- Token usage for whole-deck vs slide-local repairs.
- Whether repair runs changed only the targeted artifact.
- Token usage and duration for each run.
- Whether the skill beats a baseline prompt without the skill.

## Baseline Comparison

For each realistic eval, keep two outputs when possible:

- `with_skill`: follows `skills/slide-generator/SKILL.md`.
- `without_skill`: same prompt with no slide-generator guidance.

Compare both qualitatively and with objective checks. The skill should justify its token cost by producing better planning artifacts, stronger accuracy discipline, and fewer generic slides.

## Eval Viewer

When an eval-viewer tool or script is available, generate a review page before revising the skill. The human should see outputs side by side and leave feedback. The feedback should drive the next iteration.

If no viewer is available, keep the same structure on disk and report concise links to the generated artifacts.
