# Codex Ecosystem Notes

This repo should use Codex-native structure where possible.

## Official Codex Building Blocks

- `AGENTS.md`: repo guidance loaded by Codex.
- `.agents/skills/<skill>/SKILL.md`: repo-scoped skills for repeatable workflows.
- `references/`, `scripts/`, `assets/`: progressive disclosure inside a skill.
- MCP servers: external systems and tools when the workflow needs live integrations.
- Plugins: installable distribution units if the slide workflow needs to be shared across repos or teams.
- Multi-agent features: useful for research, critique, QA, and baseline evals when available.

OpenAI docs describe skills as reusable workflow folders with `SKILL.md` plus optional scripts, references, and assets. Repo skills belong in `.agents/skills`; global personal skills belong in `$HOME/.agents/skills`.

Source: https://developers.openai.com/codex/concepts/customization#skills

## Repo Choice

The active slide skill lives in:

```txt
.agents/skills/slide-generator/
```

The top-level `skills/` directory is kept as a development mirror for now. If this becomes confusing, make `.agents/skills` the only source of truth.

## Equivalent To Anthropic Skill Patterns

The comparable Codex approach is:

- Anthropic skill folder -> Codex skill folder.
- Anthropic skill references -> Codex skill references.
- Anthropic skill scripts -> Codex skill scripts.
- Anthropic eval loop -> repo evals plus subagent/baseline runs when available.
- Anthropic packaged skill -> Codex plugin when distribution is needed.

## Practical Direction

Build the slide generator first as a repo skill. Add deterministic scripts as repeated work emerges. Package as a plugin only after the skill, evals, and renderers are stable.
