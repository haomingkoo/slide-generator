# Heuristic Slide System

This repo can be treated as a maintained heuristic system for slide quality. The goal is not to train model weights. The goal is to keep improving the software, artifacts, tests and skill rules that turn messy inputs into clear decks.

This framing is inspired by Jiayi Weng's "Learning Beyond Gradients": a coding agent can improve an editable software system by reading feedback, editing code or rules, rerunning checks, and preserving useful memory. For this repo, the maintained object is the slide-making system.

Source: https://trinkle23897.github.io/learning-beyond-gradients/

## Mapping

| Heuristic-learning idea | Slide-generator equivalent |
|---|---|
| Policy | Skill instructions, templates, scripts, validators, rendering rules and review prompts |
| State | `work/` artifacts: deck plan, source map, claim ledger, audience model, story spine, slide sorter, design contract and slide specs |
| Feedback | User comments, agent critiques, browser screenshots, Playwright checks, validator failures, source-audit gaps and published-deck review |
| Update | Codex edits docs, skill rules, validators, examples, templates or deck files |
| Memory | `qa/` reports, `work/review-log.json`, eval outputs, example READMEs and product workflow lessons |
| Regression | `npm test`, validators, browser QA, screenshot review, captured baselines and source-backed evals |
| Compression | Turn repeated one-off fixes into smaller rules, validators, templates or examples |

## Deep-Agent Loop

Use specialist passes when the deck matters:

1. Researcher: checks source quality, freshness, missing claims and overclaim risk.
2. Story strategist: checks audience shift, title-only flow, slide jobs and next action.
3. Domain critic: checks whether the plan is practical in the user's actual domain.
4. Designer: checks hierarchy, layout, theme, whitespace, mobile behavior and visual proof.
5. Repairer: makes the smallest targeted changes and reruns checks.

The main agent owns integration. Specialists should produce bounded critique or disjoint patches; they should not all rewrite the same deck.

## Absorb Feedback

Every serious review should write feedback into the repo:

- deck-specific feedback goes in `examples/<deck>/qa/` or `projects/<deck>/qa/`,
- promoted feedback gets a row in `docs/heuristic-registry.md`,
- repeated slide failures go in `skills/slide-generator/references/`,
- deterministic failures become scripts or validator checks,
- useful patterns become templates, design contracts or example decks,
- dead ends and caveats stay visible so the next agent does not repeat them.

For example, the Chleo deck feedback produced rules about source-backed competitor tables, inline peer labels, mobile scaling, presenter controls, footer clearance, room-size explanations, validation language and execution-depth gates.

## Compress History

Do not keep adding rules forever. After a few reviews, compress:

- replace five narrow layout warnings with one reusable grid rule,
- move repeated copy problems into the humanizer or planning reference,
- convert recurring overflow problems into browser checks,
- turn successful decks into small example references,
- delete stale or contradictory guidance after a better rule exists.

Compression is what keeps the system maintainable. Without it, the skill becomes a pile of local patches.

## Regression Tests

A slide-system improvement should usually leave one of these behind:

- a passing example deck,
- a validator rule,
- a browser QA check,
- an eval prompt,
- a documented quality gate,
- a source-backed artifact trail.

Use:

```bash
npm test
npm run workflow:status -- <project>
npm run deck:build -- <project> --render
npm run qa:browser -- <project>
```

For custom HTML decks, use project validators plus Playwright screenshots and explicit bounds checks.

## What Not To Do

- Do not call a one-off deck improvement "learning" unless the repo keeps the feedback.
- Do not add a rule when a validator or template would prevent the failure more reliably.
- Do not let visuals hide unsupported claims.
- Do not let review logs grow forever without compressing repeated lessons.
- Do not optimize only for rendered beauty; the system must preserve evidence, story, delivery and mobile QA.

## Maintainer Cadence

After each serious deck:

1. Write a short `qa/slides-generator-feedback.md`.
2. Identify repeated failures.
3. Decide whether each failure belongs in docs, skill instructions, scripts, templates, examples or evals.
4. Make the smallest reusable change.
5. Run tests.
6. Update the example or eval that proves the improvement.

That is the repo's continual-improvement loop: absorb, repair, test, compress, repeat.
