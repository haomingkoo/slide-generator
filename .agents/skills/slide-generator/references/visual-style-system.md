# Visual Style System

Use this reference when the user asks why a deck looks good, wants more visual styles, cites `frontend-slides`, Gamma, Canva, Figma Slides, Slidev, or asks for a deck to feel less generic.

## Operating Rule

Do not jump from content to one final style. Run visual discovery:

1. Infer the deck register, audience and setting.
2. Offer 2 or 3 named style directions.
3. For each direction, state what it borrows, what it avoids and what could fail.
4. If possible, create a title-slide or 3-slide preview before full rendering.
5. Record the choice in `work/design-contract.json`.
6. Test representative slide types in the browser: title, table, timeline, comparison, appendix.
7. If the user supplies a PDF/PPTX reference deck, render it first and extract repeated layout patterns before designing.

## Good Slide Design

Good slides usually have:

- one job,
- one strong visual proof object,
- a takeaway title,
- stable 16:9 stage behavior for live presentation,
- visible grid and aligned peer elements,
- short body copy,
- source/footer lanes that do not fight the visual,
- protected chrome: sources, slide numbers and controls cannot overlap content,
- enough visual rhythm to avoid bland card grids,
- browser-tested desktop and mobile behavior.

## Reference Deck Intake

For Gamma, Canva, Figma, Keynote or PowerPoint references:

- Prefer PDF for visual critique and PPTX for structure.
- Render every PDF page to PNG and create a contact sheet.
- Extract text separately so the story can be judged without the template.
- Identify repeated layout families instead of copying a single slide.
- Convert the reusable design rules into a design contract or style pack.
- Do not copy proprietary template assets. Preserve license notices for reusable open-source material.

## Hard Failure Gates

Before calling an HTML deck done:

- URL hashes, overview cards, keyboard and buttons must activate the same slide.
- Inactive slides must be hidden from the accessibility tree.
- Presenter controls must sit outside the scaled stage or the stage must reserve a control band.
- The content grid must stop above source and metadata lanes.
- Source text must wrap without covering claim IDs or slide numbers.
- Editable decks must version or signature-check local saved edits. Never restore old edits into a changed slide structure by raw element index.

## Frontend Slides Credit

`frontend-slides` by Zara Zhang is an MIT-licensed reference for HTML slide design, visual style discovery, curated anti-AI-slop presets, fixed 16:9 stages and progressive template loading.

Repository: https://github.com/zarazhangrui/frontend-slides

Borrow workflow patterns and credit the source. Do not copy code or assets without preserving the MIT copyright and license notice.

This repo vendors selected reference files under `vendor/frontend-slides/` with the upstream MIT license preserved. For normal generation:

1. Read `vendor/frontend-slides/bold-template-pack/selection-index.json`.
2. Shortlist 2 or 3 candidates from metadata.
3. Read only shortlisted `preview.md` files.
4. After the user chooses, read exactly that template's `design.md`.
5. Convert the design into this repo's artifact workflow and QA gates.

Do not bulk-read every template design file. Do not force the reference palette when the user dislikes it.

## Colorway Rule

Templates are layout and visual-grammar references, not fixed color mandates.

- Cream, beige, parchment and bone-paper palettes are opt-in, not defaults.
- If the user says a palette is wrong, preserve the useful structure and create a new colorway.
- Prefer cooler light palettes for professional decks unless a warm editorial mood is requested.
- `Cobalt Grid` is a strong preferred lane for light technical, hackathon, proposal and product decks: ice-blue or white canvas, electric cobalt accents, thin rules, graph grid and restrained signal marks.
- Always protect contrast, sources, slide numbers and presenter controls before preserving decorative palette details.

## Style Pack Contract

A reusable style pack needs:

- purpose and anti-purpose,
- typography,
- color tokens,
- layout families,
- table/chart rules,
- source/footer rules,
- mobile behavior,
- preview slides,
- known failure modes.

Prefer adding a style as `design-systems/<style>/DESIGN.md` and `templates/design-contracts/<style>.json` before treating it as reusable.

## Product References

- Gamma: outline-first generation, fast remix, global style changes.
- Canva: template breadth, asset breadth, approachable visual choice.
- Figma Slides: component-level editability, design tokens, precise inspection.
- Slidev: developer-friendly Markdown/Vue deck runtime, presenter mode and export paths.

Use these as product references. Keep this repo's lane focused on source-grounded agentic decks with frontend-quality output.

## Observed Reference Lanes

When learning from the supplied Gamma exports:

- Keel-style company deck: restrained dark surface, strong alignment, simple charts/tables, low object count, sparse accent use.
- Competitive-landscape deck: image-led splits, dark overlays, large mood-setting photos, simple accent-coded diagrams, strong visual continuity.
- Cool campaign light deck: white field, lavender accent, cool silver image slabs, numbered challenge rows, KPI strip, budget ladder and ask rows.
- Cobalt Grid: light graph-paper structure, electric cobalt hierarchy, hairline rules, technical signal marks and crisp aligned evidence blocks.

Borrow these as style mechanics. Do not copy proprietary imagery or template assets. For a light proposal deck, translate the mechanics into clean hierarchy, image-led moments, controlled source lanes and fewer crowded multi-purpose slides.
