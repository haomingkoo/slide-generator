# Deck Archetypes And Hooks

Use this after intake and before the story spine. The goal is to pick the opening move and deck route, not to copy a famous deck.

## Core Rule

Every deck needs a hook that makes the audience care quickly, a genre-specific route, proof that matches the audience's criteria, a main-deck/backup split, and a closing next action.

For detailed per-mode proof bars and red flags, read `deck-quality-benchmark.md`. This file owns hook selection and routing only.

## Opening Hooks

Choose one opening hook and record it in `work/intake-brief.md` or `work/story-spine.json`.

- `plain_thesis`: state what this is in one sentence. Best for investors, judges, and impatient executives.
- `concrete_user`: open on one user, task, failure, or workflow. Best for product, demo, and teaching decks.
- `sharp_question`: ask the question the deck will answer. Best for research, technical reviews, and strategy.
- `surprising_result`: show a sourced result or observed failure, with scope. Best when the evidence is strong.
- `why_now`: show the market, technical, regulatory, or behavioral shift that makes the idea newly possible. Best for fundraising and strategy decks.
- `before_after`: show the old path and the new path. Best for demos and change proposals.
- `decision_now`: name the decision needed today. Best for executive decks.
- `rubric_match`: name the judging criteria and how the project will prove them. Best for hackathon finals.
- `gap_statement`: state what prior work handles and what remains unsolved. Best for academic talks.
- `short_story`: use a brief story only when it is directly tied to the audience's stakes. Do not let the anecdote delay the point.
- `light_humor`: use only if it clarifies the point, fits the audience, and does not become the thing people remember.

Bad openings:

- broad trend with no concrete product, user, or question,
- table of contents as the first real slide,
- definitions before motivation,
- founder origin story before the audience knows what this is,
- generic "AI is changing everything" framing,
- joke, meme, or animation that does not carry the thesis.

## Route By Deck Mode

| Mode | Default opening | Runtime reference | Starter template |
| --- | --- | --- | --- |
| Investor demo-day | `plain_thesis` or `surprising_result` | `deck-quality-benchmark.md` VC section | `templates/marp/investor-demo-day-150s.json` |
| Seed fundraising | `plain_thesis`, `concrete_user`, or `why_now` | `deck-quality-benchmark.md` VC section | `templates/marp/vc-seed-deck.json` |
| Executive decision | `decision_now` | `deck-quality-benchmark.md` Executive section | `templates/marp/consulting-recommendation-10slide.json` |
| Hackathon demo | `plain_thesis`, `before_after`, or `rubric_match` | `deck-quality-benchmark.md` Hackathon section | `templates/marp/hackathon-demo-3min.json` |
| Hackathon finalist | `rubric_match` or `before_after` | `deck-quality-benchmark.md` Hackathon section | `templates/marp/hackathon-finalist-5min.json` |
| Research conference | `sharp_question`, `gap_statement`, or `surprising_result` | `deck-quality-benchmark.md` Technical/Research section | `templates/marp/research-conference-10min.json` |
| Technical review | `sharp_question` or `before_after` | `deck-quality-benchmark.md` Technical/Research section | `templates/marp/technical-architecture.json` |
| Teaching / explainer | `concrete_user`, `sharp_question`, or `short_story` | `deck-quality-benchmark.md` Teaching section | `templates/marp/teaching-deck.json` |

If the user's request mixes modes, pick the primary audience decision first. Put secondary material in backup.

## Backup And Appendix

Create backup by question, not by dumping leftovers.

Good backup labels:

- `Q: What baseline did you compare against?`
- `Q: What breaks?`
- `Q: Can judges run it?`
- `Q: What assumptions drive this projection?`
- `Q: What alternatives were rejected?`
- `Q: What code path proves this behavior?`

If the content is useful but not decisive for the main story, move it to backup. If it is unsupported or off-story, drop it.

## Template Rule

Use templates as archetype scaffolds. Replace every placeholder with source-backed, project-specific material. Never copy branded layouts, famous deck assets, company logos, or competitor visuals unless the user owns or supplies them.
