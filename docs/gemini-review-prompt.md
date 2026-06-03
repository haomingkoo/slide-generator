# Gemini Review Prompt

Use this prompt when asking Gemini, Claude, Codex, or another agent to review this repo.

```txt
You are reviewing a GitHub repo named `slide-generator`.

Repo goal:
Build a professional, source-grounded, agentic slide-generation system that works with Codex and Claude Code. The repo should help an agent create high-quality decks from notes, PDFs, codebases, research, data, brand material, and rough briefs. It must prioritize accuracy, clear communication, visual quality, audience fit, and reviewability.

Important values:
- Be humble: do not overclaim what the repo can already do.
- Preserve integrity: no fake claims, fake citations, fake benchmarks, fake user quotes, fake code behavior, or hidden fallbacks.
- Stay technical: point to files, schemas, commands, evidence, and reproducible failures.
- Care about communication: the deck should explain ideas clearly to a real audience, not just look finished.
- Care about craft: slides should be stylish, clear, uncluttered, and appropriate for the audience.

Current repo shape:
- It is an agentic workflow repo, not only a renderer and not only a prompt library.
- It includes a slide-generator skill for Codex and Claude Code.
- It uses durable artifacts in `projects/<name>/work/` so long-running agents can resume after context loss.
- It has deterministic validators for claims, architecture maps, audience model, story spine, design contract, slide specs, review log, rendered HTML, browser QA, and negative cases.
- It has a first Marp-based renderer that can output HTML, PPTX, PDF, and screenshots.
- PPTX is currently an export/handoff path, not native PowerPoint template editing.
- Google Slides is currently via PPTX import, not native Google Slides API generation.

Please do a hard, practical review. Do not just brainstorm features. Try to break the actual implementation and documentation.

Start by inspecting these files:
- `README.md`
- `docs/agentic-execution.md`
- `docs/workflow.md`
- `docs/status-and-roadmap.md`
- `docs/renderer-strategy.md`
- `docs/design-skill-adoption-review.md`
- `docs/no-hallucination-policy.md`
- `docs/quality-rubric.md`
- `workflows/make-deck.md`
- `skills/slide-generator/SKILL.md`
- `.agents/skills/slide-generator/SKILL.md`
- `.claude/skills/slide-generator/SKILL.md`
- `skills/slide-generator/references/*.md`
- `package.json`
- `.github/workflows/ci.yml`
- `scripts/*.mjs`
- `templates/marp/*.json`
- `templates/design-contracts/*.json`
- `renderers/marp/themes/*.css`
- `tests/validator-negative.mjs`
- `tests/fixtures/render-project/work/*.json`
- `tests/fixtures/valid-project/work/*.json`

If you can run commands, run:

```bash
npm ci
npx playwright install chromium
npm test
npm run render:marp -- tests/fixtures/render-project --html
npm run inspect:marp -- tests/fixtures/render-project
npm run qa:browser -- tests/fixtures/render-project
npm run export:marp -- tests/fixtures/render-project --pptx --pdf
```

On Linux CI, use:

```bash
npx playwright install chromium --with-deps
```

If you cannot run commands, label your review as `reading-only` and do not imply tests passed.

Review questions:

1. Agentic architecture
- Is this truly agentic, or is it only a scripted renderer with docs around it?
- Are the artifact boundaries clear enough for Codex, Claude Code, Gemini, or a future Deep Agents/LangGraph runner?
- Does `docs/agentic-execution.md` correctly explain what runs today and what remains future work?
- Is the proposed order right: artifact contract first, runner second, UI/API third?
- What is missing before this could become a reliable Deep Agents/LangGraph-style runner?

2. Long-running context and memory
- Can an agent resume from disk after losing context?
- Are the durable artifacts sufficient?
- Are there missing artifacts for brand, charts/data, PPTX, Google Slides, or human review?
- Is `review-log.json` enough to help the system stop repeating mistakes within a project?

3. Accuracy and no-hallucination guardrails
- Can factual claims still appear without claim IDs?
- Can claim IDs refer to unsupported or weak evidence?
- Are assumptions and inferences visible?
- Are architecture evidence paths confined to the analyzed codebase?
- Are negative tests strong enough?
- Are there hidden fallbacks, hardcoded choices, or silent downgrades?
- Does the documentation overclaim the current guarantee level?

4. Slide quality and audience communication
- Does the workflow force a clear deck goal, audience shift, slide count, and success criteria before rendering?
- Does it support likely questions, objections, jargon review, and presenter notes?
- Does it critique the deck from the audience point of view?
- Does it prevent dense, cluttered, generic, or hand-waving slides?
- Are `slide_job`, `speaker_notes`, `visual_aid`, and `story-spine` fields strong enough?
- What slide types should be added to support pitch decks, technical explainers, teaching decks, decision decks, product demos, research summaries, board updates, sales decks, and workshops?

5. Visual design system
- Are the design contracts useful as persistent design memory?
- Are the current Marp themes professional enough?
- Are there signs of generic AI design patterns?
- Are typography, spacing, contrast, hierarchy, and layout rules specific enough?
- Does the browser QA catch real visual problems, or only basic structural issues?
- What should be added to support better templates, brand extraction, charts, diagrams, animation, and interactive visual aids?

6. Renderer and exports
- Is the Marp renderer a reasonable first renderer?
- Are HTML, PPTX, PDF, and screenshot outputs wired correctly?
- Does the repo clearly state that native editable PPTX template editing and native Google Slides API export are future work?
- What are the highest-risk export issues for PowerPoint and Google Slides?
- What additional QA is needed after PPTX/PDF export?

7. Professional repo quality
- Is the README clear for first-time users?
- Does CI test the right things?
- Are generated files ignored correctly?
- Are command names intuitive?
- Are docs duplicated or drifting?
- Are there package/license/release issues before making this public?
- Would a serious open-source user understand how to run it and what is ready vs planned?

8. Competitor and ecosystem lessons
Evaluate whether the repo has adopted the useful parts of:
- Plus AI: prompt/file upload, outline review, insert/rewrite/remix, native deck workflow, templates, custom instructions.
- Gamma: fast first draft, flexible cards, strong narrative flow.
- Canva: design breadth, asset/template quality, visual polish.
- SlideSpeak: document-to-deck, branded templates, API, translation, narrated video.
- Claude/Codex skills: design contracts, visual QA, skill mirrors, repeatable procedures.
- Playwright/webapp testing: screenshot-based visual review.
- Deep Agents/LangGraph: planning, subagents, filesystem context, resumability.

Do not recommend copying competitors blindly. Extract practical repo-level improvements.

Output format:

Start with:
- Overall verdict in 5-8 sentences.
- `Ready today`: what is genuinely working.
- `Not ready yet`: what is still planned or incomplete.
- `Do not claim`: anything the README/docs imply too strongly.

Then provide findings ordered by severity:

```txt
[CRITICAL/HIGH/MEDIUM/LOW] Title
Evidence: file path and line number, or command output.
Why it matters:
How to reproduce:
Recommended fix:
```

After findings, provide:
- Top 10 implementation tasks, ordered by leverage.
- A suggested agentic runner design: phases, inputs, outputs, and failure gates.
- A suggested eval plan comparing baseline one-shot prompts vs this workflow.
- A concise list of documentation edits.
- A concise list of tests to add.

Rules for the review:
- Be specific. Use file paths and commands.
- Separate proven bugs from opinions.
- Do not invent missing features.
- Do not praise vague potential. Only credit what is implemented or clearly documented.
- If you make an assumption, label it.
- If a suggestion increases scope, explain what should come first.
- Prefer small, high-confidence fixes before large platform ideas.
```

