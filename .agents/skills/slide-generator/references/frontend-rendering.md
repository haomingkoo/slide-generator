# Frontend Rendering

Use for HTML decks, interactive demos, visual aids, and browser-rendered exports.

## Design Standard

Commit to a clear aesthetic direction, then execute it precisely. Clean minimalism still needs craft: grid, spacing, type scale, color restraint, and clear focal points.

## Rendering Rules

- Use structured slide specs, not ad hoc HTML.
- Use CSS variables for theme tokens.
- Use stable slide dimensions for presentation surfaces.
- Avoid text overflow by design: fixed regions, max line lengths, and responsive fallbacks.
- Use animation only when it clarifies sequence, causality, or interaction.
- Prefer transform and opacity for motion.
- Verify rendered slides with browser screenshots.

## Avoid

- generic purple gradients,
- decorative blobs,
- nested cards,
- repeated identical card grids,
- tiny diagram labels,
- stock-photo filler,
- animation that competes with the speaker.

## Interactive Visuals

Good interactive slides teach a mechanism:

- sliders for parameter effects,
- steppers for formulas,
- toggles for before/after,
- hover/click for method comparison,
- staged animation for runtime flow.

The interaction must be understandable without the speaker debugging it live.
