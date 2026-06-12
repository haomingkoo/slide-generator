# Product Workflow Lessons

Use this when deciding how the slide generator should behave compared with tools such as Gamma, Figma Slides, Gemini in Google Slides, Canva, Plus AI, and SlideSpeak.

## Gamma

Observed workflow:

- Multiple entry points: generate from prompt, paste existing text, or import files/URLs.
- Imported slides/documents become editable cards.
- Docs are split by headings; slides are often mapped one-to-one into cards.
- Broad changes happen through a deck-level agent.
- Precise changes happen at the card level.
- Card-based layouts reduce overcrowding but can create export friction when converted to fixed-size slides.

Lessons for this repo:

- Support `generate`, `paste`, and `import` as separate intake modes.
- Keep broad deck edits and slide-local edits separate.
- Use a flexible intermediate `slide_spec`, but test fixed-slide export early.
- Treat first draft as momentum, not final output.
- Keep local Gamma exports private. If a saved page contains account or workspace data, extract only reusable workflow patterns and do not commit raw HTML.
- Gamma's card/document model suggests a useful internal distinction: `doc_mode` for structured narrative and `present_mode` for fixed-stage delivery. The generator should know which mode it is optimizing for before layout.

Sources:

- https://help.gamma.app/en/articles/11047840-how-can-i-import-slides-or-documents-into-gamma
- https://gamma.app/explore/content/guides/gamma-ai-instant-presentations
- User-provided Gamma template export inspected locally on 2026-06-12; treated as private reference material, not a committed source artifact.

## Figma Slides

Observed workflow:

- FigJam boards can become slide decks or outlines.
- Users can select a template before generation.
- Figma AI sorts and summarizes brainstorm content into slides.
- Design Mode gives access to Figma-style design controls such as Auto Layout and layers.
- Figma Slides supports presenter notes, collaborative controls, interactive prototypes, polls, and voting.

Lessons for this repo:

- Add a `brainstorm_to_deck` intake mode for messy sticky-note style content.
- Generate an outline before final slides.
- Offer template or theme selection before full rendering.
- Treat interactivity as a presentation feature, not only decoration.
- Consider live audience artifacts such as polls, voting, and alignment checks for workshop decks.

Sources:

- https://help.figma.com/hc/en-us/articles/25968453273495-Generate-a-slide-deck-from-a-FigJam-board-using-Figma-AI
- https://www.figma.com/slides/

## Gemini In Google Slides

Observed workflow:

- Gemini can create editable, brand-matched slides with dynamic layouts.
- It analyzes an existing deck to fit the established style.
- Users can reference files manually or let Gemini surface relevant files from Drive.
- Existing slides can be edited through prompts such as matching deck colors or making a slide more minimal.
- Gemini's main advantage is native editability inside Google Slides and access to Workspace context.

Lessons for this repo:

- Existing decks should be usable as style references, not only content sources.
- `brand-contract.json` should be created from deck/theme evidence when possible.
- Native editability needs its own QA path, separate from visual quality.
- File-context retrieval should be explicit and cited, not hidden.
- Editing prompts should route to selected-slide or whole-deck context based on scope.

Sources:

- https://workspaceupdates.googleblog.com/2026/04/enerate-beautiful-and-editable-slides-with-ease-in-Google-Slides.html
- https://blog.google/products-and-platforms/products/workspace/gemini-workspace-updates-march-2026/

## Canva

Observed workflow:

- Large template and asset library.
- Prompt-based generation can produce multiple design directions.
- AI image/media generation is integrated into the deck creation surface.
- Design-first controls make it easy for non-designers to adjust style, color, and imagery.
- Canva is especially useful for visual covers, section dividers, social/story formats, and image-heavy collateral.

Lessons for this repo:

- A renderer alone is not enough. The system needs a curated layout, visual aid, icon, image, and mockup library.
- Theme previews should be generated before a full deck when taste is unclear.
- Image generation should be grounded in the deck's claims and avoid implying fake evidence.
- Offer a `design_directions` step when the user cares about look and feel.
- Use Canva-style design breadth as inspiration, but keep source-grounded content and editable exports as the stricter bar.

Sources:

- https://www.canva.com/create/ai-presentations/
- https://openai.com/index/canva/

## Plus AI

Observed workflow:

