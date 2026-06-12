# Style Workbench

Static style picker for `slides-generator`.

Open it from a local static server:

```bash
python3 -m http.server 4173
open http://localhost:4173/examples/style-workbench/
```

What it does:

- guides the user through a four-step flow: direction, template behavior, color and deck logic,
- lists vendored `frontend-slides` template recipes without exposing the full source ledger by default,
- lets the user mix a template recipe, palette lane and reference discipline,
- previews the selected visual direction with live slide specimens,
- exports a prompt for an agent,
- exports a `design-contract.json`-compatible JSON object,
- exports a `DESIGN.md` that can be reused as design context.
- gives a short build path: clone/open repo, prepare assets, generate, browser-QA and publish.

Credits are visible in the page and preserved in exported prompts. The workbench uses open-source `frontend-slides` references with MIT notice, public palette inspiration links, and private deck observations only as pattern notes. It does not include private downloaded decks or proprietary template assets.

Current browser screenshots:

- [desktop](screenshots/guided-desktop.png)
- [mobile](screenshots/guided-mobile.png)
