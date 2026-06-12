# Hackathon Intelligence And Build Planning

Use this when the deck is for a hackathon, demo day, builder competition, grant challenge, AI challenge, sponsor track, or judged project showcase.

The goal is not only to make slides. The goal is to help the team choose, build, prove and present a project that fits the judges, hosts, rubric and available build time.

## Operating Rule

Before slide specs, create or update:

- `work/hackathon-intelligence.md`
- `work/build-plan.md`
- `work/demo-plan.md` when a live or recorded demo is part of judging

For fast drafts these can be concise. For serious competitions they should block rendering until the key unknowns are resolved or explicitly marked as assumptions.

## Research Scope

If web research is allowed, search current sources for:

- official event page, rules, judging rubric, prize tracks, schedule and submission requirements,
- host organization goals, recent announcements, docs, repos and example projects,
- sponsor/prize-track goals, APIs, SDKs, docs, constraints and judging notes,
- named judges, mentors and organizers,
- judges' public profiles, technical writing, repos, papers, talks, products and stated interests,
- past winners, showcase videos, Devpost pages, GitHub repos and judging patterns,
- required disclosure rules for AI assistance, datasets, generated assets and prior work.

If web research is not allowed, record the missing research under `open_questions` and avoid claims about judge preference.

## Judge And Host Lens

For each judge, host or sponsor that matters, record:

```md
### Person / Organization

- role:
- source links reviewed:
- likely lens: technical depth, product usefulness, design, research novelty, business impact, social impact, sponsor API adoption, security, reliability, craft, storytelling
- public signals: repos, papers, talks, blog posts, products, judging criteria, previous winners
- what they may reward:
- what they may penalize:
- slide/demo implication:
```

Use cautious language. Public background is a signal, not mind reading.

## Hackathon Intelligence Artifact

Use this structure:

```md
# Hackathon Intelligence

event:
date:
format:
talk_time:
demo_time:
qna_time:
submission_assets:

## Judging Rubric

| Criterion | Weight / priority | What counts as proof | Deck implication |
|---|---:|---|---|

## Tracks And Sponsor Goals

| Track | Sponsor / host goal | Required tech | Hidden risk | Proof needed |
|---|---|---|---|---|

## Judge / Host Lens

| Judge or host | Public signal | Likely lens | What to show | What to avoid |
|---|---|---|---|---|

## Past Winners / Comparable Projects

| Project | What won | Evidence artifact | Lesson |
|---|---|---|---|

## Positioning Decision

- project wedge:
- strongest judge-fit angle:
- strongest technical proof:
- strongest user proof:
- risky claim to avoid:
- demo moment judges should remember:
```

## Build Plan Artifact

Use this structure:

```md
# Build Plan

## Project Wedge

One sentence describing the smallest impressive thing to build.

## Must Ship

| Feature | User proof | Technical proof | Owner | Deadline | Demo status |
|---|---|---|---|---|---|

## Nice To Have

| Feature | Why it may help | Drop rule |
|---|---|---|

## Technical Spine

- data/input:
- model/API/library:
- state or memory:
- tool calls/integrations:
- evaluation/scoring:
- human review/safety:
- persistence:
- deployment:

## Demo Path

1. Starting state:
2. User action:
3. System behavior:
4. Visible proof:
5. Recovery path if live demo fails:

## Build Risks

| Risk | Trigger | Mitigation | Slide or demo caveat |
|---|---|---|---|
```

## Demo Plan Artifact

Use this structure:

```md
# Demo Plan

- demo promise:
- live URL or local run command:
- backup video / screenshots:
- exact script:
- seed data:
- failure fallback:
- timing:
- judge question the demo answers:
```

## Brainstorming Rule

Brainstorm many ideas, but score them before committing:

| Idea | Judge fit | Build feasibility | Demo clarity | Technical depth | Novelty | Risk | Verdict |
|---|---:|---:|---:|---:|---:|---:|---|

Favor ideas with:

- a demo that can be understood in 20 seconds,
- one hard technical part that can be proven,
- a user or workflow judges can recognize,
- a clear fit to rubric or sponsor goals,
- a fallback if live services fail.

Reject or narrow ideas that depend on:

- vague "AI assistant" behavior,
- too many integrations,
- unsourced market claims,
- demo data that cannot be shown,
- judge preference guesses without public evidence.

## Slide Implications

The deck should show:

- what it is in one sentence,
- which rubric or sponsor goal it fits,
- the before/after demo path,
- the built artifact, not only the idea,
- technical proof: repo, architecture, state, scoring, eval, logs or code,
- limits and fallback,
- why this team can finish or maintain it.

Do not let judge research turn into flattery. It should change the build, demo, proof and Q&A strategy.
