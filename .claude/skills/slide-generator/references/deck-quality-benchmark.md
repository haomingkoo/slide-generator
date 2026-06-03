# Deck Quality Benchmark

Use this when choosing the deck mode, slide archetypes, proof bar, pruning strategy, and review questions. Do not treat all decks as generic pitch decks.

## Universal Quality Bar

Every serious deck should define:

- `presentation_mode`: fundraising, hackathon demo, executive decision, technical proof, teaching, sales, training, or update.
- `target_next_action`: meeting, decision, funding ask, prize track, approval, learning outcome, pilot, install, review, or follow-up.
- `talk_length_minutes`, `target_main_slides`, `qna_minutes`, and backup policy.
- primary audience, decision power, likely questions, objections, and jargon risk.
- source mode: `source_only`, `research_allowed`, or `mixed_with_citations`.
- proof assets: demo, screenshots, code, benchmark, data table, customer signal, quote, diagram, or source excerpt.
- audience benefit: the practical improvement, decision, belief, or capability the audience should understand.
- design direction and output format.

Pass conditions:

- The audience understands what the deck is about by slide 1 or 2.
- The audience understands the benefit, not only the mechanism.
- The title-only story makes sense.
- Each slide has one job, one dominant visual, and one proof point or explanation.
- Factual claims map to claim IDs.
- Visuals prove or teach; they are not decoration.
- Main deck is pruned to the time budget.
- Backup slides answer likely questions instead of dumping leftovers.
- Speaker notes are natural but do not introduce new claims.
- Browser QA and export QA pass before handoff.

## Benefit-First Communication

Aim for the clarity and memorability of a strong public talk without sacrificing technical integrity.

Rules:

- Open with a concrete benefit, not a broad trend.
- Use a specific example before abstract explanation.
- Make the audience care before showing implementation detail.
- Use technical depth to earn trust, not to show everything that was built.
- Repeat the core benefit in different forms: title, visual, demo, and close.
- Speaker notes should sound natural enough to present aloud.

For technical audiences, benefit and depth are not opposites. The best flow is:

1. What changes for the user or decision maker.
2. What mechanism makes that change possible.
3. What evidence proves it works or what experiment will test it.
4. What caveat or risk remains.

## Intake Questions

Ask these once when missing:

- Who is the audience, and what should they decide, believe, learn, or do?
- What is the presentation mode?
- How long is the talk, and how much Q&A/demo time is reserved?
- How many main slides should the deck target?
- Should extra material go into backup or appendix?
- What sources are authoritative, and is web research allowed?
- What evidence is strongest: metrics, demo, code, customer signal, benchmark, or expert source?
- What style should it follow: brand, reference deck, theme, or generated options?
- What questions or objections must the presenter be ready for?

If the user does not know, propose 2 or 3 options and record the chosen defaults in `work/intake-brief.md`.

## VC / Fundraising Deck

Primary job: earn the next investor conversation or support a fundraising meeting.

Default main-deck archetypes:

1. Company purpose / one-line thesis.
2. Problem and buyer pain.
3. Customer, ICP, or beachhead.
4. Solution or product wedge.
5. Why now.
6. Market size and market structure.
7. Product or how it works.
8. Traction, signal, or proof.
9. Business model.
10. Go-to-market.
11. Competition, alternatives, and moat.
12. Team and founder-market fit.
13. Ask and use of funds.

Adjust by stage:

- Pre-seed can lean on team, insight, problem, prototype, and readiness.
- Seed needs product, market, early traction, and business model.
- Series A needs repeatability, retention, GTM evidence, and credible unit economics.

Investor red flags:

- "Platform" or category language before concrete product behavior.
- Generic problem with no buyer.
- Top-down TAM without ICP, pricing, or bottom-up logic.
- Vanity metrics without dates, denominators, cohorts, or retention.
- "No competitors"; include status quo and substitutes.
- Traction buried late when it is the strongest proof.
- Ask missing or not tied to milestones.

## Hackathon / Demo Deck

Primary job: score well against the judging rubric and make judges believe the build is real.

Start by recording:

- judging criteria and weights,
- judging format: science-fair table, finalist stage, recorded video, or investor-style pitch,
- talk, demo, and Q&A time,
- required submission assets,
- track-specific constraints,
- proof assets available,
- demo fallback.

Default main-deck archetypes:

1. What it is: project name and one plain sentence.
2. User pain or theme alignment.
3. Before/after workflow.
4. Demo path: exact thing judges will see.
5. Working proof: screenshot, live state, repo, benchmark, or video still.
6. Technical depth: architecture slice, code, model/eval method, or integration map.
7. Rubric alignment: usefulness, originality, implementation, impact, design, x-factor, or track criteria.
8. Next step or ask: prize track, repo, live URL, pilot, install, or roadmap.

