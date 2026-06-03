# Codebase Review

Use when the deck describes software, architecture, implementation, or demo behavior.

## Outputs

Create:

- `codebase-review.md`
- `architecture-map.json`
- `code-snippets.json`
- `demo-path.md`

## Codebase Review Structure

```txt
1. What the app does
2. Main runtime flow
3. Important files
4. Services, agents, or modules
5. Data flow
6. External dependencies
7. Demoable behavior
8. Risks and limitations
9. Slide-worthy snippets
```

## Architecture Map

```json
{
  "nodes": [
    {
      "id": "frontend",
      "label": "Streamlit UI",
      "kind": "frontend",
      "evidence": "app/ui.py"
    }
  ],
  "edges": [
    {
      "from": "frontend",
      "to": "backend",
      "label": "API calls",
      "evidence": "app/ui.py:118"
    }
  ],
  "boundaries": [
    {
      "id": "backend-service",
      "contains": ["backend", "semantic-store"]
    }
  ]
}
```

Before using architecture diagrams in the final deck, run:

```bash
node scripts/validate-arch-map.mjs <project-dir>
```

This checks that nodes and edges have evidence, that edge endpoints exist, and that file/line evidence resolves relative to the reviewed codebase. Use `inference:` evidence only when the edge is reasoned from evidence rather than directly visible in one file.

Evidence paths must be relative to the reviewed codebase root. Absolute paths and `../` escapes are invalid. Do not use `source:` as evidence; use a real file path, URL, or explicit `inference:` label.

## Diagram Selection

- Use Mermaid for flowcharts, sequence diagrams, state machines, and C4-style diagrams.
- Use mingrammer/diagrams for cloud, Kubernetes, provider, and deployment diagrams.
- Use Excalidraw for sketch-like conceptual explanation.
- Use custom SVG/HTML for final polished slides when Mermaid labels are too small or layout is not good enough.

## Snippet Selection

Good snippets:

- prove a unique mechanism,
- show a verification step,
- show routing or state,
- are 6 to 12 lines,
- are understandable with one sentence of context.

Bad snippets:

- long setup code,
- generic boilerplate,
- code that needs five dependencies explained,
- code that claims behavior not visible in the snippet.
