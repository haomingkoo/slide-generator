# QA Report

## Verdict

`ready_for_human_review`

The deck is now a 22-slide Creative Mode proposal with appendices. It is source-backed enough for a proposal conversation, browser-tested on desktop and mobile, and explicit about site-specific legal and cost uncertainty. Chleo should still recheck current prices, rent, equipment availability and authority/landlord requirements before using it for a real lease or purchase decision.

## Repairs From User Review

- Rebuilt the shallow draft into an execution pitch: validate demand, confirm site use, quote the room, then decide.
- Added a competitor-pricing slide with public price signals and a caveat for the unverified New Ark listing.
- Added room-size guidance: 300-450 sq ft, 500-800 sq ft and 900+ sq ft use cases.
- Clarified lead generation as customer discovery first: interviews, named slots, paid partner-room tests, then small refundable holds only after proof.
- Added Singapore-specific property, licence, music-rights, YouTube/livestream and SCDF/QP caveats.
- Added more specific gear guidance with model families and buying checks.
- Reframed break-even as a pricing method: monthly fixed cost divided by paid booked hours.
- Rebuilt the 90-day plan as a Gantt-style proof sprint.
- Added appendices for starter gear detail, vendor call sheet and startup cost breakdown.
- Kept source links in slide footers and expanded `work/source-map.md`.
- Added `work/deck-plan.md` so the example shows the pre-render planning logic.
- Updated the slide-generator repo with a research-to-deck guide, planning-mode reference, heuristic slide-system loop, heuristic registry, and package/workbench roadmap.

## Browser QA

- Desktop viewport: 1440 x 900.
- Mobile viewport: 390 x 844.
- Desktop settled-slide pass: 22 slides, no horizontal overflow, no vertical overflow, no source/control collisions and no meta/control collisions.
- Mobile settled-slide pass: 22 slides, zero overflow issues and zero source/control collisions.
- Mobile overview: opens with 22 cards.
- Mobile notes: opens with readable speaker notes and no viewport overflow.
- Browser console: no current errors or warnings after reload.
- Manual screenshot review covered slides 1, 5, 8, 10, 13, 16, 17, 18, 21 and 22.

The generic text audit warns that slides 8, 20 and 21 are text-heavy. Slide 8 stays in the main deck because it answers the property-size and scouting questions directly. Slides 20 and 21 are appendices, so higher density is acceptable.

## Validator QA

Passed:

```bash
node scripts/validate-slide-specs.mjs examples/chleo-community-band-room
node scripts/lint-claim-refs.mjs examples/chleo-community-band-room
node scripts/validate-claim-ledger.mjs examples/chleo-community-band-room
node scripts/validate-design-contract.mjs examples/chleo-community-band-room
node scripts/validate-story-spine.mjs examples/chleo-community-band-room
node /Users/koohaoming/.codex/skills/pitch-deck-craft/scripts/deck-audit.mjs examples/chleo-community-band-room/deck/index.html
git diff --check
```

## Accuracy Notes

- Legal feasibility is address-specific. Confirm actual use, landlord/MCST/HDB/JTC rules, SCDF/QP triggers, licensing and music rights before signing.
- Startup costs are planning ranges, not vendor quotes.
- Public showcases and content/livestream offers remain later-phase options until rights, licensing, staffing and setup requirements are checked.
- Competitor and equipment prices are date-sensitive public signals checked for this proposal, not guaranteed future rates.
- The next real-world step is the 90-day proof sprint, not lease signing.
