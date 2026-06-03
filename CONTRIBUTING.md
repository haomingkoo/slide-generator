# Contributing

This repo is still early. The useful contributions are the ones that make the slide pipeline more reliable, more testable, or easier to run end to end.

## Development Loop

Run the validation suite before opening a pull request:

```bash
npm test
```

The suite currently checks:

- required repo files,
- Codex and Claude skill mirror sync,
- claim-ledger schema,
- slide claim references,
- architecture evidence paths,
- negative validator cases.

## Change Guidelines

- Keep changes scoped. Do not rewrite the workflow docs unless the behavior changes.
- If you edit `skills/slide-generator`, sync the mirrors:

```bash
rm -rf .agents/skills/slide-generator .claude/skills/slide-generator
cp -R skills/slide-generator .agents/skills/slide-generator
cp -R skills/slide-generator .claude/skills/slide-generator
npm test
```

- Add deterministic checks before adding more prompt instructions when the behavior can be validated by code.
- Treat third-party slide tools as product references, not truth sources.
- Do not add generated deck artifacts under `projects/*/work`, `projects/*/deck`, `projects/*/exports`, or `projects/*/qa`.

## Pull Requests

Good pull requests include:

- a short problem statement,
- the files changed,
- validation output,
- any remaining risk or follow-up work.
