# Heuristic Registry

Use this registry to track which deck-review failures have been promoted into reusable slide-generator behavior.

Status values:

- `proposed`: seen in review, not yet encoded.
- `absorbed`: encoded in docs, skill guidance, templates, scripts or examples.
- `tested`: covered by an eval, validator, browser QA check or committed example.
- `compressed`: folded into a simpler rule; old narrow guidance can be removed.

| ID | Source feedback | Reusable rule | Runtime target | Test or example coverage | Status |
|---|---|---|---|---|---|
| H001 | Chleo first draft was source-backed but not actionable enough. | Startup/proposal decks need an execution-depth gate: actor, first action, where to find people/vendors, output artifact and success signal. | `skills/slide-generator/references/planning-mode.md`, `docs/research-to-deck-guide.md` | `examples/chleo-community-band-room` slides 6, 7, 8, 14, 18, 21 | tested |
| H002 | HTML deck felt like a scroll page, not a presentation. | Web-first decks meant for live delivery should use fixed-stage presenter behavior with overview and speaker notes. | HTML deck examples and frontend-rendering guidance | `examples/chleo-community-band-room/deck/index.html` | tested |
| H003 | Mobile and footer controls collided with content. | Browser QA must inspect mobile width, fixed controls, footer/source clearance and slide bounds. | Browser QA workflow and example QA report | `examples/chleo-community-band-room/qa/qa-report.md` | tested |
| H004 | Startup cost bars were visually misleading. | Cost range bars must share a common axis unless explicitly labeled as composition. | `docs/research-to-deck-guide.md`, Chleo design repair notes | Chleo startup cash slide and QA notes | tested |
| H005 | Dense peer cards had uneven heights and bad wrapping. | Peer cards in comparison flows should align on a visible grid; if body lengths differ, use tables or equalized card rows. | Design guidance and example repairs | Chleo slides 5, 8, 12, 18 | tested |
| H006 | The deck used style inspiration without making the choice explicit. | If external style packs or references influence a deck, record which constraints were adopted and which were not. | `qa/slides-generator-feedback.md`, design contract | Chleo feedback notes | absorbed |
| H007 | The repo lacked a durable pre-render planning artifact. | Complex, public or client-facing decks should create `work/deck-plan.md` before slide specs. | `scripts/create-deck-artifacts.mjs`, `skills/slide-generator/references/planning-mode.md` | New scaffold output and Chleo deck plan | tested |
| H008 | Improvement lessons were scattered across QA prose. | Repeated failures need registry rows before they become skill rules, validators, templates or evals. | `docs/heuristic-slide-system.md`, this registry, `scripts/heuristic-status.mjs` | `npm run heuristic:status -- examples/chleo-community-band-room` | tested |
| H009 | Codex and Claude needed a shared local memory layer for user preferences and durable lessons. | Personal cross-agent memory should live outside committed repos, with repo docs linking to it only as an optional local layer. | `/Users/koohaoming/.agent-memory/`, global Codex and Claude instructions | Global local skill `heuristic-system-maintainer` | tested |
| H010 | User supplied Campaign Strategy PDF/PPTX as a style and content reference. | Reference decks can become reusable style packs and archetype templates when their patterns are extracted, source guardrails are added, and the rendered template passes browser QA. | `cool-campaign-light` design system, Marp theme and `templates/marp/campaign-strategy.json` | Temp render of campaign template plus `node scripts/browser-qa-marp.mjs /tmp/sg-campaign-template`; `npm test` | tested |
| H011 | Hackathon decks should help choose and build the right project, not only make slides. | Hackathon mode must research judge/host/sponsor/rubric signals and create build and demo plans before slide specs. | `skills/slide-generator/references/hackathon-intelligence-and-build.md`, `scripts/create-deck-artifacts.mjs` | `npm run init:deck -- .agent-work/tmp-hackathon-scaffold --mode hackathon --theme cobalt-grid-light --force`; render + browser QA | tested |
| H012 | User likes `frontend-slides` templates but dislikes cream/bone-paper defaults. | Vendor the MIT template references, shortlist progressively, preserve credit, and treat palettes as replaceable colorways. | `vendor/frontend-slides/`, `docs/visual-style-system.md`, `cobalt-grid-light` design system | License notice, 34-template index check, design-contract validation | tested |
| H013 | Live HTML decks should have presenter support, not just a scroll page. | Marp uses built-in presenter mode; future custom HTML must support synced audience/presenter views with notes, next slide and timer. | `skills/slide-generator/references/frontend-rendering.md`, `docs/package-and-workbench-roadmap.md` | Marp presenter inspection in existing browser QA; custom console remains roadmap | absorbed |
| H014 | User wants a website for browsing styles, mixing templates/palettes and exporting a prompt. | Add a static inspiration workbench and a template-source registry so style choice becomes an artifact before deck generation. | `examples/style-workbench/`, `docs/template-source-registry.md` | Playwright check: 34 templates, valid JSON export, no desktop/mobile horizontal overflow | tested |
| H015 | User pointed to HyperFrames as a higher-quality visual/motion reference. | Treat motion as a separate frame-composition artifact: static deck QA first, then translate design contract into a `frame.md`-style pacing/scale/dwell spec. | `docs/template-source-registry.md`, `docs/visual-style-system.md`, `examples/style-workbench/` | Workbench Motion Frame discipline, prompt attribution and HyperFrames notes | tested |
| H016 | Style workbench felt like a dense AI-generated catalog instead of a product flow. | Style discovery should be guided: pick inspirations, mix template/palette/logic, preview real slide specimens, then export a prompt and build path. Keep source ledgers in drawers, not the primary decision path. | `examples/style-workbench/`, `docs/skill-bank.md`, `skills/slide-generator/references/visual-style-system.md` | Workbench stepper, live template-behavior preview, mobile/desktop Playwright QA | absorbed |
| H017 | User wants the slide-design web app to handle tech-stack, architecture, use-case and diagram-heavy decks. | Ask for the deck job and proof types before visual styling. Route diagrams to Mermaid, Excalidraw-style or custom HTML/SVG based on source structure, audience and presentation polish needs. | `docs/style-workbench-product-spec.md`, `docs/skill-bank.md`, `examples/style-workbench/` | Workbench proof-type panel and exported diagram-routing guidance | absorbed |
| H018 | Workbench cards and step labels still showed hidden-scroll and edge-clipping behavior on mobile. | Inspiration browsing should use visible grids and explicit Previous/Next paging, never hidden sideways scroll. Animated mini deck previews must move inside card bounds, and mobile step jumps need mobile-sized scroll margins. | `examples/style-workbench/`, `docs/style-workbench-product-spec.md`, `docs/visual-style-system.md` | Playwright desktop/mobile overflow checks, template paging check and screenshot review | tested |

## Promotion Protocol

1. Capture the concrete failure in the deck's `qa/` folder.
2. Add or update a registry row.
3. Decide the smallest reusable target: docs, skill reference, script, template, example or eval.
4. Implement the change.
5. Add proof through a validator, browser QA check, eval, committed example or screenshot review.
6. Mark the row `tested` only when the proof exists.
7. Periodically compress several narrow rows into one simpler rule.
