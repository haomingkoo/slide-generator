# Reference Deck Pattern Research

This note records source-backed patterns for improving the slide-generator deck templates. It is maintainer-facing. The compact runtime version is `skills/slide-generator/references/deck-archetypes-and-hooks.md`.

## Verdict

The best reference decks are useful as pattern libraries, not assets to copy. The repeatable value is the genre logic: investor decks make the company understandable and investable, consulting decks help a decision happen, research talks make the gap and evidence legible, and hackathon decks help judges score the build quickly.

The repo should therefore generate deck-type-specific arcs, opening hooks, proof bars, and appendix strategies before it writes slide specs.

## Source Reliability

- High primary: official guidance from Sequoia, Y Combinator, Devpost, Major League Hacking, CHI, consulting firms, and standards bodies.
- High evidence: Harvard Catalyst assertion-evidence guidance, Penn State assertion-evidence material, IBCS visualization standards.
- Medium: public founder deck teardowns and public winning-project pages. Useful as pattern corpora, not as verified proof for every claim.
- Low or excluded: reconstructed famous decks, uncited deck galleries, and copied slide images.

## Sources Reviewed

Investor and startup pitching:

- Sequoia Capital, [Writing a Business Plan](https://www.sequoiacap.com/article/writing-a-business-plan/).
- Y Combinator, [How to Pitch Your Company](https://www.ycombinator.com/blog/how-to-pitch-your-company/).
- Y Combinator, [A Guide to Seed Fundraising](https://www.ycombinator.com/blog/how-to-raise-a-seed-round/).
- Y Combinator, [How to Design a Better Pitch Deck](https://www.ycombinator.com/blog/how-to-design-a-better-pitch-deck).
- a16z, [The Insider's Guide to Data Rooms](https://a16z.com/the-insiders-guide-to-data-rooms-what-to-know-before-you-raise/).
- Public founder examples such as LinkedIn, Buffer, Front, and Moz decks. These are useful for pattern study, but public copies must be verified case by case.

Hackathon and demo pitching:

- Devpost, [Judging and Public Voting](https://help.devpost.com/article/64-judging-public-voting).
- Major League Hacking, [Judging Plan](https://guide.mlh.io/general-information/judging-and-submissions/judging-plan).
- Public event criteria and winning project pages from Cal Hacks, HackMIT, TreeHacks, Cornell Claude Builders Club, Code Metal, Berkeley RDI, and Devpost project pages.

Consulting and executive communication:

- Barbara Minto, [The Pyramid Principle](https://www.barbaraminto.com/).
- McKinsey alumni material on Minto and MECE.
- Harvard Business Review, [How to Present to Senior Executives](https://hbr.org/2012/10/how-to-present-to-senior-execu).
- Bain, [Want great decisions? Fix your processes](https://www.bain.com/insights/want-great-decisions-fix-your-processes/).
- Duarte, [When presenting data, get to the point fast](https://www.duarte.com/blog/when-presenting-data-get-to-the-point-fast/).
- IBCS, [SUCCESS standards](https://www.ibcs.com/ibcs-/).
- Public McKinsey, BCG, Bain, Accenture, and Deloitte reports for exhibit patterns and appendix structure.

Research and technical talks:

- CHI 2025, [Presentation Instructions](https://chi2025.acm.org/chi25-presentation-instructions/).
- ICML presenter instructions, NeurIPS checklist, ICLR author guidance, and conference oral pages.
- Harvard Catalyst, [Visualize Science: Slides](https://catalyst.harvard.edu/writing-communication-center/visualize-science/slides/).
- Penn State / Michael Alley, [Assertion-Evidence presentations](https://www.assertion-evidence.com/).
- University and expert guidance from Simon Peyton Jones, Michael Ernst, Stanford, CMU, UCI, and Princeton.

Openings and public speaking:

- TED public-speaking playlist and Chris Anderson talk listing, [Before public speaking](https://www.ted.com/playlists/226/before_public_speaking).
- Harvard Catalyst slide-design guidance.
- YC demo-day guidance on obvious, simple, legible presentation design.

## Cross-Source Consensus

- Start with what the audience must understand, believe, decide, or do.
- Make the product, recommendation, research question, or project plain early.
- Use answer titles or assertion headlines; topic labels are weak.
- One slide should carry one job and one primary proof object.
- Proof beats claims: demo, data, code, source excerpt, chart, customer signal, or reproducible method.
- Time is a hard design constraint; extra material belongs in notes, backup, appendix, or nowhere.
- Appendix should answer likely questions, not collect leftovers.
- Visual quality requires rendered review; source-grounded copy can still become a poor slide.
- Reference decks are strongest when converted into named layout patterns and quality gates, not copied wholesale.

## Local Reference Pattern Study

User-provided Gamma/PDF/PPTX exports reviewed locally on 2026-06-12 confirm a practical rule for this repo: use references as layout grammar, then replace generic content with sourced proof.

Useful patterns to encode:

- Split cover: visual field plus short title field.
- Image-led problem: full-height image plus a three-step `pain / proof / consequence` rail.
- Hero metric plus evidence: one dominant number with denominator, period, method and source nearby.
- Metric constellation: 2x3 grid for traction, demand signals, budget checkpoints or validation proof.
- Ask panel: simple chart or model on one side, decision rows on the other.
- Alternating image rail: change image side across slides to create rhythm in light editorial decks.
- Equal-height cards: three balanced cards with fixed icon, heading and copy budgets.
- Obstacle matrix: one 2x3 block for risks or constraints instead of many drifting cards.
- Commitment rows: three large horizontal rows with icon gutters for action plans and owner commitments.
- Numbered challenge rows: fixed number gutter plus equal-height text rows for campaign problems, risks or approval tasks.
- Budget allocation ladder: categorical budget chart or table plus numbered spend rationale.
- KPI strip: four large metrics with unit, period, target source and measurement method.
- Rules with specimen cards: use for brand, operating standards, source rules or quality gates where examples matter.
- Framework chain plus side explanation: use when a process has 3 to 5 connected stages and a short explanatory rail.
- Capability or service portfolio columns: use for product/service offerings where columns need equal visual weight.
- Coaching/pro-tip callout: use for teaching decks, workshops and how-to decks when one note should stand apart from the main explanation.
- Design scope/goals/out-of-scope matrix: use for review decks where boundaries prevent misalignment.

Failure modes to avoid:

- Stock or abstract imagery acting as evidence.
- Huge title blocks pushing the actual proof off the slide.
- Paragraph-heavy cards that only look acceptable because the reference has designer spacing.
- Fake testimonials, fake traction, fake logos, or unverified market figures.
- Repeating the same split layout until the deck feels templated.
- Using line charts for categorical budget allocation.
- Inventing personas or campaign results to fill a pretty template.

## Mode Findings

### VC And Fundraising

Sequoia's default outline is company purpose, problem, solution, why now, market, competition or alternatives, business model, team, financials, and vision. YC's investor pitch questions emphasize what the company does, market, progress, unique insight, business model, team, and ask. YC's design guidance stresses legible, simple, obvious slides and only a few memorable ideas for demo-day settings.

Implementation implications:

- Intake must capture round/stage, live versus leave-behind, strongest proof, ask, and milestone.
- Templates should include company purpose, customer pain, product wedge, why now, market, traction, model, GTM, competition, team, and ask.
- Claim types should distinguish traction metric, projection, market estimate, customer signal, and founder assertion.
- QA should flag "no competitors", unlabeled projections, missing denominator, buried traction, and generic TAM.

### Consulting And Executive Decision

Minto/Pyramid-style communication, HBR executive guidance, and consulting reports converge on answer-first communication, grouped support, evidence exhibits, and appendix defense. Bain's decision-process article is especially relevant: decision decks fail when criteria, facts, alternatives, commitment, and closure are unclear.

Implementation implications:

- Story spine should support governing thought, decision ask, support branches, and SCQA.
- Chart specs should require source, unit, denominator, period, transform, caveat, and highlight.
- Templates need recommendation, issue tree, option comparison, roadmap, risk, and decision close.
- QA should flag topic titles, chart-title mismatch, no owner, MECE overlap/gaps, and dense tables in the main story.

### Campaign Strategy And Launch Proposals

Campaign and go-to-market decks need to connect audience insight to execution. A strong campaign strategy arc is: campaign promise, challenge signals, audience insight, message/channel wedge, launch timeline, budget allocation, target persona, success metrics and approval ask.

Implementation implications:

- Templates should include challenge rows, audience insight, milestone timeline, budget allocation, persona, KPI strip and decision ask.
- Budget slides should default to bar chart or table for categorical allocation. Use line charts only for spend over time or performance over time.
- KPI slides should require unit, period, method and source before rendering.
- Persona slides should state the evidence basis, such as interviews, survey, analytics, CRM, social listening or observed behavior.
- QA should flag unsupported uplift metrics, fake personas, generic urgency, vague "authenticity" claims and timelines without owner/output/success signal.

### Research And Conference Talks

Conference talks are short: CHI 2025 paper talks are 10 minutes plus 2 minutes Q&A. ICML oral slots are similarly constrained. Harvard Catalyst and assertion-evidence guidance emphasize strong headlines, visual evidence, minimized bullets, readability, and audience-centered technical explanation.

Implementation implications:

- Research templates should follow context, problem, gap, contribution, key idea, method, evaluation, result, limitation, takeaway.
- Results need dataset, metric, baseline, protocol, and caveat.
- Appendix slides should be question-indexed: stronger baseline, assumptions, hyperparameters, failure cases, reproducibility.
- QA should flag pasted paper tables, undefined notation, "SOTA" without scope, and results without evaluation setup.

### Hackathon And Demo Decks

MLH and Devpost make the rubric explicit: technical execution, design/usability, implementation, originality, impact/theme fit, and sometimes x-factor. MLH science-fair judging can be as short as 2 minutes presentation/demo plus 1 minute for questions and scoring. Winning project pages tend to show concrete artifacts: screenshots, hardware photos, repos, demo videos, setup notes, constraints, and failure modes.

Implementation implications:

- Intake must capture judging criteria, weights, format, demo time, Q&A time, submission requirements, proof assets, fallback, and what was built during the event.
- Templates should prioritize what it is, demo path, working proof, hard part, rubric alignment, limits, and next step.
- QA should block no-demo-fallback, feature-tour decks, hidden AI/prior work disclosure, and startup-market slides unless the rubric asks for commercialization.

## Opening Hook Library

Use hooks as argument choices, not decoration:

- Plain thesis: fastest way to orient investors, judges, and executives.
- Concrete user: best for demos, products, teaching, and pain-driven pitches.
- Sharp question: best for research and technical reviews.
- Surprising result: use only when the result is sourced and scoped.
- Before/after: strong when the deck proves workflow change.
- Decision now: strong for executive decks.
- Rubric match: strong for hackathon finalist decks.
- Gap statement: strong for research talks.
- Short story: useful only if the story directly creates stakes.
- Light humor: optional, risky, and never a substitute for clarity.

## Gaps In The Repo Before This Research

- The repo had good mode-specific quality standards but no single runtime reference for hook selection and genre arcs.
- Templates were useful starters but mostly five-slide mini-decks, so they were too thin for real conference, demo-day, finalist, and consulting arcs.
- Timing rules used one slide per minute as a rough default, but short demo-day and hackathon formats need mode-specific slide budgets.
- The system could score structure and QA, but it still needed stronger pre-slide decisions: which deck archetype, which hook, which proof spine, which backup questions.

## Non-Goals

- Do not copy famous decks, branded consulting layouts, or proprietary templates.
- Do not treat public deck galleries as authoritative without verification.
- Do not claim that the presence of a template proves slide quality.
- Do not turn every source into a runtime rule. Keep detailed research here and concise operational rules in the skill.
- Do not commit private downloaded deck exports, account HTML, or source assets unless the user explicitly asks and licensing/privacy has been checked.
