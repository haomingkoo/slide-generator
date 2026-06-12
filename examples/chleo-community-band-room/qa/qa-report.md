# QA Report

## Verdict

`ready_for_human_review`

The deck has been rebuilt into a 21-slide Creative Mode execution pitch with appendices. It is accurate enough for a proposal conversation, source-backed where claims are factual, and browser-tested on desktop and mobile. It still needs Chleo's taste review before presenting publicly.

## Repairs From User Review

- Replaced the shallow draft with a more concrete 21-slide execution deck.
- Added step-by-step content for customer discovery, validation offers, property scouting, fitout, equipment, quote collection, 90-day execution and go/no-go gates.
- Rebuilt the visual system using the `frontend-slides` Creative Mode direction, with Sakura Chroma and Stencil & Tablet accents.
- Changed desktop from scroll-page behavior to a fixed-stage presenter with keyboard controls, overview and speaker notes.
- Kept mobile as a scaled 16:9 stage so the slide design stays intact on phone width.
- Fixed card wrapping, footer collisions and mobile overflow.
- Replaced cost composition bars with proportional cost range bars.
- Reworked slides 5 and 6 so validation starts with interviews/networking and does not depend on people prepaying for an unseen studio.
- Tuned slide 3 spacing, slide 4 trust-card rhythm, slide 10 acoustic panels, slide 11 fitout label alignment and slide 16 standards layout.
- Rebuilt slide 17 as a weekly proof sprint so the next actions are specific: set up tracker, interview users, run paid tests, pre-screen sites, quote the room and write the decision memo.
- Lifted footer metadata after browser QA so the presenter controls do not collide with sources or slide numbers.
- Tightened slide 3 and slide 5 layouts so source lines no longer sit on the main visual panels.
- Added clickable source links on market, discovery and property slides.
- Reworked slide 12 with model-family examples and added appendix gear detail, vendor quote-call and startup-cost breakdown tables.
- Reframed slide 15 as a break-even pricing method with a S$50-S$65/hr blended launch test.
- Rebuilt slide 17 as a Gantt-style sprint chart.

## Browser QA

- Desktop viewport: 1440 x 900.
- Mobile viewport: 390 x 844.
- Desktop fixed-stage check: 21 slides, zero bounds issues, zero footer/control collisions and zero source/main-visual collisions after the latest footer pass.
- Mobile viewport result: `horizontalOverflow: false`, `verticalOverflow: false`, scaled stage `390 x 219`, 21 slides.
- Presenter controls: overview opens with 21 cards; notes panel opens; keyboard navigation advances to slide 2.
- Browser console: no errors or warnings after favicon fix.
- Manual screenshot review covered slides 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 and 21.

## Validator QA

Passed:

```bash
node /Users/koohaoming/slides-generator/scripts/validate-slide-specs.mjs .
node /Users/koohaoming/slides-generator/scripts/validate-claim-ledger.mjs .
node /Users/koohaoming/slides-generator/scripts/validate-design-contract.mjs .
```

The old generic deck-audit helper was not present in this local `slides-generator` install. The available source/design validators pass, and Playwright was used for rendered layout QA.

## Accuracy Notes

- Legal feasibility is still site-specific.
- Startup costs are planning ranges, not quotes.
- Public showcases remain a later phase until licensing, fire-safety, venue-use and music-rights checks are confirmed.
- The next real-world step is validation and quote collection, not lease signing.
