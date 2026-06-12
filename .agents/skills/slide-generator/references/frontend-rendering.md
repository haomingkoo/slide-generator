# Frontend Rendering

Use for HTML decks, interactive demos, visual aids, and browser-rendered exports.

## Design Standard

Commit to a clear aesthetic direction, then execute it precisely. Clean minimalism still needs craft: grid, spacing, type scale, color restraint, and clear focal points.

## Rendering Rules

- Use structured slide specs, not ad hoc HTML.
- Use CSS variables for theme tokens.
- Use stable slide dimensions for presentation surfaces.
- Avoid text overflow by design: fixed regions, max line lengths, and responsive fallbacks.
- Protect footer/source lanes. Sources, slide numbers, and controls must not sit on top of visual panels, shadows, charts, or decorative elements.
- Align peer elements deliberately. Step labels, option headings, table columns, timeline bands, and comparison cards should share baselines or axes when they are meant to be compared.
- Use equal-height cards, grid tracks, or explicit row layouts when paragraph length would otherwise create ragged comparisons.
- Keep important titles on one line when the phrase is short and the slide has enough horizontal space. If a title wraps awkwardly, fix the layout or copy.
- Treat whitespace as part of the composition. Do not leave a slide top-heavy, corner-heavy, or empty on one side unless that imbalance is intentional and visually clear.
- Use animation only when it clarifies sequence, causality, or interaction.
- Prefer transform and opacity for motion.
- Verify rendered slides with browser screenshots.
- Verify high-risk slides with measured bounding boxes in Playwright: active slide bounds, footer/control overlap, source/visual overlap, and mobile horizontal overflow.

## Avoid

- generic purple gradients,
- decorative blobs,
- nested cards,
- repeated identical card grids,
- tiny diagram labels,
- stock-photo filler,
- animation that competes with the speaker.
- decorative elements that invade source/footer lanes,
- tiny source text placed over shadows or dark panels,
- layouts that look correct only before presenter controls appear.

## Interactive Visuals

Good interactive slides teach a mechanism:

- sliders for parameter effects,
- steppers for formulas,
- toggles for before/after,
- hover/click for method comparison,
- staged animation for runtime flow.

The interaction must be understandable without the speaker debugging it live.