Timing:

- 90 seconds: 3 to 5 slides, no appendix unless requested.
- 2 to 3 minutes: 5 to 8 slides, one demo path, short Q&A backup.
- 5 to 7 minutes: 8 to 12 slides, demo plus technical proof and backup.

Hackathon red flags:

- Product explanation starts too late.
- Deck becomes a feature tour instead of one repeatable demo path.
- No demo fallback.
- Technical depth is hand-waved.
- Pitch sounds like a fundraising deck when judges score implementation.
- AI assistance, data limits, or generated assets are hidden when they matter.

## Idea And Argument Critique

Do not polish a weak idea without saying what is weak.

Before high-fidelity rendering, critique:

- idea clarity: can the audience explain what it is?
- audience benefit: who benefits and what improves?
- evidence: what proves the benefit?
- differentiation: why this is not a generic wrapper, copy, or commodity workflow?
- feasibility: what is actually built versus planned?
- technical depth: what hard part was solved?
- risk: what can fail, mislead, or block adoption?
- rubric fit: does it match the judging, investor, client, or executive criteria?
- next action: what should the audience do after the deck?

If a gap is material, record it in `work/audience-model.json`, `work/content-priority.md`, or `work/review-log.json`, and decide whether to:

- answer it in the main story,
- move it to Q&A backup,
- ask the user for evidence,
- narrow the claim,
- or change the deck goal.

The deck should make the idea stronger, not hide weak thinking behind better visuals.

## Executive / Consulting Decision Deck

Primary job: help a specific audience decide, align, or act.

Default main-deck archetypes:

1. Executive summary with recommendation, rationale, and decision ask.
2. SCQA or situation-complication-resolution opener.
3. Pyramid overview: governing thought and key support lines.
4. Issue tree or logic tree.
5. Key finding slides with action titles and one chart.
6. Option comparison against decision criteria.
7. Recommendation and tradeoffs.
8. Roadmap with owner, timing, and dependencies.
9. Risks, mitigations, and watchpoints.
10. Decision close and next review.

Rules:

- Lead with the answer.
- Use action titles, not topic labels.
- Keep section logic MECE.
- Every chart needs source, unit, denominator, transform, highlight, annotation, and caveat when relevant.
- Main deck persuades or decides; appendix defends.

Executive red flags:

- Big reveal after many slides.
- "Market Overview" titles with no implication.
- Chart does not prove the title.
- Dense table in the main story when one number matters.
- MECE overlap, missing branch, or mixed levels.
- No clear decision ask, owner, or timing.

## Technical / Research Proof Deck

Primary job: explain a system, experiment, model, or result accurately enough for technical review.

Default main-deck archetypes:

1. Question or claim under test.
2. Baseline and current limitation.
3. Method or architecture.
4. Data or evaluation setup.
5. Result with metric and uncertainty.
6. Error cases or limitations.
7. Implication and next experiment.
8. Backup: methodology, code, data details, alternate cuts.

Technical red flags:

- Benchmark without dataset, baseline, metric, or method.
- Diagram node without code/source evidence.
- Code snippet shown without why it matters.
- Result stated more broadly than the experiment supports.
- Technical detail does not connect back to the audience benefit.

## Teaching / Explainer Deck

Primary job: move the learner from confusion to a usable mental model.

Default main-deck archetypes:

1. Learning goal.
2. Concrete problem or motivating example.
3. Prior mental model.
4. New concept.
5. Mechanism or sequence.
6. Worked example.
7. Common misconception.
8. Check for understanding.
9. Recap and next step.

Teaching red flags:

- Starts with taxonomy before motivation.
- Too many terms before an example.
- Visuals decorate rather than explaining cause, sequence, or contrast.

## Pruning Rule

When source material exceeds the time budget:

- Keep content that changes the target next action.
- Keep the strongest evidence for the core story.
- Move likely Q&A answers into backup.
- Move raw tables, methodology, edge cases, and caveats into appendix.
- Drop unsupported, repetitive, or off-story material.

Do not shrink text to keep more material. Cut, move, or split.

## Review Questions

Before final export, ask:

- Can the audience retell the deck in one sentence?
- What is the most likely objection, and where is it answered?
- Which slide has the weakest evidence?
- Which slide is trying to do two jobs?
- Which term will cause jargon friction?
- Which slide would fail if the presenter were silent?
- Which backup slide answers the question the audience is most likely to ask?

Repair the artifact that failed: audience model, story spine, content priority, claim ledger, visual-aid plan, design contract, or slide specs.
