# Goal And Loop

Use this reference when a deck task is long-running, source-heavy, or likely to need review and repair. The purpose is to keep the agent anchored to the user's real outcome while making progress through file-backed artifacts instead of chat memory.

## Deck Goal Contract

Before writing slides, record the goal in `work/intake-brief.md`.

The goal contract must include:

- Audience and decision context.
- Presentation length and target slide count.
- Main benefit the audience should understand.
- Required proof bar: anecdote, qualitative evidence, benchmark, code proof, customer proof, or external research.
- Source mode: user-provided only, allowed web research, codebase inspection, or mixed.
- Output mode: HTML review deck, PDF, PPTX handoff, Google Slides handoff, or speaker script.
- Review mode: full deck review, slide-by-slide review, executive summary review, or rehearsal/Q&A review.
- Quality target: rubric mode, overall score threshold, minimum main-slide score, and maximum repair iterations.
- Stop condition: ready for human review, ready to present, blocked on evidence, or intentionally scoped draft.

If the user does not know the right slide count, use time as the first constraint. A useful default is at most one main slide per minute of live presentation, then move overflow to backup or appendix slides.

## Phase Loop

Work in phases. At the end of each phase, update artifacts before moving on.

1. `intake`: confirm goal, audience, time, output, source mode, and assumptions.
2. `source_review`: map available sources, missing sources, source quality, and stale or conflicting evidence.
3. `evidence`: write `claim-ledger.json`; every factual statement that may appear on slides needs a claim ID.
4. `audience`: write likely questions, objections, jargon, and what success looks like from the audience point of view.
5. `story`: produce story spine and title-only slide sorter before detailed slide copy.
6. `content_priority`: choose main deck, backup, appendix, and dropped content based on time and audience value.
7. `visual_plan`: choose only visuals that explain, prove, compare, or guide a demo.
8. `design`: create or reuse a design contract with explicit tokens, patterns, avoid rules, and accessibility rules.
9. `render`: create slide specs and render with Marp.
10. `qa`: run deterministic checks, browser QA, export checks when relevant, and a human design critique.
11. `score`: write `qa/slide-scorecard.json` and `qa/repair-plan.json` from researcher, story, designer, and critic reviews.
12. `review`: record slide-by-slide feedback and recurring issues in `work/review-log.json`.
13. `repair`: repair the smallest failing artifact, rerun the gate, and avoid regenerating the whole deck unless the story goal changed.

## Render Gates

Run these commands during the loop:

```bash
npm run workflow:status -- <project>
npm run workflow:status -- <project> -- --render-ready
npm run deck:build -- <project> --render
npm run deck:score -- <project>
```

Use `--render-ready` before rendering. It must pass source, claim-reference, audience, story, design, and slide-spec checks. Use full status after QA and review artifacts exist.

## Critique Loop

Critique is not a vibe check. Review each slide from the audience point of view:

- What decision, belief, or action should this slide move?
- Is the slide's main claim traceable to evidence?
- Is the slide earning its place within the time limit?
- Is the visual aid doing explanatory work, or only decoration?
- What likely question or objection does this slide raise?
- What jargon needs definition, replacement, or removal?
- Is this better in the main deck, appendix, backup, or speaker notes?
- Does the slide overclaim, hide uncertainty, or imply proof that does not exist?

Record accepted slides, repair slides, rejected slides, recurring issues, and new project-specific rules in `work/review-log.json`.

## Learning Within A Project

The workflow learns by writing down decisions and mistakes, not by relying on model memory.

- Use `work/design-contract.json` to prevent visual drift.
- Use `work/review-log.json` to stop repeated content, tone, and layout mistakes.
- Use `work/content-priority.md` to explain why material was included, moved to backup, or dropped.
- Use `work/source-map.md` to show where evidence came from and where evidence is missing.

If the same mistake appears twice, add a new rule to `review-log.json` and apply it in the next repair pass.

## Completion Criteria

A deck is not complete because it rendered. It is complete only when:

- Required artifacts pass validation.
- All main-deck factual claims are represented in `claim-ledger.json`.
- Browser QA passes for rendered slides.
- Quality scorecard and repair plan validate; below-target numeric scores remain repair guidance, not proof of failure by themselves.
- Export QA passes when export is requested.
- Review log has no unresolved high-severity slide issues.
- The deck has a clear main message, audience benefit, and next action.
- Known evidence gaps are either resolved, caveated, moved to appendix, or removed.

If these are not true, mark the deck as `ready_for_human_review`, `blocked_on_evidence`, or `scoped_draft`; do not call it presentation-ready.
