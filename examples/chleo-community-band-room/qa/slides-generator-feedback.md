# Slides Generator Feedback

## What Failed In The First Draft

- The workflow produced a source-backed deck, but not a sufficiently actionable founder plan.
- Visual QA happened before a hard slide-by-slide content critique, so shallow slides survived too long.
- The first HTML version used scroll-page behavior instead of a proper fixed-stage presenter mode.
- Dense card grids were used before checking mobile wrapping.
- Cost bars were visually misleading because they showed composition, not total scale.

## Rules To Add To The Skill

- For proposal decks, require an execution-depth gate: every recommendation must answer who does it, where they find the person/vendor, what they ask, what output proves progress, and what blocks the next step.
- Before rendering, run a slide-by-slide critique against the end goal, not only against source accuracy.
- Treat "where do customers come from", "what do we buy", "who do we call" and "what happens next week" as required slides for startup/action proposals.
- For HTML decks, default to a fixed-stage presenter when the output is meant to feel like slides, not a report.
- For mobile, either scale the stage cleanly or create a deliberately separate phone layout; test the chosen behavior with browser overflow checks.
- Charts showing cost ranges must be scaled to a common axis unless clearly labeled as composition.
- When using external style packs, document which template inspired the deck and which constraints were adopted.

## Applied To This Deck

- Added first-30 customer-discovery pools and validation offers.
- Added location scouting script and quote-pack checklist.
- Split fitout from equipment.
- Added a starter equipment buy sheet with quantities and planning ranges.
- Added 90-day execution gates and go/no-go criteria.
- Rebuilt navigation as one-slide presenter mode with overview and speaker notes.
- Rebuilt the visual system from `frontend-slides` Creative Mode, with Sakura Chroma and Stencil & Tablet accents.
