# Deck Operations

This repo should support deck creation and deck editing. Many real slide workflows start from an existing deck, not a blank page.

## Operation Types

### Proofread

Use when the user wants typos, grammar, punctuation, footnotes, labels, or speaker notes checked.

Context scope: whole deck text.

Output:

- issue list by slide,
- suggested fix,
- optional patched deck.

Do not change meaning during a proofread pass.

### Simplify Dense Slides

Use when slides are text-heavy or hard to present.

Context scope: selected slides or whole deck copy.

Rules:

- one key takeaway in the title,
- no more than 3 supporting points unless the slide is an appendix,
- preserve data and caveats,
- remove filler before removing evidence.

### Executive Summary

Use when the audience needs a fast decision view.

Context scope: whole deck.

Output:

- one new summary slide,
- title states the most important takeaway,
- 3 to 4 support points from the deck,
- no new claims that are absent from the claim ledger.

### Audience Adaptation

Use when the same material needs a different audience.

Context scope: story spine, slide sorter, claim ledger, and slide specs.

Examples:

- technical team to C-suite,
- classroom to investor,
- internal team to customer,
- live talk to async deck.

Rules:

- change depth and framing,
- keep evidence traceability,
- do not invent new proof,
- update speaker notes and transitions.

### Translation And Localization

Use when the deck language changes.

Context scope: all visible text and speaker notes.

Rules:

- preserve structure,
- adapt culturally specific examples when allowed,
- preserve technical terms where translation would reduce precision,
- rerun visual QA because translated text may overflow.

### Action Title Rewrite

Use when slide titles are topic labels instead of conclusions.

Context scope: slide titles plus claim ledger.

Rules:

- title states an insight, implication, or recommendation,
- title must be supported by slide evidence,
- title should not overstate the claim,
- avoid long title paragraphs.

### Agenda And Section Dividers

Use when the deck needs clearer navigation.

Context scope: slide sorter.

Output:

- agenda slide,
- section divider slides if useful,
- repeated agenda with current section highlighted for longer decks.

Avoid adding navigation slides to short decks where they slow the story.

### Website To Deck

Use when the user provides a website as source material.

Context scope: web research mode must be allowed.

Rules:

- extract actual page claims,
- cite URLs,
- keep website facts separate from inferred positioning,
- do not assume missing metrics, customers, or product claims.

### Brief To Deck

Use when the user provides a structured brief but no existing deck.

Context scope: brief, sources, brand, and research mode.

Rules:

- create planning artifacts first,
- ask for missing audience or decision context if it materially changes the deck,
- do not render before the slide sorter works.

### Speaker Notes

Use when the deck is for live delivery.

Context scope: slide specs, story spine, and claim ledger.

Rules:

- notes should sound speakable,
- include key message, 2 to 3 talking points, and transition where useful,
- do not introduce unsupported claims,
- keep notes shorter for repeated-use decks.

## Operation Routing

```txt
fix typos -> proofread
too wordy -> simplify dense slides
make it executive -> audience adaptation + executive summary
make titles stronger -> action title rewrite
help me present -> speaker notes
add structure -> agenda and section dividers
turn URL into deck -> website to deck
turn brief into deck -> brief to deck
```

## Token Strategy

- Proofread and translate require whole-deck text.
- Simplify can be slide-range scoped.
- Action-title rewrite needs titles, slide summaries, and claim ledger.
- Executive summary needs whole-deck story and claim ledger, not every source file.
- Speaker notes need slide specs and story spine, not raw source corpus.
- Website-to-deck needs source extraction first, then normal planning artifacts.
