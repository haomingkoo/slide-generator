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

The skill appears in three places, but only one is authored:

```txt
skills/slide-generator/                  canonical source
.agents/skills/slide-generator/
.claude/skills/slide-generator/
```

`.agents/skills` is the Codex runtime path. `.claude/skills` is the Claude Code runtime path. These paths are generated mirrors because the runtimes discover skills there.

Edit `skills/slide-generator/`, then run:

```bash
npm run sync:skills
npm test
```

`npm test` fails if any mirror drifts.
