# Heuristic Registry

Use this registry to track which deck-review failures have been promoted into reusable slide-generator behavior.

Status values:

- `proposed`: seen in review, not yet encoded.
- `absorbed`: encoded in docs, skill guidance, templates, scripts or examples.
- `tested`: covered by an eval, validator, browser QA check or committed example.
- `compressed`: folded into a simpler rule; old narrow guidance can be removed.

| ID | Source feedback | Reusable rule | Runtime target | Test or example coverage | Status |
|---|---|---|---|---|---|
| H001 | Chleo first draft was source-backed but not actionable enough. | Startup/proposal decks need an execution-depth gate: actor, first action, where to find people/vendors, output artifact and success signal. | `skills/slide-generator/references/planning-mode.md`, `docs/research-to-deck-guide.md` | `examples/chleo-community-band-room` slides 6, 7, 8, 14, 18, 21 | tested |
| H002 | HTML deck felt like a scroll page, not a presentation. | Web-first decks meant for live delivery should use fixed-stage presenter behavior with overview and speaker notes. | HTML deck examples and frontend-rendering guidance | `examples/chleo-community-band-room/deck/index.html` | tested |
| H003 | Mobile and footer controls collided with content. | Browser QA must inspect mobile width, fixed controls, footer/source clearance and slide bounds. | Browser QA workflow and example QA report | `examples/chleo-community-band-room/qa/qa-report.md` | absorbed |
| H004 | Startup cost bars were visually misleading. | Cost range bars must share a common axis unless explicitly labeled as composition. | `docs/research-to-deck-guide.md`, Chleo design repair notes | Chleo startup cash slide and QA notes | tested |
| H005 | Dense peer cards had uneven heights and bad wrapping. | Peer cards in comparison flows should align on a visible grid; if body lengths differ, use tables or equalized card rows. | Design guidance and example repairs | Chleo slides 5, 8, 12, 18 | absorbed |
| H006 | The deck used style inspiration without making the choice explicit. | If external style packs or references influence a deck, record which constraints were adopted and which were not. | `qa/slides-generator-feedback.md`, design contract | Chleo feedback notes | absorbed |
| H007 | The repo lacked a durable pre-render planning artifact. | Complex, public or client-facing decks should create `work/deck-plan.md` before slide specs. | `scripts/create-deck-artifacts.mjs`, `skills/slide-generator/references/planning-mode.md` | New scaffold output and Chleo deck plan | absorbed |
| H008 | Improvement lessons were scattered across QA prose. | Repeated failures need registry rows before they become skill rules, validators, templates or evals. | `docs/heuristic-slide-system.md`, this registry | This file | proposed |

## Promotion Protocol

1. Capture the concrete failure in the deck's `qa/` folder.
2. Add or update a registry row.
3. Decide the smallest reusable target: docs, skill reference, script, template, example or eval.
4. Implement the change.
5. Add proof through a validator, browser QA check, eval, committed example or screenshot review.
6. Mark the row `tested` only when the proof exists.
7. Periodically compress several narrow rows into one simpler rule.
