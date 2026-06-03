# Source Grounding

## Claim Ledger

Every factual slide claim must reference a `claim_id`.

Required fields:

- `claim_id`
- `claim`
- `type`: `user_file`, `codebase`, `external_source`, `inference`, or `assumption`
- `source`
- `evidence`
- `confidence`: `high`, `medium`, or `low`
- `allowed_slide_use`

## Slide Spec Claim Use

```json
{
  "slide_id": "slide_04",
  "title": "DPO skips the critic without losing the preference signal",
  "claim_ids": ["claim_012", "claim_013"],
  "claim_use": "method comparison",
  "unsupported_claims": []
}
```

Claim-bearing slides must include `claim_use` or per-claim `claim_uses`. The declared use must appear in each claim's `allowed_slide_use`.

Claim-free slides are allowed for agendas, section dividers, covers, or purely navigational slides, but they must include:

```json
{
  "claim_ids": [],
  "no_claims_reason": "section divider with no factual content",
  "unsupported_claims": []
}
```

## Audit Pass

For each slide:

1. Extract factual statements from title, body, labels, notes, charts, and diagrams.
2. Treat a statement as factual when it includes any number, comparison, capability claim, causal claim, named-entity behavior, benchmark, quote, superlative, architecture edge, code behavior, or product/customer/event claim. Titles, labels, chart annotations, and speaker notes count. When unsure, treat the statement as factual.
3. Match each statement to a claim ID.
4. Compare the claim against its evidence, not only against the ledger text. Fail if the slide says more than, or something different from, the evidence.
5. Check that the slide wording is no stronger than the claim type. `inference` and `assumption` claims cannot appear as unqualified declarative titles.
6. Check source caveats are visible when needed.
7. Run `node scripts/validate-claim-ledger.mjs <project-dir>` and `node scripts/lint-claim-refs.mjs <project-dir>` before final export.
8. Fail if unsupported claims remain.

## Distortion Failure Modes

Fail source audit when:

- a paraphrase changes the meaning of the evidence,
- a chart changes units, denominators, or aggregation without saying so,
- two sources conflict and the slide presents one side as settled,
- a temporal claim such as "latest" or "current" is not dated,
- a speaker note adds a factual claim that is not on the slide or in the ledger.
