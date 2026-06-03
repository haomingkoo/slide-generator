# Marp Slide Spec Templates

These templates are starting points for `work/slide-specs.json`.

They are not source-audited decks. Before rendering a real project:

1. Replace placeholder text with project-specific content.
2. Create `work/claim-ledger.json`.
3. Replace placeholder `claim_ids` and `claim_use` values with real ledger references.
4. Run:

```bash
npm run validate:slides -- projects/my-deck
npm run lint:claim-refs -- projects/my-deck
npm run render:marp -- projects/my-deck --html
```

Use:

- `pitch-deck.json` for investor, hackathon, product, or sales narratives.
- `teaching-deck.json` for classroom, workshop, or explainer decks.
- `technical-architecture.json` for codebase, platform, security, and system review decks.
