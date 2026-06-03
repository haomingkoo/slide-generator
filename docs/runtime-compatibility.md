# Runtime Compatibility

This repo is intended to work with both Codex and Claude Code.

## Codex

Codex-native repo skills live in:

```txt
.agents/skills/slide-generator/
```

Codex also uses:

- `AGENTS.md` for repo guidance,
- MCP tools for external systems,
- repo scripts for deterministic validation,
- Playwright/browser tooling for visual QA when available.

## Claude Code

Claude Code-compatible skills live in:

```txt
.claude/skills/slide-generator/
```

Claude Code can also use:

- `.claude/commands/make-deck.md` as a reusable command-style workflow,
- MCP servers such as GitHub, browser, filesystem, docs, or design tools,
- subagents for research, critique, and QA when available.

## Source Of Truth

During early development, the skill is mirrored in three places:

```txt
skills/slide-generator/
.agents/skills/slide-generator/
.claude/skills/slide-generator/
```

`skills/slide-generator/` is the development mirror. `.agents/skills` is the Codex runtime path. `.claude/skills` is the Claude Code runtime path.

Run `npm test` after editing the skill. The validation script fails if any mirror drifts.

## Future Cleanup

Once the runtime choice is stable, replace the mirrors with a sync script or make one directory the single source of truth. For now, explicit mirrors make compatibility clear and easy to inspect.
