# Product Workflow Lessons

Use this compact reference when choosing workflow behavior inspired by Gamma, Figma Slides, Gemini, Canva, Plus AI, SlideSpeak, and design-skill ecosystems. Full research notes live in `docs/research/product-workflow-lessons.md`.

## Adopted Rules

- Support multiple intake modes: prompt, pasted notes, files, website, existing deck, codebase, brainstorm, and data.
- Treat source-to-deck as adapters with different extraction and evidence rules; PDF, PPTX, website, spreadsheet, transcript, and codebase inputs are not the same problem.
- Generate an outline, story spine, or title sorter before high-fidelity rendering.
- For high-stakes decks, run Planning Mode first: audience shift, proof spine, slide logic, design directions, source plan, and QA plan.
- Separate whole-deck edits from slide-local edits.
- Keep insert, rewrite, remix, translate, summarize, and source-to-deck as different operations with different context scopes.
- Treat brand/style extraction as a first-class phase when brand assets or existing decks exist.
- Track native editability as a QA dimension when PPTX or Google Slides handoff matters.
- Keep visual polish downstream from source audit so style edits cannot silently add unsupported claims.
- Use browser screenshots for visual review; do not rely on imagined layout quality.
- Keep APIs, MCPs, and future app integrations around the artifact contract rather than bypassing it.
- Borrow Gamma's outline-before-render discipline and Canva's theme/asset breadth, but keep this repo stricter on citations, claim ledgers, fixed-slide QA, and export readiness.
- Use user-provided PPTX/PDF/Gamma exports as pattern libraries, not asset sources. Extract named layout patterns such as split cover, image-led problem rail, hero metric plus evidence, metric constellation, ask panel, alternating image rail, equal-height card row, obstacle matrix, and commitment rows.

## Guardrail Implications

- Imported or web-researched claims must preserve URL, retrieval date when available, source type, and confidence.
- Generated images, icons, and mockups must not imply fake customer proof, product screenshots, data, or endorsements.
- Translation, narration, video, and remix operations must not add factual claims unless they add claim IDs.
- Existing deck remixing should preserve the source deck's factual boundaries and create a new design contract only from observable style evidence.
- For data or spreadsheet decks, create a data contract before charts: source file, columns, transformations, chart intent, and caveats.
- Reference-deck patterns still need evidence, copy budget and browser QA. Reject stock imagery as proof, fake testimonials, fake traction, huge titles that push content away, and card rows with unequal copy pressure.

## Product Gaps To Track

- Baseline comparison against one-shot generation.
- Native editable PPTX generation.
- Native Google Slides generation.
- Template intelligence for PPTX/POTX masters.
- Brand observation from screenshots, websites, and existing decks.
- Screenshot-based composition scoring beyond overflow and contrast.
- Optional app integrations such as Figma, GitHub, Notion, Slack, and Linear.
