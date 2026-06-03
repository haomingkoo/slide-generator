# Brand System

Use when brand guidelines, example slides, logos, screenshots, websites, or style references exist.

## Brand Contract

Create `brand-contract.json` before theme selection:

```json
{
  "source": "brand guide, website, existing slides, or user description",
  "colors": {
    "background": [],
    "text": [],
    "accent": [],
    "semantic": {}
  },
  "typography": {
    "heading": "",
    "body": "",
    "fallbacks": []
  },
  "layout": {
    "density": "sparse | medium | dense",
    "radius": "sharp | slight | rounded",
    "grid": "strict | editorial | fluid"
  },
  "voice": {
    "tone": "",
    "avoid": []
  },
  "evidence": []
}
```

## Rules

- Match brand before inventing style.
- Brand values must come from observed evidence: a brand guide, CSS, rendered website, sampled slide, uploaded asset, or explicit user instruction.
- Do not infer hex colors, fonts, or logos from a brand name alone.
- Record observed colors, typography, and layout cues in `evidence[]`.
- Preserve readability over exact aesthetic imitation.
- Prefer a small, stable palette to many brand colors.
- Use semantic colors consistently across charts, diagrams, and states.
- When brand assets are weak or incomplete, generate two proposals: `brand-faithful` and `brand-inspired`.

## Theme Preview

Before full rendering, produce title-slide previews when:

- brand guidelines are ambiguous,
- values were inferred from weak evidence rather than directly observed,
- the user supplied multiple style references,
- the audience may dislike dark mode,
- the deck is high-stakes or public-facing.

## PPTX Brand Quality

For editable PPTX, brand quality includes theme fonts, theme colors, reusable layouts, and slide masters. A visually good deck that starts from a blank default layout is not a complete brand system.
