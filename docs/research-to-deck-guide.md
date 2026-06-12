# Research To Deck Guide

This repo should help an agent make a professional deck, not a pretty pile of generated slides. The working rule is simple: plan the argument, ground the claims, then render.

Use this path for client-facing, public, investment, business proposal, research, teaching, or demo decks.

## 1. Start With The Decision

Write `work/deck-plan.md` before slide specs.

Minimum contract:

- who will read or hear the deck,
- what they need to decide, understand, believe, or do,
- how long the presentation is,
- what proof they will trust,
- what tone and theme are appropriate,
- what the strongest objection is.

Do not open with background unless background is the decision. A strong deck starts with the answer, the user, the stakes, or the question.

## 2. Research Before Writing Slides

Research is not a dumping step. It produces artifacts:

- `work/source-map.md`: every source used and what it contributes.
- `work/claim-ledger.json`: each factual claim, source, evidence, confidence and allowed slide use.
- `work/content-priority.md`: what belongs in the main story, appendix, backup, or nowhere.

For current facts, prices, regulations, schedules or product features, verify against current sources. For legal, medical, financial or operational risk, prefer official sources and label what is still site-specific or expert-dependent.

The deck may include inference, but it must be marked as inference and tied to its inputs.

## 3. Turn Research Into A Story

Use the slide sorter before rendering.

Good slide titles should read like a short argument:

1. Validate first. Lease later.
2. Start as rehearsal plus lessons.
3. Competitor prices set the bands.
4. Permission before viewing.
5. Startup cash changes the launch path.
6. Decide after the 90-day proof sprint.

Bad titles are labels that could sit on any deck:

- Market overview
- Business model
- Legal
- Next steps

Every main slide needs one job, one audience question, one proof object and one reason it belongs in the live story.

## 4. Make The Slide Visual Do Work

Use visual aids when they reduce thinking load:

- comparison table for options or competitors,
- decision gate for go/no-go logic,
- timeline or Gantt chart for execution,
- cost bars for budget ranges,
- matrix for risk and launch stance,
- annotated screenshot or artifact for demos.

Avoid decoration pretending to be evidence. A card grid is acceptable only when the cards compare meaningfully and align cleanly.

## 5. Choose Theme Deliberately

Borrow the useful product lessons from Gamma and Canva without copying their output: outline before render, offer theme directions when taste is unclear, use imagery and visual variety where it helps, and keep global style separate from slide-local repairs.

Theme rules:

- Use clean light themes for consulting, source-heavy, school, proposal and boardroom decks.
- Use warmer light themes for community, culture, education and founder stories.
- Use dark runtime themes only when the content or setting needs it.
- If taste is unclear, render 2 or 3 title-slide previews before committing.

The selected theme belongs in `work/design-contract.json`, not only in the final HTML.

## 6. Render, Inspect, Repair

A rendered deck is not done.

Run deterministic checks:

```bash
npm run workflow:status -- <project>
npm run validate:ledger -- <project>
npm run validate:slides -- <project>
npm run validate:design -- <project>
```

For Marp projects:

```bash
npm run deck:build -- <project> --render
npm run qa:browser -- <project>
```

For custom HTML decks, run the project validators plus Playwright screenshots and bounds checks. Inspect the slides that carry the pitch: opening, recommendation, market proof, risk, numbers, execution plan and close.

Repair from screenshots. Common repairs:

- reduce words before shrinking type,
- align peer cards to the same grid,
- move sources and controls out of the content zone,
- turn long steps into actor, action, artifact and success signal,
- move dense tables to appendix if they do not carry the live story.

## 7. Humanize Last

Humanize after source audit, not before. The final copy should sound direct and specific:

- "Interview 30 likely users" beats "conduct market validation."
- "Ask before viewing" beats "perform property due diligence."
- "Treatment is not isolation" beats "acoustic considerations."

Humanizing must not add claims. If a sentence becomes stronger, check that the claim ledger still supports it.

## 8. Ship With Evidence

Before publishing, the repo should contain:

- input brief and sources,
- planning artifact,
- source map,
- claim ledger,
- story spine,
- slide sorter,
- design contract,
- slide specs or custom deck source,
- QA report,
- final rendered deck.

The Chleo community band room example is the reference for this workflow. It shows a source-backed business proposal, competitor price table, legality caveats, room-size guidance, startup ranges, execution plan, critique notes, presenter controls, mobile scaling and publishable static HTML.
