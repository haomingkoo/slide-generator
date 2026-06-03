# Audience And Presenter Support

Use this reference for live talks, investor/client decks, teaching decks, strategy decks, technical reviews, and any deck where the presenter may face questions.

## Audience Model

Create `work/audience-model.json` before the story spine when the deck needs persuasion, teaching, or live delivery.

Required shape:

```json
{
  "segments": [
    {
      "id": "exec_buyer",
      "role": "VP Engineering",
      "decision_power": "decider",
      "current_knowledge": [],
      "stakes": [],
      "success_criteria": [],
      "likely_questions": [
        {"id": "q1", "question": "What will they ask?", "priority": "high"}
      ],
      "objections": [
        {"id": "o1", "objection": "What will they resist?", "severity": "high"}
      ],
      "jargon": {
        "allowed": [],
        "define_on_first_use": [],
        "avoid": []
      }
    }
  ],
  "audience_pov_critique": {
    "what_they_care_about": "",
    "what_will_feel_unproven": "",
    "where_deck_sounds_like_us_not_them": "",
    "required_reframe": ""
  }
}
```

Validate with:

```bash
node scripts/validate-audience-model.mjs <project-dir>
```

## Story Spine

Use `work/story-spine.json` when the deck has more than a few slides. It records the audience movement rather than only the slide order.

Required shape:

```json
{
  "audience_shift": {"from": "", "to": ""},
  "throughline": "",
  "beats": [
    {
      "id": "beat_01",
      "role": "problem",
      "slide_ids": ["slide_02"],
      "audience_question_ids": ["q1"],
      "handles_objection_ids": ["o1"],
      "transition": ""
    }
  ]
}
```

Validate with:

```bash
node scripts/validate-story-spine.mjs <project-dir>
```

## Speaker Notes

In `work/slide-specs.json`, use structured notes:

```json
"speaker_notes": {
  "key_message": "",
  "talk_track": ["", ""],
  "transition_in": "",
  "transition_out": "",
  "delivery_cues": [],
  "timing_seconds": 75,
  "avoid_saying": [],
  "claim_ids": []
}
```

Rules:

- The slide body is not the script. Keep body copy brief and put delivery detail in notes.
- Notes may explain a sourced claim, but must not add new unsourced factual claims.
- `avoid_saying` is for overclaiming, jargon, hype, and claims the evidence does not support.
- Use `timing_seconds` to catch decks that cannot fit the requested talk length.

## Audience POV Critique

Before final export, review the deck as the audience:

- What question will this slide create?
- What will feel unsupported?
- Which terms need a plain-language definition?
- Which slide sounds like internal tooling language rather than audience value?
- Which objection should be answered in the deck, and which belongs in Q&A?
- Is the next step or decision clear?

Repair the deck if the audience cannot retell the point in plain language.

## Jargon Rule

Treat jargon as a delivery risk, not as a forbidden substance.

- Use technical terms when the audience needs them.
- Define important terms on first use.
- Replace internal labels with audience-facing language when the term does not help the audience decide, learn, or act.
- Put optional precision into speaker notes or backup slides.

## Q&A And Backup

Use likely questions and objections to decide backup slides:

- high-priority questions should be answered in the main story,
- medium-priority questions can be answered in notes or backup,
- low-priority questions can be held for Q&A,
- every factual answer still needs a claim ID.

Do not create backup slides by dumping all research. Create them only for questions the audience is likely to ask.
