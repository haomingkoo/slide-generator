# Visual Style System

Good decks are not good because they have more decoration. They are good because the visual system helps the audience understand and remember the argument.

Use this guide when building new style directions, theme previews, HTML decks, or a future review workbench.

## What Makes A Deck Feel Good

Strong decks usually get these things right:

- One clear job per slide.
- A title that says the point, not the category.
- One dominant visual proof object: table, chart, diagram, photo, screenshot, timeline, decision gate or strong typographic object.
- A layout grammar that repeats enough to feel coherent but varies enough to stay alive.
- Stable stage geometry, usually fixed 16:9 for presentation decks.
- Large readable type, with body text kept short.
- A real palette, not accidental variations of one hue.
- Explicit source, appendix or speaker-note lanes so metadata does not fight the visual.
- Browser-tested spacing, not guessed spacing.

The Chleo deck works better after repair because it combines source-backed planning with a strong visual grammar: poster-scale titles, hard borders, color-block sections, fixed footer lanes, readable tables, and presenter controls that do not cover content.

## Why Frontend Slides Is A Useful Reference

`frontend-slides` is a strong reference because it treats slide design as frontend design:

- It uses visual style discovery: generate previews, pick a direction, then build the full deck.
- It includes curated presets and bolder template systems, so the agent does not default to bland SaaS cards.
- It keeps presentations as single HTML files with fixed 16:9 stages, inline CSS/JS and no required build system.
- It uses progressive loading: inspect a compact style index first, then load only the chosen style in detail.
- It explicitly targets anti-AI-slop aesthetics.

In this repo, credit the source and borrow the workflow pattern. Do not silently copy template code or assets without preserving MIT license notices.

Selected `frontend-slides` reference files are vendored under `vendor/frontend-slides/` with the upstream MIT license and notice preserved. Use the compact index first:

```txt
vendor/frontend-slides/bold-template-pack/selection-index.json
```

Then load only the shortlisted `preview.md` files, and finally the selected template's `design.md`. Do not bulk-read every template design file for normal deck generation.

## Colorway Policy

Templates are recipes, not mandatory palettes. If the user dislikes a palette, keep the layout grammar and generate a new colorway.

Current taste notes:

- Cream, beige, parchment and bone-paper backgrounds are not defaults. Use them only when requested or when the deck genuinely needs a warm archival/editorial feel.
- `Cobalt Grid` is a preferred light technical lane: white or ice-blue canvas, cobalt accent, visible graph grid, thin rules and signal marks.
- Good alternate light colorways: cobalt/cyan, ink/mint, white/lilac-grey, cool silver/blue, black/green technical, and restrained coral/blue for warmer proposals.
- Avoid one-note palettes where every surface, accent and chart is just a variant of one hue.
- Preserve contrast and source-lane legibility before preserving the reference palette.

## Style Discovery Flow

For any polished deck where taste is unclear:

1. Read the deck plan and audience.
2. Offer 2 or 3 style directions.
3. For each direction, show:
   - name,
   - mood,
   - when it fits,
   - what the first slide would look like,
   - what can go wrong.
4. Let the user choose, or record a default.
5. Write the chosen direction into `work/design-contract.json`.
6. Render a few representative slides before building the full deck when the deck is high stakes.

Good theme choices should say what they borrow and what they avoid. Example:

```txt
Creative Light
Borrow: poster-scale type, hard borders, cream paper, four accent colors.
Avoid: tiny labels, too many card grids, visual noise around source footers.
```

If a reference has the right layout but wrong palette, record both decisions:

```txt
Cobalt Grid Variant
Borrow: fixed graph canvas, cobalt hierarchy, hairline rules, stepped signal marks.
Change: replace cream or parchment with ice-blue/white, keep footers outside decoration.
Avoid: saturated cobalt everywhere, grid lines behind dense copy.
```

## Building More Style Packs

A new style pack should be a small design system, not only a color palette.

Recommended structure:

```txt
design-systems/<style-name>/DESIGN.md
templates/design-contracts/<style-name>.json
examples/<style-name>-preview/deck/index.html
```

Each style needs:

- purpose: what kind of decks it fits,
- anti-purpose: what it should not be used for,
- typography,
- color tokens,
- layout families,
- source/footer rules,
- chart/table rules,
- mobile behavior,
- example slides,
- known failure modes.

## Style Pack Quality Gate

Before a style becomes reusable:

- title slide, table slide, timeline slide, comparison slide and appendix slide are tested,
- desktop and mobile screenshots are checked,
- source/footer lanes do not collide with controls,
- the content grid reserves space for sources, metadata and navigation controls,
- slide URL hashes, overview cards and arrow controls all activate the same slide,
- hidden slides are hidden from the accessibility tree,
- local edit restore is versioned or signature-checked so old edits cannot corrupt a new deck,
- the style can handle long English words and Singapore-dollar ranges,
- it has a fallback for dense factual material,
- the style does not depend on one-off hand tuning in a single deck.

## Reference Deck Conversion

When the user provides a Gamma, Canva, Figma, Keynote or PowerPoint export, treat it as a design reference before treating it as source content.

Use both formats when possible:

- PDF for visual inspection. Render every page to PNG and make a contact sheet.
- PPTX for structure. Extract slide count, text boxes, fonts, colors, media and layout coordinates.

