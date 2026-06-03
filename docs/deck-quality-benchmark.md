# Deck Quality Benchmark Research

This document records the research basis for the slide-generator quality bar. It is maintainer-facing; the runtime version lives in `skills/slide-generator/references/deck-quality-benchmark.md`.

## Verdict

The repo's direction is correct: use a skill with progressive disclosure, source-grounded artifacts, outline/story approval, rendered-slide QA, and human repair loops. This matches current practice in agent skills and recent slide-generation research.

The next improvement is not a bigger generic workflow. It is mode-specific deck quality. A VC pitch, hackathon demo, executive decision deck, technical proof deck, and teaching deck have different jobs, proof bars, timing, and red flags.

## Source Set

Investor and demo-day pitching:

- Y Combinator, ["A Guide to Seed Fundraising"](https://www.ycombinator.com/blog/how-to-raise-a-seed-round/) and ["How to Design a Better Pitch Deck"](https://www.ycombinator.com/blog/how-to-design-a-better-pitch-deck).
- Y Combinator, ["A Guide to Demo Day Presentations"](https://www.ycombinator.com/blog/guide-to-demo-day-pitches/) and ["How to Pitch Your Company"](https://www.ycombinator.com/blog/how-to-pitch-your-company/).
- Sequoia Capital, ["Writing a Business Plan"](https://www.sequoiacap.com/article/writing-a-business-plan/).
- DocSend [pitch deck metrics](https://www.docsend.com/pitch-deck-metrics/) and pitch-deck guidance.
- First Round Review [fundraising guidance](https://review.firstround.com/the-fundraising-wisdom-that-helped-our-founders-raise-18b-in-follow-on-capital/).
- a16z [startup metrics by stage](https://a16z.com/aligning-startup-metrics-with-stage-of-maturity-beyond-labels-for-fundraising-rounds/).

Hackathon and demo competitions:

- Devpost [judging](https://help.devpost.com/article/64-judging-public-voting) and [demo](https://info.devpost.com/blog/how-to-present-a-successful-hackathon-demo) guidance.
- Major League Hacking [judging plan guidance](https://guide.mlh.io/general-information/judging-and-submissions/judging-plan).
- Public hackathon and pitch-competition rubrics from HackIllinois, Cal Hacks, MIT $100K, SXSW Pitch, HBS New Venture Competition, and Berkeley RDI.

Consulting and executive communication:

- Bain decision-process and information-overload guidance, including ["Want great decisions? Fix your processes"](https://www.bain.com/insights/want-great-decisions-fix-your-processes/) and ["Infobesity"](https://www.bain.com/insights/infobesity-the-enemy-of-good-decisions/).
- BCG [investor-communication storytelling guidance](https://www.bcg.com/publications/2024/supercharge-investor-communications-adding-story-to-strategy).
- Harvard Business Review on [audience-tailored presentations](https://hbr.org/2015/04/the-best-presentations-are-tailored-to-the-audience) and senior-executive presentations.
- Barbara Minto's [Pyramid Principle](https://www.pearson.com/en-au/subject-catalog/p/the-pyramid-principle/P200000015259/9781292763255) and McKinsey alumni material on MECE.
- Duarte [data presentation guidance](https://www.duarte.com/blog/when-presenting-data-get-to-the-point-fast/) and think-cell [data-story guidance](https://www.think-cell.com/en/resources/content-hub/how-to-tell-a-better-data-story-one-slide-at-a-time).
- Penn State assertion-evidence slide research.

AI slide generation and agent skills:

- OpenAI Codex [best practices for turning repeatable work into skills](https://developers.openai.com/codex/learn/best-practices#turn-repeatable-work-into-skills).
- Anthropic [skill-creator guidance](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md) and public Skills repository.
- [DOC2PPT](https://doc2ppt.github.io/), [PPTAgent](https://arxiv.org/abs/2501.03936), [Auto-Slides](https://auto-slides.github.io/), [ArcDeck](https://arcdeck.org/), PresentBench, and related slide-generation benchmarks.
- [Marp CLI](https://github.com/marp-team/marp-cli) and [PptxGenJS](https://gitbrent.github.io/PptxGenJS/) documentation.
- Competitive product patterns from Gamma, Figma Slides, Gemini Slides, Canva, Plus AI, and SlideSpeak.

## Cross-Source Consensus

These points appeared across multiple source families:

- Start with audience and outcome. A good deck has a target belief, decision, or next action.
- Make the product, recommendation, or thesis clear immediately.
- Use answer-first titles. A title-only read should still carry the story.
- One slide should have one job, one main proof point, and one dominant visual.
- Proof beats claims. Strong slides show a demo, metric, customer signal, chart, code, source excerpt, or decision model.
- Time is a design constraint. Extra source material should be pruned, moved to notes, or placed in backup.
- Main deck and appendix have different jobs. Main deck persuades or teaches; appendix defends.
- Q&A should be planned before final slide specs. Likely objections drive backup slides.
- Visual quality needs screenshots, not imagination. Rendered-slide review is a core loop.
- Native editable PowerPoint/Google Slides output is a distinct renderer requirement, not a promise the Marp path can make.

## Mode-Specific Standards

### VC / Fundraising Deck

Primary job: earn the next investor conversation or support a fundraising meeting.

Default proof bar:

- What the company does in one sentence.
- Specific customer pain or buyer.
- Product wedge or demo path.
- Why now.
- Market logic that is bottom-up enough to be believable.
- Traction or early signal with dates, denominators, and context.
- Business model, GTM, competition including status quo, team why-us, and ask.

Red flags:

- "Platform" language before concrete behavior.
- No clear customer or buyer.
- Top-down TAM with no ICP or pricing logic.
- Vanity metrics without denominator, period, or retention.
- "No competitors."
- Ask missing or not tied to milestones.

### Hackathon / Demo Deck

Primary job: maximize judge confidence against a rubric in a very short window.

Default proof bar:

- What was built, stated immediately.
- User problem or theme alignment.
- Demo path and fallback.
- Implementation evidence: repo, architecture slice, screenshot, benchmark, working state, or video still.
- Rubric alignment: idea quality, implementation, impact, design/polish, originality, technical difficulty, or track-specific criteria.
- Clear next action: prize track, repo, live URL, pilot, or follow-up.

Red flags:

- Pitch sounds like a startup deck when judges score technical execution.
- Demo is broad feature-tour instead of one repeatable path.
- No fallback if live demo fails.
- Technical depth is hand-waved.
- AI assistance or generated assets are not disclosed where relevant.

### Executive / Consulting Decision Deck

Primary job: help a specific audience decide, align, or act.

Default proof bar:

- Executive summary with recommendation, rationale, and decision ask.
- Pyramid structure: governing thought, key lines of support, then evidence.
- Action titles, not topic titles.
- MECE issue logic.
- Chart contracts: source, unit, denominator, transform, highlight, annotation, caveat.
- Roadmap, owner, timing, risks, and next review.

Red flags:

- Big reveal after many slides.
- Topic titles such as "Market Overview".
- Chart does not prove the title.
- MECE overlap/gaps or mixed levels.
- Dense main-deck table when one number matters.
- No decision ask or owner.

### Technical / Research Proof Deck

Primary job: explain a system, experiment, model, or research result accurately enough for technical review.

Default proof bar:

- Baseline, method, metric, result, limitation, and next experiment.
- Architecture map for system claims.
- Code snippets tied to path and line evidence.
- Data contract for charts.
- Caveats for inference, partial results, and failed experiments.

Red flags:

- Benchmark without dataset, method, or baseline.
- Diagram nodes that are not evidenced.
- Code shown as decoration.
- Result overstated beyond experimental conditions.

### Teaching / Explainer Deck

Primary job: move the learner from confusion to a usable mental model.

Default proof bar:

- Learning goal and prerequisite assumptions.
- Concrete example before abstraction.
- Progressive reveal for mechanisms.
- Checks for understanding or likely misconceptions.
- Simple recap and practice/next step.

Red flags:

- Starts with taxonomy instead of motivation.
- Too many new terms before an example.
- Visuals decorate instead of explaining causality or sequence.

## Implications For This Repo

Keep:

- Skill-based progressive disclosure.
- Artifact-first workflow.
- Claim ledger and claim-reference linting.
- Story spine and title-only sorter.
- Content-priority split between main deck, backup, and dropped material.
- Rendered HTML + browser QA as the first visual feedback loop.
- Explicit Marp/PPTX editability caveat.

Add now:

- A runtime deck-quality benchmark reference.
- Mode-specific slide archetypes and red flags.
- Intake fields for deck mode, talk length, Q&A, judging criteria, proof assets, and next action.
- Starter templates for VC seed, 3-minute hackathon demo, and executive decision decks.
- Eval prompts for the same modes.

Add later, after the artifact contract is stable:

- Semantic source-audit artifact for claim-vs-evidence distortion.
- Real benchmark harness with with-skill and without-skill outputs.
- Native editable PPTX renderer using PptxGenJS or OOXML.
- Data contracts and chart validators.
- Code-snippet evidence validators.
- Optional LangGraph/deep-agent runner with persistence and human interrupts.

## What Not To Adopt Blindly

- Do not copy competitor "prompt to deck" positioning if source traceability is the differentiator.
- Do not claim Marp PPTX is natively editable.
- Do not turn every design-skill idea into a dependency. Use design skills as review lenses unless they become executable repo checks.
- Do not make all decks dark, animated, or image-heavy. Style must follow audience and setting.
- Do not treat a passing validator as proof that the deck is persuasive. It only means the deck cleared deterministic checks.
