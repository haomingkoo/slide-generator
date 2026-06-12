# Research Coverage

Use this when the available sources are thin, stale, conflicted, too internal, or not strong enough for the deck's accuracy bar.

The goal is not to browse by default. The goal is to know whether the deck has enough evidence to make the claims it wants to make.

## Research Decision

Before writing final claims, classify the evidence:

- `sufficient`: the provided sources support the deck goal and key claims.
- `thin`: the sources support a draft, but key claims need caveats or user confirmation.
- `missing`: the deck cannot make its main point without more sources.
- `stale`: the deck depends on current facts, prices, regulations, model performance, company/product status, or recent events.
- `conflicted`: sources disagree, or user claims conflict with external evidence.

Record this in `work/source-map.md` or `work/intake-brief.md`.

## When To Search

Search or request sources when:

- the user asks for latest, current, market, competitor, pricing, legal, financial, medical, benchmark, model, or product claims,
- the claim affects investor/client/executive trust,
- the deck compares alternatives,
- the deck includes market size, adoption, performance, security, regulation, or public-company facts,
- the user supplied only rough notes but wants a polished, high-confidence deck,
- the audience will ask "how do you know?"

For hackathon, demo-day, builder competition or sponsor-track decks, search or request sources for:

- official event page, judging rubric, prize tracks, schedule and submission requirements,
- host and sponsor goals, docs, APIs, SDKs and recent announcements,
- named judges, mentors or organizers and their public work,
- judges' repos, papers, talks, product pages, technical writing and stated interests,
- past winners, showcase pages, Devpost pages, demo videos and public repos,
- disclosure rules for AI assistance, generated assets, datasets and prior work.

If research is disabled, do not browse. Instead:

- mark claims as `user_file`, `assumption`, or `inference`,
- lower confidence where needed,
- move unsupported material to open questions,
- ask the user for authoritative sources when missing evidence blocks the deck.

## Source Quality

Prefer:

- primary sources: papers, official docs, filings, source code, product docs, public datasets, user-provided data,
- reputable secondary sources when primary sources are unavailable,
- dated sources for time-sensitive claims,
- direct evidence over summary articles,
- raw data over screenshots of data.

Avoid relying on:

- affiliate comparisons,
- uncited blog claims,
- generated summaries with no source trail,
- competitor marketing copy as neutral evidence,
- anecdotes as general proof.

Marketing pages may be useful for product positioning, but label them as product claims unless independently verified.

## Research Output

When research is used, update `work/source-map.md`:

```md
## Research Coverage

source_policy: source_first
coverage_status: thin
research_questions:
- What evidence supports the market-size claim?
- Which current competitors should be included?

sources_reviewed:
- title:
  url:
  date_accessed:
  relevance:
  claims_supported:
  caveats:

open_evidence_gaps:
- gap:
  consequence_for_deck:
  recommended_action:
```

Then create or update `work/claim-ledger.json`. Every externally sourced claim uses `type: "external_source"` and includes URL, title, access date when relevant, evidence excerpt or precise paraphrase, confidence, and allowed slide use.

## Source To Benefit

For communication-heavy decks, do not stop at facts. Translate evidence into audience benefit:

- What does this help the audience do?
- What pain does it reduce?
- What decision does it clarify?
- What result becomes more believable?
- What should they remember after the talk?

The benefit can be the slide title only if it is evidence-backed. Otherwise use softer phrasing such as "could", "is designed to", "early evidence suggests", or "the next experiment tests".

## Technical Depth

For technical decks, proof must be both understandable and inspectable:

- show the mechanism, not every implementation detail,
- include architecture maps for system claims,
- include code snippets only when they prove behavior,
- include benchmark setup, baseline, metric, dataset, and caveat for performance claims,
- link technical evidence back to the audience benefit.

Avoid technical theater: diagrams, code, and metrics must explain or prove something the audience cares about.

## Insufficient Evidence Rules

If evidence is insufficient:

- do not invent a source,
- do not hide the gap in speaker notes,
- do not make the title stronger than the evidence,
- downgrade or remove the claim,
- move the question to Q&A or backup only if the caveat is visible,
- ask for sources when the gap blocks the deck goal.

For high-stakes decks, unresolved high-priority evidence gaps block `ready_to_present`.

For hackathon decks, unresolved judging criteria, missing submission requirements, unknown demo format or unknown sponsor-track constraints block `ready_to_present` unless the deck clearly labels them as assumptions and the presenter accepts that risk.
