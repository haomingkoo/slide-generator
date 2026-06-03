# Intake And One-Shot Drafting

Use this when the user wants a strong first draft from one prompt or a dumped folder of material.

The goal is an 80 to 90 percent useful draft, not a final deck with no review. The way to get there is to capture the constraints that matter, write them into `intake-brief.md`, then generate through the normal artifact pipeline.

## One-Shot Contract

Before planning slides, resolve these fields:

- `topic`: what the deck is about.
- `audience`: who will see it and what they already know.
- `job_to_be_done`: what the audience should understand, believe, decide, or do.
- `delivery_mode`: live talk, async reading deck, workshop, recorded video, or document handoff.
- `time_or_length`: talk length, target slide count, or reading depth.
- `source_policy`: `source_only`, `source_first`, `broad_research`, or `style_research`.
- `source_handling`: `enhance`, `preserve`, or `strict`.
- `output_mode`: HTML, PDF, editable PPTX, Google Slides handoff, or multiple exports.
- `style_direction`: clean light, warm editorial, dark runtime, brand-derived, or user-specified.
- `brand_inputs`: brand guide, website, existing deck, logo, colors, fonts, or none.
- `visual_expectations`: diagrams, charts, before/after, phone mockups, code snippets, demos, or minimal.
- `accuracy_bar`: normal, strict, regulated, investor/client-facing, or internal draft.
- `speaker_notes`: none, concise talk track, detailed talk track, or presenter coaching.
- `must_include`: required points, sources, examples, demos, or screenshots.
- `must_avoid`: claims, tone, styles, jargon, competitors, or sensitive material to avoid.

## Ask Once, Then Move

Ask only for missing information that materially changes the deck. Batch questions in one message.

If the user wants momentum or does not answer, proceed with defaults and record each default in `intake-brief.md` as an assumption. Surface the assumptions at the slide-sorter checkpoint so the user can correct them before rendering.

Default assumptions:

- audience: informed professional but not a domain expert.
- job_to_be_done: explain clearly and help the audience decide what to do next.
- delivery_mode: live presentation with speaker notes.
- time_or_length: 8 to 12 slides unless the prompt implies otherwise.
- source_policy: `source_only` when files are provided; `source_first` when the user asks for current context.
- source_handling: `strict` for legal, financial, medical, technical architecture, code, benchmarks, and client-facing claims; otherwise `enhance`.
- output_mode: HTML draft first, then PDF or PPTX export when requested.
- style_direction: `clean-surgical-light` unless the prompt, brand, or topic calls for something else.
- visual_expectations: use visual aids for change, sequence, architecture, comparison, tradeoffs, and hidden mechanisms.
- speaker_notes: concise talk track.

## Source-Handling Modes

`enhance`: The agent may clarify wording, add structure, and add researched context if the source policy allows it. New factual claims still need claim IDs.

`preserve`: The agent should keep the user's source meaning and terminology close to the original, while improving structure and readability. Use this for internal reports, transcripts, and executive summaries where fidelity matters.

`strict`: The agent must not add factual claims beyond the provided source or approved research. Use direct caveats for unsupported or uncertain points. This is the default for code, architecture, benchmarks, compliance, investor, client, and high-stakes decks.

## One-Shot Prompt Shape

When helping the user write a single strong prompt, use this structure:

```txt
Create a [slide count or time] deck about [topic] for [audience].
The deck should help them [decision, belief, action, or learning outcome].
Use [source policy] and [source handling].
Use this style direction: [style or reference].
Include these visual aids if useful: [diagrams, charts, before/after, demos, screenshots].
Output [HTML/PDF/PPTX] with [speaker note preference].
Must include: [required points].
Must avoid: [unsupported claims, tone, styles, sensitive details].
Before rendering, show me the slide sorter, theme direction, and any assumptions.
```

## Draft Package

A one-shot run should still create durable artifacts:

- `input/brief.md` or `work/intake-brief.md`
- `work/source-map.md` when sources exist
- `work/claim-ledger.json`
- `work/audience-model.json`
- `work/story-spine.md`
- `work/slide-sorter.md`
- `work/visual-aid-plan.json`
- `work/theme-options.md` or selected `brand-contract.json`
- `work/slide-specs.json`
- rendered draft
- `qa/qa-report.md`

For small decks with limited sources, these artifacts can be concise. Do not skip the claim ledger, slide sorter, slide specs, or QA report.

## Design Style Intake

When style is unclear, do not guess from generic trends. Use one of these paths:

- If brand inputs exist, create `brand-contract.json` from observed evidence.
- If the user gives examples, derive constraints from those examples.
- If the audience is conservative, default to clean light.
- If the deck explains systems, security, observability, or runtime behavior, offer dark runtime as an option.
- If the deck is product/story/demo heavy, offer warm editorial as an option.

For high-stakes or taste-sensitive decks, generate 2 or 3 title-slide previews before rendering the full deck.

## First-Draft Bar

The first draft is successful when:

- the title-only story makes sense,
- unsupported claims are absent or clearly labeled,
- hard ideas have appropriate visual aids,
- the visual direction fits the audience,
- speaker notes sound deliverable,
- the deck can be improved through targeted repairs rather than regeneration.