- Native PowerPoint and Google Slides integration is the product center of gravity.
- Users can start from a prompt, upload a file, or create one slide at a time.
- Prompt-to-deck generation includes an outline step that users can customize before slide generation.
- Existing decks can be remixed into a new template while preserving slide structure.
- Editing is operation-specific: insert, rewrite, remix, add images, and add charts.
- File upload flows distinguish between creating a new presentation and remixing an existing one.
- Text-handling modes let users decide how much the source should be rewritten, preserved, or quoted directly.
- Custom instructions, templates, shared presets, and custom branding make repeated team workflows faster.
- API and MCP surfaces expose presentation generation outside the native add-ins.

Lessons for this repo:

- Treat "inside the user's existing slide tool" as a real product requirement, not an afterthought.
- Add an `outline_review` checkpoint before rendering full decks from prompts.
- Keep `insert_slide`, `rewrite_slide`, and `remix_slide` as first-class operations with small context windows.
- Separate `generate_from_source` from `remix_existing_deck`; they need different accuracy and layout rules.
- Add a source-handling mode to intake: `enhance`, `preserve`, or `strict`.
- Build reusable project presets for common deck types such as pitch, sales proposal, training, explainer, and all-hands.
- Track native editability as a QA dimension alongside visual quality.
- Design the future MCP/API layer around deterministic artifacts, not only prompt-to-PPTX generation.

Sources:

- https://plusai.com/features/prompt-to-presentation
- https://guide.plusai.com/ai-for-presentations/generate-a-presentation/upload-a-file
- https://guide.plusai.com/ai-for-presentations/presentations-api
- https://guide.plusai.com/ai-for-presentations/mcp-server
- https://plusai.com/features/ai-charts

## SlideSpeak

Observed workflow:

- Converts multiple input types into presentations, including text, PDF, Word, Excel, and websites.
- Builds a structured outline before generating a fully editable PowerPoint deck.
- Supports branded PowerPoint templates, including POTX/PPTX masters, layout analysis, speaker notes, charts, tables, and SmartArt.
- Offers AI editing, image generation, infographic generation, translation, summarization, and presentation-to-video workflows.
- Translation is positioned as preserving design/layout while returning editable decks.
- API and MCP surfaces target agent and automation workflows, including custom templates and native PPTX output.
- The Claude Cowork guide recommends a split workflow: use an agent for research, synthesis, narrative, and speaker notes, then use a presentation-specific layer for template polish.

Lessons for this repo:

- Treat `source_to_deck` as a family of adapters, not one parser: PDF, Word, Excel, website, PPTX, transcript, and codebase need different extraction and evidence rules.
- Add `outline_before_render` as a mandatory checkpoint for document-to-deck flows.
- Make `template_intelligence.json` a first-class artifact for PPTX/POTX inputs: layout names, use cases, placeholders, chart/table support, notes support, and brand constraints.
- Separate research/story generation from final presentation polish. The polish layer should know templates, layout rules, translation, export, and QA.
- Add `translate_deck` and `presentation_video` as downstream operations, but keep them after source audit so they cannot introduce new unsupported claims.
- For Excel/data inputs, generate `data-contract.json` before charts: source file, columns, transformations, chart intent, caveats.
- For website inputs, capture URL, retrieval date, extracted claims, and screenshots before writing slide claims.
- API/MCP should expose artifacts and operations, not only "generate deck from prompt."

Sources:

- https://slidespeak.co/
- https://slidespeak.co/features/generate-powerpoint-with-ai
- https://slidespeak.co/features/branded-template
- https://slidespeak.co/features/ai-translation
- https://slidespeak.co/features/slidespeak-api
- https://slidespeak.co/blog/how-to-create-presentations-claude-cowork

## Product Principles To Adopt

- Offer multiple intake modes instead of one universal prompt.
- Treat source-to-deck as adapters with different extraction and evidence rules.
- Use outline/story approval before high-fidelity rendering.
- Separate global agent edits from slide-local edits.
- Keep insert, rewrite, remix, and source-to-deck as different operations with different context scopes.
- Treat brand/style extraction as a first-class phase.
- Treat PowerPoint template intelligence as a first-class artifact when editable PPTX matters.
- Maintain native editability where the target format requires it.
- Use visual QA for fixed-size exports.
- Preserve source traceability even when the source comes from Drive, a website, a PDF, or an imported deck.
- Support strict source-preservation mode for decks where unsupported elaboration is unacceptable.
- Keep translation, video narration, and presentation polish downstream from the source audit.

