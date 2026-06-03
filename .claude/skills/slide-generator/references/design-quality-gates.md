# Design Quality Gates

Use this after rendering and before export. The goal is to make the deck feel intentionally designed, readable, and accessible without letting the design pass rewrite the facts.

## Inputs

Use the smallest relevant context:

- rendered slide screenshots,
- `qa/browser-qa.json` when available,
- `work/slide-specs.json`,
- `work/audience-model.json`,
- theme CSS or brand contract,
- related claim IDs only when visual edits might change meaning.

Do not reload the full source corpus for visual polish unless a change would alter or add a factual claim.

## Gate 1: Content Discipline

For each slide, answer:

- What should the audience notice first?
- What should they understand or feel next?
- What can be removed without weakening the slide?

Pass conditions:

- one main idea per slide,
- title states the takeaway when the slide is argumentative,
- body copy is support, not a script,
- no filler slides such as generic "about this deck" or "why this matters" unless they perform a real narrative job.

Repair by cutting, splitting, or moving detail into speaker notes. Do not make smaller text to preserve clutter.

## Gate 2: Hierarchy And Rhythm

Review slide by slide, then across the deck.

Slide checks:

- primary, secondary, and tertiary elements are visually distinct,
- title, body, captions, and labels use a consistent type scale,
- important content has more space around it,
- alignment follows the grid,
- repeated slide types share spacing and structure.

Deck checks:

- layouts vary enough to avoid monotony,
- colors come from the chosen theme or brand contract,
- spacing feels systematic,
- comparison, table, quote, code, and architecture slides have distinct roles.

Repair by changing structure first, style second. If everything feels equally loud, mute supporting elements before enlarging the headline.

## Gate 3: Accessibility

Use WCAG AA as the floor:

- normal text contrast at least `4.5:1`,
- large text and non-text UI contrast at least `3:1`,
- do not use color alone to communicate status or comparison,
- avoid red/green-only distinctions,
- keep body text readable on a projected screen,
- preserve focus and keyboard navigation for HTML decks.

For slides, prefer explicit labels over decorative legends that require color inference.

## Gate 4: Anti-Generic Design Review

Scan for common generated-design tells:

- decorative emoji,
- rainbow or unrelated gradients,
- default purple/blue SaaS palettes without topic or brand reason,
- repeated rounded cards with arbitrary accent bars,
- filler illustrations that do not explain the topic,
- font choices that are defaults by accident,
- too many unrelated colors,
- off-scale spacing values.

Repair by returning to the deck's chosen visual idea. A clean deck can be restrained; a bold deck can be expressive. The failure is not minimalism or maximalism, but unearned decoration.

Also scan for hidden weakness:

- unexplained hardcoded visual choices,
- fallbacks not recorded in the deck artifacts,
- unsupported claims hidden in captions or notes,
- vague slides that sound plausible but do not prove, teach, compare, or decide anything.

Repair by turning the choice into a contract, assumption, claim, or explicit fallback. Do not let polish hide uncertainty.

## Gate 5: Slide Screenshot Review

When screenshots exist, inspect every slide image.

Check:

- no text or graphics clipped by slide edges,
- no overlapping text, charts, code, or labels,
- no tiny text in code, tables, captions, or diagrams,
- no crowded corners,
- no chart/table cells that require squinting,
- no visual element that looks interactive but is not,
- speaker notes do not introduce new factual claims.
- requested motion, fragments, or interactive aids work in the browser,
- animated or interactive aids have a static fallback.

Classify each issue:

- `blocker`: inaccurate, unreadable, inaccessible, clipped, or overlapping.
- `quality`: weak hierarchy, generic aesthetics, excessive density, inconsistent spacing.
- `polish`: subjective improvement that does not block review.

Repair blockers first. Re-render and re-check affected slides.

## Gate 6: Humanized Delivery

Run a copy pass over titles, body text, and speaker notes without adding facts.

Check:

- notes sound like a person can say them aloud,
- titles are concrete and not inflated,
- jargon is defined or moved to backup,
- `avoid_saying` catches overclaims and hype,
- Q&A answers do not promise more than the evidence supports.
- precise technical terms are preserved when they carry meaning.

Use the Humanizer skill or its rules when available. The pass may improve phrasing, rhythm, and plainness, but it must not add source claims. Re-run claim-reference lint after editing notes or slide copy.

Do not use a rigid word blacklist. Terms such as "smoke test", "structural", "deterministic", "schema", and "artifact" are fine when they are accurate and useful. Define them when the audience may not know them.

## Gate 7: Optional Frontend Polish Specialist

When the deck is HTML-heavy, animated, interactive, or visually ambitious, run an optional frontend polish review using the local design skill if available. In this environment, `impeccable` is installed globally, but the repo must not depend on that personal install.

Use it as a review lens for:

- anti-generic visual patterns,
- visual hierarchy,
- motion restraint,
- responsive behavior,
- accessibility basics.

Convert any useful finding into repo artifacts or code. Do not write "impeccable passed" unless an executable check or screenshot review supports it.

## Gate 8: Export Review

For PPTX/PDF handoff:

- export only after browser QA passes,
- verify the exported file exists and is not suspiciously small,
- note that first Google Slides support is PPTX import, not native Google Slides API generation,
- visually inspect converted exports when the target audience will use PowerPoint or Google Slides directly.

## Gate 9: Final Deck Verdict

Use one of:

- `ready_for_human_review`: accurate and readable, but still needs stakeholder taste review.
- `ready_to_present`: accurate, readable, polished, and speaker notes work live.
- `needs_repair`: any blocker remains.

Record the verdict in `qa/qa-report.md` with:

- slide numbers reviewed,
- issues found,
- fixes applied,
- unresolved judgment calls,
- any claims that need source audit after copy changes.
