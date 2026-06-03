# Status And Roadmap

## Current Status

`slides-generator` is a pre-render slide-generation scaffold with executable guardrails.

Done:

- Codex skill mirror in `.agents/skills/slide-generator`.
- Claude Code skill mirror in `.claude/skills/slide-generator`.
- One-shot intake contract.
- Common deck-operation routing.
- Source-grounding policy.
- Product workflow lessons from Gamma, Figma Slides, Gemini, Canva, Plus AI, and SlideSpeak.
- Deterministic claim-ledger validator.
- Deterministic slide claim-reference linter.
- Deterministic architecture evidence validator.
- Positive and negative validator fixtures.
- GitHub CI.

Not done:

- Artifact generators.
- Formal `slide-specs.json` schema.
- HTML renderer.
- Browser screenshot QA script.
- Brand observation tooling.
- Code snippet evidence validator.
- PPTX renderer or template editor.

## Near-Term Roadmap

1. Define the first `slide-specs.json` schema.
2. Build the smallest HTML renderer.
3. Add one rendered eval deck.
4. Add browser QA for overflow, contrast, and screenshot capture.
5. Add brand observation from CSS, website screenshots, and uploaded decks.
6. Add code-snippet evidence validation.
7. Compare skill output against a one-shot baseline.

## MVP Bar

The first MVP should produce one complete HTML deck from committed source material:

- claim-ledger passes,
- slide claim references pass,
- architecture evidence passes when architecture exists,
- browser QA passes,
- source audit has no unsupported factual claims,
- speaker notes are usable for a live talk.
