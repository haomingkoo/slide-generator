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

- `pitch-deck.json` for generic product, sales, or mixed pitch narratives.
- `campaign-strategy.json` for campaign strategy, go-to-market, launch and marketing proposal decks with challenge, insight, timeline, budget, persona, metrics and ask.
- `vc-seed-deck.json` for pre-seed or seed investor meetings.
- `investor-demo-day-150s.json` for a short investor pitch where clarity and recall matter more than full diligence.
- `hackathon-demo-3min.json` for a short demo-heavy judging pitch. Use the actual hackathon rubric, time limit, demo path, fallback, and proof assets.
- `hackathon-finalist-5min.json` for a stage finalist pitch with demo proof, technical depth, rubric fit, and limits.
- `executive-decision-deck.json` for recommendation, decision, and consulting-style decks.
- `consulting-recommendation-10slide.json` for a fuller answer-first recommendation deck with issue tree, options, roadmap, risks, and backup.
- `research-conference-10min.json` for a conference-style research talk with problem, gap, contribution, method, evaluation, result, limitation, and takeaway.
- `teaching-deck.json` for classroom, workshop, or explainer decks.
- `technical-architecture.json` for codebase, platform, security, and system review decks.

Template selection is not only visual. If the idea, evidence, or rubric fit is weak, critique that before polishing the deck.
