# Quality Score Loop

Use this after the first rendered deck exists or when the user asks the deck to keep improving toward a quality target. The score is a steering tool, not proof that the deck is excellent.

## Role Reviews

Before scoring, write the role review fields in `qa/slide-scorecard.json`.

- `researcher`: source sufficiency, stale evidence, missing proof, conflicts, claims that need caveats.
- `story_strategist`: title-only flow, audience benefit, pruning, appendix candidates, timing against slide count.
- `designer`: screenshot hierarchy, clutter, density, visual aid usefulness, theme consistency.
- `critic`: audience or judge point of view, likely objections, jargon, weak argument, missing next action.

If the researcher marks source coverage as `thin`, `missing`, `stale`, or `conflicted`, repair evidence or caveats before visual polish.

## Artifacts

- `work/quality-rubric.json`: deck mode, score threshold, minimum slide score, hard gates, weighted dimensions, role prompts.
- `qa/slide-scorecard.json`: one iteration of role reviews, hard gate status, weighted dimension scores, slide-by-slide scores, and verdict.
- `qa/repair-plan.json`: smallest targeted repairs needed to cross the threshold or resolve blockers.
- `qa/score-history.json`: optional score trend across repeated human/agent repair passes.

## Hard Gates Versus Scores

Never average away integrity problems.

Hard gates:

- claim/source validation,
- architecture evidence validation when used,
- browser QA for overflow, clipping, and contrast,
- export QA when PPTX/PDF is requested,
- no unresolved high-severity review issues.

Scored dimensions:

- audience fit,
- story flow,
- evidence strength,
- visual explanation,
- design polish,
- delivery readiness,
- Q&A readiness.

## Threshold Defaults

- `ready_for_human_review`: overall score 80-87, no main slide below 75, hard gates pass.
- `ready_to_present`: overall score 88+, no main slide below 78, hard gates pass, notes are speakable.
- High-stakes pitch, hackathon final, executive decision: target 88-92.

The threshold must live in `work/quality-rubric.json`. Do not silently lower it to pass.

## Repair Loop

1. Render and run browser QA.
2. Inspect screenshots.
3. Fill `qa/slide-scorecard.json`.
4. Fill `qa/repair-plan.json`.
5. Run:

```bash
npm run deck:score -- <project>
```

or, to render, browser-QA, and validate score artifacts in one deterministic pass:

```bash
npm run deck:iterate -- <project> -- --threshold 88
```

If the score fails, repair only the artifacts named in `qa/repair-plan.json`, then re-render and re-score.

`--threshold` and `--min-slide-score` may only raise the rubric bar. They must not lower the target in `work/quality-rubric.json`.

`deck:score` exits non-zero only for invalid artifacts or failed hard gates. A below-target numeric score is advisory: it should drive repair, but it is still an agent-authored review signal.

## Stop Conditions

Stop honestly when:

- the score crosses the target and hard gates pass,
- max repair iterations is reached,
- the deck is blocked on missing evidence,
- score does not improve after targeted repairs,
- human taste or stakeholder judgment is needed.

Do not call a deck complete just because the scorecard is valid. Use `ready_for_human_review`, `ready_to_present`, `needs_repair`, `blocked_on_evidence`, or `scoped_draft`.
