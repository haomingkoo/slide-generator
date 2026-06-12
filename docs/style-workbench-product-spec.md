# Style Workbench Product Spec

The workbench should help someone discover taste, turn that taste into a reusable design artifact, and use that artifact to generate better slides.

It is not a template dumping ground. It is a guided path from inspiration to a deck-ready `DESIGN.md` or `design-contract.json`.

## Product Promise

A user should be able to:

1. browse a small set of good-looking inspirations,
2. pick a few directions they like,
3. mix template grammar, palette roles and slide-writing discipline,
4. preview how real slide types behave,
5. export a prompt, `DESIGN.md` and `design-contract.json`,
6. generate a deck with the slide-generator skill,
7. run browser QA and publish.

## Reference Lessons

Refero Styles shows the right artifact shape for design discovery: searchable visual examples, style detail pages, token sections and copyable `DESIGN.md` context for agents.

HyperFrames separates visual identity from frame composition: `design.md` describes the brand, while `frame.md` handles 16:9 scale, dwell, pacing and motion. Slides need a similar separation: design system first, slide/frame behavior second.

Consulting slide guidance reinforces that a deck is not only decoration. Storylining, action titles, slide purpose and title-only review must happen before visual polish.

`frontend-slides` is a useful implementation reference because it uses visual style discovery, fixed 16:9 HTML, progressive template loading and anti-generic style packs.

## Guided Flow

The app should feel like a design companion:

1. **Deck job**: ask what the user needs to explain: pitch, proposal, technical architecture, research report, lesson, workshop, launch plan or demo.
2. **Proof types**: ask which slide jobs matter: architecture, tech stack, use case, workflow, timeline, comparison, pricing, cost model, market map, screenshot walkthrough or appendix.
3. **Inspiration**: show a curated grid of visual directions with real slide thumbnails or specimen cards.
4. **Shortlist**: let the user select 2 to 5 things they like. Record what they liked: layout, color, typography, motion, density or mood.
5. **Mix**: generate 3 proposed directions from the shortlist. Each direction names what it borrows and what it avoids.
6. **Preview**: show the same slide jobs in each direction: title, table, comparison, timeline, architecture and appendix/source slide.
7. **Refine**: let the user change palette, template grammar, density, diagram style and communication discipline separately.
8. **Export**: produce a prompt, `DESIGN.md`, `design-contract.json`, diagram plan and asset checklist.
9. **Build**: show the exact next commands for clone/open repo, prepare assets, run generation, QA and publish.

## Slide Jobs And Diagram Routing

The workbench should choose visual systems based on what the deck must prove.

| Slide job | Best proof object | Diagram route | Notes |
|---|---|---|---|
| System architecture | Component map, data flow, trust boundary | Mermaid for structured flow; Excalidraw-style for executive whiteboard | Needs source files, repo tree, service list, API contracts or cloud resources. |
| Tech stack | Layered stack, vendor roles, build/run path | Structured table or Mermaid block diagram | Separate frontend, backend, data, AI, infra, observability and security. |
| Use case | Actor journey, before/after, scenario storyboard | Step timeline, swimlane or storyboard cards | Use one named scenario before broad claims. |
| Workflow | State machine, handoff path, approval path | Mermaid flowchart or sequence diagram | Good for agent loops, operations, onboarding and service delivery. |
| Data model | Entity relationship and ownership | Mermaid ER diagram first | Keep only entities the audience needs. |
| Roadmap | Gantt, decision gates, dependencies | Timeline or milestone table | Show output artifacts and go/no-go gates. |
| Comparison | Tradeoff table or weighted matrix | Table/chart, not freeform diagram | Align options before comparing them. |
| Cost model | Range bars, sensitivity table, break-even | Chart/table | Shared axis and assumptions are mandatory. |

Diagram selection rule:

- Use **Mermaid** when structure matters more than visual personality: sequence, ER, flowchart, architecture, class, Gantt.
- Use **Excalidraw-style** when the audience needs an approachable whiteboard explanation, especially for executive architecture, product workflows and workshops.
- Use **custom HTML/SVG** when the diagram must be presentation-grade, animated, mobile-safe or visually matched to the deck.
- Never add a diagram without source inputs or an inference label.

Future input modes:

- repo path or GitHub URL,
- architecture notes,
- API docs,
- cloud/service inventory,
- screenshots,
- CSV or cost model,
- existing Mermaid,
- Excalidraw file,
- Figma/PPTX/PDF reference.

## DESIGN.md Shape

A generated `DESIGN.md` should have these sections:

1. **Overview**: one short description of the visual system and audience fit.
2. **Borrow / Avoid**: what the system borrows from references and what it refuses to copy.
3. **Colors**: semantic roles, not only hex values.
4. **Typography**: font stack, scale, weights and use cases.
5. **Layout Grammar**: grid, margins, title behavior, repeated slide families.
6. **Components**: tables, metric strips, image panels, quote blocks, callouts, source lanes.
7. **Slide Types**: title, table, timeline, comparison, process, appendix and closing rules.
8. **Motion / Frame Notes**: optional pacing, scale and dwell guidance for video or animated HTML.
9. **Accessibility And QA**: contrast, mobile behavior, footer/source clearance and overflow checks.
10. **Credits**: open-source licenses, reference links and private-asset boundaries.

## Design Rules For The App

- Start narrow. Show one decision at a time.
- Use real-looking slide specimens before showing exported text.
- Keep source registries behind disclosure controls.
- Do not use hidden horizontal galleries. Show a grid and explicit paging controls so users know how to browse.
- Keep the practical pipeline visible: Direction, Template, Color, Logic. Users may jump around, but the default story should follow that order.
- Animated previews must stay inside their cards on desktop and mobile.
- Treat PPT, PDF and web examples as references only. Remix palette roles, shape language, naming and layout details before publishing.
- Avoid company-name imitation in public style names.
- Let users go back and forth without losing selection state.
- Use neutral labels for taste dimensions: dense, airy, editorial, technical, playful, restrained.
- Show the consequence of each choice in the preview panel.
- Treat mobile as a first-class browsing mode.

## Quality Gates

Before a workbench change is done:

- the initial screen shows one primary decision, not every source,
- template cards show specimen previews,
- template browsing uses visible Previous/Next paging instead of hidden sideways scroll,
- the selected direction updates the live preview,
- exported JSON parses,
- exported prompt, JSON and `DESIGN.md` include reference-safety rules for PPT/PDF/web inspiration,
- exported prompt includes credits and build path,
- source ledger stays available but out of the main path,
- desktop and mobile have no horizontal overflow,
- Playwright screenshots are checked.

## Near-Term Roadmap

1. Add guided style onboarding to the static workbench.
2. Add richer slide specimens for title, table, timeline, comparison and appendix.
3. Add export for `DESIGN.md` alongside prompt and JSON.
4. Add proof-type selection: architecture, tech stack, use cases, roadmap, cost model and comparison.
5. Add diagram routing for Mermaid, Excalidraw-style and custom HTML/SVG.
6. Add a three-direction remix mode from selected inspirations.
7. Add a small local example deck that consumes a workbench design contract.
8. Add optional `frame.md` export after static slide QA is stable.
