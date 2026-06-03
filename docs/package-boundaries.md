# Package Boundaries

This repo has several layers. Keeping the boundaries explicit prevents the package from becoming an agent artifact dump.

| Layer | Path | Rule |
|---|---|---|
| Public entry | `README.md`, `AGENTS.md` | Short, practical, and honest about limits. |
| Canonical skill | `skills/slide-generator/` | Authored source for agent behavior. |
| Runtime adapters | `.agents/`, `.claude/` | Generated mirrors required by Codex and Claude Code discovery paths. |
| CLI and guardrails | `scripts/` | Executable validators, renderer wrappers, QA, export, scaffold, and sync tools. |
| Rendering assets | `renderers/`, `templates/`, `design-systems/` | Reusable themes, layouts, and design contracts. |
| Examples | `examples/` | Small public demos with committed source/work artifacts. |
| Evals | `evals/` | Source-backed eval inputs and expected artifacts; generated `deck/` and `qa/` output should be reproducible. |
| Tests | `tests/` | Fixtures and negative validator cases. |
| Maintainer docs | `docs/` | Architecture, policy, roadmap, and research notes. |
| Local work | `projects/`, `.agent-work/` | User decks and inter-agent review notes; mostly ignored by git. |

## Canonical Skill And Mirrors

`skills/slide-generator/` is the only authored skill source. The runtime mirrors exist because Codex and Claude Code discover repo-local skills from fixed paths:

```txt
.agents/skills/slide-generator/
.claude/skills/slide-generator/
```

Do not edit those mirrors directly. Use:

```bash
npm run sync:skills
npm run sync:skills -- --check
```

`npm test` runs the sync check so mirror drift fails CI.

## Generated Artifacts

Deck outputs are useful for review but should not silently bloat the repo.

- Commit source inputs and durable `work/` artifacts when they are part of an example or eval.
- Do not commit generated `deck/`, `qa/`, `exports/`, or screenshot folders unless a specific artifact is intentionally curated for documentation.
- Local user projects under `projects/<name>/` are ignored by default.

## Runtime References Vs Maintainer Docs

Runtime references under `skills/slide-generator/references/` should be concise and directly useful while an agent is making or repairing a deck.

Long-form research, product comparisons, roadmap notes, and implementation rationale belong in `docs/`.

## Package Discipline

Before adding a file, decide which layer owns it:

- If a command runs it, put it in `scripts/`.
- If an agent must read it during deck work, put it in `skills/slide-generator/references/`.
- If it is a reusable visual or design starting point, put it in `templates/`, `renderers/`, or `design-systems/`.
- If it is only review discussion, keep it in `.agent-work/`.
