# Workflow Reference

## Intake Questions

Ask only for missing information that materially affects the deck:

- Who is the audience?
- What decision, belief, or action should the deck drive?
- Is this live presentation or async reading?
- How long is the talk, or how many slides are needed?
- What likely questions or objections should the deck prepare for?
- What jargon does the audience know, and what should be defined or avoided?
- Can external research be used?
- Are there brand guidelines or example slides?
- Is the requested output HTML, PDF, PPTX, Google Slides handoff, or all of them?
- Should motion or interactive visual aids be used, and is a static fallback required?

For one-shot deck generation, read `intake-and-one-shot.md`. Ask missing material questions once, then proceed with explicit defaults recorded as assumptions.

## Artifact Order

1. `intake-brief.md`
2. `source-map.md`
3. `codebase-review.md` when code exists
4. `claim-ledger.json`
5. `architecture-map.json` when architecture exists
6. `audience-model.json`
7. `story-spine.json`
8. `slide-sorter.md`
9. `visual-aid-plan.json`
10. `theme-options.md` or `design-contract.json`
11. `slide-specs.json`
12. rendered HTML deck
13. browser QA
14. PPTX/PDF export when requested
15. QA reports

## Repair Routing

- Story unclear: repair `story-spine.json` and `slide-sorter.md`.
- Too wordy: repair slide titles, body copy, and notes across `slide-specs.json`.
- One slide ugly: repair only that slide spec and render.
- Claim failed: repair `claim-ledger.json` and affected slides.
- Diagram inaccurate: repair `architecture-map.json`, then diagram slide.
- Theme disliked: repair theme selection and rerender visual layer without changing claims.
- Audience confused: repair `audience-model.json`, `story-spine.json`, notes, and affected slides.
- Motion or visual aid broken: repair only the relevant slide spec or asset, then rerun browser QA.
- PPTX/PDF export failed: repair the renderer/export layer, not the source claims.

## Human Review Session

After the agent produces the first complete rendered draft and QA report, stop for a structured review with the user. Do not keep regenerating silently.

Review order:

1. Confirm the deck goal and audience shift.
2. Review the title-only story.
3. Review each slide in order.
4. For each slide, capture one of:
   - `accept`: the slide works.
   - `copy_edit`: wording or speaker notes need work.
   - `visual_edit`: layout, hierarchy, density, or visual aid needs work.
   - `claim_edit`: evidence, caveat, or claim mapping needs work.
   - `story_edit`: the slide's role or order needs work.
   - `remove_or_split`: the slide is overloaded or unnecessary.
5. Convert review notes into targeted repairs.
6. Re-render and rerun QA for affected slides or the whole deck when needed.

Do not rewrite the full deck when the review identifies slide-local issues. Full regeneration is allowed only when the deck goal, audience, source basis, or story spine changes materially.

## Review Memory

After a review session, write or update `work/review-log.json`.

The review log should include:

- deck goal reviewed,
- review session date,
- per-slide decisions,
- repair target for each issue,
- recurring issues,
- new rules learned from the review.

Validate with:

```bash
node scripts/validate-review-log.mjs <project-dir>
```

When a recurring issue appears twice, convert it into a durable rule in one of:

- `work/design-contract.json` for visual and style mistakes,
- `work/audience-model.json` for audience, jargon, objection, or Q&A mistakes,
- `work/story-spine.json` for flow mistakes,
- `work/claim-ledger.json` or source audit notes for accuracy mistakes,
- `work/slide-specs.json` for slide-local copy, layout, or motion mistakes.

This is how the agent avoids repeating the same mistake across later repair passes.
