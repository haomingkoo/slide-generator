# Style Workbench

Static style picker for `slides-generator`.

Open it from a local static server:

```bash
python3 -m http.server 4173
open http://localhost:4173/examples/style-workbench/
```

What it does:

- lists vendored `frontend-slides` template recipes,
- lets the user mix a template recipe, palette lane and reference discipline,
- previews the selected visual direction,
- exports a prompt for Codex/Claude,
- exports a `design-contract.json`-compatible JSON object.

Credits are visible in the page and preserved in exported prompts. The workbench uses open-source `frontend-slides` references with MIT notice, public palette inspiration links, and private deck observations only as pattern notes. It does not include private downloaded decks or proprietary template assets.
