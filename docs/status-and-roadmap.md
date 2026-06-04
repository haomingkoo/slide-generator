# Status And Roadmap

## Current Status

`slides-generator` is an early render-capable slide workflow with executable guardrails.

Done:

- Codex and Claude Code runtime adapters generated from one canonical skill.
- Artifact contracts for intake, source map, claim ledger, audience model, story spine, content priority, visual plan, design contract, slide specs, and review log.
- Deterministic validators for claims, claim refs, architecture evidence, audience, story, design, and slide specs.
- Marp HTML renderer with speaker notes, rendered HTML inspection, multi-viewport browser QA, and PDF/PPTX handoff export.
- Quality rubric, scorecard, and repair-plan artifacts with deterministic validation and a quality gate command.
- Starter templates for pitch, VC seed, hackathon demo, executive decision, teaching, and technical architecture decks.
- Source-backed demo and eval projects with generated deck/QA output reproduced by test commands.
- A/B eval harness for the first source-backed eval, comparing the skill output against a frozen self-authored structural proxy baseline.
- GitHub CI and negative validator fixtures.

Not done:

- Automatic artifact generation from arbitrary large source corpora.
- Image-based brand sampling from screenshots, logos, and decks.
- Native editable PPTX template generation.
- Native Google Slides API generation.
- Full accessibility engine beyond focused browser QA.
- Captured model-specific one-shot baseline comparison.
- Semantic claim-vs-evidence verification beyond URL/source anchoring and review.
- Autonomous repair execution without Claude/Codex updating the artifacts.

## Near-Term Roadmap

1. Replace the frozen structural proxy baseline with captured model-specific one-shot outputs and blind review.
2. Use the quality score loop on real decks and compare score movement before/after targeted repairs.
3. Add verbatim source anchors or retrieval snippets for external-source claims.
4. Add brand observation from CSS, website screenshots, and uploaded decks.
5. Add PPTX-specific visual QA and native editable PPTX generation only after the HTML-first path is stable.

## Template Roadmap

Add templates by real presentation job, not decorative style alone:

- sales proposal,
- customer case study,
- product launch,
- sprint or weekly update,
- research talk,
- model-evaluation report,
- training/onboarding,
- workshop facilitation,
- Q&A appendix,
- board update,
- product demo with live fallback.

## MVP Bar

A deck is not complete because it rendered. The MVP bar is:

- artifact validators pass,
- browser QA passes,
- generated output can be reproduced,
- factual claims are mapped to the claim ledger,
- evidence gaps are caveated or removed,
- speaker notes are usable for delivery,
- review log has no unresolved high-severity issues.