## User-Provided Reference Export Patterns

Observed from local Gamma/PDF/PPTX references provided by the user on 2026-06-12. These are pattern observations, not reusable assets.

- Split image plus evidence grid: a full-height image field can create premium atmosphere, but the evidence side still needs strict grid alignment and readable copy.
- Comparison rail: large directional arrows can make before/after or incumbent/challenger slides feel energetic, but the content must still name concrete proof points. Symmetry alone is not evidence.
- Sparse numbered grid: four numbered blocks with long horizontal rules feel polished because the structure is obvious and whitespace is disciplined. This is a useful alternative to cards.
- Dark cinematic references can look premium, but the repo should not default to dark themes. Theme choice still comes from audience, setting and subject.
- Placeholder-rich references show layout grammar, not content quality. The skill should borrow spacing and structure while requiring claim IDs, concrete values and source caveats.

Additional Startup Pitch and Team Retrospective exports reviewed on 2026-06-12:

- Split cover: one half carries the visual identity, one half carries a short title and subtitle. Useful for proposal covers and section resets, but the image should be directly tied to the subject, not abstract filler.
- Image-led problem slide: a tall image field plus a three-step evidence rail can make a problem memorable. Reuse the structure as `pain -> quantified proof -> consequence`; do not reuse generic pain-copy.
- Hero metric with evidence: a single large number works only when the denominator, period, method and source are visible. This should become a chart/table pattern, not an unsupported vanity stat.
- Metric constellation: a 2x3 field of key numbers can work for traction, validation or budget snapshots. It needs short labels, consistent units and no decorative gauges unless the arc encodes real progress.
- Ask panel: a chart on the left and three decision rows on the right is a strong structure for funding, lease approval or go/no-go decisions.
- Alternating image rail: switching the image slab from right to left across adjacent slides creates rhythm without adding ornament. Use it for light editorial decks when there is one main visual and one main argument.
- Equal-height card row: three cards work when every card has the same height, icon position, heading length and body copy budget. Unequal card copy is what makes a slide feel sloppy.
- Obstacle matrix: a 2x3 matrix in one soft block is cleaner than six floating cards for risks, constraints or market blockers.
- Commitment rows: three horizontal rows with a fixed icon gutter are safer than cramming many process steps into one slide. Use this for action plans, vendor quote tasks and owner/accountability slides.

Guardrails from these exports:

- Do not copy downloaded deck assets, screenshots, template art, fake quotes or placeholder company claims into this repo.
- Strong layout does not rescue weak content. If a reference slide is mostly lorem ipsum or generic business copy, keep only the spacing and composition pattern.
- For Chleo-style proposals, prefer real or source-grounded visuals: venue/site photos, room diagrams, equipment tables, cost bars, lead funnels and timeline charts. Abstract mood imagery should not be the primary proof.

## Design Skill Ecosystem

Observed patterns from Claude/Codex design-skill repos and design-tooling writeups:

- Strong design agents split production skills from review skills.
- Design quality improves when the agent commits to a direction before drawing.
- Persistent design memory prevents drift across sessions.
- Browser or Playwright feedback is the highest-leverage visual loop because it gives the agent screenshots instead of imagined layouts.
- Accessibility and anti-generic-design checks work best as explicit gates, not vague taste guidance.
- Tool integrations such as Figma, GitHub, Linear, Notion, Slack, and design-token systems should be optional adapters around the core artifacts.
- Editable diagram formats such as Excalidraw may be useful for architecture and workshop decks where Mermaid is too rigid.

Lessons for this repo:

- Add `design-contract.json` as project-level design memory for tokens, layout patterns, and decisions.
- Keep visual critique separate from source audit so taste changes cannot silently alter facts.
- Add screenshot-based QA before claiming a deck is ready to present.
- Treat accessibility as a deck quality floor: contrast, readable type, color-independent labels, and keyboard-presentable HTML.
- Use theme/token extraction when a brand or existing deck exists; do not invent brand values from memory.
- Keep future Composio/MCP-style app integrations behind clear source, brand, and review adapters.

Sources:

- https://github.com/Trystan-SA/claude-design-system-prompt
- https://github.com/Dammyjay93/interface-design
- User-provided Composio design-skills summary.
