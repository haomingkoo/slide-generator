# Content Prioritization

Use this before creating final slide specs when the source material is larger than the talk or reading budget.

The deck budget is a forcing function. Do not compress forty ideas into twenty crowded slides. Choose the main story, move useful depth into backup, and drop material that does not help the audience move.

## Inputs

- `work/intake-brief.md`
- `work/audience-model.json`
- `work/story-spine.json`
- `work/claim-ledger.json`
- `work/slide-sorter.md`
- source notes or `work/source-map.md`

## Timing Rule

For live talks, start with a rough upper bound of one content slide per minute.

Then adjust:

- Title, section, demo setup, and close slides still consume attention.
- Dense technical slides usually need more than one minute.
- Live demos and discussion-heavy meetings need fewer slides.
- Backup and appendix slides do not count against the main talk if they are clearly separated.

Mode-specific defaults:

- 60 to 90 second demo video: 3 to 4 slides/screens.
- 150 second investor demo-day pitch: 5 to 7 remembered ideas, not a full seed deck.
- 2 to 3 minute hackathon judging pitch: 5 to 8 slides with one repeatable demo path.
- 5 to 7 minute hackathon finalist pitch: 7 to 10 main slides plus question-indexed backup.
- 10 to 12 minute conference talk: 8 to 12 slides focused on problem, gap, contribution, method, result, limitation, and takeaway.
- 20 minute technical or executive talk: usually fewer than 20 main slides once demo, discussion, and decision time are reserved.

Record the timing assumption in `work/intake-brief.md` and `work/content-priority.md`.

## Main Deck Criteria

Keep an item in the main deck only when most of these are true:

- It directly supports `deck_goal` or `audience_shift`.
- It answers a high-priority audience question or objection.
- It has strong enough evidence for the deck's `accuracy_bar`.
- It changes a decision, belief, behavior, or next action.
- It can be made visual without shrinking text or relying on a long paragraph.
- It reduces confusion, risk, or skepticism at that point in the story.

If an item is true but not decisive, move it to backup. If it is interesting but off-story, drop it.

## Appendix And Backup Criteria

Move material into backup when:

- It answers a likely Q&A question but would interrupt the main story.
- It is detailed evidence for a claim already summarized in the main deck.
- It is a table, log, benchmark detail, alternative design, or implementation note.
- It is useful for technical reviewers but not for the primary decision path.

Drop material when:

- It repeats another slide.
- It is unsupported or low confidence.
- It is an internal implementation detail the audience does not need.
- It introduces a new story branch without changing the decision.
- It makes the deck sound broader than the evidence supports.

## Required Artifact

Create `work/content-priority.md` before `work/slide-specs.json`.

Suggested structure:

```md
# Content Priority

main_deck_budget:
- talk_length_minutes: 20
- target_main_slides: 16
- backup_slide_budget: 4
- timing_assumption: One main slide per minute, with room for demo and discussion.

selection_principles:
- Keep slides that support the audience shift.
- Move implementation depth to backup.
- Drop claims that are not sourced.

main_deck:
1. [keep] Slide title or idea
   - reason:
   - audience_question_ids:
   - claim_ids:
   - visual_aid:

backup_or_appendix:
1. [backup] Detail or likely Q&A item
   - reason:
   - triggered_by:
   - claim_ids:

dropped_or_deferred:
1. [drop] Detail or idea
   - reason:
```

## Repair Rules

- If the browser QA says the slide is dense, repair `content-priority.md` before reducing font size.
- If the user asks to add material after the first render, decide whether it belongs in main, backup, notes, or dropped.
- If a claim is weak, do not hide it in small text. Move it to backup with a caveat or drop it.
- If the slide sorter exceeds the timing budget, merge, move, or cut ideas before writing slide specs.

## Presenter Support

For every backup item, name the question it answers. The presenter should know when to use the slide.

Backup slides are not a junk drawer. They are prepared answers for likely questions.
