# Deck Quality Rubric

Use this rubric during critique and QA.

## Quality Loop Artifacts

The skill can work toward an explicit quality target, but the score is not a substitute for hard guardrails or human judgment.

- `work/quality-rubric.json`: deck mode, score thresholds, hard gates, weighted dimensions, and role prompts.
- `qa/slide-scorecard.json`: researcher, story, designer, and critic reviews plus dimension and slide scores.
- `qa/repair-plan.json`: targeted repairs required to cross the threshold or resolve blockers.
- `qa/score-history.json`: optional score trend across iterations.

Run:

```bash
npm run deck:score -- <project>
npm run deck:iterate -- <project> -- --threshold 88
```

`deck:iterate` is deterministic. Claude/Codex still performs the critique and repair by updating artifacts, then reruns the gate.

`deck:score` exits non-zero for invalid artifacts or failed hard gates. A below-target numeric score is advisory, because the score is an agent-authored review signal. `--threshold` and `--min-slide-score` may only raise the rubric target.

## Hard Gates Versus Scores

Hard gates are pass/fail and cannot be averaged away:

- source grounding,
- architecture evidence when diagrams use code,
- browser QA,
- export QA when requested,
- unresolved high-severity review issues.

Scores steer quality repair:

- audience fit,
- story flow,
- evidence strength,
- visual explanation,
- design polish,
- delivery readiness,
- Q&A readiness.

## Story

- Deck mode is explicit: fundraising, hackathon demo, executive decision, technical proof, teaching, sales, training, or update.
- Target next action is explicit.
- Audience benefit is explicit and memorable.
- Slide titles tell a coherent story when read alone.
- Each slide has one job.
- The slide job is explicit in `slide_job`, separate from visual layout.
- Adjacent slides do not repeat the same point.
- The deck has a visible arc: hook, problem, insight, proof, implication, action.
- The ending tells the audience what to remember or do.

## Accuracy

- Every factual claim maps to a claim ID.
- Evidence coverage is classified as sufficient, thin, missing, stale, or conflicted.
- Every chart maps to source data.
- Every architecture diagram maps to code or source evidence.
- Inferences and assumptions are labeled.
- Caveats appear where the evidence requires them.

## Visual Explanation

- The main visual proves the slide title.
- Technical visuals connect back to the audience benefit.
- Hard ideas use a visual aid, not a paragraph.
- Before/after and was/is comparisons are explicit when change is the point.
- Architecture slides split context, runtime flow, error paths, and trust boundaries.
- Code snippets are short and explain why the code matters.

## Design

- Theme matches audience and setting. Dark mode is not a default.
- The design contract uses a stable token scale for type, spacing, color, and layout decisions.
- Layout uses a visible grid.
- Labels are readable on a laptop and projector.
- Color has semantic meaning.
- Whitespace is used to create confidence, not emptiness.
- The deck avoids generic SaaS cards, decorative blobs, and fake stock polish.

## Speaker Support

- Speaker notes sound natural when read aloud.
- Notes include transitions and cues, not only paragraphs.
- Likely questions, objections, and jargon risks are represented in the audience model.
- Backup slides answer named Q&A questions instead of storing leftover material.
- Notes do not introduce unsupported claims.
- The deck can be delivered within the target time.

## Mode Fit

- Investor decks explain the company plainly, show stage-appropriate proof, include competition/status quo, and end with a specific ask.
- Hackathon decks show what was built, map to judging criteria, include a demo path, and define a fallback.
- Executive decks lead with the recommendation, use action titles, compare options against decision criteria, and end with owner/timing.
- Technical decks show method, baseline, result, limitation, and evidence paths.
- Teaching decks introduce examples before abstraction and check likely misconceptions.

## QA Gates

- Text audit passes.
- Source audit passes.
- Deterministic claim checks pass: `validate-claim-ledger.mjs` and `lint-claim-refs.mjs`.
- Architecture evidence check passes when an architecture map exists: `validate-arch-map.mjs`.
- Audience model check passes when live delivery or persuasion matters: `validate-audience-model.mjs`.
- Story spine check passes: `validate-story-spine.mjs`.
- Slide spec check passes: `validate-slide-specs.mjs`.
- Design contract check passes: `validate-design-contract.mjs`.
- Render inspection passes: `inspect-rendered-marp.mjs`.
- Browser QA passes: `browser-qa-marp.mjs`.
- Basic export check passes for the requested output format.

Browser QA should include machine-checkable basics where possible:

- no text overflow (`scrollWidth <= clientWidth` and `scrollHeight <= clientHeight` for checked containers),
- body text contrast is at least 4.5:1 and large text/icon contrast is at least 3:1,
- minimum readable body font is 18px for projected slides unless the slide is explicitly appendix/detail,
- dense lines stay near 45 characters or fewer when meant to be read live.
- requested step-reveal motion produces fragments,
- requested interactive or animated aids have a static fallback and browser validation.
