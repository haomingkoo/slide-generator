# Design Contract

Create `work/design-contract.json` after theme selection and before high-fidelity rendering when a deck has more than a few slides, multiple contributors, a brand/style reference, or any risk of visual drift.

The design contract is the deck's visual memory. It records the decisions that should stay stable across slide repairs, theme edits, and future sessions.

## When To Create It

Create or update this artifact when:

- the user provides brand guidelines, example decks, screenshots, or websites,
- the deck needs to feel polished or public-facing,
- the deck uses a custom theme,
- multiple layout types are used,
- a visual critique changes spacing, typography, or color rules,
- a later session continues the same deck.

For a quick internal draft, a named theme in `slide-specs.json` may be enough. For a pitch, teaching, executive, or architecture deck, create the contract.

## Schema

Use this shape:

```json
{
  "version": 1,
  "source": {
    "type": "theme | brand_guide | website | existing_deck | user_direction",
    "references": []
  },
  "direction": {
    "personality": "clean surgical | warm editorial | dark runtime | brand-derived | custom",
    "audience_fit": "",
    "density": "sparse | balanced | dense",
    "depth": "flat | borders_only | subtle_shadows | layered",
    "grid": "strict | editorial | modular"
  },
  "tokens": {
    "colors": {
      "background": "",
      "surface": "",
      "text": "",
      "muted": "",
      "accent": "",
      "secondary_accent": "",
      "border": ""
    },
    "typography": {
      "heading": "",
      "body": "",
      "mono": "",
      "scale": []
    },
    "spacing": {
      "base": "",
      "scale": []
    },
    "radius": [],
    "shadow": []
  },
  "patterns": {
    "title_slide": "",
    "section_slide": "",
    "comparison_slide": "",
    "table_slide": "",
    "code_slide": "",
    "architecture_slide": ""
  },
  "rules": {
    "avoid": [],
    "must_preserve": [],
    "accessibility": []
  },
  "decisions": [
    {
      "decision": "",
      "rationale": "",
      "date": "YYYY-MM-DD"
    }
  ]
}
```

## Rules

- Do not invent brand tokens from a company name. Use observed evidence or user direction.
- Keep color values traceable to theme CSS, brand guide, website CSS, uploaded deck, or explicit user instruction.
- Keep spacing and type scales stable. Do not introduce one-off values during slide-local repair.
- Record why a direction was chosen. For example: "clean surgical light because the audience is executive and the deck will be printed."
- If the user changes taste direction, update the design contract first, then rerender affected slides.
- If a visual fix requires a new pattern, add it to `patterns` before using it repeatedly.

## Audit

During critique, check rendered slides against the design contract:

- off-contract colors,
- inconsistent title placement,
- spacing values that do not fit the scale,
- table or code slides that use different density from the contract,
- accidental drift into dark mode or decorative styling,
- use of shadows when the contract says borders-only,
- generic cards or decorative accents that are not part of the pattern set.

Repair drift in the theme or slide spec. Do not patch drift with isolated CSS overrides unless the exception is explicitly recorded in `decisions`.