Conversion workflow:

1. Render all slides at presentation resolution.
2. Make a contact sheet and inspect the sequence.
3. Extract text with `pdftotext` or PPTX parsing so the story can be reviewed separately from the visuals.
4. List repeated layout families: cover, split image/title, table, metric, timeline, comparison, closing slide.
5. Extract the visual rules, not the exact template: type scale, grid, image treatment, color strategy, footer behavior and density.
6. Build a small HTML preview using those rules.
7. Run Playwright screenshots across desktop, short laptop and mobile.
8. Record the style as a design contract only after it passes the quality gate.

Do not copy proprietary template assets or brand visuals. If a deck is MIT-licensed or otherwise reusable, preserve the license notice before reusing code or assets.

## Lessons From Supplied Gamma Exports

The supplied Gamma PDFs show two useful style lanes.

Keel company template:

- dark restrained surface,
- one sans family with clear weight contrast,
- wide margins and low object count,
- thin rules and rounded tables instead of heavy decorative cards,
- charts with enough breathing room,
- small metadata tags used sparingly.

Use this lane for executive, strategy, technical and data-heavy decks where calm credibility matters more than visual loudness.

Competitive landscape template:

- large photographic panels and dark overlays,
- asymmetric image/text splits,
- one strong accent color plus muted secondary colors,
- big title slides with a single visual mood,
- simple diagrams that read from far away,
- repeated image treatment to make the deck feel expensive.

Use this lane for market, brand, business and proposal decks where the audience should feel a real world behind the analysis.

For the Chleo proposal, borrow the discipline, not the darkness: cleaner visual hierarchy, image-led moments where useful, controlled source lanes, and fewer cramped all-purpose slides.

Campaign strategy template:

- light surface with restrained lavender accent,
- cool silver/blue image fields for visual rhythm,
- numbered rows for challenge signals and next actions,
- KPI strip for success metrics,
- budget chart/table plus allocation rationale,
- persona slide only when backed by real research.

Use this lane for marketing, launch, go-to-market and campaign proposal decks. Avoid generic metallic texture as proof, fake campaign metrics, fake personas and line charts for categorical budgets.

## Chrome And Edit-State Guardrails

Slide chrome is part of the layout, not an overlay afterthought.

- Reserve a bottom content boundary above sources and metadata.
- Keep presenter controls outside the scaled stage or scale the stage to leave a control band.
- Source text must wrap inside its lane and keep claim IDs visible.
- Tables and charts must fit above the source lane at short-laptop height.
- Inactive slides should be `aria-hidden` and inert so screenshots, screen readers and browser snapshots do not mix slide text.
- Editable decks must not restore saved text by raw element index unless the saved data carries a matching deck signature.
- After changing slide structure, invalidate old edit storage or provide a reset path.

## How This Compares To Gamma, Canva And Figma

Gamma is strong at turning an outline into a coherent first visual draft quickly. Borrow: outline-first generation, fast theme exploration, global rewrite/remix controls.

Canva is strong at asset breadth and approachable templates. Borrow: visual choice, template range, easy previewing. Avoid: letting template polish hide weak claims.

Figma/Figma Slides is strong at editable design systems and component-level control. Borrow: reusable components, tokens, variants, precise layout inspection. Avoid: making every deck require manual design labor.

This repo's strongest lane should be different: source-grounded agentic decks that combine research discipline with frontend-quality HTML visuals.

## Next Product Step

The best next UI is a style workbench:

- choose a deck project,
- view 2 or 3 style previews,
- compare title/table/timeline slides,
- pick a style,
- see the generated design contract,
- run browser QA,
- send one slide back to Codex for targeted repair.

That gives us the useful part of Gamma/Canva/Figma without trying to rebuild all of them first.

The first static version lives at `examples/style-workbench/`. It is intentionally simple: browse template recipes, mix palette lanes and reference disciplines, preview the direction, then export a prompt or design-contract JSON.

Use `docs/template-source-registry.md` before importing more templates. The workbench can list many sources, but vendoring a source requires license review, attribution and a scoped import.

## Consulting References

Consulting deck references should influence thinking discipline, not become copied templates.

- Ampler's McKinsey deck collection is useful as a directory of public consulting slide examples and common framework patterns.
- Slideworks' BCG slide-writing guide is useful for action titles, storylining, title-only story checks, slide-purpose discipline, chart/table/process selection and quality control.
- SlideGenius' Accenture portfolio page is useful as an agency-style reference for minimalist executive-summary presentation work and attention-aiding visuals.

Use these as source-attributed references in prompts. Do not copy proprietary images, deck screenshots, client branding or template assets.

## Motion / Frame References

HyperFrames is useful because it separates design language from frame composition:

- `design.md` carries the brand/style system,
- `frame.md` carries the 16:9 composition and motion direction,
- pacing, scale, dwell and movement are explicit instead of guessed after export.

For this repo, the sequence is:

1. make the static deck readable and source-safe,
2. export or derive a compact design contract,
3. translate selected slides into a frame-facing spec only when motion helps the story,
4. test that source lanes, footers and presenter controls do not overlap animated content.

Do not use motion as a substitute for weak claims, unclear story flow or shallow research.
